/* Remiel: Covara, Words (live captions).
   For a HOME who cannot hear everything said to them: one tap opens a calm full screen that shows, in very large
   letters, the words being spoken in the room, as they are spoken. "Say that again" holds the last sentence still
   and big. Bigger and Smaller change the letters; Pause stops listening. Nothing is stored or sent anywhere by
   Covara: the words live on this screen only and are gone when Words closes.
   Android app: the phone's own speech recognition (CovaraNative.listen), restarted after every sentence.
   Browser: the Web Speech API in continuous mode, restarted when the browser stops it.
   Beverly Index LLC */
(function () {
  'use strict';
  var IT = function () { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var S = {
    en: { title: 'WORDS', listening: 'Listening', paused: 'Paused', start: 'Ask the person to speak. Their words appear here.',
      bigger: 'Bigger', smaller: 'Smaller', pause: 'Pause', go: 'Listen', again: 'Say that again', back: 'Back to live', done: 'Done',
      noisy: 'Hard to hear. Hold the phone closer to the person speaking.', nomic: 'Covara needs the microphone. Allow it in the phone settings, then tap Listen.',
      none: 'This phone cannot listen here. Open Covara in the Covara app or in Chrome.', last: 'LAST SENTENCE', lang: 'Language heard', kept: 'Nothing is saved.' },
    it: { title: 'PAROLE', listening: 'In ascolto', paused: 'In pausa', start: 'Chiedi alla persona di parlare. Le sue parole appaiono qui.',
      bigger: 'Più grandi', smaller: 'Più piccole', pause: 'Pausa', go: 'Ascolta', again: 'Ripeti', back: 'Torna al vivo', done: 'Fine',
      noisy: 'Si sente male. Avvicina il telefono a chi parla.', nomic: 'Covara ha bisogno del microfono. Permettilo nelle impostazioni del telefono, poi tocca Ascolta.',
      none: 'Questo telefono non può ascoltare qui. Apri Covara nell’app Covara o in Chrome.', last: 'ULTIMA FRASE', lang: 'Lingua ascoltata', kept: 'Non si salva nulla.' }
  };
  function t(k) { return (IT() ? S.it : S.en)[k] || S.en[k] || k; }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var SIZES = [26, 32, 40, 48, 58, 70];
  var css =
    '#cvWords{position:fixed;inset:0;z-index:99995;display:flex;flex-direction:column;box-sizing:border-box;padding:max(14px,env(safe-area-inset-top)) 14px max(14px,env(safe-area-inset-bottom));' +
    'background:radial-gradient(120% 80% at 50% 0%,#14306e 0%,#071331 55%,#030817 100%);color:#f6f8ff;font-family:var(--nous-font,"Hanken Grotesk",sans-serif)}' +
    '#cvWords[hidden]{display:none}' +
    '#cvWords .hd{display:flex;align-items:center;gap:10px;min-height:48px}' +
    '#cvWords .tt{font:800 13px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.18em;color:#ffd24d}' +
    '#cvWords .st{display:flex;align-items:center;gap:8px;font:700 14px var(--nous-font,sans-serif);color:#bfe6ff}' +
    '#cvWords .dot{width:12px;height:12px;border-radius:50%;background:#38bdf8;box-shadow:0 0 0 0 rgba(56,189,248,.7);animation:cvwP 1.6s infinite}' +
    '#cvWords.off .dot{background:#7d8aa8;animation:none;box-shadow:none}' +
    '@keyframes cvwP{0%{box-shadow:0 0 0 0 rgba(56,189,248,.7)}70%{box-shadow:0 0 0 14px rgba(56,189,248,0)}100%{box-shadow:0 0 0 0 rgba(56,189,248,0)}}' +
    '#cvWords .lg{margin-left:auto;min-height:40px;min-width:48px;padding:0 12px;border-radius:20px;border:1px solid rgba(150,200,255,.5);background:rgba(40,90,190,.25);color:#e8f2ff;font:800 13px var(--nous-mono,monospace);letter-spacing:.08em;cursor:pointer}' +
    '#cvWords .card{flex:1;min-height:0;margin:10px 0 12px;border-radius:24px;border:1.5px solid rgba(120,190,255,.55);background:linear-gradient(160deg,rgba(70,130,235,.20),rgba(10,24,64,.55));' +
    '-webkit-backdrop-filter:blur(16px) saturate(150%);backdrop-filter:blur(16px) saturate(150%);box-shadow:0 0 30px rgba(70,150,255,.30),inset 0 1px 0 rgba(255,255,255,.14);display:flex;flex-direction:column;overflow:hidden;transition:box-shadow .3s}' +
    '#cvWords.hear .card{box-shadow:0 0 38px rgba(56,189,248,.55),inset 0 1px 0 rgba(255,255,255,.18)}' +
    '#cvWords .scroll{flex:1;overflow-y:auto;padding:18px 18px 22px;display:flex;flex-direction:column;gap:.35em;-webkit-overflow-scrolling:touch}#cvWords .scroll{-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 44px);mask-image:linear-gradient(to bottom,transparent 0,#000 44px)}#cvWords .scroll>:first-child{margin-top:auto}' +
    '#cvWords .ln{font-weight:700;line-height:1.22;color:#9fb3d9;overflow-wrap:anywhere}' +
    '#cvWords .ln.now{color:#ffffff;text-shadow:0 1px 3px rgba(2,8,24,.6)}' +
    '#cvWords .pt{font-weight:700;line-height:1.22;color:#ffe9a6;overflow-wrap:anywhere}' +
    '#cvWords .hint{font-weight:600;color:#bcd0f2;line-height:1.3}' +
    '#cvWords .hold{padding:22px 18px;display:flex;flex-direction:column;gap:12px;overflow-y:auto;flex:1}' +
    '#cvWords .hold .k{font:800 12px var(--nous-mono,monospace);letter-spacing:.16em;color:#ffd24d}' +
    '#cvWords .hold .w{font-weight:800;line-height:1.2;color:#fff;overflow-wrap:anywhere}' +
    '#cvWords .note{min-height:20px;margin:0 2px 10px;font:600 15px/1.35 var(--nous-font,sans-serif);color:#ffd9a0}' +
    '#cvWords .note:empty{display:none}' +
    '#cvWords .row{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '#cvWords .row2{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px}' +
    '#cvWords button.b{min-height:56px;border-radius:18px;border:1px solid rgba(150,200,255,.5);background:linear-gradient(160deg,rgba(70,130,235,.28),rgba(14,30,78,.5));color:#eef5ff;' +
    'font:700 17px var(--nous-font,sans-serif);cursor:pointer;box-shadow:0 0 14px rgba(70,150,255,.18),inset 0 1px 0 rgba(255,255,255,.12)}' +
    '#cvWords button.b:active{transform:scale(.98)}' +
    '#cvWords button.pri{border:0;background:#ffd24d;color:#2a1600;box-shadow:0 0 22px rgba(255,210,77,.45)}' +
    '#cvWords button.done{border-color:rgba(255,210,77,.75)}' +
    '#cvWords .kept{text-align:center;margin-top:8px;font:600 12px var(--nous-mono,monospace);letter-spacing:.06em;color:#7f93ba}';

  var el = null, scrollEl = null, open = false, paused = false, holding = false;
  var lines = [], partial = '', lastFinal = '';
  var rec = null, mode = '', restartT = null, misses = 0, lastHeardAt = 0, wake = null, lang = '';

  function sizeIdx() { var i = Number(lsGet('rc:wordsSize', 2)); return isFinite(i) ? Math.max(0, Math.min(SIZES.length - 1, i)) : 2; }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function speechLang() { return lang || (IT() ? 'it-IT' : 'en-US'); }

  function build() {
    if (el) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    el = document.createElement('div'); el.id = 'cvWords'; el.hidden = true;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]'); if (!b) return;
      var a = b.getAttribute('data-a');
      if (a === 'done') close();
      else if (a === 'big') { lsSet('rc:wordsSize', Math.min(SIZES.length - 1, sizeIdx() + 1)); paint(); }
      else if (a === 'small') { lsSet('rc:wordsSize', Math.max(0, sizeIdx() - 1)); paint(); }
      else if (a === 'pause') { if (paused) { paused = false; note(''); listen(); } else { paused = true; halt(); } paint(); }
      else if (a === 'again') { holding = !holding; paint(); }
      else if (a === 'lang') { lang = speechLang() === 'it-IT' ? 'en-US' : 'it-IT'; halt(); if (!paused) listen(); paint(); }
    });
  }
  function note(s) { var n = el && el.querySelector('.note'); if (n) n.textContent = s || ''; }

  function paint() {
    if (!el) return;
    var fs = SIZES[sizeIdx()], noteTxt = (el.querySelector('.note') || {}).textContent || '';
    el.classList.toggle('off', paused || !mode);
    var body;
    if (holding) {
      body = '<div class="hold"><div class="k">' + esc(t('last')) + '</div><div class="w" style="font-size:' + Math.round(fs * 1.15) + 'px">' +
        esc(lastFinal || partial || '…') + '</div></div>';
    } else {
      var h = '';
      var shown = lines.slice(-12);
      shown.forEach(function (s, i) { h += '<div class="ln' + (i === shown.length - 1 && !partial ? ' now' : '') + '" style="font-size:' + (i === shown.length - 1 && !partial ? fs : Math.round(fs * 0.72)) + 'px">' + esc(s) + '</div>'; });
      if (partial) h += '<div class="pt" style="font-size:' + fs + 'px">' + esc(partial) + '</div>';
      if (!h) h = '<div class="hint" style="font-size:' + Math.max(22, Math.round(fs * 0.7)) + 'px">' + esc(t('start')) + '</div>';
      body = '<div class="scroll">' + h + '</div>';
    }
    el.innerHTML =
      '<div class="hd"><span class="tt">' + esc(t('title')) + '</span><span class="st"><span class="dot"></span>' + esc(paused || !mode ? t('paused') : t('listening')) + '</span>' +
      '<button type="button" class="lg" data-a="lang" aria-label="' + esc(t('lang')) + '">' + (speechLang() === 'it-IT' ? 'IT' : 'EN') + '</button></div>' +
      '<div class="card">' + body + '</div>' +
      '<div class="note" aria-live="polite">' + esc(noteTxt) + '</div>' +
      '<div class="row2"><button type="button" class="b" data-a="small">A− ' + esc(t('smaller')) + '</button>' +
      '<button type="button" class="b" data-a="big">A+ ' + esc(t('bigger')) + '</button>' +
      '<button type="button" class="b" data-a="pause">' + esc(paused ? t('go') : t('pause')) + '</button></div>' +
      '<div class="row"><button type="button" class="b pri" data-a="again">' + esc(holding ? t('back') : t('again')) + '</button>' +
      '<button type="button" class="b done" data-a="done">' + esc(t('done')) + '</button></div>' +
      '<div class="kept">' + esc(t('kept')) + '</div>';
    scrollEl = el.querySelector('.scroll');
    if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
  }

  /* the words */
  function heardPartial(s) {
    s = String(s || '').trim(); if (!s) return;
    partial = s; misses = 0; lastHeardAt = Date.now(); note('');
    if (el) { el.classList.add('hear'); clearTimeout(el._h); el._h = setTimeout(function () { el && el.classList.remove('hear'); }, 900); }
    paint();
  }
  function heardFinal(s) {
    s = String(s || '').trim(); partial = '';
    if (s) { s = s.charAt(0).toUpperCase() + s.slice(1); lines.push(s); if (lines.length > 60) lines.shift(); lastFinal = s; misses = 0; lastHeardAt = Date.now(); note(''); }
    paint();
  }
  function missed() {
    misses++;
    /* several tries in a row with nothing understood: probably noise */
    if (misses >= 3 && Date.now() - lastHeardAt > 15000) note(t('noisy'));
  }

  /* listening, in a loop until Words closes or is paused */
  function canNative() { try { return !!(window.CovaraNative && typeof CovaraNative.listen === 'function' && CovaraNative.canHear()); } catch (e) { return false; } }
  function SR() { return window.SpeechRecognition || window.webkitSpeechRecognition; }
  function again(ms) { clearTimeout(restartT); restartT = setTimeout(function () { if (open && !paused) listen(); }, ms); }

  function listen() {
    if (!open || paused) return;
    clearTimeout(restartT);
    if (canNative()) {
      mode = 'native';
      try { CovaraNative.listen(speechLang()); } catch (e) { mode = ''; note(t('none')); }
      paint(); return;
    }
    var R = SR();
    if (!R) { mode = ''; note(t('none')); paint(); return; }
    mode = 'web';
    try { if (rec) { rec.onend = null; rec.abort(); } } catch (e) {}
    rec = new R(); rec.lang = speechLang(); rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 1;
    var r0 = rec;
    rec.onresult = function (e) {
      var interim = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        var x = e.results[i];
        if (x.isFinal) heardFinal(x[0].transcript); else interim += x[0].transcript;
      }
      if (interim) heardPartial(interim);
    };
    rec.onerror = function (e) {
      var c = e && e.error;
      if (c === 'not-allowed' || c === 'service-not-allowed') { paused = true; mode = ''; note(t('nomic')); paint(); return; }
      if (c === 'no-speech') missed();
    };
    /* browsers stop on their own after a while: start again while Words is open */
    rec.onend = function () { if (rec !== r0) return; if (partial) heardFinal(partial); if (open && !paused) again(250); };
    try { rec.start(); } catch (e) { again(800); }
    paint();
  }
  function halt() {
    clearTimeout(restartT);
    if (partial) heardFinal(partial);
    try { if (rec) { rec.onend = null; rec.abort(); } } catch (e) {} rec = null;
    try { if (mode === 'native' && window.CovaraNative && CovaraNative.stopListening) CovaraNative.stopListening(); } catch (e) {}
    mode = '';
  }

  /* the Android app's recognizer hears one sentence at a time: each result starts the next */
  window.addEventListener('covara-native', function (e) {
    var d = e.detail || {};
    if (!open || d.kind !== 'speech' || mode !== 'native') return;
    if (d.type === 'partial') heardPartial(d.value);
    else if (d.type === 'result') { heardFinal(d.value); again(120); }
    else if (d.type === 'rms') { if (el && Number(d.value) > 4) el.classList.add('hear'); }
    else if (d.type === 'error') {
      var c = String(d.value || '');
      if (c === 'not-allowed') { paused = true; mode = ''; note(t('nomic')); paint(); return; }
      if (partial) heardFinal(partial);
      if (c === 'no-speech' || c === 'error-7' || c === 'error-6') missed();
      /* a busy recognizer (error-8) needs a little longer */
      again(c === 'error-8' ? 700 : 250);
    }
  });

  async function keepAwake() { try { if (navigator.wakeLock && !wake) { wake = await navigator.wakeLock.request('screen'); wake.addEventListener('release', function () { wake = null; }); } } catch (e) { wake = null; } }
  function onKey(e) { if (e.key === 'Escape' && open) close(); }

  function openWords() {
    build();
    if (open) return;
    /* TALK and Covara's own voice step aside */
    try { if (window.speechSynthesis) speechSynthesis.cancel(); if (window.CovaraNative && CovaraNative.hush) CovaraNative.hush(); } catch (e) {}
    try { if (window.CovaraNative && CovaraNative.stopListening) CovaraNative.stopListening(); } catch (e) {}
    open = true; paused = false; holding = false; lines = []; partial = ''; lastFinal = ''; misses = 0; lastHeardAt = Date.now();
    el.hidden = false; paint(); note('');
    document.addEventListener('keydown', onKey);
    keepAwake();
    setTimeout(listen, 150);
  }
  function close() {
    open = false; halt();
    /* nothing is kept */
    lines = []; partial = ''; lastFinal = ''; holding = false;
    if (el) { el.hidden = true; el.innerHTML = ''; }
    document.removeEventListener('keydown', onKey);
    try { if (wake) wake.release(); } catch (e) {} wake = null;
  }
  document.addEventListener('visibilitychange', function () {
    if (!open) return;
    if (document.hidden) halt(); else { keepAwake(); if (!paused) again(200); }
  });
  if (/(^|[#&])words(&|$)/.test(location.hash)) setTimeout(openWords, 1200);

  window.CovaraWords = { open: openWords, close: close, isOpen: function () { return open; },
    /* for tests */ _feed: function (type, value) { if (type === 'partial') heardPartial(value); else heardFinal(value); } };
})();
