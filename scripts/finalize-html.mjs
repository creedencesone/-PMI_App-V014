import fs from 'node:fs';
import path from 'node:path';

/**
 * Vite empaqueta los enlaces `design-system/tokens*.css` del dashboard y
 * termina descartando `tokens.css`. Este paso reinserta la fuente única de
 * tokens en el HTML desplegable, antes de los estilos compilados.
 *
 * Se inyecta UNA SOLA hoja de tokens (tokens.css es la fuente de verdad;
 * tokens-shared.css es un shim vacío de compatibilidad) y se eliminan los
 * enlaces duplicados que Vite genera en assets/. Resultado: 2 hojas finales
 * (tokens + bundle), en lugar de 4.
 */
const ROOT = process.cwd();
const VERSION = '20261121h';
const LINKS = `<link rel="stylesheet" href="/design-system/tokens.css?v=${VERSION}">`;

for (const nombre of ['dashboard.html', 'proyecto.html']) {
    const ruta = path.join(ROOT, 'dist', nombre);
    if (!fs.existsSync(ruta)) continue;
    let html = fs.readFileSync(ruta, 'utf8');
    // Eliminar TODAS las hojas de tokens previas (inyectadas o generadas por Vite)
    // para dejar una única fuente de verdad.
    html = html.replace(/^\s*<link rel="stylesheet"[^>]*href="\/design-system\/tokens(?:-shared)?\.css[^"]*"[^>]*>\s*$/gmi, '');
    html = html.replace(/^\s*<link rel="stylesheet"[^>]*href="\/assets\/tokens-[^"]+\.css"[^>]*>\s*$/gmi, '');
    const titulo = html.match(/<\/title>/i);
    if (!titulo) throw new Error(`Sin </title> en dist/${nombre}`);
    const punto = titulo.index + titulo[0].length;
    html = html.slice(0, punto) + `\n  ${LINKS}` + html.slice(punto);
    fs.writeFileSync(ruta, html);
    console.log(`Tokens restablecidos en dist/${nombre}`);
}
