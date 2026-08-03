/**
 * CareCircle telemetry collector — Vercel serverless function.
 *
 * POST /api/t
 * Accepts JSON telemetry beacons, enriches with server-side data
 * (true IP, Vercel geo headers, User-Agent), and sends alert emails
 * via Resend for gate_success and session_end events.
 *
 * Always responds 204 regardless of outcome.
 * CORS restricted to https://beverly-index.com.
 */

const RESEND_URL = 'https://api.resend.com/emails';

// In-memory per-invocation abuse guard (per-IP soft rate limit)
const hitCounts = {};
const MAX_HITS_PER_IP = 60;

// In-memory per-invocation gate_fail burst dedup
const failNotified = {};

// Event constant → human label for session summary
const EVENT_LABELS = {
  gate_success: 'Gate entry',
  gate_fail: 'Gate fail',
  app_open: 'App opened',
  tab_meds: 'Medications',
  tab_schedule: 'Schedule',
  tab_log: 'Care Log',
  tab_emergency: 'Emergency Card',
  more_open: 'More sheet',
  manage_open: 'Manage',
  ti_run: 'Treatment Intelligence',
  search_used: 'Search',
  patient_added: 'Patient added',
  contact_added: 'Contact added',
  photo_added: 'Photo added',
  photo_shared: 'Photo shared',
  report_sent: 'Report sent',
  alerts_enabled: 'Alerts enabled',
  heartbeat: 'Heartbeat',
  session_end: 'Session end',
};

