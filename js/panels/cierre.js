// ============================================================
// cierre.js — Estados del proyecto y cierre con evidencia
// ============================================================

const ESTADOS_PROYECTO = ['planificado', 'en_curso', 'cerrado'];

/** Normaliza estados heredados ('activo', 'finalizado', etc.) al ciclo de vida canónico. */
function normalizarEstadoProyecto(estado) {
    const valor = String(estado || '').toLowerCase().trim().replace(/[\s-]+/g, '_');
    if (valor === 'activo' || valor === 'active' || valor === 'en_curso' || valor === 'en_curso') return 'en_curso';
    if (valor === 'finalizado' || valor === 'completado' || valor === 'completed' || valor === 'cerrado') return 'cerrado';
    if (valor === 'planificado' || valor === 'planned') return 'planificado';
    return 'en_curso';
}

/** Checklist objective: el cierre no depende de que el PM «marque» casillas. */
function evaluarChecklistCierre(p) {
    const proyecto = p || {};
    const procesos = proyecto.procesos || [];
    const procesosCompletados = procesos.filter(x => x && x.completado).length;
    const entregables = (proyecto.elementosGantt || []).filter(e => e && e.tipo === 'entregable');
    const entregablesAceptados = entregables.filter(e => (Number(e.progreso) || 0) >= 100).length;
    const riesgosAbiertos = (proyecto.riesgos || []).filter(r => {
        const estado = String((r && r.estado) || 'abierto').toLowerCase();
        return !['cerrado', 'cerrada', 'mitigado', 'mitigada', 'aceptado', 'aceptada'].includes(estado);
    });
    const cambiosPendientes = (proyecto.cambios || []).filter(c =>
        c && ['Pendiente', 'En análisis'].includes(c.estado));
    const requisitos = proyecto.requisitos || [];
    const aprobado = typeof esRequisitoAprobado === 'function'
        ? esRequisitoAprobado
        : (r => !!r && (r.estado === 'aprobado' || r.estado === 'validado' || r.aprobado === true));
    const requisitosPendientes = requisitos.filter(r => !aprobado(r));
    const lecciones = proyecto.lecciones || [];

    return [
        {
            clave: 'procesos', etiqueta: 'Procesos PMBOK completados',
            ok: procesos.length > 0 && procesosCompletados === procesos.length,
            detalle: `${procesosCompletados} de ${procesos.length}`
        },
        {
            clave: 'entregables', etiqueta: 'Entregables aceptados',
            ok: entregables.every(e => (Number(e.progreso) || 0) >= 100),
            detalle: entregables.length ? `${entregablesAceptados} de ${entregables.length}` : 'Sin entregables registrados'
        },
        {
            clave: 'requisitos', etiqueta: 'Requisitos aprobados',
            ok: requisitosPendientes.length === 0,
            detalle: requisitos.length ? `${requisitos.length - requisitosPendientes.length} de ${requisitos.length}` : 'Sin requisitos registrados'
        },
        {
            clave: 'cambios', etiqueta: 'Solicitudes de cambio resueltas',
            ok: cambiosPendientes.length === 0,
            detalle: cambiosPendientes.length ? `${cambiosPendientes.length} pendiente(s)` : 'Sin cambios pendientes'
        },
        {
            clave: 'riesgos', etiqueta: 'Riesgos cerrados, mitigados o aceptados',
            ok: riesgosAbiertos.length === 0,
            detalle: riesgosAbiertos.length ? `${riesgosAbiertos.length} abierto(s)` : 'Sin riesgos abiertos'
        },
        {
            clave: 'lecciones', etiqueta: 'Lecciones aprendidas registradas',
            ok: lecciones.length > 0,
            detalle: `${lecciones.length} registrada(s)`
        }
    ];
}

function puedeGestionarCierre() {
    if (typeof AuthSystem === 'undefined' || !AuthSystem || typeof AuthSystem.tieneAccion !== 'function') return false;
    if (!AuthSystem.tieneAccion('aprobar')) return false;
    if (typeof AuthSystem.esAdmin === 'function' && AuthSystem.esAdmin()) return true;
    if (typeof proyecto !== 'undefined' && proyecto && proyecto.id && typeof AuthSystem.getNivelAccesoModulo === 'function') {
        return AuthSystem.getNivelAccesoModulo(proyecto.id, 'cierre') === 'edit';
    }
    return true;
}

function inicializarCierre() {
    if (typeof proyecto === 'undefined' || !proyecto) return;
    if (!proyecto.estado) proyecto.estado = 'en_curso';
    const normalizado = normalizarEstadoProyecto(proyecto.estado);
    if (normalizado !== proyecto.estado) proyecto.estado = normalizado;
    if (!proyecto.cierre || typeof proyecto.cierre !== 'object') proyecto.cierre = null;
    renderizarCierre();
}

