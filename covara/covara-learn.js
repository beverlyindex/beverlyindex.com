/* Remiel: Covara, Learn Covara.
   A list of short lessons, each step by step, replayable at any time; Covara remembers where the person stopped.
   How a step runs: the Voice Guide says one step (only while its switch is on) and the same words show on a glass
   card; the real button on the screen glows (the rest dims, a ring glows round it, and it is scrolled into view);
   the person presses it and the lesson waits until they do, or taps Next when a step has no button. The guide says
   Well done and goes on. If the button is not on the screen, the step says where to find it and offers Next.
   Practice is safe: a lesson never sends a message, an ask, a call for Help or an invite. While a lesson runs,
   every button that would send something or ring someone is held back, and a lesson stops at the step before a
   real send: it shows the Send button, says that pressing it would send for real, and ends without pressing it.
   Room motion has no lesson: it has nothing on the screen yet (covara-room.js is read by the phone app only).
   window.CovaraLearn = { open(), close(), start(id), stop(), active(), lessons(), sentences(lang) }
   Beverly Index LLC */
(function () {
  'use strict';
  var IT = function () { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var LANG = function () { return IT() ? 'it' : 'en'; };
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function L(o) { return o ? (o[LANG()] || o.en || '') : ''; }

  /* ── the words on the card and in the list (shown, not said) ── */
  var UI = {
    en: { title: 'Learn Covara', lead: 'LEARN COVARA', sub: 'Short lessons, step by step. Covara shows you the real buttons.', next: 'Next', finish: 'Finish', again: 'Hear again', stop: 'Stop the lesson',
      wait: 'Waiting for you to press it', fresh: 'New', at: 'Stopped at step {n} of {m}', done: 'Done', restart: 'Start again', lessons: 'Lessons', close: 'Close',
      step: '{n} / {m}', well: 'Well done', guide: 'Voice Guide', guideSub: 'Covara says each step and what each button does', on: 'On', off: 'Off', practice: 'PRACTICE STOP', endT: 'Lesson done' },
    it: { title: 'Impara Covara', lead: 'IMPARA COVARA', sub: 'Brevi lezioni, passo per passo. Covara ti mostra i pulsanti veri.', next: 'Avanti', finish: 'Fine', again: 'Ripeti', stop: 'Ferma la lezione',
      wait: 'Aspetto che tu lo prema', fresh: 'Nuova', at: 'Fermata al passo {n} di {m}', done: 'Fatta', restart: 'Ricomincia', lessons: 'Lezioni', close: 'Chiudi',
      step: '{n} / {m}', well: 'Bravo', guide: 'Guida vocale', guideSub: 'Covara dice ogni passo e a cosa serve ogni pulsante', on: 'Sì', off: 'No', practice: 'STOP DI PROVA', endT: 'Lezione finita' }
  };
  function u(k, p) { var s = (UI[LANG()] || UI.en)[k] || UI.en[k] || k; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
  /* ── the fixed sentences the guide says between steps ── */
  var SAY = {
    well: { en: 'Well done.', it: 'Bravo.' },
    end: { en: 'That is the end of this lesson.', it: 'La lezione è finita.' },
    guard: { en: 'In a lesson, nothing is sent and nobody is called.', it: 'Durante una lezione non si invia niente e non si chiama nessuno.' },
    notHere: { en: 'It is not on the screen right now. Tap Next to go on.', it: 'Adesso non è sullo schermo. Tocca Avanti per continuare.' }
  };

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
    /* a label that lets taps through (the line under the centre, the WHEREIS anchor) cannot be covered-tested */
    try { if (getComputedStyle(el).pointerEvents === 'none') return true; } catch (e) {}
    var r = el.getBoundingClientRect();
    var x = Math.min(innerWidth - 2, Math.max(2, r.left + r.width / 2)), y = Math.min(innerHeight - 2, Math.max(2, r.top + Math.min(r.height / 2, 24)));
    var hit = document.elementFromPoint(x, y);
    return !hit || el === hit || el.contains(hit) || (card && card.contains(hit)) || (learn && learn.contains(hit));
  }
  function inView(r) { return r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth; }
  function sphereRect() { var c = document.getElementById('sphere'); return c ? c.getBoundingClientRect() : null; }
  var CENTRE = function () {
    var r = sphereRect(); if (!r || typeof netCenterR !== 'function') return null;
    var R = netCenterR(r.width, r.height) * 1.08, cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    return { rect: { left: cx - R, top: cy - R, width: 2 * R, height: 2 * R }, round: true };
  };
  var FACE = function () {
    try {
      if (typeof NODES === 'undefined' || typeof projectNode !== 'function') return null;
      for (var i = 0; i < NODES.length; i++) {
        var n = NODES[i], c = n.contact; if (!c || !c.care || !c.care.userId || c.care.state !== 'active') continue;
        var p = projectNode(n), R = Math.max(22, (n.r || 30) * (p.scale || 1)) * 1.25;
        if (!isFinite(p.sx) || !isFinite(p.sy)) continue;
        return { rect: { left: p.sx - R, top: p.sy - R, width: 2 * R, height: 2 * R }, round: true };
      }
    } catch (e) {}
    return null;
  };
  var MORNING = function () {
    try { if (window.CovaraNow && CovaraNow.current() === 'morning') { var b = document.querySelector('#cvNow .row button.pri'); if (shown(b)) return b; } } catch (e) {}
    var m = document.querySelector('#cvMorning button'); return shown(m) ? m : null;
  };
  /* a step's target: a list of selectors (the first one on the screen wins), or a function */
  function resolve(tg) {
    if (!tg) return null;
    if (typeof tg === 'function') {
      var v = tg(); if (!v) return null;
      if (v.nodeType === 1) return { el: v, round: false };
      return v;
    }
    var list = Array.isArray(tg) ? tg : [tg];
    for (var i = 0; i < list.length; i++) {
      var els = document.querySelectorAll(list[i]);
      for (var j = 0; j < els.length; j++) if (shown(els[j])) return { el: els[j], round: /cvn-orb|cvCButton/.test(list[i]) };
    }
    return null;
  }

  /* ── what a step waits for ── */
  var W = {
    care: function () { var s = document.getElementById('cvpSheet'); return !!(s && s.classList.contains('open') && s.querySelector('.cvp-grid')); },
    person: function () { var s = document.getElementById('cvpSheet'); return !!(s && s.classList.contains('open') && s.querySelector('.cvp-btns')); },
    words: function () { try { return !!(window.CovaraWords && CovaraWords.isOpen()); } catch (e) { return false; } },
    me: function () { var m = document.getElementById('cvsMe'); return !!(m && !m.hidden); },
    settings: function () { var p = document.getElementById('settingsPanel'); return !!(p && p.classList.contains('open')); },
    circle: function () { return shown(document.querySelector('#cvFamilySection [data-a=link]')); },
    where: function () { try { return WhereIs.mode() === 'whereis'; } catch (e) { return false; } },
    code: function () { var c = document.getElementById('cvCode'); return !!(c && c.classList.contains('open')); }
  };

  /* ── lessons: every line fixed (no names), so it can be made in Covara's voice ahead of time ── */
  var MISS_FACE = { en: 'The faces of your team are around your sphere. When nobody has joined yet, invite your team with your code.', it: 'I volti del tuo team sono intorno alla tua sfera. Se non è ancora entrato nessuno, invita il tuo team con il tuo codice.' };
  var MISS_ME = { en: 'Me is the last button at the bottom right.', it: 'Io è l’ultimo pulsante in basso a destra.' };
  var OPEN_MINE = { en: 'Tap your sphere to open your care.', it: 'Tocca la tua sfera per aprire le tue cure.' };
  var OPEN_THEIRS = { en: 'Tap the big sphere in the middle to open their care.', it: 'Tocca la grande sfera al centro per aprire le sue cure.' };
  function openCare() {
    return [
      { only: 'home', t: CENTRE, wait: W.care, say: OPEN_MINE },
      { only: 'away', t: CENTRE, wait: W.care, say: OPEN_THEIRS }
    ];
  }
  function toSettings() {
    return [
      { t: '#cvnDock .cvs-b[data-s=me]', wait: W.me, say: { en: 'Tap Me.', it: 'Tocca Io.' }, miss: MISS_ME },
      { t: '#cvsMe [data-m=settings]', wait: W.settings, say: { en: 'Tap Settings.', it: 'Tocca Impostazioni.' } },
      { t: '.settings-home-row[data-cat=circle]', wait: W.circle, say: { en: 'Tap People and Circle.', it: 'Tocca Persone e cerchia.' } }
    ];
  }
  var LESSONS = [
    { id: 'circle', title: { en: 'Your circle', it: 'La tua cerchia' }, steps: [
      { only: 'home', t: CENTRE, say: { en: 'This big sphere in the middle is you. In Covara, you are HOME.', it: 'Questa grande sfera al centro sei tu. In Covara, tu sei HOME.' } },
      { only: 'home', t: FACE, optional: true, say: { en: 'The smaller spheres are your team. Each person has Covara on their own phone.', it: 'Le sfere più piccole sono il tuo team. Ogni persona ha Covara sul proprio telefono.' } },
      { only: 'away', t: CENTRE, say: { en: 'The big sphere in the middle is the person you look after. In Covara, they are HOME.', it: 'La grande sfera al centro è la persona che segui. In Covara, è HOME.' } },
      { only: 'away', say: { en: 'You are on their team. Each person has Covara on their own phone, and HOME chooses what each one can see.', it: 'Tu fai parte del suo team. Ognuno ha Covara sul proprio telefono, e HOME sceglie cosa può vedere ciascuno.' } }
    ].concat(openCare(), [
      { only: 'home', t: '#cvpSheet .cvp-grid', say: { en: 'These tiles hold your care: your day, medicines, visits, health, safety and papers. Each person on your team sees only what you chose to share.', it: 'Queste caselle contengono le tue cure: la giornata, le medicine, le visite, la salute, la sicurezza e i documenti. Ognuno nel tuo team vede solo ciò che hai scelto di condividere.' } },
      { only: 'away', t: '#cvpSheet .cvp-grid', say: { en: 'These tiles hold their care: the day, medicines, visits, health, safety and papers.', it: 'Queste caselle contengono le sue cure: la giornata, le medicine, le visite, la salute, la sicurezza e i documenti.' } }
    ]) },

    { id: 'invite', title: { en: 'Inviting your team with the team code', it: 'Invitare il tuo team con il codice' }, steps: [
      { only: 'home', say: { en: 'Your team joins you with your team code. One code works for everyone you give it to, for 24 hours.', it: 'Il tuo team entra con il tuo codice. Un solo codice vale per tutti quelli a cui lo dai, per 24 ore.' } },
      { only: 'home', act: { en: 'Show my code', it: 'Mostra il mio codice' }, run: function () { try { CovaraCare.openCode(); } catch (e) {} }, wait: W.code, say: { en: 'Tap Show my code to see it.', it: 'Tocca Mostra il mio codice per vederlo.' } },
      { only: 'home', t: '#cvCode .cv-code', say: { en: 'These six numbers are your code. The person types them in Covara on their own phone, and joins your circle at once.', it: 'Questi sei numeri sono il tuo codice. La persona li scrive in Covara sul proprio telefono, ed entra subito nella tua cerchia.' } },
      { only: 'home', t: '#cvCode .cv-joined', optional: true, say: { en: 'Here you see who has joined with your code.', it: 'Qui vedi chi è entrato con il tuo codice.' } },
      { only: 'home', t: '#cvCode [data-a=share]', stop: true, say: { en: 'Send the link sends your code in a message. Pressing it would send it for real, so the lesson stops here.', it: 'Invia il link manda il tuo codice in un messaggio. Premerlo lo invierebbe davvero, quindi la lezione si ferma qui.' } },
      { only: 'away', say: { en: 'To join a circle, ask the person for their team code. It is six numbers.', it: 'Per entrare in una cerchia, chiedi alla persona il suo codice. Sono sei numeri.' } }
    ].concat(toSettings().map(function (s) { s.only = 'away'; return s; }), [
      { only: 'away', t: '#cvFamilySection [data-a=link]', stop: true, say: { en: 'Type a code is where you type the six numbers. That would join you for real, so the lesson stops here.', it: 'Scrivi un codice è dove si scrivono i sei numeri. Così entreresti davvero, quindi la lezione si ferma qui.' } }
    ]) },

    { id: 'talk', title: { en: 'How communication works', it: 'Come si comunica' }, steps: [
      { only: 'home', t: '#cvnDock .cvs-b[data-s=call]', optional: true, say: { en: 'Call team calls the first person on your team.', it: 'Chiama il team chiama la prima persona del tuo team.' } },
      { only: 'home', t: FACE, wait: W.person, start: true, miss: MISS_FACE, say: { en: 'Tap a face on your team.', it: 'Tocca un volto del tuo team.' } },
      { only: 'away', t: '#cvnDock .cvs-b[data-s=messages]', say: { en: 'Messages opens your messages with your team.', it: 'Messaggi apre i tuoi messaggi con il tuo team.' } },
      { only: 'away', t: CENTRE, wait: W.care, start: true, say: OPEN_THEIRS },
      { t: ['#cvpSheet [data-a=video]', '#cvpSheet [data-c=video]'], say: { en: 'Video call starts a video call with this person.', it: 'Videochiamata avvia una videochiamata con questa persona.' } },
      { t: ['#cvpSheet [data-a=sms]', '#cvpSheet [data-c=sms]'], say: { en: 'Send a message opens your messages with this person.', it: 'Manda un messaggio apre i tuoi messaggi con questa persona.' } },
      { only: 'home', say: { en: 'To ask your team for something, open your day and tap Ask My Team.', it: 'Per chiedere qualcosa al tuo team, apri la tua giornata e tocca Chiedi al mio team.' } },
      { only: 'away', say: { en: 'When they ask the team for something, you see one card at the top: Yes, plan it, or Not this time.', it: 'Quando chiede qualcosa al team, vedi una scheda in alto: Sì, mettilo in programma, oppure Non questa volta.' } },
      { t: ['#cvpSheet [data-a=phone]', '#cvpSheet [data-c=phone]'], stop: true, say: { en: 'Call rings this person’s phone. Pressing it would call for real, so the lesson stops here.', it: 'Chiama fa squillare il telefono di questa persona. Premerlo chiamerebbe davvero, quindi la lezione si ferma qui.' } }
    ] },

    { id: 'help', title: { en: 'Help', it: 'Aiuto' }, steps: [
      { say: { en: 'Help tells everyone in your circle at once and shows them where you are.', it: 'Aiuto avvisa subito tutta la tua cerchia e mostra dove sei.' } },
      { say: { en: 'On the Help card you press and hold the big button. Then your phone sends where you are every 15 seconds, for an hour.', it: 'Nella scheda Aiuto tieni premuto il grande pulsante. Poi il telefono invia dove sei ogni 15 secondi, per un’ora.' } },
      { t: '#helpFab', stop: true, miss: { en: 'Help is the red button near the top of the screen, when it is shown. It is not shown on this screen now.', it: 'Aiuto è il pulsante rosso in alto sullo schermo, quando è visibile. Adesso non è su questo schermo.' },
        say: { en: 'This is Help. Use it only when you need help. A lesson never presses it, so the lesson stops here.', it: 'Questo è Aiuto. Usalo solo quando hai bisogno di aiuto. Una lezione non lo preme mai, quindi la lezione si ferma qui.' } }
    ] },

    { id: 'whereis', title: { en: 'WHEREIS: who can see where you are', it: 'WHEREIS: chi può vedere dove sei' }, steps: [
      { only: 'home', t: FACE, wait: W.person, miss: MISS_FACE, say: { en: 'Tap a face on your team.', it: 'Tocca un volto del tuo team.' } },
      { only: 'home', t: '#cvpSheet [data-a=where]', wait: 'click', say: { en: 'Tap Where is.', it: 'Tocca Dov’è.' } },
      { only: 'home', say: { en: 'The radar shows where this person is, when they share it with you. Each person on your team chooses who can see where they are.', it: 'Il radar mostra dove si trova questa persona, quando lo condivide con te. Ognuno nel tuo team sceglie chi può vedere dove si trova.' } },
      { only: 'home', say: { en: 'You choose what each person on your team can see when you let them in.', it: 'Tu scegli cosa può vedere ognuno nel tuo team quando lo fai entrare.' } },
      { only: 'away', t: '#whereisAnchor', wait: W.where, miss: { en: 'WHEREIS is under the circle at the top, beside Communication.', it: 'WHEREIS è sotto il cerchio in alto, accanto a Comunicazione.' }, say: { en: 'Tap WHEREIS.', it: 'Tocca WHEREIS.' } },
      { only: 'away', say: { en: 'The big radar shows where the person you look after is, and who from the circle is with them. The small one shows the room.', it: 'Il radar grande mostra dove si trova la persona che segui, e chi della cerchia è con lei. Quello piccolo mostra la stanza.' } }
    ].concat(toSettings().map(function (s) { s.only = 'away'; return s; }), [
      { only: 'away', t: '#cvFamilySection .cv-myloc', say: { en: 'Here you choose who can see where you are: only the person you look after, the whole circle, or nobody.', it: 'Qui scegli chi può vedere dove sei: solo la persona che segui, tutta la cerchia, o nessuno.' } }
    ]) },

    { id: 'med', title: { en: 'Medicines', it: 'Medicine' }, steps: openCare().concat([
      { t: '#cvpSheet .cvp-tile[data-k=med]', wait: 'click', say: { en: 'Tap Medicines. The tile shows the next dose, and turns red when one is late.', it: 'Tocca Medicine. La casella mostra la prossima dose, e diventa rossa quando una è in ritardo.' } },
      { t: '#cvTabs [data-add=med]', say: { en: 'Add a medicine opens a form. Take a photo of the bottle, and Covara reads the label: the name, the dose and how often. Check each line before you save.', it: 'Aggiungi una medicina apre un modulo. Fotografa la confezione, e Covara legge l’etichetta: il nome, la dose e ogni quanto. Controlla ogni riga prima di salvare.' } },
      { t: '#cvTabs .cvx-item[data-id=inbox]', optional: true, say: { en: 'At the pharmacy, take a photo of each new bottle. Covara reads the label and marks the refill as filled, with the new count.', it: 'In farmacia, fotografa ogni nuova confezione. Covara legge l’etichetta e segna la ricarica come ritirata, con il nuovo numero.' } }
    ]) },

    { id: 'day', title: { en: 'Your day', it: 'La tua giornata' }, steps: openCare().concat([
      { t: '#cvpSheet .cvp-tile[data-k=day]', wait: 'click', say: { en: 'Tap Day.', it: 'Tocca Giornata.' } },
      { only: 'home', t: '#cvplSheet h3', say: { en: 'Here is your day: the meals, work, routines and tasks your team planned. When one is due, Covara reminds you, and you answer with one tap.', it: 'Ecco la tua giornata: i pasti, il lavoro, le abitudini e i compiti che il tuo team ha previsto. Quando è l’ora, Covara te lo ricorda, e rispondi con un tocco.' } },
      { only: 'home', t: '#cvplSheet [data-a=ask]', wait: 'click', say: { en: 'Tap Ask My Team to ask for something.', it: 'Tocca Chiedi al mio team per chiedere qualcosa.' } },
      { only: 'home', t: '#cvplAsk', say: { en: 'Say it or type it. For example: pancakes for breakfast tomorrow at 9.', it: 'Dillo o scrivilo. Per esempio: frittelle a colazione domani alle 9.' } },
      { only: 'home', t: '#cvplSheet [data-who]', say: { en: 'Tap a name to ask one person, or Whole team to ask everyone.', it: 'Tocca un nome per chiedere a una persona, o Tutto il team per chiederlo a tutti.' } },
      { only: 'home', t: '#cvplSheet [data-a=send]', stop: true, say: { en: 'Send would send your ask to your team for real, so the lesson stops here. When they answer, you see it on the card at the top.', it: 'Invia manderebbe davvero la tua richiesta al team, quindi la lezione si ferma qui. Quando rispondono, lo vedi nella scheda in alto.' } },
      { only: 'away', t: '#cvplSheet .pl-adds', say: { en: 'Add a meal, work hours, or a routine or task. Covara reminds them when each one comes.', it: 'Aggiungi un pasto, le ore di lavoro, o un’abitudine o un compito. Covara glielo ricorda quando arriva l’ora.' } },
      { only: 'away', say: { en: 'When they ask for something, you see one card at the top: Yes, plan it, or Not this time. Yes puts it on their day.', it: 'Quando chiede qualcosa, vedi una scheda in alto: Sì, mettilo in programma, oppure Non questa volta. Sì lo mette nella sua giornata.' } }
    ]) },

    { id: 'words', title: { en: 'Words: live captions', it: 'Parole: i sottotitoli dal vivo' }, steps: [
      { t: '#cvnDock .cvs-b[data-s=words]', wait: W.words, say: { en: 'Tap Words. It shows the words spoken in the room, in very large letters.', it: 'Tocca Parole. Mostra le parole dette nella stanza, a lettere molto grandi.' } },
      { t: '#cvWords [data-a=big]', say: { en: 'Bigger and Smaller change the size of the letters.', it: 'Più grandi e Più piccole cambiano la grandezza delle lettere.' } },
      { t: '#cvWords [data-a=again]', say: { en: 'Say that again holds the last sentence still and big.', it: 'Ripeti tiene ferma e grande l’ultima frase.' } },
      { t: '#cvWords [data-a=done]', wait: function () { return !W.words(); }, say: { en: 'Nothing is saved: the words are gone when Words closes. Tap Done to close it.', it: 'Non si salva niente: le parole spariscono quando Parole si chiude. Tocca Fine per chiuderla.' } }
    ] },

    { id: 'night', title: { en: 'Night watch and morning check-in', it: 'Guardia notturna e buongiorno' }, steps: openCare().concat([
      { t: '#cvpSheet .cvp-tile[data-k=safety]', wait: 'click', say: { en: 'Tap Safety.', it: 'Tocca Sicurezza.' } },
      { only: 'home', t: '#cvTabs .cvx-item[data-id=morning]', say: { en: 'Morning check-in: each morning you tap I’m up. If there is no word by the set time, your team is told.', it: 'Buongiorno: ogni mattina tocchi Mi sono alzato. Se entro l’ora scelta non arriva nulla, il tuo team viene avvisato.' } },
      { only: 'away', t: '#cvTabs .cvx-item[data-id=morning]', say: { en: 'Morning check-in: each morning they tap I’m up. If there is no word by the set time, the team is told and their phone rings.', it: 'Buongiorno: ogni mattina tocca Mi sono alzato. Se entro l’ora scelta non arriva nulla, il team viene avvisato e il suo telefono squilla.' } },
      { only: 'home', t: '#cvTabs .cvx-item[data-id=nightw]', say: { en: 'Night watch: during your night, your team is told when something is not as usual, like movement at an hour you are not usually up.', it: 'Guardia notturna: di notte il tuo team viene avvisato quando qualcosa non va come al solito, come un movimento a un’ora in cui di solito non sei sveglio.' } },
      { only: 'away', t: '#cvTabs .cvx-item[data-id=nightw]', say: { en: 'Night watch: during their night, the team is told when something is not as usual, like movement at an hour they are not usually up.', it: 'Guardia notturna: di notte il team viene avvisato quando qualcosa non va come al solito, come un movimento a un’ora in cui di solito non è sveglio.' } },
      { only: 'home', t: MORNING, stop: true, optional: true, say: { en: 'Tap I’m up each morning. Pressing it now would tell your team for real, so the lesson stops here.', it: 'Tocca Mi sono alzato ogni mattina. Premerlo adesso avviserebbe davvero il tuo team, quindi la lezione si ferma qui.' } }
    ]) },

    { id: 'simple', title: { en: 'Simple mode', it: 'Modalità semplice' }, steps: [
      { only: 'home', t: '#cvnDock', say: function () {
          var on = false; try { on = !!(window.CovaraSimple && CovaraSimple.on()); } catch (e) {}
          return on ? SIMPLE_ON : SIMPLE_OFF; } },
      { only: 'home', t: '#cvsLine', optional: true, say: { en: 'Under your picture is the next thing to do today.', it: 'Sotto la tua foto c’è la prossima cosa da fare oggi.' } },
      { only: 'away', t: '#cvnDock .cvs-b[data-s=me]', wait: W.me, miss: MISS_ME, say: { en: 'Tap Me.', it: 'Tocca Io.' } },
      { only: 'away', t: '#cvsMe [data-m=simple]', miss: { en: 'This switch shows here when you may change the screen of the person you look after.', it: 'Questo interruttore appare qui quando puoi cambiare lo schermo della persona che segui.' },
        say: { en: 'Simple screen: the person you look after sees only the next thing to do, the team, TALK and Words. Tap it to turn it on or off.', it: 'Schermata semplice: la persona che segui vede solo la prossima cosa da fare, il team, PARLA e Parole. Toccalo per accenderla o spegnerla.' } }
    ] },

    { id: 'cbutton', title: { en: 'The Covara Button', it: 'Il pulsante Covara' }, steps: [
      { t: ['#cvCButton', '.cvn-orb'], say: { en: 'This is the C, the Covara Button. Tap it when you want to keep a note.', it: 'Questa è la C, il pulsante Covara. Toccalo quando vuoi tenere una nota.' } },
      { say: { en: 'Speak your note. Covara reads back what it heard.', it: 'Detta la tua nota. Covara ti rilegge ciò che ha sentito.' } },
      { say: { en: 'Tap Yes to file it in your private journal.', it: 'Tocca Sì per metterla nel tuo diario privato.' } },
      { say: { en: 'When a note needs something done, Covara may suggest a time on your day.', it: 'Quando una nota chiede di fare qualcosa, Covara può proporti un’ora nella tua giornata.' } },
      { say: { en: 'Your journal sorts your notes by what to do, then by topic, then by person.', it: 'Il tuo diario ordina le note per cosa fare, poi per argomento, poi per persona.' } },
      { t: ['#cvCButton', '.cvn-orb'], wait: 'click', quietEnd: true, say: { en: 'Try it now: tap the C and speak a note.', it: 'Prova adesso: tocca la C e detta una nota.' } }
    ] }
  ];
  var SIMPLE_ON = { en: 'Your screen is simple: your team, Words, TALK and Call team. Your team chose this for you.', it: 'Il tuo schermo è semplice: il tuo team, Parole, PARLA e Chiama il team. L’ha scelto il tuo team per te.' };
  var SIMPLE_OFF = { en: 'The simple screen is off on this phone. Someone on your team can turn it on from their own phone.', it: 'La schermata semplice è spenta su questo telefono. Qualcuno del tuo team può accenderla dal proprio telefono.' };

  /* While a lesson runs, these are held back: each would send, ring or change who is in the circle */
  var GUARD = ['#cvplSheet [data-a=send]', '#cvplSheet form [type=submit]', '#cvHelpCard [data-hold]', '#helpFab', '#cvCode [data-a=share]', '#cvCode [data-a=end]', '#cvCode [data-a=new]',
    '#cvpSheet [data-a=phone]', '#cvpSheet [data-a=video]', '#cvpSheet [data-a=sms]', '#cvpSheet [data-a=drive]', '#cvpSheet [data-c]', '#cvnDock .cvs-b[data-s=call]',
    '#cvNow .row button', '#cvMorning button', '#cvFamilySection [data-a=link]', '#cvsMe [data-m=out]'].join(',');

  function stepsFor(ls) { var r = role() === 'away' ? 'away' : 'home'; return ls.steps.filter(function (s) { return !s.only || s.only === r; }); }
  function lessons() { return LESSONS.filter(function (ls) { return stepsFor(ls).length > 0; }); }
  function sayOf(s) { return L(typeof s.say === 'function' ? s.say() : s.say); }

  /* ── progress, kept on this phone ── */
  function prog() { try { return JSON.parse(get('cvg:prog') || '{}') || {}; } catch (e) { return {}; } }
  function save(id, i, done) { var p = prog(); p[id] = { i: i, done: !!done }; put('cvg:prog', JSON.stringify(p)); }

  /* ── the look: NOUS glass, gold and cyan over deep blue ── */
  var GLASS = 'background:linear-gradient(160deg,rgba(70,130,235,.26) 0%,rgba(22,48,110,.62) 55%,rgba(10,22,62,.88) 100%);-webkit-backdrop-filter:blur(18px) saturate(150%);backdrop-filter:blur(18px) saturate(150%);' +
    'border:1px solid rgba(150,200,255,.5);box-shadow:0 0 0 1px rgba(56,189,248,.12),0 0 30px rgba(70,150,255,.38),inset 0 1px 0 rgba(255,255,255,.16),inset 0 0 26px rgba(110,170,255,.10)';
  var css =
    '#cvgShade{position:fixed;inset:0;z-index:2147480000;background:rgba(3,9,28,.55);pointer-events:none;opacity:0;transition:opacity .25s}#cvgShade.on{opacity:1}' +
    '#cvgRing{position:fixed;z-index:2147480500;pointer-events:none;box-sizing:border-box;border:2.5px solid #ffd24d;border-radius:22px;opacity:0;' +
      'box-shadow:0 0 0 5px rgba(56,189,248,.32),0 0 26px 8px rgba(255,210,77,.55),0 0 0 200vmax rgba(3,9,28,.62);transition:left .22s,top .22s,width .22s,height .22s,opacity .2s,border-radius .22s}' +
    '#cvgRing.on{opacity:1}#cvgRing.round{border-radius:50%}' +
    '#cvgRing:after{content:"";position:absolute;inset:-9px;border-radius:inherit;border:2px solid rgba(56,189,248,.75);animation:cvgPulse 1.5s ease-out infinite}' +
    '#cvgRing.stop{border-color:#ff7a7a;box-shadow:0 0 0 5px rgba(255,90,90,.28),0 0 26px 8px rgba(255,90,90,.45),0 0 0 200vmax rgba(3,9,28,.62)}#cvgRing.stop:after{border-color:rgba(255,160,160,.7)}' +
    /* while a lesson shows something, the Now card at the top steps aside (it can cover the care panel) */
    'body.cvg-nonow #cvNow,body.cvg-nonow #cvMorning{visibility:hidden !important}' +
    '@keyframes cvgPulse{0%{transform:scale(.96);opacity:.95}100%{transform:scale(1.12);opacity:0}}' +
    '#cvgCard{position:fixed;left:50%;transform:translateX(-50%);z-index:2147481000;width:min(520px,calc(100vw - 24px));box-sizing:border-box;padding:12px 14px 14px;border-radius:24px;color:#eef5ff;' +
      'font-family:"Hanken Grotesk",system-ui,sans-serif;text-shadow:0 1px 2px rgba(2,8,24,.55);' + GLASS + ';border-color:rgba(255,210,77,.55);animation:cvgIn .25s ease-out}' +
    '#cvgCard.top{top:calc(10px + env(safe-area-inset-top,0px))}#cvgCard.bottom{bottom:calc(12px + env(safe-area-inset-bottom,0px))}' +
    '@keyframes cvgIn{from{opacity:.3}to{opacity:1}}' +
    '#cvgCard .hd{display:flex;align-items:center;gap:8px;min-height:32px}' +
    '#cvgCard .hd b{flex:1;min-width:0;font:700 11px "JetBrains Mono",monospace;letter-spacing:.2em;color:#ffd24d;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#cvgCard .hd span{font:700 12px "JetBrains Mono",monospace;color:#9fd8ff;letter-spacing:.08em}' +
    '#cvgCard .x{flex:0 0 auto;width:40px;height:40px;border-radius:50%;border:1px solid rgba(150,200,255,.45);background:rgba(20,44,100,.4);color:#dce8ff;font:600 22px/1 system-ui,sans-serif;cursor:pointer}' +
    '#cvgCard .tt{font-weight:800;font-size:15px;color:#bfe3ff;margin:2px 0 4px}' +
    '#cvgCard .ok{display:inline-flex;align-items:center;gap:6px;margin:2px 0 4px;padding:4px 10px;border-radius:999px;font:700 12px "JetBrains Mono",monospace;letter-spacing:.08em;color:#1b1405;background:linear-gradient(180deg,#ffe08a,#C5A55A);box-shadow:0 0 14px rgba(255,210,77,.5)}' +
    '#cvgCard .ok[hidden],#cvgCard .wt[hidden],#cvgCard .ms[hidden],#cvgCard .pr[hidden]{display:none}' +
    '#cvgCard .pr{display:inline-block;margin:2px 0 4px;padding:3px 9px;border-radius:999px;font:700 11px "JetBrains Mono",monospace;letter-spacing:.14em;color:#ffd0d0;border:1px solid rgba(255,120,120,.6)}' +
    '#cvgCard p{margin:4px 0 0;font-size:19px;line-height:1.38;font-weight:600;overflow-wrap:anywhere}' +
    '#cvgCard p.ms{font-size:15px;font-weight:600;color:#ffe9a8}' +
    '#cvgCard .wt{display:flex;align-items:center;gap:8px;margin:10px 0 0;font:600 13px/1.3 "JetBrains Mono",monospace;color:#9fd8ff}' +
    '#cvgCard .wt i{width:10px;height:10px;border-radius:50%;background:#38bdf8;box-shadow:0 0 10px #38bdf8;animation:cvgDot 1.2s ease-in-out infinite}@keyframes cvgDot{50%{opacity:.25}}' +
    '#cvgCard .ac{display:flex;gap:10px;margin-top:12px}#cvgCard .ac:empty{display:none}' +
    '#cvgCard .ac button{flex:1;min-height:50px;border-radius:16px;border:1px solid rgba(150,200,255,.5);background:linear-gradient(155deg,rgba(80,140,240,.28),rgba(18,40,96,.5));color:#f2f7ff;font:700 16px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer;box-shadow:0 0 14px rgba(70,150,255,.25)}' +
    '#cvgCard .ac button.pri{border:0;color:#2a1600;text-shadow:none;background:linear-gradient(180deg,#ffe58a,#ffc531 60%,#d99a00);box-shadow:0 0 20px rgba(255,200,60,.5)}' +
    '#cvgCard button:focus-visible,#cvgLearn button:focus-visible{outline:2px solid #38bdf8;outline-offset:2px}' +
    '#cvgLearn{position:fixed;inset:0;z-index:2147479000;display:flex;align-items:flex-end;justify-content:center;background:rgba(4,12,34,.46);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}#cvgLearn[hidden]{display:none}' +
    '#cvgLearn .sh{width:min(520px,100vw);box-sizing:border-box;max-height:90vh;max-height:90dvh;overflow-y:auto;padding:10px 16px calc(18px + env(safe-area-inset-bottom,0px));border-radius:26px 26px 0 0;color:#e6f1ff;' + GLASS + ';border-bottom:0;animation:cvgUp .24s ease-out;font-family:"Hanken Grotesk",system-ui,sans-serif}' +
    '@keyframes cvgUp{from{transform:translateY(40px);opacity:.4}to{transform:none;opacity:1}}' +
    '#cvgLearn .gr{width:44px;height:5px;border-radius:3px;background:rgba(200,225,255,.4);margin:2px auto 10px}' +
    '#cvgLearn .hd{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 2px 4px}' +
    '#cvgLearn .hd b{font:700 12px "JetBrains Mono",monospace;letter-spacing:.24em;color:#ffd24d;text-transform:uppercase}' +
    '#cvgLearn .x{min-width:48px;min-height:48px;border-radius:50%;border:1px solid rgba(150,200,255,.35);background:rgba(20,44,100,.3);color:#cfe6ff;font-size:22px;cursor:pointer}' +
    '#cvgLearn .sb{margin:0 2px 12px;font-size:14px;line-height:1.4;color:#b9cdea}' +
    '#cvgLearn .rw{width:100%;display:flex;align-items:center;gap:12px;min-height:64px;margin:0 0 9px;padding:10px 12px;box-sizing:border-box;border-radius:18px;cursor:pointer;text-align:left;color:#eef5ff;font:inherit;' +
      'background:linear-gradient(155deg,rgba(80,140,240,.20),rgba(18,40,96,.40));border:1px solid rgba(150,200,255,.42);box-shadow:0 0 16px rgba(70,150,255,.22),inset 0 1px 0 rgba(255,255,255,.14)}' +
    '#cvgLearn .rw.gold{border-color:rgba(255,210,77,.6);box-shadow:0 0 18px rgba(255,210,77,.24),inset 0 1px 0 rgba(255,255,255,.14)}' +
    '#cvgLearn .rw .n{flex:0 0 36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:800 15px "JetBrains Mono",monospace;color:#04121f;background:radial-gradient(circle at 35% 30%,#fff 0,#9fe7ff 22%,#38bdf8 60%,#0b3a66 100%);box-shadow:0 0 12px rgba(56,189,248,.6)}' +
    '#cvgLearn .rw .n.dn{background:radial-gradient(circle at 35% 30%,#fff7d6 0,#ffe08a 30%,#C5A55A 75%);box-shadow:0 0 12px rgba(255,210,77,.6)}' +
    '#cvgLearn .rw span{flex:1;min-width:0}#cvgLearn .rw b{display:block;font:700 17px/1.25 "Hanken Grotesk",system-ui,sans-serif}' +
    '#cvgLearn .rw small{display:block;margin-top:2px;font:600 12px/1.3 "JetBrains Mono",monospace;color:#9fd8ff}#cvgLearn .rw small.dn{color:#ffd98a}#cvgLearn .rw small.at{color:#ffe9a8}' +
    '#cvgLearn .rw i{flex:0 0 auto;font:700 12px "JetBrains Mono",monospace;letter-spacing:.14em;padding:7px 12px;border-radius:999px;border:1px solid rgba(150,200,255,.4);color:#cfe6ff;font-style:normal;text-transform:uppercase}' +
    '#cvgLearn .rw i.on{color:#1b1405;background:linear-gradient(180deg,#ffe08a,#C5A55A);border-color:#ffd24d;box-shadow:0 0 14px rgba(255,210,77,.5)}' +
    '#cvgLearn .rs{flex:0 0 auto;min-height:40px;padding:0 12px;border-radius:14px;border:1px solid rgba(150,200,255,.45);background:rgba(20,44,100,.35);color:#cfe6ff;font:700 13px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer}' +
    '@media (prefers-reduced-motion: reduce){#cvgRing,#cvgRing:after,#cvgCard,#cvgLearn .sh{transition:none;animation:none}}';
  var st = document.createElement('style'); st.id = 'cvlStyle'; st.textContent = css; document.head.appendChild(st);

  function guideOn() { try { return !!(window.CovaraGuide && CovaraGuide.on()); } catch (e) { return false; } }
  function speak(text) { try { if (window.CovaraGuide && CovaraGuide.speak) return CovaraGuide.speak(text); } catch (e) {} return false; }

  /* ── the Learn Covara list ── */
  var learn = null;
  function open() {
    if (!learn) {
      learn = document.createElement('div'); learn.id = 'cvgLearn'; learn.hidden = true; learn.setAttribute('role', 'dialog'); learn.setAttribute('aria-modal', 'true');
      ['pointerdown', 'mousedown', 'touchstart', 'click'].forEach(function (ev) { learn.addEventListener(ev, function (e) { e.stopPropagation(); }); });
      learn.addEventListener('click', function (e) { if (e.target === learn) close(); });
      document.body.appendChild(learn);
    }
    if (R) stop(false);
    drawLearn(); learn.hidden = false;
  }
  function close() { if (learn) learn.hidden = true; }
  function drawLearn() {
    if (!learn) return;
    var p = prog(), g = guideOn();
    var h = '<div class="sh"><div class="gr"></div><div class="hd"><b>' + esc(u('lead')) + '</b><button type="button" class="x" data-l="x" aria-label="' + esc(u('close')) + '">×</button></div>' +
      '<div class="sb">' + esc(u('sub')) + '</div>' +
      '<button type="button" class="rw gold" data-l="voice" aria-pressed="' + g + '"><span><b>' + esc(u('guide')) + '</b><small>' + esc(u('guideSub')) + '</small></span><i class="' + (g ? 'on' : '') + '">' + esc(g ? u('on') : u('off')) + '</i></button>';
    lessons().forEach(function (ls, k) {
      var n = stepsFor(ls).length, q = p[ls.id], status, cls = '';
      if (q && q.done) { status = u('done'); cls = 'dn'; }
      else if (q && q.i > 0) { status = u('at', { n: Math.min(q.i + 1, n), m: n }); cls = 'at'; }
      else status = u('fresh');
      h += '<div style="display:flex;gap:8px;align-items:stretch"><button type="button" class="rw" data-l="go" data-id="' + ls.id + '"><span class="n' + (q && q.done ? ' dn' : '') + '">' + (q && q.done ? '✓' : (k + 1)) + '</span>' +
        '<span><b>' + esc(L(ls.title)) + '</b><small class="' + cls + '">' + esc(status) + '</small></span></button>' +
        (q && (q.done || q.i > 0) ? '<button type="button" class="rs" data-l="re" data-id="' + ls.id + '" style="margin-bottom:9px">' + esc(u('restart')) + '</button>' : '') + '</div>';
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
  var R = null, card = null, ring = null, shade = null, loopT = 0;
  function closeAll() {
    try { if (window.CovaraPerson && CovaraPerson.isOpen()) CovaraPerson.close(); } catch (e) {}
    try { if (window.CovaraPlan && CovaraPlan.isOpen()) CovaraPlan.close(); } catch (e) {}
    try { if (window.CovaraSimple) CovaraSimple.closeMe(); } catch (e) {}
    try { var p = document.getElementById('settingsPanel'); if (p && p.classList.contains('open') && typeof SettingsPanel !== 'undefined') SettingsPanel.close(); } catch (e) {}
    try { if (window.CovaraWords && CovaraWords.isOpen()) CovaraWords.close(); } catch (e) {}
    try { var c = document.getElementById('cvCode'); if (c) c.classList.remove('open'); } catch (e) {}
    try { var tb = document.getElementById('cvTabs'); if (tb && tb.classList.contains('show') && window.CovaraView) CovaraView.open(''); } catch (e) {}
  }
  function start(id, fresh) {
    var ls = lessons().filter(function (x) { return x.id === id; })[0]; if (!ls) return false;
    if (R) stop(false);
    close();
    var steps = stepsFor(ls), q = prog()[id], i = 0;
    if (!fresh && q && !q.done && q.i > 0) {
      /* back to the last step that can start from the main screen */
      i = Math.min(q.i, steps.length - 1);
      while (i > 0 && !steps[i].start && !(steps[i].t === CENTRE && steps[i].wait) && i !== 0) i--;
    }
    closeAll();
    build();
    R = { ls: ls, steps: steps, i: -1, seen: 0, missAt: 0, el: null, clicked: false, conf: false };
    setTimeout(function () { if (R && R.ls === ls) go(i, false); }, 350);
    clearInterval(loopT); loopT = setInterval(loop, 150);
    return true;
  }
  function build() {
    if (!shade || !shade.isConnected) { shade = document.createElement('div'); shade.id = 'cvgShade'; document.body.appendChild(shade); }
    if (!ring || !ring.isConnected) { ring = document.createElement('div'); ring.id = 'cvgRing'; ring.setAttribute('aria-hidden', 'true'); document.body.appendChild(ring); }
    if (!card || !card.isConnected) {
      if (card) card.remove();
      card = document.createElement('div'); card.id = 'cvgCard'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-live', 'polite');
      ['pointerdown', 'mousedown', 'touchstart', 'click'].forEach(function (ev) { card.addEventListener(ev, function (e) { e.stopPropagation(); }); });
      document.body.appendChild(card);
    }
  }
  function go(i, confirm) {
    if (!R) return;
    if (i >= R.steps.length) return finish();
    R.i = i; R.el = null; R.res = null; R.clicked = false; R.adv = false; R.scrolled = false; R.since = Date.now(); R.conf = !!confirm; R.missShown = false;
    save(R.ls.id, i, false);
    var s = R.steps[i];
    drawCard();
    var line = sayOf(s);
    speak((confirm ? L(SAY.well) + ' ' : '') + line);
    if (confirm) setTimeout(function () { if (R && R.i === i) { R.conf = false; var ok = card && card.querySelector('.ok'); if (ok) ok.hidden = true; } }, 1800);
  }
  function drawCard() {
    if (!R || !card) return;
    var s = R.steps[R.i], n = R.steps.length, missing = R.missShown;
    var act = '';
    if (s.act && !missing) act = '<button type="button" class="pri" data-c="act">' + esc(L(s.act)) + '</button>';
    else if (s.stop) act = '<button type="button" class="pri" data-c="fin">' + esc(u('finish')) + '</button>';
    else if (!s.wait || missing) act = '<button type="button" class="pri" data-c="next">' + esc(R.i === n - 1 ? u('finish') : u('next')) + '</button>';
    var again = guideOn() ? '<button type="button" data-c="again">' + esc(u('again')) + '</button>' : '';
    card.innerHTML = '<div class="hd"><b>' + esc(u('lead')) + '</b><span>' + esc(u('step', { n: R.i + 1, m: n })) + '</span><button type="button" class="x" data-c="x" aria-label="' + esc(u('stop')) + '">×</button></div>' +
      '<div class="tt">' + esc(L(R.ls.title)) + '</div>' +
      '<div class="ok"' + (R.conf ? '' : ' hidden') + '>✓ ' + esc(u('well')) + '</div>' +
      '<div class="pr"' + (s.stop ? '' : ' hidden') + '>' + esc(u('practice')) + '</div>' +
      '<p class="tx">' + esc(sayOf(s)) + '</p>' +
      '<p class="ms"' + (missing ? '' : ' hidden') + '>' + esc(L(s.miss || SAY.notHere)) + '</p>' +
      '<div class="wt"' + (s.wait && !missing && !s.act ? '' : ' hidden') + '><i></i>' + esc(u('wait')) + '</div>' +
      '<div class="ac">' + again + act + '</div>';
    card.querySelectorAll('[data-c]').forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        var c = b.getAttribute('data-c'); if (!R) return;
        if (c === 'x') return stop(true);
        if (c === 'again') { speak(sayOf(R.steps[R.i]) + (R.missShown ? ' ' + L(R.steps[R.i].miss || SAY.notHere) : '')); return; }
        if (c === 'next') return go(R.i + 1, false);
        if (c === 'fin') return finish();
        if (c === 'act') { try { R.steps[R.i].run(); } catch (x) {} }
      };
    });
  }
  function place(res, s) {
    var r = null;
    if (res && res.el) r = res.el.getBoundingClientRect(); else if (res && res.rect) r = res.rect;
    if (!r) { ring.classList.remove('on'); shade.classList.add('on'); card.className = 'bottom'; return; }
    shade.classList.remove('on');
    var pad = res.round ? 6 : 7;
    ring.style.left = Math.round(r.left - pad) + 'px'; ring.style.top = Math.round(r.top - pad) + 'px';
    ring.style.width = Math.round(r.width + 2 * pad) + 'px'; ring.style.height = Math.round(r.height + 2 * pad) + 'px';
    ring.classList.toggle('round', !!res.round); ring.classList.toggle('stop', !!s.stop); ring.classList.add('on');
    /* the card goes where it does not cover the button */
    var ch = card.offsetHeight || 200, above = r.top, below = innerHeight - r.bottom;
    var want = below >= ch + 24 ? 'bottom' : above >= ch + 24 ? 'top' : (r.top + r.height / 2 > innerHeight / 2 ? 'top' : 'bottom');
    if (card.className !== want) card.className = want;
  }
  function loop() {
    if (!R || R.i < 0 || R.adv) return;
    var s = R.steps[R.i];
    document.body.classList.toggle('cvg-nonow', s.t !== MORNING);
    var res = resolve(s.t);
    if (res && res.el) {
      var rr = res.el.getBoundingClientRect();
      if (!inView(rr) && !R.scrolled) { R.scrolled = true; try { res.el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {} }
      if (inView(rr) && !onTop(res.el)) res = null;
    }
    R.res = res; R.el = res && res.el || null;
    if (s.t && !res) {
      var age = Date.now() - R.since;
      if (s.optional && age > 1200 && !(s.wait && s.wait !== 'click' && s.wait())) return go(R.i + 1, false);
      if (!R.missShown && age > 2500 && !s.optional) { R.missShown = true; drawCard(); speak(L(s.miss || SAY.notHere)); }
    } else if (res && R.missShown) { R.missShown = false; drawCard(); }
    place(s.t ? res : null, s);
    /* a step that waits for something to open */
    if (typeof s.wait === 'function' && !R.adv && Date.now() - R.since > 300 && s.wait()) { var i = R.i; R.adv = true; setTimeout(function () { if (R && R.i === i) go(i + 1, true); }, 450); }
  }
  function finish() {
    if (!R) return;
    var ls = R.ls; save(ls.id, 0, true);
    var quiet = R.steps[R.i] && R.steps[R.i].quietEnd;
    R = null; clearInterval(loopT); document.body.classList.remove('cvg-nonow');
    if (!quiet) speak(L(SAY.end));
    ring.classList.remove('on'); shade.classList.remove('on');
    card.className = 'bottom';
    card.innerHTML = '<div class="hd"><b>' + esc(u('lead')) + '</b><button type="button" class="x" data-c="x" aria-label="' + esc(u('close')) + '">×</button></div>' +
      '<div class="ok">✓ ' + esc(u('endT')) + '</div><p class="tx">' + esc(L(ls.title)) + '</p>' +
      '<div class="ac"><button type="button" data-c="close">' + esc(u('close')) + '</button><button type="button" class="pri" data-c="list">' + esc(u('lessons')) + '</button></div>';
    var gone = function () { if (card && !R) card.remove(); card = null; };
    card.querySelector('[data-c=x]').onclick = function (e) { e.stopPropagation(); gone(); };
    card.querySelector('[data-c=close]').onclick = function (e) { e.stopPropagation(); gone(); };
    card.querySelector('[data-c=list]').onclick = function (e) { e.stopPropagation(); gone(); open(); };
    if (quiet) setTimeout(gone, 1200);
  }
  function stop(keep) {
    if (!R) return;
    if (keep) save(R.ls.id, R.i, false);
    R = null; clearInterval(loopT); document.body.classList.remove('cvg-nonow');
    try { if (window.CovaraTalk && CovaraTalk.hush) CovaraTalk.hush(); } catch (e) {}
    if (ring) ring.classList.remove('on'); if (shade) shade.classList.remove('on');
    if (card) { card.remove(); card = null; }
  }

  /* the press the lesson is waiting for: seen first, before the button's own handler, and never stopped.
     A button that acts on the finger going down (and is gone before the click) counts from pointerdown. */
  document.addEventListener('pointerdown', function (e) {
    if (!R || R.i < 0) return;
    var s = R.steps[R.i];
    if (s.wait === 'click' && !s.stop && R.el && R.el.contains(e.target)) R.down = { el: R.el, i: R.i, at: Date.now() };
  }, true);
  document.addEventListener('pointerup', function () {
    if (!R || !R.down || R.down.i !== R.i) return;
    var d = R.down, i = R.i; R.down = null;
    setTimeout(function () { if (R && R.i === i && !R.clicked && !d.el.isConnected) { R.clicked = true; if (R.steps[i].quietEnd) finish(); else go(i + 1, true); } }, 400);
  }, true);
  document.addEventListener('click', function (e) {
    if (!R || R.i < 0) return;
    var s = R.steps[R.i];
    if (s.stop && R.el && R.el.contains(e.target)) { e.preventDefault(); e.stopImmediatePropagation(); guardSay(); return; }
    if (s.wait === 'click' && R.el && R.el.contains(e.target) && !R.clicked) {
      R.clicked = true; var i = R.i;
      if (s.quietEnd) { setTimeout(function () { if (R && R.i === i) finish(); }, 50); return; }
      setTimeout(function () { if (R && R.i === i) go(i + 1, true); }, 650);
    }
  }, true);
  /* practice safety: while a lesson runs nothing that sends or rings can be pressed */
  var _gAt = 0;
  function guardSay() { if (Date.now() - _gAt < 2500) return; _gAt = Date.now(); try { CovaraGuide.tip(L(SAY.guard)); } catch (e) {} speak(L(SAY.guard)); }
  function guard(e) {
    if (!R || !e.target || !e.target.closest) return;
    if (card && card.contains(e.target)) return;
    if (e.target.closest(GUARD)) { e.preventDefault(); e.stopImmediatePropagation(); if (e.type === 'click' || e.type === 'pointerdown') guardSay(); }
  }
  ['pointerdown', 'mousedown', 'touchstart', 'click', 'keydown'].forEach(function (ev) { document.addEventListener(ev, function (e) { if (ev === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return; guard(e); }, { capture: true, passive: false }); });

  window.addEventListener('localeChanged', function () { if (R && R.i >= 0) drawCard(); if (learn && !learn.hidden) drawLearn(); });
  window.addEventListener('covara-guide', function () { if (learn && !learn.hidden) drawLearn(); if (R && R.i >= 0) drawCard(); });

  /* every fixed sentence a lesson can say, in one language */
  function sentences(lang) {
    var k = String(lang || LANG()).slice(0, 2) === 'it' ? 'it' : 'en', out = [];
    LESSONS.forEach(function (ls) {
      ls.steps.forEach(function (s) {
        if (typeof s.say === 'function') { out.push(SIMPLE_ON[k], SIMPLE_OFF[k]); } else if (s.say) out.push(s.say[k]);
        if (s.miss) out.push(s.miss[k]);
      });
    });
    Object.keys(SAY).forEach(function (x) { out.push(SAY[x][k]); });
    var seen = {};
    return out.filter(function (s) { if (!s || seen[s]) return false; seen[s] = 1; return true; });
  }

  window.CovaraLearn = { open: open, close: close, start: function (id, fresh) { return start(id, fresh !== false); }, resume: function (id) { return start(id, false); }, stop: function () { stop(true); },
    active: function () { return !!R; }, step: function () { return R ? { id: R.ls.id, i: R.i, n: R.steps.length, text: R.i >= 0 ? sayOf(R.steps[R.i]) : '', target: !!R.el || !!(R.res && R.res.rect), missing: !!R.missShown } : null; },
    lessons: function () { return lessons().map(function (x) { return { id: x.id, title: L(x.title), steps: stepsFor(x).length }; }); }, sentences: sentences };
})();