module.exports = async function handler(req, res) {
  // CORS
  const origin = req.headers['origin'] || '';
  if (origin === 'https://beverly-index.com') {
    res.setHeader('Access-Control-Allow-Origin', 'https://beverly-index.com');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-cc-t');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(204).end();

  // Token guard
  const token = process.env.TELEMETRY_TOKEN;
  if (token && req.headers['x-cc-t'] !== token) return res.status(204).end();

  // Per-IP soft rate limit
  const clientIp = getClientIp(req);
  hitCounts[clientIp] = (hitCounts[clientIp] || 0) + 1;
  if (hitCounts[clientIp] > MAX_HITS_PER_IP) return res.status(204).end();

  try {
    const body = req.body;
    if (!body || !body.ev) return res.status(204).end();

    const ev = body.ev;
    const code = body.code || 'unknown';
    const geo = extractGeo(req);
    const ua = req.headers['user-agent'] || 'unknown';
    const now = new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');

    if (ev === 'gate_success') {
      await sendEntryAlert(code, clientIp, geo, ua, body.n || {}, now);
    } else if (ev === 'gate_fail') {
      await sendFailNotice(clientIp, geo, ua, now);
    } else if (ev === 'session_end' && body.sum) {
      await sendSessionSummary(code, clientIp, geo, ua, body.sum, body.n || {}, now);
    }
    // heartbeat and others: 204, no email
  } catch (e) {
    // Silent swallow
  }

  return res.status(204).end();
};

function getClientIp(req) {
  // Vercel provides x-forwarded-for; rightmost is proxy-appended
  const xff = req.headers['x-forwarded-for'];
  if (xff) {
    const parts = xff.split(',').map(s => s.trim());
    // For Vercel: leftmost is usually client IP (single proxy)
    return parts[0] || req.socket?.remoteAddress || 'unknown';
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

function extractGeo(req) {
  return {
    city: req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : '',
    region: req.headers['x-vercel-ip-country-region'] || '',
    country: req.headers['x-vercel-ip-country'] || '',
  };
}

function fmtGeo(geo) {
  const parts = [geo.city, geo.region, geo.country].filter(Boolean);
  return parts.join(', ') || 'unknown';
}

function fmtDuration(ms) {
  if (!ms || ms < 0) return '0s';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

// ── Entry alert ─────────────────────────────────────────────────────────

async function sendEntryAlert(code, ip, geo, ua, nav, timestamp) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const subject = `[CARECIRCLE] ENTRY \u2014 ${code}`;

  const textBody =
    `CARECIRCLE ENTRY\n` +
    `${'='.repeat(40)}\n\n` +
    `Code:          ${code}\n` +
    `Timestamp:     ${timestamp}\n` +
    `IP Address:    ${ip}\n` +
    `Location:      ${fmtGeo(geo)}\n` +
    `User Agent:    ${ua}\n` +
    `Screen:        ${nav.screen || 'unknown'}\n` +
    `Timezone:      ${nav.tz || 'unknown'}\n` +
    `Build:         ${nav.build || 'unknown'}\n\n` +
    `\u2014 Beverly Index LLC Automated Alert\n`;

  const htmlBody = emailHtml('CARECIRCLE ENTRY', '#4AE8C4', code, timestamp, [
    ['Code', code, '#4AE8C4'],
    ['Timestamp', timestamp],
    ['IP Address', ip],
    ['Location', fmtGeo(geo)],
    ['User Agent', ua, null, true],
    ['Screen', nav.screen || 'unknown'],
    ['Timezone', nav.tz || 'unknown'],
    ['Build', nav.build || 'unknown'],
  ]);

  await sendEmail(apiKey, subject, textBody, htmlBody);
}

// ── Fail notice ─────────────────────────────────────────────────────────

async function sendFailNotice(ip, geo, ua, timestamp) {
  // At most one per invocation burst per IP
  if (failNotified[ip]) return;
  failNotified[ip] = true;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const subject = '[CARECIRCLE] FAILED ATTEMPTS';
  const textBody =
    `CARECIRCLE FAILED GATE ATTEMPTS\n` +
    `${'='.repeat(40)}\n\n` +
    `Timestamp:     ${timestamp}\n` +
    `IP Address:    ${ip}\n` +
    `Location:      ${fmtGeo(geo)}\n` +
    `User Agent:    ${ua}\n\n` +
    `One or more failed access code attempts detected.\n\n` +
    `\u2014 Beverly Index LLC Automated Alert\n`;

  await sendEmail(apiKey, subject, textBody);
}

// ── Session summary ─────────────────────────────────────────────────────

async function sendSessionSummary(code, ip, geo, ua, sum, nav, timestamp) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const startTs = sum.start_ts ? new Date(sum.start_ts).toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC') : 'unknown';
  const events = sum.events || {};
  const timeline = sum.timeline || [];

  // Duration from start_ts to last timeline event (or now)
  let durationMs = 0;
  if (sum.start_ts) {
    const lastTs = timeline.length > 0 ? timeline[timeline.length - 1][0] : Date.now();
    durationMs = lastTs - sum.start_ts;
  }
  const duration = fmtDuration(durationMs);

  const subject = `[CARECIRCLE] SESSION \u2014 ${code} \u2014 ${duration}`;

  // Feature usage table
  let usageText = '';
  const eventKeys = Object.keys(events).filter(k => k !== 'heartbeat' && events[k] > 0);
  eventKeys.sort((a, b) => events[b] - events[a]);
  for (const k of eventKeys) {
    const label = EVENT_LABELS[k] || k;
    usageText += `  ${label.padEnd(24)} ${events[k]}\n`;
  }
  if (!usageText) usageText = '  (no feature events recorded)\n';

  // Compact timeline
  let timelineText = '';
  const startRef = sum.start_ts || 0;
  for (const [ts, ev] of timeline.slice(-30)) {
    const elapsed = ts - startRef;
    const h = Math.floor(elapsed / 3600000);
    const m = Math.floor((elapsed % 3600000) / 60000);
    const s = Math.floor((elapsed % 60000) / 1000);
    const hms = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const label = EVENT_LABELS[ev] || ev;
    timelineText += `  ${hms}  ${label}\n`;
  }
  if (!timelineText) timelineText = '  (no timeline data)\n';

  const textBody =
    `CARECIRCLE SESSION SUMMARY\n` +
    `${'='.repeat(40)}\n\n` +
    `Code:          ${code}\n` +
    `Entry:         ${startTs}\n` +
    `End:           ${timestamp}\n` +
    `Duration:      ${duration}\n` +
    `IP Address:    ${ip}\n` +
    `Location:      ${fmtGeo(geo)}\n` +
    `User Agent:    ${ua}\n` +
    `Screen:        ${nav.screen || 'unknown'}\n` +
    `Timezone:      ${nav.tz || 'unknown'}\n` +
    `Build:         ${nav.build || 'unknown'}\n\n` +
    `FEATURE USAGE\n` +
    `${'='.repeat(40)}\n` +
    usageText + '\n' +
    `TIMELINE\n` +
    `${'='.repeat(40)}\n` +
    timelineText + '\n' +
    `\u2014 Beverly Index LLC Automated Alert\n`;

  // HTML body
  const usageRowsHtml = eventKeys.map(k => {
    const label = EVENT_LABELS[k] || k;
    return `<tr><td style="color:#888;padding:4px 12px 4px 0;">${label}</td>` +
      `<td style="color:#4AE8C4;padding:4px 0;text-align:right;">${events[k]}</td></tr>`;
  }).join('');

  const timelineRowsHtml = timeline.slice(-30).map(([ts, ev]) => {
    const elapsed = ts - startRef;
    const h = Math.floor(elapsed / 3600000);
    const m = Math.floor((elapsed % 3600000) / 60000);
    const s = Math.floor((elapsed % 60000) / 1000);
    const hms = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const label = EVENT_LABELS[ev] || ev;
    return `<tr><td style="color:#888;padding:3px 12px 3px 0;font-size:12px;">${hms}</td>` +
      `<td style="color:#e0e0e0;padding:3px 0;font-size:12px;">${label}</td></tr>`;
  }).join('');

  const htmlBody = `
<div style="font-family:'Courier New',monospace;background:#0a0a14;color:#e0e0e0;padding:32px;border-radius:8px;max-width:600px;">
  <div style="border-left:4px solid #a480ff;padding-left:16px;margin-bottom:24px;">
    <h1 style="color:#a480ff;font-size:18px;margin:0 0 4px;">SESSION SUMMARY</h1>
    <p style="color:#4AE8C4;font-size:14px;margin:0;">${code} \u2014 ${duration}</p>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="color:#888;padding:6px 12px 6px 0;white-space:nowrap;">Code</td><td style="color:#4AE8C4;padding:6px 0;">${code}</td></tr>
    <tr><td style="color:#888;padding:6px 12px 6px 0;">Entry</td><td style="color:#e0e0e0;padding:6px 0;">${startTs}</td></tr>
    <tr><td style="color:#888;padding:6px 12px 6px 0;">End</td><td style="color:#e0e0e0;padding:6px 0;">${timestamp}</td></tr>
    <tr><td style="color:#888;padding:6px 12px 6px 0;">Duration</td><td style="color:#ffd24d;padding:6px 0;">${duration}</td></tr>
    <tr><td style="color:#888;padding:6px 12px 6px 0;">IP Address</td><td style="color:#e0e0e0;padding:6px 0;">${ip}</td></tr>
    <tr><td style="color:#888;padding:6px 12px 6px 0;">Location</td><td style="color:#e0e0e0;padding:6px 0;">${fmtGeo(geo)}</td></tr>
    <tr><td style="color:#888;padding:6px 12px 6px 0;">User Agent</td><td style="color:#e0e0e0;padding:6px 0;font-size:12px;word-break:break-all;">${ua}</td></tr>
    <tr><td style="color:#888;padding:6px 12px 6px 0;">Screen</td><td style="color:#e0e0e0;padding:6px 0;">${nav.screen || 'unknown'}</td></tr>
    <tr><td style="color:#888;padding:6px 12px 6px 0;">Timezone</td><td style="color:#e0e0e0;padding:6px 0;">${nav.tz || 'unknown'}</td></tr>
    <tr><td style="color:#888;padding:6px 12px 6px 0;">Build</td><td style="color:#e0e0e0;padding:6px 0;">${nav.build || 'unknown'}</td></tr>
  </table>

  <h2 style="color:#a480ff;font-size:14px;margin:24px 0 8px;border-top:1px solid #333;padding-top:16px;">FEATURE USAGE</h2>
  <table style="width:100%;border-collapse:collapse;font-size:13px;">
    ${usageRowsHtml || '<tr><td style="color:#888;padding:4px 0;">(no events)</td></tr>'}
  </table>

  <h2 style="color:#a480ff;font-size:14px;margin:24px 0 8px;border-top:1px solid #333;padding-top:16px;">TIMELINE</h2>
  <table style="width:100%;border-collapse:collapse;">
    ${timelineRowsHtml || '<tr><td style="color:#888;padding:3px 0;font-size:12px;">(no data)</td></tr>'}
  </table>

  <p style="color:#555;font-size:11px;margin-top:24px;text-align:center;">
    Beverly Index LLC &mdash; Automated Alert
  </p>
</div>`;

  await sendEmail(apiKey, subject, textBody, htmlBody);
}

// ── Shared email helpers ────────────────────────────────────────────────

function emailHtml(title, color, subtitle, timestamp, rows) {
  const rowsHtml = rows.map(([label, value, valColor, small]) => {
    const style = small
      ? `color:${valColor || '#e0e0e0'};padding:6px 0;font-size:12px;word-break:break-all;`
      : `color:${valColor || '#e0e0e0'};padding:6px 0;`;
    return `<tr><td style="color:#888;padding:6px 12px 6px 0;white-space:nowrap;">${label}</td>` +
      `<td style="${style}">${value}</td></tr>`;
  }).join('');

  return `
<div style="font-family:'Courier New',monospace;background:#0a0a14;color:#e0e0e0;padding:32px;border-radius:8px;max-width:600px;">
  <div style="border-left:4px solid ${color};padding-left:16px;margin-bottom:24px;">
    <h1 style="color:${color};font-size:18px;margin:0 0 4px;">${title}</h1>
    <p style="color:#4AE8C4;font-size:14px;margin:0;">${subtitle} \u2014 ${timestamp}</p>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    ${rowsHtml}
  </table>
  <p style="color:#555;font-size:11px;margin-top:24px;text-align:center;">
    Beverly Index LLC &mdash; Automated Alert
  </p>
</div>`;
}

async function sendEmail(apiKey, subject, textBody, htmlBody) {
  const alertTo = process.env.ALERT_TO;
  const alertFrom = process.env.ALERT_FROM;
  if (!alertTo || !alertFrom) return;

  const payload = {
    from: alertFrom,
    to: [alertTo],
    subject: subject,
    text: textBody,
  };
  if (htmlBody) payload.html = htmlBody;

  try {
    await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    // Silent
  }
}
