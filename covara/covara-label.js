/* Remiel: Covara, the label reader.
   HOME photographs a prescription bottle or box; the text on the label is
   read on the phone itself (the browser's own text reader where there is
   one, otherwise Tesseract.js, the same reader Sentinel uses) and sorted
   into the medicine's details: its name, strength, how many each time and
   how often, who prescribed it and when, and the pharmacy with its phone.
   Nothing is filled in silently: every value read is shown for HOME to
   check before it is saved. The photo never leaves the phone to be read.
   Beverly Index LLC */
(function (root) {
  'use strict';

  var UNIT = '(mcg|mg|g|ml|iu|%|mg\\/ml|microgrammi|milligrammi)';
  var FORM_WORDS = {
    tablet: ['tablet', 'tablets', 'tab', 'tabs', 'compressa', 'compresse', 'cpr'],
    capsule: ['capsule', 'capsules', 'cap', 'caps', 'capsula'],
    pill: ['pill', 'pills', 'pillola', 'pillole'],
    drop: ['drop', 'drops', 'goccia', 'gocce', 'gtt'],
    puff: ['puff', 'puffs', 'inhalation', 'inhalations', 'spruzzo', 'spruzzi', 'erogazione', 'erogazioni'],
    patch: ['patch', 'patches', 'cerotto', 'cerotti'],
    sachet: ['sachet', 'sachets', 'bustina', 'bustine'],
    spoon: ['teaspoon', 'teaspoons', 'tsp', 'tablespoon', 'cucchiaio', 'cucchiaino'],
    injection: ['injection', 'injections', 'iniezione'],
    ml: ['ml']
  };
  var NUMS = { one: 1, two: 2, three: 3, four: 4, half: 0.5, uno: 1, una: 1, due: 2, tre: 3, quattro: 4, mezza: 0.5 };

  function clean(t) { return String(t || '').replace(/\r/g, '').replace(/[|]/g, 'I').replace(/[ \t]+/g, ' '); }
  function lines(t) { return clean(t).split('\n').map(function (l) { return l.trim(); }).filter(Boolean); }
  function num(w) { if (w == null) return null; var x = String(w).toLowerCase(); if (NUMS[x] != null) return NUMS[x]; var n = parseFloat(x.replace(',', '.')); return isFinite(n) ? n : null; }
  function title(s) { return String(s).toLowerCase().replace(/\b\p{L}/gu, function (c) { return c.toUpperCase(); }); }
  function lev(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) d[i] = [i];
    for (j = 0; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }

  /* The medicine's name: a known name from the formulary when one is on the
     label, otherwise the word just before the strength (as labels print it). */
  function findName(text, formulary) {
    var norm = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ');
    var words = norm.split(' ').filter(function (w) { return w.length >= 3; });
    var best = null;
    (formulary || []).forEach(function (name) {
      var n = String(name).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
      if (!n || n.length < 4) return;
      var d = norm.indexOf(n) >= 0 ? 0 : 1, k = n.split(' ').length;
      if (d) for (var i = 0; i + k <= words.length; i++) { var c = words.slice(i, i + k).join(' '); d = Math.min(d, lev(c, n) / Math.max(c.length, n.length)); }
      if (d <= 0.25 && (!best || d < best.d || (d === best.d && n.length > best.n.length))) best = { name: name, d: d, n: n };
    });
    if (best) return best.name;
    var m = new RegExp('([A-Za-z][A-Za-z\\-]{3,}(?:[ \\t]+[A-Za-z][A-Za-z\\-]{3,})?)(?:[ \\t]+(?:hcl|hydrochloride|sodium|potassium|calcium|er|xr|sr|xl|dr|cr))?\\s+\\d+(?:[.,]\\d+)?\\s*' + UNIT + '\\b', 'i').exec(text);
    if (m && !/\b(take|prendere|qty|quantity|refills?|rx|tablet|capsule)\b/i.test(m[1])) return title(m[1]);
    return '';
  }

  function findStrength(text) {
    var m = new RegExp('(\\d+(?:[.,]\\d+)?)\\s*' + UNIT + '\\b', 'i').exec(text);
    if (!m) return null;
    var u = m[2].toLowerCase();
    u = { microgrammi: 'mcg', milligrammi: 'mg', iu: 'IU' }[u] || u;
    return { strength: num(m[1]), unit: u };
  }

  function findDose(text) {
    var formAlt = Object.keys(FORM_WORDS).map(function (k) { return FORM_WORDS[k].join('|'); }).join('|');
    var re = new RegExp('(?:take|use|inhale|apply|instill|place|prendere|assumere|usare)\\s+(\\d+(?:[.,]\\d+)?|one|two|three|four|half|uno|una|due|tre|quattro|mezza)\\s+(' + formAlt + ')\\b', 'i');
    var m = re.exec(text);
    if (!m) { m = new RegExp('\\b(\\d+(?:[.,]\\d+)?|one|two|three|uno|una|due|tre)\\s+(' + formAlt + ')\\s+(?:by mouth|orally|per bocca|al giorno|daily|once|twice|every)', 'i').exec(text); }
    if (!m) return null;
    var w = m[2].toLowerCase(), form = null;
    Object.keys(FORM_WORDS).forEach(function (k) { if (FORM_WORDS[k].indexOf(w) >= 0) form = k; });
    return { qty: num(m[1]), form: form };
  }

  /* How often, turned into the times of day Covara uses. */
  function findTimes(text) {
    var t = text.toLowerCase();
    if (/\b(as needed|when needed|prn|al bisogno|se necessario)\b/.test(t) && !/\b(daily|day|giorno)\b/.test(t)) return { times: [], asNeeded: true };
    var every = /every\s+(\d+)\s*(?:hours|hrs|h)\b|ogni\s+(\d+)\s*ore/.exec(t);
    if (every) { var h = +(every[1] || every[2]); if (h === 12) return { times: ['08:00', '20:00'] }; if (h === 8) return { times: ['06:00', '14:00', '22:00'] }; if (h === 6) return { times: ['00:00', '06:00', '12:00', '18:00'] }; if (h === 24) return { times: ['08:00'] }; }
    if (/\b(four times|4 times|qid|quattro volte)\b/.test(t)) return { times: ['08:00', '12:00', '16:00', '20:00'] };
    if (/\b(three times|3 times|tid|tre volte)\b/.test(t)) return { times: ['08:00', '13:00', '20:00'] };
    if (/\b(twice|two times|2 times|bid|due volte)\b/.test(t)) return { times: ['08:00', '20:00'] };
    if (/\b(at bedtime|before bed|at night|nightly|hs|la sera prima di dormire|prima di coricarsi)\b/.test(t)) return { times: ['22:00'] };
    if (/\b(in the evening|every evening|alla sera|la sera)\b/.test(t)) return { times: ['18:00'] };
    if (/\b(in the morning|every morning|al mattino|la mattina)\b/.test(t)) return { times: ['08:00'] };
    if (/\b(once (a )?day|once daily|daily|every day|qd|una volta al giorno|al giorno)\b/.test(t)) return { times: ['08:00'] };
    return null;
  }

  function findPrescriber(L) {
    for (var i = 0; i < L.length; i++) {
      var l = L[i];
      var m = /(?:prescriber|prescribed by|dr\.?|doctor|physician|medico|dott(?:\.|ssa\.?|or)?)\s*[:\-]?\s*((?:dr\.?\s+|dott\.?\s+)?[A-Z][A-Za-z'\-\.]*(?:[ ,]+[A-Z][A-Za-z'\-\.]*){0,2})/i.exec(l);
      if (m && !/pharmacy|farmacia|refill|quantity/i.test(m[1])) {
        var name = m[1].replace(/,$/, '').trim();
        var it = /^dott/i.test(name) || /^(medico|dott)/i.test(l.trim());
        name = title(name.replace(/^(dr|dott(?:ssa)?)\.?\s*/i, ''));
        if (name.length < 2) continue;
        return (it ? 'Dott. ' : 'Dr. ') + name;
      }
    }
    return '';
  }

  var CHAINS = /(cvs|walgreens|rite\s*aid|walmart|kroger|costco|target|publix|safeway|express\s*scripts|optum|boots|lloyds|farmacia|pharmacy|apotheke|pharmacie|drugstore|chemist)/i;
  function findPharmacy(L) {
    for (var i = 0; i < L.length; i++) if (CHAINS.test(L[i]) && L[i].length < 70 && !/prescriber|refill/i.test(L[i]))
      return L[i].replace(/(\+?\d[\d\s().\-]{6,}\d)/g, ' ').replace(/\b(ph|phone|tel|telefono)\b\.?:?/ig, ' ').replace(/#\s*\d+/g, ' ').replace(/\s+/g, ' ').trim();
    return '';
  }
  function findPhone(text) {
    var m = /(\+?\d{1,3}[\s.\-]?)?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}\b/.exec(text) || /\+39[\s.\-]?\d{2,4}[\s.\-]?\d{5,8}/.exec(text);
    return m ? m[0].trim() : '';
  }
  /* The date it was prescribed or filled, as YYYY-MM-DD. */
  function findDate(L, dayFirst) {
    for (var i = 0; i < L.length; i++) {
      if (!/(date|filled|written|issued|data|rx date|dispensed)/i.test(L[i]) && i) continue;
      var m = /(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/.exec(L[i]) || /(\d{4})-(\d{2})-(\d{2})/.exec(L[i]);
      if (!m) continue;
      var y, mo, d;
      if (m[1].length === 4) { y = +m[1]; mo = +m[2]; d = +m[3]; }
      else { y = +m[3]; if (y < 100) y += 2000; var a = +m[1], b = +m[2]; if (a > 12 || (dayFirst && b <= 12)) { d = a; mo = b; } else { mo = a; d = b; } }
      if (mo < 1 || mo > 12 || d < 1 || d > 31) continue;
      return y + '-' + String(mo).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    }
    return '';
  }
  function findCount(text) {
    var m = /(?:qty|quantity|quantità|disp(?:ensed)?)\s*[:\-#]?\s*(\d{1,4})/i.exec(text);
    var r = /refills?\s*(?:left|remaining)?\s*[:\-]?\s*(\d{1,2}|no|none)/i.exec(text);
    return { dispensed: m ? +m[1] : null, refills: r ? (/^\d/.test(r[1]) ? +r[1] : 0) : null };
  }
  function findPurpose(text) {
    var m = /(?:for|per)\s+(blood pressure|cholesterol|diabetes|pain|sleep|anxiety|heart|thyroid|pressione|colesterolo|diabete|dolore)/i.exec(text);
    return m ? m[1].toLowerCase() : '';
  }

  /* Sort the label's text into the medicine's details. */
  function parse(text, formulary) {
    var raw = clean(text), L = lines(raw), flat = L.join(' \n ');
    var out = {};
    var name = findName(flat, formulary); if (name) out.title = name;
    var s = findStrength(flat); if (s) { out.strength = s.strength; out.unit = s.unit; }
    var d = findDose(flat); if (d) { if (d.qty) out.qty = d.qty; if (d.form) out.form = d.form; }
    var tm = findTimes(flat); if (tm && tm.times.length) out.times = tm.times; if (tm && tm.asNeeded) out.asNeeded = true;
    var p = findPrescriber(L); if (p) out.prescriber = p;
    var ph = findPharmacy(L); if (ph) { out.source = 'pharmacy'; out.source_name = ph; }
    var tel = findPhone(flat); if (tel) out.source_phone = tel;
    var dayFirst = /\b(data|farmacia|compress\w*|prendere|dott)\b/i.test(flat) || String((root.I18n && root.I18n.locale) || '').slice(0, 2) === 'it';
    var dt = findDate(L, dayFirst); if (dt) out.prescribed_on = dt;
    var c = findCount(flat); if (c.dispensed) out.dispensed = c.dispensed; if (c.refills != null) out.refills = c.refills;
    var pu = findPurpose(flat); if (pu) out.purpose = pu;
    var rx = /\brx\s*(?:#|no\.?|number|n\.?)?\s*[:\-]?\s*([A-Z0-9\-]{5,14})/i.exec(flat); if (rx) out.rx_number = rx[1];
    var ins = /\b(with (?:food|meals|water|milk)|on an empty stomach|before (?:meals|breakfast|bed)|after (?:meals|food)|do not crush|swallow whole|a stomaco pieno|a stomaco vuoto|prima dei pasti|dopo i pasti|con acqua)\b/i.exec(flat);
    if (ins) out.instructions = ins[1].charAt(0).toUpperCase() + ins[1].slice(1).toLowerCase();
    return out;
  }

  /* Read the text of a photo on this device. */
  async function readText(file) {
    var bmp = await new Promise(function (res, rej) {
      var im = new Image(); im.onload = function () { res(im); }; im.onerror = rej; im.src = URL.createObjectURL(file);
    });
    var cv = document.createElement('canvas');
    var k = Math.min(1, 2000 / Math.max(bmp.naturalWidth, bmp.naturalHeight));
    cv.width = Math.round(bmp.naturalWidth * k); cv.height = Math.round(bmp.naturalHeight * k);
    var g = cv.getContext('2d'); g.drawImage(bmp, 0, 0, cv.width, cv.height);
    var text = '';
    if ('TextDetector' in root) {
      try { var found = await new root.TextDetector().detect(cv); text = found.map(function (x) { return x.rawValue; }).join('\n'); } catch (e) { text = ''; }
    }
    if (!text.trim()) {
      var T = (typeof root._loadTesseract === 'function') ? await root._loadTesseract() : root.Tesseract;
      if (T && T.recognize) {
        var lang = String((root.I18n && root.I18n.locale) || 'en').slice(0, 2) === 'it' ? 'eng+ita' : 'eng';
        var res = await T.recognize(cv, lang);
        text = (res && res.data && res.data.text) || '';
      }
    }
    return text;
  }
  function formulary() {
    try { if (root.MedicationTracker && root.MedicationTracker.getFormulary) return root.MedicationTracker.getFormulary().map(function (f) { return f.name; }); } catch (e) {}
    return [];
  }
  async function read(file) { var text = await readText(file); return { text: text, fields: parse(text, formulary()) }; }

  var api = { read: read, parse: parse };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CovaraLabel = api;
})(typeof window !== 'undefined' ? window : globalThis);
