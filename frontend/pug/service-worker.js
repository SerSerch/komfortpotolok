let doCache = true;

const CACHE_NAME = 'my-pwa-cache-v1';

self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(keyList =>
        Promise.all(keyList.map(key => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        }))
      )
  );
});

self.addEventListener('install', function(event) {
  if (doCache) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          const urlsToCache = [
            "/",
            "/bundle.js",
            "/main.css",
            "/svg/logo.svg",
            "/img/imgslide1.jpg",
            "/img/imgslide2.jpg",
            "/img/imgtextures1.jpg",
            "/img/imgtextures2.jpg",
            "/img/imgtextures3.jpg",
            "/img/imgtextures4.jpg",
            "/img/imgtextures5.jpg",
            "/img/imgclose.png",
            "/img/2yr0.jpg",
            "/img/bezsh0.jpg",
            "/img/contr0.jpg",
            "/img/double0.jpg",
            "/img/line0.jpg",
            "/img/par0.jpg",
            "/img/photo0.jpg",
            "/img/pk50.jpg",
            "/img/polu0.jpg",
            "/img/ppoz0.jpg",
            "/img/ten0.jpg",
            "/img/tkan0.jpg"
          ]
          cache.addAll(urlsToCache);
        })
    );
  }
});

self.addEventListener('fetch', function(event) {
  if (doCache) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});