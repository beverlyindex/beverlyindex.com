/*
 * DREAM CODE: Hall and Van de Castle content indicators.
 *
 * UMD module, no dependencies. Node: const HVDC = require('./hvdc.js').
 * Browser: <script src="hvdc.js"></script> then window.HVDC.
 *
 * Input: one or many coded dreams, each the "hvdc" object of SPEC 6.2
 * (an analysis object or a dream record is unwrapped automatically).
 * Indicators are pooled the published way: frequencies are summed over all
 * dreams first, then each ratio is taken once (as DreamSAT does).
 *
 * Sources and the reasoning behind every formula: norms.json and README.md
 * in this folder. Main references: Hall and Van de Castle (1966); Domhoff
 * (1996), Finding Meaning in Dreams; the norms explanation page at
 * https://dreams.ucsc.edu/Norms/main-explanation.html; DreamSAT documentation
 * (Schneider, 2001) for the comparison statistics.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else if (typeof define === 'function' && define.amd) define([], factory);
  else root.HVDC = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Indicator ids in display order. unit 'percent' values run 0 to 100 (as the
  // published norms); unit 'ratio' values are interactions per character.
  var INDICATORS = [
    { id: 'male_female_pct', group: 'characters', unit: 'percent' },
    { id: 'familiarity_pct', group: 'characters', unit: 'percent' },
    { id: 'friends_pct', group: 'characters', unit: 'percent' },
    { id: 'family_pct', group: 'characters', unit: 'percent' },
    { id: 'dead_imaginary_pct', group: 'characters', unit: 'percent' },
    { id: 'animal_pct', group: 'characters', unit: 'percent' },
    { id: 'aggression_friendliness_pct', group: 'social', unit: 'percent' },
    { id: 'befriender_pct', group: 'social', unit: 'percent' },
    { id: 'aggressor_pct', group: 'social', unit: 'percent' },
    { id: 'physical_aggression_pct', group: 'social', unit: 'percent' },
    { id: 'ac_index', group: 'social', unit: 'ratio' },
    { id: 'fc_index', group: 'social', unit: 'ratio' },
    { id: 'sc_index', group: 'social', unit: 'ratio' },
    { id: 'self_negativity_pct', group: 'self', unit: 'percent' },
    { id: 'bodily_misfortunes_pct', group: 'self', unit: 'percent' },
    { id: 'negative_emotions_pct', group: 'self', unit: 'percent' },
    { id: 'dreamer_success_pct', group: 'self', unit: 'percent' },
    { id: 'torso_anatomy_pct', group: 'self', unit: 'percent' },
    { id: 'indoor_setting_pct', group: 'settings', unit: 'percent' },
    { id: 'familiar_setting_pct', group: 'settings', unit: 'percent' }
  ];
  var UNIT = {};
  INDICATORS.forEach(function (d) { UNIT[d.id] = d.unit; });

  // Identity classes. The published Familiarity % is familiar / (familiar +
  // unfamiliar); in Domhoff (1996) Table 4.1 the two groups add up to all human
  // characters, and the coding rules call prominent characters "usually
  // familiar because of their reputation", hence this split.
  var FAMILIAR = { family: 1, relative: 1, known: 1, prominent: 1 };
  var UNFAMILIAR = { occupational: 1, ethnic: 1, stranger: 1, uncertain: 1 };
  var EMOTIONS = { anger: 1, apprehension: 1, sadness: 1, confusion: 1, happiness: 1 };
  var NEGATIVE = { anger: 1, apprehension: 1, sadness: 1, confusion: 1 };

  // DreamSAT: "The A/C, F/C, and S/C indexes do NOT use the h statistic" and
  // use the difference times 2.36 (about 3 pi / 4) instead.
  var INDEX_FACTOR = 2.36;

  function arr(x) { return Array.isArray(x) ? x : []; }
  function norm(s) { return typeof s === 'string' ? s.trim().toLowerCase() : ''; }
  function isDreamer(s) { return norm(s) === 'dreamer'; }

  function isCoded(h) {
    if (!h || typeof h !== 'object' || Array.isArray(h)) return false;
    return ['characters', 'interactions', 'successes', 'failures', 'misfortunes',
      'good_fortunes', 'emotions', 'settings', 'objects'].some(function (k) { return Array.isArray(h[k]); });
  }

  // Accepts an hvdc object, an analysis ({hvdc}), a dream record ({analysis:{hvdc}}),
  // or an array of any of these; returns the list of usable hvdc objects.
  function normalize(input) {
    if (input == null) return [];
    var list = Array.isArray(input) ? input : [input];
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var x = list[i];
      if (!x || typeof x !== 'object') continue;
      if (x.analysis && typeof x.analysis === 'object' && x.analysis.hvdc) x = x.analysis.hvdc;
      else if (x.hvdc && typeof x.hvdc === 'object') x = x.hvdc;
      if (isCoded(x)) out.push(x);
    }
    return out;
  }

  function tally(dreams) {
    var t = {
      chars: 0, humans: 0, animals: 0, male: 0, female: 0, familiar: 0, unfamiliar: 0,
      known: 0, family: 0, deadImag: 0,
      agg: 0, fri: 0, sex: 0, physAgg: 0, dAgg: 0, dFri: 0,
      dAggressor: 0, dVictim: 0, dBefriender: 0, dBefriended: 0,
      mis: 0, bodilyMis: 0, dMis: 0, dGoodFortune: 0, dSuccess: 0, dFailure: 0,
      emo: 0, negEmo: 0, indoor: 0, outdoor: 0, famSet: 0, unfamSet: 0, torso: 0, bodyParts: 0
    };
    dreams.forEach(function (h) {
      arr(h.characters).forEach(function (c) {
        if (!c || typeof c !== 'object') return;
        var kind = norm(c.kind);
        t.chars++;
        if (c.dead_or_imaginary === true) t.deadImag++;
        if (kind === 'animal') { t.animals++; return; }
        if (kind === 'creature') return; // counted in all characters only
        // Human: sex, identity and age are coded only for humans.
        t.humans++;
        var sex = String(c.sex || '').toUpperCase();
        if (sex === 'M') t.male++;
        else if (sex === 'F') t.female++; // J (joint) and I (indefinite) excluded from Male/Female %
        var id = norm(c.identity);
        if (FAMILIAR[id]) t.familiar++;
        else if (UNFAMILIAR[id]) t.unfamiliar++;
        if (id === 'known') t.known++;
        if (id === 'family' || id === 'relative') t.family++;
      });

      arr(h.interactions).forEach(function (x) {
        if (!x || typeof x !== 'object') return;
        var type = norm(x.type);
        var dInit = isDreamer(x.initiator);
        var dRec = isDreamer(x.recipient);
        var involved = dInit || dRec;
        var self = norm(x.initiator) !== '' && norm(x.initiator) === norm(x.recipient);
        // Aggressor/victim and befriender/befriended exclude reciprocal, mutual
        // (coded as reciprocal in the app), self-directed and witnessed acts.
        var oneWay = involved && !self && x.reciprocal !== true;
        if (type === 'aggression') {
          t.agg++;
          var lvl = Number(x.level);
          // Published scale: A1 to A4 nonphysical, A5 to A8 physical. The
          // physical flag is used only when the level is missing or invalid.
          var phys = (lvl >= 1 && lvl <= 8 && Math.floor(lvl) === lvl) ? lvl >= 5 : x.physical === true;
          if (phys) t.physAgg++;
          if (involved) t.dAgg++;
          if (oneWay) { if (dInit) t.dAggressor++; else t.dVictim++; }
        } else if (type === 'friendliness') {
          t.fri++;
          if (involved) t.dFri++;
          if (oneWay) { if (dInit) t.dBefriender++; else t.dBefriended++; }
        } else if (type === 'sexual') {
          t.sex++;
        }
      });

      arr(h.successes).forEach(function (s) { if (s && isDreamer(s.by)) t.dSuccess++; });
      arr(h.failures).forEach(function (s) { if (s && isDreamer(s.by)) t.dFailure++; });
      arr(h.misfortunes).forEach(function (m) {
        if (!m || typeof m !== 'object') return;
        t.mis++;
        if (m.bodily === true) t.bodilyMis++; // M5 injury or illness, M6 death
        if (isDreamer(m.to)) t.dMis++;
      });
      arr(h.good_fortunes).forEach(function (g) { if (g && isDreamer(g.to)) t.dGoodFortune++; });

      arr(h.emotions).forEach(function (e) {
        var cls = e && norm(e.class);
        if (!EMOTIONS[cls]) return;
        t.emo++;
        if (NEGATIVE[cls]) t.negEmo++;
      });

      arr(h.settings).forEach(function (s) {
        if (!s || typeof s !== 'object') return;
        var place = norm(s.place);
        if (place === 'indoor') t.indoor++;
        else if (place === 'outdoor') t.outdoor++;
        // Familiar Setting % = familiar / (familiar + unfamiliar); distorted,
        // geographical and questionable stay out (this reproduces the
        // published 62% and 79% from the settings norms frequencies).
        var fam = norm(s.familiarity);
        if (fam === 'familiar') t.famSet++;
        else if (fam === 'unfamiliar') t.unfamSet++;
      });

      arr(h.objects).forEach(function (o) {
        var cls = o && norm(o['class']);
        // body_torso = published torso + anatomy + sex subclasses;
        // body_other = head + extremities.
        if (cls === 'body_torso') { t.torso++; t.bodyParts++; }
        else if (cls === 'body_other') t.bodyParts++;
      });
    });
    return t;
  }

  function r(numerator, denominator, scale) {
    return {
      value: denominator > 0 ? (numerator / denominator) * scale : null,
      numerator: numerator,
      denominator: denominator
    };
  }

  // HVDC.indicators(codedDreams) -> {id: {value, numerator, denominator}}.
  // value is null when the denominator is 0 (nothing to measure).
  function indicators(codedDreams) {
    var t = tally(normalize(codedDreams));
    var P = 100;
    var negSelf = t.dVictim + t.dMis + t.dFailure;
    var posSelf = t.dBefriended + t.dGoodFortune + t.dSuccess;
    return {
      male_female_pct: r(t.male, t.male + t.female, P),
      familiarity_pct: r(t.familiar, t.familiar + t.unfamiliar, P),
      friends_pct: r(t.known, t.humans, P),
      family_pct: r(t.family, t.humans, P),
      // The app's coding keeps dead and imaginary in one flag, which is all
      // this indicator needs ((dead + imaginary) / all characters).
      dead_imaginary_pct: r(t.deadImag, t.chars, P),
      animal_pct: r(t.animals, t.chars, P),
      aggression_friendliness_pct: r(t.dAgg, t.dAgg + t.dFri, P),
      befriender_pct: r(t.dBefriender, t.dBefriender + t.dBefriended, P),
      aggressor_pct: r(t.dAggressor, t.dAggressor + t.dVictim, P),
      physical_aggression_pct: r(t.physAgg, t.agg, P),
      ac_index: r(t.agg, t.chars, 1),
      fc_index: r(t.fri, t.chars, 1),
      sc_index: r(t.sex, t.chars, 1),
      // Full published composite: (D as victim + D misfortunes + D failures) /
      // (those + D as befriended + D good fortunes + D successes). "D as
      // victim" and "D as befriended" are counted as in the aggressor and
      // befriender percents (the app's reading; the formula page is silent).
      self_negativity_pct: r(negSelf, negSelf + posSelf, P),
      bodily_misfortunes_pct: r(t.bodilyMis, t.mis, P),
      negative_emotions_pct: r(t.negEmo, t.emo, P),
      dreamer_success_pct: r(t.dSuccess, t.dSuccess + t.dFailure, P),
      torso_anatomy_pct: r(t.torso, t.bodyParts, P),
      indoor_setting_pct: r(t.indoor, t.indoor + t.outdoor, P),
      familiar_setting_pct: r(t.famSet, t.famSet + t.unfamSet, P)
    };
  }

  // Cohen's h for two proportions (0 to 1): 2 asin(sqrt(p1)) - 2 asin(sqrt(p2)).
  function h(p1, p2) {
    if (typeof p1 !== 'number' || typeof p2 !== 'number' || !isFinite(p1) || !isFinite(p2)) return null;
    var a = Math.min(1, Math.max(0, p1));
    var b = Math.min(1, Math.max(0, p2));
    return 2 * Math.asin(Math.sqrt(a)) - 2 * Math.asin(Math.sqrt(b));
  }

  // Accepts the parsed norms.json ({indicators:[{id, men, women}]}) or a map
  // {id: {men, women}}.
  function normsMap(norms) {
    var m = {};
    if (!norms) return m;
    if (Array.isArray(norms.indicators)) norms.indicators.forEach(function (d) { if (d && d.id) m[d.id] = d; });
    else Object.keys(norms).forEach(function (k) { if (norms[k] && typeof norms[k] === 'object') m[k] = norms[k]; });
    return m;
  }

  function num(x) { return typeof x === 'number' && isFinite(x) ? x : null; }

  // sex: 'male' (men's norms), 'female' (women's norms), 'both' (the simple
  // mean of the two; an app choice, documented in norms.json).
  function normFor(d, sex) {
    if (!d) return null;
    var men = num(d.men), women = num(d.women);
    if (sex === 'male') return men;
    if (sex === 'female') return women;
    return men === null || women === null ? null : (men + women) / 2;
  }

  // HVDC.compare(indicators, norms, sex) -> {id: {value, norm, h, numerator,
  // denominator, method}}. method 'h' (Cohen's h on proportions) for the
  // percents; 'diff236' (2.36 x (value - norm), DreamSAT) for the A/C, F/C and
  // S/C indexes, which are not proportions. Positive h: the user is higher.
  function compare(ind, norms, sex) {
    var m = normsMap(norms);
    var s = sex === 'male' || sex === 'female' ? sex : 'both';
    var out = {};
    INDICATORS.forEach(function (d) {
      var x = ind && ind[d.id] ? ind[d.id] : null;
      var value = x ? num(x.value) : null;
      var nv = normFor(m[d.id], s);
      var eff = null;
      if (value !== null && nv !== null) {
        eff = d.unit === 'percent' ? h(value / 100, nv / 100) : INDEX_FACTOR * (value - nv);
      }
      out[d.id] = {
        value: value,
        norm: nv,
        h: eff,
        numerator: x && typeof x.numerator === 'number' ? x.numerator : null,
        denominator: x && typeof x.denominator === 'number' ? x.denominator : null,
        method: d.unit === 'percent' ? 'h' : 'diff236'
      };
    });
    return out;
  }

  // Plain observations, phrased as observations, never judgements.
  // up = the user is higher than the norm, down = lower.
  var PHRASES = {
    male_female_pct: {
      up: { en: 'Men appear among your dream characters more often than is typical.', it: 'Tra i personaggi dei tuoi sogni compaiono uomini più spesso di quanto sia tipico.' },
      down: { en: 'Women appear among your dream characters more often than is typical.', it: 'Tra i personaggi dei tuoi sogni compaiono donne più spesso di quanto sia tipico.' }
    },
    familiarity_pct: {
      up: { en: 'Your dreams include more familiar people than is typical.', it: 'I tuoi sogni includono più persone conosciute di quanto sia tipico.' },
      down: { en: 'Your dreams include more strangers and unfamiliar people than is typical.', it: 'I tuoi sogni includono più sconosciuti di quanto sia tipico.' }
    },
    friends_pct: {
      up: { en: 'Friends and acquaintances appear in your dreams more often than is typical.', it: 'Amici e conoscenti compaiono nei tuoi sogni più spesso di quanto sia tipico.' },
      down: { en: 'Friends and acquaintances appear in your dreams less often than is typical.', it: 'Amici e conoscenti compaiono nei tuoi sogni meno spesso di quanto sia tipico.' }
    },
    family_pct: {
      up: { en: 'Family members and relatives appear in your dreams more often than is typical.', it: 'Familiari e parenti compaiono nei tuoi sogni più spesso di quanto sia tipico.' },
      down: { en: 'Family members and relatives appear in your dreams less often than is typical.', it: 'Familiari e parenti compaiono nei tuoi sogni meno spesso di quanto sia tipico.' }
    },
    dead_imaginary_pct: {
      up: { en: 'People who have passed away, or imaginary figures, appear in your dreams more often than is typical.', it: 'Persone scomparse o figure immaginarie compaiono nei tuoi sogni più spesso di quanto sia tipico.' },
      down: { en: 'People who have passed away, or imaginary figures, appear in your dreams less often than is typical.', it: 'Persone scomparse o figure immaginarie compaiono nei tuoi sogni meno spesso di quanto sia tipico.' }
    },
    animal_pct: {
      up: { en: 'Animals appear in your dreams more often than is typical.', it: 'Gli animali compaiono nei tuoi sogni più spesso di quanto sia tipico.' },
      down: { en: 'Animals appear in your dreams less often than is typical.', it: 'Gli animali compaiono nei tuoi sogni meno spesso di quanto sia tipico.' }
    },
    aggression_friendliness_pct: {
      up: { en: 'Your own encounters with other characters lean toward conflict more than is typical.', it: 'I tuoi incontri con gli altri personaggi tendono al conflitto più di quanto sia tipico.' },
      down: { en: 'Your own encounters with other characters lean toward friendliness more than is typical.', it: 'I tuoi incontri con gli altri personaggi tendono alla cordialità più di quanto sia tipico.' }
    },
    befriender_pct: {
      up: { en: 'In friendly moments, you are the one who reaches out more often than is typical.', it: 'Nei momenti amichevoli sei tu a fare il primo passo più spesso di quanto sia tipico.' },
      down: { en: 'In friendly moments, other characters reach out to you more often than is typical.', it: 'Nei momenti amichevoli sono gli altri personaggi a cercarti più spesso di quanto sia tipico.' }
    },
    aggressor_pct: {
      up: { en: 'When there is conflict involving you, you start it more often than is typical.', it: 'Quando un conflitto ti coinvolge, sei tu a iniziarlo più spesso di quanto sia tipico.' },
      down: { en: 'When there is conflict involving you, it comes from other characters more often than is typical.', it: 'Quando un conflitto ti coinvolge, parte dagli altri personaggi più spesso di quanto sia tipico.' }
    },
    physical_aggression_pct: {
      up: { en: 'Conflicts in your dreams are physical more often than is typical.', it: 'I conflitti nei tuoi sogni sono fisici più spesso di quanto sia tipico.' },
      down: { en: 'Conflicts in your dreams stay verbal or non-physical more often than is typical.', it: 'I conflitti nei tuoi sogni restano verbali o non fisici più spesso di quanto sia tipico.' }
    },
    ac_index: {
      up: { en: 'Conflict between characters comes up in your dreams more often than is typical.', it: 'Nei tuoi sogni i conflitti tra personaggi emergono più spesso di quanto sia tipico.' },
      down: { en: 'Conflict between characters comes up in your dreams less often than is typical.', it: 'Nei tuoi sogni i conflitti tra personaggi emergono meno spesso di quanto sia tipico.' }
    },
    fc_index: {
      up: { en: 'Friendly exchanges between characters come up in your dreams more often than is typical.', it: 'Nei tuoi sogni gli scambi amichevoli tra personaggi emergono più spesso di quanto sia tipico.' },
      down: { en: 'Friendly exchanges between characters come up in your dreams less often than is typical.', it: 'Nei tuoi sogni gli scambi amichevoli tra personaggi emergono meno spesso di quanto sia tipico.' }
    },
    sc_index: {
      up: { en: 'Romantic or sexual encounters come up in your dreams more often than is typical.', it: 'Nei tuoi sogni gli incontri romantici o sessuali emergono più spesso di quanto sia tipico.' },
      down: { en: 'Romantic or sexual encounters come up in your dreams less often than is typical.', it: 'Nei tuoi sogni gli incontri romantici o sessuali emergono meno spesso di quanto sia tipico.' }
    },
    self_negativity_pct: {
      up: { en: 'Setbacks that happen to you in dreams (mishaps, attempts that do not work out, conflict aimed at you) come up more often, compared with good outcomes, than is typical.', it: 'Nei tuoi sogni gli imprevisti che ti riguardano (disavventure, tentativi non riusciti, conflitti rivolti a te) emergono più spesso, rispetto agli esiti positivi, di quanto sia tipico.' },
      down: { en: 'Good outcomes that happen to you in dreams (help, luck, success) come up more often, compared with setbacks, than is typical.', it: 'Nei tuoi sogni gli esiti positivi che ti riguardano (aiuto, fortuna, successo) emergono più spesso, rispetto agli imprevisti, di quanto sia tipico.' }
    },
    bodily_misfortunes_pct: {
      up: { en: 'When mishaps happen in your dreams, they involve illness or injury more often than is typical.', it: 'Quando nei tuoi sogni accade un imprevisto, riguarda malattie o ferite più spesso di quanto sia tipico.' },
      down: { en: 'When mishaps happen in your dreams, they involve illness or injury less often than is typical.', it: 'Quando nei tuoi sogni accade un imprevisto, riguarda malattie o ferite meno spesso di quanto sia tipico.' }
    },
    negative_emotions_pct: {
      up: { en: 'The feelings named in your dreams lean toward unpleasant ones more than is typical.', it: 'Le emozioni presenti nei tuoi sogni tendono verso quelle spiacevoli più di quanto sia tipico.' },
      down: { en: 'The feelings named in your dreams lean toward happiness more than is typical.', it: 'Le emozioni presenti nei tuoi sogni tendono verso la felicità più di quanto sia tipico.' }
    },
    dreamer_success_pct: {
      up: { en: 'When you set out to do something in your dreams, it works out more often than is typical.', it: 'Quando nei tuoi sogni ti proponi di fare qualcosa, ci riesci più spesso di quanto sia tipico.' },
      down: { en: 'When you set out to do something in your dreams, it works out less often than is typical.', it: 'Quando nei tuoi sogni ti proponi di fare qualcosa, ci riesci meno spesso di quanto sia tipico.' }
    },
    torso_anatomy_pct: {
      up: { en: 'When the body comes up in your dreams, it is the torso or the inside of the body more often than is typical.', it: 'Quando nei tuoi sogni si parla del corpo, si tratta del busto o dell\'interno del corpo più spesso di quanto sia tipico.' },
      down: { en: 'When the body comes up in your dreams, it is the head, hands or limbs more often than is typical.', it: 'Quando nei tuoi sogni si parla del corpo, si tratta di testa, mani o arti più spesso di quanto sia tipico.' }
    },
    indoor_setting_pct: {
      up: { en: 'Your dreams take place indoors more often than is typical.', it: 'I tuoi sogni si svolgono al chiuso più spesso di quanto sia tipico.' },
      down: { en: 'Your dreams take place outdoors more often than is typical.', it: 'I tuoi sogni si svolgono all\'aperto più spesso di quanto sia tipico.' }
    },
    familiar_setting_pct: {
      up: { en: 'Your dreams take place in familiar places more often than is typical.', it: 'I tuoi sogni si svolgono in luoghi familiari più spesso di quanto sia tipico.' },
      down: { en: 'Your dreams take place in unfamiliar places more often than is typical.', it: 'I tuoi sogni si svolgono in luoghi sconosciuti più spesso di quanto sia tipico.' }
    }
  };

  var SUMMARY_THRESHOLD = 0.2; // Cohen's lower bound for a small effect
  var SUMMARY_MIN_DENOMINATOR = 5; // app guard against one-off events; not part of the published method

  // HVDC.summary(compared, lang, opts) -> array of short strings, largest
  // effect first. Pass the result of compare(). Raw indicators also work when
  // opts.norms (and optionally opts.sex) is given. opts.max (default 5),
  // opts.minDenominator (default 5).
  function summary(input, lang, opts) {
    opts = opts || {};
    var L = lang === 'it' ? 'it' : 'en';
    if (!input || typeof input !== 'object') return [];
    var first = input[INDICATORS[0].id];
    var cmp = first && Object.prototype.hasOwnProperty.call(first, 'h') ? input
      : (opts.norms ? compare(input, opts.norms, opts.sex) : null);
    if (!cmp) return [];
    var max = typeof opts.max === 'number' ? opts.max : 5;
    var minDen = typeof opts.minDenominator === 'number' ? opts.minDenominator : SUMMARY_MIN_DENOMINATOR;
    var rows = [];
    INDICATORS.forEach(function (d) {
      var c = cmp[d.id];
      if (!c || typeof c.h !== 'number' || !isFinite(c.h)) return;
      if (Math.abs(c.h) < SUMMARY_THRESHOLD) return;
      if (typeof c.denominator === 'number' && c.denominator < minDen) return;
      rows.push({ id: d.id, h: c.h });
    });
    rows.sort(function (a, b) { return Math.abs(b.h) - Math.abs(a.h); });
    return rows.slice(0, max).map(function (row) {
      return PHRASES[row.id][row.h > 0 ? 'up' : 'down'][L];
    });
  }

  return {
    INDICATORS: INDICATORS,
    INDEX_FACTOR: INDEX_FACTOR,
    SUMMARY_THRESHOLD: SUMMARY_THRESHOLD,
    minDreams: 10, // the dashboard shows the profile from this many coded dreams (SPEC 6.3)
    reliableDreams: 100, // Domhoff (1996, ch. 4): about 100 reports approximate the norms; for the dashboard note
    normalize: normalize,
    indicators: indicators,
    h: h,
    compare: compare,
    summary: summary
  };
}));
