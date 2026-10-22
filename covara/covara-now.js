/* Remiel: Covara, the Now strip.
   One place, just under the top bar, for everything that needs attention: a call for help, a change to a
   medicine or a visit, a Talk message, the morning check-in. One card at a time, the most urgent first
   (rank 0 help and alarms, rank 1 headlines and Talk messages, rank 2 good morning and information), the
   newest first within a rank. A small count shows how many more are waiting; tapping it shows the next one.
   The modules that push here keep their own logic and their own voice; this strip only shows and answers.
   Beverly Index LLC */
(function () {
  'use strict';
  var IT = function () { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var S = {
    en: { more: '+{n}', moreLabel: '{n} more waiting. Tap to see the next one.', now: 'NOW' },
    it: { more: '+{n}', moreLabel: 'Ancora {n} in attesa. Tocca per vedere il prossimo.', now: 'ORA' }
  };
  function t(k, p) { var s = (IT() ? S.it : S.en)[k] || S.en[k] || k; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function hm(ms) { try { return new Date(ms).toLocaleTimeString(IT() ? 'it' : 'en-US', { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }

  var css = '#cvNow{position:fixed;left:50%;transform:translateX(-50%);z-index:99990;width:min(560px,calc(100vw - 24px));box-sizing:border-box;padding:12px 14px 14px;border-radius:22px;' +
    'border:1.5px solid rgba(255,210,77,.85);background:linear-gradient(155deg,rgba(90,70,60,.62),rgba(30,60,130,.66) 45%,rgba(10,22,60,.82));-webkit-backdrop-filter:blur(16px) saturate(150%);backdrop-filter:blur(16px) saturate(150%);' +
    'box-shadow:0 0 26px rgba(255,210,77,.36),0 0 22px rgba(70,150,255,.26),inset 0 1px 0 rgba(255,255,255,.16);color:#f4f7ff;font:500 15px/1.4 var(--nous-font,"Hanken Grotesk",sans-serif);text-shadow:0 1px 2px rgba(2,8,24,.55)}' +
    '#cvNow[hidden],body.cv-cam #cvNow{display:none !important}' +
    '#cvNow.r0{border-color:rgba(255,80,100,.9);background:linear-gradient(155deg,rgba(120,16,38,.78),rgba(36,8,20,.86));box-shadow:0 0 30px rgba(255,40,70,.45),inset 0 1px 0 rgba(255,255,255,.14);animation:cvNowP 1.6s ease-in-out infinite}' +
    '@keyframes cvNowP{50%{box-shadow:0 0 44px rgba(255,40,70,.65),inset 0 1px 0 rgba(255,255,255,.14)}}@media (prefers-reduced-motion:reduce){#cvNow.r0{animation:none}}' +
    '#cvNow .top{display:flex;align-items:center;gap:8px;min-height:22px;font:800 11px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.14em;color:#ffd24d;text-transform:uppercase}#cvNow.r0 .top{color:#ffb3c0}' +
    '#cvNow .top .ic{font-size:16px;letter-spacing:0}#cvNow .top .ld{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#cvNow .top time{color:#9fd8ff;letter-spacing:.06em;font-weight:700}#cvNow.r0 .top time{color:#ffe3e8}' +
    '#cvNow .more{flex:0 0 auto;min-width:48px;min-height:32px;margin:-6px -4px -6px 0;padding:0 12px;border-radius:16px;border:1px solid rgba(150,200,255,.6);background:rgba(40,90,190,.35);color:#fff;font:800 14px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.02em;cursor:pointer;box-shadow:0 0 12px rgba(56,189,248,.35)}' +
    '#cvNow .more:after{content:"";position:absolute;inset:-8px}#cvNow .more{position:relative}#cvNow.r0 .more{border-color:rgba(255,200,210,.7);background:rgba(120,20,40,.45)}' +
    '#cvNow h4{margin:6px 0 2px;font-size:18px;font-weight:800;line-height:1.3;overflow-wrap:anywhere}#cvNow p{margin:0;color:#d6e4ff;font-size:15px;line-height:1.4;overflow-wrap:anywhere}#cvNow.r0 p{color:#ffd5dc}' +
    '#cvNow .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}#cvNow .row button{flex:1 1 0;min-width:96px;min-height:48px;padding:0 14px;border-radius:24px;cursor:pointer;font:800 15.5px/1.15 var(--nous-font,"Hanken Grotesk",sans-serif);border:1px solid rgba(150,200,255,.55);background:rgba(40,90,190,.28);color:#eef5ff}' +
    '#cvNow .row button.pri{border:0;background:radial-gradient(circle at 35% 30%,#ffe58a,#ffc531 60%,#d99a00);color:#2a1600;box-shadow:0 0 18px rgba(255,200,60,.45);text-shadow:none}#cvNow .row button[disabled]{opacity:.6}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var _items = [], _cur = null, el = null;
  function sorted() { return _items.slice().sort(function (a, b) { return (a.rank - b.rank) || ((b.at || 0) - (a.at || 0)); }); }
  function push(item) {
    if (!item || item.id == null) return;
    var it = Object.assign({ rank: 2, icon: '', lead: '', title: '', body: '', actions: [] }, item);
    it.id = String(it.id); it.rank = Math.max(0, Math.min(2, Number(it.rank) || 0)); if (!it.at) it.at = Date.now();
    it.actions = (it.actions || []).slice(0, 3);
    var i = -1; _items.forEach(function (x, k) { if (x.id === it.id) i = k; });
    var fresh = i < 0;
    if (fresh) _items.push(it); else _items[i] = it;
    /* a new, more urgent card comes to the front at once */
    if (fresh && (!_cur || !cur() || it.rank < cur().rank)) _cur = null;
    paint();
  }
  function remove(id) { id = String(id); var n = _items.length; _items = _items.filter(function (x) { return x.id !== id; }); if (_cur === id) _cur = null; if (n !== _items.length) paint(); }
  function cur() { return _items.filter(function (x) { return x.id === _cur; })[0] || null; }
  function next() { var l = sorted(); if (l.length < 2) return; var k = 0; l.forEach(function (x, j) { if (x.id === _cur) k = j; }); _cur = l[(k + 1) % l.length].id; paint(); }

  function shown(e) { if (!e || !e.getClientRects().length) return false; try { var cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.display !== 'none'; } catch (x) { return true; } }
  function place() {
    if (!el || el.hidden) return;
    var top = 0;
    ['helpFab', 'exitBtn', 'settingsBtn'].forEach(function (id) { var e = document.getElementById(id); if (shown(e)) { var r = e.getBoundingClientRect(); if (r.height && r.top < 160) top = Math.max(top, r.bottom); } });
    document.querySelectorAll('.cvn-chip').forEach(function (e) { var r = e.getBoundingClientRect(); if (r.height && r.top < 120) top = Math.max(top, r.bottom); });
    top = (top || 66) + 8;
    /* below the red Help ticker and its buttons, never under them */
    var tk = document.getElementById('cvHelpTicker');
    if (tk && tk.classList.contains('on')) {
      top = Math.max(top, tk.getBoundingClientRect().bottom + 8);
      var ac = document.getElementById('cvHelpActs');
      if (ac && ac.classList.contains('on')) { var ar = ac.getBoundingClientRect(); if (ar.height && ar.top < window.innerHeight * 0.5) top = Math.max(top, ar.bottom + 8); }
    }
    el.style.top = Math.round(top) + 'px';
  }

  function paint() {
    if (!el) { el = document.createElement('div'); el.id = 'cvNow'; el.setAttribute('role', 'region'); el.setAttribute('aria-live', 'polite'); el.setAttribute('aria-label', t('now')); el.hidden = true; document.body.appendChild(el); }
    var l = sorted();
    if (!l.length) { el.hidden = true; el.innerHTML = ''; el._sig = ''; _cur = null; return; }
    var c = cur(); if (!c) { c = l[0]; _cur = c.id; }
    var more = l.length - 1;
    var sig = JSON.stringify([c.id, c.rank, c.icon, c.lead, c.title, c.body, c.at, (c.actions || []).map(function (a) { return [a.label, !!a.primary, !!a.disabled]; }), more, IT()]);
    el.className = 'r' + c.rank;
    if (el._sig !== sig) {
      el._sig = sig;
      el.setAttribute('role', c.rank === 0 ? 'alert' : 'region');
      el.innerHTML = '<div class="top">' + (c.icon ? '<span class="ic" aria-hidden="true">' + esc(c.icon) + '</span>' : '') + '<span class="ld">' + esc(c.lead || '') + '</span>' +
        (c.at ? '<time>' + esc(hm(c.at)) + '</time>' : '') +
        (more ? '<button type="button" class="more" aria-label="' + esc(t('moreLabel', { n: more })) + '">' + esc(t('more', { n: more })) + '</button>' : '') + '</div>' +
        '<h4>' + esc(c.title) + '</h4>' + (c.body ? '<p>' + esc(c.body) + '</p>' : '') +
        ((c.actions || []).length ? '<div class="row">' + c.actions.map(function (a, i) { return '<button type="button" data-i="' + i + '"' + (a.primary ? ' class="pri"' : '') + (a.disabled ? ' disabled' : '') + '>' + esc(a.label) + '</button>'; }).join('') + '</div>' : '');
      var mb = el.querySelector('.more'); if (mb) mb.onclick = function (e) { e.stopPropagation(); next(); };
      el.querySelectorAll('[data-i]').forEach(function (b) {
        b.onclick = function (e) {
          e.stopPropagation();
          var a = c.actions[+b.getAttribute('data-i')];
          try { if (a && typeof a.onClick === 'function') a.onClick.call(b, e); } catch (x) {}
        };
      });
    }
    el.hidden = false; place();
  }
  setInterval(place, 1000);
  window.addEventListener('resize', place);

  window.CovaraNow = { push: push, remove: remove, list: function () { return sorted().map(function (x) { return Object.assign({}, x); }); }, next: next, current: function () { return _cur; } };
})();
