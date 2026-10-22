/* Remiel: Covara, Help for the whole circle.
   Press and hold Help: everyone in the circle is told at once. A red ticker, the same as Remiel: Personal
   Protection's Watchers and Attackers tickers, scrolls under the top buttons on every phone: who called, when,
   where, how far away, the nearest emergency room, and who is on the way. WHEREIS opens on the caller by itself:
   the big radar shows the whole area, the small one the room or the tightest circle the phone can give.
   The caller's phone sends a fresh position at once and every 15 seconds for the next hour.
   Nobody in the circle is assumed to be close: the big radar becomes a locator for every place near the caller
   that can answer (emergency rooms, fire stations, police, urgent care, defibrillators, pharmacies), the
   closest first, and Nearby help lists them with Call and Directions.
   Beverly Index LLC */
(function () {
  'use strict';
  var IT = function () { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var S = {
    en: { title: 'Call for help', sub: 'Everyone in your circle is told at once and sees where you are.', hold: 'Hold to call your circle', holding: 'Keep holding…', cancel: 'Cancel',
      sent: 'Your circle has been told. Your position goes to them every 15 seconds.', failed: 'Help could not be sent. Check the internet, or call 911.',
      called: '{name} CALLED FOR HELP', youCalled: 'YOU CALLED FOR HELP', at: '{t}', room: 'in the {room}', fromYou: '{d} from you', acc: 'within {d}', er: 'nearest ER: {name}, {d}',
      coming: '{names} on the way', nobody: 'no one on the way yet', live: 'LIVE {t}', noPos: 'finding position', sharing: 'sharing your position with the circle',
      onWay: "I'm on my way", call: 'Call', resolve: 'Resolved', allRight: "I'm all right", lead: 'HELP', nowCalled: '{name} called for help', nowYou: 'You called for help', ok: 'Marked resolved.', youOnWay: 'You are on the way.',
      nearBtn: 'Nearby help', firstHelp: 'closest help: {name}, {kind}, {d}', comingD: '{name} on the way, {d}', nearTitle: 'Help near {name}', nearYou: 'Help near you',
      nearSub: 'Closest first, measured from where the phone is now. Call the emergency number first if anyone is in danger.', emerg: 'Call 911', emergNum: '911', callIt: 'Call', dirs: 'Directions', closest: 'CLOSEST HELP',
      nearNone: 'No places found near this spot yet.', nearFail: 'The list of nearby places could not be loaded. Call 911.', nearWait: 'Finding help nearby...', close: 'Close',
      k_emergency: 'Emergency room', k_hospital: 'Hospital', k_urgent: 'Urgent care', k_clinic: 'Clinic', k_doctor: 'Doctor', k_police: 'Police', k_fire: 'Fire station', k_pharmacy: 'Pharmacy', k_aed: 'Defibrillator' },
    it: { title: 'Chiedi aiuto', sub: 'Tutta la tua cerchia viene avvisata subito e vede dove sei.', hold: 'Tieni premuto per chiamare la cerchia', holding: 'Continua a tenere premuto…', cancel: 'Annulla',
      sent: 'La tua cerchia è stata avvisata. La tua posizione arriva loro ogni 15 secondi.', failed: 'Non è stato possibile inviare l’aiuto. Controlla internet o chiama il 112.',
      called: '{name} HA CHIESTO AIUTO', youCalled: 'HAI CHIESTO AIUTO', at: '{t}', room: 'in {room}', fromYou: 'a {d} da te', acc: 'entro {d}', er: 'pronto soccorso più vicino: {name}, {d}',
      coming: '{names} in arrivo', nobody: 'ancora nessuno in arrivo', live: 'IN DIRETTA {t}', noPos: 'cerco la posizione', sharing: 'condividi la posizione con la cerchia',
      onWay: 'Sto arrivando', call: 'Chiama', resolve: 'Risolto', allRight: 'Sto bene', lead: 'AIUTO', nowCalled: '{name} ha chiesto aiuto', nowYou: 'Hai chiesto aiuto', ok: 'Segnato come risolto.', youOnWay: 'Sei in arrivo.',
      nearBtn: 'Aiuto vicino', firstHelp: 'aiuto più vicino: {name}, {kind}, {d}', comingD: '{name} in arrivo, a {d}', nearTitle: 'Aiuto vicino a {name}', nearYou: 'Aiuto vicino a te',
      nearSub: 'Dal più vicino, misurato da dove si trova ora il telefono. Se qualcuno è in pericolo, chiama prima il numero di emergenza.', emerg: 'Chiama il 112', emergNum: '112', callIt: 'Chiama', dirs: 'Indicazioni', closest: 'AIUTO PIÙ VICINO',
      nearNone: 'Nessun luogo trovato ancora qui vicino.', nearFail: 'Non è stato possibile caricare i luoghi vicini. Chiama il 112.', nearWait: 'Cerco aiuto qui vicino...', close: 'Chiudi',
      k_emergency: 'Pronto soccorso', k_hospital: 'Ospedale', k_urgent: 'Guardia medica', k_clinic: 'Clinica', k_doctor: 'Medico', k_police: 'Polizia', k_fire: 'Vigili del fuoco', k_pharmacy: 'Farmacia', k_aed: 'Defibrillatore' }
  };
  function t(k, p) { var s = (IT() ? S.it : S.en)[k] || S.en[k] || k; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function authed() { try { return SyncEngine.isAuthenticated() && !SyncEngine.isLocalOnly(); } catch (e) { return false; } }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function myId() { try { return SyncEngine.getUserId() || ''; } catch (e) { return ''; } }
  function hm(ms) { try { return new Date(ms).toLocaleTimeString(IT() ? 'it' : 'en-US', { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }
  function dist(m) { if (m == null || !isFinite(m)) return ''; if (!IT()) { var ft = m * 3.281; return ft < 1000 ? Math.max(5, Math.round(ft / 5) * 5) + ' ft' : (m / 1609.34).toFixed(m < 16093 ? 1 : 0) + ' mi'; } return m < 1000 ? Math.max(2, Math.round(m)) + ' m' : (m / 1000).toFixed(1) + ' km'; }
  function ago(ms) { var s = Math.max(0, Math.round((Date.now() - ms) / 1000)); return s < 60 ? s + 's' : Math.round(s / 60) + 'm'; }
  async function api(path, o) { var r = await SyncEngine.apiFetch(path, Object.assign({ method: 'GET' }, o || {}, o && o.body ? { body: JSON.stringify(o.body) } : {})); return { ok: r.ok, status: r.status, data: await r.json().catch(function () { return {}; }) }; }

  /* ── the hold-to-send card ── */
  var css = '#cvHelpCard{position:fixed;inset:0;z-index:100020;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(30,4,10,.45);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}' +
    '#cvHelpCard .card{width:min(420px,100%);text-align:center;padding:24px 20px 20px;border-radius:24px;border:1.5px solid rgba(255,80,100,.75);background:linear-gradient(155deg,rgba(120,20,40,.30),rgba(40,8,20,.45));box-shadow:0 0 30px rgba(255,40,70,.35),inset 0 1px 0 rgba(255,255,255,.12);color:#fff;font-family:var(--nous-font,"Hanken Grotesk",sans-serif)}' +
    '#cvHelpCard h2{margin:0 0 6px;font-size:22px;font-weight:800}#cvHelpCard p{margin:0 0 18px;color:#ffd5dc;font-size:14.5px;line-height:1.45}' +
    '#cvHelpCard .hold{position:relative;width:170px;height:170px;margin:0 auto 14px;border-radius:50%;border:0;background:radial-gradient(circle at 35% 30%,#ff6b7f,#d0102c 60%,#7a0616);color:#fff;font:800 15px var(--nous-font,sans-serif);letter-spacing:.04em;box-shadow:0 0 40px rgba(255,40,70,.55);cursor:pointer;touch-action:none;-webkit-user-select:none;user-select:none}' +
    '#cvHelpCard .hold svg{position:absolute;inset:-8px;width:186px;height:186px;transform:rotate(-90deg);pointer-events:none}#cvHelpCard .hold circle{fill:none;stroke:#fff;stroke-width:5;stroke-linecap:round}' +
    '#cvHelpCard .cx{display:block;margin:0 auto;min-height:44px;padding:0 22px;border-radius:22px;border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;font:700 14px var(--nous-font,sans-serif);cursor:pointer}#cvHelpCard .msg{min-height:20px;margin:10px 0 0;color:#ffe3a8;font-size:14px}' +
    /* the ticker, as in Remiel: Personal Protection */
    '#cvHelpTicker{position:fixed;left:0;right:0;z-index:99980;display:none;font-family:var(--nous-font,"Hanken Grotesk",sans-serif)}#cvHelpTicker.on{display:block}' +
    '#cvHelpTicker .tk{position:relative;height:44px;overflow:hidden;display:flex;align-items:center;border-top:1px solid rgba(255,90,110,.7);border-bottom:1px solid rgba(255,90,110,.7);background:linear-gradient(90deg,rgba(120,10,30,.55),rgba(40,6,18,.5));-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 0 22px rgba(255,40,70,.35)}' +
    '#cvHelpTicker .lead{position:absolute;left:0;top:0;bottom:0;z-index:2;display:flex;align-items:center;padding:0 14px;background:#e0102e;color:#fff;font:800 12px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.18em;box-shadow:6px 0 14px rgba(0,0,0,.35)}' +
    '#cvHelpTicker .lead:before{content:"";width:9px;height:9px;border-radius:50%;background:#fff;margin-right:8px;animation:cvHb 1s ease-in-out infinite}@keyframes cvHb{50%{opacity:.2}}' +
    '#cvHelpTicker .track{display:flex;gap:46px;white-space:nowrap;padding-left:110px;animation:cvHm 26s linear infinite;color:#ffe3e8;font-size:13.5px}#cvHelpTicker .track b{color:#fff;font-weight:800}#cvHelpTicker .track i{font-style:normal;color:#ffd24d}' +
    '@keyframes cvHm{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media (prefers-reduced-motion:reduce){#cvHelpTicker .track{animation:none}}' +
    '#cvHelpActs{position:fixed;left:0;right:0;z-index:99981;display:none;justify-content:center;flex-wrap:wrap;gap:8px;padding:0 10px}#cvHelpActs.on{display:flex}body.cv-helping #cvnTop{visibility:hidden}'+
    '#cvHelpActs button{min-height:38px;padding:0 16px;border-radius:19px;font:800 13px var(--nous-font,sans-serif);cursor:pointer;border:1px solid rgba(255,255,255,.45);background:rgba(120,20,40,.35);color:#fff;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}' +
    '#cvHelpActs button.pri{background:#ffd24d;color:#2a1600;border-color:#ffd24d}#cvHelpActs button[disabled]{opacity:.6}' +
    /* Nearby help: a red glass sheet, closest first */
    '#cvHelpNear{position:fixed;inset:0;z-index:100010;display:flex;align-items:flex-end;justify-content:center;background:rgba(30,4,10,.40);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);font-family:var(--nous-font,"Hanken Grotesk",sans-serif)}' +
    '#cvHelpNear .sh{width:min(520px,100%);max-height:82vh;overflow:auto;padding:18px 16px calc(16px + env(safe-area-inset-bottom));border-radius:24px 24px 0 0;border:1.5px solid rgba(255,80,100,.7);border-bottom:0;background:linear-gradient(160deg,rgba(120,20,40,.34),rgba(30,6,16,.55));-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 0 30px rgba(255,40,70,.3),inset 0 1px 0 rgba(255,255,255,.12);color:#fff}' +
    '#cvHelpNear h3{margin:0 0 4px;font-size:19px;font-weight:800}#cvHelpNear .sub{margin:0 0 12px;color:#ffd5dc;font-size:13px;line-height:1.4}' +
    '#cvHelpNear .sos{display:block;width:100%;min-height:48px;margin:0 0 12px;border-radius:24px;background:#e0102e;color:#fff;font:800 16px var(--nous-font,sans-serif);text-align:center;line-height:48px;text-decoration:none;box-shadow:0 0 20px rgba(255,40,70,.5)}' +
    '#cvHelpNear .pl{display:flex;align-items:center;gap:10px;padding:10px 12px;margin:0 0 8px;border-radius:16px;border:1px solid rgba(255,170,185,.35);background:rgba(255,255,255,.05)}#cvHelpNear .pl.first{border-color:#ffd24d;box-shadow:0 0 16px rgba(255,210,77,.35)}' +
    '#cvHelpNear .dot{flex:0 0 12px;height:12px;border-radius:50%;box-shadow:0 0 10px currentColor}#cvHelpNear .nm{flex:1;min-width:0}#cvHelpNear .nm b{display:block;font-size:14.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#cvHelpNear .nm span{display:block;font:700 11px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.04em;margin-top:2px}#cvHelpNear .nm em{display:block;font-style:normal;font:800 10px var(--nous-mono,monospace);color:#ffd24d;letter-spacing:.12em;margin-bottom:2px}' +
    '#cvHelpNear .pl a{flex:0 0 auto;min-height:36px;padding:0 12px;border-radius:18px;border:1px solid rgba(255,255,255,.45);color:#fff;text-decoration:none;font:800 12.5px var(--nous-font,sans-serif);line-height:34px}#cvHelpNear .pl a.c{background:#ffd24d;color:#2a1600;border-color:#ffd24d}' +
    '#cvHelpNear .x{display:block;margin:6px auto 0;min-height:42px;padding:0 24px;border-radius:21px;border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;font:700 14px var(--nous-font,sans-serif);cursor:pointer}#cvHelpNear .msg{color:#ffe3a8;font-size:14px;margin:8px 0}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function card() {
    var old = document.getElementById('cvHelpCard'); if (old) old.remove();
    var el = document.createElement('div'); el.id = 'cvHelpCard'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = '<div class="card"><h2>' + esc(t('title')) + '</h2><p>' + esc(t('sub')) + '</p><button type="button" class="hold" data-hold><svg viewBox="0 0 186 186"><circle cx="93" cy="93" r="88" stroke-dasharray="553" stroke-dashoffset="553"/></svg><span>' + esc(t('hold')) + '</span></button>' +
      '<button type="button" class="cx" data-x>' + esc(t('cancel')) + '</button><div class="msg" aria-live="assertive"></div></div>';
    document.body.appendChild(el);
    var b = el.querySelector('[data-hold]'), ring = b.querySelector('circle'), lab = b.querySelector('span'), msg = el.querySelector('.msg'), t0 = 0, raf = 0, done = false;
    function stop() { cancelAnimationFrame(raf); t0 = 0; if (!done) { ring.style.strokeDashoffset = '553'; lab.textContent = t('hold'); } }
    function tick() { var k = Math.min(1, (Date.now() - t0) / 1200); ring.style.strokeDashoffset = String(553 * (1 - k)); if (k >= 1) { done = true; fire(); return; } raf = requestAnimationFrame(tick); }
    function down(e) { e.preventDefault(); if (done) return; t0 = Date.now(); lab.textContent = t('holding'); raf = requestAnimationFrame(tick); try { navigator.vibrate && navigator.vibrate(30); } catch (x) {} }
    b.addEventListener('pointerdown', down); ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { b.addEventListener(ev, stop); });
    b.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && !t0) down(e); }); b.addEventListener('keyup', stop);
    el.querySelector('[data-x]').onclick = function () { el.remove(); };
    async function fire() {
      lab.textContent = '✓'; try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (x) {}
      var ok = await start();
      msg.textContent = ok ? t('sent') : t('failed');
      setTimeout(function () { el.remove(); }, ok ? 1800 : 6000);
    }
  }

  /* ── sending: at once, then the position as soon as the phone has it, then every 15 seconds ── */
  var _mine = [], _watch = null, _lastSent = 0, _pos = null;
  async function start() {
    if (!authed()) return false;
    var r = await api('/care-help', { method: 'POST', body: _pos && Date.now() - _pos.at < 60000 ? { lat: _pos.lat, lon: _pos.lon, acc: _pos.acc } : {} }).catch(function () { return { ok: false }; });
    if (!r.ok) return false;
    _mine = r.data.ids || [];
    try { if (typeof AlarmCenter !== 'undefined' && AlarmCenter.sendHelp) AlarmCenter.sendHelp('cvHelpNull'); } catch (e) {} /* the person chosen in Settings also gets the ringing alarm */
    follow();
    load(true);
    return true;
  }
  function follow() {
    if (!navigator.geolocation) return;
    try { if (_watch != null) navigator.geolocation.clearWatch(_watch); } catch (e) {}
    var first = true;
    _watch = navigator.geolocation.watchPosition(function (p) {
      _pos = { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy, at: Date.now() };
      if (!_mine.length) return;
      if (!first && Date.now() - _lastSent < 15000) return;
      first = false; _lastSent = Date.now();
      _mine.forEach(function (id) { api('/care-help/' + encodeURIComponent(id) + '/where', { method: 'POST', body: { lat: _pos.lat, lon: _pos.lon, acc: _pos.acc } }).catch(function () {}); });
    }, function () {}, { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 });
    /* the phone may not report while still: send what it has every 15 seconds anyway */
    clearInterval(follow._iv);
    follow._iv = setInterval(function () {
      if (!_mine.length) { clearInterval(follow._iv); return; }
      if (_pos && Date.now() - _lastSent >= 15000) { _lastSent = Date.now(); _mine.forEach(function (id) { api('/care-help/' + encodeURIComponent(id) + '/where', { method: 'POST', body: { lat: _pos.lat, lon: _pos.lon, acc: _pos.acc } }).catch(function () {}); }); }
    }, 5000);
  }
  function unfollow() { try { if (_watch != null) navigator.geolocation.clearWatch(_watch); } catch (e) {} _watch = null; clearInterval(follow._iv); _mine = []; }

  /* ── help nearby: every place that can answer, from the caller's own spot ── */
  var KC = { emergency: '#ff3d5a', hospital: '#ff4f7a', urgent: '#ff7a9a', clinic: '#ff8fb1', doctor: '#ffb4c8', police: '#5b9cff', fire: '#ff8a3d', pharmacy: '#3ee08f', aed: '#ffd24d' };
  var _near = {};
  function moved(a, b) { return Math.hypot((a.lat - b.lat) * 111320, (a.lon - b.lon) * 111320 * Math.cos(a.lat * Math.PI / 180)); }
  async function fetchNear(h, force) {
    if (!h.location) return;
    var c = _near[h.id];
    if (c && c.busy) return;
    if (!force && c && c.data && Date.now() - c.at < 10 * 60000 && moved(c.pos, h.location) < 250 && (h.responders || []).length === c.nr) return;
    _near[h.id] = Object.assign(c || {}, { busy: true });
    var r = await api('/care-help/' + encodeURIComponent(h.id) + '/near').catch(function () { return { ok: false }; });
    _near[h.id] = { busy: false, at: Date.now(), pos: { lat: h.location.lat, lon: h.location.lon }, nr: (h.responders || []).length, data: r.ok ? r.data : (c && c.data) || { places: [], failed: true } };
    paint(); renderNear();
  }
  function nearOf(h) { var c = h && _near[h.id]; return c && c.data ? c.data : null; }
  function firstOf(n) { if (!n || !n.places) return null; return n.places.filter(function (p) { return p.id === n.first; })[0] || null; }
  var _nearFor = null;
  function openNear(h) { _nearFor = h.id; renderNear(true); fetchNear(h, false); }
  function renderNear(make) {
    var el = document.getElementById('cvHelpNear');
    if (!el && !make) return;
    var h = _help.filter(function (x) { return x.id === _nearFor; })[0];
    if (!h) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement('div'); el.id = 'cvHelpNear'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.onclick = function (e) { if (e.target === el) { el.remove(); _nearFor = null; } }; document.body.appendChild(el); }
    var n = nearOf(h), first = firstOf(n), body = '';
    if (!n) body = '<div class="msg">' + esc(t('nearWait')) + '</div>';
    else if (!n.places.length) body = '<div class="msg">' + esc(t(n.failed ? 'nearFail' : 'nearNone')) + '</div>';
    else {
      /* the closest that answers emergencies first, then everything else by distance */
      var list = first ? [first].concat(n.places.filter(function (p) { return p !== first; })) : n.places;
      body = list.map(function (p) {
        var col = KC[p.kind] || KC.doctor, isF = first && p.id === first.id;
        var dir = 'https://www.google.com/maps/dir/?api=1&destination=' + p.lat + ',' + p.lon;
        return '<div class="pl' + (isF ? ' first' : '') + '"><i class="dot" style="background:' + col + ';color:' + col + '"></i><div class="nm">' + (isF ? '<em>' + esc(t('closest')) + '</em>' : '') +
          '<b>' + esc(p.name) + '</b><span style="color:' + col + '">' + esc(t('k_' + (p.kind || 'doctor')).toUpperCase()) + ' · ' + esc(dist(p.m)) + '</span></div>' +
          (p.phone ? '<a class="c" href="tel:' + esc(String(p.phone).replace(/[^\d+]/g, '')) + '">' + esc(t('callIt')) + '</a>' : '') +
          '<a href="' + esc(dir) + '" target="_blank" rel="noopener">' + esc(t('dirs')) + '</a></div>';
      }).join('');
    }
    var who = h.you ? t('nearYou') : t('nearTitle', { name: String(h.sender.name || '').split(/\s+/)[0] });
    var html = '<div class="sh"><h3>' + esc(who) + '</h3><p class="sub">' + esc(t('nearSub')) + '</p><a class="sos" href="tel:' + t('emergNum') + '">' + esc(t('emerg')) + '</a>' + body + '<button type="button" class="x">' + esc(t('close')) + '</button></div>';
    if (el._h !== html) { el._h = html; el.innerHTML = html; el.querySelector('.x').onclick = function () { el.remove(); _nearFor = null; }; }
  }

  /* ── what the circle sees ── */
  var _help = [], _seen = {}, _busy = false, _ack = {};
  async function load(force) {
    if (!authed() || _busy) return;
    _busy = true;
    try {
      var r = await api('/care-help');
      if (r.ok) {
        _help = r.data.help || [];
        if (!_help.some(function (h) { return h.you; }) && _mine.length) unfollow();
        _help.forEach(function (h) { if (!_seen[h.id]) { _seen[h.id] = Date.now(); if (!h.you) showOnMap(h, true); } fetchNear(h, false); });
        paint(); renderNear();
      }
    } catch (e) {} finally { _busy = false; }
  }
  /* WHEREIS on the caller: the big radar is the area, the small one the room or the tightest circle */
  function showOnMap(h, first) {
    try {
      var c = null;
      if (!h.sender.is_home) c = (typeof DEMO_CONTACTS !== 'undefined' ? DEMO_CONTACTS : []).filter(function (x) { return x.care && x.care.userId === h.sender.id; })[0] || null;
      if (typeof closeBluf === 'function') { try { closeBluf(); } catch (e) {} }
      document.querySelectorAll('.cv-ov.open').forEach(function (x) { x.classList.remove('open'); });
      if (typeof appState !== 'undefined' && appState !== 'network' && typeof enterNetwork === 'function') enterNetwork();
      focusedContactId = c ? c.id : null;
      if (typeof WhereIs !== 'undefined') WhereIs.setMode('whereis');
      if (window.CovaraWhere) CovaraWhere.load(true);
      if (first) { try { navigator.vibrate && navigator.vibrate([400, 150, 400, 150, 400]); } catch (e) {} }
    } catch (e) {}
  }
  var tk = null, ac = null;
  function place() {
    if (!tk) return;
    var top = 0;
    ['helpFab', 'exitBtn'].forEach(function (id) { var e = document.getElementById(id); if (e && e.offsetParent !== null) top = Math.max(top, e.getBoundingClientRect().bottom); });
    document.querySelectorAll('.cvn-chip').forEach(function (e) { var r = e.getBoundingClientRect(); if (r.height && r.top < 120) top = Math.max(top, r.bottom); });
    tk.style.top = Math.round((top || 90) + 8) + 'px';
    if (ac) {
      var row = document.getElementById('cvnTop'), rr = row ? row.getBoundingClientRect() : null;
      if (rr && rr.height && rr.top > window.innerHeight * 0.5) { ac.style.top = Math.round(rr.top + rr.height / 2 - Math.max(19, ac.offsetHeight / 2)) + 'px'; }
      else { ac.style.top = Math.round((top || 90) + 8 + 52) + 'px'; }
    }
  }
  function line(h) {
    var me = h.you, parts = [];
    parts.push('<b>' + esc(me ? t('youCalled') : t('called', { name: String(h.sender.name || '').toUpperCase() })) + '</b>');
    parts.push(esc(hm(h.started_at)));
    if (h.room) parts.push(esc(t('room', { room: h.room })));
    if (h.location) { parts.push('<i>' + esc(t('live', { t: ago(h.location.at) })) + '</i>'); if (h.location.accuracy) parts.push(esc(t('acc', { d: dist(h.location.accuracy) }))); }
    else parts.push(esc(t('noPos')));
    if (!me && h.from_you_m != null) parts.push(esc(t('fromYou', { d: dist(h.from_you_m) })));
    if (me) parts.push(esc(t('sharing')));
    var n = nearOf(h), f = firstOf(n);
    if (f) parts.push('<i>' + esc(t('firstHelp', { name: f.name, kind: t('k_' + f.kind).toLowerCase(), d: dist(f.m) })) + '</i>');
    if ((h.responders || []).length) {
      var rd = {}; ((n && n.responders) || []).forEach(function (x) { rd[x.id] = x.m; });
      h.responders.forEach(function (x) { var nm = String(x.name || '').split(/\s+/)[0]; parts.push(esc(rd[x.id] != null ? t('comingD', { name: nm, d: dist(rd[x.id]) }) : t('coming', { names: nm }))); });
    } else parts.push(esc(t('nobody')));
    return parts.join(' · ');
  }
  function paint() {
    if (!tk) { tk = document.createElement('div'); tk.id = 'cvHelpTicker'; tk.setAttribute('role', 'alert'); document.body.appendChild(tk); ac = document.createElement('div'); ac.id = 'cvHelpActs'; document.body.appendChild(ac); }
    if (!_help.length) { var nm0 = document.getElementById('cvHelpNear'); if (nm0) nm0.remove(); _nearFor = null; tk.classList.remove('on'); ac.classList.remove('on'); document.body.classList.remove('cv-helping'); tk.innerHTML = ''; ac.innerHTML = ''; tk._sig = ''; nowSync(); return; }
    var h = _help[0], mine = myId(), onWay = (h.responders || []).some(function (x) { return x.id === mine; });
    var first = h.responders && h.responders[0] && h.responders[0].id === mine;
    var text = _help.map(line).join('<span style="padding:0 18px">•</span>');
    var sig = text + onWay + first + _help.length;
    if (tk._sig !== sig) {
      tk._sig = sig;
      var acts = h.you ? '<button type="button" data-a="near">' + esc(t('nearBtn')) + '</button><button type="button" class="pri" data-a="ok">' + esc(t('allRight')) + '</button>'
        : '<button type="button" class="pri" data-a="way"' + (onWay ? ' disabled' : '') + '>' + esc(onWay ? t('youOnWay') : t('onWay')) + '</button><button type="button" data-a="call">' + esc(t('call')) + '</button><button type="button" data-a="map">WHEREIS</button><button type="button" data-a="near">' + esc(t('nearBtn')) + '</button>' +
          (first || role() === 'home' ? '<button type="button" data-a="ok">' + esc(t('resolve')) + '</button>' : '');
      tk.innerHTML = '<div class="tk"><div class="lead">' + esc(t('lead')) + '</div><div class="track">' + text + '<span style="padding:0 46px"></span>' + text + '</div></div>';
      ac.innerHTML = acts;
      ac.querySelectorAll('[data-a]').forEach(function (b) {
        b.onclick = function () { return act(b.getAttribute('data-a'), h, b); };
      });
    }
    nowSync();
    tk.classList.add('on'); ac.classList.add('on'); document.body.classList.add('cv-helping'); place();
  }
  /* the same answers, from the ticker's buttons or from the Now strip */
  async function act(a, h, b) {
    if (a === 'way') { b.disabled = true; await api('/care-help/' + encodeURIComponent(h.id) + '/coming', { method: 'POST' }).catch(function () {}); load(true); }
    else if (a === 'ok') { var r = await api('/care-help/' + encodeURIComponent(h.id) + '/resolve', { method: 'POST' }).catch(function () { return { ok: false }; }); if (r.ok) { if (h.you) unfollow(); try { showToast(t('ok')); } catch (e) {} } load(true); }
    else if (a === 'map') showOnMap(h, false);
    else if (a === 'near') openNear(h);
    else if (a === 'call') {
      var c = (typeof DEMO_CONTACTS !== 'undefined' ? DEMO_CONTACTS : []).filter(function (x) { return x.care && x.care.userId === h.sender.id; })[0];
      if (c && typeof runContactQuickAction === 'function') runContactQuickAction('video', c);
    }
  }
  /* the Now strip shows each call for help first, in red */
  var _nowIds = {};
  function nowSync() {
    if (!window.CovaraNow) return;
    var keep = {}, mine = myId();
    _help.forEach(function (h) {
      var id = 'help-' + h.id; keep[id] = 1;
      var onWay = (h.responders || []).some(function (x) { return x.id === mine; }), nm = String(h.sender.name || '').split(/\s+/)[0];
      var body = [];
      if (h.room) body.push(t('room', { room: h.room }));
      if (!h.you && h.from_you_m != null) body.push(t('fromYou', { d: dist(h.from_you_m) }));
      body.push((h.responders || []).length ? t('coming', { names: h.responders.map(function (x) { return String(x.name || '').split(/\s+/)[0]; }).join(', ') }) : t('nobody'));
      var acts = h.you ? [{ label: t('allRight'), primary: true, onClick: function () { return act('ok', h, this); } }, { label: t('nearBtn'), onClick: function () { return act('near', h, this); } }]
        : [{ label: onWay ? t('youOnWay') : t('onWay'), primary: true, disabled: onWay, onClick: function () { return act('way', h, this); } }, { label: t('call'), onClick: function () { return act('call', h, this); } }, { label: t('nearBtn'), onClick: function () { return act('near', h, this); } }];
      CovaraNow.push({ id: id, rank: 0, icon: '🚨', lead: t('lead'), title: h.you ? t('nowYou') : t('nowCalled', { name: nm }), body: body.join(' · '), at: h.started_at, actions: acts });
    });
    Object.keys(_nowIds).forEach(function (id) { if (!keep[id]) CovaraNow.remove(id); });
    _nowIds = keep;
  }

  /* the Help button: in Covara it calls the whole circle */
  function bindFab() {
    var b = document.getElementById('helpFab');
    if (b && !b._cv && role()) { b._cv = true; b.onclick = function (e) { e.preventDefault(); e.stopPropagation(); card(); }; }
  }
  setInterval(function () { bindFab(); if (tk && tk.classList.contains('on')) place(); }, 1000);
  setInterval(function () { if (!document.hidden) load(false); }, 5000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) load(true); });
  setTimeout(function () { load(true); if (/#help=/.test(location.hash || '')) setTimeout(function () { if (_help[0]) showOnMap(_help[0], false); }, 2500); }, 3000);

  window.CovaraHelp = { open: card, start: start, load: load, list: function () { return _help; },
    forPerson: function (uid) { return _help.filter(function (h) { return h.sender.id === uid && h.location; })[0] || null; },
    near: function (h) { return nearOf(h); }, first: function (h) { return firstOf(nearOf(h)); }, kindName: function (k) { return t('k_' + (k || 'doctor')); }, colors: KC, openNear: openNear };
})();
