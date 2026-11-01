// Verifies an access code for a protected area and issues a signed cookie.
// Codes are never stored in the site: only SHA-256 hashes, held in the
// GATE_KEYS environment variable on Vercel.
//
// GATE_KEYS format (JSON): { "carecircle": ["<sha256 hex>", ...], "pathfinder": [...], ... }
// Hash = SHA-256 of "carecircle:" + CODE (trimmed, upper case), the same
// scheme the existing access screens use, so existing codes keep working.

const crypto = require('crypto');

const AREAS = ['carecircle', 'pathfinder', 'remiel', 'covara', 'halo', 'proteus', 'optics'];
const COOKIE_DAYS = 30;
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map(); // best-effort per-instance rate limit

function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function sign(secret, message) {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

function safeNext(next, area) {
  if (typeof next !== 'string' || !next.startsWith('/') || next.startsWith('//')) return '/';
  return next;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end();
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const rec = attempts.get(ip) || { n: 0, t: now };
  if (now - rec.t > WINDOW_MS) { rec.n = 0; rec.t = now; }
  if (rec.n >= MAX_ATTEMPTS) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: false, error: 'Too many attempts. Try again later.' }));
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};
  const area = String(body.area || '');
  const code = String(body.code || '').trim().toUpperCase();

  let keys = {};
  try { keys = JSON.parse(process.env.GATE_KEYS || '{}'); } catch { keys = {}; }
  const secret = process.env.GATE_SECRET;

  const allowed = AREAS.includes(area) && code && secret &&
    Array.isArray(keys[area]) && keys[area].includes(sha256('carecircle:' + code));

  if (!allowed) {
    rec.n += 1;
    attempts.set(ip, rec);
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: false, error: 'That code is not valid.' }));
  }

  attempts.delete(ip);
  const exp = Math.floor(now / 1000) + COOKIE_DAYS * 24 * 3600;
  const token = `${area}.${exp}.${sign(secret, `${area}.${exp}`)}`;
  res.setHeader('Set-Cookie',
    `bi_gate_${area}=${token}; Path=/; Max-Age=${COOKIE_DAYS * 24 * 3600}; HttpOnly; Secure; SameSite=Lax`);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true, next: safeNext(body.next, area) }));
};
