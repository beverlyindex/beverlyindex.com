/* Remiel: Covara, glass cards.
   Every card, panel, sheet and chip in Covara is a pane of blue glass with a soft glowing frame,
   not a dark slab: the picture and the galaxy show through, blurred, and the words stay crisp.
   One look for the whole product, set here, loaded after everything else so it wins.
   Beverly Index LLC */
(function () {
  'use strict';

  /* the glass: a light blue tint over a strong blur, a thin bright frame, and an outer glow */
  var GLASS = 'background:linear-gradient(155deg,rgba(70,130,235,.17) 0%,rgba(22,48,110,.24) 55%,rgba(14,30,78,.30) 100%) !important;' +
    '-webkit-backdrop-filter:blur(16px) saturate(150%) !important;backdrop-filter:blur(16px) saturate(150%) !important;' +
    'border:1px solid rgba(150,200,255,.42) !important;' +
    'box-shadow:0 0 0 1px rgba(56,189,248,.10),0 0 22px rgba(70,150,255,.28),0 10px 30px rgba(2,8,30,.28),inset 0 1px 0 rgba(255,255,255,.14),inset 0 0 22px rgba(110,170,255,.10) !important;' +
    'text-shadow:0 1px 2px rgba(2,8,24,.55)';
  /* buttons, chips and fields: the same glass, a little firmer so they read as things to tap or type in */
  var CHIP = 'background:linear-gradient(155deg,rgba(80,140,240,.20),rgba(18,40,96,.34)) !important;' +
    '-webkit-backdrop-filter:blur(12px) saturate(150%) !important;backdrop-filter:blur(12px) saturate(150%) !important;' +
    'border-color:rgba(150,200,255,.45) !important;' +
    'box-shadow:0 0 14px rgba(70,150,255,.24),inset 0 1px 0 rgba(255,255,255,.14) !important';
  var FIELD = 'background:rgba(20,44,100,.30) !important;border-color:rgba(150,200,255,.40) !important;box-shadow:inset 0 0 10px rgba(110,170,255,.10) !important';
  /* what dims the screen behind a card: lighter, and blurred, so the card stays the brightest thing */
  var DIM = 'background:rgba(4,12,34,.42) !important;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)';

  var CARDS = [
    /* Covara's own */
    '.dream-comm', '.dream-brief', '#cvnDayTip', '#cvTalkBubble', '#cvCam .card', '.cvn-box', '.daily-digest',
    '.cv-sheet', '.cv-panel', '.cv-pop', '.cv-toast', '.cvs-card', '.cv-card',
    /* the person's card and everything that opens from the galaxy */
    '.bluf-card', '.overlay-panel', '.sentinel-guide', '.st-card', '.intel-box', '.ios-hint', '.contacts-popup',
    '.quick-dial-box', '.contact-modal', '.sc-safety-pop', '.roster-done-banner', '.sv-panel', '.sv-editor-card',
    '.sv-empty', '.sentinel-msg-panel', '.magnet-prompt', '.ui-confirm-box', '.wx-sheet', '.clv-panel', '.br-sheet',
    '.help-card', '.team-menu', '.team-card', '.wx-chip', '.bev-tile'
  ];
  var CHIPS = ['.cvn-chip', '.cvn-step', '.cvn-btn:not(.pri)', '.cv-btn:not(.pri)', '.cv-pad button', '.cv-code span', '#cvCam .ask button',
    '.iso-btn', '.iso-x', '.lib-pill', '.sv-badge', '.bluf-pull', '.dream-brief .db-wx',
    '.dd-bluf', '.dd-streak', '.dd-alert-item', '.dd-med-item', '.cvs-tiles span'];
  var FIELDS = ['.cvt-f textarea', '.cvt-f input[type=text]', '.cvt-f input[type=email]', '.cvt-f input[type=tel]', '.cvt-f input[type=number]',
    '.cvt-f input[type=date]', '.cvt-f input[type=time]', '.cvt-f select', '.intel-box textarea'];
  var DIMS = ['.bluf-overlay', '.overlay', '.contact-modal-overlay', '.sync-prompt-overlay', '.roster-modal-overlay', '.sv-overlay',
    '.sentinel-msg-overlay', '.ui-confirm-overlay', '.clv-overlay', '.intel-modal', '.cvn-sheet'];

  var css = CARDS.join(',') + '{' + GLASS + '}' +
    CHIPS.join(',') + '{' + CHIP + '}' +
    FIELDS.join(',') + '{' + FIELD + '}' +
    DIMS.join(',') + '{' + DIM + '}' +
    /* the Camera, Where and Circle cards are cards on a wide screen; on a phone they are bare orbs and stay so */
    '@media (min-width:701px){.cvn-slot,.cvn-who{' + GLASS + '}}' +
    /* the brief's own darkness setting is turned down too, for its layered background */
    '.dream-brief{--db-bg:0.22 !important}' +
    /* the person's card keeps its panels light inside the glass */
    '.bluf-card{--nous-bg:rgba(20,44,100,.16);--nous-panel:rgba(30,60,130,.18);--nous-panel2:rgba(40,80,160,.14);--nous-line:rgba(150,200,255,.28)}' +
    /* the sheets that fill the screen keep their deep blue, now with the galaxy faintly through it */
    '.cv-ov{background:radial-gradient(120% 90% at 50% 40%,rgba(8,32,60,.86) 0,rgba(6,10,20,.88) 55%,rgba(5,7,12,.9) 100%) !important;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}' +
    /* the schedule's tooltip keeps its gold frame */
    '#cvnDayTip{border-color:rgba(197,165,90,.65) !important;box-shadow:0 0 18px rgba(197,165,90,.28),0 0 22px rgba(70,150,255,.18),inset 0 1px 0 rgba(255,255,255,.14) !important}';

  function put() {
    var el = document.getElementById('covaraGlass');
    if (!el) { el = document.createElement('style'); el.id = 'covaraGlass'; }
    el.textContent = css;
    /* always the last style on the page, so later modules' own styles do not cover it */
    if (el.parentNode !== document.head || document.head.lastElementChild !== el) document.head.appendChild(el);
  }
  put();
  if (document.readyState !== 'complete') window.addEventListener('load', put);
  /* modules add their styles as they start; keep the glass last for the first seconds */
  var n = 0, iv = setInterval(function () { put(); if (++n > 10) clearInterval(iv); }, 1000);
  window.CovaraGlass = { css: function () { return css; } };
})();
