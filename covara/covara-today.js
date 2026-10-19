/* Remiel: Covara, module 2: Appointments, Medications, Subscriptions.
   A floating list on the left of HOME's sphere. On HOME's phone it is
   always there; on AWAY's phone it appears while HOME's sphere is in focus
   and HOME shares their care. Every medicine is shown by its own name and
   the photo HOME took of it. A row fades in when it is due and fades out
   once it is done.
   Beverly Index LLC */
(function () {
  'use strict';
  var STR = {
    en: {
      appts: 'Appointments', meds: 'Medications', subs: 'Subscriptions',
      add: 'Add', addMed: 'Add a medicine', addAppt: 'Add an appointment', addSub: 'Add a subscription',
      now: 'Now', late: 'Late', later: 'Later', taken: 'Taken', done: 'Done', today: 'Today', tomorrow: 'Tomorrow',
      renews: 'Renews', nothing: 'Nothing for today yet',
      photo: 'Take a photo of it', rephoto: 'Take a new photo',
      name: 'Name, as on the box', apptName: 'Who and what', subName: 'What it is',
      dose: 'How much (for example 1 tablet)', place: 'Where (optional)', subDetail: 'Who sends it (optional)',
      when: 'When', date: 'Date', time: 'Time', next: 'Next renewal',
      morning: 'Morning', midday: 'Midday', evening: 'Evening', night: 'Night', other: 'Other time',
      save: 'Save', cancel: 'Cancel', remove: 'Remove', markTaken: 'Mark taken', markDone: 'Mark done', undo: 'Not taken',
      needName: 'Write its name first.', needTime: 'Choose at least one time.', needWhen: 'Choose the date and time.',
      failed: 'Could not save. Check the internet and try again.', saving: 'Saving'
    },
    it: {
      appts: 'Appuntamenti', meds: 'Medicine', subs: 'Abbonamenti',
      add: 'Aggiungi', addMed: 'Aggiungi una medicina', addAppt: 'Aggiungi un appuntamento', addSub: 'Aggiungi un abbonamento',
      now: 'Ora', late: 'In ritardo', later: 'Dopo', taken: 'Presa', done: 'Fatto', today: 'Oggi', tomorrow: 'Domani',
      renews: 'Rinnovo', nothing: 'Ancora niente per oggi',
      photo: 'Fai una foto', rephoto: 'Nuova foto',
      name: 'Nome, come sulla scatola', apptName: 'Chi e cosa', subName: 'Che cos’è',
      dose: 'Quanto (per esempio 1 compressa)', place: 'Dove (facoltativo)', subDetail: 'Chi lo invia (facoltativo)',
      when: 'Quando', date: 'Data', time: 'Ora', next: 'Prossimo rinnovo',
      morning: 'Mattina', midday: 'Mezzogiorno', evening: 'Sera', night: 'Notte', other: 'Altro orario',
      save: 'Salva', cancel: 'Annulla', remove: 'Rimuovi', markTaken: 'Segna presa', markDone: 'Segna fatto', undo: 'Non presa',
      needName: 'Scrivi prima il nome.', needTime: 'Scegli almeno un orario.', needWhen: 'Scegli data e ora.',
      failed: 'Non salvato. Controlla internet e riprova.', saving: 'Salvataggio'
    }
  };
  var SLOTS = [['morning', '08:00'], ['midday', '13:00'], ['evening', '18:00'], ['night', '22:00']];
  function L() { var l = (window.I18n && I18n.locale) || 'en'; return STR[String(l).slice(0, 2)] || STR.en; }
  function t(k) { return L()[k] || STR.en[k] || k; }
  function loc() { return (window.I18n && I18n.locale) || 'en'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function authed() { try { return typeof SyncEngine !== 'undefined' && SyncEngine.isAuthenticated(); } catch (e) { return false; } }
  function base() { try { return SyncEngine.getStatus().apiBase || ''; } catch (e) { return ''; } }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
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
  function orbOf(title) {
    var h = 0; String(title || '').split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) % 360; });
    return 'radial-gradient(circle at 34% 28%,#fff 0,hsl(' + h + ',90%,82%) 10%,hsl(' + h + ',80%,55%) 45%,hsl(' + h + ',75%,26%) 100%)';
  }

  var css = '' +
    '#cvToday{position:fixed;left:24px;top:310px;width:300px;max-height:max(220px,calc(100vh - 500px));-webkit-mask-image:linear-gradient(#000 88%,transparent);mask-image:linear-gradient(#000 88%,transparent);padding-bottom:18px;overflow:hidden auto;z-index:60;pointer-events:none;font-family:"Hanken Grotesk",system-ui,sans-serif;color:#e8eef8;opacity:0;transform:translateX(-12px);transition:opacity .5s ease,transform .5s ease;scrollbar-width:none}' +
    '#cvToday::-webkit-scrollbar{display:none}' +
    '#cvToday.show{opacity:1;transform:none}#cvToday.show>*{pointer-events:auto}' +
    'body.rs-overlay-open #cvToday,body.cv-asking #cvToday{opacity:0 !important;pointer-events:none}' +
    '.cvt-sec{margin:0 0 14px}' +
    '.cvt-hd{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 6px;padding-left:4px}' +
    '.cvt-hd b{font:600 11px "JetBrains Mono",monospace;letter-spacing:.18em;color:#5fd0ff;text-transform:uppercase}' +
    '.cvt-add{background:none;border:0;color:#8ea3bf;font:600 12px "Hanken Grotesk",sans-serif;cursor:pointer;padding:4px 6px;border-radius:8px}' +
    '.cvt-add:hover{color:#eaf9ff}.cvt-add:focus-visible{outline:2px solid #C5A55A}' +
    '.cvt-row{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:linear-gradient(90deg,rgba(14,22,36,.88),rgba(14,22,36,.55));border:1px solid rgba(255,255,255,.07);border-radius:28px;padding:5px 14px 5px 5px;margin:0 0 6px;color:inherit;font:inherit;cursor:pointer;' +
      'animation:cvtIn .6s ease both;transition:opacity .9s ease,max-height .9s ease,margin .9s ease,padding .9s ease;max-height:80px;overflow:hidden}' +
    '@keyframes cvtIn{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:none}}' +
    '.cvt-row.gone{opacity:0;max-height:0;margin:0;padding-top:0;padding-bottom:0;border-width:0}' +
    '.cvt-row:focus-visible{outline:2px solid #C5A55A}' +
    '.cvt-ph{flex:0 0 auto;width:42px;height:42px;border-radius:50%;background-size:cover;background-position:center;box-shadow:0 0 0 2px rgba(120,200,255,.25),inset 0 -6px 12px rgba(0,0,0,.35)}' +
    '.cvt-tx{min-width:0;flex:1}' +
    '.cvt-nm{display:block;font-weight:700;font-size:15px;color:#f3f8ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.cvt-sb{display:block;font-size:12px;color:#8ea3bf;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.cvt-st{flex:0 0 auto;font:600 10px "JetBrains Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:#8ea3bf}' +
    '.cvt-row.due{border-color:rgba(255,200,90,.6);box-shadow:0 0 22px rgba(255,190,60,.22)}.cvt-row.due .cvt-st{color:#ffd27a}' +
    '.cvt-row.due .cvt-ph{box-shadow:0 0 0 2px #ffcc66,0 0 16px rgba(255,190,60,.6)}' +
    '.cvt-row.late{border-color:rgba(248,113,113,.65);box-shadow:0 0 22px rgba(248,113,113,.22)}.cvt-row.late .cvt-st{color:#fca5a5}' +
    '.cvt-row.late .cvt-ph{box-shadow:0 0 0 2px #f87171,0 0 16px rgba(248,113,113,.6)}' +
    '.cvt-row.done{opacity:.55}.cvt-row.done .cvt-st{color:#86efac}' +
    '.cvt-empty{font-size:13px;color:#8ea3bf;padding:4px}' +
    '.cvt-addtile{display:none}' +
    /* phones: one row of pictures above the bottom buttons, swiped sideways */
    '@media (max-width:700px){#cvToday{left:0;right:0;top:auto;bottom:178px;width:auto;max-height:none;display:flex;gap:10px;overflow-x:auto;overflow-y:hidden;padding:4px 12px 6px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 12px,#000 calc(100% - 24px),transparent);mask-image:linear-gradient(90deg,transparent,#000 12px,#000 calc(100% - 24px),transparent);scroll-snap-type:x proximity}' +
      '.cvt-sec{display:contents}.cvt-hd{display:none}' +
      '.cvt-row{flex:0 0 80px;flex-direction:column;gap:4px;text-align:center;padding:6px 3px 6px;border-radius:20px;max-height:none;margin:0;scroll-snap-align:start;background:rgba(10,16,28,.82)}' +
      '.cvt-ph{width:48px;height:48px}.cvt-tx{width:100%}.cvt-nm{font-size:12px}.cvt-sb{font-size:10.5px}.cvt-st{font-size:9px}' +
      '.cvt-row.gone{flex-basis:0;padding:0;opacity:0}' +
      '.cvt-addtile{display:flex;flex:0 0 80px;flex-direction:column;align-items:center;justify-content:center;gap:6px;border-radius:20px;border:1px dashed rgba(95,208,255,.45);background:rgba(10,16,28,.6);color:#5fd0ff;font:600 12.5px "Hanken Grotesk",sans-serif;cursor:pointer}}' +
    /* the add and detail sheets */
    '.cvt-f{display:flex;flex-direction:column;gap:12px;text-align:left;margin-top:16px}' +
    '.cvt-f label{font:600 11px "JetBrains Mono",monospace;letter-spacing:.14em;color:#5fd0ff;text-transform:uppercase}' +
    '.cvt-f input[type=text],.cvt-f input[type=date],.cvt-f input[type=time]{width:100%;box-sizing:border-box;min-height:48px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(10,14,22,.9);color:#f1f6ff;font:500 16px "Hanken Grotesk",sans-serif;padding:0 14px;color-scheme:dark}' +
    '.cvt-f input:focus{outline:2px solid #38bdf8;outline-offset:1px}' +
    '.cvt-two{display:flex;gap:10px}.cvt-two>*{flex:1}' +
    '.cvt-shot{align-self:center;position:relative;width:150px;height:150px;border-radius:50%;border:0;cursor:pointer;background:radial-gradient(circle at 34% 28%,#3a4558 0,#1b2230 55%,#0c1018 100%);box-shadow:0 0 0 2px rgba(120,200,255,.35),0 0 40px rgba(56,189,248,.25);color:#cfe7ff;font:600 13px "Hanken Grotesk",sans-serif;padding:0 18px;background-size:cover;background-position:center}' +
    '.cvt-shot.has{color:transparent}.cvt-shot:focus-visible{outline:2px solid #C5A55A}' +
    '.cvt-chips{display:flex;flex-wrap:wrap;gap:8px}' +
    '.cvt-chip{min-height:40px;padding:0 14px;border-radius:20px;border:1px solid rgba(255,255,255,.16);background:transparent;color:#b9c6d8;font:600 13px "Hanken Grotesk",sans-serif;cursor:pointer}' +
    '.cvt-chip small{display:block;font:500 10px "JetBrains Mono",monospace;opacity:.8}' +
    '.cvt-chip[aria-pressed="true"]{border-color:#38bdf8;background:#38bdf8;color:#04121a}' +
    '.cvt-kinds{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}' +
    '.cvt-big{width:min(220px,60vw);aspect-ratio:1;border-radius:50%;margin:6px auto 4px;background-size:cover;background-position:center;box-shadow:0 0 0 2px rgba(120,200,255,.35),0 0 60px rgba(56,189,248,.35)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var box = document.createElement('div'); box.id = 'cvToday'; box.setAttribute('aria-live', 'polite');
  document.body.appendChild(box);

  /* Whose care is on screen: HOME's own on HOME's phone; the focused HOME on AWAY's phone. */
  function subject() {
    if (role() === 'home') return { home: null, edit: true, name: '' };
    var f = (typeof focusedContactId !== 'undefined') ? focusedContactId : null;
    if (f == null || typeof DEMO_CONTACTS === 'undefined') return null;
    var c = DEMO_CONTACTS.filter(function (x) { return x.id === f; })[0];
    if (!c || !c.care || c.care.side !== 'home' || c.care.state !== 'active' || !(c.care.share && c.care.share.care)) return null;
    return { home: c.care.userId, edit: true, name: c.first };
  }
  function q(s) { return s && s.home ? '?home=' + encodeURIComponent(s.home) : ''; }

  var _data = null, _key = '', _busy = false, _gone = {};
  async function load(force) {
    var s = subject();
    var key = s ? (s.home || 'me') : '';
    if (!s || !authed()) { _data = null; _key = ''; paint(); return; }
    if (_busy) return; _busy = true;
    try {
      var a = await api('/care/today' + q(s)), b = await api('/care/items' + q(s));
      if (a.ok && b.ok) { _data = { s: s, today: a.data, items: b.data.items || [] }; _key = key; }
    } catch (e) {} finally { _busy = false; }
    paint();
  }

  function row(o) {
    var ph = o.photo ? 'background-image:url("' + photoUrl(o.photo).replace(/["\\]/g, '') + '")' : 'background:' + orbOf(o.title);
    return '<button class="cvt-row ' + o.cls + '" data-id="' + esc(o.id) + '" data-slot="' + esc(o.slot || '') + '">' +
      '<span class="cvt-ph" style="' + esc(ph) + '"></span>' +
      '<span class="cvt-tx"><span class="cvt-nm">' + esc(o.title) + '</span><span class="cvt-sb">' + esc(o.sub) + '</span></span>' +
      '<span class="cvt-st">' + esc(o.state) + '</span></button>';
  }
  function section(key, rows, kind) {
    var add = _data && _data.s.edit ? '<button class="cvt-add" data-add="' + kind + '">' + esc(t('add')) + '</button>' : '';
    return '<div class="cvt-sec"><div class="cvt-hd"><b>' + esc(t(key)) + '</b>' + add + '</div>' + (rows.join('') || '') + '</div>';
  }
  function paint() {
    var show = !!_data && (role() === 'home' ? true : !!subject());
    try { if (show && document.getElementById('onboarding') && !document.getElementById('onboarding').hidden && getComputedStyle(document.getElementById('onboarding')).display !== 'none') show = false; } catch (e) {}
    if (!show) { box.classList.remove('show'); return; }
    var now = Date.now(), d = _data;
    var stLabel = { due: t('now'), late: t('late'), later: t('later'), done: t('taken') };
    /* appointments: the coming two weeks, today's state from /today */
    var todayAppt = {}; (d.today.items || []).forEach(function (x) { if (x.slot === 'appt') todayAppt[x.item.id] = x.state; });
    var appts = d.items.filter(function (i) { return i.kind === 'appt' && i.at && i.at > now - 3 * 3600e3 && i.at < now + 14 * 864e5; })
      .sort(function (a, b) { return a.at - b.at; }).slice(0, 4).map(function (i) {
        var s = todayAppt[i.id] || 'later'; if (s === 'done' && _gone['a' + i.id]) return '';
        return row({ id: i.id, slot: 'appt', title: i.title, photo: i.photo, cls: s === 'due' ? 'due' : s === 'done' ? 'done' : '', sub: dayLabel(i.at) + ', ' + hhmm(i.at) + (i.detail ? ' · ' + i.detail : ''), state: s === 'done' ? t('done') : s === 'due' ? t('now') : '' });
      });
    var meds = (d.today.items || []).filter(function (x) { return x.item.kind === 'med' || x.item.kind === 'check'; }).map(function (x) {
      if (x.state === 'done' && _gone[x.item.id + '|' + x.slot]) return '';
      return row({ id: x.item.id, slot: x.slot, title: x.item.title, photo: x.item.photo, cls: x.state, sub: x.slot + (x.item.detail ? ' · ' + x.item.detail : ''), state: stLabel[x.state] || '' });
    });
    var subs = d.items.filter(function (i) { return i.kind === 'sub'; }).sort(function (a, b) { return (a.at || 0) - (b.at || 0); }).slice(0, 4).map(function (i) {
      var soon = i.at && i.at - now < 3 * 864e5;
      return row({ id: i.id, slot: 'sub', title: i.title, photo: i.photo, cls: soon ? 'due' : '', sub: t('renews') + ' ' + dayLabel(i.at) + (i.detail ? ' · ' + i.detail : ''), state: '' });
    });
    var html = '';
    html += section('appts', appts, 'appt') + section('meds', meds, 'med') + section('subs', subs, 'sub');
    if (d.s.edit) html += '<button class="cvt-addtile" data-add="med">' + esc(t('add')) + '</button>';
    box.innerHTML = html;
    box.querySelectorAll('[data-add]').forEach(function (b) { b.onclick = function () { openAdd(b.getAttribute('data-add')); }; });
    box.querySelectorAll('.cvt-row').forEach(function (b) { b.onclick = function () { openItem(b.getAttribute('data-id'), b.getAttribute('data-slot')); }; });
    /* rows already done fade out a moment after they appear */
    box.querySelectorAll('.cvt-row.done').forEach(function (r) {
      var k = r.getAttribute('data-slot') === 'appt' ? 'a' + r.getAttribute('data-id') : r.getAttribute('data-id') + '|' + r.getAttribute('data-slot');
      setTimeout(function () { r.classList.add('gone'); _gone[k] = 1; }, 2500);
    });
    box.classList.add('show');
  }

  /* ── sheets ── */
  function sheet(id) {
    var el = document.getElementById(id);
    if (!el) { el = document.createElement('div'); el.id = id; el.className = 'cv-ov'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); document.body.appendChild(el); }
    return el;
  }
  function open(el) { requestAnimationFrame(function () { el.classList.add('open'); }); }
  function close(el) { if (el) el.classList.remove('open'); }
  function findItem(id) { return _data && _data.items.filter(function (i) { return i.id === id; })[0]; }

  function openItem(id, slot) {
    var it = findItem(id); if (!it) return;
    var el = sheet('cvItem');
    var x = (_data.today.items || []).filter(function (y) { return y.item.id === id && y.slot === slot; })[0];
    var big = it.photo ? 'background-image:url("' + photoUrl(it.photo).replace(/["\\]/g, '') + '")' : 'background:' + orbOf(it.title);
    var when = it.kind === 'med' || it.kind === 'check' ? it.times.join(' · ') : it.at ? dayLabel(it.at) + ', ' + hhmm(it.at) : '';
    var canMark = x && x.state !== 'done' && (it.kind === 'med' || it.kind === 'check' || it.kind === 'appt');
    el.innerHTML = '<div class="cv-box"><div class="cv-mono">' + esc(t(it.kind === 'appt' ? 'appts' : it.kind === 'sub' ? 'subs' : 'meds')) + '</div>' +
      '<div class="cvt-big" style="' + esc(big) + '"></div><h2 class="cv-h">' + esc(it.title) + '</h2>' +
      '<p class="cv-sub">' + esc(when) + (it.detail ? '<br>' + esc(it.detail) : '') + '</p>' +
      '<div class="cv-msg"></div><div class="cv-row">' +
      (canMark ? '<button class="cv-btn pri" data-a="mark">' + esc(it.kind === 'appt' ? t('markDone') : t('markTaken')) + '</button>' : '') +
      (x && x.state === 'done' ? '<button class="cv-btn" data-a="undo">' + esc(t('undo')) + '</button>' : '') +
      '<button class="cv-btn" data-a="close">' + esc(t('cancel')) + '</button></div>' +
      (_data.s.edit ? '<div class="cv-row"><button class="cv-btn warn" data-a="rm">' + esc(t('remove')) + '</button></div>' : '') + '</div>';
    var msg = el.querySelector('.cv-msg');
    el.querySelector('[data-a=close]').onclick = function () { close(el); };
    var mk = el.querySelector('[data-a=mark]'); if (mk) mk.onclick = async function () {
      var r = await api('/care/items/' + encodeURIComponent(id) + '/mark', { method: 'POST', body: { slot: slot } }).catch(function () { return { ok: false }; });
      if (!r.ok) { msg.textContent = t('failed'); return; }
      close(el); _data.today = r.data; paint();
    };
    var un = el.querySelector('[data-a=undo]'); if (un) un.onclick = async function () {
      var r = await api('/care/items/' + encodeURIComponent(id) + '/mark', { method: 'POST', body: { slot: slot, done: false } }).catch(function () { return { ok: false }; });
      if (!r.ok) { msg.textContent = t('failed'); return; }
      delete _gone[id + '|' + slot]; delete _gone['a' + id]; close(el); _data.today = r.data; paint();
    };
    var rm = el.querySelector('[data-a=rm]'); if (rm) rm.onclick = async function () {
      var r = await api('/care/items/' + encodeURIComponent(id), { method: 'DELETE' }).catch(function () { return { ok: false }; });
      if (!r.ok) { msg.textContent = t('failed'); return; }
      close(el); load(true);
    };
    open(el);
  }

  function openAdd(kind) {
    var el = sheet('cvAdd'); var photo = null; var times = {};
    var kinds = [['med', 'addMed'], ['appt', 'addAppt'], ['sub', 'addSub']];
    function fields() {
      if (kind === 'med') return '<button type="button" class="cvt-shot" data-shot>' + esc(t('photo')) + '</button>' +
        '<input type="file" accept="image/*" capture="environment" hidden data-file>' +
        '<label for="cvtName">' + esc(t('name')) + '</label><input type="text" id="cvtName" autocomplete="off" maxlength="120">' +
        '<label for="cvtDose">' + esc(t('dose')) + '</label><input type="text" id="cvtDose" autocomplete="off" maxlength="200">' +
        '<label>' + esc(t('when')) + '</label><div class="cvt-chips">' + SLOTS.map(function (s) { return '<button type="button" class="cvt-chip" data-t="' + s[1] + '" aria-pressed="false">' + esc(t(s[0])) + '<small>' + s[1] + '</small></button>'; }).join('') + '</div>' +
        '<label for="cvtOther">' + esc(t('other')) + '</label><input type="time" id="cvtOther">';
      var tomorrow = new Date(Date.now() + 864e5); var ds = tomorrow.toISOString().slice(0, 10);
      if (kind === 'appt') return '<button type="button" class="cvt-shot" data-shot>' + esc(t('photo')) + '</button><input type="file" accept="image/*" capture="environment" hidden data-file>' +
        '<label for="cvtName">' + esc(t('apptName')) + '</label><input type="text" id="cvtName" autocomplete="off" maxlength="120">' +
        '<div class="cvt-two"><div><label for="cvtDate">' + esc(t('date')) + '</label><input type="date" id="cvtDate" value="' + ds + '"></div><div><label for="cvtTime">' + esc(t('time')) + '</label><input type="time" id="cvtTime" value="10:00"></div></div>' +
        '<label for="cvtDose">' + esc(t('place')) + '</label><input type="text" id="cvtDose" autocomplete="off" maxlength="200">';
      return '<button type="button" class="cvt-shot" data-shot>' + esc(t('photo')) + '</button><input type="file" accept="image/*" capture="environment" hidden data-file>' +
        '<label for="cvtName">' + esc(t('subName')) + '</label><input type="text" id="cvtName" autocomplete="off" maxlength="120">' +
        '<label for="cvtDate">' + esc(t('next')) + '</label><input type="date" id="cvtDate" value="' + ds + '">' +
        '<label for="cvtDose">' + esc(t('subDetail')) + '</label><input type="text" id="cvtDose" autocomplete="off" maxlength="200">';
    }
    function render() {
      el.innerHTML = '<div class="cv-box"><div class="cvt-kinds">' + kinds.map(function (k) { return '<button type="button" class="cvt-chip" data-k="' + k[0] + '" aria-pressed="' + (k[0] === kind) + '">' + esc(t(k[1])) + '</button>'; }).join('') + '</div>' +
        '<div class="cvt-f">' + fields() + '</div><div class="cv-msg"></div>' +
        '<div class="cv-row"><button class="cv-btn pri" data-a="save">' + esc(t('save')) + '</button><button class="cv-btn" data-a="close">' + esc(t('cancel')) + '</button></div></div>';
      photo = null; times = {};
      el.querySelectorAll('[data-k]').forEach(function (b) { b.onclick = function () { kind = b.getAttribute('data-k'); render(); }; });
      el.querySelectorAll('[data-t]').forEach(function (b) { b.onclick = function () { var v = b.getAttribute('data-t'); times[v] = !times[v]; b.setAttribute('aria-pressed', times[v] ? 'true' : 'false'); }; });
      var shot = el.querySelector('[data-shot]'), file = el.querySelector('[data-file]');
      shot.onclick = function () { file.click(); };
      file.onchange = function () {
        var f = file.files && file.files[0]; if (!f) return;
        photo = f; shot.classList.add('has'); shot.style.backgroundImage = 'url(' + URL.createObjectURL(f) + ')'; shot.setAttribute('aria-label', t('rephoto'));
      };
      el.querySelector('[data-a=close]').onclick = function () { close(el); };
      el.querySelector('[data-a=save]').onclick = save;
    }
    async function save() {
      var msg = el.querySelector('.cv-msg'); msg.className = 'cv-msg'; msg.textContent = '';
      var title = (el.querySelector('#cvtName').value || '').trim();
      if (!title) { msg.textContent = t('needName'); return; }
      var body = { kind: kind, title: title, detail: (el.querySelector('#cvtDose').value || '').trim() || null };
      if (_data && _data.s.home) body.home = _data.s.home;
      if (kind === 'med') {
        var ts = Object.keys(times).filter(function (k) { return times[k]; });
        var o = el.querySelector('#cvtOther').value; if (o) ts.push(o);
        if (!ts.length) { msg.textContent = t('needTime'); return; }
        body.times = ts;
      } else {
        var dv = el.querySelector('#cvtDate').value, tv = kind === 'appt' ? el.querySelector('#cvtTime').value : '09:00';
        if (!dv || !tv) { msg.textContent = t('needWhen'); return; }
        body.at = new Date(dv + 'T' + tv).getTime();
      }
      var btn = el.querySelector('[data-a=save]'); btn.disabled = true; btn.textContent = t('saving');
      try {
        if (photo) {
          var fd = new FormData(); fd.append('file', photo, 'care-' + Date.now() + '.jpg'); fd.append('blob_type', 'photo');
          var up = await api('/storage/upload', { method: 'POST', body: fd });
          if (up.ok && up.data.id && up.data.file_size > 0) body.photo = up.data.id;
        }
        var r = await api('/care/items', { method: 'POST', body: body });
        if (!r.ok) throw new Error(r.status);
        close(el); load(true);
      } catch (e) { msg.textContent = t('failed'); btn.disabled = false; btn.textContent = t('save'); }
    }
    render(); open(el);
  }

  /* ── keep it current ── */
  var _lastSubject = '';
  function tick() {
    var s = subject(); var k = s ? (s.home || 'me') : '';
    if (k !== _lastSubject) { _lastSubject = k; _data = null; paint(); if (k) load(true); }
  }
  function boot() {
    if (!window.CovaraCare || !authed()) { setTimeout(boot, 1000); return; }
    /* HOME's phone tells the server its time zone so "today" is HOME's today */
    if (role() === 'home') { try { api('/care/state', { method: 'POST', body: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } }); } catch (e) {} }
    setInterval(tick, 700);
    setInterval(function () { if (_lastSubject) load(true); }, 60000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden && _lastSubject) load(true); });
    window.addEventListener('localeChanged', paint);
  }
  /* The dream picture on AWAY's phone: the photo of HOME's medicine that is due or late */
  var _imgs = {};
  function dreamImg(url) {
    if (!url) return null;
    var o = _imgs[url];
    if (!o) { o = _imgs[url] = { img: new Image(), isVideo: false, ok: false }; o.img.onload = function () { o.ok = true; }; o.img.src = url; }
    return o.ok ? o : null;
  }
  window.CovaraDream = function (contactId) {
    if (role() !== 'away' || !_data || !_data.s.home) return null;
    var c = (typeof DEMO_CONTACTS !== 'undefined') && DEMO_CONTACTS.filter(function (x) { return x.id === contactId; })[0];
    if (!c || !c.care || c.care.userId !== _data.s.home) return null;
    var due = (_data.today.items || []).filter(function (x) { return (x.state === 'late' || x.state === 'due') && x.item.photo && (x.item.kind === 'med' || x.item.kind === 'check'); })
      .sort(function (a, b) { return (a.state === 'late' ? 0 : 1) - (b.state === 'late' ? 0 : 1); })[0];
    return due ? dreamImg(photoUrl(due.item.photo)) : null;
  };
  window.CovaraToday = { load: load, openAdd: openAdd, openItem: openItem, data: function () { return _data; } };
  setTimeout(boot, 1500);
})();
