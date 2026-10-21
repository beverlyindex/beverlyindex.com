/* Remiel: Covara, sleep and breathing. Last night as a picture (awake, light, deep, out of bed), breathing and heart
   rate across the night, and the readings now, from a bedside radar sensor; or, with no sensor, a rough night from
   HOME's phone left on the bed (Night watch). Care trends, never a diagnosis.
   Beverly Index LLC */
(function () {
  'use strict';
  var S = {
    en: { title: 'Sleep and breathing', subNone: 'No sleep readings yet', subRadar: 'From the bedside sensor', subPhone: 'From the phone on the bed (a rough estimate)',
      now: 'Now', inBed: 'In bed', outBed: 'Out of bed', away: 'Not in the room', st_deep: 'Deep sleep', st_light: 'Light sleep', st_awake: 'Awake', st_out: 'Out of bed', st_none: 'No one',
      breath: 'Breathing', heart: 'Heart', perMin: '/min', lastNight: 'Last night', asleep: 'Asleep', deep: 'Deep', woke: 'Awake in bed', up: 'Got up', times: '{n} times', once: 'once', never: 'not at all',
      fellAsleep: 'Fell asleep', wokeUp: 'Last asleep', avgBreath: 'Breathing, average', avgHeart: 'Heart, average', score: 'Sensor sleep score',
      trend: 'Trends to notice a change, not a medical reading. If something worries you, call their doctor.',
      noneHow: 'Two ways to see sleep here:', howRadar: 'A bedside sensor sees sleep, breathing and heart rate without touching: Settings, Room sensors, Bedside.',
      howPhone: 'Or leave the phone on the bed overnight with Night watch on. It estimates sleep from movement only.', howPhoneAway: 'Or turn on Night watch on {name}’s own phone: Health, Sleep and breathing.',
      nightWatch: 'Start Night watch on this phone', nwTitle: 'NIGHT WATCH', nwOn: 'Night watch is on', nwHelp: 'Put the phone on the bed beside the pillow, face down, plugged in. The screen goes dark by itself.',
      nwMic: 'Also listen to the room (only how loud it is is kept, never the sound)', nwStop: 'Stop Night watch', nwSaved: 'Saved through {t}', nwNoMotion: 'This phone does not report movement, so Night watch cannot work here.',
      nwKeep: 'Keep Covara open. If the screen turns off, Night watch pauses.', nwTap: 'Tap to see', h: 'h', m: 'm', subWatch: 'From a watch or ring (Health Connect)', hcUse: 'Use my watch or ring (Health Connect)', hcOn: 'Watch or ring connected through Health Connect. Last sent {t}.', hcNone: 'Health Connect is not on this phone.', hcSync: 'Send it now', hcDenied: 'Covara was not allowed to read sleep. You can allow it in Health Connect at any time.', hcPrivacy: 'How Covara uses this' },
    it: { title: 'Sonno e respiro', subNone: 'Ancora nessuna lettura del sonno', subRadar: 'Dal sensore accanto al letto', subPhone: 'Dal telefono sul letto (una stima approssimativa)',
      now: 'Ora', inBed: 'A letto', outBed: 'Fuori dal letto', away: 'Non nella stanza', st_deep: 'Sonno profondo', st_light: 'Sonno leggero', st_awake: 'Sveglio', st_out: 'Fuori dal letto', st_none: 'Nessuno',
      breath: 'Respiro', heart: 'Cuore', perMin: '/min', lastNight: 'La notte scorsa', asleep: 'Ha dormito', deep: 'Profondo', woke: 'Sveglio a letto', up: 'Si è alzato', times: '{n} volte', once: 'una volta', never: 'mai',
      fellAsleep: 'Si è addormentato', wokeUp: 'Ultimo sonno', avgBreath: 'Respiro, media', avgHeart: 'Cuore, media', score: 'Punteggio del sensore',
      trend: 'Andamenti per notare un cambiamento, non una misura medica. Se qualcosa ti preoccupa, chiama il medico.',
      noneHow: 'Due modi per vedere il sonno qui:', howRadar: 'Un sensore accanto al letto vede sonno, respiro e battito senza contatto: Impostazioni, Sensori nelle stanze, Accanto al letto.',
      howPhone: 'Oppure lascia il telefono sul letto di notte con Veglia notturna attiva. Stima il sonno solo dal movimento.', howPhoneAway: 'Oppure attiva Veglia notturna sul telefono di {name}: Salute, Sonno e respiro.',
      nightWatch: 'Avvia Veglia notturna su questo telefono', nwTitle: 'VEGLIA NOTTURNA', nwOn: 'Veglia notturna attiva', nwHelp: 'Metti il telefono sul letto accanto al cuscino, a faccia in giù, in carica. Lo schermo si oscura da solo.',
      nwMic: 'Ascolta anche la stanza (si tiene solo il volume, mai il suono)', nwStop: 'Ferma Veglia notturna', nwSaved: 'Salvato fino alle {t}', nwNoMotion: 'Questo telefono non segnala il movimento, quindi Veglia notturna non funziona qui.',
      nwKeep: 'Tieni Covara aperta. Se lo schermo si spegne, Veglia notturna si ferma.', nwTap: 'Tocca per vedere', h: 'h', m: 'min', subWatch: 'Da un orologio o anello (Health Connect)', hcUse: 'Usa il mio orologio o anello (Health Connect)', hcOn: 'Orologio o anello collegato tramite Health Connect. Ultimo invio {t}.', hcNone: 'Health Connect non è su questo telefono.', hcSync: 'Invia ora', hcDenied: 'Covara non ha il permesso di leggere il sonno. Puoi darlo in Health Connect quando vuoi.', hcPrivacy: 'Come Covara usa questi dati' }
  };
  function IT() { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } }
  function t(k, p) { var s = (IT() ? S.it : S.en)[k] || S.en[k] || k; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function hm(ms) { try { return new Date(ms).toLocaleTimeString(IT() ? 'it' : 'en-US', { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }
  function dur(min) { min = Math.round(min || 0); var h = Math.floor(min / 60), m = min % 60; return (h ? h + ' ' + t('h') + ' ' : '') + m + ' ' + t('m'); }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  var COL = { deep: '#6d5dfc', light: '#38bdf8', awake: '#ffd24d', out: '#ef4444', none: 'rgba(143,180,255,.25)' };

  /* ── last night as a picture: four lanes, top to bottom Out, Awake, Light, Deep ── */
  function hypnogram(series) {
    var rows = (series || []).filter(function (r) { return r.at > Date.now() - 20 * 3600e3; });
    if (!rows.length) return '';
    var a = rows[0].at, b = rows[rows.length - 1].at + 60000, W = 300, H = 104, L = 46, R = 6, T = 6, lane = (H - T - 20) / 4;
    var lanes = { out: 0, awake: 1, light: 2, deep: 3 }, x = function (ms) { return L + (ms - a) / Math.max(60000, b - a) * (W - L - R); };
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="' + esc(t('lastNight')) + '" style="display:block;margin:6px 0 2px">';
    ['out', 'awake', 'light', 'deep'].forEach(function (k, i) { svg += '<text x="0" y="' + (T + i * lane + lane * 0.68) + '" fill="rgba(200,214,232,.75)" font-size="8.5" font-family="JetBrains Mono,monospace">' + esc(t('st_' + k).split(' ')[0].toUpperCase().slice(0, 6)) + '</text><line x1="' + L + '" x2="' + (W - R) + '" y1="' + (T + (i + 1) * lane) + '" y2="' + (T + (i + 1) * lane) + '" stroke="rgba(143,180,255,.12)"/>'; });
    var prev = null, segs = [];
    rows.forEach(function (r) { var s = r.in_bed === 0 ? 'out' : (r.stage === 'rem' ? 'light' : r.stage); if (!lanes.hasOwnProperty(s)) return; if (prev && prev.s === s && r.at - prev.b <= 3 * 60000) prev.b = r.at + 60000; else { prev = { s: s, a: r.at, b: r.at + 60000 }; segs.push(prev); } });
    segs.forEach(function (g) { var y = T + lanes[g.s] * lane + 2; svg += '<rect x="' + x(g.a).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + Math.max(1.2, x(g.b) - x(g.a)).toFixed(1) + '" height="' + (lane - 4).toFixed(1) + '" rx="2" fill="' + COL[g.s] + '" opacity=".9"/>'; });
    /* hours along the bottom */
    var h0 = new Date(a); h0.setMinutes(0, 0, 0); for (var hh = h0.getTime() + 3600e3; hh < b; hh += 3600e3) { var d = new Date(hh); if (d.getHours() % 2) continue; svg += '<text x="' + x(hh).toFixed(1) + '" y="' + (H - 4) + '" text-anchor="middle" fill="rgba(159,180,226,.8)" font-size="8.5" font-family="JetBrains Mono,monospace">' + esc(hm(hh).replace(':00', '')) + '</text>'; }
    return svg + '</svg>';
  }
  function spark(series, k, col, lo, hi) {
    var pts = (series || []).filter(function (r) { return r[k] > 0; }); if (pts.length < 3) return '';
    var a = pts[0].at, b = pts[pts.length - 1].at, W = 300, H = 34;
    var p = pts.map(function (r) { return ((r.at - a) / Math.max(1, b - a) * (W - 4) + 2).toFixed(1) + ',' + (H - 3 - (Math.max(lo, Math.min(hi, r[k])) - lo) / (hi - lo) * (H - 6)).toFixed(1); }).join(' ');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="display:block"><polyline points="' + p + '" fill="none" stroke="' + col + '" stroke-width="1.6" stroke-linejoin="round" opacity=".9"/></svg>';
  }

  /* ── the Health block ── */
  function sub(v) {
    if (!v || !v.source) return t('subNone');
    var live = (v.sensors || []).filter(function (s) { return s.vitals; })[0];
    if (live && live.vitals) { var x = live.vitals; return t('now') + ': ' + (x.in_bed === 0 ? t('outBed') : t('st_' + (x.stage || 'none'))) + (x.breath ? ' · ' + t('breath') + ' ' + Math.round(x.breath) + t('perMin') : ''); }
    var n = v.night; return n ? t('lastNight') + ': ' + t('asleep') + ' ' + dur(n.asleep_min) : t('subNone');
  }
  function body(v, name, self) {
    var h = '';
    if (!v || !v.source) {
      h += '<div class="cvx-sub">' + esc(t('noneHow')) + '</div><ul class="cvh-w"><li>' + esc(t('howRadar')) + '</li><li>' + esc(self ? t('howPhone') : t('howPhoneAway', { name: name })) + '</li></ul>';
      if (self) h += hcBlock() + '<button type="button" class="cvx-add" data-sleep-act="watch">' + esc(t('nightWatch')) + '</button>';
      return h;
    }
    var live = (v.sensors || []).filter(function (s) { return s.vitals; })[0];
    if (live) {
      var x = live.vitals;
      h += '<div class="cvs-now"><b>' + esc(t('now')) + ' · ' + esc(live.name) + '</b><div class="cvs-tiles">' +
        '<span style="--c:' + (x.in_bed === 0 ? COL.out : COL[x.stage] || COL.none) + '"><i>' + esc(x.in_bed === 0 ? t('outBed') : x.presence === 0 ? t('away') : t('st_' + (x.stage || 'none'))) + '</i></span>' +
        (x.breath ? '<span style="--c:#22d3a6"><em>' + Math.round(x.breath) + '</em><i>' + esc(t('breath')) + t('perMin') + '</i></span>' : '') +
        (x.heart ? '<span style="--c:#ff6b8a"><em>' + Math.round(x.heart) + '</em><i>' + esc(t('heart')) + t('perMin') + '</i></span>' : '') + '</div></div>';
    }
    var n = v.night;
    if (n) {
      h += '<div class="cvx-q" style="margin:10px 6px 0;color:rgba(159,216,255,.85)">' + esc(t('lastNight')) + '</div>' + hypnogram(v.series) +
        '<dl class="cvs-kv"><dt>' + esc(t('asleep')) + '</dt><dd>' + esc(dur(n.asleep_min)) + '</dd><dt>' + esc(t('deep')) + '</dt><dd>' + esc(dur(n.deep_min)) + '</dd>' +
        '<dt>' + esc(t('woke')) + '</dt><dd>' + esc(dur(n.awake_min)) + '</dd><dt>' + esc(t('up')) + '</dt><dd>' + esc(n.exits ? (n.exits === 1 ? t('once') : t('times', { n: n.exits })) : t('never')) + '</dd>' +
        (n.fell_asleep ? '<dt>' + esc(t('fellAsleep')) + '</dt><dd>' + esc(hm(n.fell_asleep)) + '</dd>' : '') + (n.woke ? '<dt>' + esc(t('wokeUp')) + '</dt><dd>' + esc(hm(n.woke)) + '</dd>' : '') +
        (n.breath ? '<dt>' + esc(t('avgBreath')) + '</dt><dd>' + n.breath + t('perMin') + '</dd>' : '') + (n.heart ? '<dt>' + esc(t('avgHeart')) + '</dt><dd>' + n.heart + t('perMin') + '</dd>' : '') +
        (v.sensor_night && v.sensor_night.score != null ? '<dt>' + esc(t('score')) + '</dt><dd>' + v.sensor_night.score + ' / 100</dd>' : '') + '</dl>' +
        (n.breath ? '<div class="cvs-sp"><small style="color:#22d3a6">' + esc(t('breath')) + '</small>' + spark(v.series, 'breath', '#22d3a6', 6, 34) + '</div>' : '') +
        (n.heart ? '<div class="cvs-sp"><small style="color:#ff6b8a">' + esc(t('heart')) + '</small>' + spark(v.series, 'heart', '#ff6b8a', 40, 120) + '</div>' : '');
    }
    h += '<div class="cvx-sub" style="margin-top:8px">' + esc(v.source === 'radar' ? t('subRadar') : v.source === 'watch' ? t('subWatch') : t('subPhone')) + '. ' + esc(t('trend')) + '</div>';
    if (self) h += hcBlock();
    if (self && v.source !== 'radar') h += '<button type="button" class="cvx-add" data-sleep-act="watch">' + esc(t('nightWatch')) + '</button>';
    return h;
  }
  var css = '.cvs-now{margin:6px 4px 4px;padding:10px;border-radius:12px;border:1px solid rgba(109,93,252,.45);background:rgba(20,18,60,.45)}.cvs-now b{font:700 10px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.16em;color:#c4b5fd;text-transform:uppercase}' +
    '.cvs-tiles{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}.cvs-tiles span{flex:1;min-width:76px;padding:8px;border-radius:10px;background:rgba(5,8,20,.6);border-left:4px solid var(--c);display:flex;flex-direction:column}.cvs-tiles em{font:800 22px var(--nous-font,"Hanken Grotesk",sans-serif);font-style:normal;color:#fff}.cvs-tiles i{font-style:normal;font-size:12px;color:#c8d6e8}' +
    '.cvs-kv{display:grid;grid-template-columns:auto 1fr;gap:3px 12px;margin:6px 6px 0;font-size:13px}.cvs-kv dt{color:#9fb4e2}.cvs-kv dd{margin:0;color:#f0eef5;font-weight:600}.cvs-sp{margin:6px 6px 0}.cvs-sp small{font:700 9.5px var(--nous-mono,monospace);letter-spacing:.14em;text-transform:uppercase}' +
    '#cvNight{position:fixed;inset:0;z-index:9700;background:#000;color:#5b6b8c;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;font-family:var(--nous-font,"Hanken Grotesk",sans-serif)}#cvNight[hidden]{display:none}' +
    '#cvNight .nt{font:700 11px var(--nous-mono,monospace);letter-spacing:.24em;color:#3d4a66}#cvNight .ck{font:300 64px var(--nous-font,sans-serif);color:#2a3550;margin:10px 0}#cvNight p{max-width:420px;font-size:14px;line-height:1.5;color:#55627e}' +
    '#cvNight label{display:flex;gap:8px;align-items:center;justify-content:center;font-size:13px;color:#55627e;margin:10px 0}#cvNight button{margin-top:16px;min-height:44px;padding:0 20px;border-radius:22px;border:1px solid #2a3550;background:transparent;color:#7f8fb0;font:600 14px var(--nous-font,sans-serif)}' +
    '#cvNight.dim>*{opacity:.18}#cvNight .sv{font-size:12px;color:#3d4a66}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ── a watch or ring, through the phone's health store (the Android app only) ── */
  function hc() { try { return window.CovaraNative && typeof CovaraNative.healthStatus === 'function' ? CovaraNative.healthStatus() : null; } catch (e) { return null; } }
  var LASTK = 'cv:hcSync';
  function lastSync() { try { return +localStorage.getItem(LASTK) || 0; } catch (e) { return 0; } }
  function hcBlock() {
    var st = hc(); if (!st) return '';
    var priv = ' <a href="health-privacy.html" target="_blank" rel="noopener" style="color:#9fd8ff">' + esc(t('hcPrivacy')) + '</a>';
    if (st === 'granted') return '<div class="cvx-sub" style="margin-top:8px">' + esc(t('hcOn', { t: lastSync() ? hm(lastSync()) : '…' })) + priv + '</div><button type="button" class="cvx-add" data-sleep-act="hcsync">' + esc(t('hcSync')) + '</button>';
    if (st === 'unavailable') return '';
    return '<button type="button" class="cvx-add" data-sleep-act="hc">' + esc(t('hcUse')) + '</button><div class="cvx-sub">' + priv + '</div>';
  }
  async function hcSync(force) {
    if (hc() !== 'granted' || role() !== 'home') return;
    if (!force && Date.now() - lastSync() < 30 * 60000) return;
    try {
      await SyncEngine.apiFetch('/care/me');   /* makes sure the sign in is fresh before the phone uses it */
      CovaraNative.healthSync(SyncEngine.getApiBase(), SyncEngine.getAccessToken());
    } catch (e) {}
  }
  if (!window.CovaraNativeEvent) window.CovaraNativeEvent = function (j) { try { window.dispatchEvent(new CustomEvent('covara-native', { detail: JSON.parse(j) })); } catch (e) {} };
  window.addEventListener('covara-native', function (e) {
    var d = e.detail || {};
    if (d.kind === 'resume') { hcSync(false); return; }
    if (d.kind !== 'health') return;
    if (d.type === 'granted') hcSync(true);
    else if (d.type === 'denied') alertBox(t('hcDenied'));
    else if (d.type === 'unavailable') alertBox(t('hcNone'));
    else if (d.type === 'synced') { try { localStorage.setItem(LASTK, String(Date.now())); } catch (x) {} try { if (window.CovaraView) CovaraView.load(); } catch (x) {} }
  });
  setTimeout(function () { hcSync(false); }, 15000);
  setInterval(function () { hcSync(false); }, 10 * 60000);

  /* ── Night watch: HOME's phone on the bed, a reading a minute ── */
  var nw = null;
  function startWatch() {
    if (nw) return;
    if (typeof DeviceMotionEvent === 'undefined') { alertBox(t('nwNoMotion')); return; }
    var go = function () {
      var box = document.getElementById('cvNight');
      if (!box) {
        box = document.createElement('div'); box.id = 'cvNight'; box.setAttribute('role', 'dialog');
        box.innerHTML = '<div class="nt"></div><div class="ck"></div><p class="hp"></p><label><input type="checkbox" class="mic"> <span></span></label><div class="sv"></div><button type="button" class="st"></button>';
        document.body.appendChild(box);
        ['pointerdown', 'touchstart', 'mousedown'].forEach(function (ev) { box.addEventListener(ev, function (e) { e.stopPropagation(); box.classList.remove('dim'); clearTimeout(box._dim); box._dim = setTimeout(function () { box.classList.add('dim'); }, 15000); }, { passive: true }); });
      }
      box.querySelector('.nt').textContent = t('nwTitle'); box.querySelector('.hp').textContent = t('nwHelp') + ' ' + t('nwKeep');
      box.querySelector('label span').textContent = t('nwMic'); box.querySelector('.st').textContent = t('nwStop');
      box.querySelector('.st').onclick = stopWatch;
      box.querySelector('.mic').onchange = function () { if (this.checked) micOn(); else micOff(); };
      box.hidden = false; clearTimeout(box._dim); box._dim = setTimeout(function () { box.classList.add('dim'); }, 15000);
      nw = { box: box, acc: 0, n: 0, last: null, minute: Math.floor(Date.now() / 60000), samples: [], snd: 0, sndN: 0, lock: null };
      window.addEventListener('devicemotion', onMotion);
      lock(); document.addEventListener('visibilitychange', lock);
      nw.tick = setInterval(minute, 5000);
      nw.clock = setInterval(function () { box.querySelector('.ck').textContent = hm(Date.now()); }, 1000); box.querySelector('.ck').textContent = hm(Date.now());
    };
    /* iPhone asks once for motion */
    if (typeof DeviceMotionEvent.requestPermission === 'function') DeviceMotionEvent.requestPermission().then(function (r) { if (r === 'granted') go(); else alertBox(t('nwNoMotion')); }).catch(function () { alertBox(t('nwNoMotion')); });
    else go();
  }
  function lock() { try { if (nw && document.visibilityState === 'visible' && navigator.wakeLock) navigator.wakeLock.request('screen').then(function (l) { if (nw) nw.lock = l; }).catch(function () {}); } catch (e) {} }
  function onMotion(e) {
    if (!nw) return;
    var a = e.accelerationIncludingGravity || e.acceleration; if (!a) return;
    var v = [a.x || 0, a.y || 0, a.z || 0];
    if (nw.last) { nw.acc += Math.abs(v[0] - nw.last[0]) + Math.abs(v[1] - nw.last[1]) + Math.abs(v[2] - nw.last[2]); nw.n++; }
    nw.last = v;
  }
  function minute() {
    if (!nw) return;
    if (nw.mic) { try { var buf = new Float32Array(nw.mic.an.fftSize); nw.mic.an.getFloatTimeDomainData(buf); var s = 0; for (var i = 0; i < buf.length; i++) s += buf[i] * buf[i]; nw.snd += Math.min(100, Math.sqrt(s / buf.length) * 400); nw.sndN++; } catch (e) {} }
    var m = Math.floor(Date.now() / 60000);
    if (m === nw.minute) return;
    /* how much the bed moved this minute, 0 (still) to 100 (getting up) */
    var move = nw.n ? Math.min(100, nw.acc / nw.n * 60) : 0;
    nw.samples.push({ at: nw.minute * 60000, move: Math.round(move * 10) / 10, sound: nw.sndN ? Math.round(nw.snd / nw.sndN) : null });
    nw.acc = 0; nw.n = 0; nw.snd = 0; nw.sndN = 0; nw.minute = m;
    if (nw.samples.length >= 5) send();
  }
  function send() {
    if (!nw || !nw.samples.length) return;
    var batch = nw.samples.splice(0, nw.samples.length);
    try {
      SyncEngine.apiFetch('/care/sleep/phone', { method: 'POST', body: JSON.stringify({ samples: batch }) })
        .then(function (r) { if (!r.ok) throw 0; if (nw) nw.box.querySelector('.sv').textContent = t('nwSaved', { t: hm(Date.now()) }); })
        .catch(function () { if (nw) nw.samples = batch.concat(nw.samples).slice(-240); });
    } catch (e) { nw.samples = batch.concat(nw.samples).slice(-240); }
  }
  function micOn() { if (!nw || nw.mic || !navigator.mediaDevices) return; navigator.mediaDevices.getUserMedia({ audio: true }).then(function (ms) { var ac = new (window.AudioContext || window.webkitAudioContext)(), an = ac.createAnalyser(); an.fftSize = 2048; ac.createMediaStreamSource(ms).connect(an); if (nw) nw.mic = { ms: ms, ac: ac, an: an }; else ms.getTracks().forEach(function (x) { x.stop(); }); }).catch(function () { if (nw) nw.box.querySelector('.mic').checked = false; }); }
  function micOff() { if (nw && nw.mic) { try { nw.mic.ms.getTracks().forEach(function (x) { x.stop(); }); nw.mic.ac.close(); } catch (e) {} nw.mic = null; } }
  function stopWatch() {
    if (!nw) return;
    minute(); send(); micOff();
    window.removeEventListener('devicemotion', onMotion); document.removeEventListener('visibilitychange', lock);
    clearInterval(nw.tick); clearInterval(nw.clock); try { if (nw.lock) nw.lock.release(); } catch (e) {}
    nw.box.hidden = true; nw = null;
    try { if (window.CovaraView) CovaraView.load(); } catch (e) {}
  }
  function alertBox(msg) { try { if (typeof showToast === 'function') showToast(msg); else window.alert(msg); } catch (e) {} }
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-sleep-act]'); if (!b) return; e.preventDefault(); e.stopPropagation(); var act = b.getAttribute('data-sleep-act'); if (act === 'watch') startWatch(); else if (act === 'hc') { try { CovaraNative.healthConnect(); } catch (x) {} } else if (act === 'hcsync') hcSync(true); }, true);

  /* For the 24 hour schedule bar: HOME's sleep as bands */
  function bands(series) {
    var out = [], cur = null;
    (series || []).forEach(function (r) {
      var s = r.in_bed === 0 ? null : r.stage === 'deep' ? 'deep' : (r.stage === 'light' || r.stage === 'rem') ? 'light' : null;
      if (s && cur && cur.s === s && r.at - cur.b <= 3 * 60000) cur.b = r.at + 60000;
      else if (s) { cur = { s: s, a: r.at, b: r.at + 60000 }; out.push(cur); } else cur = null;
    });
    return out;
  }
  window.CovaraSleep = { title: function () { return t('title'); }, sub: sub, body: body, bands: bands, startWatch: startWatch, stopWatch: stopWatch, watching: function () { return !!nw; } };
})();
