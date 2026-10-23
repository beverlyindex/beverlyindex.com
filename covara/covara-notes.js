/* Remiel: Covara, the Covara Button ("C"): say something, Covara keeps it.
   Tap the C and speak ("Rupert called me to discuss the bank's proposal"). Covara reads back what it heard; on Yes the
   note is filed in the person's private journal, sorted by what needs doing (the action), what it is about (the topic)
   and who it concerns (the person). When there is something to do, Covara offers a time from the free part of the
   person's real day ("How's 3 PM, after your lunch with Sally?"); nothing goes on the day without a yes. A planned
   note becomes a task on the day, so it is reminded like any other ("Done" or "Later"). A note about money gets a
   gentle line to talk it over with the team. Saying the same thing twice joins the two notes. The journal is private:
   the team sees a note only when its owner shares it.
   Also here: spoken reminders (the Now cards and new messages, said aloud while the voice guide is on, never at
   night) and Covara's fixed sentences made ahead of time in Covara's own voice.
   Beverly Index LLC */
(function () {
  'use strict';
  var IT = function () { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var S = {
    en: {
      cap: 'Covara', hint: 'Say it, Covara keeps it', listening: 'Listening. Say your note.',
      heard: 'I heard', heardQ: 'I heard: {q}. Is that right?', yes: 'Yes, keep it', again: 'Say it again', cancel: 'Cancel', edit: 'You can fix the words before keeping it.',
      filing: 'Keeping it…', filed: 'Kept in your journal.', failed: 'I could not keep it. Check the internet and try again.', offline: 'Sign in to keep notes.',
      joined: 'You noted this on {day}. I joined the two notes.',
      money: 'Before you agree to anything about money, talk it over with your team.',
      whenQ: 'When would you like to {what}? How about {time}{after}?', whenQ2: 'When would you like to {what}?', after: ', after {item}',
      yesAt: 'Yes, {time}', notNow: 'Not now', planned: 'Done. It is on your day at {time}.', notPlanned: 'Kept in your journal. I will ask again later.',
      still: 'You still have this to do: {what}. Shall we find a time?', findTime: 'Find a time', later: 'Later',
      journal: 'Journal', jTitle: 'Your journal', jSub: 'Private. Your team sees only what you share.',
      toDo: 'To do', planned2: 'Planned', notes: 'Notes', done: 'Done', none: 'Nothing here yet. Tap the C and say something.',
      markDone: 'Done', plan: 'Find a time', share: 'Private', shared: 'Shared with your team', del: 'Remove', sure: 'Remove this note?', all: 'All', about: 'About {name}',
      a_call: 'call {person}', a_visit: 'visit {person}', a_message: 'write to {person}', a_buy: 'buy it', a_pay: 'pay it', a_book: 'book it', a_remember: 'do it', a_do: 'do it', about2: ' about {topic}',
      k_action: 'To do', k_appointment: 'Appointment', k_info: 'Note', k_feeling: 'Feeling', k_medicine: 'Medicine', k_meal: 'Meal',
      newMsg: '{name} sent you a message.', close: 'Close', at: 'at {time}', today: 'today', tomorrow: 'tomorrow', noTeam: 'Your team'
    },
    it: {
      cap: 'Covara', hint: 'Dillo, Covara lo tiene', listening: 'Ti ascolto. Di’ la tua nota.',
      heard: 'Ho sentito', heardQ: 'Ho sentito: {q}. È giusto?', yes: 'Sì, tienila', again: 'Ripeti', cancel: 'Annulla', edit: 'Puoi correggere le parole prima di tenerla.',
      filing: 'La sto salvando…', filed: 'Tenuta nel tuo diario.', failed: 'Non sono riuscito a tenerla. Controlla internet e riprova.', offline: 'Accedi per tenere le note.',
      joined: 'L’avevi già annotato {day}. Ho unito le due note.',
      money: 'Prima di accettare qualcosa che riguarda soldi, parlane con il tuo team.',
      whenQ: 'Quando vuoi {what}? Che ne dici delle {time}{after}?', whenQ2: 'Quando vuoi {what}?', after: ', dopo {item}',
      yesAt: 'Sì, alle {time}', notNow: 'Non ora', planned: 'Fatto. È nella tua giornata alle {time}.', notPlanned: 'Tenuta nel tuo diario. Te lo richiedo più tardi.',
      still: 'Hai ancora da fare: {what}. Troviamo un momento?', findTime: 'Trova un momento', later: 'Più tardi',
      journal: 'Diario', jTitle: 'Il tuo diario', jSub: 'Privato. Il tuo team vede solo quello che condividi.',
      toDo: 'Da fare', planned2: 'In programma', notes: 'Note', done: 'Fatto', none: 'Ancora niente. Tocca la C e di’ qualcosa.',
      markDone: 'Fatto', plan: 'Trova un momento', share: 'Privata', shared: 'Condivisa con il team', del: 'Togli', sure: 'Togliere questa nota?', all: 'Tutto', about: 'Su {name}',
      a_call: 'chiamare {person}', a_visit: 'andare da {person}', a_message: 'scrivere a {person}', a_buy: 'comprarlo', a_pay: 'pagarlo', a_book: 'prenotarlo', a_remember: 'farlo', a_do: 'farlo', about2: ' per {topic}',
      k_action: 'Da fare', k_appointment: 'Appuntamento', k_info: 'Nota', k_feeling: 'Come mi sento', k_medicine: 'Medicina', k_meal: 'Pasto',
      newMsg: '{name} ti ha mandato un messaggio.', close: 'Chiudi', at: 'alle {time}', today: 'oggi', tomorrow: 'domani', noTeam: 'Il tuo team'
    }
  };
  function t(k, p) { var s = (IT() ? S.it : S.en)[k]; if (s == null) s = S.en[k] == null ? k : S.en[k]; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x] == null ? '' : p[x]); }); return s; }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function authed() { try { return SyncEngine.isAuthenticated() && !SyncEngine.isLocalOnly(); } catch (e) { return false; } }
  async function api(path, o) { var r = await SyncEngine.apiFetch(path, Object.assign({ method: 'GET' }, o || {})); return { ok: r.ok, status: r.status, data: await r.json().catch(function () { return {}; }) }; }
  function hm(ms) { try { return new Date(ms).toLocaleTimeString(IT() ? 'it' : 'en-US', { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }
  function dayWord(ms) { var d = new Date(ms), n = new Date(); if (d.toDateString() === n.toDateString()) return t('today'); var tm = new Date(n.getTime() + 864e5); if (d.toDateString() === tm.toDateString()) return t('tomorrow'); try { return d.toLocaleDateString(IT() ? 'it' : 'en-US', { weekday: 'long' }); } catch (e) { return ''; } }
  function speak(s) { try { if (window.CovaraTalk && CovaraTalk.speak) CovaraTalk.speak(s); } catch (e) {} }
  function guideOn() { try { if (window.CovaraGuide && typeof CovaraGuide.on === 'function') return !!CovaraGuide.on(); } catch (e) {} return (localStorage.getItem('rc:role') || '') !== 'away'; }
  function quiet() { var h = new Date().getHours(); return h >= 21 || h < 8; }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  /* ── the look: NOUS glass, gold and cyan ── */
  var css =
    '#cvnDock .cvn-orb.cvc{font:800 34px/1 var(--nous-font,"Hanken Grotesk",sans-serif);letter-spacing:0;color:#04121a;text-shadow:0 1px 0 rgba(255,255,255,.45)}' +
    '#cvnDock .cvn-orb.cvc.live{color:rgba(233,248,255,.9)}' +
    '#cvcDim{position:fixed;inset:0;z-index:99990;background:rgba(4,12,34,.46);-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);opacity:0;transition:opacity .3s;pointer-events:none}#cvcDim.open{opacity:1;pointer-events:auto}' +
    '#cvcSheet{position:fixed;left:0;right:0;bottom:0;z-index:99991;margin:0 auto;max-width:520px;max-height:92vh;max-height:92dvh;overflow-y:auto;overflow-x:hidden;box-sizing:border-box;padding:12px 16px calc(18px + env(safe-area-inset-bottom,0px));border-radius:26px 26px 0 0;color:#eef3fb;font-family:var(--nous-font,"Hanken Grotesk",system-ui,sans-serif);' +
      'background:linear-gradient(160deg,rgba(70,130,235,.30) 0%,rgba(22,48,110,.62) 50%,rgba(10,22,60,.86) 100%);-webkit-backdrop-filter:blur(22px) saturate(160%);backdrop-filter:blur(22px) saturate(160%);border:1px solid rgba(150,200,255,.45);border-bottom:none;box-shadow:0 0 0 1px rgba(56,189,248,.12),0 -6px 34px rgba(70,150,255,.34),inset 0 1px 0 rgba(255,255,255,.18);transform:translateY(105%);transition:transform .34s cubic-bezier(.2,.8,.2,1);text-shadow:0 1px 2px rgba(2,8,24,.55)}' +
    '#cvcSheet.open{transform:none}#cvcSheet .c-grab{width:44px;height:5px;border-radius:3px;background:rgba(190,215,255,.45);margin:0 auto 6px}' +
    '#cvcSheet .c-x{position:absolute;top:10px;right:12px;width:48px;height:48px;border-radius:50%;border:1px solid rgba(150,200,255,.45);background:rgba(20,44,100,.35);color:#dce8ff;font:600 26px/1 system-ui,sans-serif;cursor:pointer}' +
    '#cvcSheet .c-hd{display:flex;align-items:center;gap:12px;margin:4px 60px 10px 2px}#cvcSheet .c-c{flex:0 0 auto;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:800 24px var(--nous-font,"Hanken Grotesk",sans-serif);color:#04121a;background:radial-gradient(circle at 35% 30%,#fff 0,#9fe7ff 18%,#38bdf8 46%,#0b3a66 100%);box-shadow:0 0 18px rgba(56,189,248,.55)}' +
    '#cvcSheet h2{margin:0;font-size:24px;font-weight:800;line-height:1.15}#cvcSheet .c-sub{margin:2px 0 0;font:600 12.5px/1.35 "JetBrains Mono","SF Mono",monospace;color:#9fd8ff}' +
    '#cvcSheet h3{margin:16px 2px 8px;font:800 12px "JetBrains Mono","SF Mono",monospace;letter-spacing:.16em;color:#ffd24d;text-transform:uppercase}' +
    '#cvcSheet textarea{width:100%;box-sizing:border-box;min-height:96px;border-radius:18px;border:1px solid rgba(150,200,255,.45);background:rgba(6,16,44,.55);color:#fff;font:500 19px/1.4 var(--nous-font,"Hanken Grotesk",sans-serif);padding:12px 14px;resize:vertical}' +
    '#cvcSheet .c-say{font-size:20px;line-height:1.4;font-weight:600;margin:6px 2px 4px}#cvcSheet .c-small{font-size:14px;color:#b9cdee;margin:6px 2px}' +
    '#cvcSheet .c-money{margin:10px 0 2px;padding:12px 14px;border-radius:16px;border:1px solid rgba(255,210,77,.75);background:rgba(255,210,77,.12);color:#ffe9a8;font-size:16px;line-height:1.4;box-shadow:0 0 16px rgba(255,210,77,.18)}' +
    '#cvcSheet .c-acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}' +
    '#cvcSheet button.c-b{min-height:48px;padding:0 16px;border-radius:24px;border:1px solid rgba(150,200,255,.5);background:linear-gradient(155deg,rgba(80,140,240,.28),rgba(18,40,96,.5));color:#eef5ff;font:700 16px var(--nous-font,"Hanken Grotesk",sans-serif);cursor:pointer;box-shadow:0 0 12px rgba(70,150,255,.2),inset 0 1px 0 rgba(255,255,255,.14)}' +
    '#cvcSheet button.c-b.c-pri{border:0;background:radial-gradient(circle at 35% 30%,#ffe58a,#ffc531 60%,#d99a00);color:#2a1600;text-shadow:none;box-shadow:0 0 18px rgba(255,200,60,.45)}' +
    '#cvcSheet button.c-b.c-sm{min-height:38px;padding:0 12px;font-size:14px}#cvcSheet button.c-b[aria-pressed="true"]{border-color:#38bdf8;background:rgba(56,189,248,.24)}' +
    '#cvcSheet .c-row{padding:12px;border-radius:18px;margin-bottom:8px;border:1px solid rgba(150,200,255,.32);background:linear-gradient(155deg,rgba(80,140,240,.18),rgba(18,40,96,.42));box-shadow:inset 0 1px 0 rgba(255,255,255,.1)}' +
    '#cvcSheet .c-row.c-m{border-color:rgba(255,210,77,.6)}#cvcSheet .c-row.c-d{opacity:.6}' +
    '#cvcSheet .c-tt{font-size:17px;font-weight:700;line-height:1.3;overflow-wrap:anywhere}#cvcSheet .c-meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}' +
    '#cvcSheet .c-chip{padding:3px 9px;border-radius:11px;font:800 10.5px "JetBrains Mono","SF Mono",monospace;letter-spacing:.06em;background:rgba(56,189,248,.18);color:#bfe6ff}#cvcSheet .c-chip.p{background:rgba(255,210,77,.2);color:#ffe08a}#cvcSheet .c-chip.s{background:rgba(34,211,166,.2);color:#a7f3d0}' +
    '#cvcSheet .c-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:4px 0 2px}#cvcSheet .c-q{margin:2px 2px 0;font-size:13px;color:#9fb4e2;font-style:italic;overflow-wrap:anywhere}' +
    'body.cvc-open #cvnDock,body.cvc-open #cvTalkWave,body.cvc-open #cvTalkDream,body.cvc-open #cvTalkBubble{visibility:hidden}' +
    /* the voice circle, its waves and the Now card never show through a card or sheet */
    'body.cv-cardopen #cvnDock,body.cv-cardopen #cvTalkWave,body.cv-cardopen #cvTalkDream,body.cv-cardopen #cvNow{visibility:hidden !important}' +
    /* the person card never slides sideways under a finger */
    '#blufOverlay{overflow-x:hidden !important;overscroll-behavior-x:none}#blufOverlay .bluf-card{max-width:min(400px,calc(100vw - 12px));box-sizing:border-box}' +
    '#cvnDock .cvn-orb.cvc{display:flex !important;align-items:center;justify-content:center;padding:0 !important;font-size:38px !important;line-height:1 !important}' +
    'body.cv-simple #cvnDock .cvn-orb.cvc,body.cvs-on #cvnDock .cvn-orb.cvc{font-size:46px !important}';
  /* which cards count as open: the person card, Covara's sheets and overlays */
  var OPEN = '#blufOverlay.open,body.cvp-open,.cv-ov.open,.cvn-sheet:not([hidden]),#cvplSheet.open,.contact-modal-overlay.open,.roster-modal-overlay.open';
  setInterval(function () { var on = !!document.querySelector(OPEN.split(',').filter(function (x) { return x.indexOf('body') !== 0; }).join(',')) || document.body.classList.contains('cvp-open'); document.body.classList.toggle('cv-cardopen', on); }, 400);
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var dim, sheet;
  function ensure() {
    if (sheet) return;
    dim = document.createElement('div'); dim.id = 'cvcDim'; dim.onclick = close;
    sheet = document.createElement('div'); sheet.id = 'cvcSheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true');
    document.body.appendChild(dim); document.body.appendChild(sheet);
  }
  var _gen = 0;
  function closeLater(ms) { var g = _gen; setTimeout(function () { if (g === _gen) close(); }, ms); }
  function open(html) {
    ensure(); _gen++;
    sheet.innerHTML = '<div class="c-grab"></div><button type="button" class="c-x" aria-label="' + esc(t('close')) + '">×</button>' + html;
    sheet.querySelector('.c-x').onclick = close;
    dim.classList.add('open'); sheet.classList.add('open'); document.body.classList.add('cvc-open'); sheet.scrollTop = 0;
  }
  function close() { if (!sheet) return; dim.classList.remove('open'); sheet.classList.remove('open'); document.body.classList.remove('cvc-open'); }
  function head(title, sub) { return '<div class="c-hd"><div class="c-c">C</div><div><h2>' + esc(title) + '</h2>' + (sub ? '<p class="c-sub">' + esc(sub) + '</p>' : '') + '</div></div>'; }
  function bind(map) { Object.keys(map).forEach(function (k) { var b = sheet.querySelector('[data-a="' + k + '"]'); if (b) b.onclick = map[k]; }); }

  /* ── 1. listening ── */
  var _orb = null, _cap = null;
  function toggle(orb, cap) {
    _orb = orb || document.getElementById('cvCButton'); _cap = cap;
    if (!window.CovaraTalk || typeof CovaraTalk.toggle !== 'function') return;
    close();
    CovaraTalk.toggle(_orb, _cap, heard);
  }
  /* ── 2. read back ── */
  function heard(q) {
    q = String(q || '').trim(); if (!q) return;
    try { var b = document.getElementById('cvTalkBubble'); if (b) b.hidden = true; } catch (e) {}
    open(head(t('heard'), t('edit')) + '<textarea id="cvcText" aria-label="' + esc(t('heard')) + '">' + esc(q) + '</textarea>' +
      '<div class="c-acts"><button type="button" class="c-b c-pri" data-a="yes">' + esc(t('yes')) + '</button><button type="button" class="c-b" data-a="again">' + esc(t('again')) + '</button><button type="button" class="c-b" data-a="no">' + esc(t('cancel')) + '</button></div>');
    bind({ yes: function () { file(document.getElementById('cvcText').value); }, again: function () { close(); setTimeout(function () { toggle(_orb, _cap); }, 250); }, no: close });
    speak(t('heardQ', { q: q }));
  }
  /* ── 3. file it ── */
  function tzOffset() { var m = -new Date().getTimezoneOffset(), s = m >= 0 ? '+' : '-'; m = Math.abs(m); return s + String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
  async function file(text) {
    text = String(text || '').trim(); if (!text) return close();
    if (!authed()) { open(head(t('journal')) + '<p class="c-say">' + esc(t('offline')) + '</p>'); return; }
    open(head(t('filing')));
    var d = new Date(), r;
    try {
      r = await api('/care-notes', { method: 'POST', body: JSON.stringify({ text: text, lang: IT() ? 'it' : 'en', today: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'),
        weekday: d.toLocaleDateString('en-US', { weekday: 'long' }), time: String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'), offset: tzOffset() }) });
    } catch (e) { r = { ok: false }; }
    if (!r.ok) { open(head(t('journal')) + '<p class="c-say">' + esc(t('failed')) + '</p>'); speak(t('failed')); return; }
    var n = r.data.note, same = r.data.same_as, lines = [];
    var said = same ? t('joined', { day: dayWord(same.created_at) }) : t('filed');
    lines.push(said);
    var money = n.money ? '<div class="c-money">' + esc(t('money')) + '</div>' : '';
    if (n.money) lines.push(t('money'));
    var target = same || n;
    if ((target.kind === 'action' || target.kind === 'appointment') && target.status !== 'planned') { await offerTime(target, '<p class="c-say">' + esc(said) + '</p>' + money, lines); return; }
    open(head(t('journal'), t('jSub')) + '<p class="c-say">' + esc(said) + '</p>' + money + '<div class="c-acts"><button type="button" class="c-b" data-a="j">' + esc(t('journal')) + '</button><button type="button" class="c-b c-pri" data-a="ok">' + esc(t('close')) + '</button></div>');
    bind({ j: journal, ok: close });
    speak(lines.join(' '));
  }

  /* ── 4. a time from the free part of the real day ── */
  function whatOf(n) {
    var p = n.person || '', a = n.action;
    var s = a && S.en['a_' + a] ? t('a_' + a, { person: p || t('noTeam') }) : (n.summary || '');
    if (a && n.topic && a !== 'buy' && a !== 'pay') s += t('about2', { topic: n.topic });
    if (!a) s = n.summary || n.text;
    return s;
  }
  async function busy() {
    var out = [];
    try {
      var r = await api('/care/items');
      var d0 = new Date(); d0.setHours(0, 0, 0, 0);
      (r.data.items || []).forEach(function (it) {
        var len = it.kind === 'meal' ? 45 * 60000 : it.kind === 'work' && it.meta && it.meta.end ? 0 : 30 * 60000;
        var title = it.title || '';
        if (it.at) { var e = it.kind === 'work' && it.meta && it.meta.end ? it.meta.end : it.at + len; out.push({ s: it.at, e: e, title: title }); }
        (it.times || []).forEach(function (hh) {
          var m = /^(\d{1,2}):(\d{2})$/.exec(hh); if (!m) return;
          for (var k = 0; k < 2; k++) { var s = d0.getTime() + k * 864e5 + (+m[1]) * 3600e3 + (+m[2]) * 60000; out.push({ s: s, e: s + len, title: title }); }
        });
      });
    } catch (e) {}
    return out.sort(function (a, b) { return a.s - b.s; });
  }
  async function slots(n) {
    var b = await busy(), out = [], now = Date.now();
    if (n.when && n.when > now) out.push({ at: n.when, after: null });
    /* every half hour from 45 minutes from now, over the next two days, between 9 in the morning and 8 at night */
    var c0 = new Date(now + 45 * 60000); c0.setMinutes(c0.getMinutes() <= 30 ? 30 : 60, 0, 0);
    for (var at = c0.getTime(); at < now + 48 * 3600e3 && out.length < 3; at += 30 * 60000) {
      var h = new Date(at).getHours(); if (h < 9 || h >= 20) continue;
      if (b.some(function (x) { return at < x.e + 15 * 60000 && at + 30 * 60000 > x.s - 10 * 60000; })) continue;
      if (out.some(function (x) { return Math.abs(x.at - at) < 90 * 60000; })) continue;
      var prev = b.filter(function (x) { return x.e <= at && at - x.e < 2 * 3600e3; }).pop();
      out.push({ at: at, after: prev ? prev.title : null });
    }
    return out;
  }
  function timeWord(at) { var d = dayWord(at); return (d === t('today') ? '' : d + ' ') + hm(at); }
  async function offerTime(n, before, lines) {
    var ss = await slots(n), what = whatOf(n);
    var q = ss.length ? t('whenQ', { what: what, time: timeWord(ss[0].at), after: ss[0].after ? t('after', { item: ss[0].after }) : '' }) : t('whenQ2', { what: what });
    var btns = ss.map(function (s, i) { return '<button type="button" class="c-b' + (i ? '' : ' c-pri') + '" data-at="' + s.at + '">' + esc(i ? timeWord(s.at) : t('yesAt', { time: timeWord(s.at) })) + '</button>'; }).join('');
    open(head(t('journal'), t('jSub')) + (before || '') + '<p class="c-say">' + esc(q) + '</p><div class="c-acts">' + btns + '<button type="button" class="c-b" data-a="not">' + esc(t('notNow')) + '</button></div>');
    sheet.querySelectorAll('[data-at]').forEach(function (b) { b.onclick = function () { plan(n, Number(b.getAttribute('data-at'))); }; });
    bind({ not: function () { remindLater(n); var s2 = t('notPlanned'); open(head(t('journal')) + '<p class="c-say">' + esc(s2) + '</p>'); speak(s2); closeLater(2600); } });
    speak((lines || []).concat([q]).join(' '));
  }
  async function plan(n, at) {
    var title = whatOf(n); title = title.charAt(0).toUpperCase() + title.slice(1);
    var r = await api('/care/items', { method: 'POST', body: JSON.stringify({ kind: 'task', title: title.slice(0, 120), at: at, detail: (n.text || '').slice(0, 400) }) }).catch(function () { return { ok: false }; });
    if (!r.ok) { open(head(t('journal')) + '<p class="c-say">' + esc(t('failed')) + '</p>'); return; }
    await api('/care-notes/' + encodeURIComponent(n.id), { method: 'PATCH', body: JSON.stringify({ status: 'planned', plan_at: at, plan_item: r.data.item && r.data.item.id }) }).catch(function () {});
    var later = store('rc:cvcLater') || {}; delete later[n.id]; store('rc:cvcLater', later);
    var s = t('planned', { time: timeWord(at) });
    open(head(t('journal')) + '<p class="c-say">' + esc(s) + '</p>'); speak(s);
    try { if (window.CovaraPlan && CovaraPlan.load) CovaraPlan.load(); } catch (e) {}
    closeLater(2600);
  }
  /* "Not now": asked again once, about three hours later */
  function remindLater(n) { var l = store('rc:cvcLater') || {}; l[n.id] = { at: Date.now() + 3 * 3600e3, what: whatOf(n) }; store('rc:cvcLater', l); }
  async function checkLater() {
    if (!authed() || document.body.classList.contains('cvc-open') || quiet()) return;
    var l = store('rc:cvcLater') || {}, now = Date.now();
    var id = Object.keys(l).filter(function (k) { return l[k].at <= now; })[0]; if (!id) return;
    var item = l[id]; delete l[id]; store('rc:cvcLater', l);
    var r = await api('/care-notes').catch(function () { return { ok: false }; }); if (!r.ok) return;
    var n = (r.data.notes || []).filter(function (x) { return x.id === id && x.status === 'open'; })[0]; if (!n) return;
    var s = t('still', { what: item.what });
    open(head(t('journal')) + '<p class="c-say">' + esc(s) + '</p><div class="c-acts"><button type="button" class="c-b c-pri" data-a="f">' + esc(t('findTime')) + '</button><button type="button" class="c-b" data-a="l">' + esc(t('later')) + '</button></div>');
    bind({ f: function () { offerTime(n, '', []); }, l: close });
    if (guideOn()) speak(s);
  }

  /* ── 5. the journal ── */
  var _filter = '';
  async function journal(filterName) {
    if (typeof filterName === 'string') _filter = filterName; else if (filterName && filterName.type) _filter = '';
    if (!authed()) { open(head(t('jTitle')) + '<p class="c-say">' + esc(t('offline')) + '</p>'); return; }
    open(head(t('jTitle'), t('jSub')) + '<p class="c-small">…</p>');
    var r = await api('/care-notes').catch(function () { return { ok: false }; });
    var all = (r.ok ? r.data.notes : []).filter(function (n) { return n.status !== 'joined' && n.status !== 'deleted' && n.status !== 'dropped'; });
    var people = []; all.forEach(function (n) { if (n.person && people.indexOf(n.person) < 0) people.push(n.person); });
    var list = _filter ? all.filter(function (n) { return n.person === _filter; }) : all;
    function row(n) {
      var chips = '<span class="c-chip">' + esc(t('k_' + n.kind)) + '</span>' + (n.person ? '<span class="c-chip">' + esc(n.person) + '</span>' : '') + (n.topic ? '<span class="c-chip">' + esc(n.topic) + '</span>' : '') +
        (n.plan_at ? '<span class="c-chip p">' + esc(timeWord(n.plan_at)) + '</span>' : '') + (n.shared ? '<span class="c-chip s">' + esc(t('shared')) + '</span>' : '');
      var acts = n.status === 'done' ? '' : '<div class="c-acts">' + ((n.kind === 'action' || n.kind === 'appointment') && n.status === 'open' ? '<button type="button" class="c-b c-sm" data-n="plan">' + esc(t('plan')) + '</button>' : '') +
        ((n.kind === 'action' || n.kind === 'appointment') ? '<button type="button" class="c-b c-sm" data-n="done">' + esc(t('markDone')) + '</button>' : '') +
        '<button type="button" class="c-b c-sm" data-n="share" aria-pressed="' + (n.shared ? 'true' : 'false') + '">' + esc(n.shared ? t('shared') : t('share')) + '</button>' +
        '<button type="button" class="c-b c-sm" data-n="del">' + esc(t('del')) + '</button></div>';
      return '<div class="c-row' + (n.money ? ' c-m' : '') + (n.status === 'done' ? ' c-d' : '') + '" data-id="' + esc(n.id) + '"><div class="c-tt">' + esc(n.summary || n.text) + '</div>' +
        (n.summary && n.summary !== n.text ? '<p class="c-q">“' + esc(n.text) + '”</p>' : '') + '<div class="c-meta">' + chips + '</div>' + acts + '</div>';
    }
    /* actions first (to do, then planned), then by topic, then by person */
    function byTopic(a, b) { return String(a.topic || '').localeCompare(String(b.topic || '')) || String(a.person || '').localeCompare(String(b.person || '')) || b.created_at - a.created_at; }
    var act = function (n) { return n.kind === 'action' || n.kind === 'appointment'; };
    var todo = list.filter(function (n) { return act(n) && n.status === 'open'; }).sort(byTopic);
    var pl = list.filter(function (n) { return act(n) && n.status === 'planned'; }).sort(function (a, b) { return (a.plan_at || 0) - (b.plan_at || 0); });
    var other = list.filter(function (n) { return !act(n) && n.status !== 'done'; }).sort(byTopic);
    var done = list.filter(function (n) { return n.status === 'done'; }).slice(0, 20);
    var tabs = people.length ? '<div class="c-tabs"><button type="button" class="c-b c-sm" data-p="" aria-pressed="' + (!_filter) + '">' + esc(t('all')) + '</button>' +
      people.map(function (p) { return '<button type="button" class="c-b c-sm" data-p="' + esc(p) + '" aria-pressed="' + (_filter === p) + '">' + esc(t('about', { name: p })) + '</button>'; }).join('') + '</div>' : '';
    var body = (todo.length ? '<h3>' + esc(t('toDo')) + '</h3>' + todo.map(row).join('') : '') + (pl.length ? '<h3>' + esc(t('planned2')) + '</h3>' + pl.map(row).join('') : '') +
      (other.length ? '<h3>' + esc(t('notes')) + '</h3>' + other.map(row).join('') : '') + (done.length ? '<h3>' + esc(t('done')) + '</h3>' + done.map(row).join('') : '');
    open(head(t('jTitle'), t('jSub')) + tabs + (body || '<p class="c-say">' + esc(t('none')) + '</p>'));
    sheet.querySelectorAll('[data-p]').forEach(function (b) { b.onclick = function () { journal(b.getAttribute('data-p')); }; });
    sheet.querySelectorAll('.c-row').forEach(function (rw) {
      var n = all.filter(function (x) { return x.id === rw.getAttribute('data-id'); })[0]; if (!n) return;
      rw.querySelectorAll('[data-n]').forEach(function (b) {
        b.onclick = async function () {
          var k = b.getAttribute('data-n');
          if (k === 'plan') return offerTime(n, '', []);
          if (k === 'del' && !confirmRemove(b)) return;
          var body2 = k === 'done' ? { status: 'done' } : k === 'share' ? { shared: !n.shared } : { status: 'deleted' };
          await api('/care-notes/' + encodeURIComponent(n.id), { method: 'PATCH', body: JSON.stringify(body2) }).catch(function () {});
          journal();
        };
      });
    });
  }
  /* removing asks once, on the button itself (no browser dialog) */
  function confirmRemove(b) { if (b.getAttribute('data-sure')) return true; b.setAttribute('data-sure', '1'); b.textContent = t('sure'); setTimeout(function () { b.removeAttribute('data-sure'); b.textContent = t('del'); }, 4000); return false; }

  /* ── 6. the C on the dock ── */
  function dress() {
    var b = document.querySelector('#cvnDock [data-k=talk]'); if (!b) return false;
    if (!b.id) b.id = 'cvCButton';
    if (!b.classList.contains('cvc')) b.classList.add('cvc');
    if (b.textContent !== 'C') b.textContent = 'C';
    b.setAttribute('aria-label', t('cap') + ': ' + t('hint'));
    var sm = document.querySelector('#cvnDock .cvn-talk small'); if (sm && sm.textContent !== t('hint')) sm.textContent = t('hint');
    /* press and hold the C: the journal */
    if (!b._cvc) {
      b._cvc = 1; var tm = 0, held = false;
      b.addEventListener('pointerdown', function () { held = false; clearTimeout(tm); tm = setTimeout(function () { held = true; journal(''); }, 650); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { b.addEventListener(ev, function () { clearTimeout(tm); }); });
      b.addEventListener('click', function (e) { if (held) { e.stopImmediatePropagation(); e.preventDefault(); held = false; } }, true);
    }
    return true;
  }
  /* the dock is rebuilt when the language changes; keep the C on it */
  setInterval(dress, 1500); setTimeout(dress, 300);

  /* ── 7. spoken reminders: what appears on the Now cards, and new messages, said aloud while the guide is on ── */
  var _said = store('rc:cvcSaid') || {};
  function sayOnce(key, s) {
    if (!s || !guideOn() || quiet()) return;
    var day = new Date().toDateString(); if (_said[key] === day) return;
    _said[key] = day; store('rc:cvcSaid', _said);
    try { if (window.CovaraTalk && CovaraTalk.listening && CovaraTalk.listening()) return; } catch (e) {}
    speak(s);
  }
  function watchNow() {
    var nowEl = document.getElementById('cvNow'); if (!nowEl || nowEl._cvc) return; nowEl._cvc = 1;
    var mo = new MutationObserver(function () {
      if (nowEl.hidden) return;
      var h = nowEl.querySelector('h4'), p = nowEl.querySelector('p');
      var title = h ? h.textContent.replace(/\s+/g, ' ').trim() : ''; if (!title) return;
      var body = p ? p.textContent.replace(/\s+/g, ' ').trim() : '';
      sayOnce('now:' + title, (title + (body ? '. ' + body : '')).slice(0, 220));
    });
    mo.observe(nowEl, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  }
  setInterval(watchNow, 3000);
  window.addEventListener('covara-message', function (e) { var d = e.detail || {}; if (d.name) sayOnce('msg:' + (d.contactId || '') + ':' + (d.ts || ''), t('newMsg', { name: d.name })); });
  setInterval(checkLater, 60000); setTimeout(checkLater, 8000);

  /* ── 8. Covara's fixed sentences made ahead of time in Covara's own voice, a few at a time, once a day ── */
  function fixed(lang) {
    var L = S[lang], out = [L.filed, L.failed, L.money, L.notPlanned, L.offline];
    try { if (window.CovaraGuide && CovaraGuide.sentences) out = out.concat(CovaraGuide.sentences(lang) || []); } catch (e) {}
    var seen = {}; return out.filter(function (s) { s = String(s || ''); if (!s || seen[s] || /\{/.test(s)) return false; seen[s] = 1; return true; });
  }
  async function warm() {
    if (!authed()) return;
    var lang = IT() ? 'it' : 'en', key = 'rc:cvcWarm:' + lang, day = new Date().toDateString();
    var st0 = store(key) || {}; if (st0.day === day && st0.done) return;
    try { var s = await api('/care-voice/status'); if (!s.ok || !s.data.configured || !(s.data.server && s.data.server.ok)) return; } catch (e) { return; }
    var parts = [];
    fixed(lang).forEach(function (x) { parts = parts.concat(String(x).match(/[^.!?]+[.!?]*/g) || [x]); });
    parts = parts.map(function (x) { return x.trim(); }).filter(Boolean);
    var from = st0.day === day ? (st0.at || 0) : 0;
    for (var i = from; i < parts.length; i += 12) {
      var r = await api('/care-voice/warm', { method: 'POST', body: JSON.stringify({ lang: lang, sentences: parts.slice(i, i + 12) }) }).catch(function () { return { ok: false }; });
      if (!r.ok) { store(key, { day: day, at: i }); return; }
      store(key, { day: day, at: i + 12 });
      await new Promise(function (res) { setTimeout(res, 11000); });
    }
    store(key, { day: day, done: true });
  }
  setTimeout(warm, 20000);

  window.CovaraNotes = { toggle: toggle, heard: heard, file: file, journal: journal, close: close, isOpen: function () { return !!(sheet && sheet.classList.contains('open')); }, sentences: fixed, _slots: slots };
})();