function renderizarCierre() {
    const estadoEl = document.getElementById('cierreEstado');
    const listaEl = document.getElementById('checklistCierre');
    if (!estadoEl || !listaEl || typeof proyecto === 'undefined' || !proyecto) return;

    const estado = normalizarEstadoProyecto(proyecto.estado);
    const checklist = evaluarChecklistCierre(proyecto);
    const pendientes = checklist.filter(x => !x.ok);
    estadoEl.innerHTML = `<span class="req-badge req-badge--estado">${estado === 'cerrado' ? 'Cerrado' : (estado === 'planificado' ? 'Planificado' : 'En curso')}</span>
        <span class="u-text-muted">${checklist.length - pendientes.length} de ${checklist.length} evidencias de cierre disponibles</span>`;
    listaEl.innerHTML = checklist.map(item => `
        <li class="cierre-checklist__item">
            <span class="req-badge req-badge--${item.ok ? 'cubierto' : 'prioridad'}" aria-hidden="true">${item.ok ? 'OK' : 'Pendiente'}</span>
            <span><strong>${item.etiqueta}</strong><span class="u-fs-11 u-text-muted">${item.detalle}</span></span>
        </li>`).join('');

    const btnCerrar = document.getElementById('btnCerrarProyecto');
    const btnReabrir = document.getElementById('btnReabrirProyecto');
    const autorizado = puedeGestionarCierre();
    if (btnCerrar) {
        btnCerrar.disabled = !autorizado || estado === 'cerrado' || pendientes.length > 0;
        btnCerrar.title = !autorizado ? 'Requiere permiso de aprobación (CCB)'
            : (pendientes.length ? 'Completa las evidencias pendientes antes de cerrar' : 'Cerrar proyecto');
    }
    if (btnReabrir) {
        btnReabrir.disabled = !autorizado || estado !== 'cerrado';
        btnReabrir.title = !autorizado ? 'Requiere permiso de aprobación (CCB)' : 'Reabrir proyecto';
    }
}

function cerrarProyecto() {
    if (typeof proyecto === 'undefined' || !proyecto) return;
    if (!puedeGestionarCierre()) {
        mostrarToast('Solo el CCB puede cerrar el proyecto', 'error');
        return;
    }
    const checklist = evaluarChecklistCierre(proyecto);
    const pendientes = checklist.filter(x => !x.ok);
    if (pendientes.length) {
        mostrarToast(`Faltan ${pendientes.length} evidencia(s): ${pendientes.map(x => x.etiqueta).join(', ')}`, 'error');
        return;
    }
    const aprobadoInput = document.getElementById('cierreAprobadoPor');
    const usuario = (typeof AuthSystem !== 'undefined' && AuthSystem && typeof AuthSystem.getCurrentUser === 'function')
        ? AuthSystem.getCurrentUser() : null;
    const aprobadoPor = (aprobadoInput && aprobadoInput.value.trim()) || (usuario && (usuario.nombre || usuario.email)) || '';
    if (!aprobadoPor) {
        mostrarToast('Indica quién aprueba el cierre', 'error');
        if (aprobadoInput) aprobadoInput.focus();
        return;
    }
    if (!confirm(`Se cerrará "${proyecto.nombre}". La bitácora conservará el checklist y la aprobación. ¿Continuar?`)) return;

    const antes = { estado: normalizarEstadoProyecto(proyecto.estado), fechaCierre: proyecto.fechaCierre || null };
    const cierre = {
        fecha: new Date().toISOString().slice(0, 10),
        aprobadoPor,
        observaciones: (document.getElementById('cierreObservaciones') || {}).value?.trim() || '',
        checklist
    };
    proyecto.estado = 'cerrado';
    proyecto.fechaCierre = cierre.fecha;
    proyecto.cierre = cierre;
    if (typeof registrarBitacora === 'function') registrarBitacora('proyecto', proyecto.id, 'cerrar', antes, { estado: 'cerrado', cierre });
    guardarProyecto();
    renderizarCierre();
    mostrarToast('Proyecto cerrado con evidencia', 'success');
}

function reabrirProyecto() {
    if (typeof proyecto === 'undefined' || !proyecto) return;
    if (!puedeGestionarCierre()) {
        mostrarToast('Solo el CCB puede reabrir el proyecto', 'error');
        return;
    }
    if (!confirm(`Se reabrirá "${proyecto.nombre}" para continuar el trabajo. ¿Continuar?`)) return;
    const antes = { estado: normalizarEstadoProyecto(proyecto.estado) };
    const usuario = (typeof AuthSystem !== 'undefined' && AuthSystem && typeof AuthSystem.getCurrentUser === 'function')
        ? AuthSystem.getCurrentUser() : null;
    const reabiertoPor = (usuario && (usuario.nombre || usuario.email)) || 'No indicado';
    proyecto.estado = 'en_curso';
    if (proyecto.cierre && typeof proyecto.cierre === 'object') {
        proyecto.cierre.reapertura = { fecha: new Date().toISOString().slice(0, 10), por: reabiertoPor };
    }
    if (typeof registrarBitacora === 'function') registrarBitacora('proyecto', proyecto.id, 'reabrir', antes, { estado: 'en_curso', reabiertoPor });
    guardarProyecto();
    renderizarCierre();
    mostrarToast('Proyecto reabierto', 'success');
}

window.normalizarEstadoProyecto = normalizarEstadoProyecto;
window.evaluarChecklistCierre = evaluarChecklistCierre;
window.inicializarCierre = inicializarCierre;
window.renderizarCierre = renderizarCierre;
window.cerrarProyecto = cerrarProyecto;
window.reabrirProyecto = reabrirProyecto;
