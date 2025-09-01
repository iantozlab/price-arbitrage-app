const CACHE_NAME = 'price-arbitrage-v1';
const urlsToCache = ['/', '/style.css', '/script.js'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});