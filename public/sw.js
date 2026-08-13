// public/sw.js
const CACHE_NAME = 'color-harmony-v2.08';

const PRECACHE_ASSETS = [
  './',
  'index.html',
  'manifest.json'
];

// 1. Kurulum (Install)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Etkinleştirme (Activate)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== CACHE_NAME)
          .map((cache) => caches.delete(cache))
      );
    })
  );
  self.clients.claim();
});

// 3. Ağ İsteklerini Yakalama (Fetch Strategy)
self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;
  if (!request.url.startsWith('http')) return;

  // A) Sayfa Açılış İsteği (Network-First + Fallback)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('./') || caches.match('index.html');
          });
        })
    );
    return;
  }

  // B) Statik Varlıklar (JS, CSS, Resimler)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          return new Response('Çevrimdışı içerik bulunamadı.', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
    })
  );
});