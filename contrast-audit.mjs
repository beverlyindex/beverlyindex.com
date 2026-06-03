/**
 * WCAG AA Contrast Audit
 * Scans every page with Playwright and checks text node contrast ratios.
 * Outputs failures: < 4.5:1 for normal text, < 3:1 for large text.
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pages = [
  'index.html', 'about.html', 'contact.html', 'csaa.html', 'cnap.html',
  'beta-apply.html', '404.html', 'hipaa.html', 'privacy.html', 'terms.html',
  'professional-access.html',
  'product/nous.html', 'product/remiel.html',
  'science/nost.html', 'science/noss.html', 'science/validation.html',
  'science/publications.html', 'science/glossary.html',
  'solutions/index.html', 'solutions/clinicians.html',
  'solutions/health-systems.html', 'solutions/sports-medicine.html',
  'solutions/forensic.html', 'solutions/individuals.html',
  'blog/index.html',
  'case-studies/index.html',
  'experience/dreamweaver.html', 'experience/empyrean.html', 'experience/memoria-sonata.html',
];

function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseColor(str) {
  if (!str) return null;
  const rgba = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgba) {
    return {
      r: parseInt(rgba[1]), g: parseInt(rgba[2]), b: parseInt(rgba[3]),
      a: rgba[4] !== undefined ? parseFloat(rgba[4]) : 1,
    };
  }
  return null;
}

function blendOnWhite(fg) {
  if (!fg || fg.a === 1) return fg;
  return {
    r: Math.round(fg.r * fg.a + 255 * (1 - fg.a)),
    g: Math.round(fg.g * fg.a + 255 * (1 - fg.a)),
    b: Math.round(fg.b * fg.a + 255 * (1 - fg.a)),
    a: 1,
  };
}

async function auditPage(browser, pagePath) {
  const url = `file://${path.resolve(__dirname, pagePath)}`;
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);

  const failures = await page.evaluate(() => {
    const results = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const seen = new Set();
    let node;

    while ((node = walker.nextNode())) {
      const text = node.textContent.trim();
      if (!text || text.length < 1) continue;
      const el = node.parentElement;
      if (!el || el.offsetWidth === 0 || el.offsetHeight === 0) continue;

      const key = el.tagName + '|' + el.className + '|' + text.substring(0, 30);
      if (seen.has(key)) continue;
      seen.add(key);

      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

      const color = style.color;
      const fontSize = parseFloat(style.fontSize);
      const fontWeight = parseInt(style.fontWeight) || 400;
      const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
      const threshold = isLarge ? 3 : 4.5;

      // Walk up to find effective background (checks both backgroundColor and gradients)
      let bgEl = el;
      let bgColor = null;
      while (bgEl) {
        const bgStyle = window.getComputedStyle(bgEl);
        const bg = bgStyle.backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          bgColor = bg;
          break;
        }
        // Check for gradient backgrounds: extract dominant color from linear-gradient
        const bgImg = bgStyle.backgroundImage;
        if (bgImg && bgImg !== 'none' && bgImg.includes('gradient')) {
          // Extract the first rgb/rgba color from the gradient
          const gradMatch = bgImg.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)/);
          if (gradMatch) {
            bgColor = gradMatch[0];
            break;
          }
        }
        bgEl = bgEl.parentElement;
      }
      if (!bgColor) bgColor = 'rgb(255, 255, 255)'; // default white

      results.push({
        tag: el.tagName.toLowerCase(),
        class: el.className?.toString().substring(0, 60) || '',
        text: text.substring(0, 50),
        color,
        bgColor,
        fontSize: Math.round(fontSize),
        isLarge,
        threshold,
      });
    }
    return results;
  });

  await page.close();

  // Check contrast ratios
  const fails = [];
  for (const item of failures) {
    const fg = parseColor(item.color);
    const bg = parseColor(item.bgColor);
    if (!fg || !bg) continue;

    const effectiveFg = blendOnWhite(fg);
    const effectiveBg = blendOnWhite(bg);

    const fgLum = luminance(effectiveFg.r, effectiveFg.g, effectiveFg.b);
    const bgLum = luminance(effectiveBg.r, effectiveBg.g, effectiveBg.b);
    const ratio = contrastRatio(fgLum, bgLum);

    if (ratio < item.threshold) {
      fails.push({
        ...item,
        ratio: ratio.toFixed(2),
        required: item.threshold,
      });
    }
  }
  return fails;
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.HOME + '/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  });
  const report = [];
  let totalFails = 0;

  for (const pg of pages) {
    const fullPath = path.resolve(__dirname, pg);
    try {
      readFileSync(fullPath);
    } catch {
      console.log(`  SKIP: ${pg} (not found)`);
      continue;
    }
    console.log(`  Auditing: ${pg}...`);
    try {
      const fails = await auditPage(browser, pg);
      if (fails.length > 0) {
        report.push(`\n=== ${pg} (${fails.length} failures) ===`);
        for (const f of fails) {
          report.push(`  ${f.tag}.${f.class} | ratio=${f.ratio} (need ${f.required}:1) | fg=${f.color} bg=${f.bgColor} | "${f.text}"`);
        }
        totalFails += fails.length;
      } else {
        report.push(`\n=== ${pg}: PASS ===`);
      }
    } catch (e) {
      report.push(`\n=== ${pg}: ERROR: ${e.message} ===`);
    }
  }

  await browser.close();

  const reportText = `WCAG AA Contrast Audit Report\nDate: ${new Date().toISOString()}\nTotal failures: ${totalFails}\n${report.join('\n')}\n`;
  writeFileSync(path.join(__dirname, 'contrast-audit-report.txt'), reportText);
  console.log(`\nTotal failures: ${totalFails}`);
  console.log('Report saved to contrast-audit-report.txt');
}

main().catch(console.error);
