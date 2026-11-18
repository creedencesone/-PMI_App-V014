        /** ID con sufijo aleatorio para evitar colisiones entre altas rápidas. */
        function nuevoIdFinanciero() { return Date.now() + Math.floor(Math.random() * 10000); }

        /** Carga explícita de datos de ejemplo (nunca automática). */
        function cargarDatosAduanerosDemo() {
            if (!Array.isArray(proyecto.configAranceles) || !proyecto.configAranceles.length) {
                proyecto.configAranceles = [
                    { id: nuevoIdFinanciero(), pais: 'China', paisDestino: 'ES', categoria: 'Electrónica', porcentaje: 15, codigo: '8542' },
                    { id: nuevoIdFinanciero(), pais: 'USA', paisDestino: 'ES', categoria: 'General', porcentaje: 5, codigo: 'G001' }
                ];
            }
            if (!Array.isArray(proyecto.tasasAduanerasFijas) || !proyecto.tasasAduanerasFijas.length) {
                proyecto.tasasAduanerasFijas = [{ id: nuevoIdFinanciero(), concepto: 'Tasa de despacho', tipo: 'fijo', valor: 150, moneda: 'EUR' }];
            }
            guardarProyecto(); renderizarConfigAranceles(); renderizarTasasAduaneras();
            mostrarToast('Datos aduaneros de ejemplo cargados', 'success');
        }

        function inicializarConfigFinanciera() {
            // Las tasas guardadas/editadas deben estar activas desde el primer cálculo.
            try {
                const cache = localStorage.getItem('tiposCambioCache');
                if (cache) tiposCambio = { ...tiposCambio, ...JSON.parse(cache) };
            } catch (error) {
                console.warn('[Finanzas] No se pudo leer tiposCambioCache', error);
            }
            if (!proyecto.configAranceles) proyecto.configAranceles = [];
            if (!proyecto.tasasAduanerasFijas) proyecto.tasasAduanerasFijas = [];
            if (!proyecto.costesFinancierosExtra) proyecto.costesFinancierosExtra = [];
            // Los datos de ejemplo ya no se reinyectan: borrar es definitivo.
            // Se pueden cargar explícitamente con cargarDatosAduanerosDemo().
            renderizarConfigAranceles(); renderizarTasasAduaneras(); renderizarCostesFinancierosExtra();
        }

        function renderizarConfigAranceles() { const tbody = document.getElementById('configArancelesBody'); if (!tbody) return; if (!proyecto.configAranceles || proyecto.configAranceles.length === 0) { tbody.innerHTML = '<tr><td colspan="6">No hay aranceles</td></tr>'; return; } tbody.innerHTML = proyecto.configAranceles.map(a => `<tr><td>${escapeHtml(a.pais)}</td><td>${escapeHtml(a.paisDestino || 'Cualquiera')}</td><td>${escapeHtml(a.categoria)}</td><td>${a.porcentaje}%</td><td>${escapeHtml(a.codigo || '-')}</td><td><span class="edit-btn" onclick="editarConfigArancel(${a.id})"></span><span class="delete-btn" onclick="eliminarConfigArancel(${a.id})"></span></td></tr>`).join(''); }
        function renderizarTasasAduaneras() { const tbody = document.getElementById('tasasFijasBody'); if (!tbody) return; if (!proyecto.tasasAduanerasFijas || proyecto.tasasAduanerasFijas.length === 0) { tbody.innerHTML = '<tr><td colspan="5">No hay tasas</td></tr>'; return; } tbody.innerHTML = proyecto.tasasAduanerasFijas.map(t => `<tr><td>${escapeHtml(t.concepto)}</td><td>${t.tipo === 'fijo' ? 'Fijo' : 'Porcentaje'}</td><td>${t.tipo === 'fijo' ? t.valor + ' ' + t.moneda : t.valor + '%'}</td><td>${t.moneda || '-'}</td><td><span class="edit-btn" onclick="editarTasaAduanera(${t.id})"></span><span class="delete-btn" onclick="eliminarTasaAduanera(${t.id})"></span></td></tr>`).join(''); }
        function renderizarCostesFinancierosExtra() { const tbody = document.getElementById('costesFinancierosExtraBody'); if (!tbody) return; if (!proyecto.costesFinancierosExtra || proyecto.costesFinancierosExtra.length === 0) { tbody.innerHTML = '<tr><td colspan="8">No hay costes</td></tr>'; return; } tbody.innerHTML = proyecto.costesFinancierosExtra.map(c => { let total = c.tipo === 'porcentaje' ? (c.base || 0) * (c.tasa / 100) : c.tasa; return `<tr><td>${escapeHtml(c.concepto)}</td><td>${c.tipo === 'porcentaje' ? '%' : 'Fijo'}</td><td>${c.base || '-'}</td><td>${c.tasa}${c.tipo === 'porcentaje' ? '%' : ''}</td><td>${c.moneda}</td><td>${formatearMoneda(convertirMoneda(total, c.moneda))}</td><td>${c.periodicidad || 'Único'}</td><td><span class="delete-btn" onclick="eliminarCosteFinancieroExtra(${c.id})"></span></td></tr>`; }).join(''); }

        function calcularTodosLosCostesFinancieros() { calcularAnalisisMateriales(); calcularAnalisisEquipo(); renderizarCostesFinancierosExtra(); }

        function calcularTasasFijas(proyecto) {
            return (proyecto.tasasAduanerasFijas || []).filter(t => t.tipo === 'fijo').reduce((sum, t) => sum + convertirMoneda(t.valor, t.moneda), 0);
        }

        /** Resuelve el arancel: personalizado > HS+origen+destino > origen+destino+categoría.
         *  Un código HS suelto sin país no es suficiente: el destino cambia el arancel. */
        function resolverArancelMaterial(material, configAranceles) {
            if (Number(material.arancelPersonalizado) > 0) return Number(material.arancelPersonalizado);
            const codigoMaterial = String(material.hsCode || '').trim().toUpperCase();
            const origen = String(material.paisOrigen || '').toLowerCase();
            const destino = String(material.paisDestino || '').toLowerCase();
            const coinciden = (a, b) => !a || !b || a === b;
            // El destino es restrictivo: si el material no lo informa, sólo
            // aplican reglas genéricas (sin país de destino).
            const coincideDestino = (configDestino, materialDestino) =>
                !configDestino || (!!materialDestino && configDestino === materialDestino);
            const config = (configAranceles || []).find(a => {
                const codigo = String(a.codigo || '').trim().toUpperCase();
                if (codigoMaterial && codigo && codigo === codigoMaterial
                    && coinciden(String(a.pais || '').toLowerCase(), origen)
                    && coincideDestino(String(a.paisDestino || '').toLowerCase(), destino)) return true;
                if (!coinciden(String(a.pais || '').toLowerCase(), origen)) return false;
                if (!coincideDestino(String(a.paisDestino || '').toLowerCase(), destino)) return false;
                return !a.categoria || String(a.categoria).toLowerCase() === String(material.categoria || '').toLowerCase();
            });
            return Number(config?.porcentaje || 0);
        }

        function calcularAnalisisMateriales() {
            const tbody = document.getElementById('analisisMaterialesBody'); if (!tbody) return;
            if (!proyecto.materiales || proyecto.materiales.length === 0) { tbody.innerHTML = '<tr><td colspan="10">No hay materiales</td></tr>'; return; }
            const flete = parseFloat(document.getElementById('factorFlete')?.value || 10) / 100;
            const seguro = parseFloat(document.getElementById('factorSeguro')?.value || 2) / 100;
            const tasasFijas = calcularTasasFijas(proyecto);
            let totalMateriales = 0, totalAranceles = 0, totalTasas = 0, totalTasasPorcentuales = 0, totalFlete = 0, totalSeguro = 0, totalImportacion = 0;
            tbody.innerHTML = proyecto.materiales.map(m => {
                const valorUnitario = convertirMoneda(m.costeUnitario, m.moneda);
                const valorTotalMaterial = m.cantidad * valorUnitario;
                const valorCIF = valorTotalMaterial + (valorTotalMaterial * flete) + (valorTotalMaterial * seguro);
                const arancel = resolverArancelMaterial(m, proyecto.configAranceles);
                const valorArancel = valorCIF * (arancel / 100);
                const tasasPorcentuales = (proyecto.tasasAduanerasFijas || [])
                    .filter(t => t.tipo !== 'fijo')
                    .reduce((sum, t) => sum + valorCIF * (Number(t.valor) || 0) / 100, 0);
                const gastoAgente = Number(document.getElementById('gastoAgenteAduanas')?.value) || 0;
                const valorFlete = valorTotalMaterial * flete;
                const valorSeguro = valorTotalMaterial * seguro;
                const valorTasasItem = tasasPorcentuales + gastoAgente;
                const totalItem = valorCIF + valorArancel + valorTasasItem;
                totalMateriales += valorTotalMaterial; totalAranceles += valorArancel;
                totalTasasPorcentuales += tasasPorcentuales;
                totalFlete += valorFlete; totalSeguro += valorSeguro;
                totalImportacion += totalItem;
                return `<tr>
                    <td>${escapeHtml(m.nombre)}</td>
                    <td>${m.cantidad}</td>
                    <td>${formatearMoneda(valorUnitario)}</td>
                    <td>${m.moneda}</td>
                    <td>${escapeHtml(m.paisOrigen || '-')} → ${escapeHtml(m.paisDestino || '-')}</td>
                    <td>${formatearMoneda(valorCIF)}</td>
                    <td>${arancel}% (${formatearMoneda(valorArancel)})</td>
                    <td>${formatearMoneda(valorTasasItem)}</td>
                    <td>${formatearMoneda(totalItem)}</td>
                    <td>Mes ${m.mes || 1}</td>
                </tr>`;
            }).join('');
            const gastoAgenteTotal = (proyecto.materiales || []).length * (Number(document.getElementById('gastoAgenteAduanas')?.value) || 0);
            totalTasas += tasasFijas + totalTasasPorcentuales + gastoAgenteTotal;
            // El gasto por material ya se incluyó en totalItem; aquí sólo se
            // contabilizan las tasas fijas una única vez.
            totalImportacion += tasasFijas;
            const costlyFleteSeguro = document.getElementById('resumenFleteSeguro');
            if (costlyFleteSeguro) costlyFleteSeguro.innerHTML = formatearMoneda(totalFlete + totalSeguro);
            document.getElementById('resumenCosteMateriales').innerHTML = formatearMoneda(totalMateriales);
            document.getElementById('resumenTotalAranceles').innerHTML = formatearMoneda(totalAranceles);
            document.getElementById('resumenTotalTasas').innerHTML = formatearMoneda(totalTasas);
            document.getElementById('resumenTotalImportacion').innerHTML = formatearMoneda(totalImportacion);
        }

        function calcularAnalisisEquipo() {
            const tbody = document.getElementById('analisisEquipoBody'); if (!tbody) return;
            const duracionMeses = parseFloat(document.getElementById('duracionProyectoMeses')?.value || 12);
            if (!proyecto.equipo || proyecto.equipo.length === 0) { tbody.innerHTML = '<tr><td colspan="8">No hay personal</td></tr>'; return; }
            let total = 0;
            tbody.innerHTML = proyecto.equipo.map(m => { const totalMiembro = convertirMoneda(m.costeHora * m.horasMes * duracionMeses, m.moneda); total += totalMiembro; return `<tr>
                <td>${escapeHtml(m.nombre)}</td>
                <td>${escapeHtml(m.rol || '-')}</td>
                <td>${m.costeHora}</td>
                <td>${m.horasMes}</td>
                <td>${duracionMeses}</td>
                <td>${formatearMoneda(totalMiembro)}</td>
                <td>${m.moneda}</td>
                <td><span class="edit-btn" onclick="editarEquipo(${m.id})"></span></td>
                </tr>`; }).join('');
        }

        function mostrarSubpanelAnalisis(subpanel, btn) {
            document.querySelectorAll('.subpanel-analisis').forEach(el => el.style.display = 'none');
            document.getElementById(`subpanel${subpanel.charAt(0).toUpperCase() + subpanel.slice(1)}`).style.display = 'block';
            document.querySelectorAll('.btn-tab').forEach(b => { b.style.color = 'rgba(255,255,255,0.7)'; b.style.borderBottom = 'none'; });
            if (btn) { btn.style.color = '#007AFF'; btn.style.borderBottom = '2px solid #007AFF'; }
            if (subpanel === 'materiales') calcularAnalisisMateriales();
            if (subpanel === 'equipo') calcularAnalisisEquipo();
            if (subpanel === 'servicios') renderizarServicios();
        }

        function abrirModalConfigArancel(item) {
            const a = item || {};
            const modal = `<div class="modal-content"><div class="modal-header"><h3>${item ? 'Editar' : 'Nuevo'} arancel</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <div class="form-row">
                    <div class="form-group"><label>País de origen</label><input id="arqOrigen" value="${escapeHtml(a.pais || '')}" required maxlength="80"></div>
                    <div class="form-group"><label>País de destino</label><input id="arqDestino" value="${escapeHtml(a.paisDestino || '')}" maxlength="80" placeholder="Cualquiera"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Categoría</label><input id="arqCategoria" value="${escapeHtml(a.categoria || '')}" maxlength="80"></div>
                    <div class="form-group"><label>Código HS</label><input id="arqCodigo" value="${escapeHtml(a.codigo || '')}" maxlength="20"></div>
                </div>
                <div class="form-group"><label>Porcentaje (%)</label><input id="arqPorcentaje" type="number" min="0" max="100" step="0.01" value="${Number(a.porcentaje) || 0}" required></div>
                <button class="btn btn-primary" onclick="guardarConfigArancel(${item ? Number(item.id) : 0})">Guardar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modal}</div>`;
        }

        function guardarConfigArancel(id) {
            const valor = x => document.getElementById(x)?.value.trim() || '';
            const datos = {
                pais: valor('arqOrigen'), paisDestino: valor('arqDestino'), categoria: valor('arqCategoria'),
                codigo: valor('arqCodigo'), porcentaje: Number(document.getElementById('arqPorcentaje')?.value) || 0
            };
            if (!datos.pais) { mostrarToast('El país de origen es obligatorio', 'error'); return; }
            if (!proyecto.configAranceles) proyecto.configAranceles = [];
            let antes = null, entidadId = id;
            if (id) {
                const item = proyecto.configAranceles.find(a => a.id === id);
                antes = item ? { ...item } : null;
                if (item) Object.assign(item, datos);
            } else {
                entidadId = nuevoIdFinanciero();
                proyecto.configAranceles.push({ id: entidadId, ...datos });
            }
            registrarBitacoraSiExiste('configAranceles', entidadId, id ? 'actualizar' : 'crear', antes, datos);
            guardarProyecto(); renderizarConfigAranceles(); calcularAnalisisMateriales(); cerrarModalGeneric();
            mostrarToast('Arancel guardado', 'success');
        }

        function editarConfigArancel(id) { abrirModalConfigArancel((proyecto.configAranceles || []).find(a => a.id === id)); }

        function abrirModalTasaAduaneraFija(item) {
            const t = item || {};
            const modal = `<div class="modal-content"><div class="modal-header"><h3>${item ? 'Editar' : 'Nueva'} tasa aduanera</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <div class="form-group"><label>Concepto</label><input id="tasConcepto" value="${escapeHtml(t.concepto || '')}" required maxlength="120"></div>
                <div class="form-row">
                    <div class="form-group"><label>Tipo</label><select id="tasTipo"><option value="fijo"${t.tipo === 'fijo' ? ' selected' : ''}>Fijo</option><option value="porcentaje"${t.tipo === 'porcentaje' ? ' selected' : ''}>Porcentaje</option></select></div>
                    <div class="form-group"><label>Valor</label><input id="tasValor" type="number" min="0" step="0.01" value="${Number(t.valor) || 0}" required></div>
                </div>
                <div class="form-group"><label>Moneda</label><input id="tasMoneda" value="${escapeHtml(t.moneda || proyecto.monedaBase || 'EUR')}" maxlength="10"></div>
                <button class="btn btn-primary" onclick="guardarTasaAduanera(${item ? Number(item.id) : 0})">Guardar</button>
            </div>`;
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modal}</div>`;
        }

        function guardarTasaAduanera(id) {
            const datos = {
                concepto: document.getElementById('tasConcepto')?.value.trim() || '',
                tipo: document.getElementById('tasTipo')?.value || 'fijo',
                valor: Number(document.getElementById('tasValor')?.value) || 0,
                moneda: document.getElementById('tasMoneda')?.value.trim() || proyecto.monedaBase || 'EUR'
            };
            if (!datos.concepto) { mostrarToast('El concepto es obligatorio', 'error'); return; }
            if (!proyecto.tasasAduanerasFijas) proyecto.tasasAduanerasFijas = [];
            let antes = null, entidadId = id;
            if (id) {
                const item = proyecto.tasasAduanerasFijas.find(t => t.id === id);
                antes = item ? { ...item } : null;
                if (item) Object.assign(item, datos);
            } else {
                entidadId = nuevoIdFinanciero();
                proyecto.tasasAduanerasFijas.push({ id: entidadId, ...datos });
            }
            registrarBitacoraSiExiste('tasasAduaneras', entidadId, id ? 'actualizar' : 'crear', antes, datos);
            guardarProyecto(); renderizarTasasAduaneras(); calcularAnalisisMateriales(); cerrarModalGeneric();
            mostrarToast('Tasa aduanera guardada', 'success');
        }

        function editarTasaAduanera(id) { abrirModalTasaAduaneraFija((proyecto.tasasAduanerasFijas || []).find(t => t.id === id)); }
        function abrirModalCosteFinancieroExtra() {
            document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal"><div class="modal-content">
                <div class="modal-header"><h3>Nuevo coste financiero</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
                <div class="form-group"><label>Concepto</label><input id="cfeConcepto" required maxlength="120"></div>
                <div class="form-row">
                    <div class="form-group"><label>Tipo</label><select id="cfeTipo"><option value="fijo">Fijo</option><option value="porcentaje">Porcentaje</option></select></div>
                    <div class="form-group"><label>Tasa o importe</label><input id="cfeTasa" type="number" min="0" step="0.01" required></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Base (sólo porcentaje)</label><input id="cfeBase" type="number" min="0" step="0.01" value="0"></div>
                    <div class="form-group"><label>Moneda</label><input id="cfeMoneda" value="${escapeHtml(proyecto.monedaBase || 'EUR')}" maxlength="10"></div>
                </div>
                <div class="form-group"><label>Periodicidad</label><input id="cfePeriodicidad" maxlength="40" placeholder="Único, mensual, trimestral..."></div>
                <button class="btn btn-primary" onclick="guardarCosteFinancieroExtra()">Guardar</button>
            </div></div>`;
            if (typeof window.abrirModalAccesible === 'function') window.abrirModalAccesible(document.getElementById('genericModal'));
        }

        function guardarCosteFinancieroExtra() {
            const datos = {
                concepto: document.getElementById('cfeConcepto')?.value.trim() || '',
                tipo: document.getElementById('cfeTipo')?.value || 'fijo',
                tasa: Number(document.getElementById('cfeTasa')?.value) || 0,
                base: Number(document.getElementById('cfeBase')?.value) || 0,
                moneda: document.getElementById('cfeMoneda')?.value.trim() || proyecto.monedaBase || 'EUR',
                periodicidad: document.getElementById('cfePeriodicidad')?.value.trim() || 'Único'
            };
            if (!datos.concepto || datos.tasa <= 0) { mostrarToast('Concepto y tasa obligatorios', 'error'); return; }
            const id = nuevoIdFinanciero();
            if (!Array.isArray(proyecto.costesFinancierosExtra)) proyecto.costesFinancierosExtra = [];
            proyecto.costesFinancierosExtra.push({ id, ...datos });
            registrarBitacoraSiExiste('costesFinancierosExtra', id, 'crear', null, datos);
            guardarProyecto(); renderizarCostesFinancierosExtra(); cerrarModalGeneric();
            mostrarToast('Coste financiero añadido', 'success');
        }
        function registrarBitacoraSiExiste(entidad, id, accion, antes, despues) {
            if (typeof registrarBitacora === 'function') registrarBitacora(entidad, id, accion, antes, despues);
        }
        function eliminarConfigArancel(id) {
            const antes = (proyecto.configAranceles || []).find(a => a.id === id) || null;
            proyecto.configAranceles = (proyecto.configAranceles || []).filter(a => a.id !== id);
            registrarBitacoraSiExiste('configAranceles', id, 'eliminar', antes, null);
            guardarProyecto(); renderizarConfigAranceles(); calcularAnalisisMateriales(); mostrarToast(tApp('toast_eliminado'), 'success');
        }
        function eliminarTasaAduanera(id) {
            const antes = (proyecto.tasasAduanerasFijas || []).find(t => t.id === id) || null;
            proyecto.tasasAduanerasFijas = (proyecto.tasasAduanerasFijas || []).filter(t => t.id !== id);
            registrarBitacoraSiExiste('tasasAduaneras', id, 'eliminar', antes, null);
            guardarProyecto(); renderizarTasasAduaneras(); calcularAnalisisMateriales(); mostrarToast(tApp('toast_eliminado'), 'success');
        }
        function eliminarCosteFinancieroExtra(id) {
            const antes = (proyecto.costesFinancierosExtra || []).find(c => c.id === id) || null;
            proyecto.costesFinancierosExtra = (proyecto.costesFinancierosExtra || []).filter(c => c.id !== id);
            registrarBitacoraSiExiste('costesFinancierosExtra', id, 'eliminar', antes, null);
            guardarProyecto(); renderizarCostesFinancierosExtra(); mostrarToast(tApp('toast_eliminado'), 'success');
        }
        function actualizarArancelesTodos() { calcularAnalisisMateriales(); mostrarToast(" Aranceles actualizados", 'success'); }

        // ============================================
        // APIS Y ACTUALIZACIÓN EXTERNA
        // ============================================
        let ultimaActualizacionCambio = null;

