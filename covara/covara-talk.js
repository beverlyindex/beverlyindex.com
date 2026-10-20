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
      opening: 'Opening {what}.', camera: 'Opening the camera.', home: 'Back to {name}.', now: 'Here is everything now.' },
    it: { listening: 'Ascolto…', notHeard: 'Non ho capito. Tocca e chiedi di nuovo.', noMic: 'La voce non è disponibile in questo browser. Scrivi la domanda:', ask: 'Chiedi',
      help: 'Puoi chiedere: {name} ha preso le medicine, dov’è {name}, chi è con {name}, cosa c’è dopo, come sta {name} oggi, chiama qualcuno, o apri la fotocamera.',
      allTaken: '{name} ha preso tutto quello previsto finora oggi.', taken: 'Prese: {list}.', late: 'In ritardo: {list}.', due: 'Da prendere ora: {list}.', laterMed: 'Prossime: {list}.', noMeds: 'Non ci sono medicine per oggi.',
      atHome: '{name} è a casa{room}.', inRoom: ', in {room}', out: '{name} è fuori, a {d} da casa{near}.', near: ', vicino a {place}', inside: '{name} è dentro {place}.', noPos: 'Non ho ancora la posizione di {name}.', ago: ' Era {t}.',
      withNone: 'Nessuno della cerchia è con {name} ora.', withSome: '{list} {verb} con {name}.', is: 'è', are: 'sono', closest: ' Il più vicino è {who}, a {d}.', you: 'tu',
      nextAppt: 'Prossimo: {title}{with}, {when}.', nextNone: 'Niente in programma nei prossimi giorni.', withWho: ' con {who}',
      moodNone: 'Non so ancora come sta {name} oggi.', mood_good: '{name} ha detto che oggi è una buona giornata.', mood_okay: '{name} ha detto che oggi va così così.', mood_low: '{name} ha detto che oggi non è una buona giornata. Forse è il caso di chiamare.',
      calling: 'Chiamo {who}.', messaging: 'Apro un messaggio a {who}.', whoCall: 'Non ho trovato {who} nella cerchia.',
      opening: 'Apro {what}.', camera: 'Apro la fotocamera.', home: 'Torno a {name}.', now: 'Ecco tutto ora.' }
  };
  function IT() { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } }
  function t(k, p) { var s = (IT() ? S.it : S.en)[k] || S.en[k] || k; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
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
    return s + t('ago', { t: agoT(w.location.at) });
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
  function answer(q) {
    var s = String(q || '').toLowerCase().trim();
    if (!s) return t('notHeard');
    var m;
    if ((m = s.match(/^(?:call|phone|ring|chiama|telefona a)\s+(.+)$/))) return call(m[1], 'phone');
    if ((m = s.match(/^(?:video(?: call)?|videochiama)\s+(.+)$/))) return call(m[1], 'video');
    if ((m = s.match(/^(?:message|text|write to|scrivi a|messaggio a)\s+(.+)$/))) return call(m[1], 'sms');
    if (/\b(take|took|taken|pill|pills|medicine|medicines|medication|dose|presa|preso|prese|medicin|pastigl)\b/.test(s) && /\b(did|has|have|ha|hanno|took|taken|preso|prese|today|oggi)\b/.test(s)) return meds();
    if (/\b(who is with|with (him|her|dad|mom)|chi [eè] con|is anyone with)\b/.test(s)) return withWho();
    if (/\b(where|dove)\b/.test(s)) return where();
    if (/\b(next|coming up|appointment|prossim|appuntament)\b/.test(s)) return next();
    if (/\b(how is|how's|feel|feeling|mood|come sta|umore)\b/.test(s)) return mood();
    if (/\b(camera|photo|picture|what is this|what's this|fotocamera|foto|cos[' ]?[eè] questo)\b/.test(s)) { setTimeout(function () { try { CovaraCamera.open(); } catch (e) {} }, 600); return t('camera'); }
    if (/\b(everything|all of it|tutto)\b/.test(s)) { setTimeout(function () { try { CovaraNav.now(); } catch (e) {} }, 400); return t('now'); }
    if (/\b(home|back|casa|indietro)\b/.test(s) && s.split(/\s+/).length <= 3) { try { CovaraNav.home(); } catch (e) {} return t('home', { name: first() }); }
    for (var i = 0; i < SECT.length; i++) if (SECT[i][0].test(s)) { try { CovaraView.open(SECT[i][1]); } catch (e) {} return t('opening', { what: q }); }
    return t('help', { name: first() });
  }

  /* ── listening and speaking ── */
  var rec = null, busy = false, _orb = null, _cap = null, bubble = null;
  function say(text) {
    if (!bubble) { bubble = document.createElement('div'); bubble.id = 'cvTalkBubble'; bubble.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:190px;z-index:7300;max-width:min(560px,calc(100vw - 32px));padding:12px 16px;border-radius:16px;border:1px solid rgba(197,165,90,.6);background:rgba(10,14,24,.94);color:#f0eef5;font:500 15px/1.45 var(--nous-font,"Hanken Grotesk",sans-serif);box-shadow:0 14px 34px rgba(0,0,0,.6)'; document.body.appendChild(bubble); bubble.addEventListener('click', function () { bubble.hidden = true; }); }
    bubble.textContent = text; bubble.hidden = false;
    clearTimeout(bubble._t); bubble._t = setTimeout(function () { bubble.hidden = true; }, Math.max(6000, text.length * 90));
    try { if (window.speechSynthesis) { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(text); u.lang = IT() ? 'it-IT' : 'en-US'; u.rate = window.CovaraCalm ? 0.85 : 0.98; speechSynthesis.speak(u); } } catch (e) {}
  }
  function typed() {
    if (!bubble) say('');
    bubble.innerHTML = ''; var p = document.createElement('div'); p.textContent = t('noMic'); bubble.appendChild(p);
    var f = document.createElement('form'); f.style.cssText = 'display:flex;gap:8px;margin-top:8px';
    var i = document.createElement('input'); i.type = 'text'; i.style.cssText = 'flex:1;min-height:40px;border-radius:12px;border:1px solid rgba(255,255,255,.2);background:#0a0e16;color:#fff;padding:0 12px;font:500 15px var(--nous-font,sans-serif)';
    var b = document.createElement('button'); b.type = 'submit'; b.textContent = t('ask'); b.style.cssText = 'min-height:40px;padding:0 16px;border-radius:12px;border:0;background:#38bdf8;color:#04121a;font-weight:800';
    f.appendChild(i); f.appendChild(b); bubble.appendChild(f); bubble.hidden = false; clearTimeout(bubble._t);
    f.onsubmit = function (e) { e.preventDefault(); say(answer(i.value)); };
    setTimeout(function () { i.focus(); }, 50);
  }
  function stop() { busy = false; if (_orb) _orb.classList.remove('listening'); try { if (rec) rec.abort(); } catch (e) {} }
  function toggle(orb, cap) {
    _orb = orb; _cap = cap;
    if (busy) { stop(); return; }
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { typed(); return; }
    rec = new SR(); rec.lang = IT() ? 'it-IT' : 'en-US'; rec.interimResults = false; rec.maxAlternatives = 1;
    busy = true; orb.classList.add('listening'); say(t('listening'));
    var heard = false;
    rec.onresult = function (e) { heard = true; var q = e.results[0][0].transcript; stop(); say('“' + q + '”: ' + answer(q)); };
    rec.onerror = function (e) { stop(); if (e && (e.error === 'not-allowed' || e.error === 'service-not-allowed')) typed(); else say(t('notHeard')); };
    rec.onend = function () { if (busy && !heard) { stop(); say(t('notHeard')); } };
    try { rec.start(); } catch (e) { stop(); typed(); }
  }
  window.CovaraTalk = { toggle: toggle, answer: answer, say: say };
})();
