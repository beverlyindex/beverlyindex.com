/* Remiel: Covara, the calm main screen, the five buttons, the Me sheet and Simple mode.
   - Everyone: the galaxy stands still. The family sit in a fixed ring around the centre; there is no turning,
     no zoom, no arrows, no hint and no row of chips. The bottom row: Me, Care and Camera on the left, the C
     (the Covara Button, the largest) exactly in the middle, then Words (live captions) and Messages. Camera
     just left of the C and Words just right of it, as on the simple screen.
   - Me: Settings, Calm, Share with doctor, Add someone and Sign out. On the family's phone, also the switch
     for the simple screen on HOME's phone, when this person may change it.
   - Simple mode, on HOME's phone (on unless the family turned it off): the logo, Help, the Now strip,
     HOME's own picture with the next thing to do under it, the family's faces, and three round glass buttons
     at the foot: the camera, the C in the centre and live captions (a speaking person). No words on them.
     Calling stays one tap away: a tap on a face on the team opens that person's card with Call.
   Beverly Index LLC */
(function () {
  'use strict';
  var IT = function () { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var S = {
    en: { care: 'Care', camera: 'Camera', words: 'Words', messages: 'Messages', me: 'Me', callFamily: 'Call team', meTitle: 'Me', camAria: 'Camera', wordsAria: 'Live captions',
      settings: 'Settings', settingsSub: 'Language, sound, your name and picture',
      calm: 'Calm', calmSub: 'Larger words, less movement', on: 'On', off: 'Off',
      share: 'Share with doctor', shareSub: 'A private link to what the doctor needs',
      add: 'Add someone', addSub: 'Family, a carer or a doctor',
      signOut: 'Sign out', signOutSub: 'Leave Covara on this phone',
      simpleFor: 'Simple screen for {name}', simpleSub: '{name} sees only the next thing to do, the team, Help, the Camera, the Covara Button and Words. {name} cannot change this.',
      fullTitle: 'Full view on this phone', fullSub: 'Your team chose the simple screen. The full view shows everything Covara has: the day, WHEREIS, the care, every button. You can go back to simple at any time from Me.', fullYes: 'Show the full view', fullNo: 'Keep it simple', fullHint: 'Hold the Covara logo for 2 seconds to show the full view',
      backSimple: 'Simple screen', backSimpleSub: 'Go back to the simple screen your team chose',
      simpleFail: 'Could not change it. Check the internet and try again.', close: 'Close',
      next: 'Next: {what} at {time}', nowDo: 'Now: {what}, {time}', nothing: 'Nothing more today', visit: 'Visit' },
    it: { care: 'Cure', camera: 'Foto', words: 'Parole', messages: 'Messaggi', me: 'Io', callFamily: 'Chiama il team', meTitle: 'Io', camAria: 'Fotocamera', wordsAria: 'Sottotitoli dal vivo',
      settings: 'Impostazioni', settingsSub: 'Lingua, suoni, il tuo nome e la tua foto',
      calm: 'Calma', calmSub: 'Parole più grandi, meno movimento', on: 'Sì', off: 'No',
      share: 'Condividi col medico', shareSub: 'Un link privato con ciò che serve al medico',
      add: 'Aggiungi qualcuno', addSub: 'Famiglia, un assistente o un medico',
      signOut: 'Esci', signOutSub: 'Lascia Covara su questo telefono',
      simpleFor: 'Schermata semplice per {name}', simpleSub: '{name} vede solo la prossima cosa da fare, il team, Aiuto, la Fotocamera, il pulsante Covara e Parole. {name} non può cambiarlo.',
      fullTitle: 'Vista completa su questo telefono', fullSub: 'Il tuo team ha scelto la schermata semplice. La vista completa mostra tutto ciò che Covara ha: la giornata, WHEREIS, le cure, tutti i pulsanti. Puoi tornare alla schermata semplice in qualsiasi momento da Io.', fullYes: 'Mostra la vista completa', fullNo: 'Resta semplice', fullHint: 'Tieni premuto il logo Covara per 2 secondi per la vista completa',
      backSimple: 'Schermata semplice', backSimpleSub: 'Torna alla schermata semplice scelta dal tuo team',
      simpleFail: 'Non è stato possibile cambiarlo. Controlla internet e riprova.', close: 'Chiudi',
      next: 'Dopo: {what} alle {time}', nowDo: 'Ora: {what}, {time}', nothing: 'Niente altro oggi', visit: 'Visita' }
  };
  function t(k, p) { var s = (IT() ? S.it : S.en)[k] || S.en[k] || k; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function authed() { try { return SyncEngine.isAuthenticated() && !SyncEngine.isLocalOnly(); } catch (e) { return false; } }
  async function api(path, o) { var r = await SyncEngine.apiFetch(path, Object.assign({ method: 'GET', headers: {} }, o || {})); return { ok: r.ok, status: r.status, data: await r.json().catch(function () { return {}; }) }; }
  function loc() { return IT() ? 'it-IT' : 'en-US'; }
  function hm(ms) { try { return new Date(ms).toLocaleTimeString(loc(), { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }
  function firstOf(c) { return c ? String(c.first || c.last || '').trim().split(/\s+/)[0] : ''; }

  /* ── the look ── */
  var GLASS = 'background:linear-gradient(155deg,rgba(80,140,240,.20),rgba(18,40,96,.36));-webkit-backdrop-filter:blur(14px) saturate(150%);backdrop-filter:blur(14px) saturate(150%);' +
    'border:1px solid rgba(150,200,255,.42);box-shadow:0 0 16px rgba(70,150,255,.26),inset 0 1px 0 rgba(255,255,255,.14)';
  var css =
    /* 1. the calm main screen, for everyone: no turning, no zoom, no arrows, no hint, no chips, no tagline */
    'body.cvs-on #sphereSize,body.cvs-on .app-logo-tag,body.cvs-on #networkHint,body.cvs-on #cvnTop,body.cvs-on #cvnCircle,body.cvs-on #backBtn,' +
    'body.cvs-on #alertBell,body.cvs-on #settingsBtn,body.cvs-on #exitBtn,body.cvs-on #addPersonFab,body.cvs-on #cvnHudL,body.cvs-on #cvnHudR,' +
    'body.cvs-on #cvnDock .cvn-step,body.cvs-on #cvnDock .cvn-slot{display:none !important}' +
    /* 2. the bottom row: three columns, so the C sits exactly in the middle of the screen whatever is beside it.
       Left: Me, Care, Camera. Right: Words, Messages. On a phone each side shares its half evenly. */
    'body.cvs-on #cvnDock{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;column-gap:12px;bottom:max(14px,env(safe-area-inset-bottom))}' +
    'body.cvs-on #cvnDock[hidden]{display:none}' +
    'body.cvs-on #cvnDock .cvn-talk{grid-column:2;grid-row:1;padding:0 2px}' +
    '.cvs-side{display:flex;align-items:center;gap:12px;min-width:0;grid-row:1}.cvs-side.l{grid-column:1;justify-content:flex-end}.cvs-side.r{grid-column:3;justify-content:flex-start}' +
    'body:not(.cvs-on) .cvs-side{display:none}' +
    'body.cvs-on #cvnDay{bottom:118px !important}' +
    '.cvs-b{flex:0 0 auto;min-width:84px;min-height:60px;padding:8px 10px 7px;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;color:#e6f1ff;-webkit-tap-highlight-color:transparent;' +
      'font:600 13px/1.1 "Hanken Grotesk",system-ui,sans-serif;letter-spacing:.01em;' + GLASS + ';transition:transform .15s,box-shadow .2s}' +
    '.cvs-b span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.cvs-b svg{width:24px;height:24px;stroke:#9fd8ff;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 5px rgba(56,189,248,.55))}' +
    '.cvs-b:active{transform:scale(.96)}.cvs-b:focus-visible{outline:2px solid #C5A55A;outline-offset:2px}' +
    '.cvs-b[data-s=care] svg{stroke:#ffd98a;filter:drop-shadow(0 0 5px rgba(255,210,77,.5))}' +
    '.cvs-b[data-s=me]{order:1}.cvs-b[data-s=care]{order:2}.cvs-b[data-s=camera]{order:3}.cvs-b[data-s=words]{order:1}.cvs-b[data-s=messages]{order:2}.cvs-b[data-s=call]{order:3}' +
    'body.cvs-nowords #cvnDock .cvs-b[data-s=words]{display:none !important}' +
    '.cvs-b[data-s=words] svg{stroke:#7ff0ff}' +
    'body.cvs-on #cvnDock .cvn-orb{width:86px;height:86px;font-size:13px;box-shadow:0 0 0 2px rgba(255,255,255,.24),0 0 0 7px rgba(197,165,90,.22),0 0 26px rgba(255,210,77,.38),0 0 46px rgba(56,189,248,.7)}' +
    '.cvs-b[data-s=call]{display:none}' +
    /* a phone: each side shares its half evenly, so the longer names (Messages, Messaggi) fit whole */
    '@media (max-width:700px){body.cvs-on #cvnDock{width:calc(100vw - 16px);column-gap:6px;bottom:max(10px,env(safe-area-inset-bottom))}' +
      '.cvs-side{gap:4px}.cvs-b{flex:1 1 0;min-width:0;min-height:58px;padding:7px 1px 6px;font-size:10.5px;letter-spacing:0;border-radius:18px;overflow:hidden}.cvs-b svg{width:22px;height:22px}' +
      'body.cvs-on #cvnDock .cvn-talk{flex:0 0 auto}body.cvs-on #cvnDock .cvn-orb{width:74px;height:74px}}' +
    '@media (max-width:380px){body.cvs-on #cvnDock{column-gap:4px}.cvs-side{gap:3px}.cvs-b{padding:7px 0 6px;font-size:9.8px}body.cvs-on #cvnDock .cvn-orb{width:64px;height:64px}}' +
    /* the one line under the centre picture */
    '#cvsLine{position:fixed;left:50%;transform:translateX(-50%);z-index:60;max-width:calc(100vw - 40px);box-sizing:border-box;padding:7px 16px;border-radius:999px;text-align:center;pointer-events:none;' +
      'font:600 15px/1.3 "Hanken Grotesk",system-ui,sans-serif;color:#f2f7ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;' + GLASS + '}' +
    '#cvsLine.due{border-color:rgba(255,210,77,.6);box-shadow:0 0 18px rgba(255,210,77,.35),inset 0 1px 0 rgba(255,255,255,.14);color:#ffe9a8}' +
    'body.cv-simple #cvsLine{font-size:19px;padding:9px 20px}' +
    /* 3. the Me sheet */
    '#cvsMe{position:fixed;inset:0;z-index:99990;display:flex;align-items:flex-end;justify-content:center;background:rgba(4,12,34,.42);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}' +
    '#cvsMe[hidden]{display:none}' +
    '#cvsMe .cvs-sh{width:min(520px,100vw);box-sizing:border-box;max-height:88vh;overflow:auto;padding:10px 16px max(18px,env(safe-area-inset-bottom));border-radius:26px 26px 0 0;' +
      'background:linear-gradient(160deg,rgba(70,130,235,.20) 0%,rgba(22,48,110,.34) 55%,rgba(14,30,78,.46) 100%);-webkit-backdrop-filter:blur(18px) saturate(150%);backdrop-filter:blur(18px) saturate(150%);' +
      'border:1px solid rgba(150,200,255,.42);border-bottom:0;box-shadow:0 0 0 1px rgba(56,189,248,.10),0 -6px 34px rgba(70,150,255,.30),inset 0 1px 0 rgba(255,255,255,.16);color:#e6f1ff;animation:cvsUp .22s ease-out}' +
    '@keyframes cvsUp{from{transform:translateY(40px);opacity:.4}to{transform:none;opacity:1}}' +
    '#cvsMe .cvs-grab{width:44px;height:5px;border-radius:3px;background:rgba(200,225,255,.4);margin:2px auto 10px}' +
    '#cvsMe .cvs-hd{display:flex;align-items:center;justify-content:space-between;margin:0 2px 10px}' +
    '#cvsMe .cvs-hd b{font:700 12px "JetBrains Mono",monospace;letter-spacing:.24em;color:#C5A55A;text-transform:uppercase}' +
    '#cvsMe .cvs-x{min-width:48px;min-height:48px;border-radius:50%;border:1px solid rgba(150,200,255,.35);background:rgba(20,44,100,.3);color:#cfe6ff;font-size:22px;cursor:pointer}' +
    '#cvsMe .cvs-row{width:100%;display:flex;align-items:center;gap:14px;min-height:62px;margin:0 0 9px;padding:10px 14px;box-sizing:border-box;border-radius:18px;cursor:pointer;text-align:left;color:#eef5ff;font:inherit;' + GLASS + '}' +
    '#cvsMe .cvs-row svg{flex:0 0 26px;width:26px;height:26px;stroke:#9fd8ff;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 5px rgba(56,189,248,.5))}' +
    '#cvsMe .cvs-row span{flex:1;min-width:0}#cvsMe .cvs-row b{display:block;font:600 17px/1.25 "Hanken Grotesk",system-ui,sans-serif}' +
    '#cvsMe .cvs-row small{display:block;margin-top:2px;font-size:13px;line-height:1.35;color:#b9cdea}' +
    '#cvsMe .cvs-row i{flex:0 0 auto;font:700 12px "JetBrains Mono",monospace;letter-spacing:.14em;padding:7px 12px;border-radius:999px;border:1px solid rgba(150,200,255,.4);color:#cfe6ff;font-style:normal;text-transform:uppercase}' +
    '#cvsMe .cvs-row i.on{color:#1b1405;background:linear-gradient(180deg,#ffe08a,#C5A55A);border-color:#ffd24d;box-shadow:0 0 14px rgba(255,210,77,.5)}' +
    '#cvsMe .cvs-row.gold{border-color:rgba(255,210,77,.5);box-shadow:0 0 18px rgba(255,210,77,.22),inset 0 1px 0 rgba(255,255,255,.14)}#cvsMe .cvs-row.gold svg{stroke:#ffd98a}' +
    '#cvsMe .cvs-row.out b{color:#ffb4b4}#cvsMe .cvs-row.out svg{stroke:#ff9b9b;filter:none}' +
    '#cvsMe .cvs-err{color:#ffb4b4;font-size:13px;margin:-2px 4px 8px}' +
    /* 4. Simple mode on HOME's phone: the camera, the C in the centre and live captions, three round glass buttons, no words */
    'body.cv-simple #cvnDay,body.cv-simple #cvnDayTip,body.cv-simple #dreamBrief,body.cv-simple .dream-brief,body.cv-simple .dream-comm,body.cv-simple #whereisAnchor,' +
    'body.cv-simple #cvnDock .cvs-b{display:none !important}' +
    'body.cv-simple #cvnDock{column-gap:24px}body.cv-simple .cvs-side{gap:0}' +
    'body.cv-simple #cvnDock .cvs-b[data-s=camera],body.cv-simple #cvnDock .cvs-b[data-s=words]{display:flex !important;flex:0 0 auto;width:78px;height:78px;min-width:0;min-height:0;padding:0;border-radius:50%;' +
      'background:radial-gradient(circle at 32% 24%,rgba(255,255,255,.17) 0,rgba(159,216,255,.07) 34%,rgba(56,189,248,.04) 62%,rgba(10,30,70,.12) 100%);-webkit-backdrop-filter:blur(10px) saturate(150%);backdrop-filter:blur(10px) saturate(150%);' +
      'border:1.5px solid rgba(159,216,255,.55);box-shadow:0 0 0 4px rgba(56,189,248,.07),0 0 22px rgba(56,189,248,.34),inset 0 1px 0 rgba(255,255,255,.3),inset 0 0 16px rgba(56,189,248,.14)}' +
    'body.cv-simple #cvnDock .cvs-b[data-s=camera]{border-color:rgba(255,210,77,.58);box-shadow:0 0 0 4px rgba(255,210,77,.07),0 0 22px rgba(255,210,77,.3),inset 0 1px 0 rgba(255,255,255,.3),inset 0 0 16px rgba(255,210,77,.12)}' +
    'body.cv-simple #cvnDock .cvs-b span{display:none}' +
    'body.cv-simple #cvnDock .cvs-b svg{width:36px;height:36px;stroke-width:1.6;stroke:#eaf6ff;filter:drop-shadow(0 0 6px rgba(56,189,248,.75))}' +
    'body.cv-simple #cvnDock .cvs-b[data-s=camera] svg{stroke:#fff3c4;filter:drop-shadow(0 0 6px rgba(255,210,77,.7))}' +
    'body.cv-simple #cvnDock .cvs-b[data-s=words] svg{stroke:#bff7ff}' +
    'body.cv-simple.cvs-nowords #cvnDock .cvs-b[data-s=words]{display:none !important}' +
    'body.cv-simple #cvnDock .cvn-orb{width:104px !important;height:104px !important;font-size:15px}' +
    '@media (max-width:440px){body.cv-simple #cvnDock{column-gap:18px}body.cv-simple #cvnDock .cvs-b[data-s=camera],body.cv-simple #cvnDock .cvs-b[data-s=words]{width:72px;height:72px}body.cv-simple #cvnDock .cvs-b svg{width:33px;height:33px}body.cv-simple #cvnDock .cvn-orb{width:96px !important;height:96px !important}}';
  var st = document.createElement('style'); st.id = 'cvsStyle'; st.textContent = css; document.head.appendChild(st);

  var ICON = {
    care: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M12 9.5v5M9.5 12h5"/></svg>',
    camera: '<svg viewBox="0 0 24 24"><path d="M3.5 8.5a1.5 1.5 0 0 1 1.5-1.5h2.6l1.6-2.2h5.6L16.4 7H19a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z"/><circle cx="12" cy="12.9" r="3.5"/><path d="M17.3 9.7h.01"/></svg>',
    messages: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/></svg>',
    /* a person speaking: a head in profile, the sound coming from the mouth */
    words: '<svg viewBox="0 0 24 24"><path d="M5.2 21v-3.3C3.4 16.4 2.4 14.3 2.4 11.8 2.4 7.1 5.9 3.6 10.2 3.6c3.6 0 6 2.5 6 5.6l1.5 3.1-1.6.6v1.6c0 1-.8 1.8-1.8 1.8h-2.1V21"/><path d="M19.3 8.4l2.3-1.4M19.9 11.6h2.6M19.3 14.8l2.3 1.4"/></svg>',
    me: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.2-4 4.2-5.8 7.5-5.8s6.3 1.8 7.5 5.8"/></svg>',
    call: '<svg viewBox="0 0 24 24"><path d="M6.5 4h3l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7L16 13l4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4z"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/></svg>',
    calm: '<svg viewBox="0 0 24 24"><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M5 13v7h14v-7"/></svg>',
    add: '<svg viewBox="0 0 24 24"><circle cx="10" cy="8.5" r="3.6"/><path d="M3.5 20c1-3.7 3.6-5.5 6.5-5.5 1.4 0 2.7.4 3.8 1.2M18 13v6M15 16h6"/></svg>',
    out: '<svg viewBox="0 0 24 24"><path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/></svg>',
    simple: '<svg viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="2.5"/><circle cx="12" cy="10" r="2.6"/><path d="M9.5 16.5h5"/></svg>'
  };

  function on() { return !!role() && document.body.classList.contains('cvn-on'); }

  /* ── the bottom row: added to Covara's own dock, so it shows and hides with it, and TALK stays TALK ── */
  var _built = false;
  function buildRow() {
    var dock = document.getElementById('cvnDock'); if (!dock || !dock.querySelector('.cvn-talk')) return false;
    if (dock.querySelector('.cvs-b')) { _built = true; return true; }
    /* two sides around the C (the grid keeps the C in the middle): Me, Care and Camera on the left, Words and Messages on the right */
    var L = document.createElement('div'); L.className = 'cvs-side l';
    var R = document.createElement('div'); R.className = 'cvs-side r';
    dock.appendChild(L); dock.appendChild(R);
    ['care', 'camera', 'words', 'messages', 'me', 'call'].forEach(function (k) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'cvs-b'; b.setAttribute('data-s', k);
      b.innerHTML = ICON[k] + '<span></span>';
      b.addEventListener('click', function (e) { e.stopPropagation(); act(k); });
      (k === 'me' || k === 'care' || k === 'camera' ? L : R).appendChild(b);
    });
    _built = true; words(); return true;
  }
  function words() {
    /* on the simple screen there are no words on the buttons, so the name a screen reader says is the plain one */
    var simple = document.body.classList.contains('cv-simple');
    document.querySelectorAll('#cvnDock .cvs-b').forEach(function (b) {
      var k = b.getAttribute('data-s'); var s = b.querySelector('span'); var w = t(k === 'call' ? 'callFamily' : k);
      if (s.textContent !== w) s.textContent = w;
      var a = simple && k === 'camera' ? t('camAria') : simple && k === 'words' ? t('wordsAria') : w;
      if (b.getAttribute('aria-label') !== a) b.setAttribute('aria-label', a);
    });
    var me = document.getElementById('cvsMe'); if (me && !me.hidden) drawMe();
  }
  function family() {
    if (typeof DEMO_CONTACTS === 'undefined') return [];
    return DEMO_CONTACTS.filter(function (c) { return c.care && c.care.state === 'active'; });
  }
  function act(k) {
    if (k === 'care') { if (window.CovaraPerson && CovaraPerson.openCare) CovaraPerson.openCare(); else if (window.CovaraView) CovaraView.open('med'); }
    else if (k === 'camera') { if (window.CovaraCamera) CovaraCamera.open('auto'); }
    else if (k === 'words') { if (window.CovaraWords && CovaraWords.open) CovaraWords.open(); }
    else if (k === 'messages') openMessages();
    else if (k === 'me') openMe();
    else if (k === 'call') callFamily();
  }
  function openMessages() {
    try {
      if (typeof SentinelMessaging === 'undefined') return;
      var fam = family(), pick = null;
      /* the family member last heard from, else the first */
      try { var best = 0; fam.forEach(function (c) { var d = SentinelMessaging.getTickerData ? SentinelMessaging.getTickerData(c.id) : null; var at = d && (d.lastAt || d.at || d.ts) || 0; if (at > best) { best = at; pick = c; } }); } catch (e) {}
      pick = pick || fam[0] || (DEMO_CONTACTS || [])[0];
      if (pick) SentinelMessaging.openFor(pick.id);
    } catch (e) {}
  }
  function callFamily() {
    var c = family()[0]; if (!c) return;
    try { if (c.phone && typeof runContactQuickAction === 'function') runContactQuickAction('phone', c); else if (typeof startVideoWith === 'function') startVideoWith(c); } catch (e) {}
  }

  /* ── the Me sheet ── */
  var me = document.createElement('div'); me.id = 'cvsMe'; me.hidden = true; me.setAttribute('role', 'dialog'); me.setAttribute('aria-modal', 'true');
  ['pointerdown', 'mousedown', 'touchstart'].forEach(function (ev) { me.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true }); });
  me.addEventListener('click', function (e) { if (e.target === me) closeMe(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !me.hidden) closeMe(); });
  var _fam = { home: '', name: '', on: true, can: false, err: false, busy: false };
  function homeOfFamily() {
    try { var d = window.CovaraView && CovaraView.data(); if (d && d.s && d.s.home) { var hc = family().filter(function (c) { return c.care.userId === d.s.home; })[0]; return { id: d.s.home, name: firstOf(hc) || '' }; } } catch (e) {}
    var h = family().filter(function (c) { return c.care.side === 'home'; })[0];
    return h ? { id: h.care.userId, name: firstOf(h) } : null;
  }
  function row(k, icon, title, sub, pill, cls) {
    return '<button type="button" class="cvs-row' + (cls ? ' ' + cls : '') + '" data-m="' + k + '">' + ICON[icon] + '<span><b>' + esc(title) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span>' +
      (pill != null ? '<i class="' + (pill ? 'on' : '') + '">' + esc(pill ? t('on') : t('off')) + '</i>' : '') + '</button>';
  }
  function drawMe() {
    var calm = document.body.classList.contains('cv-calm');
    var h = '<div class="cvs-sh"><div class="cvs-grab"></div><div class="cvs-hd"><b>' + esc(t('meTitle')) + '</b><button type="button" class="cvs-x" data-m="x" aria-label="' + esc(t('close')) + '">×</button></div>';
    if (role() === 'away' && _fam.home && _fam.can) {
      var nm = _fam.name || (IT() ? 'la persona' : 'them');
      h += row('simple', 'simple', t('simpleFor', { name: nm }), t('simpleSub', { name: nm }), _fam.on, 'gold');
      if (_fam.err) h += '<div class="cvs-err">' + esc(t('simpleFail')) + '</div>';
    }
    if (role() === 'home' && _simple && full()) h += row('backsimple', 'simple', t('backSimple'), t('backSimpleSub'), null, 'gold');
    h += row('settings', 'settings', t('settings'), t('settingsSub')) + row('calm', 'calm', t('calm'), t('calmSub'), calm) +
      row('share', 'share', t('share'), t('shareSub')) + row('add', 'add', t('add'), t('addSub')) + row('out', 'out', t('signOut'), t('signOutSub'), null, 'out') + '</div>';
    me.innerHTML = h;
    me.querySelectorAll('[data-m]').forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); meAct(b.getAttribute('data-m')); }; });
  }
  async function loadFam() {
    var h = homeOfFamily(); if (!h || !h.id || !authed()) { _fam.home = ''; return; }
    _fam.home = h.id; _fam.name = h.name;
    var r = await api('/care/simple?home=' + encodeURIComponent(h.id)).catch(function () { return { ok: false }; });
    if (r.ok) { _fam.on = !!r.data.on; _fam.can = !!r.data.can_change; }
  }
  function openMe() {
    if (!me.parentNode) document.body.appendChild(me);
    _fam.err = false; drawMe(); me.hidden = false;
    if (role() === 'away') loadFam().then(function () { if (!me.hidden) drawMe(); });
  }
  function closeMe() { me.hidden = true; }
  async function meAct(k) {
    if (k === 'x') return closeMe();
    if (k === 'backsimple') { closeMe(); setFull(false); return; }
    if (k === 'settings') { closeMe(); var sb = document.getElementById('settingsBtn'); if (sb) sb.click(); else if (typeof SettingsPanel !== 'undefined') SettingsPanel.open(); return; }
    if (k === 'calm') { if (window.CovaraNav) CovaraNav.calm(!document.body.classList.contains('cv-calm')); drawMe(); return; }
    if (k === 'share') { closeMe(); if (window.CovaraNav) CovaraNav.share(); return; }
    if (k === 'add') { closeMe(); var ab = document.getElementById('addPersonFab'); if (ab) ab.click(); else if (typeof toggleAddModal === 'function') toggleAddModal(); return; }
    if (k === 'out') { closeMe(); var xb = document.getElementById('exitBtn'); if (xb) xb.click(); return; }
    if (k === 'simple' && _fam.home && !_fam.busy) {
      _fam.busy = true; _fam.err = false;
      var want = !_fam.on;
      var r = await api('/care/simple?home=' + encodeURIComponent(_fam.home), { method: 'PUT', body: JSON.stringify({ on: want }) }).catch(function () { return { ok: false }; });
      _fam.busy = false;
      if (r.ok) _fam.on = !!r.data.on; else _fam.err = true;
      if (!me.hidden) drawMe();
    }
  }

  /* ── Simple mode on HOME's phone ── */
  var _simple = true, _simpleAt = 0, _simpleBusy = false;
  async function loadSimple(force) {
    if (role() !== 'home' || _simpleBusy) return;
    if (!force && Date.now() - _simpleAt < 30000) return;
    if (!authed()) return;
    _simpleBusy = true; _simpleAt = Date.now();
    try { var r = await api('/care/simple'); if (r.ok && typeof r.data.on === 'boolean') _simple = r.data.on; } catch (e) { /* stays as it was: on, unless the family turned it off */ }
    _simpleBusy = false;
  }
  /* HOME may show the full view on their own phone (the team's choice stays as it is, and HOME can go back) */
  function full() { try { return localStorage.getItem('rc:fullView') === '1'; } catch (e) { return false; } }
  function setFull(v) { try { if (v) localStorage.setItem('rc:fullView', '1'); else localStorage.removeItem('rc:fullView'); } catch (e) {} tick(); }
  function simpleNow() { return role() === 'home' && _simple && !full(); }
  /* While simple: no status words on the spheres, no Video, Phone, Message, Email beside them, and no big picture */
  var _wrapped = false;
  function wrap() {
    if (_wrapped) return;
    if (typeof window.getContactHeadline === 'function') { var g = window.getContactHeadline; window.getContactHeadline = function (c) { return simpleNow() ? '' : g.apply(this, arguments); }; }
    if (typeof window.drawQuickActionIcons === 'function') { var q = window.drawQuickActionIcons; window.drawQuickActionIcons = function () { if (simpleNow() || window.CovaraPerson) return; return q.apply(this, arguments); }; }
    if (typeof window.CovaraDreamWanted === 'function') { var d = window.CovaraDreamWanted; window.CovaraDreamWanted = function () { return simpleNow() ? false : d.apply(this, arguments); }; }
    _wrapped = true;
  }

  /* ── the one line under the centre: HOME's next thing to do, or, on the family's phone, how HOME is now ── */
  var line = document.createElement('div'); line.id = 'cvsLine'; line.hidden = true; line.setAttribute('aria-live', 'polite');
  function nextTask() {
    var d = null; try { d = window.CovaraView && CovaraView.data(); } catch (e) {}
    var items = (d && d.today && d.today.items) || [], now = Date.now();
    var open = items.filter(function (x) { return x && x.state !== 'done' && x.item; }).sort(function (a, b) { return a.at - b.at; });
    var due = open.filter(function (x) { return x.state === 'due' || x.state === 'late'; })[0];
    var nx = due || open.filter(function (x) { return x.at >= now - 60000; })[0];
    if (!nx) return { text: d ? t('nothing') : '', due: false };
    var what = nx.item.title || (nx.item.kind === 'appt' ? t('visit') : '');
    if (nx.item.kind === 'appt' && nx.item.meta && nx.item.meta.with && what.indexOf(nx.item.meta.with) < 0) what += ' · ' + nx.item.meta.with;
    var when = hm(nx.at), m = /^(\d{1,2}):(\d{2})$/.exec(String(nx.slot || ''));
    if (m && nx.item.kind !== 'appt') { var dt = new Date(); dt.setHours(+m[1], +m[2], 0, 0); when = hm(dt.getTime()); }
    return { text: t(due ? 'nowDo' : 'next', { what: what, time: when }), due: !!due };
  }
  function homeNow() {
    var hl = document.getElementById('cvnHudL'); if (!hl) return '';
    var first = (hl.innerHTML || '').split(/<br\s*\/?>/i)[0];
    var tmp = document.createElement('div'); tmp.innerHTML = first; var tx = (tmp.textContent || '').trim();
    return tx.indexOf(' · ') > 0 ? tx : '';
  }
  function placeLine(show) {
    if (!line.parentNode) document.body.appendChild(line);
    var txt = '', due = false;
    if (show) { if (role() === 'home') { var n = nextTask(); txt = n.text; due = n.due; } else txt = homeNow(); }
    var cv = document.getElementById('sphere');
    if (!show || !txt || !cv || typeof netCenterR !== 'function') { line.hidden = true; return; }
    var r = cv.getBoundingClientRect(), cR = netCenterR(r.width, r.height);
    var top = Math.round(r.top + r.height / 2 + cR * 1.1 + 6 + Math.max(8, Math.round(cR * 0.32)) + 12);
    if (line.textContent !== txt) line.textContent = txt;
    line.classList.toggle('due', due);
    if (line.style.top !== top + 'px') line.style.top = top + 'px';
    line.hidden = false;
  }

  /* ── the still galaxy: the family in a fixed ring around the centre, kept clear of the line under it ── */
  function lockRing() {
    try {
      if (typeof appState !== 'undefined' && appState !== 'network') return;
      if (typeof IsoView !== 'undefined' && IsoView.active && IsoView.active()) return;
      netSpin = false; netYaw = 0; netPitch = 0; netVelYaw = 0; netVelPitch = 0;
      if (typeof NET_DIST_BASE !== 'undefined') { netZoom = 1; NET_DIST = NET_DIST_BASE; }
      var N = NODES.length; if (!N) return;
      var W = CV.width / DPR, H = CV.height / DPR, cR = netCenterR(W, H), s0 = NET_FOV / (NET_FOV + NET_DIST);
      var faceR = (NODES[0].r || 30) * s0;
      var rx = Math.min(1.95 * cR + faceR * 0.4, W / 2 - faceR - 14), ry = Math.min(2.05 * cR + faceR * 0.4, H / 2 - faceR - 110);
      /* an arc over the top, from lower left round to lower right; the bottom stays free for the name and the line */
      var a0 = 150, span = 240;
      for (var i = 0; i < N; i++) {
        var a = (a0 + (i + 0.5) * span / N) * Math.PI / 180;
        var n = NODES[i]; n.tx = Math.cos(a) * rx / s0; n.ty = Math.sin(a) * ry / s0; n.tz = 0;
      }
    } catch (e) {}
  }
  /* a finger moving on the galaxy never turns it: each move starts from where the finger is, so it stays a tap */
  function still(e) {
    if (!on()) return;
    try {
      if (typeof appState !== 'undefined' && appState !== 'network') return;
      var st0 = document.getElementById('stage'); if (!st0 || !st0.contains(e.target)) return;
      if (e.touches && e.touches.length > 1) return;
      var p = e.touches ? e.touches[0] : e; _pressOriginX = p.clientX; _pressOriginY = p.clientY; _pressMaxDist = 0;
    } catch (err) {}
  }
  /* 25 Oct 2026: the galaxy revolves again as in Sentinel; the still ring and the finger lock are gone */

  /* "Where is" on a person's card: the simple screen keeps that person chosen while WHEREIS shows them,
     so their radar stays up; once WHEREIS is turned back to Communication or another face is chosen, it lets go */
  var _keep = null;
  function keep(id) { _keep = id == null ? null : id; }
  function keptForWhere() {
    if (_keep == null) return false;
    var m = 'comm'; try { m = WhereIs.mode(); } catch (e) {}
    if (m === 'whereis' && focusedContactId === _keep) return true;
    _keep = null; return false;
  }

  /* ── keep it all current ── */
  function frame() {
    var o = on();
    document.body.classList.toggle('cvs-on', o);
    if (o) { if (simpleNow()) { try { if (focusedContactId != null && !(window.CovaraPerson && CovaraPerson.isOpen && CovaraPerson.isOpen()) && !keptForWhere()) focusedContactId = null; } catch (e) {} } }
    requestAnimationFrame(frame);
  }
  function tick() {
    if (!role()) { document.body.classList.remove('cv-simple'); line.hidden = true; return; }
    wrap();
    if (!_built) buildRow();
    loadSimple(false);
    var wasSimple = document.body.classList.contains('cv-simple');
    document.body.classList.toggle('cv-simple', on() && simpleNow());
    if (wasSimple !== document.body.classList.contains('cv-simple')) words();
    document.body.classList.toggle('cvs-nocall', !family().length);
    document.body.classList.toggle('cvs-nowords', !(window.CovaraWords && CovaraWords.open));
    var dock = document.getElementById('cvnDock');
    placeLine(on() && dock && !dock.hidden);
  }
  setInterval(tick, 500);
  requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') loadSimple(true); });
  window.addEventListener('localeChanged', words);
  /* hold the Covara logo for 2 seconds on the simple screen: the full view, after a clear yes */
  (function holdLogo() {
    var tm = 0, at = null;
    window.addEventListener('pointerdown', function (e) {
      clearTimeout(tm);
      /* the logo itself may not take touches, so the finger's place is what counts */
      var lg = document.getElementById('appLogo'); if (!lg || !simpleNow()) return;
      var r = lg.getBoundingClientRect(); if (!r.width || e.clientX < r.left - 8 || e.clientX > r.right + 8 || e.clientY < r.top - 8 || e.clientY > r.bottom + 8) return;
      at = { x: e.clientX, y: e.clientY };
      tm = setTimeout(askFull, 2000);
    }, true);
    window.addEventListener('pointermove', function (e) { if (at && Math.abs(e.clientX - at.x) + Math.abs(e.clientY - at.y) > 24) { clearTimeout(tm); at = null; } }, true);
    ['pointerup', 'pointercancel'].forEach(function (ev) { window.addEventListener(ev, function () { clearTimeout(tm); at = null; }, true); });
  })();
  function askFull() {
    var el = document.getElementById('cvsFull');
    if (!el) { el = document.createElement('div'); el.id = 'cvsFull'; el.className = 'cv-ov'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); document.body.appendChild(el); }
    var box = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(440px,calc(100vw - 32px));box-sizing:border-box;z-index:99995;padding:20px 18px 18px;border-radius:24px;color:#eef3fb;font-family:var(--nous-font,"Hanken Grotesk",sans-serif);background:linear-gradient(160deg,rgba(70,130,235,.30),rgba(10,22,60,.92));-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);border:1px solid rgba(255,210,77,.6);box-shadow:0 0 34px rgba(255,210,77,.22),0 24px 60px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.16)';
    el.innerHTML = '<div style=\'' + box + '\'><div style="font:700 11px var(--nous-mono,monospace);letter-spacing:.2em;color:#ffd24d;text-transform:uppercase;margin-bottom:6px">Covara</div><div style="font-size:24px;font-weight:800;line-height:1.2">' + esc(t('fullTitle')) + '</div>' +
      '<p style="margin:10px 0 16px;font-size:16px;line-height:1.45;color:#dbe7ff">' + esc(t('fullSub')) + '</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" data-f="yes" style="min-height:52px;flex:1;padding:0 16px;border-radius:26px;font:800 15px var(--nous-font,\'Hanken Grotesk\',sans-serif);white-space:nowrap;cursor:pointer;border:0;color:#2a1600;background:radial-gradient(circle at 35% 30%,#ffe58a,#ffc531 60%,#d99a00);box-shadow:0 0 18px rgba(255,200,60,.45)">' + esc(t('fullYes')) + '</button>' +
      '<button type="button" data-f="no" style="min-height:52px;flex:1;padding:0 16px;border-radius:26px;font:800 15px var(--nous-font,\'Hanken Grotesk\',sans-serif);white-space:nowrap;cursor:pointer;border:1px solid rgba(150,200,255,.5);color:#eef5ff;background:linear-gradient(155deg,rgba(80,140,240,.28),rgba(18,40,96,.5))">' + esc(t('fullNo')) + '</button></div></div>';
    el.classList.add('open'); el.style.cssText = 'position:fixed;inset:0;z-index:99994;background:rgba(3,8,24,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)';
    el.querySelector('[data-f=yes]').onclick = function () { el.classList.remove('open'); el.remove(); setFull(true); };
    el.querySelector('[data-f=no]').onclick = function () { el.classList.remove('open'); el.remove(); };
  }

  window.CovaraSimple = { full: full, setFull: setFull, on: function () { return simpleNow(); }, refresh: function () { return loadSimple(true); }, openMe: openMe, closeMe: closeMe, act: act, keep: keep };
})();
