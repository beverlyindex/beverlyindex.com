/* Remiel: Covara, fresh build (26 Oct 2026).
   Covara is Sentinel: index.html is Remiel Sentinel's own app with Covara's name, logo, storage, server and
   access codes. This file is the only thing added on top. It does exactly what the 25 Oct design asks:
   - the main screen is Sentinel's centre sphere (HOME, the person holding the phone) and the revolving galaxy of
     the team, with no buttons; the revolving spheres never cover the centre sphere and never stop moving;
   - a tap on HOME brings the ring of 7 (Contact, Health, Journal, Tools, WHEREIS / Safety, Covara, ALERT);
   - a tap on a teammate turns the galaxy so that person comes forward, with Video call, Phone call, Message,
     Email, WHEREIS and ALERT beside them, which stay until the next command, and the dream state above. */
(function () {
  'use strict';
  var IT = function () { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var S = {
    en: { contact: 'Contact', health: 'Health', journal: 'Journal', tools: 'Tools', where: 'WHEREIS / Safety', covara: 'Covara', alert: 'ALERT',
      video: 'Video call', phone: 'Phone call', message: 'Message', email: 'Email', hHealth: 'Health', visits: 'Visits', meds: 'Medicines', records: 'Records',
      notes: 'Notes', calendar: 'Calendar', alarms: 'Alarms', invites: 'Invites', camera: 'Camera', words: 'Words', mode: 'Mode',
      speak: 'Speak', broadcast: 'Broadcast Contact', code: 'Team code', settings: 'Settings', add: 'Add to my team', AM: 'AM', PM: 'PM',
      on: 'ON', off: 'OFF', soon: '{x} is the next part of the rebuild.', noTeam: 'No one is on your team yet. Tap your sphere, then Covara, then Team code.',
      bcOn: 'Broadcast Contact is ON: Contact reaches your whole team.', bcOff: 'Broadcast Contact is OFF: tap a teammate to reach them.',
      spOn: 'Speak is ON.', spOff: 'Speak is OFF.',
      mTitle: 'Message to your whole team', mPh: 'Write your message', mSend: 'Send to everyone', mSent: 'Sent to {n} on your team.', empty: 'Nothing written yet.',
      eTitle: 'Email', eAll: 'Email to your whole team', eSubj: 'Subject', ePh: 'Write your email', eSend: 'Send email', eSent: 'Email sent to {n}.',
      eNone: 'No email address in Covara yet for {n}.', eNoneAll: 'No one on your team has an email address in Covara yet.', eLimit: "Today's emails are used up. Try again tomorrow.",
      eFail: 'The email could not be sent. Check the internet.', eOwn: 'Opening your mail app.', noPhone: 'No phone number in Covara yet for {n}.', close: 'Close',
      aTitleAll: 'ALERT your team', aSubAll: 'Everyone on your team is told at once and sees where you are.', aTitle: 'ALERT {n}', aSub: 'Only {n} is told, and sees where you are.',
      aHold: 'Hold to send', aHolding: 'Keep holding', aSentAll: 'Your team has been told.', aSent: '{n} has been told.', aFail: 'The ALERT could not be sent. Check the internet, or call 911.', cancel: 'Cancel',
      cTitle: 'Team code', cSub: 'Give this code to the person joining your team. It works for 24 hours.', cFail: 'A code could not be made. Check the internet.', cShare: 'Share', cCopied: 'Copied.',
      added: '{n} is on your team.', pending: 'wants to join',
      jTitle: 'Join a team', jSub: 'Someone gave you their team code? Type it here.', jPh: '6-digit code', jGo: 'Join', jBad: 'That code is not right, or it has expired. Ask for a new one.',
      jOwn: 'That is your own team code. Give it to the person joining you.', jFail: 'Could not join. Check the internet.', jDone: 'You are on {n}’s team.', jBusy: 'Joining…', or: 'or' },
    it: { contact: 'Contatti', health: 'Salute', journal: 'Diario', tools: 'Strumenti', where: 'WHEREIS / Sicurezza', covara: 'Covara', alert: 'ALLERTA',
      video: 'Videochiamata', phone: 'Telefonata', message: 'Messaggio', email: 'Email', hHealth: 'Salute', visits: 'Visite', meds: 'Medicine', records: 'Cartelle',
      notes: 'Note', calendar: 'Calendario', alarms: 'Sveglie', invites: 'Inviti', camera: 'Fotocamera', words: 'Parole', mode: 'Vista',
      speak: 'Voce', broadcast: 'Contatta tutti', code: 'Codice team', settings: 'Impostazioni', add: 'Aggiungi al team', AM: 'mattina', PM: 'pomeriggio',
      on: 'ON', off: 'OFF', soon: '{x} è la prossima parte della ricostruzione.', noTeam: 'Nel tuo team non c’è ancora nessuno. Tocca la tua sfera, poi Covara, poi Codice team.',
      bcOn: 'Contatta tutti è ON: Contatti raggiunge tutto il team.', bcOff: 'Contatta tutti è OFF: tocca una persona del team per raggiungerla.',
      spOn: 'Voce ON.', spOff: 'Voce OFF.',
      mTitle: 'Messaggio a tutto il team', mPh: 'Scrivi il messaggio', mSend: 'Invia a tutti', mSent: 'Inviato a {n} del team.', empty: 'Non hai scritto niente.',
      eTitle: 'Email', eAll: 'Email a tutto il team', eSubj: 'Oggetto', ePh: 'Scrivi la tua email', eSend: 'Invia email', eSent: 'Email inviata a {n}.',
      eNone: 'Nessun indirizzo email in Covara per {n}.', eNoneAll: 'Nessuno del team ha un indirizzo email in Covara.', eLimit: 'Le email di oggi sono finite. Riprova domani.',
      eFail: 'Non è stato possibile inviare l’email. Controlla internet.', eOwn: 'Apro la tua app di posta.', noPhone: 'Nessun numero di telefono in Covara per {n}.', close: 'Chiudi',
      aTitleAll: 'ALLERTA al team', aSubAll: 'Tutto il team viene avvisato subito e vede dove sei.', aTitle: 'ALLERTA a {n}', aSub: 'Viene avvisato solo {n}, che vede dove sei.',
      aHold: 'Tieni premuto per inviare', aHolding: 'Continua a tenere premuto', aSentAll: 'Il team è stato avvisato.', aSent: '{n} è stato avvisato.', aFail: 'Non è stato possibile inviare l’allerta. Controlla internet o chiama il 112.', cancel: 'Annulla',
      cTitle: 'Codice team', cSub: 'Dai questo codice a chi entra nel tuo team. Vale 24 ore.', cFail: 'Non è stato possibile creare un codice. Controlla internet.', cShare: 'Condividi', cCopied: 'Copiato.',
      added: '{n} è nel tuo team.', pending: 'vuole entrare',
      jTitle: 'Entra in un team', jSub: 'Qualcuno ti ha dato il suo codice team? Scrivilo qui.', jPh: 'Codice di 6 cifre', jGo: 'Entra', jBad: 'Il codice non è giusto o è scaduto. Chiedine uno nuovo.',
      jOwn: 'Questo è il codice del tuo team. Dallo a chi entra con te.', jFail: 'Non è stato possibile entrare. Controlla internet.', jDone: 'Sei nel team di {n}.', jBusy: 'Entro…', or: 'oppure' }
  };
  function t(k, p) { var s = (IT() ? S.it : S.en)[k] || S.en[k] || k; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function toast(m) { try { showToast(m); } catch (e) {} }
  function first(c) { return String((c && (c.first || c.last)) || '').split(/\s+/)[0]; }
  function authed() { try { return SyncEngine.isAuthenticated(); } catch (e) { return false; } }
  async function api(path, o) {
    var r = await SyncEngine.apiFetch(path, o || {});
    var d = {}; try { d = await r.json(); } catch (e) {}
    return { ok: r.ok, status: r.status, data: d };
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  document.documentElement.classList.add('cv');

  /* ── 1. The main screen: nothing but the logo, the name, HOME's sphere and the galaxy ── */
  var css = [
    /* Covara's deep blue, not Sentinel's black */
    'html.cv,html.cv body{background:radial-gradient(1100px 900px at 50% 42%,#1b3f7d 0,#0e2756 46%,#06142f 100%) fixed!important}',
    'html.cv .sphere-stage.network-mode{background:transparent!important}',
    /* every Sentinel control on the main screen goes: Covara has no buttons there */
    ['#exitBtn', '#settingsBtn', '#alertBell', '#alertPanel', '#backBtn', '#addPersonFab', '#importContactsFab', '#pulseBtn', '#clvToggle', '#helpFab', '#teamFab',
      '#sphereSize', '#guideTop', '#guideBottom', '.sentinel-guide', '#networkHint', '#dailyDigest', '.app-logo-tag', '#statusLabel', '.skip-link', '#svBadge', '.sv-badge',
      '#syncPrompt', '.sync-prompt', '.iso-btn', '.iso-x'].map(function (s) { return 'html.cv ' + s; }).join(',') + '{display:none!important}',
    /* the name across from the logo */
    '#cvName{position:fixed;top:max(18px,env(safe-area-inset-top,0px));right:max(16px,env(safe-area-inset-right,0px));z-index:60;color:#e8f2ff;font:700 13px/1.2 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.14em;text-align:right;max-width:60vw;pointer-events:none;text-shadow:0 0 12px rgba(56,189,248,.35)}',
    /* the rings: glass spheres, every one as transparent as ALERT, the icon in the middle */
    '#cvRing{position:fixed;inset:0;z-index:9000;display:none}#cvRing.on{display:block}',
    '.cvq{position:absolute;width:0;height:0;pointer-events:none}',
    '.cvq b{position:absolute;left:-23px;top:-23px;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;pointer-events:auto;cursor:pointer;',
    'background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.28) 0,rgba(150,210,255,.10) 32%,rgba(40,110,220,.06) 70%,rgba(20,60,140,.04) 100%);',
    'box-shadow:0 0 0 1.5px rgba(126,220,255,.85) inset,0 0 16px rgba(56,189,248,.45);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);animation:cvBreath 3.2s ease-in-out infinite}',
    '.cvq b svg{width:22px;height:22px;display:block;stroke:#dff4ff;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 4px rgba(120,210,255,.6))}',
    '.cvq.alert b{box-shadow:0 0 0 1.5px #ff2a2a inset,0 0 16px rgba(255,40,40,.55);background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.26) 0,rgba(255,150,150,.10) 32%,rgba(220,30,40,.06) 70%,rgba(120,0,10,.04) 100%)}',
    '.cvq.alert b svg{stroke:#ffdede;filter:drop-shadow(0 0 4px rgba(255,80,80,.7))}',
    '.cvq.lit b{box-shadow:0 0 0 2px #ffd24d inset,0 0 18px rgba(255,210,77,.6)}',
    '.cvq i{position:absolute;top:-8px;font:600 12px/16px "Hanken Grotesk",system-ui,sans-serif;font-style:normal;color:#dff2ff;white-space:nowrap;letter-spacing:.02em;text-shadow:0 0 8px rgba(0,20,60,.9),0 0 14px rgba(56,189,248,.35);pointer-events:auto;cursor:pointer}',
    '.cvq.alert i{color:#ff6b6b;letter-spacing:.1em;font-weight:700}',
    '.cvq em{font-style:normal;margin-left:6px;font:700 10px "JetBrains Mono",monospace;color:#ffd24d}',
    '@keyframes cvBreath{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}',
    /* labels beside a sphere: small, unframed, transparent, staggered around it, never centred */
    '#cvLabels{position:fixed;inset:0;z-index:8990;pointer-events:none}',
    '.cvl{position:absolute;pointer-events:auto;cursor:pointer;padding:5px 2px;font:600 15px/18px "Hanken Grotesk",system-ui,sans-serif;color:#e6f5ff;white-space:nowrap;text-shadow:0 0 8px rgba(0,20,60,.95),0 0 16px rgba(56,189,248,.4);animation:cvFade 2.6s ease-in-out infinite}',
    '.cvl.alert{color:#ff5a5a;letter-spacing:.1em;font-weight:700}.cvl.gold{color:#ffd24d}',
    '@keyframes cvFade{0%,100%{opacity:1}50%{opacity:.78}}',
    /* glass cards (message, email, ALERT, team code): transparent glass with a glowing frame */
    '.cvc{position:fixed;inset:0;z-index:100040;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(6,15,36,.45)}',
    '.cvc .box{position:relative;width:min(420px,100%);padding:22px 18px 18px;border-radius:22px;border:1px solid rgba(150,210,255,.5);background:linear-gradient(155deg,rgba(70,130,235,.20),rgba(14,30,78,.34));-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 0 22px rgba(70,150,255,.3);color:#eef6ff;font-family:"Hanken Grotesk",system-ui,sans-serif}',
    '.cvc h2{margin:0 0 6px;font-size:19px;font-weight:800}.cvc p{margin:0 0 12px;color:#cfe3ff;font-size:14px;line-height:1.4}.cvc .who{color:#ffd24d;font:600 12px "JetBrains Mono",monospace;letter-spacing:.06em;margin-bottom:12px}',
    '.cvc input,.cvc textarea{width:100%;box-sizing:border-box;border-radius:14px;border:1px solid rgba(150,200,255,.4);background:rgba(20,44,100,.3);color:#fff;font:500 16px "Hanken Grotesk",system-ui,sans-serif;padding:12px;resize:none;margin:0 0 10px}',
    '.cvc .go{width:100%;min-height:50px;border-radius:16px;border:0;background:linear-gradient(180deg,#7ee3ff,#38bdf8);color:#04203a;font:800 16px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer}.cvc .go[disabled]{opacity:.6}',
    '.cvc .x{position:absolute;top:10px;right:10px;width:40px;height:40px;border-radius:50%;border:1px solid rgba(150,210,255,.45);background:transparent;color:#eef6ff;font-size:22px;cursor:pointer}',
    '.cvc .code{font:800 34px "JetBrains Mono",monospace;letter-spacing:.12em;text-align:center;color:#ffd24d;margin:6px 0 14px;user-select:all;-webkit-user-select:all}',
    '.cvc.red .box{border-color:rgba(255,80,90,.75);background:linear-gradient(155deg,rgba(150,20,40,.30),rgba(40,6,16,.42));box-shadow:0 0 26px rgba(255,40,60,.35)}',
    '.cvc .hold{position:relative;display:block;margin:6px auto 12px;width:170px;height:170px;border-radius:50%;border:2px solid #ff2a2a;background:rgba(255,40,40,.08);color:#fff;font:800 15px "Hanken Grotesk",sans-serif;cursor:pointer;touch-action:none}',
    '.cvc .hold svg{position:absolute;inset:-6px;width:182px;height:182px;transform:rotate(-90deg)}.cvc .hold circle{fill:none;stroke:#ffd24d;stroke-width:5}',
    '.cvc .msg{min-height:20px;color:#ffe3a8;font-size:14px;text-align:center}.cvc .cx{display:block;margin:0 auto;min-height:42px;padding:0 24px;border-radius:21px;border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;font:700 14px "Hanken Grotesk",sans-serif;cursor:pointer}',
    /* 26 Oct RULE: nothing slides up from the bottom of the screen. Every card and every short message appears
       directly beneath the logo at the upper left, as a transparent glass card. */
    'html.cv{--cvTop:calc(max(10px,env(safe-area-inset-top,0px)) + 64px);--cvLeft:max(12px,env(safe-area-inset-left,0px));--cvW:min(420px,calc(100vw - 24px))}',
    'html.cv .cvc,html.cv .ui-confirm-overlay,html.cv .quick-dial-overlay{align-items:flex-start!important;justify-content:flex-start!important;padding:var(--cvTop) 12px 16px var(--cvLeft)!important;background:rgba(6,15,36,.28)!important}',
    'html.cv .cvc .box{width:var(--cvW)}',
    'html.cv .ui-confirm-box,html.cv .quick-dial{width:var(--cvW)!important;max-width:none!important;background:linear-gradient(155deg,rgba(70,130,235,.20),rgba(14,30,78,.34))!important;border:1px solid rgba(150,210,255,.5)!important;border-radius:20px!important;-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 0 22px rgba(70,150,255,.3)!important}',
    'html.cv .sentinel-toast,html.cv #swUpdateBanner,html.cv .lib-pill{top:var(--cvTop)!important;bottom:auto!important;left:var(--cvLeft)!important;right:auto!important;transform:none!important;max-width:var(--cvW)!important;text-align:left!important;',
    'background:linear-gradient(155deg,rgba(70,130,235,.24),rgba(14,30,78,.38))!important;color:#eef6ff!important;border:1px solid rgba(150,210,255,.55)!important;border-radius:16px!important;padding:10px 14px!important;font:600 14px/1.35 "Hanken Grotesk",system-ui,sans-serif!important;-webkit-backdrop-filter:blur(14px)!important;backdrop-filter:blur(14px)!important;box-shadow:0 0 18px rgba(70,150,255,.3)!important}',
    /* the message thread: a glass card under the logo, not a dark drawer */
    'html.cv .sentinel-msg-overlay{background:rgba(6,15,36,.28)!important;-webkit-backdrop-filter:blur(3px)!important;backdrop-filter:blur(3px)!important}',
    'html.cv .sentinel-msg-panel{position:fixed!important;top:var(--cvTop);left:var(--cvLeft);width:var(--cvW)!important;height:min(560px,calc(100dvh - var(--cvTop) - 16px))!important;border-radius:20px;border:1px solid rgba(150,210,255,.5)!important;overflow:hidden;',
    'background:linear-gradient(155deg,rgba(70,130,235,.22),rgba(14,30,78,.42))!important;-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 0 22px rgba(70,150,255,.3);transform:translateY(-8px)!important;opacity:0;transition:transform .25s ease,opacity .25s ease!important}',
    'html.cv .sentinel-msg-overlay.open .sentinel-msg-panel{transform:none!important;opacity:1}',
    'html.cv.cv-sending .sentinel-msg-overlay{opacity:0!important}',
    /* one thing at a time under the logo: a card or a message there sets aside what was there, and the labels beside a sphere wait behind it */
    'html.cv .sentinel-msg-overlay{z-index:9500!important}',
    'html.cv:has(.sentinel-toast) #dreamBrief,html.cv:has(.cvc) #dreamBrief,html.cv:has(.sentinel-msg-overlay.open) #dreamBrief{opacity:0!important;transition:opacity .2s}',
    'html.cv:has(.sentinel-msg-overlay.open) #cvLabels,html.cv:has(.cvc) #cvLabels{visibility:hidden}'
  ].join('');
  var st = document.createElement('style'); st.id = 'cvStyle'; st.textContent = css; document.head.appendChild(st);

  /* the user's own name, in full and in capitals, across from the logo */
  var nameEl = document.createElement('div'); nameEl.id = 'cvName';
  function myName() {
    var n = ''; try { n = (SyncEngine.getStatus() || {}).displayName || ''; } catch (e) {}
    try { if (!n && typeof userSphereName !== 'undefined') n = userSphereName || ''; } catch (e) {}
    return String(n || '').trim();
  }
  function placeName() {
    if (!document.body) return;
    if (!nameEl.parentNode) document.body.appendChild(nameEl);
    var on = typeof appState !== 'undefined' && appState === 'network';
    var n = on ? myName().toUpperCase() : '';
    if (nameEl.textContent !== n) nameEl.textContent = n;
  }

  /* After the access code, the intro and the first name, Covara opens on the galaxy every time */
  function onboarded() { return lsGet('rc:obDone') === '1'; }
  function toGalaxy() {
    try {
      if (appState === 'self' && onboarded() && !overlayOpen && !blufOpen && document.getElementById('stage') && document.getElementById('stage').style.display !== 'none') enterNetwork();
    } catch (e) {}
  }

  /* Sentinel's extras that Covara does not have on its main screen */
  function quiet() {
    try { _enterRestMode = function () {}; } catch (e) {}           /* no idle "rest mode" that cycles through people (it flashed spheres into the dream state) */
    try { drawQuickActionIcons = function () {}; } catch (e) {}     /* the labels beside a sphere are Covara's (below), not Sentinel's icons */
    try { openBluf = function () {}; } catch (e) {}                 /* no cards: everything is reached from the spheres */
    try { enterDetail = function () {}; } catch (e) {}
    try { Object.keys(SentinelGuide).forEach(function (k) { if (typeof SentinelGuide[k] === 'function') SentinelGuide[k] = function () {}; }); } catch (e) {}
    try { SentinelViews.openPanel = function () { ring.toggle(); }; } catch (e) {}   /* a tap on HOME opens the ring of 7 */
  }

  /* ── 2. The team: everyone on a Covara team with this person, in either direction ── */
  var TEAM_TAG = 'covara';
  function team() { try { return DEMO_CONTACTS.filter(function (c) { return c.care && c.care.userId; }); } catch (e) { return []; } }
  function activeTeam() { return team().filter(function (c) { return c.care.state === 'active'; }); }
  var _photos = {};
  async function syncTeam() {
    if (!authed()) return;
    var r = await api('/care/links').catch(function () { return { ok: false }; });
    if (!r.ok) return;
    var me = ''; try { me = SyncEngine.getUserId(); } catch (e) {}
    var rows = [];
    (r.data.as_home || []).forEach(function (l) { if (l.away && l.away.id) rows.push({ l: l, p: l.away, side: 'home' }); });
    (r.data.as_away || []).forEach(function (l) { if (l.home && l.home.id) rows.push({ l: l, p: l.home, side: 'away' }); });
    rows = rows.filter(function (x) { return x.p.id !== me && (x.l.status === 'active' || (x.l.status === 'pending' && x.side === 'home')); });
    var seen = {}, changed = false;
    for (var i = 0; i < rows.length; i++) {
      var x = rows[i], p = x.p; if (seen[p.id]) continue; seen[p.id] = 1;
      var c = team().filter(function (k) { return k.care.userId === p.id; })[0];
      var nm = String(p.name || '').trim().split(/\s+/);
      var care = { userId: p.id, linkId: x.l.id, side: x.side, state: x.l.status, relation: x.l.relation || '', tag: TEAM_TAG };
      if (!c) {
        c = { id: Date.now() + i, first: nm[0] || '?', last: nm.slice(1).join(' '), cat: 'family', sev: 4, phone: p.phone || '', email: p.email || '', sentinelId: p.sentinel_id || '', care: care };
        DEMO_CONTACTS.push(c); changed = true;
        try { await RemielDB.putContact(c); } catch (e) {}
      } else {
        var was = JSON.stringify([c.first, c.last, c.phone, c.email, c.sentinelId, c.care]);
        c.first = nm[0] || c.first; c.last = nm.slice(1).join(' '); if (p.phone) c.phone = p.phone; if (p.email) c.email = p.email; if (p.sentinel_id) c.sentinelId = p.sentinel_id; c.care = care;
        if (was !== JSON.stringify([c.first, c.last, c.phone, c.email, c.sentinelId, c.care])) { changed = true; try { await RemielDB.putContact(c); } catch (e) {} }
      }
      /* their picture or short video inside their sphere */
      if (p.sphere && _photos[c.id] !== p.sphere.split('?')[0]) {
        try {
          var pr = await SyncEngine.apiFetch(p.sphere);
          if (pr.ok) { var b = await pr.blob(); await SphereMedia.show(c.id, b); _photos[c.id] = p.sphere.split('?')[0]; }
        } catch (e) {}
      }
    }
    /* someone who left the team takes their sphere with them */
    var gone = team().filter(function (c) { return !seen[c.care.userId]; });
    for (var g = 0; g < gone.length; g++) {
      var ix = DEMO_CONTACTS.indexOf(gone[g]); if (ix >= 0) DEMO_CONTACTS.splice(ix, 1);
      try { await RemielDB.deleteContact(gone[g].id); } catch (e) {}
      try { if (focusedContactId === gone[g].id) focusedContactId = null; } catch (e) {}
      changed = true;
    }
    if (changed) rebuild();
  }
  /* only the team revolves around HOME (Sentinel's sample people never appear in Covara) */
  function teamFilter() {
    try {
      var keep = new Set(); team().forEach(function (c) { keep.add(c.id); keep.add(String(c.id)); });
      SentinelViews.getFilteredContacts = function () { var k = new Set(); team().forEach(function (c) { k.add(c.id); k.add(String(c.id)); }); return k; };
    } catch (e) {}
  }
  function rebuild() { try { if (typeof buildNodes === 'function') buildNodes(false); } catch (e) {} }

  /* ── 3. The galaxy: Sentinel's, smaller and closer, always moving, never over HOME ── */
  var ORBIT_PITCH = 0.78;            /* the galaxy is seen from a little above, so the team circles HOME */
  function geo() {
    var W = CV.width / DPR, H = CV.height / DPR, cR = netCenterR(W, H);
    return { W: W, H: H, cx: W / 2, cy: H / 2, cR: cR, s0: NET_FOV / (NET_FOV + NET_DIST) };
  }
  function layout() {
    try {
      var g = geo(), N = NODES.length; if (!N) return;
      var per = 8, rings = Math.ceil(N / per);
      NODES.forEach(function (n, i) {
        if (n._cvSpot) return;
        var k = Math.floor(i / per), m = Math.min(per, N - k * per), a = ((i % per) / m) * Math.PI * 2 + k * 0.4;
        var R = (g.cR * (2.15 + 0.62 * k)) / g.s0;     /* close to HOME, a second ring further out for a large team */
        n.tx = Math.cos(a) * R; n.tz = Math.sin(a) * R; n.ty = (k % 2 ? -1 : 1) * g.cR * 0.18 / g.s0;
        /* Sentinel's small, transparent spheres */
        n._baseR = (g.cR * 0.40) / g.s0; n.r = n._baseR * (typeof sphereSizeMul !== 'undefined' ? sphereSizeMul : 1);
      });
    } catch (e) {}
  }
  function wrapGalaxy() {
    if (wrapGalaxy.done || typeof buildNodes !== 'function' || typeof projectNode !== 'function') return;
    wrapGalaxy.done = true;
    var bn = buildNodes; buildNodes = function (fresh) { bn(fresh); layout(); };
    var rt = rebuildNodeTargets; rebuildNodeTargets = function () { rt(); layout(); };
    /* The rule (26 Oct): the centre sphere is never covered by a revolving sphere. Whatever the turn, a sphere
       that would reach HOME's sphere is kept just outside it. */
    var pn = projectNode;
    projectNode = function (node) {
      var p = pn(node);
      try {
        if (appState !== 'network') return p;
        var g = geo(), f = (focusedContactId === node.contact.id ? FOCUS_SCALE : 1);
        var r = node.r * p.scale * f, need = g.cR * 1.16 + r + 6;
        var dx = p.sx - g.cx, dy = p.sy - g.cy, d = Math.hypot(dx, dy);
        if (d < need) { if (d < 0.5) { dx = 0; dy = 1; d = 1; } p.sx = g.cx + dx / d * need; p.sy = g.cy + dy / d * need; }
      } catch (e) {}
      return p;
    };
    layout();
  }
  /* alive: the galaxy keeps turning unless someone has been chosen or a finger is on it */
  function alive() {
    try {
      if (appState !== 'network') return;
      if (focusedContactId != null) return;
      if (!netDragging) { netSpin = true; netPitch += (ORBIT_PITCH - netPitch) * 0.04; }
    } catch (e) {}
  }

  /* ── 4. HOME's ring of 7, and the sub-rings ── */
  var ICON = {
    contact: '<path d="M4 6h16v10H8l-4 4z"/>', health: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    journal: '<path d="M6 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6z"/><path d="M9 3v18M11.5 8h4M11.5 11h4"/>', tools: '<path d="M14.5 5.5a3.5 3.5 0 0 0-4.6 4.6L4 16l4 4 5.9-5.9a3.5 3.5 0 0 0 4.6-4.6l-2.2 2.2-2.4-.6-.6-2.4z"/>',
    where: '<path d="M12 21s-6-6.2-6-11a6 6 0 0 1 12 0c0 4.8-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>', covara: '<circle cx="12" cy="12" r="4.2"/><ellipse cx="12" cy="12" rx="9.5" ry="3.6" transform="rotate(-24 12 12)"/>',   /* a sphere in orbit; there is no "C" button in Covara */
    alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4.5M12 17.2v.3"/>',
    video: '<rect x="3" y="7" width="12" height="10" rx="2"/><path d="M15 11l6-3v8l-6-3z"/>', phone: '<path d="M6 3h3l1.5 4.5-2 1.3a11 11 0 0 0 6.7 6.7l1.3-2L21 15v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/>',
    message: '<path d="M4 6h16v10H8l-4 4z"/>', email: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 7l9 6 9-6"/>',
    notes: '<path d="M5 4h10l4 4v12H5z"/><path d="M14 4v5h5M8 13h8M8 16h6"/>', calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    daily: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>', alarms: '<circle cx="12" cy="13" r="7"/><path d="M12 10v3l2 1.5M5 4l2.5 2M19 4l-2.5 2"/>',
    invites: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 7l9 6 9-6M17 3v4M15 5h4"/>',
    camera: '<path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>', words: '<path d="M4 6h16M4 11h12M4 16h8"/><path d="M18 14v6M15 17h6"/>',
    mode: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="3.5"/>',
    speak: '<path d="M5 10v4h3l5 4V6L8 10z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>', broadcast: '<circle cx="12" cy="12" r="2"/><path d="M8 8a5.5 5.5 0 0 0 0 8M16 8a5.5 5.5 0 0 1 0 8M5.2 5.2a9.5 9.5 0 0 0 0 13.6M18.8 5.2a9.5 9.5 0 0 1 0 13.6"/>',
    code: '<path d="M7 8l-4 4 4 4M17 8l4 4-4 4M14 5l-4 14"/>', settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    hHealth: '<path d="M3 12h4l2-5 4 10 2-5h6"/>', visits: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M12 13v5M9.5 15.5h5"/>',
    meds: '<rect x="7" y="3" width="10" height="5" rx="1"/><rect x="6" y="8" width="12" height="13" rx="2"/><path d="M12 11.5v6M9 14.5h6"/>',
    records: '<path d="M4 7h6l2 2h8v10H4z"/><rect x="9" y="12" width="6" height="5" rx="1"/><path d="M10.5 12v-1.2a1.5 1.5 0 0 1 3 0V12"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICON[k] || ICON.covara) + '</svg>'; }
  function today() {
    var d = new Date(), loc = IT() ? 'it' : 'en-US';
    var day = d.toLocaleDateString(loc, { weekday: 'long' }); day = day.charAt(0).toUpperCase() + day.slice(1);
    return day + ' ' + (d.getHours() < 12 ? t('AM') : t('PM'));
  }
  function broadcastOn() { return lsGet('rc:broadcast') !== '0'; }
  function speakOn() { return lsGet('rc:speak') !== '0'; }
  function lab(k) {
    if (k === 'daily') return esc(today());
    if (k === 'broadcast') return esc(t('broadcast')) + '<em>' + (broadcastOn() ? t('on') : t('off')) + '</em>';
    if (k === 'speak') return esc(t('speak')) + '<em>' + (speakOn() ? t('on') : t('off')) + '</em>';
    return esc(t(k));
  }
  var SUB = {
    journal: ['notes', 'calendar', 'daily', 'alarms', 'invites'],
    tools: ['camera', 'words', 'mode'],
    covara: ['speak', 'broadcast', 'code', 'settings']
  };
  var SIDE = { contact: { side: 'right', items: ['video', 'phone', 'message', 'email'] }, health: { side: 'left', items: ['hHealth', 'visits', 'meds', 'records'] } };

  var ring = (function () {
    var el = document.createElement('div'); el.id = 'cvRing';
    var level = null, opened = 0, rot = 0, raf = 0, items = [], last = 0;
    el.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    el.addEventListener('click', function (e) {
      if (Date.now() - opened < 350) return;
      if (e.target === el) close();
    });
    function keys() {
      if (level) return SUB[level];
      var k = ['contact', 'health', 'journal', 'tools', 'where', 'covara', 'alert'];
      /* Broadcast Contact OFF: once a teammate is on screen, Contact leaves the ring (reach them from their sphere) */
      if (!broadcastOn() && activeTeam().length) k = k.filter(function (x) { return x !== 'contact'; });
      return k;
    }
    function build() {
      el.innerHTML = ''; items = [];
      keys().forEach(function (k) {
        var q = document.createElement('div'); q.className = 'cvq' + (k === 'alert' ? ' alert' : '');
        q.innerHTML = '<b role="button" tabindex="0" aria-label="' + esc(t(k)) + '">' + svg(k) + '</b><i>' + lab(k) + '</i>';
        var go = function (e) { e.stopPropagation(); e.preventDefault(); pick(k); };
        q.querySelector('b').addEventListener('click', go); q.querySelector('i').addEventListener('click', go);
        el.appendChild(q); items.push({ k: k, q: q });
      });
    }
    function place() {
      var g = geo(), rect = CV.getBoundingClientRect(), n = items.length;
      var cx = rect.left + g.cx, cy = rect.top + g.cy;
      var R = g.cR * 1.08 + 30;                       /* close to HOME's sphere (26 Oct): the ring sits just outside its rim */
      items.forEach(function (it, i) {
        var a = -Math.PI / 2 + (i / n) * Math.PI * 2 + rot;
        var x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
        it.q.style.left = x + 'px'; it.q.style.top = y + 'px';
        var lab = it.q.querySelector('i'), right = Math.cos(a) >= 0;
        /* the name sits outside the ring, leaning away from HOME, never centred */
        lab.style.left = right ? '27px' : ''; lab.style.right = right ? '' : '27px';
        lab.style.top = (Math.sin(a) * 14 - 8) + 'px';
      });
    }
    function tick(ts) {
      raf = requestAnimationFrame(tick);
      var dt = last ? Math.min(50, ts - last) : 16; last = ts;
      rot += dt * (Math.PI * 2 / 90000);              /* slowly: one turn every 90 seconds */
      place();
    }
    function show(lv) {
      level = lv || null; build();
      if (!el.parentNode) document.body.appendChild(el);
      el.classList.add('on'); opened = Date.now();
      try { focusedContactId = null; } catch (e) {}
      labels.clear();
      cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(tick);
    }
    function close() { el.classList.remove('on'); cancelAnimationFrame(raf); level = null; }
    function isOpen() { return el.classList.contains('on'); }
    function toggle() { if (isOpen()) close(); else show(null); }
    function pick(k) {
      if (SUB[k]) { show(k); return; }
      if (SIDE[k]) { close(); labels.home(k); return; }
      close();
      run(k);
    }
    return { show: show, close: close, toggle: toggle, isOpen: isOpen, rebuild: function () { if (isOpen()) build(); } };
  })();

  /* What each choice on HOME's own sphere does: on HOME's sphere it is for the whole team (Broadcast Contact) */
  function run(k) {
    var tm = activeTeam();
    switch (k) {
      case 'video': if (!tm.length) return toast(t('noTeam')); return callTeam(tm, false);
      case 'phone': if (!tm.length) return toast(t('noTeam')); return callTeam(tm, true);
      case 'message': if (!tm.length) return toast(t('noTeam')); return messageBox(tm);
      case 'email': if (!tm.length) return toast(t('noTeam')); return emailBox(tm, true);
      case 'alert': return alertCard(null);
      case 'broadcast': lsSet('rc:broadcast', broadcastOn() ? '0' : '1'); toast(broadcastOn() ? t('bcOn') : t('bcOff')); return;
      case 'speak': lsSet('rc:speak', speakOn() ? '0' : '1'); toast(speakOn() ? t('spOn') : t('spOff')); return;
      case 'code': return codeCard();
      case 'settings': try { SettingsPanel.open(); } catch (e) {} return;
      default: toast(t('soon', { x: k === 'daily' ? today() : t(k) }));
    }
  }
  /* Video call (or a voice-only call) to the whole team at once, with no second screen */
  function callTeam(tm, voice) {
    try {
      if (voice && typeof SentinelCall.setAudioOnlyNext === 'function') SentinelCall.setAudioOnlyNext(true);
      if (tm.length === 1) { runContactQuickAction('video', tm[0]); return; }
      SentinelCall.callGroup({ contactIds: tm.slice(0, 5).map(function (c) { return c.id; }), name: IT() ? 'Team' : 'Team' });
    } catch (e) {}
  }

  /* ── 5. Labels beside a sphere: Contact's 4 on the right of HOME, Health's 4 on the left, or a teammate's own ── */
  var labels = (function () {
    var el = document.createElement('div'); el.id = 'cvLabels';
    var mode = null, els = [], forId = null;
    function make(keys, onPick) {
      el.innerHTML = ''; els = [];
      keys.forEach(function (k) {
        var b = document.createElement('div'); b.className = 'cvl' + (k === 'alert' ? ' alert' : k === 'add' ? ' gold' : ''); b.setAttribute('role', 'button'); b.tabIndex = 0;
        b.textContent = k === 'where' ? t('where') : t(k);
        b.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
        b.addEventListener('click', function (e) { e.stopPropagation(); onPick(k); });
        el.appendChild(b); els.push(b);
      });
      if (!el.parentNode) document.body.appendChild(el);
    }
    /* staggered around the circumference of the sphere, text left-aligned so each reads as part of it */
    function arrange(sx, sy, r, side) {
      var n = els.length, step = 34, top = -((n - 1) * step) / 2;
      els.forEach(function (b, i) {
        var dy = top + i * step, off = Math.sqrt(Math.max(0, (r + 14) * (r + 14) - dy * dy * 0.55)) + 6;
        b.style.top = (sy + dy - 14) + 'px';
        if (side === 'left') { b.style.left = ''; b.style.right = (window.innerWidth - (sx - off)) + 'px'; b.style.textAlign = 'right'; }
        else { b.style.right = ''; b.style.left = (sx + off) + 'px'; b.style.textAlign = 'left'; }
      });
    }
    function home(k) {
      mode = 'home:' + k; forId = null;
      var spec = SIDE[k];
      make(spec.items, function (x) {
        if (k === 'contact') run(x);
        else toast(t('soon', { x: t(x) }));
      });
    }
    function person(c) {
      mode = 'person'; forId = c.id;
      var keys = ['video', 'phone', 'message', 'email', 'where', 'alert'];
      if (c.care && c.care.state === 'pending' && c.care.side === 'home') keys = ['add'];
      make(keys, function (x) { personPick(x, c); });
    }
    function clear() { mode = null; forId = null; el.innerHTML = ''; els = []; }
    function tick() {
      if (!mode) return;
      try {
        var g = geo(), rect = CV.getBoundingClientRect();
        if (mode === 'person') {
          var node = NODES.filter(function (n) { return n.contact.id === forId; })[0];
          if (!node || focusedContactId !== forId || appState !== 'network') { clear(); return; }
          var p = projectNode(node);
          arrange(rect.left + p.sx, rect.top + p.sy, node.r * p.scale * FOCUS_SCALE, 'right');   /* always on the right of the chosen sphere */
        } else {
          if (focusedContactId != null || appState !== 'network') { clear(); return; }
          arrange(rect.left + g.cx, rect.top + g.cy, g.cR * 1.1, SIDE[mode.slice(5)].side);
        }
      } catch (e) {}
    }
    return { home: home, person: person, clear: clear, tick: tick, mode: function () { return mode; }, forId: function () { return forId; } };
  })();

  /* A choice beside a teammate's sphere: for that one person. The labels stay until the next command (26 Oct). */
  function personPick(k, c) {
    switch (k) {
      case 'video': try { runContactQuickAction('video', c); } catch (e) {} return;
      case 'phone': if (!c.phone) return toast(t('noPhone', { n: first(c) })); try { runContactQuickAction('phone', c); } catch (e) {} return;
      case 'message': try { SentinelMessaging.openFor(c.id); } catch (e) {} return;
      case 'email': return emailBox([c], false);
      case 'where': try { WhereIs.setMode('whereis'); } catch (e) {} return;
      case 'alert': return alertCard(c);
      case 'add': return approve(c);
    }
  }
  async function approve(c) {
    var r = await api('/care/links/' + encodeURIComponent(c.care.linkId), { method: 'PUT', body: JSON.stringify({ approve: true, relation: c.care.relation || 'family', share: { location: 1, rooms: 1, falls: 1, care: 1, mood: 1, activity: 1 } }) }).catch(function () { return { ok: false }; });
    if (r.ok) { toast(t('added', { n: first(c) })); syncTeam().then(function () { var n = DEMO_CONTACTS.filter(function (x) { return x.id === c.id; })[0]; if (n && focusedContactId === c.id) labels.person(n); }); }
  }

  /* ── 6. Choosing a teammate: the galaxy turns, the chosen sphere comes forward to the lower left ── */
  var _fid = null, _aim = null, _spot = null;
  function spotOf() { var g = geo(); return { x: g.W * 0.27, y: Math.min(g.H - 150, g.cy + g.cR * 2.55) }; }
  function aimAt(node) {
    try {
      var g = geo(), y0 = netYaw, best = null;
      /* 1. the turn that brings the chosen sphere nearest the viewer, on the left */
      for (var i = 0; i < 72; i++) {
        netYaw = y0 + i * Math.PI / 36; netPitch = ORBIT_PITCH;
        var q = projectNode(node), sc = q.z + Math.abs(q.sx - g.W * 0.3) * 2;
        if (!best || sc < best.s) best = { s: sc, yaw: netYaw };
      }
      netYaw = y0;
      /* 2. it settles in the clear space below HOME, left of centre, so its labels on the right never cross
            HOME or the dream picture */
      var sp = spotOf(), z2 = NET_DIST - 160, s = NET_FOV / (NET_FOV + z2);
      var xp = (sp.x - g.W / 2) / s, y2 = (sp.y - g.H / 2) / s, z2p = z2 - NET_DIST;
      var cp = Math.cos(ORBIT_PITCH), spi = Math.sin(ORBIT_PITCH), cy = Math.cos(best.yaw), sy = Math.sin(best.yaw);
      var y = y2 * cp + z2p * spi, z1 = -y2 * spi + z2p * cp;
      var x = xp * cy - z1 * sy, z = xp * sy + z1 * cy;
      restoreSpot();
      node._cvSpot = { tx: node.tx, ty: node.ty, tz: node.tz }; _spot = { node: node, x: x, y: y, z: z };
      node.tx = x; node.ty = y; node.tz = z;
      _aim = best;
    } catch (e) { _aim = null; }
  }
  function restoreSpot() { if (_spot && _spot.node._cvSpot) { var n = _spot.node; n.tx = n._cvSpot.tx; n.ty = n._cvSpot.ty; n.tz = n._cvSpot.tz; delete n._cvSpot; } _spot = null; }
  function steer() {
    if (_spot) { var n = NODES.filter(function (x) { return x.contact.id === _spot.node.contact.id; })[0]; if (n && n !== _spot.node) { _spot.node = n; n._cvSpot = { tx: n.tx, ty: n.ty, tz: n.tz }; } if (n) { n.tx = _spot.x; n.ty = _spot.y; n.tz = _spot.z; } }
    if (!_aim) return;
    var d = _aim.yaw - netYaw; d = Math.atan2(Math.sin(d), Math.cos(d));
    netYaw += d * 0.12; netPitch += (ORBIT_PITCH - netPitch) * 0.12; netSpin = false; netVelYaw = 0; netVelPitch = 0;
    if (Math.abs(d) < 0.002) { netYaw = _aim.yaw; _aim = null; }
  }
  function focusTick() {
    var id = null; try { id = focusedContactId; } catch (e) {}
    var c = null; try { c = id != null ? DEMO_CONTACTS.filter(function (x) { return x.id === id; })[0] : null; } catch (e) {}
    if (!c || !c.care || appState !== 'network') {
      if (_fid !== null) { _fid = null; _aim = null; restoreSpot(); if (labels.mode() === 'person') labels.clear(); try { if (WhereIs.mode() === 'whereis') WhereIs.setMode('comm'); } catch (e) {} }
      return;
    }
    if (_fid !== c.id) {
      _fid = c.id; ring.close();
      var node = NODES.filter(function (n) { return n.contact.id === c.id; })[0];
      if (node) aimAt(node);
      labels.person(c);
    }
    try { netSpin = false; } catch (e) {}
    steer();
  }

  /* ── 7. Cards: message, email, ALERT and team code (glass, transparent, with a glowing frame) ── */
  function card(html, red) {
    var old = document.getElementById('cvCard'); if (old) old.remove();
    var el = document.createElement('div'); el.id = 'cvCard'; el.className = 'cvc' + (red ? ' red' : ''); el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = '<div class="box"><button class="x" type="button" aria-label="' + esc(t('close')) + '">&times;</button>' + html + '</div>';
    el.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    el.addEventListener('click', function (e) { if (e.target === el) el.remove(); });
    el.querySelector('.x').onclick = function () { el.remove(); };
    document.body.appendChild(el);
    return el;
  }
  function messageBox(tm) {
    var el = card('<h2>' + esc(t('mTitle')) + '</h2><div class="who">' + tm.map(function (c) { return esc(first(c)); }).join(' · ') + '</div><textarea rows="4" placeholder="' + esc(t('mPh')) + '"></textarea><button class="go" type="button">' + esc(t('mSend')) + '</button>');
    var ta = el.querySelector('textarea'); setTimeout(function () { try { ta.focus(); } catch (e) {} }, 60);
    el.querySelector('.go').onclick = async function () {
      var txt = (ta.value || '').trim(); if (!txt) return toast(t('empty'));
      this.disabled = true; var n = 0;
      document.documentElement.classList.add('cv-sending');
      for (var i = 0; i < tm.length; i++) {
        try { await SentinelMessaging.openFor(tm[i].id); var inp = document.getElementById('sentinelMsgInput'); if (inp) { inp.value = txt; await SentinelMessaging.send(); n++; } } catch (e) {}
      }
      try { SentinelMessaging.close(); } catch (e) {}
      document.documentElement.classList.remove('cv-sending');
      el.remove(); toast(t('mSent', { n: n }));
    };
  }
  function myEmail() { try { var e = String((SyncEngine.getStatus() || {}).email || '').trim(); return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && !/@remiel\.local$/.test(e) ? e : ''; } catch (e) { return ''; } }
  function emailBox(people, all) {
    var w = people.filter(function (c) { return c.email && /@/.test(c.email); });
    if (!w.length) return toast(all ? t('eNoneAll') : t('eNone', { n: first(people[0]) }));
    var el = card('<h2>' + esc(all ? t('eAll') : t('eTitle')) + '</h2><div class="who">' + w.map(function (c) { return esc(first(c)); }).join(' · ') + '</div><input type="text" maxlength="150" placeholder="' + esc(t('eSubj')) + '"><textarea rows="5" placeholder="' + esc(t('ePh')) + '"></textarea><button class="go" type="button">' + esc(t('eSend')) + '</button>');
    setTimeout(function () { try { el.querySelector('input').focus(); } catch (e) {} }, 60);
    var go = el.querySelector('.go');
    go.onclick = async function () {
      var subj = el.querySelector('input').value.trim(), txt = el.querySelector('textarea').value.trim(), to = w.map(function (c) { return c.email.trim(); });
      if (!txt) return toast(t('empty'));
      go.disabled = true;
      var r = await api('/care-email', { method: 'POST', body: JSON.stringify({ to: to, subject: subj, text: txt, reply_to: myEmail() }) }).catch(function () { return { ok: false }; });
      go.disabled = false;
      if (r.ok) { el.remove(); return toast(t('eSent', { n: w.length === 1 ? first(w[0]) : String(r.data.sent || to.length) })); }
      if (r.status === 429) return toast(t('eLimit'));
      if (r.status === 501) { el.remove(); toast(t('eOwn')); location.href = 'mailto:' + to.map(encodeURIComponent).join(',') + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(txt); return; }
      toast(t('eFail'));
    };
  }
  /* ALERT: held for a moment so it is never sent by accident. On HOME's own sphere it goes to the whole team;
     on a teammate's sphere, to that one person only (25 Oct). */
  function alertCard(c) {
    var n = c ? first(c) : '';
    var el = card('<h2>' + esc(c ? t('aTitle', { n: n }) : t('aTitleAll')) + '</h2><p>' + esc(c ? t('aSub', { n: n }) : t('aSubAll')) + '</p>' +
      '<button type="button" class="hold"><svg viewBox="0 0 186 186"><circle cx="93" cy="93" r="88" stroke-dasharray="553" stroke-dashoffset="553"/></svg><span>' + esc(t('aHold')) + '</span></button>' +
      '<div class="msg" aria-live="assertive"></div><button type="button" class="cx">' + esc(t('cancel')) + '</button>', true);
    el.querySelector('.cx').onclick = function () { el.remove(); };
    var b = el.querySelector('.hold'), ringC = b.querySelector('circle'), lb = b.querySelector('span'), msg = el.querySelector('.msg'), t0 = 0, raf = 0, done = false;
    function stop() { cancelAnimationFrame(raf); t0 = 0; if (!done) { ringC.style.strokeDashoffset = '553'; lb.textContent = t('aHold'); } }
    function tick() { var k = Math.min(1, (Date.now() - t0) / 1200); ringC.style.strokeDashoffset = String(553 * (1 - k)); if (k >= 1) { done = true; fire(); return; } raf = requestAnimationFrame(tick); }
    b.addEventListener('pointerdown', function (e) { e.preventDefault(); if (done) return; t0 = Date.now(); lb.textContent = t('aHolding'); raf = requestAnimationFrame(tick); try { navigator.vibrate && navigator.vibrate(30); } catch (x) {} });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { b.addEventListener(ev, stop); });
    async function fire() {
      lb.textContent = '✓';
      var body = {}; if (c && c.care) body.to = c.care.userId;
      try { var pos = await new Promise(function (res) { if (!navigator.geolocation) return res(null); navigator.geolocation.getCurrentPosition(res, function () { res(null); }, { enableHighAccuracy: true, timeout: 4000, maximumAge: 30000 }); }); if (pos) { body.lat = pos.coords.latitude; body.lon = pos.coords.longitude; body.acc = pos.coords.accuracy; } } catch (e) {}
      var r = await api('/care-help', { method: 'POST', body: JSON.stringify(body) }).catch(function () { return { ok: false }; });
      msg.textContent = r.ok ? (c ? t('aSent', { n: n }) : t('aSentAll')) : t('aFail');
      setTimeout(function () { el.remove(); }, r.ok ? 2200 : 6000);
    }
  }
  /* Team code: one card for both sides. Your own code to give someone (it works for 24 hours), and a place
     to type the code someone gave you. A shared code also arrives as a link that joins by itself. */
  var _myCode = '';
  async function codeCard() {
    if (!authed()) { try { await SyncEngine.ensureIdentity(); } catch (e) {} }
    var r = await api('/care/code', { method: 'POST' }).catch(function () { return { ok: false }; });
    var code = r.ok && r.data.code ? String(r.data.code) : '';
    _myCode = code;
    var el = card('<h2>' + esc(t('cTitle')) + '</h2>' +
      (code ? '<p>' + esc(t('cSub')) + '</p><div class="code">' + esc(code) + '</div><button class="go" type="button" data-share>' + esc(t('cShare')) + '</button>' : '<p>' + esc(t('cFail')) + '</p>') +
      '<h2 style="margin-top:20px">' + esc(t('jTitle')) + '</h2><p>' + esc(t('jSub')) + '</p>' +
      '<input type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="' + esc(t('jPh')) + '" style="font:800 22px \'JetBrains Mono\',monospace;letter-spacing:.2em;text-align:center">' +
      '<button class="go" type="button" data-join>' + esc(t('jGo')) + '</button>');
    var sh = el.querySelector('[data-share]');
    if (sh) sh.onclick = async function () {
      var link = 'https://beverly-index.com/covara/?join=' + code;
      var text = (IT() ? 'Entra nel mio team Covara. Codice: ' : 'Join my Covara team. Code: ') + code + '  ' + link;
      try { if (navigator.share) { await navigator.share({ text: text }); return; } } catch (e) { return; }
      try { await navigator.clipboard.writeText(text); toast(t('cCopied')); } catch (e) {}
    };
    var inp = el.querySelector('input'), jb = el.querySelector('[data-join]');
    inp.addEventListener('input', function () { inp.value = inp.value.replace(/\D/g, '').slice(0, 6); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') jb.click(); });
    jb.onclick = async function () {
      var c = inp.value.trim();
      if (!/^\d{6}$/.test(c)) return toast(t('jBad'));
      jb.disabled = true; jb.textContent = t('jBusy');
      var ok = await join(c);
      jb.disabled = false; jb.textContent = t('jGo');
      if (ok) el.remove();
    };
  }
  async function join(code) {
    if (code === _myCode) { toast(t('jOwn')); return false; }
    if (!authed()) { try { await SyncEngine.ensureIdentity(); } catch (e) {} }
    var r = await api('/care/claim', { method: 'POST', body: JSON.stringify({ code: code }) }).catch(function () { return { ok: false, status: 0 }; });
    if (r.status === 404 || r.status === 410) { toast(t('jBad')); return false; }
    if (r.status === 400 && /own/i.test(String((r.data || {}).detail || ''))) { toast(t('jOwn')); return false; }
    if (!r.ok) { toast((r.data && r.data.detail) || t('jFail')); return false; }
    var h = r.data.link && r.data.link.home ? r.data.link.home : {};
    await syncTeam();
    toast(t('jDone', { n: String(h.name || '').split(/\s+/)[0] }));
    return true;
  }
  /* a link with ?join=123456: joins as soon as this phone is set up and signed in */
  (function () {
    try {
      var q = new URLSearchParams(location.search).get('join');
      if (q && /^\d{6}$/.test(q)) { lsSet('rc:joinCode', q); history.replaceState(null, '', location.pathname); }
    } catch (e) {}
    var iv = setInterval(function () {
      var c = lsGet('rc:joinCode'); if (!c) { clearInterval(iv); return; }
      if (!authed() || typeof appState === 'undefined' || appState !== 'network') return;
      clearInterval(iv); try { localStorage.removeItem('rc:joinCode'); } catch (e) {}
      join(c);
    }, 1000);
  })();

  /* ── 8. One loop keeps it all in step with Sentinel's own frame ── */
  function loop() {
    requestAnimationFrame(loop);
    placeName();
    if (typeof appState === 'undefined') return;
    if (appState !== 'network') { if (ring.isOpen()) ring.close(); labels.clear(); return; }
    alive();
    focusTick();
    labels.tick();
  }
  function start() {
    if (start.done) return;
    if (typeof SyncEngine === 'undefined' || typeof DEMO_CONTACTS === 'undefined' || typeof SentinelViews === 'undefined' || typeof CV === 'undefined') return;
    start.done = true;
    quiet(); teamFilter(); wrapGalaxy();
    requestAnimationFrame(loop);
    setInterval(toGalaxy, 700);
    setInterval(function () { try { if (authed() && !document.hidden) syncTeam(); } catch (e) {} }, 8000);   /* a new teammate appears within seconds */
    var kick = setInterval(function () { if (authed()) { clearInterval(kick); syncTeam(); } }, 1500);
    /* someone changed language: the ring and the labels follow */
    document.addEventListener('click', function (e) { if (e.target && e.target.closest && e.target.closest('[data-lang],.lang-btn')) setTimeout(function () { ring.rebuild(); }, 50); }, true);
  }
  var boot = setInterval(function () { start(); if (start.done) clearInterval(boot); }, 200);
  window.Covara = { ring: ring, labels: labels, syncTeam: syncTeam, team: team, run: run };
})();
