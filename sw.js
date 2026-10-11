const CACHE_NAME = 'avl-pro-v4';

// 1. INSTALACIÓN
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([
      '/',
      '/index.html',
      '/Logotree.png'
    ]))
  );
});

// 2. ACTIVACIÓN (borra las cachés viejas)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// 3. RED PRIMERO: siempre intenta traer la versión nueva; la caché es el respaldo sin internet
self.addEventListener('fetch', (e) => {
  const req = e.request;

  // Solo GET y solo archivos de tu sitio (no tocamos Google Fonts ni Tesseract)
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.status === 200) {
          const copy = res.clone();
          e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }))
  );
});