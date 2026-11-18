import fs from 'node:fs';
import path from 'node:path';

/**
 * Genera PRECACHE_URLS desde los assets realmente enlazados en los 3 HTML.
 * Se ejecuta antes del build para que el service worker nunca quede desincronizado.
 */
const ROOT = process.cwd();
const HTMLS = ['index.html', 'dashboard.html', 'proyecto.html'];
const EXTRAS = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/proyecto.html',
    '/fonts/InterVariable.woff2',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    // El dynamic import se sirve desde el bundle estable generado por Vite.
    '/js/services/supabaseClient.bundle.js'
];
const BEGIN = '    // BEGIN GENERATED PRECACHE';
const END = '    // END GENERATED PRECACHE';

const urls = new Set(EXTRAS);
for (const html of HTMLS) {
    const content = fs.readFileSync(path.join(ROOT, html), 'utf8');
    const patterns = [
        /<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi,
        /<link\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi
    ];
    for (const pattern of patterns) {
        for (const match of content.matchAll(pattern)) {
            const raw = match[1].trim();
            if (!raw || /^(https?:)?\/\//i.test(raw) || raw.startsWith('data:')) continue;
            const clean = raw.replace(/^\.\//, '').replace(/^#/, '');
            if (!clean) continue;
            urls.add(clean.startsWith('/') ? clean : '/' + clean);
        }
    }
}

// Los bundles con hash de Vite sólo existen después de `vite build`.
const assetsDir = path.join(ROOT, 'dist', 'assets');
if (fs.existsSync(assetsDir)) {
    for (const archivo of fs.readdirSync(assetsDir)) {
        urls.add('/assets/' + archivo);
    }
}

function existeEnDespliegue(url) {
    const limpio = url.split('?')[0].replace(/^\//, '');
    return !limpio || fs.existsSync(path.join(ROOT, limpio)) || fs.existsSync(path.join(ROOT, 'dist', limpio));
}

const validas = [...urls].filter(existeEnDespliegue);
const ausentes = [...urls].filter(url => !existeEnDespliegue(url));
if (ausentes.length) console.warn('Precache: recursos omitidos por no existir:', ausentes);

const sorted = [...validas].sort((a, b) => a.localeCompare(b));
const swPath = path.join(ROOT, 'service-worker.js');
const sw = fs.readFileSync(swPath, 'utf8');
const start = sw.indexOf(BEGIN);
const end = sw.indexOf(END);
if (start === -1 || end === -1) throw new Error('Marcadores de precache no encontrados en service-worker.js');
const generated = [BEGIN, ...sorted.map(u => `    '${u}',`), END].join('\n');
const next = sw.slice(0, start) + generated + sw.slice(end + END.length);
fs.writeFileSync(swPath, next);
console.log(`Precache generado: ${sorted.length} recursos`);
