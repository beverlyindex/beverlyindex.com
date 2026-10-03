/* Remiel Halo service worker.
   The network always comes first, so an installed Halo is never older than the site.
   The saved copy is used only when the network cannot be reached, so the console still opens. */
const SHELL = 'halo-shell-v1';
const KEEP = ['./', 'halo-logo.png', 'icon-192.png', 'manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(KEEP)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SHELL).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;       // the backend, the feed and the map are never touched here
  if (!url.pathname.startsWith(new URL('./', self.location).pathname)) return;
  const page = req.mode === 'navigate';
  e.respondWith(
    fetch(req, page ? { cache: 'no-store' } : undefined).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(SHELL).then(c => c.put(page ? './' : req, copy)).catch(() => {}); }
      return res;
    }).catch(() => caches.match(page ? './' : req).then(hit => hit || Response.error()))
  );
});
