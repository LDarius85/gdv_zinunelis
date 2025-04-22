const CACHE_NAME = "zinynelis-v5";
const ASSETS = [
  "index.html",
  "style.css",
  "app.js",
  "manifest.json",
  "icon.png"
];

// Išsaugoti naują cache + priverstinai perimti valdymą
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Aktyvuojant – ištrinti senus cache'us
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch handler
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
