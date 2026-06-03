# Beverly Index Website: Oxford Restyle + Content Fix Plan

Reference model: University of Oxford main site (https://www.ox.ac.uk).
Repo: static HTML site (GitHub Pages). Prepared for execution in Claude Code.

---

## 1. Design system (Oxford-derived)

### Typography (Oxford core fonts, free on Google Fonts)
- Display / headings: **Noto Serif** (600, 700)
- Body / UI / navigation: **Roboto** (400, 500, 700)
- Eyebrow labels: Roboto, uppercase, letter-spaced, in gold

Google Fonts link to add to every page `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;600;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
```

### Color tokens (CSS variables)
```css
:root {
  --ox-blue:        #002147; /* Oxford Blue: nav bar, footer, section titles, primary buttons */
  --ox-blue-deep:   #001530; /* hover / pressed states */
  --gold:           #9A7A39; /* accent: hairline rules, eyebrow labels, link underlines */
  --gold-bright:    #C8A45A; /* optional brighter crest gold, sparing use */
  --ink:            #1A1A1A; /* body text */
  --slate:          #5A5A5A; /* secondary text */
  --paper:          #FFFFFF; /* page background */
  --paper-tint:     #F4F6F9; /* alternating section background */
  --hairline:       #D9DEE5; /* card borders, dividers */
}
```

### Layout principles (mirroring ox.ac.uk)
- Light, white-background, editorial, content-first. Minimal gradients, flat color used sparingly.
- Oxford-blue top navigation bar; white content body; Oxford-blue footer.
- Generous whitespace; strong type hierarchy (large serif hero headline, serif section titles, gold tracked-caps eyebrows above each section).
- Card grids with thin `--hairline` borders and subtle shadow; gold hairline rules as section separators.
- Buttons: solid Oxford-blue primary, gold or outline secondary.
- Keep the dark hero video block; the page transitions to light sections below it.

### Hard constraints
- Do NOT move, remove, restyle the source of, or otherwise disturb any `<video>` element. Leave all videos exactly where they are located.
- No em-dashes or en-dashes as sentence connectors anywhere.

---

## 2. Guardrail header (prepend to EVERY Claude Code prompt)

```
PROTECTED CODE: do not edit REMIEL, NOSS scoring, Beverly Index computation,
LOGOS calibration, R2X translation, or core pipeline. (Not expected in this
static website repo; included as a standing guard.)

COMMIT POLICY: author = Randolph R Beverly Jr; no Co-Authored-By lines ever;
suffix every commit message with "Beverly Index LLC"; one atomic task per commit.

STYLE: no em-dashes or en-dashes as sentence connectors; use commas, colons,
semicolons, parentheses, or full stops.

COUNTS: never state a specific count of patents or trademarks, practitioners,
analyses/assessments, or accuracy/sensitivity/specificity percentages. Use
"comprehensive ... portfolio" or "multiple ..." phrasing instead. Product
architecture counts (NOSS sectors, REMIEL channels, neural bands, clinical
pathways, technology layers) are permitted.

VIDEOS: do not move, remove, or alter any <video> element or its source. Leave
every video exactly where it is.
```

---

## 3. Ordered task prompts (run top to bottom, one commit each)

### Task 0: Recon and design-system foundation
```
[GUARDRAIL HEADER]

Recon first, no content edits yet. (1) List every .html file in the repo and
report the directory tree. (2) Tell me whether the site uses any include/
templating mechanism for the header, nav, and footer, or whether each page
hard-codes its own copy. (3) Identify the shared stylesheet(s) and where global
CSS lives. (4) List every <video> element and its location.

Then create the Oxford design system in the global stylesheet: add the CSS
variables below, import Noto Serif + Roboto from Google Fonts, and define base
typography (Noto Serif headings, Roboto body, gold tracked-caps eyebrow labels).
Do not yet apply it to individual pages. Commit as one atomic change.

[paste the Color tokens block and Google Fonts link from the design system]
```

### Task 1: Canonical header, nav, and footer across all pages
```
[GUARDRAIL HEADER]

The header navigation is inconsistent across pages. csaa.html uses a stripped-
down nav with no dropdowns; about.html and science/publications.html are missing
the top-level CSAA link; the Science submenu varies between pages. The footer
also varies.

Build ONE canonical header/nav and ONE canonical footer and apply them to every
page. If the site has no include mechanism, replicate the identical canonical
block across all .html files. The nav must include, on every page: Science
(NOST Framework, NOSS Classification, Validation Studies, Publications, Glossary),
Case Studies, Blog, Experience (DreamWeaver, Memoria Sonata, Empyrean 3D),
Solutions (Clinicians, Health Systems, Sports Medicine, Forensic / CSAA,
For Individuals), Product (REMIEL Engine, NOUS Platform), CNAP, Professional
Access, CSAA, About, Get Started. Fix the logo asset path on
science/publications.html from assets/beverly-index.png to
assets/beverly-index-logo.png. One atomic commit.
```

### Task 2: Apply the Oxford visual theme site-wide
```
[GUARDRAIL HEADER]

Apply the Oxford design system to every page: light white-background editorial
layout, Noto Serif headings, Roboto body and nav, Oxford-blue (#002147) nav bar
and footer, gold (#9A7A39) hairline rules and tracked-caps eyebrow labels,
card grids with thin --hairline borders, solid Oxford-blue primary buttons.
Replace the existing dark theme. Preserve the hero video block and every other
<video> exactly in place; the dark hero may stay dark with light sections below
it. Keep all existing copy and structure; this task is visual only. Commit.
```

### Task 3: Em-dash / en-dash connector sweep
```
[GUARDRAIL HEADER]

Across all .html files, replace every em-dash and en-dash used as a SENTENCE
CONNECTOR in body copy, headings, and meta tags with a comma, colon, semicolon,
parentheses, or full stop, whichever reads best. Leave label-style separators
that are not sentence connectors (for example "L1 — Input", "XP-01") alone, or
convert them to a colon if cleaner. Report a diff of every change. One commit.
```

### Task 4: Acronym corrections
```
[GUARDRAIL HEADER]

Two locked-acronym fixes across all files, including <title>, meta, og:, and
twitter: tags and visible headings:
1. CSAA: replace "Cognitive Signature Authentication" with "Cognitive Signature
   Authenticity Assessment" everywhere it appears (homepage card heading,
   csaa.html title/meta/og/twitter). The csaa.html body already uses the
   correct form; align everything to it.
2. VOCA: on science/publications.html, replace "Voice-optimized cognitive
   analysis architecture" with "Vocal Oscillation Cognitive Archive".
One commit.
```

### Task 5: NOSS expansion standardization
```
[GUARDRAIL HEADER]

Standardize the NOSS expansion to "Neural Oscillatory Spectroscopy System"
everywhere, including meta keyword lists that currently read "Neural Oscillation
Signature Spectrum". The homepage currently contains both forms; the body form
is canonical. One commit.
```

### Task 6: Research-integrity wording + surface real scholarship
```
[GUARDRAIL HEADER]

Accuracy fixes (SSRN is a preprint server, not peer review; a Frontiers review
is in progress, so claims must be precise):
1. Anywhere the site says the methodology is "published in peer-reviewed
   literature (DOI: 10.2139/ssrn.6447802)" or similar, reword: describe SSRN as
   a preprint / working paper, and describe Frontiers in Psychology MS 1834364
   as "under peer review". Do not call SSRN content peer-reviewed.
2. On csaa.html, soften "validated across multiple population groups with zero
   overlap between authentic and constructed narratives on all discriminant
   dimensions" to calibration-separation language (for example: "calibration
   showed clear separation between authentic and constructed narratives on the
   discriminant dimensions"). Keep the existing "formal sensitivity and
   specificity metrics are under development" disclosure.
3. On science/publications.html, add a real, linked scholarship entry in the
   public (non-gated) area: SSRN preprint, Abstract ID 6447802, DOI
   10.2139/ssrn.6447802; Frontiers in Psychology MS 1834364 (under peer review);
   ORCID 0009-0009-1382-1055.
One commit.
```

### Task 7: Location country-only in body copy
```
[GUARDRAIL HEADER]

In body copy across the site, use only "United States" and "Italy"; remove
city/state specifics. On about.html, change "headquartered in Sheridan, Wyoming,
with research and cultural connections spanning the United States and Italy" to
remove the Sheridan/Wyoming reference while keeping the United States and Italy
framing. KEEP the registered address (30 N Gould St, Ste R, Sheridan, WY 82801)
in the page footer only. One commit.
```

### Task 8: Publications / Amazon links + book status
```
[GUARDRAIL HEADER]

Signals from the Void is now published. On science/publications.html:
1. Replace the broken placeholder links amazon.com/dp/placeholder-signals and
   amazon.com/dp/placeholder-segnali with the live links: Signals from the Void
   (English) -> https://a.co/d/030RGQdb ; Segnali dal Vuoto (Italian) ->
   https://amzn.eu/d/0g91pEN9
2. Unify The Dream Code to a single Amazon link (currently a.co/d/00fVwb4H and
   a.co/d/0haHn6K2 disagree); use a.co/d/00fVwb4H unless told otherwise.
3. Replace every "Download PDF" anchor that points to "#" so it either links to
   a real gated asset or is labelled "Available on request" with a contact link.
On about.html: reconcile Signals from the Void from "Manuscript, In Progress,
Draft 7" to "Published" to match the Publications page. One commit.
```

### Task 9: Attribution alignment
```
[GUARDRAIL HEADER]

On index.html and about.html, the founder pull-quote is signed "Randolph R.
Beverly Jr., Founder". Change the title to "President & Chief Architect" (the
standing title) to match the About page title block. One commit.
```

### Task 10: Prohibited specific-count sweep (repo-wide)
```
[GUARDRAIL HEADER]

Repo-wide sweep of all .html files (grep, so pages not manually reviewed are
covered too). Find and generalize every prohibited specific count:
1. Patent counts -> "comprehensive patent portfolio" or "multiple pending patent
   applications" (the homepage "Comprehensive Patent Portfolio" stat is already
   compliant; leave it).
2. Trademark counts -> non-numeric phrasing. On about.html the IP stats block
   reads "23 Trademarks Filed"; remove the number. Reframe that stat tile so it
   carries no count (for example "Comprehensive IP Portfolio" or move trademarks
   into prose as "multiple registered and pending trademarks"). Keep the tile
   layout clean.
3. Practitioner counts, analysis/assessment counts, and any accuracy /
   sensitivity / specificity percentages stated as confirmed -> remove or
   generalize. (The csaa.html accuracy claim is handled in Task 6; catch any
   others on cnap.html, professional-access.html, science/validation.html, and
   elsewhere.)
Leave permitted product-architecture counts intact: 12 NOSS sectors, 8 REMIEL
channels, 5 neural bands, 4 clinical pathways, 7 technology layers. Report a
diff of every change. One commit.
```

---

## 4. Open items
- None outstanding. SFTV English link confirmed (a.co/d/030RGQdb). The trademark
  count is handled under the universal count rule (Task 10).
