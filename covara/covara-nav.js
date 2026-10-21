/* Remiel: Covara, how people move through it.
   Studied from God's Eye View (one bottom dock, a contact stepper, a timeline, reset to home)
   and rebuilt for a family in a hurry and a person with memory loss: large targets, plain words,
   the camera and the voice always one tap away.
   - Top: HOME · EVERYTHING NOW · CALM · SHARE WITH DOCTOR
   - Corners: who and where, and the live state of HOME's phone, readable without opening anything
   - Bottom: HOME's day as a timeline to replay; the circle, one person at a time; CAMERA · TALK · WHERE
   Beverly Index LLC */
(function () {
  'use strict';
  var S = {
    en: { home: 'HOME', now: 'EVERYTHING NOW', calm: 'CALM', share: 'SHARE WITH DOCTOR', shareShort: 'SHARE', nowShort: 'NOW',
      camera: 'CAMERA', cameraHint: 'Point at a bottle, a meal, a letter or a door', talk: 'TALK', talkHint: '“Did Dad take his 8 o’clock?”', where: 'WHERE',
      circle: 'CIRCLE', of: '{i} of {n}', people: '{n} people', atHome: 'at home', out: 'out', since: 'since {t}', mood: 'Mood', live: 'Live', updated: 'Updated {t}', phone: 'Phone', charging: 'charging', moved: 'Last moved', ago: '{t} ago', justNow: 'just now',
      calm_good: 'good', calm_okay: 'okay', calm_low: 'low', kitchen: 'Kitchen',
      nowTitle: 'Everything now', nowAlerts: 'Alerts, last day', nowWhere: 'Where', nowMeds: 'Medicines', nowNext: 'Coming up', nowHealth: 'Health', nowWith: 'With', nowNone: 'Nothing waiting.', nowBack: 'Back to where I was',
      nowLate: '{n} late', nowDue: '{n} due now', nowAllDone: 'All taken so far today', nowOut: 'Out, {d} from home', nowHome: 'At home', nowNoPos: 'No position yet',
      shareTitle: 'Share with a doctor', shareWhy: 'A link that opens {name}’s emergency sheet, medicines and today, without signing in. It ends by itself.', for2: '2 hours', for24: '1 day', for72: '3 days',
      shareMake: 'Make the link', copy: 'Copy', sendIt: 'Send', copied: 'Copied', shareActive: 'Links open now', end: 'End', opened: 'opened {n}×', notOpened: 'not opened yet', ends: 'ends {t}', close: 'Close',
      dayTitle: '{name}’s day', dayNothing: 'Nothing at this time', dayDrag: 'Drag along the day to see what happened',
      ev_taken: 'Taken', ev_late: 'Late', ev_due: 'Due', ev_later: 'Later', ev_visit: 'Visit', ev_log: 'Noted', sched: 'SCHEDULE', ev_shift: 'On duty', ev_appt: 'Appointment', schedNone: 'Nothing scheduled today' },
    it: { home: 'CASA', now: 'TUTTO ORA', calm: 'CALMA', share: 'CONDIVIDI COL MEDICO', shareShort: 'CONDIVIDI', nowShort: 'ORA',
      camera: 'FOTOCAMERA', cameraHint: 'Inquadra un flacone, un pasto, una lettera o una porta', talk: 'PARLA', talkHint: '“Papà ha preso la medicina delle 8?”', where: 'DOVE',
      circle: 'CERCHIA', of: '{i} di {n}', people: '{n} persone', atHome: 'a casa', out: 'fuori', since: 'dalle {t}', mood: 'Umore', live: 'In diretta', updated: 'Aggiornato alle {t}', phone: 'Telefono', charging: 'in carica', moved: 'Ultimo movimento', ago: '{t} fa', justNow: 'adesso',
      calm_good: 'bene', calm_okay: 'così così', calm_low: 'giù', kitchen: 'Cucina',
      nowTitle: 'Tutto ora', nowAlerts: 'Avvisi, ultimo giorno', nowWhere: 'Dove', nowMeds: 'Medicine', nowNext: 'In arrivo', nowHealth: 'Salute', nowWith: 'Con', nowNone: 'Niente in attesa.', nowBack: 'Torna dove ero',
      nowLate: '{n} in ritardo', nowDue: '{n} da prendere ora', nowAllDone: 'Tutte prese finora oggi', nowOut: 'Fuori, a {d} da casa', nowHome: 'A casa', nowNoPos: 'Nessuna posizione',
      shareTitle: 'Condividi con un medico', shareWhy: 'Un link che apre la scheda di emergenza, le medicine e la giornata di {name}, senza accesso. Scade da solo.', for2: '2 ore', for24: '1 giorno', for72: '3 giorni',
      shareMake: 'Crea il link', copy: 'Copia', sendIt: 'Invia', copied: 'Copiato', shareActive: 'Link aperti ora', end: 'Termina', opened: 'aperto {n}×', notOpened: 'non ancora aperto', ends: 'scade {t}', close: 'Chiudi',
      dayTitle: 'La giornata di {name}', dayNothing: 'Niente a quest’ora', dayDrag: 'Scorri lungo la giornata per vedere cosa è successo',
      ev_taken: 'Presa', ev_late: 'In ritardo', ev_due: 'Da prendere', ev_later: 'Più tardi', ev_visit: 'Visita', ev_log: 'Annotato', sched: 'PROGRAMMA', ev_shift: 'Di turno', ev_appt: 'Appuntamento', schedNone: 'Niente in programma oggi' }
  };
  function IT() { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } }
  function t(k, p) { var s = (IT() ? S.it : S.en)[k] || S.en[k] || k; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function authed() { try { return SyncEngine.isAuthenticated() && !SyncEngine.isLocalOnly(); } catch (e) { return false; } }
  function base() { try { return SyncEngine.getStatus().apiBase || ''; } catch (e) { return ''; } }
  function url(p) { return p ? (/^https?:/.test(p) ? p : base() + p) : ''; }
  async function api(path, opts) {
    var o = Object.assign({ method: 'GET' }, opts || {});
    if (o.body && typeof o.body !== 'string' && !(o.body instanceof FormData)) o.body = JSON.stringify(o.body);
    var r = await SyncEngine.apiFetch(path, o); var j = await r.json().catch(function () { return {}; });
    return { ok: r.ok, status: r.status, data: j };
  }
  function homeContact() { if (typeof DEMO_CONTACTS === 'undefined') return null; return DEMO_CONTACTS.filter(function (c) { return c.care && c.care.side === 'home' && c.care.state === 'active'; })[0] || null; }
  function on() { var r = role(); return r === 'home' || (r === 'away' && !!homeContact()); }
  function homeQ() { var h = homeContact(); return role() === 'away' && h ? '?home=' + encodeURIComponent(h.care.userId) : ''; }
  function homeBody() { var h = homeContact(); return role() === 'away' && h ? { home: h.care.userId } : {}; }
  function homeName() {
    if (role() === 'away') { var h = homeContact(); return h ? ((h.first || '') + ' ' + (h.last || '')).trim() : ''; }
    try { return String(userSphereName || ''); } catch (e) { return ''; }
  }
  function first() { return homeName().split(/\s+/)[0] || ''; }
  function loc() { return IT() ? 'it' : 'en-US'; }
  function hm(ms) { try { return new Date(ms).toLocaleTimeString(loc(), { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }
  function ago(ms) { if (!ms) return ''; var s = (Date.now() - ms) / 1000; if (s < 60) return t('justNow'); var v = s < 3600 ? Math.round(s / 60) + ' min' : s < 86400 ? Math.round(s / 3600) + ' h' : Math.round(s / 86400) + (IT() ? ' g' : ' d'); return t('ago', { t: v }); }
  function dist(m) { if (m == null) return ''; if (!IT()) { var ft = m * 3.281; return ft < 1000 ? Math.round(ft / 10) * 10 + ' ft' : (m / 1609.34).toFixed(1) + ' mi'; } return m < 1000 ? Math.round(m) + ' m' : (m / 1000).toFixed(1) + ' km'; }
  function cv() { return window.CovaraView && CovaraView.data && CovaraView.data(); }
  function wh() { return window.CovaraWhere && CovaraWhere.data && CovaraWhere.data(); }

  /* ── the look: NOUS glass, gold rules, Hanken Grotesk and JetBrains Mono ── */
  var css = '' +
    'body.cvn-on #teamFab,body.cvn-on .clv-toggle,body.cvn-on #pulseBtn,body.cvn-on #isoBtn,body.cvn-on #importContactsFab{display:none !important}' +
    '.cvn{font-family:var(--nous-font,"Hanken Grotesk",system-ui,sans-serif);color:#e8ecf4}' +
    '#cvnBezel{position:fixed;inset:10px;border:1px solid rgba(143,180,255,.22);border-radius:26px;pointer-events:none;z-index:3;box-shadow:inset 0 0 70px rgba(0,0,0,.55)}' +
    '.cvn-hud{position:fixed;z-index:6400;pointer-events:none;font:600 10.5px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.14em;text-transform:uppercase;line-height:1.7;color:#9fd8ff;text-shadow:0 1px 6px rgba(0,0,0,.9);transition:opacity .3s}' +
    '.cvn-hud b{color:#fff;font-weight:700}.cvn-hud i{font-style:normal;color:#C5A55A}.cvn-hud .warn{color:#ffd24d}.cvn-hud .bad{color:#fca5a5}.cvn-hud.off{opacity:0}' +
    '#cvnTop{position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:7100;display:flex;gap:8px}' +
    '.cvn-chip{min-height:34px;padding:0 14px;border-radius:17px;border:1px solid rgba(56,189,248,.35);background:rgba(10,14,24,.82);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#d8e8ff;font:700 10.5px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.16em;cursor:pointer;white-space:nowrap}' +
    '.cvn-chip[aria-pressed="true"]{background:rgba(56,189,248,.25);border-color:#38bdf8;color:#fff;box-shadow:0 0 16px rgba(56,189,248,.35)}' +
    '.cvn-chip:focus-visible,.cvn-slot:focus-visible,.cvn-orb:focus-visible,.cvn-step:focus-visible{outline:2px solid #C5A55A;outline-offset:2px}' +
    '#cvnDock{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:7100;display:flex;align-items:flex-end;gap:16px}' +
    '.cvn-slot{display:flex;align-items:center;gap:10px;min-width:190px;max-width:250px;text-align:left;padding:10px 14px;border-radius:18px;border:1px solid rgba(56,189,248,.35);background:rgba(10,14,24,.84);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:inherit;font:inherit;cursor:pointer;box-shadow:0 0 22px rgba(56,189,248,.12)}' +
    '.cvn-slot b{display:block;font:700 10px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.2em;color:#9fd8ff;margin-bottom:3px}.cvn-slot span{font-size:13px;line-height:1.3;color:#dbe7ff}' +
    '.cvn-lens{flex:0 0 auto;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 50% 50%,#0c1220 0 34%,#C5A55A 36% 40%,#1b2433 42% 58%,#3a4a66 60% 100%);box-shadow:0 0 0 2px rgba(197,165,90,.8),0 0 18px rgba(197,165,90,.45)}' +
    '.cvn-pin{flex:0 0 auto;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#ffe9a8 0 18%,rgba(211,181,119,.25) 20% 46%,transparent 48%),radial-gradient(circle,transparent 0 60%,rgba(143,180,255,.5) 62% 64%,transparent 66%);box-shadow:inset 0 0 0 1px rgba(143,180,255,.4)}' +
    '.cvn-talk{display:flex;flex-direction:column;align-items:center;gap:5px}' +
    '.cvn-orb{width:74px;height:74px;border-radius:50%;border:0;cursor:pointer;background:radial-gradient(circle at 35% 30%,#fff 0,#9fe7ff 18%,#38bdf8 46%,#0b3a66 100%);box-shadow:0 0 0 2px rgba(255,255,255,.22),0 0 36px rgba(56,189,248,.75);font:800 11px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.2em;color:#04121a;transition:transform .2s}' +
    '.cvn-orb.listening{animation:cvnPulse 1.1s ease-in-out infinite;background:radial-gradient(circle at 35% 30%,#fff 0,#ffe9a8 18%,#C5A55A 46%,#5a4413 100%);box-shadow:0 0 0 2px rgba(255,255,255,.3),0 0 46px rgba(197,165,90,.9)}' +
    '@keyframes cvnPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}' +
    '.cvn-orb.live,.cvn-orb.live.listening{animation:none;transform:scale(1.16);color:rgba(233,248,255,.85);text-shadow:0 0 8px rgba(56,189,248,.9);background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.16) 0,rgba(159,231,255,.06) 30%,rgba(56,189,248,.04) 60%,rgba(11,58,102,.10) 100%);box-shadow:inset 0 0 18px rgba(56,189,248,.25),0 0 30px rgba(56,189,248,.28);-webkit-backdrop-filter:blur(1.5px);backdrop-filter:blur(1.5px);transition:transform .35s cubic-bezier(.2,.8,.2,1.2),background .35s}' +
    '.cvn-talk small{font-size:12px;font-style:italic;color:#cfe0ff;max-width:220px;text-align:center}' +
    '#cvnCircle{position:fixed;left:24px;bottom:22px;z-index:7100;display:flex;align-items:center;gap:8px}' +
    '.cvn-step{width:40px;height:40px;border-radius:50%;border:1px solid rgba(56,189,248,.4);background:rgba(10,14,24,.84);color:#9fd8ff;font-size:20px;line-height:1;cursor:pointer}' +
    '.cvn-who{min-width:150px;max-width:230px;padding:7px 14px;border-radius:16px;border:1px solid rgba(56,189,248,.35);background:rgba(10,14,24,.84);cursor:pointer;text-align:left;color:inherit;font:inherit}' +
    '.cvn-who small{display:block;font:600 9.5px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.14em;color:#9fd8ff}.cvn-who b{display:block;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#cvnDay{position:fixed;left:30px;top:106px;bottom:96px;width:78px;z-index:7050;touch-action:none;cursor:ns-resize;transition:opacity .45s ease,filter .45s ease}' +
    '#cvnDay.back{opacity:.24;filter:blur(.6px);pointer-events:none;z-index:3}' +
    '#cvnDay .hd{position:absolute;left:0;top:0;width:150px;font:700 9.5px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.16em;color:#C5A55A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#cvnDay .hd b{display:block;font:700 12px var(--nous-font,"Hanken Grotesk",sans-serif);letter-spacing:.02em;color:#e8ecf4;text-transform:none;margin-bottom:1px}' +
    '#cvnDay .tr{position:absolute;left:0;right:0;top:70px;bottom:0}#cvnDay .hd .fr{display:block;margin-top:3px;font:700 9px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.14em;text-transform:uppercase}#cvnDay .hd .fr.ok{color:#5eead4}#cvnDay .hd .fr.ok:before{content:"\\25CF  ";color:#22d3a6}#cvnDay .hd .fr.old{color:#fbbf24}#cvnDay .hd .dd{display:block;font:700 11px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.08em;color:#9fd8ff;margin:1px 0 2px}' +
    '#cvnDay .ln{position:absolute;left:46px;top:0;bottom:0;width:2px;background:linear-gradient(180deg,rgba(143,180,255,.10),rgba(143,180,255,.55) 30%,rgba(143,180,255,.55) 80%,rgba(143,180,255,.10))}' +
    '#cvnDay .mk{position:absolute;left:43px;width:8px;height:1px;background:rgba(143,180,255,.35)}' +
    '#cvnDay .tk{position:absolute;left:0;width:38px;text-align:right;transform:translateY(-50%);font:600 9px var(--nous-mono,"JetBrains Mono",monospace);color:#8fa6cc;white-space:nowrap}' +
    '#cvnDay .bd{position:absolute;left:52px;width:6px;border-radius:3px;background:linear-gradient(180deg,rgba(197,165,90,.9),rgba(197,165,90,.55));box-shadow:0 0 8px rgba(197,165,90,.6)}' +
    '#cvnDay .bd.deep{background:linear-gradient(180deg,rgba(109,93,252,.95),rgba(109,93,252,.6));box-shadow:0 0 8px rgba(109,93,252,.7)}#cvnDay .bd.light{background:linear-gradient(180deg,rgba(56,189,248,.8),rgba(56,189,248,.45));box-shadow:0 0 6px rgba(56,189,248,.5)}' +
    '#cvnDay .dt{position:absolute;left:47px;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%}' +
    '#cvnDay .dt.g{background:#22d3a6;box-shadow:0 0 9px #22d3a6}#cvnDay .dt.b{background:#38bdf8;box-shadow:0 0 9px #38bdf8}#cvnDay .dt.y{background:#ffd24d;box-shadow:0 0 9px #ffd24d}#cvnDay .dt.r{background:#ef4444;box-shadow:0 0 11px #ef4444}#cvnDay .dt.o{background:#05070d;border:1.5px solid rgba(159,216,255,.7)}' +
    '#cvnDay .nw{position:absolute;left:30px;width:34px;height:2px;margin-top:-1px;background:#fff;box-shadow:0 0 10px #fff}#cvnDay .nw:after{content:"";position:absolute;right:-4px;top:-3px;border:4px solid transparent;border-left-color:#fff}' +
    '#cvnDay .sc{position:absolute;left:24px;width:44px;height:2px;margin-top:-1px;background:#C5A55A;box-shadow:0 0 12px #C5A55A}' +
    '#cvnDay .nn{position:absolute;left:62px;top:50%;transform:translateY(-50%);width:90px;font:500 10.5px var(--nous-font,"Hanken Grotesk",sans-serif);color:#6f86ad}' +
    '#cvnDayTip{position:fixed;z-index:7200;min-width:200px;max-width:300px;padding:10px 12px;border-radius:14px;border:1px solid rgba(197,165,90,.6);background:rgba(10,14,24,.94);font-size:12.5px;line-height:1.45;box-shadow:0 12px 30px rgba(0,0,0,.6)}' +
    '#cvnDayTip b{font:700 10px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.16em;color:#C5A55A;display:block;margin-bottom:4px}#cvnDayTip div{color:#e8ecf4}#cvnDayTip i{font-style:normal;color:#9fb4e2}' +
    '.cvn-sheet{position:fixed;inset:0;z-index:9400;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(3,6,14,.6);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}' +
    '.cvn-sheet[hidden]{display:none}' +
    '.cvn-box{width:min(560px,100%);max-height:calc(100vh - 32px);overflow:auto;border-radius:22px;border:1px solid rgba(56,189,248,.4);background:linear-gradient(165deg,rgba(16,24,48,.96),rgba(7,10,22,.97));box-shadow:0 30px 70px rgba(0,0,0,.6),0 0 40px rgba(56,189,248,.15);padding:18px 18px 16px}' +
    '.cvn-box h2{margin:0 0 4px;font:700 11px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.22em;color:#9fd8ff;text-transform:uppercase}.cvn-box h3{margin:0 0 12px;font-size:20px;font-weight:800}' +
    '.cvn-sec{padding:10px 0;border-top:1px solid rgba(255,255,255,.07)}.cvn-sec>b{display:block;font:700 9.5px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.18em;color:#C5A55A;margin-bottom:6px;text-transform:uppercase}' +
    '.cvn-sec div{font-size:14px;line-height:1.5}.cvn-sec .r{color:#fca5a5}.cvn-sec .y{color:#ffd24d}.cvn-sec .g{color:#86efac}.cvn-sec small{color:#9fb4e2}' +
    '.cvn-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.cvn-btn{min-height:40px;padding:0 16px;border-radius:20px;border:1px solid rgba(100,180,255,.35);background:rgba(12,14,24,.9);color:#d8e8ff;font:600 13px var(--nous-font,"Hanken Grotesk",sans-serif);cursor:pointer}.cvn-btn.pri{background:#38bdf8;border-color:#38bdf8;color:#04121a;font-weight:800}' +
    '.cvn-btn[aria-pressed="true"]{background:rgba(56,189,248,.22);border-color:#38bdf8;color:#fff}.cvn-link{word-break:break-all;font:500 12.5px var(--nous-mono,"JetBrains Mono",monospace);color:#ffe9a8;background:rgba(197,165,90,.1);border:1px solid rgba(197,165,90,.4);border-radius:12px;padding:10px;margin-top:10px}' +
    /* calm: larger, quieter, fewer moving parts */
    'body.cv-calm #cvTabs{font-size:15px}body.cv-calm .cvx-nm span{font-size:16px}body.cv-calm .cvx-nm small{font-size:13.5px}body.cv-calm .cvx-kv dd{font-size:15px}body.cv-calm .cvn-hud{font-size:13px}body.cv-calm .dream-brief{font-size:115%}' +
    'body.cv-calm #cvnBezel{border-color:rgba(197,165,90,.35)}' +
    '@media (max-width:700px){' +
      '#cvnTop{top:auto;bottom:148px;gap:6px;width:calc(100vw - 24px);justify-content:center}.cvn-chip{min-height:30px;padding:0 10px;font-size:9.5px;letter-spacing:.1em}' +
      '#cvnDock{bottom:12px;gap:10px;width:calc(100vw - 20px);justify-content:space-between;align-items:center}' +
      '.cvn-slot{min-width:0;max-width:none;padding:0;border:0;background:none;box-shadow:none;flex-direction:column;gap:3px}.cvn-slot span{display:none}.cvn-slot b{font-size:9px;letter-spacing:.14em;margin:0}' +
      '.cvn-lens,.cvn-pin{width:50px;height:50px}.cvn-orb{width:66px;height:66px}.cvn-talk small{display:none}' +
      '#cvnCircle{left:auto;right:auto;bottom:auto;position:static}#cvnCircle .cvn-who{display:none}.cvn-step{width:38px;height:38px}' +
      '#cvnDay{left:8px;top:106px;bottom:64px;width:60px}#cvnDay .ln{left:34px}#cvnDay .mk{left:31px}#cvnDay .tk{width:28px;font-size:8px}#cvnDay .bd{left:40px}#cvnDay .dt{left:35px}#cvnDay .nw{left:22px;width:26px}#cvnDay .sc{left:16px;width:36px}#cvnDay .hd{width:170px}#cvnDay .nn{left:46px;width:70px}' +
      '.cvn-hud.r{display:none}.cvn-hud.l{top:76px !important;left:16px !important;font-size:9.5px}' +
      '#cvnBezel{inset:6px;border-radius:20px}body.cvn-on #addPersonFab{bottom:196px !important;right:12px !important;width:44px !important;height:44px !important}' +
    '}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ── the elements ── */
  function el(tag, id, cls, html) { var e = document.createElement(tag); if (id) e.id = id; if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  var bezel = el('div', 'cvnBezel'), hudL = el('div', 'cvnHudL', 'cvn-hud l'), hudR = el('div', 'cvnHudR', 'cvn-hud r');
  var top = el('nav', 'cvnTop', 'cvn'); top.setAttribute('aria-label', 'Covara');
  var dock = el('div', 'cvnDock', 'cvn'), circle = el('div', 'cvnCircle', 'cvn'), day = el('div', 'cvnDay', 'cvn');
  day.setAttribute('role', 'slider'); day.setAttribute('aria-label', 'Day'); day.tabIndex = 0;
  var tip = el('div', 'cvnDayTip', 'cvn'); tip.hidden = true;
  var built = false;
  function build() {
    if (built) return; built = true;
    hudL.style.cssText = 'left:26px;top:90px'; hudR.style.cssText = 'right:96px;bottom:34px;text-align:right';
    [bezel, hudL, hudR, top, day, tip, circle, dock].forEach(function (x) { document.body.appendChild(x); });
    top.innerHTML = '<button type="button" class="cvn-chip" data-k="home"></button><button type="button" class="cvn-chip" data-k="now" aria-pressed="false"></button><button type="button" class="cvn-chip" data-k="calm" aria-pressed="false"></button><button type="button" class="cvn-chip" data-k="share"></button>';
    circle.innerHTML = '<button type="button" class="cvn-step" data-k="prev" aria-label="Previous">‹</button><button type="button" class="cvn-who" data-k="who"><small></small><b></b></button><button type="button" class="cvn-step" data-k="next" aria-label="Next">›</button>';
    dock.innerHTML = '<button type="button" class="cvn-slot" data-k="camera"><i class="cvn-lens" aria-hidden="true"></i><div><b></b><span></span></div></button>' +
      '<div class="cvn-talk"><button type="button" class="cvn-orb" data-k="talk"></button><small></small></div>' +
      '<button type="button" class="cvn-slot" data-k="where"><i class="cvn-pin" aria-hidden="true"></i><div><b></b><span></span></div></button>';
    /* on a phone the circle steppers sit at the two ends of the dock */
    if (window.innerWidth <= 700) { var p = circle.querySelector('[data-k=prev]'), n = circle.querySelector('[data-k=next]'); dock.insertBefore(p, dock.firstChild); dock.appendChild(n); }
    top.addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (b) act(b.getAttribute('data-k')); });
    dock.addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (b) act(b.getAttribute('data-k')); });
    circle.addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (b) act(b.getAttribute('data-k')); });
    ['pointerdown', 'mousedown', 'touchstart'].forEach(function (ev) { [top, dock, circle, day, tip].forEach(function (x) { x.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true }); }); });
    bindDay();
    try { if (localStorage.getItem('cvn:calm') === '1') setCalm(true); } catch (e) {}
    words();
  }
  function words() {
    var q = function (s) { return top.querySelector(s) || dock.querySelector(s) || circle.querySelector(s); };
    var narrow = window.innerWidth <= 700;
    q('[data-k=home]').textContent = t('home'); q('[data-k=now]').textContent = narrow ? t('nowShort') : t('now'); q('[data-k=calm]').textContent = t('calm'); q('[data-k=share]').textContent = narrow ? t('shareShort') : t('share');
    var cam = dock.querySelector('[data-k=camera]'); cam.querySelector('b').textContent = t('camera'); cam.querySelector('span').textContent = t('cameraHint');
    var tk = dock.querySelector('[data-k=talk]'); tk.textContent = t('talk'); dock.querySelector('.cvn-talk small').textContent = t('talkHint');
    dock.querySelector('[data-k=where] b').textContent = t('where');
  }

  /* ── what HOME's phone and the server say, every minute ── */
  var _sum = null, _sumAt = 0;
  async function loadSummary() {
    if (!authed() || !on()) return;
    if (Date.now() - _sumAt < 60000) return; _sumAt = Date.now();
    var r = await api('/care/summary' + homeQ()).catch(function () { return { ok: false }; });
    if (r.ok) _sum = r.data;
  }

  /* ── corners ── */
  function hud() {
    var w = wh(), s = _sum || {}, name = first(), l = [], r = [];
    var where = w && w.location ? (w.inside ? w.inside.name : w.at_home === true ? '<i>' + esc(t('atHome')) + '</i>' : w.at_home === false ? '<span class="warn">' + esc(t('out')) + (w.from_home_m ? ' · ' + esc(dist(w.from_home_m)) : '') + '</span>' : '') : '';
    l.push('<b>' + esc(name) + '</b>' + (where ? ' · ' + where : ''));
    var room = s.room || (w && w.rooms && w.rooms.now ? { room: w.rooms.now, since: w.rooms.since } : null);
    if (room && room.room) l.push(esc(room.room) + (room.since ? ' · ' + esc(t('since', { t: hm(room.since) })) : ''));
    if (s.mood && s.mood.mood) l.push(esc(t('mood')) + ' · <span class="' + (s.mood.mood === 'low' ? 'bad' : s.mood.mood === 'okay' ? 'warn' : '') + '">' + esc(t('calm_' + s.mood.mood)) + '</span>');
    r.push('<b>● ' + esc(t('live')) + '</b> ' + esc(hm(Date.now())));
    var a = s.activity;
    if (a && a.battery != null) r.push(esc(t('phone')) + ' · <span class="' + (a.battery < 20 ? 'bad' : '') + '">' + a.battery + '%</span>' + (a.charging ? ' · ' + esc(t('charging')) : ''));
    if (a && a.moved_at) r.push(esc(t('moved')) + ' · ' + esc(ago(a.moved_at)));
    var hl = l.join('<br>'), hr = r.join('<br>');
    if (hudL._h !== hl) { hudL.innerHTML = hl; hudL._h = hl; }
    if (hudR._h !== hr) { hudR.innerHTML = hr; hudR._h = hr; }
    /* the upper left belongs to whatever is open there */
    var busy = !!document.querySelector('#cvTabs.show') || (window.CovaraWhere && CovaraWhere.shown()) || (typeof focusedContactId !== 'undefined' && focusedContactId != null);
    hudL.classList.toggle('off', busy);
  }

  /* ── the circle, one person at a time ── */
  function people() {
    if (typeof NODES === 'undefined') return [];
    return NODES.filter(function (n) { return n && n.contact && !n.isCenter; }).map(function (n) { return n.contact; });
  }
  function circleView() {
    var ps = people(), f = (typeof focusedContactId !== 'undefined') ? focusedContactId : null, i = -1;
    ps.forEach(function (c, k) { if (c.id === f) i = k; });
    var c = i >= 0 ? ps[i] : null;
    var sm = circle.querySelector('small'), b = circle.querySelector('b');
    if (!sm) return;
    sm.textContent = t('circle') + ' · ' + (c ? t('of', { i: i + 1, n: ps.length }) : t('people', { n: ps.length }));
    b.textContent = c ? (c.cvTitle || ((c.first || '') + ' ' + (c.last || '')).trim()) + (c.details && c.details.role ? ' · ' + c.details.role : '') : homeName();
  }
  function step(d) {
    var ps = people(); if (!ps.length) return;
    var f = (typeof focusedContactId !== 'undefined') ? focusedContactId : null, i = -1;
    ps.forEach(function (c, k) { if (c.id === f) i = k; });
    i = i < 0 ? (d > 0 ? 0 : ps.length - 1) : (i + d + ps.length) % ps.length;
    try { if (window.CovaraView) CovaraView.open(''); } catch (e) {}
    try { focusedContactId = ps[i].id; netSpin = false; } catch (e) {}
    circleView();
  }

  /* ── the top bar ── */
  var _saved = null;
  function goHome() {
    try { focusedContactId = null; } catch (e) {}
    try { if (window.CovaraView) CovaraView.open(''); } catch (e) {}
    try { if (typeof WhereIs !== 'undefined') WhereIs.setMode('comm'); } catch (e) {}
    closeSheet('cvnNow'); closeSheet('cvnShare');
    try { netSpin = true; } catch (e) {}
  }
  function setCalm(onn) {
    document.body.classList.toggle('cv-calm', !!onn); window.CovaraCalm = !!onn;
    try { localStorage.setItem('cvn:calm', onn ? '1' : '0'); } catch (e) {}
    try { netSpin = !onn; } catch (e) {}
    var b = top.querySelector('[data-k=calm]'); if (b) b.setAttribute('aria-pressed', onn ? 'true' : 'false');
  }
  function sheet(id) { var s = document.getElementById(id); if (!s) { s = el('div', id, 'cvn-sheet cvn'); s.setAttribute('role', 'dialog'); s.setAttribute('aria-modal', 'true'); document.body.appendChild(s); s.addEventListener('click', function (e) { if (e.target === s) closeSheet(id); }); } s.hidden = false; return s; }
  function closeSheet(id) {
    var s = document.getElementById(id); if (!s || s.hidden) return; s.hidden = true;
    if (id === 'cvnNow') { var b = top.querySelector('[data-k=now]'); if (b) b.setAttribute('aria-pressed', 'false'); restore(); }
  }
  function restore() {
    if (!_saved) return; var v = _saved; _saved = null;
    try { focusedContactId = v.focus; } catch (e) {}
    try { if (v.section && window.CovaraView) CovaraView.open(v.section); } catch (e) {}
    try { if (typeof WhereIs !== 'undefined' && v.mode) WhereIs.setMode(v.mode); } catch (e) {}
  }
  /* EVERYTHING NOW: the whole picture on one page, and back to exactly where you were */
  async function everythingNow() {
    var open = document.getElementById('cvnNow');
    if (open && !open.hidden) { closeSheet('cvnNow'); return; }
    _saved = { focus: typeof focusedContactId !== 'undefined' ? focusedContactId : null, section: window.CovaraView && CovaraView.section ? CovaraView.section() : '', mode: typeof WhereIs !== 'undefined' ? WhereIs.mode() : 'comm' };
    _sumAt = 0; await loadSummary(); try { if (window.CovaraWhere) CovaraWhere.load(true); } catch (e) {}
    var b = top.querySelector('[data-k=now]'); if (b) b.setAttribute('aria-pressed', 'true');
    var s = sheet('cvnNow'), d = cv() || {}, w = wh() || {}, sum = _sum || {}, rows = [];
    var since = Date.now() - 864e5;
    var evs = (sum.events || []).filter(function (e) { return e.at > since; }).slice(0, 6);
    rows.push('<div class="cvn-sec"><b>' + esc(t('nowAlerts')) + '</b>' + (evs.length ? evs.map(function (e) { return '<div class="' + (e.level >= 3 ? 'r' : e.level === 2 ? 'y' : '') + '">' + esc(e.title) + ' <small>· ' + esc(hm(e.at)) + '</small></div>'; }).join('') : '<div class="g">' + esc(t('nowNone')) + '</div>') + '</div>');
    var where = w.location ? (w.inside ? w.inside.name : w.at_home === false ? t('nowOut', { d: dist(w.from_home_m) }) : t('nowHome')) + (w.rooms && w.rooms.now ? ' · ' + w.rooms.now : '') + ' <small>· ' + esc(ago(w.location.at)) + '</small>' : esc(t('nowNoPos'));
    var withs = (w.with || []).map(function (m) { return m.you ? (IT() ? 'te' : 'you') : String(m.name || '').split(/\s+/)[0]; });
    rows.push('<div class="cvn-sec"><b>' + esc(t('nowWhere')) + '</b><div class="' + (w.at_home === false ? 'y' : '') + '">' + where + '</div>' + (withs.length ? '<div class="g">' + esc(t('nowWith')) + ' ' + esc(withs.join(', ')) + '</div>' : '') + '</div>');
    var ti = ((d.today && d.today.items) || []).filter(function (x) { return x.item.kind !== 'appt'; });
    var late = ti.filter(function (x) { return x.state === 'late'; }), due = ti.filter(function (x) { return x.state === 'due'; });
    rows.push('<div class="cvn-sec"><b>' + esc(t('nowMeds')) + '</b>' + (late.length ? '<div class="r">' + esc(t('nowLate', { n: late.length })) + ': ' + esc(late.map(function (x) { return x.item.title + ' ' + x.slot; }).join(', ')) + '</div>' : '') + (due.length ? '<div class="y">' + esc(t('nowDue', { n: due.length })) + ': ' + esc(due.map(function (x) { return x.item.title; }).join(', ')) + '</div>' : '') + (!late.length && !due.length ? '<div class="g">' + esc(t('nowAllDone')) + '</div>' : '') + '</div>');
    var appt = (d.items || []).filter(function (i) { return i.kind === 'appt' && i.at > Date.now(); }).sort(function (a, c) { return a.at - c.at; })[0];
    var shift = (d.items || []).filter(function (i) { return i.kind === 'shift' && ((i.meta || {}).end || i.at) > Date.now(); }).sort(function (a, c) { return a.at - c.at; })[0];
    if (appt || shift) rows.push('<div class="cvn-sec"><b>' + esc(t('nowNext')) + '</b>' + (appt ? '<div>' + esc(appt.title) + ((appt.meta || {}).with ? ' · ' + esc(appt.meta.with) : '') + ' <small>· ' + esc(new Date(appt.at).toLocaleString(loc(), { weekday: 'short', hour: 'numeric', minute: '2-digit' })) + '</small></div>' : '') + (shift ? '<div>' + esc((shift.meta || {}).who || shift.title) + ' <small>· ' + esc(hm(shift.at)) + '</small></div>' : '') + '</div>');
    var lg = (d.log || []).filter(function (x) { return x.at > since && ['water', 'meal', 'sleep', 'toilet', 'pain', 'mood', 'behaviour'].indexOf(x.kind) >= 0; }).slice(0, 4);
    if (lg.length) rows.push('<div class="cvn-sec"><b>' + esc(t('nowHealth')) + '</b>' + lg.map(function (x) { return '<div>' + esc(x.kind) + ': ' + esc(x.value) + ' <small>· ' + esc(hm(x.at)) + '</small></div>'; }).join('') + '</div>');
    s.innerHTML = '<div class="cvn-box"><h2>' + esc(t('nowTitle')) + '</h2><h3>' + esc(homeName()) + '</h3>' + rows.join('') + '<div class="cvn-row"><button type="button" class="cvn-btn pri" data-x>' + esc(t('nowBack')) + '</button></div></div>';
    s.querySelector('[data-x]').onclick = function () { closeSheet('cvnNow'); };
  }
  /* SHARE WITH DOCTOR: a time-limited link to the emergency sheet and today */
  async function shareDoctor() {
    var s = sheet('cvnShare'), hours = 24, link = null;
    async function draw() {
      var list = await api('/care/share' + homeQ()).catch(function () { return { ok: false }; });
      var act = list.ok ? (list.data.shares || []).filter(function (x) { return !x.revoked_at && x.expires_at > Date.now(); }) : [];
      s.innerHTML = '<div class="cvn-box"><h2>' + esc(t('shareTitle')) + '</h2><h3>' + esc(homeName()) + '</h3><div class="cvn-sec" style="border:0"><div>' + esc(t('shareWhy', { name: first() })) + '</div></div>' +
        '<div class="cvn-row">' + [[2, 'for2'], [24, 'for24'], [72, 'for72']].map(function (h) { return '<button type="button" class="cvn-btn" data-h="' + h[0] + '" aria-pressed="' + (hours === h[0]) + '">' + esc(t(h[1])) + '</button>'; }).join('') + '</div>' +
        (link ? '<div class="cvn-link">' + esc(link) + '</div><div class="cvn-row"><button type="button" class="cvn-btn pri" data-copy>' + esc(t('copy')) + '</button>' + (navigator.share ? '<button type="button" class="cvn-btn" data-send>' + esc(t('sendIt')) + '</button>' : '') + '</div>' : '<div class="cvn-row"><button type="button" class="cvn-btn pri" data-make>' + esc(t('shareMake')) + '</button></div>') +
        (act.length ? '<div class="cvn-sec" style="margin-top:12px"><b>' + esc(t('shareActive')) + '</b>' + act.map(function (x) { return '<div>' + esc(t('ends', { t: new Date(x.expires_at).toLocaleString(loc(), { weekday: 'short', hour: 'numeric', minute: '2-digit' }) })) + ' <small>· ' + esc(x.opens ? t('opened', { n: x.opens }) : t('notOpened')) + '</small> <button type="button" class="cvn-btn" style="min-height:30px" data-end="' + esc(x.id) + '">' + esc(t('end')) + '</button></div>'; }).join('') + '</div>' : '') +
        '<div class="cvn-row"><button type="button" class="cvn-btn" data-x>' + esc(t('close')) + '</button></div></div>';
      s.querySelectorAll('[data-h]').forEach(function (b) { b.onclick = function () { hours = +b.getAttribute('data-h'); link = null; draw(); }; });
      var mk = s.querySelector('[data-make]'); if (mk) mk.onclick = async function () { mk.disabled = true; var r = await api('/care/share', { method: 'POST', body: Object.assign({ hours: hours }, homeBody()) }).catch(function () { return { ok: false }; }); if (r.ok) { link = new URL('share.html#' + r.data.token, location.href).href; draw(); } else mk.disabled = false; };
      var cp = s.querySelector('[data-copy]'); if (cp) cp.onclick = function () { try { navigator.clipboard.writeText(link); cp.textContent = t('copied'); } catch (e) {} };
      var sd = s.querySelector('[data-send]'); if (sd) sd.onclick = function () { try { navigator.share({ title: 'Remiel: Covara', text: homeName(), url: link }); } catch (e) {} };
      s.querySelectorAll('[data-end]').forEach(function (b) { b.onclick = async function () { await api('/care/share/' + encodeURIComponent(b.getAttribute('data-end')), { method: 'DELETE' }).catch(function () {}); draw(); }; });
      s.querySelector('[data-x]').onclick = function () { closeSheet('cvnShare'); };
    }
    draw();
  }
  function act(k) {
    if (k === 'home') goHome();
    else if (k === 'now') everythingNow();
    else if (k === 'calm') setCalm(!document.body.classList.contains('cv-calm'));
    else if (k === 'share') shareDoctor();
    else if (k === 'prev') step(-1);
    else if (k === 'next' || k === 'who') step(1);
    else if (k === 'where') { try { if (typeof WhereIs !== 'undefined') WhereIs.setMode(WhereIs.mode() === 'whereis' ? 'comm' : 'whereis'); if (window.CovaraView) CovaraView.open(''); } catch (e) {} }
    else if (k === 'camera') { if (window.CovaraCamera) CovaraCamera.open(); }
    else if (k === 'talk') { if (window.CovaraTalk) CovaraTalk.toggle(dock.querySelector('[data-k=talk]'), dock.querySelector('.cvn-talk small')); }
  }
  function whereSlot() {
    var w = wh(), sp = dock.querySelector('[data-k=where] span'); if (!sp) return;
    var txt = !w || !w.location ? t('nowNoPos') : w.inside ? w.inside.name : w.at_home === false ? t('nowOut', { d: dist(w.from_home_m) }) : t('nowHome') + (w.rooms && w.rooms.now ? ' · ' + w.rooms.now : '');
    if (sp.textContent !== txt) sp.textContent = txt;
  }

  /* ── HOME's day: what happened, and what is coming, to replay by dragging ── */
  function dayEvents() {
    var d = cv() || {}, out = [], s0 = new Date(); s0.setHours(0, 0, 0, 0);
    ((d.today && d.today.items) || []).forEach(function (x) {
      if (x.item.kind === 'appt') { out.push({ at: x.at, c: x.state === 'done' ? 'b' : 'o', text: x.item.title, k: 'ev_visit' }); return; }
      /* the slot's exact moment from the server (HOME's own time zone), so every phone places it at the same instant */
      var p = String(x.slot || '').split(':'), at = new Date(); at.setHours(+p[0] || 0, +p[1] || 0, 0, 0);
      out.push({ at: x.done_at || x.at || at.getTime(), c: x.state === 'done' ? 'g' : x.state === 'late' ? 'r' : x.state === 'due' ? 'y' : 'o', text: x.item.title + ' ' + x.slot, k: x.state === 'done' ? 'ev_taken' : 'ev_' + x.state });
    });
    (d.log || []).forEach(function (x) { if (x.at < s0.getTime() || x.kind === 'me') return; out.push({ at: x.at, c: x.kind === 'worry' || x.value === 'bad' || x.value === 'flagged' ? 'r' : 'b', text: x.kind + ': ' + x.value + (x.note && x.kind !== 'visit' ? ' · ' + x.note : ''), k: 'ev_log' }); });
    ((_sum && _sum.events) || []).forEach(function (e) { if (e.at < s0.getTime()) return; out.push({ at: e.at, c: e.level >= 3 ? 'r' : 'y', text: e.title, k: '' }); });
    return out.sort(function (a, b) { return a.at - b.at; });
  }
  /* ── the schedule: a full 24 hours, top to bottom, for whoever the circle stepper is on ──
     HOME (or nobody selected): HOME's medicines, visits and the day so far. Anyone else: their shifts on duty,
     the appointments they are going to, and what they noted today. */
  function dayBounds() { var a = new Date(); a.setHours(0, 0, 0, 0); return { a: a.getTime(), b: a.getTime() + 864e5 }; }
  function who() {
    var f = (typeof focusedContactId !== 'undefined') ? focusedContactId : null, c = null;
    if (f != null) people().forEach(function (x) { if (x.id === f) c = x; });
    var h = null; try { h = (typeof DEMO_CONTACTS !== 'undefined') && DEMO_CONTACTS.filter(function (x) { return x.care && x.care.side === 'home' && x.care.state === 'active'; })[0]; } catch (e) {}
    if (!c || (h && c.id === h.id)) return null;
    return c;
  }
  function namesOf(c) { return [c.cvTitle, ((c.first || '') + ' ' + (c.last || '')).trim(), c.first, c.last].filter(function (x) { return x && String(x).trim().length >= 3; }).map(function (x) { return String(x).toLowerCase().trim(); }); }
  function mentions(text, ns) { var s0 = String(text || '').toLowerCase(); return ns.some(function (n) { return s0.indexOf(n) >= 0; }); }
  function schedule() {
    var c = who(), B = dayBounds();
    if (!c) {
      var vb = []; try { var vv = (cv() || {}).vitals; if (vv && window.CovaraSleep) vb = CovaraSleep.bands(vv.series).map(function (g) { return { a: g.a, b: g.b, cls: g.s, text: (IT() ? (g.s === 'deep' ? 'Sonno profondo ' : 'Sonno leggero ') : (g.s === 'deep' ? 'Deep sleep ' : 'Light sleep ')) + hm(g.a) + ' ' + (IT() ? 'alle' : 'to') + ' ' + hm(g.b) }; }); } catch (e) {}
      return { name: first(), ev: dayEvents(), bands: vb };
    }
    var d = cv() || {}, ns = namesOf(c), uid = c.care && c.care.userId, ev = [], bands = [];
    (d.items || []).forEach(function (it) {
      var m = it.meta || {};
      if (it.kind === 'shift' && mentions(m.who || it.title, ns)) {
        var e = m.end || it.at + 8 * 3600e3; if (e < B.a || it.at > B.b) return;
        bands.push({ a: Math.max(it.at, B.a), b: Math.min(e, B.b), text: t('ev_shift') + ' ' + hm(it.at) + ' ' + (IT() ? 'alle' : 'to') + ' ' + hm(e) });
        ev.push({ at: it.at, c: 'y', text: t('ev_shift'), k: '' });
      } else if (it.kind === 'appt' && it.at >= B.a && it.at < B.b && (mentions(m.with, ns) || mentions(it.title, ns))) {
        ev.push({ at: it.at, c: it.at < Date.now() ? 'b' : 'o', text: it.title + (m.place ? ' · ' + m.place : ''), k: 'ev_appt' });
      }
    });
    (d.log || []).forEach(function (x) { if (x.at < B.a || x.kind === 'me' || !uid || x.by !== uid) return; ev.push({ at: x.at, c: x.kind === 'worry' ? 'r' : 'b', text: x.kind + ': ' + x.value + (x.note ? ' · ' + x.note : ''), k: 'ev_log' }); });
    return { name: (c.cvTitle || c.first || ((c.first || '') + ' ' + (c.last || '')).trim()), ev: ev.sort(function (a, b) { return a.at - b.at; }), bands: bands };
  }
  /* How current the timeline is, said plainly: LIVE while the last check with the server is under 30 seconds old,
     otherwise the time it was last brought up to date, in amber, so nobody trusts a timeline that has gone stale. */
  function fresh() {
    var f = null; try { f = window.CovaraView && CovaraView.fresh ? CovaraView.fresh() : null; } catch (e) {}
    if (!f || !f.syncedAt) return null;
    var seen = Math.max(f.checkedAt || 0, f.syncedAt);
    if (Date.now() - seen < 30000 && navigator.onLine !== false) return { c: 'ok', text: t('live') };
    return { c: 'old', text: t('updated', { t: hm(seen) }) };
  }
  var _range = null, _sch = null;
  function range() { return dayBounds(); }
  var _dsig = '';
  function hourLabel(h) { if (IT()) return String(h); var x = h % 24; return (x % 12 || 12) + (x < 12 ? 'a' : 'p'); }
  function drawDay() {
    var S = schedule(), R = range(); _range = R; _sch = S;
    var ev = S.ev.filter(function (e) { return e.at >= R.a && e.at < R.b; });
    var fr0 = fresh(), sig = (fr0 ? fr0.text + fr0.c : '') + '|' + (who() ? who().id : 'home') + '|' + ev.map(function (e) { return e.at + e.c; }).join() + '|' + S.bands.map(function (b) { return b.a + '-' + b.b; }).join() + '|' + Math.floor(Date.now() / 60000) + '|' + _scrub + '|' + loc() + '|' + new Date().toDateString();
    if (sig === _dsig) return; _dsig = sig;
    var pos = function (ms) { return Math.max(0, Math.min(100, (ms - R.a) / (R.b - R.a) * 100)); };
    var tk = '';
    for (var h = 0; h <= 24; h++) {
      var y = h / 24 * 100;
      tk += '<span class="mk" style="top:' + y + '%"></span>';
      if (h % 6 === 0) tk += '<span class="tk" style="top:' + y + '%">' + esc(hourLabel(h)) + '</span>';
    }
    var dstr = new Date().toLocaleDateString(loc(), { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
    var fr = fresh();
    day.innerHTML = '<div class="hd"><b>' + esc(S.name) + '</b><span class="dd">' + esc(dstr) + '</span>' + esc(t('sched')) + ' · 24H' +
      (fr ? '<span class="fr ' + fr.c + '">' + esc(fr.text) + '</span>' : '') + '</div><div class="tr"><div class="ln"></div>' + tk +
      S.bands.map(function (b) { return '<span class="bd' + (b.cls ? ' ' + b.cls : '') + '" style="top:' + pos(b.a) + '%;height:' + Math.max(1.2, pos(b.b) - pos(b.a)) + '%"></span>'; }).join('') +
      ev.map(function (e) { return '<span class="dt ' + e.c + '" style="top:' + pos(e.at) + '%"></span>'; }).join('') +
      (!ev.length && !S.bands.length ? '<span class="nn">' + esc(t('schedNone')) + '</span>' : '') +
      '<span class="nw" style="top:' + pos(Date.now()) + '%"></span>' + (_scrub ? '<span class="sc" style="top:' + pos(_scrub) + '%"></span>' : '') + '</div>';
  }
  var _scrub = 0;
  function showAt(ms) {
    ms = Math.max(_range.a, Math.min(_range.b - 60000, ms));
    _scrub = ms; _dsig = ''; drawDay();
    var S = _sch || schedule();
    var ev = S.ev.filter(function (e) { return Math.abs(e.at - ms) < 45 * 60000; });
    S.bands.forEach(function (b) { if (ms >= b.a && ms <= b.b) ev.unshift({ at: b.a, text: b.text, k: '' }); });
    tip.innerHTML = '<b>' + esc(t('dayTitle', { name: S.name })) + ' · ' + esc(hm(ms)) + '</b>' + (ev.length ? ev.map(function (e) { return '<div>' + esc(e.text) + ' <i>· ' + esc(hm(e.at)) + (e.k ? ' · ' + esc(t(e.k)) : '') + '</i></div>'; }).join('') : '<div><i>' + esc(t('dayNothing')) + '</i></div>');
    tip.hidden = false;
    var tr = day.querySelector('.tr').getBoundingClientRect(), y = tr.top + (ms - _range.a) / (_range.b - _range.a) * tr.height;
    var r = day.getBoundingClientRect();
    tip.style.bottom = 'auto';
    tip.style.left = Math.round(Math.min(window.innerWidth - 310, r.right + 6)) + 'px';
    tip.style.top = Math.round(Math.max(10, Math.min(window.innerHeight - tip.offsetHeight - 10, y - 24))) + 'px';
  }
  function bindDay() {
    var dragging = false;
    function at(e) { var tr = day.querySelector('.tr'); if (!tr) return Date.now(); var r = tr.getBoundingClientRect(), p = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)); return _range.a + p * (_range.b - _range.a); }
    day.addEventListener('pointerdown', function (e) { dragging = true; try { day.setPointerCapture(e.pointerId); } catch (x) {} showAt(at(e)); e.preventDefault(); e.stopPropagation(); });
    day.addEventListener('pointermove', function (e) { if (dragging) showAt(at(e)); });
    day.addEventListener('pointerup', function () { dragging = false; });
    day.addEventListener('keydown', function (e) { if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { showAt((_scrub || Date.now()) + (e.key === 'ArrowUp' ? -15 : 15) * 60000); e.preventDefault(); } if (e.key === 'Escape') { tip.hidden = true; _scrub = 0; _dsig = ''; } });
    document.addEventListener('pointerdown', function (e) { if (!tip.hidden && !day.contains(e.target) && !tip.contains(e.target)) { tip.hidden = true; _scrub = 0; _dsig = ''; } }, true);
  }
  /* In front when nothing else is at its place; behind, faded, when a map, a panel or a summary is shown there */
  function overlaps(a, b) { return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }
  /* the schedule starts just below the logo and the sphere size slider with its name */
  function logoBottom() {
    var y = 0;
    document.querySelectorAll('.app-logo, #sphereSize, #sphereSize *, #cvnHudL, #cvnHudL *').forEach(function (e) {
      var r = e.getBoundingClientRect(); if (!r.height || r.left > 220 || r.top > 220) return;
      var cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return;
      y = Math.max(y, r.bottom);
    });
    return Math.round((y || 90) + 16);
  }
  /* The schedule stays where it is, just below the logo. Whatever is shown over it (a summary, the communication
     card, a reply, the weather) is brief, so the schedule simply fades into the background behind it until it goes. */
  var OVER = '#cvTabs.show, .dream-brief, .dream-comm, #cvTalkBubble, #wxChip, .wx-sheet, .sentinel-guide, .cv-pop, .cv-toast, .ios-hint, .magnet-prompt';
  function dayDepth() {
    var want = logoBottom() + 'px';
    if (day.style.top !== want) { day.style.top = want; _dsig = ''; }
    var r = day.getBoundingClientRect(); if (!r.width) return;
    var back = false;
    try { if (window.CovaraWhere && CovaraWhere.shown()) back = true; } catch (e) {}
    if (!back) document.querySelectorAll(OVER).forEach(function (el2) {
      if (back || el2.hidden || el2 === day || day.contains(el2)) return;
      var cs = getComputedStyle(el2); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.2) return;
      var b = el2.getBoundingClientRect(); if (!b.width || !b.height) return;
      if (overlaps(r, b)) back = true;
    });
    if (back && !tip.hidden) { tip.hidden = true; _scrub = 0; _dsig = ''; }
    day.classList.toggle('back', back);
  }

  /* ── keep it all current ── */
  function visibleNow() {
    if (!on()) return false;
    if (typeof appState !== 'undefined' && appState !== 'network') return false;
    var ob = document.getElementById('onboarding'); if (ob && !ob.hidden && getComputedStyle(ob).display !== 'none') return false;
    if (document.querySelector('.cv-ov.open') || document.body.classList.contains('rs-overlay-open')) return false;
    var bo = document.getElementById('blufOverlay'); if (bo && bo.classList.contains('open')) return false; /* a person's card: Covara's own controls step aside so nothing sits on it */
    return true;
  }
  function tick() {
    if (!on()) { document.body.classList.remove('cvn-on'); [bezel, hudL, hudR, top, dock, circle, day].forEach(function (x) { x.hidden = true; }); return; }
    build();
    var v = visibleNow();
    document.body.classList.toggle('cvn-on', true);
    [bezel, hudL, hudR, top, dock, circle, day].forEach(function (x) { x.hidden = !v; });
    if (!v) { tip.hidden = true; return; }
    loadSummary(); hud(); circleView(); whereSlot(); drawDay(); dayDepth();
  }
  setInterval(tick, 500);
  window.addEventListener('localeChanged', function () { if (built) words(); _dsig = ''; });
  window.CovaraNav = { summaryNow: function () { _sumAt = 0; loadSummary(); }, home: goHome, now: everythingNow, share: shareDoctor, step: step, calm: setCalm, refresh: function () { try { tick(); } catch (e) {} }, summary: function () { return _sum; }, act: act };
})();
