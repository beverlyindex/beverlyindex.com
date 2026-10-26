/* Remiel: Covara, fresh build (26 Oct 2026).
   Covara is Sentinel: index.html is Remiel Sentinel's own app with Covara's name, logo, storage, server and
   access codes. This file is the only thing added on top. It does exactly what the 25 Oct design asks:
   - the main screen is Sentinel's centre sphere (HOME, the person holding the phone) and the revolving galaxy of
     the team, with no buttons; the revolving spheres never cover the centre sphere and never stop moving;
   - a tap on HOME brings the ring of 7 (Contact, Health, Journal, Tools, WHEREIS / Safety, Covara, ALERT);
   - a tap on a teammate turns the galaxy so that person comes forward, with Video call, Phone call, Message,
     Email, WHEREIS and ALERT beside them, which stay until the next command, and the dream state above. */
(function () {
  'use strict';
  var IT = function () { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var S = {
    en: { contact: 'Contact', health: 'Health', journal: 'Journal', tools: 'Tools', where: 'WHEREIS / Safety', covara: 'Covara', alert: 'ALERT',
      video: 'Video call', phone: 'Phone call', message: 'Message', email: 'Email', hHealth: 'Health', visits: 'Visits', meds: 'Medicines', records: 'Records',
      notes: 'Notes', calendar: 'Calendar', alarms: 'Alarms', invites: 'Invites', camera: 'Camera', words: 'Words', mode: 'Mode',
      speak: 'Speak', broadcast: 'Broadcast Contact', code: 'Team code', settings: 'Settings', add: 'Add to my team', AM: 'AM', PM: 'PM',
      on: 'ON', off: 'OFF', soon: '{x} is the next part of the rebuild.', noTeam: 'No one is on your team yet. Tap your sphere, then Covara, then Team code.',
      bcOn: 'Broadcast Contact is ON: Contact reaches your whole team.', bcOff: 'Broadcast Contact is OFF: tap a teammate to reach them.',
      spOn: 'Speak is ON.', spOff: 'Speak is OFF.',
      mTitle: 'Message to your whole team', mPh: 'Write your message', mSend: 'Send to everyone', mSent: 'Sent to {n} on your team.', empty: 'Nothing written yet.',
      eTitle: 'Email', eAll: 'Email to your whole team', eSubj: 'Subject', ePh: 'Write your email', eSend: 'Send email', eSent: 'Email sent to {n}.',
      eNone: 'No email address in Covara yet for {n}.', eNoneAll: 'No one on your team has an email address in Covara yet.', eLimit: "Today's emails are used up. Try again tomorrow.",
      eFail: 'The email could not be sent. Check the internet.', eOwn: 'Opening your mail app.', noPhone: 'No phone number in Covara yet for {n}.', close: 'Close',
      aTitleAll: 'ALERT your team', aSubAll: 'Everyone on your team is told at once and sees where you are.', aTitle: 'ALERT {n}', aSub: 'Only {n} is told, and sees where you are.',
      aHold: 'Hold to send', aHolding: 'Keep holding', aSentAll: 'Your team has been told.', aSent: '{n} has been told.', aFail: 'The ALERT could not be sent. Check the internet, or call 911.', cancel: 'Cancel',
      cTitle: 'Team code', cSub: 'Give this code to the person joining your team. It works for 24 hours.', cFail: 'A code could not be made. Check the internet.', cShare: 'Share', cCopied: 'Copied.',
      added: '{n} is on your team.', pending: 'wants to join',
      pVideo: 'Video', pPhone: 'Phone', imp: 'Import Contacts',
      impNo: 'This browser does not let Covara open the contacts on this device.', impAsk: 'Would you like to select and add your contacts?',
      impAll: 'Select all', impGo: 'Add {n} to my team', impNone: 'Tick at least one name.', impHave: 'Already on your Covara app',
      impDone: '{n} added to your team.', impPh: '{n} with photos.', impFail: 'The contacts could not be read.', impBusy: 'Adding…',
      impDupQ: 'The contact is already on your Covara app. Would you like to add this contact’s information or replace to update Covara with the latest information?',
      impAdd: 'Add', impRep: 'Replace', impAddd: 'Covara now has the information of {n} from your phone.', impRepd: '{n} is updated with the latest information.',
      rAdd: 'Add', rDel: 'Delete', rDelOn: 'Done', rPick: 'Tap a name to delete',
      dTitle: 'Delete {n}?', dSub: '{n} is removed from Covara on this phone.', dSubL: '{n} is removed from Covara on this phone and leaves your team.', dGo: 'Delete', dDone: '{n} is deleted.', dFail: 'Could not delete. Check the internet.',
      callOne: '{n} is not on Covara yet, so {n} cannot be called. Give {n} your team code: tap your sphere, then Covara, then Team code.',
      callMany: '{n} are not on Covara yet, so they cannot be called. Give them your team code: tap your sphere, then Covara, then Team code.',
      jTitle: 'Join a team', jSub: 'Someone gave you their team code? Type it here.', jPh: '6-digit code', jGo: 'Join', jBad: 'That code is not right, or it has expired. Ask for a new one.',
      jOwn: 'That is your own team code. Give it to the person joining you.', jFail: 'Could not join. Check the internet.', jDone: 'You are on {n}’s team.', jBusy: 'Joining…', or: 'or',
      aAddT: 'Add someone to your team', aAddS: 'Their sphere is on your screen at once. Covara then helps you invite them.', aName: 'Name', aPhone: 'Mobile number', aMail: 'Email', aAdd: 'Add to my team', aNeed: 'Type their name first.',
      invite: 'Invite to Covara', iTitle: 'Invite {n} to Covara', iTitleAll: 'Invite to Covara', iSub: 'They open the link, and they are on your team. The code is in the link; it works for 24 hours.',
      iText: 'Send by text message', iMail: 'Send by email', iSent: 'Invitation sent to {n}.', msgNone: 'No one on your team has Covara yet, so messages cannot reach them in the app. Invite them from their sphere.' },
    it: { contact: 'Contatti', health: 'Salute', journal: 'Diario', tools: 'Strumenti', where: 'WHEREIS / Sicurezza', covara: 'Covara', alert: 'ALLERTA',
      video: 'Videochiamata', phone: 'Telefonata', message: 'Messaggio', email: 'Email', hHealth: 'Salute', visits: 'Visite', meds: 'Medicine', records: 'Cartelle',
      notes: 'Note', calendar: 'Calendario', alarms: 'Sveglie', invites: 'Inviti', camera: 'Fotocamera', words: 'Parole', mode: 'Vista',
      speak: 'Voce', broadcast: 'Contatta tutti', code: 'Codice team', settings: 'Impostazioni', add: 'Aggiungi al team', AM: 'mattina', PM: 'pomeriggio',
      on: 'ON', off: 'OFF', soon: '{x} è la prossima parte della ricostruzione.', noTeam: 'Nel tuo team non c’è ancora nessuno. Tocca la tua sfera, poi Covara, poi Codice team.',
      bcOn: 'Contatta tutti è ON: Contatti raggiunge tutto il team.', bcOff: 'Contatta tutti è OFF: tocca una persona del team per raggiungerla.',
      spOn: 'Voce ON.', spOff: 'Voce OFF.',
      mTitle: 'Messaggio a tutto il team', mPh: 'Scrivi il messaggio', mSend: 'Invia a tutti', mSent: 'Inviato a {n} del team.', empty: 'Non hai scritto niente.',
      eTitle: 'Email', eAll: 'Email a tutto il team', eSubj: 'Oggetto', ePh: 'Scrivi la tua email', eSend: 'Invia email', eSent: 'Email inviata a {n}.',
      eNone: 'Nessun indirizzo email in Covara per {n}.', eNoneAll: 'Nessuno del team ha un indirizzo email in Covara.', eLimit: 'Le email di oggi sono finite. Riprova domani.',
      eFail: 'Non è stato possibile inviare l’email. Controlla internet.', eOwn: 'Apro la tua app di posta.', noPhone: 'Nessun numero di telefono in Covara per {n}.', close: 'Chiudi',
      aTitleAll: 'ALLERTA al team', aSubAll: 'Tutto il team viene avvisato subito e vede dove sei.', aTitle: 'ALLERTA a {n}', aSub: 'Viene avvisato solo {n}, che vede dove sei.',
      aHold: 'Tieni premuto per inviare', aHolding: 'Continua a tenere premuto', aSentAll: 'Il team è stato avvisato.', aSent: '{n} è stato avvisato.', aFail: 'Non è stato possibile inviare l’allerta. Controlla internet o chiama il 112.', cancel: 'Annulla',
      cTitle: 'Codice team', cSub: 'Dai questo codice a chi entra nel tuo team. Vale 24 ore.', cFail: 'Non è stato possibile creare un codice. Controlla internet.', cShare: 'Condividi', cCopied: 'Copiato.',
      added: '{n} è nel tuo team.', pending: 'vuole entrare',
      pVideo: 'Video', pPhone: 'Telefono', imp: 'Importa contatti',
      impNo: 'Questo browser non permette a Covara di aprire i contatti del dispositivo.', impAsk: 'Vuoi selezionare e aggiungere i tuoi contatti?',
      impAll: 'Seleziona tutti', impGo: 'Aggiungi {n} al team', impNone: 'Spunta almeno un nome.', impHave: 'Già nella tua app Covara',
      impDone: '{n} aggiunti al team.', impPh: '{n} con foto.', impFail: 'Non è stato possibile leggere i contatti.', impBusy: 'Aggiungo…',
      impDupQ: 'Il contatto è già nella tua app Covara. Vuoi aggiungere le informazioni di questo contatto o sostituirle per aggiornare Covara con le più recenti?',
      impAdd: 'Aggiungi', impRep: 'Sostituisci', impAddd: 'Covara ora ha le informazioni di {n} dal telefono.', impRepd: '{n} è aggiornato con le informazioni più recenti.',
      rAdd: 'Aggiungi', rDel: 'Elimina', rDelOn: 'Fatto', rPick: 'Tocca un nome da eliminare',
      dTitle: 'Eliminare {n}?', dSub: '{n} viene tolto da Covara su questo telefono.', dSubL: '{n} viene tolto da Covara su questo telefono ed esce dal team.', dGo: 'Elimina', dDone: '{n} è stato eliminato.', dFail: 'Non è stato possibile eliminare. Controlla internet.',
      callOne: '{n} non è ancora su Covara, quindi non si può chiamare. Dai a {n} il tuo codice team: tocca la tua sfera, poi Covara, poi Codice team.',
      callMany: '{n} non sono ancora su Covara, quindi non si possono chiamare. Dai loro il tuo codice team: tocca la tua sfera, poi Covara, poi Codice team.',
      jTitle: 'Entra in un team', jSub: 'Qualcuno ti ha dato il suo codice team? Scrivilo qui.', jPh: 'Codice di 6 cifre', jGo: 'Entra', jBad: 'Il codice non è giusto o è scaduto. Chiedine uno nuovo.',
      jOwn: 'Questo è il codice del tuo team. Dallo a chi entra con te.', jFail: 'Non è stato possibile entrare. Controlla internet.', jDone: 'Sei nel team di {n}.', jBusy: 'Entro…', or: 'oppure',
      aAddT: 'Aggiungi una persona al team', aAddS: 'La sua sfera è subito sullo schermo. Poi Covara ti aiuta a invitarla.', aName: 'Nome', aPhone: 'Cellulare', aMail: 'Email', aAdd: 'Aggiungi al team', aNeed: 'Scrivi prima il nome.',
      invite: 'Invita su Covara', iTitle: 'Invita {n} su Covara', iTitleAll: 'Invita su Covara', iSub: 'Apre il link ed è nel tuo team. Il codice è nel link; vale 24 ore.',
      iText: 'Invia per SMS', iMail: 'Invia per email', iSent: 'Invito inviato a {n}.', msgNone: 'Nessuno del team ha ancora Covara, quindi i messaggi non arrivano nell’app. Invitali dalla loro sfera.' }
  };
  function t(k, p) { var s = (IT() ? S.it : S.en)[k] || S.en[k] || k; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function toast(m) { try { showToast(m); } catch (e) {} }
  function first(c) { return String((c && (c.first || c.last)) || '').split(/\s+/)[0]; }
  function authed() { try { return SyncEngine.isAuthenticated(); } catch (e) { return false; } }
  async function api(path, o) {
    var r = await SyncEngine.apiFetch(path, o || {});
    var d = {}; try { d = await r.json(); } catch (e) {}
    return { ok: r.ok, status: r.status, data: d };
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  document.documentElement.classList.add('cv');

  /* ── 1. The main screen: nothing but the logo, the name, HOME's sphere and the galaxy ── */
  var css = [
    /* Covara's deep blue, not Sentinel's black */
    'html.cv,html.cv body{background:radial-gradient(1100px 900px at 50% 42%,#1b3f7d 0,#0e2756 46%,#06142f 100%) fixed!important}',
    'html.cv .sphere-stage.network-mode{background:transparent!important}',
    /* every Sentinel control on the main screen goes: Covara has no buttons there */
    ['#exitBtn', '#settingsBtn', '#alertBell', '#alertPanel', '#backBtn', '#addPersonFab', '#importContactsFab', '#pulseBtn', '#clvToggle', '#helpFab', '#teamFab',
      '#sphereSize', '#guideTop', '#guideBottom', '.sentinel-guide', '#networkHint', '#dailyDigest', '.app-logo-tag', '#statusLabel', '.skip-link', '#svBadge', '.sv-badge',
      '#syncPrompt', '.sync-prompt', '.iso-btn', '.iso-x'].map(function (s) { return 'html.cv ' + s; }).join(',') + '{display:none!important}',
    /* the name across from the logo */
    '#cvName{position:fixed;top:max(18px,env(safe-area-inset-top,0px));right:max(16px,env(safe-area-inset-right,0px));z-index:60;color:#e8f2ff;font:700 13px/1.2 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.14em;text-align:right;max-width:60vw;pointer-events:none;text-shadow:0 0 12px rgba(56,189,248,.35)}',
    /* the rings: glass spheres, every one as transparent as ALERT, the icon in the middle */
    '#cvRing{position:fixed;inset:0;z-index:9000;display:none}#cvRing.on{display:block}',
    '.cvq{position:absolute;width:0;height:0;pointer-events:none}',
    '.cvq b{position:absolute;left:-23px;top:-23px;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;pointer-events:auto;cursor:pointer;',
    'background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.28) 0,rgba(150,210,255,.10) 32%,rgba(40,110,220,.06) 70%,rgba(20,60,140,.04) 100%);',
    'box-shadow:0 0 0 1.5px rgba(126,220,255,.85) inset,0 0 16px rgba(56,189,248,.45);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);animation:cvBreath 3.2s ease-in-out infinite}',
    '.cvq b img{width:24px;height:24px;display:block;object-fit:contain;pointer-events:none;filter:drop-shadow(0 0 4px rgba(120,210,255,.6));opacity:.95}',
    '.cvq b svg{width:22px;height:22px;display:block;stroke:#dff4ff;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 4px rgba(120,210,255,.6))}',
    '.cvq.alert b{box-shadow:0 0 0 1.5px #ff2a2a inset,0 0 16px rgba(255,40,40,.55);background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.26) 0,rgba(255,150,150,.10) 32%,rgba(220,30,40,.06) 70%,rgba(120,0,10,.04) 100%)}',
    '.cvq.alert b svg{stroke:#ffdede;filter:drop-shadow(0 0 4px rgba(255,80,80,.7))}',
    '.cvq.lit b{box-shadow:0 0 0 2px #ffd24d inset,0 0 18px rgba(255,210,77,.6)}',
    '.cvq i{position:absolute;top:-8px;font:600 12px/16px "Hanken Grotesk",system-ui,sans-serif;font-style:normal;color:#dff2ff;white-space:nowrap;letter-spacing:.02em;text-shadow:0 0 8px rgba(0,20,60,.9),0 0 14px rgba(56,189,248,.35);pointer-events:auto;cursor:pointer}',
    '.cvq.alert i{color:#ff6b6b;letter-spacing:.1em;font-weight:700}',
    '.cvq em{font-style:normal;margin-left:6px;font:700 10px "JetBrains Mono",monospace;color:#ffd24d}',
    '@keyframes cvBreath{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}',
    /* labels beside a sphere: small, unframed, transparent, staggered around it, never centred */
    '#cvLabels{position:fixed;inset:0;z-index:8990;pointer-events:none}',
    '.cvl{position:absolute;pointer-events:auto;cursor:pointer;padding:3px 2px;font:600 15px/18px "Hanken Grotesk",system-ui,sans-serif;color:#e6f5ff;white-space:nowrap;text-shadow:0 0 8px rgba(0,20,60,.95),0 0 16px rgba(56,189,248,.4);animation:cvFade 2.6s ease-in-out infinite}',
    '.cvl.alert{color:#ff5a5a;letter-spacing:.1em;font-weight:700}.cvl.gold{color:#ffd24d}',
    '@keyframes cvFade{0%,100%{opacity:1}50%{opacity:.78}}',
    /* glass cards (message, email, ALERT, team code): transparent glass with a glowing frame */
    '.cvc{position:fixed;inset:0;z-index:100040;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(6,15,36,.45)}',
    '.cvc .box{position:relative;width:min(420px,100%);padding:22px 18px 18px;border-radius:22px;border:1px solid rgba(150,210,255,.5);background:linear-gradient(155deg,rgba(70,130,235,.20),rgba(14,30,78,.34));-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 0 22px rgba(70,150,255,.3);color:#eef6ff;font-family:"Hanken Grotesk",system-ui,sans-serif}',
    '.cvc h2{margin:0 0 6px;font-size:19px;font-weight:800}.cvc p{margin:0 0 12px;color:#cfe3ff;font-size:14px;line-height:1.4}.cvc .who{color:#ffd24d;font:600 12px "JetBrains Mono",monospace;letter-spacing:.06em;margin-bottom:12px}',
    '.cvc input,.cvc textarea{width:100%;box-sizing:border-box;border-radius:14px;border:1px solid rgba(150,200,255,.4);background:rgba(20,44,100,.3);color:#fff;font:500 16px "Hanken Grotesk",system-ui,sans-serif;padding:12px;resize:none;margin:0 0 10px}',
    '.cvc .go{width:100%;min-height:50px;border-radius:16px;border:0;background:linear-gradient(180deg,#7ee3ff,#38bdf8);color:#04203a;font:800 16px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer}.cvc .go[disabled]{opacity:.6}',
    '.cvc .x{position:absolute;top:10px;right:10px;width:40px;height:40px;border-radius:50%;border:1px solid rgba(150,210,255,.45);background:transparent;color:#eef6ff;font-size:22px;cursor:pointer}',
    '.cvc .ilist{max-height:240px;overflow-y:auto;overscroll-behavior:contain;margin:0 0 12px;scrollbar-width:thin;scrollbar-color:rgba(255,210,77,.45) transparent}',
    '.cvc .irow{display:flex;align-items:center;gap:10px;min-height:40px;padding:2px 4px;cursor:pointer;color:#ffd24d;font:600 14px "Hanken Grotesk",system-ui,sans-serif}.cvc .irow.off{opacity:.45}',
    '.cvc .irow i{flex:0 0 28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:700 10px "JetBrains Mono",monospace;font-style:normal;color:#04203a;background:radial-gradient(circle at 34% 28%,#e8fbff 0,#7ee3ff 35%,#38bdf8 70%,#1e6fb8 100%);background-size:cover;background-position:center}',
    '.cvc .irow b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}.cvc .irow small{display:block;color:#cfe3ff;font:500 11px "JetBrains Mono",monospace;overflow:hidden;text-overflow:ellipsis}',
    '.cvc .irow em{flex:0 0 20px;height:20px;border-radius:6px;border:1.5px solid #ffd24d;font-style:normal;text-align:center;line-height:18px;color:#04203a;font-size:13px}.cvc .irow:not(.off) em{background:#ffd24d}',
    '.cvc .iall{margin:0 0 6px;color:#dff2ff;font:600 13px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer}',
    '.cvc .code{font:800 34px "JetBrains Mono",monospace;letter-spacing:.12em;text-align:center;color:#ffd24d;margin:6px 0 14px;user-select:all;-webkit-user-select:all}',
    '.cvc.red .box{border-color:rgba(255,80,90,.75);background:linear-gradient(155deg,rgba(150,20,40,.30),rgba(40,6,16,.42));box-shadow:0 0 26px rgba(255,40,60,.35)}',
    '.cvc .hold{position:relative;display:block;margin:6px auto 12px;width:170px;height:170px;border-radius:50%;border:2px solid #ff2a2a;background:rgba(255,40,40,.08);color:#fff;font:800 15px "Hanken Grotesk",sans-serif;cursor:pointer;touch-action:none}',
    '.cvc .hold svg{position:absolute;inset:-6px;width:182px;height:182px;transform:rotate(-90deg)}.cvc .hold circle{fill:none;stroke:#ffd24d;stroke-width:5}',
    '.cvc .msg{min-height:20px;color:#ffe3a8;font-size:14px;text-align:center}.cvc .cx{display:block;margin:0 auto;min-height:42px;padding:0 24px;border-radius:21px;border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;font:700 14px "Hanken Grotesk",sans-serif;cursor:pointer}',
    /* 26 Oct RULE: nothing slides up from the bottom of the screen. Every card and every short message appears
       directly beneath the logo at the upper left, as a transparent glass card. */
    'html.cv{--cvTop:calc(max(10px,env(safe-area-inset-top,0px)) + 64px);--cvLeft:max(12px,env(safe-area-inset-left,0px));--cvW:min(420px,calc(100vw - 24px))}',
    'html.cv .cvc,html.cv .ui-confirm-overlay,html.cv .quick-dial-overlay{align-items:flex-start!important;justify-content:flex-start!important;padding:var(--cvTop) 12px 16px var(--cvLeft)!important;background:rgba(6,15,36,.28)!important}',
    'html.cv .cvc .box{width:var(--cvW)}',
    'html.cv .ui-confirm-box,html.cv .quick-dial{width:var(--cvW)!important;max-width:none!important;background:linear-gradient(155deg,rgba(70,130,235,.20),rgba(14,30,78,.34))!important;border:1px solid rgba(150,210,255,.5)!important;border-radius:20px!important;-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 0 22px rgba(70,150,255,.3)!important}',
    'html.cv .sentinel-toast,html.cv #swUpdateBanner,html.cv .lib-pill{top:var(--cvTop)!important;bottom:auto!important;left:var(--cvLeft)!important;right:auto!important;transform:none!important;max-width:var(--cvW)!important;text-align:left!important;',
    'background:linear-gradient(155deg,rgba(70,130,235,.24),rgba(14,30,78,.38))!important;color:#eef6ff!important;border:1px solid rgba(150,210,255,.55)!important;border-radius:16px!important;padding:10px 14px!important;font:600 14px/1.35 "Hanken Grotesk",system-ui,sans-serif!important;-webkit-backdrop-filter:blur(14px)!important;backdrop-filter:blur(14px)!important;box-shadow:0 0 18px rgba(70,150,255,.3)!important}',
    /* the message thread: a glass card under the logo, not a dark drawer */
    'html.cv .sentinel-msg-overlay{background:rgba(6,15,36,.28)!important;-webkit-backdrop-filter:blur(3px)!important;backdrop-filter:blur(3px)!important}',
    'html.cv .sentinel-msg-panel{position:fixed!important;top:var(--cvTop);left:var(--cvLeft);width:var(--cvW)!important;height:min(560px,calc(100dvh - var(--cvTop) - 16px))!important;border-radius:20px;border:1px solid rgba(150,210,255,.5)!important;overflow:hidden;',
    'background:linear-gradient(155deg,rgba(70,130,235,.22),rgba(14,30,78,.42))!important;-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 0 22px rgba(70,150,255,.3);transform:translateY(-8px)!important;opacity:0;transition:transform .25s ease,opacity .25s ease!important}',
    'html.cv .sentinel-msg-overlay.open .sentinel-msg-panel{transform:none!important;opacity:1}',
    'html.cv.cv-sending .sentinel-msg-overlay{opacity:0!important}',
    /* one thing at a time under the logo: a card or a message there sets aside what was there, and the labels beside a sphere wait behind it */
    'html.cv .sentinel-msg-overlay{z-index:9500!important}',
    '#cvRoster{position:fixed;right:max(10px,env(safe-area-inset-right,0px));bottom:max(14px,env(safe-area-inset-bottom,0px));z-index:8980;width:min(168px,40vw);font-family:"Hanken Grotesk",system-ui,sans-serif}#cvRoster[hidden]{display:none}',
    '#cvRoster .cvro-list{max-height:150px;scroll-snap-type:y mandatory;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:rgba(255,210,77,.45) transparent;-webkit-mask-image:linear-gradient(180deg,#000 88%,transparent);mask-image:linear-gradient(180deg,#000 88%,transparent)}',
    '.cvro-btns{display:flex;gap:8px;margin-top:8px}.cvro-b{flex:1;text-align:center;padding:6px 0;border-radius:14px;border:1px solid rgba(255,210,77,.55);background:rgba(20,44,100,.28);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#ffd24d;font:700 12px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer}.cvro-b.on{border-color:rgba(255,90,90,.8);color:#ff8a8a}',
    '.cvro-hint{margin-top:4px;color:#ff8a8a;font:600 11px "Hanken Grotesk",system-ui,sans-serif;text-shadow:0 0 8px rgba(0,20,60,.9)}#cvRoster:has(.cvro-b.on) .cvro-row{color:#ff9d9d;opacity:1}',
    '.cvro-row{scroll-snap-align:start;display:flex;align-items:center;gap:8px;height:30px;padding:0 4px;cursor:pointer;color:#ffd24d;opacity:.72;font-size:13px;font-weight:600;white-space:nowrap;text-shadow:0 0 8px rgba(0,20,60,.9)}',
    '.cvro-row span{overflow:hidden;text-overflow:ellipsis}.cvro-row.on{opacity:1}.cvro-row:hover{opacity:1}',
    '.cvro-row i{flex:0 0 22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:700 9px "JetBrains Mono",monospace;font-style:normal;color:#04203a;background:radial-gradient(circle at 34% 28%,#e8fbff 0,#7ee3ff 35%,#38bdf8 70%,#1e6fb8 100%);background-size:cover;background-position:center;box-shadow:0 0 8px rgba(56,189,248,.5)}',
    '.cvro-row.on i{box-shadow:0 0 0 1.5px #ffd24d,0 0 10px rgba(255,210,77,.55)}',
    'html.cv:has(.cvc) #cvRoster,html.cv:has(.contact-modal-overlay.open) #cvRoster,html.cv:has(.settings-panel.open) #cvRoster,html.cv:has(.sentinel-msg-overlay.open) #cvRoster,html.cv:has(#cvRing.on) #cvRoster{visibility:hidden}',
    /* the labels and the ring wait behind any card that is open */
    'html.cv:has(.contact-modal-overlay.open) #cvLabels,html.cv:has(.contact-modal-overlay.open) #cvRing,html.cv:has(.quick-dial-overlay.open) #cvLabels,html.cv:has(.ui-confirm-overlay) #cvLabels,html.cv:has(.settings-panel.open) #cvLabels,html.cv:has(.settings-panel.open) #cvRing{visibility:hidden!important}',
    /* Edit Person: a transparent glass card under the logo */
    'html.cv .contact-modal-overlay{z-index:9600!important;align-items:flex-start!important;justify-content:flex-start!important;padding:var(--cvTop) 12px 16px var(--cvLeft)!important;background:rgba(6,15,36,.28)!important}',
    'html.cv .contact-modal{width:var(--cvW)!important;max-width:none!important;max-height:calc(100dvh - var(--cvTop) - 16px)!important;background:linear-gradient(155deg,rgba(70,130,235,.22),rgba(14,30,78,.42))!important;border:1px solid rgba(150,210,255,.5)!important;border-radius:20px!important;-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 0 22px rgba(70,150,255,.3)!important}',
    'html.cv .contact-modal input,html.cv .contact-modal textarea,html.cv .contact-modal select{background:rgba(20,44,100,.3)!important;border-color:rgba(150,200,255,.4)!important;color:#fff!important}',
    'html.cv #dreamBrief,html.cv #dreamComm{display:none!important}',   /* no communication card: the words are part of the dream state */
    'html.cv .settings-panel{inset:auto!important;top:var(--cvTop)!important;left:var(--cvLeft)!important;width:var(--cvW)!important;max-height:calc(100dvh - var(--cvTop) - 16px)!important;border-radius:20px;border:1px solid rgba(150,210,255,.5);',
    'background:linear-gradient(155deg,rgba(70,130,235,.22),rgba(14,30,78,.42))!important;-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 0 22px rgba(70,150,255,.3);padding:0 14px 14px!important;box-sizing:border-box}',
    'html.cv .settings-home-row{background:rgba(255,255,255,.05)!important;border-color:rgba(150,210,255,.28)!important}html.cv .settings-home-row[data-cat=circle]{display:none!important}',
    'html.cv .settings-panel .settings-card,html.cv .settings-panel .settings-section > div{background-color:transparent}',
    'html.cv:has(.sentinel-toast) #dreamBrief,html.cv:has(.cvc) #dreamBrief,html.cv:has(.sentinel-msg-overlay.open) #dreamBrief{opacity:0!important;transition:opacity .2s}',
    'html.cv:has(.sentinel-msg-overlay.open) #cvLabels,html.cv:has(.cvc) #cvLabels{visibility:hidden}'
  ].join('');
  var st = document.createElement('style'); st.id = 'cvStyle'; st.textContent = css; document.head.appendChild(st);

  /* a control answers on release: down and up on the same control, with no wait for a click event */
  function press(node, fn) {
    var d = null;
    node.addEventListener('pointerdown', function (e) { e.stopPropagation(); if (e.button > 0) return; d = { x: e.clientX, y: e.clientY }; try { node.setPointerCapture(e.pointerId); } catch (x) {} });
    node.addEventListener('pointerup', function (e) { e.stopPropagation(); var o = d; d = null; if (!o || Math.hypot(e.clientX - o.x, e.clientY - o.y) > 16) return; e.preventDefault(); fn(); });
    node.addEventListener('pointercancel', function () { d = null; });
    node.addEventListener('click', function (e) { e.stopPropagation(); e.preventDefault(); });
    node.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
  }

  /* the user's own name, in full and in capitals, across from the logo */
  var nameEl = document.createElement('div'); nameEl.id = 'cvName';
  function myName() {
    var n = ''; try { n = (SyncEngine.getStatus() || {}).displayName || ''; } catch (e) {}
    try { if (!n && typeof userSphereName !== 'undefined') n = userSphereName || ''; } catch (e) {}
    return String(n || '').trim();
  }
  function placeName() {
    if (!document.body) return;
    if (!nameEl.parentNode) document.body.appendChild(nameEl);
    var on = typeof appState !== 'undefined' && appState === 'network';
    var n = on ? myName().toUpperCase() : '';
    if (nameEl.textContent !== n) nameEl.textContent = n;
  }

  /* After the access code, the intro and the first name, Covara opens on the galaxy every time */
  function onboarded() { return lsGet('rc:obDone') === '1'; }
  function toGalaxy() {
    try {
      if (appState === 'self' && onboarded() && !overlayOpen && !blufOpen && document.getElementById('stage') && document.getElementById('stage').style.display !== 'none') enterNetwork();
    } catch (e) {}
  }

  /* Sentinel's extras that Covara does not have on its main screen */
  function quiet() {
    try { _enterRestMode = function () {}; } catch (e) {}           /* no idle "rest mode" that cycles through people (it flashed spheres into the dream state) */
    try { drawQuickActionIcons = function () {}; } catch (e) {}     /* the labels beside a sphere are Covara's (below), not Sentinel's icons */
    try { openBluf = function () {}; } catch (e) {}                 /* no cards: everything is reached from the spheres */
    try { enterDetail = function () {}; } catch (e) {}
    try { var gh = getContactHeadline; getContactHeadline = function (c) { var h = gh(c); try { var nl = I18n.t('hl.new'); if (h && (h === nl || h === I18n.t('hl.s4') || /^(NOTHING LOGGED YET|ALL GOOD)$/i.test(h))) return ''; } catch (e) {} return h; }; } catch (e) {}
    try { sphereLabel = function (c) { return [c && c.first, c && c.last].filter(function (x) { return x && String(x).trim() && x !== '\u200b'; }).join(' ').trim(); }; } catch (e) {}   /* first and last name */
    /* 26 Oct: the name wraps around the bottom of the sphere, reading left to right, so it reads as part of it */
    window.CovaraArcName = function (ctx, text, sx, sy, r, fs, node) {
      if (!text) return;
      if (node && window.__cvNames && !window.__cvNames[node.contact.id]) return;   /* large team: names on the front spheres only */
      ctx.save();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#ffffff';   /* names on the spheres are white */
      var R0 = r + fs * 0.95, widths = [], total = 0, sp = fs * 0.06;
      for (var i = 0; i < text.length; i++) { var w = ctx.measureText(text[i]).width + sp; widths.push(w); total += w; }
      var span = total / R0;
      if (span > Math.PI * 1.15) { R0 = total / (Math.PI * 1.15); span = Math.PI * 1.15; }
      var a = Math.PI / 2 + span / 2;
      for (var j = 0; j < text.length; j++) {
        var half = widths[j] / 2 / R0; a -= half;
        ctx.save(); ctx.translate(sx + R0 * Math.cos(a), sy + R0 * Math.sin(a)); ctx.rotate(a - Math.PI / 2);
        ctx.fillText(text[j], 0, 0); ctx.restore();
        a -= half;
      }
      ctx.restore();
    };
    try { Object.keys(SentinelGuide).forEach(function (k) { if (typeof SentinelGuide[k] === 'function') SentinelGuide[k] = function () {}; }); } catch (e) {}
    /* a tap on HOME opens the ring of 7 at once (below); Sentinel's own late, double-tap-timed route is closed */
    try { SentinelViews.openPanel = function () {}; } catch (e) {}
    homeTap();
    whereToggleFirst();
  }
  /* 26 Oct (responsiveness): one tap or click on HOME opens the ring immediately, every time. Sentinel waited
     300 ms to tell a single tap from a double tap; a second click inside that time cancelled the opening. */
  function homeTap() {
    var down = null;
    function onHome(x, y) {
      try {
        if (appState !== 'network' || document.querySelector('.cvc,.sentinel-msg-overlay.open,.settings-panel.open')) return false;
        var g = geo(), r = CV.getBoundingClientRect();
        return Math.hypot(x - (r.left + g.cx), y - (r.top + g.cy)) <= g.cR * 1.08;
      } catch (e) { return false; }
    }
    window.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      down = onHome(e.clientX, e.clientY) && (!e.target.closest || !e.target.closest('#cvRing .cvq,#cvLabels,.cvc')) ? { x: e.clientX, y: e.clientY, t: Date.now() } : null;
    }, true);
    window.addEventListener('pointerup', function (e) {
      var d = down; down = null;
      if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 12 || Date.now() - d.t > 900) return;
      var wasOpen = ring.isOpen();
      if (wasOpen && ring.age() < 600) return;          /* a double click opens it once; it does not open and shut */
      try { if (typeof sphereTapTimer !== 'undefined' && sphereTapTimer) { clearTimeout(sphereTapTimer); sphereTapTimer = null; sphereTapTarget = null; } } catch (x) {}
      setTimeout(function () {
        try { if (typeof sphereTapTimer !== 'undefined' && sphereTapTimer) { clearTimeout(sphereTapTimer); sphereTapTimer = null; sphereTapTarget = null; } } catch (x) {}
        if (wasOpen) ring.close(); else ring.show(null);
      }, 0);
    }, true);
  }
  function avoidAreas() {
    var out = [];
    try { window.__cvRB = roster.box(); } catch (e) { window.__cvRB = null; }
    try {
      if (focusedContactId == null || appState !== 'network') { window.__cvAvoid = out; return; }
      var rect = CV.getBoundingClientRect();
      var els = Array.prototype.slice.call(document.querySelectorAll('#cvLabels .cvl'));
      var n = NODES.filter(function (q) { return q.contact.id === focusedContactId; })[0];
      if (n && els.length) {
        var pn = projectNode(n);
        var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        els.forEach(function (b) { var r = b.getBoundingClientRect(); x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); });
        if (pn) { var rr = n.r * pn.scale * FOCUS_SCALE; x0 = Math.min(x0, rect.left + pn.sx - rr); x1 = Math.max(x1, rect.left + pn.sx + rr); y0 = Math.min(y0, rect.top + pn.sy - rr); y1 = Math.max(y1, rect.top + pn.sy + rr); }
        out.push({ x: x0 - rect.left, y: y0 - rect.top, w: x1 - x0, h: y1 - y0 });
      }
      if (_wordsBox) out.push(_wordsBox);
    } catch (e) {}
    window.__cvAvoid = out;
  }
  function frontNames() {
    avoidAreas();
    try {
      if (NODES.length <= 12) { window.__cvNames = null; return; }
      var withZ = NODES.map(function (n) { return { n: n, z: projectNode(n).z }; }).sort(function (a, b) { return a.z - b.z; });
      var ok = {}; withZ.slice(0, 10).forEach(function (x) { ok[x.n.contact.id] = 1; });
      Object.keys(_attn).forEach(function (k) { ok[k] = 1; });
      if (focusedContactId != null) ok[focusedContactId] = 1;
      window.__cvNames = ok;
    } catch (e) { window.__cvNames = null; }
  }
  /* 26 Oct: when a teammate is chosen, the newest messages and notes appear on the left as part of the dream
     state: soft, breathing words over the background, the newest first, older ones fading; no card or frame. */
  var _words = { id: null, at: 0, items: [] }, _wordsBox = null;
  async function loadWords(c) {
    var items = [];
    try {
      var d = await RemielDB.getSetting('sentinelMsg_' + c.id), th = Array.isArray(d) ? d : (d && Array.isArray(d.value) ? d.value : []);
      th.forEach(function (m) { if (m && m.text) items.push({ ts: m.ts || 0, who: m.from === 'center' ? (IT() ? 'Tu' : 'You') : first(c), text: m.text }); });
    } catch (e) {}
    try {
      var ints = await RemielDB.getInteractionsByContact(c.id);
      (ints || []).forEach(function (x) { var tx = x.note || x.text || x.notes; if (tx && (x.type === 'note' || !x.type)) items.push({ ts: x.ts || x.timestamp || x.createdAt || 0, who: IT() ? 'Nota' : 'Note', text: tx }); });
    } catch (e) {}
    items.sort(function (a, b) { return b.ts - a.ts; });
    _words = { id: c.id, at: Date.now(), items: items.slice(0, 4) };
  }
  function when(ts) {
    try {
      var d = new Date(ts), now = new Date(), loc = IT() ? 'it-IT' : 'en-US';
      var tm = d.toLocaleTimeString(loc, { hour: 'numeric', minute: '2-digit' });
      if (d.toDateString() === now.toDateString()) return tm;
      return d.toLocaleDateString(loc, { weekday: 'short' }) + ' ' + tm;
    } catch (e) { return ''; }
  }
  function wrapText(ctx, text, maxW) {
    var words = String(text).split(/\s+/), lines = [], line = '';
    words.forEach(function (w) { var tryL = line ? line + ' ' + w : w; if (ctx.measureText(tryL).width > maxW && line) { lines.push(line); line = w; } else line = tryL; });
    if (line) lines.push(line);
    return lines;
  }
  function dreamWords(t) {
    var id = focusedContactId, dr = window._dreamRect;
    _wordsBox = null;
    if (id == null || !dr || appState !== 'network') return;
    try { if (WhereIs.mode() === 'whereis') return; } catch (e) {}
    var c = DEMO_CONTACTS.filter(function (x) { return x.id === id; })[0]; if (!c) return;
    if (_words.id !== id || Date.now() - _words.at > 4000) { _words.at = Date.now(); _words.id = id; loadWords(c); }
    if (_words.id !== id || !_words.items.length) return;
    var g = geo(), x0 = 18, x1 = Math.max(dr.cx - dr.r - 16, g.W * 0.46), w = x1 - x0;
    var top = 92, floor = (function () { var n = NODES.filter(function (q) { return q.contact.id === id; })[0]; if (!n) return g.H; var p = projectNode(n); return p.sy - n.r * p.scale * FOCUS_SCALE - 28; })();
    floor = Math.min(floor, g.cy - g.cR * 1.2);
    if (floor < top + 40) floor = Math.min(g.H - 20, top + 160);
    var breathe = 0.82 + 0.14 * Math.sin(t * 0.0012), y0w = top;
    ctx.save(); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(56,189,248,0.55)'; ctx.shadowBlur = 14;
    var y = top;
    for (var k = 0; k < _words.items.length && y < floor; k++) {
      var it = _words.items[k], fade = [1, 0.72, 0.52, 0.38][k] * breathe;
      var big = k === 0 ? Math.max(15, Math.min(22, Math.round(g.W / 26))) : Math.max(12, Math.min(16, Math.round(g.W / 34)));
      ctx.globalAlpha = 0.9 * fade; ctx.fillStyle = '#9fd8ff'; ctx.font = '600 ' + Math.max(10, big - 5) + 'px "JetBrains Mono",ui-monospace,monospace';
      ctx.fillText((it.who + '  ' + when(it.ts)).toUpperCase(), x0, y); y += big;
      ctx.globalAlpha = fade; ctx.fillStyle = '#eef8ff'; ctx.font = (k === 0 ? '500 ' : '400 ') + big + 'px "Hanken Grotesk",system-ui,sans-serif';
      var lines = wrapText(ctx, it.text, w).slice(0, k === 0 ? 5 : 2);
      for (var L = 0; L < lines.length && y + big < floor; L++) { ctx.fillText(lines[L], x0, y); y += big * 1.28; }
      y += big * 0.9;
    }
    ctx.restore();
    _wordsBox = { x: x0 - 6, y: y0w - 6, w: w + 12, h: Math.min(y, floor) - y0w + 6 };
  }
  /* WHEREIS was blocked: a teammate's sphere passing over the COMMUNICATION | WHEREIS words took the tap.
     The words now always take the tap, and they are drawn over the spheres so they are never hidden. */
  function whereToggleFirst() {
    try {
      var ht = hitTestNetwork;
      hitTestNetwork = function (x, y) {
        try {
          var h = window._dreamToggleHit, r = CV.getBoundingClientRect();
          if (h && focusedContactId != null) { var px = x - r.left, py = y - r.top; if (px >= h.x && px <= h.x + h.w && py >= h.y && py <= h.y + h.h) return null; }
        } catch (e) {}
        return ht(x, y);
      };
    } catch (e) {}
    try {
      var dn = drawNetworkView;
      drawNetworkView = function (t) {
        frontNames();
        dn(t);
        try { dreamWords(t); } catch (e) {}
        try { if (focusedContactId != null && window._dreamRect && typeof WhereIs !== 'undefined') ctx.setTransform(DPR, 0, 0, DPR, 0, 0), WhereIs.drawToggle(ctx, window._dreamRect, focusedContactId, window._dreamPillAvoid); } catch (e) {}
      };
    } catch (e) {}
  }

  /* ── 2. The team: everyone on a Covara team with this person, in either direction ── */
  var TEAM_TAG = 'covara';
  /* 26 Oct: everyone the user puts on the team is on screen at once, around HOME, whether or not they have
     Covara yet. Someone who has Covara is linked (their sphere can be messaged and ALERTed in the app); someone
     who has not yet is invited from their own sphere. Only Sentinel's sample people are left out. */
  var SAMPLE = { 1: 'Angela Rivera', 2: 'James Chen', 3: 'Marcus Williams', 4: 'Kim Nguyen', 5: 'Robert Okonkwo', 6: 'Dina Patel', 7: 'Tomás Mendez', 8: 'Sarah Kwon', 9: 'David Santos', 10: 'Lisa Nair', 11: 'Carlos Lopez', 12: 'Priya Sharma' };
  function sample(c) { var n = SAMPLE[c.id]; return !!n && !c.care && n.split(' ')[0] === c.first; }
  function people() { try { return DEMO_CONTACTS.filter(function (c) { return !sample(c) && !(c.care && c.care.state === 'ended'); }); } catch (e) { return []; } }
  function team() { return people().filter(function (c) { return c.care && c.care.userId; }); }   /* linked through Covara */
  function activeTeam() { return team().filter(function (c) { return c.care.state === 'active'; }); }
  function onCovara(c) { return !!(c && c.care && c.care.userId && c.care.state === 'active'); }
  function digits(x) { return String(x || '').replace(/\D/g, '').slice(-9); }
  /* someone the user added by hand who has now joined: the same sphere becomes linked (no second sphere) */
  function matchAdded(p) {
    var nm = String(p.name || '').trim().toLowerCase(), ph = digits(p.phone), em = String(p.email || '').trim().toLowerCase();
    return people().filter(function (c) {
      if (c.care && c.care.userId) return false;
      if (ph && ph.length >= 7 && digits(c.phone) === ph) return true;
      if (em && String(c.email || '').trim().toLowerCase() === em) return true;
      var full = [c.first, c.last].filter(Boolean).join(' ').trim().toLowerCase();
      return !!nm && (full === nm || (!c.last && String(c.first || '').toLowerCase() === nm.split(' ')[0]));
    })[0] || null;
  }
  var _photos = {};
  async function syncTeam() {
    if (!authed()) return;
    var r = await api('/care/links').catch(function () { return { ok: false }; });
    if (!r.ok) return;
    var me = ''; try { me = SyncEngine.getUserId(); } catch (e) {}
    var rows = [];
    (r.data.as_home || []).forEach(function (l) { if (l.away && l.away.id) rows.push({ l: l, p: l.away, side: 'home' }); });
    (r.data.as_away || []).forEach(function (l) { if (l.home && l.home.id) rows.push({ l: l, p: l.home, side: 'away' }); });
    rows = rows.filter(function (x) { return x.p.id !== me && (x.l.status === 'active' || (x.l.status === 'pending' && x.side === 'home')); });
    var seen = {}, changed = false;
    for (var i = 0; i < rows.length; i++) {
      var x = rows[i], p = x.p; if (seen[p.id]) continue; seen[p.id] = 1;
      var c = team().filter(function (k) { return k.care.userId === p.id; })[0] || matchAdded(p);
      var nm = String(p.name || '').trim().split(/\s+/);
      var care = { userId: p.id, linkId: x.l.id, side: x.side, state: x.l.status, relation: x.l.relation || '', tag: TEAM_TAG };
      if (!c) {
        c = { id: Date.now() + i, first: nm[0] || '?', last: nm.slice(1).join(' '), cat: 'family', sev: 4, phone: p.phone || '', email: p.email || '', sentinelId: p.sentinel_id || '', care: care };
        DEMO_CONTACTS.push(c); changed = true;
        try { await RemielDB.putContact(c); } catch (e) {}
      } else {
        var was = JSON.stringify([c.first, c.last, c.phone, c.email, c.sentinelId, c.care]);
        if (!c.care) { c.first = c.first || nm[0]; } else { c.first = nm[0] || c.first; c.last = nm.slice(1).join(' '); }
        if (p.phone) c.phone = p.phone; if (p.email) c.email = p.email; if (p.sentinel_id) c.sentinelId = p.sentinel_id; c.care = care;
        if (was !== JSON.stringify([c.first, c.last, c.phone, c.email, c.sentinelId, c.care])) { changed = true; try { await RemielDB.putContact(c); } catch (e) {} }
      }
      /* their picture or short video inside their sphere */
      if (p.sphere && _photos[c.id] !== p.sphere.split('?')[0]) {
        try {
          var pr = await SyncEngine.apiFetch(p.sphere);
          if (pr.ok) { var b = await pr.blob(); await SphereMedia.show(c.id, b); _photos[c.id] = p.sphere.split('?')[0]; }
        } catch (e) {}
      }
    }
    /* someone who left the team: back to a person on the user's team who is not on Covara (never deleted) */
    var gone = team().filter(function (c) { return !seen[c.care.userId]; });
    for (var g = 0; g < gone.length; g++) {
      delete gone[g].care;
      try { await RemielDB.putContact(gone[g]); } catch (e) {}
      changed = true;
    }
    if (changed) rebuild();
  }
  /* the whole team revolves around HOME; Sentinel's sample people never appear in Covara */
  function teamFilter() {
    try {
      SentinelViews.getFilteredContacts = function () { var k = new Set(); onScreen().forEach(function (c) { k.add(c.id); k.add(String(c.id)); }); return k; };
    } catch (e) {}
    /* a person added (or removed) the Sentinel way is on screen at once */
    try {
      /* a saved person who is not yet in the list is added a moment later, once Sentinel has had the chance to
         add them itself, so no one is ever listed twice (26 Oct: an import showed each new person twice) */
      var put = RemielDB.putContact, del = RemielDB.deleteContact, t0 = 0, waiting = [];
      var soon = function () {
        clearTimeout(t0);
        t0 = setTimeout(function () {
          try {
            waiting.splice(0).forEach(function (c) { if (!DEMO_CONTACTS.some(function (x) { return x.id === c.id; })) DEMO_CONTACTS.push(c); });
            var seen = {};
            for (var i = 0; i < DEMO_CONTACTS.length; i++) { var k = String(DEMO_CONTACTS[i].id); if (seen[k]) DEMO_CONTACTS.splice(i--, 1); else seen[k] = 1; }
          } catch (e) {}
          try { if (appState === 'network') rebuild(); } catch (e) {}
        }, 250);
      };
      RemielDB.putContact = function (c) { var r = put.apply(this, arguments); try { if (c) waiting.push(c); } catch (e) {} soon(); return r; };
      RemielDB.deleteContact = function () { var r = del.apply(this, arguments); soon(); return r; };
    } catch (e) {}
  }
  function rebuild() { try { if (typeof buildNodes === 'function') buildNodes(false); } catch (e) {} }

  /* ── 3. The galaxy: Sentinel's, smaller and closer, always moving, never over HOME ── */
  var ORBIT_PITCH = 0.78;            /* the galaxy is seen from a little above, so the team circles HOME */
  /* a large team on a tall, narrow screen (a phone) is seen more from the side, so its rings become bands
     stacked above and below HOME and use the screen's height */
  var _pitch = ORBIT_PITCH;
  function orbitPitch() { return _pitch; }
  function geo() {
    var W = CV.width / DPR, H = CV.height / DPR, cR = netCenterR(W, H);
    return { W: W, H: H, cx: W / 2, cy: H / 2, cR: cR, s0: NET_FOV / (NET_FOV + NET_DIST) };
  }
  /* 26 Oct (large teams): the people who need attention (a new message to HOME, an ALERT) are placed nearest
     HOME; everyone else further out. Every ring fits the screen; when a ring cannot grow any wider, the next
     ones sit above and below it, so no sphere ever leaves the screen. Spheres get smaller as the team grows. */
  var _attn = {};
  function layout() {
    try {
      var g = geo(), N = NODES.length; if (!N) return;
      var mul = typeof sphereSizeMul !== 'undefined' ? sphereSizeMul : 1;
      var f = N <= 8 ? 1 : N <= 16 ? 0.8 : 0.66, rS = g.cR * 0.40 * f;          /* sphere radius on screen */
      var order = NODES.slice().sort(function (a, b) { return (_attn[b.contact.id] ? 1 : 0) - (_attn[a.contact.id] ? 1 : 0); });
      /* does a ring of screen radius R at height ty stay fully on screen from every side as it turns? */
      _pitch = ORBIT_PITCH;
      /* a large team on a tall, narrow screen (a phone): a globe around HOME, as wide as the screen and as tall
         as it can be, turning; the people who need attention sit on its middle band, nearest HOME */
      if (N > 12 && g.W < g.H * 0.8) {
        _pitch = 0.22;
        var ax = g.W / 2 - rS * 1.15 - 10, ay = Math.min(g.H / 2 - rS - 96, ax * 2.1);
        var pts = [];
        for (var k = 0; k < N; k++) { var fy = 1 - 2 * (k + 0.5) / N, fr = Math.sqrt(Math.max(0, 1 - fy * fy)), th = k * 2.399963229728653; pts.push({ x: Math.cos(th) * fr * ax, z: Math.sin(th) * fr * ax, y: fy * ay, m: Math.abs(fy) }); }
        pts.sort(function (a, b) { return a.m - b.m; });
        order.forEach(function (n, k) {
          n._baseR = rS / g.s0; n.r = n._baseR * mul;
          if (n._cvSpot) return;
          n.tx = pts[k].x / g.s0; n.ty = pts[k].y / g.s0; n.tz = pts[k].z / g.s0;
        });
        return;
      }
      var cp = Math.cos(_pitch), sp = Math.sin(_pitch);
      function fits(R, ty) {
        for (var q = 0; q < 24; q++) {
          var a = q / 24 * Math.PI * 2, x = Math.cos(a) * R / g.s0, z = Math.sin(a) * R / g.s0, y = ty / g.s0;
          var y2 = y * cp - z * sp, z2 = y * sp + z * cp + NET_DIST, sc = NET_FOV / Math.max(60, NET_FOV + z2), rr = rS / g.s0 * sc * 1.15 + 14;
          var sx = x * sc + g.W / 2, sy = y2 * sc + g.H / 2;
          if (sx - rr < 4 || sx + rr > g.W - 4 || sy - rr < 70 || sy + rr > g.H - 6) return false;
        }
        return true;
      }
      function widest(ty) { var lo = g.cR * 1.2, hi = Math.max(g.W, g.H); if (!fits(lo, ty)) return lo; for (var b = 0; b < 18; b++) { var mid = (lo + hi) / 2; if (fits(mid, ty)) lo = mid; else hi = mid; } return lo; }
      var maxR = widest(0);
      var R = Math.min(maxR, g.cR * 1.16 + rS + 26), layer = 0, i = 0, ring = 0;
      while (i < order.length) {
        var cap = Math.max(4, Math.floor(2 * Math.PI * R / (rS * 2.9)));
        if (N <= 8) cap = 8;
        var m = Math.min(cap, order.length - i);
        var ty = layer === 0 ? (ring % 2 ? -1 : 1) * g.cR * 0.18 : (layer % 2 ? -1 : 1) * Math.ceil(layer / 2) * rS * 3.4;
        if (layer > 0) { R = Math.min(R, widest(ty)); cap = Math.max(4, Math.floor(2 * Math.PI * R / (rS * 2.9))); m = Math.min(cap, order.length - i); }
        for (var j = 0; j < m; j++, i++) {
          var n = order[i];
          n._baseR = (rS / g.s0); n.r = n._baseR * mul;
          if (n._cvSpot) continue;
          var a = (j / m) * Math.PI * 2 + ring * 0.45;
          n.tx = Math.cos(a) * R / g.s0; n.tz = Math.sin(a) * R / g.s0; n.ty = ty / g.s0;
        }
        ring++;
        var next = R + rS * 2.6;
        if (next <= maxR) R = next; else { R = maxR; layer++; }
      }
    } catch (e) {}
  }
  /* 26 Oct: the screen follows what HOME does. When the app opens, the 10 most active are on screen (latest
     message or note, newest first). Everyone HOME picks from the roster joins them at once, connected to HOME
     and revolving, and stays on screen until the app is closed. No Everyone-on-screen switch. */
  var SHOWN = 10, _act = {}, _picks = [];
  try { localStorage.removeItem('rc:pinned'); localStorage.removeItem('rc:everyone'); } catch (e) {}
  function pinned() { return _picks.slice(); }
  function ranked() {
    var pins = pinned(), all = people();
    return all.slice().sort(function (a, b) {
      var pa = pins.indexOf(String(a.id)), pb = pins.indexOf(String(b.id));
      if (pa >= 0 || pb >= 0) return (pa < 0 ? 1e9 : pa) - (pb < 0 ? 1e9 : pb);
      return (_act[b.id] || 0) - (_act[a.id] || 0) || nameKey(a).localeCompare(nameKey(b));
    });
  }
  function onScreen() { var r = ranked(), n = 0; return r.filter(function (c) { if (_picks.indexOf(String(c.id)) >= 0) return true; return n++ < SHOWN - _picks.length; }); }
  function nameKey(c) { var l = String(c.last || '').trim(), f = String(c.first || '').trim(); return ((l || f) + ' ' + f).toLowerCase(); }   /* no last name: sorted by the first name */
  function pin(c) {
    if (_picks.indexOf(String(c.id)) < 0) _picks.unshift(String(c.id));
    rebuild(); roster.paint();
  }
  /* who needs attention (a message to HOME in the last day not yet answered), and how recently each was active */
  async function attention() {
    var out = {}, act = {};
    var list = people();
    for (var i = 0; i < list.length; i++) {
      try {
        var d = await RemielDB.getSetting('sentinelMsg_' + list[i].id), th = Array.isArray(d) ? d : (d && Array.isArray(d.value) ? d.value : []);
        var last = th[th.length - 1];
        if (last) act[list[i].id] = last.ts || 0;
        if (last && last.from !== 'center' && Date.now() - (last.ts || 0) < 864e5) out[list[i].id] = 1;
      } catch (e) {}
      try { var ints = await RemielDB.getInteractionsByContact(list[i].id); (ints || []).forEach(function (x) { var ts = x.ts || x.timestamp || x.createdAt || 0; if (ts > (act[list[i].id] || 0)) act[list[i].id] = ts; }); } catch (e) {}
    }
    var shownBefore = onScreen().map(function (c) { return c.id; }).join();
    _act = act;
    var was = JSON.stringify(Object.keys(_attn).sort()), now = JSON.stringify(Object.keys(out).sort());
    _attn = out;
    if (onScreen().map(function (c) { return c.id; }).join() !== shownBefore) rebuild();
    else if (was !== now) layout();
    roster.paint();
  }

  /* ── The roster: the whole team, by last name then first name, ten at a time with scrolling, on the right.
     A tap on a name brings that person's sphere on screen. Shown when the team is larger than ten. ── */
  var roster = (function () {
    var el = document.createElement('div'); el.id = 'cvRoster';
    var sig = '', del = false;
    function photo(c) { try { var p = contactPhotos.get(c.id); return p && p.img && p.img.src && !p.isVideo ? p.img.src : ''; } catch (e) { return ''; } }
    function paint() {
      if (!document.body) return;
      var all = people();
      var show = typeof appState !== 'undefined' && appState === 'network';
      /* on a phone, the roster steps aside while someone is chosen, so their labels have the room */
      try { if (show && focusedContactId != null && window.innerWidth < 700) show = false; } catch (e) {}
      if (!show) { el.hidden = true; return; }
      if (!el.parentNode) document.body.appendChild(el);
      el.hidden = false;
      var on = {}; onScreen().forEach(function (c) { on[c.id] = 1; });
      var list = all.slice().sort(function (a, b) { return nameKey(a).localeCompare(nameKey(b)); });
      var s2 = list.map(function (c) { return c.id + (on[c.id] ? '+' : '') + photo(c).slice(-8); }).join() + IT() + del;
      if (s2 === sig) return; sig = s2;
      var top = el.querySelector('.cvro-list'), keep = top ? top.scrollTop : 0;
      el.innerHTML = '<div class="cvro-list">' + list.map(function (c) {
        var ph = photo(c), ini = ((c.first || '')[0] || '') + ((c.last || '')[0] || '');
        var nm = c.last ? esc(c.last) + ', ' + esc(c.first || '') : esc(c.first || '');
        return '<div class="cvro-row' + (on[c.id] ? ' on' : '') + '" role="button" tabindex="0" data-id="' + esc(c.id) + '"><i' + (ph ? ' style="background-image:url(' + ph + ')"' : '') + '>' + (ph ? '' : esc(ini.toUpperCase())) + '</i><span>' + nm + '</span></div>';
      }).join('') + '</div>' + (del ? '<div class="cvro-hint">' + esc(t('rPick')) + '</div>' : '') +
        '<div class="cvro-btns"><span class="cvro-b" role="button" tabindex="0" data-add>' + esc(t('rAdd')) + '</span><span class="cvro-b' + (del ? ' on' : '') + '" role="button" tabindex="0" data-del>' + esc(del ? t('rDelOn') : t('rDel')) + '</span></div>';
      el.querySelector('.cvro-list').scrollTop = keep;
      Array.prototype.forEach.call(el.querySelectorAll('.cvro-row'), function (row) {
        press(row, function () { var c = all.filter(function (x) { return String(x.id) === row.getAttribute('data-id'); })[0]; if (!c) return; if (del) deleteCard(c); else pin(c); });
      });
      press(el.querySelector('[data-add]'), function () { del = false; sig = ''; paint(); addCard(); });
      press(el.querySelector('[data-del]'), function () { del = !del; sig = ''; paint(); });
    }
    function box() { if (el.hidden || !el.parentNode) return null; var r = el.getBoundingClientRect(); return r.width ? r : null; }
    return { paint: paint, box: box };
  })();
  var __proj = null;
  function wrapGalaxy() {
    if (wrapGalaxy.done || typeof buildNodes !== 'function' || typeof projectNode !== 'function') return;
    wrapGalaxy.done = true;
    var bn = buildNodes; buildNodes = function (fresh) { bn(fresh); layout(); };
    var rt = rebuildNodeTargets; rebuildNodeTargets = function () { rt(); layout(); };
    /* The rule (26 Oct): the centre sphere is never covered by a revolving sphere. Whatever the turn, a sphere
       that would reach HOME's sphere is kept just outside it. */
    var pn = projectNode; __proj = function (node) { var p = pn(node); return p; };
    projectNode = function (node) {
      var p = pn(node);
      try {
        if (appState !== 'network') return p;
        var g = geo(), f = (focusedContactId === node.contact.id ? FOCUS_SCALE : 1);
        var r = node.r * p.scale * f, need = g.cR * 1.16 + r + 18;   /* room for the name wrapped under the sphere too */
        var dx = p.sx - g.cx, dy = p.sy - g.cy, d = Math.hypot(dx, dy);
        if (d < need) { if (d < 0.5) { dx = 0; dy = 1; d = 1; } p.sx = g.cx + dx / d * need; p.sy = g.cy + dy / d * need; }
        /* while someone is chosen, the other spheres stay off the dream picture, the words, the chosen person
           with their labels, and the logo and name at the top; a few passes settle any knock-on push */
        var rb = window.__cvRB;
        if (rb) {
          var cr = CV.getBoundingClientRect(), L0 = rb.left - cr.left - r - 6, T0 = rb.top - cr.top - r - 6;
          if (p.sx > L0 && p.sy > T0) { if (p.sx - L0 < p.sy - T0) p.sx = L0; else p.sy = T0; }
        }
        var dr = window._dreamRect;
        if (dr && focusedContactId != null && node.contact.id !== focusedContactId) {
          var rects = (window.__cvAvoid || []).concat([{ x: 0, y: 0, w: g.W, h: 70 }]);
          for (var pass = 0; pass < 4; pass++) {
            var ex = p.sx - dr.cx, ey = p.sy - dr.cy, ed = Math.hypot(ex, ey), en = dr.r + r + 6;
            if (ed < en) { if (ed < 0.5) { ex = -1; ey = 1; ed = Math.SQRT2; } p.sx = dr.cx + ex / ed * en; p.sy = dr.cy + ey / ed * en; }
            rects.forEach(function (q) {
              var L = q.x - r - 4, T = q.y - r - 4, Rr = q.x + q.w + r + 4, B = q.y + q.h + r + 4;
              if (p.sx > L && p.sx < Rr && p.sy > T && p.sy < B) {
                var dl = p.sx - L, dr2 = Rr - p.sx, dt = p.sy - T, db = B - p.sy, mn = Math.min(dl, dr2, dt, db);
                if (mn === dl) p.sx = L; else if (mn === dr2) p.sx = Rr; else if (mn === dt) p.sy = T; else p.sy = B;
              }
            });
            var hx = p.sx - g.cx, hy = p.sy - g.cy, hd = Math.hypot(hx, hy);
            if (hd < need) { p.sx = g.cx + hx / (hd || 1) * need; p.sy = g.cy + hy / (hd || 1) * need; }
            p.sx = Math.max(r + 2, Math.min(g.W - r - 2, p.sx)); p.sy = Math.max(r + 2, Math.min(g.H - r - 2, p.sy));
          }
        }
      } catch (e) {}
      return p;
    };
    layout();
  }
  /* alive: the galaxy keeps turning unless someone has been chosen or a finger is on it */
  function alive() {
    try {
      if (appState !== 'network') return;
      if (focusedContactId != null) return;
      if (!netDragging) { netSpin = true; netPitch += (orbitPitch() - netPitch) * 0.04; }
    } catch (e) {}
  }

  /* ── 4. HOME's ring of 7, and the sub-rings ── */
  var ICON = {
    contact: '<path d="M4 6h16v10H8l-4 4z"/>', health: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    journal: '<path d="M6 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6z"/><path d="M9 3v18M11.5 8h4M11.5 11h4"/>', tools: '<path d="M14.5 5.5a3.5 3.5 0 0 0-4.6 4.6L4 16l4 4 5.9-5.9a3.5 3.5 0 0 0 4.6-4.6l-2.2 2.2-2.4-.6-.6-2.4z"/>',
    where: '<path d="M12 21s-6-6.2-6-11a6 6 0 0 1 12 0c0 4.8-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>', covara: '<circle cx="12" cy="12" r="4.2"/><ellipse cx="12" cy="12" rx="9.5" ry="3.6" transform="rotate(-24 12 12)"/>',   /* a sphere in orbit; there is no "C" button in Covara */
    alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4.5M12 17.2v.3"/>',
    video: '<rect x="3" y="7" width="12" height="10" rx="2"/><path d="M15 11l6-3v8l-6-3z"/>', phone: '<path d="M6 3h3l1.5 4.5-2 1.3a11 11 0 0 0 6.7 6.7l1.3-2L21 15v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/>',
    message: '<path d="M4 6h16v10H8l-4 4z"/>', email: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 7l9 6 9-6"/>',
    notes: '<path d="M5 4h10l4 4v12H5z"/><path d="M14 4v5h5M8 13h8M8 16h6"/>', calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    daily: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>', alarms: '<circle cx="12" cy="13" r="7"/><path d="M12 10v3l2 1.5M5 4l2.5 2M19 4l-2.5 2"/>',
    invites: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 7l9 6 9-6M17 3v4M15 5h4"/>',
    camera: '<path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>', words: '<path d="M4 6h16M4 11h12M4 16h8"/><path d="M18 14v6M15 17h6"/>',
    mode: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="3.5"/>',
    speak: '<path d="M5 10v4h3l5 4V6L8 10z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>', broadcast: '<circle cx="12" cy="12" r="2"/><path d="M8 8a5.5 5.5 0 0 0 0 8M16 8a5.5 5.5 0 0 1 0 8M5.2 5.2a9.5 9.5 0 0 0 0 13.6M18.8 5.2a9.5 9.5 0 0 1 0 13.6"/>',
    code: '<path d="M7 8l-4 4 4 4M17 8l4 4-4 4M14 5l-4 14"/>', imp: '<circle cx="10" cy="8" r="3.5"/><path d="M3.5 20a6.5 6.5 0 0 1 13 0M19 8v7M16 12l3 3 3-3"/>', settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    hHealth: '<path d="M3 12h4l2-5 4 10 2-5h6"/>', visits: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M12 13v5M9.5 15.5h5"/>',
    meds: '<rect x="7" y="3" width="10" height="5" rx="1"/><rect x="6" y="8" width="12" height="13" rx="2"/><path d="M12 11.5v6M9 14.5h6"/>',
    records: '<path d="M4 7h6l2 2h8v10H4z"/><rect x="9" y="12" width="6" height="5" rx="1"/><path d="M10.5 12v-1.2a1.5 1.5 0 0 1 3 0V12"/>'
  };
  /* 26 Oct: Contact, Health, Journal, Tools and Covara use his own icons, white on a transparent background */
  var PIC = { contact: 1, health: 1, journal: 1, tools: 1, covara: 1 };
  function svg(k) {
    if (PIC[k]) return '<img src="icons/' + k + '.png?v=1" alt="" aria-hidden="true" draggable="false">';
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICON[k] || ICON.covara) + '</svg>';
  }
  function today() {
    var d = new Date(), loc = IT() ? 'it' : 'en-US';
    var day = d.toLocaleDateString(loc, { weekday: 'long' }); day = day.charAt(0).toUpperCase() + day.slice(1);
    return day + ' ' + (d.getHours() < 12 ? t('AM') : t('PM'));
  }
  function broadcastOn() { return lsGet('rc:broadcast') !== '0'; }
  function speakOn() { return lsGet('rc:speak') !== '0'; }
  function lab(k) {
    if (k === 'daily') return esc(today());
    if (k === 'broadcast') return esc(t('broadcast')) + '<em>' + (broadcastOn() ? t('on') : t('off')) + '</em>';
    if (k === 'speak') return esc(t('speak')) + '<em>' + (speakOn() ? t('on') : t('off')) + '</em>';
    return esc(t(k));
  }
  var SUB = {
    journal: ['notes', 'calendar', 'daily', 'alarms', 'invites'],
    tools: ['camera', 'words', 'mode'],
    covara: ['speak', 'broadcast', 'code', 'imp', 'settings']
  };
  var SIDE = { contact: { side: 'right', items: ['video', 'phone', 'message', 'email'] }, health: { side: 'left', items: ['hHealth', 'visits', 'meds', 'records'] } };

  var ring = (function () {
    var el = document.createElement('div'); el.id = 'cvRing';
    var level = null, opened = 0, rot = 0, raf = 0, items = [], last = 0;
    el.addEventListener('pointerdown', function (e) { e.stopPropagation(); el._bg = e.target === el; });
    el.addEventListener('pointerup', function (e) {
      if (Date.now() - opened < 350) return;
      if (e.target === el && el._bg) close();
      el._bg = false;
    });
    function keys() {
      if (level) return SUB[level];
      var k = ['contact', 'health', 'journal', 'tools', 'where', 'covara', 'alert'];
      /* Broadcast Contact OFF: once a teammate is on screen, Contact leaves the ring (reach them from their sphere) */
      if (!broadcastOn() && activeTeam().length) k = k.filter(function (x) { return x !== 'contact'; });
      return k;
    }
    function build() {
      el.innerHTML = ''; items = [];
      keys().forEach(function (k) {
        var q = document.createElement('div'); q.className = 'cvq' + (k === 'alert' ? ' alert' : '');
        q.innerHTML = '<b role="button" tabindex="0" aria-label="' + esc(t(k)) + '">' + svg(k) + '</b><i>' + lab(k) + '</i>';
        press(q.querySelector('b'), function () { pick(k); }); press(q.querySelector('i'), function () { pick(k); });
        el.appendChild(q); items.push({ k: k, q: q });
      });
    }
    function place() {
      var g = geo(), rect = CV.getBoundingClientRect(), n = items.length;
      var cx = rect.left + g.cx, cy = rect.top + g.cy;
      var R = g.cR * 1.08 + 30;                       /* close to HOME's sphere (26 Oct): the ring sits just outside its rim */
      items.forEach(function (it, i) {
        var a = -Math.PI / 2 + (i / n) * Math.PI * 2 + rot;
        var x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
        it.q.style.left = x + 'px'; it.q.style.top = y + 'px';
        var lab = it.q.querySelector('i'), right = Math.cos(a) >= 0;
        /* the name sits outside the ring, leaning away from HOME, never centred */
        lab.style.left = right ? '27px' : ''; lab.style.right = right ? '' : '27px';
        lab.style.top = (Math.sin(a) * 14 - 8) + 'px';
      });
    }
    function tick(ts) {
      raf = requestAnimationFrame(tick);
      var dt = last ? Math.min(50, ts - last) : 16; last = ts;
      rot += dt * (Math.PI * 2 / 90000);              /* slowly: one turn every 90 seconds */
      place();
    }
    function show(lv) {
      level = lv || null; build();
      if (!el.parentNode) document.body.appendChild(el);
      el.classList.add('on'); opened = Date.now();
      try { focusedContactId = null; } catch (e) {}
      labels.clear();
      cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(tick);
    }
    function close() { el.classList.remove('on'); cancelAnimationFrame(raf); level = null; }
    function isOpen() { return el.classList.contains('on'); }
    function toggle() { if (isOpen()) close(); else show(null); }
    function pick(k) {
      if (SUB[k]) { show(k); return; }
      if (SIDE[k]) { close(); labels.home(k); return; }
      close();
      run(k);
    }
    return { show: show, close: close, toggle: toggle, isOpen: isOpen, age: function () { return Date.now() - opened; }, rebuild: function () { if (isOpen()) build(); } };
  })();

  /* What each choice on HOME's own sphere does: on HOME's sphere it is for the whole team (Broadcast Contact) */
  function run(k) {
    var all = people(), tm = activeTeam();
    switch (k) {
      case 'video': if (!all.length) return toast(t('noTeam')); return callTeam(all, false);
      case 'phone': if (!all.length) return toast(t('noTeam')); return callTeam(all, true);
      case 'message': if (!all.length) return toast(t('noTeam')); if (!tm.length) return toast(t('msgNone')); return messageBox(tm);
      case 'email': if (!all.length) return toast(t('noTeam')); return emailBox(all, true);
      case 'alert': return alertCard(null);
      case 'broadcast': lsSet('rc:broadcast', broadcastOn() ? '0' : '1'); toast(broadcastOn() ? t('bcOn') : t('bcOff')); return;
      case 'speak': lsSet('rc:speak', speakOn() ? '0' : '1'); toast(speakOn() ? t('spOn') : t('spOff')); return;
      case 'code': return codeCard();
      case 'imp': return importContacts();
      case 'settings': try { SettingsPanel.open(); } catch (e) {} return;
      default: toast(t('soon', { x: k === 'daily' ? today() : t(k) }));
    }
  }
  /* Video call (or a voice-only call) to the whole team at once, with no second screen */
  function reachable(c) { try { return !!((c.sentinelId && /^[A-Za-z0-9]{8}$/.test(c.sentinelId)) || c.phone || c.email); } catch (e) { return false; } }
  function names(list) { var n = list.map(first); return n.length < 2 ? n.join('') : n.slice(0, -1).join(', ') + (IT() ? ' e ' : ' and ') + n[n.length - 1]; }
  function cantCall(list) { toast(t(list.length === 1 ? 'callOne' : 'callMany', { n: names(list) })); }
  function callTeam(tm, voice) {
    var ok = tm.filter(reachable), no = tm.filter(function (c) { return !reachable(c); });
    if (!ok.length) return cantCall(no);
    tm = ok;
    try {
      if (voice && typeof SentinelCall.setAudioOnlyNext === 'function') SentinelCall.setAudioOnlyNext(true);
      if (tm.length === 1) { runContactQuickAction('video', tm[0]); return; }
      SentinelCall.callGroup({ contactIds: tm.slice(0, 5).map(function (c) { return c.id; }), name: IT() ? 'Team' : 'Team' });
    } catch (e) {}
  }

  /* ── 5. Labels beside a sphere: Contact's 4 on the right of HOME, Health's 4 on the left, or a teammate's own ── */
  var labels = (function () {
    var el = document.createElement('div'); el.id = 'cvLabels';
    var mode = null, els = [], forId = null;
    function make(keys, onPick) {
      el.innerHTML = ''; els = [];
      keys.forEach(function (k) {
        var b = document.createElement('div'); b.className = 'cvl' + (k === 'alert' ? ' alert' : k === 'add' ? ' gold' : ''); b.setAttribute('role', 'button'); b.tabIndex = 0;
        b.textContent = mode === 'person' && (k === 'video' || k === 'phone') ? t(k === 'video' ? 'pVideo' : 'pPhone') : (k === 'where' ? t('where') : t(k));
        press(b, function () { onPick(k); });
        el.appendChild(b); els.push(b);
      });
      if (!el.parentNode) document.body.appendChild(el);
    }
    /* staggered around the circumference of the sphere, text left-aligned so each reads as part of it */
    function arrange(sx, sy, r, side) {
      var n = els.length, step = 26, top = -((n - 1) * step) / 2;   /* compact, still easy to tap */
      els.forEach(function (b, i) {
        var dy = top + i * step, off = Math.sqrt(Math.max(0, (r + 14) * (r + 14) - dy * dy * 0.55)) + 6;
        b.style.top = (sy + dy - 14) + 'px';
        if (side === 'left') { b.style.left = ''; b.style.right = (window.innerWidth - (sx - off)) + 'px'; b.style.textAlign = 'right'; }
        else { b.style.right = ''; b.style.left = (sx + off) + 'px'; b.style.textAlign = 'left'; }
      });
    }
    function home(k) {
      mode = 'home:' + k; forId = null;
      var spec = SIDE[k];
      make(spec.items, function (x) {
        if (k === 'contact') run(x);
        else toast(t('soon', { x: t(x) }));
      });
    }
    function person(c) {
      mode = 'person'; forId = c.id;
      var keys = ['video', 'phone', 'message', 'email', 'where', 'alert'];
      if (c.care && c.care.state === 'pending' && c.care.side === 'home') keys = ['add'];
      make(keys, function (x) { personPick(x, c); });
    }
    function clear() { mode = null; forId = null; el.innerHTML = ''; els = []; }
    function tick() {
      if (!mode) return;
      try {
        var g = geo(), rect = CV.getBoundingClientRect();
        if (mode === 'person') {
          var node = NODES.filter(function (n) { return n.contact.id === forId; })[0];
          if (!node || focusedContactId !== forId || appState !== 'network') { clear(); return; }
          var p = projectNode(node);
          arrange(rect.left + p.sx, rect.top + p.sy, node.r * p.scale * FOCUS_SCALE, 'right');   /* always on the right of the chosen sphere */
        } else {
          if (focusedContactId != null || appState !== 'network') { clear(); return; }
          arrange(rect.left + g.cx, rect.top + g.cy, g.cR * 1.1, SIDE[mode.slice(5)].side);
        }
      } catch (e) {}
    }
    return { home: home, person: person, clear: clear, tick: tick, mode: function () { return mode; }, forId: function () { return forId; } };
  })();

  /* A choice beside a teammate's sphere: for that one person. The labels stay until the next command (26 Oct). */
  function personPick(k, c) {
    switch (k) {
      case 'video': if (!reachable(c)) return cantCall([c]); try { runContactQuickAction('video', c); } catch (e) {} return;
      case 'phone': if (!c.phone) return reachable(c) ? toast(t('noPhone', { n: first(c) })) : cantCall([c]); try { runContactQuickAction('phone', c); } catch (e) {} return;
      case 'message': try { SentinelMessaging.openFor(c.id); } catch (e) {} return;
      case 'email': return emailBox([c], false);
      case 'where': try { WhereIs.setMode('whereis'); } catch (e) {} return;
      case 'alert': return alertCard(c);
      case 'add': return approve(c);
    }
  }
  async function approve(c) {
    var r = await api('/care/links/' + encodeURIComponent(c.care.linkId), { method: 'PUT', body: JSON.stringify({ approve: true, relation: c.care.relation || 'family', share: { location: 1, rooms: 1, falls: 1, care: 1, mood: 1, activity: 1 } }) }).catch(function () { return { ok: false }; });
    if (r.ok) { toast(t('added', { n: first(c) })); syncTeam().then(function () { var n = DEMO_CONTACTS.filter(function (x) { return x.id === c.id; })[0]; if (n && focusedContactId === c.id) labels.person(n); }); }
  }

  /* ── 6. Choosing a teammate: the galaxy turns, the chosen sphere comes forward to the lower left ── */
  var _fid = null, _aim = null, _spot = null;
  /* below HOME and HOME's name, low enough that the labels beside it never touch the name */
  function spotOf() { var g = geo(); return { x: g.W * 0.27, y: Math.min(g.H - 120, g.cy + g.cR * 1.15 + 146) }; }
  function aimAt(node) {
    try {
      var g = geo(), y0 = netYaw, best = null;
      /* 1. the turn that brings the chosen sphere nearest the viewer, on the left */
      for (var i = 0; i < 72; i++) {
        netYaw = y0 + i * Math.PI / 36; netPitch = orbitPitch();
        var q = projectNode(node), sc = q.z + Math.abs(q.sx - g.W * 0.3) * 2;
        if (!best || sc < best.s) best = { s: sc, yaw: netYaw };
      }
      netYaw = y0;
      /* 2. it settles in the clear space below HOME, left of centre, so its labels on the right never cross
            HOME or the dream picture */
      var sp = spotOf(), z2 = NET_DIST - 160, s = NET_FOV / (NET_FOV + z2);
      var xp = (sp.x - g.W / 2) / s, y2 = (sp.y - g.H / 2) / s, z2p = z2 - NET_DIST;
      var cp = Math.cos(orbitPitch()), spi = Math.sin(orbitPitch()), cy = Math.cos(best.yaw), sy = Math.sin(best.yaw);
      var y = y2 * cp + z2p * spi, z1 = -y2 * spi + z2p * cp;
      var x = xp * cy - z1 * sy, z = xp * sy + z1 * cy;
      restoreSpot();
      node._cvSpot = { tx: node.tx, ty: node.ty, tz: node.tz }; _spot = { node: node, x: x, y: y, z: z };
      node.tx = x; node.ty = y; node.tz = z;
      _aim = best;
    } catch (e) { _aim = null; }
  }
  function restoreSpot() { if (_spot && _spot.node._cvSpot) { var n = _spot.node; n.tx = n._cvSpot.tx; n.ty = n._cvSpot.ty; n.tz = n._cvSpot.tz; delete n._cvSpot; } _spot = null; }
  function steer() {
    if (_spot) { var n = NODES.filter(function (x) { return x.contact.id === _spot.node.contact.id; })[0]; if (n && n !== _spot.node) { _spot.node = n; n._cvSpot = { tx: n.tx, ty: n.ty, tz: n.tz }; } if (n) { n.tx = _spot.x; n.ty = _spot.y; n.tz = _spot.z; } }
    if (!_aim) return;
    var d = _aim.yaw - netYaw; d = Math.atan2(Math.sin(d), Math.cos(d));
    netYaw += d * 0.12; netPitch += (orbitPitch() - netPitch) * 0.12; netSpin = false; netVelYaw = 0; netVelPitch = 0;
    if (Math.abs(d) < 0.002) { netYaw = _aim.yaw; _aim = null; }
  }
  function mapFloor() {
    try {
      var where = focusedContactId != null && typeof WhereIs !== 'undefined' && WhereIs.mode() === 'whereis';
      document.documentElement.classList.toggle('cv-where', !!where);
      if (!where) { window.CovaraMapFloor = 0; return; }
      var n = NODES.filter(function (x) { return x.contact.id === focusedContactId; })[0]; if (!n) { window.CovaraMapFloor = 0; return; }
      var p = projectNode(n), sp = _spot ? spotOf() : { y: p.sy };
      window.CovaraMapFloor = Math.min(p.sy, sp.y) - n.r * p.scale * FOCUS_SCALE - 26;
    } catch (e) { window.CovaraMapFloor = 0; }
  }
  function focusTick() {
    mapFloor();
    var id = null; try { id = focusedContactId; } catch (e) {}
    var c = null; try { c = id != null ? DEMO_CONTACTS.filter(function (x) { return x.id === id; })[0] : null; } catch (e) {}
    if (!c || sample(c) || appState !== 'network') {
      if (_fid !== null) { _fid = null; _aim = null; restoreSpot(); if (labels.mode() === 'person') labels.clear(); try { if (WhereIs.mode() === 'whereis') WhereIs.setMode('comm'); } catch (e) {} }
      return;
    }
    if (_fid !== c.id) {
      _fid = c.id; ring.close();
      var node = NODES.filter(function (n) { return n.contact.id === c.id; })[0];
      if (node) aimAt(node);
      labels.person(c);
    }
    try { netSpin = false; } catch (e) {}
    steer();
  }

  /* ── 7. Cards: message, email, ALERT and team code (glass, transparent, with a glowing frame) ── */
  function card(html, red) {
    var old = document.getElementById('cvCard'); if (old) old.remove();
    var el = document.createElement('div'); el.id = 'cvCard'; el.className = 'cvc' + (red ? ' red' : ''); el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = '<div class="box"><button class="x" type="button" aria-label="' + esc(t('close')) + '">&times;</button>' + html + '</div>';
    el.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    el.addEventListener('click', function (e) { if (e.target === el) el.remove(); });
    el.querySelector('.x').onclick = function () { el.remove(); };
    document.body.appendChild(el);
    return el;
  }
  function messageBox(tm) {
    var el = card('<h2>' + esc(t('mTitle')) + '</h2><div class="who">' + tm.map(function (c) { return esc(first(c)); }).join(' · ') + '</div><textarea rows="4" placeholder="' + esc(t('mPh')) + '"></textarea><button class="go" type="button">' + esc(t('mSend')) + '</button>');
    var ta = el.querySelector('textarea'); setTimeout(function () { try { ta.focus(); } catch (e) {} }, 60);
    el.querySelector('.go').onclick = async function () {
      var txt = (ta.value || '').trim(); if (!txt) return toast(t('empty'));
      this.disabled = true; var n = 0;
      document.documentElement.classList.add('cv-sending');
      for (var i = 0; i < tm.length; i++) {
        try { await SentinelMessaging.openFor(tm[i].id); var inp = document.getElementById('sentinelMsgInput'); if (inp) { inp.value = txt; await SentinelMessaging.send(); n++; } } catch (e) {}
      }
      try { SentinelMessaging.close(); } catch (e) {}
      document.documentElement.classList.remove('cv-sending');
      el.remove(); toast(t('mSent', { n: n }));
    };
  }
  function myEmail() { try { var e = String((SyncEngine.getStatus() || {}).email || '').trim(); return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && !/@remiel\.local$/.test(e) ? e : ''; } catch (e) { return ''; } }
  function emailBox(people, all) {
    var w = people.filter(function (c) { return c.email && /@/.test(c.email); });
    if (!w.length) return toast(all ? t('eNoneAll') : t('eNone', { n: first(people[0]) }));
    var el = card('<h2>' + esc(all ? t('eAll') : t('eTitle')) + '</h2><div class="who">' + w.map(function (c) { return esc(first(c)); }).join(' · ') + '</div><input type="text" maxlength="150" placeholder="' + esc(t('eSubj')) + '"><textarea rows="5" placeholder="' + esc(t('ePh')) + '"></textarea><button class="go" type="button">' + esc(t('eSend')) + '</button>');
    setTimeout(function () { try { el.querySelector('input').focus(); } catch (e) {} }, 60);
    var go = el.querySelector('.go');
    go.onclick = async function () {
      var subj = el.querySelector('input').value.trim(), txt = el.querySelector('textarea').value.trim(), to = w.map(function (c) { return c.email.trim(); });
      if (!txt) return toast(t('empty'));
      go.disabled = true;
      var r = await api('/care-email', { method: 'POST', body: JSON.stringify({ to: to, subject: subj, text: txt, reply_to: myEmail() }) }).catch(function () { return { ok: false }; });
      go.disabled = false;
      if (r.ok) { el.remove(); return toast(t('eSent', { n: w.length === 1 ? first(w[0]) : String(r.data.sent || to.length) })); }
      if (r.status === 429) return toast(t('eLimit'));
      if (r.status === 501) { el.remove(); toast(t('eOwn')); location.href = 'mailto:' + to.map(encodeURIComponent).join(',') + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(txt); return; }
      toast(t('eFail'));
    };
  }
  /* ALERT: held for a moment so it is never sent by accident. On HOME's own sphere it goes to the whole team;
     on a teammate's sphere, to that one person only (25 Oct). */
  function alertCard(c) {
    var n = c ? first(c) : '';
    var el = card('<h2>' + esc(c ? t('aTitle', { n: n }) : t('aTitleAll')) + '</h2><p>' + esc(c ? t('aSub', { n: n }) : t('aSubAll')) + '</p>' +
      '<button type="button" class="hold"><svg viewBox="0 0 186 186"><circle cx="93" cy="93" r="88" stroke-dasharray="553" stroke-dashoffset="553"/></svg><span>' + esc(t('aHold')) + '</span></button>' +
      '<div class="msg" aria-live="assertive"></div><button type="button" class="cx">' + esc(t('cancel')) + '</button>', true);
    el.querySelector('.cx').onclick = function () { el.remove(); };
    var b = el.querySelector('.hold'), ringC = b.querySelector('circle'), lb = b.querySelector('span'), msg = el.querySelector('.msg'), t0 = 0, raf = 0, done = false;
    function stop() { cancelAnimationFrame(raf); t0 = 0; if (!done) { ringC.style.strokeDashoffset = '553'; lb.textContent = t('aHold'); } }
    function tick() { var k = Math.min(1, (Date.now() - t0) / 1200); ringC.style.strokeDashoffset = String(553 * (1 - k)); if (k >= 1) { done = true; fire(); return; } raf = requestAnimationFrame(tick); }
    b.addEventListener('pointerdown', function (e) { e.preventDefault(); if (done) return; t0 = Date.now(); lb.textContent = t('aHolding'); raf = requestAnimationFrame(tick); try { navigator.vibrate && navigator.vibrate(30); } catch (x) {} });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { b.addEventListener(ev, stop); });
    async function fire() {
      lb.textContent = '✓';
      var body = {}; if (c && c.care) body.to = c.care.userId;
      try { var pos = await new Promise(function (res) { if (!navigator.geolocation) return res(null); navigator.geolocation.getCurrentPosition(res, function () { res(null); }, { enableHighAccuracy: true, timeout: 4000, maximumAge: 30000 }); }); if (pos) { body.lat = pos.coords.latitude; body.lon = pos.coords.longitude; body.acc = pos.coords.accuracy; } } catch (e) {}
      var r = await api('/care-help', { method: 'POST', body: JSON.stringify(body) }).catch(function () { return { ok: false }; });
      msg.textContent = r.ok ? (c ? t('aSent', { n: n }) : t('aSentAll')) : t('aFail');
      setTimeout(function () { el.remove(); }, r.ok ? 2200 : 6000);
    }
  }
  /* Import Contacts (Covara > Import Contacts, 26 Oct): one press opens the contact list already on the phone.
     The people chosen come in with their names, numbers, email and photos. Anyone already on Covara is
     matched by number, email or name, and HOME decides for each one: Add (fill in what Covara is missing)
     or Replace (Covara takes the phone's latest details). Nothing is exported and no file is used. */
  function canPick() { try { return 'contacts' in navigator && 'select' in navigator.contacts; } catch (e) { return false; } }
  function splitName(full) { var p = String(full || '').trim().split(/\s+/); return { first: p[0] || '', last: p.slice(1).join(' ') }; }
  function fullName(c) { return [c.first, c.last].filter(Boolean).join(' ').trim(); }
  function existing(x) {
    var ph = digits(x.phone), em = String(x.email || '').trim().toLowerCase(), nm = fullName(x).toLowerCase();
    return people().filter(function (c) {
      if (ph && ph.length >= 7 && digits(c.phone) === ph) return true;
      if (em && String(c.email || '').trim().toLowerCase() === em) return true;
      return !!nm && fullName(c).toLowerCase() === nm;
    })[0] || null;
  }
  async function importContacts() {
    if (!canPick()) {
      card('<h2>' + esc(t('imp')) + '</h2><p>' + esc(t('impNo')) + '</p>');
      return;
    }
    var res;
    try {
      var props = ['name', 'tel', 'email'];
      try { var sup = await navigator.contacts.getProperties(); if (sup.indexOf('icon') >= 0) props.push('icon'); } catch (e) {}
      res = await navigator.contacts.select(props, { multiple: true });
    } catch (e) { if (e && e.name !== 'AbortError') toast(t('impFail')); return; }
    var list = (res || []).map(function (r) {
      var sp = splitName(r.name && r.name[0]);
      return { first: sp.first, last: sp.last, phone: (r.tel || [])[0] || '', email: (r.email || [])[0] || '', tels: r.tel || [], emails: r.email || [], photo: r.icon && r.icon[0] instanceof Blob ? r.icon[0] : null };
    }).filter(function (c) { return c.first; });
    if (list.length) choose(list);
  }
  function choose(list) {
    list.sort(function (a, b) { return nameKey(a).localeCompare(nameKey(b)); });
    list.forEach(function (x) { x.have = existing(x); });
    var on = list.map(function () { return true; }), urls = [];
    var el = card('<h2>' + esc(t('imp')) + '</h2><p>' + esc(t('impAsk')) + '</p>' +
      (list.length > 1 ? '<div class="iall" role="button" tabindex="0">' + esc(t('impAll')) + '</div>' : '') +
      '<div class="ilist">' + list.map(function (c, i) {
        var u = c.photo ? URL.createObjectURL(c.photo) : ''; if (u) urls.push(u);
        var ini = ((c.first || '')[0] || '') + ((c.last || '')[0] || '');
        return '<div class="irow" role="checkbox" tabindex="0" data-i="' + i + '"><i' + (u ? ' style="background-image:url(' + u + ')"' : '') + '>' + (u ? '' : esc(ini.toUpperCase())) + '</i><b>' +
          esc(c.last ? c.last + ', ' + c.first : c.first) + '<small>' + esc(c.have ? t('impHave') : [c.phone, c.email].filter(Boolean).join(' · ')) + '</small></b><em>✓</em></div>';
      }).join('') + '</div><button class="go" type="button" data-add></button>');
    var add = el.querySelector('[data-add]');
    function count() { var n = on.filter(Boolean).length; add.textContent = t('impGo', { n: n }); add.disabled = !n; }
    function closeIt() { urls.forEach(function (u) { try { URL.revokeObjectURL(u); } catch (e) {} }); el.remove(); }
    el.querySelector('.x').onclick = closeIt;
    Array.prototype.forEach.call(el.querySelectorAll('.irow'), function (row) {
      row.onclick = function () { var i = +row.getAttribute('data-i'); on[i] = !on[i]; row.classList.toggle('off', !on[i]); count(); };
    });
    var all = el.querySelector('.iall');
    if (all) all.onclick = function () { var to = on.some(function (x) { return !x; }); on = on.map(function () { return to; }); Array.prototype.forEach.call(el.querySelectorAll('.irow'), function (r) { r.classList.toggle('off', !to); }); count(); };
    count();
    add.onclick = async function () {
      var sel = list.filter(function (c, i) { return on[i]; });
      if (!sel.length) return toast(t('impNone'));
      add.disabled = true; add.textContent = t('impBusy');
      var fresh = sel.filter(function (c) { return !c.have; }), dup = sel.filter(function (c) { return c.have; }), r = { added: 0, photos: 0, ids: [] };
      if (fresh.length) {
        try { r = await SocialImport.addToCircle(fresh, function (c) { return extraNote(c); }, function (c) { return c.photo || null; }); }
        catch (e) { add.disabled = false; count(); return toast(t('impFail')); }
      }
      closeIt();
      (r.ids || []).forEach(function (id) { if (_picks.indexOf(String(id)) < 0) _picks.unshift(String(id)); });
      rebuild(); roster.paint();
      for (var k = 0; k < dup.length; k++) { if (!(await already(dup[k], r.added > 0))) break; }
      if (r.added) toast(t('impDone', { n: r.added }) + (r.photos ? ' ' + t('impPh', { n: r.photos }) : ''));
    };
  }
  function extraNote(x) {
    var more = (x.tels || []).filter(function (p) { return digits(p) !== digits(x.phone); }).concat((x.emails || []).filter(function (e) { return e !== x.email; }));
    return more.length ? (IT() ? 'Anche: ' : 'Also: ') + more.join(', ') : '';
  }
  /* one person already on Covara: Add or Replace. Closing the card leaves them as they are and stops here. */
  function already(x, quiet) {
    return new Promise(function (done) {
      var c = x.have, el = card('<h2>' + esc(fullName(c)) + '</h2><p>' + esc(t('impDupQ')) + '</p>' +
        '<button class="go" type="button" data-a>' + esc(t('impAdd')) + '</button><div style="height:10px"></div><button class="go" type="button" data-r>' + esc(t('impRep')) + '</button>');
      el.querySelector('.x').onclick = function () { el.remove(); done(false); };
      el.addEventListener('click', function (e) { if (e.target === el) done(false); });
      async function save(replace) {
        if (replace) {
          if (x.first) { c.first = x.first; c.last = x.last || ''; }
          if (x.phone) c.phone = x.phone;
          if (x.email) c.email = x.email;
        } else {
          if (!c.phone && x.phone) c.phone = x.phone;
          if (!c.email && x.email) c.email = x.email;
          if (!c.last && x.last && c.first === x.first) c.last = x.last;
        }
        var more = (x.tels || []).concat(x.emails || []).filter(function (v) { return v && digits(v) !== digits(c.phone) && v !== c.email && String(c.notes || '').indexOf(v) < 0; });
        if (more.length) c.notes = (c.notes ? c.notes + ' | ' : '') + (IT() ? 'Anche: ' : 'Also: ') + more.join(', ');
        c.updatedAt = Date.now();
        try { await RemielDB.putContact(c); } catch (e) {}
        var hasPic = false; try { hasPic = contactPhotos.has(c.id); } catch (e) {}
        if (x.photo && (replace || !hasPic)) {
          try {
            await RemielDB.putPhoto(c.id, x.photo);
            var im = new Image(); im.onload = function () { try { contactPhotos.set(c.id, { img: im, w: im.naturalWidth, h: im.naturalHeight }); } catch (e) {} }; im.src = URL.createObjectURL(x.photo);
            try { if (SyncEngine.syncPhotos && SyncEngine.isAuthenticated()) SyncEngine.syncPhotos(); } catch (e) {}
          } catch (e) {}
        }
        try { SyncEngine.markDirty(); } catch (e) {}
        el.remove(); rebuild(); roster.paint();
        if (!quiet) toast(t(replace ? 'impRepd' : 'impAddd', { n: first(c) }));
        done(true);
      }
      el.querySelector('[data-a]').onclick = function () { save(false); };
      el.querySelector('[data-r]').onclick = function () { save(true); };
    });
  }
  /* Roster > Add: one person by hand, on screen at once */
  function addCard() {
    var el = card('<h2>' + esc(t('aAddT')) + '</h2><input type="text" autocomplete="name" placeholder="' + esc(t('aName')) + '"><input type="tel" autocomplete="tel" placeholder="' + esc(t('aPhone')) + '"><input type="email" autocomplete="email" placeholder="' + esc(t('aMail')) + '"><button class="go" type="button">' + esc(t('aAdd')) + '</button>');
    var f = el.querySelectorAll('input'); setTimeout(function () { try { f[0].focus(); } catch (e) {} }, 60);
    el.querySelector('.go').onclick = async function () {
      var sp = splitName(f[0].value), x = { first: sp.first, last: sp.last, phone: f[1].value.trim(), email: f[2].value.trim() };
      if (!x.first) return toast(t('aNeed'));
      var have = existing(x);
      if (have) { el.remove(); x.have = have; await already(x); return; }
      this.disabled = true;
      var r = { added: 0, ids: [] };
      try { r = await SocialImport.addToCircle([x], function () { return ''; }, function () { return null; }); } catch (e) {}
      if (!r.added) { this.disabled = false; return toast(t('impFail')); }
      el.remove();
      if (_picks.indexOf(String(r.ids[0])) < 0) _picks.unshift(String(r.ids[0]));
      rebuild(); roster.paint();
      toast(t('added', { n: x.first }));
    };
  }
  /* Roster > Delete, then a name: asked once, then that person is gone from Covara on this phone. Someone
     linked on Covara also leaves the team (the link ends), so they do not come back. */
  function deleteCard(c) {
    var el = card('<h2>' + esc(t('dTitle', { n: fullName(c) })) + '</h2><p>' + esc(t(c.care && c.care.linkId ? 'dSubL' : 'dSub', { n: first(c) })) + '</p>' +
      '<button class="go" type="button" style="background:linear-gradient(180deg,#ff6b6b,#e11d2a);color:#fff">' + esc(t('dGo')) + '</button><div style="height:10px"></div><button type="button" class="cx">' + esc(t('cancel')) + '</button>', true);
    el.querySelector('.cx').onclick = function () { el.remove(); };
    el.querySelector('.go').onclick = async function () {
      this.disabled = true;
      if (c.care && c.care.linkId) {
        var r = await api('/care/links/' + encodeURIComponent(c.care.linkId), { method: 'DELETE' }).catch(function () { return { ok: false }; });
        if (!r.ok && r.status !== 404) { this.disabled = false; return toast(t('dFail')); }
      }
      try { await removeContactFromCircle(c.id); } catch (e) {}
      _picks = _picks.filter(function (x) { return x !== String(c.id); });
      el.remove(); rebuild(); roster.paint();
      toast(t('dDone', { n: first(c) }));
    };
  }
  /* Team code: one card for both sides. Your own code to give someone (it works for 24 hours), and a place
     to type the code someone gave you. A shared code also arrives as a link that joins by itself. */
  var _myCode = '';
  async function codeCard() {
    if (!authed()) { try { await SyncEngine.ensureIdentity(); } catch (e) {} }
    var r = await api('/care/code', { method: 'POST' }).catch(function () { return { ok: false }; });
    var code = r.ok && r.data.code ? String(r.data.code) : '';
    _myCode = code;
    var el = card('<h2>' + esc(t('cTitle')) + '</h2>' +
      (code ? '<p>' + esc(t('cSub')) + '</p><div class="code">' + esc(code) + '</div><button class="go" type="button" data-share>' + esc(t('cShare')) + '</button>' : '<p>' + esc(t('cFail')) + '</p>') +
      '<h2 style="margin-top:20px">' + esc(t('jTitle')) + '</h2><p>' + esc(t('jSub')) + '</p>' +
      '<input type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="' + esc(t('jPh')) + '" style="font:800 22px \'JetBrains Mono\',monospace;letter-spacing:.2em;text-align:center">' +
      '<button class="go" type="button" data-join>' + esc(t('jGo')) + '</button>');
    var sh = el.querySelector('[data-share]');
    if (sh) sh.onclick = async function () {
      var link = 'https://beverly-index.com/covara/?join=' + code;
      var text = (IT() ? 'Entra nel mio team Covara. Codice: ' : 'Join my Covara team. Code: ') + code + '  ' + link;
      try { if (navigator.share) { await navigator.share({ text: text }); return; } } catch (e) { return; }
      try { await navigator.clipboard.writeText(text); toast(t('cCopied')); } catch (e) {}
    };
    var inp = el.querySelector('input'), jb = el.querySelector('[data-join]');
    inp.addEventListener('input', function () { inp.value = inp.value.replace(/\D/g, '').slice(0, 6); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') jb.click(); });
    jb.onclick = async function () {
      var c = inp.value.trim();
      if (!/^\d{6}$/.test(c)) return toast(t('jBad'));
      jb.disabled = true; jb.textContent = t('jBusy');
      var ok = await join(c);
      jb.disabled = false; jb.textContent = t('jGo');
      if (ok) el.remove();
    };
  }
  async function join(code) {
    if (code === _myCode) { toast(t('jOwn')); return false; }
    if (!authed()) { try { await SyncEngine.ensureIdentity(); } catch (e) {} }
    var r = await api('/care/claim', { method: 'POST', body: JSON.stringify({ code: code }) }).catch(function () { return { ok: false, status: 0 }; });
    if (r.status === 404 || r.status === 410) { toast(t('jBad')); return false; }
    if (r.status === 400 && /own/i.test(String((r.data || {}).detail || ''))) { toast(t('jOwn')); return false; }
    if (!r.ok) { toast((r.data && r.data.detail) || t('jFail')); return false; }
    var h = r.data.link && r.data.link.home ? r.data.link.home : {};
    await syncTeam();
    toast(t('jDone', { n: String(h.name || '').split(/\s+/)[0] }));
    return true;
  }
  /* a link with ?join=123456: joins as soon as this phone is set up and signed in */
  (function () {
    try {
      var q = new URLSearchParams(location.search).get('join');
      if (q && /^\d{6}$/.test(q)) { lsSet('rc:joinCode', q); history.replaceState(null, '', location.pathname); }
    } catch (e) {}
    var iv = setInterval(function () {
      var c = lsGet('rc:joinCode'); if (!c) { clearInterval(iv); return; }
      if (!authed() || typeof appState === 'undefined' || appState !== 'network') return;
      clearInterval(iv); try { localStorage.removeItem('rc:joinCode'); } catch (e) {}
      join(c);
    }, 1000);
  })();

  /* ── 8. One loop keeps it all in step with Sentinel's own frame ── */
  function loop() {
    requestAnimationFrame(loop);
    placeName();
    if (typeof appState === 'undefined') return;
    if (appState !== 'network') { if (ring.isOpen()) ring.close(); labels.clear(); return; }
    alive();
    focusTick();
    labels.tick();
  }
  function start() {
    if (start.done) return;
    if (typeof SyncEngine === 'undefined' || typeof DEMO_CONTACTS === 'undefined' || typeof SentinelViews === 'undefined' || typeof CV === 'undefined') return;
    start.done = true;
    quiet(); teamFilter(); wrapGalaxy();
    requestAnimationFrame(loop);
    setInterval(toGalaxy, 700);
    setInterval(function () { try { if (authed() && !document.hidden) syncTeam(); } catch (e) {} }, 8000);   /* a new teammate appears within seconds */
    var kick = setInterval(function () { if (authed()) { clearInterval(kick); syncTeam(); } }, 1500);
    setInterval(function () { try { if (!document.hidden) attention(); } catch (e) {} }, 8000);
    setInterval(function () { try { roster.paint(); } catch (e) {} }, 300);
    /* someone changed language: the ring and the labels follow */
    document.addEventListener('click', function (e) { if (e.target && e.target.closest && e.target.closest('[data-lang],.lang-btn')) setTimeout(function () { ring.rebuild(); }, 50); }, true);
  }
  var boot = setInterval(function () { start(); if (start.done) clearInterval(boot); }, 200);
  window.Covara = { attn: function () { return _attn; }, layout: layout, ring: ring, labels: labels, syncTeam: syncTeam, team: team, people: people, run: run };
})();
