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
      hHealth: 'Health', visits: 'Visits', meds: 'Medicines', docs: 'Records', broadcast: 'Broadcast Contact', team: 'TEAM', bSent: 'Sent to {n} on your team.', bNone: 'Your message is empty.', bTitle: 'Message to your whole team', bSend: 'Send to everyone', bPh: 'Write your message', noEmail: 'No one on your team has an email address in Covara yet.',
      notes: 'Notes', calendar: 'Calendar', daily: 'Daily Schedule', alarms: 'Alarms', invites: 'Invites',
      camera: 'Camera', words: 'Words', mode: 'Mode', modeFull: 'Full view', modeOne: 'One-on-one',
      speak: 'Speak', on: 'ON', off: 'OFF', code: 'Team code', settings: 'Settings',
      whoVideo: 'Who do you want to video call?', whoPhone: 'Who do you want to call?', whoMessage: 'Who do you want to message?', whoEmail: 'Who do you want to email?',
      noTeam: 'No one is on your team yet. Covara, then Team code, invites someone.', close: 'Close',
      notYet: 'is not built yet. It is next on the list.', tapHome: 'Tap your sphere to close' },
    it: { contact: 'Contatti', health: 'Salute', journal: 'Diario', tools: 'Strumenti', where: 'WHEREIS / Sicurezza', covara: 'Covara', alert: 'ALLERTA',
      video: 'Videochiamata', phone: 'Telefonata', message: 'Messaggio', email: 'Email',
      hHealth: 'Salute', visits: 'Visite', meds: 'Medicine', docs: 'Cartelle', broadcast: 'Contatta tutti', team: 'TEAM', bSent: 'Inviato a {n} del tuo team.', bNone: 'Il messaggio è vuoto.', bTitle: 'Messaggio a tutto il team', bSend: 'Invia a tutti', bPh: 'Scrivi il messaggio', noEmail: 'Nessuno del tuo team ha ancora un indirizzo email in Covara.',
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
    var nodes = keys.map(function (k, i) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / keys.length;
      var el = node(k, g.cx + Math.cos(a) * R, g.cy + Math.sin(a) * R, d, extras && extras[k]);
      layer.appendChild(el); return { el: el, a: a };
    });
    spin(nodes, g, R);
    return g;
  }
  /* The rings turn slowly the whole time they are open (25 Oct 2026: "in-motion, slowly so that
     selections can be made comfortably"): one full turn every 90 seconds, clockwise, labels upright. */
  var _spinId = 0;
  function spin(nodes, g, R) {
    var id = ++_spinId, t0 = performance.now(), still = false;
    try { still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (still) return;
    function step(now) {
      if (id !== _spinId || !_state) return;
      var off = ((now - t0) / 90000) * 2 * Math.PI;
      nodes.forEach(function (n) { var a = n.a + off; n.el.style.left = (g.cx + Math.cos(a) * R) + 'px'; n.el.style.top = (g.cy + Math.sin(a) * R) + 'px'; });
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
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
    _spinId++; _state = ''; layer.classList.remove('open');
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
    /* AWAY spheres (25 Oct 2026): no card. The sphere stays chosen, the dream state shows it, and its
       choices sit beside it like HOME's Contact (see focusLabels below). */
    var op = CovaraPerson.open;
    CovaraPerson.open = function (id) {
      if (document.body.classList.contains('cv-main')) { var c = contactOf(id); if (c && isPerson(c)) { try { focusedContactId = c.id; netSpin = false; } catch (e) {} _tapped = c.id; _labelsOff = false; return true; } }
      return op.apply(this, arguments);
    };
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
      case 'mode': try { CovaraSimple.setFull(!CovaraSimple.full()); } catch (e) {} close(); return toast(t('mode') + ': ' + modeState());
      case 'speak': try { CovaraGuide.setOn(!CovaraGuide.on()); } catch (e) {} close(); return toast(t('speak') + ': ' + speakState());
      case 'broadcast': try { localStorage.setItem('rc:broadcast', broadcastOn() ? '0' : '1'); } catch (e) {} close(); return toast(t('broadcast') + ': ' + broadcastState());
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
  /* ── a teammate's sphere: Video call, Phone call, Message, Email, WHEREIS and ALERT beside it ── */
  function contactOf(id) { try { return DEMO_CONTACTS.filter(function (c) { return String(c.id) === String(id); })[0] || null; } catch (e) { return null; } }
  function isPerson(c) { return !!c && !(c.cvItem && c.cvItem.kind !== 'person'); }
  var focusLayer = document.createElement('div'); focusLayer.id = 'cvrFocus';
  var fcss = document.createElement('style');
  fcss.textContent = '#cvrFocus{position:fixed;inset:0;z-index:8990;pointer-events:none}#cvrFocus .cvr-pill{pointer-events:auto;opacity:1;transform:none;animation:cvrFade 1.57s ease-in-out infinite}#cvrFocus .cvr-pill.team{color:#ffd24d;border-color:rgba(255,210,77,.45)}';
  document.head.appendChild(fcss);
  var _fid = null, _fkeys = '', _fEls = [], _tapped = null, _labelsOff = false;
  function focusKeys(c) {
    var k = ['video', 'phone', 'message', 'email', 'where', 'alert'];
    try { if (c.care && c.care.userId && window.CovaraTeams && CovaraTeams.teamOf && CovaraTeams.teamOf(c.care.userId)) k.push('team'); } catch (e) {}
    return k;
  }
  function focusTick() {
    requestAnimationFrame(focusTick);
    if (!focusLayer.parentNode && document.body) document.body.appendChild(focusLayer);
    var id = null; try { id = focusedContactId; } catch (e) {}
    var c = id != null ? contactOf(id) : null;
    /* only for a sphere the person tapped; the galaxy's own rest-mode turns show the dream state alone */
    var ok = c && isPerson(c) && String(_tapped) === String(c.id) && !_state && document.body.classList.contains('cv-main') && typeof appState !== 'undefined' && appState === 'network';
    var node = null; if (ok) { try { node = NODES.filter(function (n) { return n.contact === c || String(n.contact.id) === String(c.id); })[0]; } catch (e) {} }
    if (!ok || !node) { if (_fid !== null) { focusLayer.innerHTML = ''; _fEls = []; _fid = null; _fkeys = ''; _aim = null; restoreSpot(); dreamPanel(null); if (_where) stopWhere(); } else levelOut(); return; }
    var keys = focusKeys(c);
    if (_fid !== c.id) { aim(node); dreamPanel(c); }
    if (_dpFor) { if (_where) { dp.classList.remove('on'); document.body.classList.remove('cv-dreaml'); } else { dp.classList.add('on'); document.body.classList.add('cv-dreaml'); placePanel(); } }
    steer();
    if (_fid !== c.id || _fkeys !== keys.join()) {
      _fid = c.id; _fkeys = keys.join(); focusLayer.innerHTML = '';
      _fEls = keys.map(function (k) { var b = pill(k, 'right'); if (k === 'team') b.classList.add('team'); b.onclick = function (e) { e.stopPropagation(); focusPick(k, c); }; focusLayer.appendChild(b); return b; });
    }
    var cv = document.getElementById('sphere'); if (!cv) return;
    var rect = cv.getBoundingClientRect(), p = projectNode(node);
    var r = node.r * p.scale * (typeof FOCUS_SCALE !== 'undefined' ? FOCUS_SCALE : 1.8);
    var sx = rect.left + p.sx, sy = rect.top + p.sy, W = rect.width;
    var left = false, gap = 10, Rr = r + gap, step = 5;   /* always on the right (25 Oct 2026) */
    var hs = _fEls.map(function (b) { return b.offsetHeight || 22; });
    var total = hs.reduce(function (a, h) { return a + h; }, 0) + step * (_fEls.length - 1), y = sy - total / 2;
    focusLayer.style.display = _labelsOff ? 'none' : '';
    _fEls.forEach(function (b, i) {
      var mid = y + hs[i] / 2, dy = mid - sy, off = Math.sqrt(Math.max(Rr * Rr - dy * dy, Math.pow(r * 0.55, 2)));
      b.classList.toggle('l', left);
      b.style.setProperty('--mw', Math.floor((left ? sx - off : W - (sx + off)) - 8) + 'px');
      b.style.top = y + 'px';
      if (left) { b.style.left = ''; b.style.right = (W - (sx - off)) + 'px'; } else { b.style.right = ''; b.style.left = (sx + off) + 'px'; }
      y += hs[i] + step;
    });
  }
  requestAnimationFrame(focusTick);
  /* 25 Oct 2026: "all of the spheres will need to rotate to give the selected sphere enough space to always have
     the 4 sub menu Contact items appear clearly on the right side of the selected sphere, and in the foreground."
     The turn that brings the chosen sphere nearest the viewer, left of centre and below HOME, clear of the
     dream picture (upper right) and the WHEREIS maps (upper left), is found once and eased into. */
  var _aim = null;
  function levelOut() { try { if (Math.abs(netPitch) > 0.002 && (focusedContactId == null)) netPitch *= 0.94; } catch (e) {} }
  function aim(node) {
    try {
      var cv = document.getElementById('sphere'), W = cv.getBoundingClientRect().width, H = cv.getBoundingClientRect().height;
      var y0 = netYaw, p0 = netPitch, best = null;
      /* 1. the whole galaxy turns until the chosen sphere is at the front, on the left */
      for (var yi = 0; yi < 72; yi++) for (var pi = -3; pi <= 3; pi++) {
        netYaw = y0 + yi * Math.PI / 36; netPitch = pi * 0.12;
        var q = projectNode(node);
        var score = q.z + Math.abs(q.sx - W * 0.30) * 2 + Math.abs(pi) * 10;
        if (!best || score < best.s) best = { s: score, yaw: netYaw, pitch: netPitch };
      }
      netYaw = y0; netPitch = p0;
      /* 2. then it settles in the clear space below HOME, left of centre, so its labels on the right
            never cross HOME, the dream picture (upper right) or the WHEREIS maps (upper left) */
      var cR = netCenterR(W, H), sx = W * 0.27, sy = Math.min(H - 140, H / 2 + cR * 2.6);
      var z2 = NET_DIST - 160, s = NET_FOV / (NET_FOV + z2), xp = (sx - W / 2) / s, y2 = (sy - H / 2) / s, z2p = z2 - NET_DIST;
      var cp = Math.cos(best.pitch), sp = Math.sin(best.pitch), cy = Math.cos(best.yaw), syw = Math.sin(best.yaw);
      var y = y2 * cp + z2p * sp, z1 = -y2 * sp + z2p * cp;
      var x = xp * cy - z1 * syw, z = xp * syw + z1 * cy;
      restoreSpot();
      node._cvSpot = { tx: node.tx, ty: node.ty, tz: node.tz }; _spotNode = node;
      node.tx = x; node.ty = y; node.tz = z;
      _aim = best;
    } catch (e) { _aim = null; }
  }
  var _spotNode = null;
  function restoreSpot() { var n = _spotNode; if (n && n._cvSpot) { n.tx = n._cvSpot.tx; n.ty = n._cvSpot.ty; n.tz = n._cvSpot.tz; delete n._cvSpot; } _spotNode = null; }
  function steer() {
    if (!_aim) return;
    try {
      var d = _aim.yaw - netYaw; d = Math.atan2(Math.sin(d), Math.cos(d));
      netYaw += d * 0.14; netPitch += (_aim.pitch - netPitch) * 0.14; netSpin = false; netVelYaw = 0; netVelPitch = 0;
      if (Math.abs(d) < 0.002 && Math.abs(_aim.pitch - netPitch) < 0.002) { netYaw = _aim.yaw; netPitch = _aim.pitch; _aim = null; }
    } catch (e) { _aim = null; }
  }
  /* The dream state's left side (25 Oct 2026): "the most up-to-date messages and notes, calendar, and schedule
     from AWAY as default". Hidden while WHEREIS shows the maps. */
  var dp = document.createElement('div'); dp.id = 'cvDreamL'; dp.hidden = true;
  var dcss = document.createElement('style');
  dcss.textContent = '#cvDreamL{position:fixed;z-index:8980;box-sizing:border-box;padding:10px 10px 8px;border-radius:16px;border:1px solid rgba(150,210,255,.30);background:linear-gradient(155deg,rgba(70,130,235,.14),rgba(14,30,78,.30));-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 0 18px rgba(56,189,248,.18);color:#e8f2ff;font:500 12px/1.3 "Hanken Grotesk",system-ui,sans-serif;overflow-y:auto;overscroll-behavior:contain;opacity:0;transition:opacity .35s;pointer-events:auto}' +
    '#cvDreamL.on{opacity:1}#cvDreamL[hidden]{display:none}#cvDreamL h4{margin:8px 0 3px;font:700 9.5px/1 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;color:#ffd24d}#cvDreamL h4:first-of-type{margin-top:0}' +
    '#cvDreamL .nm{font:800 14px/1.2 "Hanken Grotesk",system-ui,sans-serif;margin:0 0 4px}#cvDreamL .it{margin:0 0 4px;overflow-wrap:anywhere}#cvDreamL .tm{color:#9fc4ea;font:600 10px "JetBrains Mono",monospace}#cvDreamL .no{color:#8fa8cc;font-style:italic}' +
    'body.cv-main.cv-dreaml #dreamComm{display:none!important}';
  document.head.appendChild(dcss);
  var DS = { en: { msgs: 'Messages', notes: 'Notes', today: 'Today', coming: 'Coming up', noMsgs: 'No messages yet', noNotes: 'No notes about {n}', agreed: 'Agreed with {n}', noAgreed: 'Nothing agreed with {n} yet', todayW: 'Today', you: 'You' },
             it: { msgs: 'Messaggi', notes: 'Note', today: 'Oggi', coming: 'In arrivo', noMsgs: 'Nessun messaggio', noNotes: 'Nessuna nota su {n}', agreed: 'Concordato con {n}', noAgreed: 'Ancora niente di concordato con {n}', todayW: 'Oggi', you: 'Tu' } };
  function dt(k, n) { return ((DS[IT() ? 'it' : 'en'][k]) || k).replace('{n}', n || ''); }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }
  function hm(ts) { try { return new Date(ts).toLocaleTimeString(IT() ? 'it-IT' : 'en-US', { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }
  function dayAt(ts) { try { return new Date(ts).toLocaleDateString(IT() ? 'it-IT' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' }); } catch (e) { return ''; } }
  async function apiJ(path) { try { var r = await SyncEngine.apiFetch(path, { method: 'GET' }); if (!r.ok) return { ok: false, status: r.status }; return { ok: true, data: await r.json() }; } catch (e) { return { ok: false }; } }
  var _dpFor = null, _dpSeq = 0;
  async function dreamPanel(c) {
    var seq = ++_dpSeq;
    if (!c) { _dpFor = null; dp.classList.remove('on'); document.body.classList.remove('cv-dreaml'); setTimeout(function () { if (!_dpFor) dp.hidden = true; }, 350); return; }
    _dpFor = c.id; if (!dp.parentNode) document.body.appendChild(dp);
    var nm = (c.first || '').trim(), low = nm.toLowerCase();
    var h = '<div class="nm">' + esc(((c.first || '') + ' ' + (c.last || '')).trim()) + '</div>';
    /* messages: the conversation on this phone, newest last */
    var th = []; try { var v = await RemielDB.getSetting('sentinelMsg_' + c.id); th = Array.isArray(v) ? v : (v && Array.isArray(v.value) ? v.value : []); } catch (e) {}
    h += '<h4>' + dt('msgs') + '</h4>' + (th.length ? th.slice(-3).map(function (m) { return '<div class="it"><span class="tm">' + esc(m.from === 'center' ? dt('you') : nm) + ' · ' + esc(hm(m.ts)) + '</span><br>' + esc(m.text) + '</div>'; }).join('') : '<div class="it no">' + dt('noMsgs') + '</div>');
    /* notes from the Covara Button that name this person */
    var nr = await apiJ('/care-notes'), notes = nr.ok ? (nr.data.notes || []).filter(function (n) { return n.status !== 'deleted' && n.status !== 'dropped' && n.status !== 'joined' && ((n.person || '').toLowerCase() === low || (n.text || '').toLowerCase().indexOf(low) >= 0); }) : [];
    h += '<h4>' + dt('notes') + '</h4>' + (notes.length ? notes.slice(0, 3).map(function (n) { return '<div class="it">' + esc(n.text || n.title || '') + '</div>'; }).join('') : '<div class="it no">' + esc(dt('noNotes', nm)) + '</div>');
    /* 25 Oct 2026: "HOME only needs to see what is agreed upon between the two." Never the teammate's own
       calendar: only what sits in HOME's own day and calendar with this person, today first, then what is coming. */
    var uid = c.care && c.care.userId;
    function withThem(it) { var meta = it.meta || {}; return (it.title || '').toLowerCase().indexOf(low) >= 0 || String(meta.with || '').toLowerCase().indexOf(low) >= 0 || (uid && (meta.tags || []).indexOf(uid) >= 0); }
    var mine = await apiJ('/care/today');
    var today = ((mine.ok && (mine.data.items || (mine.data.today && mine.data.today.items))) || []).filter(function (x) { return withThem(x.item || x); });
    var all = await apiJ('/care/items'), now = Date.now(), end = new Date(); end.setHours(23, 59, 59, 999);
    var up = all.ok ? (all.data.items || []).filter(function (it) { return it.at && it.at > end.getTime() && withThem(it); }).sort(function (a, b) { return a.at - b.at; }) : [];
    h += '<h4>' + dt('agreed', nm) + '</h4>';
    if (!today.length && !up.length) h += '<div class="it no">' + esc(dt('noAgreed', nm)) + '</div>';
    h += today.slice(0, 4).map(function (x) { var it = x.item || x; return '<div class="it"><span class="tm">' + esc(dt('todayW')) + ' ' + esc(hm(x.at || it.at)) + '</span><br>' + esc(it.title || '') + '</div>'; }).join('');
    h += up.slice(0, 3).map(function (it) { return '<div class="it"><span class="tm">' + esc(dayAt(it.at)) + ' ' + esc(hm(it.at)) + '</span><br>' + esc(it.title || '') + '</div>'; }).join('');
    if (seq !== _dpSeq) return;
    dp.innerHTML = h; dp.hidden = false; placePanel();
    document.body.classList.add('cv-dreaml');
    requestAnimationFrame(function () { dp.classList.add('on'); });
  }
  function placePanel() {
    var cv = document.getElementById('sphere'), dr = window._dreamRect; if (!cv) return;
    var rect = cv.getBoundingClientRect(), top = rect.top + 64, right = dr && dr.r ? rect.left + dr.cx - dr.r - 10 : rect.left + rect.width * 0.45;
    dp.style.left = (rect.left + 10) + 'px'; dp.style.top = top + 'px';
    dp.style.width = Math.max(120, right - rect.left - 10) + 'px';
    dp.style.maxHeight = Math.max(160, (dr && dr.r ? rect.top + dr.cy + dr.r : rect.top + 320) - top) + 'px';
  }
  function focusPick(k, c) {
    _labelsOff = true;   /* a choice is made: the labels go until the sphere is tapped again; the sphere stays chosen */
    if (QUICK[k]) { try { runContactQuickAction(QUICK[k], c); } catch (e) {} return; }
    if (k === 'where') { _where = true; try { WhereIs.setMode('whereis'); } catch (e) {} return; }
    if (k === 'alert') { try { CovaraHelp.open(); } catch (e) {} return; }
    if (k === 'team') { try { focusedContactId = null; CovaraTeams.go(c.care.userId); } catch (e) {} return; }
  }

  window.CovaraRing = { isOpen: function () { return !!_state; }, where: function () { return _where; }, open: show, close: close, state: function () { return _state; } };
})();
