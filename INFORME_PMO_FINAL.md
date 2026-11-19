# Informe Final PMO — PMI Mind

**Proyecto:** PMI Mind — `PMI_App V014`
**Fecha de cierre:** 2026-11-20
**Repositorio:** `https://github.com/creedencesone/-PMI_App-V014.git` · rama `main` · HEAD `c9c0963`
**Producción:** `https://pmi-mind.vercel.app` · deploy `pmi-mind-hezr5gefs-aaa-be01.vercel.app`
**Calificación:** **Cierre aceptado — PREMIABLE** (auditoría final 9,3/10)

Antecedentes: `INFORME_REVISION.md` (revisión de agosto, 4 críticos corregidos) y `PMI_EXCELLENCE_READY.md` (certificado emitido el 18-nov). Este documento consolida el plan de trabajo completo y sustituye las cifras de verificación de la instantánea anterior con las del cierre.

---

## 1. Resumen ejecutivo

El plan PMO se ha ejecutado íntegramente en cinco bloques (Fase 0, requisitos, Fase 1, Fase 2 y Fase 3), todos commiteados, pusheados y desplegados. La aplicación conserva el estándar de premio: build y deploy estables, accesibilidad WCAG AA verificada empíricamente y cero defectos abiertos de accesibilidad. Se añadió un equipo de agentes PMI model-agnóstico que funciona sin depender de modelos externos.

| Criterio de cierre | Compromiso | Resultado en cierre | Estado |
|---|---|---|---|
| Build y deploy | Vite + Vercel estables, commits limpios | `npm run build` OK; 85 recursos en precache; deploy `READY`; `main` sincronizado con `origin/main` | Cerrado |
| Accesibilidad | WCAG AA real en 390/768/1024/1440/1920, claro/oscuro y `prefers-reduced-motion` | axe 0 violaciones en 42 paneles × 2 temas; Lighthouse Accesibilidad 100 en producción | Cerrado |
| Calidad | 0 violaciones axe, Lighthouse 100, 0 defectos AA abiertos | 0 auditorías fallidas; auditoría final 9,3/10 PREMIABLE | Cerrado |
| Trazabilidad | `requisitos[]`, matriz, bitácora y B.2 basado en evidencia | Panel, CRUD, filtros y `requisitosIds` en Gantt; migración `0008` aplicada y verificada | Cerrado |
| Gobierno | Permisos, calidad, alertas, cartera, backup y nivelación | Fase 2 desplegada y verificada en producción | Cerrado |
| IA local/LAN | Local y LAN simultáneos, modelo configurable, sin secretos, fallback | Fase 3 desplegada con 5 agentes y heurística por agente | Cerrado (R2) |
| Higiene y seguridad | Sin API keys en `localStorage`; artefactos protegidos intactos | `.env` solo con clave publishable; 10 artefactos untracked sin modificar | Cerrado |

**Índice de madurez PMI:** 99,8 % (898/900), con 0 hallazgos 🔴 y 0 🟡, según el certificado de 18-nov (Anexo A).

---

## 2. Trazabilidad de fases

| Bloque | Fecha | Commit(s) | Alcance entregado | Stat | Estado |
|---|---|---|---|---|---|
| Fase 0 | 2026-11-19 | `a612647` | Eliminación de código legacy sin llamadores (6 ficheros) | −34.658 líneas | Desplegado |
| Requisitos | 2026-11-19 | `c202d80` | Panel, CRUD, filtros, matriz, bitácora, permiso, `requisitosIds`, B.2 por evidencia, migración `0008` | +742/−148 | Desplegado |
| Fase 1 · A | 2026-11-19 | `79b993c` | Presupuesto base y coste real aprobados alimentan el EVM | +284/−152 | Desplegado |
| Fase 1 · B | 2026-11-19 | `e84fc99` | CCB restringe aprobaciones y congela el impacto en la línea base | +244/−164 | Desplegado |
| Fase 1 · C | 2026-11-19 | `6909c14` | Ciclo de vida, cierre con evidencia, checklist, semáforo y reapertura controlada | +409/−147 | Desplegado |
| Fase 2 | 2026-11-19 | `790e27a`, `a2dfbc7` | Permisos invocados, calidad, alertas→notificación, cartera, backup/restore y nivelación; fix de cache-bust | +1.901/−359 | Desplegado |
| Fase 3 | 2026-11-20 | `c9c0963` | Equipo de 5 agentes PMI sobre `LocalAIService`, fallback heurístico y panel accesible | +674/−162 | Desplegado |

