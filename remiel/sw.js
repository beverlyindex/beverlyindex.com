/* ═══════════════════════════════════════════════════════════
   Remiel Sentinel — Service Worker
   Cache-first PWA shell with notification support.
   No server dependency. Everything stays on-device.
   ═══════════════════════════════════════════════════════════ */

const CACHE_NAME = 'remiel-sentinel-v51';

const PRECACHE_URLS = [
  './',
  './app.html',
  './manifest.json',
  './sw.js',
  './remiel-logo.png',
  './icon-192.png',
  './icon-512.png'
];

/* ── Install: pre-cache core shell ──
   No automatic skipWaiting: an updated worker waits until the app shows the
   "new version" banner and the user taps Reload (message SKIP_WAITING). */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(PRECACHE_URLS.map((u) => cache.add(u).catch(() => {})))
    )
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

/* ── Fetch: cache-first with background revalidation for shell assets ──
   Never cache partial (206) or non-200 responses, Range requests, or
   anything under videos/. Offline misses fall back to the cached app shell
   for navigations and to a 503 Response otherwise (never undefined). */
function _isCacheable(request, url) {
  if (request.headers.has('range')) return false;
  if (/\/videos\//.test(url.pathname)) return false;
  return true;
}

function _offlineFallback(request) {
  if (request.mode === 'navigate') {
    return caches.match('./app.html').then((r) => r || caches.match('./')).then((r) =>
      r || new Response('Remiel Sentinel is offline. Please reconnect and try again.', {
        status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      })
    );
  }
  return Promise.resolve(new Response('Offline', {
    status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  }));
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  /* Only handle same-origin resources */
  if (url.origin !== self.location.origin) return;

  /* Range and video requests go straight to the network, never cached */
  if (!_isCacheable(request, url)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)).catch(() => {});
        }
        return response;
      });

      if (cached) {
        /* Serve cache now; refresh in the background, ignore failures */
        event.waitUntil(networkFetch.catch(() => {}));
        return cached;
      }
      return networkFetch.catch(() => _offlineFallback(request));
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
            /* Tell the open app what was tapped (for example a link request) */
            try { client.postMessage({ type: 'NOTIFICATION_CLICK', url: targetUrl }); } catch (e) {}
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
