import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    base: '/',
    server: {
        port: 5173,
        open: true
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: 'index.html',
                dashboard: 'dashboard.html',
                proyecto: 'proyecto.html',
                supabaseClient: 'js/services/supabaseClient.entry.js'
            },
            output: {
                // Nombre estable (sin hash) para que DataService (script clásico)
                // pueda referenciarlo sin conocer el hash de cada build.
                entryFileNames: (chunk) =>
                    chunk.name === 'supabaseClient' ? 'js/services/supabaseClient.bundle.js' : 'assets/[name]-[hash].js'
            }
        }
    }
});