// ============================================
// TIPOS DE CAMBIO - VERSIÓN CORREGIDA Y UNIFICADA
// ============================================
// CONFIGURACIÓN DE PROVEEDORES DE TIPOS DE CAMBIO
// ============================================
const PROVEEDORES_TASAS = {
    frankfurter: {
        nombre: 'Frankfurter API (BCE)',
        url: 'https://api.frankfurter.app/latest?from=EUR',
        parser: (data) => data.rates,
        requiereKey: false
    },
    exchangerate: {
        nombre: 'ExchangeRate-API',
        url: 'https://open.er-api.com/v6/latest/EUR',
        parser: (data) => data.rates,
        requiereKey: false
    },
    currencyapi: {
        nombre: 'CurrencyAPI',
        url: 'https://api.currencyapi.com/v3/latest?base_currency=EUR',
        parser: (data) => {
            const rates = {};
            for (const [k, v] of Object.entries(data.data)) rates[k] = v.value;
            return rates;
        },
        requiereKey: true
    }
};

let proveedorActual = 'auto';
let autoUpdateInterval = 86400000;
let autoUpdateTimer = null;

// ============================================

// VERSIÓN MEJORADA - Múltiples APIs con fallback
const SVG_REFRESH_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>';

async function actualizarTiposCambioAuto() {
    const btn = document.getElementById('btnActualizarTipos');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span style="display:inline-block;animation:monedaSpin 1s linear infinite">' + SVG_REFRESH_ICON + '</span>';
    }
    mostrarToast(" Actualizando tipos de cambio...", 'info');

    const proveedores = proveedorActual === 'auto'
        ? ['frankfurter', 'exchangerate']
        : [proveedorActual];

    for (const provId of proveedores) {
        const prov = PROVEEDORES_TASAS[provId];
        if (!prov) continue;

        try {
            mostrarToast(` Intentando ${prov.nombre}...`, 'info');
            const response = await fetch(prov.url);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            const rates = prov.parser(data);

            if (rates && Object.keys(rates).length > 0) {
                tiposCambio = { EUR: 1 };

                for (const [moneda, tasa] of Object.entries(rates)) {
                    if (typeof tasa === 'number' && tasa > 0) {
                        tiposCambio[moneda] = tasa;
                    }
                }

                const faltantes = Object.keys(MONEDAS).filter(m => !tiposCambio[m]);
                if (faltantes.length && provId !== 'exchangerate') {
                    try {
                        const r2 = await fetch('https://open.er-api.com/v6/latest/EUR');
                        if (r2.ok) {
                            const d2 = await r2.json();
                            if (d2 && d2.rates) {
                                faltantes.forEach(m => {
                                    const v = d2.rates[m];
                                    if (typeof v === 'number' && v > 0) tiposCambio[m] = v;
                                });
                            }
                        }
                    } catch (e) {}
                }

                // Añadir monedas extra que no estén en la API
                const monedasExtra = {
                    USD: 1.1603, GBP: 0.858, JPY: 178.482, CHF: 0.9465,
                    BRL: 5.9218, MXN: 19.683, COP: 3608.9243, ARS: 1751.9618, CLP: 1089.0409,
                    DZD: 154.7319, CDF: 2683.3008, MZN: 74.3037, ZAR: 18.7189,
                    NGN: 1582.1055, KES: 150.4795, EGP: 59.5726, MAD: 10.9132,
                    VES: 977.8778, UYU: 46.8129, PEN: 3.9008, BOB: 14.6552, PYG: 6862.2429,
                    GHS: 13.2637, TND: 3.3782, ETB: 188.6609, TZS: 3069.14, UGX: 4362.6583,
                    RWF: 1714.9784, AOA: 1104.1025, XOF: 655.957, XAF: 655.957,
                    ZMW: 22.2952, BWP: 16.3762, MUR: 54.3755
                };

                for (const [moneda, tasa] of Object.entries(monedasExtra)) {
                    if (!tiposCambio[moneda]) tiposCambio[moneda] = tasa;
                }

                // Guardar en caché
                localStorage.setItem('tiposCambioCache', JSON.stringify(tiposCambio));
                localStorage.setItem('tiposCambioFuente', provId);
                ultimaActualizacionCambio = new Date();
                localStorage.setItem('ultimaActualizacionCambio', ultimaActualizacionCambio.toISOString());

                actualizarTiposCambioUI();
                mostrarFechaUltimaActualizacion();
                actualizarStatsMonedas();

                if (typeof calcularCashflow === 'function') calcularCashflow();
                if (typeof actualizarResumenGastos === 'function') actualizarResumenGastos();

                mostrarToast(` Tipos actualizados desde ${prov.nombre} (${Object.keys(tiposCambio).length} monedas)`, 'success');
                return;
            }
        } catch (error) {
            console.warn(`Error ${prov.nombre}:`, error.message);
            continue;
        }
    }

    // Si todas fallan, usar caché o respaldo
    mostrarToast(" Error en APIs. Usando datos en caché.", 'warning');
    const cache = localStorage.getItem('tiposCambioCache');
    if (cache) {
        tiposCambio = JSON.parse(cache);
        actualizarTiposCambioUI();
        mostrarFechaUltimaActualizacion();
        actualizarStatsMonedas();
    } else {
        usarTiposCambioRespaldo();
    }

    if (btn) {
        btn.disabled = false;
        btn.innerHTML = SVG_REFRESH_ICON;
    }
}

