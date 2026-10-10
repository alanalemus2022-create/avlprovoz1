const CACHE_NAME = 'avl-pro-v3'; // Subimos a la versión 3 para obligar al cambio

// 1. INSTALACIÓN
self.addEventListener('install', (e) => {
  // ¡TRUCO MAESTRO! Obliga al nuevo Service Worker a instalarse de inmediato sin esperar a que el usuario cierre la pestaña
  self.skipWaiting(); 
  
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([
      '/',
      '/index.html',
      '/Logotree.png'
    ]))
  );
});

// 2. ACTIVACIÓN (Aquí destruimos la caché vieja de los celulares)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        // Si la caché guardada en el celular no es la "v3", la aniquilamos
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Borrando caché antigua:', key);
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim()) // Toma el control de la pantalla inmediatamente
  );
});

// 3. RECUPERACIÓN DE DATOS
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});