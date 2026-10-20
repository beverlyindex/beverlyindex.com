/* Remiel: Covara, module 1: HOME and AWAY.
   HOME is the person being looked after; AWAY is family or a carer.
   HOME shows a 6 digit code, AWAY types it, HOME taps AWAY's sphere and
   chooses what AWAY may see. Each linked person becomes a sphere in the
   Sentinel galaxy, so Video, Phone, Message and Email work as they do there.
   Beverly Index LLC */
(function () {
  'use strict';

  var ROLE_KEY = 'rc:role';
  var SHARES = ['location', 'rooms', 'falls', 'care', 'mood', 'activity'];
  var STR = {
    en: {
      roleTitle: 'Who is this phone for?',
      roleHome: 'For me', roleHomeSub: 'My family looks after me',
      roleAway: 'For someone I look after', roleAwaySub: 'A parent, a partner, a friend',
      linkHome: 'Show a code for my family', linkAway: 'Type a code',
      codeTitle: 'Show this to your family',
      codeSub: 'They type it on their phone. It works for 15 minutes.',
      codeWait: 'Waiting for them',
      codeNew: 'New code', close: 'Close',
      padTitle: 'Type the code from their phone',
      padWrong: 'That code is not valid. Ask for a new one on the other phone.',
      padOwn: 'This code is from your own phone.',
      padSent: 'Sent. They choose what you can see.',
      waitHome: 'WAITING FOR YOU', waitAway: 'WAITING FOR THEM',
      consentTitle: 'Choose what {name} can see',
      consentWho: '{name} is my',
      letIn: 'Let {name} in', save: 'Save', notNow: 'Not now', remove: 'Remove {name}',
      removed: '{name} no longer sees anything.',
      joined: '{name} is now in your circle.',
      asks: '{name} asks to look after you. Tap their sphere.',
      offline: 'Covara needs the internet for this. Try again in a moment.',
      snTitle: 'Room sensors (fall detection)', snHelp: 'A 60 GHz fall sensor on the ceiling of a room sees a fall without a camera and rings everyone who sees falls at once, even when the phone is in another room.', snNone: 'No room sensor yet.', snAdd: 'Add a room sensor', snNamePh: 'Room name, for example Bathroom', snRemove: 'Remove', snKeyOnce: 'Put this line in the sensor now. It is shown only once:', snCopy: 'Copy', snOn: 'Watching', snQuiet: 'Not heard from in a while', snNever: 'Waiting for its first report', snFall: 'Saw a fall in the last hour',
      famTitle: 'My family in Covara', lookTitle: 'Who I look after', famEmpty: 'Nobody yet. Show your code to your family.', lookEmpty: 'Nobody yet. Type the code from their phone.', sees: 'Sees:', seesNothing: 'nothing yet',
      sh: { location: 'Where I am', rooms: 'Which room', falls: 'If I fall', care: 'Medicines and visits', mood: 'How I feel', activity: 'If I stop moving' },
      rel: { child: 'Son or daughter', partner: 'Partner', sibling: 'Brother or sister', friend: 'Friend', carer: 'Carer', doctor: 'Doctor' }
    },
    it: {
      roleTitle: 'Per chi è questo telefono?',
      roleHome: 'Per me', roleHomeSub: 'La mia famiglia si prende cura di me',
      roleAway: 'Per una persona di cui mi prendo cura', roleAwaySub: 'Un genitore, un partner, un amico',
      linkHome: 'Mostra un codice per la famiglia', linkAway: 'Scrivi un codice',
      codeTitle: 'Mostra questo alla tua famiglia',
      codeSub: 'Lo scrivono sul loro telefono. Vale 15 minuti.',
      codeWait: 'In attesa',
      codeNew: 'Nuovo codice', close: 'Chiudi',
      padTitle: 'Scrivi il codice del suo telefono',
      padWrong: 'Il codice non è valido. Chiedi un nuovo codice sull’altro telefono.',
      padOwn: 'Questo codice è del tuo telefono.',
      padSent: 'Inviato. Ora sceglie cosa puoi vedere.',
      waitHome: 'ASPETTA TE', waitAway: 'IN ATTESA',
      consentTitle: 'Scegli cosa può vedere {name}',
      consentWho: '{name} è',
      letIn: 'Fai entrare {name}', save: 'Salva', notNow: 'Non ora', remove: 'Rimuovi {name}',
      removed: '{name} non vede più nulla.',
      joined: '{name} ora è nella tua cerchia.',
      asks: '{name} chiede di prendersi cura di te. Tocca la sua sfera.',
      offline: 'Covara ha bisogno di internet. Riprova tra poco.',
      snTitle: 'Sensori nelle stanze (cadute)', snHelp: 'Un sensore di cadute a 60 GHz sul soffitto vede una caduta senza telecamera e avvisa subito chi vede le cadute, anche se il telefono è in un\u2019altra stanza.', snNone: 'Ancora nessun sensore.', snAdd: 'Aggiungi un sensore', snNamePh: 'Nome della stanza, per esempio Bagno', snRemove: 'Rimuovi', snKeyOnce: 'Inserisci ora questa riga nel sensore. Viene mostrata una sola volta:', snCopy: 'Copia', snOn: 'Attivo', snQuiet: 'Nessun segnale da un po\u2019', snNever: 'In attesa del primo segnale', snFall: 'Ha visto una caduta nell\u2019ultima ora',
      famTitle: 'La mia famiglia in Covara', lookTitle: 'Di chi mi prendo cura', famEmpty: 'Ancora nessuno. Mostra il codice alla tua famiglia.', lookEmpty: 'Ancora nessuno. Scrivi il codice del suo telefono.', sees: 'Vede:', seesNothing: 'ancora niente',
      sh: { location: 'Dove sono', rooms: 'In quale stanza', falls: 'Se cado', care: 'Medicine e visite', mood: 'Come sto', activity: 'Se non mi muovo' },
      rel: { child: 'Figlio o figlia', partner: 'Partner', sibling: 'Fratello o sorella', friend: 'Amico', carer: 'Badante', doctor: 'Medico' }
    }
  };
  function L() { var l = (window.I18n && I18n.locale) || 'en'; return STR[String(l).slice(0, 2)] || STR.en; }
  function t(k, p) { var v = L()[k] || STR.en[k] || k; Object.keys(p || {}).forEach(function (n) { v = v.split('{' + n + '}').join(p[n]); }); return v; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function role() { try { return localStorage.getItem(ROLE_KEY) || ''; } catch (e) { return ''; } }
  function setRole(r) { try { localStorage.setItem(ROLE_KEY, r); } catch (e) {} document.body.setAttribute('data-cv-role', r); }
  function toast(m) { try { if (typeof showToast === 'function') showToast(m); } catch (e) {} }
  function authed() { try { return typeof SyncEngine !== 'undefined' && SyncEngine.isAuthenticated(); } catch (e) { return false; } }
  async function api(path, opts) {
    if (!authed()) throw new Error('auth');
    var o = Object.assign({ method: 'GET' }, opts || {});
    if (o.body && typeof o.body !== 'string') o.body = JSON.stringify(o.body);
    var r = await SyncEngine.apiFetch('/care' + path, o);
    var j = await r.json().catch(function () { return {}; });
    return { ok: r.ok, status: r.status, data: j };
  }
  function initials(name) { var p = String(name || '').trim().split(/\s+/); return ((p[0] || '?')[0] + (p[1] ? p[1][0] : (p[0] || '')[1] || '')).toUpperCase(); }

  /* ── styles: Sentinel glass, NOUS type ── */
  var css = '' +
    '.cv-ov{position:fixed;inset:0;z-index:99995;background:radial-gradient(120% 90% at 50% 40%,#08203c 0,#060a14 55%,#05070c 100%);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .45s ease;font-family:"Hanken Grotesk",system-ui,sans-serif;color:#e8eef8}' +
    '.cv-ov.open{opacity:1;pointer-events:auto}body.cv-asking #reachModal{display:none !important}' +
    '.cv-box{width:min(560px,calc(100vw - 32px));max-height:calc(100vh - 32px);overflow:auto;text-align:center;padding:8px 0 20px}' +
    '.cv-h{font:400 clamp(26px,5vw,38px)/1.15 "Instrument Serif",Georgia,serif;margin:0 0 6px;color:#f1f6ff}' +
    '.cv-sub{font-size:14px;color:#8ea3bf;margin:0 0 22px}' +
    '.cv-mono{font:600 11px "JetBrains Mono",monospace;letter-spacing:.18em;color:#5fd0ff;text-transform:uppercase}' +
    '.cv-orbs{display:flex;gap:clamp(18px,6vw,48px);justify-content:center;flex-wrap:wrap;margin-top:18px}' +
    '.cv-orbpick{background:none;border:0;color:inherit;cursor:pointer;width:min(220px,42vw);display:flex;flex-direction:column;align-items:center;gap:12px;font:inherit}' +
    '.cv-orb{position:relative;border-radius:50%;width:min(180px,36vw);aspect-ratio:1;display:flex;align-items:center;justify-content:center;font:700 clamp(34px,8vw,56px) "Hanken Grotesk",sans-serif;color:#06223a;' +
      'background:radial-gradient(circle at 34% 28%,#ffffff 0,#d8f6ff 7%,#7fe0ff 24%,#22b8f0 52%,#0b6fb0 80%,#063a63 100%);box-shadow:0 0 0 2px rgba(120,200,255,.35),0 0 0 9px rgba(56,189,248,.08),0 0 60px rgba(56,189,248,.45),inset 0 -14px 30px rgba(0,30,70,.45);transition:transform .25s ease,box-shadow .25s ease}' +
    '.cv-orb.gold{background:radial-gradient(circle at 34% 28%,#fff 0,#fff4cc 8%,#ffd76a 26%,#f2a516 55%,#a85f00 85%,#5c3300 100%);box-shadow:0 0 0 2px rgba(255,210,120,.4),0 0 0 9px rgba(255,190,60,.08),0 0 60px rgba(255,180,40,.4),inset 0 -14px 30px rgba(80,30,0,.45);color:#3a1d00}' +
    '.cv-orbpick:hover .cv-orb,.cv-orbpick:focus-visible .cv-orb{transform:scale(1.05)}' +
    '.cv-orbpick:focus,.cv-orbpick:focus-visible{outline:none}.cv-orbpick:focus-visible .cv-orb{box-shadow:0 0 0 3px #C5A55A,0 0 60px rgba(56,189,248,.5)}' +
    '.cv-orb img{position:absolute;inset:0;width:100%;height:100%;border-radius:50%;object-fit:cover}' +
    '.cv-orbname{font-size:18px;font-weight:700;color:#f1f6ff}.cv-orbsub{font-size:13px;color:#8ea3bf;margin-top:-6px}' +
    '.cv-code{display:flex;gap:8px;justify-content:center;margin:26px 0 10px}' +
    '.cv-code span{width:clamp(40px,11vw,62px);height:clamp(56px,15vw,84px);border-radius:14px;display:flex;align-items:center;justify-content:center;font:700 clamp(30px,8vw,48px) "JetBrains Mono",monospace;color:#eaf9ff;background:rgba(12,24,40,.85);border:1px solid rgba(56,189,248,.55);box-shadow:0 0 24px rgba(56,189,248,.25),inset 0 0 18px rgba(56,189,248,.12)}' +
    '.cv-ring{width:min(130px,30vw);aspect-ratio:1;margin:8px auto 0;border-radius:50%;border:2px solid rgba(56,189,248,.25);position:relative}' +
    '.cv-ring:after{content:"";position:absolute;inset:-2px;border-radius:50%;border:2px solid transparent;border-top-color:#38bdf8;animation:cvSpin 1.6s linear infinite}' +
    '@keyframes cvSpin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){.cv-ring:after{animation:none;border-color:#38bdf8}}' +
    '.cv-ring b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:600 11px "JetBrains Mono",monospace;letter-spacing:.14em;color:#5fd0ff;text-transform:uppercase;padding:0 14px}' +
    '.cv-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:22px}' +
    '.cv-btn{min-height:46px;padding:0 22px;border-radius:23px;border:1px solid rgba(255,255,255,.18);background:rgba(19,26,39,.92);color:#e5e7eb;font:600 14px "Hanken Grotesk",sans-serif;cursor:pointer}' +
    '.cv-btn.pri{background:#38bdf8;border-color:#38bdf8;color:#04121a}' +
    '.cv-btn.warn{border-color:rgba(248,113,113,.5);color:#fca5a5;background:transparent}' +
    '.cv-btn:focus-visible{outline:2px solid #C5A55A;outline-offset:2px}' +
    '.cv-pad{display:grid;grid-template-columns:repeat(3,minmax(64px,86px));gap:12px;justify-content:center;margin-top:18px}' +
    '.cv-pad button{height:64px;border-radius:32px;border:1px solid rgba(56,189,248,.35);background:rgba(12,20,34,.9);color:#eaf9ff;font:600 24px "JetBrains Mono",monospace;cursor:pointer}' +
    '.cv-pad button:active{background:rgba(56,189,248,.28)}.cv-pad button:focus-visible{outline:2px solid #C5A55A}' +
    '.cv-msg{min-height:20px;margin-top:14px;font-size:14px;color:#fca5a5}.cv-msg.ok{color:#86efac}' +
    '.cv-who{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:10px}' +
    '.cv-who .cv-orb{width:84px;font-size:28px}' +
    '.cv-shares{display:grid;grid-template-columns:repeat(3,1fr);gap:16px 10px;margin:22px 0 6px}' +
    '.cv-sh{background:none;border:0;color:#8ea3bf;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:9px;font:600 13px "Hanken Grotesk",sans-serif;padding:4px}' +
    '.cv-sh i{width:58px;height:58px;border-radius:50%;display:block;background:radial-gradient(circle at 34% 28%,#3a4558 0,#1b2230 55%,#0c1018 100%);box-shadow:inset 0 -6px 12px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.08);transition:all .25s ease}' +
    '.cv-sh[aria-pressed="true"]{color:#eaf9ff}' +
    '.cv-sh[aria-pressed="true"] i{background:radial-gradient(circle at 34% 28%,#fff 0,#c8f2ff 8%,#59d2ff 30%,#1597d8 62%,#08436f 100%);box-shadow:0 0 22px rgba(56,189,248,.55),inset 0 -6px 12px rgba(0,30,70,.4)}' +
    '.cv-sh:focus-visible{outline:2px solid #C5A55A;border-radius:12px}' +
    '.cv-rels{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:10px}' +
    '.cv-rel{min-height:36px;padding:0 14px;border-radius:18px;border:1px solid rgba(255,255,255,.16);background:transparent;color:#b9c6d8;font:600 13px "Hanken Grotesk",sans-serif;cursor:pointer}' +
    '.cv-rel[aria-pressed="true"]{border-color:#38bdf8;color:#04121a;background:#38bdf8}' +
    '@media (max-width:420px){.cv-shares{grid-template-columns:repeat(2,1fr)}}' +
    '.cv-fam-row{display:flex;align-items:center;gap:12px;width:100%;padding:10px 4px;background:none;border:0;border-bottom:1px solid rgba(255,255,255,.06);color:inherit;font:inherit;text-align:left;cursor:pointer}' +
    '.cv-fam-row:last-child{border-bottom:0}.cv-fam-row i{flex:0 0 auto;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:700 14px "Hanken Grotesk",sans-serif;font-style:normal;color:#06223a;background:radial-gradient(circle at 34% 28%,#fff 0,#c8f2ff 8%,#59d2ff 30%,#1597d8 62%,#08436f 100%)}' +
    '.cv-fam-row b{display:block;font-size:14px;color:var(--text-primary,#e8eef8)}.cv-fam-row small{display:block;font-size:12px;color:var(--text-dim,#8ea3bf)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function overlay(id) {
    var el = document.getElementById(id);
    if (!el) { el = document.createElement('div'); el.id = id; el.className = 'cv-ov'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); document.body.appendChild(el); }
    return el;
  }
  function show(el) { requestAnimationFrame(function () { el.classList.add('open'); var f = el.querySelector('button'); if (f) try { f.focus({ preventScroll: true }); } catch (e) {} }); }
  function hide(el) { if (el) el.classList.remove('open'); }

  /* ── role ── */
  function askRole() {
    var el = overlay('cvRole');
    var me = (typeof userSphereName !== 'undefined' && userSphereName) || '';
    el.innerHTML = '<div class="cv-box"><div class="cv-mono">Remiel: Covara</div><h2 class="cv-h" style="margin-top:10px">' + esc(t('roleTitle')) + '</h2>' +
      '<div class="cv-orbs">' +
      '<button class="cv-orbpick" data-r="home"><span class="cv-orb gold">' + esc(me ? initials(me) : '') + '</span><span class="cv-orbname">' + esc(t('roleHome')) + '</span><span class="cv-orbsub">' + esc(t('roleHomeSub')) + '</span></button>' +
      '<button class="cv-orbpick" data-r="away"><span class="cv-orb"></span><span class="cv-orbname">' + esc(t('roleAway')) + '</span><span class="cv-orbsub">' + esc(t('roleAwaySub')) + '</span></button>' +
      '</div></div>';
    el.querySelectorAll('[data-r]').forEach(function (b) {
      b.onclick = async function () {
        setRole(b.getAttribute('data-r')); hide(el); document.body.classList.remove('cv-asking'); renderFamily();
        await sync();
        if (!careContacts().length) { if (role() === 'home') openCode(); else openPad(); }
      };
    });
    document.body.classList.add('cv-asking');
    /* HOME's own picture or clip goes inside HOME's sphere when there is one */
    (async function () {
      try {
        var ph = await RemielDB.getPhoto('self'); if (!ph || !ph.buffer) return;
        var url = URL.createObjectURL(new Blob([ph.buffer], { type: ph.mimeType || 'image/png' }));
        var orb = el.querySelector('[data-r=home] .cv-orb');
        orb.innerHTML = /^video/.test(ph.mimeType || '') ? '<video src="' + url + '" autoplay muted loop playsinline style="position:absolute;inset:0;width:100%;height:100%;border-radius:50%;object-fit:cover"></video>' : '<img alt="" src="' + url + '">';
      } catch (e) {}
    })();
    show(el);
  }

  /* ── HOME: the code ── */
  var _codeTimer = null;
  async function openCode() {
    var el = overlay('cvCode');
    el.innerHTML = '<div class="cv-box"><div class="cv-mono">' + esc(t('linkHome')) + '</div><h2 class="cv-h" style="margin-top:10px">' + esc(t('codeTitle')) + '</h2>' +
      '<div class="cv-code" aria-live="polite"><span></span><span></span><span></span><span></span><span></span><span></span></div>' +
      '<p class="cv-sub">' + esc(t('codeSub')) + '</p><div class="cv-ring"><b>' + esc(t('codeWait')) + '</b></div>' +
      '<div class="cv-msg"></div><div class="cv-row"><button class="cv-btn" data-a="new">' + esc(t('codeNew')) + '</button><button class="cv-btn pri" data-a="close">' + esc(t('close')) + '</button></div></div>';
    el.querySelector('[data-a=close]').onclick = closeCode;
    el.querySelector('[data-a=new]').onclick = fill;
    show(el);
    async function fill() {
      var msg = el.querySelector('.cv-msg'); msg.textContent = '';
      try {
        var r = await api('/code', { method: 'POST' });
        if (!r.ok) throw new Error(r.status);
        var d = String(r.data.code || '').split('');
        el.querySelectorAll('.cv-code span').forEach(function (s, i) { s.textContent = d[i] || ''; });
        el.querySelector('.cv-code').setAttribute('aria-label', d.join(' '));
      } catch (e) { msg.textContent = t('offline'); }
    }
    await fill();
    clearInterval(_codeTimer);
    _codeTimer = setInterval(async function () {
      var before = pendingIds();
      await sync();
      var after = pendingIds().filter(function (id) { return before.indexOf(id) < 0; });
      if (after.length) {
        closeCode();
        var c = byLink(after[0]);
        if (c) openConsent(c);
      }
    }, 3000);
  }
  function closeCode() { clearInterval(_codeTimer); _codeTimer = null; hide(document.getElementById('cvCode')); }

  /* ── AWAY: the pad ── */
  function openPad() {
    var el = overlay('cvPad'); var val = '';
    var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
    el.innerHTML = '<div class="cv-box"><div class="cv-mono">' + esc(t('linkAway')) + '</div><h2 class="cv-h" style="margin-top:10px">' + esc(t('padTitle')) + '</h2>' +
      '<div class="cv-code" aria-live="polite"><span></span><span></span><span></span><span></span><span></span><span></span></div>' +
      '<div class="cv-pad">' + keys.map(function (k) { return k ? '<button data-k="' + k + '" aria-label="' + (k === 'del' ? 'Delete' : k) + '">' + (k === 'del' ? '&#9003;' : k) + '</button>' : '<span></span>'; }).join('') + '</div>' +
      '<div class="cv-msg"></div><div class="cv-row"><button class="cv-btn" data-a="close">' + esc(t('close')) + '</button></div></div>';
    var msg = el.querySelector('.cv-msg');
    function paint() { el.querySelectorAll('.cv-code span').forEach(function (s, i) { s.textContent = val[i] || ''; }); }
    async function send() {
      msg.className = 'cv-msg'; msg.textContent = '';
      try {
        var r = await api('/claim', { method: 'POST', body: { code: val } });
        if (!r.ok) { msg.textContent = r.status === 400 ? t('padOwn') : t('padWrong'); val = ''; paint(); return; }
        msg.className = 'cv-msg ok'; msg.textContent = t('padSent');
        await sync();
        setTimeout(function () { hide(el); openCircle(); }, 1400);
      } catch (e) { msg.textContent = t('offline'); }
    }
    function press(k) {
      if (k === 'del') val = val.slice(0, -1); else if (val.length < 6) val += k;
      paint(); if (val.length === 6) send();
    }
    el.querySelectorAll('[data-k]').forEach(function (b) { b.onclick = function () { press(b.getAttribute('data-k')); }; });
    el.onkeydown = function (e) { if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('del'); else if (e.key === 'Escape') hide(el); };
    el.querySelector('[data-a=close]').onclick = function () { hide(el); };
    show(el);
  }

  /* ── HOME: choose what they can see ── */
  async function openConsent(c) {
    var cv = c.care || {}; var name = c.first || '';
    var share = Object.assign({ location: 1, rooms: 1, falls: 1, care: 1, mood: 1, activity: 1 }, cv.state === 'active' ? cv.share || {} : {});
    var rel = cv.relation || '';
    var el = overlay('cvConsent');
    var rels = L().rel;
    el.innerHTML = '<div class="cv-box">' +
      '<div class="cv-who"><span class="cv-orb">' + esc(initials((c.first || '') + ' ' + (c.last || ''))) + '</span></div>' +
      '<h2 class="cv-h">' + esc(t('consentTitle', { name: name })) + '</h2>' +
      '<div class="cv-shares">' + SHARES.map(function (s) { return '<button class="cv-sh" data-s="' + s + '" aria-pressed="' + (share[s] ? 'true' : 'false') + '"><i></i>' + esc(L().sh[s]) + '</button>'; }).join('') + '</div>' +
      '<div class="cv-mono" style="margin-top:18px">' + esc(t('consentWho', { name: name })) + '</div>' +
      '<div class="cv-rels">' + Object.keys(rels).map(function (k) { return '<button class="cv-rel" data-rel="' + k + '" aria-pressed="' + (rel === k ? 'true' : 'false') + '">' + esc(rels[k]) + '</button>'; }).join('') + '</div>' +
      '<div class="cv-msg"></div>' +
      '<div class="cv-row"><button class="cv-btn pri" data-a="ok">' + esc(cv.state === 'active' ? t('save') : t('letIn', { name: name })) + '</button><button class="cv-btn" data-a="later">' + esc(t('notNow')) + '</button></div>' +
      '<div class="cv-row"><button class="cv-btn warn" data-a="remove">' + esc(t('remove', { name: name })) + '</button></div></div>';
    el.querySelectorAll('.cv-sh').forEach(function (b) { b.onclick = function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); }; });
    el.querySelectorAll('.cv-rel').forEach(function (b) { b.onclick = function () { el.querySelectorAll('.cv-rel').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); }; });
    el.querySelector('[data-a=later]').onclick = function () { hide(el); };
    el.querySelector('[data-a=ok]').onclick = async function () {
      var body = { share: {}, relation: '' };
      el.querySelectorAll('.cv-sh').forEach(function (b) { body.share[b.getAttribute('data-s')] = b.getAttribute('aria-pressed') === 'true' ? 1 : 0; });
      var r1 = el.querySelector('.cv-rel[aria-pressed="true"]'); body.relation = r1 ? r1.getAttribute('data-rel') : '';
      if (cv.state !== 'active') body.approve = true;
      try {
        var r = await api('/links/' + encodeURIComponent(cv.linkId), { method: 'PUT', body: body });
        if (!r.ok) throw new Error(r.status);
        hide(el); await sync();
        if (cv.state !== 'active') toast(t('joined', { name: name }));
      } catch (e) { el.querySelector('.cv-msg').textContent = t('offline'); }
    };
    el.querySelector('[data-a=remove]').onclick = async function () {
      try {
        var r = await api('/links/' + encodeURIComponent(cv.linkId), { method: 'DELETE' });
        if (!r.ok && r.status !== 404) throw new Error(r.status);
        hide(el); await sync(); toast(t('removed', { name: name }));
      } catch (e) { el.querySelector('.cv-msg').textContent = t('offline'); }
    };
    show(el);
  }

  /* ── the circle: one sphere per link ── */
  function careContacts() { try { return DEMO_CONTACTS.filter(function (c) { return c.care && c.care.linkId; }); } catch (e) { return []; } }
  function byLink(id) { return careContacts().filter(function (c) { return c.care.linkId === id; })[0] || null; }
  function pendingIds() { return careContacts().filter(function (c) { return c.care.state === 'pending' && c.care.side === 'away'; }).map(function (c) { return c.care.linkId; }); }

  var _syncing = null;
  function sync() { if (!_syncing) _syncing = _sync().finally(function () { _syncing = null; }); return _syncing; }
  async function _sync() {
    if (!authed()) return;
    var r; try { r = await api('/links'); } catch (e) { return; }
    if (!r.ok) return;
    var links = [];
    (r.data.as_home || []).forEach(function (l) { links.push({ l: l, other: l.away, side: 'away' }); });
    (r.data.as_away || []).forEach(function (l) { links.push({ l: l, other: l.home, side: 'home' }); });
    var seen = {}; var changed = false; var added = false; var newAsks = [];
    for (var i = 0; i < links.length; i++) {
      var x = links[i], l = x.l, o = x.other || {};
      seen[l.id] = true;
      var nm = String(o.name || '').trim().split(/\s+/);
      var c = byLink(l.id);
      var care = { linkId: l.id, side: x.side, userId: o.id, state: l.status, share: l.share, relation: l.relation || '', role: o.role || '' };
      if (!c) {
        c = { id: Date.now() + i, first: nm[0] || '?', last: nm.slice(1).join(' '), cat: 'family', sev: 4, phone: o.phone || '', email: o.email || '', sentinelId: o.sentinel_id || '', care: care };
        try { await RemielDB.putContact(c); } catch (e) {}
        DEMO_CONTACTS.push(c); changed = true; added = true;
        if (x.side === 'away' && l.status === 'pending') newAsks.push(c);
      } else {
        var was = JSON.stringify(c.care) + c.first + c.last + c.phone + c.email + c.sentinelId;
        c.care = care; c.first = nm[0] || c.first; c.last = nm.slice(1).join(' ');
        if (o.phone) c.phone = o.phone; if (o.email) c.email = o.email; if (o.sentinel_id) c.sentinelId = o.sentinel_id;
        if (was !== JSON.stringify(c.care) + c.first + c.last + c.phone + c.email + c.sentinelId) { try { await RemielDB.putContact(c); } catch (e) {} changed = true; }
      }
    }
    /* a link that ended takes its sphere with it */
    var gone = careContacts().filter(function (c) { return !seen[c.care.linkId]; });
    for (var g = 0; g < gone.length; g++) {
      var idx = DEMO_CONTACTS.indexOf(gone[g]); if (idx >= 0) DEMO_CONTACTS.splice(idx, 1);
      try { await RemielDB.deleteContact(gone[g].id); } catch (e) {}
      if (typeof focusedContactId !== 'undefined' && focusedContactId === gone[g].id) focusedContactId = null;
      changed = true;
    }
    if (changed) {
      try { if (typeof buildNodes === 'function') buildNodes(false); } catch (e) {}
      refreshLabels();
    }
    renderFamily();
    if (added) openCircle();
    if (newAsks.length && !_codeTimer) toast(t('asks', { name: newAsks[0].first }));
  }
  function openCircle() {
    try { if (typeof appState !== 'undefined' && appState !== 'network' && typeof enterNetwork === 'function') enterNetwork(); } catch (e) {}
  }
  /* HOME taps a sphere that is waiting: the choice opens. Only a real tap
     counts, never the slow drift between spheres when the phone is resting. */
  var _down = null;
  var _lastTouch = 0;
  function onDown(e) { _down = { x: e.clientX, y: e.clientY, t: Date.now() }; _lastTouch = Date.now(); }
  function onUp(e) {
    var d = _down; _down = null;
    if (!d || Date.now() - d.t > 600 || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 12) return;
    setTimeout(function () {
      try {
        if (role() !== 'home' || document.querySelector('.cv-ov.open')) return;
        var f = (typeof focusedContactId !== 'undefined') ? focusedContactId : null;
        var c = DEMO_CONTACTS.filter(function (x) { return x.id === f; })[0];
        if (c && c.care && c.care.side === 'away' && c.care.state === 'pending') openConsent(c);
      } catch (err) {}
    }, 160);
  }

  function waitLabel(c) { return c.care.side === 'away' ? t('waitHome') : t('waitAway'); }
  function refreshLabels() { try { if (typeof SentinelHeadlines !== 'undefined' && SentinelHeadlines.refreshAll) SentinelHeadlines.refreshAll(); } catch (e) {} }

  /* ── Settings, People and Circle: the family, what each one sees, and the code ── */
  function sharesText(sh) {
    var on = SHARES.filter(function (k) { return sh && sh[k]; }).map(function (k) { return L().sh[k]; });
    return on.length ? on.join(', ') : t('seesNothing');
  }
  function renderFamily() {
    var anchor = document.getElementById('circleSection');
    if (!anchor || !role()) return;
    var sec = document.getElementById('cvFamilySection');
    if (!sec) {
      sec = document.createElement('div'); sec.id = 'cvFamilySection'; sec.className = 'settings-section'; sec.setAttribute('data-cat', 'circle');
      anchor.parentNode.insertBefore(sec, anchor);
      try { if (anchor.classList.contains('is-cat')) sec.classList.add('is-cat'); } catch (e) {}
    }
    var home = role() === 'home';
    var rows = careContacts().map(function (c) {
      var cv = c.care, rel = cv.relation && L().rel[cv.relation] ? L().rel[cv.relation] : '';
      var sub = cv.state === 'pending' ? (home ? t('waitHome') : t('waitAway')) : home ? t('sees') + ' ' + sharesText(cv.share) : rel;
      return '<button type="button" class="cv-fam-row" data-id="' + c.id + '"><i>' + esc(initials(c.first + ' ' + c.last)) + '</i><span><b>' + esc((c.first + ' ' + c.last).trim()) + (home && rel ? ' · ' + esc(rel) : '') + '</b><small>' + esc(sub) + '</small></span></button>';
    }).join('');
    sec.innerHTML = '<div class="settings-section-title">' + esc(home ? t('famTitle') : t('lookTitle')) + '</div>' +
      '<div class="settings-card">' + (rows || '<p class="settings-help" style="margin:0 0 10px">' + esc(home ? t('famEmpty') : t('lookEmpty')) + '</p>') +
      '<div style="margin-top:12px"><button type="button" class="circle-invite-btn" data-a="link">' + esc(home ? t('linkHome') : t('linkAway')) + '</button></div></div>';
    sec.querySelector('[data-a=link]').onclick = function () { try { if (typeof _closeSettings === 'function') _closeSettings(); } catch (e) {} if (home) openCode(); else openPad(); };
    sec.querySelectorAll('.cv-fam-row').forEach(function (b) {
      b.onclick = function () { var c = careContacts().filter(function (x) { return String(x.id) === b.getAttribute('data-id'); })[0]; if (c && home) openConsent(c); };
    });
    scheduleSensors();
  }
  window.addEventListener('localeChanged', renderFamily);

  /* ── Room sensors: a fall radar in a room reports a fall straight to Covara ── */
  function sensorHome() {
    if (role() === 'home') return { q: '', name: '' };
    var h = careContacts().filter(function (c) { return c.care.side === 'home' && c.care.state === 'active' && c.care.share && c.care.share.falls; })[0];
    return h ? { q: '?home=' + encodeURIComponent(h.care.userId), body: { home: h.care.userId }, name: h.first } : null;
  }
  var _snT = null;
  function scheduleSensors() { clearTimeout(_snT); _snT = setTimeout(renderSensors, 800); }
  async function renderSensors() {
    var anchor = document.getElementById('cvFamilySection'); if (!anchor || !role() || !authed()) return;
    var sec = document.getElementById('cvSensorSection');
    if (!sec) { sec = document.createElement('div'); sec.id = 'cvSensorSection'; sec.className = 'settings-section'; sec.setAttribute('data-cat', 'circle'); anchor.parentNode.insertBefore(sec, anchor.nextSibling); try { if (anchor.classList.contains('is-cat')) sec.classList.add('is-cat'); } catch (e) {} }
    var sh = sensorHome();
    if (!sh) { sec.innerHTML = ''; return; }
    var list = [];
    try { var r = await api('/sensors' + sh.q); if (r.ok) list = r.data.sensors || []; } catch (e) {}
    var rows = list.map(function (x) {
      var st = x.last_event === 'fall' && Date.now() - x.last_event_at < 3600e3 ? t('snFall') : x.last_seen && Date.now() - x.last_seen < 15 * 60e3 ? t('snOn') : x.last_seen ? t('snQuiet') : t('snNever');
      return '<div class="cv-fam-row" style="cursor:default"><i>' + esc(initials(x.name)) + '</i><span><b>' + esc(x.name) + '</b><small>' + esc(st) + '</small></span><button type="button" class="circle-invite-btn" style="margin-left:auto" data-rm="' + esc(x.id) + '">' + esc(t('snRemove')) + '</button></div>';
    }).join('');
    sec.innerHTML = '<div class="settings-section-title">' + esc(t('snTitle')) + '</div><p class="settings-help">' + esc(t('snHelp')) + '</p>' +
      '<div class="settings-card">' + (rows || '<p class="settings-help" style="margin:0 0 10px">' + esc(t('snNone')) + '</p>') +
      '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><input class="circle-invite-input" id="cvSnName" maxlength="60" placeholder="' + esc(t('snNamePh')) + '"><button type="button" class="circle-invite-btn" data-a="add">' + esc(t('snAdd')) + '</button></div>' +
      '<div id="cvSnKey" style="display:none;margin-top:12px;font:12px/1.5 monospace;word-break:break-all;color:#ffd24d"></div></div>';
    sec.querySelector('[data-a=add]').onclick = async function () {
      var nm = (sec.querySelector('#cvSnName').value || '').trim() || t('snNamePh');
      var r = await api('/sensors', { method: 'POST', body: Object.assign({ name: nm }, sh.body || {}) }).catch(function () { return { ok: false }; });
      var out = sec.querySelector('#cvSnKey'); out.style.display = 'block';
      if (!r.ok) { out.textContent = t('offline'); return; }
      var line = 'Bearer ' + r.data.sensor.id + '.' + r.data.key;
      out.innerHTML = esc(t('snKeyOnce')) + '<br><br>' + esc(line) + '<br><br><button type="button" class="circle-invite-btn" data-a="copy">' + esc(t('snCopy')) + '</button>';
      out.querySelector('[data-a=copy]').onclick = function () { try { navigator.clipboard.writeText(line); } catch (e) {} };
    };
    sec.querySelectorAll('[data-rm]').forEach(function (b) { b.onclick = async function () { await api('/sensors/' + encodeURIComponent(b.getAttribute('data-rm')) + sh.q, { method: 'DELETE' }).catch(function () {}); renderSensors(); }; });
  }

  /* Start once the gate and onboarding are behind us and the account exists. */
  function ready() {
    var obDone = false; try { obDone = localStorage.getItem('rc:obDone') === '1'; } catch (e) {}
    var ob = document.getElementById('onboarding');
    var obOpen = !obDone || (ob && !ob.hidden && getComputedStyle(ob).display !== 'none' && getComputedStyle(ob).opacity !== '0');
    var gate = document.getElementById('gateScreen');
    var gateOpen = gate && getComputedStyle(gate).display !== 'none' && !gate.hidden && gate.offsetParent !== null;
    return !obOpen && !gateOpen && typeof DEMO_CONTACTS !== 'undefined' && typeof RemielDB !== 'undefined';
  }
  var _started = false;
  function boot() {
    if (_started) return;
    if (!ready()) { setTimeout(boot, 700); return; }
    _started = true;
    if (role()) document.body.setAttribute('data-cv-role', role());
    renderFamily();
    var stg = document.getElementById('stage'); if (stg) { stg.addEventListener('pointerdown', onDown); stg.addEventListener('pointerup', onUp); }
    if (!role()) askRole();
    (function wait() { if (authed()) { sync(); setInterval(sync, 20000); } else setTimeout(wait, 1000); })();
    document.addEventListener('visibilitychange', function () { if (!document.hidden) sync(); });
    var m = /#link=([\w-]+)/.exec(location.hash || '');
    if (m) setTimeout(function () { var c = byLink(m[1]); if (c && role() === 'home') openConsent(c); }, 2500);
  }
  window.CovaraCare = { relLabel: function (k) { return (L().rel || {})[k] || k; }, sync: sync, openCode: openCode, openPad: openPad, openConsent: openConsent, askRole: askRole, role: role, waitLabel: waitLabel, careContacts: careContacts };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 800); }); else setTimeout(boot, 800);
})();