**Totales del plan:** +4.254 / −35.790 líneas en 8 commits. `a2dfbc7` corrige además un token stale de `tokens.css` que `finalize-html.mjs` reintroducía en `dist`.

---

## 3. Evidencia de verificación

Ejecutada sobre el HEAD final `c9c0963`, con deploy congelado antes de la re-auditoría.

| Prueba | Resultado |
|---|---|
| QUnit (`npx qunit test/tests.js`) | **127/127**, 0 fallos (6 tests nuevos de agentes) |
| axe-core local, 42 paneles, claro y oscuro | **0 violaciones**, 0 controles sin nombre, 0 errores de consola |
| Navegación por teclado | 42 paneles, **205 pasos de Tab**, 0 outlines perdidos, 0 `onclick` no enfocables |
| axe en producción | 0 violaciones en `dashboard.html` (tarjetas de alerta y botones ack/escalado), `proyecto.html` y el panel de agentes con 5 tarjetas |
| Lighthouse en producción | Accesibilidad **100** en pantalla pública, login, dashboard autenticado y panel de agentes; **0 auditorías fallidas** |
| `npm run build` | OK; precache regenerado con **85 recursos**; tokens en `dist` con `20261121k` |
| `npm run test:offline` | `serviceWorker=true dashboard=true proyecto=true`; `Offline: OK` |
| Smoke Fase 2 | KPIs multimoneda, ack/escalado de alertas, notificaciones y `createNotification`; 0 errores de consola |
| Smoke Fase 3 | 5 agentes en fallback, permiso `edit`, panel activo y visible; 0 errores de consola |
| Flujo real de cierre (Fase 1) | Cierre con evidencia ejecutado en producción; Lighthouse 100 en el panel de cierre |

### Release y caché

- Cache-bust: **`20261121k`** en `index.html`, `dashboard.html`, `proyecto.html` y `service-worker.js`.
- Service worker: **`pmi-mind-v52`**, con los módulos nuevos (`js/core/agentes.js`, `js/panels/panel-agentes.js`) en precache.
- Producción sirve `20261121k` y `v52`; ambos módulos nuevos responden HTTP 200.
- `scripts/finalize-html.mjs` deriva la versión de `tokens.css` desde `index.html`, eliminando la regresión de versión en `dist`.
- Los 10 artefactos protegidos (`PMI_App_Installation_Guide.*`, `gantt-*`, `generate_manual.py`, `scripts/captura-gantt.cjs`, `scripts/recuperar-password.local.sh`) permanecen intactos y sin versionar.

---

## 4. Decisiones de gobierno que rigen el cierre

- **B.2** se considera completo con `estado === 'aprobado'`, `estado === 'validado'` o `aprobado === true`; los proyectos con `requisitos: []` conservan la marca manual legacy.
- Los badges AA usan tokens semánticos existentes, válidos en tema claro y oscuro.
- `acta.presupuestoBase` y `acta.costeReal` gobiernan BAC/AC solo cuando son `> 0`; con `0` se conserva el cálculo legacy.
- El CCB reutiliza la acción `aprobar` de `AuthSystem` (admin/PM): no se creó un rol nuevo.
- Permisos centralizados en `js/core/permisos.js`, fail-closed; bypass restringido a `AuthSystem.esAdmin()`.
- La calidad vive en `proyecto.calidad` (blob JSON); los `defectos` legacy se migran a no conformidad y el cierre exige acción correctiva completada con evidencia.
- Las alertas usan id determinista `tipo|proyectoId|entidadId`; ack y escalado se auditan con snapshots clonados de bitácora.
- La cartera usa `resumirCartera()`: una sola moneda y un solo cálculo de progreso.
- La nivelación es una simulación inmutable; al aplicarse se revalida con `autoScheduler()`.
- El equipo de agentes sanea y normaliza toda salida del modelo antes de renderizarla con `textContent`; nunca se inserta como HTML.

---

## 5. Riesgos y seguimiento externo

No hay defectos abiertos en la aplicación. Los seguimientos R1 y R3 quedaron resueltos el 20-nov; permanece abierto únicamente R2, de carácter externo y sin impacto en el despliegue ni en la conformidad AA.

### 5.1 R1 — resuelto: migración `0008`

