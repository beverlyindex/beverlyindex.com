/* Remiel: Covara Camera. Everything that can be seen can be recorded by pointing the phone:
   AUTO      one shutter for everything: Covara's photo reader sorts the photo by itself (medicine or refill,
             food or drink, letter, or nothing to keep) and files it; a meal comes back with its foods, nutrients
             and what it means for HOME's medicines, with what balances each effect
   MEDICINE  a bottle: refills filed as Filled, new medicines read from the label
   MEAL      the plate after eating: all, some or none, with the photo, into HOME's day
   LETTER    mail and bills, read on the phone and checked for the signs of a scam
   ROOM      each room once, for the room radar
   FACE      a photo of HOME for the day (the front camera)
   Beverly Index LLC */
(function () {
  'use strict';
  var S = {
    en: { compare: 'COMPARE', h_compare: 'Every photo reader reads this photo side by side. Nothing is saved.', comparing: 'Every reader is looking at the photo…', cmpNow: 'IN USE NOW', cmpSecs: '{s} s', cmpFail: 'No answer', cmpHow: 'To switch: in Vercel, remiel-covara-api, Settings, Environment Variables, set COVARA_VISION_MODEL to the reader’s name exactly as shown, then Redeploy.',
      auto: 'AUTO', h_auto: 'Point at a medicine, a meal or a letter. Covara sorts it.', sorting: 'Reading the photo…', notKept: 'Not a medicine, a meal or a paper, so it is not kept.',
      noReader: 'The photo reader is not switched on yet. Choose what this is:', readerFail: 'The photo reader did not answer. Choose what this is:',
      mealTitle: { b: 'BREAKFAST', l: 'LUNCH', d: 'DINNER', s: 'SNACK' }, nutr: 'In this meal (estimate)', noNutr: 'Nutrients could not be looked up for these foods.', balance: 'What balances it', source: 'Source',
      sev_high: 'IMPORTANT', sev_watch: 'WATCH', sev_info: 'GOOD TO KNOW', noFlags: 'Nothing in this meal is known to affect {name}’s medicines.', noFlagsMe: 'Nothing in this meal is known to affect your medicines.',
      ask: 'Always check with the doctor or pharmacist before changing anything.', g_: 'g',
      n_energy_kcal: 'Calories', n_protein_g: 'Protein', n_fiber_g: 'Fiber', n_sodium_mg: 'Sodium', n_potassium_mg: 'Potassium', n_vit_k_mcg: 'Vitamin K', n_calcium_mg: 'Calcium', n_sugars_g: 'Sugars',
      title: 'COVARA CAMERA', medicine: 'MEDICINE', meal: 'MEAL', letter: 'LETTER', room: 'ROOM', face: 'FACE', close: 'Close', again: 'Take another', done: 'Done',
      h_medicine: 'Point at the label of a bottle or box.', h_meal: 'Photograph the plate after the meal.', h_letter: 'Photograph the letter or bill, flat and in good light.', h_room: 'Stand in the doorway and photograph the room.', h_face: 'A photo of {name} for today.', h_face_me: 'A photo of you for today.', moodMe: 'How are you today?',
      sending: 'Sending…', reading: 'Reading the label…', medFilled: '{name}: marked Filled', medNew: '{name}: a new medicine. Open Medicines, Photos waiting, to add it in one tap.', medUnread: 'The label could not be read. It waits in Medicines, Photos waiting.',
      mealQ: 'How much was eaten?', m_all: 'All', m_some: 'Some', m_none: 'None', mealOk: 'Saved in {name}’s day.',
      letterOk: 'Nothing on this letter looks like a scam.', letterBad: 'This letter shows signs of a scam: {why}. The family has been told. Do not pay it or call the number on it.', letterNone: 'The words could not be read. Try closer, flat, in good light.',
      roomQ: 'Which room is this?', r_kitchen: 'Kitchen', r_bedroom: 'Bedroom', r_bathroom: 'Bathroom', r_living: 'Living room', r_door: 'Front door', r_hall: 'Hall', roomOk: '{room} saved for the room radar.',
      faceOk: 'Today’s photo of {name} is saved.', moodQ: 'How is {name} today?', g: 'Good', o: 'Okay', l: 'Low',
      noCam: 'The camera is not available here. Choose a photo instead.', choose: 'Choose a photo', failed: 'Could not save. Check the internet and try again.' },
    it: { compare: 'CONFRONTA', h_compare: 'Tutti i lettori leggono questa foto fianco a fianco. Non viene salvato nulla.', comparing: 'Tutti i lettori stanno guardando la foto…', cmpNow: 'IN USO ORA', cmpSecs: '{s} s', cmpFail: 'Nessuna risposta', cmpHow: 'Per cambiare: in Vercel, remiel-covara-api, Settings, Environment Variables, imposta COVARA_VISION_MODEL con il nome del lettore esattamente come mostrato, poi Redeploy.',
      auto: 'AUTO', h_auto: 'Inquadra una medicina, un pasto o una lettera. Covara la ordina da sola.', sorting: 'Leggo la foto…', notKept: 'Non è una medicina, un pasto o un documento, quindi non viene conservata.',
      noReader: 'Il lettore di foto non è ancora attivo. Scegli che cos’è:', readerFail: 'Il lettore di foto non ha risposto. Scegli che cos’è:',
      mealTitle: { b: 'COLAZIONE', l: 'PRANZO', d: 'CENA', s: 'SPUNTINO' }, nutr: 'In questo pasto (stima)', noNutr: 'Non è stato possibile cercare i nutrienti di questi cibi.', balance: 'Cosa lo bilancia', source: 'Fonte',
      sev_high: 'IMPORTANTE', sev_watch: 'ATTENZIONE', sev_info: 'DA SAPERE', noFlags: 'Niente in questo pasto è noto per influire sulle medicine di {name}.', noFlagsMe: 'Niente in questo pasto è noto per influire sulle tue medicine.',
      ask: 'Chiedi sempre al medico o al farmacista prima di cambiare qualcosa.', g_: 'g',
      n_energy_kcal: 'Calorie', n_protein_g: 'Proteine', n_fiber_g: 'Fibre', n_sodium_mg: 'Sodio', n_potassium_mg: 'Potassio', n_vit_k_mcg: 'Vitamina K', n_calcium_mg: 'Calcio', n_sugars_g: 'Zuccheri',
      title: 'FOTOCAMERA COVARA', medicine: 'MEDICINA', meal: 'PASTO', letter: 'LETTERA', room: 'STANZA', face: 'VOLTO', close: 'Chiudi', again: 'Un’altra', done: 'Fatto',
      h_medicine: 'Inquadra l’etichetta del flacone o della scatola.', h_meal: 'Fotografa il piatto dopo il pasto.', h_letter: 'Fotografa la lettera o la bolletta, piatta e con buona luce.', h_room: 'Dalla porta, fotografa la stanza.', h_face: 'Una foto di {name} per oggi.', h_face_me: 'Una tua foto per oggi.', moodMe: 'Come stai oggi?',
      sending: 'Invio…', reading: 'Lettura dell’etichetta…', medFilled: '{name}: segnata Ritirata', medNew: '{name}: una nuova medicina. Apri Medicine, Foto in attesa, per aggiungerla con un tocco.', medUnread: 'Non è stato possibile leggere l’etichetta. Aspetta in Medicine, Foto in attesa.',
      mealQ: 'Quanto ha mangiato?', m_all: 'Tutto', m_some: 'Un po’', m_none: 'Niente', mealOk: 'Salvato nella giornata di {name}.', mealOkMe: 'Salvato nella tua giornata.', faceOkMe: 'La tua foto di oggi \u00e8 salvata.',
      letterOk: 'Niente in questa lettera sembra una truffa.', letterBad: 'Questa lettera mostra segni di truffa: {why}. La famiglia è stata avvisata. Non pagarla e non chiamare il numero indicato.', letterNone: 'Non è stato possibile leggere le parole. Riprova più vicino, piatta, con buona luce.',
      roomQ: 'Che stanza è?', r_kitchen: 'Cucina', r_bedroom: 'Camera', r_bathroom: 'Bagno', r_living: 'Soggiorno', r_door: 'Porta d’ingresso', r_hall: 'Corridoio', roomOk: '{room} salvata per il radar delle stanze.',
      faceOk: 'La foto di oggi di {name} è salvata.', moodQ: 'Come sta {name} oggi?', g: 'Bene', o: 'Così così', l: 'Giù',
      noCam: 'La fotocamera non è disponibile qui. Scegli una foto.', choose: 'Scegli una foto', failed: 'Non salvato. Controlla internet e riprova.' }
  };
  function IT() { try { return String(I18n.locale || 'en').slice(0, 2) === 'it'; } catch (e) { return false; } }
  function t(k, p) { var s = (IT() ? S.it : S.en)[k] || S.en[k] || k; if (typeof s !== 'string') return s; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x]); }); return s; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function homeContact() { if (typeof DEMO_CONTACTS === 'undefined') return null; return DEMO_CONTACTS.filter(function (c) { return c.care && c.care.side === 'home' && c.care.state === 'active'; })[0] || null; }
  function homeBody() { var h = homeContact(); return role() === 'away' && h ? { home: h.care.userId } : {}; }
  function first() { if (role() === 'away') { var h = homeContact(); return h ? h.first : ''; } try { return String(userSphereName || '').split(/\s+/)[0]; } catch (e) { return ''; } }
  async function api(path, opts) {
    var o = Object.assign({ method: 'GET' }, opts || {});
    if (o.body && typeof o.body !== 'string' && !(o.body instanceof FormData)) o.body = JSON.stringify(o.body);
    var r = await SyncEngine.apiFetch(path, o); var j = await r.json().catch(function () { return {}; });
    return { ok: r.ok, status: r.status, data: j };
  }
  async function upload(blob) {
    var fd = new FormData(); fd.append('file', blob, 'covara-' + Date.now() + '.jpg'); fd.append('blob_type', 'photo');
    var r = await api('/storage/upload', { method: 'POST', body: fd });
    return r.ok && r.data.id ? r.data.id : null;
  }
  /* Signs of a scam in a letter, from consumer protection guidance: pressure, unusual payment, personal numbers */
  var SCAM = [[/gift ?cards?|carte regalo/i, 'gift cards'], [/wire (the )?(money|funds|transfer)|bonifico urgente|western union|moneygram/i, 'a money transfer'], [/bitcoin|crypto|cryptocurrency|criptovalut/i, 'cryptocurrency'],
    [/(act|respond|pay) (now|immediately|today)|final notice|ultimo avviso|immediately|entro 24 ore/i, 'pressure to act now'], [/you(\'ve| have)? won|winner|prize|lottery|sweepstakes|hai vinto|premio|lotteria/i, 'a prize'],
    [/social security number|ssn|medicare number|bank account number|codice fiscale e iban|pin\b/i, 'a request for personal numbers'], [/arrest|warrant|lawsuit|suspend|sospes[oa]|\birs\b owes|back taxes/i, 'threats'],
    [/verify your (account|identity)|confirm your (account|details)|verifica il tuo conto/i, 'a request to verify an account'], [/do not tell|keep this (confidential|secret)|non dirlo/i, 'secrecy']];
  function scamCheck(text) { var why = []; SCAM.forEach(function (s) { if (s[0].test(text) && why.indexOf(s[1]) < 0) why.push(s[1]); }); return why; }

  var css = '#cvCam{position:fixed;inset:0;z-index:9600;background:#000;color:#fff;font-family:var(--nous-font,"Hanken Grotesk",system-ui,sans-serif)}#cvCam[hidden]{display:none}' +
    '#cvCam video,#cvCam .still{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000}#cvCam .still{background-size:cover;background-position:center}' +
    '#cvCam .top{position:absolute;top:14px;left:0;right:0;text-align:center;font:700 11px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.22em;color:#9fd8ff;text-shadow:0 1px 6px #000}' +
    '#cvCam .x{position:absolute;top:8px;right:12px;width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:rgba(0,0,0,.45);color:#fff;font-size:22px;cursor:pointer}' +
    '#cvCam .card{position:absolute;left:14px;right:14px;top:52px;max-width:560px;margin:0 auto;padding:12px 14px;border-radius:16px;border:1px solid rgba(56,189,248,.45);background:rgba(10,14,24,.86);font-size:14.5px;line-height:1.45;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}' +
    '#cvCam .card.good{border-color:#22d3a6}#cvCam .card.warn{border-color:#ffd24d}#cvCam .card.bad{border-color:#ef4444}' +
    '#cvCam .frame{position:absolute;left:12%;right:12%;top:26%;bottom:30%;border:2px solid rgba(255,255,255,.55);border-radius:18px;box-shadow:0 0 0 2000px rgba(0,0,0,.18);pointer-events:none;transition:border-color .3s}' +
    '#cvCam .frame.good{border-color:#22d3a6;box-shadow:0 0 0 2000px rgba(0,0,0,.25),0 0 22px rgba(34,211,166,.7)}#cvCam .frame.warn{border-color:#ffd24d}#cvCam .frame.bad{border-color:#ef4444}' +
    '#cvCam .tag{position:absolute;left:12%;top:calc(26% - 34px);padding:5px 9px;border-radius:7px;background:rgba(5,10,20,.88);border:1px solid #22d3a6;font:700 11.5px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.06em;max-width:76%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#cvCam .modes{position:absolute;bottom:128px;left:0;right:0;display:flex;justify-content:center;gap:6px;flex-wrap:wrap;padding:0 10px}' +
    '#cvCam .modes button{border:0;background:rgba(0,0,0,.35);border-radius:14px;padding:7px 10px;font:700 11px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.14em;color:rgba(255,255,255,.62);cursor:pointer}' +
    '#cvCam .modes button[aria-pressed="true"]{color:#ffd24d;background:rgba(197,165,90,.2)}' +
    '#cvCam .shut{position:absolute;bottom:34px;left:50%;transform:translateX(-50%);width:78px;height:78px;border-radius:50%;border:4px solid #fff;background:transparent;box-shadow:0 0 0 3px rgba(255,255,255,.25);cursor:pointer}' +
    '#cvCam .shut:after{content:"";position:absolute;inset:6px;border-radius:50%;background:#fff}#cvCam .shut:disabled{opacity:.4}' +
    '#cvCam.asking .modes,#cvCam.asking .shut{display:none}#cvCam .ask{position:absolute;left:14px;right:14px;bottom:40px;max-width:560px;margin:0 auto;display:flex;flex-wrap:wrap;gap:8px;justify-content:center}' +
    '#cvCam .ask button{min-height:44px;padding:0 18px;border-radius:22px;border:1px solid rgba(255,255,255,.3);background:rgba(10,14,24,.85);color:#fff;font:700 14px var(--nous-font,"Hanken Grotesk",sans-serif);cursor:pointer}' +
    '#cvCam .ask button.pri{background:#38bdf8;border-color:#38bdf8;color:#04121a}#cvCam .ask .q{flex-basis:100%;text-align:center;font:700 11px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.18em;color:#C5A55A}';
  css += '#cvCam.mealview .still{bottom:auto;height:36%}#cvCam.mealview .frame,#cvCam.mealview .tag,#cvCam.mealview .card{display:none}' +
    '#cvCam .meal{position:absolute;left:0;right:0;top:36%;bottom:0;overflow:auto;padding:14px 14px 150px;box-sizing:border-box;background:linear-gradient(180deg,rgba(10,24,64,.92),rgba(5,10,24,.98));border-top:1.5px solid rgba(150,200,255,.5);box-shadow:0 -10px 30px rgba(70,150,255,.25)}#cvCam .meal[hidden]{display:none}' +
    '#cvCam .meal .mt{font:800 12px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:.18em;color:#ffd24d;margin:0 0 8px}' +
    '#cvCam .meal .fd{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}#cvCam .meal .fd span{padding:5px 10px;border-radius:12px;border:1px solid rgba(150,200,255,.4);background:rgba(40,90,190,.22);font-size:13px}' +
    '#cvCam .meal .nt{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:0 0 6px}#cvCam .meal .nt div{padding:6px;border-radius:10px;background:rgba(255,255,255,.05);text-align:center}#cvCam .meal .nt b{display:block;font-size:15px}#cvCam .meal .nt small{font:600 9.5px var(--nous-mono,monospace);letter-spacing:.06em;color:#9fb4e2}' +
    '#cvCam .meal .lb{font:700 10.5px var(--nous-mono,monospace);letter-spacing:.12em;color:#9fd8ff;margin:10px 0 6px}#cvCam .meal .fl{margin:0 0 10px;padding:10px 12px;border-radius:14px;border:1.5px solid #ffd24d;background:rgba(255,210,77,.08)}' +
    '#cvCam .meal .fl.high{border-color:#ff3d5a;background:rgba(255,61,90,.12)}#cvCam .meal .fl.info{border-color:#38bdf8;background:rgba(56,189,248,.08)}' +
    '#cvCam .meal .fl h5{margin:0 0 4px;font:800 11px var(--nous-mono,monospace);letter-spacing:.1em}#cvCam .meal .fl p{margin:0 0 6px;font-size:14px;line-height:1.45}#cvCam .meal .fl ul{margin:0 0 4px;padding-left:18px;font-size:13.5px;line-height:1.45}#cvCam .meal .fl a{color:#9fd8ff;font-size:11.5px}' +
    '#cvCam .meal .ok{padding:10px 12px;border-radius:14px;border:1px solid #22d3a6;background:rgba(34,211,166,.08);font-size:14px}#cvCam .meal .dis{margin-top:8px;color:#9fb4e2;font-size:12px}';
  /* while the camera is open, nothing else floats over it; the answer buttons sit on a solid strip under the meal */
  css += 'body.cv-cam #cvMorning,body.cv-cam #cvHeadline,body.cv-cam #cvTalkHeadline{display:none !important}' +
    '#cvCam.mealview .ask{left:0;right:0;bottom:0;max-width:none;padding:12px 14px calc(18px + env(safe-area-inset-bottom));background:linear-gradient(180deg,rgba(5,10,24,0),rgba(5,10,24,.96) 28%)}';
  /* the same meal view inside HOME's Health pull */
  css += css.split('}').filter(function (r) { return r.indexOf('#cvCam .meal .') >= 0; }).map(function (r) { return r.replace(/#cvCam \.meal \./g, '.cvm .') + '}'; }).join('') +
    '.cvm{color:#eef4ff}.cvm .ph{width:100%;max-height:220px;object-fit:cover;border-radius:14px;display:block;margin:0 0 10px;border:1px solid rgba(150,200,255,.35)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var box = null, video = null, stream = null, mode = 'auto', still = null, busy = false;
  function build() {
    if (box) return;
    box = document.createElement('div'); box.id = 'cvCam'; box.hidden = true; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<video playsinline muted autoplay></video><div class="still" hidden></div><div class="frame"></div><div class="tag" hidden></div><div class="top"></div><button type="button" class="x" aria-label="Close">×</button>' +
      '<div class="card" hidden></div><div class="meal" hidden></div><div class="ask" hidden></div><div class="modes"></div><button type="button" class="shut" aria-label="Take the photo"></button><input type="file" accept="image/*" capture="environment" hidden>';
    document.body.appendChild(box);
    video = box.querySelector('video');
    box.querySelector('.x').onclick = close;
    box.querySelector('.shut').onclick = shoot;
    box.querySelector('input').onchange = function () { var f = this.files && this.files[0]; if (f) handle(f); this.value = ''; };
    ['pointerdown', 'mousedown', 'touchstart'].forEach(function (ev) { box.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true }); });
  }
  function modes() {
    var m = box.querySelector('.modes');
    var cmp = false; try { if (/#compare/.test(location.hash || '')) localStorage.setItem('rc:compare', '1'); cmp = localStorage.getItem('rc:compare') === '1'; } catch (e) {}
    m.innerHTML = ['auto', 'meal', 'medicine', 'letter', 'room', 'face'].concat(cmp ? ['compare'] : []).map(function (k) { return '<button type="button" data-m="' + k + '" aria-pressed="' + (mode === k) + '">' + esc(t(k)) + '</button>'; }).join('');
    m.querySelectorAll('[data-m]').forEach(function (b) { b.onclick = function () { setMode(b.getAttribute('data-m')); }; });
    box.querySelector('.top').textContent = t('title') + ' · ' + t(mode);
  }
  function card(text, cls) { var c = box.querySelector('.card'); c.className = 'card' + (cls ? ' ' + cls : ''); c.textContent = text; c.hidden = !text; }
  function frame(cls, tag) { var f = box.querySelector('.frame'); f.className = 'frame' + (cls ? ' ' + cls : ''); var g = box.querySelector('.tag'); g.textContent = tag || ''; g.hidden = !tag; g.style.borderColor = cls === 'bad' ? '#ef4444' : cls === 'warn' ? '#ffd24d' : '#22d3a6'; }
  function ask(q, opts, cb) {
    var a = box.querySelector('.ask'); a.hidden = !q; box.classList.toggle('asking', !!q);
    if (!q) { a.innerHTML = ''; return; }
    a.innerHTML = '<div class="q">' + esc(q) + '</div>' + opts.map(function (o, i) { return '<button type="button" data-i="' + i + '"' + (o.pri ? ' class="pri"' : '') + '>' + esc(o.label) + '</button>'; }).join('');
    a.querySelectorAll('[data-i]').forEach(function (b) { b.onclick = function () { cb(opts[+b.getAttribute('data-i')]); }; });
  }
  async function startCam() {
    stopCam();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { card(t('noCam'), 'warn'); ask(' ', [{ label: t('choose'), pri: true }], function () { box.querySelector('input').click(); }); return; }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode === 'face' ? 'user' : { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });
      video.srcObject = stream; video.hidden = false; await video.play().catch(function () {});
    } catch (e) { card(t('noCam'), 'warn'); ask(' ', [{ label: t('choose'), pri: true }], function () { box.querySelector('input').click(); }); }
  }
  function stopCam() { if (stream) { stream.getTracks().forEach(function (x) { x.stop(); }); stream = null; } }
  function reset() {
    var s = box.querySelector('.still'); s.hidden = true; s.style.backgroundImage = ''; still = null; box.classList.remove('mealview'); var mv = box.querySelector('.meal'); mv.hidden = true; mv.innerHTML = '';
    frame('', ''); ask(''); card(t(mode === 'face' && role() === 'home' ? 'h_face_me' : 'h_' + mode, { name: first() }), ''); box.querySelector('.shut').disabled = false; busy = false;
  }
  function setMode(m) { var flip = (m === 'face') !== (mode === 'face'); mode = m; modes(); reset(); if (flip) startCam(); }
  function open(m) {
    build(); box.hidden = false; document.body.classList.add('cv-cam'); if (m) mode = m;
    modes(); reset(); startCam();
  }
  function close() { stopCam(); if (box) box.hidden = true; document.body.classList.remove('cv-cam'); try { if (window.CovaraView) CovaraView.load(); } catch (e) {} }
  function shoot() {
    if (busy) return;
    if (!stream || !video.videoWidth) { box.querySelector('input').click(); return; }
    var c = document.createElement('canvas'), k = Math.min(1, 1600 / Math.max(video.videoWidth, video.videoHeight));
    c.width = Math.round(video.videoWidth * k); c.height = Math.round(video.videoHeight * k);
    c.getContext('2d').drawImage(video, 0, 0, c.width, c.height);
    c.toBlob(function (b) { if (b) handle(b); }, 'image/jpeg', 0.86);
  }
  async function handle(blob) {
    busy = true; box.querySelector('.shut').disabled = true;
    still = blob; var s = box.querySelector('.still'); s.style.backgroundImage = 'url(' + URL.createObjectURL(blob) + ')'; s.hidden = false;
    try { await (H[mode] || H.medicine)(blob); } catch (e) { card(t('failed'), 'bad'); }
  }
  function again() { return [{ label: t('again'), pri: true, again: true }, { label: t('done') }]; }
  function after(o) { if (o && o.again) reset(); else close(); }
  var H = {
    medicine: async function (blob) {
      card(t('sending'), '');
      var id = await upload(blob); if (!id) throw new Error('up');
      var r = await api('/care/inbox', { method: 'POST', body: Object.assign({ photo: id, source: 'camera' }, homeBody()) });
      if (!r.ok) throw new Error('inbox');
      follow(r.data.entry.id);
    },
    auto: async function (blob) {
      card(t('sorting'), ''); frame('warn', '…');
      var id = await upload(blob); if (!id) throw new Error('up');
      var r = await api('/care/vision/sort', { method: 'POST', body: Object.assign({ photo: id, source: 'camera', taken_at: Date.now() }, homeBody()) }).catch(function () { return { ok: false, status: 0, data: {} }; });
      if (!r.ok) {
        /* the reader is off or did not answer: HOME chooses, and the photo goes the old way */
        frame('', '');
        card(t(r.data && r.data.code === 'nokey' ? 'noReader' : 'readerFail'), 'warn');
        ask(' ', ['medicine', 'meal', 'letter'].map(function (k) { return { label: t(k), k: k }; }), function (o) { ask(''); H[o.k](blob); });
        return;
      }
      var d = r.data;
      if (d.type === 'medicine' && d.inbox) { frame('warn', (d.medicine && d.medicine.name ? d.medicine.name.toUpperCase() + ' ' : '') + '· ' + t('medicine')); return follow(d.inbox); }
      if (d.type === 'food' && d.meal) return showMeal(d.meal);
      if (d.type === 'letter') return H.letter(blob);
      card(t('notKept'), ''); frame('', ''); ask(' ', again(), after);
    }
  };
  /* a medicine photo waiting in Photos waiting: watch it being read and filed */
  function follow(entryId) {
      card(t('reading'), ''); frame('warn', '…');
      try { if (window.CovaraView) CovaraView.load(); } catch (e) {}
      var tries = 0;
      (function poll() {
        var d = window.CovaraView && CovaraView.data && CovaraView.data(), e = d && (d.inbox || []).filter(function (x) { return x.id === entryId; })[0];
        if (e && e.status !== 'new') {
          var res = e.result || {}, f = res.fields || {};
          if (e.status === 'done') { card(t('medFilled', { name: res.title || '' }) + (res.dispensed ? ' · ' + res.dispensed : ''), 'good'); frame('good', (res.title || '').toUpperCase() + ' · FILLED'); }
          else if (f.title) { card(t('medNew', { name: f.title }), 'warn'); frame('warn', String(f.title).toUpperCase() + (f.strength ? ' ' + f.strength + ' ' + (f.unit || '') : '')); }
          else { card(t('medUnread'), 'bad'); frame('bad', '?'); }
          ask(' ', again(), after); return;
        }
        if (++tries > 90) { card(t('medUnread'), 'warn'); ask(' ', again(), after); return; }
        if (tries % 6 === 0) { try { CovaraView.load(); } catch (x) {} }
        setTimeout(poll, 1000);
      })();
  }
  /* a meal: the photo above, and beneath it the foods, the nutrients, and what it means for HOME's medicines */
  function mealName(at) { var h = new Date(at).getHours(), m = t('mealTitle'); return h >= 4 && h < 11 ? m.b : h >= 11 && h < 15 ? m.l : h >= 17 && h < 22 ? m.d : m.s; }
  function fmt(k, v) { if (v == null) return '–'; return k === 'energy_kcal' ? Math.round(v) : /_mg$/.test(k) ? Math.round(v) + ' mg' : /_mcg$/.test(k) ? Math.round(v) + ' mcg' : (Math.round(v * 10) / 10) + ' g'; }
  function mealHtml(m) {
    var me = role() !== 'away', when = new Date(m.at).toLocaleTimeString(IT() ? 'it' : 'en-US', { hour: 'numeric', minute: '2-digit' });
    var h = '<div class="mt">' + esc(mealName(m.at)) + ' · ' + esc(when) + (m.eaten ? ' · ' + esc(t('m_' + m.eaten)).toUpperCase() : '') + '</div>';
    h += '<div class="fd">' + (m.foods || []).map(function (f) { return '<span>' + esc(f.name) + (f.grams ? ' · ' + f.grams + ' ' + t('g_') : '') + '</span>'; }).join('') + '</div>';
    var N = m.nutrients || {}, keys = ['energy_kcal', 'protein_g', 'fiber_g', 'sodium_mg', 'potassium_mg', 'vit_k_mcg', 'calcium_mg', 'sugars_g'];
    if (Object.keys(N).length) h += '<div class="lb">' + esc(t('nutr')) + '</div><div class="nt">' + keys.map(function (k) { return '<div><b>' + esc(fmt(k, N[k])) + '</b><small>' + esc(t('n_' + k)) + '</small></div>'; }).join('') + '</div>';
    else h += '<div class="dis">' + esc(t('noNutr')) + '</div>';
    var fl = m.flags || [];
    if (!fl.length) h += '<div class="ok">' + esc(t(me ? 'noFlagsMe' : 'noFlags', { name: first() })) + '</div>';
    fl.forEach(function (f) {
      h += '<div class="fl ' + esc(f.severity) + '"><h5>' + esc(t('sev_' + f.severity)) + ' · ' + esc(String(f.med).toUpperCase()) + ' · ' + esc(String(f.foods).toUpperCase()) + '</h5><p>' + esc(f.effect) + '</p>' +
        '<div class="lb" style="margin-top:4px">' + esc(t('balance')) + '</div><ul>' + (f.balance || []).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
        (f.source ? '<a href="' + esc(f.source.url) + '" target="_blank" rel="noopener">' + esc(t('source')) + ': ' + esc(f.source.title) + '</a>' : '') + '</div>';
    });
    h += '<div class="dis">' + esc(t('ask')) + '</div>';
    return h;
  }
  function showMeal(m) {
    box.classList.add('mealview'); var mv = box.querySelector('.meal'); mv.innerHTML = mealHtml(m); mv.hidden = false; mv.scrollTop = 0;
    ask(t('mealQ'), [{ label: t('m_all'), v: 'all', pri: true }, { label: t('m_some'), v: 'some' }, { label: t('m_none'), v: 'none' }], async function (o) {
      ask('');
      var r = await api('/care/meals/' + encodeURIComponent(m.id) + (role() === 'away' && homeBody().home ? '?home=' + encodeURIComponent(homeBody().home) : ''), { method: 'PUT', body: { eaten: o.v } }).catch(function () { return { ok: false }; });
      if (r.ok && r.data.meal) mv.innerHTML = mealHtml(r.data.meal);
      ask(' ', again(), after);
    });
  }
  /* every reader on the account, side by side, on the same photo */
  function cmpHtml(d) {
    var rs = (d.results || []).slice().sort(function (a, b) { return (b.ok - a.ok) || a.ms - b.ms; });
    return '<div class="mt">' + esc(t('compare')) + '</div>' + rs.map(function (r) {
      var what = !r.ok ? t('cmpFail') + (r.error ? ' · ' + r.error : '') : r.type === 'food' ? (r.foods || []).map(function (f) { return f.name + (f.grams ? ' ' + f.grams + ' g' : ''); }).join(', ') || 'food' :
        r.type === 'medicine' ? 'MEDICINE · ' + ((r.medicine && [r.medicine.name, r.medicine.strength, r.medicine.unit, r.medicine.form].filter(Boolean).join(' ')) || '?') : String(r.type || '').toUpperCase();
      return '<div class="fl ' + (r.ok ? 'info' : 'high') + '"' + (r.model === d.current ? ' style="border-color:#ffd24d"' : '') + '><h5>' + esc(r.model) + ' · ' + esc(t('cmpSecs', { s: (r.ms / 1000).toFixed(1) })) + (r.model === d.current ? ' · ' + esc(t('cmpNow')) : '') + '</h5><p>' + esc(what) + '</p></div>';
    }).join('') + '<div class="dis">' + esc(t('cmpHow')) + '</div>';
  }
  var H2 = {
    compare: async function (blob) {
      card(t('comparing'), ''); frame('warn', '…');
      var id = await upload(blob); if (!id) throw new Error('up');
      var r = await api('/care/vision/compare', { method: 'POST', body: { photo: id } }).catch(function () { return { ok: false, data: {} }; });
      if (!r.ok) { card((r.data && r.data.detail) || t('failed'), 'bad'); ask(' ', again(), after); return; }
      box.classList.add('mealview'); var mv = box.querySelector('.meal'); mv.innerHTML = cmpHtml(r.data); mv.hidden = false; mv.scrollTop = 0;
      ask(' ', again(), after);
    },
    meal: async function (blob) {
      ask(t('mealQ'), [{ label: t('m_all'), v: 'all', pri: true }, { label: t('m_some'), v: 'some' }, { label: t('m_none'), v: 'none' }], async function (o) {
        ask(''); card(t('sending'), '');
        var id = await upload(blob); if (!id) return card(t('failed'), 'bad');
        var r = await api('/care/log', { method: 'POST', body: Object.assign({ kind: 'meal', value: o.v, photo: id }, homeBody()) });
        if (!r.ok) return card(t('failed'), 'bad');
        card(t(role() === 'away' ? 'mealOk' : 'mealOkMe', { name: first() }), o.v === 'none' ? 'warn' : 'good'); frame(o.v === 'none' ? 'warn' : 'good', t('meal') + ' · ' + o.label.toUpperCase());
        ask(' ', again(), after);
      });
    },
    letter: async function (blob) {
      card(t('reading'), '');
      var text = '';
      try { var file = new File([blob], 'letter.jpg', { type: 'image/jpeg' }); var r0 = await window.CovaraLabel.read(file); text = (r0 && r0.text) || ''; } catch (e) { text = ''; }
      if (!text.trim()) { card(t('letterNone'), 'warn'); ask(' ', again(), after); return; }
      var why = scamCheck(text), id = await upload(blob);
      await api('/care/log', { method: 'POST', body: Object.assign({ kind: 'letter', value: why.length ? 'flagged' : 'ok', note: why.join(', ') || undefined, photo: id || undefined }, homeBody()) });
      if (why.length) { card(t('letterBad', { why: why.join(', ') }), 'bad'); frame('bad', 'SCAM SIGNS · ' + why.length); } else { card(t('letterOk'), 'good'); frame('good', t('letter') + ' · OK'); }
      ask(' ', again(), after);
    },
    room: async function (blob) {
      ask(t('roomQ'), ['kitchen', 'bedroom', 'bathroom', 'living', 'door', 'hall'].map(function (k) { return { label: t('r_' + k) }; }), async function (o) {
        ask(''); card(t('sending'), '');
        var id = await upload(blob);
        var r = await api('/care/items', { method: 'POST', body: Object.assign({ kind: 'room', title: o.label, photo: id || undefined }, homeBody()) });
        if (!r.ok) return card(t('failed'), 'bad');
        card(t('roomOk', { room: o.label }), 'good'); frame('good', o.label.toUpperCase());
        ask(' ', again(), after);
      });
    },
    face: async function (blob) {
      card(t('sending'), '');
      var id = await upload(blob); if (!id) throw new Error('up');
      var r = await api('/care/log', { method: 'POST', body: Object.assign({ kind: 'face', value: 'checkin', photo: id }, homeBody()) });
      if (!r.ok) throw new Error('log');
      card(t(role() === 'away' ? 'faceOk' : 'faceOkMe', { name: first() }), 'good'); frame('good', first().toUpperCase() + ' · ' + new Date().toLocaleDateString(IT() ? 'it' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase());
      if (role() === 'home') ask(t('moodMe'), [{ label: t('g'), m: 'good', pri: true }, { label: t('o'), m: 'okay' }, { label: t('l'), m: 'low' }], async function (o) { await api('/care/state', { method: 'POST', body: { mood: o.m } }).catch(function () {}); ask(' ', again(), after); });
      else ask(' ', again(), after);
    }
  };
  Object.keys(H2).forEach(function (k) { H[k] = H2[k]; });
  window.CovaraCamera = { open: open, close: close, scamCheck: scamCheck, showMeal: showMeal, mealHtml: mealHtml };
})();
