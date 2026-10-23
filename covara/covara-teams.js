/* Remiel: Covara, teams.
   Every person is HOME of their own team, and may also be on other people's teams.
   - Covara always opens on My team: this phone's own circle, with this person at the centre.
   - One tap on a teammate's sphere offers TEAM when that person is a HOME whose team this person is on.
     Choosing it moves the whole screen into that team at once: the centre sphere, the day, the asks, the Now
     cards, the person card and the care sections all follow that HOME.
   - While in someone else's team: a gold banner with their picture at the top, a gold ring round the centre,
     and a My team button with this person's own picture that comes straight back. My team never leaves a team;
     Leave is in that team's care card and asks first.
   - Urgent alerts (Help, falls, missed medicines) reach this phone from every team whichever team is on screen;
     each one names whose team it is from, and tapping it goes to that team.
   The team on screen lives only in memory, so every open starts again on My team (someone who only looks after
   another person, with no team of their own yet, opens on that person's team).

   How the rest of Covara follows: every module asks localStorage for 'rc:role' and takes the first linked HOME
   in DEMO_CONTACTS. This file answers 'rc:role' with 'home' on My team and 'away' in someone else's team (the
   stored choice is kept as it is, and an empty one stays empty so the first run still asks), and puts the HOME
   on screen first among the linked HOMEs. Nothing else needs to know.
   Beverly Index LLC */
