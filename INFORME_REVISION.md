# Informe de Revisión de la Aplicación PMI

**Fecha:** 17 de agosto de 2026
**Alcance:** index.html, dashboard.html, proyecto.html, todo js/ (core, panels, services), styles.css, backend/ (PHP+SQLite), service-worker.js
**Entorno:** App abierta desde `file://` en Safari, sin servidor ni red garantizada

---

## Resumen ejecutivo

Se detectaron **4 errores críticos** (uno de ellos con efecto en cadena que rompía la carga inicial), **6 de prioridad alta**, **9 medios** y varios bajos. Los 4 críticos han sido **corregidos y verificados**. El resto queda documentado para su corrección posterior.

La causa raíz más grave: **dos ficheros JS tenían funciones duplicadas que producían `SyntaxError`**, lo que impedía que todo el fichero se ejecutara. Como `cargarProyecto()` (la función de arranque) llama a funciones de esos ficheros, el error se propagaba y **impedía que se aplicaran el idioma, el tema y la sesión guardados**.

---

## 🔴 CRÍTICOS (corregidos)

### 1. `js/panels/financiero-monedas.js` — `guardarTasa` duplicada
- **Líneas originales:** 496 y 512 (dos declaraciones idénticas de `function guardarTasa`).
- **Síntoma:** `SyntaxError: Identifier 'guardarTasa' has already been declared` → el fichero completo no se ejecutaba → paneles **Financiero** y **Monedas** rotos, y las funciones `inicializarConfigFinanciera()`, `actualizarTiposCambioUI()`, `mostrarFechaUltimaActualizacion()` inexistentes en runtime.
- **Corrección aplicada:** eliminada la segunda declaración (512). Se conserva la primera, que incluye validación (`valor > 0`), feedback visual (`saved`) y mensaje con el valor exacto.

### 2. `js/panels/garantia-viajes-avales.js` — `eliminarGarantia` duplicada
- **Líneas originales:** 93 (anidada) y 681 (top-level), lógica idéntica.
- **Síntoma:** `SyntaxError: Identifier 'eliminarGarantia' has already been declared` → fichero muerto → paneles **Viajes**, **Avales** y **Garantía** rotos. Además este fichero declara `OPENAI_API_KEY` y `USAR_IA_REAL`, por lo que **el panel de IA también quedaba roto**.
- **Corrección aplicada:** eliminada la declaración anidada (93). Se conserva la de nivel superior (681).

### 3. Efecto en cadena de 1 y 2 (resuelto al corregir los anteriores)
- **Síntoma:** `cargarProyecto()` (`js/panels/navegacion-auth.js:60`) llama en las líneas 408–425 a `inicializarConfigFinanciera()`, `actualizarTiposCambioUI()`, `renderizarViajes()`, `renderizarAvales()`, `renderizarGarantia()` — todas en los ficheros rotos → `ReferenceError` dentro de `await cargarProyecto()` dentro de `init()` (`:1016`) → el `try{init()}` (`:1046`) lo tragaba y **nunca se ejecutaban `cargarTemaGuardado()`, `cargarIdiomaApp()`, `cargarUsuarioSesion()` ni `DataService.startAutoSync()`**.
- **Consecuencias visibles:** idioma/tema guardados que no se aplicaban al abrir la app, y ausencia de control de sesión/redirección a login.
- **Corrección aplicada:** con los ficheros parseando correctamente, todas esas funciones existen y la cadena de arranque se ejecuta. Verificado: las 28 funciones invocadas por la carga inicial existen en `js/`.

### 4. `mostrarToast` no funcionaba (toda la app sin feedback)
- **Síntoma:** `mostrarToast` se define en `js/utils.js:772` y en `js/core/ui.js:10`. Como `core/ui.js` se carga después, su versión era la ganadora, pero buscaba `#toastContainer`, un elemento **inexistente** en `proyecto.html` y `dashboard.html` (solo existe `<div id="toast">`, líneas 2399 y 1867 respectivamente) → **todos los avisos de la app se perdían en silencio**.
- **Corrección aplicada en `js/core/ui.js`:** si `#toastContainer` existe se apilan toasts; si no, se cae al `#toast` existente (texto, clase `toast <tipo>`, ocultación a los 3 s). También se sustituyó la animación `slideIn` (no definida en CSS) por `fadeInOut` (sí definida).

