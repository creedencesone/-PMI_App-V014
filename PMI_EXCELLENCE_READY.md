# Certificado PMI Excellence Ready

**Proyecto:** PMI Mind — `PMI_App V014`

**Fecha de emisión:** 2026-11-18

**Repo:** `https://github.com/creedencesone/-PMI_App-V014.git` · rama `main`

## Criterios de otorgamiento

| Criterio | Requisito | Resultado |
|---|---|---|
| Índice de Madurez PMI | ≥ 98 % | **99,8 %** (898 / 900) |
| Hallazgos críticos 🔴 | 0 confirmados | **0 🔴 / 0 🟡** |

Se cumplen ambos criterios. Se emite el certificado **PMI Excellence Ready**.

## Índice por dominio

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

## Verificación empírica final

- QUnit: **101/101** pruebas, 0 fallos.
- axe-core: **0 violaciones** en claro y oscuro, barrido nativo de **38 paneles** a **390 px**, más submenú desplegado.
- Teclado: **38 paneles**, **180 pasos de Tab**, 0 controles sin nombre y 0 `onclick` no enfocables.
- Módulos canónicos presentes: `csv`, `whatif`, `calendario`, `uiCalendario`, `evm`, `cpm`.
- Service worker **`pmi-mind-v42`**, caché **79 entradas**, `missing []`, `install` con `Promise.allSettled`.
- Build con cache-bust **`20261120e`**; `tokens-shared.css` y `tokens.css` reinsertados en `dist/dashboard.html` y `dist/proyecto.html`.
- `npm run test:offline`: `serviceWorker=true dashboard=true proyecto=true`, `tieneCss: true`, **Offline OK**.
- Capturas dark/light en **390 / 768 / 1024 / 1440 px**: 38 paneles y 0 desbordamiento horizontal.

## Alcance preservado

38 paneles, guards de autenticación, service worker, import de desarrollo de `DataService` y librerías vendorizadas. Sin dependencias CDN nuevas; Inter local, acento azul `#007AFF`/`#0A84FF` y paletas carbón/clara tokenizadas.

---

**PMI Excellence Ready** · Emitido tras auditoría → refactorización → re-auditoría → QA/build/offline.