(function () {
  'use strict';
  var KEY = 'rc:role';
  var IT = function () { try { return String((typeof I18n !== 'undefined' && I18n.locale) || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var S = {
    en: {
      teamOf: '{name}’s team', myTeam: 'My team', team: 'TEAM', goTeam: 'Go to {name}’s team',
      askJoin: 'Ask to join {name}’s team',
      askHow: '{name} decides who joins {name}’s team. Ask {name} to send you a team code from Covara. When it arrives, tap Type a code.',
      typeCode: 'Type a code', waiting: 'Waiting for {name} to let you in',
      nowWith: 'You are now with {name}’s team.', backMine: 'You are back with your team.',
      leave: 'Leave {name}’s team', leaveTitle: 'Leave {name}’s team?',
      leaveSub: 'You will no longer see {name}’s care or be part of {name}’s team. To come back, {name} has to send you a new team code.',
      leaveYes: 'Leave', leaveNo: 'Stay', left: 'You left {name}’s team.', gone: '{name}’s team is no longer shared with you.',
      offline: 'Covara needs the internet for this. Try again in a moment.',
      prefix: '{name}’s team: ', prefixMine: 'My team: ', backLabel: 'Back to my team'
    },
    it: {
      teamOf: 'Il team di {name}', myTeam: 'Il mio team', team: 'TEAM', goTeam: 'Vai al team di {name}',
      askJoin: 'Chiedi di entrare nel team di {name}',
      askHow: '{name} decide chi entra nel suo team. Chiedi a {name} di mandarti un codice del team da Covara. Quando arriva, tocca Scrivi un codice.',
      typeCode: 'Scrivi un codice', waiting: 'In attesa che {name} ti faccia entrare',
      nowWith: 'Sei ora con il team di {name}.', backMine: 'Sei di nuovo con il tuo team.',
      leave: 'Lascia il team di {name}', leaveTitle: 'Lasciare il team di {name}?',
      leaveSub: 'Non vedrai più le cure di {name} e non farai più parte del suo team. Per tornare, {name} dovrà mandarti un nuovo codice del team.',
      leaveYes: 'Lascia', leaveNo: 'Resta', left: 'Hai lasciato il team di {name}.', gone: 'Il team di {name} non è più condiviso con te.',
      offline: 'Covara ha bisogno di internet. Riprova tra poco.',
      prefix: 'Team di {name}: ', prefixMine: 'Il mio team: ', backLabel: 'Torna al mio team'
    }
  };
  function t(k, p) { var s = (IT() ? S.it : S.en)[k] || S.en[k] || k; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* which team is on screen: null is My team */
  var _view = null;
  var _get = Storage.prototype.getItem;
  function stored() { try { return _get.call(window.localStorage, KEY) || ''; } catch (e) { return ''; } }
  Storage.prototype.getItem = function (k) {
    var v = _get.apply(this, arguments);
    if (k !== KEY || !v) return v;
    try { if (this !== window.localStorage) return v; } catch (e) { return v; }
    return _view ? 'away' : 'home';
  };

  function myId() { try { return SyncEngine.getUserId() || ''; } catch (e) { return ''; } }
  function contacts() { try { return typeof DEMO_CONTACTS !== 'undefined' ? DEMO_CONTACTS : []; } catch (e) { return []; } }
  function first(c) { var w = c ? String(c.first || c.last || '').trim().split(/\s+/)[0] : ''; return w && w === w.toUpperCase() && w.length > 1 ? w[0] + w.slice(1).toLowerCase() : w; }
  /* the link through which I am on this person's team */
  function teamOf(uid) { if (!uid) return null; return contacts().filter(function (c) { return c.care && c.care.side === 'home' && c.care.state === 'active' && c.care.userId === uid; })[0] || null; }
  function askedOf(uid) { if (!uid) return null; return contacts().filter(function (c) { return c.care && c.care.side === 'home' && c.care.state === 'pending' && c.care.userId === uid; })[0] || null; }
  function onOther() { return contacts().some(function (c) { return c.care && c.care.side === 'home' && c.care.state === 'active'; }); }
  function viewed() { return teamOf(_view); }
  function simple() { try { return !!(window.CovaraSimple && CovaraSimple.on()); } catch (e) { return false; } }
  function toast(m) { try { if (typeof showToast === 'function') showToast(m); } catch (e) {} }
  function speak(m) { try { var T = window.CovaraTalk, f = T && (T.speak || T.say); if (typeof f === 'function') f.call(T, m, m); } catch (e) {} }

  /* the HOME on screen goes first among the linked HOMEs, so every module that takes the first one takes this one */
  function putFirst(c) {
    var list = contacts(), i = list.indexOf(c); if (i <= 0) return;
    var j = -1; list.forEach(function (x, k) { if (j < 0 && x.care && x.care.side === 'home' && x.care.state === 'active') j = k; });
    if (j >= 0 && j < i) { list.splice(i, 1); list.splice(j, 0, c); }
  }

  /* switching */
  function apply() {
    document.body.classList.toggle('cv-team-other', !!_view);
    try { focusedContactId = null; } catch (e) {}
    try { if (window.CovaraPerson && CovaraPerson.isOpen()) CovaraPerson.close(); } catch (e) {}
    try { if (window.CovaraView && CovaraView.open) CovaraView.open(''); } catch (e) {}
    try { if (typeof buildNodes === 'function') buildNodes(false); } catch (e) {}
    try { if (window.CovaraView) CovaraView.load(); } catch (e) {}
    try { if (window.CovaraPlan) CovaraPlan.load(); } catch (e) {}
    try { if (window.CovaraWhere) CovaraWhere.load(true); } catch (e) {}
    try { if (window.CovaraNav && CovaraNav.refresh) CovaraNav.refresh(); } catch (e) {}
    try { if (window.CovaraSimple && CovaraSimple.refresh) CovaraSimple.refresh(); } catch (e) {}
    try { if (window.CovaraHeadline) CovaraHeadline.load(); } catch (e) {}
    paintBar(true);
  }
  function show(uid) {
    var c = teamOf(uid); if (!c) return false;
    if (_view === uid) { putFirst(c); return true; }
    _view = uid; putFirst(c); apply();
    speak(t('nowWith', { name: first(c) }));
    return true;
  }
  function mine(quiet) {
    if (!_view) return;
    _choseMine = true;
    _view = null; apply();
    if (!quiet) speak(t('backMine'));
  }
  /* an alert or a notification names a team: go there (my own id, or a team I am not on, is My team) */
  function go(homeId) {
    if (!homeId || homeId === myId()) { mine(); return; }
    if (!show(homeId)) mine();
  }

  /* the look */
  var css =
    '#cvTeamBar{position:fixed;top:max(10px,env(safe-area-inset-top));left:116px;right:8px;z-index:8990;display:flex;align-items:center;justify-content:flex-end;gap:6px;pointer-events:none;font-family:var(--nous-font,"Hanken Grotesk",system-ui,sans-serif)}' +
    '#cvTeamBar[hidden],body.cv-cam #cvTeamBar{display:none !important}' +
    '#cvTeamBar>*{pointer-events:auto}' +
    '#cvTeamBar canvas,#cvTeamLeave canvas{position:static;display:block;flex:0 0 auto;border-radius:50%}' +
    '#cvTeamBar .cvt-ban{flex:0 1 auto;min-width:0;display:flex;align-items:center;gap:8px;height:44px;padding:0 12px 0 5px;box-sizing:border-box;border-radius:22px;color:#fff3cc;' +
      'background:linear-gradient(155deg,rgba(255,210,77,.24),rgba(80,56,10,.38) 55%,rgba(18,40,96,.42));-webkit-backdrop-filter:blur(14px) saturate(150%);backdrop-filter:blur(14px) saturate(150%);' +
      'border:1.5px solid rgba(255,210,77,.85);box-shadow:0 0 18px rgba(255,210,77,.42),inset 0 1px 0 rgba(255,255,255,.18);text-shadow:0 1px 2px rgba(20,10,0,.6)}' +
    '#cvTeamBar .cvt-ban canvas{width:34px;height:34px;box-shadow:0 0 0 2px #ffd24d,0 0 12px rgba(255,210,77,.6)}' +
    '#cvTeamBar .cvt-ban b{min-width:0;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;word-break:break-word;font-weight:800;font-size:14px;line-height:1.1;letter-spacing:0}' +
    '#cvTeamBar .cvt-mine{flex:0 0 auto;display:flex;align-items:center;gap:6px;height:44px;padding:0 11px 0 5px;box-sizing:border-box;border-radius:22px;cursor:pointer;color:#e6f4ff;font:700 13px/1 var(--nous-font,"Hanken Grotesk",system-ui,sans-serif);' +
      'background:linear-gradient(155deg,rgba(80,140,240,.28),rgba(18,40,96,.48));-webkit-backdrop-filter:blur(14px) saturate(150%);backdrop-filter:blur(14px) saturate(150%);' +
      'border:1px solid rgba(120,210,255,.7);box-shadow:0 0 16px rgba(56,189,248,.4),inset 0 1px 0 rgba(255,255,255,.16)}' +
    '#cvTeamBar .cvt-mine canvas{width:32px;height:32px;box-shadow:0 0 0 2px rgba(56,189,248,.85),0 0 10px rgba(56,189,248,.55)}' +
    '#cvTeamBar .cvt-mine:active{transform:scale(.97)}#cvTeamBar .cvt-mine:focus-visible{outline:2px solid #C5A55A;outline-offset:2px}' +
    '@media (max-width:360px){#cvTeamBar{left:106px}#cvTeamBar .cvt-ban b{font-size:13.5px}#cvTeamBar .cvt-mine{font-size:12.5px;padding-right:10px}}' +
    /* TEAM and Ask to join, in the person sheet */
    '#cvpSheet .cvp-b.cvt-team{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:68px;border-color:#ffd24d;color:#2a1600;text-shadow:none;' +
      'background:linear-gradient(155deg,rgba(255,226,130,.98),rgba(217,154,0,.95));box-shadow:0 0 26px rgba(255,200,60,.5),inset 0 1px 0 rgba(255,255,255,.4)}' +
    '#cvpSheet .cvp-b.cvt-team b{font:800 22px/1 "JetBrains Mono","SF Mono",monospace;letter-spacing:.28em;padding-left:.28em}' +
    '#cvpSheet .cvp-b.cvt-team small{font:700 14px/1.2 var(--nous-font,"Hanken Grotesk",system-ui,sans-serif)}' +
    '#cvpSheet .cvp-b.cvt-ask{border-color:rgba(255,210,77,.7);color:#ffe9a8;box-shadow:0 0 18px rgba(255,210,77,.24),inset 0 1px 0 rgba(255,255,255,.14)}' +
    '#cvpSheet .cvt-how{display:none;margin:-2px 2px 2px;padding:12px 14px;border-radius:16px;border:1px solid rgba(255,210,77,.45);background:rgba(255,210,77,.08);color:#f6ecd0;font:500 15px/1.45 var(--nous-font,"Hanken Grotesk",system-ui,sans-serif)}' +
    '#cvpSheet .cvt-how.open{display:block}#cvpSheet .cvt-how .cvp-b{margin-top:10px;min-height:50px;font-size:17px}' +
    '#cvpSheet .cvt-wait{text-align:center;font:700 14px/1.3 "JetBrains Mono","SF Mono",monospace;color:#ffd24d;padding:6px 0}' +
    '#cvpSheet .cvp-b.cvt-leave{margin-top:14px;min-height:52px;font-size:17px;border-color:rgba(248,113,113,.6);color:#fecaca;background:linear-gradient(155deg,rgba(150,30,50,.22),rgba(40,10,24,.42));box-shadow:0 0 14px rgba(248,113,113,.2),inset 0 1px 0 rgba(255,255,255,.1)}' +
    /* Leave, asked first */
    '#cvTeamLeave .cvt-lv{width:min(440px,calc(100vw - 32px));box-sizing:border-box;margin:auto;padding:24px 20px 20px;text-align:center;border-radius:24px;border:1px solid rgba(255,210,77,.6);' +
      'background:linear-gradient(160deg,rgba(70,130,235,.22),rgba(14,30,78,.52));-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);box-shadow:0 0 30px rgba(255,210,77,.25),inset 0 1px 0 rgba(255,255,255,.16)}' +
    '#cvTeamLeave canvas{width:84px;height:84px;margin:0 auto;border-radius:50%;box-shadow:0 0 0 2px #ffd24d,0 0 24px rgba(255,210,77,.5)}' +
    '#cvTeamLeave [data-a=leave]{border-color:rgba(248,113,113,.75) !important;color:#fff !important;background:linear-gradient(155deg,rgba(220,40,70,.55),rgba(120,16,38,.7)) !important;box-shadow:0 0 18px rgba(248,80,100,.4) !important}' +
    '#cvTeamLeave h2{margin:12px 0 8px;font:800 24px/1.2 var(--nous-font,"Hanken Grotesk",sans-serif);color:#fff}#cvTeamLeave p{margin:0 0 6px;color:#d6e4ff;font-size:15px;line-height:1.45}';
  var st = document.createElement('style'); st.id = 'cvTeamStyle'; st.textContent = css; document.head.appendChild(st);

  /* a round picture: the person's own picture or video frame, else their initials on a glowing orb */
  function face(cv, src, name, gold) {
    var D = cv.width, x = cv.getContext('2d');
    var iw = src && (src.naturalWidth || src.videoWidth || src.width), ih = src && (src.naturalHeight || src.videoHeight || src.height);
    x.save(); x.clearRect(0, 0, D, D); x.beginPath(); x.arc(D / 2, D / 2, D / 2, 0, Math.PI * 2); x.clip();
    var g = x.createRadialGradient(D * .35, D * .3, 0, D / 2, D / 2, D / 2);
    if (gold) { g.addColorStop(0, '#fff4cc'); g.addColorStop(.45, '#ffd24d'); g.addColorStop(1, '#8a5200'); } else { g.addColorStop(0, '#c8f2ff'); g.addColorStop(.5, '#38bdf8'); g.addColorStop(1, '#0b2c66'); }
    x.fillStyle = g; x.fillRect(0, 0, D, D);
    var drew = false;
    if (src && iw && ih) { try { var sc = Math.max(D / iw, D / ih); x.drawImage(src, (D - iw * sc) / 2, (D - ih * sc) / 2, iw * sc, ih * sc); drew = true; } catch (e) {} }
    if (!drew) {
      var ini = String(name || '').trim().split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase();
      x.font = '800 ' + Math.round(D * .42) + 'px "Hanken Grotesk",system-ui,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = gold ? '#2a1600' : '#06101f'; x.fillText(ini, D / 2, D / 2 + D * .03);
    }
    x.restore();
  }
  function photoOf(c) { try { var p = contactPhotos.get(c.id); return p && p.img ? p.img : null; } catch (e) { return null; } }
  function myPhoto() { try { return typeof mediaFrame !== 'undefined' && mediaFrame ? mediaFrame : null; } catch (e) { return null; } }
  function myName() { try { return String(userSphereName || ''); } catch (e) { return ''; } }

  /* the banner and My team */
  var bar = null, _barSig = '';
  function buildBar() {
    if (bar) return bar;
    bar = document.createElement('div'); bar.id = 'cvTeamBar'; bar.hidden = true;
    bar.innerHTML = '<div class="cvt-ban" role="status" aria-live="polite"><canvas width="96" height="96" aria-hidden="true"></canvas><b></b></div>' +
      '<button type="button" class="cvt-mine"><canvas width="96" height="96" aria-hidden="true"></canvas><span></span></button>';
    /* taps here never reach the galaxy underneath */
    ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'click'].forEach(function (ev) { bar.addEventListener(ev, function (e) { e.stopPropagation(); }); });
    bar.querySelector('.cvt-mine').addEventListener('click', function (e) { e.stopPropagation(); mine(); });
    bar.querySelector('.cvt-ban').addEventListener('click', function (e) { e.stopPropagation(); try { if (window.CovaraPerson) CovaraPerson.openCare(); } catch (x) {} });
    document.body.appendChild(bar);
    return bar;
  }
  function paintBar(force) {
    var c = viewed(), on = !!(c && stored());
    if (!on) { if (bar && !bar.hidden) bar.hidden = true; return; }
    buildBar();
    var nm = first(c), sig = nm + '|' + IT();
    if (force || sig !== _barSig) {
      _barSig = sig;
      bar.querySelector('.cvt-ban b').textContent = t('teamOf', { name: nm });
      bar.querySelector('.cvt-ban').setAttribute('aria-label', t('teamOf', { name: nm }));
      bar.querySelector('.cvt-mine span').textContent = t('myTeam');
      bar.querySelector('.cvt-mine').setAttribute('aria-label', t('backLabel'));
    }
    face(bar.querySelector('.cvt-ban canvas'), photoOf(c), (c.first || '') + ' ' + (c.last || ''), true);
    face(bar.querySelector('.cvt-mine canvas'), myPhoto(), myName(), false);
    bar.hidden = false;
  }

  /* the person sheet: TEAM, or Ask to join */
  function decorate(id) {
    var sh = document.getElementById('cvpSheet'); if (!sh || _view) return;
    var c = contacts().filter(function (x) { return String(x.id) === String(id); })[0];
    if (!c || !c.care || !c.care.userId || c.care.userId === myId()) return;
    var btns = sh.querySelector('.cvp-btns'); if (!btns || btns.querySelector('.cvt-team,.cvt-ask,.cvt-wait')) return;
    var uid = c.care.userId, nm = first(c), wrap = document.createElement('div');
    wrap.style.display = 'contents';
    if (teamOf(uid)) {
      wrap.innerHTML = '<button type="button" class="cvp-b cvt-team"><b>' + esc(t('team')) + '</b><small>' + esc(t('goTeam', { name: nm })) + '</small></button>';
      wrap.querySelector('.cvt-team').onclick = function (e) { e.stopPropagation(); show(uid); };
    } else if (simple()) {
      return; /* the simple screen shows no team switching unless this person is already on that team */
    } else if (askedOf(uid)) {
      wrap.innerHTML = '<div class="cvt-wait">' + esc(t('waiting', { name: nm })) + '</div>';
    } else {
      /* Joining needs {name}'s consent: {name} (or whoever decides for {name}) gives a team code. Covara's server
         has no way to ask without one, so this explains it and opens the code pad. */
      wrap.innerHTML = '<button type="button" class="cvp-b cvt-ask" aria-expanded="false">' + esc(t('askJoin', { name: nm })) + '</button>' +
        '<div class="cvt-how">' + esc(t('askHow', { name: nm })) + '<button type="button" class="cvp-b pri" data-a="pad">' + esc(t('typeCode')) + '</button></div>';
      var ask = wrap.querySelector('.cvt-ask'), how = wrap.querySelector('.cvt-how');
      ask.onclick = function (e) { e.stopPropagation(); var o = !how.classList.contains('open'); how.classList.toggle('open', o); ask.setAttribute('aria-expanded', String(o)); };
      how.querySelector('[data-a=pad]').onclick = function (e) { e.stopPropagation(); try { CovaraPerson.close(); } catch (x) {} setTimeout(function () { try { CovaraCare.openPad(); } catch (x) {} }, 200); };
    }
    btns.insertBefore(wrap, btns.firstChild);
  }
  /* the care card of the team on screen: Leave, at the bottom, asked first */
  function decorateCare() {
    var c = viewed(), sh = document.getElementById('cvpSheet'); if (!c || !sh || sh.querySelector('.cvt-leave')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'cvp-b cvt-leave'; b.textContent = t('leave', { name: first(c) });
    b.onclick = function (e) { e.stopPropagation(); askLeave(c); };
    sh.appendChild(b);
  }
  function askLeave(c) {
    var nm = first(c);
    try { CovaraPerson.close(); } catch (e) {}
    var el = document.getElementById('cvTeamLeave');
    if (!el) { el = document.createElement('div'); el.id = 'cvTeamLeave'; el.className = 'cv-ov'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); document.body.appendChild(el); }
    el.innerHTML = '<div class="cvt-lv"><canvas width="168" height="168" aria-hidden="true"></canvas><h2>' + esc(t('leaveTitle', { name: nm })) + '</h2><p>' + esc(t('leaveSub', { name: nm })) + '</p>' +
      '<div class="cv-msg"></div><div class="cv-row"><button type="button" class="cv-btn" data-a="stay">' + esc(t('leaveNo')) + '</button><button type="button" class="cv-btn warn" data-a="leave">' + esc(t('leaveYes')) + '</button></div></div>';
    face(el.querySelector('canvas'), photoOf(c), (c.first || '') + ' ' + (c.last || ''), true);
    ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'mousedown', 'mouseup'].forEach(function (ev) { el.addEventListener(ev, function (e) { e.stopPropagation(); }); });
    el.querySelector('[data-a=stay]').onclick = function () { el.classList.remove('open'); };
    el.querySelector('[data-a=leave]').onclick = async function () {
      var b = this; b.disabled = true;
      try {
        var r = await SyncEngine.apiFetch('/care/links/' + encodeURIComponent(c.care.linkId), { method: 'DELETE' });
        if (!r.ok && r.status !== 404) throw new Error(r.status);
        el.classList.remove('open');
        mine(true);
        try { await CovaraCare.sync(); } catch (e) {}
        toast(t('left', { name: nm }));
      } catch (e) { b.disabled = false; el.querySelector('.cv-msg').textContent = t('offline'); }
    };
    requestAnimationFrame(function () { el.classList.add('open'); try { el.querySelector('[data-a=stay]').focus({ preventScroll: true }); } catch (e) {} });
  }

  /* hooks into the modules that draw the screen */
  var _hooked = { view: false, person: false };
  function hook() {
    var V = window.CovaraView;
    if (V && !_hooked.view) {
      _hooked.view = true;
      var src = V.source, dc = V.drawCentre;
      /* the circle: in someone else's team, only that team; on My team, each person once */
      V.source = function (list) {
        var out = src.apply(this, arguments);
        if (!stored()) return out;
        if (_view) return (out || []).filter(function (c) { return c && (c.cvItem || /^cvp:/.test(String(c.id))); });
        var mineIds = {}; (out || []).forEach(function (c) { if (c && c.care && c.care.side === 'away' && c.care.userId) mineIds[c.care.userId] = 1; });
        return (out || []).filter(function (c) { return !(c && c.care && c.care.side === 'home' && mineIds[c.care.userId]); });
      };
      /* a gold ring round the centre while in someone else's team */
      V.drawCentre = function (ctx, cx, cy, cr, t0) {
        var r = dc.apply(this, arguments);
        if (_view && viewed()) {
          try {
            var a = 0.85 + 0.15 * Math.sin((t0 || 0) * 0.003);
            ctx.save();
            ctx.shadowColor = 'rgba(255,200,60,0.85)'; ctx.shadowBlur = 18;
            ctx.strokeStyle = 'rgba(255,210,77,' + a + ')'; ctx.lineWidth = 5;
            ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.stroke();
            ctx.lineWidth = 3.5; ctx.strokeStyle = 'rgba(255,210,77,' + (a * 0.9) + ')';
            ctx.beginPath(); ctx.arc(cx, cy, cr * 1.1, 0, Math.PI * 2); ctx.stroke();
            ctx.shadowBlur = 0; ctx.lineCap = 'round'; ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(255,244,204,0.9)';
            var s = (t0 || 0) * 0.0009;
            ctx.beginPath(); ctx.arc(cx, cy, cr * 1.1, s, s + 0.7); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, cr * 1.1, s + Math.PI, s + Math.PI + 0.7); ctx.stroke();
            ctx.restore();
          } catch (e) {}
        }
        return r;
      };
      try { if (typeof buildNodes === 'function') buildNodes(false); } catch (e) {}
    }
    var P = window.CovaraPerson;
    if (P && !_hooked.person) {
      _hooked.person = true;
      var op = P.open, oc = P.openCare;
      P.open = function (id) { var r = op.apply(this, arguments); if (r) { try { decorate(id); } catch (e) {} } return r; };
      P.openCare = function () { var r = oc.apply(this, arguments); if (r) { try { decorateCare(); } catch (e) {} } return r; };
    }
    return _hooked.view && _hooked.person;
  }

  /* keep it right */
  function tick() {
    hook();
    if (_view) {
      var c = viewed();
      if (!c) {
        /* the link ended (Leave, or that HOME removed this person): back to My team */
        var gone = contacts().filter(function (x) { return x.care && x.care.userId === _view; })[0];
        var nm = gone ? first(gone) : '';
        _view = null; apply();
        if (nm) toast(t('gone', { name: nm }));
      } else putFirst(c);
    }
    paintBar(false);
  }
  setInterval(tick, 500);
  window.addEventListener('localeChanged', function () { paintBar(true); });
  /* opened from a notification about one team (#home=ID): go to that team once the circle is known */
  (function fromLink() {
    var m = /[#&]home=([\w-]+)/.exec(location.hash || ''); if (!m) return;
    var tries = 0;
    (function wait() { if (show(m[1]) || ++tries > 40) return; setTimeout(wait, 750); })();
  })();

  /* someone who only looks after another person (they chose the team role and nobody is on a team of their own yet)
     opens straight on that person's team, as before; an empty circle of their own would only confuse. Once they
     have a team of their own, Covara opens on My team like everyone else. */
  var _choseMine = false;
  function startWhereTheyCare() {
    if (_view || _choseMine || stored() !== 'away' || /[#&]home=/.test(location.hash || '')) return;
    var care = contacts().filter(function (c) { return c.care && c.care.state === 'active'; });
    if (care.some(function (c) { return c.care.side === 'away'; })) return;
    var h = care.filter(function (c) { return c.care.side === 'home'; })[0];
    if (h) { _view = h.care.userId; putFirst(h); apply(); }
  }
  /* checked all the time, so a team joined while Covara is open is entered at once too */
  setInterval(startWhereTheyCare, 700);

  window.CovaraTeams = {
    /* the team on screen: '' for My team, else that HOME's user id */
    current: function () { return _view || ''; },
    viewing: function () { return !!_view; },
    storedRole: stored,
    show: show, mine: mine, go: go, teamOf: teamOf,
    /* "Rupert's team: " before an alert from another team (and "My team: " for my own, once I am on other teams too) */
    prefix: function (homeId) {
      if (!homeId) return '';
      if (homeId === myId()) return onOther() ? t('prefixMine') : '';
      var c = teamOf(homeId) || contacts().filter(function (x) { return x.care && x.care.userId === homeId; })[0];
      return c ? t('prefix', { name: first(c) }) : '';
    },
    /* an alarm from the server: name the team in its title, and a tap on it goes to that team */
    alarm: function (a, el) {
      if (!a || !el || !/^care-/.test(String(a.kind || '')) || !a.member_ref) return;
      var p = window.CovaraTeams.prefix(a.member_ref);
      if (p && el.textContent.indexOf(p) !== 0) el.textContent = p + el.textContent;
      el.style.cursor = 'pointer';
      el.onclick = function () { go(a.member_ref); };
    }
  };
})();
