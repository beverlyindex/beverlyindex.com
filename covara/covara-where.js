/* Remiel: Covara, WHEREIS.
   Two sweeping radars where Sentinel draws WHEREIS, both about HOME:
   - the circle beside the dream picture: Remiel: Personal Protection's radar map, centred on
     HOME, with who from HOME's team is with HOME (from the phone closest to HOME's) and, when
     HOME is out of the house, the nearest health facilities;
   - the circle beneath it: the room inside the home or facility where HOME is, swept every
     10 seconds from what HOME's own phone hears on its charger. A tap on it opens Room motion,
     the screen that says in plain words what the phone hears and how to turn listening on.
   Neither radar is ever empty: when there is no data, it says what is missing and what to do.
   The sweep, rim, dots and labels follow Remiel: Personal Protection's radar (halo).
   HOME's phone sends its position while Remiel: Covara is open and HOME shares location with
   someone; a team member's phone sends its own, which only ever tells whether they are with
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
    return m < 1000 ? Math.round(m / 5) * 5 + ' m' : (m / 1000).toFixed(m < 10000 ? 1 : 0).replace('.', ',') + ' km';
  }
  function ago(ts) {
    if (!ts) return ''; var s = Math.max(0, (Date.now() - ts) / 1000);
    if (s < 60) return t('now');
    var v = s < 3600 ? Math.round(s / 60) + (IT() ? ' min' : ' min') : s < 86400 ? Math.round(s / 3600) + (IT() ? ' h' : ' h') : Math.round(s / 86400) + (IT() ? ' g' : ' d');
    return t('ago', { t: v });
  }

  /* ── positions: HOME's phone while HOME shares location; a team member's phone for "with HOME" ── */
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
  /* a tap on the room circle opens Room motion, where HOME's own phone can start listening (see below) */
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

  /* ── the radar's words for every state, room motion included ── */
  Object.assign(S.en, {
    noPos2: '{first}\'s phone has not shared a position yet.', noPosDo: 'On {first}\'s phone: open Remiel: Covara and allow location.',
    noReach: 'Covara cannot reach the server right now.', noReachDo: 'Check the internet connection. The radar comes back by itself.',
    mapOff: 'STREET MAP OFFLINE', mapOff2: 'NO STREET MAP', lastKnownAt: 'Last known position', homeOff: 'HOME', closestRing: '{name} · {d}',
    roomTitle: 'ROOM MOTION', details: 'DETAILS', roomSub: 'What {first}\'s phone hears in the room', roomSubSelf: 'What this phone hears in your room',
    nowMoving: 'Movement now', nowMovingSub: 'The room is moving at this moment.', quietSince: 'Quiet since {t}', quietFor: 'No movement for {d}.',
    learningT: 'Listening, learning the room', learningSub: 'The first few minutes teach Covara the room\'s own quiet.',
    notHeardSince: 'Not heard since {t}', notHeardFor: '{first}\'s phone has not swept the room for {d}.', notHeardForSelf: 'This phone has not swept the room for {d}.',
    notYet: 'Not listening yet', notYetSub: '{first}\'s phone has not listened to the room yet.', notYetSubSelf: 'This phone has not listened to the room yet.',
    outHouse: '{first}\'s phone is out of the house, so it cannot hear the room.', outHouseShort: '{first} is out of the house. The room is heard again when the phone is back.',
    rListen: 'LISTENING', rSweep: 'LAST FULL SWEEP', rHears: 'HEARS', rPhone: 'THIS PHONE', rEvery: 'A full sweep of the room every 10 seconds.',
    yesCharger: 'Yes, on its charger', yesNoCharger: 'Yes, but not on its charger', yes: 'Yes', noSince: 'No, last heard {t}', noYet: 'Not yet', noneYet: 'None yet',
    signals: '{n} signals: {w} Wi-Fi, {b} Bluetooth', btOff: 'Bluetooth is off. Turn it on in the phone\'s settings.', permNeed: 'Covara needs Nearby devices and Location on this phone.',
    stoppedHere: 'Listening was stopped from the phone\'s notice.', keyEnded: 'The room key ended. Tap Listen to this room to start again.',
    trace: 'THE LAST TWO HOURS', twoAgo: '2 h ago', nowW: 'now', traceKey: 'Gold: movement. Blue: quiet. Empty: not heard.',
    howT: 'HOW TO TURN IT ON', how1: 'On {first}\'s phone, open Remiel: Covara in the Android app.', how2: 'Open Care, then Safety, then Room motion, and tap Listen to this room.',
    how3: 'Allow Nearby devices and Location when Android asks.', how4: 'Leave the phone on its charger in the room where {first} spends the most time.',
    how2Self: 'Tap Listen to this room below.', how4Self: 'Leave this phone on its charger in the room where you spend the most time.',
    howWeb: 'Room listening needs the Remiel: Covara Android app on this phone. Open Covara there, then come back to this screen.',
    howShare: 'Nobody on your team can see your rooms yet, so this phone does not listen. Choose Rooms for someone on your team when you choose what they can see.',
    listenBtn: 'Listen to this room', limitsT: 'WHAT IT CAN AND CANNOT DO',
    limits: 'Covara uses only {first}\'s phone, with no added device. It senses movement and stillness from the Wi-Fi and Bluetooth signals the phone already hears. It does not use the camera or the microphone, it does not tell who is moving, and it does not detect breathing or falls.',
    limitsSelf: 'Covara uses only this phone, with no added device. It senses movement and stillness from the Wi-Fi and Bluetooth signals the phone already hears. It does not use the camera or the microphone, it does not tell who is moving, and it does not detect breathing or falls.',
    startedWait: 'This phone is listening now. Its next sweep reaches your team within a minute.', noShareDo: '{first} chooses what each person on the team can see.',
    close: 'Close', entry: 'Room motion', entryLive: 'Movement now', entryQuiet: 'Quiet since {t}', entryOff: 'Not listening', sAgo: '{n} s ago'
  });
  Object.assign(S.it, {
    noPos2: 'Il telefono di {first} non ha ancora condiviso una posizione.', noPosDo: 'Sul telefono di {first}: apri Remiel: Covara e consenti la posizione.',
    noReach: 'Covara non riesce a raggiungere il server adesso.', noReachDo: 'Controlla la connessione a internet. Il radar torna da solo.',
    mapOff: 'MAPPA NON IN LINEA', mapOff2: 'SENZA MAPPA', lastKnownAt: 'Ultima posizione nota', homeOff: 'CASA', closestRing: '{name} · {d}',
    roomTitle: 'MOVIMENTO IN STANZA', details: 'DETTAGLI', roomSub: 'Cosa sente il telefono di {first} nella stanza', roomSubSelf: 'Cosa sente questo telefono nella tua stanza',
    nowMoving: 'Movimento adesso', nowMovingSub: 'La stanza si muove in questo momento.', quietSince: 'Quiete dalle {t}', quietFor: 'Nessun movimento da {d}.',
    learningT: 'In ascolto, imparo la stanza', learningSub: 'I primi minuti insegnano a Covara la quiete della stanza.',
    notHeardSince: 'Non sentita dalle {t}', notHeardFor: 'Il telefono di {first} non controlla la stanza da {d}.', notHeardForSelf: 'Questo telefono non controlla la stanza da {d}.',
    notYet: 'Non ancora in ascolto', notYetSub: 'Il telefono di {first} non ha ancora ascoltato la stanza.', notYetSubSelf: 'Questo telefono non ha ancora ascoltato la stanza.',
    outHouse: 'Il telefono di {first} è fuori casa, quindi non può sentire la stanza.', outHouseShort: '{first} è fuori casa. La stanza si sente di nuovo quando il telefono torna.',
    rListen: 'IN ASCOLTO', rSweep: 'ULTIMO GIRO COMPLETO', rHears: 'SENTE', rPhone: 'QUESTO TELEFONO', rEvery: 'Un giro completo della stanza ogni 10 secondi.',
    yesCharger: 'Sì, sul caricatore', yesNoCharger: 'Sì, ma non sul caricatore', yes: 'Sì', noSince: 'No, sentita l\'ultima volta alle {t}', noYet: 'Non ancora', noneYet: 'Nessuno per ora',
    signals: '{n} segnali: {w} Wi-Fi, {b} Bluetooth', btOff: 'Il Bluetooth è spento. Accendilo nelle impostazioni del telefono.', permNeed: 'Covara ha bisogno di Dispositivi nelle vicinanze e Posizione su questo telefono.',
    stoppedHere: 'L\'ascolto è stato fermato dall\'avviso del telefono.', keyEnded: 'La chiave della stanza è scaduta. Tocca Ascolta questa stanza per ricominciare.',
    trace: 'LE ULTIME DUE ORE', twoAgo: '2 h fa', nowW: 'adesso', traceKey: 'Oro: movimento. Blu: quiete. Vuoto: non sentita.',
    howT: 'COME ACCENDERLO', how1: 'Sul telefono di {first}, apri Remiel: Covara nell\'app Android.', how2: 'Apri Cure, poi Sicurezza, poi Movimento in stanza, e tocca Ascolta questa stanza.',
    how3: 'Consenti Dispositivi nelle vicinanze e Posizione quando Android lo chiede.', how4: 'Lascia il telefono sul caricatore nella stanza dove {first} passa più tempo.',
    how2Self: 'Tocca Ascolta questa stanza qui sotto.', how4Self: 'Lascia questo telefono sul caricatore nella stanza dove passi più tempo.',
    howWeb: 'L\'ascolto della stanza ha bisogno dell\'app Android Remiel: Covara su questo telefono. Apri Covara lì, poi torna a questa schermata.',
    howShare: 'Nessuno del tuo team può ancora vedere le tue stanze, quindi questo telefono non ascolta. Scegli Stanze per qualcuno del tuo team quando scegli cosa può vedere.',
    listenBtn: 'Ascolta questa stanza', limitsT: 'COSA PUÒ E NON PUÒ FARE',
    limits: 'Covara usa solo il telefono di {first}, senza altri dispositivi. Sente movimento e quiete dai segnali Wi-Fi e Bluetooth che il telefono già riceve. Non usa la fotocamera né il microfono, non dice chi si muove, e non rileva il respiro né le cadute.',
    limitsSelf: 'Covara usa solo questo telefono, senza altri dispositivi. Sente movimento e quiete dai segnali Wi-Fi e Bluetooth che il telefono già riceve. Non usa la fotocamera né il microfono, non dice chi si muove, e non rileva il respiro né le cadute.',
    startedWait: 'Questo telefono adesso ascolta. Il prossimo giro arriva al tuo team entro un minuto.', noShareDo: '{first} sceglie cosa può vedere ciascuno nel team.',
    close: 'Chiudi', entry: 'Movimento in stanza', entryLive: 'Movimento adesso', entryQuiet: 'Quiete dalle {t}', entryOff: 'Non in ascolto', sAgo: '{n} s fa'
  });
  function loc() { return IT() ? 'it-IT' : 'en-US'; }
  function clock(ts, sec) { try { var o = { hour: 'numeric', minute: '2-digit' }; if (sec) o.second = '2-digit'; return new Date(ts).toLocaleTimeString(loc(), o); } catch (e) { return ''; } }
  /* how long ago, to the second under a minute (the room is swept every 10 seconds) */
  function agoS(ts) { if (!ts) return ''; var s = Math.max(0, Math.round((Date.now() - ts) / 1000)); return s < 60 ? t('sAgo', { n: s }) : ago(ts); }

  /* ── what the server says ── */
  var _data = null, _for = '', _at = 0, _busy = false, _shownAt = 0, _err = 0;
  /* WHEREIS follows the sphere chosen: a team member, as that member allows; else HOME */
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
    /* after a failed ask, wait a little before the next */
    if (!force && _for === h && Date.now() - _at < (_err && !_data ? 6000 : urgent ? 8000 : POLL_MS)) return;
    if (_for !== h) { _data = null; _for = h; _err = 0; }
    _busy = true;
    var q = []; if (hu) q.push('home=' + encodeURIComponent(hu)); if (w) q.push('who=' + encodeURIComponent(w));
    SyncEngine.apiFetch('/care/whereis' + (q.length ? '?' + q.join('&') : ''), { method: 'GET' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        _busy = false; _at = Date.now();
        if (_for !== h) return;
        if (!j) { _err = Date.now(); return; }
        _data = j; _err = 0;
        /* HOME's room arrives with WHEREIS too: it seeds the room radar until its own 10 second ask */
        if (!j.member && (_roomFor === hu || _roomFor == null)) {
          _roomFor = hu;
          if (j.share && !j.share.rooms) _room = { share: 0, phone: null };
          else if (j.rooms && (!_room || Date.now() - _roomAt > 9000)) { _room = { share: 1, phone: j.rooms.phone || null }; _roomAt = Date.now(); }
        }
        mapTo();
      })
      .catch(function () { _busy = false; _at = Date.now(); _err = Date.now(); });
  }

  /* ── the map: Remiel: Personal Protection's own street map, round, under the radar ── */
  var VEC_TJ = 'https://tiles.openfreemap.org/planet', VEC_GLYPHS = 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf';
  var box = null, mapDiv = null, over = null, map = null, mapState = 'idle', _vec = null, _tilesAt = 0;
  function ensureBox() {
    if (box) return;
    box = document.createElement('div'); box.className = 'cvw-macro'; box.hidden = true;
    /* the deep blue of Remiel: Personal Protection's radar face, so the circle is whole before any street arrives */
    box.style.cssText = 'position:absolute;z-index:5;border-radius:50%;overflow:hidden;pointer-events:none;background:radial-gradient(circle at 50% 42%,#0e2147 0,#081430 55%,#03070f 100%);box-shadow:0 0 0 1.5px rgba(143,180,255,.55),0 0 26px rgba(79,141,240,.45)';
    mapDiv = document.createElement('div'); mapDiv.style.cssText = 'position:absolute;inset:0;opacity:.9';
    over = document.createElement('canvas'); over.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    box.appendChild(mapDiv); box.appendChild(over);
    (document.getElementById('stage') || document.body).appendChild(box);
    /* while the radar is shown, the day's schedule on the left and the Now card at the top step out of its way */
    var st = document.createElement('style'); st.id = 'cvwStyle';
    st.textContent = 'body.cvw-on #cvnDay,body.cvw-on #cvNow,body.cvw-on #cvMorning{visibility:hidden !important}';
    document.head.appendChild(st);
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
        /* streets only count as shown once tiles really arrived: on a weak connection the radar says the map is offline */
        map.on('data', function (e) { if (e && e.dataType === 'source' && e.tile) _tilesAt = Date.now(); });
        map.on('error', function () {});
      } catch (e) { mapState = 'failed'; }
    });
    /* a map that has not loaded in 20 seconds is offline for now; it is tried again in a minute */
    setTimeout(function () { if (mapState === 'loading') { mapState = 'failed'; } }, 20000);
  }
  setInterval(function () { if (mapState === 'failed' && !map && shown()) { mapState = 'idle'; } }, 60000);
  function streets() { return mapState === 'ready' && !!_tilesAt; }
  /* The radius the radar spans: the street around HOME at home; out, as far as the nearest health facilities */
  /* during a call for help: everything near the caller that can answer, from covara-help.js */
  function helpNear() {
    var d = _data; if (!d || !d.home || !window.CovaraHelp) return null;
    try { var hp = CovaraHelp.forPerson(d.home.id); if (!hp) return null; var n = CovaraHelp.near(hp); return { hp: hp, places: (n && n.places) || [], first: CovaraHelp.first(hp) }; } catch (e) { return null; }
  }
  function metres(a, b) { return Math.hypot((a.lat - b.lat) * 111320, (a.lon - b.lon) * 111320 * Math.cos(a.lat * Math.PI / 180)); }
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
    if (d.at_home === false || (d.member && d.at_home == null)) {
      var far = 250, L0 = d.location;
      (d.health || []).slice(0, 3).forEach(function (x) { far = Math.max(far, x.m * 1.18); });
      (d.trail || []).forEach(function (p) { far = Math.max(far, 1.15 * metres({ lat: p[0], lon: p[1] }, L0)); });
      /* home joins the radar only when it is near enough not to crowd the facilities into the middle;
         further away it is an arrow on the rim with its distance */
      if (d.from_home_m && d.from_home_m * 1.1 <= far * 1.6) far = Math.max(far, d.from_home_m * 1.1);
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

  /* ── the radar: the sweep, rim and dots come from Remiel: Personal Protection's radar (halo, radDraw and sweepPaint) ── */
  var SWEEP_S = 4;
  function sweepA(now, per) { per = per || SWEEP_S; return ((now / 1000) % per) / per * Math.PI * 2 - Math.PI / 2; }
  function sweepLit(now, a, per) { var lag = ((sweepA(now, per) - a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2); return Math.exp(-lag / 1.1); }
  function sweep(x, cx, cy, R, now, gold, per) {
    var a = sweepA(now, per);
    if (x.createConicGradient) {
      var g = x.createConicGradient(a - 1.25, cx, cy);
      g.addColorStop(0, 'rgba(211,181,119,0)'); g.addColorStop(.17, 'rgba(211,181,119,' + (gold ? .18 : .14) + ')'); g.addColorStop(.197, 'rgba(232,206,140,.38)'); g.addColorStop(.199, 'rgba(211,181,119,0)'); g.addColorStop(1, 'rgba(211,181,119,0)');
      x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.fill();
    }
    x.save(); x.shadowColor = 'rgba(255,226,160,.9)'; x.shadowBlur = 8; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a)); x.strokeStyle = 'rgba(255,232,178,.9)'; x.lineWidth = 1.6; x.stroke(); x.restore();
  }
  /* the rim: a chrome-blue bevel with a soft halo, and fine ticks */
  function rim(x, cx, cy, R) {
    var rg = x.createLinearGradient(cx - R, cy - R, cx + R, cy + R); rg.addColorStop(0, '#dbe8ff'); rg.addColorStop(.35, '#7fa8f0'); rg.addColorStop(.7, '#2c55a8'); rg.addColorStop(1, '#9fc0ff');
    x.save(); x.shadowColor = 'rgba(79,141,240,.75)'; x.shadowBlur = 12; x.beginPath(); x.arc(cx, cy, R - 1.5, 0, Math.PI * 2); x.strokeStyle = rg; x.lineWidth = 2.4; x.stroke(); x.restore();
    x.beginPath(); x.arc(cx, cy, R - 6, 0, Math.PI * 2); x.strokeStyle = 'rgba(143,180,255,.2)'; x.lineWidth = 1; x.stroke();
    x.strokeStyle = 'rgba(185,205,245,.35)'; x.lineWidth = 1;
    for (var k = 0; k < 72; k++) { var a = k * 5 * Math.PI / 180, l = k % 6 === 0 ? 6 : 3; x.beginPath(); x.moveTo(cx + (R - 3) * Math.cos(a), cy + (R - 3) * Math.sin(a)); x.lineTo(cx + (R - 3 - l) * Math.cos(a), cy + (R - 3 - l) * Math.sin(a)); x.stroke(); }
    /* north: a small gold mark at the top of the rim */
    x.beginPath(); x.moveTo(cx, cy - R + 3); x.lineTo(cx - 4, cy - R + 10); x.lineTo(cx + 4, cy - R + 10); x.closePath(); x.fillStyle = '#d3b577'; x.fill();
  }
  /* the face of the scope when there are no streets (no connection, or before they arrive): a fine polar grid */
  function scopeGrid(x, c, R, strong) {
    x.save(); x.strokeStyle = 'rgba(143,180,255,' + (strong ? .16 : .08) + ')'; x.lineWidth = 1;
    for (var k = 0; k < 12; k++) { var a = k * Math.PI / 6; x.beginPath(); x.moveTo(c + R * 0.12 * Math.cos(a), c + R * 0.12 * Math.sin(a)); x.lineTo(c + (R - 8) * Math.cos(a), c + (R - 8) * Math.sin(a)); x.stroke(); }
    x.setLineDash([2, 6]); [1 / 6, 0.5, 5 / 6].forEach(function (k) { x.beginPath(); x.arc(c, c, R * k, 0, Math.PI * 2); x.stroke(); }); x.setLineDash([]);
    x.restore();
  }
  var MONO = '"JetBrains Mono", "SF Mono", monospace', SANS = '"Hanken Grotesk", system-ui, sans-serif';
  function text(x, s, px, py, font, col, align) { x.font = font; x.textAlign = align || 'center'; x.textBaseline = 'middle'; x.lineWidth = 3; x.strokeStyle = 'rgba(5,10,24,.9)'; x.strokeText(s, px, py); x.fillStyle = col; x.fillText(s, px, py); }
  /* Shortens s with an ellipsis until it fits w pixels in the current font */
  function fit(x, s, font, w) { x.font = font; s = String(s || ''); if (x.measureText(s).width <= w) return s; while (s.length > 2 && x.measureText(s + '…').width > w) s = s.slice(0, -1); return s.replace(/[\s,·]+$/, '') + '…'; }
  function chord(R, c, y) { var dy = y - c; return 2 * Math.sqrt(Math.max(0, R * R - dy * dy)); }
  /* Words laid out inside a circle: each line as wide as the circle allows at its own height, the block centred on y.
     Returns the y below the last line. */
  function para(x, s, cx, cy, R, y, font, lh, col, maxL) {
    x.font = font;
    var lay = function (y0) {
      var words = String(s || '').split(/\s+/).filter(Boolean), out = [], cur = '';
      for (var i = 0; i < words.length; i++) {
        var w = chord(R - 8, cy, y0 + out.length * lh) - 10, nx = cur ? cur + ' ' + words[i] : words[i];
        if (cur && x.measureText(nx).width > w) { out.push(cur); cur = words[i]; } else cur = nx;
      }
      if (cur) out.push(cur);
      return out;
    };
    /* centring moves the lines, which changes how wide the circle is for them: settle on a layout that holds where it is drawn */
    var ls = lay(y), y0 = y - (ls.length - 1) * lh / 2;
    for (var k = 0; k < 3; k++) { var l2 = lay(y0); if (l2.length === ls.length) { ls = l2; break; } if (l2.length > ls.length) ls = l2; y0 = y - (ls.length - 1) * lh / 2; }
    if (maxL && ls.length > maxL) { var rest = ls.slice(maxL - 1).join(' '); ls = ls.slice(0, maxL - 1).concat([rest]); y0 = y - (ls.length - 1) * lh / 2; }
    ls.forEach(function (l, i) { var yy = y0 + i * lh; text(x, fit(x, l, font, chord(R - 8, cy, yy) - 10), cx, yy, font, col); });
    return y0 + ls.length * lh;
  }
  function homeName() {
    var d = _data;
    if (d && d.member) return d.member.home_name || '';
    if (d && d.home && d.home.name) return d.home.name;
    var h = homeContact(); if (h) return ((h.first || '') + ' ' + (h.last || '')).trim();
    try { if (role() === 'home' && typeof userSphereName !== 'undefined') return String(userSphereName || ''); } catch (e) {}
    return '';
  }
  /* HOME's picture; or, on a member's radar, that member's own */
  function photoOf(member) {
    try {
      if (member) { var f = typeof focusedContactId !== 'undefined' ? focusedContactId : null, pm = f != null && contactPhotos.get(f); return pm && pm.img ? pm.img : null; }
      if (role() === 'away') { var h = homeContact(); var p = h && contactPhotos.get(h.id); return p && p.img ? p.img : null; }
      return (typeof mediaFrame !== 'undefined' && mediaFrame) ? mediaFrame : null;
    } catch (e) { return null; }
  }
  function homeDot(x, px, py, r, now, name, member, still) {
    if (!still) {
      var pu = ((now / 1000) % 1.6) / 1.6;
      x.beginPath(); x.arc(px, py, r + 4 + pu * r * 1.6, 0, Math.PI * 2); x.strokeStyle = '#d3b577'; x.globalAlpha = (1 - pu) * x.globalAlpha; x.lineWidth = 2; x.stroke(); x.globalAlpha = 1;
    }
    x.save(); x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.clip();
    var img = photoOf(member), iw = img && (img.naturalWidth || img.videoWidth || img.width), ih = img && (img.naturalHeight || img.videoHeight || img.height);
    var g = x.createRadialGradient(px - r * .3, py - r * .3, 0, px, py, r); g.addColorStop(0, '#9fe7ff'); g.addColorStop(1, '#1f7fd1'); x.fillStyle = g; x.fillRect(px - r, py - r, 2 * r, 2 * r);
    if (img && iw && ih) { var sc = Math.max(2 * r / iw, 2 * r / ih); try { x.drawImage(img, px - iw * sc / 2, py - ih * sc / 2, iw * sc, ih * sc); } catch (e) {} }
    else text(x, initials(name), px, py + 1, '800 ' + Math.round(r * .8) + 'px ' + SANS, '#06101f');
    x.restore();
    x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.strokeStyle = '#d3b577'; x.lineWidth = 2; x.stroke();
  }
  function initials(n) { return String(n || '').trim().split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase(); }
  var HC = { emergency: '#ff3d5a', hospital: '#ff4f7a', urgent: '#ff7a9a', clinic: '#ff8fb1', doctor: '#ffb4c8', police: '#5b9cff', fire: '#ff8a3d', pharmacy: '#3ee08f', aed: '#ffd24d' };
  function kname(k) { try { if (window.CovaraHelp) return CovaraHelp.kindName(k); } catch (e) {} return t(k || 'doctor'); }
  /* label boxes: inside the circle and clear of everything already written */
  function boxIn(b, c, R) { var m = R - 6; return [[b[0], b[1]], [b[0] + b[2], b[1]], [b[0], b[1] + b[3]], [b[0] + b[2], b[1] + b[3]]].every(function (p) { return Math.hypot(p[0] - c, p[1] - c) <= m; }); }
  function boxHit(b, boxes) { return boxes.some(function (o) { return b[0] < o[0] + o[2] && b[0] + b[2] > o[0] && b[1] < o[1] + o[3] && b[1] + b[3] > o[1]; }); }

  var driveBtn = null;
  function driveButton(L, T, D) {
    var d = _data, show = role() === 'home' && d && d.member && d.location && d.home && d.home.id;
    if (!driveBtn) {
      driveBtn = document.createElement('button'); driveBtn.type = 'button'; driveBtn.className = 'cvw-drive';
      driveBtn.style.cssText = 'position:absolute;z-index:6;min-height:40px;padding:0 16px;border-radius:20px;border:1px solid #ffd24d;background:linear-gradient(155deg,rgba(255,210,77,.95),rgba(217,154,0,.95));color:#2a1600;font:800 14px var(--nous-font,"Hanken Grotesk",sans-serif);box-shadow:0 0 18px rgba(255,200,60,.45);cursor:pointer;white-space:nowrap;max-width:calc(100vw - 24px);overflow:hidden;text-overflow:ellipsis';
      driveBtn.onclick = driveGo;
      (document.getElementById('stage') || document.body).appendChild(driveBtn);
    }
    driveBtn.hidden = !show;
    if (!show) return;
    var label = '🚗 ' + t('driveTo', { name: first(d.home.name) });
    if (driveBtn.textContent !== label) driveBtn.textContent = label;
    /* in the gap left for it between the map and the room radar, centred under the map */
    var left = Math.round(L + D / 2 - driveBtn.offsetWidth / 2), top = Math.round(T + D + 2);
    var vw = window.innerWidth || 400; left = Math.max(8, Math.min(vw - driveBtn.offsetWidth - 8, left));
    driveBtn.style.left = left + 'px'; driveBtn.style.top = top + 'px';
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

  var STALE_MS = 15 * 60000;
  function drawMacro(cx, cy, R, now, alpha) {
    ensureBox();
    var cv = document.getElementById('sphere'), st = box.parentNode, cr = cv ? cv.getBoundingClientRect() : { left: 0, top: 0 }, sr = st && st !== document.body ? st.getBoundingClientRect() : { left: 0, top: 0 };
    var off = { left: cr.left - sr.left, top: cr.top - sr.top };
    var L = Math.round(off.left + cx - R), T = Math.round(off.top + cy - R), D = Math.round(R * 2);
    if (box.hidden) box.hidden = false;
    if (!document.body.classList.contains('cvw-on')) document.body.classList.add('cvw-on');
    driveButton(L, T, D);
    if (box._k !== L + ',' + T + ',' + D) { box._k = L + ',' + T + ',' + D; box.style.left = L + 'px'; box.style.top = T + 'px'; box.style.width = D + 'px'; box.style.height = D + 'px'; _R = R; if (map) { try { map.resize(); } catch (e) {} } mapTo(); }
    if (box.style.opacity !== '1') box.style.opacity = '1';
    var d = _data, has = !!(d && d.location), member = !!(d && d.member);
    mapDiv.style.visibility = has && streets() ? 'visible' : 'hidden';
    if (has) startMap();
    var dp = Math.min(3, window.devicePixelRatio || 1);
    if (over.width !== Math.round(D * dp) || over.height !== Math.round(D * dp)) { over.width = Math.round(D * dp); over.height = Math.round(D * dp); }
    var x = over.getContext('2d'); x.setTransform(dp, 0, 0, dp, 0, 0); x.clearRect(0, 0, D, D);
    var c = R, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var map0 = has && streets();
    if (!map0) scopeGrid(x, c, R, !has);
    /* the edge darkens into the frame, as on a scope */
    var vg = x.createRadialGradient(c, c, R * 0.62, c, c, R); vg.addColorStop(0, 'rgba(3,7,15,0)'); vg.addColorStop(1, 'rgba(3,7,15,.78)'); x.fillStyle = vg; x.fillRect(0, 0, D, D);
    var name = d && d.home && d.home.name ? d.home.name : homeName();
    var fs = Math.max(9, Math.min(11.5, Math.round(R * 0.085))), fb = Math.max(11.5, Math.min(16, Math.round(R * 0.125)));
    var topY = Math.round(Math.max(18, R * 0.2));
    text(x, t('label'), c, topY, '700 ' + fs + 'px ' + MONO, '#9fd8ff');
    if (!has) {
      /* no position: the scope still sweeps, and says plainly what is missing and what to do */
      [1 / 3, 2 / 3].forEach(function (k) { x.beginPath(); x.arc(c, c, R * k, 0, Math.PI * 2); x.strokeStyle = 'rgba(143,180,255,.32)'; x.lineWidth = 1; x.stroke(); });
      if (!reduce) sweep(x, c, c, R - 3, now, false);
      var fn = first(name), msg, todo = '';
      if (!d) { if (_err) { msg = t('noReach'); todo = t('noReachDo'); } else msg = t('finding', { first: fn }); }
      else if (!d.share.location) { msg = t(d.member ? 'memberNoShare' : 'noShare', { first: fn }); todo = t('noShareDo', { first: fn }); }
      else { msg = t('noPos2', { first: fn }); todo = t('noPosDo', { first: fn }); }
      var hr0 = Math.max(9, Math.round(R * 0.11));
      x.save(); x.globalAlpha = 0.55; homeDot(x, c, c - R * 0.32, hr0, 0, name, member, true); x.restore();
      x.beginPath(); x.arc(c, c - R * 0.32, hr0 + 5, 0, Math.PI * 2); x.setLineDash([3, 4]); x.strokeStyle = 'rgba(159,216,255,.7)'; x.lineWidth = 1.2; x.stroke(); x.setLineDash([]);
      var yN = para(x, msg, c, c, R, c + (todo ? -R * 0.02 : R * 0.08), '600 ' + fs + 'px ' + SANS, fs + 4, '#eef4ff', 3);
      if (todo) para(x, todo, c, c, R, yN + fs * 0.9 + 4, '600 ' + Math.max(8.5, fs - 1) + 'px ' + SANS, fs + 3, '#ffd98a', 3);
      rim(x, c, c, R);
      return;
    }
    var span = spanM(), mpp = span / R, lat0 = d.location.lat, lon0 = d.location.lon;
    var stale = Date.now() - (d.location.at || 0) > STALE_MS;
    function at(lat, lon) { return { x: c + (lon - lon0) * 111320 * Math.cos(lat0 * Math.PI / 180) / mpp, y: c - (lat - lat0) * 111320 / mpp }; }
    var boxes = [], ringL = [];
    /* gold range rings, to scale; their distances read down the north line, inside the circle */
    var lf = '600 ' + Math.max(8.5, fs - 1) + 'px ' + MONO;
    x.font = '700 ' + fs + 'px ' + MONO; boxes.push([c - x.measureText(t('label')).width / 2 - 4, topY - fs, x.measureText(t('label')).width + 8, fs * 2]);
    [1 / 3, 2 / 3, 0.94].forEach(function (k, i) {
      x.beginPath(); x.arc(c, c, R * k, 0, Math.PI * 2); x.strokeStyle = '#d3b577'; x.globalAlpha = i === 2 ? .65 : .45; x.lineWidth = i === 2 ? 1.4 : 1; x.setLineDash(i === 2 ? [] : [4, 5]); x.stroke(); x.setLineDash([]); x.globalAlpha = 1;
      if (i < 2) ringL.push({ s: dist(span * k), y: c - R * k + fs * 0.75 });
    });
    if (!reduce) sweep(x, c, c, R - 3, now, true);
    /* the words at the foot of the circle, laid out first so nothing else is written under them */
    var hn = d.member ? first(d.member.home_name) : '';
    var hlp = helpNear();
    var withL = d.with || [];
    var dv = !d.member && d.drive && d.drive.driving ? d.drive : null;
    var where = stale ? t('lastKnownAt', { t: ago(d.location.at) }) : dv ? (dv.to && dv.to.eta_at ? t('drivingTo', { name: first(dv.to.name), t: new Date(dv.to.eta_at).toLocaleTimeString(loc(), { hour: 'numeric', minute: '2-digit' }) }) : t('driving')) : d.inside ? t('inside', { place: d.inside.name }) : d.member ? (d.at_home === true ? t('atHomeOf', { home: hn }) : d.at_home === false && d.from_home_m != null ? t('fromHomeOf', { d: dist(d.from_home_m), home: hn }) : '')
      : d.at_home === true ? t('atHome') : d.at_home === false ? (t('out') + (d.from_home_m != null ? ', ' + t('fromHome', { d: dist(d.from_home_m) }) : '')) : '';
    var line3 = d.member ? (d.with_home ? (d.with_home.with ? t('withHome', { home: hn }) : t('homeAway', { home: hn, d: dist(d.with_home.m) })) : '') : withL.length ? (withL.some(function (m) { return m.you; }) && withL.length === 1 ? t('withYou') : t('with', { name: withL.map(function (m) { return m.you ? (IT() ? 'te' : 'you') : first(m.name); }).join(', ') }))
      : d.closest ? (d.closest.you ? t('nearestYou', { d: dist(d.closest.m) }) : t('nearest', { name: first(d.closest.name), d: dist(d.closest.m) })) : '';
    var line3c = withL.length ? '#5eead4' : '#9fb4e2';
    /* during a call for help, the first place to call is written whenever nobody is with HOME */
    if (hlp && hlp.first && !withL.length) { line3 = hlp.first.name + ' · ' + dist(hlp.first.m); line3c = HC[hlp.first.kind] || HC.doctor; }
    var lines = [{ s: first(name) + '  ·  ' + ago(d.location.at), f: '700 ' + fb + 'px ' + SANS, c: stale ? '#fbbf24' : '#f0eef5', h: fb + 4 }];
    if (where) lines.push({ s: where, f: '600 ' + fs + 'px ' + MONO, c: stale || d.at_home === false ? '#fbbf24' : '#c7d2e2', h: fs + 5 });
    if (line3) lines.push({ s: line3, f: '600 ' + fs + 'px ' + MONO, c: line3c, h: fs + 5 });
    /* the last row: the map's credit when streets show */
    var attr = map0 ? { s: '© OpenStreetMap · OpenFreeMap', f: '500 7.5px ' + SANS, c: 'rgba(240,238,245,.75)', h: 10 } : { s: '', f: '500 7px ' + SANS, c: '', h: 0 };
    var hr2 = Math.max(9, Math.round(R * 0.12));
    /* the band rises only as far as its words need to fit the circle, never over HOME's picture */
    var bandH = 0;
    var fits = function (top) {
      var y = top + 6, ok = true;
      lines.concat([attr]).forEach(function (l) { var ym = y + l.h / 2, edge = ym > c ? ym + l.h / 2 : ym - l.h / 2; x.font = l.f; if (x.measureText(l.s).width > chord(R - 6, c, edge) - 10) ok = false; y += l.h; });
      return ok && y <= c + R * 0.93;
    };
    var bandMin = c + hr2 + 6;
    var climb = function () { var bt = Math.min(c + R * 0.3, c + R * 0.9 - bandH); while (bt > bandMin && !fits(bt)) bt -= 2; return bt; };
    var base = lines.slice(), bandTop = 0, topLine = null;
    var sized = function (k) { return base.map(function (l, i) { var px = Math.round(Math.max(i ? 7.5 : 9.5, (i ? fs : fb) * k) * 2) / 2; return { s: l.s, c: l.c, f: (i ? '600 ' : '700 ') + px + 'px ' + (i ? MONO : SANS), h: px + (i ? 5 : 4) }; }); };
    var tryAll = function (ks) { return ks.some(function (k) { lines = sized(k); bandH = lines.reduce(function (a, l) { return a + l.h; }, 0) + attr.h + 10; bandTop = climb(); return fits(bandTop); }); };
    /* on a small circle the words grow a little smaller before they are ever cut; if that is not enough,
       who is with HOME (or the closest) moves up under the label, where the circle is wide */
    if (!tryAll([1, 0.92, 0.85]) && base.length === 3) {
      topLine = base.pop();
      if (!map0) attr = { s: t('mapOff2'), f: '700 7px ' + MONO, c: 'rgba(159,190,235,.75)', h: 9 };
      if (!tryAll([1, 0.92, 0.85, 0.78]) && !map0) { attr = { s: '', f: '500 7px ' + SANS, c: '', h: 0 }; tryAll([0.85, 0.78]); }
    } else if (!fits(bandTop)) tryAll([0.78]);
    /* under the label: who is with HOME when the band had no room for it, else that the street map is offline */
    var topSlot = topLine ? { s: topLine.s, f: '700 ' + Math.max(8, fs - 1) + 'px ' + MONO, c: topLine.c, y: topY + fs * 1.4 + 4 } : !map0 ? { s: t('mapOff'), f: '700 ' + Math.max(7, fs - 2.5) + 'px ' + MONO, c: 'rgba(159,190,235,.75)', y: topY + fs + 4 } : null;
    var topDraw = function () {
      if (!topSlot) return;
      /* a size that fits whole, else the smallest, shortened */
      var my = topSlot.y, w = chord(R - 6, c, my - fs / 2) - 8, f = topSlot.f;
      [fs - 1, fs - 1.5, fs - 2, 7].some(function (px) { f = '700 ' + Math.max(7, px) + 'px ' + MONO; x.font = f; return x.measureText(topSlot.s).width <= w; });
      text(x, fit(x, topSlot.s, f, w), c, my, f, topSlot.c);
    };
    if (topSlot) { x.font = topSlot.f; var tw = Math.min(x.measureText(topSlot.s).width, chord(R - 6, c, topSlot.y - fs / 2) - 8); boxes.push([c - tw / 2 - 3, topSlot.y - fs * 0.65, tw + 6, fs * 1.3]); }
    var bandBox = [0, bandTop, D, D - bandTop], bandBoxes = []; boxes.push(bandBox);
    /* where home is, when HOME is out: on the radar when it fits, else an arrow on the rim with its distance */
    /* HOME's picture, and the team beside HOME when someone is with HOME, stay clear of every label */
    var hb = withL.length ? hr2 * 3.3 : hr2 + 5, homeBox = [c - hb, c - hb, 2 * hb, 2 * hb]; boxes.push(homeBox);
    /* off the radar: an arrow on the rim pointing the way, drawn last so the words at the foot never hide it */
    var late = [];
    function rimMark(p, col, label) {
      var a = Math.atan2(p.y - c, p.x - c), rr = R * 0.84, px = c + rr * Math.cos(a), py = c + rr * Math.sin(a);
      late.push(function () {
        x.save(); x.translate(px, py); x.rotate(a); x.beginPath(); x.moveTo(7, 0); x.lineTo(-4, -5); x.lineTo(-4, 5); x.closePath(); x.fillStyle = col; x.shadowColor = col; x.shadowBlur = 8; x.fill(); x.restore();
        if (!label) return;
        var f = '700 ' + Math.max(8, fs - 1) + 'px ' + MONO, h = fs + 4;
        /* the whole label where it fits, else its first word */
        [label, String(label).split(' ')[0]].some(function (lb) {
          x.font = f; var w = x.measureText(lb).width + 4;
          var tries = [[px - w / 2 - (Math.cos(a) * (w / 2 + 8)), py - h / 2 - Math.sin(a) * (h / 2 + 8)], [px - w / 2, py - h - 8], [px - w / 2, py + 8], [px + 8, py - h / 2], [px - w - 8, py - h / 2]];
          /* the arrow's words may sit in the band at the foot, clear of the words already there */
          var others = boxes.filter(function (o) { return o !== bandBox; }).concat(bandBoxes);
          for (var i = 0; i < tries.length; i++) { var b = [tries[i][0], tries[i][1], w, h]; if (boxIn(b, c, R) && !boxHit(b, others)) { boxes.push(b); text(x, lb, b[0] + w / 2, b[1] + h / 2, f, col); return true; } }
          return false;
        });
      });
    }
    if (d.home_spot && d.at_home === false) {
      var hp = at(d.home_spot.lat, d.home_spot.lon), hrr = Math.hypot(hp.x - c, hp.y - c), hlab = d.member ? t('homeOf', { home: hn }).toUpperCase() : t('homeOff');
      if (hrr < R * 0.86) {
        x.beginPath(); x.arc(hp.x, hp.y, 4.5, 0, Math.PI * 2); x.fillStyle = '#9fd8ff'; x.fill(); x.strokeStyle = '#06101f'; x.lineWidth = 1.5; x.stroke();
        var hf = '700 ' + Math.max(8, fs - 1) + 'px ' + MONO; x.font = hf; var hw = x.measureText(hlab).width + 4;
        [[hp.x - hw / 2, hp.y - fs - 10], [hp.x - hw / 2, hp.y + 7], [hp.x + 7, hp.y - fs / 2 - 2], [hp.x - hw - 7, hp.y - fs / 2 - 2]].some(function (q) { var b = [q[0], q[1], hw, fs + 4]; if (boxIn(b, c, R) && !boxHit(b, boxes)) { boxes.push(b); text(x, hlab, b[0] + hw / 2, b[1] + (fs + 4) / 2, hf, '#9fd8ff'); return true; } return false; });
      } else rimMark(hp, '#9fd8ff', hlab + ' ' + dist(d.from_home_m != null ? d.from_home_m : metres(d.home_spot, d.location)));
    }
    /* a member's radar also marks HOME, when HOME is apart from them */
    if (d.member && d.with_home && !d.with_home.with) {
      var rp = at(d.with_home.lat, d.with_home.lon), rr = Math.hypot(rp.x - c, rp.y - c);
      if (rr < R * 0.86) { x.beginPath(); x.arc(rp.x, rp.y, Math.max(7, R * 0.07), 0, Math.PI * 2); x.fillStyle = '#d3b577'; x.fill(); x.strokeStyle = '#fff4d6'; x.lineWidth = 1.2; x.stroke(); text(x, initials(d.member.home_name), rp.x, rp.y + 0.5, '800 ' + Math.max(7, Math.round(R * 0.06)) + 'px ' + SANS, '#1a1200'); boxes.push([rp.x - 9, rp.y - 9, 18, 18]); }
      else rimMark(rp, '#ffd24d', first(d.member.home_name).toUpperCase() + ' ' + dist(d.with_home.m));
    }
    /* the closest of the team, when not with HOME: somewhere on this ring (only the distance leaves the server) */
    if (!d.member && d.closest && !d.closest.with && !withL.length) {
      var cr0 = d.closest.m / mpp;
      if (cr0 > hr2 * 1.6 && cr0 < R * 0.9) {
        x.beginPath(); x.arc(c, c, cr0, 0, Math.PI * 2); x.setLineDash([2, 5]); x.strokeStyle = 'rgba(94,234,212,.7)'; x.lineWidth = 1.3; x.stroke(); x.setLineDash([]);
        var cl = t('closestRing', { name: d.closest.you ? (IT() ? 'Tu' : 'You') : first(d.closest.name), d: dist(d.closest.m) }), cf = '700 ' + Math.max(8, fs - 1) + 'px ' + MONO; x.font = cf; var cw = x.measureText(cl).width + 4;
        [-0.75, -0.25, 0.75 + 1, 0.25 + 1].some(function (k) { var a = Math.PI * k, bx = c + cr0 * Math.cos(a) - cw / 2, by = c + cr0 * Math.sin(a) - fs / 2 - 2, b = [bx, by, cw, fs + 4]; if (boxIn(b, c, R) && !boxHit(b, boxes)) { boxes.push(b); text(x, cl, bx + cw / 2, by + (fs + 4) / 2, cf, '#5eead4'); return true; } return false; });
      }
    }
    /* the nearest health facilities, when HOME is out; during a call for help, every place near the caller that can answer */
    var hq = hlp, fac = hq && hq.places.length ? hq.places.slice(0, 10) : d.at_home === false || (d.member && d.at_home == null) ? (d.health || []).slice(0, 5) : [];
    /* the first place to call comes first, so its name is always written */
    if (hq && hq.first) fac = [hq.first].concat(fac.filter(function (f) { return f.id !== hq.first.id; }));
    var named = 0;
    fac.forEach(function (f, i) {
      var p = at(f.lat, f.lon), rr2 = Math.hypot(p.x - c, p.y - c);
      var col = HC[f.kind] || HC.doctor;
      if (rr2 > R * 0.86) { if (hq && hq.first && f.id === hq.first.id) rimMark(p, col, fit(x, f.name, '700 ' + Math.max(8, fs - 1) + 'px ' + MONO, R * 0.7)); return; }
      var lit = reduce ? 1 : sweepLit(now, Math.atan2(p.y - c, p.x - c));
      var g = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10 + 6 * lit); g.addColorStop(0, col); g.addColorStop(.4, col + '88'); g.addColorStop(1, col + '00');
      x.fillStyle = g; x.beginPath(); x.arc(p.x, p.y, 10 + 6 * lit, 0, Math.PI * 2); x.fill();
      x.beginPath(); x.arc(p.x, p.y, 3.6, 0, Math.PI * 2); x.fillStyle = '#fff'; x.fill();
      if (hq && hq.first && f.id === hq.first.id) { x.beginPath(); x.arc(p.x, p.y, 9, 0, Math.PI * 2); x.strokeStyle = '#ffd24d'; x.lineWidth = 2; x.stroke(); }
      if (named >= 3) return;
      /* its name and kind beside it, as Remiel: Personal Protection names its dots: the first free place right, left, above or below */
      var f1 = '700 ' + Math.max(8.5, fs - 0.5) + 'px ' + SANS, f2 = '600 ' + Math.max(7.5, fs - 2) + 'px ' + MONO;
      var nm1 = fit(x, f.name, f1, R * 0.62), nm2 = kname(f.kind).toUpperCase() + ' · ' + dist(f.m);
      x.font = f1; var w1 = x.measureText(nm1).width; x.font = f2; var w = Math.max(w1, x.measureText(nm2).width) + 4, h = fs * 2 + 5;
      var right = p.x >= c;
      var place2 = function (w0, h0) { var tries = [[right ? 9 : -9 - w0, -h0 / 2], [right ? -9 - w0 : 9, -h0 / 2], [-w0 / 2, -9 - h0], [-w0 / 2, 9]]; for (var k = 0; k < tries.length; k++) { var b = [p.x + tries[k][0], p.y + tries[k][1], w0, h0]; if (boxIn(b, c, R) && !boxHit(b, boxes)) return b; } return null; };
      var b2 = place2(w, h);
      if (b2) {
        boxes.push(b2); named++;
        x.fillStyle = 'rgba(7,11,22,.6)'; x.fillRect(b2[0] - 2, b2[1], w + 4, h);
        text(x, nm1, b2[0] + 2, b2[1] + fs * 0.6 + 1, f1, '#ffe3ea', 'left');
        text(x, nm2, b2[0] + 2, b2[1] + fs * 1.6 + 3, f2, col, 'left');
        return;
      }
      /* not room for two lines: the name alone, shorter */
      var nm3 = fit(x, f.name, f1, R * 0.5); x.font = f1; var w3 = x.measureText(nm3).width + 4, b3 = place2(w3, fs + 4);
      if (b3) { boxes.push(b3); named++; x.fillStyle = 'rgba(7,11,22,.6)'; x.fillRect(b3[0] - 2, b3[1], w3 + 4, fs + 4); text(x, nm3, b3[0] + 2, b3[1] + (fs + 4) / 2, f1, '#ffe3ea', 'left'); }
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
    withL.slice(0, 4).forEach(function (m, i) {
      var a = -Math.PI * 0.75 + i * 0.9, px = c + Math.cos(a) * hr2 * 2.3, py = c + Math.sin(a) * hr2 * 2.3, r = Math.max(7, hr2 * 0.62);
      x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fillStyle = '#22d3a6'; x.fill(); x.strokeStyle = '#eafff8'; x.lineWidth = 1.4; x.stroke();
      text(x, initials(m.name), px, py + 0.5, '800 ' + Math.round(r * 0.9) + 'px ' + SANS, '#04211a');
    });
    if (withL.length > 4) text(x, '+' + (withL.length - 4), c + hr2 * 2.3, c + hr2 * 1.2, '800 ' + Math.max(8, fs - 1) + 'px ' + MONO, '#5eead4');
    /* the phone's own accuracy, as a soft ring, when it is wider than the dot */
    var accR = (d.location.accuracy || 0) / mpp;
    if (accR > hr2 * 1.3 && accR < R * 0.9) { x.beginPath(); x.arc(c, c, accR, 0, Math.PI * 2); x.fillStyle = 'rgba(56,189,248,.08)'; x.fill(); x.strokeStyle = 'rgba(56,189,248,.35)'; x.lineWidth = 1; x.stroke(); }
    if (stale) {
      x.save(); x.globalAlpha = 0.6; homeDot(x, c, c, hr2, 0, name, member, true); x.restore();
      x.beginPath(); x.arc(c, c, hr2 + 5, 0, Math.PI * 2); x.setLineDash([3, 3]); x.strokeStyle = '#fbbf24'; x.lineWidth = 1.4; x.stroke(); x.setLineDash([]);
    } else homeDot(x, c, c, hr2, reduce ? 0 : now, name, member);
    /* words: who and where, at the foot of the circle, each line as wide as the circle is there */
    x.fillStyle = 'rgba(6,10,20,0.66)'; x.fillRect(0, bandTop, D, D - bandTop);
    x.beginPath(); x.moveTo(0, bandTop); x.lineTo(D, bandTop); x.strokeStyle = 'rgba(211,181,119,.35)'; x.lineWidth = 1; x.stroke();
    var yy = bandTop + 6;
    lines.forEach(function (l) { var ym = yy + l.h / 2, s1 = fit(x, l.s, l.f, chord(R - 6, c, ym + (ym > c ? l.h / 2 : -l.h / 2)) - 10); text(x, s1, c, ym, l.f, l.c); x.font = l.f; var lw = x.measureText(s1).width; bandBoxes.push([c - lw / 2 - 3, yy, lw + 6, l.h]); yy += l.h; });
    if (attr.s) { x.font = attr.f; var aw = x.measureText(attr.s).width; bandBoxes.push([c - aw / 2 - 3, yy, aw + 6, attr.h]); }
    late.forEach(function (fn) { fn(); });
    if (attr.s) { var ya = yy + attr.h / 2; text(x, fit(x, attr.s, attr.f, chord(R - 6, c, ya + attr.h / 2) - 12), c, ya, attr.f, attr.c); }
    /* the ring distances, where they are clear of everything else; and the label on top of all */
    ringL.forEach(function (q) { x.font = lf; var b = [c + 3, q.y - fs * 0.6, x.measureText(q.s).width + 4, fs * 1.2]; var others = withL.length ? boxes : boxes.filter(function (o) { return o !== homeBox; }).concat([[c - hr2 - 2, c - hr2 - 2, 2 * hr2 + 4, 2 * hr2 + 4]]); if (boxIn(b, c, R) && !boxHit(b, others)) { boxes.push(b); text(x, q.s, c + 5, q.y, lf, '#e3c98c', 'left'); } });
    text(x, t('label'), c, topY, '700 ' + fs + 'px ' + MONO, '#9fd8ff'); topDraw();
    rim(x, c, c, R);
  }

  /* ── the room every 10 seconds: only what HOME's phone hears, asked on its own so the room radar is never empty ── */
  var ROOM_S = 10, _room = null, _roomFor = null, _roomAt = 0, _roomBusy = false, _roomErr = 0;
  function loadRoom(force) {
    if (!authed() || _roomBusy) return;
    if (!force && !shown() && !roomOpen() && !entryShown()) return;
    var h = homeUser(); if (role() !== 'home' && !h) return;
    if (_roomFor !== h) { _room = null; _roomFor = h; _roomErr = 0; }
    _roomBusy = true;
    SyncEngine.apiFetch('/care/room' + (h ? '?home=' + encodeURIComponent(h) : ''), { method: 'GET' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { _roomBusy = false; if (_roomFor !== h) return; if (j) { _room = { share: j.share ? 1 : 0, phone: j.phone || null }; _roomAt = Date.now(); _roomErr = 0; } else _roomErr = Date.now(); paintRoom(); })
      .catch(function () { _roomBusy = false; _roomErr = Date.now(); paintRoom(); });
  }
  setInterval(function () { loadRoom(false); }, ROOM_S * 1000);
  /* What the room radar can say now:
     loading, noshare, out (HOME's phone is out of the house), none (never listened), stale, live, sensors */
  function roomState() {
    var d = _data, self = role() === 'home';
    var p = _room ? _room.phone : null, share = _room ? _room.share : (d && !d.member && d.share ? d.share.rooms : null);
    var o = { self: self, p: p, share: share, name: homeName(), native: self && RNATIVE, st: self && RNATIVE ? rStatus() : null };
    if (!_room && !(d && !d.member)) { o.kind = _roomErr || _err ? 'noreach' : 'loading'; return o; }
    if (share === 0) { o.kind = 'noshare'; return o; }
    /* room sensors, where a home has them, are drawn room by room */
    var list = d && !d.member && d.rooms ? (d.rooms.list || []).filter(function (r) { return r.sensor; }) : [];
    if (list.length && !p) { o.kind = 'sensors'; o.list = d.rooms.list; return o; }
    var out = d && !d.member && d.at_home === false && d.location && Date.now() - (d.location.at || 0) < STALE_MS;
    if (out) { o.kind = 'out'; return o; }
    if (!p) { o.kind = 'none'; return o; }
    o.kind = p.online ? 'live' : 'stale';
    var lvl = p.online ? ['none', 'minimal', 'moderate', 'high'].indexOf(p.level) : -1;
    o.lvl = lvl;
    o.learning = p.online && lvl < 1 && p.started_at && Date.now() - p.started_at < 3 * 60000 && !p.moved_at;
    o.charging = self && o.st && o.st.running ? !!o.st.charging : (typeof p.charging === 'boolean' ? p.charging : null);
    return o;
  }
  /* the plain words for what the room is doing */
  function roomWords(o) {
    var fn = first(o.name), p = o.p;
    if (o.kind === 'live') {
      if (o.lvl >= 1) return { h: t('nowMoving'), s: t('nowMovingSub'), c: '#ffd24d' };
      if (o.learning) return { h: t('learningT'), s: t('learningSub'), c: '#9fd8ff' };
      var since = p.moved_at || p.started_at || p.at;
      return { h: t('quietSince', { t: clock(since) }), s: t('quietFor', { d: dur(Date.now() - since) }), c: '#9fd8ff' };
    }
    if (o.kind === 'stale') return { h: t('notHeardSince', { t: clock(p.at) }), s: t(o.self ? 'notHeardForSelf' : 'notHeardFor', { first: fn, d: dur(Date.now() - p.at) }), c: '#fbbf24' };
    if (o.kind === 'none') return { h: t('notYet'), s: t(o.self ? 'notYetSubSelf' : 'notYetSub', { first: fn }), c: '#fbbf24' };
    if (o.kind === 'out') return { h: t('outRooms', { first: fn }), s: t('outHouse', { first: fn }), c: '#fbbf24' };
    if (o.kind === 'noshare') return { h: t('noRooms', { first: fn }), s: '', c: '#c7d2e2' };
    if (o.kind === 'noreach') return { h: t('noReach'), s: t('noReachDo'), c: '#fbbf24' };
    if (o.kind === 'sensors') return { h: t('rooms'), s: '', c: '#9fd8ff' };
    return { h: t('finding', { first: fn }), s: '', c: '#9fd8ff' };
  }

  function dur(ms) {
    var m = Math.max(0, Math.round(ms / 60000)); if (m < 1) return IT() ? 'meno di 1 min' : 'under 1 min';
    if (m < 60) return m + ' min'; var hh = Math.floor(m / 60), mm = m % 60; return hh + ' h' + (mm ? ' ' + mm + ' min' : '');
  }
  /* HOME's phone listening to the room: the last two hours around the rim, movement as ripples, one full sweep every 10 seconds */
  function phoneRoom(x, cx, cy, r, now, reduce, o, fs, big) {
    var p = o.p, name = o.name, fn = first(name);
    var T = 2 * 3600000, tr = (p && p.trace) || [], tNow = Date.now();
    var rr = r * 0.72, lw = Math.max(3, r * 0.065);
    /* the last two hours as a ring, like a clock face run backwards from the top: gold where the room moved */
    x.beginPath(); x.arc(cx, cy, rr, 0, Math.PI * 2); x.strokeStyle = 'rgba(143,180,255,.12)'; x.lineWidth = lw; x.stroke();
    tr.forEach(function (pt) {
      var age = tNow - pt[0]; if (age < 0 || age > T) return;
      var a1 = -Math.PI / 2 - (age / T) * Math.PI * 2, a0 = a1 - (60000 / T) * Math.PI * 2 - 0.004;
      x.beginPath(); x.arc(cx, cy, rr, a0, a1);
      x.strokeStyle = pt[1] >= 2 ? 'rgba(255,210,77,.95)' : pt[1] === 1 ? 'rgba(211,181,119,.7)' : 'rgba(79,141,240,.42)';
      x.lineWidth = lw; x.stroke();
    });
    if (big) {
      /* the hours, small, on the ring */
      var hf = '600 ' + Math.max(8, fs - 2) + 'px ' + MONO;
      [[0.25, IT() ? '30 min' : '30 min'], [0.5, '1 h'], [0.75, '1 h 30']].forEach(function (q) { var a = -Math.PI / 2 - q[0] * Math.PI * 2; text(x, q[1], cx + (rr - lw - 9) * Math.cos(a), cy + (rr - lw - 9) * Math.sin(a), hf, 'rgba(185,205,245,.75)'); });
    }
    /* now: a bright tick at the top */
    x.beginPath(); x.moveTo(cx, cy - rr - lw); x.lineTo(cx, cy - rr + lw); x.strokeStyle = '#ffffff'; x.lineWidth = 2; x.stroke();
    /* one full sweep every 10 seconds, starting at the top as each new reading of the room arrives */
    var live = o.kind === 'live';
    if (!reduce) sweep(x, cx, cy, r - 2, live && _roomAt ? Date.now() - _roomAt : now, false, ROOM_S);
    /* movement now: ripples from HOME, faster and warmer the more the room moves */
    var lvl = live ? o.lvl : -1;
    var hy = cy - r * (big ? 0.16 : 0.14), hr = Math.max(6, r * 0.13);
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
    x.save(); if (!live) x.globalAlpha = 0.5; homeDot(x, cx, hy, hr, reduce || !live ? 0 : now, name, false, !live); x.restore();
    if (!live) { x.beginPath(); x.arc(cx, hy, hr + 5, 0, Math.PI * 2); x.setLineDash([3, 4]); x.strokeStyle = 'rgba(251,191,36,.75)'; x.lineWidth = 1.2; x.stroke(); x.setLineDash([]); }
    /* words, short in the small circle: the screen behind it says the rest */
    var l1, c1, l2 = '';
    /* not heard now: the headline only (Room motion, a tap away, says what to do) */
    if (o.kind === 'none') {
      l1 = o.self && RNATIVE && _rState === 'starting' ? t('listenStarting') : roomWords(o).h;
      para(x, l1, cx, cy, r, cy + r * 0.3, '700 ' + fs + 'px ' + SANS, fs + 3, '#ffe9b8', 2);
      return;
    }
    if (o.kind === 'stale') { para(x, roomWords(o).h, cx, cy, r, cy + r * 0.3, '700 ' + fs + 'px ' + SANS, fs + 3, '#fbbf24', 2); return; }
    if (lvl >= 1) { l1 = t('moving'); c1 = '#ffd24d'; }
    else if (o.learning) { l1 = t('learning'); c1 = '#9fd8ff'; }
    else { l1 = p.still_ms > 60000 ? t('stillFor', { t: dur(p.still_ms) }) : t('still'); c1 = '#9fd8ff'; }
    l2 = agoS(p.at);
    var y1 = cy + r * 0.26, f1 = '800 ' + fs + 'px ' + MONO, f2 = '600 ' + Math.max(7.5, fs - 1) + 'px ' + MONO;
    text(x, fit(x, l1, f1, chord(r - 8, cy, y1 + fs / 2) - 8), cx, y1, f1, c1);
    text(x, fit(x, l2, f2, chord(r - 8, cy, y1 + fs * 1.5 + 3) - 8), cx, y1 + fs + 3, f2, 'rgba(230,237,248,.82)');
  }

  function precision(x, cx, cy, r, now, hp, name, reduce, alpha) {
    var fs = Math.max(8, Math.min(10.5, Math.round(r * 0.1))), acc = Math.max(1, Number(hp.location.accuracy) || 15);
    x.save(); x.globalAlpha = Math.min(1, 0.8 + alpha * 0.4);
    x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.clip();
    var bg = x.createRadialGradient(cx, cy, r * 0.05, cx, cy, r); bg.addColorStop(0, '#3a0b16'); bg.addColorStop(.7, '#1a0610'); bg.addColorStop(1, '#090208'); x.fillStyle = bg; x.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    /* scale: the outer ring is the larger of 10 ft (3 m) and the phone's own accuracy, so the spot is never drawn tighter than the phone knows */
    var span = Math.max(3.05, acc * 1.25), px = r * 0.8 / span;
    [0.33, 0.66, 1].forEach(function (k) { x.beginPath(); x.arc(cx, cy, r * 0.8 * k, 0, Math.PI * 2); x.strokeStyle = 'rgba(255,140,160,' + (k === 1 ? .55 : .3) + ')'; x.lineWidth = 1; x.setLineDash(k === 1 ? [] : [3, 4]); x.stroke(); x.setLineDash([]); });
    x.strokeStyle = 'rgba(255,170,185,.35)'; x.beginPath(); x.moveTo(cx - r, cy); x.lineTo(cx + r, cy); x.moveTo(cx, cy - r); x.lineTo(cx, cy + r); x.stroke();
    /* the phone's accuracy as a soft red disc, the caller in the middle, pulsing */
    var ar = Math.min(r * 0.8, acc * px);
    x.beginPath(); x.arc(cx, cy, ar, 0, Math.PI * 2); x.fillStyle = 'rgba(255,60,90,.18)'; x.fill(); x.strokeStyle = 'rgba(255,90,115,.8)'; x.lineWidth = 1.4; x.stroke();
    var k2 = reduce ? 0.5 : (now % 1200) / 1200;
    x.beginPath(); x.arc(cx, cy, 6 + k2 * r * 0.35, 0, Math.PI * 2); x.strokeStyle = 'rgba(255,90,115,' + (0.8 * (1 - k2)) + ')'; x.lineWidth = 2; x.stroke();
    homeDot(x, cx, cy, Math.max(6, r * 0.11), reduce ? 0 : now, name);
    var imp = !IT(), ty = cy - r + Math.max(15, r * 0.24), tf = '700 ' + Math.max(7.5, fs - 1) + 'px ' + MONO;
    var top = (hp.room ? String(hp.room).toUpperCase() + ' · ' : '') + (imp ? Math.round(span * 3.281) + ' FT' : Math.round(span) + ' M');
    text(x, fit(x, top, tf, chord(r - 8, cy, ty) - 8), cx, ty, tf, '#ffc7d2');
    var by = cy + r * 0.56, bf = '700 ' + fs + 'px ' + MONO, bot = (imp ? '±' + Math.max(5, Math.round(acc * 3.281)) + ' ft' : '±' + Math.round(acc) + ' m') + ' · ' + ago(hp.location.at);
    text(x, fit(x, bot, bf, chord(r - 8, cy, by + fs / 2) - 8), cx, by, bf, '#ffe3e8');
    x.restore();
    rim(x, cx, cy, r);
  }

  /* ── the room radar: inside the home or facility where HOME is ── */
  function roomFace(x, cx, cy, r, now, alpha, big) {
    var d = _data, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, o = roomState(), name = o.name;
    x.save();
    x.globalAlpha = big ? 1 : Math.min(1, 0.85 + alpha * 0.4);
    x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.clip();
    var bg = x.createRadialGradient(cx, cy - r * 0.2, r * 0.05, cx, cy, r); bg.addColorStop(0, '#0e2147'); bg.addColorStop(.6, '#081430'); bg.addColorStop(1, '#03070f'); x.fillStyle = bg; x.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    [0.36, 0.86].forEach(function (k) { x.beginPath(); x.arc(cx, cy, r * k, 0, Math.PI * 2); x.strokeStyle = 'rgba(143,180,255,.22)'; x.lineWidth = 1; x.stroke(); });
    var fs = big ? Math.max(11, Math.min(14, Math.round(r * 0.1))) : Math.max(8.5, Math.min(11, Math.round(r * 0.12)));
    var out = d && !d.member && d.at_home === false;
    var place = out ? (d.inside ? d.inside.name : '') : t('home');
    if (o.kind === 'sensors') {
      var rooms = o.list, n = rooms.length, step = Math.PI * 2 / n;
      rooms.forEach(function (rm, i) {
        var a0 = -Math.PI / 2 + i * step, mid = a0 + step / 2;
        var here = !!rm.here || (d.rooms.now && d.rooms.now.toLowerCase() === rm.name.toLowerCase());
        var lit = reduce ? 0.5 : sweepLit(now, mid);
        x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, r, a0 + 0.03, a0 + step - 0.03); x.closePath();
        x.fillStyle = rm.fall ? 'rgba(255,61,90,' + (0.28 + 0.25 * lit) + ')' : here ? 'rgba(211,181,119,' + (0.22 + 0.22 * lit) + ')' : 'rgba(79,141,240,' + (0.05 + 0.1 * lit) + ')'; x.fill();
        x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + r * Math.cos(a0), cy + r * Math.sin(a0)); x.strokeStyle = 'rgba(143,180,255,.28)'; x.lineWidth = 1; x.stroke();
        var lk = n === 1 ? 0 : 0.62, lx = cx + r * lk * Math.cos(mid), ly = cy + r * lk * Math.sin(mid) + (n === 1 ? r * 0.42 : 0);
        var nm = fit(x, rm.name, (here || rm.fall ? '800 ' : '600 ') + fs + 'px ' + SANS, n === 1 ? r * 1.1 : Math.min(r * 0.58, 2 * r * 0.62 * Math.sin(Math.min(step, Math.PI) / 2) - 6));
        text(x, nm, lx, ly, (here || rm.fall ? '800 ' : '600 ') + fs + 'px ' + SANS, rm.fall ? '#ffd0d8' : here ? '#ffe9b8' : (rm.online === false ? 'rgba(200,214,232,.45)' : '#c7d2e2'));
        if (rm.fall) text(x, t('fall'), lx, ly + fs + 2, '800 ' + Math.max(7, fs - 2) + 'px ' + MONO, '#ff3d5a');
        else if (rm.in_bed === 1) text(x, IT() ? 'A LETTO' : 'IN BED', lx, ly + fs + 2, '700 ' + Math.max(7, fs - 2) + 'px ' + MONO, '#c4b5fd');
        else if (here && d.rooms.since) text(x, ago(d.rooms.since), lx, ly + fs + 2, '600 ' + Math.max(7, fs - 2) + 'px ' + MONO, '#d3b577');
        if (here) homeDot(x, cx + r * 0.3 * Math.cos(mid), cy + r * 0.3 * Math.sin(mid), Math.max(6, r * 0.11), reduce ? 0 : now, name);
      });
      if (!reduce) sweep(x, cx, cy, r - 2, now, false);
    } else if (o.kind === 'live' || o.kind === 'stale' || o.kind === 'none') {
      phoneRoom(x, cx, cy, r, now, reduce, o, fs, big);
    } else {
      /* nothing to sweep: say plainly why, under HOME's picture */
      if (!reduce) sweep(x, cx, cy, r - 2, now, false, ROOM_S);
      var w = roomWords(o);
      x.save(); x.globalAlpha = 0.6; homeDot(x, cx, cy - r * 0.2, Math.max(6, r * 0.12), 0, name, false, true); x.restore();
      para(x, big && o.kind === 'out' ? t('outHouseShort', { first: first(name) }) : w.h, cx, cy, r, cy + r * 0.3, '700 ' + fs + 'px ' + SANS, fs + 3, '#eef4ff', big ? 4 : 3);
    }
    var ty = cy - r + Math.max(17, r * 0.27), tf = '700 ' + Math.max(7.5, fs - 2) + 'px ' + MONO;
    /* the place is named only when it is not home (a facility HOME is inside) */
    if (!big) text(x, fit(x, t('rooms') + (out && place ? ' · ' + place.toUpperCase() : ''), tf, chord(r - 8, cy, ty - fs / 2) - 8), cx, ty, tf, '#9fd8ff');
    /* the small circle opens Room motion: said at its foot */
    if (!big) { var dy = cy + r * 0.7, df = '700 ' + Math.max(7, fs - 2.5) + 'px ' + MONO; text(x, fit(x, t('details') + ' ›', df, chord(r - 6, cy, dy + fs / 2) - 8), cx, dy, df, 'rgba(255,210,77,.9)'); }
    x.restore();
    rim(x, cx, cy, r);
  }
  function drawMicro(x, cx, cy, r, now, alpha) {
    var d = _data, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* someone called for help: the small circle is the precise spot, the room or the tightest circle the phone gives */
    var hp = null; try { hp = d && d.home && window.CovaraHelp ? CovaraHelp.forPerson(d.home.id) : null; } catch (e) {}
    if (hp) { precision(x, cx, cy, r, now, hp, (d.home && d.home.name) || '', reduce, alpha); return; }
    roomFace(x, cx, cy, r, now, alpha, false);
  }

  /* ── Room motion: the screen behind the room radar ── */
  var rs = null, rsCv = null, rsTr = null, rsRaf = 0, rsSig = '';
  function roomOpen() { return !!(rs && !rs.hidden); }
  var GLASS = 'background:linear-gradient(160deg,rgba(70,130,235,.26) 0%,rgba(22,48,110,.62) 55%,rgba(10,22,62,.9) 100%);-webkit-backdrop-filter:blur(18px) saturate(150%);backdrop-filter:blur(18px) saturate(150%);' +
    'border:1px solid rgba(150,200,255,.5);box-shadow:0 0 0 1px rgba(56,189,248,.12),0 0 30px rgba(70,150,255,.38),inset 0 1px 0 rgba(255,255,255,.16),inset 0 0 26px rgba(110,170,255,.10)';
  var RCSS =
    '#cvRoom{position:fixed;inset:0;z-index:2147470000;display:flex;align-items:flex-end;justify-content:center;background:rgba(4,12,34,.5);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}#cvRoom[hidden]{display:none}' +
    '#cvRoom .sh{width:min(560px,100vw);box-sizing:border-box;max-height:94vh;max-height:94dvh;overflow-y:auto;overscroll-behavior:contain;padding:10px 16px calc(18px + env(safe-area-inset-bottom,0px));border-radius:26px 26px 0 0;color:#e6f1ff;font-family:"Hanken Grotesk",system-ui,sans-serif;' + GLASS + ';border-bottom:0;animation:cvrUp .24s ease-out}' +
    '@keyframes cvrUp{from{transform:translateY(40px);opacity:.4}to{transform:none;opacity:1}}' +
    '#cvRoom .gr{width:44px;height:5px;border-radius:3px;background:rgba(200,225,255,.4);margin:2px auto 8px}' +
    '#cvRoom .hd{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 2px}' +
    '#cvRoom .hd b{font:700 12px "JetBrains Mono",monospace;letter-spacing:.24em;color:#ffd24d;text-transform:uppercase}' +
    '#cvRoom .x{flex:0 0 auto;width:48px;height:48px;border-radius:50%;border:1px solid rgba(150,200,255,.4);background:rgba(20,44,100,.35);color:#dce8ff;font:600 24px/1 system-ui,sans-serif;cursor:pointer}' +
    '#cvRoom .sb{margin:0 2px 6px;font-size:14px;line-height:1.4;color:#b9cdea}' +
    '#cvRoom .rm-radar{position:relative;margin:4px auto 6px;width:min(300px,72vw,46vh);height:min(300px,72vw,46vh);border-radius:50%;box-shadow:0 0 0 1px rgba(255,210,77,.28),0 0 34px rgba(56,189,248,.35)}#cvRoom .rm-radar canvas{position:absolute;inset:0;width:100%;height:100%;display:block}' +
    '#cvRoom .rm-now{text-align:center;margin:4px 4px 12px}#cvRoom .rm-now b{display:block;font:800 22px/1.25 "Hanken Grotesk",system-ui,sans-serif;text-shadow:0 0 18px rgba(255,210,77,.25)}#cvRoom .rm-now small{display:block;margin-top:3px;font:600 14px/1.35 "Hanken Grotesk",system-ui,sans-serif;color:#c9dbf5}' +
    '#cvRoom .card{margin:0 0 10px;padding:10px 12px;border-radius:18px;background:linear-gradient(155deg,rgba(80,140,240,.18),rgba(18,40,96,.42));border:1px solid rgba(150,200,255,.36);box-shadow:0 0 16px rgba(70,150,255,.18),inset 0 1px 0 rgba(255,255,255,.12)}' +
    '#cvRoom .card.gold{border-color:rgba(255,210,77,.55);box-shadow:0 0 18px rgba(255,210,77,.2),inset 0 1px 0 rgba(255,255,255,.12)}' +
    '#cvRoom .row{display:flex;gap:10px;align-items:baseline;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06)}#cvRoom .row:last-child{border-bottom:0}' +
    '#cvRoom .row i{flex:0 0 118px;font:700 10.5px/1.3 "JetBrains Mono",monospace;letter-spacing:.14em;color:#9fd8ff;font-style:normal}' +
    '#cvRoom .row span{flex:1;min-width:0;font:600 15px/1.35 "Hanken Grotesk",system-ui,sans-serif;color:#eef5ff;overflow-wrap:anywhere}#cvRoom .row span small{display:block;font:500 12.5px/1.35 "Hanken Grotesk",system-ui,sans-serif;color:#a9bfdf;margin-top:1px}' +
    '#cvRoom .row span.ok{color:#5eead4}#cvRoom .row span.warn{color:#fbbf24}' +
    '#cvRoom .lbl{font:700 10.5px "JetBrains Mono",monospace;letter-spacing:.16em;color:#ffd24d;margin:0 0 8px}' +
    '#cvRoom .rm-trace{position:relative}#cvRoom .rm-trace canvas{position:relative;inset:auto;width:100%;height:46px;display:block;border-radius:10px}#cvRoom .ax{display:flex;justify-content:space-between;font:600 10.5px "JetBrains Mono",monospace;color:#9fb4e2;margin-top:4px}#cvRoom .key{font:500 12.5px/1.35 "Hanken Grotesk",system-ui,sans-serif;color:#a9bfdf;margin-top:4px}' +
    '#cvRoom ol{margin:0;padding:0 0 0 22px}#cvRoom ol li{font:600 15px/1.4 "Hanken Grotesk",system-ui,sans-serif;color:#eef5ff;margin:0 0 6px}#cvRoom ol li::marker{color:#ffd24d;font-weight:800}' +
    '#cvRoom .note{font:600 14px/1.4 "Hanken Grotesk",system-ui,sans-serif;color:#ffe9a8;margin:0 0 8px}' +
    '#cvRoom p.lim{margin:0;font:500 14px/1.45 "Hanken Grotesk",system-ui,sans-serif;color:#d6e4f8}' +
    '#cvRoom .go{width:100%;min-height:52px;margin:4px 0 8px;border:0;border-radius:16px;color:#2a1600;font:800 17px "Hanken Grotesk",system-ui,sans-serif;background:linear-gradient(180deg,#ffe58a,#ffc531 60%,#d99a00);box-shadow:0 0 20px rgba(255,200,60,.5);cursor:pointer}#cvRoom .go:disabled{opacity:.6}' +
    '#cvRoom .done{width:100%;min-height:52px;margin-top:4px;border-radius:16px;border:1px solid rgba(150,200,255,.5);background:linear-gradient(155deg,rgba(80,140,240,.28),rgba(18,40,96,.5));color:#f2f7ff;font:700 17px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer;box-shadow:0 0 14px rgba(70,150,255,.25)}' +
    '#cvRoom button:focus-visible{outline:2px solid #38bdf8;outline-offset:2px}' +
    '.cvr-entry{border-bottom:1px solid rgba(255,255,255,0.05)}.cvr-entry .cvx-row{width:100%}.cvr-entry .cvr-dot{flex:0 0 auto;width:10px;height:10px;border-radius:50%;margin-right:2px;background:#38bdf8;box-shadow:0 0 10px #38bdf8}.cvr-entry .cvr-dot.live{background:#ffd24d;box-shadow:0 0 10px #ffd24d}.cvr-entry .cvr-dot.off{background:#fbbf24;box-shadow:none;opacity:.7}' +
    '@media (prefers-reduced-motion: reduce){#cvRoom .sh{animation:none}}';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function buildRoom() {
    if (rs) return;
    var st = document.createElement('style'); st.id = 'cvrStyle'; st.textContent = RCSS; document.head.appendChild(st);
    rs = document.createElement('div'); rs.id = 'cvRoom'; rs.hidden = true; rs.setAttribute('role', 'dialog'); rs.setAttribute('aria-modal', 'true');
    /* nothing under the screen reacts to a touch on it */
    ['pointerdown', 'mousedown', 'touchstart', 'click', 'wheel'].forEach(function (ev) { rs.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: ev !== 'click' }); });
    rs.addEventListener('click', function (e) {
      if (e.target === rs) return closeRoom();
      var b = e.target.closest && e.target.closest('[data-a]'); if (!b) return;
      var a = b.getAttribute('data-a');
      if (a === 'close' || a === 'done') closeRoom();
      if (a === 'listen') { b.disabled = true; roomSync(true).then(function () { var sl = rs.querySelector('.slot-how'); if (sl) sl._h = null; paintRoom(); }); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && roomOpen()) closeRoom(); });
    document.body.appendChild(rs);
  }
  function openRoom() {
    buildRoom(); rsSig = ''; rs.hidden = false; paintRoom(); loadRoom(true);
    try { if (!_data) load(true); } catch (e) {}
    var b = rs.querySelector('[data-a=close]'); if (b) try { b.focus({ preventScroll: true }); } catch (e) {}
    if (!rsRaf) { var loop = function (now) { rsRaf = 0; if (!roomOpen()) return; drawRoomCanvas(now); rsRaf = requestAnimationFrame(loop); }; rsRaf = requestAnimationFrame(loop); }
  }
  function closeRoom() { if (rs) rs.hidden = true; }
  setInterval(function () { if (roomOpen()) paintRoom(); }, 1000);
  function paintRoom() {
    if (entryShown()) paintEntry();
    if (!roomOpen()) return;
    var o = roomState(), w = roomWords(o), p = o.p, fn = first(o.name), self = o.self, nst = o.st || {};
    var rows = [];
    /* listening, and whether it is on its charger when the phone says so */
    /* on HOME's own phone in the Android app, the phone itself says whether it listens and is on its charger */
    var running = self && o.native && nst.on && nst.running, yes = o.kind === 'live' || running;
    var chg = running ? !!nst.charging : o.charging;
    var lv = yes ? (chg === true ? t('yesCharger') : chg === false ? t('yesNoCharger') : t('yes')) : p ? t('noSince', { t: clock(p.at) }) : t('noYet');
    rows.push('<div class="row"><i>' + esc(t('rListen')) + '</i><span class="' + (yes ? (chg === false ? 'warn' : 'ok') : 'warn') + '">' + esc(lv) + '</span></div>');
    rows.push('<div class="row"><i>' + esc(t('rSweep')) + '</i><span>' + esc(p ? clock(p.at, true) + ' · ' + agoS(p.at) : t('noneYet')) + '<small>' + esc(t('rEvery')) + '</small></span></div>');
    if (p && p.signals) rows.push('<div class="row"><i>' + esc(t('rHears')) + '</i><span>' + esc(t('signals', { n: p.signals, w: p.wifi || 0, b: p.bt || 0 })) + '</span></div>');
    if (self && o.native) {
      var ph = nst.bluetooth === 'off' ? t('btOff') : nst.permission === 'needed' ? t('permNeed') : nst.error === 'stopped' ? t('stoppedHere') : nst.error === 'key' ? t('keyEnded') : '';
      if (ph) rows.push('<div class="row"><i>' + esc(t('rPhone')) + '</i><span class="warn">' + esc(ph) + '</span></div>');
    }
    /* how to turn it on, whenever the room is not being heard now */
    var how = '';
    var needHow = o.kind === 'none' || o.kind === 'stale' || (self && o.native && !(nst.on && nst.running));
    if (o.kind !== 'noshare' && o.kind !== 'out' && o.kind !== 'loading' && needHow) {
      var steps = [];
      if (self) {
        if (!o.native) how = '<p class="note">' + esc(t('howWeb')) + '</p>';
        else if (running) how = '<p class="note">' + esc(t('startedWait')) + '</p>';
        else {
          if (!roomWanted()) how = '<p class="note">' + esc(t('howShare')) + '</p>';
          steps = [t('how2Self'), t('how3'), t('how4Self')];
        }
      } else steps = [t('how1', { first: fn }), t('how2'), t('how3'), t('how4', { first: fn })];
      how = '<div class="card gold rm-how"><div class="lbl">' + esc(t('howT')) + '</div>' + how +
        (steps.length ? '<ol>' + steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' : '') +
        (self && o.native && !running && roomWanted() ? '<button type="button" class="go" data-a="listen"' + (_rState === 'starting' ? ' disabled' : '') + '>' + esc(_rState === 'starting' ? t('listenStarting') : t('listenBtn')) + '</button>' : '') + '</div>';
    }
    /* the frame is built once, so the sheet keeps its place when it is scrolled; each part is rewritten only when it changes */
    var lang = IT() ? 'it' : 'en';
    if (!rs.firstChild || rs._lang !== lang) {
      rs._lang = lang; rsSig = '';
      rs.innerHTML = '<div class="sh"><div class="gr"></div><div class="hd"><b>' + esc(t('roomTitle')) + '</b><button type="button" class="x" data-a="close" aria-label="' + esc(t('close')) + '">\u00d7</button></div>' +
        '<div class="sb"></div><div class="rm-radar"><canvas></canvas></div><div class="rm-now" aria-live="polite"></div><div class="slot-how"></div>' +
        '<div class="card rm-phone"></div>' +
        '<div class="card rm-trace"><div class="lbl">' + esc(t('trace')) + '</div><canvas></canvas><div class="ax"><span>' + esc(t('twoAgo')) + '</span><span>' + esc(t('nowW')) + '</span></div><div class="key">' + esc(t('traceKey')) + '</div></div>' +
        '<div class="card rm-limits"><div class="lbl">' + esc(t('limitsT')) + '</div><p class="lim"></p></div>' +
        '<button type="button" class="done" data-a="done">' + esc(t('close')) + '</button></div>';
      rsCv = rs.querySelector('.rm-radar canvas'); rsTr = rs.querySelector('.rm-trace canvas');
    }
    var put = function (sel, html) { var el = rs.querySelector(sel); if (el && el._h !== html) { el.innerHTML = html; el._h = html; } return el; };
    put('.sb', esc(self ? t('roomSubSelf') : t('roomSub', { first: fn })));
    put('.rm-now', '<b style="color:' + w.c + '">' + esc(w.h) + '</b>' + (w.s ? '<small>' + esc(w.s) + '</small>' : ''));
    put('.slot-how', how);
    var ph = put('.rm-phone', rows.join('')), trc = rs.querySelector('.rm-trace');
    if (ph) ph.hidden = o.kind === 'noshare'; if (trc) trc.hidden = o.kind === 'noshare';
    put('.lim', esc(self ? t('limitsSelf') : t('limits', { first: fn })));
    drawTrace(o);
  }
  function drawRoomCanvas(now) {
    if (!rsCv || !rsCv.isConnected) return;
    var r = rsCv.getBoundingClientRect(); if (!r.width) return;
    var dp = Math.min(3, window.devicePixelRatio || 1), W = Math.round(r.width * dp);
    if (rsCv.width !== W || rsCv.height !== W) { rsCv.width = W; rsCv.height = W; }
    var x = rsCv.getContext('2d'); x.setTransform(dp, 0, 0, dp, 0, 0); x.clearRect(0, 0, r.width, r.width);
    roomFace(x, r.width / 2, r.width / 2, r.width / 2, now, 1, true);
    if (Math.floor(now / 1000) !== drawRoomCanvas._s) { drawRoomCanvas._s = Math.floor(now / 1000); drawTrace(roomState()); }
  }
  /* the last two hours as a strip: one bar a minute, gold where the room moved, blue where it was quiet, empty where it was not heard */
  function drawTrace(o) {
    if (!rsTr || !rsTr.isConnected) return;
    var r = rsTr.getBoundingClientRect(); if (!r.width) return;
    var dp = Math.min(3, window.devicePixelRatio || 1);
    if (rsTr.width !== Math.round(r.width * dp) || rsTr.height !== Math.round(r.height * dp)) { rsTr.width = Math.round(r.width * dp); rsTr.height = Math.round(r.height * dp); }
    var x = rsTr.getContext('2d'), W = r.width, H = r.height; x.setTransform(dp, 0, 0, dp, 0, 0); x.clearRect(0, 0, W, H);
    x.fillStyle = 'rgba(3,9,28,.55)'; x.fillRect(0, 0, W, H);
    x.strokeStyle = 'rgba(143,180,255,.18)'; x.lineWidth = 1;
    for (var q = 1; q < 4; q++) { x.beginPath(); x.moveTo(W * q / 4, 0); x.lineTo(W * q / 4, H); x.stroke(); }
    var T = 2 * 3600000, now = Date.now(), tr = (o.p && o.p.trace) || [], bw = Math.max(1.2, W / 120 - 0.6);
    tr.forEach(function (pt) {
      var age = now - pt[0]; if (age < 0 || age > T) return;
      var px = W - (age / T) * W, lv = pt[1], h = lv >= 1 ? H * (0.35 + 0.2 * lv) : H * 0.22;
      x.fillStyle = lv >= 2 ? '#ffd24d' : lv === 1 ? 'rgba(211,181,119,.85)' : 'rgba(79,141,240,.6)';
      x.fillRect(px - bw, H - h, bw, h);
    });
    x.fillStyle = '#ffffff'; x.fillRect(W - 2, 0, 2, H);
  }

  /* ── on the care card: Room motion in Safety, beside Night watch ── */
  var _entry = null;
  function entryShown() { return !!(_entry && _entry.isConnected && _entry.getBoundingClientRect().height); }
  function paintEntry() {
    if (!_entry) return;
    var o = roomState(), p = o.p, sub = o.kind === 'live' ? (o.lvl >= 1 ? t('entryLive') : t('entryQuiet', { t: clock(p.moved_at || p.started_at || p.at) })) : o.kind === 'noshare' ? t('noRooms', { first: first(o.name) }) : o.kind === 'loading' ? '' : t('entryOff');
    var s = _entry.querySelector('small'); if (s && s.textContent !== sub) s.textContent = sub;
    var dt = _entry.querySelector('.cvr-dot'); if (dt) dt.className = 'cvr-dot' + (o.kind === 'live' ? (o.lvl >= 1 ? ' live' : '') : ' off');
    var nm = _entry.querySelector('.cvx-nm > span'); if (nm && nm.textContent !== t('entry')) nm.textContent = t('entry');
  }
  setInterval(function () {
    var nw = document.querySelector('#cvTabs.show .cvx-item[data-id=nightw]');
    if (!nw || !on()) return;
    if (nw.parentNode.querySelector('.cvr-entry')) return;
    buildRoom();
    _entry = document.createElement('div'); _entry.className = 'cvr-entry'; _entry.setAttribute('data-id', 'roommotion');
    _entry.innerHTML = '<button type="button" class="cvx-row"><span class="cvr-dot off"></span><span class="cvx-nm"><span>' + esc(t('entry')) + '</span><small></small></span><span class="cvx-chev" aria-hidden="true">›</span></button>';
    _entry.querySelector('button').addEventListener('click', function (e) { e.stopPropagation(); openRoom(); });
    nw.parentNode.insertBefore(_entry, nw.nextSibling);
    loadRoom(true); paintEntry();
  }, 600);

  /* a tap on the room radar opens Room motion */
  function microTap(e) {
    var m = window._dreamMicroHit; if (!m || !shown()) return false;
    var cv = document.getElementById('sphere'); if (!cv) return false;
    var pt = (e.changedTouches && e.changedTouches[0]) || e;
    /* only a touch on the drawing itself: never one on a button or card that happens to lie over it */
    var tg = e.target; if (tg !== cv && !(tg && (tg.id === 'stage' || tg.id === 'sphere'))) return false;
    var rc = cv.getBoundingClientRect(), dx = pt.clientX - rc.left - m.cx, dy = pt.clientY - rc.top - m.cy;
    return dx * dx + dy * dy <= m.r * m.r;
  }
  document.addEventListener('click', function (e) {
    if (roomOpen() || !microTap(e)) return;
    e.stopPropagation(); e.preventDefault();
    openRoom();
  }, true);

  /* Where the two circles go: the radar map beside the dream picture, clear of it, and the room radar under it,
     clear of the buttons at the foot of the screen; beside the map when there is no room under it */
  function layout(ctx, W, H, dr) {
    var R = dr.r * 0.74, minR = Math.max(58, dr.r * 0.58);
    var cxOf = function (R0) { return Math.max(R0 + 10, Math.min(dr.cx - dr.r - R0 - W * 0.03, R0 + W * 0.05)); };
    var cyOf = function (R0) { return dr.cy + (dr.r - R0) * 0.6; };
    while (R > minR && Math.hypot(cxOf(R) - dr.cx, cyOf(R) - dr.cy) < R + dr.r + 6) R -= 1;
    var cx = cxOf(R), cy = cyOf(R);
    /* during a call for help the red ticker runs under the top buttons: the radar sits just below it, whole */
    var cvr = null; try { cvr = ctx.canvas.getBoundingClientRect(); } catch (e) {}
    try {
      var tk = document.body.classList.contains('cv-helping') && document.getElementById('cvHelpTicker');
      if (tk && cvr) { var tb = tk.getBoundingClientRect().bottom - cvr.top + 8; if (cy - R < tb) cy = tb + R; }
    } catch (e) {}
    var floor = H - 6;
    try { var dk = document.getElementById('cvnDock'); if (dk && cvr) { var b = dk.getBoundingClientRect(); if (b.height && b.top - cvr.top > cy) floor = Math.min(floor, b.top - cvr.top - 6); } } catch (e) {}
    /* HOME's phone looking at a member: room for the Drive to button between the two circles */
    var gap = role() === 'home' && _data && _data.member && _data.location ? 48 : 10;
    var r2 = dr.r * 0.5, cx2 = cx, cy2 = cy + R + r2 + gap;
    if (cy2 + r2 > floor) {
      var fitR = (floor - (cy + R + gap)) / 2;
      if (fitR >= 40) { r2 = Math.min(r2, fitR); cy2 = cy + R + r2 + gap; }
      else {
        /* beside the map, on the side away from the dream picture, its foot level with the map's */
        r2 = Math.max(40, Math.min(r2, R * 0.7));
        cx2 = cx + R + r2 + 12; cy2 = Math.min(cy + R - r2, floor - r2);
        if (Math.hypot(cx2 - dr.cx, cy2 - dr.cy) < r2 + dr.r + 6) { cx2 = cx; cy2 = cy - R - r2 - 10; if (cy2 - r2 < 4) return { R: R, cx: cx, cy: cy, r2: 0 }; }
      }
    }
    return { R: R, cx: cx, cy: cy, r2: r2, cx2: cx2, cy2: cy2 };
  }
  /* Called by the canvas each frame while WHEREIS is chosen. The same two circles Sentinel uses. */
  function draw(ctx, W, H, now, dr) {
    if (!dr) { hide(); return; }
    var first0 = !_shownAt || Date.now() - _shownAt > 1000;
    _shownAt = Date.now();
    load(false);
    if (first0 || (!_roomAt && !_roomBusy && Date.now() - _roomErr > 6000)) loadRoom(true);
    var g = layout(ctx, W, H, dr);
    drawMacro(g.cx, g.cy, g.R, now, dr.alpha || 0.5);
    window._dreamWhereHit = { x: g.cx - g.R, y: g.cy - g.R, w: g.R * 2, h: g.R * 2, cx: g.cx, cy: g.cy, r: g.R };
    if (!g.r2) { window._dreamMicroHit = null; return; }
    drawMicro(ctx, g.cx2, g.cy2, g.r2, now, dr.alpha || 0.5);
    window._dreamMicroHit = { x: g.cx2 - g.r2, y: g.cy2 - g.r2, w: g.r2 * 2, h: g.r2 * 2, cx: g.cx2, cy: g.cy2, r: g.r2 };
  }
  function hide() { if (box && !box.hidden) box.hidden = true; if (driveBtn && !driveBtn.hidden) driveBtn.hidden = true; document.body.classList.remove('cvw-on'); }
  /* nothing else draws over the radar while the canvas is not drawing it (a slow frame on a slow phone is not a reason to blink) */
  (function guard() { if (box && !box.hidden && Date.now() - _shownAt > 700) hide(); requestAnimationFrame(guard); })();
  function shown() { return Date.now() - _shownAt < 800; }
  window.addEventListener('localeChanged', function () { rsSig = ''; paintRoom(); });

  window.CovaraWhere = { on: on, draw: draw, hide: hide, shown: shown, load: load, data: function () { return _data; },
    room: function () { return roomState(); }, openRoom: openRoom, closeRoom: closeRoom, roomOpen: roomOpen };
})();
