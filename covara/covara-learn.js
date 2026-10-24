/* Remiel: Covara, Learn Covara.
   A list of short lessons, each step by step, replayable at any time; Covara remembers where the person stopped
   and which lessons are done.
   How a step runs:
   - Before a step, the lesson itself brings what it shows onto the screen: it opens the care card, a section, the
     day, the records, Me, Settings or WHEREIS with the app's own functions, waits for it to appear, scrolls the
     button into view and lights it. When something cannot be shown for this person, the step is skipped quietly.
   - A step that waits for a tap answers on three levels. Level 1: Covara says the step and the real button glows.
     Level 2 (about 8 seconds later): a shorter hint, a stronger glow and an arrow. A tap somewhere else gets one
     gentle line saying where to tap. Level 3 (about 8 seconds after that): "Shall I do it for you?" with a Do it
     button that presses it. Each right tap is answered with a short line naming what opened.
   - A step that only explains goes on with Next, or by itself a few seconds after Covara has said it.
   - At the end: what was learnt, the next lesson, and Start next lesson, All lessons and Done.
   Practice is safe: a lesson never sends a message, an ask, a call for Help or an invite. While a lesson runs,
   every button that would send something or ring someone is held back. A step that shows such a button only
   shows it; Do it is never offered there.
   window.CovaraLearn = { open(), close(), start(id), resume(id), stop(), active(), step(), lessons(), sentences(lang) }
   Beverly Index LLC */
