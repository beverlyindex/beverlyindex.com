/* Remiel: Covara, the person sheet and the care card.
   One tap on a face in the circle opens the PERSON SHEET from the bottom of the screen: the
   photo, one line on where they are, and big plain buttons (Call, Video call, Send a message,
   Where is, and on HOME's phone Drive to). One tap on HOME's own face opens the CARE CARD:
   five big tiles (Medicines, Visits, Health, Safety, Papers), each opening that part of HOME's
   care. Every button calls what the app already does; nothing new happens behind it.
   Beverly Index LLC */
(function () {
  'use strict';

  var IT = function () { try { return String(I18n.locale || '').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var S = {
    en: {
      call: 'Call {name}', video: 'Video call', message: 'Send a message', where: 'Where is {name}', drive: 'Drive to {name}', close: 'Close',
      finding: 'Finding {name}...', notShared: 'Location not shared', unknown: 'Location not known yet', withYou: 'With you', withHome: 'With {home}',
      away: '{d} away', fromHome: '{d} from {home}', atHomeOf: 'At {home}\'s home', atHome: 'At home', out: 'Out, {d} from home', outNoD: 'Out of the house',
      ago: ', seen {t} ago', now: ', seen just now', careOf: 'Care of {name}', yourCare: 'Your care',
      med: 'Medicines', visit: 'Visits', health: 'Health', safety: 'Safety', papers: 'Papers',
      medLate: '{n} late', medLate1: '1 late: {what}', medNow: 'Now: {what}', medNext: 'Next: {what} {t}', medNone: 'Nothing to take',
      visitNext: '{what}, {when}', visitNone: 'No visits coming up', healthWarn: 'A sudden change today', healthOk: 'How the day went',
      safetyLate: 'No word yet this morning', safetyOk: 'Emergency card, if lost', papersOk: 'Who decides, documents', papersDue: 'Name who decides',
      today: 'today', tomorrow: 'tomorrow', loading: 'Loading...', noCare: 'Not shared with you yet',
      driveTold: '{name} has been told you are coming, about {n} minutes away.', driveNo: '{name} has not shared where they are with you, so Covara cannot give directions.'
    },
    it: {
      call: 'Chiama {name}', video: 'Videochiamata', message: 'Manda un messaggio', where: 'Dov\'è {name}', drive: 'Vai da {name}', close: 'Chiudi',
      finding: 'Cerco {name}...', notShared: 'Posizione non condivisa', unknown: 'Posizione non ancora nota', withYou: 'Con te', withHome: 'Con {home}',
      away: 'a {d}', fromHome: 'a {d} da {home}', atHomeOf: 'A casa di {home}', atHome: 'A casa', out: 'Fuori, a {d} da casa', outNoD: 'Fuori casa',
      ago: ', visto {t} fa', now: ', visto adesso', careOf: 'Le cure di {name}', yourCare: 'Le tue cure',
      med: 'Medicine', visit: 'Visite', health: 'Salute', safety: 'Sicurezza', papers: 'Documenti',
      medLate: '{n} in ritardo', medLate1: 'In ritardo: {what}', medNow: 'Adesso: {what}', medNext: 'Poi: {what} {t}', medNone: 'Niente da prendere',
      visitNext: '{what}, {when}', visitNone: 'Nessuna visita in arrivo', healthWarn: 'Un cambiamento improvviso oggi', healthOk: 'Com\'è andata la giornata',
      safetyLate: 'Nessuna notizia stamattina', safetyOk: 'Scheda di emergenza, se si perde', papersOk: 'Chi decide, documenti', papersDue: 'Scegli chi decide',
      today: 'oggi', tomorrow: 'domani', loading: 'Carico...', noCare: 'Non ancora condiviso con te',
      driveTold: '{name} sa che stai arrivando, tra circa {n} minuti.', driveNo: '{name} non ha condiviso con te dove si trova, quindi Covara non può darti indicazioni.'
    }
  };
  function t(k, p) { var s = (IT() ? S.it : S.en)[k] || S.en[k] || k; if (p) s = s.replace(/\{(\w+)\}/g, function (m, x) { return p[x] != null ? p[x] : m; }); return s; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function authed() { try { return SyncEngine.isAuthenticated() && !SyncEngine.isLocalOnly(); } catch (e) { return false; } }
  function contacts() { return typeof DEMO_CONTACTS !== 'undefined' ? DEMO_CONTACTS : []; }
  function byId(id) { return contacts().filter(function (c) { return String(c.id) === String(id); })[0] || null; }
  function homeContact() { return contacts().filter(function (c) { return c.care && c.care.side === 'home' && c.care.state === 'active'; })[0] || null; }
  function first(n) { var w = String(n || '').trim().split(/\s+/)[0] || ''; return w && w === w.toUpperCase() && w.length > 1 ? w[0] + w.slice(1).toLowerCase() : w; }
  function myName() { var n = ''; try { n = String(userSphereName || ''); } catch (e) {} return first(n) || (IT() ? 'Casa' : 'Home'); }
  function homeName() { if (role() === 'home') return myName(); var h = homeContact(); return h ? first(h.first || h.last) : (IT() ? 'Casa' : 'Home'); }
  function initials(n) { return String(n || '').trim().split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase(); }
  function dist(m) {
    if (m == null || !isFinite(m)) return '';
    if (!IT()) { var ft = m * 3.281; return ft < 1000 ? Math.round(ft / 10) * 10 + ' ft' : (m / 1609.34).toFixed(m < 16093 ? 1 : 0) + ' mi'; }
    return m < 1000 ? Math.round(m / 5) * 5 + ' m' : (m / 1000).toFixed(m < 10000 ? 1 : 0) + ' km';
  }
  function ago(ts) {
    if (!ts) return ''; var s = Math.max(0, (Date.now() - ts) / 1000);
    if (s < 90) return t('now');
    return t('ago', { t: s < 3600 ? Math.round(s / 60) + ' min' : s < 86400 ? Math.round(s / 3600) + ' h' : Math.round(s / 86400) + (IT() ? ' g' : ' d') });
  }
  function hhmm(ms) { try { return new Date(ms).toLocaleTimeString(IT() ? 'it' : 'en-US', { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }
  function when(ms) {
    var d = new Date(ms), n = new Date(), tm = new Date(); tm.setDate(n.getDate() + 1);
    var day = d.toDateString() === n.toDateString() ? t('today') : d.toDateString() === tm.toDateString() ? t('tomorrow') : d.toLocaleDateString(IT() ? 'it' : 'en-US', { weekday: 'short', day: 'numeric' });
    return day + ' ' + hhmm(ms);
  }

  /* ── the look: NOUS glass over the galaxy, a soft glowing frame, gold and cyan ── */
  var css =
    /* above the Good morning bar (99988), below a call for help (100010 and up) */
    '#cvpDim{position:fixed;inset:0;z-index:99989;background:rgba(4,12,34,.46);-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);opacity:0;transition:opacity .3s ease;pointer-events:none}' +
    '#cvpDim.open{opacity:1;pointer-events:auto}' +
    '#cvpSheet{position:fixed;left:0;right:0;bottom:0;z-index:99989;margin:0 auto;max-width:520px;max-height:92vh;max-height:92dvh;overflow-y:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;' +
      'padding:12px 16px calc(18px + env(safe-area-inset-bottom,0px));border-radius:26px 26px 0 0;color:#eef3fb;font-family:var(--nous-font,"Hanken Grotesk",system-ui,sans-serif);' +
      'background:linear-gradient(160deg,rgba(70,130,235,.22) 0%,rgba(22,48,110,.40) 50%,rgba(10,22,60,.62) 100%);-webkit-backdrop-filter:blur(22px) saturate(160%);backdrop-filter:blur(22px) saturate(160%);' +
      'border:1px solid rgba(150,200,255,.45);border-bottom:none;box-shadow:0 0 0 1px rgba(56,189,248,.12),0 -6px 34px rgba(70,150,255,.34),inset 0 1px 0 rgba(255,255,255,.18),inset 0 0 30px rgba(110,170,255,.10);' +
      'transform:translateY(105%);transition:transform .34s cubic-bezier(.2,.8,.2,1);text-shadow:0 1px 2px rgba(2,8,24,.55)}' +
    '#cvpSheet.open{transform:none}' +
    '#cvpSheet .cvp-grab{width:44px;height:5px;border-radius:3px;background:rgba(190,215,255,.45);margin:0 auto 6px}' +
    '#cvpSheet .cvp-x{position:absolute;top:10px;right:12px;width:48px;height:48px;border-radius:50%;border:1px solid rgba(150,200,255,.45);background:rgba(20,44,100,.35);color:#dce8ff;font:600 26px/1 system-ui,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(70,150,255,.25)}' +
    '#cvpSheet canvas.cvp-photo{position:static;display:block;width:min(176px,44vw);height:min(176px,44vw);border-radius:50%;margin:8px auto 10px;box-shadow:0 0 0 2px rgba(255,210,77,.75),0 0 0 6px rgba(56,189,248,.18),0 0 46px rgba(56,189,248,.45)}' +
    '#cvpSheet .cvp-name{text-align:center;font-weight:800;font-size:34px;line-height:1.1;letter-spacing:.3px;margin:2px 0 4px}' +
    '#cvpSheet .cvp-line{text-align:center;font:600 16px/1.35 "JetBrains Mono","SF Mono",monospace;color:#9fd8ff;min-height:22px;margin:0 8px 16px}' +
    '#cvpSheet .cvp-line.out{color:#ffd24d}' +
    '#cvpSheet .cvp-btns{display:flex;flex-direction:column;gap:10px}' +
    '#cvpSheet .cvp-b{display:block;width:100%;min-height:58px;padding:10px 18px;border-radius:18px;border:1px solid rgba(150,200,255,.48);cursor:pointer;text-align:center;color:#f2f7ff;font:700 20px/1.2 var(--nous-font,"Hanken Grotesk",system-ui,sans-serif);' +
      'background:linear-gradient(155deg,rgba(80,140,240,.26),rgba(18,40,96,.46));box-shadow:0 0 16px rgba(70,150,255,.26),inset 0 1px 0 rgba(255,255,255,.16);text-shadow:0 1px 2px rgba(2,8,24,.55)}' +
    '#cvpSheet .cvp-b:active{transform:scale(.985)}' +
    '#cvpSheet .cvp-b.pri{border-color:rgba(56,189,248,.8);background:linear-gradient(155deg,rgba(56,189,248,.42),rgba(20,70,150,.55));box-shadow:0 0 22px rgba(56,189,248,.45),inset 0 1px 0 rgba(255,255,255,.2)}' +
    '#cvpSheet .cvp-b.gold{border-color:#ffd24d;color:#2a1600;text-shadow:none;background:linear-gradient(155deg,rgba(255,210,77,.96),rgba(217,154,0,.95));box-shadow:0 0 22px rgba(255,200,60,.45)}' +
    '#cvpSheet .cvp-b[disabled]{opacity:.55}' +
    '#cvpSheet .cvp-title{text-align:center;font-weight:800;font-size:26px;margin:6px 56px 2px}' +
    '#cvpSheet .cvp-sub{text-align:center;font:600 14px/1.3 "JetBrains Mono","SF Mono",monospace;color:#9fd8ff;margin:0 8px 14px}' +
    '#cvpSheet .cvp-head{display:flex;align-items:center;gap:14px;margin:4px 56px 14px 2px}' +
    '#cvpSheet .cvp-head canvas.cvp-photo{width:76px;height:76px;margin:0;flex:none}' +
    '#cvpSheet .cvp-head .cvp-title{text-align:left;margin:0;font-size:24px}' +
    '#cvpSheet .cvp-head .cvp-sub{text-align:left;margin:2px 0 0}' +
    '#cvpSheet .cvp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '#cvpSheet .cvp-tile{position:relative;min-height:112px;padding:14px 14px 12px;border-radius:20px;border:1px solid rgba(150,200,255,.48);cursor:pointer;text-align:left;color:#f2f7ff;display:flex;flex-direction:column;justify-content:space-between;gap:8px;' +
      'background:linear-gradient(155deg,rgba(80,140,240,.24),rgba(18,40,96,.48));box-shadow:0 0 18px rgba(70,150,255,.26),inset 0 1px 0 rgba(255,255,255,.16);font-family:var(--nous-font,"Hanken Grotesk",system-ui,sans-serif);text-shadow:0 1px 2px rgba(2,8,24,.55)}' +
    '#cvpSheet .cvp-tile:last-child{grid-column:1 / -1;min-height:84px}' +
    '#cvpSheet .cvp-tile b{font-size:24px;font-weight:800;letter-spacing:.2px}' +
    '#cvpSheet .cvp-tile span{font:600 13px/1.3 "JetBrains Mono","SF Mono",monospace;color:#b9d6ff}' +
    '#cvpSheet .cvp-tile.late{border-color:rgba(239,68,68,.85);box-shadow:0 0 22px rgba(239,68,68,.38),inset 0 1px 0 rgba(255,255,255,.14)}#cvpSheet .cvp-tile.late span{color:#ffb4b4}' +
    '#cvpSheet .cvp-tile.due{border-color:rgba(255,210,77,.9);box-shadow:0 0 22px rgba(255,210,77,.32),inset 0 1px 0 rgba(255,255,255,.14)}#cvpSheet .cvp-tile.due span{color:#ffe08a}' +
    '#cvpSheet .cvp-tile:active{transform:scale(.985)}' +
    '@media (prefers-reduced-motion: reduce){#cvpSheet,#cvpDim{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var dim = null, sheet = null, _raf = 0, _src = null, _cv = null, _who = '', _seq = 0, _hist = false;
  function build() {
    if (sheet) return;
    dim = document.createElement('div'); dim.id = 'cvpDim';
    sheet = document.createElement('div'); sheet.id = 'cvpSheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true');
    dim.addEventListener('click', function () { close(); });
    /* the galaxy under the sheet must not take the taps meant for it */
    ['touchstart', 'touchend', 'mousedown', 'mouseup', 'click'].forEach(function (ev) { sheet.addEventListener(ev, function (e) { e.stopPropagation(); }); dim.addEventListener(ev, function (e) { e.stopPropagation(); }); });
    document.body.appendChild(dim); document.body.appendChild(sheet);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) close(); });
    /* the Android back button closes the sheet first */
    window.addEventListener('popstate', function () { if (_hist) { _hist = false; close(true); } });
  }
  var _isOpen = false;
  function isOpen() { return _isOpen; }

  /* the photo: whatever the app draws in that person's sphere (a picture, a video frame), else initials on a glowing orb */
  function photoSource(c) {
    try {
      if (!c) return (typeof mediaFrame !== 'undefined' && mediaFrame) ? mediaFrame : null;
      var p = contactPhotos.get(c.id); return p && p.img ? p.img : null;
    } catch (e) { return null; }
  }
  function paintPhoto(name) {
    if (!_cv) return;
    var D = _cv.width, x = _cv.getContext('2d'), img = _src;
    var iw = img && (img.naturalWidth || img.videoWidth || img.width), ih = img && (img.naturalHeight || img.videoHeight || img.height);
    x.save(); x.clearRect(0, 0, D, D); x.beginPath(); x.arc(D / 2, D / 2, D / 2, 0, Math.PI * 2); x.clip();
    var g = x.createRadialGradient(D * .35, D * .3, 0, D / 2, D / 2, D / 2); g.addColorStop(0, '#9fe7ff'); g.addColorStop(.55, '#2f8ee0'); g.addColorStop(1, '#0b2c66');
    x.fillStyle = g; x.fillRect(0, 0, D, D);
    var drew = false;
    if (img && iw && ih) { try { var sc = Math.max(D / iw, D / ih); x.drawImage(img, (D - iw * sc) / 2, (D - ih * sc) / 2, iw * sc, ih * sc); drew = true; } catch (e) {} }
    if (!drew) { x.font = '800 ' + Math.round(D * .36) + 'px "Hanken Grotesk",system-ui,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#06101f'; x.fillText(initials(name), D / 2, D / 2 + D * .02); }
    x.restore();
  }
  function photoCanvas(c, name) {
    var cv = document.createElement('canvas'); cv.className = 'cvp-photo'; cv.width = cv.height = 352; cv.setAttribute('aria-hidden', 'true');
    _cv = cv; _src = photoSource(c);
    var live = _src && (_src.tagName === 'VIDEO' || _src.tagName === 'CANVAS');
    cancelAnimationFrame(_raf);
    (function loop() { paintPhoto(name); if (live && isOpen()) _raf = requestAnimationFrame(loop); })();
    return cv;
  }

  function show(html, head) {
    build();
    sheet.innerHTML = '<div class="cvp-grab"></div><button type="button" class="cvp-x" aria-label="' + esc(t('close')) + '">×</button>' + html;
    sheet.querySelector('.cvp-x').onclick = function () { close(); };
    if (head) head(sheet);
    sheet.scrollTop = 0; _isOpen = true;
    requestAnimationFrame(function () { dim.classList.add('open'); sheet.classList.add('open'); });
    if (!_hist) { try { history.pushState({ cvp: 1 }, ''); _hist = true; } catch (e) {} }
    document.body.classList.add('cvp-open');
  }
  /* fromBack: the Android back button already took the history step */
  function close(fromBack) {
    if (!sheet) return;
    _seq++; cancelAnimationFrame(_raf); _isOpen = false;
    dim.classList.remove('open'); sheet.classList.remove('open');
    document.body.classList.remove('cvp-open');
    if (_hist && !fromBack) { _hist = false; try { history.back(); } catch (e) {} }
  }

  /* ── where a person is, in one line: GET /care/whereis as WHEREIS asks it ── */
  function api(path) { return SyncEngine.apiFetch(path, { method: 'GET' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }
  function homeUser() { var h = homeContact(); return role() === 'away' && h ? h.care.userId : ''; }
  function whereQuery(memberUserId) {
    var q = [], hu = homeUser(); if (hu) q.push('home=' + encodeURIComponent(hu)); if (memberUserId) q.push('who=' + encodeURIComponent(memberUserId));
    return '/care/whereis' + (q.length ? '?' + q.join('&') : '');
  }
  function memberLine(d) {
    if (!d) return { text: t('unknown') };
    if (d.share && !d.share.location) return { text: t('notShared') };
    if (!d.location) return { text: t('unknown') };
    var hn = homeName(), self = role() === 'home', s = '', out = false;
    if (d.with_home && d.with_home.with) s = self ? t('withYou') : t('withHome', { home: hn });
    else if (d.at_home === true) s = self ? t('atHome') : t('atHomeOf', { home: hn });
    else if (d.with_home && d.with_home.m != null) { s = self ? t('away', { d: dist(d.with_home.m) }) : t('fromHome', { d: dist(d.with_home.m), home: hn }); out = true; }
    else if (d.at_home === false && d.from_home_m != null) { s = t('fromHome', { d: dist(d.from_home_m), home: hn }); out = true; }
    else s = t('unknown');
    return { text: s + ago(d.location.at), out: out };
  }
  function homeLine(d) {
    if (!d) return null;
    if (d.share && !d.share.location) return { text: t('notShared') };
    if (!d.location) return null;
    var s = d.inside ? d.inside.name : d.at_home === true ? t('atHome') : d.at_home === false ? (d.from_home_m != null ? t('out', { d: dist(d.from_home_m) }) : t('outNoD')) : '';
    if (!s) { var a = ago(d.location.at).replace(/^, /, ''); return { text: a.charAt(0).toUpperCase() + a.slice(1) }; }
    return { text: s + ago(d.location.at), out: d.at_home === false };
  }

  /* ── the person sheet ── */
  function open(contactId) {
    var c = byId(contactId);
    if (!c) return false;
    /* things in HOME's care drawn as spheres keep their own behaviour */
    if (c.cvItem && c.cvItem.kind !== 'person') return false;
    /* HOME's own face opens HOME's care, wherever it is drawn */
    if (c.care && c.care.side === 'home' && c.care.state === 'active') return openCare();
    var nm = first(c.first || c.last || c.cvTitle) || '';
    var isMember = !!(c.care && c.care.userId && c.care.state === 'active');
    var seq = ++_seq;
    _who = c.id;
    var html = '<div class="cvp-name">' + esc(c.cvTitle ? c.cvTitle + ' ' + nm : nm) + '</div>' +
      '<div class="cvp-line" data-line>' + (isMember ? esc(t('finding', { name: nm })) : esc((c.care && c.care.role) || c.relationship || '')) + '</div>' +
      '<div class="cvp-btns">' +
        '<button type="button" class="cvp-b pri" data-a="phone">' + esc(t('call', { name: nm })) + '</button>' +
        '<button type="button" class="cvp-b" data-a="video">' + esc(t('video')) + '</button>' +
        '<button type="button" class="cvp-b" data-a="sms">' + esc(t('message')) + '</button>' +
        (isMember ? '<button type="button" class="cvp-b" data-a="where">' + esc(t('where', { name: nm })) + '</button>' : '') +
        (isMember && role() === 'home' ? '<button type="button" class="cvp-b gold" data-a="drive" hidden>' + esc(t('drive', { name: nm })) + '</button>' : '') +
      '</div>';
    show(html, function (el) { el.insertBefore(photoCanvas(c, nm), el.querySelector('.cvp-name')); });
    sheet.setAttribute('aria-label', nm);
    sheet.querySelectorAll('[data-a]').forEach(function (b) { b.onclick = function () { act(b.getAttribute('data-a'), c, nm, b); }; });
    if (isMember && authed()) api(whereQuery(c.care.userId)).then(function (d) {
      if (seq !== _seq || !isOpen()) return;
      var L = memberLine(d), el = sheet.querySelector('[data-line]');
      if (el) { el.textContent = L.text; el.classList.toggle('out', !!L.out); }
      /* Drive to: only when that person shares where they are with HOME */
      var dv = sheet.querySelector('[data-a=drive]'); if (dv) dv.hidden = !(d && d.location && !(d.share && !d.share.location));
    });
    return true;
  }
  function fresh(c) { return byId(c.id) || c; }
  function act(a, c, nm, btn) {
    c = fresh(c);
    if (a === 'phone' || a === 'video' || a === 'sms') {
      close();
      setTimeout(function () { try { runContactQuickAction(a, c); } catch (e) {} }, 60);
      return;
    }
    if (a === 'where') {
      close();
      try { focusedContactId = c.id; } catch (e) {}
      try { netSpin = false; } catch (e) {}
      try { WhereIs.setMode('whereis'); } catch (e) {}
      try { if (window.CovaraWhere) CovaraWhere.load(true); } catch (e) {}
      return;
    }
    if (a === 'drive') { driveTo(c, nm, btn); }
  }
  /* the same request WHEREIS's own Drive to button makes (covara-where.js driveGo) */
  function driveTo(c, nm, btn) {
    if (btn) btn.disabled = true;
    var go = function (pos) {
      var body = { user: c.care.userId }; if (pos) { body.lat = pos.lat; body.lon = pos.lon; }
      SyncEngine.apiFetch('/care/drive/to', { method: 'POST', body: JSON.stringify(body) }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; });
      }).catch(function () { return { ok: false, j: {} }; }).then(function (res) {
        if (btn) btn.disabled = false;
        if (!res.ok || !res.j.to) { try { showToast(t('driveNo', { name: nm })); } catch (e) {} return; }
        try { showToast(t('driveTold', { name: nm, n: res.j.minutes || '?' })); } catch (e) {}
        close();
        var lat = res.j.to.lat, lon = res.j.to.lon, ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
        var url = ios ? 'https://maps.apple.com/?daddr=' + lat + ',' + lon + '&dirflg=d' : 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lon + '&travelmode=driving';
        setTimeout(function () { try { window.open(url, '_blank'); } catch (e) { location.href = url; } }, 900);
      });
    };
    var done = false, fin = function (p) { if (done) return; done = true; go(p); };
    try { navigator.geolocation.getCurrentPosition(function (p) { fin({ lat: p.coords.latitude, lon: p.coords.longitude }); }, function () { fin(null); }, { maximumAge: 60000, timeout: 4000 }); } catch (e) { fin(null); }
    setTimeout(function () { fin(null); }, 4500);
  }

  /* ── the care card: HOME's care in five big tiles ── */
  var TILES = ['med', 'visit', 'health', 'safety', 'papers'];
  function tileStatus(k) {
    var d = null, ls = null;
    try { d = window.CovaraView && CovaraView.data(); ls = CovaraView.lists && CovaraView.lists(); } catch (e) {}
    if (!d) return { text: authed() ? t('loading') : '' };
    if (d.s && !d.s.edit && (k === 'med' || k === 'health')) return { text: t('noCare') };
    try {
      if (k === 'med' && ls) {
        var late = ls.med.filter(function (x) { return x.n.state === 'late'; });
        if (late.length > 1) return { text: t('medLate', { n: late.length }), st: 'late' };
        if (late.length) return { text: t('medLate1', { what: late[0].it.title }), st: 'late' };
        var due = ls.med.filter(function (x) { return x.n.state === 'due'; })[0];
        if (due) return { text: t('medNow', { what: due.it.title }), st: 'due' };
        var nx = ls.med.filter(function (x) { return isFinite(x.n.at) && x.n.state !== 'done'; })[0];
        return { text: nx ? t('medNext', { what: nx.it.title, t: hhmm(nx.n.at) }) : t('medNone') };
      }
      if (k === 'visit' && ls) {
        var a = ls.appt.filter(function (x) { return x.n.state !== 'done'; })[0];
        return a ? { text: t('visitNext', { what: a.it.title, when: when(a.it.at) }), st: a.it.at - Date.now() < 864e5 ? 'due' : '' } : { text: t('visitNone') };
      }
      if (k === 'health') return d.warn ? { text: t('healthWarn'), st: 'late' } : { text: t('healthOk') };
      if (k === 'safety') return d.morning && d.morning.late ? { text: t('safetyLate'), st: 'late' } : { text: t('safetyOk') };
      if (k === 'papers') return d.proxy && d.proxy.proxy ? { text: t('papersOk') } : { text: t('papersDue'), st: 'due' };
    } catch (e) {}
    return { text: '' };
  }
  function openCare() {
    var self = role() === 'home', h = self ? null : homeContact();
    if (!self && !h) return false;
    var nm = homeName(), seq = ++_seq;
    _who = '__care__';
    var html = '<div class="cvp-head"><div data-ph></div><div><div class="cvp-title">' + esc(nm) + '</div><div class="cvp-sub" data-line>' + esc(self ? t('yourCare') : t('careOf', { name: nm })) + '</div></div></div>' +
      '<div class="cvp-grid">' + TILES.map(function (k) { return '<button type="button" class="cvp-tile" data-k="' + k + '"><b>' + esc(t(k)) + '</b><span data-s></span></button>'; }).join('') + '</div>';
    show(html, function (el) { var ph = el.querySelector('[data-ph]'); ph.parentNode.replaceChild(photoCanvas(h, nm), ph); });
    sheet.setAttribute('aria-label', self ? t('yourCare') : t('careOf', { name: nm }));
    function paint() {
      if (seq !== _seq || !isOpen()) return;
      sheet.querySelectorAll('.cvp-tile').forEach(function (b) {
        var s = tileStatus(b.getAttribute('data-k')), sp = b.querySelector('[data-s]');
        if (sp.textContent !== s.text) sp.textContent = s.text;
        b.classList.toggle('late', s.st === 'late'); b.classList.toggle('due', s.st === 'due');
      });
      setTimeout(paint, 1500);
    }
    paint();
    sheet.querySelectorAll('.cvp-tile').forEach(function (b) { b.onclick = function () { openSection(b.getAttribute('data-k')); }; });
    /* on the family's phone: how HOME is now, and when HOME was last seen */
    if (!self && authed()) api(whereQuery('')).then(function (d) {
      if (seq !== _seq || !isOpen()) return;
      var L = homeLine(d), el = sheet.querySelector('[data-line]');
      if (L && el) { el.textContent = L.text; el.classList.toggle('out', !!L.out); }
    });
    return true;
  }
  /* A tile opens that part of HOME's care in covara-view.js's panel. The panel shows only while no
     other sphere is chosen and WHEREIS is not up, so both are put back first. */
  function openSection(k) {
    close();
    try { focusedContactId = null; } catch (e) {}
    try { if (typeof WhereIs !== 'undefined' && WhereIs.mode && WhereIs.mode() === 'whereis') WhereIs.setMode('comm'); } catch (e) {}
    try { if (window.CovaraView) { if (CovaraView.section && CovaraView.section() === k) CovaraView.open(''); CovaraView.open(k); } } catch (e) {}
    /* the panel sits in the upper left: keep its head clear of a bar shown across the top (Good morning) */
    try {
      var box = document.getElementById('cvTabs'), bar = document.getElementById('cvMorning');
      if (box && !box.classList.contains('in-card')) {
        var r = bar && !bar.hidden && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect() : null;
        box.style.top = r && r.height ? Math.round(r.bottom + 8) + 'px' : '';
      }
    } catch (e) {}
  }

  window.CovaraPerson = { open: open, openCare: openCare, close: function () { close(); }, isOpen: isOpen };
})();