function cambiarProveedorTasas(nuevoProveedor) {
    proveedorActual = nuevoProveedor;
    localStorage.setItem('proveedorTasas', nuevoProveedor);
    if (nuevoProveedor !== 'manual') {
        actualizarTiposCambioAuto();
    }
}

function configurarAutoUpdate(intervalo) {
    autoUpdateInterval = parseInt(intervalo);
    localStorage.setItem('autoUpdateInterval', autoUpdateInterval);
    if (autoUpdateTimer) clearInterval(autoUpdateTimer);
    if (autoUpdateInterval > 0) {
        autoUpdateTimer = setInterval(actualizarTiposCambioAuto, autoUpdateInterval);
    }
}

function probarConexionAPI() {
    const provId = proveedorActual === 'auto' ? 'frankfurter' : proveedorActual;
    const prov = PROVEEDORES_TASAS[provId];
    if (!prov) return;

    mostrarToast(` Probando ${prov.nombre}...`, 'info');
    fetch(prov.url)
        .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
        .then(data => {
            const rates = prov.parser(data);
            mostrarToast(` ${prov.nombre} OK - ${Object.keys(rates).length} monedas`, 'success');
        })
        .catch(err => {
            mostrarToast(` ${prov.nombre} falló: ${err.message}`, 'error');
        });
}

