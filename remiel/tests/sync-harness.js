/* Node harness for RemielDB + SyncEngine (not loaded by the app).
   Usage: NODE_PATH=<dir with fake-indexeddb> node remiel/tests/sync-harness.js */
require('fake-indexeddb/auto');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'app.html'), 'utf8');
function slice(startMarker, endMarker) {
  const a = html.indexOf(startMarker);
  const b = html.indexOf(endMarker, a) + endMarker.length;
  if (a < 0 || b < endMarker.length) throw new Error('marker not found: ' + startMarker);
  return html.slice(a, b);
}
const dbSrc = slice('const RemielDB = (() => {', '\n})();\n');
const seSrc = slice('const SyncEngine = (() => {', '\n})();\n');

/* Minimal browser shims */
global.window = { addEventListener() {}, removeEventListener() {}, dispatchEvent() {} };
global.document = { getElementById() { return null; }, readyState: 'complete' };
global.CustomEvent = class { constructor(t, o) { this.type = t; this.detail = o && o.detail; } };
Object.defineProperty(globalThis, 'navigator', { value: { onLine: true }, configurable: true, writable: true });
global.DEMO_CONTACTS = [];

/* Fake server keeps per-user rows with a global version */
function makeServer() {
  const S = { v: 0, rows: { contacts: [], moods: [], interactions: [], medications: [], settings: [], voice_entries: [] }, nextId: 1, refreshCalls: 0 };
  S.handle = async (url, opts) => {
    const u = new URL(url);
    const body = opts && opts.body && typeof opts.body === 'string' ? JSON.parse(opts.body) : null;
    const ok = (o, st) => ({ ok: (st || 200) < 400, status: st || 200, json: async () => o, headers: { get: () => null } });
    if (u.pathname === '/auth/device') return ok({ access_token: 'a1', refresh_token: 'r1', user_id: 'u1', display_name: body.display_name, handle: 'ann', sentinel_id: body.sentinel_id || null, claimed: false }, 201);
    if (u.pathname === '/auth/refresh') { S.refreshCalls++; return ok({ access_token: 'a2', refresh_token: 'r2', user_id: 'u1' }); }
    if (u.pathname === '/profile') return ok({ user_id: 'u1', display_name: 'Ann', handle: 'ann', sentinel_id: body && body.sentinel_id, claimed: false });
    if (u.pathname === '/sync/push') {
      const res = { contact_map: {}, mood_map: {}, interaction_map: {}, medication_map: {}, voice_map: {}, errors: [] };
      const types = [['contacts', 'contact_map'], ['moods', 'mood_map'], ['interactions', 'interaction_map'], ['medications', 'medication_map'], ['voice_entries', 'voice_map']];
      for (const [t, m] of types) for (const it of body[t] || []) {
        let row = it.server_id && S.rows[t].find(r => r.server_id === it.server_id);
        S.v++;
        if (!row) { row = { server_id: 's' + (S.nextId++), client_id: it.client_id, deleted: 0 }; S.rows[t].push(row); }
        row.data = it; row.contact_id = it.contact_id; row.v = S.v;
        res[m][it.client_id] = row.server_id;
      }
      for (const st of body.settings || []) { S.v++; S.rows.settings = S.rows.settings.filter(r => r.key !== st.key); S.rows.settings.push({ key: st.key, value: st.value, v: S.v }); }
      for (const t of Object.keys(body.deleted || {})) for (const sid of body.deleted[t]) {
        const row = S.rows[t].find(r => r.server_id === sid); if (row) { S.v++; row.deleted = 1; row.v = S.v; }
      }
      S.lastPush = body;
      return ok(Object.assign({ current_version: S.v }, res));
    }
    if (u.pathname === '/sync/pull') {
      const since = +u.searchParams.get('since_version');
      const out = { current_version: S.v, circle_bio: [] };
      for (const t of Object.keys(S.rows)) out[t] = S.rows[t].filter(r => r.v > since);
      return ok(out);
    }
    if (u.pathname === '/storage/list') return ok({ current_version: 0, blobs: [] });
    return ok({ detail: 'nf' }, 404);
  };
  return S;
}

