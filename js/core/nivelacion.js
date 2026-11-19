// ============================================================
// core/nivelacion.js — Disponibilidad por persona y nivelación sin mutar el proyecto
// ============================================================

/** Combina el calendario global con los días/festivos propios de la persona. */
function calendarioEfectivoPersona(persona, calendarioGlobal) {
    const global = calendarioGlobal || {};
    const propio = (persona && (persona.calendario || persona.disponibilidad)) || {};
    const diasNoLaborables = Array.from(new Set([
        ...((Array.isArray(global.diasNoLaborables) ? global.diasNoLaborables : [0, 6])),
        ...((Array.isArray(propio.diasNoLaborables) ? propio.diasNoLaborables : []))
    ]));
    const festivos = Array.from(new Set([
        ...((Array.isArray(global.festivos) ? global.festivos : []).map(x => String(x).slice(0, 10))),
        ...((Array.isArray(propio.festivos) ? propio.festivos : []).map(x => String(x).slice(0, 10)))
    ].filter(Boolean)));
    return { diasNoLaborables, festivos };
}

/** Capacidad diaria canónica: horasMes/20, o horasDia explícito. */
function capacidadDiariaPersona(persona) {
    const horasMes = Number(persona && persona.horasMes) || 0;
    if (horasMes > 0) return horasMes / 20;
    const horasDia = Number(persona && (persona.horasDia || persona.capacidadHorasDia)) || 0;
    return horasDia > 0 ? horasDia : 8;
}

function _fechaNivelacion(fecha) {
    if (fecha instanceof Date) return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    if (!fecha) return null;
    const partes = String(fecha).slice(0, 10).split('-');
    if (partes.length !== 3) return null;
    const d = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
    return isNaN(d.getTime()) ? null : d;
}

