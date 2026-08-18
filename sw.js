self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('avl-pro-v1').then((cache) => cache.addAll([
      '/',
      '/index.html',
      '/LOGO3.jpeg'
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});