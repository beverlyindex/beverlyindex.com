/* Remiel: Covara, headlines for HOME.
   When someone in the circle adds, changes or removes one of HOME's medicines or appointments, HOME sees it at
   once at the top of the screen, in plain words, and hears it: who changed what, and what it is now. "Show me"
   opens it in its pull; "Got it" puts it away, and the person who made the change is told HOME has seen it.
   Checked every 10 seconds while Covara is on screen, and at once when the screen comes back.
   Beverly Index LLC */
(function () {
  'use strict';
  var IT = function () { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var S = {
    en: { lead: 'CHANGED FOR YOU', show: 'Show me', got: 'Got it', more: '+{n} more' },
    it: { lead: 'CAMBIATO PER TE', show: 'Mostrami', got: 'Ho capito', more: '+{n} altri' }
  };
  function t(k, p) { var s = (IT() ? S.it : S.en)[k] || S.en[k] || k; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function authed() { try { return SyncEngine.isAuthenticated() && !SyncEngine.isLocalOnly(); } catch (e) { return false; } }
  function hm(ms) { try { return new Date(ms).toLocaleString(IT() ? 'it' : 'en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }

  var css = '#cvHeadline{position:fixed;left:50%;transform:translateX(-50%);z-index:99989;width:min(560px,calc(100vw - 24px));box-sizing:border-box;padding:12px 14px;border-radius:18px;' +
    'border:1.5px solid rgba(255,210,77,.8);background:linear-gradient(155deg,rgba(70,130,235,.22),rgba(14,30,78,.42));-webkit-backdrop-filter:blur(16px) saturate(150%);backdrop-filter:blur(16px) saturate(150%);' +
    'box-shadow:0 0 26px rgba(255,210,77,.38),0 0 22px rgba(70,150,255,.28),inset 0 1px 0 rgba(255,255,255,.14);color:#f4f7ff;font:500 15px/1.4 var(--nous-font,"Hanken Grotesk",sans-serif);text-shadow:0 1px 2px rgba(2,8,24,.55)}' +
    '#cvHeadline .top{display:flex;align-items:center;gap:8px;font:800 10.5px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.14em;color:#ffd24d}#cvHeadline .top span:last-child{margin-left:auto;color:#9fd8ff;letter-spacing:.06em}' +
    '#cvHeadline h4{margin:6px 0 2px;font-size:17px;font-weight:700}#cvHeadline p{margin:0 0 10px;color:#d6e4ff;font-size:14.5px}' +
    '#cvHeadline .row{display:flex;gap:8px;flex-wrap:wrap}#cvHeadline button{min-height:40px;padding:0 16px;border-radius:20px;cursor:pointer;font:700 14px var(--nous-font,"Hanken Grotesk",sans-serif)}' +
    '#cvHeadline .pri{border:0;background:#ffd24d;color:#2a1600}#cvHeadline .sec{border:1px solid rgba(150,200,255,.55);background:rgba(40,90,190,.25);color:#e8f2ff}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var _list = [], _spoken = {}, _busy = false, el = null;
  async function load() {
    if (role() !== 'home' || !authed() || _busy || document.hidden) return;
    _busy = true;
    try {
      var r = await SyncEngine.apiFetch('/care/headlines', { method: 'GET' });
      if (r.ok) { var j = await r.json(); _list = (j && j.headlines) || []; paint(); }
    } catch (e) {} finally { _busy = false; }
  }
  function place() {
    if (!el) return;
    /* below a Talk headline, if one is showing */
    var top = 74, th = document.getElementById('cvTalkHeadline');
    if (th && !th.hidden && th.offsetHeight) top = th.getBoundingClientRect().bottom + 8;
    else { var tk = document.getElementById('cvHelpTicker'); if (tk && tk.classList.contains('on')) top = tk.getBoundingClientRect().bottom + 8; }
    el.style.top = Math.round(top) + 'px';
  }
  function paint() {
    var h = _list[0];
    if (!h) { if (el) el.hidden = true; return; }
    if (!el) { el = document.createElement('div'); el.id = 'cvHeadline'; el.setAttribute('role', 'alert'); document.body.appendChild(el); }
    var sig = h.id + '|' + h.what + '|' + _list.length;
    if (el._sig !== sig) {
      el._sig = sig;
      el.innerHTML = '<div class="top"><span>' + (h.kind === 'med' ? '💊 ' : '📅 ') + esc(t('lead')) + '</span><span>' + esc(hm(h.at)) + (_list.length > 1 ? ' · ' + esc(t('more', { n: _list.length - 1 })) : '') + '</span></div>' +
        '<h4>' + esc(h.headline) + '</h4>' + (h.what ? '<p>' + esc(h.what.charAt(0).toUpperCase() + h.what.slice(1)) + '</p>' : '<p></p>') +
        '<div class="row">' + (h.action !== 'removed' ? '<button type="button" class="pri" data-a="show">' + esc(t('show')) + '</button>' : '') +
        '<button type="button" class="' + (h.action !== 'removed' ? 'sec' : 'pri') + '" data-a="ok">' + esc(t('got')) + '</button></div>';
      var ok = function () { _list.shift(); paint(); SyncEngine.apiFetch('/care/headlines/' + encodeURIComponent(h.id) + '/seen', { method: 'POST' }).catch(function () {}); };
      el.querySelector('[data-a=ok]').onclick = ok;
      var sh = el.querySelector('[data-a=show]');
      /* the day is reloaded first, so the change is there when the pull opens */
      if (sh) sh.onclick = async function () { ok(); try { if (window.CovaraView) { await CovaraView.load(); setTimeout(function () { CovaraView.open(h.kind, h.item_id); }, 300); } } catch (e) {} };
      /* HOME hears it too, once */
      if (!_spoken[h.id + h.what]) {
        _spoken[h.id + h.what] = 1;
        var words = h.headline + '.' + (h.what ? ' ' + h.what.charAt(0).toUpperCase() + h.what.slice(1) + '.' : '');
        try { if (window.CovaraTalk && CovaraTalk.say) CovaraTalk.say(words, words); } catch (e) {}
      }
    }
    el.hidden = false; place();
  }
  setInterval(function () { load(); if (el && !el.hidden) place(); }, 10000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) load(); });
  setTimeout(load, 3500);
  window.CovaraHeadline = { load: load, list: function () { return _list; } };
})();