function exportarTiposCambio() {
    if (!tiposCambio) return;
    let csv = 'Moneda,Tasa (1 EUR = ?),Fuente,Fecha\n';
    const fuente = localStorage.getItem('tiposCambioFuente') || 'desconocida';
    const fecha = new Date().toISOString().split('T')[0];
    for (const [moneda, tasa] of Object.entries(tiposCambio)) {
        csv += `${moneda},${tasa},${fuente},${fecha}\n`;
    }
    descargarArchivo(csv, `tipos_cambio_${fecha}.csv`, 'text/csv');
    mostrarToast(' Tipos de cambio exportados', 'success');
}

function importarTiposCambio() {
    document.getElementById('importTiposCambioFile').click();
}

function procesarImportTiposCambio(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n');
        let count = 0;
        for (let i = 1; i < lines.length; i++) {
            const [moneda, tasa] = lines[i].split(',');
            if (moneda && tasa) {
                tiposCambio[moneda.trim()] = parseFloat(tasa);
                count++;
            }
        }
        localStorage.setItem('tiposCambioCache', JSON.stringify(tiposCambio));
        actualizarTiposCambioUI();
        actualizarStatsMonedas();
        mostrarToast(` ${count} tasas importadas`, 'success');
    };
    reader.readAsText(file);
}

