/* Remiel: Covara, TALK. Ask out loud; Covara answers out loud and on screen, from what it knows now.
   On the phone itself: the browser's own speech recognition and voice, no account or paid service.
   It only says something is done when it is done. Questions it understands:
   did he take his medicines · where is she · who is with him · what is next · how is she today
   call / message someone · show the medicines (visits, health, safety, papers) · everything now · camera · home
   Beverly Index LLC */
(function () {
  'use strict';
  var S = {
    en: { listening: 'Listening…', notHeard: 'I did not catch that. Tap and ask again.', noMic: 'Speech is not available in this browser. Type the question:', ask: 'Ask',
      help: 'You can ask: did {name} take the medicines, where is {name}, who is with {name}, what is next, how is {name} today, call someone, or open the camera.',
      allTaken: '{name} has taken everything due so far today.', taken: 'Taken: {list}.', late: 'Late: {list}.', due: 'Due now: {list}.', laterMed: 'Next: {list}.', noMeds: 'There are no medicines for today.',
      atHome: '{name} is at home{room}.', inRoom: ', in the {room}', out: '{name} is out, {d} from home{near}.', near: ', near {place}', inside: '{name} is inside {place}.', noPos: 'I do not have {name}’s position yet.', ago: ' That was {t}.',
      withNone: 'No one from the circle is with {name} right now.', withSome: '{list} {verb} with {name}.', is: 'is', are: 'are', closest: ' The closest is {who}, {d} away.', you: 'you',
      nextAppt: 'Next: {title}{with}, {when}.', nextNone: 'Nothing is planned for the coming days.', withWho: ' with {who}',
      moodNone: 'I have not heard how {name} feels today.', mood_good: '{name} said today is a good day.', mood_okay: '{name} said today is okay.', mood_low: '{name} said today is not a good day. You may want to call.',
      calling: 'Calling {who}.', messaging: 'Opening a message to {who}.', whoCall: 'I could not find {who} in the circle.',
      opening: 'Opening {what}.', camera: 'Opening the camera.', home: 'Back to {name}.', now: 'Here is everything now.',
      talkTo: 'Message for {who}. Speak now…', sentTalk: 'To {who}: \u201c{text}\u201d. Sent.', talkFail: 'Not sent to {who}. Check the internet and tap TALK again.', hlTalk: 'TALK', hlReply: 'Reply', hlTalkBack: 'Talk back', hlGot: 'Got it', hlFrom: 'Message from {who}: {text}',
      offer: 'Who should get this message?', everyone: 'Everyone', notNow: 'Not now', sentTo: 'Sent to {who}.', sentAll: 'Sent to everyone in the circle.', notSent: 'I could not send it. Check the internet and try again.', noOne: 'There is no one in the circle to send it to yet.', tryAsk: 'You can also ask: ' },
    it: { listening: 'Ascolto…', notHeard: 'Non ho capito. Tocca e chiedi di nuovo.', noMic: 'La voce non è disponibile in questo browser. Scrivi la domanda:', ask: 'Chiedi',
      help: 'Puoi chiedere: {name} ha preso le medicine, dov’è {name}, chi è con {name}, cosa c’è dopo, come sta {name} oggi, chiama qualcuno, o apri la fotocamera.',
      allTaken: '{name} ha preso tutto quello previsto finora oggi.', taken: 'Prese: {list}.', late: 'In ritardo: {list}.', due: 'Da prendere ora: {list}.', laterMed: 'Prossime: {list}.', noMeds: 'Non ci sono medicine per oggi.',
      atHome: '{name} è a casa{room}.', inRoom: ', in {room}', out: '{name} è fuori, a {d} da casa{near}.', near: ', vicino a {place}', inside: '{name} è dentro {place}.', noPos: 'Non ho ancora la posizione di {name}.', ago: ' Era {t}.',
      withNone: 'Nessuno della cerchia è con {name} ora.', withSome: '{list} {verb} con {name}.', is: 'è', are: 'sono', closest: ' Il più vicino è {who}, a {d}.', you: 'tu',
      nextAppt: 'Prossimo: {title}{with}, {when}.', nextNone: 'Niente in programma nei prossimi giorni.', withWho: ' con {who}',
      moodNone: 'Non so ancora come sta {name} oggi.', mood_good: '{name} ha detto che oggi è una buona giornata.', mood_okay: '{name} ha detto che oggi va così così.', mood_low: '{name} ha detto che oggi non è una buona giornata. Forse è il caso di chiamare.',
      calling: 'Chiamo {who}.', messaging: 'Apro un messaggio a {who}.', whoCall: 'Non ho trovato {who} nella cerchia.',
      opening: 'Apro {what}.', camera: 'Apro la fotocamera.', home: 'Torno a {name}.', now: 'Ecco tutto ora.',
      talkTo: 'Messaggio per {who}. Parla ora…', sentTalk: 'A {who}: \u201c{text}\u201d. Mandato.', talkFail: 'Non mandato a {who}. Controlla internet e tocca di nuovo TALK.', hlTalk: 'TALK', hlReply: 'Rispondi', hlTalkBack: 'Rispondi a voce', hlGot: 'Ho visto', hlFrom: 'Messaggio da {who}: {text}',
      offer: 'A chi mando questo messaggio?', everyone: 'A tutti', notNow: 'Non ora', sentTo: 'Mandato a {who}.', sentAll: 'Mandato a tutta la cerchia.', notSent: 'Non sono riuscito a mandarlo. Controlla internet e riprova.', noOne: 'Non c\u2019\u00e8 ancora nessuno nella cerchia a cui mandarlo.', tryAsk: 'Puoi anche chiedere: ' }
  };
  /* When HOME asks about himself, Covara answers to him, not about him: "Where am I?" "You are at home." */
  var ME = {
    en: { help: 'You can ask me: did I take my medicines, where am I, who is with me, what is next, how am I today, call someone by name, or open the camera.',
      allTaken: 'You have taken everything due so far today. Well done.', noMeds: 'You have no medicines today.',
      atHome: 'You are at home{room}.', out: 'You are out, {d} from home{near}.', inside: 'You are inside {place}.', noPos: 'I do not know where you are yet. Keep the phone with you and I will find you.',
      withNone: 'No one from your circle is with you right now.', withSome: '{list} {verb} with you.', closest: ' The closest is {who}, {d} away.',
      moodNone: 'You have not told me how you feel today. Tap the camera and take your photo for today, and I will ask.', mood_good: 'You told me today is a good day.', mood_okay: 'You told me today is an okay day.', mood_low: 'You told me today is not a good day. Would you like to call someone? Say: call, and their name.',
      home: 'Back home.' },
    it: { help: 'Puoi chiedermi: ho preso le medicine, dove sono, chi \u00e8 con me, cosa c\u2019\u00e8 dopo, come sto oggi, chiama qualcuno per nome, o apri la fotocamera.',
      allTaken: 'Hai preso tutto quello previsto finora oggi. Bravo.', noMeds: 'Oggi non hai medicine.',
      atHome: 'Sei a casa{room}.', out: 'Sei fuori, a {d} da casa{near}.', inside: 'Sei dentro {place}.', noPos: 'Non so ancora dove sei. Tieni il telefono con te e ti trover\u00f2.',
      withNone: 'Nessuno della tua cerchia \u00e8 con te ora.', withSome: '{list} {verb} con te.', closest: ' Il pi\u00f9 vicino \u00e8 {who}, a {d}.',
      moodNone: 'Non mi hai ancora detto come stai oggi.', mood_good: 'Mi hai detto che oggi \u00e8 una buona giornata.', mood_okay: 'Mi hai detto che oggi va cos\u00ec cos\u00ec.', mood_low: 'Mi hai detto che oggi non \u00e8 una buona giornata. Vuoi chiamare qualcuno? Di\u2019: chiama, e il nome.',
      home: 'Torno a casa.' }
  };
  function self() { return role() !== 'away'; }
  function IT() { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } }
  function t(k, p) { var s = (self() && (IT() ? ME.it : ME.en)[k]) || (IT() ? S.it : S.en)[k] || S.en[k] || k; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function homeContact() { if (typeof DEMO_CONTACTS === 'undefined') return null; return DEMO_CONTACTS.filter(function (c) { return c.care && c.care.side === 'home' && c.care.state === 'active'; })[0] || null; }
  function first() { if (role() === 'away') { var h = homeContact(); return h ? h.first : ''; } return IT() ? 'tu' : 'you'; }
  function list(a) { if (a.length < 2) return a.join(''); return a.slice(0, -1).join(', ') + (IT() ? ' e ' : ' and ') + a[a.length - 1]; }
  function hm(ms) { try { return new Date(ms).toLocaleTimeString(IT() ? 'it' : 'en-US', { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }
  function dist(m) { if (m == null) return ''; if (!IT()) { var ft = m * 3.281; return ft < 1000 ? Math.round(ft / 10) * 10 + ' feet' : (m / 1609.34).toFixed(1) + ' miles'; } return m < 1000 ? Math.round(m) + ' metri' : (m / 1000).toFixed(1) + ' km'; }
  function agoT(ms) { var s = (Date.now() - ms) / 1000; if (s < 90) return IT() ? 'adesso' : 'just now'; if (s < 3600) return Math.round(s / 60) + (IT() ? ' minuti fa' : ' minutes ago'); return Math.round(s / 3600) + (IT() ? ' ore fa' : ' hours ago'); }

  /* ── the answers ── */
  function meds() {
    var d = window.CovaraView && CovaraView.data(); var it = ((d && d.today && d.today.items) || []).filter(function (x) { return x.item.kind !== 'appt'; });
    if (!it.length) return t('noMeds');
    var done = it.filter(function (x) { return x.state === 'done'; }).map(function (x) { return x.item.title + ' ' + (x.done_at ? hm(x.done_at) : x.slot); });
    var late = it.filter(function (x) { return x.state === 'late'; }).map(function (x) { return x.item.title + ' ' + x.slot; });
    var due = it.filter(function (x) { return x.state === 'due'; }).map(function (x) { return x.item.title; });
    var later = it.filter(function (x) { return x.state === 'later'; }).slice(0, 2).map(function (x) { return x.item.title + ' ' + x.slot; });
    var out = [];
    if (!late.length && !due.length) out.push(t('allTaken', { name: first() }));
    if (late.length) out.push(t('late', { list: list(late) }));
    if (due.length) out.push(t('due', { list: list(due) }));
    if (done.length) out.push(t('taken', { list: list(done) }));
    if (later.length) out.push(t('laterMed', { list: list(later) }));
    try { CovaraView.open('med'); } catch (e) {}
    return out.join(' ');
  }
  function where() {
    var w = window.CovaraWhere && CovaraWhere.data();
    try { if (typeof WhereIs !== 'undefined') WhereIs.setMode('whereis'); } catch (e) {}
    if (!w || !w.location) return t('noPos', { name: first() });
    var s = w.inside ? t('inside', { name: first(), place: w.inside.name }) : w.at_home === false ? t('out', { name: first(), d: dist(w.from_home_m), near: w.health && w.health[0] && w.health[0].m < 300 ? t('near', { place: w.health[0].name }) : '' }) : t('atHome', { name: first(), room: w.rooms && w.rooms.now ? t('inRoom', { room: w.rooms.now }) : '' });
    return s + (self() && Date.now() - w.location.at < 15 * 60000 ? '' : t('ago', { t: agoT(w.location.at) }));
  }
  function withWho() {
    var w = window.CovaraWhere && CovaraWhere.data(); if (!w || !w.location) return t('noPos', { name: first() });
    var ws = (w.with || []).map(function (m) { return m.you ? t('you') : String(m.name || '').split(/\s+/)[0]; });
    if (!ws.length) return t('withNone', { name: first() }) + (w.closest ? t('closest', { who: w.closest.you ? t('you') : String(w.closest.name).split(/\s+/)[0], d: dist(w.closest.m) }) : '');
    return t('withSome', { list: list(ws), verb: ws.length > 1 ? t('are') : t('is'), name: first() });
  }
  function next() {
    var d = window.CovaraView && CovaraView.data(); var a = ((d && d.items) || []).filter(function (i) { return i.kind === 'appt' && i.at > Date.now(); }).sort(function (x, y) { return x.at - y.at; })[0];
    if (!a) return t('nextNone');
    try { CovaraView.open('visit'); } catch (e) {}
    return t('nextAppt', { title: a.title, with: (a.meta || {}).with ? t('withWho', { who: a.meta.with }) : '', when: new Date(a.at).toLocaleString(IT() ? 'it' : 'en-US', { weekday: 'long', hour: 'numeric', minute: '2-digit' }) });
  }
  function mood() { var s = window.CovaraNav && CovaraNav.summary(); var m = s && s.mood && s.mood.mood; return m ? t('mood_' + m, { name: first() }) : t('moodNone', { name: first() }); }
  function findPerson(name) {
    var n = String(name || '').toLowerCase().replace(/^(dr|doctor|dottor[e]?|dott(?:ssa)?)\.?\s+/, '').trim(); if (!n) return null;
    var pool = (typeof NODES !== 'undefined' ? NODES.map(function (x) { return x.contact; }) : []).concat(homeContact() ? [homeContact()] : []);
    return pool.filter(function (c) { var full = ((c.cvTitle || '') + ' ' + (c.first || '') + ' ' + (c.last || '')).toLowerCase(); return n.split(/\s+/).every(function (w) { return full.indexOf(w) >= 0; }); })[0] || null;
  }
  function call(name, kind) {
    var c = findPerson(name); if (!c) return t('whoCall', { who: name });
    var who = c.cvTitle || ((c.first || '') + ' ' + (c.last || '')).trim();
    try { focusedContactId = c.id; } catch (e) {}
    setTimeout(function () { try { runContactQuickAction(kind, c); } catch (e) {} }, 1200);
    return t(kind === 'sms' ? 'messaging' : 'calling', { who: who });
  }
  var SECT = [[/medicin|pill|tablet|medicine|farmac|pastigl/, 'med'], [/visit|appointment|appuntament|shift|turn/, 'visit'], [/health|salute|drink|ate|eat|sleep|bere|mangi|dorm/, 'health'], [/safety|sicurezza|emergency|emergenz|missing|scam|truff/, 'safety'], [/paper|document|power of attorney|procura|legal|legale/, 'papers']];
  /* ── free words: anything Talk cannot answer becomes a message, to the person named or to the circle ── */
  var _offer = null;
  function circle() {
    var seen = {}, out = [];
    (typeof DEMO_CONTACTS !== 'undefined' ? DEMO_CONTACTS : []).forEach(function (c) {
      if (!c || !c.care || c.care.state !== 'active' || !c.sentinelId || seen[c.id]) return; seen[c.id] = 1; out.push(c);
    });
    return out;
  }
  function nameOf(c) { return c.cvTitle || ((c.first || '') + ' ' + (c.last || '')).trim(); }
  async function sendMsg(people, text) {
    var ok = 0;
    for (var i = 0; i < people.length; i++) { try { if (await SentinelMessaging.sendTo(people[i].id, text)) ok++; } catch (e) {} }
    return ok;
  }
  function tell(name, text) {
    var c = findPerson(name);
    if (!c || !c.sentinelId) return t('whoCall', { who: name });
    sendMsg([c], text).then(function (n) { say(n ? t('sentTo', { who: nameOf(c) }) : t('notSent')); });
    return t('sentTo', { who: nameOf(c) });
  }
  function answer(q) {
    var s = String(q || '').toLowerCase().trim();
    if (!s) return t('notHeard');
    var m;
    _offer = null;
    /* "tell Vincent I am fine", "ask Ann to call me", "di' a Vincent che sto bene" */
    if ((m = String(q).trim().match(/^(?:tell|ask|send|let)\s+(\S+)\s+(.{2,})$/i))) {
      /* the name is one word, or two when the second is that person's surname ("tell Vincent Rossi ...") */
      var w = m[2].split(/\s+/), c0 = null, rest = m[2];
      if (w.length > 1 && w[0].length > 2) { var c2 = findPerson(m[1] + ' ' + w[0]); if (c2 && String(c2.last || '').toLowerCase() === w[0].toLowerCase()) { c0 = c2; rest = w.slice(1).join(' '); } }
      if (!c0) c0 = findPerson(m[1]);
      rest = rest.replace(/^(?:that|to|know(?:\s+that)?)\s+/i, '');
      if (c0 && rest.length > 1) return tell(nameOf(c0), rest.replace(/^\w/, function (x) { return x.toUpperCase(); }));
    }
    if ((m = String(q).trim().match(/^(?:di['\u2019]?|dici)\s+a\s+(\S+)\s+(?:che\s+)?(.{2,})$/i))) { var c1 = findPerson(m[1]); if (c1) return tell(nameOf(c1), m[2]); }
    if ((m = s.match(/^(?:call|phone|ring|chiama|telefona a)\s+(.+)$/))) return call(m[1], 'phone');
    if ((m = s.match(/^(?:video(?: call)?|videochiama)\s+(.+)$/))) return call(m[1], 'video');
    if ((m = s.match(/^(?:message|text|write to|scrivi a|messaggio a)\s+(.+)$/))) return call(m[1], 'sms');
    /* words that are not a question ("I feel dizzy", "The doctor moved my visit to Friday") are for someone: offer to send them */
    var isQ = /\?\s*$/.test(s) || /^(did|does|do|has|have|had|where|who|whom|what|when|which|why|how|is|are|was|were|can|could|will|would|should|show|open|read|chi|dove|cosa|come|quando|quale|perch[eé]|ha|hanno|ho|sono|mostra|apri)\b/.test(s);
    var cmd = /\b(camera|photo|picture|fotocamera|foto|everything|tutto)\b/.test(s) || (/\b(home|back|casa|indietro)\b/.test(s) && s.split(/\s+/).length <= 3);
    if (!isQ && !cmd && s.split(/\s+/).length >= 3) { _offer = { text: String(q).trim() }; return t('offer'); }
    if (/\b(take|took|taken|pill|pills|medicine|medicines|medication|dose|presa|preso|prese|medicin|pastigl)\b/.test(s) && /\b(did|has|have|ha|hanno|took|taken|preso|prese|today|oggi)\b/.test(s)) return meds();
    if (/\b(who is with|with (him|her|dad|mom)|chi [eè] con|is anyone with)\b/.test(s)) return withWho();
    if (/\b(where|dove)\b/.test(s)) return where();
    if (/\b(next|coming up|appointment|prossim|appuntament)\b/.test(s)) return next();
    if (/\b(how is|how's|how am i|feel|feeling|mood|come sta|come sto|umore)\b/.test(s)) return mood();
    if (/\b(camera|photo|picture|what is this|what's this|fotocamera|foto|cos[' ]?[eè] questo)\b/.test(s)) { setTimeout(function () { try { CovaraCamera.open(); } catch (e) {} }, 600); return t('camera'); }
    if (/\b(everything|all of it|tutto)\b/.test(s)) { setTimeout(function () { try { CovaraNav.now(); } catch (e) {} }, 400); return t('now'); }
    if (/\b(home|back|casa|indietro)\b/.test(s) && s.split(/\s+/).length <= 3) { try { CovaraNav.home(); } catch (e) {} return t('home', { name: first() }); }
    for (var i = 0; i < SECT.length; i++) if (SECT[i][0].test(s)) { try { CovaraView.open(SECT[i][1]); } catch (e) {} return t('opening', { what: q }); }
    /* nothing above: these are words for someone, so offer to send them */
    if (s.split(/\s+/).length >= 2) { _offer = { text: String(q).trim() }; return t('offer'); }
    return t('help', { name: first() });
  }
  /* the choice of who gets the message, as buttons in the reply */
  function offerButtons() {
    if (!_offer || !bubble) return;
    var o = _offer; _offer = null;
    var ppl = circle();
    if (!ppl.length) { say(t('noOne')); return; }
    clearTimeout(bubble._t); bubble._t = setTimeout(function () { bubble.hidden = true; bubble.style.width = ''; }, 30000);
    bubble.style.width = 'min(560px, calc(100vw - 32px))'; bubble.style.boxSizing = 'border-box';
    var row = document.createElement('div'); row.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-top:10px';
    function btn(label, pri, fn) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = label;
      b.style.cssText = 'min-height:40px;padding:0 14px;border-radius:20px;cursor:pointer;font:700 14px var(--nous-font,"Hanken Grotesk",sans-serif);' + (pri ? 'border:0;background:#38bdf8;color:#04121a' : 'border:1px solid rgba(150,200,255,.5);background:rgba(40,90,190,.25);color:#e8f2ff');
      b.onclick = function (e) { e.stopPropagation(); fn(); }; row.appendChild(b);
    }
    ppl.slice(0, 6).forEach(function (c) { btn(nameOf(c), false, function () { sendMsg([c], o.text).then(function (n) { say(n ? t('sentTo', { who: nameOf(c) }) : t('notSent')); }); }); });
    if (ppl.length > 1) btn(t('everyone'), true, function () { sendMsg(ppl, o.text).then(function (n) { say(n ? (n === ppl.length ? t('sentAll') : t('sentTo', { who: n })) : t('notSent')); }); });
    btn(t('notNow'), false, function () { bubble.hidden = true; });
    bubble.appendChild(row);
    var hint = document.createElement('div'); hint.style.cssText = 'margin-top:8px;font-size:12.5px;color:#9fb4e2';
    hint.textContent = t('tryAsk') + t('help', { name: first() }).replace(/^[^:]*:\s*/, '');
    bubble.appendChild(hint);
  }

  /* ── listening and speaking ── */

  /* ── what Covara hears and says, seen: the TALK orb turns translucent and grows, the person's voice
     shows as gold bars around it and Covara's voice as a blue wave inside it; while the person speaks the
     same gold voice ring also plays around the dream circle. The microphone level is real (the phone's own
     level in the Android app, the microphone itself on a computer); words heard light it up as they arrive. ── */
  var VV = (function () {
    var state = 'idle', ac = null, an = null, ms = null, tbuf = null, level = 0, kick = 0, ai = 0, aiKick = 0, aiOn = false, aiEndAt = 0;
    var N = 72, hist = [], ahist = [], raf = 0, orbEl = null;
    for (var i = 0; i < N; i++) { hist.push(0); ahist.push(0); }
    var cvs = document.createElement('canvas'); cvs.id = 'cvTalkWave'; cvs.style.cssText = 'position:fixed;pointer-events:none;z-index:7150;opacity:0;transition:opacity .35s';
    var dcv = document.createElement('canvas'); dcv.id = 'cvTalkDream'; dcv.style.cssText = 'position:fixed;pointer-events:none;z-index:6400;opacity:0;transition:opacity .35s';
    function attach() { if (!cvs.parentNode && document.body) { document.body.appendChild(cvs); document.body.appendChild(dcv); } }
    var touchy = /Android|iPhone|iPad/i.test(navigator.userAgent);
    async function micOn() {
      if (touchy || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      try {
        ms = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
        if (state !== 'listening') { micOff(); return; }
        ac = new (window.AudioContext || window.webkitAudioContext)(); an = ac.createAnalyser(); an.fftSize = 1024; tbuf = new Float32Array(an.fftSize);
        ac.createMediaStreamSource(ms).connect(an);
      } catch (e) { micOff(); }
    }
    function micOff() { try { if (ms) ms.getTracks().forEach(function (x) { x.stop(); }); } catch (e) {} try { if (ac) ac.close(); } catch (e) {} ms = null; ac = null; an = null; }
    function listen(orb) { orbEl = orb || orbEl; state = 'listening'; attach(); micOn(); if (orbEl) orbEl.classList.add('live'); run(); }
    function heard() { kick = Math.min(1, kick + 0.55); }
    function rms(db) { var v = Math.max(0, Math.min(1, (Number(db) + 2) / 11)); level = Math.max(level * 0.6, v); }
    function settle() { clearTimeout(settle._t); settle._t = setTimeout(function () { if (state === 'fading') { state = 'idle'; if (orbEl) orbEl.classList.remove('live'); cvs.style.opacity = '0'; dcv.style.opacity = '0'; } }, 1800); }
    function doneListening() { micOff(); if (state === 'listening') { state = aiOn ? 'speaking' : 'fading'; settle(); } }
    function speakStart(est) { aiOn = true; aiEndAt = est ? Date.now() + est : 0; state = 'speaking'; attach(); if (orbEl) orbEl.classList.add('live'); run(); }
    function word() { aiKick = Math.min(1, aiKick + 0.7); }
    function speakEnd() { aiOn = false; aiEndAt = 0; if (state === 'speaking') { state = 'fading'; settle(); } }
    function stopAll() { micOff(); aiOn = false; state = 'fading'; settle(); }
    function run() { if (!raf) raf = requestAnimationFrame(frame); }
    function size(c, w, h) { var dpr = window.devicePixelRatio || 1; if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); } c.style.width = w + 'px'; c.style.height = h + 'px'; var x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); return x; }
    function frame(ts) {
      raf = 0;
      var now = Date.now();
      if (aiOn && aiEndAt && now > aiEndAt) speakEnd();
      /* the person's voice */
      var mic = 0;
      if (an && state === 'listening') { an.getFloatTimeDomainData(tbuf); var sum = 0; for (var i = 0; i < tbuf.length; i++) sum += tbuf[i] * tbuf[i]; mic = Math.min(1, Math.sqrt(sum / tbuf.length) * 7); }
      kick *= 0.9; level *= 0.88;
      var you = state === 'listening' ? Math.max(mic, level, kick * (0.55 + 0.45 * Math.random())) : 0;
      /* Covara's voice: the device voices give no sound to measure, so the wave follows each word as it is said */
      aiKick *= 0.9;
      var aiv = aiOn ? Math.min(1, 0.22 + aiKick * 0.6 + 0.18 * Math.abs(Math.sin(ts * 0.011)) * (0.6 + 0.4 * Math.sin(ts * 0.0031))) : 0;
      hist.push(you); hist.shift(); ahist.push(aiv); ahist.shift();
      var any = state !== 'idle' && (state !== 'fading' || hist.some(function (v) { return v > 0.01; }) || ahist.some(function (v) { return v > 0.01; }));
      if (state === 'fading' && !any) { state = 'idle'; if (orbEl) orbEl.classList.remove('live'); cvs.style.opacity = '0'; dcv.style.opacity = '0'; return; }
      drawOrb(ts); drawDreamRing(ts, you);
      raf = requestAnimationFrame(frame);
    }
    /* TALK: a glass sphere with a ribbon of fine light running through it, warm on the left (the person speaking)
       and cool on the right (Covara speaking). The ribbon lifts and twists with each voice; at rest it lies almost flat. */
    function ribbon(x, cx, cy, half, amp, ts, strands, phase, twist) {
      for (var k = 0; k < strands; k++) {
        var u = k / (strands - 1) - 0.5;
        x.beginPath();
        for (var j = 0; j <= 140; j++) {
          var f = j / 140, px = cx - half + f * half * 2;
          var env = Math.exp(-Math.pow((f - 0.5) * 2.1, 2) * 1.6);
          var w1 = Math.sin(f * Math.PI * 2.2 + ts * 0.0021 + phase + u * twist);
          var w2 = Math.sin(f * Math.PI * 4.6 - ts * 0.0016 + phase * 1.7) * 0.35;
          var py = cy + (w1 + w2) * amp * env + u * amp * 0.55 * Math.cos(f * Math.PI * 2.2 + ts * 0.0021 + phase);
          if (j) x.lineTo(px, py); else x.moveTo(px, py);
        }
        x.stroke();
      }
    }
    function drawOrb(ts) {
      if (!orbEl) return;
      var r = orbEl.getBoundingClientRect(); if (!r.width) return;
      var R = r.width / 2, Wd = Math.round(R * 2 + 28), Ht = Wd, cx = Wd / 2, cy = Ht / 2;
      cvs.style.left = Math.round(r.left + r.width / 2 - Wd / 2) + 'px'; cvs.style.top = Math.round(r.top + r.height / 2 - Ht / 2) + 'px';
      var x = size(cvs, Wd, Ht); x.clearRect(0, 0, Wd, Ht); cvs.style.opacity = '1';
      var you = 0, me = 0; for (var i = N - 12; i < N; i++) { you = Math.max(you, hist[i]); me = Math.max(me, ahist[i]); }
      var amp = R * (0.06 + Math.max(you, me) * 0.5), half = R;
      var g = x.createLinearGradient(cx - half, 0, cx + half, 0);
      var warm = 0.35 + you * 0.65, cool = 0.35 + me * 0.65;
      g.addColorStop(0, 'rgba(255,70,40,.25)'); g.addColorStop(0.18, 'rgba(255,90,50,' + 0.55 * warm + ')'); g.addColorStop(0.36, 'rgba(255,170,90,' + 0.75 * warm + ')');
      g.addColorStop(0.5, 'rgba(255,240,215,0.85)');
      g.addColorStop(0.64, 'rgba(170,240,235,' + 0.75 * cool + ')'); g.addColorStop(0.82, 'rgba(90,210,230,' + 0.55 * cool + ')'); g.addColorStop(1, 'rgba(60,190,230,.25)');
      /* the waves stay inside the glass sphere */
      x.save(); x.beginPath(); x.arc(cx, cy, R - 1.5, 0, Math.PI * 2); x.clip();
      x.globalCompositeOperation = 'lighter'; x.strokeStyle = g; x.lineWidth = 0.7;
      ribbon(x, cx, cy, half, amp, ts, 22, 0, 2.6);
      x.lineWidth = 0.55; ribbon(x, cx, cy, half, amp * 0.8, ts, 18, 2.1, -3.2);
      x.restore();
      /* the glass sphere's rim */
      x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2);
      var rg = x.createLinearGradient(cx - R, cy - R, cx + R, cy + R); rg.addColorStop(0, 'rgba(120,220,255,.85)'); rg.addColorStop(1, 'rgba(60,140,220,.45)');
      x.strokeStyle = rg; x.lineWidth = 1.4; x.shadowColor = 'rgba(80,200,255,.8)'; x.shadowBlur = 10; x.stroke(); x.shadowBlur = 0;
    }
    /* A band of colour from blue to red, the sound scrolling from right to left: left edge x0, centre line cy,
       width w, tallest wave maxA, levels src (0 to 1, oldest first) */
    function band(x, x0, cy, w, maxA, src, ts) {
      var n = src.length, g = x.createLinearGradient(x0, 0, x0 + w, 0);
      [[0, '#2f6bff'], [0.18, '#2fd0ff'], [0.36, '#3cffb4'], [0.52, '#f6ff6a'], [0.68, '#ffb03a'], [0.84, '#ff4a3a'], [1, '#ff3f9b']].forEach(function (c) { g.addColorStop(c[0], c[1]); });
      x.save(); x.globalCompositeOperation = 'lighter';
      var P = 150;
      function lvl(f) { return src[Math.min(n - 1, Math.max(0, Math.floor(f * (n - 1))))]; }
      for (var s2 = 0; s2 < 6; s2++) {
        var fr = 9 + s2 * 3.3, ph = ts * (0.004 + s2 * 0.0011) + s2 * 1.3;
        x.beginPath();
        for (var j = 0; j <= P; j++) {
          var f = j / P, a = maxA * (0.06 + lvl(f) * 0.94) * Math.exp(-Math.pow((f - 0.5) * 2, 2) * 0.9);
          var py = cy + Math.sin(f * fr + ph) * a;
          if (j) x.lineTo(x0 + f * w, py); else x.moveTo(x0, py);
        }
        for (var j2 = P; j2 >= 0; j2--) {
          var f2 = j2 / P, a2 = maxA * (0.06 + lvl(f2) * 0.94) * Math.exp(-Math.pow((f2 - 0.5) * 2, 2) * 0.9);
          x.lineTo(x0 + f2 * w, cy - Math.sin(f2 * fr + ph) * a2);
        }
        x.closePath();
        x.globalAlpha = 0.09; x.fillStyle = g; x.fill();
        x.globalAlpha = 0.55; x.strokeStyle = g; x.lineWidth = 1.2; x.stroke();
      }
      x.globalAlpha = 1;
      var cl = x.createLinearGradient(x0, 0, x0 + w, 0); cl.addColorStop(0, 'rgba(255,255,255,0)'); cl.addColorStop(0.5, 'rgba(255,255,255,.95)'); cl.addColorStop(1, 'rgba(255,255,255,0)');
      x.strokeStyle = cl; x.lineWidth = 1.6; x.shadowColor = '#fff'; x.shadowBlur = 12;
      x.beginPath(); x.moveTo(x0, cy); x.lineTo(x0 + w, cy); x.stroke();
      x.restore();
    }
    /* The dream circle while someone speaks: a band of colour from blue to red across the picture,
       the sound itself scrolling from right to left, laid over whatever image is there */
    function drawDreamRing(ts, you) {
      var d = window._dreamRect, sp = document.getElementById('sphere');
      var live = state === 'listening' || aiOn;
      if (!d || !sp || !live) { dcv.style.opacity = '0'; return; }
      var b = sp.getBoundingClientRect(), k = b.width / (sp.width / (window.devicePixelRatio || 1) || b.width);
      var R = d.r * k, S = Math.round(R * 2), cx = S / 2, cy = S / 2;
      dcv.style.left = Math.round(b.left + d.cx * k - R) + 'px'; dcv.style.top = Math.round(b.top + d.cy * k - R) + 'px';
      var x = size(dcv, S, S); x.clearRect(0, 0, S, S); dcv.style.opacity = '1';
      var src = state === 'listening' ? hist : ahist;
      x.save(); x.beginPath(); x.arc(cx, cy, R - 1, 0, Math.PI * 2); x.clip();
      x.fillStyle = 'rgba(2,6,18,.38)'; x.fillRect(0, 0, S, S);
      band(x, 0, cy, S, R * 0.62, src, ts);
      x.restore();
    }
    return { listen: listen, heard: heard, rms: rms, doneListening: doneListening, speakStart: speakStart, word: word, speakEnd: speakEnd, stop: stopAll, band: band, ribbon: ribbon };
  })();
  window.CovaraVoiceVisual = VV;
  var rec = null, busy = false, _orb = null, _cap = null, bubble = null;
  /* The most natural voice the device has. Phones and computers carry a few voices recorded from real people
     (Apple's Premium and Enhanced voices, Google's network voices, Microsoft's Natural voices); the default is often
     the flattest one, so Covara picks the best by name. */
  var _voice = null;
  var GOOD = [/premium/i, /enhanced/i, /natural/i, /neural/i, /siri/i, /google (us|uk) english/i, /google italiano/i, /x-.*-network/i, /^(ava|zoe|evan|nathan|joelle|noelle|samantha|alice|federica|luca|emma)\b/i];
  function pickVoice() {
    if (!window.speechSynthesis) return null;
    var lang = IT() ? 'it' : 'en', vs = speechSynthesis.getVoices().filter(function (v) { return String(v.lang).toLowerCase().indexOf(lang) === 0; });
    if (!vs.length) return null;
    function score(v) { var n = v.name + ' ' + v.voiceURI, sc = 0; GOOD.forEach(function (r, i) { if (r.test(n)) sc += 40 - i * 3; }); if (/en-US|it-IT/i.test(v.lang)) sc += 5; if (/compact|eloquence|espeak|fred|albert|zarvox|bells|bad news|boing|bubbles|cellos|jester|organ|trinoids|whisper|wobble|superstar|grandma|grandpa|rocko|shelley|sandy|reed|flo|eddy/i.test(n)) sc -= 100; return sc; }
    vs.sort(function (a, b) { return score(b) - score(a); });
    return vs[0];
  }
  try { if (window.speechSynthesis) { _voice = pickVoice(); speechSynthesis.onvoiceschanged = function () { _voice = pickVoice(); }; } } catch (e) {}
  function forEar(text) {
    return String(text)
      .replace(/\b([01]?\d|2[0-3]):([0-5]\d)\b/g, function (m, h, mi) { h = +h; mi = +mi; if (IT()) return h + (mi ? ' e ' + mi : ''); var ap = h < 12 ? 'A M' : 'P M', h12 = h % 12 || 12; return h12 + (mi ? ' ' + (mi < 10 ? 'oh ' + mi : mi) : '') + ' ' + ap; })
      .replace(/\bmg\b/g, IT() ? 'milligrammi' : 'milligrams').replace(/\bDr\./g, IT() ? 'Dottor' : 'Doctor');
  }
  /* ── Covara's own voice: a human-sounding voice from Covara's voice server, the same on every phone. Each sentence is
     asked for once and kept by the server, so a repeated sentence plays at once. When the voice server is not set up,
     asleep or slow, the phone's own voice speaks instead. ── */
  var _cv = { ok: null, at: 0, audio: null, seq: 0 };
  async function cvReady() {
    if (_cv.ok !== null && Date.now() - _cv.at < 10 * 60000) return _cv.ok;
    _cv.at = Date.now();
    try { var r = await SyncEngine.apiFetch('/care-voice/status', { method: 'GET' }); var j = r.ok ? await r.json() : null; _cv.ok = !!(j && j.configured); } catch (e) { _cv.ok = false; }
    return _cv.ok;
  }
  function cvHush() { _cv.seq++; try { if (_cv.audio) { _cv.audio.pause(); _cv.audio.src = ''; } } catch (e) {} _cv.audio = null; }
  async function cvFetch(part, lang) {
    var ac = typeof AbortController !== 'undefined' ? new AbortController() : null, tm = setTimeout(function () { if (ac) ac.abort(); }, 9000);
    try {
      var r = await SyncEngine.apiFetch('/care-voice/say', { method: 'POST', body: JSON.stringify({ text: part, lang: lang }), signal: ac ? ac.signal : undefined });
      if (!r.ok) return null;
      return URL.createObjectURL(await r.blob());
    } catch (e) { return null; } finally { clearTimeout(tm); }
  }
  async function speakCovara(text) {
    var seq = ++_cv.seq, lang = IT() ? 'it' : 'en';
    var parts = (forEar(text).match(/[^.!?]+[.!?]*/g) || [text]).map(function (x) { return x.trim(); }).filter(Boolean);
    /* ask for every sentence at once; play them in order as they arrive */
    var urls = parts.map(function (p) { return cvFetch(p, lang); });
    var first = await urls[0];
    if (seq !== _cv.seq) return true;
    /* not kept and the voice server away: the phone's voice for this one (the next may be a kept sentence) */
    if (!first) return false;
    VV.speakStart(0);
    var blocked = false;
    var tick = setInterval(function () { if (_cv.audio && !_cv.audio.paused) VV.word(); }, 260);
    try {
      for (var i = 0; i < parts.length; i++) {
        var u = i ? await urls[i] : first;
        if (seq !== _cv.seq) break;
        if (!u) { speakDevice(parts.slice(i).join(' ')); break; }
        await new Promise(function (done) {
          var a = new Audio(u); _cv.audio = a; a.onended = a.onerror = function () { URL.revokeObjectURL(u); done(); };
          var p = a.play(); if (p && p.catch) p.catch(function () { blocked = true; done(); });
        });
        /* the phone would not play Covara's voice: the phone's own voice says the rest, so nothing goes unsaid */
        if (blocked) { speakDevice(parts.slice(i).join(' ')); break; }
      }
    } finally { clearInterval(tick); if (seq === _cv.seq) { _cv.audio = null; VV.speakEnd(); } }
    return true;
  }
  function speak(text) {
    if (!String(text || '').trim()) return;
    cvHush();
    var authed = false; try { authed = SyncEngine.isAuthenticated() && !SyncEngine.isLocalOnly(); } catch (e) {}
    if (!authed) { speakDevice(text); return; }
    cvReady().then(function (ok) {
      if (!ok) { speakDevice(text); return; }
      speakCovara(text).then(function (spoke) { if (!spoke) speakDevice(text); }).catch(function () { speakDevice(text); });
    });
  }
  function speakDevice(text) {
    /* in the installed Android app: the phone's own voice engine, which carries Google's natural voices */
    if (window.CovaraNative && typeof CovaraNative.speak === 'function') { if (!String(text || '').trim()) return; try { VV.speakStart(forEar(text).split(/\s+/).length * 420 + 1500); CovaraNative.speak(forEar(text), IT() ? 'it-IT' : 'en-US', window.CovaraCalm ? 0.86 : 0.95); return; } catch (e) {} }
    try {
      if (!window.speechSynthesis || !text) return;
      speechSynthesis.cancel(); if (!_voice) _voice = pickVoice();
      /* a sentence at a time, with a breath between, so it sounds like someone talking, not a list being read */
      var parts = forEar(text).match(/[^.!?]+[.!?]*/g) || [text];
      VV.speakStart(forEar(text).split(/\s+/).length * 420 + 1500);
      parts.forEach(function (part, i) {
        var u = new SpeechSynthesisUtterance(part.trim()); if (_voice) u.voice = _voice; u.lang = _voice ? _voice.lang : (IT() ? 'it-IT' : 'en-US');
        u.rate = window.CovaraCalm ? 0.86 : 0.94; u.pitch = 1.02 - (i % 2) * 0.03; u.volume = 1;
        u.onboundary = function () { VV.word(); };
        if (i === parts.length - 1) { u.onend = function () { VV.speakEnd(); }; u.onerror = function () { VV.speakEnd(); }; }
        speechSynthesis.speak(u);
      });
    } catch (e) {}
  }
  function say(text, spoken) {
    if (!bubble) { bubble = document.createElement('div'); bubble.id = 'cvTalkBubble'; bubble.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:190px;z-index:7300;max-width:min(560px,calc(100vw - 32px));padding:12px 16px;border-radius:16px;border:1px solid rgba(197,165,90,.6);background:rgba(10,14,24,.94);color:#f0eef5;font:500 15px/1.45 var(--nous-font,"Hanken Grotesk",sans-serif);box-shadow:0 14px 34px rgba(0,0,0,.6)'; document.body.appendChild(bubble); bubble.addEventListener('click', function () { bubble.hidden = true; }); }
    bubble.textContent = text; bubble.hidden = false; bubble.style.width = '';
    clearTimeout(bubble._t); bubble._t = setTimeout(function () { bubble.hidden = true; }, Math.max(6000, text.length * 90));
    speak(spoken || text);
  }
  function typed() {
    if (!bubble) say('');
    bubble.innerHTML = ''; var p = document.createElement('div'); p.textContent = t('noMic'); bubble.appendChild(p);
    var f = document.createElement('form'); f.style.cssText = 'display:flex;gap:8px;margin-top:8px';
    var i = document.createElement('input'); i.type = 'text'; i.style.cssText = 'flex:1;min-height:40px;border-radius:12px;border:1px solid rgba(255,255,255,.2);background:#0a0e16;color:#fff;padding:0 12px;font:500 15px var(--nous-font,sans-serif)';
    var b = document.createElement('button'); b.type = 'submit'; b.textContent = t('ask'); b.style.cssText = 'min-height:40px;padding:0 16px;border-radius:12px;border:0;background:#38bdf8;color:#04121a;font-weight:800';
    f.appendChild(i); f.appendChild(b); bubble.appendChild(f); bubble.hidden = false; clearTimeout(bubble._t);
    f.onsubmit = function (e) { e.preventDefault(); heardWords(i.value); };
    setTimeout(function () { i.focus(); }, 50);
  }
  /* the installed Android app hears with the phone's own speech recognition */
  if (!window.CovaraNativeEvent) window.CovaraNativeEvent = function (j) { try { window.dispatchEvent(new CustomEvent('covara-native', { detail: JSON.parse(j) })); } catch (e) {} };
  window.addEventListener('covara-native', function (e) {
    var d = e.detail || {};
    if (d.kind === 'tts') { if (d.type === 'start') VV.speakStart(0); else if (d.type === 'word') VV.word(); else if (d.type === 'end') VV.speakEnd(); return; }
    if (d.kind !== 'speech' || !busy) return;
    if (d.type === 'rms') { VV.rms(d.value); return; }
    if (d.type === 'partial') { VV.heard(); if (bubble && d.value) { bubble.textContent = '\u201c' + d.value + '\u2026\u201d'; bubble.hidden = false; } return; }
    if (d.type === 'result') { stop(); heardWords(d.value); }
    else if (d.type === 'error') { stop(); if (d.value === 'not-allowed') typed(); else say(t('notHeard')); }
  });
  function nativeListen(orb) { busy = true; orb.classList.add('listening'); VV.listen(orb); say(_to ? t('talkTo', { who: nameOf(_to) }) : t('listening'), ' '); try { CovaraNative.listen(IT() ? 'it-IT' : 'en-US'); } catch (e) { stop(); typed(); } }
  function stop() { busy = false; VV.doneListening(); if (_orb) _orb.classList.remove('listening'); try { if (rec) rec.abort(); } catch (e) {} try { if (window.CovaraNative && CovaraNative.stopListening) CovaraNative.stopListening(); } catch (e) {} }
  function toggle(orb, cap) {
    _orb = orb; _cap = cap;
    if (busy) { stop(); return; }
    _to = target();
    try { cvHush(); if (window.speechSynthesis) speechSynthesis.cancel(); if (window.CovaraNative && CovaraNative.hush) CovaraNative.hush(); } catch (e) {} VV.speakEnd();
    if (window.CovaraNative && typeof CovaraNative.listen === 'function' && CovaraNative.canHear()) { nativeListen(orb); return; }
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { typed(); return; }
    rec = new SR(); rec.lang = IT() ? 'it-IT' : 'en-US'; rec.interimResults = true; rec.maxAlternatives = 1;
    busy = true; orb.classList.add('listening'); VV.listen(orb); say(_to ? t('talkTo', { who: nameOf(_to) }) : t('listening'), ' ');
    var heard = false;
    rec.onresult = function (e) {
      var r0 = e.results[e.results.length - 1], q = r0[0].transcript; VV.heard();
      if (!r0.isFinal) { if (bubble) { bubble.textContent = '\u201c' + q + '\u2026\u201d'; bubble.hidden = false; } return; }
      heard = true; stop(); heardWords(q);
    };
    rec.onerror = function (e) { stop(); if (e && (e.error === 'not-allowed' || e.error === 'service-not-allowed')) typed(); else say(t('notHeard')); };
    rec.onend = function () { if (busy && !heard) { stop(); say(t('notHeard')); } };
    try { rec.start(); } catch (e) { stop(); typed(); }
  }
  /* ── TALK as messaging: tap a sphere, tap TALK, speak; the words go to that person as a message ──
     With no sphere chosen, a family member's TALK goes to HOME; on HOME's phone with no sphere chosen, TALK
     answers questions as before. A reply to a TALK message opens the conversation in Messages. */
  var MARK = '🎙 ';               /* a Talk message starts with a microphone, so the other phone shows it as a headline */
  var _to = null, _awaiting = {};
  function target() {
    var f = (typeof focusedContactId !== 'undefined') ? focusedContactId : null, c = null;
    if (f != null && typeof DEMO_CONTACTS !== 'undefined') c = DEMO_CONTACTS.filter(function (x) { return x.id === f; })[0] || null;
    if (c && c.sentinelId) return c;
    if (role() === 'away') { var h = homeContact(); if (h && h.sentinelId) return h; }
    return null;
  }
  function sendTalk(c, words) {
    var text = String(words || '').trim(); if (!text) { say(t('notHeard')); return; }
    text = text.replace(/^\w/, function (x) { return x.toUpperCase(); });
    var who = nameOf(c);
    say(t('sentTalk', { who: who, text: text }), IT() ? 'Mandato a ' + who + '.' : 'Sent to ' + who + '.');
    _awaiting[c.id] = Date.now();
    SentinelMessaging.sendTo(c.id, MARK + text).then(function (ok) { if (!ok) say(t('talkFail', { who: who })); }).catch(function () { say(t('talkFail', { who: who })); });
  }
  function heardWords(q) {
    /* HOME asking for something ("I want pancakes for breakfast tomorrow at 9") goes to the team, or, with one of
       the team's faces tapped first, to that person; it waits on HOME's day until they answer */
    var c0 = _to; _to = null;
    try {
      if (window.CovaraPlan && CovaraPlan.isAsk(q) && (!c0 || (c0.care && c0.care.side === 'away' && c0.care.userId))) {
        CovaraPlan.ask(q, false, c0 ? c0.care.userId : undefined).then(function (a) {
          if (a) return;
          if (c0) { sendTalk(c0, q); return; }
          var x = answer(q); say('\u201c' + q + '\u201d: ' + x, x);
        });
        return;
      }
    } catch (e) {}
    if (c0) { sendTalk(c0, q); return; }
    var a = answer(q); say('“' + q + '”: ' + a, a); offerButtons();
  }

  /* ── the headline: a Talk message, or a reply, at the top of the screen until it is seen ── */
  var hl = null, hlQueue = [];
  /* through the Now strip when it is there: one card per person, the same three answers */
  var _hlNow = {};
  function hlNowSync() {
    var keep = {};
    hlQueue.forEach(function (m) {
      var id = 'talk-' + m.contactId; keep[id] = 1;
      var who = String(m.name || '').trim().split(/\s+/)[0] || '';
      var txt = String(m.text || '').replace(MARK, '').replace(/^🎙\s*/, '');
      var done = function () { hlQueue = hlQueue.filter(function (x) { return x !== m; }); hlNowSync(); };
      CovaraNow.push({ id: id, rank: 1, icon: '🎙', lead: t('hlTalk') + ' · ' + who, title: '“' + txt + '”', at: m.ts || Date.now(), actions: [
        { label: '🎙 ' + t('hlTalkBack'), primary: true, onClick: function () { done(); try { focusedContactId = m.contactId; } catch (e) {} var orb = _orb || document.querySelector('.cvn-orb') || document.body; setTimeout(function () { toggle(orb, _cap); }, 150); } },
        { label: t('hlReply'), onClick: function () { done(); try { SentinelMessaging.openFor(m.contactId); } catch (e) {} } },
        { label: t('hlGot'), onClick: done }] });
    });
    Object.keys(_hlNow).forEach(function (id) { if (!keep[id]) CovaraNow.remove(id); });
    _hlNow = keep;
  }
  function headline(m) {
    if (window.CovaraNow) { hlQueue = hlQueue.filter(function (x) { return x.contactId !== m.contactId; }); hlQueue.unshift(m); if (hl) hl.hidden = true; hlNowSync(); return; }
    if (!hl) {
      hl = document.createElement('div'); hl.id = 'cvTalkHeadline'; hl.setAttribute('role', 'alert');
      hl.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 74px);z-index:99990;width:min(560px,calc(100vw - 24px));box-sizing:border-box;padding:12px 14px;border-radius:18px;border:1.5px solid rgba(255,210,77,.75);background:linear-gradient(155deg,rgba(70,130,235,.22),rgba(14,30,78,.42));-webkit-backdrop-filter:blur(16px) saturate(150%);backdrop-filter:blur(16px) saturate(150%);box-shadow:0 0 26px rgba(255,210,77,.35),0 0 22px rgba(70,150,255,.28),inset 0 1px 0 rgba(255,255,255,.14);color:#f4f7ff;font:500 15px/1.4 var(--nous-font,"Hanken Grotesk",sans-serif);text-shadow:0 1px 2px rgba(2,8,24,.55)';
      document.body.appendChild(hl);
    }
    hlQueue = hlQueue.filter(function (x) { return x.contactId !== m.contactId; }); hlQueue.unshift(m);
    paintHl();
  }
  function paintHl() {
    if (!hl) return;
    var m = hlQueue[0]; if (!m) { hl.hidden = true; return; }
    var who = String(m.name || '').trim().split(/\s+/)[0] || '';
    var txt = String(m.text || '').replace(MARK, '').replace(/^🎙\s*/, '');
    var when = ''; try { when = new Date(m.ts).toLocaleTimeString(IT() ? 'it' : 'en-US', { hour: 'numeric', minute: '2-digit' }); } catch (e) {}
    function esc(x) { return String(x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    var b = 'min-height:38px;padding:0 14px;border-radius:19px;cursor:pointer;font:700 13.5px var(--nous-font,"Hanken Grotesk",sans-serif);';
    hl.innerHTML = '<div style="display:flex;align-items:center;gap:8px;font:800 10.5px var(--nous-mono,\'JetBrains Mono\',monospace);letter-spacing:.14em;color:#ffd24d;text-transform:uppercase"><span>🎙 ' + esc(t('hlTalk')) + ' · ' + esc(who) + '</span><span style="margin-left:auto;color:#9fd8ff;letter-spacing:.06em">' + esc(when) + (hlQueue.length > 1 ? ' · +' + (hlQueue.length - 1) : '') + '</span></div>' +
      '<div style="margin:6px 0 10px;font-size:17px;font-weight:600">“' + esc(txt) + '”</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" data-h="talk" style="' + b + 'border:0;background:#38bdf8;color:#04121a">🎙 ' + esc(t('hlTalkBack')) + '</button>' +
      '<button type="button" data-h="reply" style="' + b + 'border:1px solid rgba(150,200,255,.55);background:rgba(40,90,190,.25);color:#e8f2ff">' + esc(t('hlReply')) + '</button>' +
      '<button type="button" data-h="ok" style="' + b + 'border:1px solid rgba(150,200,255,.35);background:transparent;color:#cfe0ff">' + esc(t('hlGot')) + '</button></div>';
    hl.hidden = false;
    hl.querySelector('[data-h=ok]').onclick = function () { hlQueue.shift(); paintHl(); };
    hl.querySelector('[data-h=reply]').onclick = function () { hlQueue.shift(); paintHl(); try { SentinelMessaging.openFor(m.contactId); } catch (e) {} };
    hl.querySelector('[data-h=talk]').onclick = function () {
      hlQueue.shift(); paintHl();
      try { focusedContactId = m.contactId; } catch (e) {}
      var orb = _orb || document.querySelector('.cvn-orb') || document.body;
      setTimeout(function () { toggle(orb, _cap); }, 150);
    };
  }
  window.addEventListener('covara-message', function (e) {
    var m = e.detail || {}; if (!m.contactId) return;
    var talk = /^🎙/.test(String(m.text || ''));
    var replying = _awaiting[m.contactId] && Date.now() - _awaiting[m.contactId] < 30 * 60000;
    if (replying && !talk) {
      /* an answer to my Talk message: the conversation continues in Messages */
      delete _awaiting[m.contactId];
      try { SentinelMessaging.openFor(m.contactId); } catch (err) {}
      return;
    }
    if (!talk) return;
    headline(m);
    /* HOME hears it too */
    if (role() !== 'away') { try { speak(t('hlFrom', { who: String(m.name || '').split(/\s+/)[0], text: String(m.text).replace(/^🎙\s*/, '') })); } catch (err) {} }
    if (replying) delete _awaiting[m.contactId];
  });
  /* new messages are fetched every 8 seconds while Covara is on screen, so a Talk message lands at once */
  setInterval(function () { try { if (document.visibilityState === 'visible' && typeof SentinelMessaging !== 'undefined' && SyncEngine.isAuthenticated()) SentinelMessaging.poll(); } catch (e) {} }, 8000);

  window.CovaraTalk = { hush: function () { cvHush(); try { if (window.speechSynthesis) speechSynthesis.cancel(); if (window.CovaraNative && CovaraNative.hush) CovaraNative.hush(); } catch (e) {} }, toggle: toggle, answer: answer, say: say, typed: typed, ask: function (q) { var a = answer(q); say('\u201c' + q + '\u201d: ' + a, a); offerButtons(); }, talkTo: function (c, q) { sendTalk(c, q); }, headline: headline };
})();