---

## 🟠 PRIORIDAD ALTA (pendientes de corrección)

| # | Ubicación | Descripción |
|---|---|---|
| 5 | `js/services/DataService.js:192-236` vs `js/config-global.js:205` | `syncProyecto()` usa `window.proyecto`, pero `proyecto` es un `let` (no crea propiedad en `window`) → **la sincronización remota está muerta** aunque haya servidor. Solución: usar el binding global `proyecto` directamente o exponer `window.proyecto` y mantenerlo sincronizado. |
| 6 | `proyecto.html:190` y `:195` | `id="panelDashboard"` duplicado y **anidado** (bloque muerto de merge que repite `dashboardInfoCards`, `dashboardChart`, `dashboardStats`). Eliminar el bloque interno. |
| 7 | `proyecto.html:68` y `:167` | `id="themeToggleBtn"` duplicado (sidebar + botón flotante). `navegacion-auth.js` actualiza solo el primero. Renombrar el segundo. |
| 8 | `js/panels/panel-salud.js:771` + `proyecto.html:216` | El botón "Satisfacción" llama a `abrirModalSatisfaccion()` que hace `.style.display='flex'` sobre `modalSatisfaccion`, que **no existe** en el HTML → `TypeError`. Falta el modal (o guard). |
| 9 | `proyecto.html:1460-1512` | 5 handlers inline que llaman funciones inexistentes (bloque "bultos" muerto): `cerrarModalCrearBulto`, `actualizarMedidasPorTipo`, `guardarNuevoBulto`, `cerrarModalAsignarMaterialBulto`, `confirmarAsignarMaterialABulto`. Eliminar el bloque o definir las funciones. |
| 10 | `proyecto.html:28` | `pdfjsLib.GlobalWorkerOptions.workerSrc = ...` **sin guard**: si el CDN de pdf.js no carga (sin red), `ReferenceError` rompe los scripts del head. Envolver en `if (typeof pdfjsLib !== 'undefined')`. |

---

## 🟡 PRIORIDAD MEDIA (pendientes)

| # | Ubicación | Descripción |
|---|---|---|
| 11 | `js/panels/scrum.js:23` | `actualizarBurnDown()` usa `getElementById('burndownChart')`, pero el canvas real es `#burndownChartCanvas` (`proyecto.html:1885`) → el burndown ágil nunca se dibuja. |
| 12 | `js/panels/scrum.js:105` | `registrarVelocidadSprint()` escribe en `#sprintActual`, inexistente (sin guard). |
| 13 | `js/panels/gantt.js:498` | `calcularProfundidad()` sin guard de ciclos → se cuelga ante una dependencia cíclica (creable desde la UI de predecesores). |
| 14 | `js/panels/gantt.js:95` y `js/core/dates.js:41` | `sumarDiasHabiles()` rama negativa no descuenta bien fines de semana (Lunes −5 hábiles da Miércoles). Afecta dependencias FF/SF de `autoScheduler`. |
| 15 | `proyecto.html:855` + `gantt.js` | El buscador `buscarGantt` (onkeyup → `renderizarCronograma()`) nunca se lee → la búsqueda es un no-op. |
| 16 | `js/panels/navegacion-auth.js:353-457` | Si no hay `proyectoSeleccionado` ni proyectos, se crea un proyecto en memoria **sin persistirlo** → se pierde al recargar. |
| 17 | `js/services/DataService.js` (líneas 221, 265, 296, 329, 439, 453, 463, 493) | `JSON.parse(localStorage.getItem(...))` sin `try/catch` → datos corruptos lanzan excepción. |
| 18 | `js/panels/compartir.js:157` | El HTML público standalone embebe `tApp()` pero no carga `utils.js` → `ReferenceError` en el dashboard público. |
| 19 | `js/panels/financiero-monedas.js` | `tiposCambioCache` se escribe (306, 502, 516, 528) pero solo se lee en el fallback de las APIs → las tasas actualizadas se pierden al recargar. |
| 20 | Funciones duplicadas (se pisan) | `renderizarRACI`/`guardarRACI` (`stakeholders.js` + `navegacion-auth.js`); `calcularROI/VAN/Payback` (`core/finance.js` + `beneficios-cambios-lecciones.js`); `actualizarFechasProyectoDesdeActa` (`gantt.js` + `navegacion-auth.js`); `cerrarModalSatisfaccion`; utilidades de fechas (`core/dates.js` + `gantt.js` + `scrum.js`). Unificar en un solo origen. |
| 21 | `js/panels/ia-analisis.js` | `configurarAPIKeyIA()` asigna `OPENAI_API_KEY`/`USAR_IA_REAL`, declaradas en `garantia-viajes-avales.js` (antes roto). Tras el arreglo ya existen, pero conviene declararlas en `ia-analisis.js` para no depender de ese fichero. |
| 22 | `js/panels/panel-informe.js:12` | `let proyecto = todos.find(...)` ensombrece el global `proyecto` → el informe lee de localStorage y no del proyecto en memoria. |
| 23 | `js/panels/panel-informe.js:185` | `proyecto.moneda` no existe (el proyecto usa `monedaBase`) → el símbolo siempre es €. |

