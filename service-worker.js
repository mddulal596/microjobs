const CACHE_NAME = 'microjob-pro-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/pages/login.html',
  '/pages/dashboard.html',
  '/assets/css/tailwind.css',
  '/firebase/firebase-config.js',
  '/firebase/auth.js',
  '/firebase/firestore.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
