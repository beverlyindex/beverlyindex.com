// Encrypts one app page into an encrypted payload for the Beverly Index gate.
// Usage: node tools/encrypt-app.mjs <source.html> <output.enc.json> <codes.json>
// codes.json: { "primary": "CODE-ONE", "tester": "CODE-TWO" }  (holder label -> access code)
// The source file and codes.json must live outside the public repository.

import fs from 'fs';
import zlib from 'zlib';
import { webcrypto as crypto } from 'crypto';

const [src, out, codesFile] = process.argv.slice(2);
if (!src || !out || !codesFile) {
  console.error('Usage: node tools/encrypt-app.mjs <source.html> <output.enc.json> <codes.json>');
  process.exit(1);
}
const ITER = 250000;
const b64 = (u) => Buffer.from(u).toString('base64');
const te = new TextEncoder();

const html = fs.readFileSync(src);
const codes = JSON.parse(fs.readFileSync(codesFile, 'utf8'));
const contentKey = crypto.getRandomValues(new Uint8Array(32));
const iv = crypto.getRandomValues(new Uint8Array(12));
const key = await crypto.subtle.importKey('raw', contentKey, 'AES-GCM', false, ['encrypt']);
const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, zlib.gzipSync(html, { level: 9 })));

const entries = [];
for (const [who, code] of Object.entries(codes)) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const wiv = crypto.getRandomValues(new Uint8Array(12));
  const pass = await crypto.subtle.importKey('raw', te.encode(String(code).trim().toUpperCase()), 'PBKDF2', false, ['deriveKey']);
  const kek = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
    pass, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const wk = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: wiv }, kek, contentKey));
  entries.push({ who, salt: b64(salt), iv: b64(wiv), wk: b64(wk) });
}
fs.writeFileSync(out, JSON.stringify({ v: 1, iter: ITER, entries, iv: b64(iv), ct: b64(ct) }));
console.log(`Encrypted ${src} -> ${out} (${entries.length} code(s), ${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
