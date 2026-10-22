/* Remiel: Covara, HOME's day as the team plans it, and HOME asking the team for something.
   HOME's team (AWAY: family, a carer, a neighbour) plans meals, HOME's own work hours, routines and tasks. HOME
   is reminded when each one comes, on the Now card and by a notification, and answers in one tap: "I ate it",
   "Done", "On my way". HOME asks for something in plain words, by TALK or typed: "pancakes for breakfast
   tomorrow at 9", of the whole team or of one person ("Ask Vincent..."). While it waits, the ask sits on HOME's
   day at its time, "Waiting for Vincent". The person asked sees one card and answers "Yes, plan it" (the meal
   goes on HOME's day at that time, marked "Vincent said yes") or "Not this time"; HOME sees the answer until
   "Got it". Asked of one person and not answered, HOME is offered to ask the whole team.
   Opened from the care card ("Day"); CovaraPlan.ask(text) is what TALK calls.
   Beverly Index LLC */
(function () {
  'use strict';
  var IT = function () { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var S = {
    en: {
      day: 'Day', yourDay: 'Your day', dayOf: '{name}’s day', today: 'Today', tomorrow: 'Tomorrow', nothing: 'Nothing planned yet.',
      sub: 'Meals, work, routines and tasks', addMeal: '+ Meal', addWork: '+ Work', addTask: '+ Routine or task',
      breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack', meal: 'Meal', work: 'Work', task: 'Task', routine: 'Routine',
      f_which: 'Which meal', f_food: 'What to eat (optional)', f_time: 'Time', f_repeat: 'When', f_every: 'Every week', f_once: 'One day', f_date: 'Date',
      f_days: 'Days', f_start: 'Starts', f_until: 'Ends', f_leave: 'Tell {name} to leave', f_leaveMin: '{n} min before', f_place: 'Where (optional)',
      f_title: 'What to do', f_workTitle: 'Work (for example: Library)', f_routine: 'Part of every day', f_tell: 'Tell me if it is not done',
      save: 'Save', cancel: 'Cancel', remove: 'Remove', sure: 'Remove?', saved: 'Saved', failed: 'Could not save. Try again.',
      st_done: 'Done', st_eaten: 'Eaten', st_late: 'Late', st_due: 'Now', st_on: 'At work', st_leave: 'Time to leave', until: 'until {t}',
      ate: 'I ate it', some: 'Some', none: 'Not hungry', doneB: 'Done', later: 'Later', onway: 'On my way', got: 'Got it',
      leadPlan: 'YOUR DAY', timeFor: 'Time for {which}', timeMeal: 'Time to eat', leaveNow: 'Time to leave for work', workAt: 'Work starts at {t}.',
      ask: 'Ask My Team', askTitle: 'What would you like?', who: 'Who to ask', whole: 'Whole team', askedRow: 'Asked: {what}', waitFor: 'Waiting for {name}', waitTeam: 'Waiting for your team', chipAsked: 'Asked',
      saidYesBy: '{name} said yes', leadAsked: 'ASKED', noAnswer: '{name} has not answered yet', askAll: 'Ask the whole team', keepWait: 'Keep waiting', askedAll: 'Asked the whole team', asksYou: '{name} asks you', sentTo: 'Sent to {name}', toOne: 'I asked {name}.',
      askHint: 'Say it or type it. For example: pancakes for breakfast tomorrow at 9.',
      askSend: 'Send', askSpeak: 'Speak', askListen: 'Listening…', askSent: 'Sent to your team', askWait: 'Waiting for an answer',
      leadAsk: 'ASKING', asks: '{name} asks', yesPlan: 'Yes, plan it', yes: 'Yes', notNow: 'Not this time', reply: 'Reply',
      leadAnswer: 'YOUR TEAM ANSWERED', saidYes: '{name} said yes', saidNo: '{name} can’t this time', planned: 'Planned: {what}', toFamily: 'I asked your team.',
      dayNext: 'Next: {what} {t}', dayNow: 'Now: {what}', dayLate: 'Late: {what}', dayNone: 'Nothing planned', dayAsk: '{name} asks for something', loading: 'Loading…',
      d0: 'Sun', d1: 'Mon', d2: 'Tue', d3: 'Wed', d4: 'Thu', d5: 'Fri', d6: 'Sat', close: 'Close'
    },
    it: {
      day: 'Giornata', yourDay: 'La tua giornata', dayOf: 'La giornata di {name}', today: 'Oggi', tomorrow: 'Domani', nothing: 'Ancora niente in programma.',
      sub: 'Pasti, lavoro, abitudini e cose da fare', addMeal: '+ Pasto', addWork: '+ Lavoro', addTask: '+ Abitudine o cosa da fare',
      breakfast: 'Colazione', lunch: 'Pranzo', dinner: 'Cena', snack: 'Merenda', meal: 'Pasto', work: 'Lavoro', task: 'Da fare', routine: 'Abitudine',
      f_which: 'Quale pasto', f_food: 'Cosa mangiare (facoltativo)', f_time: 'Ora', f_repeat: 'Quando', f_every: 'Ogni settimana', f_once: 'Un giorno', f_date: 'Data',
      f_days: 'Giorni', f_start: 'Inizia', f_until: 'Finisce', f_leave: 'Avvisa {name} di uscire', f_leaveMin: '{n} min prima', f_place: 'Dove (facoltativo)',
      f_title: 'Cosa fare', f_workTitle: 'Lavoro (per esempio: Biblioteca)', f_routine: 'Parte di ogni giorno', f_tell: 'Avvisami se non viene fatto',
      save: 'Salva', cancel: 'Annulla', remove: 'Togli', sure: 'Togliere?', saved: 'Salvato', failed: 'Non salvato. Riprova.',
      st_done: 'Fatto', st_eaten: 'Mangiato', st_late: 'In ritardo', st_due: 'Ora', st_on: 'Al lavoro', st_leave: 'È ora di uscire', until: 'fino alle {t}',
      ate: 'Ho mangiato', some: 'Un po’', none: 'Non ho fame', doneB: 'Fatto', later: 'Più tardi', onway: 'Sto uscendo', got: 'Ho capito',
      leadPlan: 'LA TUA GIORNATA', timeFor: 'È ora di {which}', timeMeal: 'È ora di mangiare', leaveNow: 'È ora di uscire per il lavoro', workAt: 'Il lavoro inizia alle {t}.',
      ask: 'Chiedi al mio team', askTitle: 'Cosa ti piacerebbe?', who: 'A chi chiedere', whole: 'Tutto il team', askedRow: 'Chiesto: {what}', waitFor: 'In attesa di {name}', waitTeam: 'In attesa del tuo team', chipAsked: 'Chiesto',
      saidYesBy: '{name} ha detto s\u00ec', leadAsked: 'CHIESTO', noAnswer: '{name} non ha ancora risposto', askAll: 'Chiedi a tutto il team', keepWait: 'Aspetto ancora', askedAll: 'Chiesto a tutto il team', asksYou: '{name} lo chiede a te', sentTo: 'Inviato a {name}', toOne: 'L\u2019ho chiesto a {name}.',
      askHint: 'Dillo o scrivilo. Per esempio: i pancake a colazione domani alle 9.',
      askSend: 'Invia', askSpeak: 'Parla', askListen: 'In ascolto…', askSent: 'Inviato al tuo team', askWait: 'In attesa di risposta',
      leadAsk: 'CHIEDE', asks: '{name} chiede', yesPlan: 'Sì, organizza', yes: 'Sì', notNow: 'Non questa volta', reply: 'Rispondi',
      leadAnswer: 'IL TUO TEAM HA RISPOSTO', saidYes: '{name} ha detto sì', saidNo: '{name} non può questa volta', planned: 'Organizzato: {what}', toFamily: 'L\u2019ho chiesto al tuo team.',
      dayNext: 'Dopo: {what} {t}', dayNow: 'Ora: {what}', dayLate: 'In ritardo: {what}', dayNone: 'Niente in programma', dayAsk: '{name} chiede qualcosa', loading: 'Caricamento…',
      d0: 'Dom', d1: 'Lun', d2: 'Mar', d3: 'Mer', d4: 'Gio', d5: 'Ven', d6: 'Sab', close: 'Chiudi'
    }
  };
  function t(k, p) { var s = (IT() ? S.it : S.en)[k]; if (s == null) s = S.en[k] == null ? k : S.en[k]; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function authed() { try { return SyncEngine.isAuthenticated() && !SyncEngine.isLocalOnly(); } catch (e) { return false; } }
  async function api(path, o) { var r = await SyncEngine.apiFetch(path, Object.assign({ method: 'GET' }, o || {})); return { ok: r.ok, status: r.status, data: await r.json().catch(function () { return {}; }) }; }
  function hm(ms) { try { return new Date(ms).toLocaleTimeString(IT() ? 'it' : 'en-US', { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }
  function hhmmTo(s) { var m = /^(\d{1,2}):(\d{2})$/.exec(String(s || '')); if (!m) return ''; var d = new Date(); d.setHours(+m[1], +m[2], 0, 0); return hm(d.getTime()); }
  /* when an ask is for, in HOME's own language (the server writes English) */
  function whenOf(a) { if (!a || !a.at) return ''; try { return new Date(a.at).toLocaleString(IT() ? 'it' : 'en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }
  function toast(s) { try { showToast(s); } catch (e) {} }
  function first(s) { return String(s || '').trim().split(/\s+/)[0] || ''; }
  var PLAN = ['meal', 'work', 'task'];
  var ICON = { meal: '🍽', work: '💼', task: '✔', routine: '🔁' };

  /* which HOME this phone looks after */
  function homeContact() { try { return DEMO_CONTACTS.filter(function (c) { return c.care && c.care.side === 'home' && c.care.state === 'active'; })[0] || null; } catch (e) { return null; } }
  function subject() {
    if (role() === 'home') return { home: null, edit: true, self: true, name: '' };
    var h = homeContact(); if (!h) return null;
    return { home: h.care.userId, edit: !!(h.care.share && h.care.share.care), self: false, name: first(h.first || h.last), contact: h };
  }
  function q(s, extra) { var a = []; if (s && s.home) a.push('home=' + encodeURIComponent(s.home)); if (extra) a.push(extra); return a.length ? '?' + a.join('&') : ''; }

  /* ── the look: NOUS glass sheet, as the person sheet ── */
  var css =
    '#cvplDim{position:fixed;inset:0;z-index:99989;background:rgba(4,12,34,.46);-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);opacity:0;transition:opacity .3s ease;pointer-events:none}#cvplDim.open{opacity:1;pointer-events:auto}' +
    '#cvplSheet{position:fixed;left:0;right:0;bottom:0;z-index:99989;margin:0 auto;max-width:520px;max-height:92vh;max-height:92dvh;overflow-y:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;' +
      'padding:12px 16px calc(18px + env(safe-area-inset-bottom,0px));border-radius:26px 26px 0 0;color:#eef3fb;font-family:var(--nous-font,"Hanken Grotesk",system-ui,sans-serif);' +
      'background:linear-gradient(160deg,rgba(70,130,235,.30) 0%,rgba(22,48,110,.62) 50%,rgba(10,22,60,.86) 100%);-webkit-backdrop-filter:blur(22px) saturate(160%);backdrop-filter:blur(22px) saturate(160%);' +
      'border:1px solid rgba(150,200,255,.45);border-bottom:none;box-shadow:0 0 0 1px rgba(56,189,248,.12),0 -6px 34px rgba(70,150,255,.34),inset 0 1px 0 rgba(255,255,255,.18);' +
      'transform:translateY(105%);transition:transform .34s cubic-bezier(.2,.8,.2,1);text-shadow:0 1px 2px rgba(2,8,24,.55)}#cvplSheet.open{transform:none}' +
    '#cvplSheet .pl-grab{width:44px;height:5px;border-radius:3px;background:rgba(190,215,255,.45);margin:0 auto 6px}' +
    '#cvplSheet .pl-x{position:absolute;top:10px;right:12px;width:48px;height:48px;border-radius:50%;border:1px solid rgba(150,200,255,.45);background:rgba(20,44,100,.35);color:#dce8ff;font:600 26px/1 system-ui,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center}' +
    '#cvplSheet h2{margin:6px 60px 2px 4px;font-size:26px;font-weight:800}#cvplSheet .pl-sub{margin:0 4px 14px;font:600 13px/1.3 "JetBrains Mono","SF Mono",monospace;color:#9fd8ff}' +
    '#cvplSheet h3{margin:16px 4px 8px;font:800 12px "JetBrains Mono","SF Mono",monospace;letter-spacing:.16em;color:#ffd24d;text-transform:uppercase}' +
    '#cvplSheet .pl-none{margin:0 4px 6px;color:#b9cdee;font-size:15px}' +
    '#cvplSheet .pl-row{display:flex;align-items:flex-start;gap:12px;padding:12px;border-radius:18px;margin-bottom:8px;border:1px solid rgba(150,200,255,.32);background:linear-gradient(155deg,rgba(80,140,240,.18),rgba(18,40,96,.42));box-shadow:inset 0 1px 0 rgba(255,255,255,.1)}' +
    '#cvplSheet .pl-row.pl-due{border-color:rgba(255,210,77,.85);box-shadow:0 0 18px rgba(255,210,77,.25)}#cvplSheet .pl-row.pl-late{border-color:rgba(239,68,68,.85);box-shadow:0 0 18px rgba(239,68,68,.28)}#cvplSheet .pl-row.pl-done{opacity:.62}#cvplSheet .pl-row.pl-asked{border-style:dashed;border-color:rgba(255,210,77,.7)}' +
    '#cvplSheet .pl-ic{flex:0 0 auto;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;background:rgba(56,189,248,.16);box-shadow:0 0 12px rgba(56,189,248,.25)}' +
    '#cvplSheet .pl-tx{flex:1;min-width:0}#cvplSheet .pl-tm{font:700 13px "JetBrains Mono","SF Mono",monospace;color:#9fd8ff}#cvplSheet .pl-tt{font-size:18px;font-weight:700;line-height:1.25;overflow-wrap:anywhere}#cvplSheet .pl-ds{font-size:14px;color:#c9d8f3;margin-top:2px}' +
    '#cvplSheet .pl-chip{flex:0 0 auto;align-self:center;padding:4px 10px;border-radius:12px;font:800 11px "JetBrains Mono","SF Mono",monospace;letter-spacing:.06em;background:rgba(56,189,248,.18);color:#bfe6ff}' +
    '#cvplSheet .pl-chip.pl-late{background:rgba(239,68,68,.25);color:#ffc2c2}#cvplSheet .pl-chip.pl-due{background:rgba(255,210,77,.22);color:#ffe08a}' +
    '#cvplSheet .pl-acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}' +
    '#cvplSheet button.pl-b{min-height:48px;padding:0 16px;border-radius:24px;border:1px solid rgba(150,200,255,.5);background:linear-gradient(155deg,rgba(80,140,240,.28),rgba(18,40,96,.5));color:#eef5ff;font:700 16px var(--nous-font,"Hanken Grotesk",sans-serif);cursor:pointer;box-shadow:0 0 12px rgba(70,150,255,.2),inset 0 1px 0 rgba(255,255,255,.14)}' +
    '#cvplSheet button.pl-b.pl-pri{border:0;background:radial-gradient(circle at 35% 30%,#ffe58a,#ffc531 60%,#d99a00);color:#2a1600;text-shadow:none;box-shadow:0 0 18px rgba(255,200,60,.45)}' +
    '#cvplSheet button.pl-b.pl-big{width:100%;min-height:60px;font-size:20px;border-radius:20px}' +
    '#cvplSheet button.pl-rm{flex:0 0 auto;align-self:center;min-width:48px;min-height:48px;border-radius:50%;border:1px solid rgba(150,200,255,.35);background:rgba(20,44,100,.3);color:#c9d8f3;font:600 20px system-ui;cursor:pointer}#cvplSheet button.pl-rm.pl-sure{width:auto;border-radius:24px;padding:0 12px;font-size:14px;border-color:rgba(239,68,68,.8);color:#ffc2c2}' +
    '#cvplSheet .pl-adds{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:16px 0 4px}#cvplSheet .pl-adds button{min-height:56px;padding:4px 6px;font-size:15px;line-height:1.15}' +
    '#cvplSheet form{margin-top:10px;padding:14px;border-radius:20px;border:1px solid rgba(255,210,77,.6);background:linear-gradient(155deg,rgba(80,140,240,.18),rgba(10,24,64,.55));box-shadow:0 0 22px rgba(255,210,77,.18)}' +
    '#cvplSheet label{display:block;margin:10px 0 6px;font:700 12px "JetBrains Mono","SF Mono",monospace;letter-spacing:.08em;color:#9fd8ff;text-transform:uppercase}' +
    '#cvplSheet input[type=text],#cvplSheet input[type=time],#cvplSheet input[type=date],#cvplSheet textarea,#cvplSheet select{width:100%;box-sizing:border-box;min-height:50px;padding:10px 14px;border-radius:14px;border:1px solid rgba(150,200,255,.45);background:rgba(6,16,44,.7);color:#fff;font:600 17px var(--nous-font,"Hanken Grotesk",sans-serif);color-scheme:dark}' +
    '#cvplSheet textarea{min-height:110px;font-size:20px;line-height:1.35;resize:vertical}' +
    '#cvplSheet .pl-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '#cvplSheet .pl-chips{display:flex;flex-wrap:wrap;gap:6px}#cvplSheet .pl-chips button{min-height:44px;min-width:48px;padding:0 12px;border-radius:22px;border:1px solid rgba(150,200,255,.45);background:rgba(20,44,100,.35);color:#dce8ff;font:700 15px var(--nous-font,sans-serif);cursor:pointer}' +
    '#cvplSheet .pl-chips button[aria-pressed=true]{border-color:#ffd24d;background:rgba(255,210,77,.22);color:#fff;box-shadow:0 0 12px rgba(255,210,77,.3)}' +
    '#cvplSheet .pl-ck{display:flex;align-items:center;gap:10px;margin-top:12px;font-size:16px}#cvplSheet .pl-ck input{width:24px;height:24px;accent-color:#ffd24d}' +
    '#cvplSheet .pl-formacts{display:flex;gap:10px;margin-top:16px}#cvplSheet .pl-formacts button{flex:1}' +
    '#cvplSheet .pl-err{color:#ffc2c2;margin-top:8px;font-size:14px;min-height:18px}' +
    '#cvplSheet .pl-sent{margin:14px 0 4px;padding:14px;border-radius:18px;border:1px solid rgba(56,189,248,.7);background:rgba(56,189,248,.14);font-size:17px;line-height:1.4}' +
    '#cvplSheet .pl-wait{margin-top:8px;font:600 13px "JetBrains Mono","SF Mono",monospace;color:#9fd8ff}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var dim = null, sheet = null, _open = false, _hist = false, _view = 'day', _form = null, _s = null;
  var _items = [], _today = null, _asks = [], _loadedAt = 0;
  function build() {
    if (sheet) return;
    dim = document.createElement('div'); dim.id = 'cvplDim'; document.body.appendChild(dim);
    sheet = document.createElement('div'); sheet.id = 'cvplSheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); document.body.appendChild(sheet);
    dim.addEventListener('click', function () { close(); });
    window.addEventListener('popstate', function () { if (_open) { _hist = false; close(true); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && _open) close(); });
  }
  function show() {
    build(); _open = true;
    requestAnimationFrame(function () { dim.classList.add('open'); sheet.classList.add('open'); });
    if (!_hist) { try { history.pushState({ cvpl: 1 }, ''); _hist = true; } catch (e) {} }
    document.body.classList.add('cvp-open');
  }
  function close(fromBack) {
    if (!sheet) return;
    _open = false; _form = null; stopListen();
    dim.classList.remove('open'); sheet.classList.remove('open');
    if (!document.getElementById('cvpSheet') || !document.getElementById('cvpSheet').classList.contains('open')) document.body.classList.remove('cvp-open');
    if (_hist && !fromBack) { _hist = false; try { history.back(); } catch (e) {} }
  }

  /* ── HOME's day: today's and tomorrow's meals, work and tasks ── */
  async function load() {
    var s = subject(); if (!s || !authed()) return false;
    _s = s;
    /* someone on the team who does not see HOME's care still sees what HOME asks them */
    var none = { ok: false };
    var a = s.self || s.edit ? await api('/care/items' + q(s)).catch(function () { return none; }) : none;
    var b = s.self || s.edit ? await api('/care/today' + q(s)).catch(function () { return none; }) : none;
    var c = await api('/care/asks' + q(s)).catch(function () { return { ok: false }; });
    if (a.ok) _items = (a.data.items || []).filter(function (x) { return PLAN.indexOf(x.kind) >= 0; });
    if (b.ok) _today = b.data;
    if (c.ok) _asks = c.data.asks || [];
    _loadedAt = Date.now();
    nowSync();
    if (_open && _view === 'day' && !_form) paintDay();
    return true;
  }
  function stateOf(it, slot) {
    var l = (_today && _today.items) || [];
    for (var i = 0; i < l.length; i++) if (l[i].item.id === it.id && String(l[i].slot) === String(slot)) return l[i];
    return null;
  }
  function rowsFor(off) {
    var d0 = new Date(); d0.setHours(0, 0, 0, 0); d0.setDate(d0.getDate() + off);
    var d1 = new Date(d0); d1.setDate(d1.getDate() + 1);
    var out = [];
    _items.forEach(function (it) {
      if (it.at) { if (it.at >= d0.getTime() && it.at < d1.getTime()) out.push({ it: it, slot: 'once', at: it.at }); return; }
      if (it.days && it.days.indexOf(d0.getDay()) < 0) return;
      (it.times || []).forEach(function (s) { var p = s.split(':'), at = new Date(d0); at.setHours(+p[0], +p[1], 0, 0); out.push({ it: it, slot: s, at: at.getTime() }); });
    });
    _asks.forEach(function (a) { if (a.status === 'open' && a.at && a.at >= d0.getTime() && a.at < d1.getTime()) out.push({ ask: a, at: a.at }); });
    out.sort(function (a, b) { return a.at - b.at; });
    return out;
  }
  function askRow(x) {
    var a = x.ask;
    return '<div class="pl-row pl-asked"><div class="pl-ic" aria-hidden="true">' + ICON.meal + '</div><div class="pl-tx"><div class="pl-tm">' + esc(hm(x.at)) + '</div>' +
      '<div class="pl-tt">' + esc(t('askedRow', { what: a.title })) + '</div><div class="pl-ds">' + esc(a.to ? t('waitFor', { name: a.to.name }) : t('waitTeam')) + '</div></div>' +
      '<span class="pl-chip pl-due">' + esc(t('chipAsked')) + '</span></div>';
  }
  function labelOf(it) { var m = it.meta || {}; return it.kind === 'task' ? (m.routine ? 'routine' : 'task') : it.kind; }
  function chipOf(x, off) {
    if (off) return '';
    var s = stateOf(x.it, x.slot); if (!s) return '';
    var k = s.state === 'done' ? (x.it.kind === 'meal' ? 'st_eaten' : 'st_done') : s.state === 'on' ? 'st_on' : s.state === 'due' ? (x.it.kind === 'work' ? 'st_leave' : 'st_due') : s.state === 'late' ? 'st_late' : '';
    return k ? '<span class="pl-chip' + (s.state === 'late' ? ' pl-late' : s.state === 'due' ? ' pl-due' : '') + '">' + esc(t(k)) + '</span>' : '';
  }
  function descOf(it) {
    var m = it.meta || {}, p = [];
    if (it.kind === 'work') { if (m.until) p.push(t('until', { t: hhmmTo(m.until) })); else if (m.end) p.push(t('until', { t: hm(m.end) })); if (m.place) p.push(m.place); }
    if (it.kind === 'meal' && m.food && it.title.toLowerCase().indexOf(String(m.food).toLowerCase()) < 0) p.push(m.food);
    if (it.days && it.days.length) p.push(it.days.map(function (d) { return t('d' + d); }).join(' '));
    if (m.confirmed_name) p.push(t('saidYesBy', { name: m.confirmed_name }));
    if (m.notes) p.push(m.notes);
    return p.join(' · ');
  }
  function homeActs(x) {
    var s = stateOf(x.it, x.slot); if (!s || (s.state !== 'due' && s.state !== 'late')) return '';
    var k = x.it.id + '|' + x.slot;
    if (x.it.kind === 'meal') return '<div class="pl-acts"><button type="button" class="pl-b pl-pri" data-mk="' + esc(k) + '" data-e="all">' + esc(t('ate')) + '</button><button type="button" class="pl-b" data-mk="' + esc(k) + '" data-e="some">' + esc(t('some')) + '</button><button type="button" class="pl-b" data-mk="' + esc(k) + '" data-e="none">' + esc(t('none')) + '</button></div>';
    if (x.it.kind === 'task') return '<div class="pl-acts"><button type="button" class="pl-b pl-pri" data-mk="' + esc(k) + '">' + esc(t('doneB')) + '</button></div>';
    return '';
  }
  function paintDay() {
    if (!sheet) return;
    var s = _s || subject(), self = s && s.self;
    var h = '<div class="pl-grab"></div><button type="button" class="pl-x" aria-label="' + esc(t('close')) + '">×</button>' +
      '<h2>' + esc(self ? t('yourDay') : t('dayOf', { name: s ? s.name : '' })) + '</h2><div class="pl-sub">' + esc(t('sub')) + '</div>';
    if (self) {
      h += '<button type="button" class="pl-b pl-pri pl-big" data-a="ask">' + esc(t('ask')) + '</button>';
      /* asks with no time (they are not on the day below) */
      var open = _asks.filter(function (a) { return a.status === 'open' && !a.at; });
      if (open.length) h += '<div class="pl-wait">' + open.map(function (a) { return esc(a.to ? t('waitFor', { name: a.to.name }) : t('waitTeam')) + ': ' + esc(a.title); }).join('<br>') + '</div>';
    }
    [0, 1].forEach(function (off) {
      var rows = rowsFor(off);
      h += '<h3>' + esc(off ? t('tomorrow') : t('today')) + '</h3>';
      if (!rows.length) { h += '<div class="pl-none">' + esc(t('nothing')) + '</div>'; return; }
      rows.forEach(function (x) {
        if (x.ask) { h += askRow(x); return; }
        var stt = off ? null : stateOf(x.it, x.slot), cls = stt ? stt.state : '';
        h += '<div class="pl-row' + (cls ? ' pl-' + esc(cls) : '') + '"><div class="pl-ic" aria-hidden="true">' + ICON[labelOf(x.it)] + '</div><div class="pl-tx"><div class="pl-tm">' + esc(hm(x.at)) + ' · ' + esc(t(labelOf(x.it))) + '</div>' +
          '<div class="pl-tt">' + esc(x.it.title) + '</div>' + (descOf(x.it) ? '<div class="pl-ds">' + esc(descOf(x.it)) + '</div>' : '') + (self && !off ? homeActs(x) : '') + '</div>' +
          chipOf(x, off) + (!self ? '<button type="button" class="pl-rm" data-rm="' + esc(x.it.id) + '" aria-label="' + esc(t('remove')) + '">×</button>' : '') + '</div>';
      });
    });
    if (!self) h += '<div class="pl-adds"><button type="button" class="pl-b" data-add="meal">' + esc(t('addMeal')) + '</button><button type="button" class="pl-b" data-add="work">' + esc(t('addWork')) + '</button><button type="button" class="pl-b" data-add="task">' + esc(t('addTask')) + '</button></div>';
    var y = sheet.scrollTop;
    sheet.innerHTML = h; sheet.scrollTop = y;
    sheet.setAttribute('aria-label', self ? t('yourDay') : t('dayOf', { name: s ? s.name : '' }));
    sheet.querySelector('.pl-x').onclick = function () { close(); };
    var ab = sheet.querySelector('[data-a=ask]'); if (ab) ab.onclick = function () { openAsk(); };
    sheet.querySelectorAll('[data-add]').forEach(function (b) { b.onclick = function () { openForm(b.getAttribute('data-add')); }; });
    sheet.querySelectorAll('[data-rm]').forEach(function (b) {
      b.onclick = async function () {
        if (!b.classList.contains('pl-sure')) { b.classList.add('pl-sure'); b.textContent = t('sure'); setTimeout(function () { if (b.isConnected) { b.classList.remove('pl-sure'); b.textContent = '×'; } }, 4000); return; }
        b.disabled = true;
        var r = await api('/care/items/' + encodeURIComponent(b.getAttribute('data-rm')), { method: 'DELETE' }).catch(function () { return { ok: false }; });
        if (r.ok) { await load(); refreshView(); } else { b.disabled = false; toast(t('failed')); }
      };
    });
    sheet.querySelectorAll('[data-mk]').forEach(function (b) { b.onclick = function () { mark(b.getAttribute('data-mk'), b.getAttribute('data-e'), b); }; });
  }
  function refreshView() { try { if (window.CovaraView && CovaraView.load) CovaraView.load(); } catch (e) {} }
  async function mark(key, eaten, btn) {
    var p = String(key).split('|'), id = p[0], slot = p[1];
    if (btn) btn.disabled = true;
    var body = slot === 'once' ? {} : { slot: slot }; if (eaten) body.eaten = eaten;
    var r = await api('/care/items/' + encodeURIComponent(id) + '/mark' + q(_s), { method: 'POST', body: JSON.stringify(body) }).catch(function () { return { ok: false }; });
    if (r.ok) { _today = r.data; try { CovaraNow.remove('pl-' + id + '-' + slot); } catch (e) {} nowSync(); if (_open && _view === 'day') paintDay(); refreshView(); }
    else if (btn) btn.disabled = false;
  }

  /* ── the team adds a meal, work or a routine/task ── */
  function dayChips(sel) { return '<div class="pl-chips" data-days>' + [1, 2, 3, 4, 5, 6, 0].map(function (d) { return '<button type="button" data-d="' + d + '" aria-pressed="' + (sel.indexOf(d) >= 0) + '">' + esc(t('d' + d)) + '</button>'; }).join('') + '</div>'; }
  function isoDay(off) { var d = new Date(); d.setDate(d.getDate() + (off || 0)); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  var DEF = { breakfast: '08:00', lunch: '12:30', dinner: '18:30', snack: '15:30' };
  function openForm(kind) {
    _form = kind;
    var s = _s || subject(), nm = s ? s.name : '';
    var f = '<form novalidate data-k="' + kind + '"><h3 style="margin-top:0">' + esc(t(kind === 'task' ? 'addTask' : kind === 'work' ? 'addWork' : 'addMeal').replace('+ ', '')) + '</h3>';
    if (kind === 'meal') {
      f += '<label>' + esc(t('f_which')) + '</label><div class="pl-chips" data-which>' + ['breakfast', 'lunch', 'dinner', 'snack'].map(function (w, i) { return '<button type="button" data-w="' + w + '" aria-pressed="' + (i === 0) + '">' + esc(t(w)) + '</button>'; }).join('') + '</div>' +
        '<label for="cvplFood">' + esc(t('f_food')) + '</label><input type="text" id="cvplFood" maxlength="120" autocomplete="off">' +
        '<label for="cvplTime">' + esc(t('f_time')) + '</label><input type="time" id="cvplTime" value="08:00">';
    } else if (kind === 'work') {
      f += '<label for="cvplTitle">' + esc(t('f_workTitle')) + '</label><input type="text" id="cvplTitle" maxlength="100" value="' + esc(t('work')) + '">' +
        '<div class="pl-two"><div><label for="cvplTime">' + esc(t('f_start')) + '</label><input type="time" id="cvplTime" value="09:00"></div><div><label for="cvplUntil">' + esc(t('f_until')) + '</label><input type="time" id="cvplUntil" value="13:00"></div></div>' +
        '<label for="cvplPlace">' + esc(t('f_place')) + '</label><input type="text" id="cvplPlace" maxlength="150" autocomplete="off">' +
        '<label for="cvplLeave">' + esc(t('f_leave', { name: nm })) + '</label><select id="cvplLeave">' + [15, 30, 45, 60, 90].map(function (n) { return '<option value="' + n + '"' + (n === 45 ? ' selected' : '') + '>' + esc(t('f_leaveMin', { n: n })) + '</option>'; }).join('') + '</select>';
    } else {
      f += '<label for="cvplTitle">' + esc(t('f_title')) + '</label><input type="text" id="cvplTitle" maxlength="100" autocomplete="off">' +
        '<label for="cvplTime">' + esc(t('f_time')) + '</label><input type="time" id="cvplTime" value="10:00">';
    }
    f += '<label>' + esc(t('f_repeat')) + '</label><div class="pl-chips" data-rep><button type="button" data-r="every" aria-pressed="true">' + esc(t('f_every')) + '</button><button type="button" data-r="once" aria-pressed="false">' + esc(t('f_once')) + '</button></div>' +
      '<div data-every><label>' + esc(t('f_days')) + '</label>' + dayChips(kind === 'work' ? [1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5, 6]) + '</div>' +
      '<div data-once hidden><label for="cvplDate">' + esc(t('f_date')) + '</label><input type="date" id="cvplDate" value="' + isoDay(1) + '" min="' + isoDay(0) + '"></div>';
    if (kind === 'task') f += '<label class="pl-ck"><input type="checkbox" id="cvplRoutine" checked> ' + esc(t('f_routine')) + '</label><label class="pl-ck"><input type="checkbox" id="cvplTell"> ' + esc(t('f_tell')) + '</label>';
    f += '<div class="pl-err" aria-live="polite"></div><div class="pl-formacts"><button type="button" class="pl-b" data-f="cancel">' + esc(t('cancel')) + '</button><button type="submit" class="pl-b pl-pri">' + esc(t('save')) + '</button></div></form>';
    var adds = sheet.querySelector('.pl-adds'); if (adds) adds.insertAdjacentHTML('afterend', f);
    var form = sheet.querySelector('form');
    sheet.querySelectorAll('[data-add]').forEach(function (b) { b.disabled = true; });
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var tm = form.querySelector('#cvplTime');
    form.querySelectorAll('[data-w]').forEach(function (b) { b.onclick = function () { form.querySelectorAll('[data-w]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); tm.value = DEF[b.getAttribute('data-w')]; }; });
    form.querySelectorAll('[data-d]').forEach(function (b) { b.onclick = function () { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); }; });
    form.querySelectorAll('[data-r]').forEach(function (b) {
      b.onclick = function () {
        form.querySelectorAll('[data-r]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        var once = b.getAttribute('data-r') === 'once'; form.querySelector('[data-every]').hidden = once; form.querySelector('[data-once]').hidden = !once;
        var rt = form.querySelector('#cvplRoutine'); if (rt && once) rt.checked = false;
      };
    });
    form.querySelector('[data-f=cancel]').onclick = function () { _form = null; paintDay(); };
    form.onsubmit = function (e) { e.preventDefault(); save(form, kind); };
    var fi = form.querySelector('#cvplFood') || form.querySelector('#cvplTitle'); if (fi && kind !== 'work') setTimeout(function () { try { fi.focus({ preventScroll: true }); } catch (x) {} }, 350);
  }
  async function save(form, kind) {
    var err = form.querySelector('.pl-err'); err.textContent = '';
    var v = function (id) { var e = form.querySelector('#' + id); return e ? String(e.value || '').trim() : ''; };
    var time = v('cvplTime'); if (!/^\d{2}:\d{2}$/.test(time)) { err.textContent = t('f_time'); return; }
    var once = (form.querySelector('[data-r][aria-pressed=true]') || {}).getAttribute && form.querySelector('[data-r][aria-pressed=true]').getAttribute('data-r') === 'once';
    var b = { kind: kind, meta: {} };
    if (kind === 'meal') {
      var w = form.querySelector('[data-w][aria-pressed=true]').getAttribute('data-w'), food = v('cvplFood');
      b.title = t(w) + (food ? ': ' + food : ''); b.meta.which = w; if (food) b.meta.food = food;
    } else if (kind === 'work') {
      b.title = v('cvplTitle') || t('work');
      var u = v('cvplUntil'); if (u) b.meta.until = u;
      var pl = v('cvplPlace'); if (pl) b.meta.place = pl;
      b.meta.leave = Number(v('cvplLeave')) || 45;
    } else {
      b.title = v('cvplTitle'); if (!b.title) { err.textContent = t('f_title'); return; }
      if (form.querySelector('#cvplRoutine').checked) b.meta.routine = true;
      if (form.querySelector('#cvplTell').checked) b.meta.tell = true;
    }
    if (once) {
      var dt = v('cvplDate'); if (!/^\d{4}-\d{2}-\d{2}$/.test(dt)) { err.textContent = t('f_date'); return; }
      var p = dt.split('-'), q2 = time.split(':'), at = new Date(+p[0], +p[1] - 1, +p[2], +q2[0], +q2[1], 0, 0).getTime();
      b.at = at;
      if (kind === 'work' && b.meta.until) { var uq = b.meta.until.split(':'); var end = new Date(+p[0], +p[1] - 1, +p[2], +uq[0], +uq[1]).getTime(); delete b.meta.until; if (end > at) b.meta.end = end; }
    } else {
      b.times = [time];
      var days = []; form.querySelectorAll('[data-d][aria-pressed=true]').forEach(function (x) { days.push(+x.getAttribute('data-d')); });
      if (!days.length) { err.textContent = t('f_days'); return; }
      if (days.length < 7) b.days = days;
    }
    var sb = form.querySelector('[type=submit]'); sb.disabled = true;
    var r = await api('/care/items' + q(_s), { method: 'POST', body: JSON.stringify(b) }).catch(function () { return { ok: false, data: {} }; });
    if (!r.ok) { sb.disabled = false; err.textContent = (r.data && r.data.detail) || t('failed'); return; }
    _form = null; toast(t('saved')); await load(); paintDay(); refreshView();
  }

  /* ── HOME asks the team ── */
  var _rec = null, _listening = false;
  function stopListen() { _listening = false; try { if (_rec) { _rec.onend = null; _rec.abort(); } } catch (e) {} _rec = null; try { if (window.CovaraNative && CovaraNative.stopListening) CovaraNative.stopListening(); } catch (e) {} }
  window.addEventListener('covara-native', function (e) {
    var d = e.detail || {}; if (!_listening || d.kind !== 'speech') return;
    var ta = sheet && sheet.querySelector('#cvplAsk'); if (!ta) return;
    if (d.type === 'partial' && d.value) ta.value = d.value;
    else if (d.type === 'result') { ta.value = d.value || ta.value; listenDone(); }
    else if (d.type === 'error') listenDone();
  });
  function listenDone() { _listening = false; var b = sheet && sheet.querySelector('[data-a=speak]'); if (b) { b.textContent = '🎙 ' + t('askSpeak'); b.disabled = false; } }
  function speak() {
    var ta = sheet.querySelector('#cvplAsk'), b = sheet.querySelector('[data-a=speak]');
    if (_listening) { stopListen(); listenDone(); return; }
    var lang = IT() ? 'it-IT' : 'en-US';
    try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
    try {
      if (window.CovaraNative && typeof CovaraNative.listen === 'function' && CovaraNative.canHear()) { _listening = true; b.textContent = t('askListen'); CovaraNative.listen(lang); return; }
    } catch (e) {}
    var R = window.SpeechRecognition || window.webkitSpeechRecognition; if (!R) { ta.focus(); return; }
    _rec = new R(); _rec.lang = lang; _rec.interimResults = true; _rec.maxAlternatives = 1; _listening = true; b.textContent = t('askListen');
    _rec.onresult = function (ev) { var r0 = ev.results[ev.results.length - 1]; ta.value = r0[0].transcript; if (r0.isFinal) { stopListen(); listenDone(); } };
    _rec.onerror = function () { stopListen(); listenDone(); };
    _rec.onend = function () { listenDone(); };
    try { _rec.start(); } catch (e) { listenDone(); }
  }
  function openAsk(text) {
    _view = 'ask'; build();
    sheet.innerHTML = '<div class="pl-grab"></div><button type="button" class="pl-x" aria-label="' + esc(t('close')) + '">×</button>' +
      '<h2>' + esc(t('askTitle')) + '</h2><div class="pl-sub">' + esc(t('askHint')) + '</div>' +
      '<textarea id="cvplAsk" maxlength="300" aria-label="' + esc(t('askTitle')) + '">' + esc(text || '') + '</textarea>' +
      '<label>' + esc(t('who')) + '</label><div class="pl-chips" data-who><button type="button" data-to="" aria-pressed="true">' + esc(t('whole')) + '</button>' +
        team().map(function (m) { return '<button type="button" data-to="' + esc(m.id) + '" aria-pressed="false">' + esc(m.name) + '</button>'; }).join('') + '</div>' +
      '<div class="pl-formacts"><button type="button" class="pl-b" data-a="speak">🎙 ' + esc(t('askSpeak')) + '</button><button type="button" class="pl-b pl-pri" data-a="send">' + esc(t('askSend')) + '</button></div><div class="pl-err" aria-live="polite"></div><div data-sent></div>';
    sheet.querySelector('.pl-x').onclick = function () { close(); };
    sheet.querySelector('[data-a=speak]').onclick = speak;
    sheet.querySelectorAll('[data-to]').forEach(function (b) { b.onclick = function () { sheet.querySelectorAll('[data-to]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); }; });
    sheet.querySelector('[data-a=send]').onclick = async function () {
      var b = this, v = String(sheet.querySelector('#cvplAsk').value || '').trim(); if (v.length < 2) return;
      b.disabled = true; stopListen();
      var to = (sheet.querySelector('[data-to][aria-pressed=true]') || {}).getAttribute ? sheet.querySelector('[data-to][aria-pressed=true]').getAttribute('data-to') : '';
      var a = await ask(v, true, to);
      if (!a) { b.disabled = false; sheet.querySelector('.pl-err').textContent = t('failed'); return; }
      sheet.querySelector('[data-sent]').innerHTML = '<div class="pl-sent">✅ ' + esc(a.to ? t('sentTo', { name: a.to.name }) : t('askSent')) + ':<br><b>' + esc(a.title) + '</b>' + (whenOf(a) ? ', ' + esc(whenOf(a)) : '') + '</div>';
      setTimeout(function () { if (_open && _view === 'ask') { _view = 'day'; paintDay(); } }, 2600);
    };
    if (!_open) show();
    sheet.scrollTop = 0;
  }
  /* sends what HOME asked for; quiet: no voice (the sheet shows it) */
  /* HOME's team: everyone linked to HOME, by first name */
  function team() {
    try {
      return DEMO_CONTACTS.filter(function (c) { return c.care && c.care.side === 'away' && c.care.state === 'active' && c.care.userId; })
        .map(function (c) { return { id: c.care.userId, name: first(c.first || c.last || '') }; }).filter(function (m) { return m.name; });
    } catch (e) { return []; }
  }
  /* "Ask Vincent for pancakes..." or "Tell Vincent I want...": the person named, when one of the team is named */
  function named(text) {
    var s0 = ' ' + String(text || '').toLowerCase() + ' ', hit = null;
    team().forEach(function (m) { if (!hit && new RegExp('[^a-z\u00c0-\u024f]' + m.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^a-z\u00c0-\u024f]').test(s0)) hit = m; });
    return hit;
  }
  /* sends what HOME asked for, to the whole team or one person; quiet: no voice (the sheet shows it) */
  async function ask(text, quiet, to) {
    var s = subject(); if (!s || !authed()) return null;
    if (to === undefined) { var n = named(text); to = n ? n.id : ''; }
    var body = { text: String(text).slice(0, 300), lang: IT() ? 'it' : 'en' }; if (to) body.to = to;
    var r = await api('/care/asks' + q(s), { method: 'POST', body: JSON.stringify(body) }).catch(function () { return { ok: false }; });
    if (!r.ok) return null;
    var a = r.data.ask; _asks.unshift(a);
    if (!quiet) {
      var lead = a.to ? t('toOne', { name: a.to.name }) : t('toFamily');
      var say = lead + ' ' + (a.kind === 'meal' ? a.title + (whenOf(a) ? ', ' + whenOf(a) : '') + '.' : '');
      try { if (window.CovaraTalk && CovaraTalk.say) CovaraTalk.say((a.to ? t('sentTo', { name: a.to.name }) : t('askSent')) + ': ' + a.title + (whenOf(a) ? ', ' + whenOf(a) : ''), say); } catch (e) {}
    }
    return a;
  }
  /* TALK: is this HOME asking for something? */
  /* the same ways of asking the server understands: "I'd like", "can you make me", "ask Vincent for", "vorrei",
     "mi porti", "chiedi a Vincent di portarmi" ... (phones write "I'd" with a curly apostrophe) */
  var WANT = new RegExp('\\b(?:' + [
    "i(?:\\s+would|'d)\\s+(?:really\\s+|so\\s+)?(?:like|love)", "i\\s+(?:really\\s+)?want", "i\\s+need", "i'?m\\s+hungry\\s+for", "i\\s+feel\\s+like",
    "(?:can|could|may)\\s+i\\s+(?:please\\s+)?(?:have|get)", "(?:can|could|would|will)\\s+(?:you|someone|somebody)\\s+(?:please\\s+)?(?:make|bring|get|cook|buy)", "please\\s+(?:make|bring|get|cook)",
    "ask\\s+(?:my\\s+team|the\\s+team|everyone|\\w+)\\s+(?:for|to\\s+(?:make|bring|get|cook|buy)|if\\s+i\\s+can\\s+have)",
    "vorrei", "voglio", "mi\\s+piacerebbe", "ho\\s+voglia\\s+di", "mi\\s+va", "(?:posso|potrei)\\s+avere", "mi\\s+(?:fai|prepari|porti|cucini|compri|faresti|porteresti|prepareresti)",
    "(?:puoi|potresti)\\s+(?:farmi|portarmi|prepararmi|cucinarmi|comprarmi)", "chiedi\\s+a\\s+\\w+"
  ].join('|') + ')\\b', 'i');
  function norm(text) { return String(text || '').replace(/[‘’ʼ`]/g, "'").normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function isAsk(text) { return role() === 'home' && WANT.test(norm(text)); }

  /* ── the Now card: HOME is reminded; the team sees what HOME asks; HOME sees the answer ── */
  var _snooze = {}, _shown = {};
  function nowSync() {
    if (!window.CovaraNow) return;
    var s = _s || subject(); if (!s) return;
    var keep = {};
    if (s.self) {
      ((_today && _today.items) || []).forEach(function (x) {
        if (PLAN.indexOf(x.item.kind) < 0 || (x.state !== 'due' && x.state !== 'late')) return;
        var id = 'pl-' + x.item.id + '-' + x.slot; if ((_snooze[id] || 0) > Date.now()) return;
        keep[id] = 1;
        var it = x.item, m = it.meta || {}, k = it.id + '|' + x.slot, acts;
        var title = it.kind === 'meal' ? (m.which ? t('timeFor', { which: t(m.which).toLowerCase() }) : t('timeMeal')) : it.kind === 'work' ? t('leaveNow') : it.title;
        var body = it.kind === 'meal' ? (m.food ? m.food.charAt(0).toUpperCase() + m.food.slice(1) : it.title) : it.kind === 'work' ? t('workAt', { t: hm(x.at) }) + (m.place ? ' ' + m.place + '.' : '') : hm(x.at);
        if (it.kind === 'meal') acts = [{ label: t('ate'), primary: true, onClick: function () { mark(k, 'all'); } }, { label: t('some'), onClick: function () { mark(k, 'some'); } }, { label: t('none'), onClick: function () { mark(k, 'none'); } }];
        else if (it.kind === 'work') acts = [{ label: t('onway'), primary: true, onClick: function () { _snooze[id] = Date.now() + 864e5; CovaraNow.remove(id); } }, { label: t('later'), onClick: function () { _snooze[id] = Date.now() + 10 * 60000; CovaraNow.remove(id); } }];
        else acts = [{ label: t('doneB'), primary: true, onClick: function () { mark(k); } }, { label: t('later'), onClick: function () { _snooze[id] = Date.now() + 30 * 60000; CovaraNow.remove(id); } }];
        CovaraNow.push({ id: id, rank: x.state === 'late' ? 1 : 2, icon: ICON[labelOf(it)], lead: t('leadPlan'), title: title, body: body, at: x.at, actions: acts });
        /* HOME hears it once */
        if (!_shown[id]) { _shown[id] = 1; try { if (window.CovaraTalk && CovaraTalk.say) { CovaraTalk.say(title, title + '. ' + body); var bb = document.getElementById('cvTalkBubble'); if (bb) bb.hidden = true; } } catch (e) {} }
      });
      _asks.forEach(function (a) {
        if (a.status !== 'open' || !a.to) return;
        var nid = 'askw-' + a.id, now = Date.now();
        if ((_snooze[nid] || 0) > now || !(now - a.created_at > 45 * 60000 || (a.at && a.at - now < 3600000))) return;
        keep[nid] = 1;
        CovaraNow.push({ id: nid, rank: 1, icon: '\u23f3', lead: t('leadAsked'), title: t('noAnswer', { name: a.to.name }), body: a.title + (whenOf(a) ? ', ' + whenOf(a) : ''), at: a.created_at,
          actions: [{ label: t('askAll'), primary: true, onClick: async function () {
            this.disabled = true;
            var r = await api('/care/asks/' + encodeURIComponent(a.id) + '/widen', { method: 'POST' }).catch(function () { return { ok: false }; });
            if (r.ok) { a.to = null; CovaraNow.remove(nid); toast(t('askedAll')); load(); } else this.disabled = false;
          } }, { label: t('keepWait'), onClick: function () { _snooze[nid] = Date.now() + 30 * 60000; CovaraNow.remove(nid); } }] });
      });
      _asks.forEach(function (a) {
        if (a.status === 'open' || a.seen_at) return;
        var id = 'ask-' + a.id; keep[id] = 1;
        var who = a.answered ? a.answered.by.name : '';
        CovaraNow.push({ id: id, rank: 1, icon: a.status === 'yes' ? '✅' : '💬', lead: t('leadAnswer'), title: a.status === 'yes' ? t('saidYes', { name: who }) : t('saidNo', { name: who }),
          body: (a.status === 'yes' && a.kind === 'meal' ? a.title + (whenOf(a) ? ', ' + whenOf(a) : '') + '. ' : '') + (a.note || (a.status === 'no' ? '“' + a.text + '”' : '')),
          at: (a.answered && a.answered.at) || a.created_at, actions: [{ label: t('got'), primary: true, onClick: function () { a.seen_at = Date.now(); CovaraNow.remove(id); api('/care/asks/' + encodeURIComponent(a.id) + '/seen', { method: 'POST' }).catch(function () {}); } }] });
        if (!_shown[id]) { _shown[id] = 1; var w = a.status === 'yes' ? t('saidYes', { name: who }) + '. ' + (a.kind === 'meal' ? a.title + '.' : '') : t('saidNo', { name: who }) + '.'; try { if (window.CovaraTalk && CovaraTalk.say) { CovaraTalk.say(w, w + (a.note ? ' ' + a.note : '')); var b2 = document.getElementById('cvTalkBubble'); if (b2) b2.hidden = true; } } catch (e) {} }
      });
    } else {
      _asks.forEach(function (a) {
        if (a.status !== 'open') return;
        var id = 'ask-' + a.id; keep[id] = 1;
        var answer = async function (ans, btn) {
          if (btn) btn.disabled = true;
          var r = await api('/care/asks/' + encodeURIComponent(a.id) + '/answer', { method: 'POST', body: JSON.stringify({ answer: ans }) }).catch(function () { return { ok: false, status: 0 }; });
          if (r.ok || r.status === 409) {
            a.status = (r.data && r.data.ask && r.data.ask.status) || ans; CovaraNow.remove(id);
            if (r.ok && ans === 'yes' && a.kind === 'meal') toast(t('planned', { what: a.title + (whenOf(a) ? ', ' + whenOf(a) : '') }));
            await load(); refreshView();
          } else if (btn) btn.disabled = false;
        };
        var acts = [{ label: a.kind === 'meal' && a.at ? t('yesPlan') : t('yes'), primary: true, onClick: function () { answer('yes', this); } }, { label: t('notNow'), onClick: function () { answer('no', this); } }];
        if (s.contact) acts.push({ label: t('reply'), onClick: function () { try { runContactQuickAction('sms', s.contact); } catch (e) {} } });
        CovaraNow.push({ id: id, rank: 1, icon: '🙋', lead: t('leadAsk'), title: a.to ? t('asksYou', { name: a.by.name || s.name }) : t('asks', { name: a.by.name || s.name }),
          body: (a.kind === 'meal' ? a.title + (whenOf(a) ? ', ' + whenOf(a) : '') + '. ' : '') + '“' + a.text + '”', at: a.created_at, actions: acts });
      });
    }
    /* cards no longer needed go */
    try { CovaraNow.list().forEach(function (c) { if ((/^pl-/.test(c.id) || /^askw?-/.test(c.id)) && !keep[c.id]) CovaraNow.remove(c.id); }); } catch (e) {}
  }

  /* the care card's "Day" tile: one line */
  function status() {
    var s = subject(); if (!s) return { text: '' };
    if (!s.self && !s.edit) return { text: '' };
    if (!_loadedAt) return { text: t('loading') };
    if (!s.self && _asks.some(function (a) { return a.status === 'open'; })) return { text: t('dayAsk', { name: s.name }), st: 'due' };
    var l = ((_today && _today.items) || []).filter(function (x) { return PLAN.indexOf(x.item.kind) >= 0 && x.state !== 'done' && x.state !== 'on'; });
    var late = l.filter(function (x) { return x.state === 'late'; })[0]; if (late) return { text: t('dayLate', { what: late.item.title }), st: 'late' };
    var due = l.filter(function (x) { return x.state === 'due'; })[0]; if (due) return { text: t('dayNow', { what: due.item.kind === 'work' ? t('leaveNow') : due.item.title }), st: 'due' };
    var nx = l.filter(function (x) { return x.at >= Date.now() - 60000; })[0];
    return nx ? { text: t('dayNext', { what: nx.item.title, t: hm(nx.at) }) } : { text: t('dayNone') };
  }

  async function open() {
    _view = 'day'; _form = null; build();
    var s = subject(); _s = s;
    sheet.innerHTML = '<div class="pl-grab"></div><h2>' + esc(t('loading')) + '</h2>'; show();
    await load(); paintDay();
  }

  /* every 20 seconds while Covara is on screen, at once when it comes back */
  setInterval(function () { if (!document.hidden && role()) load(); }, 20000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden && role()) load(); });
  setTimeout(function () { if (role()) load(); }, 4000);
  if (/(^|[#&])(plan|ask)=/.test(location.hash)) setTimeout(function () { if (role()) open(); }, 2500);

  window.CovaraPlan = { open: open, close: close, ask: ask, openAsk: function (text) { openAsk(text); }, isAsk: isAsk, status: status, load: load, isOpen: function () { return _open; } };
})();
