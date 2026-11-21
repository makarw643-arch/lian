const CACHE_NAME = 'lian-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
  '/js/three.min.js',
  '/fonts/bebas-neue.woff2',
  '/fonts/pixelify-sans-500.woff2',
  '/fonts/pixelify-sans-700.woff2',
  '/fonts/vazirmatn-400.woff2',
  '/fonts/vazirmatn-600.woff2',
  '/fonts/vazirmatn-700.woff2',
  '/assets/favicon-32.png',
  '/assets/apple-touch-icon.png',
  '/assets/face.jpg',
  '/assets/manifest-192x192.png',
  '/assets/manifest-512x512.png',
  '/assets/manifest-512x512-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});
