/* Remiel: Covara, room motion from the phone alone.
   No added device: HOME's phone, resting on its charger, reads the signal
   strength of what it can already hear (the home Wi-Fi it is joined to,
   other Wi-Fi networks in a scan, Bluetooth devices nearby). A person
   moving in the room bends those signals, so the readings flicker. This
   turns that flicker into a motion level and how long the room has been
   still.

   The method follows the multi access point RSSI pipeline of RuView
   (ruvnet/RuView, MIT licence, crate wifi-densepose-wifiscan): a
   predictive gate keeps an expected value per signal and passes only the
   change (residual); signals that rise and fall together are the ones a
   body is crossing, so they count more; the weighted change is smoothed
   and sorted into None, Minimal, Moderate or High. Covara adds two things
   suited to a phone: a Hampel filter that drops single spikes, and a noise
   floor learned per signal while the room is quiet, so the same thresholds
   work on different phones and homes.

   What this can and cannot do, said plainly: it senses movement and
   stillness, not who is moving, not breathing, not a fall. The starting
   thresholds must be tuned on real phones in real homes.

   The phone app feeds it readings: update({ 'wifi:aa:bb..': -54, 'ble:11:22..': -71 }, timeMs).
   Beverly Index LLC */
(function (root) {
  'use strict';

  function median(a) { var s = a.slice().sort(function (x, y) { return x - y; }); var n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : 0; }
  function pct(a, p) { var s = a.slice().sort(function (x, y) { return x - y; }); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0; }
  function amp(dbm) { return Math.pow(10, (dbm + 100) / 20); } /* RuView: -100 dBm maps to 1.0 */
  function pearson(x, y) {
    var n = Math.min(x.length, y.length); if (n < 4) return 0;
    var mx = 0, my = 0, i; for (i = 0; i < n; i++) { mx += x[i]; my += y[i]; } mx /= n; my /= n;
    var sxy = 0, sxx = 0, syy = 0; for (i = 0; i < n; i++) { var a = x[i] - mx, b = y[i] - my; sxy += a * b; sxx += a * a; syy += b * b; }
    return sxx > 1e-12 && syy > 1e-12 ? sxy / Math.sqrt(sxx * syy) : 0;
  }

  function Detector(opt) {
    opt = opt || {};
    this.alpha = opt.alpha || 0.3;          /* how fast the expected value follows (RuView 0.3) */
    this.window = opt.window || 30;         /* readings kept per signal for correlation and noise */
    this.corrMin = opt.corrMin || 0.7;      /* RuView correlation threshold */
    this.levels = opt.levels || [2.6, 4, 7];/* smoothed change in noise units: Minimal, Moderate, High */
    this.maxAgeMs = opt.maxAgeMs || 120000; /* a signal not heard for this long is dropped */
    this.links = {};
    this.ema = 0;
    this.lastMoveAt = 0;
    this.startAt = 0;
  }
  Detector.prototype._link = function (id, t) {
    var l = this.links[id];
    if (!l) l = this.links[id] = { pred: null, hist: [], res: [], quiet: [], seen: t };
    return l;
  };
  /* One set of readings. Returns the room's state now. */
  Detector.prototype.update = function (readings, t) {
    t = t || Date.now();
    if (!this.startAt) this.startAt = t;
    var ids = Object.keys(readings || {}), res = {}, self = this;
    ids.forEach(function (id) {
      var dbm = Number(readings[id]); if (!isFinite(dbm) || dbm > 0 || dbm < -110) return;
      var l = self._link(id, t), a = amp(dbm);
      l.seen = t;
      l.hist.push(a); if (l.hist.length > self.window) l.hist.shift();
      /* Hampel: a reading far from the recent median is a spike, not movement */
      if (l.hist.length >= 7) {
        var recent = l.hist.slice(-7), md = median(recent), mad = median(recent.map(function (x) { return Math.abs(x - md); })) * 1.4826;
        if (mad > 0 && Math.abs(a - md) > 3 * mad) a = md;
      }
      if (l.pred == null) { l.pred = a; return; }
      var r = (a - l.pred) / Math.max(l.pred, 1e-6);       /* relative change */
      l.pred = self.alpha * a + (1 - self.alpha) * l.pred;   /* RuView predictive gate */
      l.res.push(r); if (l.res.length > self.window) l.res.shift();
      res[id] = r;
    });
    Object.keys(this.links).forEach(function (id) { if (t - self.links[id].seen > self.maxAgeMs) delete self.links[id]; });

    var live = Object.keys(res);
    if (!live.length) return this.state(t);
    /* Signals that move together are the ones a body crosses: they weigh more (RuView diversity) */
    var div = {};
    live.forEach(function (i) {
      var n = 0; live.forEach(function (j) { if (i !== j && Math.abs(pearson(self.links[i].res, self.links[j].res)) > self.corrMin) n++; });
      div[i] = live.length > 1 ? n / (live.length - 1) : 0;
    });
    var sum = 0, wsum = 0;
    live.forEach(function (id) {
      var l = self.links[id];
      /* noise floor of this signal, learned while the room is quiet */
      /* phones report whole dBm, so many changes read 0: the floor also uses the mean change */
      var floor = l.quiet.length >= 20 ? Math.max(pct(l.quiet, 0.4), 0.6 * l.quiet.reduce(function (x, y) { return x + y; }, 0) / l.quiet.length, 0.02) : null;
      if (floor == null) return;  /* still learning this signal's own noise */
      var z = Math.abs(res[id]) / floor, w = 0.5 + 0.5 * div[id];
      sum += w * z; wsum += w;
    });
    var v = wsum ? sum / wsum : 0;
    this.ema = this.alpha * v + (1 - this.alpha) * this.ema;
    /* movement must hold for a few readings in a row, so one gust is not a person */
    this.streak = this.ema < this.levels[0] ? 0 : (this.streak || 0) + 1;
    if (this.streak >= 3) this.lastMoveAt = t;
    /* every reading teaches the signal's noise floor; a low percentile of the
       last five minutes stays near the quiet level even when someone passes */
    live.forEach(function (id) { var q = self.links[id].quiet; q.push(Math.abs(res[id])); if (q.length > 300) q.shift(); });
    return this.state(t);
  };
  Detector.prototype.state = function (t) {
    t = t || Date.now();
    var e = this.ema, L = this.levels;
    var level = (this.streak || 0) < 3 || e < L[0] ? 'none' : e < L[1] ? 'minimal' : e < L[2] ? 'moderate' : 'high';
    var since = this.lastMoveAt || this.startAt || t;
    return { level: level, score: Math.round(e * 100) / 100, signals: Object.keys(this.links).length, stillForMs: level === 'none' ? t - since : 0, lastMoveAt: this.lastMoveAt || null };
  };
  Detector.prototype.reset = function () { this.links = {}; this.ema = 0; this.lastMoveAt = 0; this.startAt = 0; this.streak = 0; };

  var api = { Detector: Detector, _amp: amp, _pearson: pearson };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CovaraRoom = api;
})(typeof window !== 'undefined' ? window : globalThis);