(function () {
  'use strict';
  var IT = function () { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var LANG = function () { return IT() ? 'it' : 'en'; };
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function away() { return role() === 'away'; }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  /* a line for HOME and a line for the team: V(forHome, forTeam) */
  function V(h, a) { return { v: 1, h: h, a: a }; }
  function pick(o) { if (typeof o === 'function') o = o(); if (o && o.v) o = away() ? o.a : o.h; return o; }
  function L(o) { o = pick(o); return o ? (o[LANG()] || o.en || '') : ''; }

  /* ── the words on the card and in the list (shown, not said) ── */
  var UI = {
    en: { lead: 'LEARN COVARA', sub: 'Short lessons, step by step. Covara opens each screen and shows you the real buttons.', next: 'Next', again: 'Hear again', stop: 'Stop the lesson',
      wait: 'Tap the glowing button', fresh: 'New', at: 'Stopped at step {n} of {m}', done: 'Done', restart: 'Start again', close: 'Close',
      step: '{n} / {m}', guide: 'Voice Guide', guideSub: 'Covara says each step and what each button does', on: 'On', off: 'Off', practice: 'PRACTICE: ONLY LOOK',
      endT: 'Lesson done', startNext: 'Start next lesson', all: 'All lessons', fin: 'Done', doit: 'Do it', count: '{d} of {n} done', allDone: 'Every lesson done', resume: 'Go on' },
    it: { lead: 'IMPARA COVARA', sub: 'Brevi lezioni, passo per passo. Covara apre ogni schermata e ti mostra i pulsanti veri.', next: 'Avanti', again: 'Ripeti', stop: 'Ferma la lezione',
      wait: 'Tocca il pulsante che brilla', fresh: 'Nuova', at: 'Fermata al passo {n} di {m}', done: 'Fatta', restart: 'Ricomincia', close: 'Chiudi',
      step: '{n} / {m}', guide: 'Guida vocale', guideSub: 'Covara dice ogni passo e a cosa serve ogni pulsante', on: 'Sì', off: 'No', practice: 'PROVA: SOLO GUARDARE',
      endT: 'Lezione finita', startNext: 'Inizia la prossima', all: 'Tutte le lezioni', fin: 'Fine', doit: 'Fallo tu', count: '{d} di {n} fatte', allDone: 'Tutte le lezioni fatte', resume: 'Continua' }
  };
  function u(k, p) { var s = (UI[LANG()] || UI.en)[k] || UI.en[k] || k; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
  /* ── the fixed sentences the guide says between steps ── */
  var SAY = {
    guard: { en: 'In a lesson, nothing is sent and nobody is called.', it: 'Durante una lezione non si invia niente e non si chiama nessuno.' },
    offer: { en: 'Shall I do it for you?', it: 'Vuoi che lo faccia io?' },
    wrong: { en: 'Not quite.', it: 'Non proprio.' },
    hint: { en: 'Tap the button that glows.', it: 'Tocca il pulsante che brilla.' },
    was: { en: 'That was {x}.', it: 'Hai completato: {x}.' },
    next: { en: 'Next: {x}.', it: 'Prossima: {x}.' },
    all: { en: 'You have finished every lesson.', it: 'Hai finito tutte le lezioni.' }
  };
  function fill(o, x) { return L(o).split('{x}').join(x); }

  /* ── where things are ── */
  function shown(el) {
    if (!el || !el.getBoundingClientRect) return false;
    var r = el.getBoundingClientRect(); if (r.width < 3 || r.height < 3) return false;
    for (var x = el; x && x !== document.body; x = x.parentElement) {
      if (x.hidden) return false;
      var cs = getComputedStyle(x); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) return false;
    }
    return true;
  }
  function onTop(el) {
    /* a label that lets taps through (the WHEREIS anchor) cannot be covered-tested */
    try { if (getComputedStyle(el).pointerEvents === 'none') return true; } catch (e) {}
    var r = el.getBoundingClientRect();
    var x = Math.min(innerWidth - 2, Math.max(2, r.left + r.width / 2)), y = Math.min(innerHeight - 2, Math.max(2, r.top + Math.min(r.height / 2, 24)));
    var hit = document.elementFromPoint(x, y);
    return !hit || el === hit || el.contains(hit) || mine(hit);
  }
  function mine(n) { return !!(n && ((card && card.contains(n)) || (learn && learn.contains(n)) || (arrow && arrow.contains(n)) || (n.id === 'cvgTip' || (n.closest && n.closest('#cvgTip'))))); }
  function inView(r) { return r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth; }
  function sphereRect() { var c = document.getElementById('sphere'); return c ? c.getBoundingClientRect() : null; }
  var CENTRE = function () {
    var r = sphereRect(); if (!r || typeof netCenterR !== 'function') return null;
    var R = netCenterR(r.width, r.height) * 1.08, cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    return { rect: { left: cx - R, top: cy - R, width: 2 * R, height: 2 * R }, round: true };
  };
  /* a face on the team: any linked person, or (team lesson) a HOME whose team this person is on */
  function isTeamHome(c) { return !!(c && c.care && c.care.side === 'home' && c.care.state === 'active' && c.care.userId); }
  function faceOf(pred) {
    try {
      if (typeof NODES === 'undefined' || typeof projectNode !== 'function') return null;
      for (var i = 0; i < NODES.length; i++) {
        var n = NODES[i], c = n.contact; if (!c || !c.care || !c.care.userId || c.care.state !== 'active') continue;
        if (pred && !pred(c)) continue;
        var p = projectNode(n), R = Math.max(22, (n.r || 30) * (p.scale || 1)) * 1.25;
        if (!isFinite(p.sx) || !isFinite(p.sy)) continue;
        return { rect: { left: p.sx - R, top: p.sy - R, width: 2 * R, height: 2 * R }, round: true, c: c };
      }
    } catch (e) {}
    return null;
  }
  var FACE = function () { return faceOf(null); };
  var TEAMFACE = function () { return faceOf(isTeamHome); };
  /* the room radar: the small circle under the WHEREIS map, drawn on the canvas */
  var ROOMDOT = function () {
    try { if (!(window.CovaraWhere && CovaraWhere.on() && WhereIs.mode() === 'whereis')) return null; } catch (e) { return null; }
    var m = window._dreamMicroHit, r = sphereRect(); if (!m || !r) return null;
    return { rect: { left: r.left + m.cx - m.r, top: r.top + m.cy - m.r, width: 2 * m.r, height: 2 * m.r }, round: true };
  };
  /* a step's target: a list of selectors (the first one on the screen wins), or a function */
  function resolve(tg) {
    if (!tg) return null;
    if (typeof tg === 'function') {
      var v = tg(); if (!v) return null;
      if (v.nodeType === 1) return shown(v) ? { el: v, round: false } : null;
      return v;
    }
    var list = Array.isArray(tg) ? tg : [tg];
    for (var i = 0; i < list.length; i++) {
      var els = document.querySelectorAll(list[i]);
      var round = /cvn-orb|cvCButton/.test(list[i]) || (/data-s=(camera|words)/.test(list[i]) && document.body.classList.contains('cv-simple'));
      for (var j = 0; j < els.length; j++) if (shown(els[j])) return { el: els[j], round: round };
    }
    return null;
  }

  /* ── the states a step needs, and how the lesson brings each onto the screen ── */
  function cvpOpen() { var s = document.getElementById('cvpSheet'); return !!(s && s.classList.contains('open')); }
  var W = {
    care: function () { var s = document.getElementById('cvpSheet'); return !!(s && s.classList.contains('open') && s.querySelector('.cvp-grid')); },
    person: function () { var s = document.getElementById('cvpSheet'); return !!(s && s.classList.contains('open') && s.querySelector('.cvp-btns')); },
    words: function () { try { return !!(window.CovaraWords && CovaraWords.isOpen()); } catch (e) { return false; } },
    me: function () { var m = document.getElementById('cvsMe'); return !!(m && !m.hidden); },
    settings: function () { var p = document.getElementById('settingsPanel'); return !!(p && p.classList.contains('open')); },
    circle: function () { return W.settings() && shown(document.getElementById('cvFamilySection')); },
    where: function () { try { return WhereIs.mode() === 'whereis'; } catch (e) { return false; } },
    code: function () { var c = document.getElementById('cvCode'); return !!(c && c.classList.contains('open')); },
    room: function () { try { return !!(window.CovaraWhere && CovaraWhere.roomOpen()); } catch (e) { return false; } },
    plan: function () { try { return !!(window.CovaraPlan && CovaraPlan.isOpen()); } catch (e) { return false; } },
    ask: function () { return W.plan() && shown(document.getElementById('cvplAsk')); },
    rec: function () { try { return !!(window.CovaraRecords && CovaraRecords.isOpen()); } catch (e) { return false; } },
    notes: function () { try { return !!(window.CovaraNotes && CovaraNotes.isOpen()); } catch (e) { return false; } },
    tabs: function () { var tb = document.getElementById('cvTabs'); return !!(tb && tb.classList.contains('show')); },
    sec: function (k) { try { return W.tabs() && CovaraView.section() === k; } catch (e) { return false; } },
    tab: function (k) { var b = document.querySelector('#cvrSheet [data-tab=' + k + ']'); return W.rec() && !!b && b.getAttribute('aria-selected') === 'true'; },
    viewing: function () { try { return !!(window.CovaraTeams && CovaraTeams.viewing()); } catch (e) { return false; } }
  };
  function anyOpen() { return cvpOpen() || W.plan() || W.me() || W.settings() || W.words() || W.code() || W.room() || W.notes() || W.rec() || W.tabs(); }
  function closeAll() {
    try { if (window.CovaraPerson && CovaraPerson.isOpen()) CovaraPerson.close(); } catch (e) {}
    try { if (W.plan()) CovaraPlan.close(); } catch (e) {}
    try { if (window.CovaraSimple) CovaraSimple.closeMe(); } catch (e) {}
    try { if (W.settings() && typeof SettingsPanel !== 'undefined') SettingsPanel.close(); } catch (e) {}
    try { if (W.words()) CovaraWords.close(); } catch (e) {}
    try { var c = document.getElementById('cvCode'); if (c) c.classList.remove('open'); } catch (e) {}
    try { if (W.room()) CovaraWhere.closeRoom(); } catch (e) {}
    try { if (W.notes()) CovaraNotes.close(); } catch (e) {}
    try { if (W.rec()) CovaraRecords.close(); } catch (e) {}
    try { if (W.tabs() && window.CovaraView) CovaraView.open(''); } catch (e) {}
  }
  function comm() { try { if (W.where()) WhereIs.setMode('comm'); } catch (e) {} }
  function openFace(f) { try { if (f && f.c) CovaraPerson.open(f.c.id); } catch (e) {} }
  /* sheets that use the back button step history as they open and close, so a new one opens only on the next
     try after the old ones have closed (otherwise the old one's step back would close the new one) */
  function clear() { if (!anyOpen()) return false; closeAll(); return true; }
  function firstTeamHome() { try { return (typeof DEMO_CONTACTS === 'undefined' ? [] : DEMO_CONTACTS).filter(isTeamHome)[0] || null; } catch (e) { return null; } }
  var NEED = {
    main: { ok: function () { return !anyOpen() && !W.where(); }, go: function () { closeAll(); comm(); } },
    care: { ok: W.care, go: function () { if (clear()) return; try { CovaraPerson.openCare(); } catch (e) {} } },
    person: { ok: W.person, go: function () { if (clear()) return; comm(); openFace(FACE()); } },
    teamperson: { ok: function () { return W.person() && !!document.querySelector('#cvpSheet .cvt-team'); }, go: function () { if (clear()) return; comm(); openFace(TEAMFACE()); } },
    plan: { ok: function () { return W.plan() && !W.ask(); }, go: function () { if (!W.plan() && clear()) return; try { CovaraPlan.open(); } catch (e) {} } },
    ask: { ok: W.ask, go: function () { if (!W.plan()) { if (clear()) return; try { CovaraPlan.open(); } catch (e) {} return; } try { CovaraPlan.openAsk(''); } catch (e) {} } },
    me: { ok: W.me, go: function () { if (clear()) return; try { CovaraSimple.openMe(); } catch (e) {} } },
    settings: { ok: W.settings, go: function () { if (clear()) return; try { SettingsPanel.open(); } catch (e) {} } },
    circle: { ok: W.circle, go: function () { if (!W.settings()) { if (clear()) return; try { SettingsPanel.open(); } catch (e) {} } try { SettingsNav.showCat('circle'); } catch (e) {} } },
    whereis: { ok: function () { return W.where() && !anyOpen(); }, go: function () { if (clear()) return; try { WhereIs.setMode('whereis'); if (window.CovaraWhere) CovaraWhere.load(true); } catch (e) {} } },
    room: { ok: W.room, go: function () { if (clear()) return; try { CovaraWhere.openRoom(); } catch (e) {} } },
    words: { ok: W.words, go: function () { if (clear()) return; try { CovaraWords.open(); } catch (e) {} } },
    code: { ok: W.code, go: function () { if (clear()) return; try { CovaraCare.openCode(); } catch (e) {} } },
    journal: { ok: W.notes, go: function () { if (clear()) return; try { CovaraNotes.journal(''); } catch (e) {} } },
    viewing: { ok: function () { return W.viewing() && !anyOpen() && !W.where(); }, go: function () { if (clear()) return; var c = firstTeamHome(); try { if (c) CovaraTeams.show(c.care.userId); } catch (e) {} } },
    mine: { ok: function () { return !W.viewing() && !anyOpen() && !W.where(); }, go: function () { if (clear()) return; comm(); try { CovaraTeams.mine(true); } catch (e) {} } }
  };
  ['med', 'safety'].forEach(function (k) {
    NEED['sec:' + k] = { ok: function () { return W.sec(k) && !cvpOpen(); }, go: function () {
      if (anyOpen() && !W.tabs() && clear()) return;
      comm(); try { focusedContactId = null; } catch (e) {} try { if (CovaraView.section() !== k) CovaraView.open(''); CovaraView.open(k); } catch (e) {} } };
  });
  ['where', 'who', 'how'].forEach(function (k) {
    NEED['rec:' + k] = { ok: function () { return W.tab(k); }, go: function () { if (!W.rec() && clear()) return; try { CovaraRecords.open(k); } catch (e) {} } };
  });
  function needOk(n) { var x = n && NEED[n]; return !x || x.ok(); }
  function needGo(n) { var x = n && NEED[n]; if (x && !x.ok()) x.go(); }

  /* ── lessons: every line fixed (no names), so it can be made in Covara's voice ahead of time ── */
  var C_BTN = ['#cvCButton', '.cvn-orb'];
  var TAP_CENTRE = {
    tap: true, need: 'main', t: CENTRE, done: W.care, doit: function () { try { CovaraPerson.openCare(); } catch (e) {} },
    say: V({ en: 'Tap your big sphere to open your care.', it: 'Tocca la tua grande sfera per aprire le tue cure.' }, { en: 'Tap the big sphere to open their care.', it: 'Tocca la grande sfera per aprire le sue cure.' }),
    hint: { en: 'Tap the big sphere that glows.', it: 'Tocca la grande sfera che brilla.' },
    did: V({ en: 'Good. That opened your care.', it: 'Bene. Hai aperto le tue cure.' }, { en: 'Good. That opened their care.', it: 'Bene. Hai aperto le sue cure.' })
  };
  function tile(k, say, hint, did, done) {
    return { tap: true, need: 'care', t: '#cvpSheet .cvp-tile[data-k=' + k + ']', done: done, say: say, hint: hint, did: did };
  }
  var TAP_SAFETY = tile('safety', { en: 'Tap Safety.', it: 'Tocca Sicurezza.' }, { en: 'Safety is the glowing tile.', it: 'Sicurezza è la casella che brilla.' },
    { en: 'Good. That opened Safety.', it: 'Bene. Hai aperto Sicurezza.' }, function () { return W.sec('safety'); });
  var TO_SETTINGS = [
    { tap: true, need: 'main', t: '#cvnDock .cvs-b[data-s=me]', done: W.me, say: { en: 'Tap Me.', it: 'Tocca Io.' },
      hint: { en: 'Me is the glowing button at the bottom.', it: 'Io è il pulsante che brilla in basso.' }, did: { en: 'Good. That opened Me.', it: 'Bene. Hai aperto Io.' } },
    { tap: true, need: 'me', t: '#cvsMe [data-m=settings]', done: W.settings, say: { en: 'Tap Settings.', it: 'Tocca Impostazioni.' },
      hint: { en: 'Settings is the glowing row at the top.', it: 'Impostazioni è la riga che brilla in alto.' }, did: { en: 'Good. That opened Settings.', it: 'Bene. Hai aperto Impostazioni.' } },
    { tap: true, need: 'settings', t: '.settings-home-row[data-cat=circle]', done: W.circle, say: { en: 'Tap People and Circle.', it: 'Tocca Persone e cerchia.' },
      hint: { en: 'People and Circle is the glowing row.', it: 'Persone e cerchia è la riga che brilla.' }, did: { en: 'Good. That opened People and Circle.', it: 'Bene. Hai aperto Persone e cerchia.' } }
  ];
  function onlyAway(list) { return list.map(function (s) { var o = {}; Object.keys(s).forEach(function (k) { o[k] = s[k]; }); o.only = 'away'; return o; }); }
  function simpleOn() { try { return !!(window.CovaraSimple && CovaraSimple.on()); } catch (e) { return false; } }
  function fullOn() { try { return !!(window.CovaraSimple && CovaraSimple.full && CovaraSimple.full()); } catch (e) { return false; } }
  var SIMPLE_ON = { en: 'Your screen is simple: your team, Help, and three buttons at the bottom. Your team chose it for you.', it: 'Il tuo schermo è semplice: il tuo team, Aiuto, e tre pulsanti in basso. L’ha scelto il tuo team per te.' };
  var SIMPLE_FULL = { en: 'This phone shows the full view, with every button. The simple screen is one tap away in Me.', it: 'Questo telefono mostra la vista completa, con tutti i pulsanti. La schermata semplice è a un tocco, in Io.' };
  var SIMPLE_OFF = { en: 'This phone shows every button. Someone on your team can choose the simple screen for you.', it: 'Questo telefono mostra tutti i pulsanti. Qualcuno del tuo team può scegliere per te la schermata semplice.' };

  var LESSONS = [
    { id: 'circle', title: { en: 'Your circle', it: 'La tua cerchia' }, steps: [
      { only: 'home', need: 'main', t: CENTRE, say: { en: 'This big sphere in the middle is you. In Covara, you are HOME.', it: 'Questa grande sfera al centro sei tu. In Covara, tu sei HOME.' } },
      { only: 'home', need: 'main', t: FACE, say: { en: 'The smaller spheres are your team. Each person has Covara on their own phone.', it: 'Le sfere più piccole sono il tuo team. Ognuno ha Covara sul proprio telefono.' } },
      { only: 'away', need: 'main', t: CENTRE, say: { en: 'The big sphere in the middle is the person you look after. In Covara, they are HOME.', it: 'La grande sfera al centro è la persona che segui. In Covara, è HOME.' } },
      { only: 'away', need: 'main', say: { en: 'You are on their team. HOME chooses what each person on the team can see.', it: 'Tu fai parte del suo team. HOME sceglie cosa può vedere ognuno nel team.' } },
      TAP_CENTRE,
      { need: 'care', t: '#cvpSheet .cvp-grid', say: V({ en: 'These tiles hold your care: the day, medicines, visits, health, safety, papers and records. Your team sees only what you share.', it: 'Queste caselle contengono le tue cure: la giornata, le medicine, le visite, la salute, la sicurezza, i documenti e le cartelle. Il tuo team vede solo ciò che condividi.' },
        { en: 'These tiles hold their care: the day, medicines, visits, health, safety, papers and records.', it: 'Queste caselle contengono le sue cure: la giornata, le medicine, le visite, la salute, la sicurezza, i documenti e le cartelle.' }) },
      { need: 'care', t: '#cvpSheet .cvg-entry', say: { en: 'Learn Covara and the Voice Guide are here too, whenever you want them.', it: 'Anche Impara Covara e la Guida vocale sono qui, quando vuoi.' } }
    ] },

    { id: 'cbutton', title: { en: 'The Covara Button', it: 'Il pulsante Covara' }, steps: [
      { need: 'main', t: C_BTN, say: { en: 'This is the C, the Covara Button. Tap it and speak a note.', it: 'Questa è la C, il pulsante Covara. Toccala e detta una nota.' } },
      { need: 'main', t: C_BTN, say: { en: 'Covara reads back what it heard. Tap Yes and the note goes into your private journal.', it: 'Covara ti rilegge ciò che ha sentito. Tocca Sì e la nota va nel tuo diario privato.' } },
      { need: 'journal', t: '#cvcSheet', say: { en: 'Hold the C to open your journal. It sorts your notes by what to do, then by topic, then by person.', it: 'Tieni premuta la C per aprire il diario. Ordina le note per cosa fare, poi per argomento, poi per persona.' } },
      { need: 'main', t: C_BTN, say: { en: 'When a note needs something done, Covara may suggest a time on your day. Try it whenever you like.', it: 'Quando una nota chiede di fare qualcosa, Covara può proporti un’ora nella tua giornata. Provala quando vuoi.' } }
    ] },

    { id: 'screen', title: V({ en: 'Your screen', it: 'Il tuo schermo' }, { en: 'The simple screen', it: 'La schermata semplice' }), steps: [
      { only: 'home', need: 'main', t: '#cvnDock', say: function () { return simpleOn() ? SIMPLE_ON : fullOn() ? SIMPLE_FULL : SIMPLE_OFF; } },
      { only: 'home', when: simpleOn, need: 'main', t: '#cvnDock .cvs-b[data-s=camera]', say: { en: 'The camera, on the left of the C, takes a photo of a medicine bottle, a meal or a letter. Covara files it.', it: 'La fotocamera, a sinistra della C, fotografa una confezione di medicine, un pasto o una lettera. Covara la archivia.' } },
      { only: 'home', when: simpleOn, need: 'main', t: C_BTN, say: { en: 'The C in the middle keeps your spoken notes.', it: 'La C al centro tiene le note che detti.' } },
      { only: 'home', when: simpleOn, need: 'main', t: '#cvnDock .cvs-b[data-s=words]', say: { en: 'The speaking person, on the right of the C, opens live captions: the words said in the room, in big letters.', it: 'La persona che parla, a destra della C, apre i sottotitoli dal vivo: le parole dette nella stanza, a lettere grandi.' } },
      { only: 'home', need: 'main', t: '#cvsLine', say: { en: 'Under your picture is the next thing to do today.', it: 'Sotto la tua foto c’è la prossima cosa da fare oggi.' } },
      { only: 'home', when: simpleOn, need: 'main', say: { en: 'To see everything, hold the Covara logo for 2 seconds.', it: 'Per vedere tutto, tieni premuto il logo Covara per 2 secondi.' } },
      { only: 'home', when: fullOn, need: 'me', t: '#cvsMe [data-m=backsimple]', say: { en: 'Simple screen, here in Me, takes you back to the simple screen.', it: 'Schermata semplice, qui in Io, ti riporta alla schermata semplice.' } },
      onlyAway(TO_SETTINGS.slice(0, 1))[0],
      { only: 'away', need: 'me', t: '#cvsMe [data-m=simple]', say: { en: 'Simple screen: the person you look after sees only the next thing to do, the team, Help, the camera, the C and live captions. Here you turn it on or off.', it: 'Schermata semplice: la persona che segui vede solo la prossima cosa da fare, il team, Aiuto, la fotocamera, la C e i sottotitoli dal vivo. Qui la accendi o la spegni.' } }
    ] },

    { id: 'talk', title: { en: 'Calls and messages', it: 'Chiamate e messaggi' }, steps: [
      { only: 'home', tap: true, need: 'main', t: FACE, done: W.person, doit: function () { openFace(FACE()); }, say: { en: 'Tap a face on your team.', it: 'Tocca un volto del tuo team.' },
        hint: { en: 'Tap one of the smaller spheres that glows.', it: 'Tocca una delle sfere più piccole che brilla.' }, did: { en: 'Good. That opened their card.', it: 'Bene. Hai aperto la sua scheda.' } },
      { only: 'away', need: 'main', t: '#cvnDock .cvs-b[data-s=messages]', say: { en: 'Messages opens your messages with the team.', it: 'Messaggi apre i tuoi messaggi con il team.' } },
      { only: 'away', tap: true, need: 'main', t: CENTRE, done: W.care, doit: TAP_CENTRE.doit, say: TAP_CENTRE.say, hint: TAP_CENTRE.hint, did: TAP_CENTRE.did },
      { only: 'home', stop: true, need: 'person', t: '#cvpSheet [data-a=video]', say: { en: 'Video call starts a video call with this person. In a lesson we only look at it.', it: 'Videochiamata avvia una videochiamata con questa persona. Durante una lezione la guardiamo soltanto.' } },
      { only: 'home', stop: true, need: 'person', t: '#cvpSheet [data-a=sms]', say: { en: 'Send a message opens your messages with this person.', it: 'Manda un messaggio apre i tuoi messaggi con questa persona.' } },
      { only: 'home', stop: true, need: 'person', t: '#cvpSheet [data-a=phone]', say: { en: 'Call rings this person’s phone. Pressing it would call for real, so we only look at it.', it: 'Chiama fa squillare il telefono di questa persona. Premerlo chiamerebbe davvero, quindi lo guardiamo soltanto.' } },
      { only: 'away', stop: true, need: 'care', t: '#cvpSheet [data-c=video]', say: { en: 'Video call starts a video call with them. In a lesson we only look at it.', it: 'Videochiamata avvia una videochiamata con lei. Durante una lezione la guardiamo soltanto.' } },
      { only: 'away', stop: true, need: 'care', t: '#cvpSheet [data-c=sms]', say: { en: 'Send a message opens your messages with them.', it: 'Manda un messaggio apre i tuoi messaggi con lei.' } },
      { only: 'away', stop: true, need: 'care', t: '#cvpSheet [data-c=phone]', say: { en: 'Call rings their phone. Pressing it would call for real, so we only look at it.', it: 'Chiama fa squillare il suo telefono. Premerlo chiamerebbe davvero, quindi lo guardiamo soltanto.' } },
      { only: 'home', say: { en: 'To ask your team for something, open your day and tap Ask My Team.', it: 'Per chiedere qualcosa al tuo team, apri la tua giornata e tocca Chiedi al mio team.' } },
      { only: 'away', say: { en: 'When they ask the team for something, a card shows at the top: Yes, plan it, or Not this time.', it: 'Quando chiede qualcosa al team, appare una scheda in alto: Sì, mettilo in programma, oppure Non questa volta.' } }
    ] },

    { id: 'help', title: { en: 'Help', it: 'Aiuto' }, steps: [
      { need: 'main', say: { en: 'Help tells everyone in your circle at once and shows them where you are.', it: 'Aiuto avvisa subito tutta la tua cerchia e mostra dove sei.' } },
      { need: 'main', say: { en: 'On the Help card you press and hold the big button. Your phone then sends where you are every 15 seconds, for an hour.', it: 'Nella scheda Aiuto tieni premuto il grande pulsante. Il telefono poi invia dove sei ogni 15 secondi, per un’ora.' } },
      { stop: true, need: 'main', t: '#helpFab', say: { en: 'This is Help, at the top. A lesson never presses it, so we only look at it.', it: 'Questo è Aiuto, in alto. Una lezione non lo preme mai, quindi lo guardiamo soltanto.' } }
    ] },

    { id: 'day', title: V({ en: 'Your day', it: 'La tua giornata' }, { en: 'Their day', it: 'La sua giornata' }), steps: [
      TAP_CENTRE,
      tile('day', { en: 'Tap Day.', it: 'Tocca Giornata.' }, { en: 'Day is the first tile, glowing.', it: 'Giornata è la prima casella, quella che brilla.' },
        V({ en: 'Good. That opened your day.', it: 'Bene. Hai aperto la tua giornata.' }, { en: 'Good. That opened their day.', it: 'Bene. Hai aperto la sua giornata.' }), W.plan),
      { only: 'home', need: 'plan', t: '#cvplSheet h2', say: { en: 'Here is your day: meals, work, routines and tasks. When one is due, Covara reminds you.', it: 'Ecco la tua giornata: pasti, lavoro, abitudini e compiti. Quando è l’ora, Covara te lo ricorda.' } },
      { only: 'home', tap: true, need: 'plan', t: '#cvplSheet [data-a=ask]', done: W.ask, say: { en: 'Tap Ask My Team.', it: 'Tocca Chiedi al mio team.' },
        hint: { en: 'Ask My Team is the glowing button.', it: 'Chiedi al mio team è il pulsante che brilla.' }, did: { en: 'Good. That opened Ask My Team.', it: 'Bene. Hai aperto Chiedi al mio team.' } },
      { only: 'home', need: 'ask', t: '#cvplAsk', say: { en: 'Say it or type it. For example: pancakes for breakfast tomorrow at 9.', it: 'Dillo o scrivilo. Per esempio: frittelle a colazione domani alle 9.' } },
      { only: 'home', need: 'ask', t: '#cvplSheet [data-who]', say: { en: 'Tap a name to ask one person, or Whole team to ask everyone.', it: 'Tocca un nome per chiedere a una persona, o Tutto il team per chiederlo a tutti.' } },
      { only: 'home', stop: true, need: 'ask', t: '#cvplSheet [data-a=send]', say: { en: 'Send would send your ask for real, so we only look at it. The answer shows on a card at the top.', it: 'Invia manderebbe davvero la richiesta, quindi lo guardiamo soltanto. La risposta appare in una scheda in alto.' } },
      { only: 'away', need: 'plan', t: '#cvplSheet .pl-adds', say: { en: 'Add a meal, work hours, a routine or a task. Covara reminds them when each one comes.', it: 'Aggiungi un pasto, le ore di lavoro, un’abitudine o un compito. Covara glielo ricorda quando arriva l’ora.' } },
      { only: 'away', need: 'plan', say: { en: 'When they ask for something, a card shows: Yes, plan it, or Not this time. Yes puts it on their day.', it: 'Quando chiede qualcosa, appare una scheda: Sì, mettilo in programma, oppure Non questa volta. Sì lo mette nella sua giornata.' } }
    ] },

    { id: 'med', title: { en: 'Medicines', it: 'Medicine' }, steps: [
      TAP_CENTRE,
      tile('med', { en: 'Tap Medicines.', it: 'Tocca Medicine.' }, { en: 'Medicines is the glowing tile.', it: 'Medicine è la casella che brilla.' },
        V({ en: 'Good. That opened your Medicines.', it: 'Bene. Hai aperto le tue Medicine.' }, { en: 'Good. That opened their Medicines.', it: 'Bene. Hai aperto le sue Medicine.' }), function () { return W.sec('med'); }),
      { need: 'sec:med', t: '#cvTabs', say: { en: 'Here are the medicines and today’s doses. The Medicines tile turns red when a dose is late.', it: 'Qui ci sono le medicine e le dosi di oggi. La casella Medicine diventa rossa quando una dose è in ritardo.' } },
      { need: 'sec:med', t: '#cvTabs [data-add=med]', say: { en: 'Add a medicine opens a form. Take a photo of the bottle, and Covara reads the label for you to check.', it: 'Aggiungi una medicina apre un modulo. Fotografa la confezione, e Covara legge l’etichetta perché tu la controlli.' } },
      { need: 'sec:med', t: '#cvTabs .cvx-item[data-id=inbox]', say: { en: 'At the pharmacy, take a photo of each new bottle. Covara marks the refill as filled.', it: 'In farmacia, fotografa ogni nuova confezione. Covara segna la ricarica come ritirata.' } }
    ] },

    { id: 'words', title: { en: 'Live captions', it: 'Sottotitoli dal vivo' }, steps: [
      { tap: true, need: 'main', t: '#cvnDock .cvs-b[data-s=words]', done: W.words, say: { en: 'Tap the speaking person, on the right of the C. It opens live captions: the words said in the room, in very large letters.', it: 'Tocca la persona che parla, a destra della C. Apre i sottotitoli dal vivo: le parole dette nella stanza, a lettere molto grandi.' },
        hint: { en: 'Tap the glowing speaking person at the bottom.', it: 'Tocca la persona che parla, quella che brilla in basso.' }, did: { en: 'Good. That opened live captions.', it: 'Bene. Hai aperto i sottotitoli dal vivo.' } },
      { need: 'words', t: '#cvWords [data-a=big]', say: { en: 'Bigger and Smaller change the size of the letters.', it: 'Più grandi e Più piccole cambiano la grandezza delle lettere.' } },
      { need: 'words', t: '#cvWords [data-a=again]', say: { en: 'Say that again holds the last sentence still and big.', it: 'Ripeti tiene ferma e grande l’ultima frase.' } },
      { tap: true, need: 'words', t: '#cvWords [data-a=done]', done: function () { return !W.words(); }, say: { en: 'Nothing is saved: the words are gone when the captions close. Tap Done.', it: 'Non si salva niente: le parole spariscono quando i sottotitoli si chiudono. Tocca Fine.' },
        hint: { en: 'Done is the glowing button.', it: 'Fine è il pulsante che brilla.' }, did: { en: 'Good. The captions are closed.', it: 'Bene. I sottotitoli sono chiusi.' } }
    ] },

    { id: 'night', title: { en: 'Morning check-in and night watch', it: 'Buongiorno e guardia notturna' }, steps: [
      TAP_CENTRE, TAP_SAFETY,
      { only: 'home', need: 'sec:safety', t: '#cvTabs .cvx-item[data-id=morning]', say: { en: 'There is no morning card any more. Your first touch on Covara each morning tells your team you are up.', it: 'Non c’è più la scheda del mattino. Il primo tocco su Covara ogni mattina dice al tuo team che sei sveglio.' } },
      { only: 'home', need: 'sec:safety', t: '#cvTabs .cvx-item[data-id=morning]', say: { en: 'Here is the time it waits for. If there is no touch by then, your team is told.', it: 'Qui c’è l’ora che aspetta. Se entro quell’ora non arriva nessun tocco, il tuo team viene avvisato.' } },
      { only: 'away', need: 'sec:safety', t: '#cvTabs .cvx-item[data-id=morning]', say: { en: 'Their first touch on Covara each morning tells the team they are up. There is no card to press.', it: 'Il suo primo tocco su Covara ogni mattina dice al team che è sveglio. Non c’è nessuna scheda da premere.' } },
      { only: 'away', need: 'sec:safety', t: '#cvTabs .cvx-item[data-id=morning]', say: { en: 'Here is the time it waits for. If there is no touch by then, the team is told and their phone rings.', it: 'Qui c’è l’ora che aspetta. Se entro quell’ora non arriva nessun tocco, il team viene avvisato e il suo telefono squilla.' } },
      { need: 'sec:safety', t: '#cvTabs .cvx-item[data-id=nightw]', say: V({ en: 'Night watch: at night, your team is told when something is not as usual, like movement at an hour you are not usually up.', it: 'Guardia notturna: di notte il tuo team viene avvisato quando qualcosa non va come al solito, come un movimento a un’ora in cui di solito non sei sveglio.' },
        { en: 'Night watch: at night, the team is told when something is not as usual, like movement at an hour they are not usually up.', it: 'Guardia notturna: di notte il team viene avvisato quando qualcosa non va come al solito, come un movimento a un’ora in cui di solito non è sveglio.' }) }
    ] },

    { id: 'room', title: { en: 'Room motion', it: 'Movimento in stanza' }, steps: [
      { need: 'main', say: V({ en: 'Room motion tells your team whether your room is moving or quiet. It uses only your phone, resting on its charger.', it: 'Movimento in stanza dice al tuo team se nella tua stanza c’è movimento o quiete. Usa solo il tuo telefono, appoggiato sul caricatore.' },
        { en: 'Room motion tells you whether their room is moving or quiet. It uses only their phone, resting on its charger.', it: 'Movimento in stanza ti dice se nella sua stanza c’è movimento o quiete. Usa solo il suo telefono, appoggiato sul caricatore.' }) },
      { only: 'home', tap: true, need: 'main', t: CENTRE, done: W.care, doit: TAP_CENTRE.doit, say: TAP_CENTRE.say, hint: TAP_CENTRE.hint, did: TAP_CENTRE.did },
      onlyHome(TAP_SAFETY),
      { only: 'home', tap: true, need: 'sec:safety', t: '#cvTabs .cvr-entry button', done: W.room, say: { en: 'Tap Room motion.', it: 'Tocca Movimento in stanza.' },
        hint: { en: 'Room motion is the glowing row.', it: 'Movimento in stanza è la riga che brilla.' }, did: { en: 'Good. That opened Room motion.', it: 'Bene. Hai aperto Movimento in stanza.' } },
      { only: 'away', tap: true, need: 'main', t: '#whereisAnchor', done: W.where, doit: function () { try { WhereIs.setMode('whereis'); if (window.CovaraWhere) CovaraWhere.load(true); } catch (e) {} },
        say: { en: 'Tap WHEREIS.', it: 'Tocca WHEREIS.' }, hint: { en: 'WHEREIS is the glowing word under the circle at the top.', it: 'WHEREIS è la parola che brilla sotto il cerchio in alto.' }, did: { en: 'Good. That opened WHEREIS.', it: 'Bene. Hai aperto WHEREIS.' } },
      { only: 'away', tap: true, need: 'whereis', t: ROOMDOT, done: W.room, doit: function () { try { CovaraWhere.openRoom(); } catch (e) {} },
        say: { en: 'The small circle under the map is the room radar. Tap it.', it: 'Il cerchio piccolo sotto la mappa è il radar della stanza. Toccalo.' }, hint: { en: 'Tap the small glowing circle.', it: 'Tocca il piccolo cerchio che brilla.' }, did: { en: 'Good. That opened Room motion.', it: 'Bene. Hai aperto Movimento in stanza.' } },
      { need: 'room', t: '#cvRoom .rm-radar', say: { en: 'The radar sweeps the room every 10 seconds, and gold ripples mean movement now. The ring around it shows the last two hours.', it: 'Il radar controlla la stanza ogni 10 secondi, e le onde dorate indicano movimento adesso. L’anello intorno mostra le ultime due ore.' } },
      { need: 'room', t: '#cvRoom .rm-now', say: { en: 'Here it says in plain words: movement now, or quiet since a time.', it: 'Qui lo dice in parole semplici: movimento adesso, oppure quiete da una certa ora.' } },
      { need: 'room', t: '#cvRoom .rm-phone', say: { en: 'Here you see whether the phone is listening and when it last swept the room.', it: 'Qui vedi se il telefono è in ascolto e quando ha controllato la stanza l’ultima volta.' } },
      { need: 'room', t: '#cvRoom .rm-how', say: { en: 'When the phone is not listening, these steps turn it on.', it: 'Quando il telefono non è in ascolto, questi passi lo accendono.' } },
      { need: 'room', t: '#cvRoom .rm-limits', say: { en: 'It senses movement and stillness only. It does not tell who is moving, and it does not detect breathing or falls.', it: 'Sente solo movimento e quiete. Non dice chi si muove, e non rileva il respiro né le cadute.' } },
      { tap: true, need: 'room', t: '#cvRoom [data-a=done]', done: function () { return !W.room(); }, say: { en: 'Tap Close.', it: 'Tocca Chiudi.' },
        hint: { en: 'Close is the glowing button at the bottom.', it: 'Chiudi è il pulsante che brilla in basso.' }, did: { en: 'Good. Room motion is closed.', it: 'Bene. Movimento in stanza è chiuso.' } }
    ] },

    { id: 'whereis', title: { en: 'WHEREIS: who can see where you are', it: 'WHEREIS: chi può vedere dove sei' }, steps: [
      { only: 'home', tap: true, need: 'main', t: FACE, done: W.person, doit: function () { openFace(FACE()); }, say: { en: 'Tap a face on your team.', it: 'Tocca un volto del tuo team.' },
        hint: { en: 'Tap one of the smaller spheres that glows.', it: 'Tocca una delle sfere più piccole che brilla.' }, did: { en: 'Good. That opened their card.', it: 'Bene. Hai aperto la sua scheda.' } },
      { only: 'home', tap: true, need: 'person', t: '#cvpSheet [data-a=where]', done: W.where, say: { en: 'Tap Where is.', it: 'Tocca Dov’è.' },
        hint: { en: 'Where is is the glowing button.', it: 'Dov’è è il pulsante che brilla.' }, did: { en: 'Good. That opened WHEREIS.', it: 'Bene. Hai aperto WHEREIS.' } },
      { only: 'home', need: 'whereis', say: { en: 'The radar shows where this person is, when they share it with you. Each person chooses who can see where they are.', it: 'Il radar mostra dove si trova questa persona, quando lo condivide con te. Ognuno sceglie chi può vedere dove si trova.' } },
      { only: 'away', tap: true, need: 'main', t: '#whereisAnchor', done: W.where, doit: function () { try { WhereIs.setMode('whereis'); if (window.CovaraWhere) CovaraWhere.load(true); } catch (e) {} },
        say: { en: 'Tap WHEREIS.', it: 'Tocca WHEREIS.' }, hint: { en: 'WHEREIS is the glowing word under the circle at the top.', it: 'WHEREIS è la parola che brilla sotto il cerchio in alto.' }, did: { en: 'Good. That opened WHEREIS.', it: 'Bene. Hai aperto WHEREIS.' } },
      { only: 'away', need: 'whereis', say: { en: 'The big radar shows where the person you look after is, and who is with them. The small one shows the room.', it: 'Il radar grande mostra dove si trova la persona che segui, e chi è con lei. Quello piccolo mostra la stanza.' } }
    ].concat(onlyAway(TO_SETTINGS), [
      { only: 'away', need: 'circle', t: '#cvFamilySection .cv-myloc', say: { en: 'Here you choose who can see where you are: only the person you look after, the whole circle, or nobody.', it: 'Qui scegli chi può vedere dove sei: solo la persona che segui, tutta la cerchia, o nessuno.' } }
    ]) },

    { id: 'records', title: { en: 'Medical records', it: 'Cartelle cliniche' }, steps: [
      TAP_CENTRE,
      { tap: true, need: 'care', t: '#cvpSheet [data-k=records]', say: { en: 'Tap Records. Covara keeps where the records are and who may get them, never the records.', it: 'Tocca Cartelle. Covara tiene dove sono le cartelle e chi può averle, mai le cartelle.' },
        hint: { en: 'Records is the glowing tile.', it: 'Cartelle è la casella che brilla.' }, did: { en: 'Good. That opened Medical records.', it: 'Bene. Hai aperto le Cartelle cliniche.' } },
      { need: 'rec:where', t: '#cvrSheet [data-tab=where]', say: { en: 'Where lists the places that hold the records: doctors, hospitals, pharmacies, labs and insurers.', it: 'Dove elenca i luoghi che tengono le cartelle: medici, ospedali, farmacie, laboratori e assicurazioni.' } },
      { tap: true, need: 'rec:where', t: '#cvrSheet [data-tab=who]', done: function () { return W.tab('who'); }, say: { en: 'Tap Who may obtain.', it: 'Tocca Chi può averle.' },
        hint: { en: 'Who may obtain is the glowing tab.', it: 'Chi può averle è la scheda che brilla.' }, did: { en: 'Good. That opened Who may obtain.', it: 'Bene. Hai aperto Chi può averle.' } },
      { need: 'rec:who', t: '#cvrSheet [data-tab=who]', say: { en: 'Each entry says who may get the records, what, from where, and until when.', it: 'Ogni voce dice chi può avere le cartelle, cosa, da dove e fino a quando.' } },
      { only: 'home', need: 'rec:who', t: '#cvrSheet [data-a=new-auth]', say: { en: 'Authorize someone opens a form. Only you, or the person who decides for you, can give, change or end one.', it: 'Autorizza qualcuno apre un modulo. Solo tu, o chi decide per te, puoi darne, cambiarne o chiuderne una.' } },
      { only: 'away', need: 'rec:who', say: { en: 'You see only the entries that name you. Only HOME, or the person who decides for them, can change them.', it: 'Vedi solo le voci che ti nominano. Solo HOME, o chi decide per lei, può cambiarle.' } },
      { need: 'rec:who', t: '#cvrSheet [data-a=print]', say: { en: 'Print the form makes a HIPAA authorization ready to sign on paper.', it: 'Stampa il modulo prepara un’autorizzazione HIPAA da firmare su carta.' } },
      { tap: true, need: 'rec:who', t: '#cvrSheet [data-tab=how]', done: function () { return W.tab('how'); }, say: { en: 'Tap How to obtain.', it: 'Tocca Come ottenerle.' },
        hint: { en: 'How to obtain is the glowing tab.', it: 'Come ottenerle è la scheda che brilla.' }, did: { en: 'Good. That opened How to obtain.', it: 'Bene. Hai aperto Come ottenerle.' } },
      { need: 'rec:how', t: '#cvrSheet [data-tab=how]', say: { en: 'It shows the steps for each place in plain words: the portal, a call, or the signed form.', it: 'Mostra i passi per ogni luogo in parole semplici: il portale, una telefonata o il modulo firmato.' } }
    ] },

    { id: 'team', title: { en: 'Switching teams', it: 'Cambiare team' }, avail: function () { try { return (typeof DEMO_CONTACTS === 'undefined' ? [] : DEMO_CONTACTS).some(isTeamHome); } catch (e) { return false; } }, steps: [
      { when: W.viewing, need: 'viewing', t: '#cvTeamBar .cvt-ban', say: { en: 'This gold banner shows whose team is on your screen. Everything below belongs to that team.', it: 'Questo banner dorato mostra di chi è il team sullo schermo. Tutto ciò che c’è sotto appartiene a quel team.' } },
      { when: W.viewing, tap: true, need: 'viewing', t: '#cvTeamBar .cvt-mine', done: function () { return !W.viewing(); }, say: { en: 'Tap My team to go to your own team.', it: 'Tocca Il mio team per andare al tuo team.' },
        hint: { en: 'My team is the glowing button at the top.', it: 'Il mio team è il pulsante che brilla in alto.' }, did: { en: 'Good. This is your own team.', it: 'Bene. Questo è il tuo team.' } },
      { tap: true, need: 'mine', t: TEAMFACE, done: function () { return !!document.querySelector('#cvpSheet.open .cvt-team'); }, doit: function () { openFace(TEAMFACE()); },
        say: { en: 'Tap the sphere of a person whose team you are on.', it: 'Tocca la sfera di una persona del cui team fai parte.' }, hint: { en: 'Tap the sphere that glows.', it: 'Tocca la sfera che brilla.' }, did: { en: 'Good. That opened their card.', it: 'Bene. Hai aperto la sua scheda.' } },
      { tap: true, need: 'teamperson', t: '#cvpSheet .cvt-team', done: W.viewing, say: { en: 'Tap TEAM to move the whole screen to their team.', it: 'Tocca TEAM per portare tutto lo schermo nel suo team.' },
        hint: { en: 'TEAM is the gold button.', it: 'TEAM è il pulsante dorato.' }, did: { en: 'Good. You are now in their team.', it: 'Bene. Ora sei nel suo team.' } },
      { when: W.viewing, need: 'viewing', t: '#cvTeamBar .cvt-mine', say: { en: 'My team, at the top, always brings you back.', it: 'Il mio team, in alto, ti riporta sempre indietro.' } }
    ] },

    { id: 'invite', title: { en: 'Inviting your team with the team code', it: 'Invitare il tuo team con il codice' }, steps: [
      { only: 'home', need: 'main', say: { en: 'Your team joins you with your team code. One code works for everyone you give it to, for 24 hours.', it: 'Il tuo team entra con il tuo codice. Un solo codice vale per tutti quelli a cui lo dai, per 24 ore.' } },
      { only: 'home', need: 'code', t: '#cvCode .cv-code', say: { en: 'These six numbers are your code. The person types them in Covara on their own phone.', it: 'Questi sei numeri sono il tuo codice. La persona li scrive in Covara sul proprio telefono.' } },
      { only: 'home', need: 'code', t: '#cvCode .cv-joined', say: { en: 'Here you see who has joined with your code.', it: 'Qui vedi chi è entrato con il tuo codice.' } },
      { only: 'home', stop: true, need: 'code', t: '#cvCode [data-a=share]', say: { en: 'Send the link sends your code in a message. Pressing it would send it for real, so we only look at it.', it: 'Invia il link manda il tuo codice in un messaggio. Premerlo lo invierebbe davvero, quindi lo guardiamo soltanto.' } },
      { only: 'away', need: 'main', say: { en: 'To join a circle, ask the person for their team code. It is six numbers.', it: 'Per entrare in una cerchia, chiedi alla persona il suo codice. Sono sei numeri.' } }
    ].concat(onlyAway(TO_SETTINGS), [
      { only: 'away', stop: true, need: 'circle', t: '#cvFamilySection [data-a=link]', say: { en: 'Type a code is where you type the six numbers. That would join you for real, so we only look at it.', it: 'Scrivi un codice è dove si scrivono i sei numeri. Così entreresti davvero, quindi lo guardiamo soltanto.' } }
    ]) }
  ];
  function onlyHome(s) { var o = {}; Object.keys(s).forEach(function (k) { o[k] = s[k]; }); o.only = 'home'; return o; }

  /* While a lesson runs, these are held back: each would send, ring or change who is in the circle */
  var GUARD = ['#cvplSheet [data-a=send]', '#cvplSheet form [type=submit]', '#cvHelpCard [data-hold]', '#helpFab', '#cvCode [data-a=share]', '#cvCode [data-a=end]', '#cvCode [data-a=new]',
    '#cvpSheet [data-a=phone]', '#cvpSheet [data-a=video]', '#cvpSheet [data-a=sms]', '#cvpSheet [data-a=email]', '#cvpSheet [data-a=drive]', '#cvpSheet [data-c]', '#cvnDock .cvs-b[data-s=call]',
    '#cvNow .row button', '#cvMorning button', '#cvFamilySection [data-a=link]', '#cvsMe [data-m=out]', '#cvsMe [data-m=simple]', '#cvRoom [data-a=listen]',
    '#cvpSheet .cvt-ask', '#cvpSheet .cvt-leave', '#cvTeamLeave [data-a=leave]'].join(',');

  function stepsFor(ls) { var r = away() ? 'away' : 'home'; return ls.steps.filter(function (s) { return !s.only || s.only === r; }); }
  function lessons() { return LESSONS.filter(function (ls) { return stepsFor(ls).length > 0 && (!ls.avail || ls.avail()); }); }
  function sayOf(s) { return L(s.say); }

  /* ── progress, kept on this phone ── */
  function prog() { try { return JSON.parse(get('cvg:prog') || '{}') || {}; } catch (e) { return {}; } }
  function save(id, i, done) { var p = prog(), was = p[id] || {}; p[id] = { i: i, done: !!done || !!was.done }; put('cvg:prog', JSON.stringify(p)); }
  function markDone(id) { var p = prog(); p[id] = { i: 0, done: true }; put('cvg:prog', JSON.stringify(p)); }

  /* ── the look: NOUS glass, gold and cyan over deep blue ── */
  var GLASS = 'background:linear-gradient(160deg,rgba(70,130,235,.26) 0%,rgba(22,48,110,.62) 55%,rgba(10,22,62,.88) 100%);-webkit-backdrop-filter:blur(18px) saturate(150%);backdrop-filter:blur(18px) saturate(150%);' +
    'border:1px solid rgba(150,200,255,.5);box-shadow:0 0 0 1px rgba(56,189,248,.12),0 0 30px rgba(70,150,255,.38),inset 0 1px 0 rgba(255,255,255,.16),inset 0 0 26px rgba(110,170,255,.10)';
  var css =
    '#cvgShade{position:fixed;inset:0;z-index:2147480000;background:rgba(3,9,28,.55);pointer-events:none;opacity:0;transition:opacity .25s}#cvgShade.on{opacity:1}' +
    '#cvgRing{position:fixed;z-index:2147480500;pointer-events:none;box-sizing:border-box;border:2.5px solid #ffd24d;border-radius:22px;opacity:0;' +
      'box-shadow:0 0 0 5px rgba(56,189,248,.32),0 0 26px 8px rgba(255,210,77,.55),0 0 0 200vmax rgba(3,9,28,.62);transition:left .22s,top .22s,width .22s,height .22s,opacity .2s,border-radius .22s}' +
    '#cvgRing.on{opacity:1}#cvgRing.round{border-radius:50%}' +
    '#cvgRing:after{content:"";position:absolute;inset:-9px;border-radius:inherit;border:2px solid rgba(56,189,248,.75);animation:cvgPulse 1.5s ease-out infinite}' +
    /* level 2: a stronger, faster glow */
    '#cvgRing.l2{border-width:4px;box-shadow:0 0 0 7px rgba(255,210,77,.4),0 0 44px 16px rgba(255,210,77,.7),0 0 0 200vmax rgba(3,9,28,.68)}' +
    '#cvgRing.l2:after{border:3px solid rgba(255,226,130,.95);animation-duration:.8s}' +
    '#cvgRing.l2:before{content:"";position:absolute;inset:-18px;border-radius:inherit;border:2px solid rgba(56,189,248,.8);animation:cvgPulse .8s ease-out .4s infinite}' +
    '#cvgRing.stop{border-color:#ff7a7a;box-shadow:0 0 0 5px rgba(255,90,90,.28),0 0 26px 8px rgba(255,90,90,.45),0 0 0 200vmax rgba(3,9,28,.62)}#cvgRing.stop:after{border-color:rgba(255,160,160,.7)}' +
    '#cvgArrow{position:fixed;z-index:2147480600;width:46px;height:52px;margin-left:-23px;pointer-events:none;display:none;filter:drop-shadow(0 0 10px rgba(255,210,77,.85))}' +
    '#cvgArrow.on{display:block;animation:cvgBob .9s ease-in-out infinite}#cvgArrow.up svg{transform:rotate(180deg)}#cvgArrow svg{width:46px;height:52px;display:block}' +
    '@keyframes cvgBob{0%,100%{translate:0 0}50%{translate:0 9px}}#cvgArrow.up{animation-name:cvgBobUp}@keyframes cvgBobUp{0%,100%{translate:0 0}50%{translate:0 -9px}}' +
    /* while a lesson shows something, the Now card at the top steps aside (it can cover the care panel) */
    'body.cvg-nonow #cvNow,body.cvg-nonow #cvMorning{visibility:hidden !important}' +
    '@keyframes cvgPulse{0%{transform:scale(.96);opacity:.95}100%{transform:scale(1.12);opacity:0}}' +
    '#cvgCard{position:fixed;left:50%;transform:translateX(-50%);z-index:2147481000;width:min(520px,calc(100vw - 24px));box-sizing:border-box;padding:12px 14px 14px;border-radius:24px;color:#eef5ff;' +
      'font-family:"Hanken Grotesk",system-ui,sans-serif;text-shadow:0 1px 2px rgba(2,8,24,.55);' + GLASS + ';border-color:rgba(255,210,77,.55);animation:cvgIn .25s ease-out}' +
    '#cvgCard.top{top:calc(10px + env(safe-area-inset-top,0px))}#cvgCard.bottom{bottom:calc(12px + env(safe-area-inset-bottom,0px))}#cvgCard.mid{top:50%;transform:translate(-50%,-50%)}' +
    '@keyframes cvgIn{from{opacity:.3}to{opacity:1}}' +
    '#cvgCard .hd{display:flex;align-items:center;gap:8px;min-height:32px}' +
    '#cvgCard .hd b{flex:1;min-width:0;font:700 11px "JetBrains Mono",monospace;letter-spacing:.2em;color:#ffd24d;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#cvgCard .hd span{font:700 12px "JetBrains Mono",monospace;color:#9fd8ff;letter-spacing:.08em}' +
    '#cvgCard .x{flex:0 0 auto;width:40px;height:40px;border-radius:50%;border:1px solid rgba(150,200,255,.45);background:rgba(20,44,100,.4);color:#dce8ff;font:600 22px/1 system-ui,sans-serif;cursor:pointer}' +
    '#cvgCard .bar{height:4px;border-radius:2px;background:rgba(150,200,255,.18);margin:2px 0 6px;overflow:hidden}#cvgCard .bar i{display:block;height:100%;border-radius:2px;background:linear-gradient(90deg,#38bdf8,#ffd24d);box-shadow:0 0 8px rgba(255,210,77,.6);transition:width .3s}' +
    '#cvgCard .tt{font-weight:800;font-size:15px;color:#bfe3ff;margin:2px 0 4px}' +
    '#cvgCard .ok{display:inline-flex;align-items:center;gap:6px;margin:2px 0 4px;padding:5px 11px;border-radius:999px;font:700 13px/1.25 "Hanken Grotesk",system-ui,sans-serif;color:#1b1405;text-shadow:none;background:linear-gradient(180deg,#ffe08a,#C5A55A);box-shadow:0 0 14px rgba(255,210,77,.5)}' +
    '#cvgCard [hidden]{display:none !important}' +
    '#cvgCard .pr{display:inline-block;margin:2px 0 4px;padding:3px 9px;border-radius:999px;font:700 11px "JetBrains Mono",monospace;letter-spacing:.14em;color:#ffd0d0;border:1px solid rgba(255,120,120,.6)}' +
    '#cvgCard p{margin:4px 0 0;font-size:19px;line-height:1.38;font-weight:600;overflow-wrap:anywhere}' +
    '#cvgCard p.ms{font-size:17px;font-weight:700;color:#ffe08a;display:flex;gap:8px;align-items:flex-start}#cvgCard p.ms:before{content:"";flex:0 0 10px;height:10px;margin-top:7px;border-radius:50%;background:#ffd24d;box-shadow:0 0 10px #ffd24d}' +
    '#cvgCard p.q{font-size:20px;font-weight:800;color:#fff3cc}' +
    '#cvgCard .wt{display:flex;align-items:center;gap:8px;margin:10px 0 0;font:600 13px/1.3 "JetBrains Mono",monospace;color:#9fd8ff}' +
    '#cvgCard .wt i{width:10px;height:10px;border-radius:50%;background:#38bdf8;box-shadow:0 0 10px #38bdf8;animation:cvgDot 1.2s ease-in-out infinite}@keyframes cvgDot{50%{opacity:.25}}' +
    '#cvgCard .ac{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}#cvgCard .ac:empty{display:none}' +
    '#cvgCard .ac button{flex:1 1 0;min-width:0;min-height:50px;padding:0 10px;border-radius:16px;border:1px solid rgba(150,200,255,.5);background:linear-gradient(155deg,rgba(80,140,240,.28),rgba(18,40,96,.5));color:#f2f7ff;font:700 16px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer;box-shadow:0 0 14px rgba(70,150,255,.25)}' +
    '#cvgCard .ac button.pri{border:0;color:#2a1600;text-shadow:none;background:linear-gradient(180deg,#ffe58a,#ffc531 60%,#d99a00);box-shadow:0 0 20px rgba(255,200,60,.5)}' +
    '#cvgCard .ac button.wide{flex-basis:100%}' +
    '#cvgCard button:focus-visible,#cvgLearn button:focus-visible{outline:2px solid #38bdf8;outline-offset:2px}' +
    '#cvgLearn{position:fixed;inset:0;z-index:2147479000;display:flex;align-items:flex-end;justify-content:center;background:rgba(4,12,34,.46);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}#cvgLearn[hidden]{display:none}' +
    '#cvgLearn .sh{width:min(520px,100vw);box-sizing:border-box;max-height:90vh;max-height:90dvh;overflow-y:auto;overflow-x:hidden;padding:10px 16px calc(18px + env(safe-area-inset-bottom,0px));border-radius:26px 26px 0 0;color:#e6f1ff;' + GLASS + ';border-bottom:0;animation:cvgUp .24s ease-out;font-family:"Hanken Grotesk",system-ui,sans-serif}' +
    '@keyframes cvgUp{from{transform:translateY(40px);opacity:.4}to{transform:none;opacity:1}}' +
    '#cvgLearn .gr{width:44px;height:5px;border-radius:3px;background:rgba(200,225,255,.4);margin:2px auto 10px}' +
    '#cvgLearn .hd{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 2px 4px}' +
    '#cvgLearn .hd b{font:700 12px "JetBrains Mono",monospace;letter-spacing:.24em;color:#ffd24d;text-transform:uppercase}' +
    '#cvgLearn .hd span{flex:1;text-align:right;font:700 12px "JetBrains Mono",monospace;color:#9fd8ff;letter-spacing:.06em}' +
    '#cvgLearn .x{min-width:48px;min-height:48px;border-radius:50%;border:1px solid rgba(150,200,255,.35);background:rgba(20,44,100,.3);color:#cfe6ff;font-size:22px;cursor:pointer}' +
    '#cvgLearn .sb{margin:0 2px 12px;font-size:14px;line-height:1.4;color:#b9cdea}' +
    '#cvgLearn .rw{width:100%;display:flex;align-items:center;gap:12px;min-height:64px;margin:0 0 9px;padding:10px 12px;box-sizing:border-box;border-radius:18px;cursor:pointer;text-align:left;color:#eef5ff;font:inherit;' +
      'background:linear-gradient(155deg,rgba(80,140,240,.20),rgba(18,40,96,.40));border:1px solid rgba(150,200,255,.42);box-shadow:0 0 16px rgba(70,150,255,.22),inset 0 1px 0 rgba(255,255,255,.14)}' +
    '#cvgLearn .rw.gold,#cvgLearn .rw.here{border-color:rgba(255,210,77,.6);box-shadow:0 0 18px rgba(255,210,77,.24),inset 0 1px 0 rgba(255,255,255,.14)}' +
    '#cvgLearn .rw .n{flex:0 0 36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:800 15px "JetBrains Mono",monospace;color:#04121f;background:radial-gradient(circle at 35% 30%,#fff 0,#9fe7ff 22%,#38bdf8 60%,#0b3a66 100%);box-shadow:0 0 12px rgba(56,189,248,.6)}' +
    '#cvgLearn .rw .n.dn{background:radial-gradient(circle at 35% 30%,#fff7d6 0,#ffe08a 30%,#C5A55A 75%);box-shadow:0 0 12px rgba(255,210,77,.6);font-size:18px}' +
    '#cvgLearn .rw span{flex:1;min-width:0}#cvgLearn .rw b{display:block;font:700 17px/1.25 "Hanken Grotesk",system-ui,sans-serif}' +
    '#cvgLearn .rw small{display:block;margin-top:2px;font:600 12px/1.3 "JetBrains Mono",monospace;color:#9fd8ff}#cvgLearn .rw small.dn{color:#ffd98a}#cvgLearn .rw small.at{color:#ffe9a8}' +
    '#cvgLearn .rw i{flex:0 0 auto;font:700 12px "JetBrains Mono",monospace;letter-spacing:.14em;padding:7px 12px;border-radius:999px;border:1px solid rgba(150,200,255,.4);color:#cfe6ff;font-style:normal;text-transform:uppercase}' +
    '#cvgLearn .rw i.on{color:#1b1405;background:linear-gradient(180deg,#ffe08a,#C5A55A);border-color:#ffd24d;box-shadow:0 0 14px rgba(255,210,77,.5)}' +
    '#cvgLearn .rs{flex:0 0 auto;min-height:40px;padding:0 12px;border-radius:14px;border:1px solid rgba(150,200,255,.45);background:rgba(20,44,100,.35);color:#cfe6ff;font:700 13px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer}' +
    '@media (prefers-reduced-motion: reduce){#cvgRing,#cvgRing:after,#cvgRing:before,#cvgCard,#cvgLearn .sh,#cvgArrow{transition:none;animation:none}}';
  var st = document.createElement('style'); st.id = 'cvlStyle'; st.textContent = css; document.head.appendChild(st);

  function guideOn() { try { return !!(window.CovaraGuide && CovaraGuide.on()); } catch (e) { return false; } }
  function speak(text) { try { if (window.CovaraGuide && CovaraGuide.speak) return CovaraGuide.speak(text); } catch (e) {} return false; }
  /* about how long a line takes to say (the same reckoning the voice uses) */
  function talkMs(text) { return String(text || '').split(/\s+/).filter(Boolean).length * 420 + 1500; }

  /* ── the Learn Covara list ── */
  var learn = null;
  function open() {
    if (!learn) {
      learn = document.createElement('div'); learn.id = 'cvgLearn'; learn.hidden = true; learn.setAttribute('role', 'dialog'); learn.setAttribute('aria-modal', 'true');
      ['pointerdown', 'mousedown', 'touchstart', 'click'].forEach(function (ev) { learn.addEventListener(ev, function (e) { e.stopPropagation(); }); });
      learn.addEventListener('click', function (e) { if (e.target === learn) close(); });
      document.body.appendChild(learn);
    }
    if (R) stop(true);
    dropCard();
    drawLearn(); learn.hidden = false;
  }
  function close() { if (learn) learn.hidden = true; }
  function drawLearn() {
    if (!learn) return;
    var p = prog(), g = guideOn(), ls = lessons(), nd = ls.filter(function (x) { return p[x.id] && p[x.id].done; }).length;
    var h = '<div class="sh"><div class="gr"></div><div class="hd"><b>' + esc(u('lead')) + '</b><span>' + esc(nd === ls.length ? u('allDone') : u('count', { d: nd, n: ls.length })) + '</span><button type="button" class="x" data-l="x" aria-label="' + esc(u('close')) + '">×</button></div>' +
      '<div class="sb">' + esc(u('sub')) + '</div>' +
      '<button type="button" class="rw gold" data-l="voice" aria-pressed="' + g + '"><span><b>' + esc(u('guide')) + '</b><small>' + esc(u('guideSub')) + '</small></span><i class="' + (g ? 'on' : '') + '">' + esc(g ? u('on') : u('off')) + '</i></button>';
    ls.forEach(function (x, k) {
      var n = stepsFor(x).length, q = p[x.id], status, cls = '', stopped = q && q.i > 0;
      if (stopped) { status = u('at', { n: Math.min(q.i + 1, n), m: n }); cls = 'at'; }
      else if (q && q.done) { status = u('done'); cls = 'dn'; }
      else status = u('fresh');
      h += '<div style="display:flex;gap:8px;align-items:stretch"><button type="button" class="rw' + (stopped ? ' here' : '') + '" data-l="go" data-id="' + x.id + '"><span class="n' + (q && q.done ? ' dn' : '') + '">' + (q && q.done ? '✓' : (k + 1)) + '</span>' +
        '<span><b>' + esc(L(x.title)) + '</b><small class="' + cls + '">' + esc(status) + '</small></span></button>' +
        (q && (q.done || q.i > 0) ? '<button type="button" class="rs" data-l="re" data-id="' + x.id + '" style="margin-bottom:9px">' + esc(u('restart')) + '</button>' : '') + '</div>';
    });
    learn.innerHTML = h + '</div>';
    learn.querySelectorAll('[data-l]').forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        var a = b.getAttribute('data-l');
        if (a === 'x') return close();
        if (a === 'voice') { try { CovaraGuide.setOn(!guideOn()); } catch (x) {} drawLearn(); return; }
        if (a === 'go') { close(); start(b.getAttribute('data-id'), false); return; }
        if (a === 're') { close(); start(b.getAttribute('data-id'), true); }
      };
    });
  }

  /* ── running a lesson ── */
  var R = null, card = null, ring = null, shade = null, arrow = null, loopT = 0;
  function start(id, fresh) {
    var ls = lessons().filter(function (x) { return x.id === id; })[0]; if (!ls) return false;
    if (R) stop(false);
    close(); dropCard();
    var steps = stepsFor(ls), q = prog()[id], i = 0;
    /* each step brings its own screen, so a lesson goes on from exactly where it stopped */
    if (!fresh && q && q.i > 0) i = Math.min(q.i, steps.length - 1);
    closeAll();
    build();
    /* the numbers on the card count the steps this person will see */
    var pos = [], m = 0; steps.forEach(function (x) { pos.push(m); if (!x.when || safe(x.when)) m++; });
    R = { ls: ls, steps: steps, i: -1, phase: 'prep', pos: pos, m: Math.max(1, m) };
    setTimeout(function () { if (R && R.ls === ls && R.i < 0) go(i, ''); }, 450);
    clearInterval(loopT); loopT = setInterval(loop, 150);
    return true;
  }
  function build() {
    if (!shade || !shade.isConnected) { shade = document.createElement('div'); shade.id = 'cvgShade'; document.body.appendChild(shade); }
    if (!ring || !ring.isConnected) { ring = document.createElement('div'); ring.id = 'cvgRing'; ring.setAttribute('aria-hidden', 'true'); document.body.appendChild(ring); }
    if (!arrow || !arrow.isConnected) {
      arrow = document.createElement('div'); arrow.id = 'cvgArrow'; arrow.setAttribute('aria-hidden', 'true');
      arrow.innerHTML = '<svg viewBox="0 0 46 52"><path d="M23 50 L4 28 H15 V3 H31 V28 H42 Z" fill="#ffd24d" stroke="#fff3cc" stroke-width="2" stroke-linejoin="round"/></svg>';
      document.body.appendChild(arrow);
    }
    if (!card || !card.isConnected) {
      if (card) card.remove();
      card = document.createElement('div'); card.id = 'cvgCard'; card.className = 'bottom'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-live', 'polite');
      ['pointerdown', 'mousedown', 'touchstart', 'click'].forEach(function (ev) { card.addEventListener(ev, function (e) { e.stopPropagation(); }); });
      document.body.appendChild(card);
    }
  }
  function dropCard() { if (card) { card.remove(); card = null; } if (ring) ring.className = ''; if (shade) shade.classList.remove('on'); if (arrow) arrow.className = ''; }
  /* go to step i; pre is the short line that answers the last tap, said before this step */
  function go(i, pre) {
    if (!R) return;
    if (i >= R.steps.length) return finish(pre);
    var s = R.steps[i];
    if (s.when && !s.when()) return go(i + 1, pre);
    R.i = i; R.phase = 'prep'; R.pre = pre || ''; R.prepAt = Date.now(); R.tries = 0; R.el = null; R.res = null;
    R.level = 1; R.wrong = false; R.sig = ''; R.same = 0; R.clicked = false; R.scrolled = false; R.down = null;
    save(R.ls.id, i, false);
    if (ring) ring.className = ''; if (arrow) arrow.className = '';
    if (R.pre) drawCard();
    prep();
  }
  /* bring the step's screen up, and wait for its button; a step that cannot be shown is skipped without a word */
  function prep() {
    if (!R || R.phase !== 'prep') return;
    var s = R.steps[R.i], age = Date.now() - R.prepAt;
    if (s.tap && s.done && age < 160 && needOk(s.need) && safe(s.done)) return go(R.i + 1, R.pre);
    if (!needOk(s.need)) {
      if (age >= R.tries * 600) { R.tries++; try { needGo(s.need); } catch (e) {} }
    } else {
      var res = s.t ? resolve(s.t) : null;
      if (res && res.el && inView(res.el.getBoundingClientRect()) && !onTop(res.el)) res = null;
      if (!s.t) return present(null);
      if (res) {
        /* wait until it has stopped moving (a sheet still sliding up), so the glow lands on it */
        var r = res.el ? res.el.getBoundingClientRect() : res.rect, sig = Math.round(r.left) + ',' + Math.round(r.top) + ',' + Math.round(r.width) + ',' + Math.round(r.height);
        if (sig === R.sig) R.same++; else { R.sig = sig; R.same = 0; }
        if ((R.same >= 2 && age > 300) || age > 2500) return present(res);
        return;
      }
    }
    if (age > 5000) return go(R.i + 1, R.pre);
  }
  function safe(f) { try { return !!f(); } catch (e) { return false; } }
  function present(res) {
    var s = R.steps[R.i];
    R.phase = 'show'; R.shownAt = Date.now(); R.res = res; R.el = res && res.el || null;
    if (R.el && !inView(R.el.getBoundingClientRect())) { try { R.el.scrollIntoView({ block: 'center', behavior: 'auto' }); } catch (e) {} R.scrolled = true; }
    var line = sayOf(s), said = (R.pre ? R.pre + ' ' : '') + line;
    R.okText = R.pre; R.pre = '';
    drawCard(); place();
    speak(said);
    R.talkEnd = Date.now() + talkMs(said);
    if (s.tap) R.t2 = Math.max(R.shownAt + 8000, R.talkEnd + 4000);
    else R.auto = R.talkEnd + 3500;
    setTimeout(function () { if (R && R.phase === 'show' && R.okText && card) { var ok = card.querySelector('.ok'); if (ok) ok.hidden = true; R.okText = ''; } }, 2600);
  }
  function level2(byWrong) {
    var s = R.steps[R.i]; if (R.level >= 2 && !byWrong) return;
    R.level = Math.max(R.level, 2);
    var hint = L(s.hint || SAY.hint);
    var line = byWrong ? L(SAY.wrong) + ' ' + hint : hint;
    drawCard(); place();
    speak(line);
    R.t3 = Math.max(Date.now() + 8000, Date.now() + talkMs(line) + 4000);
  }
  function level3() {
    R.level = 3; drawCard(); place();
    speak(L(SAY.offer));
  }
  function doIt() {
    if (!R || R.phase !== 'show') return;
    var s = R.steps[R.i]; if (!s.tap || s.stop) return;
    R.didIt = true;
    if (s.doit) { try { s.doit(); } catch (e) {} }
    else if (R.el) { try { R.el.click(); } catch (e) {} }
    if (!s.done) { var i = R.i; setTimeout(function () { if (R && R.i === i && R.phase === 'show') right(); }, 300); }
  }
  /* the tap the step waited for */
  function right() {
    if (!R || R.phase !== 'show') return;
    var s = R.steps[R.i], i = R.i;
    R.phase = 'done'; R.okText = L(s.did); R.level = 1;
    if (ring) ring.className = ''; if (arrow) arrow.className = ''; if (shade) shade.classList.remove('on');
    drawCard();
    setTimeout(function () { if (R && R.i === i && R.phase === 'done') go(i + 1, L(s.did)); }, 450);
  }
  function drawCard() {
    if (!R || !card || R.i < 0) return;
    var s = R.steps[R.i], n = R.steps.length, tap = s.tap && !s.stop, lv = R.level || 1;
    var act = '', again = guideOn() ? '<button type="button" data-c="again">' + esc(u('again')) + '</button>' : '';
    if (!tap) act = '<button type="button" class="pri" data-c="next">' + esc(u('next')) + '</button>';
    else if (lv >= 3 && R.phase === 'show') act = '<button type="button" class="pri" data-c="doit">' + esc(u('doit')) + '</button>';
    var hint = tap && lv >= 2 && R.phase === 'show' ? L(s.hint || SAY.hint) : '';
    card.innerHTML = '<div class="hd"><b>' + esc(u('lead')) + '</b><span>' + esc(u('step', { n: Math.min(R.m, R.pos[R.i] + 1), m: R.m })) + '</span><button type="button" class="x" data-c="x" aria-label="' + esc(u('stop')) + '">×</button></div>' +
      '<div class="bar"><i style="width:' + Math.round(100 * Math.min(1, (R.pos[R.i] + (R.phase === 'done' ? 1 : 0)) / R.m)) + '%"></i></div>' +
      '<div class="tt">' + esc(L(R.ls.title)) + '</div>' +
      '<div class="ok"' + (R.okText ? '' : ' hidden') + '>✓ ' + esc(R.okText) + '</div>' +
      '<div class="pr"' + (s.stop ? '' : ' hidden') + '>' + esc(u('practice')) + '</div>' +
      (R.phase === 'done' ? '' : '<p class="tx">' + esc(sayOf(s)) + '</p>') +
      '<p class="ms"' + (hint ? '' : ' hidden') + '>' + esc(hint) + '</p>' +
      '<p class="q"' + (tap && lv >= 3 && R.phase === 'show' ? '' : ' hidden') + '>' + esc(L(SAY.offer)) + '</p>' +
      '<div class="wt"' + (tap && lv < 2 && R.phase === 'show' ? '' : ' hidden') + '><i></i>' + esc(u('wait')) + '</div>' +
      '<div class="ac">' + (R.phase === 'done' ? '' : again + act) + '</div>';
    card.querySelectorAll('[data-c]').forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        var c = b.getAttribute('data-c'); if (!R) return;
        if (c === 'x') return stop(true);
        if (c === 'again') {
          var st0 = R.steps[R.i], ln = sayOf(st0) + (st0.tap && R.level >= 2 ? ' ' + L(st0.hint || SAY.hint) : '');
          speak(ln); if (!st0.tap) R.auto = Date.now() + talkMs(ln) + 3500; else { R.t2 = Math.max(R.t2 || 0, Date.now() + talkMs(ln) + 4000); if (R.t3) R.t3 = Math.max(R.t3, Date.now() + talkMs(ln) + 4000); }
          return;
        }
        if (c === 'next') { if (R.phase === 'show' || R.phase === 'prep') go(R.i + 1, ''); return; }
        if (c === 'doit') doIt();
      };
    });
  }
  function place() {
    if (!R || !card || R.i < 0) return;
    var s = R.steps[R.i], res = R.res, r = null;
    if (res && res.el) r = res.el.getBoundingClientRect(); else if (res && res.rect) r = res.rect;
    if (!r || R.phase !== 'show') {
      var bare = R.phase === 'show' && !s.t;
      ring.className = ''; arrow.className = ''; shade.classList.toggle('on', bare);
      var w0 = bare ? 'mid' : card.className || 'bottom'; if (card.className !== w0) card.className = w0; return;
    }
    shade.classList.remove('on');
    var pad = res.round ? 6 : 7;
    ring.style.left = Math.round(r.left - pad) + 'px'; ring.style.top = Math.round(r.top - pad) + 'px';
    ring.style.width = Math.round(r.width + 2 * pad) + 'px'; ring.style.height = Math.round(r.height + 2 * pad) + 'px';
    var cls = 'on' + (res.round ? ' round' : '') + (s.stop ? ' stop' : '') + (s.tap && R.level >= 2 ? ' l2' : '');
    if (ring.className !== cls) ring.className = cls;
    /* the card goes where it does not cover the button */
    var ch = card.offsetHeight || 200, above = r.top, below = innerHeight - r.bottom;
    var want = below >= ch + 24 ? 'bottom' : above >= ch + 24 ? 'top' : (r.top + r.height / 2 > innerHeight / 2 ? 'top' : 'bottom');
    if (card.className !== want) card.className = want;
    /* level 2 and 3: an arrow pointing at the button, on the side away from the card */
    if (s.tap && R.level >= 2) {
      var cr = card.getBoundingClientRect(), up = r.top < 70 || (want === 'top' && r.top - 60 < cr.bottom && r.bottom + 60 < innerHeight);
      var cx = Math.max(26, Math.min(innerWidth - 26, r.left + r.width / 2));
      arrow.style.left = Math.round(cx) + 'px'; arrow.style.top = Math.round(up ? r.bottom + 8 : r.top - 60) + 'px';
      var ac = 'on' + (up ? ' up' : ''); if (arrow.className !== ac) arrow.className = ac;
    } else if (arrow.className) arrow.className = '';
  }
  function loop() {
    if (!R || R.i < 0) return;
    var s = R.steps[R.i];
    document.body.classList.add('cvg-nonow');
    if (R.phase === 'prep') return prep();
    if (R.phase !== 'show') return;
    var res = s.t ? resolve(s.t) : null;
    if (res && res.el && inView(res.el.getBoundingClientRect()) && !onTop(res.el)) res = null;
    if (s.t) { R.res = res; R.el = res && res.el || R.el; }
    place();
    var now = Date.now();
    if (s.tap && !s.stop) {
      if (s.done && now - R.shownAt > 250 && safe(s.done)) return right();
      /* the screen it needed went away (closed by hand): bring it back */
      if (s.t && !res) {
        if (!R.lostAt) R.lostAt = now;
        if (now - R.lostAt > 1200) {
          R.lostAt = 0;
          if (!needOk(s.need)) { try { needGo(s.need); } catch (e) {} }
          /* something else opened over the main screen: put it away */
          else if (/^(main|mine|viewing|whereis)$/.test(s.need || 'main') && anyOpen()) closeAll();
        }
      } else R.lostAt = 0;
      if (R.level < 2 && now > R.t2) level2(false);
      else if (R.level === 2 && R.t3 && now > R.t3) level3();
    } else if (now > R.auto) go(R.i + 1, '');
  }
  function nextOf(id) {
    var ls = lessons(), p = prog(), k = -1;
    ls.forEach(function (x, j) { if (x.id === id) k = j; });
    if (k >= 0 && k + 1 < ls.length) return ls[k + 1];
    return ls.filter(function (x) { return x.id !== id && !(p[x.id] && p[x.id].done); })[0] || null;
  }
  function finish(pre) {
    if (!R) return;
    var ls = R.ls; markDone(ls.id);
    R = null; clearInterval(loopT); document.body.classList.remove('cvg-nonow');
    var nx = nextOf(ls.id), title = L(ls.title);
    var line = fill(SAY.was, title) + ' ' + (nx ? fill(SAY.next, L(nx.title)) : L(SAY.all));
    speak((pre ? pre + ' ' : '') + line);
    build();
    if (ring) ring.className = ''; if (arrow) arrow.className = ''; if (shade) shade.classList.remove('on');
    card.className = 'bottom';
    card.innerHTML = '<div class="hd"><b>' + esc(u('lead')) + '</b><button type="button" class="x" data-c="x" aria-label="' + esc(u('close')) + '">×</button></div>' +
      '<div class="bar"><i style="width:100%"></i></div>' +
      '<div class="ok">✓ ' + esc(u('endT')) + '</div><p class="tx">' + esc(line) + '</p>' +
      '<div class="ac">' + (nx ? '<button type="button" class="pri wide" data-c="next">' + esc(u('startNext')) + '</button>' : '') +
      '<button type="button" data-c="list">' + esc(u('all')) + '</button><button type="button" data-c="done">' + esc(u('fin')) + '</button></div>';
    card.setAttribute('data-next', nx ? nx.id : '');
    card.querySelector('[data-c=x]').onclick = function (e) { e.stopPropagation(); dropCard(); };
    card.querySelector('[data-c=done]').onclick = function (e) { e.stopPropagation(); dropCard(); };
    card.querySelector('[data-c=list]').onclick = function (e) { e.stopPropagation(); dropCard(); open(); };
    var nb = card.querySelector('[data-c=next]'); if (nb) nb.onclick = function (e) { e.stopPropagation(); dropCard(); start(nx.id, true); };
  }
  function stop(keep) {
    if (!R) return;
    if (keep && R.i >= 0) save(R.ls.id, R.i, false);
    R = null; clearInterval(loopT); document.body.classList.remove('cvg-nonow');
    try { if (window.CovaraTalk && CovaraTalk.hush) CovaraTalk.hush(); } catch (e) {}
    dropCard();
  }

  /* ── taps while a lesson runs ── */
  function pt(e) { var t = (e.changedTouches && e.changedTouches[0]) || (e.touches && e.touches[0]) || e; return { x: t.clientX, y: t.clientY }; }
  function onTarget(e) {
    if (!R || !R.res) return false;
    if (R.el && e.target && R.el.contains(e.target)) return true;
    var r = R.el ? R.el.getBoundingClientRect() : R.res.rect, p = pt(e); if (!r || !isFinite(p.x)) return false;
    return p.x >= r.left - 8 && p.x <= r.left + r.width + 8 && p.y >= r.top - 8 && p.y <= r.top + r.height + 8;
  }
  function waiting() { if (!R || R.phase !== 'show') return false; var s = R.steps[R.i]; return !!(s.tap && !s.stop); }
  /* practice safety: while a lesson runs nothing that sends or rings can be pressed */
  var _gAt = 0;
  function guardSay() { if (Date.now() - _gAt < 2500) return; _gAt = Date.now(); try { CovaraGuide.tip(L(SAY.guard)); } catch (e) {} speak(L(SAY.guard)); }
  function guard(e) {
    if (!R || !e.target || !e.target.closest) return;
    if (mine(e.target)) return;
    if (e.target.closest(GUARD)) { e.preventDefault(); e.stopImmediatePropagation(); if (e.type === 'click' || e.type === 'pointerdown') guardSay(); return; }
    /* a step waiting for a tap: only the glowing button answers; a tap elsewhere gets one gentle line */
    if (waiting() && e.type !== 'keydown' && !onTarget(e)) {
      if (e.type !== 'touchstart' && e.cancelable) e.preventDefault();
      e.stopImmediatePropagation();
      if (e.type === 'pointerdown' && !R.wrong) { R.wrong = true; level2(true); }
    }
  }
  ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'click', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (ev === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return; guard(e); }, { capture: true, passive: false });
  });
  /* the tap the step is waiting for, on a step that has no state to watch: seen before the button's own handler, never stopped */
  document.addEventListener('pointerdown', function (e) { if (waiting() && !R.steps[R.i].done && onTarget(e)) R.down = { i: R.i }; }, true);
  document.addEventListener('pointerup', function () {
    if (!R || !R.down || R.down.i !== R.i) return;
    var i = R.i; R.down = null;
    setTimeout(function () { if (R && R.i === i && R.phase === 'show' && !R.clicked && R.el && !R.el.isConnected) { R.clicked = true; right(); } }, 400);
  }, true);
  document.addEventListener('click', function (e) {
    if (!waiting() || R.steps[R.i].done || R.clicked || !onTarget(e)) return;
    R.clicked = true; var i = R.i;
    setTimeout(function () { if (R && R.i === i) right(); }, 350);
  }, true);

  window.addEventListener('localeChanged', function () { if (R && R.i >= 0) drawCard(); if (learn && !learn.hidden) drawLearn(); });
  window.addEventListener('covara-guide', function () { if (learn && !learn.hidden) drawLearn(); if (R && R.i >= 0) drawCard(); });

  /* every fixed sentence a lesson can say, in one language */
  function sentences(lang) {
    var k = String(lang || LANG()).slice(0, 2) === 'it' ? 'it' : 'en', out = [];
    function add(o) { if (!o) return; if (o.v) { add(o.h); add(o.a); return; } if (o[k]) out.push(o[k]); }
    LESSONS.forEach(function (ls) {
      ls.steps.forEach(function (s) { if (typeof s.say === 'function') { add(SIMPLE_ON); add(SIMPLE_FULL); add(SIMPLE_OFF); } else add(s.say); add(s.hint); add(s.did); });
    });
    ['guard', 'offer', 'wrong', 'hint', 'all'].forEach(function (x) { add(SAY[x]); });
    LESSONS.forEach(function (ls) {
      var ts = ls.title.v ? [ls.title.h[k], ls.title.a[k]] : [ls.title[k]];
      ts.forEach(function (tt) { out.push(SAY.was[k].split('{x}').join(tt), SAY.next[k].split('{x}').join(tt)); });
    });
    var seen = {};
    return out.filter(function (s) { if (!s || seen[s]) return false; seen[s] = 1; return true; });
  }

  window.CovaraLearn = { open: open, close: close, start: function (id, fresh) { return start(id, fresh !== false); }, resume: function (id) { return start(id, false); }, stop: function () { stop(true); },
    active: function () { return !!R; },
    step: function () { return R ? { id: R.ls.id, i: R.i, n: R.steps.length, phase: R.phase, level: R.level, tap: !!(R.i >= 0 && R.steps[R.i].tap), stop: !!(R.i >= 0 && R.steps[R.i].stop), text: R.i >= 0 ? sayOf(R.steps[R.i]) : '', target: !!R.el || !!(R.res && R.res.rect),
      rect: (function () { var r = R.el ? R.el.getBoundingClientRect() : R.res && R.res.rect; return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height } : null; })() } : null; },
    doIt: doIt,
    lessons: function () { var p = prog(); return lessons().map(function (x) { return { id: x.id, title: L(x.title), steps: stepsFor(x).length, done: !!(p[x.id] && p[x.id].done), at: p[x.id] ? p[x.id].i : 0 }; }); }, sentences: sentences };
})();