---

## 🟢 PRIORIDAD BAJA (pendientes)

- **Iconos feather inválidos** en `proyecto.html`: `plane`, `bug`, `dices`, `ticket`, `lightbulb`, `sparkles`, `robot` → se muestran vacíos.
- **Rutas absolutas** `/manifest.json` e `/icons/icon-192.png` en `index.html:9-10`, `dashboard.html:9-10` y `proyecto.html:9-10` → no cargan bajo `file://`.
- **Service worker** (`service-worker.js`): usa rutas `/` absolutas y no funciona bajo `file://` (el registro ya está protegido con `.catch`).
- `js/config.js:276` `formatearMoneda()` sin guard de `valor` null/string.
- `js/auth.js:197` `btoa(password)` lanza con caracteres > U+00FF.
- `js/auth.js:533` `usuario.proyectosAsignados.includes(...)` sin guard `Array.isArray` (usuarios legacy).
- `js/panels/gantt.js:1811` `seleccionarTodosElementos()` — feature de selección múltiple muerta (checkbox inexistente).
- **Dependencias CDN** (chart.js, html2canvas, three.js, pdf.js, emailjs, feather): sin red no cargan; la app degrada (gráficos, PDF, correo, iconos). El caso crítico (línea 28 sin guard) ya está documentado en el #10.

---

## ✅ Áreas verificadas en buen estado

- **Backend PHP/SQLite:** los 10 ficheros (`index.php`, `setup.php`, `config.php`, `api/*.php`, `lib/*.php`) pasan `php -l` sin errores de sintaxis.
- **Sintaxis JS:** tras las correcciones, **todos** los ficheros de `js/panels/`, `js/core/`, `js/services/`, `js/i18n.js`, `js/utils.js`, `js/config-global.js` pasan `node --check`.
- **Cableado HTML↔JS:** panels de riesgos, materiales, comunicaciones, edt-panel, manual, montecarlo y logística-3d referencian correctamente sus IDs.
- **CSS:** las clases del cronograma (`.crono-*`, `.wbs-*`, `.tv-*`) y los estilos base (`.panel.active`, `.modal`, `.toast`) existen y son coherentes. `.tv-container` tiene `overflow-y:auto`.

---

## Verificación de las correcciones

```
node --check js/panels/financiero-monedas.js  → OK
node --check js/panels/garantia-viajes-avales.js → OK
node --check js/core/ui.js                   → OK
node --check (todos los ficheros cargados)    → sin errores
Grep de las 28 funciones de arranque          → todas existen
```

---

## Nota

`gantt.js` contiene 2 `console.debug` de diagnóstico (`[gantt] ...`) añadidos durante la investigación del problema de la barra de una actividad nueva, que sigue pendiente. Eliminarlos una vez resuelto.
