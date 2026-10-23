/* Remiel: Covara, HOME's medical records.
   Covara never keeps medical records. It keeps the map and the permissions:
   WHERE the records are (doctors, hospitals, pharmacies, labs, insurers), WHO may obtain them and how far
   (an authorization list only HOME, or the person who decides for HOME, can give, change or end), HOW to obtain
   them step by step, a printable HIPAA authorization form for each entry, and a dated LOG of every change.
   Reached from the Records tile on HOME's care card (on HOME's phone and on the team's), and from Papers.
   window.CovaraRecords = { open(tab), close(), isOpen(), data(), print(authId) }
   Beverly Index LLC */
(function () {
  'use strict';

  var IT = function () { try { return String(I18n.locale || '').slice(0, 2) === 'it'; } catch (e) { return false; } };
  var S = {
    en: {
      tile: 'Records', tileSub: 'Where they are, who may get them', tileN: '{a} may obtain · {h} places', tileMine: 'You may obtain them',
      title: 'Medical records', subMe: 'Your records stay with each provider. Covara keeps where they are and who may get them.',
      subOf: '{name}’s records stay with each provider. Covara keeps where they are and who may get them.',
      tWhere: 'Where', tWho: 'Who may obtain', tHow: 'How to obtain', tLog: 'Log', close: 'Close', loading: 'Loading...', offline: 'Sign in to see medical records.', notShared: 'Not shared with you.', failed: 'That did not work. Check the internet and try again.',
      /* where */
      whereLead: 'The places that hold {name}’s records. Add each doctor, hospital, pharmacy, lab and insurer.', noHolders: 'No record holders yet.', addHolder: 'Add a record holder',
      hk_doctor: 'Doctor', hk_hospital: 'Hospital or clinic', hk_pharmacy: 'Pharmacy', hk_lab: 'Lab', hk_insurer: 'Insurer', hk_other: 'Other',
      hName: 'Name', hNamePh: 'For example Dr. Rossi, Lenox Hill Hospital', hKind: 'Kind', hPhone: 'Phone', hFax: 'Fax', hAddress: 'Address', hPortal: 'Patient portal web address', hPortalPh: 'For example mychart.example.org', hNotes: 'Notes', hNotesPh: 'Patient number, records office hours',
      portal: 'Patient portal', call: 'Call', fax: 'Fax', steps: 'How to get records', edit: 'Change', remove: 'Remove', sure: 'Tap again to remove', save: 'Save', cancel: 'Cancel', needName: 'Write a name.', badPortal: 'The portal must be a web address.',
      onlyAllowed: 'Only {name}, the person who decides for {name}, or someone {name} shares care with can add record holders.',
      /* who */
      whoLeadMgr: 'Each person here may obtain {name}’s records: what, from where, and until when. Only {name}, or the person who decides for {name}, can add, change or end one.',
      whoLeadMe: 'Each person here may obtain your records: what, from where, and until when. Only you, or the person you named to decide for you, can add, change or end one.',
      whoLeadTeam: 'You see only the authorizations that name you. Only {name}, or the person who decides for {name}, can give, change or end one.',
      noAuths: 'No one is authorized yet.', noAuthsYou: 'No authorization names you.', newAuth: 'Authorize someone',
      active: 'Active', ended: 'Ended', endedDate: 'Ended on its date', allRecs: 'All records (not the sensitive kinds)', fromAll: 'From every record holder', fromSome: 'From: {list}',
      dates: 'Records dated {from} to {to}', datesFrom: 'Records from {from} on', datesTo: 'Records up to {to}', allDates: 'Any date', purpose: 'Purpose', ends: 'Ends', endsOn: 'on {d}', signedRep: 'Signed by a representative: {name}',
      print: 'Print the form', end: 'End it', endSure: 'Tap again to end it', you: 'you',
      k_visits: 'Visit notes', k_tests: 'Test results', k_imaging: 'Imaging (X-rays, scans)', k_medicines: 'Medicines', k_discharge: 'Hospital discharge papers', k_billing: 'Billing',
      s_psychotherapy: 'Psychotherapy notes', s_sud: 'Substance use disorder treatment (42 CFR Part 2)', s_hiv: 'HIV tests and treatment', s_genetic: 'Genetic tests', s_reproductive: 'Reproductive health',
      /* the form */
      fNew: 'Authorize someone', fEdit: 'Change the authorization', fWho: 'Who may obtain them', fOutside: 'Someone outside Covara', fName: 'Name', fRel: 'Relationship', fRelPh: 'For example daughter, lawyer', fProf: 'Profession', fProfPh: 'For example nurse, attorney',
      fWhat: 'What they may obtain', fAll: 'All records', fChoose: 'Chosen kinds', fSens: 'Sensitive records', fSensWhy: 'These are never part of All records. Tick each one only if {name} wants it shared.', fPsyNote: 'Many providers ask for a separate form for psychotherapy notes.',
      fRange: 'Records dated (optional)', fFrom: 'From', fTo: 'To', fFromWhere: 'From which record holders', fAllHolders: 'All record holders',
      fPurpose: 'Purpose', fPurposePh: 'At the request of the individual', fEnds: 'When it ends', fEndsDate: 'On a date', fEndsEvent: 'When something happens', fEndsEventPh: 'For example when my claim is settled',
      fSigner: 'Who will sign', fSelf: '{name}', fRep: 'A personal representative', fRepName: 'Representative’s name', fRepAuth: 'Their authority', fRepAuthPh: 'For example healthcare power of attorney',
      fNeedWho: 'Choose the person, or write their name.', fNeedWhat: 'Choose All records or at least one kind.', fNeedEnd: 'Give an end date or an event.', fSave: 'Save the authorization',
      /* how */
      howLead: 'Covara does not keep {name}’s medical records. Each record stays with the place that made it. Here is how to get a copy.',
      howUS: 'These are the rules in the United States (HIPAA). They apply to US providers.',
      h1t: '{name} can ask', h1: 'HIPAA gives {name} the right to see and get a copy of their records from each provider. Ask in writing or through the patient portal. The provider must answer within 30 days, and may take one more 30 days if they say why in writing. They may charge a reasonable fee based on their cost, such as copies and mailing.',
      h2t: 'A personal representative can ask the same way', h2: 'Someone with legal authority to make health decisions for {name}, for example through a healthcare power of attorney, can ask for the records as {name} would. Send a copy of the paper that gives that authority.',
      h3t: 'Anyone else needs {name}’s signed authorization', h3: 'Family, a lawyer or a helper needs a HIPAA authorization signed by {name}, or by the personal representative. Covara prepares one from each entry in Who may obtain: tap Print the form.', h3b: 'A doctor treating {name} can usually get records from another doctor without this form.',
      youAre_home: 'You are {name}: you can ask yourself.', youAre_decider: 'You decide for {name}: ask as the personal representative, with the paper that gives you that authority.', youAre_named: 'An authorization names you: print it, have it signed, and send it.', youAre_none: 'No authorization names you yet. Ask {name}, or the person who decides for {name}, to add one.',
      stepsFor: 'Steps for {holder}', pick: 'Choose a record holder', noHolderSteps: 'Add a record holder first, in Where.',
      sp1: 'Open the patient portal and sign in as {name}, or with proxy access if the portal offers it. Look for Medical records or Request records.', openPortal: 'Open the portal',
      sp2: 'Call {phone} and ask for the medical records office. Ask how they take requests: online, fax, mail or in person.', sp2n: 'Call the office and ask for the medical records office. Ask how they take requests: online, fax, mail or in person.',
      sp3: 'Send the signed authorization with a short note saying what you need. Fax: {fax}.', sp3n: 'Send the signed authorization with a short note saying what you need, by fax, mail or in person.',
      sp3self: 'Ask in writing for a copy of the records you need. An electronic copy is often fastest.',
      sp4: 'Write down the date you asked. If nothing comes within 30 days, call again: they may extend once by 30 days, and must say why in writing.',
      /* log */
      logLead: 'Every time an authorization is created, changed, printed or ended. Seen only by {name} and the person who decides for {name}.', noLog: 'Nothing yet.',
      la_created: '{by} authorized {who}', la_changed: '{by} changed the authorization for {who}', la_printed: '{by} printed the form for {who}', la_ended: '{by} ended the authorization for {who}',
      /* print */
      pPrint: 'Print or save as PDF', pClose: 'Close', pLang: 'Form language', pEn: 'English', pIt: 'Italiano'
    },
    it: {
      tile: 'Cartelle', tileSub: 'Dove sono, chi può averle', tileN: '{a} autorizzati · {h} luoghi', tileMine: 'Puoi ottenerle',
      title: 'Cartelle cliniche', subMe: 'Le tue cartelle restano presso ogni struttura. Covara tiene dove sono e chi può averle.',
      subOf: 'Le cartelle di {name} restano presso ogni struttura. Covara tiene dove sono e chi può averle.',
      tWhere: 'Dove', tWho: 'Chi può averle', tHow: 'Come ottenerle', tLog: 'Registro', close: 'Chiudi', loading: 'Carico...', offline: 'Accedi per vedere le cartelle cliniche.', notShared: 'Non condiviso con te.', failed: 'Non ha funzionato. Controlla internet e riprova.',
      whereLead: 'I luoghi che tengono le cartelle di {name}. Aggiungi ogni medico, ospedale, farmacia, laboratorio e assicurazione.', noHolders: 'Ancora nessun luogo.', addHolder: 'Aggiungi un luogo',
      hk_doctor: 'Medico', hk_hospital: 'Ospedale o clinica', hk_pharmacy: 'Farmacia', hk_lab: 'Laboratorio', hk_insurer: 'Assicurazione', hk_other: 'Altro',
      hName: 'Nome', hNamePh: 'Per esempio Dott. Rossi, Ospedale San Carlo', hKind: 'Tipo', hPhone: 'Telefono', hFax: 'Fax', hAddress: 'Indirizzo', hPortal: 'Indirizzo web del portale pazienti', hPortalPh: 'Per esempio mychart.example.org', hNotes: 'Note', hNotesPh: 'Numero paziente, orari dell’ufficio cartelle',
      portal: 'Portale pazienti', call: 'Chiama', fax: 'Fax', steps: 'Come avere le cartelle', edit: 'Cambia', remove: 'Togli', sure: 'Tocca ancora per togliere', save: 'Salva', cancel: 'Annulla', needName: 'Scrivi un nome.', badPortal: 'Il portale deve essere un indirizzo web.',
      onlyAllowed: 'Solo {name}, chi decide per {name}, o chi vede le cure di {name} può aggiungere luoghi.',
      whoLeadMgr: 'Ogni persona qui può ottenere le cartelle di {name}: cosa, da dove e fino a quando. Solo {name}, o chi decide per {name}, può aggiungerne, cambiarne o chiuderne una.',
      whoLeadMe: 'Ogni persona qui può ottenere le tue cartelle: cosa, da dove e fino a quando. Solo tu, o la persona che hai scelto per decidere per te, puoi aggiungerne, cambiarne o chiuderne una.',
      whoLeadTeam: 'Vedi solo le autorizzazioni che ti nominano. Solo {name}, o chi decide per {name}, può darne, cambiarne o chiuderne una.',
      noAuths: 'Ancora nessuno è autorizzato.', noAuthsYou: 'Nessuna autorizzazione ti nomina.', newAuth: 'Autorizza qualcuno',
      active: 'Attiva', ended: 'Chiusa', endedDate: 'Scaduta alla sua data', allRecs: 'Tutte le cartelle (non i tipi sensibili)', fromAll: 'Da ogni luogo', fromSome: 'Da: {list}',
      dates: 'Cartelle datate dal {from} al {to}', datesFrom: 'Cartelle dal {from} in poi', datesTo: 'Cartelle fino al {to}', allDates: 'Qualsiasi data', purpose: 'Scopo', ends: 'Termina', endsOn: 'il {d}', signedRep: 'Firmata da un rappresentante: {name}',
      print: 'Stampa il modulo', end: 'Chiudila', endSure: 'Tocca ancora per chiuderla', you: 'tu',
      k_visits: 'Note delle visite', k_tests: 'Risultati degli esami', k_imaging: 'Immagini (radiografie, TAC)', k_medicines: 'Medicine', k_discharge: 'Lettere di dimissione', k_billing: 'Fatture e pagamenti',
      s_psychotherapy: 'Note di psicoterapia', s_sud: 'Cura delle dipendenze (42 CFR Part 2, USA)', s_hiv: 'Test e cure HIV', s_genetic: 'Test genetici', s_reproductive: 'Salute riproduttiva',
      fNew: 'Autorizza qualcuno', fEdit: 'Cambia l’autorizzazione', fWho: 'Chi può ottenerle', fOutside: 'Qualcuno fuori da Covara', fName: 'Nome', fRel: 'Rapporto', fRelPh: 'Per esempio figlia, avvocato', fProf: 'Professione', fProfPh: 'Per esempio infermiere, avvocato',
      fWhat: 'Cosa può ottenere', fAll: 'Tutte le cartelle', fChoose: 'Tipi scelti', fSens: 'Cartelle sensibili', fSensWhy: 'Non fanno mai parte di Tutte le cartelle. Spunta ciascuna solo se {name} vuole condividerla.', fPsyNote: 'Molte strutture chiedono un modulo a parte per le note di psicoterapia.',
      fRange: 'Cartelle datate (facoltativo)', fFrom: 'Dal', fTo: 'Al', fFromWhere: 'Da quali luoghi', fAllHolders: 'Tutti i luoghi',
      fPurpose: 'Scopo', fPurposePh: 'Su richiesta dell’interessato', fEnds: 'Quando termina', fEndsDate: 'A una data', fEndsEvent: 'Quando succede qualcosa', fEndsEventPh: 'Per esempio quando la pratica è chiusa',
      fSigner: 'Chi firmerà', fSelf: '{name}', fRep: 'Un rappresentante legale', fRepName: 'Nome del rappresentante', fRepAuth: 'Il suo potere', fRepAuthPh: 'Per esempio procura sanitaria',
      fNeedWho: 'Scegli la persona, o scrivi il suo nome.', fNeedWhat: 'Scegli Tutte le cartelle o almeno un tipo.', fNeedEnd: 'Indica una data o un evento di fine.', fSave: 'Salva l’autorizzazione',
      howLead: 'Covara non tiene le cartelle cliniche di {name}. Ogni cartella resta presso chi l’ha scritta. Ecco come averne una copia.',
      howUS: 'Queste sono le regole degli Stati Uniti (HIPAA) e valgono per medici e strutture negli Stati Uniti. Fuori dagli Stati Uniti valgono le regole locali.',
      h1t: '{name} può chiederle', h1: 'Negli Stati Uniti la legge HIPAA dà a {name} il diritto di vedere e avere una copia delle proprie cartelle da ogni struttura. Si chiede per iscritto o dal portale pazienti. La struttura deve rispondere entro 30 giorni, e può prendere altri 30 giorni una sola volta, spiegando il motivo per iscritto. Può chiedere un compenso ragionevole basato sui suoi costi, come copie e spedizione.',
      h2t: 'Un rappresentante legale può chiederle allo stesso modo', h2: 'Chi ha il potere legale di prendere decisioni sanitarie per {name}, per esempio con una procura sanitaria, può chiedere le cartelle come farebbe {name}. Manda una copia del documento che dà questo potere.',
      h3t: 'Chiunque altro ha bisogno dell’autorizzazione firmata da {name}', h3: 'Familiari, un avvocato o un aiutante hanno bisogno di un’autorizzazione HIPAA firmata da {name}, o dal rappresentante legale. Covara ne prepara una da ogni voce in Chi può averle: tocca Stampa il modulo.', h3b: 'Un medico che cura {name} di solito può avere le cartelle da un altro medico senza questo modulo.',
      youAre_home: 'Tu sei {name}: puoi chiederle tu.', youAre_decider: 'Tu decidi per {name}: chiedi come rappresentante legale, con il documento che ti dà questo potere.', youAre_named: 'Un’autorizzazione ti nomina: stampala, falla firmare e mandala.', youAre_none: 'Ancora nessuna autorizzazione ti nomina. Chiedi a {name}, o a chi decide per {name}, di aggiungerne una.',
      stepsFor: 'Passi per {holder}', pick: 'Scegli un luogo', noHolderSteps: 'Prima aggiungi un luogo, in Dove.',
      sp1: 'Apri il portale pazienti ed entra come {name}, o con l’accesso delegato se il portale lo offre. Cerca Cartelle cliniche o Richiedi documenti.', openPortal: 'Apri il portale',
      sp2: 'Chiama il {phone} e chiedi dell’ufficio cartelle cliniche. Chiedi come accettano le richieste: online, fax, posta o di persona.', sp2n: 'Chiama la struttura e chiedi dell’ufficio cartelle cliniche. Chiedi come accettano le richieste: online, fax, posta o di persona.',
      sp3: 'Manda l’autorizzazione firmata con una breve nota su cosa ti serve. Fax: {fax}.', sp3n: 'Manda l’autorizzazione firmata con una breve nota su cosa ti serve, per fax, posta o di persona.',
      sp3self: 'Chiedi per iscritto una copia delle cartelle che ti servono. Una copia elettronica spesso arriva prima.',
      sp4: 'Annota la data della richiesta. Se entro 30 giorni non arriva niente, richiama: possono rimandare una volta di 30 giorni, e devono spiegarne il motivo per iscritto.',
      logLead: 'Ogni volta che un’autorizzazione viene creata, cambiata, stampata o chiusa. Lo vedono solo {name} e chi decide per {name}.', noLog: 'Ancora niente.',
      la_created: '{by} ha autorizzato {who}', la_changed: '{by} ha cambiato l’autorizzazione per {who}', la_printed: '{by} ha stampato il modulo per {who}', la_ended: '{by} ha chiuso l’autorizzazione per {who}',
      pPrint: 'Stampa o salva in PDF', pClose: 'Chiudi', pLang: 'Lingua del modulo', pEn: 'English', pIt: 'Italiano'
    }
  };
  function lang() { return IT() ? 'it' : 'en'; }
  function t(k, p, lg) { var s = S[lg || lang()][k]; if (s == null) s = S.en[k] == null ? k : S.en[k]; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x] == null ? '' : p[x]); }); return s; }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function authed() { try { return SyncEngine.isAuthenticated() && !SyncEngine.isLocalOnly(); } catch (e) { return false; } }
  function myId() { try { return SyncEngine.getStatus().userId || ''; } catch (e) { return ''; } }
  function contacts() { return typeof DEMO_CONTACTS !== 'undefined' ? DEMO_CONTACTS : []; }
  function homeContact() { return contacts().filter(function (c) { return c.care && c.care.side === 'home' && c.care.state === 'active'; })[0] || null; }
  function homeUser() { var h = homeContact(); return role() === 'away' && h ? h.care.userId : ''; }
  function first(n) { var w = String(n || '').trim().split(/\s+/)[0] || ''; return w && w === w.toUpperCase() && w.length > 1 ? w[0] + w.slice(1).toLowerCase() : w; }
  function relShow(x) { try { return x && window.CovaraCare && CovaraCare.relLabel ? CovaraCare.relLabel(x) || x : x || ''; } catch (e) { return x || ''; } }
  function toast(m) { try { showToast(m); } catch (e) {} }
  async function api(path, o) {
    var r = await SyncEngine.apiFetch(path, Object.assign({ method: 'GET' }, o || {}));
    return { ok: r.ok, status: r.status, data: await r.json().catch(function () { return {}; }) };
  }
  function q() { var h = homeUser(); return h ? '?home=' + encodeURIComponent(h) : ''; }
  function dateOnly(s, lg) { if (!s) return ''; try { return new Date(s + 'T12:00:00').toLocaleDateString((lg || lang()) === 'it' ? 'it' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return s; } }
  function stamp(ms) { try { return new Date(ms).toLocaleString(IT() ? 'it' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }

  var HK = ['doctor', 'hospital', 'pharmacy', 'lab', 'insurer', 'other'];
  var KINDS = ['visits', 'tests', 'imaging', 'medicines', 'discharge', 'billing'];
  var SENS = ['psychotherapy', 'sud', 'hiv', 'genetic', 'reproductive'];

  /* ── the look: NOUS glass, a soft glowing frame, gold and cyan over deep blue ── */
  var GLASS = 'background:linear-gradient(155deg,rgba(80,140,240,.20),rgba(18,40,96,.44));border:1px solid rgba(150,200,255,.42);box-shadow:0 0 16px rgba(70,150,255,.22),inset 0 1px 0 rgba(255,255,255,.14)';
  var MONO = '"JetBrains Mono","SF Mono",monospace';
  var PAPER =
    '.cvr-paper{max-width:780px;margin:14px auto;padding:30px 34px;background:#fff;color:#14203f;border-radius:6px;box-shadow:0 0 40px rgba(56,189,248,.25);font:400 12.5px/1.5 "Hanken Grotesk",system-ui,sans-serif}' +
    '.cvr-paper .top{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;border-bottom:3px solid #C5A55A;padding-bottom:8px;margin-bottom:12px}' +
    '.cvr-paper .brand{font:700 9.5px "JetBrains Mono",monospace;letter-spacing:.2em;color:#9a7a2c;text-transform:uppercase}' +
    '.cvr-paper h1{margin:2px 0 0;font-size:21px;line-height:1.2;font-weight:800;color:#0b1f4a}' +
    '.cvr-paper .reg{font:600 10px "JetBrains Mono",monospace;color:#3a4a74;text-align:right;white-space:nowrap}' +
    '.cvr-paper h2{margin:14px 0 4px;font:700 10.5px "JetBrains Mono",monospace;letter-spacing:.16em;text-transform:uppercase;color:#0b1f4a;border-bottom:1px solid #e4d5a8;padding-bottom:3px}' +
    '.cvr-paper p{margin:3px 0}.cvr-paper ul{margin:3px 0 3px 18px;padding:0}.cvr-paper li{margin:1px 0}' +
    '.cvr-paper .ln{display:flex;gap:8px;align-items:flex-end;margin:6px 0}.cvr-paper .ln span{white-space:nowrap;color:#3a4a74;font-weight:600}.cvr-paper .ln i{flex:1;border-bottom:1px solid #0b1f4a;min-height:16px;font-style:normal;padding:0 4px;overflow-wrap:anywhere}' +
    '.cvr-paper .tick{display:flex;gap:8px;align-items:flex-start;margin:5px 0;padding:6px 8px;border:1px solid #e4d5a8;border-radius:4px;background:#fffbef}' +
    '.cvr-paper .tick .bx{flex:0 0 14px;height:14px;border:1.5px solid #0b1f4a;font:800 11px/12px sans-serif;text-align:center;color:#0b1f4a;margin-top:2px}' +
    '.cvr-paper .tick .ini{margin-left:auto;white-space:nowrap;color:#3a4a74;font-weight:600}' +
    '.cvr-paper .st{margin:4px 0;padding:6px 10px;border-left:3px solid #C5A55A;background:#f7f8fc}' +
    '.cvr-paper .sig{display:grid;grid-template-columns:2fr 1fr;gap:4px 18px}' +
    '.cvr-paper .foot{margin-top:16px;padding-top:8px;border-top:1px solid #e4d5a8;font-size:10.5px;color:#4a587e}' +
    '@media (max-width:600px){.cvr-paper{margin:10px 8px;padding:18px 14px;font-size:11.5px}.cvr-paper h1{font-size:17px}.cvr-paper .top{flex-direction:column;align-items:flex-start}.cvr-paper .reg{text-align:left;white-space:normal}.cvr-paper .sig{grid-template-columns:1fr}}';
  var css =
    '#cvrDim{position:fixed;inset:0;z-index:99994;background:rgba(4,12,34,.5);-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);opacity:0;transition:opacity .3s;pointer-events:none}#cvrDim.open{opacity:1;pointer-events:auto}' +
    '#cvrSheet{position:fixed;left:0;right:0;bottom:0;z-index:99995;margin:0 auto;max-width:520px;height:94vh;height:94dvh;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;box-sizing:border-box;' +
      'padding:12px 14px calc(22px + env(safe-area-inset-bottom,0px));border-radius:26px 26px 0 0;color:#eef3fb;font-family:"Hanken Grotesk",system-ui,sans-serif;' +
      'background:linear-gradient(160deg,rgba(70,130,235,.24) 0%,rgba(22,48,110,.55) 50%,rgba(8,18,52,.88) 100%);-webkit-backdrop-filter:blur(22px) saturate(160%);backdrop-filter:blur(22px) saturate(160%);' +
      'border:1px solid rgba(150,200,255,.45);border-bottom:none;box-shadow:0 0 0 1px rgba(56,189,248,.12),0 -6px 34px rgba(70,150,255,.34),inset 0 1px 0 rgba(255,255,255,.18);' +
      'transform:translateY(105%);transition:transform .34s cubic-bezier(.2,.8,.2,1);text-shadow:0 1px 2px rgba(2,8,24,.55)}' +
    '#cvrSheet.open{transform:none}#cvrSheet *{box-sizing:border-box}' +
    '#cvrSheet .gr{width:44px;height:5px;border-radius:3px;background:rgba(190,215,255,.45);margin:0 auto 6px}' +
    '#cvrSheet .x{position:absolute;top:10px;right:12px;width:46px;height:46px;border-radius:50%;border:1px solid rgba(150,200,255,.45);background:rgba(20,44,100,.35);color:#dce8ff;font:600 24px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 0 12px rgba(70,150,255,.25)}' +
    '#cvrSheet .lead{font:700 11px ' + MONO + ';letter-spacing:.22em;color:#ffd24d;text-transform:uppercase;margin:4px 56px 2px 2px}' +
    '#cvrSheet h2{margin:2px 56px 4px 2px;font-size:28px;font-weight:800;line-height:1.1;letter-spacing:.2px}' +
    '#cvrSheet .sub{margin:0 2px 12px;font-size:14px;line-height:1.4;color:#b9cdea}' +
    '#cvrSheet .tabs{display:grid;grid-template-columns:repeat(var(--n,3),1fr);gap:6px;margin:0 -14px 12px;position:sticky;top:-12px;z-index:5;padding:12px 14px 8px;background:#0e1f50;box-shadow:0 6px 14px rgba(2,8,24,.45)}' +
    '#cvrSheet .tabs button{min-height:46px;padding:4px 4px;border-radius:14px;border:1px solid rgba(150,200,255,.38);background:rgba(20,44,100,.38);color:#cfe6ff;font:700 11px/1.2 ' + MONO + ';letter-spacing:.06em;text-transform:uppercase;cursor:pointer;overflow-wrap:anywhere}' +
    '#cvrSheet .tabs button[aria-selected=true]{color:#1b1405;text-shadow:none;border-color:#ffd24d;background:linear-gradient(180deg,#ffe08a,#ffc531 60%,#d99a00);box-shadow:0 0 16px rgba(255,200,60,.45)}' +
    '#cvrSheet .p{margin:0 2px 12px;font-size:15px;line-height:1.45;color:#dbe7fb}' +
    '#cvrSheet .p.us{font:600 12px/1.45 ' + MONO + ';color:#9fd8ff;padding:8px 10px;border-radius:12px;border:1px dashed rgba(56,189,248,.45)}' +
    '#cvrSheet .card{position:relative;margin:0 0 10px;padding:12px 12px 10px;border-radius:18px;' + GLASS + '}' +
    '#cvrSheet .card.gold{border-color:rgba(255,210,77,.6);box-shadow:0 0 18px rgba(255,210,77,.22),inset 0 1px 0 rgba(255,255,255,.14)}' +
    '#cvrSheet .card.off{opacity:.62}' +
    '#cvrSheet .card h3{margin:0 0 2px;font-size:19px;font-weight:800;line-height:1.2;overflow-wrap:anywhere}' +
    '#cvrSheet .card h4{margin:0 0 4px;font-size:16px;font-weight:800;color:#ffe08a}' +
    '#cvrSheet .card .m{font:600 12px/1.4 ' + MONO + ';color:#9fd8ff;overflow-wrap:anywhere}' +
    '#cvrSheet .card .l{margin:6px 0 0;font-size:14px;line-height:1.4;color:#e4edfb;overflow-wrap:anywhere}' +
    '#cvrSheet .card .l b{color:#bfe3ff;font-weight:700}' +
    '#cvrSheet .pill{display:inline-block;margin:0 6px 4px 0;padding:3px 9px;border-radius:999px;font:700 10.5px ' + MONO + ';letter-spacing:.08em;text-transform:uppercase;border:1px solid rgba(150,200,255,.45);color:#cfe6ff;background:rgba(20,44,100,.35)}' +
    '#cvrSheet .pill.gold{color:#1b1405;border-color:#ffd24d;background:linear-gradient(180deg,#ffe08a,#C5A55A);text-shadow:none}' +
    '#cvrSheet .pill.sens{text-transform:none;letter-spacing:.02em;font-size:11.5px;color:#ffd9e0;border-color:rgba(255,120,150,.7);background:rgba(120,20,50,.35)}' +
    '#cvrSheet .row{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}' +
    '#cvrSheet .b{flex:1 1 auto;min-height:46px;padding:8px 14px;border-radius:14px;border:1px solid rgba(150,200,255,.48);background:linear-gradient(155deg,rgba(80,140,240,.26),rgba(18,40,96,.46));color:#f2f7ff;font:700 15px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;text-align:center;box-shadow:0 0 12px rgba(70,150,255,.22)}' +
    '#cvrSheet .b.pri{border-color:rgba(56,189,248,.8);background:linear-gradient(155deg,rgba(56,189,248,.42),rgba(20,70,150,.55));box-shadow:0 0 18px rgba(56,189,248,.4)}' +
    '#cvrSheet .b.gold{border:0;color:#2a1600;text-shadow:none;background:linear-gradient(180deg,#ffe58a,#ffc531 60%,#d99a00);box-shadow:0 0 18px rgba(255,200,60,.45)}' +
    '#cvrSheet .b.warn{border-color:rgba(255,120,120,.7);color:#ffd0d0}#cvrSheet .b.warn.sure{background:rgba(160,30,40,.55);color:#fff}' +
    '#cvrSheet .add{display:block;width:100%;min-height:54px;margin:4px 0 12px;border-radius:16px;border:1.5px dashed rgba(255,210,77,.7);background:rgba(255,210,77,.08);color:#ffe08a;font:800 16px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer;box-shadow:0 0 16px rgba(255,210,77,.18)}' +
    '#cvrSheet .empty{margin:0 2px 12px;padding:14px;border-radius:16px;border:1px dashed rgba(150,200,255,.35);color:#b9cdea;font-size:14px;text-align:center}' +
    '#cvrSheet ol.st{margin:0;padding:0;list-style:none;counter-reset:s}' +
    '#cvrSheet ol.st li{position:relative;margin:0 0 10px;padding:0 0 0 40px;font-size:15px;line-height:1.45;color:#e4edfb;counter-increment:s;overflow-wrap:anywhere}' +
    '#cvrSheet ol.st li:before{content:counter(s);position:absolute;left:0;top:0;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:800 13px ' + MONO + ';color:#04121f;background:radial-gradient(circle at 35% 30%,#fff 0,#9fe7ff 22%,#38bdf8 60%,#0b3a66 100%);box-shadow:0 0 10px rgba(56,189,248,.6)}' +
    '#cvrSheet .chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 4px}' +
    '#cvrSheet .chip{min-height:40px;padding:6px 12px;border-radius:999px;border:1px solid rgba(150,200,255,.42);background:rgba(20,44,100,.35);color:#dce8ff;font:700 14px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer;max-width:100%;overflow-wrap:anywhere;text-align:left}' +
    '#cvrSheet .chip[aria-pressed=true]{color:#1b1405;text-shadow:none;border-color:#ffd24d;background:linear-gradient(180deg,#ffe08a,#ffc531);box-shadow:0 0 12px rgba(255,200,60,.4)}' +
    '#cvrSheet .chip.sens[aria-pressed=true]{color:#fff;border-color:#ff7a95;background:linear-gradient(180deg,rgba(255,110,140,.9),rgba(170,30,70,.9));box-shadow:0 0 12px rgba(255,90,130,.45)}' +
    '#cvrSheet label.f{display:block;margin:10px 0 0;font:700 11px ' + MONO + ';letter-spacing:.14em;text-transform:uppercase;color:#9fd8ff}' +
    '#cvrSheet input[type=text],#cvrSheet input[type=tel],#cvrSheet input[type=url],#cvrSheet input[type=date],#cvrSheet textarea{display:block;width:100%;min-height:46px;margin:4px 0 0;padding:10px 12px;border-radius:12px;border:1px solid rgba(150,200,255,.45);background:rgba(4,14,40,.55);color:#f2f7ff;font:600 16px "Hanken Grotesk",system-ui,sans-serif;color-scheme:dark}' +
    '#cvrSheet input:focus,#cvrSheet textarea:focus{outline:none;border-color:#38bdf8;box-shadow:0 0 0 3px rgba(56,189,248,.25)}' +
    '#cvrSheet .two{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '#cvrSheet .sens-box{margin:10px 0 0;padding:10px;border-radius:14px;border:1px solid rgba(255,120,150,.5);background:rgba(90,10,40,.22)}' +
    '#cvrSheet .sens-box .why{font-size:13px;line-height:1.4;color:#ffdbe3;margin:2px 0 4px}' +
    '#cvrSheet .err{margin:8px 0 0;font:600 13px ' + MONO + ';color:#ff9fb0}' +
    '#cvrSheet .lg{margin:0 0 8px;padding:9px 12px;border-radius:14px;border-left:3px solid #ffd24d;background:rgba(20,44,100,.32);font-size:14px;line-height:1.4}' +
    '#cvrSheet .lg small{display:block;font:600 11.5px ' + MONO + ';color:#9fd8ff;margin-top:2px}' +
    '#cvrSheet a{color:#7dd3fc}' +
    '#cvrSheet button:focus-visible{outline:2px solid #38bdf8;outline-offset:2px}' +
    /* the Records tile on the care card: the same glass as its neighbours, full width under them */
    '#cvpSheet .cvr-tile{grid-column:1/-1;position:relative;min-height:84px;padding:12px 14px;border-radius:20px;border:1px solid rgba(56,189,248,.7);cursor:pointer;text-align:left;color:#f2f7ff;display:flex;flex-direction:column;justify-content:center;gap:6px;' +
      'background:linear-gradient(155deg,rgba(56,189,248,.26),rgba(18,40,96,.5));box-shadow:0 0 20px rgba(56,189,248,.32),inset 0 1px 0 rgba(255,255,255,.16);font-family:"Hanken Grotesk",system-ui,sans-serif;text-shadow:0 1px 2px rgba(2,8,24,.55)}' +
    '#cvpSheet .cvr-tile b{font-size:24px;font-weight:800;letter-spacing:.2px}#cvpSheet .cvr-tile span{font:600 13px/1.3 ' + MONO + ';color:#b9d6ff}#cvpSheet .cvr-tile:active{transform:scale(.985)}' +
    /* the printable form: white paper, navy and gold */
    '#cvrPrint{position:fixed;inset:0;z-index:2147470000;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;background:rgba(4,12,34,.86);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);padding:0 0 30px}' +
    '#cvrPrint .bar{position:sticky;top:0;z-index:2;display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 12px;background:#0c1d4f;box-shadow:0 4px 16px rgba(2,8,24,.5);border-bottom:1px solid rgba(150,200,255,.35);font-family:"Hanken Grotesk",system-ui,sans-serif}' +
    '#cvrPrint .bar button{min-height:44px;padding:6px 14px;border-radius:14px;border:1px solid rgba(150,200,255,.48);background:rgba(20,44,100,.45);color:#f2f7ff;font:700 14px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer}' +
    '#cvrPrint .bar button.gold{border:0;color:#2a1600;background:linear-gradient(180deg,#ffe58a,#ffc531 60%,#d99a00);box-shadow:0 0 16px rgba(255,200,60,.45)}' +
    '#cvrPrint .bar button[aria-pressed=true]{border-color:#38bdf8;box-shadow:0 0 12px rgba(56,189,248,.5);color:#bfe9ff}' +
    '#cvrPrint .bar .sp{flex:1}' +
    PAPER +
    '@media (prefers-reduced-motion: reduce){#cvrSheet,#cvrDim{transition:none}}';
  var st = document.createElement('style'); st.id = 'cvrStyle'; st.textContent = css; document.head.appendChild(st);

  /* ── state ── */
  var _d = null, _err = '', _tab = 'where', _how = '', _form = null, _f = null, _sure = '', _open = false, _hist = false, _loading = false, _plang = '';
  var dim = null, sheet = null;
  function homeName() { return first(_d && _d.home && _d.home.name) || (IT() ? 'Casa' : 'Home'); }
  function isHome() { return _d && _d.standing === 'home'; }

  function build() {
    if (sheet) return;
    dim = document.createElement('div'); dim.id = 'cvrDim';
    sheet = document.createElement('div'); sheet.id = 'cvrSheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true');
    dim.addEventListener('click', function () { close(); });
    ['touchstart', 'touchend', 'mousedown', 'mouseup', 'click'].forEach(function (ev) { sheet.addEventListener(ev, function (e) { e.stopPropagation(); }); dim.addEventListener(ev, function (e) { e.stopPropagation(); }); });
    sheet.addEventListener('click', onClick);
    sheet.addEventListener('input', function (e) { var k = e.target.getAttribute && e.target.getAttribute('data-f'); if (k && _f) _f[k] = e.target.value; });
    document.body.appendChild(dim); document.body.appendChild(sheet);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (printEl && !printEl.hidden) closePrint(); else if (_open) close(); } });
    window.addEventListener('popstate', function () { if (_hist) { _hist = false; close(true); } });
  }

  async function load() {
    if (!authed()) { _d = null; _err = t('offline'); render(); return; }
    _loading = true;
    try {
      var r = await api('/care-records' + q());
      if (r.ok) { _d = r.data; _err = ''; } else { _d = null; _err = r.status === 404 ? t('notShared') : t('failed'); }
    } catch (e) { _err = t('failed'); }
    _loading = false;
    if (_d && !_d.manage && _tab === 'log') _tab = 'where';
    render(); paintTile();
  }

  function open(tab) {
    build();
    /* from the care card: the card's own back step must land first, or its popstate would shut Records at once */
    try { if (window.CovaraPerson && CovaraPerson.isOpen()) { if (CovaraPerson.closeThen) { CovaraPerson.closeThen(function () { open(tab); }); return true; } CovaraPerson.close(); } } catch (e) {}
    _tab = tab || _tab || 'where'; _form = null; _f = null; _sure = '';
    _open = true; render();
    requestAnimationFrame(function () { dim.classList.add('open'); sheet.classList.add('open'); });
    if (!_hist) { try { history.pushState({ cvr: 1 }, ''); _hist = true; } catch (e) {} }
    load();
    return true;
  }
  function close(fromBack) {
    if (!sheet || !_open) return;
    _open = false; dim.classList.remove('open'); sheet.classList.remove('open');
    if (_hist && !fromBack) { _hist = false; setTimeout(function () { try { history.back(); } catch (e) {} }, 0); }
  }

  /* ── drawing ── */
  function render() {
    if (!sheet) return;
    var keep = sheet.scrollTop;
    var nm = homeName(), mgr = !!(_d && _d.manage);
    var tabs = ['where', 'who', 'how'].concat(mgr ? ['log'] : []);
    var h = '<div class="gr"></div><button type="button" class="x" data-a="close" aria-label="' + esc(t('close')) + '">×</button>' +
      '<div class="lead">COVARA · HIPAA</div>' +
      '<h2>' + esc(t('title')) + '</h2>' +
      '<div class="sub">' + esc(_d ? (isHome() ? t('subMe') : t('subOf', { name: nm })) : '') + '</div>';
    if (!_d) { sheet.innerHTML = h + '<div class="empty">' + esc(_err || t('loading')) + '</div>'; return; }
    h += '<div class="tabs" role="tablist" style="--n:' + tabs.length + '">' + tabs.map(function (k) {
      return '<button type="button" role="tab" data-tab="' + k + '" aria-selected="' + (_tab === k) + '">' + esc(t('t' + k.charAt(0).toUpperCase() + k.slice(1))) + '</button>'; }).join('') + '</div>';
    if (_form === 'holder') h += holderForm();
    else if (_form === 'auth') h += authForm();
    else if (_tab === 'where') h += whereHtml();
    else if (_tab === 'who') h += whoHtml();
    else if (_tab === 'how') h += howHtml();
    else if (_tab === 'log') h += logHtml();
    sheet.innerHTML = h;
    sheet.setAttribute('aria-label', t('title'));
    sheet.scrollTop = keep;
  }
  function holderName(id) { var x = (_d.holders || []).filter(function (h) { return h.id === id; })[0]; return x ? x.name : ''; }

  function whereHtml() {
    var nm = homeName(), hs = _d.holders || [];
    var out = '<div class="p">' + esc(t('whereLead', { name: nm })) + '</div>';
    if (_d.edit_holders) out += '<button type="button" class="add" data-a="new-holder">+ ' + esc(t('addHolder')) + '</button>';
    else out += '<div class="p us">' + esc(t('onlyAllowed', { name: nm })) + '</div>';
    if (!hs.length) out += '<div class="empty">' + esc(t('noHolders')) + '</div>';
    hs.forEach(function (x) {
      out += '<div class="card" data-holder="' + esc(x.id) + '"><span class="pill">' + esc(t('hk_' + x.kind)) + '</span><h3>' + esc(x.name) + '</h3>' +
        (x.phone ? '<div class="m">' + esc(t('hPhone')) + ' ' + esc(x.phone) + '</div>' : '') +
        (x.fax ? '<div class="m">' + esc(t('fax')) + ' ' + esc(x.fax) + '</div>' : '') +
        (x.address ? '<div class="l">' + esc(x.address) + '</div>' : '') +
        (x.portal ? '<div class="l"><b>' + esc(t('portal')) + ':</b> <a href="' + esc(x.portal) + '" target="_blank" rel="noopener">' + esc(x.portal.replace(/^https?:\/\//, '').replace(/\/$/, '')) + '</a></div>' : '') +
        (x.notes ? '<div class="l">' + esc(x.notes) + '</div>' : '') +
        '<div class="row">' +
          (x.portal ? '<a class="b pri" href="' + esc(x.portal) + '" target="_blank" rel="noopener">' + esc(t('portal')) + '</a>' : '') +
          (x.phone ? '<a class="b" href="tel:' + esc(x.phone.replace(/[^\d+]/g, '')) + '">' + esc(t('call')) + '</a>' : '') +
          '<button type="button" class="b gold" data-a="how" data-id="' + esc(x.id) + '">' + esc(t('steps')) + '</button>' +
        '</div>' +
        (_d.edit_holders ? '<div class="row"><button type="button" class="b" data-a="edit-holder" data-id="' + esc(x.id) + '">' + esc(t('edit')) + '</button>' +
          '<button type="button" class="b warn' + (_sure === 'rm-' + x.id ? ' sure' : '') + '" data-a="rm-holder" data-id="' + esc(x.id) + '">' + esc(_sure === 'rm-' + x.id ? t('sure') : t('remove')) + '</button></div>' : '') +
        '</div>';
    });
    return out;
  }

  function scopeLine(a, lg) {
    if (a.scope === 'all') return t('allRecs', null, lg);
    return (a.kinds || []).map(function (k) { return t('k_' + k, null, lg); }).join(', ');
  }
  function datesLine(a, lg) {
    if (a.from && a.to) return t('dates', { from: dateOnly(a.from, lg), to: dateOnly(a.to, lg) }, lg);
    if (a.from) return t('datesFrom', { from: dateOnly(a.from, lg) }, lg);
    if (a.to) return t('datesTo', { to: dateOnly(a.to, lg) }, lg);
    return t('allDates', null, lg);
  }
  function endsLine(a, lg) { return [a.ends_on ? t('endsOn', { d: dateOnly(a.ends_on, lg) }, lg) : '', a.ends_event || ''].filter(Boolean).join('; '); }
  function whoHtml() {
    var nm = homeName(), as = _d.auths || [], me = myId();
    var out = '<div class="p">' + esc(_d.manage ? (isHome() ? t('whoLeadMe') : t('whoLeadMgr', { name: nm })) : t('whoLeadTeam', { name: nm })) + '</div>';
    if (_d.manage) out += '<button type="button" class="add" data-a="new-auth">+ ' + esc(t('newAuth')) + '</button>';
    if (!as.length) out += '<div class="empty">' + esc(_d.manage ? t('noAuths') : t('noAuthsYou')) + '</div>';
    as.forEach(function (a) {
      var on = a.status === 'active', p = a.person || {};
      out += '<div class="card' + (on ? ' gold' : ' off') + '" data-auth="' + esc(a.id) + '">' +
        '<span class="pill' + (on ? ' gold' : '') + '">' + esc(on ? t('active') : a.ended_reason === 'date' ? t('endedDate') : t('ended')) + '</span>' +
        '<h3>' + esc(p.name) + (a.person_user && a.person_user === me ? ' (' + esc(t('you')) + ')' : '') + '</h3>' +
        ((p.relation || p.profession) ? '<div class="m">' + esc([relShow(p.relation), p.profession].filter(Boolean).join(' · ')) + '</div>' : '') +
        '<div class="l"><b>' + esc(scopeLine(a)) + '</b></div>' +
        ((a.sensitive || []).length ? '<div class="l">' + a.sensitive.map(function (s) { return '<span class="pill sens">' + esc(t('s_' + s)) + '</span>'; }).join('') + '</div>' : '') +
        '<div class="l">' + esc(a.holders === 'all' ? t('fromAll') : t('fromSome', { list: a.holders.map(holderName).filter(Boolean).join(', ') })) + '</div>' +
        '<div class="l">' + esc(datesLine(a)) + '</div>' +
        '<div class="l"><b>' + esc(t('purpose')) + ':</b> ' + esc(a.purpose) + '</div>' +
        '<div class="l"><b>' + esc(t('ends')) + ':</b> ' + esc(endsLine(a)) + '</div>' +
        (a.signer === 'rep' && a.rep_name ? '<div class="m" style="margin-top:6px">' + esc(t('signedRep', { name: a.rep_name })) + '</div>' : '') +
        '<div class="row"><button type="button" class="b gold" data-a="print" data-id="' + esc(a.id) + '">' + esc(t('print')) + '</button>' +
          (_d.manage && on ? '<button type="button" class="b" data-a="edit-auth" data-id="' + esc(a.id) + '">' + esc(t('edit')) + '</button>' +
            '<button type="button" class="b warn' + (_sure === 'end-' + a.id ? ' sure' : '') + '" data-a="end-auth" data-id="' + esc(a.id) + '">' + esc(_sure === 'end-' + a.id ? t('endSure') : t('end')) + '</button>' : '') +
        '</div></div>';
    });
    return out;
  }

  function howHtml() {
    var nm = homeName(), hs = _d.holders || [], me = myId();
    var named = (_d.auths || []).filter(function (a) { return a.person_user === me && a.status === 'active'; });
    var who = _d.standing === 'home' ? 'home' : _d.standing === 'decider' ? 'decider' : named.length ? 'named' : 'none';
    var out = '<div class="p">' + esc(t('howLead', { name: nm })) + '</div><div class="p us">' + esc(t('howUS')) + '</div>' +
      '<div class="card"><h4>' + esc(t('h1t', { name: nm })) + '</h4><div class="l">' + esc(t('h1', { name: nm })) + '</div></div>' +
      '<div class="card"><h4>' + esc(t('h2t')) + '</h4><div class="l">' + esc(t('h2', { name: nm })) + '</div></div>' +
      '<div class="card"><h4>' + esc(t('h3t', { name: nm })) + '</h4><div class="l">' + esc(t('h3', { name: nm })) + '</div><div class="m" style="margin-top:6px">' + esc(t('h3b', { name: nm })) + '</div></div>' +
      '<div class="card gold"><div class="l" style="margin:0"><b>' + esc(t('youAre_' + who, { name: nm })) + '</b></div></div>';
    if (!hs.length) return out + '<div class="empty">' + esc(t('noHolderSteps')) + '</div>';
    if (!_how || !hs.some(function (x) { return x.id === _how; })) _how = hs[0].id;
    var x = hs.filter(function (y) { return y.id === _how; })[0];
    out += '<label class="f">' + esc(t('pick')) + '</label><div class="chips">' + hs.map(function (y) { return '<button type="button" class="chip" data-a="how" data-id="' + esc(y.id) + '" aria-pressed="' + (y.id === _how) + '">' + esc(y.name) + '</button>'; }).join('') + '</div>';
    var self = who === 'home' || who === 'decider', steps = [];
    if (x.portal) steps.push(esc(t('sp1', { name: nm })) + '<div class="row"><a class="b pri" href="' + esc(x.portal) + '" target="_blank" rel="noopener">' + esc(t('openPortal')) + '</a></div>');
    steps.push(esc(x.phone ? t('sp2', { phone: x.phone }) : t('sp2n')) + (x.phone ? '<div class="row"><a class="b" href="tel:' + esc(x.phone.replace(/[^\d+]/g, '')) + '">' + esc(t('call')) + ' ' + esc(x.phone) + '</a></div>' : ''));
    if (self) steps.push(esc(t('sp3self')));
    else {
      var mine = named.filter(function (a) { return a.holders === 'all' || a.holders.indexOf(x.id) >= 0; })[0];
      steps.push(esc(x.fax ? t('sp3', { fax: x.fax }) : t('sp3n')) + (mine ? '<div class="row"><button type="button" class="b gold" data-a="print" data-id="' + esc(mine.id) + '">' + esc(t('print')) + '</button></div>' : ''));
    }
    steps.push(esc(t('sp4')));
    out += '<div class="card" style="margin-top:8px"><h4>' + esc(t('stepsFor', { holder: x.name })) + '</h4><ol class="st">' + steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol></div>';
    return out;
  }

  function logHtml() {
    var nm = homeName(), ls = _d.log || [], names = {};
    (_d.auths || []).forEach(function (a) { names[a.id] = (a.person || {}).name; });
    var out = '<div class="p">' + esc(t('logLead', { name: nm })) + '</div>';
    if (!ls.length) return out + '<div class="empty">' + esc(t('noLog')) + '</div>';
    return out + ls.map(function (l) {
      var who = names[l.auth_id] || String(l.detail || '').split(':')[0];
      var by = l.by === myId() ? (IT() ? 'Tu' : 'You') : first(l.by_name) || '?';
      return '<div class="lg">' + esc(t('la_' + l.action, { by: by, who: who })) + '<small>' + esc(stamp(l.at)) + '</small></div>';
    }).join('');
  }

  /* ── the forms ── */
  function fld(key, label, ph, type) { return '<label class="f">' + esc(label) + '</label><input type="' + (type || 'text') + '" data-f="' + key + '" value="' + esc(_f[key] || '') + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>'; }
  function holderForm() {
    return '<div class="card gold"><h3>' + esc(_f.id ? t('edit') : t('addHolder')) + '</h3>' +
      fld('name', t('hName'), t('hNamePh')) +
      '<label class="f">' + esc(t('hKind')) + '</label><div class="chips">' + HK.map(function (k) { return '<button type="button" class="chip" data-a="hk" data-k="' + k + '" aria-pressed="' + (_f.kind === k) + '">' + esc(t('hk_' + k)) + '</button>'; }).join('') + '</div>' +
      '<div class="two"><div>' + fld('phone', t('hPhone'), '', 'tel') + '</div><div>' + fld('fax', t('hFax'), '', 'tel') + '</div></div>' +
      fld('address', t('hAddress')) + fld('portal', t('hPortal'), t('hPortalPh'), 'url') + fld('notes', t('hNotes'), t('hNotesPh')) +
      (_f.err ? '<div class="err">' + esc(_f.err) + '</div>' : '') +
      '<div class="row"><button type="button" class="b" data-a="cancel">' + esc(t('cancel')) + '</button><button type="button" class="b gold" data-a="save-holder">' + esc(t('save')) + '</button></div></div>';
  }
  function authForm() {
    var nm = homeName(), team = _d.team || [], hs = _d.holders || [];
    var h = '<div class="card gold"><h3>' + esc(_f.id ? t('fEdit') : t('fNew')) + '</h3>' +
      '<label class="f">' + esc(t('fWho')) + '</label><div class="chips">' +
      team.map(function (m) { return '<button type="button" class="chip" data-a="who" data-k="' + esc(m.user_id) + '" aria-pressed="' + (_f.who === m.user_id) + '">' + esc(m.name) + '</button>'; }).join('') +
      '<button type="button" class="chip" data-a="who" data-k="out" aria-pressed="' + (_f.who === 'out') + '">' + esc(t('fOutside')) + '</button></div>';
    if (_f.who === 'out') h += fld('name', t('fName'));
    if (_f.who) h += '<div class="two"><div>' + fld('relation', t('fRel'), t('fRelPh')) + '</div><div>' + fld('profession', t('fProf'), t('fProfPh')) + '</div></div>';
    h += '<label class="f">' + esc(t('fWhat')) + '</label><div class="chips"><button type="button" class="chip" data-a="scope" data-k="all" aria-pressed="' + (_f.scope === 'all') + '">' + esc(t('fAll')) + '</button>' +
      '<button type="button" class="chip" data-a="scope" data-k="some" aria-pressed="' + (_f.scope === 'some') + '">' + esc(t('fChoose')) + '</button></div>';
    if (_f.scope === 'some') h += '<div class="chips">' + KINDS.map(function (k) { return '<button type="button" class="chip" data-a="kind" data-k="' + k + '" aria-pressed="' + !!_f.kinds[k] + '">' + esc(t('k_' + k)) + '</button>'; }).join('') + '</div>';
    h += '<div class="sens-box"><label class="f" style="margin-top:0;color:#ffb3c4">' + esc(t('fSens')) + '</label><div class="why">' + esc(t('fSensWhy', { name: nm })) + '</div><div class="chips">' +
      SENS.map(function (k) { return '<button type="button" class="chip sens" data-a="sens" data-k="' + k + '" aria-pressed="' + !!_f.sens[k] + '">' + (_f.sens[k] ? '✓ ' : '') + esc(t('s_' + k)) + '</button>'; }).join('') + '</div>' +
      (_f.sens.psychotherapy ? '<div class="why">' + esc(t('fPsyNote')) + '</div>' : '') + '</div>';
    h += '<label class="f">' + esc(t('fRange')) + '</label><div class="two"><div>' + fld('from', t('fFrom'), '', 'date') + '</div><div>' + fld('to', t('fTo'), '', 'date') + '</div></div>';
    h += '<label class="f">' + esc(t('fFromWhere')) + '</label><div class="chips"><button type="button" class="chip" data-a="hall" aria-pressed="' + !!_f.hall + '">' + esc(t('fAllHolders')) + '</button>' +
      hs.map(function (x) { return '<button type="button" class="chip" data-a="hs" data-k="' + esc(x.id) + '" aria-pressed="' + (!_f.hall && !!_f.hs[x.id]) + '">' + esc(x.name) + '</button>'; }).join('') + '</div>';
    h += fld('purpose', t('fPurpose'), t('fPurposePh'));
    h += '<label class="f">' + esc(t('fEnds')) + '</label><div class="chips"><button type="button" class="chip" data-a="ends" data-k="date" aria-pressed="' + (_f.ends === 'date') + '">' + esc(t('fEndsDate')) + '</button>' +
      '<button type="button" class="chip" data-a="ends" data-k="event" aria-pressed="' + (_f.ends === 'event') + '">' + esc(t('fEndsEvent')) + '</button></div>' +
      (_f.ends === 'date' ? '<input type="date" data-f="ends_on" value="' + esc(_f.ends_on || '') + '">' : '<input type="text" data-f="ends_event" value="' + esc(_f.ends_event || '') + '" placeholder="' + esc(t('fEndsEventPh')) + '">');
    h += '<label class="f">' + esc(t('fSigner')) + '</label><div class="chips"><button type="button" class="chip" data-a="signer" data-k="self" aria-pressed="' + (_f.signer === 'self') + '">' + esc(t('fSelf', { name: nm })) + '</button>' +
      '<button type="button" class="chip" data-a="signer" data-k="rep" aria-pressed="' + (_f.signer === 'rep') + '">' + esc(t('fRep')) + '</button></div>';
    if (_f.signer === 'rep') h += '<div class="two"><div>' + fld('rep_name', t('fRepName')) + '</div><div>' + fld('rep_authority', t('fRepAuth'), t('fRepAuthPh')) + '</div></div>';
    h += (_f.err ? '<div class="err">' + esc(_f.err) + '</div>' : '') +
      '<div class="row"><button type="button" class="b" data-a="cancel">' + esc(t('cancel')) + '</button><button type="button" class="b gold" data-a="save-auth">' + esc(t('fSave')) + '</button></div></div>';
    return h;
  }
  function newAuthState(a) {
    var dec = _d.standing === 'decider', proxy = _d.proxy;
    if (!a) return { who: '', name: '', relation: '', profession: '', scope: 'some', kinds: {}, sens: {}, from: '', to: '', hall: true, hs: {}, purpose: '', ends: 'date', ends_on: '', ends_event: '',
      signer: dec ? 'rep' : 'self', rep_name: dec && proxy ? proxy.name : '', rep_authority: '' };
    var f = { id: a.id, who: a.person_user || 'out', name: a.person.name, relation: relShow(a.person.relation), relRaw: a.person.relation, relLab: relShow(a.person.relation), profession: a.person.profession, scope: a.scope, kinds: {}, sens: {}, from: a.from || '', to: a.to || '',
      hall: a.holders === 'all', hs: {}, purpose: a.purpose, ends: a.ends_on ? 'date' : 'event', ends_on: a.ends_on || '', ends_event: a.ends_event || '', signer: a.signer, rep_name: a.rep_name, rep_authority: a.rep_authority };
    (a.kinds || []).forEach(function (k) { f.kinds[k] = 1; }); (a.sensitive || []).forEach(function (k) { f.sens[k] = 1; });
    if (a.holders !== 'all') a.holders.forEach(function (k) { f.hs[k] = 1; });
    return f;
  }

  async function saveHolder() {
    var f = _f; if (!String(f.name || '').trim()) { f.err = t('needName'); return render(); }
    var body = { name: f.name, kind: f.kind || 'other', phone: f.phone || '', fax: f.fax || '', address: f.address || '', portal: f.portal || '', notes: f.notes || '' };
    if (homeUser()) body.home = homeUser();
    var r = await api(f.id ? '/care-records/holders/' + encodeURIComponent(f.id) : '/care-records/holders', { method: f.id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    if (!r.ok) { f.err = /portal/.test(r.data.detail || '') ? t('badPortal') : t('failed'); return render(); }
    _form = null; _f = null; _tab = 'where'; await load();
  }
  async function saveAuth() {
    var f = _f;
    if (!f.who || (f.who === 'out' && !String(f.name || '').trim())) { f.err = t('fNeedWho'); return render(); }
    var kinds = Object.keys(f.kinds).filter(function (k) { return f.kinds[k]; }), sens = Object.keys(f.sens).filter(function (k) { return f.sens[k]; });
    if (f.scope === 'some' && !kinds.length && !sens.length) { f.err = t('fNeedWhat'); return render(); }
    if ((f.ends === 'date' && !f.ends_on) || (f.ends === 'event' && !String(f.ends_event || '').trim())) { f.err = t('fNeedEnd'); return render(); }
    var hs = Object.keys(f.hs).filter(function (k) { return f.hs[k]; });
    var body = { scope: f.scope, kinds: kinds, sensitive: sens, from: f.from || null, to: f.to || null, holders: f.hall || !hs.length ? 'all' : hs, purpose: f.purpose || '',
      ends_on: f.ends === 'date' ? f.ends_on : null, ends_event: f.ends === 'event' ? f.ends_event : null, signer: f.signer, rep_name: f.signer === 'rep' ? f.rep_name || '' : null, rep_authority: f.signer === 'rep' ? f.rep_authority || '' : null };
    var person = { name: f.name || '', relation: f.relLab && f.relation === f.relLab ? f.relRaw : f.relation || '', profession: f.profession || '' };
    if (f.who === 'out') { body.person = person; if (f.id) body.person_user = null; } else { body.person_user = f.who; body.person = person; }
    if (homeUser()) body.home = homeUser();
    var r = await api(f.id ? '/care-records/auths/' + encodeURIComponent(f.id) : '/care-records/auths', { method: f.id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    if (!r.ok) { f.err = r.data && r.data.detail ? r.data.detail : t('failed'); return render(); }
    _form = null; _f = null; _tab = 'who'; await load();
  }

  async function onClick(e) {
    var b = e.target.closest && e.target.closest('[data-a],[data-tab]'); if (!b || !sheet.contains(b)) return;
    var a = b.getAttribute('data-a'), id = b.getAttribute('data-id'), k = b.getAttribute('data-k');
    if (b.hasAttribute('data-tab')) { _tab = b.getAttribute('data-tab'); _form = null; _f = null; _sure = ''; sheet.scrollTop = 0; return render(); }
    if (a !== 'rm-holder' && a !== 'end-auth') _sure = '';
    switch (a) {
      case 'close': return close();
      case 'new-holder': _form = 'holder'; _f = { kind: 'doctor' }; sheet.scrollTop = 0; return render();
      case 'edit-holder': _form = 'holder'; _f = Object.assign({}, (_d.holders || []).filter(function (x) { return x.id === id; })[0] || {}); sheet.scrollTop = 0; return render();
      case 'hk': _f.kind = k; return render();
      case 'save-holder': return saveHolder();
      case 'rm-holder':
        if (_sure !== 'rm-' + id) { _sure = 'rm-' + id; return render(); }
        _sure = ''; var rr = await api('/care-records/holders/' + encodeURIComponent(id), { method: 'DELETE' }); if (!rr.ok) toast(t('failed')); return load();
      case 'how': _how = id; _tab = 'how'; _form = null; return render();
      case 'cancel': _form = null; _f = null; return render();
      case 'new-auth': _form = 'auth'; _f = newAuthState(null); sheet.scrollTop = 0; return render();
      case 'edit-auth': _form = 'auth'; _f = newAuthState((_d.auths || []).filter(function (x) { return x.id === id; })[0]); sheet.scrollTop = 0; return render();
      case 'who':
        _f.who = k;
        if (k !== 'out') { var m = (_d.team || []).filter(function (x) { return x.user_id === k; })[0]; if (m) { _f.name = m.name; _f.relRaw = m.relation; _f.relLab = relShow(m.relation); _f.relation = _f.relLab; _f.profession = m.profession; } }
        else { _f.name = ''; _f.relation = ''; _f.profession = ''; _f.relLab = ''; _f.relRaw = ''; }
        return render();
      case 'scope': _f.scope = k; return render();
      case 'kind': _f.kinds[k] = !_f.kinds[k]; return render();
      case 'sens': _f.sens[k] = !_f.sens[k]; return render();
      case 'hall': _f.hall = !_f.hall; return render();
      case 'hs': _f.hs[k] = !_f.hs[k]; _f.hall = !Object.keys(_f.hs).some(function (x) { return _f.hs[x]; }); return render();
      case 'ends': _f.ends = k; return render();
      case 'signer': _f.signer = k; return render();
      case 'save-auth': return saveAuth();
      case 'end-auth':
        if (_sure !== 'end-' + id) { _sure = 'end-' + id; return render(); }
        _sure = ''; var re = await api('/care-records/auths/' + encodeURIComponent(id) + '/end', { method: 'POST', body: '{}' }); if (!re.ok) toast(t('failed')); return load();
      case 'print': return showPrint(id);
    }
  }

  /* ── the printable HIPAA authorization (45 CFR 164.508(c)) ── */
  var P = {
    en: {
      brand: 'Remiel: Covara · Beverly Index LLC', h: 'Authorization to Use and Disclose Protected Health Information', reg: 'HIPAA Privacy Rule · 45 CFR 164.508',
      s1: '1. Patient', pName: 'Patient name', dob: 'Date of birth', addr: 'Address and phone',
      s2: '2. Who may disclose the information', s2all: 'Each of the following record holders:', s2none: 'Name each provider, health plan or pharmacy:',
      s3: '3. Who may receive the information', rName: 'Name', rRel: 'Relationship', rProf: 'Profession', rAddr: 'Address and phone',
      s4: '4. The information to be disclosed', all: 'My complete medical record, including visit notes, test results, imaging, medicines, hospital discharge papers and billing records. This does not include the specially protected information in section 5 unless it is ticked and initialed there.',
      some: 'Only the following records:', dates: 'Dates of service:',
      s5: '5. Specially protected information', s5why: 'Each item below is disclosed only because it was chosen separately and is initialed here.', ini: 'Initials ______',
      sens: { psychotherapy: 'Psychotherapy notes. Many providers require a separate authorization form for psychotherapy notes.', sud: 'Substance use disorder treatment records protected by 42 CFR Part 2.', hiv: 'HIV and AIDS tests, results and treatment.', genetic: 'Genetic tests and genetic information.', reproductive: 'Reproductive health care records.' },
      s5none: 'None. Specially protected information (psychotherapy notes, substance use disorder treatment records under 42 CFR Part 2, HIV, genetic tests and reproductive health) is not authorized.',
      s6: '6. Purpose', s7: '7. Expiration', s7d: 'This authorization expires on {d}.', s7e: 'This authorization expires at this event: {e}.', s7both: 'This authorization expires on {d}, or earlier when: {e}.',
      s8: '8. My rights',
      r1: 'I may revoke this authorization at any time by sending a signed written notice to each provider or health plan named in section 2 (to its medical records or privacy office). Revoking it does not undo any disclosure already made in reliance on this authorization.',
      r2: 'My treatment, payment, enrollment in a health plan, or eligibility for benefits will not be conditioned on whether I sign this authorization.',
      r3: 'Information disclosed under this authorization may be redisclosed by the recipient and may no longer be protected by federal privacy rules.',
      r3sud: 'Records protected by 42 CFR Part 2 are subject to that rule’s limits on redisclosure and use against the patient in legal proceedings.',
      r4: 'I may refuse to sign this authorization, and I am entitled to a copy of it once signed.',
      s9: '9. Signature', sig: 'Signature of patient or personal representative', date: 'Date', printName: 'Printed name',
      repH: 'If signed by a personal representative', repName: 'Representative’s name', repAuth: 'Authority to act for the patient (attach a copy)',
      foot: 'Covara provides this form as a convenience. It is not legal advice. Some providers require their own authorization form; if so, use theirs. Covara does not keep medical records.', ref: 'Prepared {d} · Reference {id}'
    },
    it: {
      brand: 'Remiel: Covara · Beverly Index LLC', h: 'Autorizzazione all’uso e alla divulgazione di informazioni sanitarie protette', reg: 'HIPAA Privacy Rule (USA) · 45 CFR 164.508',
      s1: '1. Paziente', pName: 'Nome del paziente', dob: 'Data di nascita', addr: 'Indirizzo e telefono',
      s2: '2. Chi può divulgare le informazioni', s2all: 'Ciascuno dei seguenti luoghi:', s2none: 'Indicare ogni medico, struttura, assicurazione o farmacia:',
      s3: '3. Chi può ricevere le informazioni', rName: 'Nome', rRel: 'Rapporto', rProf: 'Professione', rAddr: 'Indirizzo e telefono',
      s4: '4. Le informazioni da divulgare', all: 'La mia cartella clinica completa: note delle visite, risultati degli esami, immagini, medicine, lettere di dimissione e fatture. Non comprende le informazioni particolarmente protette della sezione 5, salvo che siano spuntate e siglate lì.',
      some: 'Solo le seguenti cartelle:', dates: 'Date delle prestazioni:',
      s5: '5. Informazioni particolarmente protette', s5why: 'Ogni voce qui sotto è divulgata solo perché è stata scelta a parte ed è siglata qui.', ini: 'Sigla ______',
      sens: { psychotherapy: 'Note di psicoterapia. Molte strutture richiedono un modulo di autorizzazione a parte per le note di psicoterapia.', sud: 'Cartelle sulla cura delle dipendenze protette dal 42 CFR Part 2 (USA).', hiv: 'Test, risultati e cure per HIV e AIDS.', genetic: 'Test genetici e informazioni genetiche.', reproductive: 'Cartelle sulla salute riproduttiva.' },
      s5none: 'Nessuna. Le informazioni particolarmente protette (note di psicoterapia, cura delle dipendenze secondo il 42 CFR Part 2, HIV, test genetici e salute riproduttiva) non sono autorizzate.',
      s6: '6. Scopo', s7: '7. Scadenza', s7d: 'Questa autorizzazione scade il {d}.', s7e: 'Questa autorizzazione scade con questo evento: {e}.', s7both: 'Questa autorizzazione scade il {d}, o prima quando: {e}.',
      s8: '8. I miei diritti',
      r1: 'Posso revocare questa autorizzazione in qualsiasi momento inviando una comunicazione scritta e firmata a ciascun luogo della sezione 2 (all’ufficio cartelle cliniche o privacy). La revoca non annulla le divulgazioni già fatte sulla base di questa autorizzazione.',
      r2: 'Le mie cure, i pagamenti, l’iscrizione a un piano sanitario o il diritto a prestazioni non dipendono dalla mia firma su questa autorizzazione.',
      r3: 'Le informazioni divulgate con questa autorizzazione possono essere divulgate di nuovo da chi le riceve e potrebbero non essere più protette dalle norme federali sulla privacy (USA).',
      r3sud: 'Le cartelle protette dal 42 CFR Part 2 restano soggette ai limiti di quella norma sulla nuova divulgazione e sull’uso contro il paziente in procedimenti legali.',
      r4: 'Posso rifiutare di firmare questa autorizzazione, e ho diritto a una copia una volta firmata.',
      s9: '9. Firma', sig: 'Firma del paziente o del rappresentante legale', date: 'Data', printName: 'Nome in stampatello',
      repH: 'Se firma un rappresentante legale', repName: 'Nome del rappresentante', repAuth: 'Potere di agire per il paziente (allegare una copia)',
      foot: 'Covara offre questo modulo per comodità. Non è una consulenza legale. Alcune strutture richiedono un proprio modulo di autorizzazione; in quel caso usate il loro. Covara non tiene cartelle cliniche. Per le strutture negli Stati Uniti valgono le regole HIPAA.', ref: 'Preparato il {d} · Riferimento {id}'
    }
  };
  function pt(lg, k, p) { var s = P[lg][k]; if (p) Object.keys(p).forEach(function (x) { s = s.split('{' + x + '}').join(p[x] == null ? '' : p[x]); }); return s; }
  function ln(label, val) { return '<div class="ln"><span>' + esc(label) + ':</span><i>' + esc(val || '') + '</i></div>'; }
  function paperHtml(a, lg) {
    var hs = a.holders === 'all' ? (_d.holders || []) : (_d.holders || []).filter(function (x) { return a.holders.indexOf(x.id) >= 0; });
    var p = a.person || {}, homeFull = (_d.home && _d.home.name) || '', today = new Date().toISOString().slice(0, 10);
    var h = '<div class="cvr-paper" lang="' + lg + '"><div class="top"><div><div class="brand">' + esc(pt(lg, 'brand')) + '</div><h1>' + esc(pt(lg, 'h')) + '</h1></div><div class="reg">' + esc(pt(lg, 'reg')) + '</div></div>';
    h += '<h2>' + esc(pt(lg, 's1')) + '</h2>' + ln(pt(lg, 'pName'), homeFull) + ln(pt(lg, 'dob'), '') + ln(pt(lg, 'addr'), '');
    h += '<h2>' + esc(pt(lg, 's2')) + '</h2>';
    if (hs.length) h += '<p>' + esc(pt(lg, 's2all')) + '</p><ul>' + hs.map(function (x) { return '<li><b>' + esc(x.name) + '</b> (' + esc(t('hk_' + x.kind, null, lg)) + ')' + esc([x.address, x.phone ? 'tel ' + x.phone : '', x.fax ? 'fax ' + x.fax : ''].filter(Boolean).map(function (s) { return ', ' + s; }).join('')) + '</li>'; }).join('') + '</ul>';
    else h += '<p>' + esc(pt(lg, 's2none')) + '</p>' + ln('1', '') + ln('2', '');
    h += '<h2>' + esc(pt(lg, 's3')) + '</h2>' + ln(pt(lg, 'rName'), p.name) + ln(pt(lg, 'rRel'), relShow(p.relation)) + ln(pt(lg, 'rProf'), p.profession) + ln(pt(lg, 'rAddr'), '');
    h += '<h2>' + esc(pt(lg, 's4')) + '</h2>' + (a.scope === 'all' ? '<p>' + esc(pt(lg, 'all')) + '</p>' : '<p>' + esc(pt(lg, 'some')) + '</p><ul>' + (a.kinds || []).map(function (k) { return '<li>' + esc(t('k_' + k, null, lg)) + '</li>'; }).join('') + '</ul>') +
      '<p><b>' + esc(pt(lg, 'dates')) + '</b> ' + esc(datesLine(a, lg)) + '</p>';
    h += '<h2>' + esc(pt(lg, 's5')) + '</h2>';
    if ((a.sensitive || []).length) h += '<p>' + esc(pt(lg, 's5why')) + '</p>' + a.sensitive.map(function (s) { return '<div class="tick"><span class="bx">✓</span><span>' + esc(P[lg].sens[s]) + '</span><span class="ini">' + esc(pt(lg, 'ini')) + '</span></div>'; }).join('');
    else h += '<p>' + esc(pt(lg, 's5none')) + '</p>';
    h += '<h2>' + esc(pt(lg, 's6')) + '</h2><p>' + esc(a.purpose) + '</p>';
    h += '<h2>' + esc(pt(lg, 's7')) + '</h2><p>' + esc(a.ends_on && a.ends_event ? pt(lg, 's7both', { d: dateOnly(a.ends_on, lg), e: a.ends_event }) : a.ends_on ? pt(lg, 's7d', { d: dateOnly(a.ends_on, lg) }) : pt(lg, 's7e', { e: a.ends_event })) + '</p>';
    h += '<h2>' + esc(pt(lg, 's8')) + '</h2><div class="st">' + esc(pt(lg, 'r1')) + '</div><div class="st">' + esc(pt(lg, 'r2')) + '</div><div class="st">' + esc(pt(lg, 'r3')) +
      ((a.sensitive || []).indexOf('sud') >= 0 ? ' ' + esc(pt(lg, 'r3sud')) : '') + '</div><div class="st">' + esc(pt(lg, 'r4')) + '</div>';
    h += '<h2>' + esc(pt(lg, 's9')) + '</h2><div class="sig"><div>' + ln(pt(lg, 'sig'), '') + '</div><div>' + ln(pt(lg, 'date'), '') + '</div></div>' + ln(pt(lg, 'printName'), a.signer === 'rep' ? a.rep_name : homeFull) +
      '<p style="margin-top:8px"><b>' + esc(pt(lg, 'repH')) + '</b></p>' + ln(pt(lg, 'repName'), a.signer === 'rep' ? a.rep_name : '') + ln(pt(lg, 'repAuth'), a.signer === 'rep' ? a.rep_authority : '');
    h += '<div class="foot">' + esc(pt(lg, 'foot')) + '<br>' + esc(pt(lg, 'ref', { d: dateOnly(today, lg), id: String(a.id).slice(0, 8).toUpperCase() })) + '</div></div>';
    return h;
  }
  var printEl = null, _pa = null;
  function drawPrint() {
    if (!printEl || !_pa) return;
    var lg = _plang;
    printEl.innerHTML = '<div class="bar"><button type="button" class="gold" data-p="print">' + esc(t('pPrint')) + '</button><span class="sp"></span>' +
      '<button type="button" data-p="en" aria-pressed="' + (lg === 'en') + '" aria-label="' + esc(t('pLang')) + ' ' + esc(t('pEn')) + '">EN</button><button type="button" data-p="it" aria-pressed="' + (lg === 'it') + '" aria-label="' + esc(t('pLang')) + ' ' + esc(t('pIt')) + '">IT</button>' +
      '<button type="button" data-p="close" aria-label="' + esc(t('pClose')) + '">×</button></div>' + paperHtml(_pa, lg);
  }
  function showPrint(id) {
    var a = _d && (_d.auths || []).filter(function (x) { return x.id === id; })[0]; if (!a) return;
    _pa = a; _plang = lang();
    if (!printEl) {
      printEl = document.createElement('div'); printEl.id = 'cvrPrint'; printEl.setAttribute('role', 'dialog'); printEl.setAttribute('aria-modal', 'true');
      ['touchstart', 'touchend', 'mousedown', 'mouseup', 'click'].forEach(function (ev) { printEl.addEventListener(ev, function (e) { e.stopPropagation(); }); });
      printEl.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-p]'); if (!b) return;
        var k = b.getAttribute('data-p');
        if (k === 'close') return closePrint();
        if (k === 'en' || k === 'it') { _plang = k; return drawPrint(); }
        if (k === 'print') {
          api('/care-records/auths/' + encodeURIComponent(_pa.id) + '/printed', { method: 'POST', body: '{}' }).then(function () { if (_d && _d.manage) load(); }).catch(function () {});
          printFrame(_pa, _plang);
        }
      });
      document.body.appendChild(printEl);
    }
    printEl.hidden = false; printEl.scrollTop = 0;
    drawPrint();
  }
  /* The form prints from its own frame, so nothing else on the screen (or another part's print rules) reaches the paper */
  function printDoc(a, lg) {
    return '<!doctype html><html lang="' + lg + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(pt(lg, 'h')) + '</title>' +
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800&family=JetBrains+Mono:wght@600;700&display=swap">' +
      '<style>@page{margin:14mm}html,body{margin:0;background:#fff}' + PAPER + '.cvr-paper{box-shadow:none;margin:0 auto;padding:0;border-radius:0}.cvr-paper .tick,.cvr-paper .st,.cvr-paper .sig{break-inside:avoid}</style></head><body>' + paperHtml(a, lg) + '</body></html>';
  }
  function printFrame(a, lg) {
    var old = document.getElementById('cvrFrame'); if (old) old.remove();
    var f = document.createElement('iframe'); f.id = 'cvrFrame'; f.setAttribute('aria-hidden', 'true'); f.title = 'print';
    f.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none';
    f.onload = function () { setTimeout(function () { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) { try { window.print(); } catch (er) {} } }, 250); };
    document.body.appendChild(f);
    f.srcdoc = printDoc(a, lg);
  }
  function closePrint() { if (printEl) printEl.hidden = true; }

  /* ── the Records tile on the care card (covara-person.js draws the card; this adds one tile under the others) ── */
  var _cache = null;
  function tileText() {
    var d = _d || _cache;
    if (!d) return t('tileSub');
    var act = (d.auths || []).filter(function (a) { return a.status === 'active'; });
    if (!d.manage) return act.length ? t('tileMine') : t('tileSub');
    return act.length || (d.holders || []).length ? t('tileN', { a: act.length, h: (d.holders || []).length }) : t('tileSub');
  }
  function paintTile() {
    var el = document.querySelector('#cvpSheet [data-k=records] span'); if (el) el.textContent = tileText();
    var b = document.querySelector('#cvpSheet [data-k=records] b'); if (b) b.textContent = t('tile');
  }
  function addTile(sh) {
    var grid = sh.querySelector('.cvp-grid'); if (!grid || grid.querySelector('[data-k=records]')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'cvr-tile'; b.setAttribute('data-k', 'records');
    b.innerHTML = '<b>' + esc(t('tile')) + '</b><span>' + esc(tileText()) + '</span>';
    b.onclick = function () { open('where'); };
    grid.appendChild(b);
    if (authed() && (role() === 'home' || homeUser())) api('/care-records' + q()).then(function (r) { if (r.ok) { _cache = r.data; paintTile(); } }).catch(function () {});
  }
  function watchCard() {
    var sh = document.getElementById('cvpSheet');
    if (!sh) return false;
    new MutationObserver(function () { addTile(sh); }).observe(sh, { childList: true });
    addTile(sh); return true;
  }
  /* Papers: the existing "Access to medical records" entry gets a door into this section */
  function addPapersDoor() {
    var det = document.querySelector('#cvTabs .cvx-item[data-id=records] .cvx-det');
    if (!det || !det.children.length || det.querySelector('[data-cvr]')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'cvx-add'; b.setAttribute('data-cvr', '1'); b.textContent = t('title') + ': ' + t('tWho') + ', ' + t('tHow').toLowerCase();
    b.onclick = function (e) { e.stopPropagation(); open('who'); };
    det.appendChild(b);
  }
  function watchPapers() {
    var box = document.getElementById('cvTabs'); if (!box) return false;
    var pend = 0;
    new MutationObserver(function () { if (pend) return; pend = setTimeout(function () { pend = 0; addPapersDoor(); }, 60); }).observe(box, { childList: true, subtree: true });
    return true;
  }
  function boot() {
    var a = watchCard(), b = watchPapers();
    if (a && b) return;
    var mo = new MutationObserver(function () { if (!a) a = watchCard(); if (!b) b = watchPapers(); if (a && b) mo.disconnect(); });
    mo.observe(document.body, { childList: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('localeChanged', function () { if (_open) render(); paintTile(); if (printEl && !printEl.hidden) drawPrint(); });

  window.CovaraRecords = { open: open, close: function () { close(); }, isOpen: function () { return _open; }, data: function () { return _d; }, print: showPrint, closePrint: closePrint, printDoc: function (id, lg) { var a = _d && (_d.auths || []).filter(function (x) { return x.id === id; })[0]; return a ? printDoc(a, lg || lang()) : ''; }, reload: load };
})();
