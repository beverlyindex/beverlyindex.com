/* Remiel: Covara, WHEREIS.
   Two sweeping radars where Sentinel draws WHEREIS, both about HOME:
   - the circle beside the dream picture: Remiel: Personal Protection's radar map, centred on
     HOME, with who from HOME's circle is with HOME (from the phone closest to HOME's) and, when
     HOME is out of the house, the nearest health facilities;
   - the circle beneath it: room by room inside the home or facility where HOME is.
   HOME's phone sends its position while Remiel: Covara is open and HOME shares location with
   someone; a family member's phone sends its own, which only ever tells whether they are with
   HOME and how far the closest one is. Beverly Index LLC */
(function () {
  'use strict';

  var POLL_MS = 20000, POST_HOME_MS = 30000, POST_AWAY_MS = 60000;
  var IT = function () { try { return I18n.locale === 'it'; } catch (e) { return false; } };
  var S = {
    en: { label: 'WHEREIS', rooms: 'ROOMS', atHome: 'At home', out: 'Out', fromHome: '{d} from home', inside: 'Inside {place}', withYou: 'With you', with: 'With {name}',
      nearest: 'Closest: {name}, {d}', nearestYou: 'Closest: you, {d}', noShare: '{first} has not chosen to share location with you.', noRooms: '{first} has not chosen to share rooms with you.',
      noPos: '{first}\'s position appears when {first}\'s phone opens Remiel: Covara.', finding: 'Finding {first}...', noMap: 'Map not available',
      addSensor: 'Rooms appear once a room sensor is added: Settings, Room sensors.', outRooms: '{first} is out of the house.', home: 'Home', ago: '{t} ago', now: 'now',
      emergency: 'Emergency', hospital: 'Hospital', clinic: 'Clinic', doctor: 'Doctor', fall: 'FALL', here: 'HERE',
      atHomeOf: 'At {home}\'s home', fromHomeOf: '{d} from {home}\'s home', withHome: 'With {home}', homeAway: '{home} is {d} away', homeOf: '{home}\'s home', memberNoShare: '{first} has not shared where they are with you.', memberRooms: 'Rooms are watched in {home}\'s home.',
      driveTo: 'Drive to {name}', driveToTold: '{name} has been told you are coming, about {n} minutes away.', driveToNo: '{name} has not shared where they are with you, so Covara cannot give directions.',
      driving: 'Driving', drivingTo: 'Driving to {name}, about {t}',
      moving: 'MOVING NOW', still: 'STILL', stillFor: 'STILL · {t}', heardBy: '{first}\'s phone · {t}', lastHeard: '{first}\'s phone last heard the room {t}',
      tapListen: 'Tap here to let this phone listen to the room for movement.', listenStarting: 'Starting to listen to the room...', listenDenied: 'Bluetooth was not allowed. Tap here to ask again.',
      installApp: 'Open Remiel: Covara in the Android app on {first}\'s phone to listen to the room.', notListening: '{first}\'s phone is not listening to the room yet.', learning: 'LISTENING · LEARNING THE ROOM' },
    it: { label: 'WHEREIS', rooms: 'STANZE', atHome: 'A casa', out: 'Fuori', fromHome: 'a {d} da casa', inside: 'Dentro {place}', withYou: 'Con te', with: 'Con {name}',
      nearest: 'Più vicino: {name}, {d}', nearestYou: 'Più vicino: tu, {d}', noShare: '{first} non ha scelto di condividere la posizione con te.', noRooms: '{first} non ha scelto di condividere le stanze con te.',
      noPos: 'La posizione di {first} appare quando il telefono di {first} apre Remiel: Covara.', finding: 'Cerco {first}...', noMap: 'Mappa non disponibile',
      addSensor: 'Le stanze appaiono quando si aggiunge un sensore: Impostazioni, Sensori delle stanze.', outRooms: '{first} è fuori casa.', home: 'Casa', ago: '{t} fa', now: 'adesso',
      emergency: 'Pronto soccorso', hospital: 'Ospedale', clinic: 'Clinica', doctor: 'Medico', fall: 'CADUTA', here: 'QUI',
      atHomeOf: 'A casa di {home}', fromHomeOf: 'a {d} dalla casa di {home}', withHome: 'Con {home}', homeAway: '{home} \u00e8 a {d}', homeOf: 'Casa di {home}', memberNoShare: '{first} non condivide con te dove si trova.', memberRooms: 'Le stanze sono quelle della casa di {home}.',
      driveTo: 'Vai da {name}', driveToTold: '{name} sa che stai arrivando, tra circa {n} minuti.', driveToNo: '{name} non ha condiviso con te dove si trova, quindi Covara non può darti indicazioni.',
      driving: 'Alla guida', drivingTo: 'Alla guida verso {name}, arrivo verso le {t}',
      moving: 'IN MOVIMENTO', still: 'FERMO', stillFor: 'FERMO · {t}', heardBy: 'Telefono di {first} · {t}', lastHeard: 'Il telefono di {first} ha sentito la stanza {t}',
      tapListen: 'Tocca qui perché questo telefono ascolti i movimenti nella stanza.', listenStarting: 'Inizio ad ascoltare la stanza...', listenDenied: 'Il Bluetooth non è stato permesso. Tocca qui per chiedere di nuovo.',
      installApp: 'Apri Remiel: Covara nell\'app Android sul telefono di {first} per ascoltare la stanza.', notListening: 'Il telefono di {first} non ascolta ancora la stanza.', learning: 'IN ASCOLTO · IMPARO LA STANZA' }
  };
  function t(k, p) { var s = (IT() ? S.it : S.en)[k] || S.en[k] || k; if (p) s = s.replace(/\{(\w+)\}/g, function (m, x) { return p[x] != null ? p[x] : m; }); return s; }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function authed() { try { return SyncEngine.isAuthenticated() && !SyncEngine.isLocalOnly(); } catch (e) { return false; } }
  function homeContact() {
    if (typeof DEMO_CONTACTS === 'undefined') return null;
    return DEMO_CONTACTS.filter(function (c) { return c.care && c.care.side === 'home' && c.care.state === 'active'; })[0] || null;
  }
  function links(side) { if (typeof DEMO_CONTACTS === 'undefined') return []; return DEMO_CONTACTS.filter(function (c) { return c.care && c.care.side === side && c.care.state === 'active'; }); }
  function on() { var r = role(); return r === 'home' || (r === 'away' && !!homeContact()); }
  function homeUser() { var h = homeContact(); return role() === 'away' && h ? h.care.userId : ''; }
  function first(name) { var w = String(name || '').trim().split(/\s+/)[0]; if (!w) return IT() ? 'Casa' : 'Home'; return w === w.toUpperCase() && w.length > 1 ? w[0] + w.slice(1).toLowerCase() : w; }
  function imperial() { return !IT(); }
  function dist(m) {
    if (m == null || !isFinite(m)) return '';
    if (imperial()) { var ft = m * 3.281; return ft < 1000 ? Math.round(ft / 10) * 10 + ' ft' : (m / 1609.34).toFixed(m < 16093 ? 1 : 0) + ' mi'; }
    return m < 1000 ? Math.round(m / 5) * 5 + ' m' : (m / 1000).toFixed(m < 10000 ? 1 : 0) + ' km';
  }
  function ago(ts) {
    if (!ts) return ''; var s = Math.max(0, (Date.now() - ts) / 1000);
    if (s < 60) return t('now');
    var v = s < 3600 ? Math.round(s / 60) + (IT() ? ' min' : ' min') : s < 86400 ? Math.round(s / 3600) + (IT() ? ' h' : ' h') : Math.round(s / 86400) + (IT() ? ' g' : ' d');
    return t('ago', { t: v });
  }

  /* ── positions: HOME's phone while HOME shares location; a family member's phone for "with HOME" ── */
  var _watch = null, _fix = null, _lastPost = 0, _lastPostAt = null;
  function wantSend() {
    if (!authed() || document.visibilityState !== 'visible') return 0;
    var r = role();
    if (r === 'home') return links('away').some(function (c) { return c.care.share && c.care.share.location; }) ? POST_HOME_MS : 0;
    if (r === 'away') return homeContact() ? POST_AWAY_MS : 0;
    return 0;
  }
  /* ── the installed Android app: HOME's phone keeps sending while locked ──
     The app holds a location-only key (it can send this phone's position and nothing else). Covara asks for one
     while HOME shares location with someone in the circle, and drops it the moment HOME stops sharing or signs out. */
  if (!window.CovaraNativeEvent) window.CovaraNativeEvent = function (j) { try { window.dispatchEvent(new CustomEvent('covara-native', { detail: JSON.parse(j) })); } catch (e) {} };
  var NATIVE = !!(window.CovaraNative && typeof CovaraNative.locStart === 'function'), _nBusy = false, _nTried = 0;
  function nStatus() { try { return JSON.parse(CovaraNative.locStatus() || '{}'); } catch (e) { return {}; } }
  function nativeLive() { if (!NATIVE) return false; var s = nStatus(); return !!(s.on && s.running && s.hasKey); }
  async function nativeSync(force) {
    if (!NATIVE || _nBusy) return;
    var st = nStatus();
    var want = authed() && role() === 'home' && links('away').some(function (c) { return c.care.share && c.care.share.location; });
    if (!want) {
      if (st.on || st.hasKey) {
        try { CovaraNative.locStop(true); } catch (e) {}
        if (authed() && st.device) { try { SyncEngine.apiFetch('/location/device/' + encodeURIComponent(st.device), { method: 'DELETE' }).catch(function () {}); } catch (e) {} }
      }
      return;
    }
    if (st.on && st.running && st.hasKey) return;
    /* one try every 10 minutes, so a refused permission is not asked again and again */
    if (!force && Date.now() - _nTried < 600000) return;
    _nTried = Date.now(); _nBusy = true;
    try {
      var r = await SyncEngine.apiFetch('/location/device', { method: 'POST', body: JSON.stringify({ name: 'Android phone', replaces: st.device || undefined }) });
      var j = await r.json().catch(function () { return {}; });
      if (r.ok && j.token) CovaraNative.locStart(SyncEngine.getApiBase(), j.token, j.id);
    } catch (e) {}
    _nBusy = false;
  }
  window.addEventListener('covara-native', function (e) { if (e.detail && e.detail.kind === 'resume') nativeSync(true); });
  /* ── the same phone listening to HOME's room, while it rests on its charger ──
     The app holds a room key (it can send the room's movement level and nothing else). Covara asks for one
     while HOME shares rooms with someone in the circle, and drops it the moment HOME stops sharing or signs out. */
  var RNATIVE = !!(window.CovaraNative && typeof CovaraNative.roomStart === 'function'), _rBusy = false, _rTried = 0, _rState = '';
  function rStatus() { try { return JSON.parse(CovaraNative.roomStatus() || '{}'); } catch (e) { return {}; } }
  function roomWanted() { return authed() && role() === 'home' && links('away').some(function (c) { return c.care.share && c.care.share.rooms; }); }
  async function roomSync(force) {
    if (!RNATIVE || _rBusy) return;
    var st = rStatus();
    if (!roomWanted()) {
      if (st.on || st.hasKey) {
        try { CovaraNative.roomStop(true); } catch (e) {}
        if (authed() && st.device) { try { SyncEngine.apiFetch('/location/device/' + encodeURIComponent(st.device), { method: 'DELETE' }).catch(function () {}); } catch (e) {} }
      }
      return;
    }
    if (st.on && st.running && st.hasKey) return;
    /* asked once by itself; after a refusal, only when HOME taps the room circle */
    var asked = false; try { asked = localStorage.getItem('rc:roomAsked') === '1'; } catch (e) {}
    if (!force && (asked || Date.now() - _rTried < 600000)) return;
    _rTried = Date.now(); _rBusy = true; _rState = 'starting';
    try { localStorage.setItem('rc:roomAsked', '1'); } catch (e) {}
    try {
      var r = await SyncEngine.apiFetch('/location/room-device', { method: 'POST', body: JSON.stringify({ name: 'Room listener', replaces: st.device || undefined }) });
      var j = await r.json().catch(function () { return {}; });
      if (r.ok && j.token) CovaraNative.roomStart(SyncEngine.getApiBase(), j.token, j.id); else _rState = '';
    } catch (e) { _rState = ''; }
    _rBusy = false;
  }
  window.addEventListener('covara-native', function (e) {
    var d = e.detail || {};
    if (d.kind === 'resume') roomSync(false);
    if (d.kind === 'room') { _rState = d.state === 'denied' ? 'denied' : 'started'; setTimeout(function () { load(true); }, 70000); }
  });
  /* a tap on the room circle on HOME's own phone starts listening when it is not yet */
  document.addEventListener('click', function (e) {
    var m = window._dreamMicroHit; if (!m || !RNATIVE || role() !== 'home' || !shown()) return;
    var cv = document.getElementById('sphere'); if (!cv) return;
    var rc = cv.getBoundingClientRect(), dx = e.clientX - rc.left - m.cx, dy = e.clientY - rc.top - m.cy;
    if (dx * dx + dy * dy > m.r * m.r) return;
    var st = rStatus(); if (st.on && st.running) return;
    roomSync(true);
  }, true);
  setInterval(function () { if (document.visibilityState === 'visible') roomSync(false); }, 30000);
  setTimeout(function () { roomSync(false); }, 6000);
  window.CovaraWhereNative = { sync: nativeSync, status: function () { return NATIVE ? nStatus() : null; }, roomSync: roomSync, roomStatus: function () { return RNATIVE ? rStatus() : null; } };

  function moved(a, b) { if (!a || !b) return Infinity; return Math.hypot((a.lat - b.lat) * 111320, (a.lon - b.lon) * 111320 * Math.cos(a.lat * Math.PI / 180)); }
  function post(force) {
    var every = wantSend(); if (!every || !_fix) return;
    if (role() === 'home' && nativeLive()) return;
    var now = Date.now();
    if (!force && now - _lastPost < every && moved(_fix, _lastPostAt) < 25) return;
    _lastPost = now; _lastPostAt = { lat: _fix.lat, lon: _fix.lon };
    try { SyncEngine.apiFetch('/location', { method: 'POST', body: JSON.stringify({ latitude: _fix.lat, longitude: _fix.lon, accuracy: _fix.acc, continuous: true }) }).catch(function () {}); } catch (e) {}
  }
  function watch() {
    nativeSync(false);
    var want = !!wantSend();
    if (want && _watch == null && navigator.geolocation) {
      try {
        _watch = navigator.geolocation.watchPosition(function (p) {
          _fix = { lat: p.coords.latitude, lon: p.coords.longitude, acc: Math.round(p.coords.accuracy || 0) };
          post(false);
        }, function () {}, { enableHighAccuracy: role() === 'home', maximumAge: 30000, timeout: 30000 });
      } catch (e) {}
    } else if (!want && _watch != null) { try { navigator.geolocation.clearWatch(_watch); } catch (e) {} _watch = null; }
    if (want) post(false);
  }
  setInterval(watch, 15000);
  setTimeout(watch, 4000);
  document.addEventListener('visibilitychange', watch);

  /* ── what the server says ── */
  var _data = null, _for = '', _at = 0, _busy = false, _shownAt = 0;
  /* WHEREIS follows the sphere chosen: a family member, as that member allows; else HOME */
  function whoUser() {
    var f = (typeof focusedContactId !== 'undefined') ? focusedContactId : null; if (f == null || typeof DEMO_CONTACTS === 'undefined') return '';
    var c = DEMO_CONTACTS.filter(function (x) { return x.id === f; })[0], h = homeContact();
    if (!c || !c.care || !c.care.userId || c.care.state !== 'active') return '';
    if (h && c.care.userId === h.care.userId) return '';
    return c.care.userId;
  }
  function load(force) {
    if (!authed() || _busy) return;
    var hu = homeUser(), w = whoUser(), h = hu + '|' + w;
    var urgent = false; try { urgent = !!(window.CovaraHelp && CovaraHelp.list().length); } catch (e) {}
    if (!force && _for === h && Date.now() - _at < (urgent ? 8000 : POLL_MS)) return;
    if (_for !== h) { _data = null; _for = h; }
    _busy = true;
    var q = []; if (hu) q.push('home=' + encodeURIComponent(hu)); if (w) q.push('who=' + encodeURIComponent(w));
    SyncEngine.apiFetch('/care/whereis' + (q.length ? '?' + q.join('&') : ''), { method: 'GET' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (_for !== h) { _busy = false; return; } _data = j; _for = h; _at = Date.now(); if (j && j.rooms && j.rooms.phone) _roomAt = _at; _busy = false; mapTo(); })
      .catch(function () { _busy = false; _at = Date.now(); });
  }

  /* ── the map: Remiel: Personal Protection's own street map, round, under the radar ── */
  var VEC_TJ = 'https://tiles.openfreemap.org/planet', VEC_GLYPHS = 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf';
  var box = null, mapDiv = null, over = null, map = null, mapState = 'idle', _vec = null;
  function ensureBox() {
    if (box) return;
    box = document.createElement('div'); box.className = 'cvw-macro'; box.hidden = true;
    box.style.cssText = 'position:absolute;z-index:5;border-radius:50%;overflow:hidden;pointer-events:none;background:radial-gradient(circle at 50% 42%,#0e2147 0,#081430 55%,#03070f 100%);box-shadow:0 0 0 1.5px rgba(143,180,255,.55),0 0 26px rgba(79,141,240,.45)';
    mapDiv = document.createElement('div'); mapDiv.style.cssText = 'position:absolute;inset:0;opacity:.9';
    over = document.createElement('canvas'); over.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    box.appendChild(mapDiv); box.appendChild(over);
    (document.getElementById('stage') || document.body).appendChild(box);
  }
  function loadLib() {
    if (window.maplibregl) return Promise.resolve(true);
    return new Promise(function (res) {
      var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://cdnjs.cloudflare.com/ajax/libs/maplibre-gl/4.7.1/maplibre-gl.min.css'; document.head.appendChild(css);
      var s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/maplibre-gl/4.7.1/maplibre-gl.min.js'; s.async = true;
      s.onload = function () { res(!!window.maplibregl); }; s.onerror = function () { res(false); }; document.head.appendChild(s);
      setTimeout(function () { res(!!window.maplibregl); }, 8000);
    });
  }
  function zw() { return ['interpolate', ['exponential', 1.5], ['zoom']].concat([].slice.call(arguments)); }
  function inCls() { return ['match', ['get', 'class'], [].slice.call(arguments), true, false]; }
  function road() { return ['all', inCls.apply(null, arguments), ['!=', ['get', 'brunnel'], 'tunnel']]; }
  /* The layers and colours of Remiel: Personal Protection's map */
  function style() {
    var F = ['Noto Sans Regular'], nm = ['coalesce', ['get', 'name:latin'], ['get', 'name']];
    return { version: 8, glyphs: _vec.glyphs, sources: { base: { type: 'vector', tiles: _vec.tiles, minzoom: 0, maxzoom: _vec.maxzoom || 14, attribution: '&copy; OpenStreetMap, OpenMapTiles, OpenFreeMap' } }, layers: [
      { id: 'b-bg', type: 'background', paint: { 'background-color': '#081124' } },
      { id: 'b-green', type: 'fill', source: 'base', 'source-layer': 'landcover', filter: inCls('wood', 'grass'), paint: { 'fill-color': '#0b2030', 'fill-opacity': .9 } },
      { id: 'b-park', type: 'fill', source: 'base', 'source-layer': 'landuse', filter: inCls('park', 'cemetery', 'pitch'), paint: { 'fill-color': '#0b2030', 'fill-opacity': .7 } },
      { id: 'b-water', type: 'fill', source: 'base', 'source-layer': 'water', paint: { 'fill-color': '#0f2f6b' } },
      { id: 'b-bldg', type: 'fill', source: 'base', 'source-layer': 'building', minzoom: 13, paint: { 'fill-color': '#16305f', 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 13, .45, 16, .9] } },
      { id: 'b-bldg-l', type: 'line', source: 'base', 'source-layer': 'building', minzoom: 15, paint: { 'line-color': '#4273c9', 'line-width': zw(15, .5, 19, 1.4), 'line-opacity': .9 } },
      { id: 'b-path', type: 'line', source: 'base', 'source-layer': 'transportation', minzoom: 14, filter: road('path', 'pedestrian'), layout: { 'line-cap': 'round' }, paint: { 'line-color': '#2f5298', 'line-width': zw(14, .5, 19, 1.8), 'line-opacity': .75, 'line-dasharray': [3, 2] } },
      { id: 'b-minor', type: 'line', source: 'base', 'source-layer': 'transportation', minzoom: 12, filter: road('minor', 'service', 'track'), layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#3560b3', 'line-width': zw(12, .4, 15, 2, 18, 10, 21, 34) } },
      { id: 'b-major', type: 'line', source: 'base', 'source-layer': 'transportation', minzoom: 8, filter: road('primary', 'secondary', 'tertiary', 'trunk'), layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#4a7fe0', 'line-width': zw(8, .5, 13, 2, 16, 6, 19, 18, 21, 44) } },
      { id: 'b-motor', type: 'line', source: 'base', 'source-layer': 'transportation', minzoom: 5, filter: road('motorway'), layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#6f9ff5', 'line-width': zw(5, .5, 12, 2.5, 16, 8, 20, 26) } },
      { id: 'b-road-n', type: 'symbol', source: 'base', 'source-layer': 'transportation_name', minzoom: 14, filter: ['!=', ['get', 'brunnel'], 'tunnel'], layout: { 'symbol-placement': 'line', 'symbol-spacing': 170, 'text-field': nm, 'text-font': F, 'text-size': 10.5 }, paint: { 'text-color': '#b9cdf5', 'text-halo-color': '#070b16', 'text-halo-width': 1.5 } }
    ] };
  }
  function startMap() {
    if (mapState !== 'idle') return;
    mapState = 'loading';
    loadLib().then(function (ok) {
      if (!ok) { mapState = 'failed'; return null; }
      return fetch(VEC_TJ).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    }).then(function (j) {
      if (mapState === 'failed') return;
      if (!j || !j.tiles || !j.tiles.length) { mapState = 'failed'; return; }
      _vec = { tiles: j.tiles, maxzoom: j.maxzoom || 14, glyphs: VEC_GLYPHS };
      try {
        map = new maplibregl.Map({ container: mapDiv, style: style(), interactive: false, attributionControl: false, center: [0, 0], zoom: 1, fadeDuration: 0 });
        map.on('load', function () { mapState = 'ready'; mapTo(); });
        map.on('error', function () {});
      } catch (e) { mapState = 'failed'; }
    });
  }
  /* The radius the radar spans: the street around HOME at home; out, as far as the nearest health facilities */
  /* during a call for help: everything near the caller that can answer, from covara-help.js */
  function helpNear() {
    var d = _data; if (!d || !d.home || !window.CovaraHelp) return null;
    try { var hp = CovaraHelp.forPerson(d.home.id); if (!hp) return null; var n = CovaraHelp.near(hp); return { hp: hp, places: (n && n.places) || [], first: CovaraHelp.first(hp) }; } catch (e) { return null; }
  }
  function spanM() {
    var d = _data;
    if (!d || !d.location) return 150;
    var hn0 = helpNear();
    if (hn0 && hn0.places.length) {
      /* wide enough for the closest few, and always the first place to call */
      var f0 = 300; hn0.places.slice(0, 4).forEach(function (x) { f0 = Math.max(f0, x.m * 1.2); });
      if (hn0.first) f0 = Math.max(f0, hn0.first.m * 1.2);
      return Math.min(8000, f0);
    }
    if (d.at_home === false) {
      var far = 250, L0 = d.location;
      (d.health || []).slice(0, 3).forEach(function (x) { far = Math.max(far, x.m * 1.18); });
      (d.trail || []).forEach(function (p) { far = Math.max(far, 1.15 * Math.hypot((p[0] - L0.lat) * 111320, (p[1] - L0.lon) * 111320 * Math.cos(L0.lat * Math.PI / 180))); });
      if (d.from_home_m) far = Math.max(far, d.from_home_m * 1.1);
      return Math.min(4000, far);
    }
    return Math.max(120, Math.min(400, (d.location.accuracy || 0) * 2.5));
  }
  var _R = 100;
  function zoomFor(lat, span, R) { var mpp = span / R; return Math.log2(40075016.686 * Math.cos(lat * Math.PI / 180) / (512 * mpp)); }
  function mapTo() {
    if (!map || mapState !== 'ready' || !_data || !_data.location) return;
    try { map.resize(); map.jumpTo({ center: [_data.location.lon, _data.location.lat], zoom: zoomFor(_data.location.lat, spanM(), _R) }); } catch (e) {}
  }

  /* ── the radar ── */
  var SWEEP_S = 4;
  function sweepA(now, per) { per = per || SWEEP_S; return ((now / 1000) % per) / per * Math.PI * 2 - Math.PI / 2; }
  function sweepLit(now, a) { var lag = ((sweepA(now) - a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2); return Math.exp(-lag / 1.1); }
  function sweep(x, cx, cy, R, now, gold, per) {
    var a = sweepA(now, per);
    if (x.createConicGradient) {
      var g = x.createConicGradient(a - 1.25, cx, cy);
      g.addColorStop(0, 'rgba(211,181,119,0)'); g.addColorStop(.17, 'rgba(211,181,119,' + (gold ? .18 : .14) + ')'); g.addColorStop(.197, 'rgba(232,206,140,.38)'); g.addColorStop(.199, 'rgba(211,181,119,0)'); g.addColorStop(1, 'rgba(211,181,119,0)');
      x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.fill();
    }
    x.save(); x.shadowColor = 'rgba(255,226,160,.9)'; x.shadowBlur = 8; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a)); x.strokeStyle = 'rgba(255,232,178,.9)'; x.lineWidth = 1.6; x.stroke(); x.restore();
  }
  function rim(x, cx, cy, R) {
    var rg = x.createLinearGradient(cx - R, cy - R, cx + R, cy + R); rg.addColorStop(0, '#dbe8ff'); rg.addColorStop(.35, '#7fa8f0'); rg.addColorStop(.7, '#2c55a8'); rg.addColorStop(1, '#9fc0ff');
    x.save(); x.shadowColor = 'rgba(79,141,240,.75)'; x.shadowBlur = 12; x.beginPath(); x.arc(cx, cy, R - 1.5, 0, Math.PI * 2); x.strokeStyle = rg; x.lineWidth = 2.4; x.stroke(); x.restore();
    x.strokeStyle = 'rgba(185,205,245,.35)'; x.lineWidth = 1;
    for (var k = 0; k < 72; k++) { var a = k * 5 * Math.PI / 180, l = k % 6 === 0 ? 6 : 3; x.beginPath(); x.moveTo(cx + (R - 3) * Math.cos(a), cy + (R - 3) * Math.sin(a)); x.lineTo(cx + (R - 3 - l) * Math.cos(a), cy + (R - 3 - l) * Math.sin(a)); x.stroke(); }
  }
  var MONO = '"JetBrains Mono", "SF Mono", monospace', SANS = '"Hanken Grotesk", system-ui, sans-serif';
  function text(x, s, px, py, font, col, align) { x.font = font; x.textAlign = align || 'center'; x.textBaseline = 'middle'; x.lineWidth = 3; x.strokeStyle = 'rgba(5,10,24,.9)'; x.strokeText(s, px, py); x.fillStyle = col; x.fillText(s, px, py); }
  /* Shortens s with an ellipsis until it fits w pixels in the current font */
  function fit(x, s, font, w) { x.font = font; s = String(s || ''); if (x.measureText(s).width <= w) return s; while (s.length > 2 && x.measureText(s + '…').width > w) s = s.slice(0, -1); return s.replace(/[\s,·]+$/, '') + '…'; }
  function chord(R, c, y) { var dy = y - c; return 2 * Math.sqrt(Math.max(0, R * R - dy * dy)); }
  function wrap(s, max) { var w = String(s || '').split(/\s+/), out = [], cur = ''; w.forEach(function (x) { if ((cur + ' ' + x).trim().length > max && cur) { out.push(cur); cur = x; } else cur = (cur + ' ' + x).trim(); }); if (cur) out.push(cur); return out; }
  function photoOfHome() {
    try {
      if (role() === 'away') { var h = homeContact(); var p = h && contactPhotos.get(h.id); return p && p.img ? p.img : null; }
      return (typeof mediaFrame !== 'undefined' && mediaFrame) ? mediaFrame : null;
    } catch (e) { return null; }
  }
  function homeDot(x, px, py, r, now, name) {
    var pu = ((now / 1000) % 1.6) / 1.6;
    x.beginPath(); x.arc(px, py, r + 4 + pu * r * 1.6, 0, Math.PI * 2); x.strokeStyle = '#d3b577'; x.globalAlpha = 1 - pu; x.lineWidth = 2; x.stroke(); x.globalAlpha = 1;
    x.save(); x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.clip();
    var img = photoOfHome(), iw = img && (img.naturalWidth || img.videoWidth || img.width), ih = img && (img.naturalHeight || img.videoHeight || img.height);
    var g = x.createRadialGradient(px - r * .3, py - r * .3, 0, px, py, r); g.addColorStop(0, '#9fe7ff'); g.addColorStop(1, '#1f7fd1'); x.fillStyle = g; x.fillRect(px - r, py - r, 2 * r, 2 * r);
    if (img && iw && ih) { var sc = Math.max(2 * r / iw, 2 * r / ih); x.drawImage(img, px - iw * sc / 2, py - ih * sc / 2, iw * sc, ih * sc); }
    else {
      var ini = String(name || '').trim().split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase(); text(x, ini, px, py + 1, '800 ' + Math.round(r * .8) + 'px ' + SANS, '#06101f'); }
    x.restore();
    x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.strokeStyle = '#d3b577'; x.lineWidth = 2; x.stroke();
  }
  function initials(n) { return String(n || '').trim().split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase(); }
  var HC = { emergency: '#ff3d5a', hospital: '#ff4f7a', urgent: '#ff7a9a', clinic: '#ff8fb1', doctor: '#ffb4c8', police: '#5b9cff', fire: '#ff8a3d', pharmacy: '#3ee08f', aed: '#ffd24d' };
  function kname(k) { try { if (window.CovaraHelp) return CovaraHelp.kindName(k); } catch (e) {} return t(k || 'doctor'); }

  var driveBtn = null;
  function driveButton(L, T, D) {
    var d = _data, show = role() === 'home' && d && d.member && d.location && d.home && d.home.id;
    if (!driveBtn) {
      driveBtn = document.createElement('button'); driveBtn.type = 'button'; driveBtn.className = 'cvw-drive';
      driveBtn.style.cssText = 'position:absolute;z-index:6;min-height:40px;padding:0 16px;border-radius:20px;border:1px solid #ffd24d;background:linear-gradient(155deg,rgba(255,210,77,.95),rgba(217,154,0,.95));color:#2a1600;font:800 14px var(--nous-font,"Hanken Grotesk",sans-serif);box-shadow:0 0 18px rgba(255,200,60,.45);cursor:pointer;white-space:nowrap';
      driveBtn.onclick = driveGo;
      (document.getElementById('stage') || document.body).appendChild(driveBtn);
    }
    driveBtn.hidden = !show;
    if (!show) return;
    var label = '🚗 ' + t('driveTo', { name: first(d.home.name) });
    if (driveBtn.textContent !== label) driveBtn.textContent = label;
    driveBtn.style.left = Math.round(L + D / 2 - driveBtn.offsetWidth / 2) + 'px'; driveBtn.style.top = Math.round(T + D - 22) + 'px';
  }
  async function driveGo() {
    var d = _data; if (!d || !d.home) return;
    driveBtn.disabled = true;
    var body = { user: d.home.id }; if (_fix) { body.lat = _fix.lat; body.lon = _fix.lon; }
    var r = null; try { r = await SyncEngine.apiFetch('/care/drive/to', { method: 'POST', body: JSON.stringify(body) }); } catch (e) { r = null; }
    var j = r ? await r.json().catch(function () { return {}; }) : {};
    driveBtn.disabled = false;
    var nm = first(d.home.name);
    if (!r || !r.ok) { try { showToast(t('driveToNo', { name: nm })); } catch (e) {} return; }
    try { showToast(t('driveToTold', { name: nm, n: j.minutes || '?' })); } catch (e) {}
    var lat = j.to.lat, lon = j.to.lon, ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
    var url = ios ? 'https://maps.apple.com/?daddr=' + lat + ',' + lon + '&dirflg=d' : 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lon + '&travelmode=driving';
    setTimeout(function () { try { window.open(url, '_blank'); } catch (e) { location.href = url; } }, 900);
  }
  function drawMacro(cx, cy, R, now, alpha) {
    ensureBox();
    var cv = document.getElementById('sphere'), st = box.parentNode, cr = cv ? cv.getBoundingClientRect() : { left: 0, top: 0 }, sr = st && st !== document.body ? st.getBoundingClientRect() : { left: 0, top: 0 };
    var off = { left: cr.left - sr.left, top: cr.top - sr.top };
    var L = Math.round(off.left + cx - R), T = Math.round(off.top + cy - R), D = Math.round(R * 2);
    if (box.hidden) box.hidden = false;
    driveButton(L, T, D);
    if (box._k !== L + ',' + T + ',' + D) { box._k = L + ',' + T + ',' + D; box.style.left = L + 'px'; box.style.top = T + 'px'; box.style.width = D + 'px'; box.style.height = D + 'px'; _R = R; if (map) { try { map.resize(); } catch (e) {} } mapTo(); }
    box.style.opacity = String(Math.min(1, 0.72 + alpha * 0.6));
    var d = _data, has = !!(d && d.location);
    mapDiv.style.visibility = has && mapState === 'ready' ? 'visible' : 'hidden';
    if (has) startMap();
    var dp = Math.min(3, window.devicePixelRatio || 1);
    if (over.width !== Math.round(D * dp)) { over.width = Math.round(D * dp); over.height = Math.round(D * dp); }
    var x = over.getContext('2d'); x.setTransform(dp, 0, 0, dp, 0, 0); x.clearRect(0, 0, D, D);
    var c = R, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* the edge darkens into the frame, as on a scope */
    var vg = x.createRadialGradient(c, c, R * 0.62, c, c, R); vg.addColorStop(0, 'rgba(3,7,15,0)'); vg.addColorStop(1, 'rgba(3,7,15,.78)'); x.fillStyle = vg; x.fillRect(0, 0, D, D);
    var name = (d && d.home && d.home.name) || (homeContact() ? ((homeContact().first || '') + ' ' + (homeContact().last || '')).trim() : '');
    var fs = Math.max(9, Math.min(11, Math.round(R * 0.075))), fb = Math.max(11, Math.min(15, Math.round(R * 0.1)));
    text(x, t('label'), c, Math.round(R * 0.2), '700 ' + fs + 'px ' + MONO, '#9fd8ff');
    if (!has) {
      if (!reduce) sweep(x, c, c, R - 3, now, false);
      [0.33, 0.66].forEach(function (k) { x.beginPath(); x.arc(c, c, R * k, 0, Math.PI * 2); x.strokeStyle = 'rgba(143,180,255,.32)'; x.lineWidth = 1; x.stroke(); });
      var msg = !d ? t('finding', { first: first(name) }) : !d.share.location ? t(d.member ? 'memberNoShare' : 'noShare', { first: first(name) }) : t('noPos', { first: first(name) });
      var ls = wrap(msg, Math.max(14, Math.round(R * 1.45 / (fs * 0.62))));
      ls.forEach(function (l, i) { text(x, l, c, c + (i - (ls.length - 1) / 2) * (fs + 5), '500 ' + fs + 'px ' + SANS, '#e6edf8'); });
      rim(x, c, c, R);
      return;
    }
    var span = spanM(), mpp = span / R, lat0 = d.location.lat, lon0 = d.location.lon;
    function at(lat, lon) { return { x: c + (lon - lon0) * 111320 * Math.cos(lat0 * Math.PI / 180) / mpp, y: c - (lat - lat0) * 111320 / mpp }; }
    if (mapState === 'failed') text(x, t('noMap'), c, c + R * 0.32, '500 ' + fs + 'px ' + SANS, '#c7d2e2');
    /* gold range rings, to scale */
    x.font = '600 ' + fs + 'px ' + MONO;
    [1 / 3, 2 / 3, 0.94].forEach(function (k, i) {
      x.beginPath(); x.arc(c, c, R * k, 0, Math.PI * 2); x.strokeStyle = '#d3b577'; x.globalAlpha = i === 2 ? .65 : .45; x.lineWidth = i === 2 ? 1.4 : 1; x.setLineDash(i === 2 ? [] : [4, 5]); x.stroke(); x.setLineDash([]); x.globalAlpha = 1;
      if (i < 2) { var a = -Math.PI * 0.25; text(x, dist(span * k), c + R * k * Math.cos(a) + 4, c + R * k * Math.sin(a), '600 ' + fs + 'px ' + MONO, '#d3b577', 'left'); }
    });
    if (!reduce) sweep(x, c, c, R - 3, now, true);
    /* where home is, when HOME is out and it fits on the radar */
    var hn = d.member ? first(d.member.home_name) : '';
    var hlp = helpNear();
    if (d.home_spot && d.at_home === false) {
      var hp = at(d.home_spot.lat, d.home_spot.lon), hr = Math.hypot(hp.x - c, hp.y - c);
      if (hr < R * 0.9) { x.beginPath(); x.arc(hp.x, hp.y, 4, 0, Math.PI * 2); x.fillStyle = '#9fd8ff'; x.fill(); text(x, (d.member ? t('homeOf', { home: hn }) : t('home')).toUpperCase(), hp.x, hp.y - 10, '700 ' + Math.max(8, fs - 1) + 'px ' + MONO, '#9fd8ff'); }
    }
    /* a family member's radar also marks HOME, when HOME is on it and apart from them */
    if (d.member && d.with_home && !d.with_home.with) {
      var rp = at(d.with_home.lat, d.with_home.lon), rr = Math.hypot(rp.x - c, rp.y - c);
      if (rr < R * 0.9) { x.beginPath(); x.arc(rp.x, rp.y, Math.max(6, R * 0.06), 0, Math.PI * 2); x.fillStyle = '#d3b577'; x.fill(); x.strokeStyle = '#fff4d6'; x.lineWidth = 1.2; x.stroke(); text(x, initials(d.member.home_name), rp.x, rp.y + 0.5, '800 ' + Math.max(7, Math.round(R * 0.05)) + 'px ' + SANS, '#1a1200'); }
    }
    /* the nearest health facilities, when HOME is out; during a call for help, every place near the caller that can answer */
    var hq = hlp, fac = hq && hq.places.length ? hq.places.slice(0, 10) : d.at_home === false ? (d.health || []).slice(0, 5) : [];
    /* the first place to call comes first, so its name is always written */
    if (hq && hq.first) fac = [hq.first].concat(fac.filter(function (f) { return f.id !== hq.first.id; }));
    fac.forEach(function (f, i) {
      var p = at(f.lat, f.lon), rr = Math.hypot(p.x - c, p.y - c); if (rr > R * 0.92) return;
      var col = HC[f.kind] || HC.doctor, lit = reduce ? 1 : sweepLit(now, Math.atan2(p.y - c, p.x - c));
      var g = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10 + 6 * lit); g.addColorStop(0, col); g.addColorStop(.4, col + '88'); g.addColorStop(1, col + '00');
      x.fillStyle = g; x.beginPath(); x.arc(p.x, p.y, 10 + 6 * lit, 0, Math.PI * 2); x.fill();
      x.beginPath(); x.arc(p.x, p.y, 3.6, 0, Math.PI * 2); x.fillStyle = '#fff'; x.fill();
      var clearOf = Math.hypot(p.x - c, p.y - c) > R * 0.24 && p.y > R * 0.3 && p.y < c + R * 0.36;
      if (hq && hq.first && f.id === hq.first.id) { x.beginPath(); x.arc(p.x, p.y, 9, 0, Math.PI * 2); x.strokeStyle = '#ffd24d'; x.lineWidth = 2; x.stroke(); }
      if (i < 3 && clearOf) {
        /* the words go outward, away from HOME, and stop at the rim */
        var right = p.x >= c, half = chord(R - 8, c, p.y) / 2, room = right ? (c + half) - (p.x + 8) : (p.x - 8) - (c - half);
        if (room > 40) {
          var f1 = '700 ' + Math.max(9, fs) + 'px ' + SANS, f2 = '600 ' + Math.max(8, fs - 2) + 'px ' + MONO, ax = p.x + (right ? 8 : -8), al = right ? 'left' : 'right';
          text(x, fit(x, f.name, f1, room), ax, p.y - 1, f1, '#ffe3ea', al);
          text(x, fit(x, kname(f.kind).toUpperCase() + ' · ' + dist(f.m), f2, room), ax, p.y + fs + 1, f2, col, al);
        }
      }
    });
    /* the way HOME walked since leaving home: older is fainter */
    var tr = d.at_home === false && d.trail ? d.trail : [];
    if (tr.length > 1) {
      x.save(); x.lineCap = 'round'; x.lineJoin = 'round';
      for (var j = 1; j < tr.length; j++) {
        var p0 = at(tr[j - 1][0], tr[j - 1][1]), p1 = at(tr[j][0], tr[j][1]);
        x.beginPath(); x.moveTo(p0.x, p0.y); x.lineTo(p1.x, p1.y);
        x.strokeStyle = '#ffd24d'; x.globalAlpha = 0.25 + 0.7 * (j / (tr.length - 1)); x.lineWidth = 2.2; x.stroke();
      }
      var s0 = at(tr[0][0], tr[0][1]); x.globalAlpha = 0.9; x.beginPath(); x.arc(s0.x, s0.y, 3, 0, Math.PI * 2); x.fillStyle = '#ffd24d'; x.fill();
      x.restore();
    }
    /* HOME at the centre, and who is with HOME beside them */
    var hr2 = Math.max(9, Math.round(R * 0.12));
    var withL = d.with || [];
    withL.slice(0, 4).forEach(function (m, i) {
      var a = -Math.PI * 0.75 + i * 0.9, px = c + Math.cos(a) * hr2 * 2.3, py = c + Math.sin(a) * hr2 * 2.3, r = Math.max(7, hr2 * 0.62);
      x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fillStyle = '#22d3a6'; x.fill(); x.strokeStyle = '#eafff8'; x.lineWidth = 1.4; x.stroke();
      text(x, initials(m.name), px, py + 0.5, '800 ' + Math.round(r * 0.9) + 'px ' + SANS, '#04211a');
    });
    homeDot(x, c, c, hr2, reduce ? 0 : now, name);
    /* words: who and where, at the foot of the circle */
    var dv = !d.member && d.drive && d.drive.driving ? d.drive : null;
    var where = dv ? (dv.to && dv.to.eta_at ? t('drivingTo', { name: first(dv.to.name), t: new Date(dv.to.eta_at).toLocaleTimeString(IT() ? 'it' : 'en-US', { hour: 'numeric', minute: '2-digit' }) }) : t('driving')) : d.inside ? t('inside', { place: d.inside.name }) : d.member ? (d.at_home === true ? t('atHomeOf', { home: hn }) : d.at_home === false && d.from_home_m != null ? t('fromHomeOf', { d: dist(d.from_home_m), home: hn }) : '')
      : d.at_home === true ? t('atHome') : d.at_home === false ? (t('out') + (d.from_home_m != null ? ', ' + t('fromHome', { d: dist(d.from_home_m) }) : '')) : '';
    var line3 = d.member ? (d.with_home ? (d.with_home.with ? t('withHome', { home: hn }) : t('homeAway', { home: hn, d: dist(d.with_home.m) })) : '') : withL.length ? (withL.some(function (m) { return m.you; }) && withL.length === 1 ? t('withYou') : t('with', { name: withL.map(function (m) { return m.you ? (IT() ? 'te' : 'you') : first(m.name); }).join(', ') }))
      : d.closest ? (d.closest.you ? t('nearestYou', { d: dist(d.closest.m) }) : t('nearest', { name: first(d.closest.name), d: dist(d.closest.m) })) : '';
    var nf = hlp && hlp.first ? hlp.first : d.at_home === false && d.health && d.health[0] && !d.inside ? d.health[0] : null;
    var line4 = nf ? nf.name : '';
    var y = c + R * (line4 ? 0.44 : 0.5);
    x.fillStyle = 'rgba(8,10,16,0.62)'; x.fillRect(0, y - fb * 0.9, D, fb + fs * (line4 ? 3.4 : 2) + 22);
    text(x, first(name) + '  ·  ' + ago(d.location.at), c, y, '700 ' + fb + 'px ' + SANS, '#f0eef5');
    if (where) text(x, fit(x, where, '600 ' + fs + 'px ' + MONO, chord(R - 10, c, y + fb) - 16), c, y + fb * 0.6 + fs * 0.9, '600 ' + fs + 'px ' + MONO, d.at_home === false ? '#fbbf24' : '#c7d2e2');
    if (line3) text(x, line3, c, y + fb * 0.6 + fs * 2.3, '600 ' + fs + 'px ' + MONO, withL.length ? '#5eead4' : '#9fb4e2');
    if (line4) { var y4 = y + fb * 0.6 + fs * 3.7, f4 = '700 ' + fs + 'px ' + MONO, tail = hlp && hlp.first ? ' · ' + dist(nf.m) : ' · ' + kname(nf.kind).toUpperCase() + ' ' + dist(nf.m); x.font = f4; text(x, fit(x, line4, f4, chord(R - 10, c, y4 + fs) - x.measureText(tail).width - 16) + tail, c, y4, f4, HC[nf.kind] || HC.doctor); }
    rim(x, c, c, R);
    if (mapState === 'ready') text(x, '© OpenStreetMap · OpenFreeMap', c, D - Math.max(10, R * 0.07), '500 7.5px ' + SANS, 'rgba(240,238,245,.75)');
  }

  /* ── the room every 10 seconds: only what HOME's phone hears, merged into the radar's data ── */
  var ROOM_S = 10, _roomAt = 0, _roomBusy = false;
  function loadRoom() {
    if (!authed() || _roomBusy || !_data || !_data.rooms || !shown()) return;
    var h = homeUser(); if (_for !== h + '|') return;
    _roomBusy = true;
    SyncEngine.apiFetch('/care/room' + (h ? '?home=' + encodeURIComponent(h) : ''), { method: 'GET' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { _roomBusy = false; if (j && j.share && _data && _data.rooms && _for === h + '|') { _data.rooms.phone = j.phone; _roomAt = Date.now(); } })
      .catch(function () { _roomBusy = false; });
  }
  setInterval(loadRoom, ROOM_S * 1000);

  /* ── HOME's own phone listening to the room: the last two hours around the rim, movement as ripples ── */
  function dur(ms) {
    var m = Math.max(0, Math.round(ms / 60000)); if (m < 1) return IT() ? 'meno di 1 min' : 'under 1 min';
    if (m < 60) return m + ' min'; var hh = Math.floor(m / 60), mm = m % 60; return hh + ' h' + (mm ? ' ' + mm + ' min' : '');
  }
  function phoneRoom(x, cx, cy, r, now, reduce, name, fs) {
    var d = _data, p = d.rooms.phone, fn = first(name), small = Math.max(7, fs - 1.5);
    /* one full sweep every 10 seconds, starting at the top as each new reading of the room arrives */
    if (!reduce) sweep(x, cx, cy, r - 2, p && p.online && _roomAt ? Date.now() - _roomAt : now, false, ROOM_S);
    if (!p) {
      /* nothing heard yet: say plainly what turns it on, on whose phone */
      var self = role() === 'home';
      var msg = self ? (RNATIVE ? (_rState === 'starting' ? t('listenStarting') : _rState === 'denied' ? t('listenDenied') : t('tapListen')) : t('installApp', { first: fn })) : t('notListening', { first: fn });
      homeDot(x, cx, cy - r * 0.3, Math.max(6, r * 0.12), reduce ? 0 : now, name);
      wrap(msg, Math.max(12, Math.round(r * 1.5 / (fs * 0.6)))).slice(0, 5).forEach(function (l, i) { text(x, l, cx, cy + r * 0.05 + i * (fs + 4), '500 ' + fs + 'px ' + SANS, '#e6edf8'); });
      return;
    }
    var T = 2 * 3600000, tr = p.trace || [], tNow = Date.now();
    /* the last two hours as a ring, like a clock face run backwards from the top: gold where the room moved */
    var rr = r * 0.7, lw = Math.max(3, r * 0.065);
    x.beginPath(); x.arc(cx, cy, rr, 0, Math.PI * 2); x.strokeStyle = 'rgba(143,180,255,.12)'; x.lineWidth = lw; x.stroke();
    tr.forEach(function (pt) {
      var age = tNow - pt[0]; if (age < 0 || age > T) return;
      var a1 = -Math.PI / 2 - (age / T) * Math.PI * 2, a0 = a1 - (60000 / T) * Math.PI * 2 - 0.004;
      x.beginPath(); x.arc(cx, cy, rr, a0, a1);
      x.strokeStyle = pt[1] >= 2 ? 'rgba(255,210,77,.95)' : pt[1] === 1 ? 'rgba(211,181,119,.7)' : 'rgba(79,141,240,.42)';
      x.lineWidth = lw; x.stroke();
    });
    /* now: a bright tick at the top */
    x.beginPath(); x.moveTo(cx, cy - rr - lw); x.lineTo(cx, cy - rr + lw); x.strokeStyle = '#ffffff'; x.lineWidth = 2; x.stroke();
    /* movement now: ripples from HOME, faster and warmer the more the room moves */
    var lvl = p.online ? ['none', 'minimal', 'moderate', 'high'].indexOf(p.level) : -1;
    var hy = cy - r * 0.12, hr = Math.max(6, r * 0.13);
    if (lvl >= 1 && !reduce) {
      var per = [0, 2400, 1600, 1000][lvl], nR = lvl + 1;
      for (var i = 0; i < nR; i++) {
        var k = ((now + i * per / nR) % per) / per, rad = hr + k * r * 0.5;
        x.beginPath(); x.arc(cx, hy, rad, 0, Math.PI * 2); x.strokeStyle = 'rgba(255,210,77,' + (0.75 * (1 - k)) + ')'; x.lineWidth = 2; x.stroke();
      }
    } else if (lvl === 0 && !reduce) {
      var k2 = (now % 4200) / 4200;
      x.beginPath(); x.arc(cx, hy, hr + k2 * r * 0.3, 0, Math.PI * 2); x.strokeStyle = 'rgba(143,180,255,' + (0.35 * (1 - k2)) + ')'; x.lineWidth = 1.4; x.stroke();
    }
    x.save(); if (!p.online) x.globalAlpha = 0.45; homeDot(x, cx, hy, hr, reduce || !p.online ? 0 : now, name); x.restore();
    /* words */
    var l1, c1;
    if (!p.online) { l1 = t('lastHeard', { first: fn, t: ago(p.at) }); c1 = '#9fb4e2'; }
    else if (lvl >= 1) { l1 = t('moving'); c1 = '#ffd24d'; }
    else if (p.started_at && tNow - p.started_at < 3 * 60000 && !p.moved_at) { l1 = t('learning'); c1 = '#9fd8ff'; }
    else { l1 = p.still_ms > 60000 ? t('stillFor', { t: dur(p.still_ms) }) : t('still'); c1 = '#9fd8ff'; }
    var y1 = cy + r * 0.3;
    if (!p.online) wrap(l1, Math.max(12, Math.round(r * 1.4 / (fs * 0.6)))).slice(0, 3).forEach(function (l, i) { text(x, l, cx, y1 + i * (fs + 3), '600 ' + fs + 'px ' + SANS, c1); });
    else {
      text(x, fit(x, l1, '800 ' + fs + 'px ' + MONO, chord(r - 6, cy, y1) - 8), cx, y1, '800 ' + fs + 'px ' + MONO, c1);
      text(x, fit(x, t('heardBy', { first: fn, t: ago(p.at) }), '500 ' + small + 'px ' + SANS, chord(r - 6, cy, y1 + fs + 4) - 10), cx, y1 + fs + 4, '500 ' + small + 'px ' + SANS, 'rgba(230,237,248,.8)');
    }
  }

  function precision(x, cx, cy, r, now, hp, name, reduce, alpha) {
    var fs = Math.max(8, Math.min(10.5, Math.round(r * 0.1))), acc = Math.max(1, Number(hp.location.accuracy) || 15);
    x.save(); x.globalAlpha = Math.min(1, 0.8 + alpha * 0.4);
    x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.clip();
    var bg = x.createRadialGradient(cx, cy, r * 0.05, cx, cy, r); bg.addColorStop(0, '#3a0b16'); bg.addColorStop(.7, '#1a0610'); bg.addColorStop(1, '#090208'); x.fillStyle = bg; x.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    /* scale: the outer ring is the larger of 10 ft (3 m) and the phone's own accuracy, so the spot is never drawn tighter than the phone knows */
    var span = Math.max(3.05, acc * 1.25), px = r * 0.86 / span;
    [0.33, 0.66, 1].forEach(function (k) { x.beginPath(); x.arc(cx, cy, r * 0.86 * k, 0, Math.PI * 2); x.strokeStyle = 'rgba(255,140,160,' + (k === 1 ? .55 : .3) + ')'; x.lineWidth = 1; x.setLineDash(k === 1 ? [] : [3, 4]); x.stroke(); x.setLineDash([]); });
    x.strokeStyle = 'rgba(255,170,185,.35)'; x.beginPath(); x.moveTo(cx - r, cy); x.lineTo(cx + r, cy); x.moveTo(cx, cy - r); x.lineTo(cx, cy + r); x.stroke();
    /* the phone's accuracy as a soft red disc, the caller in the middle, pulsing */
    var ar = Math.min(r * 0.86, acc * px);
    x.beginPath(); x.arc(cx, cy, ar, 0, Math.PI * 2); x.fillStyle = 'rgba(255,60,90,.18)'; x.fill(); x.strokeStyle = 'rgba(255,90,115,.8)'; x.lineWidth = 1.4; x.stroke();
    var k2 = reduce ? 0.5 : (now % 1200) / 1200;
    x.beginPath(); x.arc(cx, cy, 6 + k2 * r * 0.35, 0, Math.PI * 2); x.strokeStyle = 'rgba(255,90,115,' + (0.8 * (1 - k2)) + ')'; x.lineWidth = 2; x.stroke();
    homeDot(x, cx, cy, Math.max(6, r * 0.11), reduce ? 0 : now, name);
    var imp = !IT();
    text(x, (hp.room ? String(hp.room).toUpperCase() + ' \u00b7 ' : '') + (imp ? Math.round(span * 3.281) + ' FT' : Math.round(span) + ' M'), cx, cy - r * 0.84, '700 ' + Math.max(7, fs - 1) + 'px ' + MONO, '#ffc7d2');
    text(x, (imp ? '\u00b1' + Math.max(5, Math.round(acc * 3.281)) + ' ft' : '\u00b1' + Math.round(acc) + ' m') + ' \u00b7 ' + ago(hp.location.at), cx, cy + r * 0.62, '700 ' + fs + 'px ' + MONO, '#ffe3e8');
    x.restore();
    rim(x, cx, cy, r);
  }

  /* ── the room radar: inside the home or facility where HOME is ── */
  function drawMicro(x, cx, cy, r, now, alpha) {
    var d = _data, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var name = (d && d.home && d.home.name) || '';
    /* someone called for help: the small circle is the precise spot, the room or the tightest circle the phone gives */
    var hp = null; try { hp = d && d.home && window.CovaraHelp ? CovaraHelp.forPerson(d.home.id) : null; } catch (e) {}
    if (hp) { precision(x, cx, cy, r, now, hp, name, reduce, alpha); return; }
    x.save();
    x.globalAlpha = Math.min(1, 0.72 + alpha * 0.6);
    x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.clip();
    var bg = x.createRadialGradient(cx, cy - r * 0.2, r * 0.05, cx, cy, r); bg.addColorStop(0, '#0e2147'); bg.addColorStop(.6, '#081430'); bg.addColorStop(1, '#03070f'); x.fillStyle = bg; x.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    [0.36, 0.7].forEach(function (k) { x.beginPath(); x.arc(cx, cy, r * k, 0, Math.PI * 2); x.strokeStyle = 'rgba(143,180,255,.3)'; x.lineWidth = 1; x.stroke(); });
    var fs = Math.max(8, Math.min(10.5, Math.round(r * 0.1)));
    var rooms = d && d.rooms ? d.rooms.list || [] : [];
    var out = d && d.at_home === false;
    var place = out ? (d.inside ? d.inside.name : '') : t('home');
    if (rooms.length && !out) {
      var n = rooms.length, step = Math.PI * 2 / n;
      rooms.forEach(function (rm, i) {
        var a0 = -Math.PI / 2 + i * step, mid = a0 + step / 2;
        var here = !!rm.here || (d.rooms.now && d.rooms.now.toLowerCase() === rm.name.toLowerCase());
        var lit = reduce ? 0.5 : sweepLit(now, mid);
        x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, r, a0 + 0.03, a0 + step - 0.03); x.closePath();
        x.fillStyle = rm.fall ? 'rgba(255,61,90,' + (0.28 + 0.25 * lit) + ')' : here ? 'rgba(211,181,119,' + (0.22 + 0.22 * lit) + ')' : 'rgba(79,141,240,' + (0.05 + 0.1 * lit) + ')'; x.fill();
        x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + r * Math.cos(a0), cy + r * Math.sin(a0)); x.strokeStyle = 'rgba(143,180,255,.28)'; x.lineWidth = 1; x.stroke();
        var lk = n === 1 ? 0 : 0.7, lx = cx + r * lk * Math.cos(mid), ly = cy + r * lk * Math.sin(mid) + (n === 1 ? r * 0.42 : 0);
        /* the label fits inside its slice and inside the circle */
        var nm = fit(x, rm.name, (here || rm.fall ? '800 ' : '600 ') + fs + 'px ' + SANS, n === 1 ? r * 1.1 : Math.min(r * 0.58, 2 * r * 0.7 * Math.sin(Math.min(step, Math.PI) / 2) - 6));
        text(x, nm, lx, ly, (here || rm.fall ? '800 ' : '600 ') + fs + 'px ' + SANS, rm.fall ? '#ffd0d8' : here ? '#ffe9b8' : (rm.online === false ? 'rgba(200,214,232,.45)' : '#c7d2e2'));
        if (rm.fall) text(x, t('fall'), lx, ly + fs + 2, '800 ' + Math.max(7, fs - 2) + 'px ' + MONO, '#ff3d5a');
        else if (rm.in_bed === 1) text(x, IT() ? 'A LETTO' : 'IN BED', lx, ly + fs + 2, '700 ' + Math.max(7, fs - 2) + 'px ' + MONO, '#c4b5fd');
        else if (here && d.rooms.since) text(x, ago(d.rooms.since), lx, ly + fs + 2, '600 ' + Math.max(7, fs - 2) + 'px ' + MONO, '#d3b577');
        if (here) {
          /* a ceiling or bedside sensor that reports where they are: the dot sits at that spot within the room's slice */
          var pr = n === 1 ? 0 : 0.3, pa = mid;
          if (rm.pos && n > 1) { pr = 0.22 + Math.max(0, Math.min(1, Number(rm.pos.y) / 5)) * 0.62; pa = mid + Math.max(-1, Math.min(1, Number(rm.pos.x) / 3)) * step * 0.38; }
          else if (rm.pos && n === 1) { pr = Math.max(0, Math.min(1, Number(rm.pos.y) / 5)) * 0.8; pa = -Math.PI / 2 + Math.max(-1, Math.min(1, Number(rm.pos.x) / 3)) * 1.1; }
          homeDot(x, cx + r * pr * Math.cos(pa), cy + r * pr * Math.sin(pa), Math.max(6, r * 0.11), reduce ? 0 : now, name);
        }
      });
      if (!reduce) sweep(x, cx, cy, r - 2, now, false);
    } else if (d && d.member) {
      if (!reduce) sweep(x, cx, cy, r - 2, now, false);
      homeDot(x, cx, cy - r * 0.3, Math.max(6, r * 0.12), reduce ? 0 : now, name);
      wrap(t('memberRooms', { home: first(d.member.home_name) }), Math.max(12, Math.round(r * 1.5 / (fs * 0.6)))).slice(0, 4).forEach(function (l, i) { text(x, l, cx, cy + r * 0.05 + i * (fs + 4), '500 ' + fs + 'px ' + SANS, '#e6edf8'); });
    } else if (d && !out && !(d.share && !d.share.rooms) && d.rooms) {
      phoneRoom(x, cx, cy, r, now, reduce, name, fs);
    } else {
      if (!reduce) sweep(x, cx, cy, r - 2, now, false);
      var msg = !d ? '' : (d.share && !d.share.rooms) ? t('noRooms', { first: first(name) }) : out ? (d.inside ? t('inside', { place: d.inside.name }) : t('outRooms', { first: first(name) })) : t('addSensor');
      if (d && (out || !rooms.length)) homeDot(x, cx, cy - (msg ? r * 0.3 : 0), Math.max(6, r * 0.12), reduce ? 0 : now, name);
      var ls = wrap(msg, Math.max(12, Math.round(r * 1.5 / (fs * 0.6)))).slice(0, 5);
      ls.forEach(function (l, i) { text(x, l, cx, cy + r * 0.05 + i * (fs + 4), '500 ' + fs + 'px ' + SANS, '#e6edf8'); });
    }
    text(x, t('rooms') + (place ? ' · ' + place.toUpperCase().slice(0, 18) : ''), cx, cy - r * 0.84, '700 ' + Math.max(7, fs - 1) + 'px ' + MONO, '#9fd8ff');
    x.restore();
    rim(x, cx, cy, r);
  }

  /* Called by the canvas each frame while WHEREIS is chosen. The same two circles Sentinel uses. */
  function draw(ctx, W, H, now, dr) {
    if (!dr) { hide(); return; }
    _shownAt = Date.now();
    load(false);
    var R = dr.r * 0.74;
    var cx = Math.max(R + 10, Math.min(dr.cx - dr.r - R - W * 0.03, R + W * 0.05));
    var cy = dr.cy + (dr.r - R) * 0.6;
    /* during a call for help the red ticker runs under the top buttons: the radar sits just below it, whole */
    try {
      var tk = document.body.classList.contains('cv-helping') && document.getElementById('cvHelpTicker'), cvr = ctx.canvas.getBoundingClientRect();
      if (tk) { var tb = tk.getBoundingClientRect().bottom - cvr.top + 8; if (cy - R < tb) cy = tb + R; }
    } catch (e) {}
    drawMacro(cx, cy, R, now, dr.alpha || 0.5);
    window._dreamWhereHit = { x: cx - R, y: cy - R, w: R * 2, h: R * 2, cx: cx, cy: cy, r: R };
    var r2 = dr.r * 0.5, cx2 = cx, cy2 = cy + R + r2 + 10;
    if (cy2 + r2 > H - 4) { window._dreamMicroHit = null; return; }
    drawMicro(ctx, cx2, cy2, r2, now, dr.alpha || 0.5);
    window._dreamMicroHit = { x: cx2 - r2, y: cy2 - r2, w: r2 * 2, h: r2 * 2, cx: cx2, cy: cy2, r: r2 };
  }
  function hide() { if (box && !box.hidden) box.hidden = true; if (driveBtn && !driveBtn.hidden) driveBtn.hidden = true; }
  /* nothing else draws over the radar while the canvas is not drawing it */
  (function guard() { if (box && !box.hidden && Date.now() - _shownAt > 250) { box.hidden = true; if (driveBtn) driveBtn.hidden = true; } requestAnimationFrame(guard); })();
  function shown() { return Date.now() - _shownAt < 300; }

  window.CovaraWhere = { on: on, draw: draw, hide: hide, shown: shown, load: load, data: function () { return _data; } };
})();
