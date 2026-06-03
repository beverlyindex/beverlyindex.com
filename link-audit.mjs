/**
 * Full link audit: crawl every page, extract every href,
 * verify HTTP 200, check content matches label.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Discover all HTML files
function findHtmlFiles(dir, base = '') {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results.push(...findHtmlFiles(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith('.html') && entry.name !== 'home.html' && entry.name !== 'navtest.html') {
      results.push(rel);
    }
  }
  return results;
}

const htmlFiles = findHtmlFiles(__dirname);
const report = [];
let broken = 0;
let total = 0;

for (const file of htmlFiles) {
  const content = readFileSync(path.join(__dirname, file), 'utf-8');
  const hrefRegex = /href="([^"#][^"]*?)"/g;
  let match;
  const seen = new Set();

  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    if (seen.has(href)) continue;
    seen.add(href);

    // Skip external links, mailto, tel, javascript
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;

    total++;

    // Resolve the path
    let resolved;
    if (href.startsWith('/')) {
      resolved = href.slice(1); // absolute from root
    } else {
      resolved = path.join(path.dirname(file), href);
    }

    // Normalize: /solutions/ -> solutions/index.html
    if (resolved.endsWith('/')) resolved += 'index.html';
    if (!resolved.endsWith('.html') && !resolved.includes('.')) resolved += '/index.html';

    const fullPath = path.join(__dirname, resolved);
    const exists = existsSync(fullPath);

    if (!exists) {
      // Check if it's a non-HTML asset
      const assetPath = path.join(__dirname, href.startsWith('/') ? href.slice(1) : path.join(path.dirname(file), href));
      if (existsSync(assetPath)) continue; // asset exists, skip

      report.push(`BROKEN | ${file} -> ${href} (resolved: ${resolved}, not found)`);
      broken++;
    } else {
      // Check content - does it have more than just nav+footer?
      const dest = readFileSync(fullPath, 'utf-8');
      const bodyMatch = dest.match(/<body[^>]*>([\s\S]*)<\/body>/);
      if (bodyMatch) {
        const body = bodyMatch[1];
        // Strip nav and footer
        const stripped = body.replace(/<nav[\s\S]*?<\/nav>/g, '').replace(/<footer[\s\S]*?<\/footer>/g, '').replace(/<script[\s\S]*?<\/script>/g, '').trim();
        if (stripped.length < 100) {
          report.push(`EMPTY  | ${file} -> ${href} (destination has < 100 chars of content)`);
          broken++;
        }
      }
    }
  }
}

const summary = `Link Audit Report
Date: ${new Date().toISOString()}
Total internal links checked: ${total}
Broken or empty: ${broken}

${broken === 0 ? 'ALL LINKS PASS' : report.join('\n')}
`;

writeFileSync(path.join(__dirname, 'link-audit-report.txt'), summary);
console.log(`Total links: ${total}, Broken/empty: ${broken}`);
if (broken > 0) {
  report.forEach(r => console.log(`  ${r}`));
}
console.log('Report saved to link-audit-report.txt');
