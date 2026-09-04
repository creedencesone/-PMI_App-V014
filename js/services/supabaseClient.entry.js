// ============================================
// supabaseClient.entry — Entrada ESM que Vite bundlea en
// dist/js/services/supabaseClient.bundle.js. Lee las credenciales
// de Vite (import.meta.env.VITE_*) y expone el cliente en globalThis
// para que DataService (script clásico) pueda consumirlo.
// ============================================
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
    throw new Error('SUPABASE_URL no configurada: define VITE_SUPABASE_URL en tu archivo .env');
}

if (!SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_ANON_KEY no configurada: define VITE_SUPABASE_ANON_KEY en tu archivo .env');
}

globalThis.__SUPABASE__ = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);