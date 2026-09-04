#!/usr/bin/env node
// ============================================================
// apply-sql-via-mgmt.mjs — Aplica un archivo SQL al proyecto
// Supabase usando la Management API (requiere un PAT).
//
// Uso:
//   node scripts/apply-sql-via-mgmt.mjs <sql-file-path>
//
// Env:
//   SUPABASE_PROJECT_REF  (ej. zkovoehqwrzapsszrhlz)
//   SUPABASE_ACCESS_TOKEN (PAT de Supabase — NUNCA commiteado)
// ============================================================
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , sqlFileArg] = process.argv;
if (!sqlFileArg) {
    console.error('Uso: node scripts/apply-sql-via-mgmt.mjs <sql-file-path>');
    process.exit(1);
}

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF;
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
if (!PROJECT_REF) { console.error('Falta SUPABASE_PROJECT_REF'); process.exit(1); }
if (!ACCESS_TOKEN) { console.error('Falta SUPABASE_ACCESS_TOKEN'); process.exit(1); }

const sqlPath = resolve(sqlFileArg);
const sql = readFileSync(sqlPath, 'utf8');

// Dividir en statements solo si es necesario; la management API acepta
// bloques SQL con varios statements en el campo "query".
const url = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`;

console.log(`Aplicando ${sqlPath} (${sql.length} bytes) al proyecto ${PROJECT_REF}...`);

const res = await fetch(url, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
});

const text = await res.text();
if (res.ok) {
    console.log('OK — esquema aplicado sin error.');
    console.log(text.slice(0, 500));
} else {
    console.error(`ERROR HTTP ${res.status}:`);
    console.error(text);
    process.exit(1);
}
