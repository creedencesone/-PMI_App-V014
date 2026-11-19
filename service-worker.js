const CACHE = 'pmi-mind-v43';
const PRECACHE_URLS = [
    // BEGIN GENERATED PRECACHE
    '/',
    '/assets/icon-192-COQgdxum.png',
    '/assets/manifest-BAKpTY4j.json',
    '/assets/proyecto-N5h_ow2C.css',
    '/assets/tokens-DsUavYqP.css',
    '/assets/WIP_LOGO-DFlZgxkJ.png',
    '/auth.js?v=20261120e',
    '/dashboard.html',
    '/design-system/tokens.css?v=20261120i',
    '/favicon.svg',
    '/fonts/InterVariable.woff2',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/index.html',
    '/js/config-global.js?v=20260917a',
    '/js/config.js',
    '/js/core/audit.js?v=20261120e',
    '/js/core/collections.js',
    '/js/core/csv.js',
    '/js/core/dates.js',
    '/js/core/evm.js?v=20261120e',
    '/js/core/finance.js',
    '/js/core/keyboard-a11y.js?v=20261120e',
    '/js/core/linea-base.js?v=20261120e',
    '/js/core/modal-a11y.js?v=20261120e',
    '/js/core/raci.js?v=20261120e',
    '/js/core/ui.js',
    '/js/core/wbs.js?v=20261120e',
    '/js/core/whatif.js',
    '/js/i18n.js',
    '/js/main.js',
    '/js/motion.js',
    '/js/motion.js?v=20261120f',
    '/js/panels/acta-roles.js?v=20261120g',
    '/js/panels/agenda.js?v=20261120e',
    '/js/panels/beneficios-cambios-lecciones.js?v=20261120e',
    '/js/panels/carga-trabajo.js?v=20261120e',
    '/js/panels/compartir.js?v=20261117a',
    '/js/panels/comunicaciones.js',
    '/js/panels/edt-panel.js?v=20261120e',
    '/js/panels/equipo-servicios.js',
    '/js/panels/financiero-monedas.js',
    '/js/panels/gantt.js?v=20261120g',
    '/js/panels/garantia-viajes-avales.js?v=20260917a',
    '/js/panels/grafico-monedas.js',
    '/js/panels/ia-analisis.js',
    '/js/panels/import-export.js',
    '/js/panels/logistica-3d.js?v=20261120e',
    '/js/panels/manual.js?v=4',
    '/js/panels/materiales.js',
    '/js/panels/montecarlo.js?v=20261120e',
    '/js/panels/navegacion-auth.js?v=20261120e',
    '/js/panels/organigrama.js',
    '/js/panels/panel-informe.js?v=20260917a',
    '/js/panels/panel-salud.js?v=20261120e',
    '/js/panels/resumen-procesos.js?v=20261120e',
    '/js/panels/riesgos.js?v=20261120e',
    '/js/panels/scrum.js?v=20261120e',
    '/js/panels/stakeholders.js',
    '/js/panels/venta-cashflow.js?v=20261120e',
    '/js/services/DataService.js',
    '/js/services/DataService.js?v=20261117a',
    '/js/services/DataService.js?v=20261120e',
    '/js/services/supabaseClient.bundle.js',
    '/js/utils.js',
    '/js/vendor/chart-fallback.js?v=20261117a',
    '/js/vendor/chart.umd.min.js?v=20261117a',
    '/js/vendor/email.min.js?v=20261117a',
    '/js/vendor/feather.min.js',
    '/js/vendor/html2canvas.min.js?v=20261117a',
    '/js/vendor/pbkdf2.js?v=20261120e',
    '/js/vendor/pdfjs/pdf.min.js?v=20261117a',
    '/js/vendor/three/DragControls.js?v=20261117a',
    '/js/vendor/three/OrbitControls.js?v=20261117a',
    '/js/vendor/three/three.min.js?v=20261117a',
    '/manifest.json',
    '/proyecto.html',
    '/styles.css?v=20261120e',
    // END GENERATED PRECACHE
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(async cache => {
        // Un recurso ausente no debe impedir instalar todo el service worker.
        const resultados = await Promise.allSettled(PRECACHE_URLS.map(url => cache.add(url)));
        const fallidos = resultados
            .map((resultado, indice) => resultado.status === 'rejected' ? PRECACHE_URLS[indice] : null)
            .filter(Boolean);
        if (fallidos.length) console.warn('[SW] recursos no precacheados:', fallidos);
    }));
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
        }).catch(async () => {
            // Vite añade cabeceras Vary a los assets: la coincidencia estricta
            // falla sin red aunque el recurso esté en el precache.
            const opciones = { ignoreVary: true, ignoreSearch: true };
            const local = await caches.match(e.request, opciones);
            if (local) return local;
            for (const nombre of await caches.keys()) {
                const cache = await caches.open(nombre);
                const alternativa = await cache.match(e.request, opciones);
                if (alternativa) return alternativa;
            }
            return Response.error();
        })
    );
});