function usarTiposCambioRespaldo() {
    console.log(" Usando tipos de cambio de respaldo (valores fijos)");

    tiposCambio = {
        EUR: 1, USD: 1.1603, GBP: 0.858, JPY: 178.482, CHF: 0.9465,
        BRL: 5.9218, MXN: 19.683, COP: 3608.9243, ARS: 1751.9618, CLP: 1089.0409,
        DZD: 154.7319, CDF: 2683.3008, MZN: 74.3037, ZAR: 18.7189,
        NGN: 1582.1055, KES: 150.4795, EGP: 59.5726, MAD: 10.9132,
        VES: 977.8778, UYU: 46.8129, PEN: 3.9008, BOB: 14.6552, PYG: 6862.2429,
        CNY: 7.8016, INR: 110.8364, KRW: 1559.7241, SGD: 1.4704, HKD: 9.101,
        TRY: 56.3739, PLN: 4.3215, CZK: 24.2392, HUF: 363.6758, RON: 5.2547,
        SEK: 11.2507, NOK: 10.7781, DKK: 7.4748, ISK: 139.6628,
        GHS: 13.2637, TND: 3.3782, ETB: 188.6609, TZS: 3069.14, UGX: 4362.6583,
        RWF: 1714.9784, AOA: 1104.1025, XOF: 655.957, XAF: 655.957,
        ZMW: 22.2952, BWP: 16.3762, MUR: 54.3755
    };

    localStorage.setItem('tiposCambioCache', JSON.stringify(tiposCambio));
    localStorage.setItem('tiposCambioFuente', 'respaldo');
    ultimaActualizacionCambio = new Date();
    localStorage.setItem('ultimaActualizacionCambio', ultimaActualizacionCambio.toISOString());

    actualizarTiposCambioUI();
    mostrarFechaUltimaActualizacion();
    actualizarStatsMonedas();

    if (typeof calcularCashflow === 'function') calcularCashflow();
    if (typeof actualizarResumenGastos === 'function') actualizarResumenGastos();

    mostrarToast(" Usando tipos de cambio de respaldo (valores fijos)", 'info');
}

// Cargar proveedor guardado al inicio
document.addEventListener('DOMContentLoaded', () => {
    const savedProv = localStorage.getItem('proveedorTasas');
    if (savedProv) {
        proveedorActual = savedProv;
        const sel = document.getElementById('proveedorTasas');
        if (sel) sel.value = savedProv;
    }
    const savedInterval = localStorage.getItem('autoUpdateInterval');
    if (savedInterval) {
        autoUpdateInterval = parseInt(savedInterval);
        const sel = document.getElementById('autoUpdateInterval');
        if (sel) sel.value = autoUpdateInterval;
        if (autoUpdateInterval > 0) {
            autoUpdateTimer = setInterval(actualizarTiposCambioAuto, autoUpdateInterval);
        }
    }
});

function actualizarTiposCambioUI() {
    const container = document.getElementById('tiposCambioContainer');
    if (!container) return;

    if (!tiposCambio || Object.keys(tiposCambio).length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon"></div><p>No hay datos de tasas. Pulsa "Actualizar Tasas".</p></div>';
        return;
    }

    const monedasConRegion = getMonedasConRegion();
    const rows = Object.entries(tiposCambio).map(([moneda, tasa]) => {
        const info = monedasConRegion[moneda] || { region: 'other', nombre: moneda, flag: '' };
        const changeClass = tasa > 1 ? 'rate-high' : (tasa < 1 ? 'rate-low' : '');
        return `<tr data-moneda="${moneda}" data-region="${info.region}" data-nombre="${info.nombre.toLowerCase()}">
            <td class="moneda-cell">
                <span class="moneda-flag">${info.flag}</span>
                <span class="moneda-code">${moneda}</span>
                <span class="moneda-name">${info.nombre}</span>
            </td>
            <td class="tasa-cell">
                <input type="number" id="tasa_${moneda}" value="${tasa}" step="0.0001" class="tasa-input ${changeClass}" aria-label="Tasa para ${moneda}">
                <button class="btn-icon-btn" onclick="guardarTasa('${moneda}')" title="Guardar tasa" aria-label="Guardar tasa para ${moneda}"></button>
            </td>
        </tr>`;
    }).join('');

    container.innerHTML = `
        <table class="data-table tasas-table">
            <thead>
                <tr>
                    <th>Moneda</th>
                    <th>Tasa (1 EUR = ?)</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        <div class="table-footer">
            <span>${Object.keys(tiposCambio).length} monedas</span>
            <span class="fuente-badge">Fuente: ${getFuenteNombre()}</span>
        </div>`;

    actualizarStatsMonedas();
}

function getFuenteNombre() {
    const fuente = localStorage.getItem('tiposCambioFuente') || 'desconocida';
    const nombres = {
        frankfurter: ' Frankfurter (BCE)',
        exchangerate: ' ExchangeRate-API',
        currencyapi: ' CurrencyAPI',
        respaldo: ' Respaldo local',
        manual: ' Manual'
    };
    return nombres[fuente] || fuente;
}

function actualizarStatsMonedas() {
    const totalEl = document.getElementById('statTotalMonedas');
    const fuenteEl = document.getElementById('statFuenteActiva');
    const fechaEl = document.getElementById('statUltimaAct');
    const baseEl = document.getElementById('statMonedaBase');

    if (totalEl) totalEl.textContent = Object.keys(tiposCambio || {}).length;
    if (fuenteEl) fuenteEl.textContent = getFuenteNombre().split(' ')[0];
    if (fechaEl && ultimaActualizacionCambio) {
        const fecha = new Date(ultimaActualizacionCambio);
        fechaEl.textContent = fecha.toLocaleDateString('es-ES') + ' ' + fecha.toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'});
    }
    if (baseEl && proyecto) baseEl.textContent = proyecto.monedaBase || 'EUR';
}

