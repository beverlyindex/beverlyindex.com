// DREAM CODE service worker 0.1.0+20261015.1802. The page is fetched fresh when online; fonts, icons and data are cached.
const CACHE = 'dreamcode-0.1.0+20261015.1802';
const CORE = ['./', 'index.html', 'logo.png', 'icon-192.png', 'fonts/pt-serif-latin-400-normal.woff2', 'fonts/pt-serif-latin-700-normal.woff2', 'fonts/inter-latin-400-normal.woff2', 'fonts/inter-latin-600-normal.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // the API is never cached
  // Films are streamed straight from the network: the player asks for parts of the file (range requests), which a
  // cached copy would answer badly, and passing them through here makes playback stall.
  if (e.request.headers.has('range') || /.(mp4|webm)$/i.test(u.pathname)) return;
  const isPage = e.request.mode === 'navigate' || u.pathname.endsWith('/') || u.pathname.endsWith('index.html');
  if (isPage || u.pathname.includes('/data/')) {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(m => m || fetch(e.request).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; })));
  }
});
