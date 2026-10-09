const CACHE_NAME = 'avvento-storie-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  'https://googleapis.com'
];

// Evento di Installazione: Salva in cache l'interfaccia dell'app
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aperta e risorse in fase di salvataggio');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Evento di Attivazione: Rimuove le vecchie versioni della cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Rimozione vecchia cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento Fetch: Tenta di caricare dalla cache, altrimenti va in rete
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Opzionale: puoi salvare dinamicamente in cache le immagini di Picsum se l'utente è online
        if (event.request.url.includes('picsum.photos')) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // Fallback in caso di totale assenza di rete e risorsa non in cache
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