function getMonedasConRegion() {
    return {
        EUR: {region: 'europe', nombre: 'Euro', flag: '🇪🇺'},
        USD: {region: 'americas', nombre: 'Dólar EE.UU.', flag: '🇺🇸'},
        GBP: {region: 'europe', nombre: 'Libra Esterlina', flag: '🇬🇧'},
        JPY: {region: 'asia', nombre: 'Yen Japonés', flag: '🇯🇵'},
        CHF: {region: 'europe', nombre: 'Franco Suizo', flag: '🇨🇭'},
        BRL: {region: 'americas', nombre: 'Real Brasileño', flag: '🇧🇷'},
        MXN: {region: 'americas', nombre: 'Peso Mexicano', flag: '🇲🇽'},
        COP: {region: 'americas', nombre: 'Peso Colombiano', flag: '🇨🇴'},
        ARS: {region: 'americas', nombre: 'Peso Argentino', flag: '🇦🇷'},
        CLP: {region: 'americas', nombre: 'Peso Chileno', flag: '🇨🇱'},
        DZD: {region: 'africa', nombre: 'Dinar Argelino', flag: '🇩🇿'},
        CDF: {region: 'africa', nombre: 'Franco Congoleño', flag: '🇨🇩'},
        MZN: {region: 'africa', nombre: 'Metical Mozambique', flag: '🇲🇿'},
        ZAR: {region: 'africa', nombre: 'Rand Sudafricano', flag: '🇿🇦'},
        NGN: {region: 'africa', nombre: 'Naira Nigeriano', flag: '🇳🇬'},
        KES: {region: 'africa', nombre: 'Chelín Keniano', flag: '🇰🇪'},
        EGP: {region: 'africa', nombre: 'Libra Egipcia', flag: '🇪🇬'},
        MAD: {region: 'africa', nombre: 'Dirham Marroquí', flag: '🇲🇦'},
        GHS: {region: 'africa', nombre: 'Cedi Ghanés', flag: '🇬🇭'},
        TND: {region: 'africa', nombre: 'Dinar Tunecino', flag: '🇹🇳'},
        ETB: {region: 'africa', nombre: 'Birr Etíope', flag: '🇪🇹'},
        TZS: {region: 'africa', nombre: 'Chelín Tanzano', flag: '🇹🇿'},
        UGX: {region: 'africa', nombre: 'Chelín Ugandés', flag: '🇺🇬'},
        RWF: {region: 'africa', nombre: 'Franco Ruandés', flag: '🇷🇼'},
        AOA: {region: 'africa', nombre: 'Kwanza Angoleño', flag: '🇦🇴'},
        XOF: {region: 'africa', nombre: 'Franco CFA (BCEAO)', flag: ''},
        XAF: {region: 'africa', nombre: 'Franco CFA (BEAC)', flag: ''},
        ZMW: {region: 'africa', nombre: 'Kwacha Zambiano', flag: '🇿🇲'},
        BWP: {region: 'africa', nombre: 'Pula Botsuana', flag: '🇧🇼'},
        MUR: {region: 'africa', nombre: 'Rupia Mauriciana', flag: '🇲🇺'},
        CNY: {region: 'asia', nombre: 'Yuan Chino', flag: '🇨🇳'},
        INR: {region: 'asia', nombre: 'Rupia India', flag: '🇮🇳'},
        KRW: {region: 'asia', nombre: 'Won Surcoreano', flag: '🇰🇷'},
        SGD: {region: 'asia', nombre: 'Dólar Singapur', flag: '🇸🇬'},
        HKD: {region: 'asia', nombre: 'Dólar Hong Kong', flag: '🇭🇰'},
        TRY: {region: 'asia', nombre: 'Lira Turca', flag: '🇹🇷'},
        PLN: {region: 'europe', nombre: 'Zloty Polaco', flag: '🇵🇱'},
        CZK: {region: 'europe', nombre: 'Corona Checa', flag: '🇨🇿'},
        HUF: {region: 'europe', nombre: 'Forinto Húngaro', flag: '🇭🇺'},
        RON: {region: 'europe', nombre: 'Leu Rumano', flag: '🇷🇴'},
        SEK: {region: 'europe', nombre: 'Corona Sueca', flag: '🇸🇪'},
        NOK: {region: 'europe', nombre: 'Corona Noruega', flag: '🇳🇴'},
        DKK: {region: 'europe', nombre: 'Corona Danesa', flag: '🇩🇰'},
        ISK: {region: 'europe', nombre: 'Corona Islandesa', flag: '🇮🇸'},
        VES: {region: 'americas', nombre: 'Bolívar Venezolano', flag: '🇻🇪'},
        UYU: {region: 'americas', nombre: 'Peso Uruguayo', flag: '🇺🇾'},
        PEN: {region: 'americas', nombre: 'Sol Peruano', flag: '🇵🇪'},
        BOB: {region: 'americas', nombre: 'Boliviano', flag: '🇧🇴'},
        PYG: {region: 'americas', nombre: 'Guaraní Paraguayo', flag: '🇵🇾'}
    };
}

function filtrarMonedas(texto) {
    const filas = document.querySelectorAll('#tiposCambioContainer tbody tr');
    const busqueda = texto.toLowerCase();
    filas.forEach(fila => {
        const moneda = fila.dataset.moneda.toLowerCase();
        const nombre = fila.dataset.nombre.toLowerCase();
        fila.style.display = (moneda.includes(busqueda) || nombre.includes(busqueda)) ? '' : 'none';
    });
}

function filtrarPorRegion(region) {
    const filas = document.querySelectorAll('#tiposCambioContainer tbody tr');
    filas.forEach(fila => {
        fila.style.display = (!region || fila.dataset.region === region) ? '' : 'none';
    });
}

function cambiarTabMonedas(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

    const btn = document.querySelector(`[data-tab="${tabId}"]`);
    const panel = document.getElementById(tabId);
    if (btn) btn.classList.add('active');
    if (panel) panel.classList.add('active');

    if (tabId === 'tab-evolucion') {
        setTimeout(() => actualizarGraficoEvolucionMoneda(), 100);
    }
}

function refrescarCalculosFinancieros() {
    if (typeof calcularCashflow === 'function') calcularCashflow();
    if (typeof actualizarResumenGastos === 'function') actualizarResumenGastos();
    if (typeof actualizarPanelSalud === 'function') actualizarPanelSalud();
    if (typeof actualizarInformeCompleto === 'function') actualizarInformeCompleto();
}

function guardarTasa(moneda) {
    const input = document.getElementById(`tasa_${moneda}`);
    if (input) {
        const valor = parseFloat(input.value);
        if (!isNaN(valor) && valor > 0) {
            tiposCambio[moneda] = valor;
            localStorage.setItem('tiposCambioCache', JSON.stringify(tiposCambio));
            input.classList.add('saved');
            setTimeout(() => input.classList.remove('saved'), 1000);
            refrescarCalculosFinancieros();
            mostrarToast(` Tasa ${moneda} guardada: ${valor}`, 'success');
        }
    }
}

