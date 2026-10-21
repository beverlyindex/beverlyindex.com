/* Remiel: Covara, joining a circle with HOME's family code.
   - Someone who already has Covara opens the link (#join=123456): Covara joins them to the circle at once
     (covara-care.js uses the code kept for this visit).
   - Someone without Covara opens it: this card greets them with HOME's name, asks their name and, if they
     like, their phone number, and joins them as a GUEST. Their sphere appears on HOME's phone at once, and
     they go straight to the video call screen, where they can call HOME now or any time from the same link.
   Beverly Index LLC */
(function () {
  'use strict';
  var IT = function () { try { return /^it/.test((window.I18n && I18n.locale) || navigator.language || ''); } catch (e) { return false; } };
  var S = {
    en: { checking: 'Checking the code...', bad: 'This code has ended or is not right. Ask for a new one.', title: '{name} invited you to their circle',
      titleNo: 'You are invited to a circle', sub: 'Join as a guest to video call {name}. No setup needed.', name: 'Your name', phone: 'Your phone number (optional)',
      join: 'Join as a guest', joining: 'Joining...', failed: 'Could not join. Check the internet and try again.', own: 'Have a Covara access code? Set up your own Covara instead',
      again: 'Welcome back. Call {name}' },
    it: { checking: 'Controllo il codice...', bad: 'Questo codice è terminato o non è giusto. Chiedine uno nuovo.', title: '{name} ti ha invitato nella sua cerchia',
      titleNo: 'Sei invitato in una cerchia', sub: 'Entra come ospite per videochiamare {name}. Non serve installare nulla.', name: 'Il tuo nome', phone: 'Il tuo numero di telefono (facoltativo)',
      join: 'Entra come ospite', joining: 'Entro...', failed: 'Non riesco a entrare. Controlla internet e riprova.', own: 'Hai un codice di accesso Covara? Configura il tuo Covara',
      again: 'Bentornato. Chiama {name}' }
  };
  function t(k, p) { var v = (IT() ? S.it : S.en)[k] || S.en[k]; Object.keys(p || {}).forEach(function (n) { v = v.split('{' + n + '}').join(p[n]); }); return v; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function base() { try { return (window.SyncEngine && SyncEngine.getApiBase && SyncEngine.getApiBase()) || 'https://remiel-covara-api.vercel.app'; } catch (e) { return 'https://remiel-covara-api.vercel.app'; } }
  function rand(n) { var a = new Uint8Array(n); crypto.getRandomValues(a); return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  function toCall(sid, first, me) {
    location.replace(location.pathname + '?call=' + encodeURIComponent(sid) + '&n=' + encodeURIComponent(first || '') + '&g=' + encodeURIComponent(me || '') + '&gj=1');
  }

  var code = window.CovaraJoinGuest;
  if (!code) return;

  var css = '#cvJoin{position:fixed;inset:0;z-index:100050;display:flex;align-items:center;justify-content:center;padding:16px;background:radial-gradient(120% 90% at 50% 30%,#123a74 0,#0a1d42 55%,#061029 100%);font-family:"Hanken Grotesk",system-ui,sans-serif;color:#eef4ff}' +
    '#cvJoin .card{width:min(420px,100%);text-align:center;padding:26px 22px 22px;border-radius:24px;background:linear-gradient(155deg,rgba(70,130,235,.17),rgba(14,30,78,.30));-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border:1px solid rgba(150,200,255,.42);box-shadow:0 0 22px rgba(70,150,255,.28),inset 0 1px 0 rgba(255,255,255,.14)}' +
    '#cvJoin img{width:150px;margin:0 auto 14px;display:block}#cvJoin h1{font-size:22px;line-height:1.25;margin:0 0 8px;font-weight:800}#cvJoin p{margin:0 0 16px;color:#b9c9e6;font-size:14.5px;line-height:1.45}' +
    '#cvJoin input{width:100%;box-sizing:border-box;min-height:48px;margin:0 0 10px;padding:0 14px;border-radius:14px;border:1px solid rgba(150,200,255,.4);background:rgba(20,44,100,.3);color:#fff;font:500 16px "Hanken Grotesk",system-ui,sans-serif}' +
    '#cvJoin button.go{width:100%;min-height:50px;border:0;border-radius:25px;background:#38bdf8;color:#04121f;font:800 16px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer;margin-top:4px}#cvJoin button.go:disabled{opacity:.55}' +
    '#cvJoin .msg{min-height:20px;margin:10px 0 0;font-size:13.5px;color:#fbbf24}#cvJoin .own{display:block;margin:16px auto 0;background:none;border:0;color:#9fd8ff;font:600 13px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer;text-decoration:underline}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var el = document.createElement('div'); el.id = 'cvJoin'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
  el.innerHTML = '<div class="card"><img src="covara-logo.png" alt="Remiel: Covara"><h1 data-h>' + esc(t('checking')) + '</h1><p data-p></p>' +
    '<form data-f hidden><input data-n autocomplete="name" maxlength="60" placeholder="' + esc(t('name')) + '"><input data-ph type="tel" autocomplete="tel" maxlength="24" placeholder="' + esc(t('phone')) + '">' +
    '<button class="go" type="submit" data-go>' + esc(t('join')) + '</button></form><div class="msg" data-m></div><button class="own" type="button" data-own>' + esc(t('own')) + '</button></div>';
  document.body.appendChild(el);
  var h = el.querySelector('[data-h]'), p = el.querySelector('[data-p]'), f = el.querySelector('[data-f]'), m = el.querySelector('[data-m]'), go = el.querySelector('[data-go]');
  el.querySelector('[data-own]').onclick = function () {
    /* the code is kept for this visit: once Covara is set up, covara-care.js joins them */
    el.remove(); try { if (typeof showGate === 'function') showGate(); } catch (e) {}
  };

  var home = null;
  fetch(base() + '/care-join/' + encodeURIComponent(code), { cache: 'no-store' }).then(function (r) { return r.json().catch(function () { return {}; }); }).then(function (j) {
    if (!j || !j.valid) { h.textContent = t('titleNo'); p.textContent = t('bad'); return; }
    home = j.home || {};
    var who = home.first || (IT() ? 'questa persona' : 'them');
    /* someone who already joined as a guest goes straight to the call */
    var g = null; try { g = JSON.parse(localStorage.getItem('rc:guestJoin') || 'null'); } catch (e) {}
    if (g && g.sid && g.sid === home.sentinel_id) { h.textContent = t('again', { name: who }); setTimeout(function () { toCall(g.sid, g.first, g.me); }, 600); return; }
    h.textContent = home.first ? t('title', { name: home.first }) : t('titleNo');
    p.textContent = t('sub', { name: who });
    f.hidden = false;
    setTimeout(function () { try { el.querySelector('[data-n]').focus(); } catch (e) {} }, 200);
  }).catch(function () { h.textContent = t('titleNo'); p.textContent = t('failed'); });

  f.onsubmit = async function (e) {
    e.preventDefault();
    var name = el.querySelector('[data-n]').value.trim(), phone = el.querySelector('[data-ph]').value.trim();
    if (!name || !home) return;
    go.disabled = true; go.textContent = t('joining'); m.textContent = '';
    try {
      /* a small account of their own, only for this circle: no access code, no setup */
      var r = await fetch(base() + '/auth/device', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: 'guest-' + rand(10), device_secret: rand(24), display_name: name }) });
      var a = await r.json();
      if (!r.ok || !a.access_token) throw new Error('account');
      var c = await fetch(base() + '/care/claim', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + a.access_token },
        body: JSON.stringify({ code: code, guest: true, phone: phone || undefined }) });
      if (!c.ok) { var cj = await c.json().catch(function () { return {}; }); m.textContent = cj.detail || t('bad'); go.disabled = false; go.textContent = t('join'); return; }
      try { localStorage.setItem('rc:guestJoin', JSON.stringify({ sid: home.sentinel_id, first: home.first, me: name, at: Date.now() })); sessionStorage.removeItem('rc:join'); } catch (e2) {}
      toCall(home.sentinel_id, home.first, name);
    } catch (err) { m.textContent = t('failed'); go.disabled = false; go.textContent = t('join'); }
  };
})();
