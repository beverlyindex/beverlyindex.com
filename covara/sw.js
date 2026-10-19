/* Remiel: Covara service worker: the app shell offline, and alerts that reach the phone with the app closed. */
const CACHE = 'covara-v1';
const SHELL = ['./', './index.html', './manifest.json', './fonts/dm-sans-latin-400-normal.woff2', './fonts/dm-sans-latin-600-normal.woff2', './fonts/instrument-serif-latin-400-normal.woff2', './fonts/instrument-serif-latin-400-italic.woff2', './fonts/jetbrains-mono-latin-500-normal.woff2'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((n) => Promise.all(n.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
// The page itself is always fetched fresh when online, so a new build reaches the phone at once.
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then((r) => { if (r.ok && r.status === 200) { const c = r.clone(); caches.open(CACHE).then((k) => k.put(e.request, c)); } return r; })
    .catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html'))));
});
self.addEventListener('push', (e) => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: 'Covara', body: e.data ? e.data.text() : '' }; }
  const urgent = !!d.urgent;
  e.waitUntil(Promise.all([
    self.registration.showNotification(d.title || 'Covara', { body: d.body || '', tag: d.tag || undefined, renotify: urgent, requireInteraction: urgent, vibrate: urgent ? [400, 200, 400, 200, 400] : [120], icon: '../halo/icon-192.png', badge: '../halo/icon-192.png', data: { url: d.url || './' } }),
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => cs.forEach((c) => c.postMessage({ type: 'PUSH_RECEIVED', payload: d }))),
  ]));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
    const c = cs.find((x) => x.url.startsWith(self.registration.scope));
    if (c) { c.postMessage({ type: 'NOTIFICATION_CLICK' }); return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