function actualizarTiposCambio() {
    for (const moneda of Object.keys(tiposCambio)) {
        const input = document.getElementById(`tasa_${moneda}`);
        if (input) tiposCambio[moneda] = parseFloat(input.value);
    }
    localStorage.setItem('tiposCambioCache', JSON.stringify(tiposCambio));
    refrescarCalculosFinancieros();
    mostrarToast(tApp('toast_tipos_cambio_guardados'), 'success');
}

function cambiarMonedaBaseYActualizar() {
    const nuevaBase = document.getElementById('monedaBase').value;
    if (proyecto) {
        proyecto.monedaBase = nuevaBase;
        guardarProyecto();
        document.getElementById('monedaDisplay').innerHTML = nuevaBase;
        refrescarCalculosFinancieros();
        mostrarToast(` Moneda base cambiada a: ${nuevaBase}`, 'success');
    }
}

function mostrarFechaUltimaActualizacion() {
    const span = document.getElementById('ultimaActualizacionCambio');
    if (span) {
        if (ultimaActualizacionCambio) {
            const fecha = new Date(ultimaActualizacionCambio);
            span.innerText = fecha.toLocaleString('es-ES');
        } else {
            span.innerText = 'No actualizada';
        }
    }
}

function actualizarTodosLosDatosExternos() {
    actualizarTiposCambioAuto();
    if (typeof actualizarArancelesTodos === 'function') actualizarArancelesTodos();
    mostrarToast(" Actualizando todos los datos...", 'info');
}

function exportarExcel() {
    let csv = "Nombre,Valor\n";
    csv += `Coste Total,${document.getElementById('totalCoste')?.innerText || '0'}\n`;
    csv += `Ingreso Total,${document.getElementById('totalIngreso')?.innerText || '0'}\n`;
    csv += `Beneficio,${document.getElementById('totalBeneficio')?.innerText || '0'}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `proyecto_${proyecto.nombre}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    mostrarToast(" Exportado a CSV", 'success');
}
        // ============================================
        // EXPORTAR PROYECTO ACTUAL A JSON
        // ============================================

        async function exportarProyectoActual() {
            if (!proyecto) {
                mostrarToast(tApp('toast_no_proyecto'), 'error');
                return;
            }

            const datosExportar = {
                version: "1.0",
                fechaExportacion: new Date().toISOString(),
                tipo: "proyecto_unico",
                proyecto: proyecto
            };

            const jsonStr = JSON.stringify(datosExportar, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const nombreArchivo = `${proyecto.nombre.replace(/[^a-z0-9]/gi, '_')}_backup_${new Date().toISOString().split('T')[0]}.json`;

            // Usar File System Access API si está disponible (Chrome/Edge)
            if ('showSaveFilePicker' in window) {
                try {
                    const opciones = {
                        suggestedName: nombreArchivo,
                        types: [{
                            description: 'Archivo JSON',
                            accept: { 'application/json': ['.json'] }
                        }]
                    };
                    const fileHandle = await window.showSaveFilePicker(opciones);
                    const writable = await fileHandle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                    mostrarToast(` Proyecto "${proyecto.nombre}" guardado correctamente`, 'success');
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        descargaTradicionalProyecto(blob, nombreArchivo);
                    }
                }
            } else {
                // Firefox, Safari - descarga directa
                descargaTradicionalProyecto(blob, nombreArchivo);
            }
        }
        // ============================================
// IMPORTAR PROYECTO DESDE ARCHIVO

// ============================================
// IMPORTACIONES — proveedores, contratos, órdenes y pagos
// ============================================

function renderizarImportaciones() {
    const entidades = {
        proveedores: ['proveedoresBody', p => [p.nombre, p.pais || '—']],
        contratos: ['contratosBody', c => [c.proveedor, formatearMoneda(convertirMoneda(c.importe || 0, c.moneda || proyecto.monedaBase))]],
        ordenesCompra: ['ordenesCompraBody', o => {
            const estado = estadoRecepcionOrden(o);
            const alerta = estado === 'Retrasada' || estado === 'Fuera de plazo' ? ' ⚠' : '';
            return [o.numero, formatearMoneda(convertirMoneda(o.importe || 0, o.moneda || proyecto.monedaBase)),
                o.fechaCompromiso || '—', o.fechaRecepcion || '—', estado + alerta];
        }],
        pagosRealizados: ['pagosRealizadosBody', p => [p.orden, formatearMoneda(convertirMoneda(p.importe || 0, p.moneda || proyecto.monedaBase))]]
    };
    Object.entries(entidades).forEach(([clave, [tbodyId, columnas]]) => {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        const filas = proyecto[clave] || [];
        const colspanVacio = clave === 'ordenesCompra' ? 6 : 3;
        tbody.innerHTML = filas.map(item => `<tr>
            ${columnas(item).map(valor => `<td>${escapeHtml(String(valor))}</td>`).join('')}
            <td><button class="btn btn-secondary btn-small btn-icon-only" onclick="editarEntidadImportacion('${clave}', ${item.id})" title="Editar" aria-label="Editar registro"><i data-feather="edit-2"></i></button><button class="btn btn-danger btn-small btn-icon-only" onclick="eliminarEntidadImportacion('${clave}', ${item.id})" title="Eliminar" aria-label="Eliminar registro"><i data-feather="trash-2"></i></button></td>
        </tr>`).join('') || `<tr><td colspan="${colspanVacio}" class="u-text-center">Sin registros</td></tr>`;
    });
}

function agregarEntidadImportacion(clave) {
    if (!proyecto[clave]) proyecto[clave] = [];
    const base = proyecto.monedaBase || 'EUR';
    let item;
    if (clave === 'proveedores') {
        item = { id: Date.now(), nombre: document.getElementById('impProvNombre').value.trim(), pais: document.getElementById('impProvPais').value.trim() };
        if (!item.nombre) return;
    } else if (clave === 'contratos') {
        item = { id: Date.now(), proveedor: document.getElementById('impContratoProveedor').value.trim(), importe: Number(document.getElementById('impContratoImporte').value) || 0, moneda: base };
        if (!item.proveedor) return;
    } else if (clave === 'ordenesCompra') {
        item = {
            id: Date.now(), numero: document.getElementById('impOcNumero').value.trim(),
            importe: Number(document.getElementById('impOcImporte').value) || 0, moneda: base,
            fechaCompromiso: document.getElementById('impOcCompromiso')?.value || '',
            fechaRecepcion: document.getElementById('impOcRecepcion')?.value || ''
        };
        if (!item.numero) return;
    } else if (clave === 'pagosRealizados') {
        item = { id: Date.now(), orden: document.getElementById('impPagoOrden').value.trim(), importe: Number(document.getElementById('impPagoImporte').value) || 0, moneda: base, fecha: new Date().toISOString().slice(0, 10) };
        if (!item.orden) return;
    } else return;
    proyecto[clave].push(item);
    if (typeof registrarBitacora === 'function') registrarBitacora(clave, item.id, 'crear', null, item);
    guardarProyecto();
    renderizarImportaciones();
    mostrarToast('Registro de importación añadido', 'success');
}

