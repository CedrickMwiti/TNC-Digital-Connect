const CACHE_NAME = 'tnc-v4-cache-shared-sync';
const CORE_FILES = [
  './', './index.html', './style.css', './script.js', './knowledge.js',
  './tnc-sync.js', './manifest.json',
  './admin-login.html', './county-admin.html', './hospital-admin.html', './security-admin.html',
  './admin-portals.css', './admin-portals.js', './images/tnc-county-emblem.png',
  './images/icon-192.png', './images/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
