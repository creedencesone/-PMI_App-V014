// ============================================================
// PMI Mind — Entry Point
// ============================================================

// Core modules (se asignan automáticamente al window para compatibilidad)
import './core/dates.js';
import './core/evm.js';
import './core/finance.js';
import './core/ui.js';

// Panel modules (import secuencial para respetar dependencias)
import './panels/acta-roles.js';
import './panels/equipo-servicios.js';
import './panels/comunicaciones.js';
import './panels/gantt.js';
import './panels/edt-panel.js';
import './panels/materiales.js';
import './panels/financiero-monedas.js';
import './panels/grafico-monedas.js';
import './panels/venta-cashflow.js';
import './panels/stakeholders.js';
import './panels/resumen-procesos.js';
import './panels/riesgos.js';
import './panels/garantia-viajes-avales.js';
import './panels/import-export.js';
import './panels/ia-analisis.js';
import './panels/panel-salud.js';
import './panels/panel-informe.js';
import './panels/beneficios-cambios-lecciones.js';
import './panels/scrum.js';
import './panels/logistica-3d.js';
import './panels/navegacion-auth.js';
import './panels/montecarlo.js';
import './panels/manual.js';
import './panels/compartir.js';

console.log(' PMI Mind — Todos los módulos cargados');
