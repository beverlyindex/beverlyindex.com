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
    'body.cv-main #alertClearAll, body.cv-main #cvNow, body.cv-main .cvs-tour, body.cv-main #cvgCap' +
    '{ display: none !important; }';
  document.head.appendChild(css);

  function mainState() {
    try { if (typeof appState !== 'undefined' && appState !== 'network') return false; } catch (e) {}
    return true;
  }
  /* No dream circle and no WHEREIS radar until a sphere is chosen, as in Sentinel:
     the large empty dark circle on the team's screen came from these two. */
  function quiet() {
    var noFocus = true; try { noFocus = focusedContactId == null; } catch (e) {}
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
      CovaraWhere.on = function () { return quiet() ? false : w.apply(this, arguments); };
      CovaraWhere.on._main = 1;
    }
  }
  /* The galaxy keeps revolving while nothing is chosen: the screen is alive. */
  function alive() {
    try {
      if (!mainState()) return;
      if (quiet() && typeof netSpin !== 'undefined' && !window.CovaraCalm) netSpin = true;
    } catch (e) {}
  }
  function tick() { document.body.classList.add('cv-main'); wrap(); alive(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tick); else tick();
  setInterval(tick, 500);
  window.CovaraMain = { quiet: quiet };
})();