function loadClient(dbName) {
  const src = dbSrc.replace("const DB_NAME = 'remiel-sentinel';", "const DB_NAME = '" + dbName + "';");
  const fn = new Function('SyncPrompt', src + '\n' + seSrc + '\nreturn { RemielDB, SyncEngine };');
  const mod = fn(undefined);
  return mod;
}

let fails = 0;
function check(cond, msg) { if (cond) console.log('ok   ' + msg); else { fails++; console.log('FAIL ' + msg); } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const S = makeServer();
  global.fetch = (url, opts) => S.handle(url, opts);

  /* Device A */
  let A = loadClient('devA');
  global.RemielDB = A.RemielDB; global.SyncEngine = A.SyncEngine;
  await A.RemielDB.putSetting('userSphereName', 'Ann');
  await A.SyncEngine.init();
  await A.SyncEngine.ensureIdentity();
  check(A.SyncEngine.isAuthenticated(), 'device identity created');
  const cid = await A.RemielDB.putContact({ first: 'Bob', last: 'B', cat: 'family', sev: 1 });
  await A.RemielDB.addMood({ contactId: cid, value: 3 });
  check((await A.RemielDB.queueCount()) >= 2, 'writes appended to syncQueue');
  let r = await A.SyncEngine.sync();
  check(r.pull && r.pull.success, 'first sync (full snapshot) ok');
  check((await A.RemielDB.queueCount()) === 0, 'queue drained');
  check(A.SyncEngine.getStatus().state === 'synced', 'status synced');
  await A.RemielDB.deleteContact(cid);
  r = await A.SyncEngine.sync();
  check(S.lastPush.deleted.contacts.length === 1 && S.lastPush.contacts.length === 0, 'delta push sends tombstone only');

  /* Device B pulls */
  const cid2 = await A.RemielDB.putContact({ first: 'Cara', last: 'C' });
  await A.RemielDB.addMood({ contactId: 'self', value: 5 });
  await A.SyncEngine.sync();
  A.SyncEngine.stopAutoSync();
  const ac = await A.RemielDB.getAllContacts();
  check(ac.length === 1 && ac[0].id === cid2, 'own echoes do not duplicate on device A');
  check((await A.RemielDB.rawGetAll('moods')).length === 2, 'moods not duplicated on device A (2 local moods)');
  let B = loadClient('devB');
  global.RemielDB = B.RemielDB; global.SyncEngine = B.SyncEngine; global.DEMO_CONTACTS = [];
  await B.RemielDB.putSetting('userSphereName', 'Ann');
  await B.RemielDB.putSetting('_sync_full_done', true);
  await B.SyncEngine.init();
  await B.SyncEngine.ensureIdentity();
  await B.SyncEngine.sync();
  const bc = await B.RemielDB.getAllContacts();
  check(bc.length === 1 && bc[0].first === 'Cara', 'pull inserts unmapped contact, applies tombstone');
  const bm = await B.RemielDB.rawGetAll('moods');
  check(bm.length === 1 && bm[0].contactId === 'self', 'pull inserts moods');
  check(B.SyncEngine.getStatus().lastSyncVersion === S.v, 'version set from pull.current_version');

  /* concurrent 401 single-flight */
  const orig = S.handle; let n = 0;
  global.fetch = async (url, opts) => {
    if (/\/profile$/.test(url) && opts.headers.Authorization === 'Bearer a1') { n++; return { ok: false, status: 401, json: async () => ({}) }; }
    return orig(url, opts);
  };
  await Promise.all([B.SyncEngine.apiFetch('/profile', {}), B.SyncEngine.apiFetch('/profile', {}), B.SyncEngine.apiFetch('/profile', {})]);
  check(S.refreshCalls === 1, 'concurrent 401s refresh once (got ' + S.refreshCalls + ')');
  global.fetch = orig;

  await B.SyncEngine.logout();
  check(!B.SyncEngine.isAuthenticated() && (await B.RemielDB.getSetting('_sync_access_token')) === null, 'logout clears tokens');
  B.SyncEngine.stopAutoSync();
  console.log(fails ? fails + ' failure(s)' : 'all passed');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
