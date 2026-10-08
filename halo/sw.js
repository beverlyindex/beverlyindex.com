/* Remiel service worker.
   The network always comes first, so an installed Remiel is never older than the site.
   The saved copy is used only when the network cannot be reached, so the console still opens. */
const SHELL = 'remiel-shell-v1';
const KEEP = ['./', 'remiel-technologies-logo.png', 'icon-192.png', 'manifest.webmanifest'];

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

/* A tap on a Remiel alert banner brings Remiel to the front and tells the page which alert it was. */
self.addEventListener('notificationclick', e => {
  const key = (e.notification.data && e.notification.data.key) || e.notification.tag || '';
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const home = new URL('./', self.location).href, c = list.find(x => x.url.indexOf(home) === 0);
    if (c) { c.postMessage({ haloOpen: key }); return c.focus(); }
    return self.clients.openWindow(home);
  }));
});
