// ============================================================
// core/alertas.js — Alertas accionables: id estable, ack, responsable y escalado
// ============================================================

const ESTADOS_ALERTA = Object.freeze(['abierta', 'acknowledged', 'escalada', 'resuelta']);
const NIVELES_ALERTA = Object.freeze(['media', 'alta', 'critica']);

/** Identificador determinista: la misma detección siempre produce el mismo id. */
function idAlerta(alerta) {
    if (!alerta) return '';
    if (alerta.id && !String(alerta.id).includes('|')) return String(alerta.id);
    return [alerta.tipo || 'alerta', alerta.proyectoId || '', alerta.entidadId || ''].join('|');
}

function inicializarAlertas(proyectoParam) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    if (!p) return [];
    if (!Array.isArray(p.alertas)) p.alertas = [];
    return p.alertas;
}

/** Enriquece las alertas calculadas con el estado persistido (ack/escalado). */
function fusionarAlertas(detectadas, persistidas) {
    const guardadas = new Map((persistidas || []).map(a => [idAlerta(a), a]));
    return (detectadas || []).map(alerta => {
        const id = idAlerta(alerta);
        const previa = guardadas.get(id);
        return Object.assign({}, alerta, {
            id,
            estado: previa ? (previa.estado || 'abierta') : 'abierta',
            responsable: previa ? (previa.responsable || '') : '',
            fechaLimite: previa ? (previa.fechaLimite || null) : null,
            nivel: previa && previa.nivelForzado ? previa.nivel : (alerta.nivel || 'media'),
            nivelForzado: previa ? !!previa.nivelForzado : false,
            acknowledgePor: previa ? (previa.acknowledgePor || null) : null,
            fechaAcknowledgement: previa ? (previa.fechaAcknowledgement || null) : null,
            escaladaPor: previa ? (previa.escaladaPor || null) : null,
            fechaEscalado: previa ? (previa.fechaEscalado || null) : null
        });
    });
}

function registrarEnBitacoraAlertas(proyectoParam, id, accion, antes, despues) {
    if (typeof registrarBitacora !== 'function') return null;
    try {
        // Se clona antes de firmar: si se guardara la referencia, un escalado
        // posterior mutaría el snapshot y rompería la cadena de hashes.
        const clon = typeof clonarParaBitacora === 'function' ? clonarParaBitacora : (v => v == null ? null : JSON.parse(JSON.stringify(v)));
        // registrarBitacora acepta el proyecto como sexto argumento (dashboard no
        // tiene un global `proyecto`); en proyecto.html se usa el global.
        return registrarBitacora('alerta', id, accion, clon(antes), clon(despues), proyectoParam);
    } catch {
        return null;
    }
}

/** Persiste una alerta detectada por primera vez. */
function registrarAlerta(proyectoParam, alerta) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    if (!p) return null;
    const lista = inicializarAlertas(p);
    const id = idAlerta(alerta);
    const existente = lista.find(a => idAlerta(a) === id);
    if (existente) return existente;
    const entrada = Object.assign({}, alerta, {
        id,
        estado: 'abierta',
        responsable: '',
        fechaLimite: null,
        fechaDeteccion: new Date().toISOString(),
        nivelForzado: false
    });
    lista.push(entrada);
    registrarEnBitacoraAlertas(p, id, 'crear', null, entrada);
    return entrada;
}

function actorAlerta() {
    if (typeof AuthSystem !== 'undefined' && AuthSystem && typeof AuthSystem.getCurrentUser === 'function') {
        const u = AuthSystem.getCurrentUser();
        if (u) return u.nombre || u.email || u.id || 'usuario';
    }
    if (typeof usuarioActual !== 'undefined' && usuarioActual) {
        return usuarioActual.nombre || usuarioActual.email || 'usuario';
    }
    return 'sistema';
}

/** Reconoce una alerta: conserva quién y cuándo, y deja rastro en bitácora. */
function acknowledgedAlerta(proyectoParam, id, opciones) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    if (!p) return null;
    const opts = opciones || {};
    const lista = inicializarAlertas(p);
    const entrada = lista.find(a => idAlerta(a) === id);
    if (!entrada) return null;
    const antes = JSON.parse(JSON.stringify(entrada));
    entrada.estado = 'acknowledged';
    entrada.acknowledgePor = opts.actor || actorAlerta();
    entrada.fechaAcknowledgement = new Date().toISOString();
    if (opts.responsable) entrada.responsable = String(opts.responsable).trim();
    if (opts.fechaLimite) entrada.fechaLimite = String(opts.fechaLimite).slice(0, 10);
    registrarEnBitacoraAlertas(p, id, 'acknowledg', antes, entrada);
    return entrada;
}

/** Escalado: el nivel nunca puede bajar por debajo del detectado. */
function escalarAlerta(proyectoParam, id, opciones) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    if (!p) return null;
    const opts = opciones || {};
    const lista = inicializarAlertas(p);
    const entrada = lista.find(a => idAlerta(a) === id);
    if (!entrada) return null;
    const antes = JSON.parse(JSON.stringify(entrada));
    const destino = NIVELES_ALERTA.includes(opts.nivel) ? opts.nivel : 'critica';
    entrada.estado = 'escalada';
    entrada.nivelForzado = true;
    const orden = NIVELES_ALERTA.indexOf(destino) - NIVELES_ALERTA.indexOf(entrada.nivel || 'media');
    entrada.nivel = orden >= 0 ? destino : entrada.nivel;
    entrada.escaladaPor = opts.actor || actorAlerta();
    entrada.fechaEscalado = new Date().toISOString();
    registrarEnBitacoraAlertas(p, id, 'escalar', antes, entrada);
    return entrada;
}

function resolucionAlerta(proyectoParam, id) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    if (!p) return null;
    const entrada = inicializarAlertas(p).find(a => idAlerta(a) === id);
    if (!entrada) return null;
    const antes = JSON.parse(JSON.stringify(entrada));
    entrada.estado = 'resuelta';
    registrarEnBitacoraAlertas(p, id, 'resolver', antes, entrada);
    return entrada;
}

function resumenAlertas(proyectoParam) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    const lista = inicializarAlertas(p);
    const abiertas = lista.filter(a => a.estado === 'abierta');
    const escaladas = lista.filter(a => a.estado === 'escalada');
    return {
        total: lista.length,
        abiertas: abiertas.length,
        acknowledged: lista.filter(a => a.estado === 'acknowledged').length,
        escaladas: escaladas.length,
        criticas: lista.filter(a => a.nivel === 'critica' && a.estado !== 'resuelta').length,
        sinResponsable: abiertas.filter(a => !a.responsable).length
    };
}

if (typeof window !== 'undefined') {
    window.ESTADOS_ALERTA = ESTADOS_ALERTA;
    window.NIVELES_ALERTA = NIVELES_ALERTA;
    window.idAlerta = idAlerta;
    window.inicializarAlertas = inicializarAlertas;
    window.fusionarAlertas = fusionarAlertas;
    window.registrarAlerta = registrarAlerta;
    window.acknowledgedAlerta = acknowledgedAlerta;
    window.escalarAlerta = escalarAlerta;
    window.resolucionAlerta = resolucionAlerta;
    window.resumenAlertas = resumenAlertas;
}