function _claveNivelacion(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function _semanaNivelacion(d) {
    const copia = new Date(d.getTime());
    const dia = (copia.getDay() + 6) % 7;
    copia.setDate(copia.getDate() - dia + 3);
    const jueves = new Date(copia.getFullYear(), copia.getMonth(), copia.getDate());
    const anio = jueves.getFullYear();
    const primerJueves = new Date(anio, 0, 4);
    const primerLunes = new Date(primerJueves.getFullYear(), primerJueves.getMonth(), primerJueves.getDate() - ((primerJueves.getDay() + 6) % 7) + 3 - 3);
    const semana = 1 + Math.round((jueves - primerLunes) / 604800000);
    return anio + '-W' + String(semana).padStart(2, '0');
}

function esDiaLaborablePersona(dia, persona, calendarioGlobal) {
    const fecha = _fechaNivelacion(dia);
    if (!fecha) return false;
    const calendario = calendarioEfectivoPersona(persona, calendarioGlobal);
    if (typeof esDiaNoLaboral === 'function') return !esDiaNoLaboral(fecha, calendario);
    if (calendario.diasNoLaborables.includes(fecha.getDay())) return false;
    return !calendario.festivos.includes(_claveNivelacion(fecha));
}

function siguienteDiaLaborablePersona(dia, persona, calendarioGlobal) {
    const fecha = _fechaNivelacion(dia);
    if (!fecha) return null;
    for (let i = 0; i < 400; i++) {
        fecha.setDate(fecha.getDate() + 1);
        if (esDiaLaborablePersona(fecha, persona, calendarioGlobal)) return _claveNivelacion(fecha);
    }
    return null;
}

/** Curva de recursos por día o semana, con capacidad variable por persona. */
function curvaRecursos(proyectoParam, opciones) {
    const p = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    const opts = opciones || {};
    const calendarioGlobal = opts.calendario || (p && p.calendario) || null;
    const equipo = (p && p.equipo) || [];
    const elementos = (p && p.elementosGantt) || [];
    const recursosMap = new Map();
    equipo.forEach(r => {
        if (!r || r.id == null) return;
        recursosMap.set(String(r.id), {
            id: r.id, nombre: r.nombre || `Recurso ${r.id}`,
            persona: r, capacidad: capacidadDiariaPersona(r), color: r.color || null
        });
    });
    const carga = {};
    const dias = new Set();

    elementos.forEach(e => {
        if (!e || !e.recursoAsignado || !e.inicio || e.tipo === 'edt') return;
        const asignado = e.recursoAsignado;
        const id = String(asignado.id != null ? asignado.id : (asignado.nombre || ''));
        if (!id || id === 'undefined') return;
        if (!recursosMap.has(id)) {
            recursosMap.set(id, {
                id: asignado.id, nombre: asignado.nombre || `Recurso ${id}`,
                persona: asignado, capacidad: capacidadDiariaPersona(asignado), color: asignado.color || null
            });
        }
        const recurso = recursosMap.get(id);
        const inicio = _fechaNivelacion(e.inicio);
        if (!inicio) return;
        const duracion = Math.max(0, Number(e.duracion) || 0);
        if (!duracion) return;
        const horasTotales = Number(e.duracionHoras) > 0 ? Number(e.duracionHoras) : duracion * recurso.capacidad;
        const horasPorDia = horasTotales / duracion;
        const cursor = new Date(inicio.getTime());
        let contador = 0;
        while (contador < duracion && contador < 400) {
            if (esDiaLaborablePersona(cursor, recurso.persona, calendarioGlobal)) {
                const clave = opts.granularidad === 'semana' ? _semanaNivelacion(cursor) : _claveNivelacion(cursor);
                dias.add(clave);
                if (!carga[id]) carga[id] = {};
                carga[id][clave] = (carga[id][clave] || 0) + horasPorDia;
                contador++;
            }
            cursor.setDate(cursor.getDate() + 1);
        }
    });

    const recursos = [...recursosMap.values()].map(({ persona, ...resto }) => resto);
    const sobreasignaciones = [];
    recursos.forEach(r => {
        dias.forEach(clave => {
            const horas = (carga[String(r.id)] && carga[String(r.id)][clave]) || 0;
            if (horas > r.capacidad + 0.01) {
                sobreasignaciones.push({
                    recursoId: r.id, recurso: r.nombre, periodo: clave,
                    horas, capacidad: r.capacidad, exceso: horas - r.capacidad
                });
            }
        });
    });
    return {
        granularidad: opts.granularidad === 'semana' ? 'semana' : 'dia',
        dias: [...dias].sort(), recursos, carga, sobreasignaciones
    };
}

function _clonProyecto(p) {
    return JSON.parse(JSON.stringify(p || {}));
}

/**
 * Reagenda tareas del recurso sobreasignado a su siguiente día hábil disponible.
 * Devuelve escenarios inmutables; el proyecto de entrada nunca se muta.
 */
function simularNivelacionRecursos(proyectoParam, opciones) {
    const original = proyectoParam || (typeof proyecto !== 'undefined' ? proyecto : null);
    if (!original) return [];
    const opts = opciones || {};
    const calendario = (original.calendario || null);
    const baseline = curvaRecursos(original, opts);

    const nivelado = _clonProyecto(original);
    const maxIntentos = Math.max(1, Number(opts.maxIntentos) || 60);
    let movimientos = 0;
    for (let intento = 0; intento < maxIntentos; intento++) {
        const actual = curvaRecursos(nivelado, opts);
        if (!actual.sobreasignaciones.length) break;
        const conflicto = actual.sobreasignaciones[0];
        const candidatas = (nivelado.elementosGantt || []).filter(e => {
            if (!e || !e.recursoAsignado || !e.inicio || e.tipo === 'edt' || e.niveladoBloqueado) return false;
            const id = e.recursoAsignado.id != null ? String(e.recursoAsignado.id) : String(e.recursoAsignado.nombre || '');
            return id === String(conflicto.recursoId) && _claveNivelacion(_fechaNivelacion(e.inicio)) === conflicto.periodo;
        });
        if (!candidatas.length) break;
        candidatas.sort((a, b) => (Number(a.costeEstimado) || 0) - (Number(b.costeEstimado) || 0));
        const tarea = candidatas[candidatas.length - 1];
        const persona = (nivelado.equipo || []).find(r => String(r.id) === String(conflicto.recursoId)) || tarea.recursoAsignado;
        const nuevoInicio = siguienteDiaLaborablePersona(tarea.inicio, persona, calendario);
        if (!nuevoInicio || nuevoInicio === tarea.inicio) {
            tarea.niveladoBloqueado = true;
            continue;
        }
        tarea.inicioNivelado = nuevoInicio;
        tarea.inicio = nuevoInicio;
        tarea.retrasoNivelacion = (Number(tarea.retrasoNivelacion) || 0) + 1;
        tarea.nivelado = true;
        movimientos++;
    }
    const trasNivelar = curvaRecursos(nivelado, opts);

    const agresivo = _clonProyecto(nivelado);
    (agresivo.elementosGantt || []).forEach(e => {
        if (e && e.nivelado && e.duracion > 1) {
            e.duracion = Math.max(1, Number(e.duracion) - 1);
            e.comprimidoPorNivelacion = true;
        }
    });
    const trasAgresivo = curvaRecursos(agresivo, opts);

    const pico = curva => Math.max(0, ...curva.recursos.map(r =>
        Math.max(0, ...curva.dias.map(d => (curva.carga[String(r.id)] && curva.carga[String(r.id)][d]) || 0))));
    const resumen = (id, nombre, curva, escenario, riesgo) => ({
        id, nombre,
        picoHoras: Math.round(pico(curva) * 100) / 100,
        sobreasignaciones: curva.sobreasignaciones.length,
        movimientos,
        riesgo,
        proyecto: escenario
    });

    return [
        resumen('actual', 'Sin nivelar', baseline, _clonProyecto(original), 'Mantiene la sobreasignación detectada'),
        resumen('nivelado', 'Nivelación por disponibilidad', trasNivelar, nivelado, 'Reagenda sin comprimir; puede alargar el cronograma'),
        resumen('comprimido', 'Nivelación + compresión', trasAgresivo, agresivo, 'Reduce duración de tareas reagendadas; mayor riesgo de calidad')
    ];
}

if (typeof window !== 'undefined') {
    window.calendarioEfectivoPersona = calendarioEfectivoPersona;
    window.capacidadDiariaPersona = capacidadDiariaPersona;
    window.esDiaLaborablePersona = esDiaLaborablePersona;
    window.siguienteDiaLaborablePersona = siguienteDiaLaborablePersona;
    window.curvaRecursos = curvaRecursos;
    window.simularNivelacionRecursos = simularNivelacionRecursos;
}
