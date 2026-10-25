/* Remiel: Covara, the main screen (25 Oct 2026).
   Direction, word for word: "let's begin by eliminating all of the buttons on the screen and building out
   the HOME sphere first. Start with using - and NOT recreating - precisely the center sphere of Sentinel."
   This module only takes things away. The centre sphere, its glow, its pulsing ring and the revolving
   galaxy are Sentinel's own drawing (drawNetworkView in index.html), not a copy. */
(function () {
  'use strict';
  var css = document.createElement('style');
  css.textContent =
    /* every button and strip that sat on the main screen */
    'body.cv-main #helpFab, body.cv-main #cvnDock, body.cv-main #cvsLine, body.cv-main #cvnDay,' +
    'body.cv-main #cvTeamBar, body.cv-main #whereisAnchor, body.cv-main #networkHint,' +
    'body.cv-main #alertClearAll, body.cv-main #cvNow, body.cv-main .cvs-tour, body.cv-main #cvgCap, body.cv-main #dailyDigest' +
    '{ display: none !important; }';
  document.head.appendChild(css);

  /* The user's name in full, in capitals, across from the logo (25 Oct 2026).
     "Place Randolph R Beverly Jr there for now so we have something to work with." */
  var NAME_FOR_NOW = 'Randolph R Beverly Jr';
  var nameCss = document.createElement('style');
  nameCss.textContent = '#cvName{position:fixed;top:max(10px,env(safe-area-inset-top,0px));right:max(16px,env(safe-area-inset-right,0px));height:44px;max-width:60vw;display:flex;align-items:center;justify-content:flex-end;z-index:190;' +
    'font:700 13px/1.2 "Hanken Grotesk",system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;text-align:right;color:#e6f3ff;text-shadow:0 0 10px rgba(56,189,248,.55),0 1px 6px rgba(0,10,30,.9);pointer-events:none;animation:cvNameGlow 4s ease-in-out infinite}' +
    '@keyframes cvNameGlow{0%,100%{opacity:.92}50%{opacity:1}}body:not(.cv-main) #cvName{display:none}';
  document.head.appendChild(nameCss);
  function placeName() {
    var el = document.getElementById('cvName');
    if (!el) { el = document.createElement('div'); el.id = 'cvName'; el.setAttribute('aria-label', 'Signed in as'); document.body.appendChild(el); }
    if (el.textContent !== NAME_FOR_NOW.toUpperCase()) el.textContent = NAME_FOR_NOW.toUpperCase();
  }

  function mainState() {
    try { if (typeof appState !== 'undefined' && appState !== 'network') return false; } catch (e) {}
    return true;
  }
  /* No dream circle and no WHEREIS radar until a sphere is chosen, as in Sentinel:
     the large empty dark circle on the team's screen came from these two. */
  function quiet() {
    var noFocus = true; try { noFocus = focusedContactId == null; } catch (e) {}
    try { if (window.CovaraRing && CovaraRing.where()) return false; } catch (e) {}
    return noFocus;
  }
  function wrap() {
    if (typeof window.CovaraDreamWanted === 'function' && !window.CovaraDreamWanted._main) {
      var d = window.CovaraDreamWanted;
      window.CovaraDreamWanted = function () { return quiet() ? false : d.apply(this, arguments); };
      window.CovaraDreamWanted._main = 1;
    }
    if (window.CovaraWhere && typeof CovaraWhere.on === 'function' && !CovaraWhere.on._main) {
      var w = CovaraWhere.on;
      CovaraWhere.on = function () {
        if (quiet()) return false;
        /* a chosen teammate: WHEREIS is about that person (Sentinel's own WHEREIS), not HOME */
        try { if (focusedContactId != null) { var hc = window.CovaraView && CovaraView.centre && CovaraView.centre(); if (!hc || String(hc.contact.id) !== String(focusedContactId)) return false; } } catch (e) {}
        return w.apply(this, arguments);
      };
      CovaraWhere.on._main = 1;
    }
  }
  /* The galaxy keeps revolving while nothing is chosen: the screen is alive. */
  function alive() {
    try {
      if (!mainState()) return;
      if (window.CovaraRing && (CovaraRing.isOpen() || CovaraRing.where())) return;
      if (quiet() && typeof netSpin !== 'undefined' && !window.CovaraCalm) netSpin = true;
    } catch (e) {}
  }
  /* Nothing pops up over the main screen on its own (25 Oct 2026): Sentinel's "Good morning ... Check in now"
     summary card and Sentinel's tips ("Drag to turn your network", "Pinch with two fingers") stay off. */
  function quietCards() {
    try { if (typeof window.openBluf === 'function' && !window.openBluf._main) { var ob = window.openBluf; window.openBluf = function () { if (document.body.classList.contains('cv-main')) return; return ob.apply(this, arguments); }; window.openBluf._main = 1; } } catch (e) {}
    try {
      if (typeof SentinelGuide !== 'undefined' && !SentinelGuide._main) {
        /* every Sentinel tip, including the ones a tap on a sphere brings up */
        Object.keys(SentinelGuide).forEach(function (k) { if (typeof SentinelGuide[k] === 'function' && /^(show|on)/.test(k)) SentinelGuide[k] = function () {}; });
        SentinelGuide._main = 1;
        try { SentinelGuide.hideAll(); } catch (e) {}
      }
    } catch (e) {}
    try { var bo = document.getElementById('blufOverlay'); if (bo && bo.classList.contains('open') && typeof closeBluf === 'function') closeBluf(); } catch (e) {}
  }
  /* The main screen is the galaxy: Covara never rests on Sentinel's single-sphere "self" screen,
     which showed HOME's sphere zoomed up close on every reopen. */
  function toGalaxy() {
    try {
      if (typeof appState === 'undefined' || appState !== 'self') return;
      if (typeof appRevealed !== 'undefined' && !appRevealed) return;
      var ob = document.getElementById('onboarding'); if (ob && ob.offsetParent && getComputedStyle(ob).display !== 'none' && !ob.classList.contains('hidden')) return;
      var done = false; try { done = localStorage.getItem('rc:obDone') === '1' || localStorage.getItem('rm:obDone') === '1'; } catch (e) {}
      if (!done) return;
      if (typeof overlayOpen !== 'undefined' && overlayOpen) return;
      enterNetwork();
    } catch (e) {}
  }
  /* The revolving spheres (25 Oct 2026): "slightly smaller and more transparent - the same as what we see for the
     spheres on Sentinel", closer to HOME, the team outside HOME's own things so every person can be tapped. */
  var TEAM_ORBIT = 0.86, ITEM_ORBIT = 0.66, SIZE = 0.78, ALPHA = 0.55;
  function isPerson(c) { return !(c && c.cvItem && c.cvItem.kind !== 'person'); }
  window.CovaraOrbit = function (n) {
    if (!n || n._cvOrbit) return;
    var k = isPerson(n.contact) ? TEAM_ORBIT : ITEM_ORBIT;
    n.tx *= k; n.ty *= k; n.tz *= k; n.x *= k; n.y *= k; n.z *= k; n._cvOrbit = 1;
  };
  window.CovaraGlassOrbs = true;
  window.CovaraSphereAlpha = function (n) { return isPerson(n && n.contact) ? ALPHA : ALPHA * 0.9; };
  var _sized = false;
  function sizeOnce() {
    if (_sized) return;
    try { if (typeof SphereSize === 'undefined' || typeof NODES === 'undefined' || !NODES.length) return; } catch (e) { return; }
    _sized = true;
    /* unless this person has set a size with the slider */
    try { RemielDB.getSetting('sphereSize').then(function (v) { if (!v) SphereSize.apply(SIZE); }).catch(function () { SphereSize.apply(SIZE); }); } catch (e) {}
  }
  /* a chosen sphere holds still (25 Oct 2026: "screens will be static and hold") */
  function holdFocus() { try { if (focusedContactId != null && typeof netSpin !== 'undefined') netSpin = false; } catch (e) {} }
  function tick() { document.body.classList.add('cv-main'); sizeOnce(); holdFocus(); placeName(); quietCards(); toGalaxy(); wrap(); alive(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tick); else tick();
  setInterval(tick, 500);
  window.CovaraMain = { quiet: quiet };
})();
