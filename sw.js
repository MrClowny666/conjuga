// Cache-first service worker: everything the app needs is precached, so it runs offline after the first visit.
// Bump VERSION whenever any of these files change, so phones fetch the new copies.
const VERSION = 'conjuga-v9';
const FILES = [
  'conjuga.html',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'fonts/bricolage-grotesque-latin.woff2',
  'fonts/atkinson-hyperlegible-400-latin.woff2',
  'fonts/atkinson-hyperlegible-700-latin.woff2',
  'fonts/atkinson-hyperlegible-400italic-latin.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request))
  );
});