function editarEntidadImportacion(clave, id) {
    const item = (proyecto[clave] || []).find(x => x.id === id);
    if (!item) return;
    const campos = {
        proveedores: [['nombre', 'Nombre'], ['pais', 'País']],
        contratos: [['proveedor', 'Proveedor'], ['importe', 'Importe', 'number']],
        ordenesCompra: [['numero', 'Número'], ['importe', 'Importe', 'number'],
            ['fechaCompromiso', 'Fecha compromiso', 'date'], ['fechaRecepcion', 'Fecha recepción', 'date']],
        pagosRealizados: [['orden', 'Orden de compra'], ['importe', 'Importe', 'number'], ['fecha', 'Fecha', 'date']]
    }[clave] || [];
    const html = campos.map(([claveCampo, etiqueta, tipo]) => {
        const valor = item[claveCampo] ?? '';
        return `<div class="form-group"><label>${escapeHtml(etiqueta)}</label><input id="editImp_${claveCampo}" type="${tipo || 'text'}" value="${escapeHtml(String(valor))}"></div>`;
    }).join('');
    const modal = `<div class="modal-content"><div class="modal-header"><h3>Editar registro</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
        ${html}<button class="btn btn-primary" onclick="actualizarEntidadImportacion('${clave}', ${id})">Guardar cambios</button></div>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modal}</div>`;
}

function actualizarEntidadImportacion(clave, id) {
    const item = (proyecto[clave] || []).find(x => x.id === id);
    if (!item) return;
    const antes = { ...item };
    Object.keys(item).forEach(k => {
        const el = document.getElementById('editImp_' + k);
        if (!el) return;
        item[k] = el.type === 'number' ? (Number(el.value) || 0) : el.value.trim();
    });
    registrarBitacoraSiExiste(clave, id, 'actualizar', antes, { ...item });
    guardarProyecto(); renderizarImportaciones(); cerrarModalGeneric();
    mostrarToast('Registro actualizado', 'success');
}

/** Importa un packing list CSV: crea materiales y una orden de compra vinculada. */
function importarPackingList(input) {
    const archivo = input.files && input.files[0];
    if (!archivo) return;
    const reader = new FileReader();
    reader.onload = () => {
        const lineas = typeof parsearCSV === 'function' ? parsearCSV(reader.result || '') : String(reader.result || '').split(/\r?\n/).filter(l => l.trim()).map(l => l.split(','));
        if (lineas.length < 2) { mostrarToast('Packing list vacío', 'error'); return; }
        const cabeceras = lineas[0].map(h => h.trim().toLowerCase().replace(/\s+/g, ''));
        const idx = nombre => cabeceras.indexOf(nombre);
        const columnas = {
            nombre: idx('nombre'), cantidad: idx('cantidad'), coste: idx('costeunitario'),
            moneda: idx('moneda'), origen: idx('paisorigen'), destino: idx('paisdestino'), hs: idx('hscode')
        };
        if (columnas.nombre < 0) { mostrarToast('Falta la columna nombre', 'error'); return; }
        const valor = (cols, c) => c >= 0 ? (cols[c] || '').trim() : '';
        const creados = [];
        lineas.slice(1).forEach(linea => {
            const cols = linea;
            const nombre = valor(cols, columnas.nombre);
            if (!nombre) return;
            const material = {
                id: Date.now() + creados.length,
                nombre,
                cantidad: Number(valor(cols, columnas.cantidad)) || 1,
                costeUnitario: Number(valor(cols, columnas.coste)) || 0,
                moneda: valor(cols, columnas.moneda) || proyecto.monedaBase || 'EUR',
                paisOrigen: valor(cols, columnas.origen),
                paisDestino: valor(cols, columnas.destino),
                hsCode: valor(cols, columnas.hs)
            };
            creados.push(material);
        });
        if (!creados.length) { mostrarToast('No se encontraron filas válidas', 'error'); return; }
        if (!Array.isArray(proyecto.materiales)) proyecto.materiales = [];
        proyecto.materiales.push(...creados);
        const numero = `PL-${new Date().toISOString().slice(0, 10)}-${nuevoIdFinanciero()}`;
        const ordenId = nuevoIdFinanciero();
        creados.forEach(m => { m.ordenCompraId = ordenId; m.packingList = numero; });
        if (!Array.isArray(proyecto.ordenesCompra)) proyecto.ordenesCompra = [];
        const base = proyecto.monedaBase || 'EUR';
        const importeBase = creados.reduce((sum, m) => {
            const bruto = (Number(m.cantidad) || 0) * (Number(m.costeUnitario) || 0)
                * (1 + (Number(m.impuesto) || 0) / 100);
            const origen = m.moneda || proyecto.monedaVenta || base;
            return sum + (typeof aBase === 'function' ? aBase(bruto, origen, base) : convertirMoneda(bruto, origen));
        }, 0);
        proyecto.ordenesCompra.push({
            id: ordenId, numero, importe: importeBase,
            moneda: base, fechaCompromiso: '', fechaRecepcion: '', packingList: numero
        });
        let hashArchivo = 0;
        const texto = String(reader.result || '');
        for (let i = 0; i < texto.length; i++) hashArchivo = ((hashArchivo << 5) - hashArchivo + texto.charCodeAt(i)) | 0;
        registrarBitacoraSiExiste('packingList', ordenId, 'importar', null, {
            numero, archivo: archivo.name, hash: hashArchivo,
            materialIds: creados.map(m => m.id), ordenCompraId: ordenId
        });
        guardarProyecto(); renderizarImportaciones();
        if (typeof calcularAnalisisMateriales === 'function') calcularAnalisisMateriales();
        mostrarToast(`Packing list importado: ${creados.length} materiales`, 'success');
        input.value = '';
    };
    reader.readAsText(archivo);
}

function eliminarEntidadImportacion(clave, id) {
    if (!proyecto[clave]) return;
    const antes = proyecto[clave].find(x => x.id === id) || null;
    proyecto[clave] = proyecto[clave].filter(x => x.id !== id);
    if (typeof registrarBitacora === 'function') registrarBitacora(clave, id, 'eliminar', antes, null);
    guardarProyecto();
    renderizarImportaciones();
}

window.renderizarImportaciones = renderizarImportaciones;
window.agregarEntidadImportacion = agregarEntidadImportacion;
window.eliminarEntidadImportacion = eliminarEntidadImportacion;
window.editarEntidadImportacion = editarEntidadImportacion;
window.importarPackingList = importarPackingList;
window.cargarDatosAduanerosDemo = cargarDatosAduanerosDemo;
window.guardarCosteFinancieroExtra = guardarCosteFinancieroExtra;

// Cumplimiento de SLA de una orden de compra (fecha compromiso vs. recepción real).
function estadoRecepcionOrden(orden, hoyParam) {
    if (!orden) return 'En curso';
    if (orden.estado === 'Recibido' || orden.fechaRecepcion) {
        if (orden.fechaCompromiso && orden.fechaRecepcion) {
            return String(orden.fechaRecepcion) <= String(orden.fechaCompromiso) ? 'En plazo' : 'Fuera de plazo';
        }
        return 'Recibido';
    }
    const hoy = hoyParam || new Date().toISOString().slice(0, 10);
    return orden.fechaCompromiso && String(orden.fechaCompromiso) < hoy ? 'Retrasada' : 'En curso';
}

window.estadoRecepcionOrden = estadoRecepcionOrden;