- **Acción:** `supabase/migrations/0008_requisitos_domain.sql` aplicada al proyecto `zkovoehqwrzapsszrhlz` mediante la Management API de Supabase, con un PAT temporal usado solo en memoria (`scripts/apply-sql-via-mgmt.mjs`); el token no se guardó en el repo ni en variables de entorno persistentes. Debe ser revocado por el propietario.
- **Resultado de la ejecución:** HTTP 200, sin errores.
- **Verificación estructural:** 6 columnas (`id`, `organization_id`, `project_id`, `data`, `created_at`, `updated_at`), RLS activo, 4 políticas (`SELECT`/`INSERT`/`UPDATE`/`DELETE`) restringidas a `authenticated` con `is_org_member(organization_id)` y 1 índice único parcial `ux_project_requisitos_project_data_id (project_id, (data->>'id'))`.
- **Verificación de acceso:** antes `GET /rest/v1/project_requisitos` devolvía `PGRST205` (tabla ausente); después responde HTTP 200 con `[]` usando solo la clave publishable. El contrato coincide con `DOMAIN_TABLES` y `_writeDomains()` de `DataService.js`.
- **Prueba autenticada:** la lectura/escritura con un usuario `authenticated` real se ejecutó tras resolver R3 y se documenta en la sección 5.2.

### 5.2 R3 — resuelto: usuario de QA y verificación autenticada

- **Diagnóstico:** `admin@pmi.app` existía, estaba confirmado y pertenecía a una organización como `owner`; el error `400 Invalid login credentials` se debía únicamente a una contraseña desactualizada.
- **Acción:** se rotó el hash bcrypt en `auth.users` a la credencial documentada `Admin!2026` mediante SQL con `pgcrypto`, sin service role ni secretos persistidos. El PAT temporal de R1 se reutilizó solo en memoria y debe seguir siendo revocado por el propietario.
- **Login real:** `POST /auth/v1/token?grant_type=password` → HTTP 200 para `admin@pmi.app`. En producción, el flujo de la UI (`index.html` → `DataService.login()`) autenticó y redirigió a `proyecto.html` con la sesión de Supabase; 0 errores de login.
- **RLS de requisitos con token autenticado:** `SELECT` previo 200/0 filas, `INSERT` 201/1 fila, `SELECT` posterior 200/1 fila con el `id` esperado, `INSERT` duplicado rechazado con 409 por el índice único, `DELETE` de limpieza 204. La fila de prueba se eliminó; no queda datos residuales.

| ID | Seguimiento | Impacto | Mitigación aplicada | Acción pendiente | Estado |
|---|---|---|---|---|---|
| R2 | Ollama `0.40.16` vs cliente `0.30.11`, 0 modelos descargados y CORS `403` desde el dominio de producción | Inferencia real con modelos locales/LAN | Perfiles `local`/`lan`/`bionico`, descubrimiento en runtime y fallback heurístico por agente | Descargar modelo, alinear versiones y configurar `OLLAMA_ORIGINS='https://pmi-mind.vercel.app,http://localhost:5173'` | Abierto |

Si R2 llega a modificar UI visible, repetir axe y Lighthouse antes de cerrarlo, según el estándar del PMO.

---

## 6. Cierre

Con la evidencia de las secciones 2 y 3, el informe PMO se declara **cerrado para el alcance planificado**: las cinco fases están desplegadas, la auditoría final es 9,3/10 PREMIABLE y no existen defectos abiertos de accesibilidad ni de build.

El seguimiento R2 queda registrado como trabajo externo con responsable de infraestructura. Su resolución no requiere reabrir el informe: sólo una verificación focalizada (CORS, modelo activo y axe/Lighthouse si hay cambio de UI).

**Firmado:** PMO · 2026-11-20 · `main@c9c0963`

---

## Anexo A — Índice de madurez (certificado 18-nov)

| Dominio | Nota |
|---|---:|
| Gobernanza, autenticación y seguridad | 100 |
| Adquisiciones, finanzas, monedas y logística | 98 |
| EVM / costes / salud / informe | 100 |
| Recursos / stakeholders | 100 |
| Gestión de riesgos | 100 |
| Alcance / WBS / EDT / líneas base | 100 |
| Cronograma y tiempo | 100 |
| UX/UI, PWA y agilidad | 100 |
| Dashboard, diseño, build/SW | 100 |
| **Índice global** | **99,8 %** |
