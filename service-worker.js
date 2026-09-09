const CACHE = 'pmi-mind-v8';
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/proyecto.html',
    '/styles.css',
    '/auth.js',
    '/js/services/DataService.js',
    '/js/panels/agenda.js',
    '/js/panels/navegacion-auth.js',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(PRECACHE_URLS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(k => k !== CACHE).map(k => caches.delete(k))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        caches.match(e.request).then(cached => {
            const fetchPromise = fetch(e.request).then(res => {
                if (res && res.ok) {
                    const clone = res.clone();
                    caches.open(CACHE).then(cache => cache.put(e.request, clone));
                }
                return res;
            }).catch(() => cached);
            return cached || fetchPromise;
        })
    );
});
