/* Remiel: Covara, the Voice Guide.
   One switch, kept on this phone only: on for a person who is HOME (or who has a team of their own), off for
   someone who is only on a team. While it is on, each main button says in one short line what it does, the
   first 3 times it is used; after that it stays quiet. A long press (about 600 ms) on any of these buttons
   says it again, at any time. The buttons keep doing what they do: the guide only listens, it never stops a tap.
   TALK, the Covara Button and Words listen to the room, so on a plain tap they show their line without saying
   it (the microphone would hear it); a long press says it.
   When the switch is off the guide never speaks. Alarms and Help are not the guide's business.
   The switch lives in the care card, in Me, and at the top of Learn Covara (covara-learn.js).
   window.CovaraGuide = { on(), setOn(bool), explain(key), sentences(lang) }
   Beverly Index LLC */
(function () {
  'use strict';
  var IT = function () { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var LANG = function () { return IT() ? 'it' : 'en'; };
  var S = {
    en: { guide: 'Voice Guide', guideSub: 'Covara says what each button does', on: 'On', off: 'Off', learn: 'Learn Covara', learnSub: 'Short lessons, step by step',
      nowOn: 'Voice Guide is on. Each button tells you what it does.', nowOff: 'Voice Guide is off.' },
    it: { guide: 'Guida vocale', guideSub: 'Covara dice a cosa serve ogni pulsante', on: 'Sì', off: 'No', learn: 'Impara Covara', learnSub: 'Brevi lezioni, passo per passo',
      nowOn: 'La guida vocale è attiva. Ogni pulsante ti dice a cosa serve.', nowOff: 'La guida vocale è spenta.' }
  };
  function t(k) { return (S[LANG()] || S.en)[k] || S.en[k] || k; }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ── what each main button says: the first match wins, so the narrow ones come first ── */
  var EXPLAIN = [
    { k: 'cbutton', sel: '#cvCButton', listen: true,
      en: 'The Covara Button. Tap the C and speak a note. Covara reads back what it heard, and Yes files it in your private journal. Hold the C to open your journal.',
      it: 'Il pulsante Covara. Tocca la C e detta una nota. Covara ti rilegge ciò che ha sentito, e Sì la mette nel tuo diario privato. Tieni premuta la C per aprire il diario.' },
    { k: 'talk', sel: '.cvn-orb', listen: true,
      en: 'TALK. Tap it and ask out loud. Covara answers out loud and on the screen.',
      it: 'PARLA. Toccalo e fai la domanda a voce. Covara risponde a voce e sullo schermo.' },
    { k: 'words', sel: '#cvnDock .cvs-b[data-s=words]', listen: true,
      en: 'Words. It shows the words spoken in the room, in very large letters.',
      it: 'Parole. Mostra le parole dette nella stanza, a lettere molto grandi.' },
    { k: 'care', sel: '#cvnDock .cvs-b[data-s=care]',
      en: 'Care. It opens the care of the person you look after: the day, medicines, visits, health, safety and papers.',
      it: 'Cure. Apre le cure della persona che segui: la giornata, le medicine, le visite, la salute, la sicurezza e i documenti.' },
    { k: 'camera', sel: '#cvnDock .cvs-b[data-s=camera]',
      en: 'Camera. Take a photo of a medicine bottle, a meal or a letter, and Covara files it.',
      it: 'Foto. Fotografa una confezione di medicine, un pasto o una lettera, e Covara la archivia.' },
    { k: 'messages', sel: '#cvnDock .cvs-b[data-s=messages]',
      en: 'Messages. It opens your messages with your team.',
      it: 'Messaggi. Apre i tuoi messaggi con il tuo team.' },
    { k: 'me', sel: '#cvnDock .cvs-b[data-s=me]',
      en: 'Me. Settings, Calm, Share with doctor, Add someone, and Learn Covara.',
      it: 'Io. Impostazioni, Calma, Condividi col medico, Aggiungi qualcuno, e Impara Covara.' },
    { k: 'call', sel: '#cvnDock .cvs-b[data-s=call]',
      en: 'Call team. It calls the first person on your team.',
      it: 'Chiama il team. Chiama la prima persona del tuo team.' },
    { k: 'help', sel: '#helpFab',
      en: 'Help. It opens the Help card. Press and hold the big button there to tell everyone in your circle at once.',
      it: 'Aiuto. Apre la scheda Aiuto. Tieni premuto il grande pulsante per avvisare subito tutta la tua cerchia.' },
    { k: 'whereis', sel: '#whereisAnchor',
      en: 'Communication or WHEREIS. It switches the circle above between your team and the radar of where they are.',
      it: 'Comunicazione o WHEREIS. Passa il cerchio qui sopra dal tuo team al radar di dove si trovano.' },
    { k: 'ask', sel: '#cvplSheet [data-a=ask]',
      en: 'Ask My Team. Say or type what you would like. Tap a name to ask one person, or Whole team to ask everyone.',
      it: 'Chiedi al mio team. Dì o scrivi cosa ti piacerebbe. Tocca un nome per chiedere a una persona, o Tutto il team per chiederlo a tutti.' },
    { k: 'pphone', sel: '#cvpSheet [data-a=phone], #cvpSheet [data-c=phone]',
      en: 'Call. It rings this person’s phone.',
      it: 'Chiama. Fa squillare il telefono di questa persona.' },
    { k: 'pvideo', sel: '#cvpSheet [data-a=video], #cvpSheet [data-c=video]',
      en: 'Video call. It starts a video call with this person.',
      it: 'Videochiamata. Avvia una videochiamata con questa persona.' },
    { k: 'psms', sel: '#cvpSheet [data-a=sms], #cvpSheet [data-c=sms]',
      en: 'Send a message. It opens your messages with this person.',
      it: 'Manda un messaggio. Apre i tuoi messaggi con questa persona.' },
    { k: 'pwhere', sel: '#cvpSheet [data-a=where]',
      en: 'Where is. It shows on the radar where this person is, when they share it with you.',
      it: 'Dov’è. Mostra sul radar dove si trova questa persona, quando la condivide con te.' },
    { k: 'pdrive', sel: '#cvpSheet [data-a=drive]',
      en: 'Drive to. It tells this person you are coming and opens the directions.',
      it: 'Vai da. Avvisa questa persona che stai arrivando e apre le indicazioni.' },
    { k: 'tday', sel: '#cvpSheet .cvp-tile[data-k=day]',
      en: 'Day. Meals, work, routines and tasks, and Ask My Team.',
      it: 'Giornata. Pasti, lavoro, abitudini e compiti, e Chiedi al mio team.' },
    { k: 'tmed', sel: '#cvpSheet .cvp-tile[data-k=med]',
      en: 'Medicines. Doses, photos of each bottle, and refills.',
      it: 'Medicine. Dosi, foto di ogni confezione, e ricariche.' },
    { k: 'tvisit', sel: '#cvpSheet .cvp-tile[data-k=visit]',
      en: 'Visits. Appointments, carers and the day log.',
      it: 'Visite. Appuntamenti, assistenti e il diario del giorno.' },
    { k: 'thealth', sel: '#cvpSheet .cvp-tile[data-k=health]',
      en: 'Health. Sleep, breathing, and how the day went.',
      it: 'Salute. Sonno, respiro, e com’è andata la giornata.' },
    { k: 'tsafety', sel: '#cvpSheet .cvp-tile[data-k=safety]',
      en: 'Safety. The morning check-in, night watch and the emergency card.',
      it: 'Sicurezza. Il buongiorno, la guardia notturna e la scheda di emergenza.' },
    { k: 'tpapers', sel: '#cvpSheet .cvp-tile[data-k=papers]',
      en: 'Papers. Who decides, and the documents.',
      it: 'Documenti. Chi decide, e le carte.' }
  ];

  /* ── the switch ── */
  function team() {
    try { return (typeof DEMO_CONTACTS === 'undefined' ? [] : DEMO_CONTACTS).filter(function (c) { return c.care && c.care.state === 'active' && c.care.side === 'away'; }); } catch (e) { return []; }
  }
  function defaultOn() { return role() === 'home' || team().length > 0; }
  function on() { var v = get('cvg:on'); return v === '1' ? true : v === '0' ? false : defaultOn(); }
  function setOn(b) {
    put('cvg:on', b ? '1' : '0');
    paintEntries();
    if (b) speak(t('nowOn'), true); else { tip(t('nowOff')); try { if (window.CovaraTalk && CovaraTalk.hush) CovaraTalk.hush(); } catch (e) {} }
    try { window.dispatchEvent(new CustomEvent('covara-guide', { detail: { on: !!b } })); } catch (e) {}
    return !!b;
  }

  /* ── speaking: Covara's own voice where the phone has it; never while the switch is off ── */
  function speak(text, force) {
    if (!text || !on()) return false;
    var T = window.CovaraTalk; if (!T) return false;
    var f = T.speak || T.say; if (typeof f !== 'function') return false;
    try {
      f.call(T, text);
      /* say() also shows TALK's bubble: the guide shows its own words, so that bubble is put away */
      if (!T.speak) { var b = document.getElementById('cvTalkBubble'); if (b) b.hidden = true; }
    } catch (e) { return false; }
    return true;
  }

  /* ── the look: NOUS glass, a soft glowing frame, gold and cyan ── */
  var GLASS = 'background:linear-gradient(155deg,rgba(80,140,240,.24),rgba(14,32,84,.78));-webkit-backdrop-filter:blur(16px) saturate(150%);backdrop-filter:blur(16px) saturate(150%);' +
    'border:1px solid rgba(150,200,255,.5);box-shadow:0 0 0 1px rgba(56,189,248,.12),0 0 22px rgba(70,150,255,.34),inset 0 1px 0 rgba(255,255,255,.16)';
  var css =
    '#cvgTip{position:fixed;left:50%;bottom:calc(132px + env(safe-area-inset-bottom,0px));transform:translateX(-50%) translateY(8px);z-index:2147482000;width:max-content;max-width:calc(100vw - 32px);box-sizing:border-box;' +
      'padding:11px 16px 11px 14px;border-radius:18px;display:flex;gap:10px;align-items:flex-start;color:#f2f7ff;font:600 15px/1.4 "Hanken Grotesk",system-ui,sans-serif;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;' + GLASS + ';border-color:rgba(255,210,77,.55)}' +
    '#cvgTip.show{opacity:1;transform:translateX(-50%) translateY(0)}' +
    /* while a lesson card sits at the bottom, the line shows at the top instead */
    '#cvgTip.hi{bottom:auto;top:calc(12px + env(safe-area-inset-top,0px))}' +
    '#cvgTip svg{flex:0 0 20px;width:20px;height:20px;margin-top:1px;stroke:#ffd24d;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 5px rgba(255,210,77,.6))}' +
    '#cvgTip span{min-width:0;overflow-wrap:anywhere}' +
    '#cvpSheet .cvg-entry{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0 2px}' +
    '.cvg-eb{min-height:56px;padding:8px 12px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;color:#f2f7ff;font:700 16px/1.15 "Hanken Grotesk",system-ui,sans-serif;text-align:left;' + GLASS + '}' +
    '.cvg-eb svg{flex:0 0 22px;width:22px;height:22px;stroke:#9fd8ff;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 5px rgba(56,189,248,.55))}' +
    '.cvg-eb.gold{border-color:rgba(255,210,77,.7);box-shadow:0 0 18px rgba(255,210,77,.28),inset 0 1px 0 rgba(255,255,255,.16)}.cvg-eb.gold svg{stroke:#ffd98a;filter:drop-shadow(0 0 5px rgba(255,210,77,.55))}' +
    '.cvg-eb i,#cvsMe .cvg-row i{flex:0 0 auto;font:700 11px "JetBrains Mono",monospace;letter-spacing:.14em;padding:6px 10px;border-radius:999px;border:1px solid rgba(150,200,255,.4);color:#cfe6ff;font-style:normal;text-transform:uppercase}' +
    '.cvg-eb i.on,#cvsMe .cvg-row i.on{color:#1b1405;background:linear-gradient(180deg,#ffe08a,#C5A55A);border-color:#ffd24d;box-shadow:0 0 14px rgba(255,210,77,.5)}' +
    '.cvg-eb:active{transform:scale(.985)}.cvg-eb:focus-visible{outline:2px solid #C5A55A;outline-offset:2px}' +
    '@media (max-width:360px){#cvpSheet .cvg-entry{grid-template-columns:1fr}}';
  var st = document.createElement('style'); st.id = 'cvgStyle'; st.textContent = css; document.head.appendChild(st);
  var ICON = {
    learn: '<svg viewBox="0 0 24 24"><path d="M3 9l9-4.5L21 9l-9 4.5z"/><path d="M7 11v4.5c1.4 1.4 3 2 5 2s3.6-.6 5-2V11"/><path d="M21 9v5"/></svg>',
    voice: '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>'
  };

  /* ── the line on screen, while it is said ── */
  var tipEl = null, tipT = 0;
  function tip(text) {
    if (!tipEl) { tipEl = document.createElement('div'); tipEl.id = 'cvgTip'; tipEl.setAttribute('aria-live', 'polite'); tipEl.innerHTML = ICON.voice + '<span></span>'; document.body.appendChild(tipEl); }
    tipEl.querySelector('span').textContent = text;
    tipEl.classList.toggle('hi', !!document.querySelector('#cvgCard.bottom'));
    requestAnimationFrame(function () { tipEl.classList.add('show'); });
    clearTimeout(tipT); tipT = setTimeout(function () { tipEl.classList.remove('show'); }, Math.max(4200, text.length * 70));
  }

  /* ── explanations ── */
  function lessonOn() { try { return !!(window.CovaraLearn && CovaraLearn.active()); } catch (e) { return false; } }
  function keyOf(target) {
    if (!target || !target.closest) return null;
    for (var i = 0; i < EXPLAIN.length; i++) { var el = target.closest(EXPLAIN[i].sel); if (el) return { x: EXPLAIN[i], el: el }; }
    return null;
  }
  function lineOf(x) { return x[LANG()] || x.en; }
  function counts() { try { return JSON.parse(get('cvg:n') || '{}') || {}; } catch (e) { return {}; } }
  /* explain(key): said now, whatever the count (the long press, or another module asking) */
  function explain(key) {
    var x = null; EXPLAIN.forEach(function (e) { if (e.k === key) x = e; });
    if (!x || !on()) return false;
    tip(lineOf(x)); speak(lineOf(x)); return true;
  }
  var _lp = null, _lpT = 0, _sup = null;
  document.addEventListener('click', function (e) {
    var m = keyOf(e.target); if (!m) return;
    /* the tap that ends a long press only asked for the explanation */
    if (_sup && _sup.el === m.el && Date.now() < _sup.until) { _sup = null; e.preventDefault(); e.stopImmediatePropagation(); return; }
    if (!on() || lessonOn() || !role()) return;
    var n = counts(), c = n[m.x.k] || 0; if (c >= 3) return;
    n[m.x.k] = c + 1; put('cvg:n', JSON.stringify(n));
    tip(lineOf(m.x));
    if (!m.x.listen) speak(lineOf(m.x));
  }, true);
  document.addEventListener('pointerdown', function (e) {
    clearTimeout(_lpT); _lp = null;
    if (!on() || !role()) return;
    var m = keyOf(e.target); if (!m) return;
    /* holding the C opens the journal, so the C is not explained by a long press */
    if (m.x.k === 'cbutton') return;
    _lp = { el: m.el, x: e.clientX, y: e.clientY, k: m.x.k };
    _lpT = setTimeout(function () {
      if (!_lp) return;
      var k = _lp.k, el = _lp.el; _lp = null;
      _sup = { el: el, until: Date.now() + 60000 };
      try { navigator.vibrate && navigator.vibrate(20); } catch (x) {}
      explain(k);
    }, 600);
  }, true);
  document.addEventListener('pointermove', function (e) { if (_lp && Math.abs(e.clientX - _lp.x) + Math.abs(e.clientY - _lp.y) > 14) { clearTimeout(_lpT); _lp = null; } }, true);
  /* the finger lifts after a long press: the tap that follows only asked for the explanation */
  ['pointerup', 'pointercancel'].forEach(function (ev) { document.addEventListener(ev, function () { clearTimeout(_lpT); _lp = null; if (_sup) _sup.until = Date.now() + 900; }, true); });
  document.addEventListener('contextmenu', function (e) { if (on() && keyOf(e.target)) e.preventDefault(); }, true);

  /* ── the switch and Learn Covara, in the care card and in Me ── */
  function openLearn() { try { if (window.CovaraLearn) CovaraLearn.open(); } catch (e) {} }
  function pill() { return '<i class="' + (on() ? 'on' : '') + '">' + esc(on() ? t('on') : t('off')) + '</i>'; }
  function paintEntries() {
    document.querySelectorAll('[data-g=voice]').forEach(function (b) { var i = b.querySelector('i'); if (i) { i.className = on() ? 'on' : ''; i.textContent = on() ? t('on') : t('off'); } b.setAttribute('aria-pressed', String(on())); });
  }
  function entries() {
    if (!role()) return;
    var sh = document.getElementById('cvpSheet');
    if (sh && sh.classList.contains('open')) {
      var grid = sh.querySelector('.cvp-grid');
      if (grid && !sh.querySelector('.cvg-entry')) {
        var d = document.createElement('div'); d.className = 'cvg-entry';
        d.innerHTML = '<button type="button" class="cvg-eb gold" data-g="learn">' + ICON.learn + '<span>' + esc(t('learn')) + '</span></button>' +
          '<button type="button" class="cvg-eb" data-g="voice" aria-pressed="' + on() + '">' + ICON.voice + '<span>' + esc(t('guide')) + '</span>' + pill() + '</button>';
        grid.parentNode.insertBefore(d, grid.nextSibling);
        d.querySelector('[data-g=learn]').onclick = function () { try { CovaraPerson.close(); } catch (e) {} setTimeout(openLearn, 200); };
        d.querySelector('[data-g=voice]').onclick = function () { setOn(!on()); };
      }
    }
    var me = document.getElementById('cvsMe');
    if (me && !me.hidden) {
      var box = me.querySelector('.cvs-sh');
      if (box && !box.querySelector('.cvg-row')) {
        var out = box.querySelector('[data-m=out]');
        var a = document.createElement('div');
        a.innerHTML = '<button type="button" class="cvs-row gold cvg-row" data-g="learn">' + ICON.learn + '<span><b>' + esc(t('learn')) + '</b><small>' + esc(t('learnSub')) + '</small></span></button>' +
          '<button type="button" class="cvs-row cvg-row" data-g="voice" aria-pressed="' + on() + '">' + ICON.voice + '<span><b>' + esc(t('guide')) + '</b><small>' + esc(t('guideSub')) + '</small></span>' + pill() + '</button>';
        while (a.firstChild) box.insertBefore(a.firstChild, out || null);
        box.querySelector('.cvg-row[data-g=learn]').onclick = function (e) { e.stopPropagation(); try { CovaraSimple.closeMe(); } catch (x) {} setTimeout(openLearn, 150); };
        box.querySelector('.cvg-row[data-g=voice]').onclick = function (e) { e.stopPropagation(); setOn(!on()); };
      }
    }
  }
  setInterval(entries, 400);
  window.addEventListener('localeChanged', function () { document.querySelectorAll('.cvg-entry,.cvg-row').forEach(function (x) { x.remove(); }); entries(); });

  /* every fixed sentence the guide (and Learn Covara) can say, so they can be made in Covara's voice ahead of time */
  function sentences(lang) {
    var L = String(lang || LANG()).slice(0, 2) === 'it' ? 'it' : 'en', out = [];
    EXPLAIN.forEach(function (x) { out.push(x[L]); });
    out.push(S[L].nowOn, S[L].nowOff);
    try { if (window.CovaraLearn && CovaraLearn.sentences) out = out.concat(CovaraLearn.sentences(L)); } catch (e) {}
    var seen = {};
    return out.filter(function (s) { if (!s || seen[s]) return false; seen[s] = 1; return true; });
  }

  window.CovaraGuide = { on: on, setOn: setOn, explain: explain, sentences: sentences, speak: speak, tip: tip, keys: function () { return EXPLAIN.map(function (x) { return x.k; }); }, open: openLearn };
})();
