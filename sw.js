const CACHE_NAME = "zinynelis-v2";
const ASSETS = [
  "index.html",
  "style.css",
  "app.js",
  "manifest.json",
  "icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    clients.claim() // <- priverčia naują SW perimt kontrolę
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
