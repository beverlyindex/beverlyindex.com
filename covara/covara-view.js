/* Remiel: Covara, the care galaxy.
   HOME's appointments, medicines and subscriptions are spheres in the
   Sentinel galaxy, drawn by Sentinel's own sphere code and joined to HOME.
   On HOME's phone HOME is the centre sphere; on AWAY's phone HOME takes the
   centre and AWAY looks at HOME and what needs to be done. Beside HOME's
   sphere: Appointments, Medications, Subscriptions on the left; on AWAY's
   phone Video, Phone, Message, Email on the right, in Sentinel's pills.
   A medicine sphere carries the photo HOME took of it. It comes forward
   when it is due, its photo fills the dream picture, and once it is taken
   it leaves the circle.
   Beverly Index LLC */
(function () {
  'use strict';
  var STR = {
    en: {
      appts: 'Appointments', meds: 'Medications', subs: 'Subscriptions', video: 'Video', phone: 'Phone', message: 'Message', email: 'Email',
      takeNow: 'TAKE NOW', lateAt: 'LATE', atT: 'AT', renewsU: 'RENEWS', takenU: 'TAKEN', doneU: 'DONE',
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
      appts: 'Appuntamenti', meds: 'Medicine', subs: 'Abbonamenti', video: 'Video', phone: 'Telefono', message: 'Messaggio', email: 'Email',
      takeNow: 'DA PRENDERE ORA', lateAt: 'IN RITARDO', atT: 'ALLE', renewsU: 'RINNOVO', takenU: 'PRESA', doneU: 'FATTO',
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

  var css = ''+
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


  /* ── whose care: HOME's own on HOME's phone, the linked HOME on AWAY's ── */
  function homeContact() {
    if (role() !== 'away' || typeof DEMO_CONTACTS === 'undefined') return null;
    return DEMO_CONTACTS.filter(function (c) { return c.care && c.care.side === 'home' && c.care.state === 'active'; })[0] || null;
  }
  function subject() {
    if (role() === 'home') return { home: null, edit: true };
    var h = homeContact();
    if (!h) return null;
    return { home: h.care.userId, edit: !!(h.care.share && h.care.share.care), contact: h };
  }
  function q(s) { return s && s.home ? '?home=' + encodeURIComponent(s.home) : ''; }

  var _data = null, _busy = false, _filter = '', _nodes = [], _sig = '';
  async function load() {
    var s = subject();
    if (!s || !authed()) { if (_data) { _data = null; rebuild(); } return; }
    if (!s.edit && s.home) { _data = { s: s, today: { items: [] }, items: [] }; rebuild(); return; }
    if (_busy) return; _busy = true;
    try {
      var a = await api('/care/today' + q(s)), b = await api('/care/items' + q(s));
      if (a.ok && b.ok) { _data = { s: s, today: a.data, items: b.data.items || [] }; rebuild(); }
    } catch (e) {} finally { _busy = false; }
  }

  /* ── photos go into Sentinel's own photo map, so its sphere code draws them ── */
  var _img = {};
  function photoFor(id, url) {
    if (!url || typeof contactPhotos === 'undefined') return;
    var o = _img[url];
    if (o && o.ok) { contactPhotos.set(id, o.ph); return; }
    if (o) { o.ids[id] = 1; return; }
    o = _img[url] = { ok: false, ids: {} }; o.ids[id] = 1;
    var im = new Image(); im.crossOrigin = 'anonymous';
    im.onload = function () { o.ok = true; o.ph = { img: im, w: im.naturalWidth, h: im.naturalHeight }; Object.keys(o.ids).forEach(function (k) { contactPhotos.set(k, o.ph); }); };
    im.src = url;
  }

  /* ── one sphere per thing to do ── */
  var CAT = { med: 'friend', check: 'friend', appt: 'professional', sub: 'other', add: 'family' };
  function upper(x) { return String(x || '').toUpperCase(); }
  function whenLabel(ms) { return upper(dayLabel(ms)) + ' ' + hhmm(ms); }
  function nodesFor(d) {
    var out = [], now = Date.now(), f = _filter;
    var stIn = {}; (d.today.items || []).forEach(function (x) { if (x.slot === 'appt') stIn[x.item.id] = x.state; });
    (d.today.items || []).forEach(function (x) {
      var k = x.item.kind; if (k !== 'med' && k !== 'check') return;
      if (f && f !== 'med') return;
      if (!f && x.state === 'done') return;            /* met: it leaves the circle */
      var hl = x.state === 'late' ? t('lateAt') + ' ' + x.slot : x.state === 'due' ? t('takeNow') : x.state === 'done' ? t('takenU') : t('atT') + ' ' + x.slot;
      out.push({ id: 'cvi:' + x.item.id + '|' + x.slot, kind: k, item: x.item, slot: x.slot, state: x.state,
        sev: x.state === 'late' ? 0 : x.state === 'due' ? 1 : x.state === 'done' ? 4 : 3, hl: hl, role: x.item.detail || '' });
    });
    d.items.forEach(function (i) {
      if (i.kind === 'appt') {
        if (f && f !== 'appt') return;
        if (!i.at || i.at < now - 3 * 3600e3) return;
        if (!f && i.at > now + 7 * 864e5) return;
        var st = stIn[i.id] || 'later'; if (!f && st === 'done') return;
        out.push({ id: 'cvi:' + i.id + '|appt', kind: 'appt', item: i, slot: 'appt', state: st,
          sev: st === 'due' ? 1 : i.at - now < 864e5 ? 2 : 4, hl: st === 'done' ? t('doneU') : whenLabel(i.at), role: i.detail || '' });
      } else if (i.kind === 'sub') {
        if (f && f !== 'sub') return;
        if (!f && (!i.at || i.at > now + 7 * 864e5)) return;
        out.push({ id: 'cvi:' + i.id + '|sub', kind: 'sub', item: i, slot: 'sub', state: 'later',
          sev: i.at && i.at - now < 3 * 864e5 ? 2 : 4, hl: t('renewsU') + ' ' + upper(dayLabel(i.at)), role: i.detail || '' });
      }
    });
    if (f && d.s.edit) out.push({ id: 'cvi:add|' + f, kind: 'add', add: f, sev: 4, hl: '', role: '' });
    return out.map(function (n) {
      var title = n.kind === 'add' ? t(n.add === 'med' ? 'addMed' : n.add === 'appt' ? 'addAppt' : 'addSub') : n.item.title;
      var w = n.kind === 'add' ? ['\u200b', '\u200b'] : String(title).replace(/[^\p{L}\p{N}\s]/gu, '').trim().split(/\s+/);
      var c = { id: n.id, first: w[0] || '', last: w[1] || '\u200b', cvTitle: title, cat: CAT[n.kind], sev: n.sev, phone: '', email: '', cvItem: n, cvHeadline: n.hl,
        details: n.role ? { role: n.role } : undefined };
      if (n.item && n.item.photo) photoFor(n.id, photoUrl(n.item.photo));
      return c;
    });
  }
  function rebuild() {
    _nodes = _data ? nodesFor(_data) : [];
    var sig = _nodes.map(function (c) { return c.id + ':' + c.sev + ':' + c.cvHeadline; }).join(',') + '|' + _filter + '|' + role();
    if (sig === _sig) return;
    _sig = sig;
    var f = (typeof focusedContactId !== 'undefined') ? focusedContactId : null;
    if (f && /^cvi:/.test(String(f)) && !_nodes.some(function (c) { return c.id === f; })) { try { focusedContactId = null; } catch (e) {} }
    try { if (typeof buildNodes === 'function') buildNodes(false); } catch (e) {}
  }

  /* What the galaxy orbits. HOME's phone: the family and HOME's things to do.
     AWAY's phone: HOME is the centre, so HOME's things to do and any other HOME. */
  function source(list) {
    if (!role()) return list;
    var h = homeContact();
    var people = (list || []).filter(function (c) { return !(h && c.id === h.id); });
    if (_filter) people = [];
    return people.concat(_nodes);
  }

  /* ── HOME at the centre of AWAY's phone ── */
  var _centrePh = { url: '', frame: null };
  function centre() {
    var h = homeContact(); if (!h) return null;
    var ph = (typeof contactPhotos !== 'undefined') && contactPhotos.get(h.id);
    return { name: ((h.first || '') + ' ' + (h.last || '')).trim(), frame: ph && ph.img ? ph.img : null, w: ph ? (ph.w || (ph.img && ph.img.naturalWidth)) : 0, h: ph ? (ph.h || (ph.img && ph.img.naturalHeight)) : 0, contact: h };
  }

  /* ── Sentinel's pills, beside HOME's sphere ── */
  var _pillHits = [];
  function pills(ctx, labels, keys, side, cx, cy, cr, active, t0) {
    var W = ctx.canvas.width / (window.devicePixelRatio || 1);
    var fs = W < 500 ? 11 : 12, lineH = W < 500 ? 24 : 26, gap = 16, px = 12, py = 5, crn = 6;
    ctx.save();
    ctx.font = '500 ' + fs + 'px -apple-system, system-ui, "Segoe UI", sans-serif';
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    var maxW = 0; labels.forEach(function (l) { maxW = Math.max(maxW, ctx.measureText(l).width); });
    var pw = maxW + px * 2, ph = fs + py * 2;
    var x = side < 0 ? cx - cr * 1.12 - gap - pw : cx + cr * 1.12 + gap;
    if (x < 6) x = 6; if (x + pw > W - 6) x = W - 6 - pw;
    var y0 = cy - (labels.length * lineH) / 2 + lineH / 2;
    var fade = Math.min(1, 0.75 + 0.25 * Math.sin(t0 * 0.004));
    for (var i = 0; i < labels.length; i++) {
      var ly = y0 + i * lineH, on = active === keys[i];
      ctx.globalAlpha = (on ? 0.95 : 0.72) * fade;
      ctx.fillStyle = on ? 'rgba(20,40,64,0.95)' : 'rgba(12,14,24,0.88)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, ly - ph / 2, pw, ph, crn); else ctx.rect(x, ly - ph / 2, pw, ph);
      ctx.fill();
      ctx.globalAlpha = (on ? 0.9 : 0.45) * fade;
      ctx.strokeStyle = on ? 'rgba(120,200,255,0.85)' : 'rgba(100,180,255,0.3)';
      ctx.lineWidth = 1; ctx.stroke();
      ctx.globalAlpha = 0.95 * fade;
      ctx.fillStyle = on ? '#ffffff' : '#d8e8ff';
      ctx.fillText(labels[i], x + pw / 2, ly);
      _pillHits.push({ x: x, y: ly - lineH / 2, w: pw, h: lineH, key: keys[i] });
    }
    ctx.restore();
  }
  function drawCentre(ctx, cx, cy, cr, t0) {
    _pillHits = [];
    if (!role() || !subject()) return;
    if (typeof IsoView !== 'undefined' && IsoView.active && IsoView.active()) return;
    var s = subject();
    if (s.edit) pills(ctx, [t('appts'), t('meds'), t('subs')], ['appt', 'med', 'sub'], -1, cx, cy, cr, _filter, t0);
    if (role() === 'away') pills(ctx, [t('video'), t('phone'), t('message'), t('email')], ['video', 'phone', 'sms', 'email'], 1, cx, cy, cr, '', t0);
  }
  function hitCentre(clientX, clientY) {
    if (!_pillHits.length || typeof CV === 'undefined') return false;
    var r = CV.getBoundingClientRect(), x = clientX - r.left, y = clientY - r.top;
    var h = _pillHits.filter(function (p) { return x >= p.x - 4 && x <= p.x + p.w + 4 && y >= p.y && y <= p.y + p.h; })[0];
    if (!h) return false;
    if (h.key === 'appt' || h.key === 'med' || h.key === 'sub') {
      _filter = _filter === h.key ? '' : h.key;
      try { focusedContactId = null; } catch (e) {}
      rebuild();
    } else {
      var c = centre(); if (c && typeof runContactQuickAction === 'function') runContactQuickAction(h.key, c.contact);
    }
    return true;
  }
  function centreSingle() { return role() === 'away' && !!homeContact(); }
  function centreDouble() {
    var h = homeContact(); if (role() !== 'away' || !h) return false;
    try { enterDetail(h); } catch (e) {}
    return true;
  }

  /* A tap twice on a care sphere opens it: its photo large, and Taken or Done. */
  function openNode(contact) {
    var n = contact && contact.cvItem; if (!n) return false;
    if (n.kind === 'add') openAdd(n.add); else openItem(n.item.id, n.slot);
    return true;
  }

  /* When a medicine is due and nothing else is in focus, it comes forward,
     so its photo fills the dream picture. */
  var _lastTouch = 0;
  function bringDueForward() {
    try {
      if (!_nodes.length || document.querySelector('.cv-ov.open')) return;
      if (typeof focusedContactId === 'undefined' || focusedContactId != null || typeof appState === 'undefined' || appState !== 'network') return;
      if (Date.now() - _lastTouch < 6000) return;
      var due = _nodes.filter(function (c) { return c.cvItem.state === 'late' || c.cvItem.state === 'due'; })
        .sort(function (a, b) { return a.sev - b.sev; })[0];
      if (due) focusedContactId = due.id;
    } catch (e) {}
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
      close(el); _data.today = r.data; rebuild();
    };
    var un = el.querySelector('[data-a=undo]'); if (un) un.onclick = async function () {
      var r = await api('/care/items/' + encodeURIComponent(id) + '/mark', { method: 'POST', body: { slot: slot, done: false } }).catch(function () { return { ok: false }; });
      if (!r.ok) { msg.textContent = t('failed'); return; }
      close(el); _data.today = r.data; rebuild();
    };
    var rm = el.querySelector('[data-a=rm]'); if (rm) rm.onclick = async function () {
      var r = await api('/care/items/' + encodeURIComponent(id), { method: 'DELETE' }).catch(function () { return { ok: false }; });
      if (!r.ok) { msg.textContent = t('failed'); return; }
      close(el); load();
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
        close(el); load();
      } catch (e) { msg.textContent = t('failed'); btn.disabled = false; btn.textContent = t('save'); }
    }
    render(); open(el);
  }



  var _subj = '';
  function tick() {
    var s = subject(); var k = s ? (s.home || 'me') + ':' + s.edit : '';
    if (k !== _subj) { _subj = k; _filter = ''; _data = null; _sig = ''; if (k) load(); else rebuild(); }
    bringDueForward();
  }
  function boot() {
    if (!window.CovaraCare || !authed()) { setTimeout(boot, 1000); return; }
    if (role() === 'home') { try { api('/care/state', { method: 'POST', body: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } }); } catch (e) {} }
    var stg = document.getElementById('stage'); if (stg) stg.addEventListener('pointerdown', function () { _lastTouch = Date.now(); });
    setInterval(tick, 800);
    setInterval(function () { if (_subj) load(); }, 60000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden && _subj) load(); });
    window.addEventListener('localeChanged', function () { _sig = ''; rebuild(); });
  }
  window.CovaraView = { source: source, centre: centre, drawCentre: drawCentre, hitCentre: hitCentre, centreSingle: centreSingle, centreDouble: centreDouble,
    openNode: openNode, load: load, openAdd: openAdd, openItem: openItem, filter: function (f) { _filter = f || ''; rebuild(); }, nodes: function () { return _nodes; }, data: function () { return _data; } };
  setTimeout(boot, 1500);
})();
