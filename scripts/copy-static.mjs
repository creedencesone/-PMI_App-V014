// ============================================
// copy-static — Copia los assets estáticos de la raíz
// al directorio de salida (dist/) para que el despliegue
// sirva correctamente los scripts y estilos referenciados
// por los HTML sin ser procesados por Vite.
//
// El app usa scripts clásicos (sin type="module") con
// rutas relativas (auth.js, js/..., styles.css, logo.png).
// Vercel sirve dist/, por lo que estos archivos deben
// existir también en dist/ para que las etiquetas <script>
// y <link> resuelvan.
// ============================================
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// Elementos raíz que deben copiarse a dist/ tal cual.
// Rutas relativas a la raíz del proyecto.
const items = [
    'auth.js',
    'js',            // árbol completo (config, core, panels, services, ...)
    'styles.css',
    'logo.png',
    'logo.svg',
    'css',           // estilos adicionales si existen
    'design-system', // tokens publicados tal cual para el HTML desplegable
    'icons',         // iconos de la PWA
    'img',           // imágenes (capturas del manual de usuario, etc.)
    'manifest.json',
    'service-worker.js',
    'Packing List.pdf',
    'LogosWIP',      // logos nuevo (WIP_LOGO.png, WIP_LOGO_BLACK.png, WIP_LOGO_02.png, WORK_IN_PROGRESS.png)
];

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            // No copiar dist/ recursivamente ni directorios de build/runtime
            if (entry.name === 'dist' || entry.name === 'node_modules' || entry.name === '.git') continue;
            copyDir(srcPath, destPath);
        } else if (entry.isFile()) {
            // Los entries *.entry.js se sirven solo por Vite (bundlizados);
            // copiarlos tal cual serviría un módulo con import 'bare' roto.
            if (entry.name.endsWith('.entry.js')) continue;
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

let copied = 0;
let skipped = 0;
for (const item of items) {
    const srcPath = path.join(rootDir, item);
    const destPath = path.join(distDir, item);
    if (!fs.existsSync(srcPath)) {
        console.log(`skip (no existe): ${item}`);
        skipped++;
        continue;
    }
    if (fs.statSync(srcPath).isDirectory()) {
        copyDir(srcPath, destPath);
    } else {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);
    }
    console.log(`copiado: ${item}`);
    copied++;
}

console.log(`\nStatic copy: ${copied} items copiados, ${skipped} omitidos -> dist/`);
