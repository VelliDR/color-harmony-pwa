// public/sw.js
const CACHE_NAME = 'color-harmony-v2';

// Önbelleğe alınacak çekirdek statik dosyalar (Göreceli yollar)
const PRECACHE_ASSETS = [
  './',
  'index.html',
  'manifest.json'
];

// 1. Kurulum (Install) - Çekirdek dosyaları önbelleğe al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Yeni SW'nin anında aktifleşmesini sağla
  self.skipWaiting();
});

// 2. Etkinleştirme (Activate) - Eski önbellekleri temizle ve kontrolü ele al
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

  // Güvenlik 1: Sadece GET isteklerini işle (POST, PUT vb. önbelleğe alınamaz)
  if (request.method !== 'GET') return;

  // Güvenlik 2: Sadece http ve https protokollerini işle (chrome-extension:// vb. engelle)
  if (!request.url.startsWith('http')) return;

  // A) NAVİGASYON/SAYFA İSTEKLERİ (index.html için Network-First)
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
          // İnternet yoksa önbellekteki index.html'i ver (GitHub Pages uyumlu)
          return caches.match('index.html') || caches.match('./');
        })
    );
    return;
  }

  // B) STATİK VARLIKLAR (JS, CSS, Görsel, Fontlar için Cache-First)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          // Geçersiz yanıtları önbelleğe alma
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
          // Çevrimdışı durumda statik varlık bulunamazsa boş yanıt dön
          return new Response('Çevrimdışı içerik bulunamadı.', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
    })
  );
});