/* Remiel: Covara, HOME's care inside the Sentinel galaxy.
   HOME's care: five pills on the left of HOME's sphere (Medicines, Visits,
   Health, Safety, Papers); each opens its panel in the upper left.
   A tab opens a drop-down list ordered by what is needed soonest; each
   entry opens to its details, with the photo HOME took, and the question
   "Is it working?". People (HOME, the family, the doctors) are spheres;
   things are entries in the tabs. On AWAY's phone HOME is the centre
   sphere, with Video, Phone, Message and Email beside it.
   Beverly Index LLC */
(function () {
  'use strict';
  var STR = {
    en: {
      sec_med: 'Medicines', sec_visit: 'Visits', sec_health: 'Health', sec_safety: 'Safety', sec_papers: 'Papers', me: 'me',
      pv_med: 'Doses, photos of each bottle, refills', pv_visit: 'Appointments, carers, the day log', pv_health: 'Sleep, breathing, how the day went', pv_safety: 'Emergency card, wandering, worries', pv_papers: 'Who decides, documents, records access', pv_late: 'needs attention', pv_due: 'due now',
      dFilled: 'Prescription', filled: 'Filled', filledOn: 'Filled {d}', notFilled: 'Not filled',
      dayOf: 'The day of {name}', dayHint: 'Tap what you saw. Anyone looking after them sees it, and a sudden change warns everyone.', lastDays: 'Last days', warnTail: 'Sudden changes like these can mean an infection, dehydration or pain. Consider calling the doctor.',
      lg_water: 'Drinking', lg_meal: 'Meals', lg_sleep: 'Sleep', lg_toilet: 'Toilet', lg_pain: 'Pain', lg_mood: 'Mood', lg_behaviour: 'Behaviour',
      lv_none: 'None', lv_little: 'A little', lv_enough: 'Enough', lv_some: 'Some', lv_all: 'All', lv_bad: 'Bad', lv_broken: 'Broken', lv_good: 'Good', lv_normal: 'Normal', lv_accident: 'Accident', lv_pain: 'Pain',
      lv_calm: 'Calm', lv_confused: 'Confused', lv_upset: 'Upset', lv_wandering: 'Wandering', lv_agitated: 'Agitated', lv_repeating: 'Repeating', lv_refusing: 'Refusing', lv_hallucinating: 'Seeing things', lv_other: 'Other',
      forEr: 'For the emergency room', erShort: 'Diagnosis, allergies, medicines, wishes', erEmpty: 'Fill this in now, while it is calm: tap Change. The medicines and doctors already come from Covara.', showNurse: 'Show the nurse',
      ifMissing: 'If {name} goes missing', missShort: 'A description for the police', missEmpty: 'Describe them now, while it is calm: tap Change. The last position comes from WHEREIS.', showPolice: 'Show the police', lastSeen: 'Last position',
      fallsRooms: 'Falls and rooms', fallsShort: 'Room sensors', fallsBody: 'A room sensor sees a fall and which room they are in. To add one: Settings, Room sensors.',
      whoDecides: 'Who decides for {name}', pxNobody: 'No one named yet', pxNamedShort: '{name}, when needed', pxNow: '{name} decides now',
      pxWhy: 'Name the person who will make these choices for you if one day you cannot: what each person sees, and who joins. Choose now, while you can. Tap a name.',
      pxNamed: '{name} will decide for you if a doctor says you no longer can. Tap another name to change, or the same name to remove.', pxNoFamily: 'Add family first: Settings, Family.',
      pxActiveHome: '{name} is making these choices for you now. You can take them back at any time.', pxDecideAgain: 'I decide again',
      pxNone: '{name} has not named anyone to decide for them.', pxNamedOther: '{name} named {proxy} to decide when needed.',
      pxYouNamed: '{name} named you to make their choices if a doctor says they can no longer decide.', pxCannot: '{name} can no longer decide', pxActiveOther: '{proxy} decides for {name} now.',
      pxYouDecide: 'You decide for {name} now: who joins, and what each person sees.', pxEnd: '{name} decides again', pxAsks: 'asks to join', pxApprove: 'Let them join',
      pxOnWhy: 'Do this only when a doctor has said {name} can no longer make these choices. Everyone looking after them is told, and {name} can take it back at any time.',
      pxDoctor: 'The doctor who said so', pxDate: 'When', pxNote: 'Note (optional)', pxConfirm: 'A doctor has said {name} can no longer decide', pxTake: 'Decide for them now', pxNeedDoc: 'Write the doctor\u2019s name.', pxNeedOk: 'Tap the confirmation first.', decides: 'Decides for them',
      sk_location: 'Where', sk_rooms: 'Room', sk_falls: 'Falls', sk_care: 'Medicines', sk_mood: 'Mood', sk_activity: 'Moving',
      aboutTitle: 'About {name}', aboutShort: 'Who they are, what calms them', aboutEmpty: 'Tell anyone new who {name} is: tap Change.', noCare: '{name} has not chosen to share medicines and visits with you.',
      sh_diagnosis: 'Diagnosis', sh_stage: 'Stage', sh_allergies: 'Allergies', sh_conditions: 'Other conditions', sh_blood: 'Blood type', sh_dnr: 'If the heart stops', sh_directive: 'Advance directive', sh_insurance: 'Insurance', sh_hospital: 'Preferred hospital', sh_talk: 'How to talk to them',
      sh_height: 'Height', sh_weight: 'Weight', sh_hair: 'Hair', sh_eyes: 'Eyes', sh_marks: 'Marks, glasses, walking', sh_clothes: 'Usually wears', sh_aids: 'Wears or carries', sh_language: 'Language', sh_places: 'Places they may go',
      sh_nickname: 'Likes to be called', sh_work: 'Their work', sh_story: 'Their story', sh_likes: 'Loves', sh_calms: 'What calms them', sh_upsets: 'What upsets them',
      dnr_full: 'Resuscitate', dnr_dnr: 'Do not resuscitate (DNR)', dnr_polst: 'See POLST form', dnr_unknown: 'Not decided',
      ph_diagnosis: 'For example Alzheimer\u2019s disease', ph_stage: 'Early, middle or late', ph_allergies: 'Medicines and foods', ph_conditions: 'For example diabetes, heart', ph_blood: 'For example A+', ph_directive: 'Where the papers are', ph_insurance: 'Plan and member number', ph_hospital: 'Name and address', ph_talk: 'For example speak slowly, one question at a time',
      ph_height: 'For example 5 ft 9', ph_weight: 'For example 160 lb', ph_hair: 'Colour and length', ph_eyes: 'Colour', ph_marks: 'Scars, glasses, a cane', ph_clothes: 'For example blue cardigan', ph_aids: 'Hearing aid, ID bracelet', ph_language: 'For example English', ph_places: 'Old home, old work, church',
      ph_nickname: 'For example Nonno', ph_work: 'For example teacher', ph_story: 'Where they grew up, family, proud moments', ph_likes: 'Music, food, places', ph_calms: 'For example a walk, old songs', ph_upsets: 'For example being rushed, noise',
      to: 'to', shiftNone: 'No one is on the rota yet.', addShift: 'Add a shift', onDuty: 'Who is on duty', onNow: '{name} is on duty now', nextShift: 'Next: {name}, {when}', shiftShort: 'The rota of family and carers',
      hoPh: 'What the next person should know: sleep, meals, mood, anything new', hoSave: 'Leave the note', handover: 'Handover notes', hoShort: 'What the next person should know',
      checkIn: 'I am here', checkWhy: 'Tap when you arrive at {name}’s home and when you leave. Your phone checks it is at the address, so the family can trust the visits.', imHere: 'I have arrived', imLeaving: 'I am leaving',
      vi_arrived: 'arrived', vi_left: 'left', loc_here: 'at {name}’s address', loc_away: 'not at the address', loc_unknown: 'position not known', youAreHere: 'You arrived at {when}', checkShort: 'Arriving and leaving, checked',
      forYou: 'For you', forYouShort: 'How you are holding up, and help', holding: 'How are you holding up today?', me_good: 'Good', me_tired: 'Tired', me_overwhelmed: 'Overwhelmed',
      meHelpTired: 'Ask someone in the family to take the next shift: Visits, Who is on duty. Short breaks keep you going.', meHelpBad: 'You do not have to carry this alone. Call the Alzheimer’s Association Helpline now, any hour, and ask the family to cover the next days.',
      helpline: 'Call the 24/7 Helpline 800-272-3900', whoDid: 'Who did what this week', entries: '{n} entries', entry1: '1 entry',
      comfortTitle: 'Comfort', comfortShort: 'Music, photos and stories that calm', comfortEmpty: 'Add the songs, photos and stories that calm {name}. Music from their youth often helps most.', addComfort: 'Add something that comforts',
      ct_music: 'Music', ct_photo: 'Photo', ct_video: 'Video', ct_story: 'Story', play: 'Play', nItems: '{n} saved', ctTitle: 'Name (for example Moon River)', ctUrl: 'Link (optional)', ctPhoto: 'Add a photo', needHttps: 'The link must start with https://',
      leaving: 'When {name} leaves home', leaveWhy: 'The family is told the moment {name}’s phone leaves home, with the way walked on WHEREIS. Choose when:', lv2_night: 'At night', lv2_always: 'Any time', lv2_off: 'Never',
      leaveDoor: 'If {name} may leave without the phone, add a room sensor on the front door named Front door (Settings, Room sensors). It warns when the door opens at night.',
      moneyTitle: 'Money and scams', moneyShort: 'Report a scam call or unusual spending', worryWhy: 'People with memory loss are often targeted. Report anything worrying and the family is told at once.', worryPh: 'What happened (optional)',
      wo_scam_call: 'Scam call', wo_spending: 'Unusual spending', wo_stranger: 'New person asking for money', wo_other: 'Other worry',
      worryTips: 'Never give card or bank numbers on the phone. Medicare and banks do not call asking for them. Ask the bank for alerts on large payments, and add a trusted contact to the accounts.',
      docsTitle: 'Legal documents', docsEmpty: 'Keep the legal papers here so they are ready when needed. Take a photo or add the PDF.', docsMissing: 'Missing: {list}', addDoc: 'Add a document', openDoc: 'Open',
      dt_poa_health: 'Health care power of attorney', dt_poa_money: 'Financial power of attorney', dt_directive: 'Advance directive', dt_will: 'Will', dt_hipaa: 'HIPAA authorization', dt_insurance: 'Insurance', dt_id: 'ID and cards', dt_other: 'Other',
      docTitle: 'Name', docKept: 'Where the original is kept', docOn: 'Signed on', docFile: 'Add the PDF or a photo',
      shiftWho: 'Who', shiftStart: 'From', shiftEnd: 'To', noAppts: 'No appointments coming up.',
      doubleWarn: '{med} was marked taken again {min} min after the last dose. Check before any more is taken. If a second dose was taken, call the doctor or pharmacist.',
      dVoice: 'Voice', voiceBy: 'A message from {name}', playVoice: 'Play the message', voiceLabel: 'A family voice for when it is due', voiceRec: 'Record a message', voiceAgain: 'Record again', voiceStop: 'Stop', voiceNoMic: 'The microphone is not available. Allow it in the browser and try again.',
      inTitle: 'Photos waiting', inShort: 'Bottles from the pharmacy, labels', inWaiting: '{n} to look at', inWhy: 'At the pharmacy, take a photo of each bottle. Then, in the phone’s Photos, select them, tap Share and choose Covara. Covara reads each label: a refill is marked Filled with the new count, and a new medicine waits here for one tap.',
      inAddPhotos: 'Add photos of the new bottles', inSending: 'Sending {n} photos…', inReading: 'Reading the label…', inQueued: 'Waiting to be read', inFilled: 'Filled: {name}', inAdded: 'Added: {name}', inNew: '{name}: a new medicine?', inAddIt: 'Add it', inNotMed: 'Not a medicine', inUnread: 'The label could not be read', inByHand: 'Fill in by hand', inShared: 'Shared from the phone', inAdded2: 'Added in Covara',
      meds: 'Medicines', appts: 'Appointments', subs: 'Subscriptions',
      video: 'Video', phone: 'Phone', message: 'Message', email: 'Email',
      now: 'NOW', late: 'LATE', today: 'Today', tomorrow: 'Tomorrow', next: 'NEXT', none: 'Nothing recorded',
      addMed: 'Add a medicine', addAppt: 'Add an appointment', addSub: 'Add a subscription',
      dNext: 'Next', dSchedule: 'Every day at', dDose: 'Dose', dBy: 'Prescribed by', dFrom: 'Get it from', dLast: 'Last taken', dFor: 'For',
      dWith: 'With', dWhen: 'When', dWhere: 'Where', dNotes: 'Notes', dRenews: 'Renews', dProvider: 'From', dEvery: 'Every', dCost: 'Cost', dLastDone: 'Last done',
      never: 'Not yet', doctor: 'Doctor', pharmacy: 'Pharmacy',
      working: 'Is it working?', helped: 'Did it help?', yes: 'Yes', unsure: 'Not sure', no: 'No', said: 'answered', you: 'You',
      taken: 'Taken', done: 'Done', change: 'Change', remove: 'Remove', save: 'Save', cancel: 'Cancel', saving: 'Saving',
      photo: 'Take a photo of it', name: 'Name, as on the box', strength: 'Strength', unit: 'Unit', qty: 'How many each time', form: 'Form',
      when: 'When', morning: 'Morning', midday: 'Midday', evening: 'Evening', night: 'Night', other: 'Other time',
      prescriber: 'Prescribed by', prescribedOn: 'Prescribed on', source: 'Get it from', sourceName: 'Pharmacy or doctor name', sourcePhone: 'Their phone', purpose: 'What it is for (optional)',
      tagWho: 'Tag people from the circle (it shows on their own timeline, and they are told)', apptTitle: 'What it is for', apptWith: 'With whom', date: 'Date', time: 'Time', place: 'Where', notes: 'Notes (optional)',
      subTitle: 'What it is', provider: 'Who provides it', renews: 'Next renewal', every: 'How often (for example monthly)', cost: 'Cost (optional)',
      needName: 'Write its name first.', needTime: 'Choose at least one time.', needWhen: 'Choose the date and time.',
      failed: 'Could not save. Check the internet and try again.',
      reading: 'Reading the label on this phone…', readOk: 'Read from the label. Check each gold line before you save.', readNone: 'The label could not be read. Try again closer, in good light, or fill it in.',
      dSupply: 'Supply', refills: 'refills', dispensedN: 'in the bottle',
      gFamily: 'Family', gDoctor: 'Doctor', gLegal: 'Legal', gCare: 'Care', gOther: 'Other', dGroup: 'Group', dHelps: 'Can help with', dRecords: 'Sees medical records', dPrescribes: 'Prescribes', dNextVisit: 'Next visit', hRecords: 'MEDICAL RECORDS',
      recHelps: 'What they can help with (for example bank, contracts)', recAccess: 'Can see my medical records',
      recs: 'Medical Records', recsHeadMe: 'Access to my medical records', recsHeadOf: 'Access to {name}\u2019s medical records', addRec: 'Add a person', people: 'people',
      dRel: 'Relationship', dProf: 'Profession', dOrg: 'Organisation', dPhone: 'Phone', dEmail: 'Email', dSince: 'Since', seesCovara: 'Sees medicines and visits in Covara', whatSee: 'What they see',
      recName: 'Name', recRel: 'Relationship to HOME (for example daughter, cardiologist)', recProf: 'Profession', recOrg: 'Hospital, practice or company (optional)', recPhone: 'Phone (optional)', recEmail: 'Email (optional)', recSince: 'Allowed since (optional)',
      refill: 'Re-Fill', refillTitle: 'Re-Fill', callTo: 'Call {name}', pickedUp: 'I picked up the refill', howMany: 'How many in the new bottle', left: 'left', runsOut: 'runs out about', noRefills: 'No refills left: ask the doctor for a new prescription.',
      dInstr: 'How to take it', dLooks: 'Looks like', dWatch: 'Watch for', dRx: 'Rx number', dStart: 'Started', dEnds: 'Ends', asNeeded: 'Only when needed', ongoing: 'Ongoing',
      instr: 'How to take it (for example with food)', looks: 'What it looks like (for example small white round)', watch: 'Side effects to watch for (optional)', rx: 'Rx number (optional)', prescriberPhone: 'Prescriber phone (optional)', startOn: 'Started on', endOn: 'Ends on (empty if ongoing)', dispensed: 'How many in the bottle', refillsLeft: 'Refills left',
      forms: { tablet: 'tablet', pill: 'pill', capsule: 'capsule', drop: 'drop', ml: 'ml', puff: 'puff', injection: 'injection', patch: 'patch', spoon: 'spoon', sachet: 'sachet' }
    },
    it: {
      sec_med: 'Medicine', sec_visit: 'Visite', sec_health: 'Salute', sec_safety: 'Sicurezza', sec_papers: 'Documenti', me: 'me',
      pv_med: 'Dosi, foto di ogni flacone, ricariche', pv_visit: 'Appuntamenti, assistenti, il diario', pv_health: 'Sonno, respiro, com\u2019\u00e8 andata la giornata', pv_safety: 'Scheda di emergenza, allontanamento, preoccupazioni', pv_papers: 'Chi decide, documenti, accesso alle cartelle', pv_late: 'richiede attenzione', pv_due: 'da fare ora',
      dFilled: 'Ricetta', filled: 'Ritirata', filledOn: 'Ritirata il {d}', notFilled: 'Da ritirare',
      dayOf: 'La giornata di {name}', dayHint: 'Tocca ciò che hai visto. Chi lo assiste lo vede, e un cambiamento improvviso avvisa tutti.', lastDays: 'Ultimi giorni', warnTail: 'Cambiamenti improvvisi come questi possono indicare un\u2019infezione, disidratazione o dolore. Valuta di chiamare il medico.',
      lg_water: 'Bere', lg_meal: 'Pasti', lg_sleep: 'Sonno', lg_toilet: 'Bagno', lg_pain: 'Dolore', lg_mood: 'Umore', lg_behaviour: 'Comportamento',
      lv_none: 'Niente', lv_little: 'Poco', lv_enough: 'Abbastanza', lv_some: 'Un po\u2019', lv_all: 'Tutto', lv_bad: 'Male', lv_broken: 'Interrotto', lv_good: 'Bene', lv_normal: 'Normale', lv_accident: 'Incidente', lv_pain: 'Dolore',
      lv_calm: 'Calmo', lv_confused: 'Confuso', lv_upset: 'Agitato', lv_wandering: 'Vaga', lv_agitated: 'Agitazione', lv_repeating: 'Ripete', lv_refusing: 'Rifiuta', lv_hallucinating: 'Vede cose', lv_other: 'Altro',
      forEr: 'Per il pronto soccorso', erShort: 'Diagnosi, allergie, medicine, volontà', erEmpty: 'Compilalo ora, con calma: tocca Modifica. Medicine e medici arrivano già da Covara.', showNurse: 'Mostra all\u2019infermiere',
      ifMissing: 'Se {name} si perde', missShort: 'Una descrizione per la polizia', missEmpty: 'Descrivilo ora, con calma: tocca Modifica. L\u2019ultima posizione arriva da WHEREIS.', showPolice: 'Mostra alla polizia', lastSeen: 'Ultima posizione',
      fallsRooms: 'Cadute e stanze', fallsShort: 'Sensori nelle stanze', fallsBody: 'Un sensore nella stanza vede una caduta e in quale stanza si trova. Per aggiungerne uno: Impostazioni, Sensori delle stanze.',
      whoDecides: 'Chi decide per {name}', pxNobody: 'Nessuno ancora', pxNamedShort: '{name}, se serve', pxNow: 'Ora decide {name}',
      pxWhy: 'Indica chi farà queste scelte per te se un giorno non potrai: cosa vede ciascuno, e chi entra. Scegli ora, finché puoi. Tocca un nome.',
      pxNamed: '{name} deciderà per te se un medico dirà che non puoi più. Tocca un altro nome per cambiare, o lo stesso per togliere.', pxNoFamily: 'Aggiungi prima la famiglia: Impostazioni, Famiglia.',
      pxActiveHome: '{name} fa ora queste scelte per te. Puoi riprenderle quando vuoi.', pxDecideAgain: 'Decido di nuovo io',
      pxNone: '{name} non ha indicato nessuno che decida per lui.', pxNamedOther: '{name} ha indicato {proxy} per decidere se serve.',
      pxYouNamed: '{name} ha indicato te per fare le sue scelte se un medico dirà che non può più decidere.', pxCannot: '{name} non può più decidere', pxActiveOther: 'Ora {proxy} decide per {name}.',
      pxYouDecide: 'Ora decidi tu per {name}: chi entra, e cosa vede ciascuno.', pxEnd: '{name} decide di nuovo', pxAsks: 'chiede di entrare', pxApprove: 'Fallo entrare',
      pxOnWhy: 'Fallo solo quando un medico ha detto che {name} non può più fare queste scelte. Tutti quelli che lo assistono vengono avvisati, e {name} può riprenderle quando vuole.',
      pxDoctor: 'Il medico che lo ha detto', pxDate: 'Quando', pxNote: 'Nota (facoltativa)', pxConfirm: 'Un medico ha detto che {name} non può più decidere', pxTake: 'Decidi per lui ora', pxNeedDoc: 'Scrivi il nome del medico.', pxNeedOk: 'Tocca prima la conferma.', decides: 'Decide per lui',
      sk_location: 'Dove', sk_rooms: 'Stanza', sk_falls: 'Cadute', sk_care: 'Medicine', sk_mood: 'Umore', sk_activity: 'Movimento',
      aboutTitle: 'Chi è {name}', aboutShort: 'Chi è, cosa lo calma', aboutEmpty: 'Racconta a chi arriva chi è {name}: tocca Modifica.', noCare: '{name} non ha scelto di condividere medicine e visite con te.',
      sh_diagnosis: 'Diagnosi', sh_stage: 'Fase', sh_allergies: 'Allergie', sh_conditions: 'Altre malattie', sh_blood: 'Gruppo sanguigno', sh_dnr: 'Se il cuore si ferma', sh_directive: 'Disposizioni anticipate', sh_insurance: 'Assicurazione', sh_hospital: 'Ospedale preferito', sh_talk: 'Come parlargli',
      sh_height: 'Altezza', sh_weight: 'Peso', sh_hair: 'Capelli', sh_eyes: 'Occhi', sh_marks: 'Segni, occhiali, andatura', sh_clothes: 'Di solito indossa', sh_aids: 'Porta con sé', sh_language: 'Lingua', sh_places: 'Posti dove può andare',
      sh_nickname: 'Come ama essere chiamato', sh_work: 'Il suo lavoro', sh_story: 'La sua storia', sh_likes: 'Ama', sh_calms: 'Cosa lo calma', sh_upsets: 'Cosa lo agita',
      dnr_full: 'Rianimare', dnr_dnr: 'Non rianimare (DNR)', dnr_polst: 'Vedi modulo POLST', dnr_unknown: 'Non deciso',
      ph_diagnosis: 'Per esempio Alzheimer', ph_stage: 'Iniziale, intermedia o avanzata', ph_allergies: 'Medicine e cibi', ph_conditions: 'Per esempio diabete, cuore', ph_blood: 'Per esempio A+', ph_directive: 'Dove sono i documenti', ph_insurance: 'Piano e numero', ph_hospital: 'Nome e indirizzo', ph_talk: 'Per esempio parla piano, una domanda alla volta',
      ph_height: 'Per esempio 175 cm', ph_weight: 'Per esempio 72 kg', ph_hair: 'Colore e lunghezza', ph_eyes: 'Colore', ph_marks: 'Cicatrici, occhiali, bastone', ph_clothes: 'Per esempio cardigan blu', ph_aids: 'Apparecchio acustico, braccialetto', ph_language: 'Per esempio italiano', ph_places: 'Vecchia casa, vecchio lavoro, chiesa',
      ph_nickname: 'Per esempio Nonno', ph_work: 'Per esempio insegnante', ph_story: 'Dove è cresciuto, famiglia, momenti di orgoglio', ph_likes: 'Musica, cibo, luoghi', ph_calms: 'Per esempio una passeggiata, vecchie canzoni', ph_upsets: 'Per esempio la fretta, il rumore',
      to: 'alle', shiftNone: 'Nessuno ancora nei turni.', addShift: 'Aggiungi un turno', onDuty: 'Chi è di turno', onNow: 'Ora è di turno {name}', nextShift: 'Prossimo: {name}, {when}', shiftShort: 'I turni di famiglia e assistenti',
      hoPh: 'Cosa deve sapere chi arriva: sonno, pasti, umore, novità', hoSave: 'Lascia la nota', handover: 'Note per il cambio', hoShort: 'Cosa deve sapere chi arriva',
      checkIn: 'Sono qui', checkWhy: 'Tocca quando arrivi a casa di {name} e quando vai via. Il telefono controlla che sia all’indirizzo, così la famiglia può fidarsi delle visite.', imHere: 'Sono arrivato', imLeaving: 'Vado via',
      vi_arrived: 'arrivato', vi_left: 'andato via', loc_here: 'all’indirizzo di {name}', loc_away: 'non all’indirizzo', loc_unknown: 'posizione non nota', youAreHere: 'Sei arrivato alle {when}', checkShort: 'Arrivi e partenze, verificati',
      forYou: 'Per te', forYouShort: 'Come stai, e un aiuto', holding: 'Come stai oggi?', me_good: 'Bene', me_tired: 'Stanco', me_overwhelmed: 'Sopraffatto',
      meHelpTired: 'Chiedi a qualcuno della famiglia il prossimo turno: Visite, Chi è di turno. Brevi pause ti aiutano a continuare.', meHelpBad: 'Non devi portarlo da solo. Chiama ora una linea di aiuto per l’Alzheimer e chiedi alla famiglia di coprire i prossimi giorni.',
      helpline: 'Chiama la linea 24/7 (USA) 800-272-3900', whoDid: 'Chi ha fatto cosa questa settimana', entries: '{n} registrazioni', entry1: '1 registrazione',
      comfortTitle: 'Conforto', comfortShort: 'Musica, foto e storie che calmano', comfortEmpty: 'Aggiungi le canzoni, le foto e le storie che calmano {name}. La musica della giovinezza spesso aiuta di più.', addComfort: 'Aggiungi qualcosa che conforta',
      ct_music: 'Musica', ct_photo: 'Foto', ct_video: 'Video', ct_story: 'Storia', play: 'Ascolta', nItems: '{n} salvati', ctTitle: 'Nome (per esempio Volare)', ctUrl: 'Link (facoltativo)', ctPhoto: 'Aggiungi una foto', needHttps: 'Il link deve iniziare con https://',
      leaving: 'Quando {name} esce di casa', leaveWhy: 'La famiglia viene avvisata appena il telefono di {name} esce di casa, con il percorso su WHEREIS. Scegli quando:', lv2_night: 'Di notte', lv2_always: 'Sempre', lv2_off: 'Mai',
      leaveDoor: 'Se {name} può uscire senza telefono, aggiungi un sensore sulla porta d’ingresso chiamato Porta (Impostazioni, Sensori delle stanze). Avvisa quando la porta si apre di notte.',
      moneyTitle: 'Soldi e truffe', moneyShort: 'Segnala una chiamata truffa o spese insolite', worryWhy: 'Le persone con perdita di memoria sono spesso prese di mira. Segnala ciò che ti preoccupa e la famiglia viene avvisata subito.', worryPh: 'Cosa è successo (facoltativo)',
      wo_scam_call: 'Chiamata truffa', wo_spending: 'Spese insolite', wo_stranger: 'Persona nuova che chiede soldi', wo_other: 'Altra preoccupazione',
      worryTips: 'Mai dare numeri di carte o conti al telefono. Banche ed enti non li chiedono. Chiedi alla banca avvisi sui pagamenti grandi e aggiungi una persona di fiducia ai conti.',
      docsTitle: 'Documenti legali', docsEmpty: 'Tieni qui i documenti legali, pronti quando servono. Fai una foto o aggiungi il PDF.', docsMissing: 'Mancano: {list}', addDoc: 'Aggiungi un documento', openDoc: 'Apri',
      dt_poa_health: 'Procura sanitaria', dt_poa_money: 'Procura finanziaria', dt_directive: 'Disposizioni anticipate', dt_will: 'Testamento', dt_hipaa: 'Autorizzazione privacy', dt_insurance: 'Assicurazione', dt_id: 'Documenti e tessere', dt_other: 'Altro',
      docTitle: 'Nome', docKept: 'Dove si trova l’originale', docOn: 'Firmato il', docFile: 'Aggiungi il PDF o una foto',
      shiftWho: 'Chi', shiftStart: 'Dalle', shiftEnd: 'Alle', noAppts: 'Nessun appuntamento in arrivo.',
      doubleWarn: '{med} è stata segnata di nuovo {min} min dopo l’ultima dose. Controlla prima di darne altra. Se è stata presa una seconda dose, chiama il medico o il farmacista.',
      dVoice: 'Voce', voiceBy: 'Un messaggio di {name}', playVoice: 'Ascolta il messaggio', voiceLabel: 'Una voce di famiglia per quando è ora', voiceRec: 'Registra un messaggio', voiceAgain: 'Registra di nuovo', voiceStop: 'Ferma', voiceNoMic: 'Il microfono non è disponibile. Consentilo nel browser e riprova.',
      inTitle: 'Foto in attesa', inShort: 'Confezioni dalla farmacia, etichette', inWaiting: '{n} da guardare', inWhy: 'In farmacia, fai una foto a ogni confezione. Poi, nelle Foto del telefono, selezionale, tocca Condividi e scegli Covara. Covara legge ogni etichetta: una ricarica viene segnata Ritirata con il nuovo numero, e una nuova medicina aspetta qui un tocco.',
      inAddPhotos: 'Aggiungi le foto delle nuove confezioni', inSending: 'Invio di {n} foto…', inReading: 'Lettura dell’etichetta…', inQueued: 'In attesa di lettura', inFilled: 'Ritirata: {name}', inAdded: 'Aggiunta: {name}', inNew: '{name}: una nuova medicina?', inAddIt: 'Aggiungila', inNotMed: 'Non è una medicina', inUnread: 'Non è stato possibile leggere l’etichetta', inByHand: 'Compila a mano', inShared: 'Condivisa dal telefono', inAdded2: 'Aggiunta in Covara',
      meds: 'Medicine', appts: 'Appuntamenti', subs: 'Abbonamenti',
      video: 'Video', phone: 'Telefono', message: 'Messaggio', email: 'Email',
      now: 'ORA', late: 'IN RITARDO', today: 'Oggi', tomorrow: 'Domani', next: 'PROSSIMA', none: 'Niente registrato',
      addMed: 'Aggiungi una medicina', addAppt: 'Aggiungi un appuntamento', addSub: 'Aggiungi un abbonamento',
      dNext: 'Prossima', dSchedule: 'Ogni giorno alle', dDose: 'Dose', dBy: 'Prescritta da', dFrom: 'Dove si ritira', dLast: 'Ultima presa', dFor: 'Per',
      dWith: 'Con', dWhen: 'Quando', dWhere: 'Dove', dNotes: 'Note', dRenews: 'Rinnovo', dProvider: 'Da', dEvery: 'Ogni', dCost: 'Costo', dLastDone: 'Ultima volta',
      never: 'Non ancora', doctor: 'Medico', pharmacy: 'Farmacia',
      working: 'Funziona?', helped: 'È servito?', yes: 'Sì', unsure: 'Non so', no: 'No', said: 'ha risposto', you: 'Tu',
      taken: 'Presa', done: 'Fatto', change: 'Modifica', remove: 'Rimuovi', save: 'Salva', cancel: 'Annulla', saving: 'Salvataggio',
      photo: 'Fai una foto', name: 'Nome, come sulla scatola', strength: 'Dosaggio', unit: 'Unità', qty: 'Quante ogni volta', form: 'Forma',
      when: 'Quando', morning: 'Mattina', midday: 'Mezzogiorno', evening: 'Sera', night: 'Notte', other: 'Altro orario',
      prescriber: 'Prescritta da', prescribedOn: 'Prescritta il', source: 'Dove si ritira', sourceName: 'Nome della farmacia o del medico', sourcePhone: 'Il loro telefono', purpose: 'A cosa serve (facoltativo)',
      tagWho: 'Tagga persone della cerchia (appare sulla loro linea del tempo e vengono avvisate)', apptTitle: 'Per cosa', apptWith: 'Con chi', date: 'Data', time: 'Ora', place: 'Dove', notes: 'Note (facoltativo)',
      subTitle: 'Che cos\u2019è', provider: 'Chi lo fornisce', renews: 'Prossimo rinnovo', every: 'Ogni quanto (per esempio mensile)', cost: 'Costo (facoltativo)',
      needName: 'Scrivi prima il nome.', needTime: 'Scegli almeno un orario.', needWhen: 'Scegli data e ora.',
      failed: 'Non salvato. Controlla internet e riprova.',
      reading: 'Lettura dell\u2019etichetta su questo telefono…', readOk: 'Letto dall\u2019etichetta. Controlla ogni riga dorata prima di salvare.', readNone: 'Non è stato possibile leggere l\u2019etichetta. Riprova più vicino, con buona luce, o compila a mano.',
      dSupply: 'Scorta', refills: 'rinnovi', dispensedN: 'nella confezione',
      gFamily: 'Famiglia', gDoctor: 'Medico', gLegal: 'Legale', gCare: 'Assistenza', gOther: 'Altro', dGroup: 'Gruppo', dHelps: 'Può aiutare con', dRecords: 'Vede la cartella clinica', dPrescribes: 'Prescrive', dNextVisit: 'Prossima visita', hRecords: 'CARTELLA CLINICA',
      recHelps: 'Con cosa può aiutare (per esempio banca, contratti)', recAccess: 'Può vedere la mia cartella clinica',
      recs: 'Cartella clinica', recsHeadMe: 'Chi può vedere la mia cartella clinica', recsHeadOf: 'Chi può vedere la cartella clinica di {name}', addRec: 'Aggiungi una persona', people: 'persone',
      dRel: 'Relazione', dProf: 'Professione', dOrg: 'Struttura', dPhone: 'Telefono', dEmail: 'Email', dSince: 'Dal', seesCovara: 'Vede medicine e visite in Covara', whatSee: 'Cosa vede',
      recName: 'Nome', recRel: 'Relazione con HOME (per esempio figlia, cardiologo)', recProf: 'Professione', recOrg: 'Ospedale, studio o azienda (facoltativo)', recPhone: 'Telefono (facoltativo)', recEmail: 'Email (facoltativo)', recSince: 'Autorizzato dal (facoltativo)',
      refill: 'Ricarica', refillTitle: 'Nuova confezione', callTo: 'Chiama {name}', pickedUp: 'Ho ritirato la nuova confezione', howMany: 'Quante nella nuova confezione', left: 'rimaste', runsOut: 'finiscono circa', noRefills: 'Nessun rinnovo rimasto: chiedi al medico una nuova ricetta.',
      dInstr: 'Come prenderla', dLooks: 'Aspetto', dWatch: 'Attenzione a', dRx: 'Numero ricetta', dStart: 'Iniziata', dEnds: 'Termina', asNeeded: 'Solo al bisogno', ongoing: 'Continua',
      instr: 'Come prenderla (per esempio a stomaco pieno)', looks: 'Com\u2019è fatta (per esempio piccola bianca rotonda)', watch: 'Effetti da tenere d\u2019occhio (facoltativo)', rx: 'Numero ricetta (facoltativo)', prescriberPhone: 'Telefono del medico (facoltativo)', startOn: 'Iniziata il', endOn: 'Termina il (vuoto se continua)', dispensed: 'Quante nella confezione', refillsLeft: 'Rinnovi rimasti',
      forms: { tablet: 'compressa', pill: 'pillola', capsule: 'capsula', drop: 'goccia', ml: 'ml', puff: 'spruzzo', injection: 'iniezione', patch: 'cerotto', spoon: 'cucchiaio', sachet: 'bustina' }
    }
  };
  var SLOTS = [['morning', '08:00'], ['midday', '13:00'], ['evening', '18:00'], ['night', '22:00']];
  var FORMS = ['tablet', 'pill', 'capsule', 'drop', 'ml', 'puff', 'injection', 'patch', 'spoon', 'sachet'];
  var UNITS = ['mg', 'mcg', 'g', 'ml', 'IU', '%', 'mg/ml'];
  function L() { var l = (window.I18n && I18n.locale) || 'en'; return STR[String(l).slice(0, 2)] || STR.en; }
  function t(k, p) { var v = L()[k] || STR.en[k] || k; Object.keys(p || {}).forEach(function (n) { v = v.split('{' + n + '}').join(p[n]); }); return v; }
  function loc() { return (window.I18n && I18n.locale) || 'en'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function authed() { try { return typeof SyncEngine !== 'undefined' && SyncEngine.isAuthenticated(); } catch (e) { return false; } }
  function base() { try { return SyncEngine.getStatus().apiBase || ''; } catch (e) { return ''; } }
  function role() { try { return localStorage.getItem('rc:role') || ''; } catch (e) { return ''; } }
  function myId() { try { return SyncEngine.getStatus().userId || ''; } catch (e) { return ''; } }
  async function api(path, opts) {
    var o = Object.assign({ method: 'GET' }, opts || {});
    if (o.body && typeof o.body !== 'string' && !(o.body instanceof FormData)) o.body = JSON.stringify(o.body);
    var r = await SyncEngine.apiFetch(path, o);
    var j = await r.json().catch(function () { return {}; });
    return { ok: r.ok, status: r.status, data: j };
  }
  function photoUrl(p) { return p ? (/^https?:/.test(p) ? p : base() + p) : ''; }
  function hhmm(ms) { try { return new Date(ms).toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
  function dayLabel(ms) {
    var d = new Date(ms), n = new Date(), tm = new Date(); tm.setDate(n.getDate() + 1);
    if (d.toDateString() === n.toDateString()) return t('today');
    if (d.toDateString() === tm.toDateString()) return t('tomorrow');
    try { return d.toLocaleDateString(loc(), { weekday: 'short', day: 'numeric', month: 'short' }); } catch (e) { return d.toDateString(); }
  }
  function when(ms) { return dayLabel(ms) + ', ' + hhmm(ms); }
  function dateOnly(s) { try { return new Date(s + 'T12:00:00').toLocaleDateString(loc(), { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return s; } }
  function orbOf(title) {
    var h = 0; String(title || '').split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) % 360; });
    return 'radial-gradient(circle at 34% 28%,#fff 0,hsl(' + h + ',90%,82%) 10%,hsl(' + h + ',80%,55%) 45%,hsl(' + h + ',75%,26%) 100%)';
  }
  function slotMs(hm, dayOffset) { var d = new Date(); d.setDate(d.getDate() + (dayOffset || 0)); var p = String(hm).split(':'); d.setHours(+p[0], +p[1], 0, 0); return d.getTime(); }

  /* ── styles: the Sentinel glass of the Communication panel ── */
  var css = '' +
    '#cvTabs{position:fixed;left:16px;top:84px;width:min(340px,calc(100vw - 32px));z-index:7000;font-family:var(--nous-font,"Hanken Grotesk",system-ui,sans-serif);color:#e8ecf4;opacity:0;transform:translateY(-6px);transition:opacity .45s ease,transform .45s ease;pointer-events:none}' +
    '#cvTabs.show{opacity:1;transform:none;pointer-events:auto}' +
    '#cvTabs.in-card{position:static;width:auto;opacity:1;transform:none;pointer-events:auto;margin:4px 0 2px}#cvTabs.in-card .cvx-head{display:none}#cvTabs.in-card .cvx-list{max-height:none;overflow:visible}' +
    '.cv-pull.cvp-late .bluf-pull-preview{color:#ff8a8a}.cv-pull.cvp-due .bluf-pull-preview{color:#fde68a}.cv-pull.cvp-late .bluf-section-label:after,.cv-pull.cvp-due .bluf-section-label:after{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;margin-left:8px;vertical-align:1px;background:#fbbf24;box-shadow:0 0 8px #fbbf24}.cv-pull.cvp-late .bluf-section-label:after{background:#ff4d6a;box-shadow:0 0 8px #ff4d6a}' +
    'body.rs-overlay-open #cvTabs,body.cv-asking #cvTabs{opacity:0 !important;pointer-events:none !important}' +
    '.cvx-tab{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;margin:0 0 6px;padding:8px 12px;border-radius:12px;background:rgba(10,12,20,0.72);border:1px solid rgba(56,189,248,0.22);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:inherit;font:inherit;cursor:pointer;text-align:left}' +
    '.cvx-tab:focus-visible,.cvx-row:focus-visible{outline:2px solid #C5A55A;outline-offset:1px}' +
    '.cvx-tab b{font-family:var(--nous-mono,"JetBrains Mono",monospace);font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(240,238,245,0.85)}' +
    '.cvx-tab .cvx-hint{margin-left:auto;font-family:var(--nous-mono,"JetBrains Mono",monospace);font-size:10px;letter-spacing:1px;color:rgba(159,216,255,0.85);white-space:nowrap}' +
    '.cvx-tab .cvx-hint.late{color:#fca5a5}.cvx-tab .cvx-hint.due{color:#ffd24d}' +
    '.cvx-tab .cvx-chev{font-size:13px;color:rgba(159,216,255,0.7);transition:transform .25s ease}' +
    '.cvx-tab[aria-expanded="true"]{border-color:rgba(56,189,248,0.5);background:rgba(14,22,36,0.86)}' +
    '.cvx-tab[aria-expanded="true"] .cvx-chev{transform:rotate(90deg)}' +
    '.cvx-dot{width:7px;height:7px;border-radius:50%;flex:0 0 auto;background:rgba(96,165,250,.6)}.cvx-dot.late{background:#ef4444;box-shadow:0 0 8px #ef4444}.cvx-dot.due{background:#ffd24d;box-shadow:0 0 8px #ffd24d}' +
    '.cvx-list{margin:-2px 0 8px;padding:4px;border-radius:12px;background:rgba(10,12,20,0.62);border:1px solid rgba(56,189,248,0.14);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);max-height:min(58vh,520px);overflow-y:auto;overscroll-behavior:contain;animation:cvxIn .35s ease both}' +
    '@keyframes cvxIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}' +
    '.cvx-item{border-bottom:1px solid rgba(255,255,255,0.05)}.cvx-item:last-child{border-bottom:0}' +
    '.cvx-row{display:flex;align-items:center;gap:10px;width:100%;padding:7px 6px;background:none;border:0;color:inherit;font:inherit;text-align:left;cursor:pointer;border-radius:10px}' +
    '.cvx-row:hover{background:rgba(255,255,255,0.03)}' +
    '.cvx-ph{flex:0 0 auto;width:34px;height:34px;border-radius:50%;background-size:cover;background-position:center;box-shadow:0 0 0 1px rgba(120,200,255,.3)}' +
    '.cvx-nm{flex:1;min-width:0}.cvx-nm span{display:block;font-size:13px;font-weight:700;color:#f0eef5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.cvx-nm small{display:block;font-size:11px;color:rgba(200,214,232,0.7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.cvx-when{flex:0 0 auto;font-family:var(--nous-mono,"JetBrains Mono",monospace);font-size:10px;letter-spacing:1px;color:rgba(159,216,255,0.85);text-align:right}' +
    '.cvx-when.late{color:#fca5a5}.cvx-when.due{color:#ffd24d}.cvx-when.done{color:#86efac}' +
    '.cvx-det{display:none;padding:2px 8px 12px 50px;font-size:12px}' +
    '.cvx-item.open .cvx-det{display:block;animation:cvxIn .3s ease both}' +
    '.cvx-item.open .cvx-row{background:rgba(56,189,248,0.06)}' +
    '.cvx-big{width:96px;height:96px;border-radius:50%;background-size:cover;background-position:center;margin:4px 0 10px;box-shadow:0 0 0 1px rgba(120,200,255,.35),0 0 24px rgba(56,189,248,.25);cursor:zoom-in;border:0}' +
    '.cvx-kv{display:grid;grid-template-columns:auto 1fr;gap:5px 12px;margin:0 0 10px}' +
    '.cvx-kv dt{font-family:var(--nous-mono,"JetBrains Mono",monospace);font-size:9.5px;letter-spacing:1.4px;text-transform:uppercase;color:rgba(159,216,255,0.75);padding-top:2px}' +
    '.cvx-kv dd{margin:0;color:#e8ecf4}' +
    '.cvx-acts{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 12px}' +
    '.cvx-btn{min-height:30px;padding:0 12px;border-radius:15px;border:1px solid rgba(100,180,255,0.35);background:rgba(12,14,24,0.88);color:#d8e8ff;font:500 12px -apple-system,system-ui,"Segoe UI",sans-serif;cursor:pointer}' +
    '.cvx-btn.pri{background:#38bdf8;border-color:#38bdf8;color:#04121a;font-weight:700}' +
    '.cvx-btn[aria-pressed="true"]{background:rgba(56,189,248,0.22);border-color:#38bdf8;color:#fff}' +
    '.cvx-btn:focus-visible{outline:2px solid #C5A55A}' +
    '.cvx-q{font-family:var(--nous-mono,"JetBrains Mono",monospace);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#ffd24d;margin:0 0 6px}' +
    '.cvx-said{font-size:11px;color:rgba(200,214,232,0.7);margin-top:6px}' +
    '.cvx-add{display:block;width:100%;padding:9px 6px;background:none;border:0;color:rgba(95,208,255,0.9);font:600 12px var(--nous-font,"Hanken Grotesk",sans-serif);text-align:left;cursor:pointer;border-radius:10px}' +
    '.cvx-add:hover{background:rgba(255,255,255,0.03)}' +
    '.cvx-empty{padding:8px 6px;font-size:12px;color:rgba(200,214,232,0.6)}' +
    '.cvx-head{display:flex;align-items:center;gap:10px;padding:8px 8px 8px 14px;margin:0 0 6px;border-radius:12px;background:rgba(14,22,36,0.86);border:1px solid rgba(56,189,248,0.5);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}' +
    '.cvx-head b{font-family:var(--nous-mono,"JetBrains Mono",monospace);font-size:10.5px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff}.cvx-head span{flex:1;font-size:12px;color:rgba(200,214,232,.75);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.cvx-x{width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:transparent;color:#d8e8ff;font-size:18px;line-height:1;cursor:pointer}' +
    '.cvx-bar{flex:0 0 auto;width:4px;align-self:stretch;min-height:30px;border-radius:2px;background:#38bdf8}.cvx-bar.red{background:#ef4444}.cvx-bar.gold{background:#C5A55A}.cvx-bar.blue{background:#38bdf8}' +
    '.cvx-row .cvx-chev{font-size:13px;color:rgba(159,216,255,0.7);transition:transform .25s ease}.cvx-item.open .cvx-chev{transform:rotate(90deg)}' +
    '.cvx-sub{font-size:12px;line-height:1.45;color:rgba(214,226,244,.85);margin:4px 6px 8px}' +
    '.cvx-warn{font-size:12px;line-height:1.45;color:#fecaca;background:rgba(239,68,68,.14);border:1px solid rgba(239,68,68,.4);border-radius:10px;padding:8px 10px;margin:4px 6px 8px}' +
    '.cvx-nm small.warn{color:#ffd24d}' +
    '.cvh{padding:0 6px}.cvh-k{padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05)}.cvh-l{font:700 10px var(--nous-mono,"JetBrains Mono",monospace);letter-spacing:1.4px;text-transform:uppercase;color:rgba(159,216,255,.85);margin:0 0 6px}' +
    '.cvh-l i{font-style:normal;letter-spacing:.5px;text-transform:none;font-weight:600;margin-left:6px}' +
    '.good{color:#86efac}.mid{color:#ffd24d}.bad{color:#fca5a5}' +
    '.cvt-chip.sm{min-height:32px;padding:0 11px;font-size:12px}.cvt-chip.sm.good{border-color:rgba(134,239,172,.35)}.cvt-chip.sm.mid{border-color:rgba(255,210,77,.35)}.cvt-chip.sm.bad{border-color:rgba(252,165,165,.4)}' +
    '.cvh-w{list-style:none;margin:0 6px 6px;padding:0;font-size:12px}.cvh-w li{padding:3px 0}.cvh-w small{color:rgba(200,214,232,.65)}' +
    '.cvp-l{padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)}.cvp-l b{font-size:13px}.cvp-l small{color:rgba(200,214,232,.7)}.cvp-l .cvt-chips{margin-top:6px;gap:6px}' +
    '.cvt-f textarea{width:100%;box-sizing:border-box;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(10,14,22,.9);color:#f1f6ff;font:500 15px "Hanken Grotesk",sans-serif;padding:10px 14px;resize:vertical}' +
    '.cvx-card .cvx-kv{font-size:16px;text-align:left;gap:8px 14px}.cvx-card .cvx-kv dt{font-size:11px}' +
    '.cvx-btn.warn{border-color:rgba(255,210,77,.6);color:#ffe9a8}' +
    '.cvc{display:flex;align-items:center;gap:10px;padding:7px 4px;border-bottom:1px solid rgba(255,255,255,.05)}.cvc .cvx-btn{flex:0 0 auto;display:inline-flex;align-items:center;text-decoration:none}' +
    '.cvc{flex-wrap:wrap}.cvc-a{flex-basis:100%;display:flex;align-items:center;gap:8px;padding-left:44px}' +
    '.cvx-lnk{background:none;border:0;color:rgba(252,165,165,.85);font:600 11px var(--nous-font,"Hanken Grotesk",sans-serif);cursor:pointer;padding:4px}' +
    '.cv-pbrief{position:fixed;z-index:30}.cv-pbrief .db-issue{-webkit-line-clamp:3}' +
    '.cvx-ini{display:flex;align-items:center;justify-content:center;font:700 12px var(--nous-font,"Hanken Grotesk",sans-serif);color:#0c0e14}' +
    '@media (max-width:700px){#cvTabs{top:78px;left:10px;width:calc(100vw - 20px)}.cvx-list{max-height:52vh}.cvx-tab b{letter-spacing:1.2px}}' +
    /* the add, change and photo sheets */
    '.cvt-f{display:flex;flex-direction:column;gap:10px;text-align:left;margin-top:14px}' +
    '.cvt-f label{font:600 10.5px "JetBrains Mono",monospace;letter-spacing:.14em;color:#5fd0ff;text-transform:uppercase}' +
    '.cvt-f input[type=text],.cvt-f input[type=email],.cvt-f input[type=tel],.cvt-f input[type=number],.cvt-f input[type=date],.cvt-f input[type=time],.cvt-f select{width:100%;box-sizing:border-box;min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(10,14,22,.9);color:#f1f6ff;font:500 16px "Hanken Grotesk",sans-serif;padding:0 14px;color-scheme:dark}' +
    '.cvt-f input:focus,.cvt-f select:focus{outline:2px solid #38bdf8;outline-offset:1px}' +
    '.cvt-two{display:flex;gap:10px}.cvt-two>*{flex:1;min-width:0}.cvt-two>div{display:flex;flex-direction:column;gap:6px}' +
    '.cvt-shot{align-self:center;position:relative;width:140px;height:140px;border-radius:50%;border:0;cursor:pointer;background:radial-gradient(circle at 34% 28%,#3a4558 0,#1b2230 55%,#0c1018 100%);box-shadow:0 0 0 2px rgba(120,200,255,.35),0 0 40px rgba(56,189,248,.25);color:#cfe7ff;font:600 13px "Hanken Grotesk",sans-serif;padding:0 18px;background-size:cover;background-position:center}' +
    '.cvt-shot.has{color:transparent}.cvt-shot:focus-visible{outline:2px solid #C5A55A}' +
    '.cvt-f .cvt-read{border-color:#C5A55A !important;box-shadow:0 0 0 1px #C5A55A,0 0 14px rgba(197,165,90,.35)}.cvt-chip.cvt-read{box-shadow:0 0 0 2px #C5A55A}' +
    '.cv-msg.info{color:#ffd24d}' +
    '.cvt-chips{display:flex;flex-wrap:wrap;gap:8px}' +
    '.cvt-chip{min-height:40px;padding:0 14px;border-radius:20px;border:1px solid rgba(255,255,255,.16);background:transparent;color:#b9c6d8;font:600 13px "Hanken Grotesk",sans-serif;cursor:pointer}' +
    '.cvt-chip small{display:block;font:500 10px "JetBrains Mono",monospace;opacity:.8}' +
    '.cvt-chip[aria-pressed="true"]{border-color:#38bdf8;background:#38bdf8;color:#04121a}' +
    '.cvt-big{width:min(300px,76vw);aspect-ratio:1;border-radius:50%;margin:6px auto 4px;background-size:cover;background-position:center;box-shadow:0 0 0 2px rgba(120,200,255,.35),0 0 60px rgba(56,189,248,.35)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ── whose care: HOME's own on HOME's phone, the linked HOME on AWAY's ── */
  function homeContact() {
    if (role() !== 'away' || typeof DEMO_CONTACTS === 'undefined') return null;
    return DEMO_CONTACTS.filter(function (c) { return c.care && c.care.side === 'home' && c.care.state === 'active'; })[0] || null;
  }
  function subject() {
    if (role() === 'home') return { home: null, edit: true, name: '' };
    var h = homeContact();
    if (!h) return null;
    return { home: h.care.userId, edit: !!(h.care.share && h.care.share.care), contact: h, name: h.first };
  }
  function q(s) { return s && s.home ? '?home=' + encodeURIComponent(s.home) : ''; }

  var _data = null, _busy = false, _syncedAt = 0, _stampV = '', _stampOkAt = 0, _stampBusy = false;
  /* Every 10 seconds: has anything on HOME's day changed anywhere (a dose marked on HOME's phone, a visit logged by a
     carer, an alert)? One small question; the full day is reloaded only when the answer moved, so every phone in the
     circle shows the same timeline within about 10 seconds of the change. */
  async function stampCheck() {
    var s = subject();
    if (!s || !authed() || document.hidden || _stampBusy) return;
    _stampBusy = true;
    try {
      var r = await api('/care/stamp' + q(s));
      if (r.ok && r.data) {
        _stampOkAt = Date.now();
        if (r.data.v !== _stampV) {
          var first = !_stampV; _stampV = r.data.v;
          if (!first || !_data) { load(); try { if (window.CovaraNav && CovaraNav.summaryNow) CovaraNav.summaryNow(); } catch (e) {} }
        }
      }
    } catch (e) {} finally { _stampBusy = false; }
  }
  async function load() {
    var s = subject();
    if (!s || !authed()) { _data = null; render(); syncSpheres(); return; }
    if (_busy) return; _busy = true;
    try {
      var px = await api('/care/proxy' + q(s)).catch(function () { return { ok: false }; });
      if (!s.edit) { _data = { s: s, today: { items: [] }, items: [], proxy: px.ok ? px.data : null, warn: _data && _data.warn }; render(); syncSpheres(); return; }
      var a = await api('/care/today' + q(s)), b = await api('/care/items' + q(s)), c = role() === 'away' ? await api('/care/circle' + q(s)) : { ok: false };
      try { if (window.CovaraWhere) CovaraWhere.load(true); } catch (e) {}
      var ib = await api('/care/inbox' + q(s)).catch(function () { return { ok: false }; });
      var lg = await api('/care/log' + (q(s) ? q(s) + '&' : '?') + 'days=7').catch(function () { return { ok: false }; }), sh = await api('/care/sheet' + q(s)).catch(function () { return { ok: false }; });
      var vt = await api('/care/vitals' + q(s)).catch(function () { return { ok: false }; });
      if (a.ok && b.ok) { _syncedAt = Date.now(); _data = { s: s, today: a.data, items: b.data.items || [], family: c.ok ? (c.data.family || []) : [], proxy: px.ok ? px.data : null, log: lg.ok ? lg.data.log : [], sheet: sh.ok ? sh.data : null, inbox: ib.ok ? ib.data.inbox : [], vitals: vt.ok ? vt.data : null, warn: _data && _data.s && _data.s.home === s.home ? _data.warn : null }; render(); syncSpheres(); }
    } catch (e) {} finally { _busy = false; }
  }

  /* ── what is needed soonest ── */
  function medNext(it) {
    var slots = (_data.today.items || []).filter(function (x) { return x.item.id === it.id; });
    var open = slots.filter(function (x) { return x.state !== 'done'; });
    var late = open.filter(function (x) { return x.state === 'late'; })[0];
    var due = open.filter(function (x) { return x.state === 'due'; })[0];
    var later = open.filter(function (x) { return x.state === 'later'; })[0];
    if (late) return { state: 'late', slot: late.slot, at: late.at || slotMs(late.slot), rank: 0 };
    if (due) return { state: 'due', slot: due.slot, at: due.at || slotMs(due.slot), rank: 1 };
    if (later) return { state: 'later', slot: later.slot, at: later.at || slotMs(later.slot), rank: 2 };
    var first = (it.times || [])[0];
    return { state: slots.length ? 'done' : 'off', slot: null, at: first ? slotMs(first, 1) : Infinity, rank: 3 };
  }
  function nextLabel(n) {
    if (n.state === 'late') return t('late') + ' ' + n.slot;
    if (n.state === 'due') return t('now');
    if (!isFinite(n.at)) return '';
    return n.rank === 3 ? dayLabel(n.at).toUpperCase() + ' ' + hhmm(n.at) : hhmm(n.at);
  }
  function lists() {
    var now = Date.now(), d = _data;
    var meds = d.items.filter(function (i) { return i.kind === 'med' || i.kind === 'check'; })
      .map(function (i) { return { it: i, n: medNext(i) }; })
      .sort(function (a, b) { return a.n.rank - b.n.rank || a.n.at - b.n.at; });
    var apptDone = {}; (d.today.items || []).forEach(function (x) { if (x.slot === 'appt') apptDone[x.item.id] = x.state; });
    var appts = d.items.filter(function (i) { return i.kind === 'appt' && i.at && i.at > now - 6 * 3600e3; })
      .sort(function (a, b) { return a.at - b.at; })
      .map(function (i) { var s = apptDone[i.id] || 'later'; return { it: i, n: { state: s === 'due' ? 'due' : s, at: i.at } }; });
    var subs = d.items.filter(function (i) { return i.kind === 'sub'; })
      .sort(function (a, b) { return (a.at || 0) - (b.at || 0); })
      .map(function (i) { return { it: i, n: { state: i.at && i.at - now < 3 * 864e5 ? 'due' : 'later', at: i.at } }; });
    /* who may see HOME's medical records: the people HOME names, and the family HOME lets see medicines in Covara */
    var recs = d.items.filter(function (i) { return i.kind === 'access' && (i.meta || {}).records !== false; }).sort(function (a, b) { return a.title.localeCompare(b.title); })
      .map(function (i) { return { it: i, n: { state: 'later', at: Infinity } }; });
    if (role() === 'home' && typeof DEMO_CONTACTS !== 'undefined') DEMO_CONTACTS.forEach(function (c) {
      var cv = c.care; if (!cv || cv.side !== 'away' || cv.state !== 'active' || !(cv.share && cv.share.care)) return;
      var rel = cv.relation && window.CovaraCare && CovaraCare.relLabel ? CovaraCare.relLabel(cv.relation) : '';
      recs.push({ it: { id: 'fam:' + c.id, kind: 'family', title: ((c.first || '') + ' ' + (c.last || '')).trim(), meta: { relation: rel, profession: cv.role || '', email: c.email, phone: c.phone }, contact: c }, n: { state: 'later', at: Infinity } });
    });
    (d.family || []).forEach(function (f) { if (!f.sees_care || !f.name) return; recs.push({ it: { id: 'fam:' + f.id, kind: 'family', title: f.name + (f.you ? ' (' + t('you') + ')' : ''), meta: { relation: f.relation && window.CovaraCare ? CovaraCare.relLabel(f.relation) : '', profession: f.role || '' } }, n: { state: 'later', at: Infinity } }); });
    return { med: meds, appt: appts, sub: subs, rec: recs };
  }

  /* ── HOME's care: five pills on the left of HOME's sphere, mirroring Video, Phone, Message, Email.
     Medicines (with whether each prescription is filled), Visits, Health (HOME's day), Safety
     (for the emergency room, and if HOME goes missing) and Papers (who decides for HOME, who sees
     HOME's medical records, and who HOME is). A pill opens its panel in the upper left. ── */
  var box = document.createElement('div'); box.id = 'cvTabs'; box.setAttribute('aria-label', 'Care');
  document.body.appendChild(box);
  var _open = '', _openItem = '';
  var SECTIONS = ['med', 'visit', 'health', 'safety', 'papers'];
  var SEC_ADD = { med: 'addMed', visit: 'addAppt' };

  function ph(it) {
    return it.photo ? 'background-image:url("' + photoUrl(it.photo).replace(/["\\]/g, '') + '")' : 'background:' + orbOf(it.title);
  }
  function doseText(m) {
    var f = m.form ? (L().forms[m.form] || m.form) : '';
    var a = m.qty ? m.qty + (f ? ' ' + f + (m.qty > 1 && f && !/s$/.test(f) && loc().slice(0, 2) === 'en' ? 's' : '') : '') : '';
    var b = m.strength ? m.strength + ' ' + (m.unit || '') : '';
    return [a, b].filter(Boolean).join(' · ');
  }
  /* How many are left and when they run out, from the bottle size and the doses marked since the refill. */
  function supply(it) {
    var m = it.meta || {}; if (!m.dispensed) return null;
    var per = (m.qty || 1), used = (it.doses_since_refill || 0) * per, left = Math.max(0, m.dispensed - used);
    var perDay = per * ((it.times || []).length || 0);
    var out = perDay ? Date.now() + (left / perDay) * 864e5 : null;
    return { left: left, out: out };
  }
  /* The prescription: filled (picked up) or not filled (running out, or never picked up) */
  function filled(it) {
    var m = it.meta || {}, sp = supply(it);
    var low = sp && (sp.left <= 0 || (sp.out && sp.out - Date.now() < 7 * 864e5));
    if (low) return { ok: false, text: t('notFilled') + (sp.out ? ' · ' + t('runsOut') + ' ' + dayLabel(sp.out) : '') };
    if (m.refilled_on) return { ok: true, text: t('filledOn', { d: dateOnly(m.refilled_on) }) };
    if (m.dispensed) return { ok: true, text: t('filled') };
    return null;
  }
  function who(id) { if (id === myId()) return t('you'); if (_data.s.contact && id === _data.s.home) return _data.s.contact.first; return ''; }
  function feedbackHtml(it) {
    var q2 = it.kind === 'appt' ? t('helped') : t('working');
    var last = (it.feedback || [])[0];
    var mine = last && last.by === myId() && Date.now() - last.at < 864e5 ? last.answer : '';
    return '<div class="cvx-q">' + esc(q2) + '</div><div class="cvx-acts">' +
      ['yes', 'unsure', 'no'].map(function (a) { return '<button type="button" class="cvx-btn" data-fb="' + a + '" aria-pressed="' + (mine === a) + '">' + esc(t(a)) + '</button>'; }).join('') + '</div>' +
      (last ? '<div class="cvx-said">' + esc((who(last.by) || '') + ' ' + t('said') + ': ' + t(last.answer) + ' · ' + when(last.at)) + (last.note ? '<br>' + esc(last.note) : '') + '</div>' : '');
  }
  function detailsHtml(kind, e) {
    var it = e.it, m = it.meta || {}, rows = [];
    function kv(k, v) { if (v) rows.push('<dt>' + esc(t(k)) + '</dt><dd>' + esc(v) + '</dd>'); }
    if (kind === 'med') {
      kv('dNext', isFinite(e.n.at) ? (e.n.state === 'late' ? t('late') + ', ' : e.n.state === 'due' ? t('now') + ', ' : '') + when(e.n.at) : '');
      kv('dSchedule', m.as_needed && !(it.times || []).length ? t('asNeeded') : (it.times || []).join(' · '));
      kv('dFor', m.purpose);
      kv('dLast', it.last_done ? when(it.last_done) : t('never'));
      kv('dDose', doseText(m) || it.detail);
      kv('dInstr', m.instructions);
      kv('dLooks', m.looks_like);
      kv('dWatch', m.watch_for);
      kv('dBy', [m.prescriber, m.prescribed_on ? dateOnly(m.prescribed_on) : '', m.prescriber_phone].filter(Boolean).join(' · '));
      kv('dRx', m.rx_number);
      var fl = filled(it); kv('dFilled', fl ? fl.text : '');
      kv('dVoice', m.voice_url ? t('voiceBy', { name: m.voice_by || '' }) : '');
      kv('dFrom', [m.source ? t(m.source) : '', m.source_name, m.source_phone, m.source_address].filter(Boolean).join(' · '));
      kv('dStart', m.start_on ? dateOnly(m.start_on) + (m.end_on ? '' : ' · ' + t('ongoing')) : '');
      kv('dEnds', m.end_on ? dateOnly(m.end_on) : '');
      var sp = supply(it);
      kv('dSupply', [sp ? sp.left + ' ' + t('left') + (sp.out ? ', ' + t('runsOut') + ' ' + dayLabel(sp.out) : '') : '', m.refills != null ? m.refills + ' ' + t('refills') : ''].filter(Boolean).join(' · '));
    } else {
      kv('dWhen', when(it.at)); kv('dWith', m.with); kv('dWhere', m.place || it.detail); kv('dNotes', m.notes);
      kv('dLastDone', it.last_done ? when(it.last_done) : '');
    }
    var canMark = (kind === 'med' && e.n.slot && e.n.state !== 'off') || (kind === 'visit' && e.n.state !== 'done' && dayLabel(it.at) === t('today'));
    var acts = '<div class="cvx-acts">' +
      (canMark && _data.s.edit ? '<button type="button" class="cvx-btn pri" data-a="mark">' + esc(kind === 'med' ? t('taken') : t('done')) + '</button>' : '') +
      (_data.s.edit ? '<button type="button" class="cvx-btn" data-a="edit">' + esc(t('change')) + '</button>' : '') +
      (_data.s.edit && kind === 'med' ? '<button type="button" class="cvx-btn" data-a="refill">' + esc(t('refill')) + '</button>' : '') +
      (kind === 'med' && m.voice_url ? '<button type="button" class="cvx-btn" data-a="voice" data-src="' + esc(photoUrl(m.voice_url)) + '">' + esc(t('playVoice')) + '</button>' : '') + '</div>';
    return '<button type="button" class="cvx-big" style="' + esc(ph(it)) + '" data-a="photo" aria-label="' + esc(it.title) + '"></button>' +
      '<dl class="cvx-kv">' + rows.join('') + '</dl>' + acts + (_data.s.edit ? feedbackHtml(it) : '');
  }
  function initials2(n) { var w = String(n || '').replace(/^(dr|dott)\.?\s+/i, '').trim().split(/\s+/); return ((w[0] || '?')[0] + (w[1] ? w[1][0] : '')).toUpperCase(); }
  function recRow(e) {
    var it = e.it, m = it.meta || {}, key = it.id;
    var sub = [m.relation, m.profession].filter(Boolean).join(' · ');
    var rows = [];
    function kv(k, v) { if (v) rows.push('<dt>' + esc(t(k)) + '</dt><dd>' + esc(v) + '</dd>'); }
    kv('dRel', m.relation); kv('dProf', m.profession); kv('dOrg', m.org); kv('dPhone', m.phone); kv('dEmail', m.email); kv('dSince', m.since ? dateOnly(m.since) : '');
    if (it.kind === 'family') kv('whatSee', t('seesCovara'));
    var canEdit = role() === 'home';
    var acts = canEdit ? '<div class="cvx-acts">' + (it.kind === 'family' ? '<button type="button" class="cvx-btn" data-a="consent">' + esc(t('whatSee')) + '</button>' : '<button type="button" class="cvx-btn" data-a="edit">' + esc(t('change')) + '</button>') + '</div>' : '';
    return '<div class="cvx-item' + (_openItem === key ? ' open' : '') + '" data-id="' + esc(key) + '" data-kind="rec">' +
      '<button type="button" class="cvx-row" aria-expanded="' + (_openItem === key) + '"><span class="cvx-ph cvx-ini" style="' + esc('background:' + orbOf(it.title)) + '">' + esc(initials2(it.title)) + '</span>' +
      '<span class="cvx-nm"><span>' + esc(it.title) + '</span>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span></button>' +
      '<div class="cvx-det" style="padding-left:50px">' + (_openItem === key ? '<dl class="cvx-kv">' + rows.join('') + '</dl>' + acts : '') + '</div></div>';
  }
  function rowHtml(kind, e) {
    if (kind === 'rec') return recRow(e);
    var it = e.it, m = it.meta || {};
    var sub = kind === 'med' ? (doseText(m) || it.detail || '') : [m.with, m.place || it.detail].filter(Boolean).join(' · ');
    var fl = kind === 'med' ? filled(it) : null;
    if (fl && !fl.ok) sub = t('notFilled') + (sub ? ' · ' + sub : '');
    var w = kind === 'med' ? nextLabel(e.n) : (e.n.state === 'done' ? t('done').toUpperCase() : dayLabel(it.at).toUpperCase() + ' ' + hhmm(it.at));
    var cls = e.n.state === 'late' ? 'late' : e.n.state === 'due' ? 'due' : e.n.state === 'done' ? 'done' : '';
    var key = it.id;
    return '<div class="cvx-item' + (_openItem === key ? ' open' : '') + '" data-id="' + esc(key) + '" data-kind="' + kind + '">' +
      '<button type="button" class="cvx-row" aria-expanded="' + (_openItem === key) + '"><span class="cvx-ph" style="' + esc(ph(it)) + '"></span>' +
      '<span class="cvx-nm"><span>' + esc(it.title) + '</span>' + (sub ? '<small' + (fl && !fl.ok ? ' class="warn"' : '') + '>' + esc(sub) + '</small>' : '') + '</span>' +
      '<span class="cvx-when ' + cls + '">' + esc(w) + '</span></button>' +
      '<div class="cvx-det">' + (_openItem === key ? detailsHtml(kind, e) : '') + '</div></div>';
  }
  /* a row in Health, Safety or Papers: a title, a line under it, and what opens */
  function block(key, title, sub, body, cls) {
    return '<div class="cvx-item' + (_openItem === key ? ' open' : '') + '" data-id="' + esc(key) + '" data-kind="block">' +
      '<button type="button" class="cvx-row" aria-expanded="' + (_openItem === key) + '"><span class="cvx-bar ' + (cls || '') + '"></span>' +
      '<span class="cvx-nm"><span>' + esc(title) + '</span>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span><span class="cvx-chev" aria-hidden="true">›</span></button>' +
      '<div class="cvx-det" style="padding-left:16px">' + (_openItem === key ? body : '') + '</div></div>';
  }
  function name1() { if (_data.s.home) return _data.s.name || ''; var n = ''; try { n = String(userSphereName || '').trim().split(/\s+/)[0]; } catch (e) {} return n || t('me'); }

  /* ── Health: HOME's day, recorded by anyone looking after HOME in a tap ── */
  var LOGK = ['water', 'meal', 'sleep', 'toilet', 'pain', 'mood', 'behaviour'];
  var LOGV = { water: ['none', 'little', 'enough'], meal: ['none', 'some', 'all'], sleep: ['bad', 'broken', 'good'], toilet: ['normal', 'accident', 'pain', 'none'], pain: ['none', 'some', 'bad'], mood: ['calm', 'confused', 'upset'], behaviour: ['wandering', 'agitated', 'repeating', 'refusing', 'hallucinating', 'other'] };
  var GOOD = { enough: 1, all: 1, good: 1, normal: 1, calm: 1 }, BAD = { none: 1, bad: 1, accident: 1, pain: 1, upset: 1, agitated: 1, hallucinating: 1, wandering: 1 };
  function tone(k, v) { if (k === 'pain') return v === 'none' ? 'good' : v === 'bad' ? 'bad' : 'mid'; if (k === 'toilet' && v === 'none') return 'mid'; return GOOD[v] ? 'good' : BAD[v] ? 'bad' : 'mid'; }
  function healthHtml() {
    var log = _data.log || [], since = new Date(); since.setHours(0, 0, 0, 0);
    var today = log.filter(function (x) { return x.at >= since.getTime(); });
    var rows = LOGK.map(function (k) {
      var last = today.filter(function (x) { return x.kind === k; })[0];
      return '<div class="cvh-k"><div class="cvh-l">' + esc(t('lg_' + k)) + (last ? ' <i class="' + tone(k, last.value) + '">' + esc(t('lv_' + last.value)) + ' · ' + esc(hhmm(last.at)) + '</i>' : '') + '</div>' +
        '<div class="cvt-chips cvh-c">' + LOGV[k].map(function (v) { return '<button type="button" class="cvt-chip sm ' + tone(k, v) + '" data-log="' + k + ':' + v + '">' + esc(t('lv_' + v)) + '</button>'; }).join('') + '</div></div>';
    }).join('');
    var week = log.filter(function (x) { return LOGV[x.kind]; }).slice(0, 14).map(function (x) { return '<li><b class="' + tone(x.kind, x.value) + '">' + esc(t('lg_' + x.kind) + ': ' + t('lv_' + x.value)) + '</b> <small>' + esc(when(x.at)) + (x.note ? ' · ' + x.note : '') + '</small></li>'; }).join('');
    var sleepB = window.CovaraSleep ? block('sleep', CovaraSleep.title(), CovaraSleep.sub(_data.vitals), CovaraSleep.body(_data.vitals, name1(), role() === 'home'), 'blue') : '';
    return sleepB + '<div class="cvx-q" style="color:rgba(240,238,245,.85);margin:6px 6px 2px">' + esc(t('dayOf', { name: name1() })) + '</div>' +
      '<div class="cvx-sub">' + esc(t('dayHint')) + '</div>' + (_data.warn ? '<div class="cvx-warn">' + esc(_data.warn) + '</div>' : '') +
      '<div class="cvh">' + rows + '</div>' +
      (week ? '<div class="cvx-q" style="margin:12px 6px 4px;color:rgba(159,216,255,.8)">' + esc(t('lastDays')) + '</div><ul class="cvh-w">' + week + '</ul>' : '') + comfortBlock();
  }

  /* ── Safety: the emergency room, and if HOME goes missing ── */
  function sheetRows(keys) {
    var d = (_data.sheet && _data.sheet.data) || {}, rows = [];
    keys.forEach(function (k) { var v = d[k]; if (k === 'dnr' && v) v = t('dnr_' + v); if (v) rows.push('<dt>' + esc(t('sh_' + k)) + '</dt><dd>' + esc(v) + '</dd>'); });
    return rows;
  }
  var ER_KEYS = ['diagnosis', 'stage', 'allergies', 'conditions', 'blood', 'dnr', 'directive', 'insurance', 'hospital', 'talk'];
  var MISS_KEYS = ['height', 'weight', 'hair', 'eyes', 'marks', 'clothes', 'aids', 'language', 'places'];
  var ABOUT_KEYS = ['nickname', 'work', 'story', 'likes', 'calms', 'upsets'];
  function medsLine() { return (_ls ? _ls.med : []).map(function (x) { return x.it.title + (doseText(x.it.meta || {}) ? ' ' + doseText(x.it.meta || {}) : '') + ((x.it.times || []).length ? ' (' + x.it.times.join(', ') + ')' : ''); }).join('; '); }
  function doctorsLine() { return (_data.items || []).filter(function (i) { return i.kind === 'access' && (i.meta || {}).group === 'doctor'; }).map(function (i) { return i.title + ((i.meta || {}).phone ? ' ' + i.meta.phone : ''); }).join('; '); }
  function erHtml(full) {
    var rows = sheetRows(ER_KEYS);
    if (medsLine()) rows.splice(Math.min(rows.length, 4), 0, '<dt>' + esc(t('meds')) + '</dt><dd>' + esc(medsLine()) + '</dd>');
    if (doctorsLine()) rows.push('<dt>' + esc(t('gDoctor')) + '</dt><dd>' + esc(doctorsLine()) + '</dd>');
    if (_data.proxy && _data.proxy.proxy) rows.push('<dt>' + esc(t('decides')) + '</dt><dd>' + esc(_data.proxy.proxy.name) + '</dd>');
    var empty = !sheetRows(ER_KEYS).length;
    return (empty ? '<div class="cvx-sub">' + esc(t('erEmpty')) + '</div>' : '') + '<dl class="cvx-kv">' + rows.join('') + '</dl>' +
      (full ? '' : '<div class="cvx-acts"><button type="button" class="cvx-btn pri" data-a="show-er">' + esc(t('showNurse')) + '</button>' + (_data.s.edit ? '<button type="button" class="cvx-btn" data-a="sheet-er">' + esc(t('change')) + '</button>' : '') + '</div>');
  }
  function missingHtml(full) {
    var rows = sheetRows(MISS_KEYS), w = window.CovaraWhere && CovaraWhere.data(), loc2 = w && w.location;
    if (loc2) rows.unshift('<dt>' + esc(t('lastSeen')) + '</dt><dd>' + esc(when(loc2.at) + ' · ' + loc2.lat.toFixed(5) + ', ' + loc2.lon.toFixed(5)) + '</dd>');
    var empty = !sheetRows(MISS_KEYS).length;
    return (empty ? '<div class="cvx-sub">' + esc(t('missEmpty')) + '</div>' : '') + '<dl class="cvx-kv">' + rows.join('') + '</dl>' +
      (full ? '' : '<div class="cvx-acts"><button type="button" class="cvx-btn pri" data-a="show-miss">' + esc(t('showPolice')) + '</button>' + (_data.s.edit ? '<button type="button" class="cvx-btn" data-a="sheet-miss">' + esc(t('change')) + '</button>' : '') + '</div>');
  }
  function safetyHtml() {
    var d = (_data.sheet && _data.sheet.data) || {};
    return leaveBlock() + block('er', t('forEr'), d.diagnosis ? d.diagnosis + (d.allergies ? ' · ' + t('sh_allergies') + ': ' + d.allergies : '') : t('erShort'), erHtml(false), 'red') +
      block('miss', t('ifMissing', { name: name1() }), t('missShort'), missingHtml(false), 'gold') +
      block('rooms', t('fallsRooms'), t('fallsShort'), '<div class="cvx-sub">' + esc(t('fallsBody')) + '</div>', 'blue') + worryBlock();
  }

  /* ── Papers: who decides for HOME, who sees HOME's medical records, and who HOME is ── */
  var SHARE_K = ['location', 'rooms', 'falls', 'care', 'mood', 'activity'];
  function proxyHtml() {
    var P = _data.proxy || {}, p = P.proxy, me = myId(), out = '';
    if (role() === 'home') {
      if (p && p.active) out = '<div class="cvx-sub">' + esc(t('pxActiveHome', { name: p.name })) + '</div><div class="cvx-acts"><button type="button" class="cvx-btn pri" data-a="px-end">' + esc(t('pxDecideAgain')) + '</button></div>';
      else {
        var fam = (typeof DEMO_CONTACTS !== 'undefined' ? DEMO_CONTACTS : []).filter(function (c) { return c.care && c.care.side === 'away' && c.care.state === 'active'; });
        out = '<div class="cvx-sub">' + esc(p ? t('pxNamed', { name: p.name }) : t('pxWhy')) + '</div>' +
          (fam.length ? '<div class="cvt-chips" style="margin:6px 0 10px">' + fam.map(function (c) { var on = p && c.care.userId === p.user_id; return '<button type="button" class="cvt-chip sm" data-px="' + esc(c.care.userId) + '" aria-pressed="' + !!on + '">' + esc(((c.first || '') + ' ' + (c.last || '')).trim()) + '</button>'; }).join('') + '</div>' : '<div class="cvx-sub">' + esc(t('pxNoFamily')) + '</div>');
      }
    } else {
      if (!p) out = '<div class="cvx-sub">' + esc(t('pxNone', { name: name1() })) + '</div>';
      else if (p.active && P.you_decide) {
        out = '<div class="cvx-sub">' + esc(t('pxYouDecide', { name: name1() })) + '</div>' + (P.links || []).map(function (l) {
          return '<div class="cvp-l"><b>' + esc(l.away.name || '') + '</b> <small>' + esc(l.relation && window.CovaraCare ? CovaraCare.relLabel(l.relation) : '') + (l.status === 'pending' ? ' · ' + t('pxAsks') : '') + '</small><div class="cvt-chips">' +
            (l.status === 'pending' ? '<button type="button" class="cvt-chip sm" data-lk="' + esc(l.id) + ':approve">' + esc(t('pxApprove')) + '</button>' : '') +
            SHARE_K.map(function (k) { return '<button type="button" class="cvt-chip sm" data-lk="' + esc(l.id) + ':' + k + '" aria-pressed="' + !!(l.share && l.share[k]) + '">' + esc(t('sk_' + k)) + '</button>'; }).join('') + '</div></div>';
        }).join('') + '<div class="cvx-acts" style="margin-top:10px"><button type="button" class="cvx-btn" data-a="px-end">' + esc(t('pxEnd', { name: name1() })) + '</button></div>';
      } else if (p.active) out = '<div class="cvx-sub">' + esc(t('pxActiveOther', { proxy: p.name, name: name1() })) + '</div>';
      else if (p.user_id === me) out = '<div class="cvx-sub">' + esc(t('pxYouNamed', { name: name1() })) + '</div><div class="cvx-acts"><button type="button" class="cvx-btn warn" data-a="px-on">' + esc(t('pxCannot', { name: name1() })) + '</button></div>';
      else out = '<div class="cvx-sub">' + esc(t('pxNamedOther', { proxy: p.name, name: name1() })) + '</div>';
    }
    return out;
  }
  function papersHtml() {
    var P = _data.proxy || {}, p = P.proxy;
    var recs = (_ls ? _ls.rec : []);
    var d = (_data.sheet && _data.sheet.data) || {};
    var aboutBody = (sheetRows(ABOUT_KEYS).length ? '<dl class="cvx-kv">' + sheetRows(ABOUT_KEYS).join('') + '</dl>' : '<div class="cvx-sub">' + esc(t('aboutEmpty', { name: name1() })) + '</div>') +
      (_data.s.edit ? '<div class="cvx-acts"><button type="button" class="cvx-btn" data-a="sheet-about">' + esc(t('change')) + '</button></div>' : '');
    var recBody = recs.map(function (e) { return recRow(e); }).join('') || '<div class="cvx-empty">' + esc(t('none')) + '</div>';
    if (role() === 'home') recBody += '<button type="button" class="cvx-add" data-add="rec">' + esc(t('addRec')) + '</button>';
    return block('proxy', t('whoDecides', { name: name1() }), p ? (p.active ? t('pxNow', { name: p.name }) : t('pxNamedShort', { name: p.name })) : t('pxNobody'), proxyHtml(), p && p.active ? 'gold' : p ? 'blue' : 'red') +
      (_data.s.edit ? docsBlock() : '') +
      block('records', role() === 'home' ? t('recsHeadMe') : t('recsHeadOf', { name: _data.s.name || '' }), recs.length + ' ' + t('people'), recBody, 'blue') +
      block('about', t('aboutTitle', { name: name1() }), d.nickname || d.work || t('aboutShort'), aboutBody, 'blue');
  }

  /* ── more in each pill: the care team, comfort, leaving home, money worries, documents ── */
  function pad(n) { return String(n).padStart(2, '0'); }
  function itemsOf(kind) { return (_data.items || []).filter(function (i) { return i.kind === kind; }); }
  function whoName(id) {
    if (id === myId()) return t('you');
    if (_data.s.contact && id === _data.s.home) return _data.s.contact.first;
    var f = (_data.family || []).filter(function (x) { return x.id === id; })[0]; if (f) return String(f.name || '').split(/\s+/)[0];
    var c = (typeof DEMO_CONTACTS !== 'undefined' ? DEMO_CONTACTS : []).filter(function (x) { return x.care && x.care.userId === id; })[0];
    return c ? c.first : '';
  }
  var _medWarn = null;
  function visitsExtra() {
    var out = '', now = Date.now();
    var shifts = itemsOf('shift').filter(function (s) { return ((s.meta || {}).end || s.at + 8 * 3600e3) > now; }).sort(function (a, b) { return a.at - b.at; });
    var on = shifts.filter(function (s) { return s.at <= now; })[0];
    var shBody = (shifts.length ? '<ul class="cvh-w">' + shifts.slice(0, 8).map(function (s) { var m = s.meta || {}; return '<li><b>' + esc(m.who || s.title) + '</b> <small>' + esc(when(s.at) + (m.end ? ' ' + t('to') + ' ' + hhmm(m.end) : '')) + '</small>' + (_data.s.edit ? ' <button type="button" class="cvx-lnk" data-rm-item="' + esc(s.id) + '">' + esc(t('remove')) + '</button>' : '') + '</li>'; }).join('') + '</ul>' : '<div class="cvx-sub">' + esc(t('shiftNone')) + '</div>') +
      (_data.s.edit ? '<button type="button" class="cvx-add" data-form="shift">' + esc(t('addShift')) + '</button>' : '');
    out += block('shifts', t('onDuty'), on ? t('onNow', { name: (on.meta || {}).who || on.title }) : shifts[0] ? t('nextShift', { name: (shifts[0].meta || {}).who || shifts[0].title, when: when(shifts[0].at) }) : t('shiftShort'), shBody, on ? 'gold' : 'blue');
    var notes = (_data.log || []).filter(function (x) { return x.kind === 'handover'; });
    var hoBody = '<div class="cvt-f" style="margin:4px 0 8px"><textarea id="cvHo" rows="3" placeholder="' + esc(t('hoPh')) + '"></textarea></div><div class="cvx-acts"><button type="button" class="cvx-btn pri" data-a="ho-save">' + esc(t('hoSave')) + '</button></div>' +
      (notes.length ? '<ul class="cvh-w">' + notes.slice(0, 6).map(function (x) { return '<li>' + esc(x.note) + '<br><small>' + esc((whoName(x.by) || '') + ' · ' + when(x.at)) + '</small></li>'; }).join('') + '</ul>' : '');
    out += block('handover', t('handover'), notes[0] ? (whoName(notes[0].by) + ' · ' + when(notes[0].at)) : t('hoShort'), hoBody, 'blue');
    if (role() === 'away') {
      var vis = (_data.log || []).filter(function (x) { return x.kind === 'visit'; });
      var mine = vis.filter(function (x) { return x.by === myId(); })[0], here = mine && mine.value === 'arrived';
      var viBody = '<div class="cvx-sub">' + esc(t('checkWhy', { name: name1() })) + '</div><div class="cvx-acts"><button type="button" class="cvx-btn pri" data-visit="' + (here ? 'left' : 'arrived') + '">' + esc(here ? t('imLeaving') : t('imHere')) + '</button></div>' +
        (vis.length ? '<ul class="cvh-w">' + vis.slice(0, 8).map(function (x) { var l = String(x.note || '').replace('loc:', '') || 'unknown'; return '<li><b class="' + (l === 'here' ? 'good' : l === 'away' ? 'bad' : 'mid') + '">' + esc((whoName(x.by) || '') + ' ' + t('vi_' + x.value)) + '</b> <small>' + esc(when(x.at) + ' · ' + t('loc_' + l, { name: name1() })) + '</small></li>'; }).join('') + '</ul>' : '');
      out += block('checkin', t('checkIn'), here ? t('youAreHere', { when: hhmm(mine.at) }) : t('checkShort'), viBody, here ? 'gold' : 'blue');
      var me = (_data.log || []).filter(function (x) { return x.kind === 'me'; })[0], recent = me && Date.now() - me.at < 864e5;
      var tally = {}; (_data.log || []).forEach(function (x) { if (x.kind === 'me') return; var n = whoName(x.by) || '?'; tally[n] = (tally[n] || 0) + 1; });
      var fyBody = '<div class="cvx-q" style="color:rgba(240,238,245,.85);margin-top:4px">' + esc(t('holding')) + '</div><div class="cvt-chips">' + ['good', 'tired', 'overwhelmed'].map(function (v) { return '<button type="button" class="cvt-chip sm ' + (v === 'good' ? 'good' : v === 'tired' ? 'mid' : 'bad') + '" data-me="' + v + '" aria-pressed="' + !!(recent && me.value === v) + '">' + esc(t('me_' + v)) + '</button>'; }).join('') + '</div>' +
        (recent && me.value !== 'good' ? '<div class="cvx-sub" style="margin-top:8px">' + esc(t(me.value === 'overwhelmed' ? 'meHelpBad' : 'meHelpTired')) + '</div>' : '') +
        '<div class="cvx-acts" style="margin-top:8px"><a class="cvx-btn pri" style="display:inline-flex;align-items:center;text-decoration:none" href="tel:+18002723900">' + esc(t('helpline')) + '</a></div>' +
        (Object.keys(tally).length ? '<div class="cvx-q" style="margin-top:10px;color:rgba(159,216,255,.8)">' + esc(t('whoDid')) + '</div><ul class="cvh-w">' + Object.keys(tally).sort(function (a, b) { return tally[b] - tally[a]; }).map(function (n) { return '<li><b>' + esc(n) + '</b> <small>' + esc(t(tally[n] === 1 ? 'entry1' : 'entries', { n: tally[n] })) + '</small></li>'; }).join('') + '</ul>' : '');
      out += block('foryou', t('forYou'), t('forYouShort'), fyBody, recent && me.value === 'overwhelmed' ? 'red' : 'blue');
    }
    return out;
  }
  function comfortBlock() {
    var cs = itemsOf('comfort');
    var body = (cs.length ? cs.map(function (c) { var m = c.meta || {};
      return '<div class="cvc">' + (c.photo ? '<button type="button" class="cvx-ph" style="' + esc(ph(c)) + ';border:0;cursor:zoom-in" data-cphoto="' + esc(c.id) + '"></button>' : '<span class="cvx-ph cvx-ini" style="' + esc('background:' + orbOf(c.title)) + '">' + esc(initials2(c.title)) + '</span>') +
        '<span class="cvx-nm"><span>' + esc(c.title) + '</span><small>' + esc(t('ct_' + (m.type || 'music'))) + '</small></span>' +
        (m.url ? '<a class="cvx-btn" href="' + esc(m.url) + '" target="_blank" rel="noopener">' + esc(t('play')) + '</a>' : '') +
        (_data.s.edit ? '<button type="button" class="cvx-lnk" data-rm-item="' + esc(c.id) + '">' + esc(t('remove')) + '</button>' : '') + '</div>'; }).join('') : '<div class="cvx-sub">' + esc(t('comfortEmpty', { name: name1() })) + '</div>') +
      (_data.s.edit ? '<button type="button" class="cvx-add" data-form="comfort">' + esc(t('addComfort')) + '</button>' : '');
    return block('comfort', t('comfortTitle'), cs.length ? t('nItems', { n: cs.length }) : t('comfortShort'), body, 'gold');
  }
  function leaveBlock() {
    var w = window.CovaraWhere && CovaraWhere.data(), mode = _data.leave || (w && w.leave_alert) || 'night';
    var body = '<div class="cvx-sub">' + esc(t('leaveWhy', { name: name1() })) + '</div><div class="cvt-chips">' + ['night', 'always', 'off'].map(function (m) { return '<button type="button" class="cvt-chip sm" data-leave="' + m + '" aria-pressed="' + (mode === m) + '">' + esc(t('lv2_' + m)) + '</button>'; }).join('') + '</div>' +
      '<div class="cvx-sub" style="margin-top:8px">' + esc(t('leaveDoor', { name: name1() })) + '</div>';
    return block('leave', t('leaving', { name: name1() }), t('lv2_' + mode), body, mode === 'off' ? 'red' : 'gold');
  }
  function worryBlock() {
    var ws = (_data.log || []).filter(function (x) { return x.kind === 'worry'; });
    var body = '<div class="cvx-sub">' + esc(t('worryWhy', { name: name1() })) + '</div><div class="cvt-f" style="margin:4px 0 8px"><input type="text" id="cvWorryNote" maxlength="300" placeholder="' + esc(t('worryPh')) + '"></div><div class="cvt-chips">' +
      ['scam_call', 'spending', 'stranger', 'other'].map(function (v) { return '<button type="button" class="cvt-chip sm bad" data-worry="' + v + '">' + esc(t('wo_' + v)) + '</button>'; }).join('') + '</div>' +
      (ws.length ? '<ul class="cvh-w" style="margin-top:8px">' + ws.slice(0, 6).map(function (x) { return '<li><b class="bad">' + esc(t('wo_' + x.value)) + '</b> <small>' + esc(when(x.at) + (x.note ? ' · ' + x.note : '')) + '</small></li>'; }).join('') + '</ul>' : '') +
      '<div class="cvx-sub" style="margin-top:8px">' + esc(t('worryTips')) + '</div>';
    return block('money', t('moneyTitle'), ws[0] ? t('wo_' + ws[0].value) + ' · ' + dayLabel(ws[0].at) : t('moneyShort'), body, ws.length ? 'red' : 'blue');
  }
  var DOC_T = ['poa_health', 'poa_money', 'directive', 'will', 'hipaa', 'insurance', 'id', 'other'];
  function docsBlock() {
    var ds = itemsOf('doc');
    var body = (ds.length ? ds.map(function (d) { var m = d.meta || {};
      return '<div class="cvc"><span class="cvx-ph cvx-ini" style="background:linear-gradient(135deg,#e7cf8f,#8a6a24);font-size:10px">' + esc(m.file_kind === 'pdf' ? 'PDF' : m.file ? 'IMG' : initials2(d.title)) + '</span><span class="cvx-nm"><span>' + esc(d.title) + '</span><small>' + esc([t('dt_' + (m.type || 'other')), m.kept, m.on ? dateOnly(m.on) : ''].filter(Boolean).join(' · ')) + '</small></span>' +
        (m.file_url ? '<a class="cvx-btn" href="' + esc(photoUrl(m.file_url)) + '" target="_blank" rel="noopener">' + esc(t('openDoc')) + '</a>' : '') +
        (_data.s.edit ? '<button type="button" class="cvx-lnk" data-rm-item="' + esc(d.id) + '">' + esc(t('remove')) + '</button>' : '') + '</div>'; }).join('') : '<div class="cvx-sub">' + esc(t('docsEmpty')) + '</div>') +
      (_data.s.edit ? '<button type="button" class="cvx-add" data-form="doc">' + esc(t('addDoc')) + '</button>' : '');
    var have = {}; ds.forEach(function (d) { have[(d.meta || {}).type] = 1; });
    var miss = ['poa_health', 'poa_money', 'directive'].filter(function (k) { return !have[k]; });
    return block('docs', t('docsTitle'), miss.length ? t('docsMissing', { list: miss.map(function (k) { return t('dt_' + k); }).join(', ') }) : t('nItems', { n: ds.length }), body, miss.length ? 'red' : 'gold');
  }
  /* The care team's forms: a shift, something that brings comfort, a document */
  function openForm(kind) {
    var el = sheet('cvForm2'), d0 = new Date(Date.now() + 3600e3), ds = d0.getFullYear() + '-' + pad(d0.getMonth() + 1) + '-' + pad(d0.getDate());
    function inp2(id, label, val, type, extra) { return '<div><label for="' + id + '">' + esc(t(label)) + '</label><input type="' + (type || 'text') + '" id="' + id + '" value="' + esc(val || '') + '" autocomplete="off" ' + (extra || '') + '></div>'; }
    var pick = kind === 'comfort' ? 'music' : kind === 'doc' ? 'poa_health' : '', file = null, f = '', title = kind === 'shift' ? 'addShift' : kind === 'comfort' ? 'addComfort' : 'addDoc';
    if (kind === 'shift') f = inp2('fWho', 'shiftWho', '', 'text', 'maxlength="80"') + inp2('fDate', 'date', ds, 'date') + '<div class="cvt-two">' + inp2('fStart', 'shiftStart', '09:00', 'time') + inp2('fEnd', 'shiftEnd', '17:00', 'time') + '</div>';
    else if (kind === 'comfort') f = '<div class="cvt-chips">' + ['music', 'photo', 'video', 'story'].map(function (k) { return '<button type="button" class="cvt-chip" data-pick="' + k + '" aria-pressed="' + (pick === k) + '">' + esc(t('ct_' + k)) + '</button>'; }).join('') + '</div>' +
      inp2('fTitle', 'ctTitle', '', 'text', 'maxlength="120"') + inp2('fUrl', 'ctUrl', '', 'url', 'maxlength="400" placeholder="https://"') +
      '<button type="button" class="cvt-shot" data-shot style="width:110px;height:110px">' + esc(t('ctPhoto')) + '</button><input type="file" accept="image/*" hidden data-file>';
    else f = '<div class="cvt-chips">' + DOC_T.map(function (k) { return '<button type="button" class="cvt-chip sm" data-pick="' + k + '" aria-pressed="' + (pick === k) + '">' + esc(t('dt_' + k)) + '</button>'; }).join('') + '</div>' +
      inp2('fTitle', 'docTitle', '', 'text', 'maxlength="120"') + inp2('fKept', 'docKept', '', 'text', 'maxlength="160"') + inp2('fOn', 'docOn', '', 'date') +
      '<button type="button" class="cvt-shot" data-shot style="width:110px;height:110px">' + esc(t('docFile')) + '</button><input type="file" accept="application/pdf,image/*" hidden data-file>';
    el.innerHTML = '<div class="cv-box"><div class="cv-mono">' + esc(t(title)) + '</div><div class="cvt-f">' + f + '</div><div class="cv-msg"></div>' +
      '<div class="cv-row"><button class="cv-btn pri" data-a="save">' + esc(t('save')) + '</button><button class="cv-btn" data-a="close">' + esc(t('cancel')) + '</button></div></div>';
    el.querySelectorAll('[data-pick]').forEach(function (b) { b.onclick = function () { pick = b.getAttribute('data-pick'); el.querySelectorAll('[data-pick]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); var ti = el.querySelector('#fTitle'); if (kind === 'doc' && ti && !ti.value) ti.value = t('dt_' + pick); }; });
    var shot = el.querySelector('[data-shot]'), fi = el.querySelector('[data-file]');
    if (shot) { shot.onclick = function () { fi.click(); }; fi.onchange = function () { file = fi.files && fi.files[0]; if (!file) return; if (/^image\//.test(file.type)) { shot.classList.add('has'); shot.style.backgroundImage = 'url(' + URL.createObjectURL(file) + ')'; } else shot.textContent = file.name; }; }
    if (kind === 'doc') { var ti0 = el.querySelector('#fTitle'); if (ti0) ti0.value = t('dt_' + pick); }
    el.querySelector('[data-a=close]').onclick = function () { close(el); };
    function v(id) { var x = el.querySelector('#' + id); return x ? String(x.value || '').trim() : ''; }
    el.querySelector('[data-a=save]').onclick = async function () {
      var msg = el.querySelector('.cv-msg'), body = { kind: kind, meta: {} };
      if (_data.s.home) body.home = _data.s.home;
      if (kind === 'shift') {
        if (!v('fWho')) { msg.textContent = t('needName'); return; }
        var st0 = new Date(v('fDate') + 'T' + v('fStart')).getTime(), en = new Date(v('fDate') + 'T' + v('fEnd')).getTime(); if (en <= st0) en += 864e5;
        if (!isFinite(st0)) { msg.textContent = t('needWhen'); return; }
        body.title = v('fWho'); body.at = st0; body.meta = { who: v('fWho'), end: en };
      } else {
        if (!v('fTitle')) { msg.textContent = t('needName'); return; }
        body.title = v('fTitle'); body.meta = { type: pick };
        if (kind === 'comfort' && v('fUrl')) { if (!/^https:\/\//.test(v('fUrl'))) { msg.textContent = t('needHttps'); return; } body.meta.url = v('fUrl'); }
        if (kind === 'doc') { if (v('fKept')) body.meta.kept = v('fKept'); if (v('fOn')) body.meta.on = v('fOn'); }
      }
      var sb = el.querySelector('[data-a=save]'); sb.disabled = true; sb.textContent = t('saving');
      try {
        if (file) {
          var fd = new FormData(); fd.append('file', file, file.name || ('care-' + Date.now())); fd.append('blob_type', kind === 'doc' ? 'document' : 'photo');
          var up = await api('/storage/upload', { method: 'POST', body: fd });
          if (!up.ok) throw new Error(up.status);
          if (kind === 'doc') { body.meta.file = up.data.id; body.meta.file_kind = /pdf/.test(file.type) ? 'pdf' : 'image'; } else body.photo = up.data.id;
        }
        var r = await api('/care/items', { method: 'POST', body: body });
        if (!r.ok) throw new Error(r.status);
        close(el); load();
      } catch (e) { msg.textContent = t('failed'); sb.disabled = false; sb.textContent = t('save'); }
    };
    open(el);
  }
  /* On HOME's phone: when a medicine is due, the family voice recorded for it plays once */
  var _played = {};
  function playDueVoices() {
    if (role() !== 'home' || !_ls) return;
    var day = new Date().toDateString();
    _ls.med.forEach(function (x) {
      var m = x.it.meta || {}; if (!m.voice_url || x.n.state !== 'due') return;
      var k = 'cvv:' + x.it.id + ':' + x.n.slot + ':' + day; if (_played[k]) return;
      try { if (localStorage.getItem(k)) { _played[k] = 1; return; } } catch (e) {}
      _played[k] = 1;
      try { new Audio(photoUrl(m.voice_url)).play().then(function () { try { localStorage.setItem(k, '1'); } catch (e) {} }).catch(function () { _played[k] = 0; }); } catch (e) {}
    });
  }

  /* ── Photos waiting: bottles from the pharmacy (or any label), shared from the phone's gallery
     or added here. Any phone that sees HOME's medicines reads them and files each one: a refill
     of a medicine already in Covara is marked Filled with the new count; a new one waits for a tap. ── */
  function todayIso() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function norm(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function matchMed(f) {
    var meds = (_data.items || []).filter(function (i) { return i.kind === 'med' || i.kind === 'check'; });
    var rx = String(f.rx_number || '').replace(/\D/g, '');
    if (rx.length >= 5) { var byRx = meds.filter(function (i) { return String((i.meta || {}).rx_number || '').replace(/\D/g, '') === rx; })[0]; if (byRx) return byRx; }
    var w = norm(f.title).split(' ')[0]; if (!w || w.length < 4) return null;
    return meds.filter(function (i) { return norm(i.title).split(' ')[0] === w; })[0] || null;
  }
  async function sendToInbox(blob, name, source) {
    var fd = new FormData(); fd.append('file', blob, name || ('bottle-' + Date.now() + '.jpg')); fd.append('blob_type', 'photo');
    var up = await api('/storage/upload', { method: 'POST', body: fd });
    if (!up.ok || !up.data.id) return false;
    var r = await api('/care/inbox', { method: 'POST', body: Object.assign({ photo: up.data.id, source: source || 'app' }, _data && _data.s.home ? { home: _data.s.home } : {}) });
    return r.ok;
  }
  /* Photos shared into Covara from the phone's share sheet wait in this phone until Covara sends them */
  var _importing = false;
  async function importShared() {
    if (_importing || !/[?&]shared=/.test(location.search) || !_data || !_data.s.edit) return;
    _importing = true;
    try {
      var cache = await caches.open('covara-share'), keys = await cache.keys(), n = 0;
      for (var i = 0; i < keys.length; i++) {
        var res = await cache.match(keys[i]); if (!res) continue;
        var b = await res.blob(), nm = decodeURIComponent(res.headers.get('x-name') || 'photo.jpg');
        if (await sendToInbox(b, nm, 'share')) { await cache.delete(keys[i]); n++; }
      }
      try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) {}
      if (n) { _open = 'med'; _openItem = 'inbox'; _html = ''; await load(); }
    } catch (e) {} finally { _importing = false; }
  }
  function addPhotos() {
    var inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = true;
    inp.onchange = async function () {
      var fs = [].slice.call(inp.files || []).slice(0, 30); if (!fs.length) return;
      _data.inboxNote = t('inSending', { n: fs.length }); _html = ''; render();
      for (var i = 0; i < fs.length; i++) await sendToInbox(fs[i], fs[i].name, 'app');
      _data.inboxNote = ''; _openItem = 'inbox'; load();
    };
    inp.click();
  }
  /* Reads the photos waiting, one at a time, on this phone */
  var _reading = false;
  async function processInbox() {
    if (_reading || !_data || !_data.s.edit || !window.CovaraLabel) return;
    var next = (_data.inbox || []).filter(function (x) { return x.status === 'new'; })[0];
    if (!next) return;
    _reading = true; _data.inboxReading = next.id; _html = ''; render();
    try {
      var blob = await (await fetch(photoUrl(next.photo))).blob();
      var file = new File([blob], 'label.jpg', { type: blob.type || 'image/jpeg' });
      var r = null; try { r = await window.CovaraLabel.read(file); } catch (e) { r = null; }
      var f = (r && r.fields) || {}, m = Object.keys(f).length ? matchMed(f) : null, upd = null;
      if (m) {
        var meta = Object.assign({}, m.meta || {}); delete meta.voice_url; delete meta.file_url;
        meta.refilled_on = todayIso();
        if (f.dispensed) meta.dispensed = f.dispensed;
        if (f.refills != null && f.refills !== '') meta.refills = Number(f.refills); else if (typeof meta.refills === 'number' && meta.refills > 0) meta.refills -= 1;
        ['rx_number', 'source_name', 'source_phone', 'prescriber', 'instructions', 'strength', 'unit', 'form', 'qty'].forEach(function (k) { if ((meta[k] == null || meta[k] === '') && f[k] != null && f[k] !== '') meta[k] = f[k]; });
        if (!meta.source && f.source) meta.source = f.source;
        var body = Object.assign({ meta: meta }, m.photo ? {} : { photo: next.blob }, _data.s.home ? { home: _data.s.home } : {});
        var pr = await api('/care/items/' + encodeURIComponent(m.id), { method: 'PUT', body: body });
        upd = pr.ok ? { status: 'done', item_id: m.id, result: { action: 'refill', title: m.title, dispensed: meta.dispensed || null } } : { status: 'review', result: { fields: f } };
      } else upd = { status: 'review', result: { fields: f } };
      await api('/care/inbox/' + encodeURIComponent(next.id), { method: 'PUT', body: upd });
    } catch (e) {
      try { await api('/care/inbox/' + encodeURIComponent(next.id), { method: 'PUT', body: { status: 'review', result: { fields: {} } } }); } catch (e2) {}
    } finally { _reading = false; _data.inboxReading = ''; }
    load();
  }
  function inboxBlock() {
    var all = (_data.inbox || []).filter(function (x) { return x.status === 'new' || x.status === 'review' || (x.status === 'done' && Date.now() - (x.done_at || x.at) < 36e5 * 24); });
    var waiting = all.filter(function (x) { return x.status !== 'done'; }).length;
    var rows = all.map(function (x) {
      var res = x.result || {}, f = res.fields || {}, line = '', acts = '', cls = '';
      if (x.status === 'new') { line = _data.inboxReading === x.id ? t('inReading') : t('inQueued'); cls = 'mid'; }
      else if (x.status === 'done') { line = res.action === 'refill' ? t('inFilled', { name: res.title || '' }) + (res.dispensed ? ' · ' + res.dispensed + ' ' + t('dispensedN') : '') : t('inAdded', { name: res.title || '' }); cls = 'good'; }
      else if (f.title) { line = t('inNew', { name: f.title }); cls = 'mid'; acts = '<button type="button" class="cvx-btn pri" data-in-add="' + esc(x.id) + '">' + esc(t('inAddIt')) + '</button><button type="button" class="cvx-lnk" data-in-skip="' + esc(x.id) + '">' + esc(t('inNotMed')) + '</button>'; }
      else { line = t('inUnread'); cls = 'bad'; acts = '<button type="button" class="cvx-btn" data-in-add="' + esc(x.id) + '">' + esc(t('inByHand')) + '</button><button type="button" class="cvx-lnk" data-in-skip="' + esc(x.id) + '">' + esc(t('remove')) + '</button>'; }
      return '<div class="cvc"><span class="cvx-ph" style="background-image:url(&quot;' + esc(photoUrl(x.photo)) + '&quot;)"></span><span class="cvx-nm"><span class="' + cls + '">' + esc(line) + '</span><small>' + esc((x.source === 'share' ? t('inShared') : t('inAdded2')) + ' · ' + when(x.at)) + '</small></span>' + (acts ? '<div class="cvc-a">' + acts + '</div>' : '') + '</div>';
    }).join('');
    var body = '<div class="cvx-sub">' + esc(t('inWhy', { name: name1() })) + '</div>' + (_data.inboxNote ? '<div class="cvx-sub mid">' + esc(_data.inboxNote) + '</div>' : '') + rows +
      '<button type="button" class="cvx-add" data-a="inbox-add">' + esc(t('inAddPhotos')) + '</button>';
    return block('inbox', t('inTitle'), waiting ? t('inWaiting', { n: waiting }) : t('inShort'), body, waiting ? 'gold' : 'blue');
  }

  /* ── the panel the pill opens ── */
  function visible() {
    if (!_data || !role() || !_open) return false;
    if (_inCard) return true;
    var ob = document.getElementById('onboarding'); if (ob && !ob.hidden && getComputedStyle(ob).display !== 'none') return false;
    var gate = document.getElementById('gateScreen'); if (gate && gate.offsetParent !== null && getComputedStyle(gate).display !== 'none') return false;
    if (document.querySelector('.cv-ov.open')) return false;
    var f = (typeof focusedContactId !== 'undefined') ? focusedContactId : null;
    if (f != null) return false;
    if (window.CovaraWhere && window.CovaraWhere.shown()) return false;
    return true;
  }
  /* What each pill says at a glance: its colour (late, due, a warning) */
  function pillState(k) {
    if (!_ls) return '';
    if (k === 'med') { if ((_data.inbox || []).some(function (x) { return x.status === 'review'; })) return 'due'; var top = _ls.med[0]; if (top && top.n.state === 'late') return 'late'; if (_ls.med.some(function (x) { var f = filled(x.it); return f && !f.ok; })) return 'due'; return top && top.n.state === 'due' ? 'due' : ''; }
    if (k === 'visit') { var a = _ls.appt[0]; var me3 = (_data.log || []).filter(function (x) { return x.kind === 'me'; })[0]; if (me3 && me3.value === 'overwhelmed' && Date.now() - me3.at < 864e5) return 'late'; return a && a.it.at - Date.now() < 864e5 && a.n.state !== 'done' ? 'due' : ''; }
    if (k === 'health') return _data.warn ? 'late' : '';
    if (k === 'safety') { var d = (_data.sheet && _data.sheet.data) || {}; var wq = (_data.log || []).filter(function (x) { return x.kind === 'worry' && Date.now() - x.at < 864e5; }).length; var wh = window.CovaraWhere && CovaraWhere.data(); if (wq || (wh && wh.at_home === false && wh.left_at)) return 'late'; return d.diagnosis ? '' : 'due'; }
    if (k === 'papers') { var P = _data.proxy || {}; var hasPoa = itemsOf('doc').some(function (x) { return (x.meta || {}).type === 'poa_health'; }); return P.proxy && hasPoa ? '' : 'due'; }
    return '';
  }
  var _ls = null, _html = '';
  function render() {
    if (!_data) { box.classList.remove('show'); box.innerHTML = ''; _html = ''; return; }
    _ls = lists();
    var k = _open, html = '';
    if (k) {
      var body = '';
      if (k === 'med' || k === 'visit') {
        var arr = k === 'med' ? _ls.med : _ls.appt; body = arr.map(function (e) { return rowHtml(k, e); }).join('') || '<div class="cvx-empty">' + esc(t(k === 'visit' ? 'noAppts' : 'none')) + '</div>';
        if (_data.s.edit) body += '<button type="button" class="cvx-add" data-add="' + k + '">' + esc(t(SEC_ADD[k])) + '</button>';
        if (k === 'med' && _medWarn && Date.now() - _medWarn.at < 15 * 60000) body = '<div class="cvx-warn">' + esc(_medWarn.text) + '</div>' + body;
        if (k === 'visit' && _data.s.edit) body += visitsExtra();
        if (k === 'med' && _data.s.edit) body = inboxBlock() + body;
      }
      else if (k === 'health') body = _data.s.edit ? healthHtml() : '<div class="cvx-sub">' + esc(t('noCare', { name: name1() })) + '</div>';
      else if (k === 'safety') body = _data.s.edit ? safetyHtml() : '<div class="cvx-sub">' + esc(t('noCare', { name: name1() })) + '</div>';
      else body = papersHtml();
      html = '<div class="cvx-head"><b>' + esc(t('sec_' + k)) + '</b><span>' + esc(_data.s.home ? _data.s.name || '' : '') + '</span><button type="button" class="cvx-x" data-a="close" aria-label="' + esc(t('cancel')) + '">×</button></div>' +
        '<div class="cvx-list" role="list">' + body + '</div>';
    }
    if (html !== _html) { var sc = box.querySelector('.cvx-list'); var top0 = sc ? sc.scrollTop : 0; box.innerHTML = html; _html = html; bind(); var sc2 = box.querySelector('.cvx-list'); if (sc2) sc2.scrollTop = top0; }
    box.classList.toggle('show', visible());
    box.classList.toggle('is-open', !!_open);
  }
  function entry(id) { var all = _ls ? _ls.med.concat(_ls.appt, _ls.rec) : []; return all.filter(function (e) { return e.it.id === id; })[0]; }
  function toggleSection(k) { _open = _open === k ? '' : k; _openItem = ''; _html = ''; render(); }
  function bind() {
    var cl = box.querySelector('[data-a=close]'); if (cl) cl.onclick = function () { _open = ''; _openItem = ''; render(); };
    box.querySelectorAll('[data-add]').forEach(function (b) { b.onclick = function () { var k = b.getAttribute('data-add'); openEdit(k === 'visit' ? 'appt' : k); }; });
    box.querySelectorAll('[data-a=show-er]').forEach(function (b) { b.onclick = function () { openCard('er'); }; });
    box.querySelectorAll('[data-a=show-miss]').forEach(function (b) { b.onclick = function () { openCard('miss'); }; });
    box.querySelectorAll('[data-a=sheet-er]').forEach(function (b) { b.onclick = function () { openSheet('er'); }; });
    box.querySelectorAll('[data-a=sheet-miss]').forEach(function (b) { b.onclick = function () { openSheet('miss'); }; });
    box.querySelectorAll('[data-a=sheet-about]').forEach(function (b) { b.onclick = function () { openSheet('about'); }; });
    var ia = box.querySelector('[data-a=inbox-add]'); if (ia) ia.onclick = addPhotos;
    box.querySelectorAll('[data-in-skip]').forEach(function (b) { b.onclick = async function () { b.disabled = true; await api('/care/inbox/' + encodeURIComponent(b.getAttribute('data-in-skip')), { method: 'PUT', body: { status: 'dismissed' } }).catch(function () {}); load(); }; });
    box.querySelectorAll('[data-in-add]').forEach(function (b) { b.onclick = function () { var x = (_data.inbox || []).filter(function (y) { return y.id === b.getAttribute('data-in-add'); })[0]; if (x) openEdit('med', null, { fields: (x.result && x.result.fields) || {}, blob: x.blob, photo: x.photo, inboxId: x.id }); }; });
    box.querySelectorAll('[data-form]').forEach(function (b) { b.onclick = function () { openForm(b.getAttribute('data-form')); }; });
    box.querySelectorAll('[data-rm-item]').forEach(function (b) { b.onclick = async function () { b.disabled = true; var r = await api('/care/items/' + encodeURIComponent(b.getAttribute('data-rm-item')), { method: 'DELETE' }).catch(function () { return { ok: false }; }); if (r.ok) load(); else b.disabled = false; }; });
    box.querySelectorAll('[data-cphoto]').forEach(function (b) { b.onclick = function () { var it = itemsOf('comfort').filter(function (x) { return x.id === b.getAttribute('data-cphoto'); })[0]; if (it) openPhoto(it); }; });
    function logPost(body) { return api('/care/log', { method: 'POST', body: Object.assign(body, _data.s.home ? { home: _data.s.home } : {}) }).catch(function () { return { ok: false }; }); }
    var hs = box.querySelector('[data-a=ho-save]'); if (hs) hs.onclick = async function () { var n = box.querySelector('#cvHo'); if (!n || !n.value.trim()) return; hs.disabled = true; var r = await logPost({ kind: 'handover', value: 'note', note: n.value.trim() }); if (r.ok) { _data.log = [r.data.entry].concat(_data.log || []); _html = ''; render(); } else hs.disabled = false; };
    box.querySelectorAll('[data-visit]').forEach(function (b) { b.onclick = async function () {
      b.disabled = true;
      /* the phone's own position first, so the visit can be checked against HOME's address */
      await new Promise(function (res) { if (!navigator.geolocation) return res(); navigator.geolocation.getCurrentPosition(function (p) { api('/location', { method: 'POST', body: { latitude: p.coords.latitude, longitude: p.coords.longitude, accuracy: p.coords.accuracy } }).then(res, res); }, function () { res(); }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }); });
      var r = await logPost({ kind: 'visit', value: b.getAttribute('data-visit') }); if (r.ok) { _data.log = [r.data.entry].concat(_data.log || []); _html = ''; render(); } else b.disabled = false;
    }; });
    box.querySelectorAll('[data-me]').forEach(function (b) { b.onclick = async function () { var r = await logPost({ kind: 'me', value: b.getAttribute('data-me') }); if (r.ok) { _data.log = [r.data.entry].concat(_data.log || []); _html = ''; render(); } }; });
    box.querySelectorAll('[data-worry]').forEach(function (b) { b.onclick = async function () { b.disabled = true; var n = box.querySelector('#cvWorryNote'); var r = await logPost({ kind: 'worry', value: b.getAttribute('data-worry'), note: n ? n.value.trim() : '' }); if (r.ok) { _data.log = [r.data.entry].concat(_data.log || []); _html = ''; render(); } else b.disabled = false; }; });
    box.querySelectorAll('[data-leave]').forEach(function (b) { b.onclick = async function () { var m = b.getAttribute('data-leave'); var r = await api('/care/leave', { method: 'PUT', body: Object.assign({ mode: m }, _data.s.home ? { home: _data.s.home } : {}) }).catch(function () { return { ok: false }; }); if (r.ok) { _data.leave = m; _html = ''; render(); } }; });
    box.querySelectorAll('[data-a=voice]').forEach(function (b) { b.onclick = function () { try { new Audio(b.getAttribute('data-src')).play(); } catch (e) {} }; });
    box.querySelectorAll('[data-a=px-on]').forEach(function (b) { b.onclick = function () { openProxyOn(); }; });
    box.querySelectorAll('[data-a=px-end]').forEach(function (b) { b.onclick = async function () { b.disabled = true; var r = await api('/care/proxy/end', { method: 'POST', body: _data.s.home ? { home: _data.s.home } : {} }).catch(function () { return { ok: false }; }); if (r.ok) load(); else b.disabled = false; }; });
    box.querySelectorAll('[data-px]').forEach(function (b) { b.onclick = async function () {
      var cur = _data.proxy && _data.proxy.proxy, id = b.getAttribute('data-px'), next = cur && cur.user_id === id ? null : id;
      var r = await api('/care/proxy', { method: 'PUT', body: { user_id: next } }).catch(function () { return { ok: false }; }); if (r.ok) load();
    }; });
    box.querySelectorAll('[data-lk]').forEach(function (b) { b.onclick = async function () {
      var p = b.getAttribute('data-lk').split(':'), body = p[1] === 'approve' ? { approve: true } : { share: {} };
      if (p[1] !== 'approve') body.share[p[1]] = b.getAttribute('aria-pressed') === 'true' ? 0 : 1;
      b.disabled = true; var r = await api('/care/links/' + encodeURIComponent(p[0]), { method: 'PUT', body: body }).catch(function () { return { ok: false }; }); if (r.ok) load(); else b.disabled = false;
    }; });
    box.querySelectorAll('[data-log]').forEach(function (b) { b.onclick = async function () {
      var p = b.getAttribute('data-log').split(':'); b.disabled = true;
      var r = await api('/care/log', { method: 'POST', body: Object.assign({ kind: p[0], value: p[1] }, _data.s.home ? { home: _data.s.home } : {}) }).catch(function () { return { ok: false }; });
      if (r.ok) { _data.log = [r.data.entry].concat(_data.log || []); if (r.data.warn) _data.warn = name1() + ' ' + r.data.warn.signs.join(', ') + '. ' + t('warnTail'); _html = ''; render(); } else b.disabled = false;
    }; });
    box.querySelectorAll('.cvx-item').forEach(function (el) {
      var id = el.getAttribute('data-id'), kind = el.getAttribute('data-kind');
      el.querySelector('.cvx-row').onclick = function () { _openItem = _openItem === id ? '' : id; render(); };
      var e = entry(id); if (!e) return;
      var p = el.querySelector('[data-a=photo]'); if (p) p.onclick = function () { openPhoto(e.it); };
      var ed = el.querySelector('[data-a=edit]'); if (ed) ed.onclick = function () { openEdit(kind === 'visit' ? 'appt' : kind, e.it); };
      var rf = el.querySelector('[data-a=refill]'); if (rf) rf.onclick = function () { openRefill(e.it); };
      var cs = el.querySelector('[data-a=consent]'); if (cs) cs.onclick = function () { if (window.CovaraCare && e.it.contact) CovaraCare.openConsent(e.it.contact); };
      var mk = el.querySelector('[data-a=mark]'); if (mk) mk.onclick = async function () {
        mk.disabled = true;
        var r = await api('/care/items/' + encodeURIComponent(id) + '/mark', { method: 'POST', body: Object.assign({ slot: kind === 'visit' ? 'appt' : e.n.slot }, _data.s.home ? { home: _data.s.home } : {}) }).catch(function () { return { ok: false }; });
        if (r.ok) { if (r.data && r.data.warn && r.data.warn.double) { _medWarn = { at: Date.now(), text: t('doubleWarn', { med: e.it.title, min: Math.max(1, Math.round((Date.now() - r.data.warn.last_at) / 60000)) }) }; _html = ''; render(); var sl = box.querySelector('.cvx-list'); if (sl) sl.scrollTop = 0; } load(); } else mk.disabled = false;
      };
      el.querySelectorAll('[data-fb]').forEach(function (b) {
        b.onclick = async function () {
          var r = await api('/care/items/' + encodeURIComponent(id) + '/feedback', { method: 'POST', body: { answer: b.getAttribute('data-fb') } }).catch(function () { return { ok: false }; });
          if (r.ok) { e.it.feedback = [r.data.feedback].concat(e.it.feedback || []); _html = ''; render(); }
        };
      });
    });
  }

  /* ── the sheets: full screen for a nurse or the police; fields to fill; the proxy's confirmation ── */
  function openCard(kind) {
    var el = sheet('cvCard'), nm = _data.s.home ? ((_data.s.contact.first || '') + ' ' + (_data.s.contact.last || '')).trim() : (function () { try { return userSphereName || ''; } catch (e) { return ''; } })();
    var pic = role() === 'away' && _data.s.contact && typeof contactPhotos !== 'undefined' && contactPhotos.get(_data.s.contact.id);
    el.innerHTML = '<div class="cv-box cvx-card"><div class="cv-mono">' + esc(kind === 'er' ? t('forEr') : t('ifMissing', { name: nm })) + '</div>' +
      (kind === 'miss' && pic && pic.img && pic.img.src ? '<div class="cvt-big" style="background-image:url(\'' + esc(pic.img.src) + '\')"></div>' : '') +
      '<h2 class="cv-h">' + esc(nm) + '</h2>' + (kind === 'er' ? erHtml(true) : missingHtml(true)) +
      '<div class="cv-row"><button class="cv-btn pri" data-a="close">' + esc(t('done')) + '</button></div></div>';
    el.querySelector('[data-a=close]').onclick = function () { close(el); };
    open(el);
  }
  var SHEET_F = { er: ER_KEYS, miss: MISS_KEYS, about: ABOUT_KEYS };
  var LONG = { story: 1, talk: 1, calms: 1, upsets: 1, likes: 1, places: 1, conditions: 1, allergies: 1, marks: 1, clothes: 1 };
  function openSheet(group) {
    var el = sheet('cvSheet'), d = (_data.sheet && _data.sheet.data) || {};
    var f = SHEET_F[group].map(function (k) {
      if (k === 'dnr') return '<label>' + esc(t('sh_dnr')) + '</label><div class="cvt-chips">' + ['full', 'dnr', 'polst', 'unknown'].map(function (v) { return '<button type="button" class="cvt-chip" data-dnr="' + v + '" aria-pressed="' + (d.dnr === v) + '">' + esc(t('dnr_' + v)) + '</button>'; }).join('') + '</div>';
      return '<div><label for="cvs_' + k + '">' + esc(t('sh_' + k)) + '</label>' + (LONG[k] ? '<textarea id="cvs_' + k + '" rows="3" placeholder="' + esc(t('ph_' + k)) + '">' + esc(d[k] || '') + '</textarea>' : '<input type="text" id="cvs_' + k + '" value="' + esc(d[k] || '') + '" placeholder="' + esc(t('ph_' + k)) + '">') + '</div>';
    }).join('');
    el.innerHTML = '<div class="cv-box"><div class="cv-mono">' + esc(group === 'er' ? t('forEr') : group === 'miss' ? t('ifMissing', { name: name1() }) : t('aboutTitle', { name: name1() })) + '</div>' +
      '<div class="cvt-f">' + f + '</div><div class="cv-msg"></div><div class="cv-row"><button class="cv-btn pri" data-a="save">' + esc(t('save')) + '</button><button class="cv-btn" data-a="close">' + esc(t('cancel')) + '</button></div></div>';
    var dnr = d.dnr || null;
    el.querySelectorAll('[data-dnr]').forEach(function (b) { b.onclick = function () { dnr = b.getAttribute('data-dnr'); el.querySelectorAll('[data-dnr]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); }; });
    el.querySelector('[data-a=close]').onclick = function () { close(el); };
    el.querySelector('[data-a=save]').onclick = async function () {
      var body = _data.s.home ? { home: _data.s.home } : {};
      SHEET_F[group].forEach(function (k) { if (k === 'dnr') { if (dnr) body.dnr = dnr; return; } var i = el.querySelector('#cvs_' + k); if (i) body[k] = i.value; });
      var r = await api('/care/sheet', { method: 'PUT', body: body }).catch(function () { return { ok: false }; });
      if (r.ok) { _data.sheet = r.data; close(el); _html = ''; render(); } else el.querySelector('.cv-msg').textContent = t('failed');
    };
    open(el);
  }
  function openProxyOn() {
    var el = sheet('cvProxy'), d = new Date(), today = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    el.innerHTML = '<div class="cv-box"><div class="cv-mono">' + esc(t('pxCannot', { name: name1() })) + '</div><p class="cv-sub">' + esc(t('pxOnWhy', { name: name1() })) + '</p>' +
      '<div class="cvt-f"><div><label for="cvPxDoc">' + esc(t('pxDoctor')) + '</label><input type="text" id="cvPxDoc" maxlength="120"></div>' +
      '<div><label for="cvPxOn">' + esc(t('pxDate')) + '</label><input type="date" id="cvPxOn" value="' + today + '"></div>' +
      '<div><label for="cvPxNote">' + esc(t('pxNote')) + '</label><input type="text" id="cvPxNote" maxlength="300"></div>' +
      '<div class="cvt-chips"><button type="button" class="cvt-chip" data-ok aria-pressed="false">' + esc(t('pxConfirm', { name: name1() })) + '</button></div></div>' +
      '<div class="cv-msg"></div><div class="cv-row"><button class="cv-btn pri" data-a="save">' + esc(t('pxTake')) + '</button><button class="cv-btn" data-a="close">' + esc(t('cancel')) + '</button></div></div>';
    var ok = false, okb = el.querySelector('[data-ok]'); okb.onclick = function () { ok = !ok; okb.setAttribute('aria-pressed', ok ? 'true' : 'false'); };
    el.querySelector('[data-a=close]').onclick = function () { close(el); };
    el.querySelector('[data-a=save]').onclick = async function () {
      var msg = el.querySelector('.cv-msg'), doc = el.querySelector('#cvPxDoc').value.trim();
      if (!doc) { msg.textContent = t('pxNeedDoc'); return; } if (!ok) { msg.textContent = t('pxNeedOk'); return; }
      var r = await api('/care/proxy/activate', { method: 'POST', body: { home: _data.s.home, confirm: true, doctor: doc, on: el.querySelector('#cvPxOn').value, note: el.querySelector('#cvPxNote').value } }).catch(function () { return { ok: false }; });
      if (r.ok) { close(el); load(); } else msg.textContent = (r.data && r.data.detail) || t('failed');
    };
    open(el);
  }

  /* ── the dream picture: what is highlighted, or the medicine that is due ── */
  var _imgs = {};
  function img(url) {
    if (!url) return null;
    var o = _imgs[url];
    if (!o) { o = _imgs[url] = { img: new Image(), isVideo: false, ok: false }; o.img.onload = function () { o.ok = true; }; o.img.src = url; }
    return o.ok ? o : null;
  }
  function dreamItem() {
    if (!_data || !_ls) return null;
    if (_openItem) { var e = entry(_openItem); if (e && e.it.photo) return e.it; }
    var due = _ls.med.filter(function (x) { return (x.n.state === 'late' || x.n.state === 'due') && x.it.photo; })[0];
    return due ? due.it : null;
  }
  window.CovaraDream = function (focusId) {
    if (focusId != null) return null;
    var it = dreamItem(); if (it) return img(photoUrl(it.photo));
    /* On AWAY's phone, with nothing due, the dream picture is HOME, so COMMUNICATION | WHEREIS is always there */
    var h = homeContact(); if (h) { try { var p = contactPhotos.get(h.id); if (p && p.img) return p; } catch (e) {} }
    return null;
  };
  window.CovaraDreamWanted = function () { return !!dreamItem() || !!homeContact(); };

  /* ── the doctors and the people HOME sees are spheres joined to HOME ── */
  var _people = [], _psig = '';
  /* HOME's people are spheres joined to HOME: family, doctors, legal, care.
     Each says who they are to HOME and, above it in gold, what they can help with. */
  var GROUP_CAT = { family: 'family', doctor: 'professional', legal: 'other', care: 'friend', other: 'other' };
  function personSphere(key, o) {
    var w = String(o.name).replace(/^(dr|dott(?:ssa)?)\.?\s+/i, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').trim().split(/\s+/);
    return { id: 'cvp:' + key, first: w[0] || '', last: w[1] || '​', cvTitle: o.name, cat: GROUP_CAT[o.group] || 'professional', sev: o.soon ? 2 : 4, phone: o.phone || '', email: o.email || '',
      details: o.role ? { role: o.role } : undefined, cvItem: Object.assign({ kind: 'person' }, o), cvHeadline: o.headline || '' };
  }
  function syncSpheres() {
    var out = {}, now = Date.now();
    function key(n) { return String(n || '').replace(/^(dr|dott(?:ssa)?)\.?\s+/i, '').trim().toLowerCase(); }
    function add(name, o) { var k = key(name); if (!k) return null; var cur = out[k] || (out[k] = { name: String(name).trim(), group: 'doctor', next: Infinity }); Object.keys(o).forEach(function (x) { if (o[x] != null && o[x] !== '') cur[x] = o[x]; }); return cur; }
    if (_data) {
      _data.items.forEach(function (i) {
        var m = i.meta || {};
        if (i.kind === 'access') add(i.title, { group: m.group || (/(dr|dott)\b/i.test(i.title) ? 'doctor' : 'other'), relation: m.relation, profession: m.profession, org: m.org, phone: m.phone, email: m.email, helps: m.helps, records: m.records !== false, itemId: i.id });
        if (i.kind === 'appt' && m.with && i.at && i.at > now - 6 * 3600e3) { var o = add(m.with, {}); o.next = Math.min(o.next, i.at); }
        if ((i.kind === 'med' || i.kind === 'check') && m.prescriber) add(m.prescriber, { phone: m.prescriber_phone, prescribes: true });
      });
      /* the rest of HOME's family in Covara, on AWAY's phone */
      (_data.family || []).forEach(function (f) { if (f.you || !f.name) return; add(f.name, { group: 'family', relation: f.relation && window.CovaraCare ? CovaraCare.relLabel(f.relation) : '', profession: f.role, records: !!f.sees_care, covara: true }); });
    }
    _people = Object.keys(out).map(function (k) {
      var o = out[k];
      o.soon = isFinite(o.next) && o.next - now < 864e5;
      o.role = [o.relation, o.profession].filter(Boolean)[0] || (o.group === 'doctor' ? t('gDoctor') : '');
      o.headline = isFinite(o.next) ? dayLabel(o.next).toUpperCase() + ' ' + hhmm(o.next) : (o.helps ? o.helps.toUpperCase() : o.records && o.group !== 'family' ? t('hRecords') : '');
      return personSphere(k, o);
    });
    var sig = _people.map(function (p) { return p.id + p.cvHeadline + p.sev + p.cat + (p.details ? p.details.role : ''); }).join('|') + role();
    if (sig !== _psig) { _psig = sig; try { if (typeof buildNodes === 'function') buildNodes(false); } catch (e) {} }
  }
  function source(list) {
    if (!role()) return list;
    var h = homeContact();
    return (list || []).filter(function (c) { return !(h && c.id === h.id); }).concat(_people);
  }
  /* A double tap on one of HOME's people: who they are, what they can help with, and how to reach them. */
  function openNode(contact) {
    var n = contact && contact.cvItem; if (!n) return false;
    try { focusedContactId = contact.id; } catch (err) {}
    return true;
  }

  /* ── the left dream state window for one of HOME's people, as Sentinel shows
     its Communication summary: the group and name, what they can help with,
     then who they are. Video, Phone, Message and Email sit around the sphere. ── */
  var ACC = { family: '#38bdf8', doctor: '#f59e0b', legal: '#c878dc', care: '#14b8a6', other: '#c878dc' };
  var pbox = document.createElement('div'); pbox.className = 'dream-brief cv-pbrief'; pbox.hidden = true; pbox.setAttribute('aria-live', 'polite'); pbox.style.position = 'fixed'; pbox.style.zIndex = '6500';
  document.body.appendChild(pbox);
  var _pFor = '';
  function personFor(id) { return _people.filter(function (p) { return p.id === id; })[0]; }
  function personHtml(n) {
    var g = t('g' + (n.group || 'other').charAt(0).toUpperCase() + (n.group || 'other').slice(1));
    var rows = [];
    function kv(k, v) { if (v) rows.push('<div class="db-t">' + esc(t(k)) + '</div><div class="db-issue">' + esc(v) + '</div>'); }
    kv('dRel', n.relation); kv('dProf', n.profession); kv('dOrg', n.org);
    if (n.records != null && n.group !== 'family') kv('dRecords', n.records ? t('yes') : t('no'));
    if (n.prescribes) kv('dPrescribes', (_ls ? _ls.med : []).filter(function (x) { return ((x.it.meta || {}).prescriber || '').trim().toLowerCase().replace(/^(dr|dott(?:ssa)?)\.?\s+/i, '') === n.name.trim().toLowerCase().replace(/^(dr|dott(?:ssa)?)\.?\s+/i, ''); }).map(function (x) { return x.it.title; }).join(', '));
    if (isFinite(n.next)) kv('dNextVisit', when(n.next));
    kv('dPhone', n.phone); kv('dEmail', n.email);
    return '<div class="db-top"><span class="db-label">' + esc(g) + '</span><span class="db-name">' + esc(n.name) + '</span></div>' +
      (n.helps ? '<div class="db-head">' + esc(n.helps) + '</div>' : '') + rows.join('');
  }
  function personFrame() {
    var f = (typeof focusedContactId !== 'undefined') ? focusedContactId : null;
    var p = f && /^cvp:/.test(String(f)) ? personFor(f) : null;
    var r = window._dreamRect;
    if (!p || !r || typeof appState === 'undefined' || appState !== 'network' || (window.CovaraWhere && window.CovaraWhere.shown()) || document.querySelector('.cv-ov.open') || document.body.classList.contains('rs-overlay-open')) { if (!pbox.hidden) pbox.hidden = true; _pFor = ''; return; }
    if (_pFor !== p.id + p.cvHeadline) { _pFor = p.id + p.cvHeadline; pbox.innerHTML = personHtml(p.cvItem); pbox.style.setProperty('--db-acc', ACC[p.cvItem.group] || '#38bdf8'); }
    var vw = window.innerWidth, phone = vw <= 480, cv = document.getElementById('sphere'), off = cv ? cv.getBoundingClientRect() : { left: 0, top: 0 };
    var left, width, top;
    if (phone) { left = 12; width = Math.min(Math.round(vw * 0.62), 260); top = Math.round(Math.max(84, off.top + r.cy - r.r + 30)); }
    else { left = Math.max(16, Math.round(vw * 0.03)); width = Math.round(Math.min(380, Math.max(240, r.cx - r.r - left - 24))); top = Math.round(Math.max(70, off.top + r.cy - r.r * 0.62)); }
    /* keep clear of Video, Phone, Message, Email around the focused sphere */
    var q = window._qaRect;
    if (q && Date.now() - q.t < 500) {
      var qx0 = off.left + q.x0, qx1 = off.left + q.x1, qy0 = off.top + q.y0, qy1 = off.top + q.y1, h = pbox.offsetHeight || 220;
      var hits = function () { return left < qx1 + 8 && left + width > qx0 - 8 && top < qy1 + 8 && top + h > qy0 - 8; };
      if (hits()) {
        if (qx0 - 10 - left >= 170) width = Math.round(qx0 - 10 - left);
        else {
          var below = Math.round(Math.max(qy1, off.top + q.sy + q.r) + 12), above = Math.round(Math.min(qy0, off.top + q.sy - q.r) - 12 - h);
          top = below + h <= window.innerHeight - 90 ? below : Math.max(70, above);
        }
      }
    }
    pbox.style.left = left + 'px'; pbox.style.top = top + 'px'; pbox.style.width = width + 'px';
    if (pbox.hidden) pbox.hidden = false;
  }
  (function loop() { try { personFrame(); } catch (e) {} requestAnimationFrame(loop); })();

  /* ── HOME at the centre of AWAY's phone, with Video, Phone, Message, Email ── */
  function centre() {
    var h = homeContact(); if (!h) return null;
    var p = (typeof contactPhotos !== 'undefined') && contactPhotos.get(h.id);
    return { name: ((h.first || '') + ' ' + (h.last || '')).trim(), frame: p && p.img ? p.img : null, w: p ? (p.w || (p.img && p.img.naturalWidth)) : 0, h: p ? (p.h || (p.img && p.img.naturalHeight)) : 0, contact: h };
  }
  var _pillHits = [];
  /* the canvas width in screen points; the canvas is drawn at no more than 2x even on 3x phones, so the device pixel ratio can't be used to get it */
  function cssW(ctx) { var c = ctx.canvas; return c.clientWidth || c.width / (typeof DPR !== 'undefined' ? DPR : (window.devicePixelRatio || 1)); }
  var DOT = { late: '#ef4444', due: '#ffd24d' };
  function pills(ctx, labels, keys, cx, cy, cr, t0, left, states, onKey) {
    var W = cssW(ctx);
    var fs = (W < 500 ? 11 : 12) + (window.CovaraCalm ? 3 : 0), lineH = (W < 500 ? 24 : 26) + (window.CovaraCalm ? 8 : 0), gap = 16, px = 12, py = 5;
    ctx.save();
    ctx.font = '500 ' + fs + 'px -apple-system, system-ui, "Segoe UI", sans-serif';
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    if (W < 500) gap = 8;
    /* keep clear of the sphere and its ring: on a narrow phone the pills get smaller until they fit beside it */
    var room = left ? (cx - cr * 1.18 - gap - 6) : (W - 6 - (cx + cr * 1.18 + gap)), maxW = 0, pw = 0, dotW = states ? 14 : 0;
    for (var tries = 0; tries < 6; tries++) {
      ctx.font = '500 ' + fs + 'px -apple-system, system-ui, "Segoe UI", sans-serif';
      maxW = 0; labels.forEach(function (l) { maxW = Math.max(maxW, ctx.measureText(l).width); });
      pw = maxW + px * 2 + dotW;
      if (pw <= room || fs <= 9) break;
      fs -= 1; px = Math.max(6, px - 2); dotW = states ? 12 : 0;
    }
    var phh = fs + py * 2;
    var x = left ? cx - cr * 1.18 - gap - pw : cx + cr * 1.18 + gap; if (x + pw > W - 4) x = W - 4 - pw; if (x < 4) x = 4;
    var y0 = cy - (labels.length * lineH) / 2 + lineH / 2;
    var fade = Math.min(1, 0.75 + 0.25 * Math.sin(t0 * 0.004));
    for (var i = 0; i < labels.length; i++) {
      var ly = y0 + i * lineH;
      var on = onKey && keys[i] === onKey;
      ctx.globalAlpha = (on ? 0.95 : 0.9) * fade; ctx.fillStyle = on ? 'rgba(56,189,248,0.32)' : 'rgba(40,90,190,0.26)'; ctx.shadowColor = 'rgba(80,160,255,0.45)'; ctx.shadowBlur = 10;
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, ly - phh / 2, pw, phh, 6); else ctx.rect(x, ly - phh / 2, pw, phh); ctx.fill();
      ctx.shadowBlur = 0; ctx.globalAlpha = (on ? 0.9 : 0.75) * fade; ctx.strokeStyle = on ? '#38bdf8' : 'rgba(150,200,255,0.5)'; ctx.lineWidth = 1; ctx.stroke();
      var tx = x + pw / 2;
      if (states) {
        tx = x + dotW / 2 + (pw - dotW / 2) / 2;
        var st0 = states[i]; ctx.globalAlpha = fade; ctx.beginPath(); ctx.arc(x + dotW * 0.7, ly, 3, 0, Math.PI * 2); ctx.fillStyle = DOT[st0] || 'rgba(96,165,250,.6)'; ctx.fill();
      }
      ctx.globalAlpha = 0.95 * fade; ctx.fillStyle = on ? '#ffffff' : '#d8e8ff'; ctx.fillText(labels[i], tx, ly);
      _pillHits.push({ x: x, y: ly - lineH / 2, w: pw, h: lineH, key: keys[i] });
    }
    ctx.restore();
  }
  function drawCentre(ctx, cx, cy, cr, t0) {
    _pillHits = [];
    if (!role() || (role() === 'away' && !homeContact())) return;
    if (typeof focusedContactId !== 'undefined' && focusedContactId != null) return; /* one sphere at a time carries the pills */
    if (typeof IsoView !== 'undefined' && IsoView.active && IsoView.active()) return;
    /* all on the right of HOME's sphere: HOME's care on top, calling HOME (AWAY's phone) beneath it,
       so the lower left stays clear for the day's schedule */
    var W0 = cssW(ctx), lh = (W0 < 500 ? 24 : 26) + (window.CovaraCalm ? 8 : 0);
    var comm = role() === 'away', nCare = 0, nComm = comm ? 4 : 0, gapG = nCare && nComm ? lh * 0.7 : 0;
    var total = (nCare + nComm) * lh + gapG, top = cy - total / 2;
    /* Medicines, Visits, Health, Safety and Papers now live in the pulls of the card a double tap opens */
    if (comm) pills(ctx, [t('video'), t('phone'), t('message'), t('email')], ['video', 'phone', 'sms', 'email'], cx, top + nCare * lh + gapG + nComm * lh / 2, cr, t0);
  }
  function hitCentre(clientX, clientY) {
    if (!_pillHits.length || typeof CV === 'undefined') return false;
    var r = CV.getBoundingClientRect(), x = clientX - r.left, y = clientY - r.top;
    var h = _pillHits.filter(function (p) { return x >= p.x - 4 && x <= p.x + p.w + 4 && y >= p.y && y <= p.y + p.h; })[0];
    if (!h) return false;
    if (/^sec:/.test(h.key)) { toggleSection(h.key.slice(4)); return true; }
    var c = centre(); if (c && typeof runContactQuickAction === 'function') runContactQuickAction(h.key, c.contact);
    return true;
  }
  function centreSingle() { return role() === 'away' && !!homeContact(); }
  function sectionOpen() { return _open; }
  function centreDouble() { var h = homeContact(); if (role() !== 'away' || !h) return false; try { enterDetail(h); } catch (e) {} return true; }

  /* ── sheets ── */
  function sheet(id) {
    var el = document.getElementById(id);
    if (!el) { el = document.createElement('div'); el.id = id; el.className = 'cv-ov'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); document.body.appendChild(el); }
    return el;
  }
  function open(el) { requestAnimationFrame(function () { el.classList.add('open'); }); }
  function close(el) { if (el) el.classList.remove('open'); }
  function openPhoto(it) {
    var el = sheet('cvPhoto');
    el.innerHTML = '<div class="cv-box"><div class="cvt-big" style="' + esc(ph(it)) + '"></div><h2 class="cv-h">' + esc(it.title) + '</h2>' +
      '<div class="cv-row"><button class="cv-btn pri" data-a="close">' + esc(t('cancel')) + '</button></div></div>';
    el.querySelector('[data-a=close]').onclick = function () { close(el); };
    el.onclick = function (e) { if (e.target === el) close(el); };
    open(el);
  }
  function openRefill(it) {
    var el = sheet('cvRefill'), m = it.meta || {}, sp = supply(it);
    var call = m.source_phone ? '<a class="cv-btn" style="display:inline-flex;align-items:center;text-decoration:none" href="tel:' + esc(String(m.source_phone).replace(/[^\d+]/g, '')) + '">' + esc(t('callTo', { name: m.source_name || t(m.source || 'pharmacy') })) + '</a>' : '';
    el.innerHTML = '<div class="cv-box"><div class="cv-mono">' + esc(t('refillTitle')) + '</div><div class="cvt-big" style="' + esc(ph(it)) + ';width:min(180px,50vw)"></div>' +
      '<h2 class="cv-h">' + esc(it.title) + '</h2><p class="cv-sub">' + esc([sp ? sp.left + ' ' + t('left') : '', m.refills != null ? m.refills + ' ' + t('refills') : ''].filter(Boolean).join(' · ')) + '</p>' +
      (m.refills === 0 ? '<p class="cv-sub" style="color:#ffd24d">' + esc(t('noRefills')) + '</p>' : '') +
      '<div class="cv-row">' + call + '</div>' +
      '<div class="cvt-f"><div><label for="cvNewQty">' + esc(t('howMany')) + '</label><input type="number" id="cvNewQty" inputmode="numeric" min="1" value="' + esc(m.dispensed || '') + '"></div></div>' +
      '<div class="cv-msg"></div><div class="cv-row"><button class="cv-btn pri" data-a="ok">' + esc(t('pickedUp')) + '</button><button class="cv-btn" data-a="close">' + esc(t('cancel')) + '</button></div></div>';
    el.querySelector('[data-a=close]').onclick = function () { close(el); };
    el.querySelector('[data-a=ok]').onclick = async function () {
      var d = new Date(), today = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      var nm = Object.assign({}, m, { refilled_on: today });
      var q2 = Number(el.querySelector('#cvNewQty').value); if (q2 > 0) nm.dispensed = q2;
      if (typeof nm.refills === 'number' && nm.refills > 0) nm.refills -= 1;
      var r = await api('/care/items/' + encodeURIComponent(it.id), { method: 'PUT', body: { meta: nm } }).catch(function () { return { ok: false }; });
      if (r.ok) { close(el); load(); } else el.querySelector('.cv-msg').textContent = t('failed');
    };
    open(el);
  }
  /* the people who can be tagged: everyone in HOME's circle with an account, HOME included, not me */
  function tagPeople() {
    var me = ''; try { me = SyncEngine.getUserId() || ''; } catch (e) {}
    var out = [], seen = {};
    function add(id, name) { if (!id || id === me || seen[id] || !name) return; seen[id] = 1; out.push({ id: id, name: String(name).trim().split(/\s+/)[0] }); }
    (typeof DEMO_CONTACTS !== 'undefined' ? DEMO_CONTACTS : []).forEach(function (c) { if (c.care && c.care.state === 'active' && c.care.userId) add(c.care.userId, c.cvTitle || c.first); });
    ((_data && _data.family) || []).forEach(function (f) { add(f.id, f.name); });
    return out;
  }
  function tagChips(on) {
    var ppl = tagPeople(); if (!ppl.length) return '';
    return '<label>' + esc(t('tagWho')) + '</label><div class="cvt-chips cvt-tags">' + ppl.map(function (p) { return '<button type="button" class="cvt-chip" data-tag="' + esc(p.id) + '" aria-pressed="' + (on.indexOf(p.id) >= 0) + '">' + esc(p.name) + '</button>'; }).join('') + '</div>';
  }
  function openEdit(kind, it, preset) {
    var el = sheet('cvAdd'); var photo = null; var m = (it && it.meta) || {};
    var times = {}; ((it && it.times) || []).forEach(function (x) { times[x] = true; });
    var other = ((it && it.times) || []).filter(function (x) { return !SLOTS.some(function (s) { return s[1] === x; }); })[0] || '';
    var src = m.source || '';
    var dflt = new Date(Date.now() + 864e5);
    var dv = it && it.at ? new Date(it.at) : dflt;
    var ds = dv.getFullYear() + '-' + String(dv.getMonth() + 1).padStart(2, '0') + '-' + String(dv.getDate()).padStart(2, '0');
    var tv = it && it.at ? String(dv.getHours()).padStart(2, '0') + ':' + String(dv.getMinutes()).padStart(2, '0') : '10:00';
    function inp(id, label, val, type, extra) { return '<div><label for="' + id + '">' + esc(t(label)) + '</label><input type="' + (type || 'text') + '" id="' + id + '" value="' + esc(val || '') + '" autocomplete="off" ' + (extra || '') + '></div>'; }
    var shot = '<button type="button" class="cvt-shot' + (it && it.photo ? ' has' : '') + '" data-shot style="' + (it && it.photo ? esc('background-image:url("' + photoUrl(it.photo).replace(/["\\]/g, '') + '")') : '') + '">' + esc(t('photo')) + '</button><input type="file" accept="image/*" capture="environment" hidden data-file>';
    var f = '';
    if (kind === 'med') {
      f = shot + inp('cvName', 'name', it && it.title, 'text', 'maxlength="120"') +
        '<div class="cvt-two">' + inp('cvStrength', 'strength', m.strength, 'number', 'inputmode="decimal" min="0" step="any"') +
        '<div><label for="cvUnit">' + esc(t('unit')) + '</label><select id="cvUnit">' + UNITS.map(function (u) { return '<option' + ((m.unit || 'mg') === u ? ' selected' : '') + '>' + u + '</option>'; }).join('') + '</select></div></div>' +
        '<div class="cvt-two">' + inp('cvQty', 'qty', m.qty || 1, 'number', 'inputmode="decimal" min="0" step="any"') +
        '<div><label for="cvForm">' + esc(t('form')) + '</label><select id="cvForm">' + FORMS.map(function (x) { return '<option value="' + x + '"' + ((m.form || 'tablet') === x ? ' selected' : '') + '>' + esc(L().forms[x]) + '</option>'; }).join('') + '</select></div></div>' +
        '<label>' + esc(t('when')) + '</label><div class="cvt-chips">' + SLOTS.map(function (s) { return '<button type="button" class="cvt-chip" data-t="' + s[1] + '" aria-pressed="' + !!times[s[1]] + '">' + esc(t(s[0])) + '<small>' + s[1] + '</small></button>'; }).join('') +
        '<button type="button" class="cvt-chip" data-prn aria-pressed="' + !!m.as_needed + '">' + esc(t('asNeeded')) + '</button></div>' +
        inp('cvOther', 'other', other, 'time') +
        '<div class="cvt-two">' + inp('cvPrescriber', 'prescriber', m.prescriber, 'text', 'maxlength="80"') + inp('cvPrescribedOn', 'prescribedOn', m.prescribed_on, 'date') + '</div>' +
        '<label>' + esc(t('source')) + '</label><div class="cvt-chips">' + ['pharmacy', 'doctor'].map(function (x) { return '<button type="button" class="cvt-chip" data-src="' + x + '" aria-pressed="' + (src === x) + '">' + esc(t(x)) + '</button>'; }).join('') + '</div>' +
        '<div class="cvt-two">' + inp('cvSourceName', 'sourceName', m.source_name, 'text', 'maxlength="120"') + inp('cvSourcePhone', 'sourcePhone', m.source_phone, 'tel', 'maxlength="30"') + '</div>' +
        inp('cvPurpose', 'purpose', m.purpose, 'text', 'maxlength="120"') +
        inp('cvInstr', 'instr', m.instructions, 'text', 'maxlength="200"') +
        inp('cvLooks', 'looks', m.looks_like, 'text', 'maxlength="120"') +
        inp('cvWatch', 'watch', m.watch_for, 'text', 'maxlength="200"') +
        '<div class="cvt-two">' + inp('cvRx', 'rx', m.rx_number, 'text', 'maxlength="40"') + inp('cvPrescriberPhone', 'prescriberPhone', m.prescriber_phone, 'tel', 'maxlength="30"') + '</div>' +
        '<div class="cvt-two">' + inp('cvStart', 'startOn', m.start_on, 'date') + inp('cvEnd', 'endOn', m.end_on, 'date') + '</div>' +
        '<div class="cvt-two">' + inp('cvDispensed', 'dispensed', m.dispensed, 'number', 'inputmode="numeric" min="0"') + inp('cvRefills', 'refillsLeft', m.refills, 'number', 'inputmode="numeric" min="0" max="99"') + '</div>' +
        '<label>' + esc(t('voiceLabel')) + '</label><div class="cvt-chips"><button type="button" class="cvt-chip" data-rec aria-pressed="false">' + esc(m.voice ? t('voiceAgain') : t('voiceRec')) + '</button></div><audio controls hidden data-recplay></audio>';
    } else if (kind === 'rec') {
      f = '<label>' + esc(t('dGroup')) + '</label><div class="cvt-chips">' + ['family', 'doctor', 'legal', 'care', 'other'].map(function (g) { return '<button type="button" class="cvt-chip" data-grp="' + g + '" aria-pressed="' + ((m.group || 'doctor') === g) + '">' + esc(t('g' + g.charAt(0).toUpperCase() + g.slice(1))) + '</button>'; }).join('') + '</div>' +
        inp('cvName', 'recName', it && it.title, 'text', 'maxlength="120"') + inp('cvRel', 'recRel', m.relation, 'text', 'maxlength="60"') +
        inp('cvHelps', 'recHelps', m.helps, 'text', 'maxlength="160"') +
        '<div class="cvt-chips"><button type="button" class="cvt-chip" data-recs aria-pressed="' + (m.records !== false) + '">' + esc(t('recAccess')) + '</button></div>' +
        inp('cvProf', 'recProf', m.profession, 'text', 'maxlength="80"') + inp('cvOrg', 'recOrg', m.org, 'text', 'maxlength="120"') +
        '<div class="cvt-two">' + inp('cvPhone', 'recPhone', m.phone, 'tel', 'maxlength="30"') + inp('cvEmail', 'recEmail', m.email, 'email', 'maxlength="120"') + '</div>' +
        inp('cvSince', 'recSince', m.since, 'date');
    } else if (kind === 'appt') {
      f = shot + inp('cvName', 'apptTitle', it && it.title, 'text', 'maxlength="120"') + inp('cvWith', 'apptWith', m.with, 'text', 'maxlength="80"') +
        '<div class="cvt-two">' + inp('cvDate', 'date', ds, 'date') + inp('cvTime', 'time', tv, 'time') + '</div>' +
        inp('cvPlace', 'place', m.place || (it && it.detail), 'text', 'maxlength="160"') + inp('cvNotes', 'notes', m.notes, 'text', 'maxlength="300"') + tagChips(m.tags || []);
    } else {
      f = shot + inp('cvName', 'subTitle', it && it.title, 'text', 'maxlength="120"') + inp('cvProvider', 'provider', m.provider || (it && it.detail), 'text', 'maxlength="120"') +
        '<div class="cvt-two">' + inp('cvDate', 'renews', ds, 'date') + inp('cvEvery', 'every', m.every, 'text', 'maxlength="30"') + '</div>' +
        inp('cvCost', 'cost', m.cost, 'text', 'maxlength="30"');
    }
    var title = kind === 'med' ? 'addMed' : kind === 'appt' ? 'addAppt' : kind === 'rec' ? 'addRec' : 'addSub';
    el.innerHTML = '<div class="cv-box"><div class="cv-mono">' + esc(it ? t('change') : t(title)) + '</div>' +
      '<div class="cvt-f">' + f + '</div><div class="cv-msg"></div>' +
      '<div class="cv-row"><button class="cv-btn pri" data-a="save">' + esc(t('save')) + '</button><button class="cv-btn" data-a="close">' + esc(t('cancel')) + '</button></div>' +
      (it ? '<div class="cv-row"><button class="cv-btn warn" data-a="rm">' + esc(t('remove')) + '</button></div>' : '') + '</div>';
    el.querySelectorAll('[data-t]').forEach(function (b) { b.onclick = function () { var v = b.getAttribute('data-t'); times[v] = !times[v]; b.setAttribute('aria-pressed', times[v] ? 'true' : 'false'); }; });
    el.querySelectorAll('[data-tag]').forEach(function (b) { b.onclick = function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); }; });
    var prn = !!m.as_needed, grp = m.group || 'doctor', recsOn = m.records !== false;
    el.querySelectorAll('[data-grp]').forEach(function (b) { b.onclick = function () { grp = b.getAttribute('data-grp'); el.querySelectorAll('[data-grp]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); }; });
    var rb = el.querySelector('[data-recs]'); if (rb) rb.onclick = function () { recsOn = !recsOn; rb.setAttribute('aria-pressed', recsOn ? 'true' : 'false'); };
    var prnB = el.querySelector('[data-prn]'); if (prnB) prnB.onclick = function () { prn = !prn; prnB.setAttribute('aria-pressed', prn ? 'true' : 'false'); };
    el.querySelectorAll('[data-src]').forEach(function (b) { b.onclick = function () { src = src === b.getAttribute('data-src') ? '' : b.getAttribute('data-src'); el.querySelectorAll('[data-src]').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-src') === src ? 'true' : 'false'); }); }; });
    /* A family voice for when it is due: up to 20 seconds, recorded here */
    var voiceBlob = null, recB = el.querySelector('[data-rec]'), recP = el.querySelector('[data-recplay]'), rec = null;
    if (recB) recB.onclick = async function () {
      if (rec && rec.state === 'recording') { rec.stop(); return; }
      try {
        var stream = await navigator.mediaDevices.getUserMedia({ audio: true }), parts = [];
        rec = new MediaRecorder(stream); rec.ondataavailable = function (ev) { if (ev.data && ev.data.size) parts.push(ev.data); };
        rec.onstop = function () { stream.getTracks().forEach(function (x) { x.stop(); }); voiceBlob = new Blob(parts, { type: rec.mimeType || 'audio/webm' }); recP.src = URL.createObjectURL(voiceBlob); recP.hidden = false; recB.setAttribute('aria-pressed', 'false'); recB.textContent = t('voiceAgain'); };
        rec.start(); recB.setAttribute('aria-pressed', 'true'); recB.textContent = t('voiceStop'); setTimeout(function () { if (rec && rec.state === 'recording') rec.stop(); }, 20000);
      } catch (e) { el.querySelector('.cv-msg').textContent = t('voiceNoMic'); }
    };
    var shotB = el.querySelector('[data-shot]'), file = el.querySelector('[data-file]');
    if (shotB) shotB.onclick = function () { file.click(); };
    var read = {};
    if (file) file.onchange = function () {
      var x = file.files && file.files[0]; if (!x) return; photo = x; shotB.classList.add('has'); shotB.style.backgroundImage = 'url(' + URL.createObjectURL(x) + ')';
      if (kind === 'med' && window.CovaraLabel) readLabel(x);
    };
    /* The optic reader: the label's text, sorted into the empty fields, each one marked gold to check. */
    async function readLabel(x) {
      var msg = el.querySelector('.cv-msg'); msg.className = 'cv-msg info'; msg.textContent = t('reading');
      var r = null; try { r = await window.CovaraLabel.read(x); } catch (e) { r = null; }
      var f = r && r.fields || {}; read = f;
      applyFields(f);
      var got = Object.keys(f).length;
      msg.className = 'cv-msg' + (got ? ' info' : ''); msg.textContent = got ? t('readOk') : t('readNone');
    }
    function applyFields(f) {
      function put(id, val) { var i = el.querySelector('#' + id); if (!i || val == null || val === '' || String(i.value || '').trim()) return; i.value = val; i.classList.add('cvt-read'); }
      function sel(id, val) { var i = el.querySelector('#' + id); if (!i || !val) return; if ([].some.call(i.options, function (o) { return o.value === String(val); })) { i.value = String(val); i.classList.add('cvt-read'); } }
      put('cvName', f.title); put('cvStrength', f.strength); sel('cvUnit', f.unit); if (f.qty) { var q = el.querySelector('#cvQty'); if (q) { q.value = f.qty; q.classList.add('cvt-read'); } } sel('cvForm', f.form);
      put('cvPrescriber', f.prescriber); put('cvPrescribedOn', f.prescribed_on); put('cvSourceName', f.source_name); put('cvSourcePhone', f.source_phone); put('cvPurpose', f.purpose); put('cvInstr', f.instructions); put('cvRx', f.rx_number); put('cvDispensed', f.dispensed); put('cvRefills', f.refills); put('cvStart', f.prescribed_on);
      if (f.source && !src) { src = f.source; el.querySelectorAll('[data-src]').forEach(function (b) { var on = b.getAttribute('data-src') === src; b.setAttribute('aria-pressed', on ? 'true' : 'false'); if (on) b.classList.add('cvt-read'); }); }
      if (f.times && f.times.length && !Object.keys(times).some(function (k) { return times[k]; })) {
        f.times.forEach(function (hm) {
          var chip = el.querySelector('[data-t="' + hm + '"]');
          if (chip) { times[hm] = true; chip.setAttribute('aria-pressed', 'true'); chip.classList.add('cvt-read'); }
          else { var o = el.querySelector('#cvOther'); if (o && !o.value) { o.value = hm; o.classList.add('cvt-read'); } }
        });
      }
    }
    /* A photo from the photos waiting: its label already read, its picture already there */
    if (preset) {
      if (preset.photo && shotB) { shotB.classList.add('has'); shotB.style.backgroundImage = 'url("' + photoUrl(preset.photo).replace(/["\\]/g, '') + '")'; }
      if (preset.fields && Object.keys(preset.fields).length) { applyFields(preset.fields); var pm = el.querySelector('.cv-msg'); pm.className = 'cv-msg info'; pm.textContent = t('readOk'); }
    }
    el.querySelector('[data-a=close]').onclick = function () { close(el); };
    var rm = el.querySelector('[data-a=rm]'); if (rm) rm.onclick = async function () {
      var r = await api('/care/items/' + encodeURIComponent(it.id), { method: 'DELETE' }).catch(function () { return { ok: false }; });
      if (r.ok) { close(el); _openItem = ''; load(); } else el.querySelector('.cv-msg').textContent = t('failed');
    };
    function v(id) { var x = el.querySelector('#' + id); return x ? String(x.value || '').trim() : ''; }
    el.querySelector('[data-a=save]').onclick = async function () {
      var msg = el.querySelector('.cv-msg'); msg.textContent = '';
      var name = v('cvName'); if (!name) { msg.textContent = t('needName'); return; }
      var body = { kind: kind, title: name, meta: {} };
      if (_data && _data.s.home) body.home = _data.s.home;
      if (kind === 'med') {
        var ts = Object.keys(times).filter(function (k) { return times[k]; }); if (v('cvOther') && ts.indexOf(v('cvOther')) < 0) ts.push(v('cvOther'));
        if (!ts.length && !prn) { msg.textContent = t('needTime'); return; }
        body.times = ts;
        body.meta = { strength: v('cvStrength') || undefined, unit: v('cvUnit') || undefined, qty: v('cvQty') || undefined, form: v('cvForm') || undefined,
          prescriber: v('cvPrescriber') || undefined, prescribed_on: v('cvPrescribedOn') || undefined, source: src || undefined,
          source_name: v('cvSourceName') || undefined, source_phone: v('cvSourcePhone') || undefined, purpose: v('cvPurpose') || undefined,
          instructions: v('cvInstr') || undefined, looks_like: v('cvLooks') || undefined, watch_for: v('cvWatch') || undefined,
          rx_number: v('cvRx') || undefined, prescriber_phone: v('cvPrescriberPhone') || undefined, start_on: v('cvStart') || undefined, end_on: v('cvEnd') || undefined,
          dispensed: v('cvDispensed') || undefined, refills: v('cvRefills') !== '' ? Number(v('cvRefills')) : undefined,
          refilled_on: m.refilled_on || undefined, as_needed: prn || undefined, voice: m.voice || undefined, voice_by: m.voice_by || undefined };
      } else if (kind === 'rec') {
        body.kind = 'access';
        body.meta = { group: grp, records: recsOn, helps: v('cvHelps') || undefined, relation: v('cvRel') || undefined, profession: v('cvProf') || undefined, org: v('cvOrg') || undefined, phone: v('cvPhone') || undefined, email: v('cvEmail') || undefined, since: v('cvSince') || undefined };
      } else {
        var d = v('cvDate'), tm = kind === 'appt' ? v('cvTime') : '09:00';
        if (!d || !tm) { msg.textContent = t('needWhen'); return; }
        body.at = new Date(d + 'T' + tm).getTime();
        var tags = [].slice.call(el.querySelectorAll('[data-tag][aria-pressed=true]')).map(function (b) { return b.getAttribute('data-tag'); });
        body.meta = kind === 'appt' ? { with: v('cvWith') || undefined, place: v('cvPlace') || undefined, notes: v('cvNotes') || undefined, tags: tags }
          : { provider: v('cvProvider') || undefined, every: v('cvEvery') || undefined, cost: v('cvCost') || undefined };
      }
      var sb = el.querySelector('[data-a=save]'); sb.disabled = true; sb.textContent = t('saving');
      try {
        if (photo) {
          var fd = new FormData(); fd.append('file', photo, 'care-' + Date.now() + '.jpg'); fd.append('blob_type', 'photo');
          var up = await api('/storage/upload', { method: 'POST', body: fd });
          if (up.ok && up.data.id && up.data.file_size > 0) body.photo = up.data.id;
        }
        if (voiceBlob && kind === 'med') {
          var vfd = new FormData(); vfd.append('file', voiceBlob, 'voice-' + Date.now() + (/ogg/.test(voiceBlob.type) ? '.ogg' : /mp4/.test(voiceBlob.type) ? '.m4a' : '.webm')); vfd.append('blob_type', 'voice');
          var vu = await api('/storage/upload', { method: 'POST', body: vfd });
          if (vu.ok && vu.data.id) { body.meta.voice = vu.data.id; var me2 = ''; try { me2 = String(userSphereName || '').trim().split(/\s+/)[0]; } catch (e) {} body.meta.voice_by = me2 || undefined; }
        }
        if (!photo && preset && preset.blob) body.photo = preset.blob;
        var r = await api('/care/items' + (it ? '/' + encodeURIComponent(it.id) : ''), { method: it ? 'PUT' : 'POST', body: body });
        if (!r.ok) throw new Error(r.status);
        if (preset && preset.inboxId) await api('/care/inbox/' + encodeURIComponent(preset.inboxId), { method: 'PUT', body: { status: 'done', item_id: r.data.item ? r.data.item.id : null, result: { action: 'new', title: body.title } } }).catch(function () {});
        close(el); _open = kind === 'appt' ? 'visit' : kind === 'rec' ? 'papers' : kind; _openItem = r.data.item ? r.data.item.id : _openItem; load();
      } catch (e) { msg.textContent = t('failed'); sb.disabled = false; sb.textContent = t('save'); }
    };
    open(el);
  }

  /* ── keep it current ── */
  var _subj = '';
  function tick() {
    var s = subject(); var k = s ? (s.home || 'me') + ':' + s.edit : '';
    if (k !== _subj) { _subj = k; _open = ''; _openItem = ''; _data = null; if (k) load(); else { render(); syncSpheres(); } }
    if (_data) { box.classList.toggle('show', visible()); try { playDueVoices(); } catch (e) {} try { importShared(); processInbox(); } catch (e) {} }
  }
  function boot() {
    if (!window.CovaraCare || !authed()) { setTimeout(boot, 1000); return; }
    if (role() === 'home') { try { api('/care/state', { method: 'POST', body: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } }); } catch (e) {} }
    setInterval(tick, 500);
    setInterval(function () { if (_subj) load(); }, 60000);
    setInterval(stampCheck, 10000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden && _subj) load(); });
    window.addEventListener('localeChanged', function () { _html = ''; render(); syncSpheres(); });
  }
  /* ── the care pulls in the card a double tap opens on HOME's sphere ──
     Medicines, Visits, Health, Safety and Papers open inside the card, as its first pulls, with everything they
     hold (photos of each bottle, refills, the day log, the emergency card, who decides). Medicines takes the place
     of the card's own Treatment & Medications pull. */
  var _inCard = false, _cardPulls = null;
  function cardIsHome() {
    var ov = document.getElementById('blufOverlay'); if (!ov || !ov.classList.contains('open') || !_data) return false;
    var sc = (typeof selectedContact !== 'undefined') ? selectedContact : null;
    if (role() === 'home') return !sc;
    var h = homeContact(); return !!(h && sc && sc.id === h.id);
  }
  function cardPulls() {
    var anchor = document.getElementById('pull_videonote'); if (!anchor) return null;
    if (_cardPulls && _cardPulls.parentNode) return _cardPulls;
    var wrap = document.createElement('div'); wrap.id = 'cvCarePulls';
    wrap.innerHTML = SECTIONS.map(function (k) {
      return '<div class="bluf-pull cv-pull" data-cvp="' + k + '"><div class="bluf-pull-header" role="button" tabindex="0"><div class="bluf-section-label">' + esc(t('sec_' + k)) + '</div>' +
        '<span class="bluf-pull-preview" data-pv></span><span class="bluf-pull-chevron">&#9660;</span></div><div class="bluf-pull-body"><div class="bluf-pull-content" data-slot></div></div></div>';
    }).join('');
    anchor.parentNode.insertBefore(wrap, anchor);
    wrap.querySelectorAll('[data-cvp]').forEach(function (p) {
      var hd = p.querySelector('.bluf-pull-header');
      function go(e) { if (e) e.stopPropagation(); openCardPull(p.getAttribute('data-cvp')); }
      hd.addEventListener('click', go); hd.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(e); } });
    });
    /* opening one of the card's own pulls folds ours */
    anchor.parentNode.addEventListener('click', function (e) { var hd = e.target.closest && e.target.closest('.bluf-pull-header'); if (hd && !hd.closest('.cv-pull') && _inCard) foldCard(); }, true);
    _cardPulls = wrap; return wrap;
  }
  function openCardPull(k) {
    var wrap = cardPulls(); if (!wrap) return;
    if (_inCard && _open === k) { foldCard(); return; }
    document.querySelectorAll('#blufCard .bluf-pull.open').forEach(function (x) { if (!x.classList.contains('cv-pull')) x.classList.remove('open'); });
    wrap.querySelectorAll('.cv-pull').forEach(function (x) { x.classList.toggle('open', x.getAttribute('data-cvp') === k); });
    var slot = wrap.querySelector('[data-cvp="' + k + '"] [data-slot]');
    _inCard = true; box.classList.add('in-card'); slot.appendChild(box);
    _open = k; _openItem = ''; _html = ''; render();
  }
  function foldCard() {
    if (_cardPulls) _cardPulls.querySelectorAll('.cv-pull').forEach(function (x) { x.classList.remove('open'); });
    _open = ''; _openItem = ''; _html = ''; render();
  }
  function leaveCard() {
    if (!_inCard) return;
    _inCard = false; box.classList.remove('in-card'); document.body.appendChild(box);
    _open = ''; _openItem = ''; _html = ''; render();
  }
  function cardTick() {
    var med = document.getElementById('pull_medication');
    if (cardIsHome()) {
      var wrap = cardPulls(); if (!wrap) return;
      wrap.hidden = false; if (med) med.style.display = 'none';
      wrap.querySelectorAll('.cv-pull').forEach(function (p) {
        var k = p.getAttribute('data-cvp'), st = ''; try { _ls = _ls || lists(); st = pillState(k); } catch (e) {}
        var pv = p.querySelector('[data-pv]'), txt = st === 'late' ? t('pv_late') : st === 'due' ? t('pv_due') : t('pv_' + k);
        if (pv.textContent !== txt) pv.textContent = txt;
        p.classList.toggle('cvp-late', st === 'late'); p.classList.toggle('cvp-due', st === 'due');
      });
    } else {
      if (_cardPulls) _cardPulls.hidden = true;
      if (med) med.style.display = '';
      leaveCard();
    }
  }
  setInterval(cardTick, 400);

  window.CovaraView = { _hits: function () { return _pillHits; }, source: source, centre: centre, drawCentre: drawCentre, hitCentre: hitCentre, centreSingle: centreSingle, centreDouble: centreDouble,
    openNode: openNode, load: load, openEdit: openEdit, open: function (k, id) { _open = { appt: 'visit', sub: 'med', rec: 'papers' }[k] || k || ''; _openItem = id || ''; _html = ''; render(); }, section: sectionOpen, data: function () { return _data; }, fresh: function () { return { syncedAt: _syncedAt, checkedAt: _stampOkAt }; }, lists: function () { return _ls; } };
  setTimeout(boot, 1500);
})();
