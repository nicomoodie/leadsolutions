// Always fetch fresh — no caching at all
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Always go to network, never cache
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).catch(function() {
      // Only fall back to cache if network fails entirely
      return caches.match(e.request);
    })
  );
});
