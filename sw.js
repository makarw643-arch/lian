/* Lian Planner Service Worker — Offline-First App Shell & Smart Caching */
const CACHE_VERSION = 'lian-pwa-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)));
    if (self.registration && self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (e) {}
    }
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigation requests: serve cached shell instantaneously when offline/slow, refresh in background
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_VERSION);
      const cached = (await cache.match('/index.html')) || (await cache.match('/'));

      const networkFetch = (async () => {
        try {
          const preload = event.preloadResponse ? await event.preloadResponse : null;
          const res = preload || await fetch(req);
          if (res && res.ok && res.type === 'basic') {
            cache.put('/index.html', res.clone()).catch(() => {});
          }
          return res;
        } catch (e) {
          return null;
        }
      })();

      if (cached) {
        event.waitUntil(networkFetch);
        return cached;
      }

      const fresh = await networkFetch;
      if (fresh) return fresh;
      return new Response('Offline — open Lian once while online to cache.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    })());
    return;
  }

  // Same-origin static assets: Stale-While-Revalidate for fast mobile loads & offline support
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(req);
    const networkFetch = fetch(req).then((res) => {
      if (res && res.ok && res.type === 'basic') {
        cache.put(req, res.clone()).catch(() => {});
      }
      return res;
    }).catch(() => null);

    if (cached) {
      event.waitUntil(networkFetch);
      return cached;
    }
    const fresh = await networkFetch;
    return fresh || new Response('', { status: 504 });
  })());
});
