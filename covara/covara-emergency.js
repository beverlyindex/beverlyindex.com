/* Remiel: Covara, emergency location: asked once on HOME's own phone.
   After any alarm about HOME (a fall, no word in the morning, leaving home at night and the others in
   lib/carehelp.js on the server), HOME's position opens to the whole team for one hour, as during Help.
   It is on unless HOME, or the person who decides for HOME, turns it off. HOME is told plainly once, and can keep
   it on or turn it off here; it can be changed later in Care, Safety, Emergency location.
   Beverly Index LLC */
(function () {
  'use strict';
  var IT = function () { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var S = {
    en: { lead: 'YOUR SAFETY', title: 'If something happens, your team can find you', body: 'When an alarm goes off, like a fall or no word from you in the morning, your whole team will see where you are for one hour. The rest of the time, only the people you choose see where you are.', keep: 'Keep it on', off: 'Turn it off', sure: 'If you turn it off, in an emergency your team will not know where you are.', sureYes: 'Turn it off anyway', back: 'Keep it on', locOff: 'Location is off in Covara on this phone, so nobody could find you. Turn it on in Covara’s settings.' },
    it: { lead: 'LA TUA SICUREZZA', title: 'Se succede qualcosa, il tuo team può trovarti', body: 'Quando scatta un allarme, come una caduta o nessuna notizia da te al mattino, tutto il tuo team vedrà dove sei per un’ora. Il resto del tempo, vedono dove sei solo le persone che scegli tu.', keep: 'Lasciala attiva', off: 'Spegnila', sure: 'Se la spegni, in un’emergenza il tuo team non saprà dove sei.', sureYes: 'Spegni comunque', back: 'Lasciala attiva', locOff: 'La posizione è spenta in Covara su questo telefono, quindi nessuno potrebbe trovarti. Attivala nelle impostazioni di Covara.' }
  };
  function t(k) { return (IT() ? S.it : S.en)[k] || S.en[k]; }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function authed() { try { return SyncEngine.isAuthenticated() && !SyncEngine.isLocalOnly(); } catch (e) { return false; } }
  async function api(path, o) { var r = await SyncEngine.apiFetch(path, Object.assign({ method: 'GET' }, o || {})); return { ok: r.ok, data: await r.json().catch(function () { return {}; }) }; }
  function locOff() { try { if (window.CovaraNative && CovaraNative.locStatus) { var s = JSON.parse(CovaraNative.locStatus() || '{}'); return s && s.on === false; } } catch (e) {} return false; }

  var css = '#cvEmerg{position:fixed;inset:0;z-index:99996;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(3,8,24,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}#cvEmerg[hidden]{display:none}' +
    '#cvEmerg .b{width:min(460px,100%);box-sizing:border-box;padding:20px 18px 18px;border-radius:24px;color:#eef3fb;font-family:var(--nous-font,"Hanken Grotesk",sans-serif);background:linear-gradient(160deg,rgba(70,130,235,.30),rgba(10,22,60,.92));-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);border:1px solid rgba(255,210,77,.6);box-shadow:0 0 34px rgba(255,210,77,.22),0 24px 60px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.16)}' +
    '#cvEmerg .l{font:700 11px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.2em;color:#ffd24d;margin-bottom:6px}#cvEmerg h2{margin:0;font-size:23px;line-height:1.2;font-weight:800}' +
    '#cvEmerg p{margin:10px 0 0;font-size:16.5px;line-height:1.45;color:#dbe7ff}#cvEmerg p.w{color:#fca5a5}#cvEmerg .r{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}' +
    '#cvEmerg button{flex:1;min-height:52px;padding:0 14px;border-radius:26px;font:800 15.5px var(--nous-font,"Hanken Grotesk",sans-serif);cursor:pointer;border:1px solid rgba(150,200,255,.5);color:#eef5ff;background:linear-gradient(155deg,rgba(80,140,240,.28),rgba(18,40,96,.5))}' +
    '#cvEmerg button.p{border:0;color:#2a1600;background:radial-gradient(circle at 35% 30%,#ffe58a,#ffc531 60%,#d99a00);box-shadow:0 0 18px rgba(255,200,60,.45)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var el = null, _done = false;
  function show(step) {
    if (!el) { el = document.createElement('div'); el.id = 'cvEmerg'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); document.body.appendChild(el); }
    if (step === 'sure') {
      el.innerHTML = '<div class="b"><div class="l">' + esc(t('lead')) + '</div><h2>' + esc(t('title')) + '</h2><p class="w">' + esc(t('sure')) + '</p><div class="r"><button type="button" class="p" data-a="keep">' + esc(t('back')) + '</button><button type="button" data-a="off">' + esc(t('sureYes')) + '</button></div></div>';
    } else {
      el.innerHTML = '<div class="b"><div class="l">' + esc(t('lead')) + '</div><h2>' + esc(t('title')) + '</h2><p>' + esc(t('body')) + '</p>' + (locOff() ? '<p class="w">' + esc(t('locOff')) + '</p>' : '') +
        '<div class="r"><button type="button" class="p" data-a="keep">' + esc(t('keep')) + '</button><button type="button" data-a="ask">' + esc(t('off')) + '</button></div></div>';
    }
    el.hidden = false;
    el.querySelectorAll('[data-a]').forEach(function (b) {
      b.onclick = async function () {
        var a = b.getAttribute('data-a');
        if (a === 'ask') return show('sure');
        b.disabled = true;
        var r = await api('/care/emergency-location', { method: 'PUT', body: JSON.stringify({ on: a === 'keep' }) }).catch(function () { return { ok: false }; });
        if (r.ok) { el.hidden = true; _done = true; } else b.disabled = false;
      };
    });
  }
  async function check() {
    if (_done || role() !== 'home' || !authed() || document.hidden) return;
    /* not while a lesson, the intro or another card is on screen */
    if (document.body.classList.contains('cv-cardopen') || (window.CovaraLearn && CovaraLearn.active && CovaraLearn.active())) return;
    try { if (window.CovaraTeams && CovaraTeams.viewing && CovaraTeams.viewing()) return; } catch (e) {}
    var r = await api('/care/emergency-location').catch(function () { return { ok: false }; });
    if (!r.ok) return;
    if (r.data.asked) { _done = true; return; }
    show();
  }
  setTimeout(check, 15000);
  setInterval(check, 60000);
  window.CovaraEmergency = { show: show, check: check };
})();
