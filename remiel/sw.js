/* ═══════════════════════════════════════════════════════════
   Remiel Sentinel — Service Worker
   Cache-first PWA shell with notification support.
   No server dependency. Everything stays on-device.
   ═══════════════════════════════════════════════════════════ */

const CACHE_NAME = 'remiel-sentinel-v6';

const PRECACHE_URLS = [
  './',
  './app.html',
  './manifest.json',
  './sw.js',
  './remiel-logo.png'
];

/* ── Install: pre-cache core shell ── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: purge stale caches, claim all clients ── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch: cache-first with stale-while-revalidate for shell assets ── */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  /* Only cache same-origin resources */
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      /* Stale-while-revalidate: serve cache immediately,
         fetch in background to keep cache fresh */
      const networkFetch = fetch(event.request).then((response) => {
        if (response && response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(() => {
        /* Network unavailable — offline is fine, cache is served above */
        return undefined;
      });

      return cached || networkFetch;
    })
  );
});

/* ── Push: handle server-sent push events ──
   Push subscription and server integration not wired yet,
   but the handler is ready for when they are. */
self.addEventListener('push', (event) => {
  let data = {
    title: 'Remiel Sentinel',
    body: 'Someone may need your attention.',
    tag: 'remiel-push',
    url: './'
  };

  if (event.data) {
    try {
      const json = event.data.json();
      data.title = json.title || data.title;
      data.body = json.body || data.body;
      data.tag = json.tag || data.tag;
      data.url = json.url || data.url;
    } catch (e) {
      data.body = event.data.text() || data.body;
    }
  }

  const options = {
    body: data.body,
    icon: './remiel-logo.png',
    badge: './remiel-logo.png',
    tag: data.tag,
    renotify: true,
    requireInteraction: false,
    data: { url: data.url }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/* ── Notification Click: focus existing window or open new one ── */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url)
    ? new URL(event.notification.data.url, self.location.origin).href
    : self.location.origin + '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        /* If the app is already open in a tab, focus it */
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.startsWith(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        /* Otherwise open a fresh window */
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});

/* ── Message: handle requests from the app ── */
self.addEventListener('message', (event) => {
  if (!event.data || !event.data.type) return;

  switch (event.data.type) {
    case 'SHOW_NOTIFICATION': {
      const options = {
        body: event.data.body || '',
        icon: './remiel-logo.png',
        badge: './remiel-logo.png',
        tag: event.data.tag || 'remiel-alert',
        renotify: true,
        requireInteraction: false,
        data: { url: event.data.url || './' }
      };
      self.registration.showNotification(
        event.data.title || 'Remiel Sentinel',
        options
      );
      break;
    }

    case 'SKIP_WAITING': {
      self.skipWaiting();
      break;
    }

    case 'CACHE_UPDATED': {
      /* App signals that resources may have changed — re-cache shell */
      caches.open(CACHE_NAME).then((cache) => {
        PRECACHE_URLS.forEach((url) => {
          cache.add(url).catch(() => {});
        });
      });
      break;
    }
  }
});
