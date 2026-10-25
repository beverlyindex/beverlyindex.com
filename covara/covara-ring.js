/* Remiel: Covara, the HOME sphere ring (25 Oct 2026).
   Built from his UI design, kept word for word in remiel-covara-api docs/design/DESIGN-VERBATIM.md.
   HOME's phone: tap HOME, a ring of 7 (Contact, Health, Journal, Tools, WHEREIS / Safety, Covara, ALERT).
     Contact: 4 buttons on the right side. Health: 4 buttons on the left side.
     Journal (5), Tools (3), Covara (3): a sub-ring around the sphere.
   Team member's phone (AWAY): tap HOME, Contact's 4 and WHEREIS on the right, Journal's 4 and ALERT on the left.
   The sphere itself is Sentinel's own drawing; this module only adds the ring around it. */
(function () {
  'use strict';
  var IT = function () { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  var S = {
    en: { contact: 'Contact', health: 'Health', journal: 'Journal', tools: 'Tools', where: 'WHEREIS / Safety', covara: 'Covara', alert: 'ALERT',
      video: 'Video call', phone: 'Phone call', message: 'Message', email: 'Email',
      hHealth: 'Health', visits: 'Visits', meds: 'Medicines', docs: 'Records', broadcast: 'Broadcast Contact', bSent: 'Sent to {n} on your team.', bNone: 'Your message is empty.', bTitle: 'Message to your whole team', bSend: 'Send to everyone', bPh: 'Write your message', noEmail: 'No one on your team has an email address in Covara yet.',
      notes: 'Notes', calendar: 'Calendar', daily: 'Daily Schedule', alarms: 'Alarms', invites: 'Invites',
      camera: 'Camera', words: 'Words', mode: 'Mode', modeFull: 'Full view', modeOne: 'One-on-one',
      speak: 'Speak', on: 'ON', off: 'OFF', code: 'Team code', settings: 'Settings',
      whoVideo: 'Who do you want to video call?', whoPhone: 'Who do you want to call?', whoMessage: 'Who do you want to message?', whoEmail: 'Who do you want to email?',
      noTeam: 'No one is on your team yet. Covara, then Team code, invites someone.', close: 'Close',
      notYet: 'is not built yet. It is next on the list.', tapHome: 'Tap your sphere to close' },
    it: { contact: 'Contatti', health: 'Salute', journal: 'Diario', tools: 'Strumenti', where: 'WHEREIS / Sicurezza', covara: 'Covara', alert: 'ALLERTA',
      video: 'Videochiamata', phone: 'Telefonata', message: 'Messaggio', email: 'Email',
      hHealth: 'Salute', visits: 'Visite', meds: 'Medicine', docs: 'Cartelle', broadcast: 'Contatta tutti', bSent: 'Inviato a {n} del tuo team.', bNone: 'Il messaggio è vuoto.', bTitle: 'Messaggio a tutto il team', bSend: 'Invia a tutti', bPh: 'Scrivi il messaggio', noEmail: 'Nessuno del tuo team ha ancora un indirizzo email in Covara.',
      notes: 'Note', calendar: 'Calendario', daily: 'Programma del giorno', alarms: 'Promemoria', invites: 'Inviti',
      camera: 'Fotocamera', words: 'Parole', mode: 'Modalità', modeFull: 'Vista completa', modeOne: 'Uno a uno',
      speak: 'Voce', on: 'SÌ', off: 'NO', code: 'Codice del team', settings: 'Impostazioni',
      whoVideo: 'Chi vuoi videochiamare?', whoPhone: 'Chi vuoi chiamare?', whoMessage: 'A chi vuoi scrivere?', whoEmail: 'A chi vuoi mandare una email?',
      noTeam: 'Nel tuo team non c\'è ancora nessuno. Covara, poi Codice del team, invita qualcuno.', close: 'Chiudi',
      notYet: 'non è ancora pronto. È il prossimo della lista.', tapHome: 'Tocca la tua sfera per chiudere' }
  };
  function t(k) { if (k === 'daily') return today(); return (S[IT() ? 'it' : 'en'][k]) || S.en[k] || k; }
  /* "Daily Schedule" is today's name and the half of the day, from the phone's own clock:
     Monday AM, Monday PM (Italian: Lunedì mattina, Lunedì pomeriggio) */
  function today() {
    var d = new Date(), it = IT(), am = d.getHours() < 12, day = '';
    try { day = d.toLocaleDateString(it ? 'it-IT' : 'en-US', { weekday: 'long' }); } catch (e) {}
    if (!day) day = (it ? ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'] : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])[d.getDay()];
    day = day.charAt(0).toUpperCase() + day.slice(1);
    return day + ' ' + (it ? (am ? 'mattina' : 'pomeriggio') : (am ? 'AM' : 'PM'));
  }

  /* ── the menu, exactly as designed ── */
  var HOME_RING = [
    { k: 'contact', side: 'right', items: ['video', 'phone', 'message', 'email'] },
    { k: 'health', side: 'left', items: ['hHealth', 'visits', 'meds', 'docs'] },
    { k: 'journal', sub: ['notes', 'calendar', 'daily', 'alarms', 'invites'] },
    { k: 'tools', sub: ['camera', 'words', 'mode'] },
    { k: 'where' },
    { k: 'covara', sub: ['speak', 'broadcast', 'code', 'settings'] },
    { k: 'alert' }
  ];
  var AWAY_RIGHT = ['video', 'phone', 'message', 'email', 'where'];
  var AWAY_LEFT = ['calendar', 'daily', 'alarms', 'invites', 'alert'];

  /* ── look: Sentinel's glass spheres, deep blue, a ring of light ── */
  var css = document.createElement('style');
  css.textContent = [
    '#cvrHit{position:fixed;border-radius:50%;z-index:6;background:transparent;border:0;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}',
    '#cvrHit[hidden],#cvrLayer[hidden]{display:none!important}',
    '#cvrLayer{position:fixed;inset:0;z-index:9000;font-family:"Hanken Grotesk",system-ui,sans-serif;-webkit-tap-highlight-color:transparent}',
    '#cvrLayer .veil{position:absolute;inset:0;background:radial-gradient(circle at var(--cx) var(--cy),rgba(6,15,36,0) 0,rgba(6,15,36,0) var(--hole),rgba(6,15,36,.30) calc(var(--hole) + 40px),rgba(6,15,36,.42) 100%);opacity:0;transition:opacity .35s}',
    '#cvrLayer.open .veil{opacity:1}',
    '#cvrLayer svg.ring{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity .35s}',
    '#cvrLayer.open svg.ring.show{opacity:1}',
    '.cvr-node{position:absolute;width:var(--d);height:calc(var(--d) + 34px);margin-left:calc(var(--d) / -2);margin-top:calc(var(--d) / -2);display:flex;flex-direction:column;align-items:center;gap:5px;background:none;border:0;padding:0;color:#eaf6ff;cursor:pointer;opacity:0;transform:scale(.4);transition:opacity .3s,transform .35s cubic-bezier(.2,1.3,.4,1)}',
    '#cvrLayer.open .cvr-node.show{opacity:1;transform:scale(1)}',
    '.cvr-orb{width:var(--d);height:var(--d);border-radius:50%;flex-shrink:0;background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.95) 0,rgba(220,250,255,.75) 9%,#86e6ff 22%,#2bbcf3 52%,#0b78c0 82%,#06508a 100%);box-shadow:0 0 18px rgba(56,189,248,.55),0 0 2px rgba(255,255,255,.6) inset,0 -6px 14px rgba(0,40,90,.45) inset;animation:cvrBreathe 3.2s ease-in-out infinite}',
    '.cvr-node:nth-child(2n) .cvr-orb{animation-delay:-1.1s}.cvr-node:nth-child(3n) .cvr-orb{animation-delay:-2.2s}',
    '.cvr-node.alert .cvr-orb{background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.9) 0,rgba(255,215,215,.7) 9%,rgba(255,90,90,.55) 26%,rgba(200,20,30,.35) 60%,rgba(120,0,10,.25) 100%);box-shadow:0 0 0 2px #ff2a2a inset,0 0 22px rgba(255,40,40,.7)}',
    '.cvr-lab{font-size:13px;line-height:1.15;font-weight:700;text-align:center;width:110px;text-shadow:0 1px 6px rgba(0,10,30,.9);letter-spacing:.01em}',
    '.cvr-node.alert .cvr-lab{color:#ff4d4d;letter-spacing:.12em}',
    '.cvr-state{display:block;font:600 11px "JetBrains Mono",ui-monospace,monospace;color:#ffd24d;letter-spacing:.08em;margin-top:2px}',
    '@keyframes cvrBreathe{0%,100%{transform:scale(1);filter:brightness(1)}50%{transform:scale(1.06);filter:brightness(1.12)}}',
    /* Sentinel's own quick-action labels (drawQuickActionIcons in index.html): 12px text, a frosted see-through
       pill with only a faint edge, 26px apart, one width for the column, gently fading in and out */
    '.cvr-pill{position:absolute;display:block;width:max-content;padding:5px 10px;box-sizing:border-box;border-radius:6px;border:1px solid rgba(100,180,255,.07);background:rgba(12,14,24,.28);color:#d8e8ff;font:500 12px/1.15 -apple-system,system-ui,"Segoe UI",sans-serif;text-align:left;max-width:var(--mw);cursor:pointer;opacity:0;transform:translateX(var(--from));transition:opacity .3s,transform .35s ease}',
    '.cvr-pill.l{text-align:right}',
    '.cvr-pill::after{content:"";position:absolute;inset:-3px -6px}',
    '#cvrLayer.open .cvr-pill.show{opacity:1;transform:none;animation:cvrFade 1.57s ease-in-out infinite}',
    '@keyframes cvrFade{0%,100%{opacity:1}50%{opacity:.6}}',
    '.cvr-pill.alert{border:1px solid #ff2a2a;color:#ff3b3b;background:rgba(255,40,40,.06);letter-spacing:.1em;font-weight:600}',
    '.cvr-title{position:absolute;left:0;right:0;text-align:center;font:600 12px "JetBrains Mono",ui-monospace,monospace;letter-spacing:.22em;text-transform:uppercase;color:#ffd24d;text-shadow:0 1px 8px rgba(0,0,0,.8);opacity:0;transition:opacity .3s;pointer-events:none}',
    '#cvrLayer.open .cvr-title.show{opacity:1}',
    '.cvr-hint{position:absolute;left:0;right:0;text-align:center;font:500 12px "Hanken Grotesk",system-ui,sans-serif;color:rgba(200,225,255,.7);pointer-events:none;opacity:0;transition:opacity .4s}',
    '#cvrLayer.open .cvr-hint{opacity:1}',
    /* the roster page: who to call, message or email */
    '#cvrRoster{position:fixed;inset:0;z-index:100040;display:flex;flex-direction:column;align-items:center;padding:calc(env(safe-area-inset-top,0px) + 74px) 16px 24px;box-sizing:border-box;background:radial-gradient(120% 80% at 50% 35%,#173262 0,#0f2348 45%,#0a1834 80%,#060f24 100%);color:#eef6ff;font-family:"Hanken Grotesk",system-ui,sans-serif;opacity:0;transition:opacity .3s}',
    '#cvrRoster.open{opacity:1}#cvrRoster[hidden]{display:none}',
    '#cvrRoster h2{margin:0 0 6px;font-size:13px;font:600 12px "JetBrains Mono",monospace;letter-spacing:.22em;color:#ffd24d;text-transform:uppercase}',
    '#cvrRoster p.q{margin:0 0 26px;font-size:22px;font-weight:800;text-align:center}',
    '#cvrRoster .grid{display:flex;flex-wrap:wrap;justify-content:center;gap:22px 26px;max-width:420px}',
    '#cvrRoster .who{display:flex;flex-direction:column;align-items:center;gap:8px;background:none;border:0;color:#eaf6ff;font:700 15px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer}',
    '#cvrRoster .who .cvr-orb{--d:92px;width:92px;height:92px;display:flex;align-items:center;justify-content:center;font:800 30px "Hanken Grotesk",system-ui,sans-serif;color:#0b2540;background-size:cover;background-position:center}',
    '#cvrRoster .none{max-width:300px;text-align:center;color:#b9cbe8;font-size:16px;line-height:1.45}',
    '#cvrRoster .x{position:absolute;top:calc(env(safe-area-inset-top,0px) + 14px);right:16px;width:48px;height:48px;border-radius:50%;border:1px solid rgba(150,215,255,.5);background:rgba(40,90,180,.18);color:#eaf6ff;font-size:22px;cursor:pointer;box-shadow:0 0 14px rgba(56,189,248,.3)}',
    '#cvrMsg{position:fixed;inset:0;z-index:100040;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(6,15,36,.55);opacity:0;transition:opacity .25s}#cvrMsg.open{opacity:1}#cvrMsg[hidden]{display:none}',
    '#cvrMsg .box{position:relative;width:min(420px,100%);padding:22px 18px 18px;border-radius:22px;border:1px solid rgba(150,210,255,.45);background:linear-gradient(155deg,rgba(70,130,235,.20),rgba(14,30,78,.36));-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 0 22px rgba(70,150,255,.28);color:#eef6ff;font-family:"Hanken Grotesk",system-ui,sans-serif}',
    '#cvrMsg h2{margin:0 0 6px;font-size:19px;font-weight:800}#cvrMsg .who{color:#ffd24d;font:600 12px "JetBrains Mono",monospace;letter-spacing:.06em;margin-bottom:12px}',
    '#cvrMsg textarea{width:100%;box-sizing:border-box;border-radius:14px;border:1px solid rgba(150,200,255,.4);background:rgba(20,44,100,.3);color:#fff;font:500 16px "Hanken Grotesk",system-ui,sans-serif;padding:12px;resize:none}',
    '#cvrMsg .send{margin-top:12px;width:100%;min-height:50px;border-radius:16px;border:0;background:linear-gradient(180deg,#7ee3ff,#38bdf8);color:#04203a;font:800 16px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer}',
    '#cvrMsg .x{position:absolute;top:10px;right:10px;width:40px;height:40px;border-radius:50%;border:1px solid rgba(150,215,255,.5);background:transparent;color:#eaf6ff;font-size:20px;cursor:pointer}',
    '#cvrToast{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 40px);transform:translateX(-50%);z-index:100060;max-width:340px;padding:12px 18px;border-radius:16px;border:1px solid rgba(150,215,255,.5);background:linear-gradient(155deg,rgba(80,160,255,.22),rgba(14,40,96,.5));-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:#eef6ff;font:600 15px/1.35 "Hanken Grotesk",system-ui,sans-serif;text-align:center;box-shadow:0 0 18px rgba(56,189,248,.3);opacity:0;transition:opacity .3s;pointer-events:none}',
    '#cvrToast.on{opacity:1}',
    '@media (prefers-reduced-motion:reduce){.cvr-orb{animation:none}.cvr-node,.cvr-pill{transition:opacity .2s}}'
  ].join('');
  document.head.appendChild(css);

  var hit = document.createElement('button'); hit.id = 'cvrHit'; hit.type = 'button'; hit.hidden = true;
  var layer = document.createElement('div'); layer.id = 'cvrLayer'; layer.hidden = true;
  var _state = '';   /* '' closed, 'ring', 'sub:journal', 'side:contact', 'away', 'where' */
  var _where = false;

  function geo() {
    var cv = document.getElementById('sphere'); if (!cv || typeof netCenterR !== 'function') return null;
    var r = cv.getBoundingClientRect();
    return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, cR: netCenterR(r.width, r.height), W: r.width, H: r.height };
  }
  function mainState() {
    try { if (typeof appState !== 'undefined' && appState !== 'network') return false; } catch (e) {}
    try { if (typeof IsoView !== 'undefined' && IsoView.active && IsoView.active()) return false; } catch (e) {}
    return document.body.classList.contains('cv-main');
  }

  /* ── place the invisible tap area over HOME's sphere ── */
  function place() {
    if (!hit.parentNode) document.body.appendChild(hit);
    if (!layer.parentNode) document.body.appendChild(layer);
    var g = geo();
    /* the canvas answers taps on HOME's sphere itself (through openCare), so this stays out of the way */
    hit.hidden = true; if (!g || !mainState() || !role()) return;
    var d = g.cR * 2;
    hit.style.left = (g.cx - g.cR) + 'px'; hit.style.top = (g.cy - g.cR) + 'px'; hit.style.width = d + 'px'; hit.style.height = d + 'px';
    hit.setAttribute('aria-label', IT() ? 'Apri il menu' : 'Open the menu');
    hit.hidden = false;
  }

  function node(k, x, y, d, extra) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'cvr-node' + (k === 'alert' ? ' alert' : '');
    b.style.left = x + 'px'; b.style.top = y + 'px'; b.style.setProperty('--d', d + 'px'); b.setAttribute('data-k', k);
    b.innerHTML = '<span class="cvr-orb"></span><span class="cvr-lab">' + t(k) + (extra ? '<span class="cvr-state">' + extra + '</span>' : '') + '</span>';
    return b;
  }
  function pill(k, side) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'cvr-pill' + (side === 'left' ? ' l' : '') + (k === 'alert' ? ' alert' : '');
    b.style.setProperty('--from', (side === 'left' ? '30px' : '-30px'));
    b.setAttribute('data-k', k); b.textContent = t(k);
    return b;
  }
  function ringSvg(g, R) {
    var ns = 'http://www.w3.org/2000/svg', s = document.createElementNS(ns, 'svg'); s.setAttribute('class', 'ring');
    s.innerHTML = '<defs><linearGradient id="cvrG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7ee3ff" stop-opacity=".9"/><stop offset=".5" stop-color="#38bdf8" stop-opacity=".35"/><stop offset="1" stop-color="#7ee3ff" stop-opacity=".9"/></linearGradient></defs>' +
      '<circle cx="' + g.cx + '" cy="' + g.cy + '" r="' + R + '" fill="none" stroke="url(#cvrG)" stroke-width="2.5" style="filter:drop-shadow(0 0 6px rgba(56,189,248,.8))"/>' +
      '<circle cx="' + g.cx + '" cy="' + g.cy + '" r="' + R + '" fill="none" stroke="#e8fbff" stroke-width="3" stroke-linecap="round" stroke-dasharray="' + (R * 0.5) + ' ' + (R * 6) + '" style="filter:drop-shadow(0 0 8px #7ee3ff)"><animateTransform attributeName="transform" type="rotate" from="0 ' + g.cx + ' ' + g.cy + '" to="360 ' + g.cx + ' ' + g.cy + '" dur="9s" repeatCount="indefinite"/></circle>';
    return s;
  }
  function stage(g, titleKey) {
    layer.innerHTML = '<div class="veil"></div>';
    layer.style.setProperty('--cx', g.cx + 'px'); layer.style.setProperty('--cy', g.cy + 'px'); layer.style.setProperty('--hole', (g.cR * 1.18) + 'px');
    if (titleKey) { var tt = document.createElement('div'); tt.className = 'cvr-title'; tt.textContent = t(titleKey); tt.style.top = (g.cy - g.cR * 2.95) + 'px'; layer.appendChild(tt); }
    var h = document.createElement('div'); h.className = 'cvr-hint'; h.textContent = t('tapHome'); h.style.top = (g.cy + g.cR * 3.05) + 'px'; layer.appendChild(h);
    layer.hidden = false;
    requestAnimationFrame(function () { layer.classList.add('open'); layer.querySelectorAll('.cvr-node,.cvr-pill,.cvr-title,svg.ring').forEach(function (el, i) { setTimeout(function () { el.classList.add('show'); }, 40 + i * 45); }); });
  }
  /* a ring of nodes evenly round HOME, the first at the top, going clockwise, in the order of the design */
  function ringOf(keys, extras, titleKey) {
    var g = geo(); if (!g) return;
    var R = Math.min(g.cR * 1.78, g.W / 2 - 46), d = Math.max(50, Math.min(60, Math.round(g.cR * 0.72)));
    stage(g, titleKey || null);
    layer.appendChild(ringSvg(g, R));
    keys.forEach(function (k, i) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / keys.length;
      layer.appendChild(node(k, g.cx + Math.cos(a) * R, g.cy + Math.sin(a) * R, d, extras && extras[k]));
    });
    return g;
  }
  /* Labels beside the sphere follow its edge: each sits a little further out or in, on a circle just
     outside HOME's sphere, so the column curves with the sphere. Text starts at the sphere's side. */
  function sideOf(rightKeys, leftKeys, titleKey) {
    var g = geo(); if (!g) return;
    stage(g, titleKey);
    var gap = Math.max(14, 18 * (g.cR / 80)), Rr = g.cR + gap, step = 6;
    [[rightKeys, 'right'], [leftKeys, 'left']].forEach(function (p) {
      var keys = p[0] || []; if (!keys.length) return;
      var right = p[1] === 'right';
      var els = keys.map(function (k) { var b = pill(k, p[1]); b.style.setProperty('--mw', Math.floor(g.W / 2 - Rr - 8) + 'px'); b.style.visibility = 'hidden'; layer.appendChild(b); return b; });
      var hs = els.map(function (b) { return b.offsetHeight || 22; });
      var total = hs.reduce(function (a, h) { return a + h; }, 0) + step * (els.length - 1), y = g.cy - total / 2;
      els.forEach(function (b, i) {
        var mid = y + hs[i] / 2, dy = mid - g.cy;
        var off = Math.sqrt(Math.max(Rr * Rr - dy * dy, Math.pow(g.cR * 0.55, 2)));
        b.style.setProperty('--mw', Math.floor(g.W / 2 - off - 6) + 'px');
        b.style.top = y + 'px';
        if (right) b.style.left = (g.cx + off) + 'px'; else b.style.right = (g.W - (g.cx - off)) + 'px';
        b.style.visibility = '';
        y += hs[i] + step;
      });
    });
    return g;
  }
  function hold(on) {
    try { if (on) { netSpin = false; netVelYaw = 0; netVelPitch = 0; focusedContactId = null; } } catch (e) {}
  }
  /* Broadcast Contact (25 Oct 2026): ON by default. On HOME's own sphere, Contact reaches the whole team at once.
     OFF: once anyone on the team is on screen, Contact leaves HOME's ring; each person is reached from their own sphere. */
  function broadcastOn() { try { return localStorage.getItem('rc:broadcast') !== '0'; } catch (e) { return true; } }
  function broadcastState() { return broadcastOn() ? t('on') : t('off'); }
  function homeRingKeys() {
    var keys = HOME_RING.map(function (c) { return c.k; });
    if (!broadcastOn() && team().length) keys = keys.filter(function (k) { return k !== 'contact'; });
    return keys;
  }
  function speakState() { var on = false; try { on = !!(window.CovaraGuide && CovaraGuide.on()); } catch (e) {} return on ? t('on') : t('off'); }
  function modeState() { var f = false; try { f = !!(window.CovaraSimple && CovaraSimple.full()); } catch (e) {} return f ? t('modeFull') : t('modeOne'); }

  var _openedAt = 0;
  function show(state) {
    _state = state; hold(true); _openedAt = Date.now();
    layer.classList.remove('open');
    if (state === 'ring') ringOf(homeRingKeys());
    else if (state === 'away') sideOf(AWAY_RIGHT, AWAY_LEFT, null);
    else if (/^side:/.test(state)) { var c = cat(state.slice(5)); sideOf(c.side === 'right' ? c.items : [], c.side === 'left' ? c.items : [], null); }
    else if (/^sub:/.test(state)) {
      var s = cat(state.slice(4)), ex = {};
      if (s.k === 'covara') { ex.speak = speakState(); ex.broadcast = broadcastState(); }
      if (s.k === 'tools') ex.mode = modeState();
      ringOf(s.sub, ex, s.k);
    }
  }
  function cat(k) { return HOME_RING.filter(function (c) { return c.k === k; })[0]; }
  function close() {
    _state = ''; layer.classList.remove('open');
    setTimeout(function () { if (!_state) { layer.hidden = true; layer.innerHTML = ''; } }, 320);
  }
  function stopWhere() {
    if (!_where) return; _where = false;
    try { WhereIs.setMode('comm'); } catch (e) {}
  }

  /* ── taps ── */
  /* A tap on HOME's sphere reaches Covara as "open HOME's care" (covara-person.js). On the main screen
     that tap now opens the ring instead of the old care sheet. */
  var _last = 0;
  function homeTap() {
    var now = Date.now(); if (now - _last < 450) return; _last = now;
    if (_where) { stopWhere(); return; }
    if (_state) { close(); return; }
    show(role() === 'away' ? (homeOf() ? 'away' : '') : 'ring');
    if (!_state) close();
  }
  function wrapCare() {
    if (!window.CovaraPerson || CovaraPerson._ring) return;
    var oc = CovaraPerson.openCare;
    CovaraPerson.openCare = function () { if (document.body.classList.contains('cv-main')) { homeTap(); return true; } return oc.apply(this, arguments); };
    CovaraPerson._ring = 1;
  }
  hit.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); homeTap(); });
  layer.addEventListener('click', function (e) {
    if (Date.now() - _openedAt < 400) return;   /* the same tap that opened it */
    var b = e.target.closest && e.target.closest('[data-k]');
    if (!b) { close(); return; }   /* a tap on empty space goes back to the main screen */
    e.stopPropagation();
    pick(b.getAttribute('data-k'));
  });

  function homeOf() { try { var c = window.CovaraView && CovaraView.centre(); return c && c.contact; } catch (e) { return null; } }
  function toast(msg) {
    var el = document.getElementById('cvrToast'); if (!el) { el = document.createElement('div'); el.id = 'cvrToast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove('on'); }, 3200);
  }
  function notYet(k) { toast(t(k) + ' ' + t('notYet')); }
  function run(fn) { close(); setTimeout(function () { try { fn(); } catch (e) { try { console.warn('[CovaraRing]', e); } catch (_) {} } }, 200); }

  var QUICK = { video: 'video', phone: 'phone', message: 'sms', email: 'email' };
  function pick(k) {
    var away = role() === 'away';
    if (_state === 'ring') {
      var c = cat(k);
      if (c && c.side) return show('side:' + k);
      if (c && c.sub) return show('sub:' + k);
    }
    if (QUICK[k]) {
      if (away) { var h = homeOf(); return run(function () { runContactQuickAction(QUICK[k], h); }); }
      if (broadcastOn()) {
        if (k === 'video') return run(function () { callEveryone(false); });
        if (k === 'phone') return run(function () { callEveryone(true); });
        if (k === 'message') return run(messageEveryone);
        if (k === 'email') return run(emailEveryone);
      }
      return run(function () { roster(k); });
    }
    switch (k) {
      case 'hHealth': return run(function () { CovaraView.open('health'); });
      case 'visits': return run(function () { CovaraView.open('visit'); });
      case 'meds': return run(function () { CovaraView.open('med'); });
      case 'docs': return run(function () { CovaraRecords.open(); });
      case 'notes': return run(function () { CovaraNotes.journal(''); });
      case 'daily': return run(function () { CovaraPlan.open(); });
      case 'calendar': case 'alarms': case 'invites': return notYet(k);
      case 'camera': return run(function () { CovaraCamera.open(); });
      case 'words': return run(function () { CovaraWords.open(); });
      case 'mode': try { CovaraSimple.setFull(!CovaraSimple.full()); } catch (e) {} return show('sub:tools');
      case 'speak': try { CovaraGuide.setOn(!CovaraGuide.on()); } catch (e) {} return show('sub:covara');
      case 'broadcast': try { localStorage.setItem('rc:broadcast', broadcastOn() ? '0' : '1'); } catch (e) {} return show('sub:covara');
      case 'code': return run(function () { CovaraCare.openCode(); });
      case 'settings': return run(function () { SettingsPanel.open(); });
      case 'where': close(); _where = true; try { if (away) focusedContactId = null; WhereIs.setMode('whereis'); } catch (e) {} return;
      case 'alert': return run(function () { CovaraHelp.open(); });
    }
  }

  /* HOME's own Video call: every sphere on the screen is called at once, no second screen
     (25 Oct 2026: "If I press my own video call BUTTON, all of the spheres on the screen get called.") */
  function team() { try { return CovaraCare.careContacts().filter(function (c) { return c.care.state === 'active' && c.care.side === 'away'; }); } catch (e) { return []; } }
  /* Phone call to everyone: the same Covara call, with the camera left off */
  function audioOnlyNext() {
    var md = navigator.mediaDevices; if (!md || !md.getUserMedia) return;
    if (!md._cvAudio) { var g = md.getUserMedia.bind(md); md.getUserMedia = function (c) { if (window.__cvAudioOnly) { window.__cvAudioOnly = false; c = Object.assign({}, c || {}, { video: false }); } return g(c); }; md._cvAudio = 1; }
    window.__cvAudioOnly = true; setTimeout(function () { window.__cvAudioOnly = false; }, 15000);
  }
  function callEveryone(voiceOnly) {
    var all = team();
    if (!all.length) { toast(t('noTeam')); return; }
    if (voiceOnly) audioOnlyNext();
    if (all.length === 1) { runContactQuickAction('video', all[0]); return; }
    SentinelCall.callGroup({ contactIds: all.map(function (c) { return c.id; }), name: IT() ? 'Il mio team' : 'My team' });
  }
  /* Message to everyone: one box, one Send; it lands in each person's conversation */
  function messageEveryone() {
    var all = team(); if (!all.length) { toast(t('noTeam')); return; }
    var el = document.getElementById('cvrMsg');
    if (!el) { el = document.createElement('div'); el.id = 'cvrMsg'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); document.body.appendChild(el); }
    el.innerHTML = '<div class="box"><button class="x" type="button" aria-label="' + t('close') + '">&times;</button><h2>' + t('bTitle') + '</h2>' +
      '<div class="who">' + all.map(function (c) { return (c.first || c.last || '').replace(/</g, '&lt;'); }).join(' · ') + '</div>' +
      '<textarea id="cvrMsgT" rows="4" placeholder="' + t('bPh') + '"></textarea><button class="send" type="button">' + t('bSend') + '</button></div>';
    el.hidden = false; requestAnimationFrame(function () { el.classList.add('open'); try { el.querySelector('textarea').focus(); } catch (e) {} });
    function shut() { el.classList.remove('open'); setTimeout(function () { el.hidden = true; }, 250); }
    el.querySelector('.x').onclick = shut;
    el.querySelector('.send').onclick = async function () {
      var txt = (el.querySelector('textarea').value || '').trim(); if (!txt) { toast(t('bNone')); return; }
      var n = 0; for (var i = 0; i < all.length; i++) { try { await SentinelMessaging.sendTo(all[i].id, txt); n++; } catch (e) {} }
      shut(); toast(t('bSent').replace('{n}', n));
    };
  }
  /* Email to everyone: the phone's mail opens with the whole team as recipients */
  function emailEveryone() {
    var to = team().map(function (c) { return c.email; }).filter(function (e) { return e && /@/.test(e); });
    if (!to.length) { toast(t('noEmail')); return; }
    window.location.href = 'mailto:' + to.map(encodeURIComponent).join(',');
  }

  /* ── the roster page: the team as spheres; tap one to call, message or email them ── */
  function roster(k) {
    var el = document.getElementById('cvrRoster');
    if (!el) { el = document.createElement('div'); el.id = 'cvrRoster'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); document.body.appendChild(el); }
    var team = []; try { team = CovaraCare.careContacts().filter(function (c) { return c.care.state === 'active' && c.care.side === 'away'; }); } catch (e) {}
    var q = { video: 'whoVideo', phone: 'whoPhone', message: 'whoMessage', email: 'whoEmail' }[k];
    var html = '<button class="x" type="button" aria-label="' + t('close') + '">&times;</button><h2>' + t(k) + '</h2><p class="q">' + t(q) + '</p>';
    if (!team.length) html += '<div class="none">' + t('noTeam') + '</div>';
    else html += '<div class="grid">' + team.map(function (c, i) {
      var name = ((c.first || '') + ' ' + (c.last || '')).trim() || '?', ini = name.split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase();
      var ph = ''; try { var p = contactPhotos.get(c.id); if (p && p.img && p.img.src) ph = p.img.src; } catch (e) {}
      return '<button class="who" type="button" data-i="' + i + '"><span class="cvr-orb"' + (ph ? ' style="background-image:url(' + ph + ')"' : '') + '>' + (ph ? '' : ini) + '</span>' + name.replace(/</g, '&lt;') + '</button>';
    }).join('') + '</div>';
    el.innerHTML = html; el.hidden = false; requestAnimationFrame(function () { el.classList.add('open'); });
    function shut() { el.classList.remove('open'); setTimeout(function () { el.hidden = true; }, 300); }
    el.querySelector('.x').onclick = shut;
    el.querySelectorAll('.who').forEach(function (b) { b.onclick = function () { var c = team[+b.getAttribute('data-i')]; shut(); setTimeout(function () { try { runContactQuickAction(QUICK[k], c); } catch (e) {} }, 150); }; });
  }

  /* keep the tap area on HOME's sphere and hold the galaxy still while the ring is open */
  /* Sentinel's first-call tip no longer covers the screen when a call starts */
  function quietTips() { try { if (typeof SentinelGuide !== 'undefined' && !SentinelGuide._ring) { SentinelGuide.onCall = function () {}; SentinelGuide._ring = 1; } } catch (e) {} }
  setInterval(function () { wrapCare(); quietTips(); place(); if (_state) hold(true); }, 300);
  window.addEventListener('resize', function () { if (_state) show(_state); });
  window.CovaraRing = { isOpen: function () { return !!_state; }, where: function () { return _where; }, open: show, close: close, state: function () { return _state; } };
})();
