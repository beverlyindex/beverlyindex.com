/* Remiel: Covara, the morning check-in and the timeline for the police.
   - HOME, each morning: a glass card at the top, "Good morning", with one big button, I'm up. Until it is
     tapped (or HOME answers How are you, or marks a medicine), the family is told at the time they set and
     HOME's phone rings; 30 minutes later it becomes urgent.
   - Anyone in the circle: one list of everything Covara recorded at HOME's home and from HOME's phone over
     a night, a day or three, with exact times, to print or share with the police.
   Beverly Index LLC */
(function () {
  'use strict';
  var IT = function () { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var S = {
    en: { gm: 'Good morning, {name}', gmSub: 'Tap so your family knows you are all right.', up: "I'm up", thanks: 'Your family knows you are up. Have a good day.',
      tlTitle: 'What Covara recorded', tlFor: '{name}, {from} to {to}', tlNote: 'Recorded on Covara’s server as it happened. Times are {tz}.', tlNone: 'Nothing was recorded in this time.',
      print: 'Print or save as PDF', share: 'Share', copied: 'Copied. Paste it into a message or an email.', close: 'Close', loading: 'Gathering the timeline...', failed: 'The timeline could not be loaded. Check the internet and try again.',
      notShared: 'Not shared with you: {what}.', loc: 'positions', rooms: 'rooms and sensors',
      s_alert: 'ALERT', s_sensor: 'SENSOR', s_room: 'ROOM', s_phone: 'PHONE', s_care: 'CARE', generated: 'Made {t}' },
    it: { gm: 'Buongiorno, {name}', gmSub: 'Tocca perché la tua famiglia sappia che stai bene.', up: 'Mi sono alzato', thanks: 'La tua famiglia sa che sei sveglio. Buona giornata.',
      tlTitle: 'Cosa ha registrato Covara', tlFor: '{name}, da {from} a {to}', tlNote: 'Registrato sul server di Covara man mano che accadeva. Orari: {tz}.', tlNone: 'In questo periodo non è stato registrato nulla.',
      print: 'Stampa o salva in PDF', share: 'Condividi', copied: 'Copiato. Incollalo in un messaggio o in una email.', close: 'Chiudi', loading: 'Raccolgo la cronologia...', failed: 'Non è stato possibile caricare la cronologia. Controlla internet e riprova.',
      notShared: 'Non condiviso con te: {what}.', loc: 'posizioni', rooms: 'stanze e sensori',
      s_alert: 'AVVISO', s_sensor: 'SENSORE', s_room: 'STANZA', s_phone: 'TELEFONO', s_care: 'CURA', generated: 'Creato {t}' }
  };
  function t(k, p) { var s = (IT() ? S.it : S.en)[k] || S.en[k] || k; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function authed() { try { return SyncEngine.isAuthenticated() && !SyncEngine.isLocalOnly(); } catch (e) { return false; } }
  async function api(path, o) { var r = await SyncEngine.apiFetch(path, Object.assign({ method: 'GET' }, o || {})); return { ok: r.ok, data: await r.json().catch(function () { return {}; }) }; }
  function myFirst() { try { var n = String(userSphereName || '').trim().split(/\s+/)[0]; return n ? n[0] + n.slice(1).toLowerCase() : ''; } catch (e) { return ''; } }

  var css = '#cvMorning{position:fixed;left:50%;transform:translateX(-50%);z-index:99988;width:min(560px,calc(100vw - 24px));box-sizing:border-box;padding:8px 8px 8px 14px;border-radius:30px;display:flex;align-items:center;gap:10px;' +
    'border:1.5px solid rgba(255,210,77,.85);background:linear-gradient(155deg,rgba(255,190,90,.22),rgba(70,130,235,.18) 45%,rgba(14,30,78,.45));-webkit-backdrop-filter:blur(16px) saturate(150%);backdrop-filter:blur(16px) saturate(150%);' +
    'box-shadow:0 0 24px rgba(255,210,77,.38),inset 0 1px 0 rgba(255,255,255,.16);color:#fff;font-family:var(--nous-font,"Hanken Grotesk",sans-serif);text-shadow:0 1px 2px rgba(2,8,24,.55)}#cvMorning[hidden]{display:none}' +
    '#cvMorning .tx{flex:1;min-width:0}#cvMorning h3{margin:0;font-size:16px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#cvMorning p{margin:1px 0 0;color:#ffe9c2;font-size:12.5px;line-height:1.3}' +
    '#cvMorning button{flex:0 0 auto;min-height:46px;padding:0 20px;border:0;border-radius:23px;background:radial-gradient(circle at 35% 30%,#ffe58a,#ffc531 60%,#d99a00);color:#2a1600;font:800 16px var(--nous-font,sans-serif);cursor:pointer;box-shadow:0 0 18px rgba(255,200,60,.5)}' +
    '#cvTimeline{position:fixed;inset:0;z-index:100030;display:flex;justify-content:center;background:rgba(4,12,34,.55);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-family:var(--nous-font,"Hanken Grotesk",sans-serif)}' +
    '#cvTimeline .sh{width:min(720px,100%);height:100%;overflow:auto;box-sizing:border-box;padding:18px 16px calc(20px + env(safe-area-inset-bottom));background:linear-gradient(160deg,rgba(70,130,235,.20),rgba(10,24,64,.72));border-left:1px solid rgba(150,200,255,.35);border-right:1px solid rgba(150,200,255,.35);color:#eef4ff}' +
    '#cvTimeline h2{margin:0 0 2px;font-size:20px;font-weight:800}#cvTimeline .who{color:#ffd24d;font:700 13px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.04em}#cvTimeline .note{color:#b9c9e6;font-size:12.5px;margin:6px 0 12px}' +
    '#cvTimeline .acts{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 12px}#cvTimeline .acts button{min-height:40px;padding:0 16px;border-radius:20px;border:1px solid rgba(150,200,255,.5);background:rgba(40,90,190,.28);color:#fff;font:700 13.5px var(--nous-font,sans-serif);cursor:pointer}#cvTimeline .acts button.pri{background:#ffd24d;color:#2a1600;border-color:#ffd24d}' +
    '#cvTimeline ol{list-style:none;margin:0;padding:0}#cvTimeline li{display:grid;grid-template-columns:132px 1fr;gap:10px;padding:9px 0;border-bottom:1px solid rgba(150,200,255,.16);font-size:13.5px;line-height:1.4}' +
    '#cvTimeline li time{font:600 11.5px var(--nous-mono,"JetBrains Mono",monospace);color:#9fd8ff}#cvTimeline li b{display:inline-block;font:800 10px var(--nous-mono,monospace);letter-spacing:.1em;margin-right:6px;padding:1px 6px;border-radius:6px}' +
    '#cvTimeline li.alert b{background:#e0102e;color:#fff}#cvTimeline li.sensor b{background:#5b9cff;color:#04121f}#cvTimeline li.room b{background:#38bdf8;color:#04121f}#cvTimeline li.phone b{background:#ffd24d;color:#2a1600}#cvTimeline li.care b{background:#3ee08f;color:#04211a}' +
    '#cvTimeline li.alert{background:rgba(224,16,46,.10)}' +
    '@media (max-width:480px){#cvTimeline li{grid-template-columns:1fr;gap:2px}}' +
    '@media print{body>*:not(#cvTimeline){display:none !important}#cvTimeline{position:static;background:#fff;-webkit-backdrop-filter:none;backdrop-filter:none}#cvTimeline .sh{height:auto;background:#fff;color:#000;border:0}#cvTimeline .acts{display:none}#cvTimeline .note,#cvTimeline li time{color:#333}#cvTimeline .who{color:#000}#cvTimeline li{border-color:#ccc}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ── the morning card, for HOME ── */
  var card = null, _busy = false, _m = null;
  async function morning() {
    if (role() !== 'home' || !authed() || _busy || document.hidden) return;
    _busy = true;
    try { var r = await api('/care/morning'); if (r.ok) { _m = r.data.morning; paint(); } } catch (e) {} finally { _busy = false; }
  }
  function place() {
    if (!card) return;
    var top = 74;
    ['cvTalkHeadline', 'cvHeadline'].forEach(function (id) { var e = document.getElementById(id); if (e && !e.hidden && e.offsetHeight) top = Math.max(top, e.getBoundingClientRect().bottom + 8); });
    card.style.top = Math.round(top) + 'px';
  }
  function paint() {
    var show = _m && _m.due;
    if (!show) { if (card) card.hidden = true; return; }
    if (!card) {
      card = document.createElement('div'); card.id = 'cvMorning'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Good morning');
      document.body.appendChild(card);
    }
    var nm = myFirst();
    card.innerHTML = '<div class="tx"><h3>☀ ' + esc(t('gm', { name: nm }).replace(/, $/, '')) + '</h3><p>' + esc(t('gmSub')) + '</p></div><button type="button">' + esc(t('up')) + '</button>';
    card.querySelector('button').onclick = async function () {
      this.disabled = true;
      var r = await api('/care/morning/ok', { method: 'POST' }).catch(function () { return { ok: false }; });
      if (r.ok) { _m = r.data.morning; card.hidden = true; try { showToast(t('thanks')); } catch (e) {} try { if (window.CovaraTalk) CovaraTalk.say(t('thanks'), t('thanks')); } catch (e) {} }
      else this.disabled = false;
    };
    card.hidden = false; place();
  }
  setInterval(function () { morning(); if (card && !card.hidden) place(); }, 60000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) morning(); });
  setTimeout(morning, 4000);
  if (/#morning/.test(location.hash || '')) setTimeout(morning, 1500);

  /* ── the timeline for the police ── */
  var _tl = null;
  async function timeline(home, hours) {
    var old = document.getElementById('cvTimeline'); if (old) old.remove();
    var el = document.createElement('div'); el.id = 'cvTimeline'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = '<div class="sh"><h2>' + esc(t('tlTitle')) + '</h2><div class="note">' + esc(t('loading')) + '</div></div>';
    document.body.appendChild(el);
    var r = await api('/care/timeline?hours=' + (hours || 24) + (home ? '&home=' + encodeURIComponent(home) : '')).catch(function () { return { ok: false }; });
    if (!r.ok) { el.querySelector('.note').textContent = t('failed'); el.querySelector('.sh').insertAdjacentHTML('beforeend', '<div class="acts"><button type="button" data-x>' + esc(t('close')) + '</button></div>'); el.querySelector('[data-x]').onclick = function () { el.remove(); }; return; }
    var d = _tl = r.data, rows = d.rows || [];
    var f = function (ms) { try { return new Date(ms).toLocaleString(IT() ? 'it' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: d.tz }); } catch (e) { return ''; } };
    var miss = []; if (!d.shared.location) miss.push(t('loc')); if (!d.shared.rooms) miss.push(t('rooms'));
    el.querySelector('.sh').innerHTML = '<h2>' + esc(t('tlTitle')) + '</h2><div class="who">' + esc(t('tlFor', { name: d.home.name, from: f(d.from), to: f(d.to) })) + '</div>' +
      '<div class="note">' + esc(t('tlNote', { tz: d.tz })) + ' ' + esc(t('generated', { t: d.generated })) + (miss.length ? ' ' + esc(t('notShared', { what: miss.join(', ') })) : '') + '</div>' +
      '<div class="acts"><button type="button" class="pri" data-p>' + esc(t('print')) + '</button><button type="button" data-s>' + esc(t('share')) + '</button><button type="button" data-x>' + esc(t('close')) + '</button></div>' +
      (rows.length ? '<ol>' + rows.slice().reverse().map(function (x) { return '<li class="' + esc(x.src) + '"><time>' + esc(x.when) + '</time><div><b>' + esc(t('s_' + x.src)) + '</b>' + esc(x.text) + '</div></li>'; }).join('') + '</ol>' : '<div class="note">' + esc(t('tlNone')) + '</div>');
    el.querySelector('[data-x]').onclick = function () { el.remove(); };
    el.querySelector('[data-p]').onclick = function () { try { window.print(); } catch (e) {} };
    el.querySelector('[data-s]').onclick = async function () {
      var text = t('tlTitle') + '\n' + t('tlFor', { name: d.home.name, from: f(d.from), to: f(d.to) }) + '\n' + t('tlNote', { tz: d.tz }) + '\n\n' + rows.map(function (x) { return x.when + '  [' + t('s_' + x.src) + ']  ' + x.text; }).join('\n');
      try { if (navigator.share) { await navigator.share({ title: t('tlTitle') + ': ' + d.home.name, text: text }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
      try { await navigator.clipboard.writeText(text); showToast(t('copied')); } catch (e) {}
    };
  }
  window.CovaraNight = { morning: morning, timeline: timeline, data: function () { return { morning: _m, timeline: _tl }; } };
})();
