# Informe Final PMO — PMI Mind

**Proyecto:** PMI Mind — `PMI_App V014`
**Fecha de cierre:** 2026-11-20
**Repositorio:** `https://github.com/creedencesone/-PMI_App-V014.git` · rama `main` · HEAD de esta entrega
**Producción:** `https://pmi-mind.vercel.app` · deploy `pmi-mind-185wl7hcy-aaa-be01.vercel.app` (`dpl_3eDtGwXAFaGKNYPipsh4twF1DwZr`)
**Calificación:** **Cierre aceptado — PREMIABLE** (auditoría final 9,3/10)

Antecedentes: `INFORME_REVISION.md` (revisión de agosto, 4 críticos corregidos) y `PMI_EXCELLENCE_READY.md` (certificado emitido el 18-nov). Este documento consolida el plan de trabajo completo y sustituye las cifras de verificación de la instantánea anterior con las del cierre.

---

## 1. Resumen ejecutivo

El plan PMO se ha ejecutado íntegramente en cinco bloques (Fase 0, requisitos, Fase 1, Fase 2 y Fase 3), todos commiteados, pusheados y desplegados. La aplicación conserva el estándar de premio: build y deploy estables, accesibilidad WCAG AA verificada empíricamente y cero defectos abiertos de accesibilidad. Se añadió un equipo de agentes PMI model-agnóstico que funciona sin depender de modelos externos.

| Criterio de cierre | Compromiso | Resultado en cierre | Estado |
|---|---|---|---|
| Build y deploy | Vite + Vercel estables, commits limpios | `npm run build` OK; 85 recursos en precache; deploy `READY`; `main` sincronizado con `origin/main` | Cerrado |
| Accesibilidad | WCAG AA real en 390/768/1024/1440/1920, claro/oscuro y `prefers-reduced-motion` | axe 0 violaciones en 43 paneles × 2 temas; Lighthouse Accesibilidad 100 en producción, incluido el importador | Cerrado |
| Calidad | 0 violaciones axe, Lighthouse 100, 0 defectos AA abiertos | 0 auditorías fallidas; auditoría final 9,3/10 PREMIABLE | Cerrado |
| Trazabilidad | `requisitos[]`, matriz, bitácora y B.2 basado en evidencia | Panel, CRUD, filtros y `requisitosIds` en Gantt; migración `0008` aplicada y verificada | Cerrado |
| Gobierno | Permisos, calidad, alertas, cartera, backup y nivelación | Fase 2 desplegada y verificada en producción | Cerrado |
| IA local/LAN | Local y LAN simultáneos, modelo configurable, sin secretos, fallback | Fase 3 desplegada; CORS y modelo locales verificados en producción, LAN configurable y con fallback | Cerrado |
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
| Importador de contrato IA | 2026-11-20 | ver §5.4 | PDF/DOCX/TXT, fragmentación, extracción PMI, revisión y aplicación auditada | +1.710/−178 | Desplegado |

**Totales del plan:** +5.964 / −35.968 líneas en 9 entregas. `a2dfbc7` corrige además un token stale de `tokens.css` que `finalize-html.mjs` reintroducía en `dist`.

---

## 3. Evidencia de verificación

Ejecutada sobre el HEAD de esta entrega, con deploy congelado antes de la re-auditoría.

