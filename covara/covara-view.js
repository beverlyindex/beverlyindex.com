/* Remiel: Covara, HOME's care inside the Sentinel galaxy.
   Upper left: pull tabs for Medications, Appointments and Subscriptions.
   A tab opens a drop-down list ordered by what is needed soonest; each
   entry opens to its details, with the photo HOME took, and the question
   "Is it working?". People (HOME, the family, the doctors) are spheres;
   things are entries in the tabs. On AWAY's phone HOME is the centre
   sphere, with Video, Phone, Message and Email beside it.
   Beverly Index LLC */
(function () {
  'use strict';
  var STR = {
    en: {
      meds: 'Medications', appts: 'Appointments', subs: 'Subscriptions',
      video: 'Video', phone: 'Phone', message: 'Message', email: 'Email',
      now: 'NOW', late: 'LATE', today: 'Today', tomorrow: 'Tomorrow', next: 'NEXT', none: 'Nothing recorded',
      addMed: 'Add a medicine', addAppt: 'Add an appointment', addSub: 'Add a subscription',
      dNext: 'Next', dSchedule: 'Every day at', dDose: 'Dose', dBy: 'Prescribed by', dFrom: 'Get it from', dLast: 'Last taken', dFor: 'For',
      dWith: 'With', dWhen: 'When', dWhere: 'Where', dNotes: 'Notes', dRenews: 'Renews', dProvider: 'From', dEvery: 'Every', dCost: 'Cost', dLastDone: 'Last done',
      never: 'Not yet', doctor: 'Doctor', pharmacy: 'Pharmacy',
      working: 'Is it working?', helped: 'Did it help?', yes: 'Yes', unsure: 'Not sure', no: 'No', said: 'answered', you: 'You',
      taken: 'Taken', done: 'Done', change: 'Change', remove: 'Remove', save: 'Save', cancel: 'Cancel', saving: 'Saving',
      photo: 'Take a photo of it', name: 'Name, as on the box', strength: 'Strength', unit: 'Unit', qty: 'How many each time', form: 'Form',
      when: 'When', morning: 'Morning', midday: 'Midday', evening: 'Evening', night: 'Night', other: 'Other time',
      prescriber: 'Prescribed by', prescribedOn: 'Prescribed on', source: 'Get it from', sourceName: 'Pharmacy or doctor name', sourcePhone: 'Their phone', purpose: 'What it is for (optional)',
      apptTitle: 'What it is for', apptWith: 'With whom', date: 'Date', time: 'Time', place: 'Where', notes: 'Notes (optional)',
      subTitle: 'What it is', provider: 'Who provides it', renews: 'Next renewal', every: 'How often (for example monthly)', cost: 'Cost (optional)',
      needName: 'Write its name first.', needTime: 'Choose at least one time.', needWhen: 'Choose the date and time.',
      failed: 'Could not save. Check the internet and try again.',
      reading: 'Reading the label on this phone…', readOk: 'Read from the label. Check each gold line before you save.', readNone: 'The label could not be read. Try again closer, in good light, or fill it in.',
      dSupply: 'Supply', refills: 'refills', dispensedN: 'in the bottle',
      forms: { tablet: 'tablet', pill: 'pill', capsule: 'capsule', drop: 'drop', ml: 'ml', puff: 'puff', injection: 'injection', patch: 'patch', spoon: 'spoon', sachet: 'sachet' }
    },
    it: {
      meds: 'Medicine', appts: 'Appuntamenti', subs: 'Abbonamenti',
      video: 'Video', phone: 'Telefono', message: 'Messaggio', email: 'Email',
      now: 'ORA', late: 'IN RITARDO', today: 'Oggi', tomorrow: 'Domani', next: 'PROSSIMA', none: 'Niente registrato',
      addMed: 'Aggiungi una medicina', addAppt: 'Aggiungi un appuntamento', addSub: 'Aggiungi un abbonamento',
      dNext: 'Prossima', dSchedule: 'Ogni giorno alle', dDose: 'Dose', dBy: 'Prescritta da', dFrom: 'Dove si ritira', dLast: 'Ultima presa', dFor: 'Per',
      dWith: 'Con', dWhen: 'Quando', dWhere: 'Dove', dNotes: 'Note', dRenews: 'Rinnovo', dProvider: 'Da', dEvery: 'Ogni', dCost: 'Costo', dLastDone: 'Ultima volta',
      never: 'Non ancora', doctor: 'Medico', pharmacy: 'Farmacia',
      working: 'Funziona?', helped: 'È servito?', yes: 'Sì', unsure: 'Non so', no: 'No', said: 'ha risposto', you: 'Tu',
      taken: 'Presa', done: 'Fatto', change: 'Modifica', remove: 'Rimuovi', save: 'Salva', cancel: 'Annulla', saving: 'Salvataggio',
      photo: 'Fai una foto', name: 'Nome, come sulla scatola', strength: 'Dosaggio', unit: 'Unità', qty: 'Quante ogni volta', form: 'Forma',
      when: 'Quando', morning: 'Mattina', midday: 'Mezzogiorno', evening: 'Sera', night: 'Notte', other: 'Altro orario',
      prescriber: 'Prescritta da', prescribedOn: 'Prescritta il', source: 'Dove si ritira', sourceName: 'Nome della farmacia o del medico', sourcePhone: 'Il loro telefono', purpose: 'A cosa serve (facoltativo)',
      apptTitle: 'Per cosa', apptWith: 'Con chi', date: 'Data', time: 'Ora', place: 'Dove', notes: 'Note (facoltativo)',
      subTitle: 'Che cos\u2019è', provider: 'Chi lo fornisce', renews: 'Prossimo rinnovo', every: 'Ogni quanto (per esempio mensile)', cost: 'Costo (facoltativo)',
      needName: 'Scrivi prima il nome.', needTime: 'Scegli almeno un orario.', needWhen: 'Scegli data e ora.',
      failed: 'Non salvato. Controlla internet e riprova.',
      reading: 'Lettura dell\u2019etichetta su questo telefono…', readOk: 'Letto dall\u2019etichetta. Controlla ogni riga dorata prima di salvare.', readNone: 'Non è stato possibile leggere l\u2019etichetta. Riprova più vicino, con buona luce, o compila a mano.',
      dSupply: 'Scorta', refills: 'rinnovi', dispensedN: 'nella confezione',
      forms: { tablet: 'compressa', pill: 'pillola', capsule: 'capsula', drop: 'goccia', ml: 'ml', puff: 'spruzzo', injection: 'iniezione', patch: 'cerotto', spoon: 'cucchiaio', sachet: 'bustina' }
    }
  };
  var SLOTS = [['morning', '08:00'], ['midday', '13:00'], ['evening', '18:00'], ['night', '22:00']];
  var FORMS = ['tablet', 'pill', 'capsule', 'drop', 'ml', 'puff', 'injection', 'patch', 'spoon', 'sachet'];
  var UNITS = ['mg', 'mcg', 'g', 'ml', 'IU', '%', 'mg/ml'];
  function L() { var l = (window.I18n && I18n.locale) || 'en'; return STR[String(l).slice(0, 2)] || STR.en; }
  function t(k) { return L()[k] || STR.en[k] || k; }
  function loc() { return (window.I18n && I18n.locale) || 'en'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function authed() { try { return typeof SyncEngine !== 'undefined' && SyncEngine.isAuthenticated(); } catch (e) { return false; } }
  function base() { try { return SyncEngine.getStatus().apiBase || ''; } catch (e) { return ''; } }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function myId() { try { return SyncEngine.getStatus().userId || ''; } catch (e) { return ''; } }
  async function api(path, opts) {
    var o = Object.assign({ method: 'GET' }, opts || {});
    if (o.body && typeof o.body !== 'string' && !(o.body instanceof FormData)) o.body = JSON.stringify(o.body);
    var r = await SyncEngine.apiFetch(path, o);
    var j = await r.json().catch(function () { return {}; });
    return { ok: r.ok, status: r.status, data: j };
  }
  function photoUrl(p) { return p ? (/^https?:/.test(p) ? p : base() + p) : ''; }
  function hhmm(ms) { try { return new Date(ms).toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
  function dayLabel(ms) {
    var d = new Date(ms), n = new Date(), tm = new Date(); tm.setDate(n.getDate() + 1);
    if (d.toDateString() === n.toDateString()) return t('today');
    if (d.toDateString() === tm.toDateString()) return t('tomorrow');
    try { return d.toLocaleDateString(loc(), { weekday: 'short', day: 'numeric', month: 'short' }); } catch (e) { return d.toDateString(); }
  }
  function when(ms) { return dayLabel(ms) + ', ' + hhmm(ms); }
  function dateOnly(s) { try { return new Date(s + 'T12:00:00').toLocaleDateString(loc(), { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return s; } }
  function orbOf(title) {
    var h = 0; String(title || '').split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) % 360; });
    return 'radial-gradient(circle at 34% 28%,#fff 0,hsl(' + h + ',90%,82%) 10%,hsl(' + h + ',80%,55%) 45%,hsl(' + h + ',75%,26%) 100%)';
  }
  function slotMs(hm, dayOffset) { var d = new Date(); d.setDate(d.getDate() + (dayOffset || 0)); var p = String(hm).split(':'); d.setHours(+p[0], +p[1], 0, 0); return d.getTime(); }

  /* ── styles: the Sentinel glass of the Communication panel ── */
  var css = '' +
    '#cvTabs{position:fixed;left:16px;top:84px;width:min(340px,calc(100vw - 32px));z-index:7000;font-family:var(--nous-font,"Hanken Grotesk",system-ui,sans-serif);color:#e8ecf4;opacity:0;transform:translateY(-6px);transition:opacity .45s ease,transform .45s ease;pointer-events:none}' +
    '#cvTabs.show{opacity:1;transform:none;pointer-events:auto}' +
    'body.rs-overlay-open #cvTabs,body.cv-asking #cvTabs{opacity:0 !important;pointer-events:none !important}' +
    '.cvx-tab{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;margin:0 0 6px;padding:8px 12px;border-radius:12px;background:rgba(10,12,20,0.72);border:1px solid rgba(56,189,248,0.22);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:inherit;font:inherit;cursor:pointer;text-align:left}' +
    '.cvx-tab:focus-visible,.cvx-row:focus-visible{outline:2px solid #C5A55A;outline-offset:1px}' +
    '.cvx-tab b{font-family:var(--nous-mono,"JetBrains Mono",monospace);font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(240,238,245,0.85)}' +
    '.cvx-tab .cvx-hint{margin-left:auto;font-family:var(--nous-mono,"JetBrains Mono",monospace);font-size:10px;letter-spacing:1px;color:rgba(159,216,255,0.85);white-space:nowrap}' +
    '.cvx-tab .cvx-hint.late{color:#fca5a5}.cvx-tab .cvx-hint.due{color:#ffd24d}' +
    '.cvx-tab .cvx-chev{font-size:13px;color:rgba(159,216,255,0.7);transition:transform .25s ease}' +
    '.cvx-tab[aria-expanded="true"]{border-color:rgba(56,189,248,0.5);background:rgba(14,22,36,0.86)}' +
    '.cvx-tab[aria-expanded="true"] .cvx-chev{transform:rotate(90deg)}' +
    '.cvx-dot{width:7px;height:7px;border-radius:50%;flex:0 0 auto;background:rgba(96,165,250,.6)}.cvx-dot.late{background:#ef4444;box-shadow:0 0 8px #ef4444}.cvx-dot.due{background:#ffd24d;box-shadow:0 0 8px #ffd24d}' +
    '.cvx-list{margin:-2px 0 8px;padding:4px;border-radius:12px;background:rgba(10,12,20,0.62);border:1px solid rgba(56,189,248,0.14);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);max-height:min(58vh,520px);overflow-y:auto;overscroll-behavior:contain;animation:cvxIn .35s ease both}' +
    '@keyframes cvxIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}' +
    '.cvx-item{border-bottom:1px solid rgba(255,255,255,0.05)}.cvx-item:last-child{border-bottom:0}' +
    '.cvx-row{display:flex;align-items:center;gap:10px;width:100%;padding:7px 6px;background:none;border:0;color:inherit;font:inherit;text-align:left;cursor:pointer;border-radius:10px}' +
    '.cvx-row:hover{background:rgba(255,255,255,0.03)}' +
    '.cvx-ph{flex:0 0 auto;width:34px;height:34px;border-radius:50%;background-size:cover;background-position:center;box-shadow:0 0 0 1px rgba(120,200,255,.3)}' +
    '.cvx-nm{flex:1;min-width:0}.cvx-nm span{display:block;font-size:13px;font-weight:700;color:#f0eef5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.cvx-nm small{display:block;font-size:11px;color:rgba(200,214,232,0.7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.cvx-when{flex:0 0 auto;font-family:var(--nous-mono,"JetBrains Mono",monospace);font-size:10px;letter-spacing:1px;color:rgba(159,216,255,0.85);text-align:right}' +
    '.cvx-when.late{color:#fca5a5}.cvx-when.due{color:#ffd24d}.cvx-when.done{color:#86efac}' +
    '.cvx-det{display:none;padding:2px 8px 12px 50px;font-size:12px}' +
    '.cvx-item.open .cvx-det{display:block;animation:cvxIn .3s ease both}' +
    '.cvx-item.open .cvx-row{background:rgba(56,189,248,0.06)}' +
    '.cvx-big{width:96px;height:96px;border-radius:50%;background-size:cover;background-position:center;margin:4px 0 10px;box-shadow:0 0 0 1px rgba(120,200,255,.35),0 0 24px rgba(56,189,248,.25);cursor:zoom-in;border:0}' +
    '.cvx-kv{display:grid;grid-template-columns:auto 1fr;gap:5px 12px;margin:0 0 10px}' +
    '.cvx-kv dt{font-family:var(--nous-mono,"JetBrains Mono",monospace);font-size:9.5px;letter-spacing:1.4px;text-transform:uppercase;color:rgba(159,216,255,0.75);padding-top:2px}' +
    '.cvx-kv dd{margin:0;color:#e8ecf4}' +
    '.cvx-acts{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 12px}' +
    '.cvx-btn{min-height:30px;padding:0 12px;border-radius:15px;border:1px solid rgba(100,180,255,0.35);background:rgba(12,14,24,0.88);color:#d8e8ff;font:500 12px -apple-system,system-ui,"Segoe UI",sans-serif;cursor:pointer}' +
    '.cvx-btn.pri{background:#38bdf8;border-color:#38bdf8;color:#04121a;font-weight:700}' +
    '.cvx-btn[aria-pressed="true"]{background:rgba(56,189,248,0.22);border-color:#38bdf8;color:#fff}' +
    '.cvx-btn:focus-visible{outline:2px solid #C5A55A}' +
    '.cvx-q{font-family:var(--nous-mono,"JetBrains Mono",monospace);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#ffd24d;margin:0 0 6px}' +
    '.cvx-said{font-size:11px;color:rgba(200,214,232,0.7);margin-top:6px}' +
    '.cvx-add{display:block;width:100%;padding:9px 6px;background:none;border:0;color:rgba(95,208,255,0.9);font:600 12px var(--nous-font,"Hanken Grotesk",sans-serif);text-align:left;cursor:pointer;border-radius:10px}' +
    '.cvx-add:hover{background:rgba(255,255,255,0.03)}' +
    '.cvx-empty{padding:8px 6px;font-size:12px;color:rgba(200,214,232,0.6)}' +
    '@media (max-width:700px){#cvTabs{top:78px;left:10px;width:min(240px,58vw)}#cvTabs.is-open{width:calc(100vw - 20px)}.cvx-list{max-height:52vh}.cvx-tab b{letter-spacing:1.2px}}' +
    /* the add, change and photo sheets */
    '.cvt-f{display:flex;flex-direction:column;gap:10px;text-align:left;margin-top:14px}' +
    '.cvt-f label{font:600 10.5px "JetBrains Mono",monospace;letter-spacing:.14em;color:#5fd0ff;text-transform:uppercase}' +
    '.cvt-f input[type=text],.cvt-f input[type=tel],.cvt-f input[type=number],.cvt-f input[type=date],.cvt-f input[type=time],.cvt-f select{width:100%;box-sizing:border-box;min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(10,14,22,.9);color:#f1f6ff;font:500 16px "Hanken Grotesk",sans-serif;padding:0 14px;color-scheme:dark}' +
    '.cvt-f input:focus,.cvt-f select:focus{outline:2px solid #38bdf8;outline-offset:1px}' +
    '.cvt-two{display:flex;gap:10px}.cvt-two>*{flex:1;min-width:0}.cvt-two>div{display:flex;flex-direction:column;gap:6px}' +
    '.cvt-shot{align-self:center;position:relative;width:140px;height:140px;border-radius:50%;border:0;cursor:pointer;background:radial-gradient(circle at 34% 28%,#3a4558 0,#1b2230 55%,#0c1018 100%);box-shadow:0 0 0 2px rgba(120,200,255,.35),0 0 40px rgba(56,189,248,.25);color:#cfe7ff;font:600 13px "Hanken Grotesk",sans-serif;padding:0 18px;background-size:cover;background-position:center}' +
    '.cvt-shot.has{color:transparent}.cvt-shot:focus-visible{outline:2px solid #C5A55A}' +
    '.cvt-f .cvt-read{border-color:#C5A55A !important;box-shadow:0 0 0 1px #C5A55A,0 0 14px rgba(197,165,90,.35)}.cvt-chip.cvt-read{box-shadow:0 0 0 2px #C5A55A}' +
    '.cv-msg.info{color:#ffd24d}' +
    '.cvt-chips{display:flex;flex-wrap:wrap;gap:8px}' +
    '.cvt-chip{min-height:40px;padding:0 14px;border-radius:20px;border:1px solid rgba(255,255,255,.16);background:transparent;color:#b9c6d8;font:600 13px "Hanken Grotesk",sans-serif;cursor:pointer}' +
    '.cvt-chip small{display:block;font:500 10px "JetBrains Mono",monospace;opacity:.8}' +
    '.cvt-chip[aria-pressed="true"]{border-color:#38bdf8;background:#38bdf8;color:#04121a}' +
    '.cvt-big{width:min(300px,76vw);aspect-ratio:1;border-radius:50%;margin:6px auto 4px;background-size:cover;background-position:center;box-shadow:0 0 0 2px rgba(120,200,255,.35),0 0 60px rgba(56,189,248,.35)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ── whose care: HOME's own on HOME's phone, the linked HOME on AWAY's ── */
  function homeContact() {
    if (role() !== 'away' || typeof DEMO_CONTACTS === 'undefined') return null;
    return DEMO_CONTACTS.filter(function (c) { return c.care && c.care.side === 'home' && c.care.state === 'active'; })[0] || null;
  }
  function subject() {
    if (role() === 'home') return { home: null, edit: true, name: '' };
    var h = homeContact();
    if (!h) return null;
    return { home: h.care.userId, edit: !!(h.care.share && h.care.share.care), contact: h, name: h.first };
  }
  function q(s) { return s && s.home ? '?home=' + encodeURIComponent(s.home) : ''; }

  var _data = null, _busy = false;
  async function load() {
    var s = subject();
    if (!s || !authed()) { _data = null; render(); syncSpheres(); return; }
    if (!s.edit) { _data = { s: s, today: { items: [] }, items: [] }; render(); syncSpheres(); return; }
    if (_busy) return; _busy = true;
    try {
      var a = await api('/care/today' + q(s)), b = await api('/care/items' + q(s));
      if (a.ok && b.ok) { _data = { s: s, today: a.data, items: b.data.items || [] }; render(); syncSpheres(); }
    } catch (e) {} finally { _busy = false; }
  }

  /* ── what is needed soonest ── */
  function medNext(it) {
    var slots = (_data.today.items || []).filter(function (x) { return x.item.id === it.id; });
    var open = slots.filter(function (x) { return x.state !== 'done'; });
    var late = open.filter(function (x) { return x.state === 'late'; })[0];
    var due = open.filter(function (x) { return x.state === 'due'; })[0];
    var later = open.filter(function (x) { return x.state === 'later'; })[0];
    if (late) return { state: 'late', slot: late.slot, at: slotMs(late.slot), rank: 0 };
    if (due) return { state: 'due', slot: due.slot, at: slotMs(due.slot), rank: 1 };
    if (later) return { state: 'later', slot: later.slot, at: slotMs(later.slot), rank: 2 };
    var first = (it.times || [])[0];
    return { state: slots.length ? 'done' : 'off', slot: null, at: first ? slotMs(first, 1) : Infinity, rank: 3 };
  }
  function nextLabel(n) {
    if (n.state === 'late') return t('late') + ' ' + n.slot;
    if (n.state === 'due') return t('now');
    if (!isFinite(n.at)) return '';
    return n.rank === 3 ? dayLabel(n.at).toUpperCase() + ' ' + hhmm(n.at) : hhmm(n.at);
  }
  function lists() {
    var now = Date.now(), d = _data;
    var meds = d.items.filter(function (i) { return i.kind === 'med' || i.kind === 'check'; })
      .map(function (i) { return { it: i, n: medNext(i) }; })
      .sort(function (a, b) { return a.n.rank - b.n.rank || a.n.at - b.n.at; });
    var apptDone = {}; (d.today.items || []).forEach(function (x) { if (x.slot === 'appt') apptDone[x.item.id] = x.state; });
    var appts = d.items.filter(function (i) { return i.kind === 'appt' && i.at && i.at > now - 6 * 3600e3; })
      .sort(function (a, b) { return a.at - b.at; })
      .map(function (i) { var s = apptDone[i.id] || 'later'; return { it: i, n: { state: s === 'due' ? 'due' : s, at: i.at } }; });
    var subs = d.items.filter(function (i) { return i.kind === 'sub'; })
      .sort(function (a, b) { return (a.at || 0) - (b.at || 0); })
      .map(function (i) { return { it: i, n: { state: i.at && i.at - now < 3 * 864e5 ? 'due' : 'later', at: i.at } }; });
    return { med: meds, appt: appts, sub: subs };
  }

  /* ── the pull tabs ── */
  var box = document.createElement('div'); box.id = 'cvTabs'; box.setAttribute('aria-label', 'Care');
  document.body.appendChild(box);
  var _open = '', _openItem = '';
  var TABS = [['med', 'meds', 'addMed'], ['appt', 'appts', 'addAppt'], ['sub', 'subs', 'addSub']];

  function ph(it) {
    return it.photo ? 'background-image:url("' + photoUrl(it.photo).replace(/["\\]/g, '') + '")' : 'background:' + orbOf(it.title);
  }
  function doseText(m) {
    var f = m.form ? (L().forms[m.form] || m.form) : '';
    var a = m.qty ? m.qty + (f ? ' ' + f + (m.qty > 1 && f && !/s$/.test(f) && loc().slice(0, 2) === 'en' ? 's' : '') : '') : '';
    var b = m.strength ? m.strength + ' ' + (m.unit || '') : '';
    return [a, b].filter(Boolean).join(' · ');
  }
  function who(id) { if (id === myId()) return t('you'); if (_data.s.contact && id === _data.s.home) return _data.s.contact.first; return ''; }
  function feedbackHtml(it) {
    var q2 = it.kind === 'appt' ? t('helped') : t('working');
    var last = (it.feedback || [])[0];
    var mine = last && last.by === myId() && Date.now() - last.at < 864e5 ? last.answer : '';
    return '<div class="cvx-q">' + esc(q2) + '</div><div class="cvx-acts">' +
      ['yes', 'unsure', 'no'].map(function (a) { return '<button type="button" class="cvx-btn" data-fb="' + a + '" aria-pressed="' + (mine === a) + '">' + esc(t(a)) + '</button>'; }).join('') + '</div>' +
      (last ? '<div class="cvx-said">' + esc((who(last.by) || '') + ' ' + t('said') + ': ' + t(last.answer) + ' · ' + when(last.at)) + (last.note ? '<br>' + esc(last.note) : '') + '</div>' : '');
  }
  function detailsHtml(kind, e) {
    var it = e.it, m = it.meta || {}, rows = [];
    function kv(k, v) { if (v) rows.push('<dt>' + esc(t(k)) + '</dt><dd>' + esc(v) + '</dd>'); }
    if (kind === 'med') {
      kv('dNext', isFinite(e.n.at) ? (e.n.state === 'late' ? t('late') + ', ' : e.n.state === 'due' ? t('now') + ', ' : '') + when(e.n.at) : '');
      kv('dSchedule', (it.times || []).join(' · '));
      kv('dDose', doseText(m) || it.detail);
      kv('dBy', [m.prescriber, m.prescribed_on ? dateOnly(m.prescribed_on) : ''].filter(Boolean).join(', '));
      kv('dFrom', [m.source ? t(m.source) : '', m.source_name, m.source_phone].filter(Boolean).join(' · '));
      kv('dFor', m.purpose);
      kv('dSupply', [m.dispensed ? m.dispensed + ' ' + t('dispensedN') : '', m.refills != null ? m.refills + ' ' + t('refills') : ''].filter(Boolean).join(' · '));
      kv('dLast', it.last_done ? when(it.last_done) : t('never'));
    } else if (kind === 'appt') {
      kv('dWhen', when(it.at)); kv('dWith', m.with); kv('dWhere', m.place || it.detail); kv('dNotes', m.notes);
      kv('dLastDone', it.last_done ? when(it.last_done) : '');
    } else {
      kv('dRenews', it.at ? dayLabel(it.at) : ''); kv('dProvider', m.provider || it.detail); kv('dEvery', m.every); kv('dCost', m.cost); kv('dNotes', m.notes);
    }
    var canMark = (kind === 'med' && e.n.slot && e.n.state !== 'off') || (kind === 'appt' && e.n.state !== 'done' && dayLabel(it.at) === t('today'));
    var acts = '<div class="cvx-acts">' +
      (canMark && _data.s.edit ? '<button type="button" class="cvx-btn pri" data-a="mark">' + esc(kind === 'med' ? t('taken') : t('done')) + '</button>' : '') +
      (_data.s.edit ? '<button type="button" class="cvx-btn" data-a="edit">' + esc(t('change')) + '</button>' : '') + '</div>';
    return '<button type="button" class="cvx-big" style="' + esc(ph(it)) + '" data-a="photo" aria-label="' + esc(it.title) + '"></button>' +
      '<dl class="cvx-kv">' + rows.join('') + '</dl>' + acts + (_data.s.edit ? feedbackHtml(it) : '');
  }
  function rowHtml(kind, e) {
    var it = e.it, m = it.meta || {};
    var sub = kind === 'med' ? (doseText(m) || it.detail || '') : kind === 'appt' ? [m.with, m.place || it.detail].filter(Boolean).join(' · ') : (m.provider || it.detail || '');
    var w = kind === 'med' ? nextLabel(e.n) : kind === 'appt' ? (e.n.state === 'done' ? t('done').toUpperCase() : dayLabel(it.at).toUpperCase() + ' ' + hhmm(it.at)) : (it.at ? dayLabel(it.at).toUpperCase() : '');
    var cls = e.n.state === 'late' ? 'late' : e.n.state === 'due' ? 'due' : e.n.state === 'done' ? 'done' : '';
    var key = it.id;
    return '<div class="cvx-item' + (_openItem === key ? ' open' : '') + '" data-id="' + esc(key) + '" data-kind="' + kind + '">' +
      '<button type="button" class="cvx-row" aria-expanded="' + (_openItem === key) + '"><span class="cvx-ph" style="' + esc(ph(it)) + '"></span>' +
      '<span class="cvx-nm"><span>' + esc(it.title) + '</span>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span>' +
      '<span class="cvx-when ' + cls + '">' + esc(w) + '</span></button>' +
      '<div class="cvx-det">' + (_openItem === key ? detailsHtml(kind, e) : '') + '</div></div>';
  }
  function visible() {
    if (!_data || !role()) return false;
    var ob = document.getElementById('onboarding'); if (ob && !ob.hidden && getComputedStyle(ob).display !== 'none') return false;
    var gate = document.getElementById('gateScreen'); if (gate && gate.offsetParent !== null && getComputedStyle(gate).display !== 'none') return false;
    if (document.querySelector('.cv-ov.open')) return false;
    /* a family member in focus shows Sentinel's Communication panel here instead */
    var f = (typeof focusedContactId !== 'undefined') ? focusedContactId : null;
    if (f != null && !/^cvp:/.test(String(f))) return false;
    return true;
  }
  var _ls = null, _html = '';
  function render() {
    if (!_data) { box.classList.remove('show'); box.innerHTML = ''; _html = ''; return; }
    _ls = lists();
    var html = TABS.map(function (T) {
      var k = T[0], arr = _ls[k], top = arr[0], hint = '', hc = '';
      if (k === 'med' && top) { var lateN = arr.filter(function (e) { return e.n.state === 'late'; }).length; hc = top.n.state === 'late' ? 'late' : top.n.state === 'due' ? 'due' : ''; hint = lateN > 1 ? lateN + ' ' + t('late') : (top.n.state === 'off' || top.n.state === 'done') && !isFinite(top.n.at) ? '' : (hc ? '' : t('next') + ' ') + nextLabel(top.n); }
      else if (top) { hc = top.n.state === 'due' ? 'due' : ''; hint = k === 'appt' ? dayLabel(top.it.at).toUpperCase() + ' ' + hhmm(top.it.at) : dayLabel(top.it.at).toUpperCase(); }
      var head = '<button type="button" class="cvx-tab" data-tab="' + k + '" aria-expanded="' + (_open === k) + '"><span class="cvx-dot ' + hc + '"></span><b>' + esc(t(T[1])) + '</b>' +
        '<span class="cvx-hint ' + hc + '">' + esc(arr.length ? hint : '') + '</span><span class="cvx-chev" aria-hidden="true">›</span></button>';
      if (_open !== k) return head;
      var body = arr.map(function (e) { return rowHtml(k, e); }).join('') || '<div class="cvx-empty">' + esc(t('none')) + '</div>';
      if (_data.s.edit) body += '<button type="button" class="cvx-add" data-add="' + k + '">' + esc(t(T[2])) + '</button>';
      return head + '<div class="cvx-list" role="list">' + body + '</div>';
    }).join('');
    if (html !== _html) { var sc = box.querySelector('.cvx-list'); var top0 = sc ? sc.scrollTop : 0; box.innerHTML = html; _html = html; bind(); var sc2 = box.querySelector('.cvx-list'); if (sc2) sc2.scrollTop = top0; }
    box.classList.toggle('show', visible());
    box.classList.toggle('is-open', !!_open);
  }
  function entry(id) { var all = _ls ? _ls.med.concat(_ls.appt, _ls.sub) : []; return all.filter(function (e) { return e.it.id === id; })[0]; }
  function bind() {
    box.querySelectorAll('[data-tab]').forEach(function (b) { b.onclick = function () { var k = b.getAttribute('data-tab'); _open = _open === k ? '' : k; _openItem = ''; render(); }; });
    box.querySelectorAll('[data-add]').forEach(function (b) { b.onclick = function () { openEdit(b.getAttribute('data-add')); }; });
    box.querySelectorAll('.cvx-item').forEach(function (el) {
      var id = el.getAttribute('data-id'), kind = el.getAttribute('data-kind');
      el.querySelector('.cvx-row').onclick = function () { _openItem = _openItem === id ? '' : id; render(); };
      var e = entry(id); if (!e) return;
      var p = el.querySelector('[data-a=photo]'); if (p) p.onclick = function () { openPhoto(e.it); };
      var ed = el.querySelector('[data-a=edit]'); if (ed) ed.onclick = function () { openEdit(kind, e.it); };
      var mk = el.querySelector('[data-a=mark]'); if (mk) mk.onclick = async function () {
        mk.disabled = true;
        var r = await api('/care/items/' + encodeURIComponent(id) + '/mark', { method: 'POST', body: Object.assign({ slot: kind === 'appt' ? 'appt' : e.n.slot }, _data.s.home ? { home: _data.s.home } : {}) }).catch(function () { return { ok: false }; });
        if (r.ok) load(); else mk.disabled = false;
      };
      el.querySelectorAll('[data-fb]').forEach(function (b) {
        b.onclick = async function () {
          var r = await api('/care/items/' + encodeURIComponent(id) + '/feedback', { method: 'POST', body: { answer: b.getAttribute('data-fb') } }).catch(function () { return { ok: false }; });
          if (r.ok) { e.it.feedback = [r.data.feedback].concat(e.it.feedback || []); _html = ''; render(); }
        };
      });
    });
  }

  /* ── the dream picture: what is highlighted, or the medicine that is due ── */
  var _imgs = {};
  function img(url) {
    if (!url) return null;
    var o = _imgs[url];
    if (!o) { o = _imgs[url] = { img: new Image(), isVideo: false, ok: false }; o.img.onload = function () { o.ok = true; }; o.img.src = url; }
    return o.ok ? o : null;
  }
  function dreamItem() {
    if (!_data || !_ls) return null;
    if (_openItem) { var e = entry(_openItem); if (e && e.it.photo) return e.it; }
    var due = _ls.med.filter(function (x) { return (x.n.state === 'late' || x.n.state === 'due') && x.it.photo; })[0];
    return due ? due.it : null;
  }
  window.CovaraDream = function (focusId) {
    if (focusId != null && !/^cvp:/.test(String(focusId))) return null;
    var it = dreamItem(); return it ? img(photoUrl(it.photo)) : null;
  };
  window.CovaraDreamWanted = function () { return !!dreamItem(); };

  /* ── the doctors and the people HOME sees are spheres joined to HOME ── */
  var _people = [], _psig = '';
  function syncSpheres() {
    var out = {}, now = Date.now();
    if (_data) {
      _data.items.forEach(function (i) {
        var m = i.meta || {};
        if (i.kind === 'appt' && m.with && i.at && i.at > now - 6 * 3600e3) {
          var k = m.with.trim().toLowerCase(); var o = out[k] || (out[k] = { name: m.with.trim(), next: Infinity });
          o.next = Math.min(o.next, i.at);
        }
        if ((i.kind === 'med' || i.kind === 'check') && m.prescriber) { var k2 = m.prescriber.trim().toLowerCase(); if (!out[k2]) out[k2] = { name: m.prescriber.trim(), next: Infinity }; }
      });
    }
    _people = Object.keys(out).map(function (k) {
      var o = out[k], w = o.name.replace(/[^\p{L}\p{N}\s]/gu, ' ').trim().split(/\s+/);
      var soon = isFinite(o.next) && o.next - now < 864e5;
      return { id: 'cvp:' + k, first: w[0] || '', last: w[1] || '\u200b', cvTitle: o.name, cat: 'professional', sev: soon ? 2 : 4, phone: '', email: '',
        cvItem: { kind: 'person', name: o.name }, cvHeadline: isFinite(o.next) ? dayLabel(o.next).toUpperCase() + ' ' + hhmm(o.next) : '' };
    });
    var sig = _people.map(function (p) { return p.id + p.cvHeadline + p.sev; }).join('|') + role();
    if (sig !== _psig) { _psig = sig; try { if (typeof buildNodes === 'function') buildNodes(false); } catch (e) {} }
  }
  function source(list) {
    if (!role()) return list;
    var h = homeContact();
    return (list || []).filter(function (c) { return !(h && c.id === h.id); }).concat(_people);
  }
  /* A double tap on a doctor's sphere opens Appointments at their next visit. */
  function openNode(contact) {
    var n = contact && contact.cvItem; if (!n) return false;
    if (n.kind === 'person' && _ls) {
      var e = _ls.appt.filter(function (x) { return (x.it.meta || {}).with && x.it.meta.with.trim().toLowerCase() === n.name.toLowerCase(); })[0];
      if (e) { _open = 'appt'; _openItem = e.it.id; }
      else { var m = _ls.med.filter(function (x) { return ((x.it.meta || {}).prescriber || '').trim().toLowerCase() === n.name.toLowerCase(); })[0]; _open = 'med'; _openItem = m ? m.it.id : ''; }
      try { focusedContactId = null; } catch (err) {}
      render();
    }
    return true;
  }

  /* ── HOME at the centre of AWAY's phone, with Video, Phone, Message, Email ── */
  function centre() {
    var h = homeContact(); if (!h) return null;
    var p = (typeof contactPhotos !== 'undefined') && contactPhotos.get(h.id);
    return { name: ((h.first || '') + ' ' + (h.last || '')).trim(), frame: p && p.img ? p.img : null, w: p ? (p.w || (p.img && p.img.naturalWidth)) : 0, h: p ? (p.h || (p.img && p.img.naturalHeight)) : 0, contact: h };
  }
  var _pillHits = [];
  function pills(ctx, labels, keys, cx, cy, cr, t0) {
    var W = ctx.canvas.width / (window.devicePixelRatio || 1);
    var fs = W < 500 ? 11 : 12, lineH = W < 500 ? 24 : 26, gap = 16, px = 12, py = 5;
    ctx.save();
    ctx.font = '500 ' + fs + 'px -apple-system, system-ui, "Segoe UI", sans-serif';
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    var maxW = 0; labels.forEach(function (l) { maxW = Math.max(maxW, ctx.measureText(l).width); });
    var pw = maxW + px * 2, phh = fs + py * 2;
    var x = cx + cr * 1.12 + gap; if (x + pw > W - 6) x = W - 6 - pw;
    var y0 = cy - (labels.length * lineH) / 2 + lineH / 2;
    var fade = Math.min(1, 0.75 + 0.25 * Math.sin(t0 * 0.004));
    for (var i = 0; i < labels.length; i++) {
      var ly = y0 + i * lineH;
      ctx.globalAlpha = 0.72 * fade; ctx.fillStyle = 'rgba(12,14,24,0.88)';
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, ly - phh / 2, pw, phh, 6); else ctx.rect(x, ly - phh / 2, pw, phh); ctx.fill();
      ctx.globalAlpha = 0.45 * fade; ctx.strokeStyle = 'rgba(100,180,255,0.3)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.globalAlpha = 0.95 * fade; ctx.fillStyle = '#d8e8ff'; ctx.fillText(labels[i], x + pw / 2, ly);
      _pillHits.push({ x: x, y: ly - lineH / 2, w: pw, h: lineH, key: keys[i] });
    }
    ctx.restore();
  }
  function drawCentre(ctx, cx, cy, cr, t0) {
    _pillHits = [];
    if (role() !== 'away' || !homeContact()) return;
    if (typeof IsoView !== 'undefined' && IsoView.active && IsoView.active()) return;
    pills(ctx, [t('video'), t('phone'), t('message'), t('email')], ['video', 'phone', 'sms', 'email'], cx, cy, cr, t0);
  }
  function hitCentre(clientX, clientY) {
    if (!_pillHits.length || typeof CV === 'undefined') return false;
    var r = CV.getBoundingClientRect(), x = clientX - r.left, y = clientY - r.top;
    var h = _pillHits.filter(function (p) { return x >= p.x - 4 && x <= p.x + p.w + 4 && y >= p.y && y <= p.y + p.h; })[0];
    if (!h) return false;
    var c = centre(); if (c && typeof runContactQuickAction === 'function') runContactQuickAction(h.key, c.contact);
    return true;
  }
  function centreSingle() { return role() === 'away' && !!homeContact(); }
  function centreDouble() { var h = homeContact(); if (role() !== 'away' || !h) return false; try { enterDetail(h); } catch (e) {} return true; }

  /* ── sheets ── */
  function sheet(id) {
    var el = document.getElementById(id);
    if (!el) { el = document.createElement('div'); el.id = id; el.className = 'cv-ov'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); document.body.appendChild(el); }
    return el;
  }
  function open(el) { requestAnimationFrame(function () { el.classList.add('open'); }); }
  function close(el) { if (el) el.classList.remove('open'); }
  function openPhoto(it) {
    var el = sheet('cvPhoto');
    el.innerHTML = '<div class="cv-box"><div class="cvt-big" style="' + esc(ph(it)) + '"></div><h2 class="cv-h">' + esc(it.title) + '</h2>' +
      '<div class="cv-row"><button class="cv-btn pri" data-a="close">' + esc(t('cancel')) + '</button></div></div>';
    el.querySelector('[data-a=close]').onclick = function () { close(el); };
    el.onclick = function (e) { if (e.target === el) close(el); };
    open(el);
  }
  function openEdit(kind, it) {
    var el = sheet('cvAdd'); var photo = null; var m = (it && it.meta) || {};
    var times = {}; ((it && it.times) || []).forEach(function (x) { times[x] = true; });
    var other = ((it && it.times) || []).filter(function (x) { return !SLOTS.some(function (s) { return s[1] === x; }); })[0] || '';
    var src = m.source || '';
    var dflt = new Date(Date.now() + 864e5);
    var dv = it && it.at ? new Date(it.at) : dflt;
    var ds = dv.getFullYear() + '-' + String(dv.getMonth() + 1).padStart(2, '0') + '-' + String(dv.getDate()).padStart(2, '0');
    var tv = it && it.at ? String(dv.getHours()).padStart(2, '0') + ':' + String(dv.getMinutes()).padStart(2, '0') : '10:00';
    function inp(id, label, val, type, extra) { return '<div><label for="' + id + '">' + esc(t(label)) + '</label><input type="' + (type || 'text') + '" id="' + id + '" value="' + esc(val || '') + '" autocomplete="off" ' + (extra || '') + '></div>'; }
    var shot = '<button type="button" class="cvt-shot' + (it && it.photo ? ' has' : '') + '" data-shot style="' + (it && it.photo ? esc('background-image:url("' + photoUrl(it.photo).replace(/["\\]/g, '') + '")') : '') + '">' + esc(t('photo')) + '</button><input type="file" accept="image/*" capture="environment" hidden data-file>';
    var f = '';
    if (kind === 'med') {
      f = shot + inp('cvName', 'name', it && it.title, 'text', 'maxlength="120"') +
        '<div class="cvt-two">' + inp('cvStrength', 'strength', m.strength, 'number', 'inputmode="decimal" min="0" step="any"') +
        '<div><label for="cvUnit">' + esc(t('unit')) + '</label><select id="cvUnit">' + UNITS.map(function (u) { return '<option' + ((m.unit || 'mg') === u ? ' selected' : '') + '>' + u + '</option>'; }).join('') + '</select></div></div>' +
        '<div class="cvt-two">' + inp('cvQty', 'qty', m.qty || 1, 'number', 'inputmode="decimal" min="0" step="any"') +
        '<div><label for="cvForm">' + esc(t('form')) + '</label><select id="cvForm">' + FORMS.map(function (x) { return '<option value="' + x + '"' + ((m.form || 'tablet') === x ? ' selected' : '') + '>' + esc(L().forms[x]) + '</option>'; }).join('') + '</select></div></div>' +
        '<label>' + esc(t('when')) + '</label><div class="cvt-chips">' + SLOTS.map(function (s) { return '<button type="button" class="cvt-chip" data-t="' + s[1] + '" aria-pressed="' + !!times[s[1]] + '">' + esc(t(s[0])) + '<small>' + s[1] + '</small></button>'; }).join('') + '</div>' +
        inp('cvOther', 'other', other, 'time') +
        '<div class="cvt-two">' + inp('cvPrescriber', 'prescriber', m.prescriber, 'text', 'maxlength="80"') + inp('cvPrescribedOn', 'prescribedOn', m.prescribed_on, 'date') + '</div>' +
        '<label>' + esc(t('source')) + '</label><div class="cvt-chips">' + ['pharmacy', 'doctor'].map(function (x) { return '<button type="button" class="cvt-chip" data-src="' + x + '" aria-pressed="' + (src === x) + '">' + esc(t(x)) + '</button>'; }).join('') + '</div>' +
        '<div class="cvt-two">' + inp('cvSourceName', 'sourceName', m.source_name, 'text', 'maxlength="120"') + inp('cvSourcePhone', 'sourcePhone', m.source_phone, 'tel', 'maxlength="30"') + '</div>' +
        inp('cvPurpose', 'purpose', m.purpose, 'text', 'maxlength="120"');
    } else if (kind === 'appt') {
      f = shot + inp('cvName', 'apptTitle', it && it.title, 'text', 'maxlength="120"') + inp('cvWith', 'apptWith', m.with, 'text', 'maxlength="80"') +
        '<div class="cvt-two">' + inp('cvDate', 'date', ds, 'date') + inp('cvTime', 'time', tv, 'time') + '</div>' +
        inp('cvPlace', 'place', m.place || (it && it.detail), 'text', 'maxlength="160"') + inp('cvNotes', 'notes', m.notes, 'text', 'maxlength="300"');
    } else {
      f = shot + inp('cvName', 'subTitle', it && it.title, 'text', 'maxlength="120"') + inp('cvProvider', 'provider', m.provider || (it && it.detail), 'text', 'maxlength="120"') +
        '<div class="cvt-two">' + inp('cvDate', 'renews', ds, 'date') + inp('cvEvery', 'every', m.every, 'text', 'maxlength="30"') + '</div>' +
        inp('cvCost', 'cost', m.cost, 'text', 'maxlength="30"');
    }
    var title = kind === 'med' ? 'addMed' : kind === 'appt' ? 'addAppt' : 'addSub';
    el.innerHTML = '<div class="cv-box"><div class="cv-mono">' + esc(it ? t('change') : t(title)) + '</div>' +
      '<div class="cvt-f">' + f + '</div><div class="cv-msg"></div>' +
      '<div class="cv-row"><button class="cv-btn pri" data-a="save">' + esc(t('save')) + '</button><button class="cv-btn" data-a="close">' + esc(t('cancel')) + '</button></div>' +
      (it ? '<div class="cv-row"><button class="cv-btn warn" data-a="rm">' + esc(t('remove')) + '</button></div>' : '') + '</div>';
    el.querySelectorAll('[data-t]').forEach(function (b) { b.onclick = function () { var v = b.getAttribute('data-t'); times[v] = !times[v]; b.setAttribute('aria-pressed', times[v] ? 'true' : 'false'); }; });
    el.querySelectorAll('[data-src]').forEach(function (b) { b.onclick = function () { src = src === b.getAttribute('data-src') ? '' : b.getAttribute('data-src'); el.querySelectorAll('[data-src]').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-src') === src ? 'true' : 'false'); }); }; });
    var shotB = el.querySelector('[data-shot]'), file = el.querySelector('[data-file]');
    shotB.onclick = function () { file.click(); };
    var read = {};
    file.onchange = function () {
      var x = file.files && file.files[0]; if (!x) return; photo = x; shotB.classList.add('has'); shotB.style.backgroundImage = 'url(' + URL.createObjectURL(x) + ')';
      if (kind === 'med' && window.CovaraLabel) readLabel(x);
    };
    /* The optic reader: the label's text, sorted into the empty fields, each one marked gold to check. */
    async function readLabel(x) {
      var msg = el.querySelector('.cv-msg'); msg.className = 'cv-msg info'; msg.textContent = t('reading');
      var r = null; try { r = await window.CovaraLabel.read(x); } catch (e) { r = null; }
      var f = r && r.fields || {}; read = f;
      function put(id, val) { var i = el.querySelector('#' + id); if (!i || val == null || val === '' || String(i.value || '').trim()) return; i.value = val; i.classList.add('cvt-read'); }
      function sel(id, val) { var i = el.querySelector('#' + id); if (!i || !val) return; if ([].some.call(i.options, function (o) { return o.value === String(val); })) { i.value = String(val); i.classList.add('cvt-read'); } }
      put('cvName', f.title); put('cvStrength', f.strength); sel('cvUnit', f.unit); if (f.qty) { var q = el.querySelector('#cvQty'); if (q) { q.value = f.qty; q.classList.add('cvt-read'); } } sel('cvForm', f.form);
      put('cvPrescriber', f.prescriber); put('cvPrescribedOn', f.prescribed_on); put('cvSourceName', f.source_name); put('cvSourcePhone', f.source_phone); put('cvPurpose', f.purpose);
      if (f.source && !src) { src = f.source; el.querySelectorAll('[data-src]').forEach(function (b) { var on = b.getAttribute('data-src') === src; b.setAttribute('aria-pressed', on ? 'true' : 'false'); if (on) b.classList.add('cvt-read'); }); }
      if (f.times && f.times.length && !Object.keys(times).some(function (k) { return times[k]; })) {
        f.times.forEach(function (hm) {
          var chip = el.querySelector('[data-t="' + hm + '"]');
          if (chip) { times[hm] = true; chip.setAttribute('aria-pressed', 'true'); chip.classList.add('cvt-read'); }
          else { var o = el.querySelector('#cvOther'); if (o && !o.value) { o.value = hm; o.classList.add('cvt-read'); } }
        });
      }
      var got = Object.keys(f).length;
      msg.className = 'cv-msg' + (got ? ' info' : ''); msg.textContent = got ? t('readOk') : t('readNone');
    }
    el.querySelector('[data-a=close]').onclick = function () { close(el); };
    var rm = el.querySelector('[data-a=rm]'); if (rm) rm.onclick = async function () {
      var r = await api('/care/items/' + encodeURIComponent(it.id), { method: 'DELETE' }).catch(function () { return { ok: false }; });
      if (r.ok) { close(el); _openItem = ''; load(); } else el.querySelector('.cv-msg').textContent = t('failed');
    };
    function v(id) { var x = el.querySelector('#' + id); return x ? String(x.value || '').trim() : ''; }
    el.querySelector('[data-a=save]').onclick = async function () {
      var msg = el.querySelector('.cv-msg'); msg.textContent = '';
      var name = v('cvName'); if (!name) { msg.textContent = t('needName'); return; }
      var body = { kind: kind, title: name, meta: {} };
      if (_data && _data.s.home) body.home = _data.s.home;
      if (kind === 'med') {
        var ts = Object.keys(times).filter(function (k) { return times[k]; }); if (v('cvOther') && ts.indexOf(v('cvOther')) < 0) ts.push(v('cvOther'));
        if (!ts.length) { msg.textContent = t('needTime'); return; }
        body.times = ts;
        body.meta = { strength: v('cvStrength') || undefined, unit: v('cvUnit') || undefined, qty: v('cvQty') || undefined, form: v('cvForm') || undefined,
          prescriber: v('cvPrescriber') || undefined, prescribed_on: v('cvPrescribedOn') || undefined, source: src || undefined,
          source_name: v('cvSourceName') || undefined, source_phone: v('cvSourcePhone') || undefined, purpose: v('cvPurpose') || undefined,
          dispensed: read.dispensed || m.dispensed || undefined, refills: read.refills != null ? read.refills : m.refills };
      } else {
        var d = v('cvDate'), tm = kind === 'appt' ? v('cvTime') : '09:00';
        if (!d || !tm) { msg.textContent = t('needWhen'); return; }
        body.at = new Date(d + 'T' + tm).getTime();
        body.meta = kind === 'appt' ? { with: v('cvWith') || undefined, place: v('cvPlace') || undefined, notes: v('cvNotes') || undefined }
          : { provider: v('cvProvider') || undefined, every: v('cvEvery') || undefined, cost: v('cvCost') || undefined };
      }
      var sb = el.querySelector('[data-a=save]'); sb.disabled = true; sb.textContent = t('saving');
      try {
        if (photo) {
          var fd = new FormData(); fd.append('file', photo, 'care-' + Date.now() + '.jpg'); fd.append('blob_type', 'photo');
          var up = await api('/storage/upload', { method: 'POST', body: fd });
          if (up.ok && up.data.id && up.data.file_size > 0) body.photo = up.data.id;
        }
        var r = await api('/care/items' + (it ? '/' + encodeURIComponent(it.id) : ''), { method: it ? 'PUT' : 'POST', body: body });
        if (!r.ok) throw new Error(r.status);
        close(el); _open = kind; _openItem = r.data.item ? r.data.item.id : _openItem; load();
      } catch (e) { msg.textContent = t('failed'); sb.disabled = false; sb.textContent = t('save'); }
    };
    open(el);
  }

  /* ── keep it current ── */
  var _subj = '';
  function tick() {
    var s = subject(); var k = s ? (s.home || 'me') + ':' + s.edit : '';
    if (k !== _subj) { _subj = k; _open = ''; _openItem = ''; _data = null; if (k) load(); else { render(); syncSpheres(); } }
    if (_data) { box.classList.toggle('show', visible()); }
  }
  function boot() {
    if (!window.CovaraCare || !authed()) { setTimeout(boot, 1000); return; }
    if (role() === 'home') { try { api('/care/state', { method: 'POST', body: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } }); } catch (e) {} }
    setInterval(tick, 500);
    setInterval(function () { if (_subj) load(); }, 60000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden && _subj) load(); });
    window.addEventListener('localeChanged', function () { _html = ''; render(); syncSpheres(); });
  }
  window.CovaraView = { source: source, centre: centre, drawCentre: drawCentre, hitCentre: hitCentre, centreSingle: centreSingle, centreDouble: centreDouble,
    openNode: openNode, load: load, openEdit: openEdit, open: function (k, id) { _open = k || ''; _openItem = id || ''; render(); }, data: function () { return _data; }, lists: function () { return _ls; } };
  setTimeout(boot, 1500);
})();
