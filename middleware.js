// Server-side access gate for Beverly Index private areas.
// Runs on Vercel Routing Middleware before any file is served.
// A request for a protected area is redirected to /gate.html unless it
// carries a valid signed cookie issued by /api/unlock for that area.

import { next } from '@vercel/functions';

// Area name -> path prefixes it covers. Keep in sync with api/unlock.js.
const AREAS = {
  carecircle: ['/carecircle/'],
  pathfinder: ['/pathfinder/'],
  remiel: ['/remiel/'],
  covara: ['/covara/'],
  halo: ['/halo/'],
  proteus: ['/product/proteus.html'],
  optics: ['/product/remiel-optics.html'],
};

export const config = {
  matcher: [
    '/carecircle/:path*',
    '/pathfinder/:path*',
    '/remiel/:path*',
    '/covara/:path*',
    '/halo/:path*',
    '/product/proteus.html',
    '/product/remiel-optics.html',
  ],
};

function areaFor(pathname) {
  for (const [area, prefixes] of Object.entries(AREAS)) {
    for (const p of prefixes) {
      if (pathname === p || pathname.startsWith(p) || pathname + '/' === p) return area;
    }
  }
  return null;
}

function readCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > -1 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Cookie value format: <area>.<expiresEpochSeconds>.<hmacHex>
async function validToken(token, area, secret) {
  if (!token || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [a, exp, sig] = parts;
  if (a !== area) return false;
  if (!/^\d+$/.test(exp) || Number(exp) < Math.floor(Date.now() / 1000)) return false;
  const expected = await hmacHex(secret, `${a}.${exp}`);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const area = areaFor(url.pathname);
  if (!area) return next();

  const token = readCookie(request.headers.get('cookie'), `bi_gate_${area}`);
  if (await validToken(token, area, process.env.GATE_SECRET)) return next();

  const gate = new URL('/gate.html', url.origin);
  gate.searchParams.set('area', area);
  gate.searchParams.set('next', url.pathname + url.search);
  return Response.redirect(gate.toString(), 302);
}
