/**
 * Layout Audit: checks every page for:
 * 1. Content elements touching viewport edge (escaped container)
 * 2. Adjacent sibling content blocks with insufficient vertical gap
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pages = [
  'index.html', 'about.html', 'contact.html', 'csaa.html', 'cnap.html',
  'platforms.html', 'product/nous.html', 'product/remiel.html',
  'product/proteus.html', 'product/remiel-optics.html',
  'science/nost.html', 'science/noss.html', 'science/validation.html',
  'science/publications.html', 'science/glossary.html', 'science/foundation.html',
  'solutions/index.html', 'solutions/clinicians.html',
  'solutions/health-systems.html', 'solutions/sports-medicine.html',
  'solutions/forensic.html', 'solutions/individuals.html',
];

const MIN_GAP = 12; // minimum px between adjacent content blocks
const EDGE_THRESHOLD = 5; // px from viewport edge to flag

async function auditPage(browser, pagePath) {
  const url = `file://${path.resolve(__dirname, pagePath)}`;
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(500);

  const flags = await page.evaluate(({ EDGE_THRESHOLD, MIN_GAP }) => {
    const results = [];
    const contentEls = document.querySelectorAll('h1,h2,h3,h4,p,li,span.eyebrow,.section-eyebrow,.section-heading,.premise-card,.band-row,.card,.value-card,.vid-wrap,blockquote,img');

    for (const el of contentEls) {
      if (!el.offsetParent) continue; // hidden
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      // Skip nav and footer
      if (el.closest('nav') || el.closest('footer')) continue;
      // Skip page-hero (intentionally full-width dark band)
      if (el.closest('.page-hero') || el.closest('.hero')) continue;

      // Check left edge
      if (rect.left < EDGE_THRESHOLD) {
        results.push({
          type: 'edge',
          tag: el.tagName.toLowerCase(),
          class: el.className?.toString().substring(0, 40) || '',
          text: el.textContent?.trim().substring(0, 40) || '',
          left: Math.round(rect.left),
        });
      }
    }

    // Check adjacent sibling gaps
    const sections = document.querySelectorAll('.content > *, .wrap > section, .wrap > div, .wrap > h2, .wrap > h3, .wrap > p');
    const sorted = Array.from(sections).filter(el => el.offsetParent && el.getBoundingClientRect().height > 0);
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i].getBoundingClientRect();
      const b = sorted[i + 1].getBoundingClientRect();
      const gap = b.top - a.bottom;
      if (gap >= 0 && gap < MIN_GAP && gap >= 0) {
        results.push({
          type: 'gap',
          tagA: sorted[i].tagName.toLowerCase(),
          tagB: sorted[i + 1].tagName.toLowerCase(),
          textA: sorted[i].textContent?.trim().substring(0, 30) || '',
          textB: sorted[i + 1].textContent?.trim().substring(0, 30) || '',
          gap: Math.round(gap),
        });
      }
    }

    return results;
  }, { EDGE_THRESHOLD, MIN_GAP });

  await page.close();
  return flags;
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.HOME + '/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  });

  const report = [];
  let totalFlags = 0;

  for (const pg of pages) {
    if (!existsSync(path.resolve(__dirname, pg))) {
      console.log(`  SKIP: ${pg}`);
      continue;
    }
    console.log(`  Auditing: ${pg}...`);
    try {
      const flags = await auditPage(browser, pg);
      if (flags.length > 0) {
        report.push(`\n=== ${pg} (${flags.length} flags) ===`);
        for (const f of flags) {
          if (f.type === 'edge') {
            report.push(`  EDGE: <${f.tag}.${f.class}> left=${f.left}px | "${f.text}"`);
          } else {
            report.push(`  GAP: ${f.gap}px between <${f.tagA}> "${f.textA}" and <${f.tagB}> "${f.textB}"`);
          }
        }
        totalFlags += flags.length;
      } else {
        report.push(`\n=== ${pg}: CLEAN ===`);
      }
    } catch (e) {
      report.push(`\n=== ${pg}: ERROR: ${e.message} ===`);
    }
  }

  await browser.close();

  const reportText = `Layout Audit Report\nDate: ${new Date().toISOString()}\nTotal flags: ${totalFlags}\n${report.join('\n')}\n`;
  writeFileSync(path.join(__dirname, 'layout-audit-report.txt'), reportText);
  console.log(`\nTotal flags: ${totalFlags}`);
  console.log('Report saved to layout-audit-report.txt');
}

main().catch(console.error);
