const CACHE = 'pmi-mind-v23';
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/proyecto.html',
    '/styles.css',
    '/auth.js',
    '/js/vendor/feather.min.js',
    '/js/services/DataService.js',
    '/js/config-global.js?v=20260917a',
    '/js/panels/resumen-procesos.js?v=20260917a',
    '/js/panels/panel-salud.js?v=20260917a',
    '/js/panels/panel-informe.js?v=20260917a',
    '/js/panels/venta-cashflow.js?v=20260917a',
    '/js/panels/agenda.js?v=20260925b',
    '/js/panels/acta-roles.js?v=20260916h',
    '/js/panels/edt-panel.js?v=20260916h',
    '/js/panels/scrum.js?v=20260925a',
    '/js/panels/navegacion-auth.js?v=20260916h',
    '/js/panels/gantt.js?v=20260916i',
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
    const url = new URL(e.request.url);
    if (url.origin !== self.location.origin) return;
    e.respondWith(
        fetch(e.request).then(res => {
            if (res && res.ok) {
                const clone = res.clone();
                caches.open(CACHE).then(cache => cache.put(e.request, clone));
            }
            return res;
        }).catch(() => caches.match(e.request).then(c => c || Response.error()))
    );
});