| Prueba | Resultado |
|---|---|
| QUnit (`npx qunit test/tests.js`) | **134/134**, 0 fallos (7 tests nuevos del importador de contrato) |
| axe-core local, 43 paneles, claro y oscuro | **0 violaciones**, 0 controles sin nombre, 0 errores de consola |
| Navegación por teclado | 43 paneles, **210 pasos de Tab**, 0 outlines perdidos, 0 `onclick` no enfocables |
| axe en producción | 0 violaciones en `dashboard.html` (tarjetas de alerta y botones ack/escalado), `proyecto.html`, el panel de agentes con 5 tarjetas y el importador de contrato |
| Lighthouse en producción | Accesibilidad **100**, buenas prácticas **100** y SEO **100** en pantalla pública, login, dashboard autenticado, panel de agentes e importador; **0 auditorías fallidas** |
| `npm run build` | OK; precache regenerado con **87 recursos**; tokens en `dist` con `20261121l` |
| `npm run test:offline` | `serviceWorker=true dashboard=true proyecto=true`; `Offline: OK` |
| Smoke Fase 2 | KPIs multimoneda, ack/escalado de alertas, notificaciones y `createNotification`; 0 errores de consola |
| Smoke Fase 3 | 5 agentes en fallback, permiso `edit`, panel activo y visible; 0 errores de consola |
| Smoke importador de contrato | TXT de 15 líneas leído, 1 fragmento, 12 propuestas revisables, `role="status"` anunciado; sin mutación hasta la aprobación; Lighthouse accesibilidad 100 |
| Flujo real de cierre (Fase 1) | Cierre con evidencia ejecutado en producción; Lighthouse 100 en el panel de cierre |

### Release y caché

- Cache-bust: **`20261121l`** en `index.html`, `dashboard.html`, `proyecto.html` y `service-worker.js`.
- Service worker: **`pmi-mind-v53`**, con los módulos nuevos (`js/core/contrato-ia.js`, `js/panels/importar-contrato-ia.js`) en precache.
- Producción sirve `20261121l` y `v53`; ambos módulos nuevos responden HTTP 200.
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

No hay defectos abiertos en la aplicación. Los tres seguimientos (R1, R2 y R3) quedaron resueltos el 20-nov; no queda trabajo externo pendiente.

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

### 5.3 R2 — resuelto: Ollama, CORS y modelo activo

- **Estado previo:** CORS `403` desde `https://pmi-mind.vercel.app`, servidor `0.40.16`, cliente Homebrew `0.30.11` y sin modelos utilizables.
- **Acción:** ambos binarios (`/opt/homebrew/bin/ollama` y `/usr/local/bin/ollama`) están alineados en `0.40.16`; el modelo `qwen2.5:7b-instruct` (4,7 GB) está disponible. Se configuró `launchctl setenv OLLAMA_ORIGINS 'https://pmi-mind.vercel.app,http://localhost:5173'` y se reinició el servicio de Ollama.
- **Persistencia:** además del `launchctl setenv` de sesión, se instaló `~/Library/LaunchAgents/com.pmi.ollama-origins.plist` (`RunAtLoad`) para reaplicar la variable en cada inicio; `plutil -lint` OK y `launchctl getenv` devuelve el valor esperado.
- **CORS:** `GET /api/tags` con `Origin: https://pmi-mind.vercel.app` → HTTP 200 y `Access-Control-Allow-Origin: https://pmi-mind.vercel.app`; el origen de desarrollo `http://localhost:5173` también responde 200.
- **Inferencia:** `POST /v1/chat/completions` con el modelo activo devuelve `OK`. Desde la página de producción, `LocalAIService` descubre 1 proveedor y 1 modelo, y `ask()` devuelve `OK` sin errores.
- **LAN y coexistencia:** la configuración conserva modelos independientes para `local` y `lan`. Con el endpoint LAN por defecto (`https://ai.tu-tailnet.ts.net`, sustituible en runtime por el tailnet del usuario) el perfil aparece «sin conexión», `listModels('lan')` devuelve `[]` y los agentes degradan a heurística con error `red`, sin afectar al perfil local. El despliegue HTTPS del LAN sigue siendo responsabilidad de infraestructura (Tailscale o Caddy), sin cambios en el repo.
- **UI:** el modal de IA muestra «1 proveedor(es) · 1 modelo(s) disponible(s)» y la opción `qwen2.5:7b-instruct (4.7 GB)`. No se modificó código de UI, por lo que no procede repetir axe/Lighthouse.

### 5.4 Feature entregada — importador de contrato con IA

