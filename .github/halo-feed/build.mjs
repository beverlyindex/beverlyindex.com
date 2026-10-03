// Remiel Halo: Global scan feed builder.
// Reads public government and public-interest sources, writes one JSON file the console reads.
// Each source is independent: a source that fails is recorded as failed and the rest still publish.
// Only titles, dates, identifiers and links are kept. No article text is copied.
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const OUT = process.argv[2] || 'out/global.json';
const UA = 'RemielHalo-GlobalFeed/1.0 (+https://beverly-index.com/halo/)';
const DAYS = 45;

async function get(url, ms = 25000) {
  const ac = new AbortController();
  const to = setTimeout(() => ac.abort(), ms);
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: '*/*' }, signal: ac.signal, redirect: 'follow' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.text();
  } finally { clearTimeout(to); }
}
async function firstOk(urls) {
  let last;
  for (const u of urls) { try { return { text: await get(u), url: u }; } catch (e) { last = e; } }
  throw last || new Error('no source reached');
}

const decode = s => String(s || '')
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/[–—]/g, ',').replace(/\s+/g, ' ').trim();
const tag = (block, name) => { const m = new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + name + '>', 'i').exec(block); return m ? m[1] : ''; };
const tags = (block, name) => { const out = []; const re = new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + name + '>', 'gi'); let m; while ((m = re.exec(block))) out.push(decode(m[1])); return out; };
function isoDate(s) {
  const clean = decode(s).replace(/\s*\|\s*/, ' ').replace(/(\d)(AM|PM)\b/i, '$1 $2');
  const t = Date.parse(clean);
  return isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
}
export function parseRss(xml, limit = 12) {
  const items = [];
  const re = /<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi; let m;
  while ((m = re.exec(xml)) && items.length < limit) {
    const b = m[2];
    let link = decode(tag(b, 'link'));
    if (!link) { const h = /<link[^>]*href="([^"]+)"/i.exec(b); if (h) link = h[1]; }
    const title = decode(tag(b, 'title'));
    if (!title || !/^https?:\/\//.test(link)) continue;
    items.push({ t: title, u: link, d: isoDate(tag(b, 'pubDate') || tag(b, 'updated') || tag(b, 'published') || tag(b, 'dc:date')), cats: tags(b, 'category') });
  }
  return items;
}

// Which catalogue entries matter to a person, and to which of their devices.
const PLATFORM = [
  ['android', /\b(android|google pixel|samsung mobile|qualcomm|mediatek|arm mali|unisoc)\b/i],
  ['apple',   /\b(apple|ios|ipados|macos|webkit|safari|watchos)\b/i],
  ['browser', /\b(chrome|chromium|firefox|mozilla|edge|webkit|v8|skia|angle)\b/i],
  ['windows', /(\bwindows\b|microsoft office|\boutlook\b)/i],
  ['router',  /\b(tp-link|netgear|d-link|asus|zyxel|linksys|draytek|mikrotik|ubiquiti|tenda|totolink|router|nvr|dvr|ip camera|hikvision|dahua)\b/i],
  ['messaging', /\b(whatsapp|signal|telegram|imessage|meta platforms)\b/i]
];
export function platformsOf(v) {
  const s = [v.vendorProject, v.product, v.vulnerabilityName].join(' ');
  return PLATFORM.filter(p => p[1].test(s)).map(p => p[0]);
}
export function shapeKev(j, now = Date.now()) {
  const cut = now - DAYS * 86400000;
  const all = Array.isArray(j.vulnerabilities) ? j.vulnerabilities : [];
  const recent = all.filter(v => Date.parse(v.dateAdded) >= cut)
    .map(v => ({ cve: v.cveID, vendor: decode(v.vendorProject), product: decode(v.product), name: decode(v.vulnerabilityName),
      added: v.dateAdded, due: v.dueDate || null, ransomware: /^known$/i.test(v.knownRansomwareCampaignUse || ''), platforms: platformsOf(v),
      u: 'https://nvd.nist.gov/vuln/detail/' + encodeURIComponent(v.cveID) }))
    .sort((a, b) => (a.added < b.added ? 1 : -1));
  const personal = recent.filter(v => v.platforms.length);
  const count = {}; personal.forEach(v => v.platforms.forEach(p => { count[p] = (count[p] || 0) + 1; }));
  return { catalogVersion: j.catalogVersion || null, dateReleased: j.dateReleased || null, total: all.length, windowDays: DAYS,
    recentAll: recent.length, recent: personal.slice(0, 60), byPlatform: count };
}

const SURV = /(surveil|tracking|tracker|location data|stalk|spyware|license plate|alpr|facial|face recognition|biometric|cell-site|stingray|data broker|wiretap|camera|drone|geofence)/i;

const SOURCES = [
  { id: 'kev', name: 'CISA Known Exploited Vulnerabilities', home: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
    urls: ['https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
           'https://raw.githubusercontent.com/cisagov/kev-data/develop/known_exploited_vulnerabilities.json'],
    shape: text => { const k = shapeKev(JSON.parse(text)); return { data: k, count: k.recent.length }; } },
  { id: 'advisories', name: 'CISA Cybersecurity Advisories', home: 'https://www.cisa.gov/news-events/cybersecurity-advisories',
    urls: ['https://www.cisa.gov/cybersecurity-advisories/all.xml'],
    shape: text => { const a = parseRss(text, 12).map(({ cats, ...x }) => ({ ...x, src: 'CISA' })); return { data: a, count: a.length }; } },
  { id: 'consumer', name: 'FTC Consumer Alerts', home: 'https://consumer.ftc.gov/consumer-alerts',
    urls: ['https://consumer.ftc.gov/blog/gd-rss.xml'],
    shape: text => { const a = parseRss(text, 12).map(({ cats, ...x }) => ({ ...x, src: 'FTC' })); return { data: a, count: a.length }; } },
  { id: 'privacy', name: 'EFF Deeplinks', home: 'https://www.eff.org/deeplinks',
    urls: ['https://www.eff.org/rss/updates.xml'],
    shape: text => { const a = parseRss(text, 40).filter(x => SURV.test(x.t) || x.cats.some(c => /surveillance|biometric|face recognition|location/i.test(c))).slice(0, 12).map(({ cats, ...x }) => ({ ...x, src: 'EFF' })); return { data: a, count: a.length }; } }
];

export async function build() {
  const out = { product: 'Remiel Halo', feed: 'global', version: 1, generated: new Date().toISOString(), sources: [] };
  for (const s of SOURCES) {
    try {
      const { text, url } = await firstOk(s.urls);
      const { data, count } = s.shape(text);
      out[s.id] = data;
      out.sources.push({ id: s.id, name: s.name, home: s.home, from: url, ok: true, count });
    } catch (e) {
      out[s.id] = s.id === 'kev' ? null : [];
      out.sources.push({ id: s.id, name: s.name, home: s.home, ok: false, error: String(e && e.message || e).slice(0, 120) });
    }
  }
  return out;
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const out = await build();
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out));
  console.log(out.sources.map(s => s.id + ': ' + (s.ok ? 'ok ' + s.count : 'FAILED ' + s.error)).join('\n'));
  if (!out.sources.some(s => s.ok)) { console.error('No source reached. Nothing published.'); process.exit(1); }
}
