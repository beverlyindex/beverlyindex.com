/* Remiel: Covara, voices on a call. During a video call in Covara the other person's voice shows as a band of
   colour over their picture, and your own voice as a warm ribbon over yours, from the sound of the call itself.
   Silence lies flat, so a glance says the call is through and who is talking. Only how loud each voice is,
   moment to moment, is read; nothing is recorded or kept.
   Beverly Index LLC */
(function () {
  'use strict';
  var N = 72, them = [], me = [];
  for (var i = 0; i < N; i++) { them.push(0); me.push(0); }
  var ac = null, anThem = null, anMe = null, buf = null, srcThem = null, srcMe = null, raf = 0;
  var cv = document.createElement('canvas'); cv.id = 'cvCallWave';
  cv.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;z-index:100002';
  /* inside the call screen, above the pictures and beneath the call buttons */
  function attach() { var ov = document.getElementById('scOverlay'); if (ov && cv.parentNode !== ov) ov.appendChild(cv); }

  function analyser(stream) {
    if (!stream || !stream.getAudioTracks || !stream.getAudioTracks().length) return null;
    var a = ac.createAnalyser(); a.fftSize = 1024; a.smoothingTimeConstant = 0.6;
    /* only the sound, never sent anywhere: nothing is connected to the speakers or recorded */
    ac.createMediaStreamSource(new MediaStream(stream.getAudioTracks())).connect(a);
    return a;
  }
  function level(a) {
    if (!a) return 0;
    a.getFloatTimeDomainData(buf);
    var s = 0; for (var i = 0; i < buf.length; i++) s += buf[i] * buf[i];
    return Math.min(1, Math.sqrt(s / buf.length) * 6);
  }
  function stop() {
    try { if (ac) ac.close(); } catch (e) {}
    ac = null; anThem = null; anMe = null; srcThem = null; srcMe = null;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    for (var i = 0; i < N; i++) { them[i] = 0; me[i] = 0; }
    var x = cv.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height);
    cv.style.display = 'none';
  }
  function live() {
    var ov = document.getElementById('scOverlay');
    return ov && ov.classList.contains('active');
  }
  /* Every half second: is a call on, and which sound is whose */
  function watch() {
    if (!live()) { if (ac) stop(); return; }
    var rv = document.getElementById('scRemoteVideo'), lv = document.getElementById('scLocalVideo');
    var rs = rv && rv.srcObject, ls = lv && lv.srcObject;
    if (!rs && !ls) return;
    try {
      if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); buf = new Float32Array(1024); }
      if (ac.state === 'suspended') ac.resume().catch(function () {});
      if (rs !== srcThem) { srcThem = rs; anThem = analyser(rs); }
      if (ls !== srcMe) { srcMe = ls; anMe = analyser(ls); }
    } catch (e) { return; }
    attach(); cv.style.display = '';
    if (!raf) raf = requestAnimationFrame(frame);
  }
  function tile(el) {
    if (!el) return null;
    var r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    if (!r.width || !r.height || cs.display === 'none' || cs.visibility === 'hidden') return null;
    return r;
  }
  function frame(ts) {
    raf = 0;
    if (!live() || !ac) return;
    var V = window.CovaraVoiceVisual; if (!V || !V.band) { raf = requestAnimationFrame(frame); return; }
    them.push(level(anThem)); them.shift();
    me.push(level(anMe)); me.shift();
    var W = window.innerWidth, H = window.innerHeight, dpr = window.devicePixelRatio || 1;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.width = W + 'px'; cv.style.height = H + 'px'; }
    var x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
    var rt = tile(document.getElementById('scRemoteVideo')), lt = tile(document.getElementById('scLocalVideo'));
    /* the other person: a band of colour across the lower part of their picture, clear of the face */
    /* only once the call is through (the "calling" screen gone) and their sound has arrived; kept to the very bottom of the frame */
    var st = document.getElementById('scStatus'), through = !st || getComputedStyle(st).display === 'none';
    if (rt && anThem && through) {
      var ma = Math.min(rt.height * 0.07, 46);
      x.save(); x.beginPath(); x.rect(rt.left, rt.top, rt.width, rt.height); x.clip();
      V.band(x, rt.left, rt.top + rt.height - ma - 6, rt.width, ma, them, ts);
      x.restore();
    }
    /* you: a warm ribbon of light along the bottom of your picture */
    if (lt && anMe) {
      var you = 0; for (var i = N - 10; i < N; i++) you = Math.max(you, me[i]);
      var am = Math.min(lt.height * 0.08, 34), cy = lt.top + lt.height - am - 5, half = lt.width * 0.42, amp = am * (0.08 + you * 0.92);
      var g = x.createLinearGradient(lt.left + lt.width / 2 - half, 0, lt.left + lt.width / 2 + half, 0);
      g.addColorStop(0, 'rgba(255,70,40,0)'); g.addColorStop(0.25, 'rgba(255,100,55,' + (0.4 + you * 0.5) + ')'); g.addColorStop(0.5, 'rgba(255,236,205,.9)'); g.addColorStop(0.75, 'rgba(255,160,80,' + (0.4 + you * 0.5) + ')'); g.addColorStop(1, 'rgba(255,90,50,0)');
      x.save(); x.beginPath(); x.rect(lt.left, lt.top, lt.width, lt.height); x.clip();
      x.globalCompositeOperation = 'lighter'; x.strokeStyle = g; x.lineWidth = 0.7;
      V.ribbon(x, lt.left + lt.width / 2, cy, half, amp, ts, 20, 0, 2.6);
      x.restore();
    }
    raf = requestAnimationFrame(frame);
  }
  setInterval(watch, 500);
  window.CovaraCallWave = { watch: watch, stop: stop, levels: function () { return { them: them[N - 1], me: me[N - 1] }; } };
})();