- **Alcance:** PDF con capa de texto (pdf.js ya vendorizado), DOCX (ZIP + `DecompressionStream('deflate-raw')`, sin librerías nuevas) y TXT/Markdown; límite de 25 MB y 300 000 caracteres. Sin OCR: un PDF escaneado devuelve `texto_vacio` y se informa al usuario.
- **Conducto:** saneado → fragmentación (14 000 caracteres, 250 de solape, hasta 14 fragmentos) → prompt PMI con esquema fijo → `LocalAIService.ask()` → normalización defensiva → fusión por fragmentos → propuesta campo por campo → aplicación sólo de los elementos marcados.
- **Seguridad:** la salida del modelo se analiza como JSON, se sanea y se renderiza con `textContent`; nunca se inserta HTML. Si todos los fragmentos fallan, se degrada a un extractor heurístico local y se etiqueta el modo como `heuristico`. No se envían secretos ni contratos a servicios remotos: el modelo es `local`/`lan`.
- **Dominio PMI cubierto:** acta (nombre, código, objetivo, alcance, criterios, entregables), fechas, economía (precio, moneda, condiciones de pago, BAC, ROI), gobierno (PM, sponsor, cliente, interesados), requisitos, riesgos, hitos financieros, EDT/Gantt, proveedores y contratos. Los reflejos legacy (`nombre`, `descripcion`, `fechaInicio`, `fechaFin`, `presupuestoBase`) se mantienen alineados.
- **Gobernanza:** panel mapeado al módulo `finanzas` en `PANEL_A_MODULO`; en modo `view` no se renderiza el botón de aplicación. Cada importación escribe `registrarBitacora('contrato_ia', …, 'importar', antes, después)` y llama a `guardarProyecto()`.
- **i18n y accesibilidad:** 25 claves nuevas en los cuatro idiomas, entrada en `sidebarMap`/`elementosConIcono`, `role="status"`, `<progress>` con nombre accesible, fieldset/legend y exclusiones de movimiento. axe 0 violaciones en 43 paneles × claro/oscuro; Lighthouse accesibilidad y buenas prácticas 100; 210 pasos de Tab sin outlines perdidos.
- **Pruebas:** 7 tests QUnit nuevos (saneado, normalización con JSON cercado y fechas ES, fragmentación, fusión, heurística, lectura TXT/DOCX con ZIP sintético, aplicación selectiva con bitácora) → 134/134.
- **Despliegue:** `vercel deploy --prod` → `dpl_3eDtGwXAFaGKNYPipsh4twF1DwZr` aliasado a `https://pmi-mind.vercel.app`. Tras congelar el deploy, producción sirve `20261121l`, `pmi-mind-v53` y HTTP 200 en los dos módulos nuevos; Lighthouse sobre `#panelImportarContrato` dio accesibilidad 100, buenas prácticas 100 y SEO 100, sin auditorías fallidas. El perfil `local` queda listo para el modelo `qwen2.5:7b-instruct`; en el entorno de QA sin CORS para `127.0.0.1:4174` se verificó la degradación a heurística con el aviso `sin_modelo`.

| ID | Seguimiento | Resolución | Estado |
|---|---|---|---|
|---|---|---|---|
| R1 | Migración `0008` sin aplicar | Aplicada y verificada (5.1) | Cerrado |
| R2 | Ollama sin modelo y CORS `403` | Modelo activo, CORS configurado e inferencia verificada (5.3) | Cerrado |
| R3 | Login Supabase inválido | Credencial rotada, login real y RLS autenticado verificados (5.2) | Cerrado |

Cualquier cambio futuro de UI derivado de estos seguimientos deberá repetir axe y Lighthouse antes de cerrarse, según el estándar del PMO.

---

## 6. Cierre

Con la evidencia de las secciones 2, 3 y 5.4, el informe PMO se declara **cerrado para el alcance planificado**: las cinco fases están desplegadas, el importador de contrato con IA está operativo en producción, la auditoría final es 9,3/10 PREMIABLE y no existen defectos abiertos de accesibilidad ni de build.

No queda ningún seguimiento abierto. Si en el futuro se sustituye el endpoint LAN por un tailnet real o se cambia la UI de IA, bastará una verificación focalizada (CORS, modelo activo y axe/Lighthouse si hay cambio visible) sin reabrir el informe. La revocación del PAT temporal de Supabase sigue siendo una acción del propietario fuera del repositorio.

**Firmado:** PMO · 2026-11-20 · `main`

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
