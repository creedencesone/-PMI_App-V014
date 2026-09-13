        function actualizarVenta() {
            const precioInput = document.getElementById('precioVenta');
            const monedaSelect = document.getElementById('monedaVenta');
            const condicionesText = document.getElementById('condicionesPago');
            if (precioInput) proyecto.precioVenta = parseFloat(precioInput.value) || 0;
            if (monedaSelect) proyecto.monedaVenta = monedaSelect.value;
            if (condicionesText) proyecto.condicionesPago = condicionesText.value;
            document.getElementById('precioVenta2').value = proyecto.precioVenta;
            document.getElementById('monedaVenta2').value = proyecto.monedaVenta;
            document.getElementById('condicionesPago2').value = proyecto.condicionesPago;
            guardarProyecto(); calcularCashflow(); renderizarHitosFinancieros(); renderizarActa();
            mostrarToast(tApp('toast_venta_actualizada'), 'success');
        }
        
        function actualizarVenta2() {
            document.getElementById('precioVenta').value = document.getElementById('precioVenta2').value;
            document.getElementById('monedaVenta').value = document.getElementById('monedaVenta2').value;
            document.getElementById('condicionesPago').value = document.getElementById('condicionesPago2').value;
            actualizarVenta();
        }
        
        // Reemplaza TODA la función renderizarHitosFinancieros con esta versión CORREGIDA
    function renderizarHitosFinancieros() {
        const container = document.getElementById('hitosList2') || document.getElementById('hitosFinancierosList');
        if (!container) return;
        
        if (!proyecto.hitosFinancieros || proyecto.hitosFinancieros.length === 0) {
            const _isEmptyTextColor = document.documentElement.getAttribute('data-theme') === 'light' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.5)'; container.innerHTML = '<div style="padding:20px;text-align:center;color:'+_isEmptyTextColor+';">No hay hitos de cobro</div>';
            return;
        }
        
        container.innerHTML = proyecto.hitosFinancieros.map(h => {
            let importe = 0;
            const monedaVenta = proyecto.monedaVenta || proyecto.monedaBase || 'EUR';
            const monedaHito = h.moneda || monedaVenta;
            let monedaSimbolo = {EUR:"€",USD:"$",GBP:"£",JPY:"¥",CHF:"₣",BRL:"R$",MXN:"Mex$",COP:"COL$",ARS:"ARS$",CLP:"CLP$",DZD:"دج",CDF:"FC",MZN:"MT",ZAR:"R",NGN:"₦",KES:"KSh",EGP:"E£",MAD:"د.م."}[monedaHito] || monedaHito;
            
            if (h.importeFijo && h.importeFijo > 0) {
                importe = h.importeFijo;
            } else {
                importe = convertirEntreMonedas((proyecto.precioVenta * h.porcentaje) / 100, monedaVenta, monedaHito);
            }
            
            let metodoPago = h.metodoPago || 'transferencia';
            let metodoIcono = metodoPago === 'lc' ? ' LC' : ' Transferencia';
            let plazoInfo = '';
            if (metodoPago === 'lc' && h.plazoLC && h.plazoLC > 0) {
                plazoInfo = `<br><span style="font-size:10px; color:#FF8C00;"> Cobro a ${h.plazoLC} días</span>`;
            }
            let retencionInfo = '';
            if (h.retencionPorcentaje && h.retencionPorcentaje > 0) {
                retencionInfo = `<br><span style="font-size:10px; color:#FF6B6B;"> Retención ${h.retencionPorcentaje}% (libera mes ${h.retencionMes || '?'})</span>`;
            }
            
            return `<div class="item-card"><div>
                <strong>${escapeHtml(h.nombre)}</strong> <span class="u-fs-10">(${metodoIcono})</span><br>
                 Mes ${h.mes} · ${h.porcentaje}% ·  ${importe.toLocaleString('es-ES', {minimumFractionDigits:2})} ${monedaSimbolo}
                ${h.moneda !== (proyecto.monedaVenta || proyecto.monedaBase) ? `<br><span class="u-fs-10"> Moneda: ${h.moneda}</span>` : ''}
                ${h.condiciones ? `<br><span class="u-fs-10"> ${escapeHtml(h.condiciones)}</span>` : ''}
                ${plazoInfo}
                ${retencionInfo}
            </div>
            <div><span class="edit-btn" onclick="editarHitoFinanciero(${h.id})"></span><span class="delete-btn" onclick="eliminarHitoFinanciero(${h.id})"></span></div></div>`;
        }).join('');
        
        renderizarActa();
    }
        
        // Reemplaza la función abrirModalHitoFinanciero
function abrirModalHitoFinanciero() {
    const monedaPorDefecto = proyecto.monedaVenta || proyecto.monedaBase || 'EUR';
    const modalHtml = `<div class="modal-content modal-md"><div class="modal-header"><h3> Nuevo Hito de Pago</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
        <div class="form-group"><label>Nombre del hito</label><input type="text" id="hfNombre" placeholder="Ej: Anticipo, Hito 1, Entrega final"></div>
        <div class="form-row">
            <div class="form-group"><label>Mes de cobro (según plan)</label><input type="number" id="hfMes" value="1" min="1" max="36"></div>
            <div class="form-group"><label>Porcentaje (%)</label><input type="number" id="hfPorcentaje" value="30" step="5" min="0" max="100"></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label> Moneda de pago</label>
                <select id="hfMoneda">
                    ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${m === monedaPorDefecto ? 'selected' : ''}>${m} - ${MONEDAS[m]}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label> Importe fijo (opcional)</label>
                <input type="number" id="hfImporteFijo" value="0" placeholder="Dejar 0 para usar porcentaje">
            </div>
        </div>
        <div class="form-group"><label> Condiciones / Observaciones</label>
            <textarea rows="2" id="hfCondiciones" placeholder="Ej: Pago contra factura, 30 días fecha factura..."></textarea>
        </div>
        
        <!-- NUEVOS CAMPOS PARA CARTA DE CRÉDITO -->
        <hr class="u-hr">
        <h4 class="u-fs-13"> MÉTODO DE PAGO Y FINANCIACIÓN</h4>
        <div class="form-row">
            <div class="form-group">
                <label>Método de pago</label>
                <select id="hfMetodoPago" onchange="toggleCamposLC()">
                    <option value="transferencia">Transferencia bancaria</option>
                    <option value="lc">Carta de Crédito (LC)</option>
                </select>
            </div>
            <div class="form-group u-hidden" id="plazoLCGroup">
                <label>Plazo de cobro LC (días)</label>
                <input type="number" id="hfPlazoLC" value="30" step="30" placeholder="30, 60, 90...">
                <small class="u-fs-10">Días después del hito</small>
            </div>
        </div>

        <div id="costesLCGroup" style="display:none; margin-top:12px;">
            <h5 class="u-fs-12"> Costes de la Carta de Crédito</h5>
            <div class="form-row">
                <div class="form-group"><label>Comisión de emisión (%)</label><input type="number" id="hfComisionEmision" value="0.2" step="0.1"></div>
                <div class="form-group"><label>Comisión de confirmación (%)</label><input type="number" id="hfComisionConfirmacion" value="0.3" step="0.1"></div>
                <div class="form-group"><label>Gastos de courier (fijo)</label><input type="number" id="hfGastosCourier" value="150" step="10"></div>
            </div>
            <div class="info-card-modal" style="padding: 8px; margin-top: 8px;">
                <small> Los costes de LC se calcularán como un porcentaje del importe del hito + gastos fijos, y se reflejarán como gasto en el mes del hito.</small>
            </div>
        </div>

        <!-- RETENCIÓN -->
        <hr class="u-hr">
        <h4 class="u-fs-13"> RETENCIÓN</h4>
        <div class="info-card-modal" style="padding:8px;margin-bottom:12px;">
            <small> Si el contrato estipula una retención, indica el porcentaje retenido y el mes en que se libera.</small>
        </div>
        <div class="form-row">
            <div class="form-group"><label>% Retención</label><input type="number" id="hfRetencionPorcentaje" value="0" min="0" max="100" step="1" placeholder="0 = sin retención"></div>
            <div class="form-group"><label>Mes de liberación</label><input type="number" id="hfRetencionMes" value="1" min="1" max="60" placeholder="Mes en que se cobra la retención"></div>
        </div>

        <button class="btn btn-primary" onclick="guardarHitoFinanciero()">Guardar Hito</button>
    </div>`;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}

function toggleCamposLC() {
    const metodoSelect = document.getElementById('hfMetodoPago');
    if (!metodoSelect) return;
    
    const metodo = metodoSelect.value;
    const plazoGroup = document.getElementById('plazoLCGroup');
    const costesGroup = document.getElementById('costesLCGroup');
    
    if (metodo === 'lc') {
        if (plazoGroup) plazoGroup.style.display = 'block';
        if (costesGroup) costesGroup.style.display = 'block';
    } else {
        if (plazoGroup) plazoGroup.style.display = 'none';
        if (costesGroup) costesGroup.style.display = 'none';
    }
}

// También necesitas la versión de edición
function editarHitoFinanciero(id) {
    let h = proyecto.hitosFinancieros.find(h => h.id === id);
    if(!h) return;
    
    const metodoPago = h.metodoPago || 'transferencia';
    const mostrarLC = metodoPago === 'lc';
    
    const modalHtml = `
        <div class="modal-content modal-md">
            <div class="modal-header">
                <h3> Editar Hito: ${escapeHtml(h.nombre)}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="hfId" value="${h.id}">
            
            <div class="form-group">
                <label>Nombre del hito</label>
                <input type="text" id="hfNombre" class="form-control" value="${escapeHtml(h.nombre)}">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Mes de cobro (según plan)</label>
                    <input type="number" id="hfMes" value="${h.mes}" min="1" max="36">
                </div>
                <div class="form-group">
                    <label>Porcentaje (%)</label>
                    <input type="number" id="hfPorcentaje" value="${h.porcentaje}" step="5" min="0" max="100">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Moneda de pago</label>
                    <select id="hfMoneda">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${h.moneda === m ? 'selected' : ''}>${m} - ${MONEDAS[m]}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label> Importe fijo (opcional)</label>
                    <input type="number" id="hfImporteFijo" value="${h.importeFijo || 0}" placeholder="Dejar 0 para usar porcentaje">
                </div>
            </div>
            
            <div class="form-group">
                <label> Condiciones / Observaciones</label>
                <textarea rows="2" id="hfCondiciones" placeholder="Ej: Pago contra factura, 30 días fecha factura...">${escapeHtml(h.condiciones || '')}</textarea>
            </div>
            
            <!-- NUEVOS CAMPOS PARA CARTA DE CRÉDITO -->
            <hr class="u-hr">
            <h4 class="u-fs-13"> MÉTODO DE PAGO Y FINANCIACIÓN</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Método de pago</label>
                    <select id="hfMetodoPago" onchange="toggleCamposLCEdit()">
                        <option value="transferencia" ${metodoPago === 'transferencia' ? 'selected' : ''}>Transferencia bancaria</option>
                        <option value="lc" ${metodoPago === 'lc' ? 'selected' : ''}>Carta de Crédito (LC)</option>
                    </select>
                </div>
                <div class="form-group" id="plazoLCGroupEdit" style="display: ${mostrarLC ? 'block' : 'none'};">
                    <label>Plazo de cobro LC (días)</label>
                    <input type="number" id="hfPlazoLC" value="${h.plazoLC || 30}" step="30" placeholder="30, 60, 90...">
                    <small class="u-fs-10">Días después del hito</small>
                </div>
            </div>
            
            <div id="costesLCGroupEdit" style="display: ${mostrarLC ? 'block' : 'none'}; margin-top:12px;">
                <h5 class="u-fs-12"> Costes de la Carta de Crédito</h5>
                <div class="form-row">
                    <div class="form-group">
                        <label>Comisión de emisión (%)</label>
                        <input type="number" id="hfComisionEmision" value="${h.comisionEmision || 0.2}" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Comisión de confirmación (%)</label>
                        <input type="number" id="hfComisionConfirmacion" value="${h.comisionConfirmacion || 0.3}" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Gastos de courier (fijo)</label>
                        <input type="number" id="hfGastosCourier" value="${h.gastosCourier || 150}" step="10">
                    </div>
                </div>
                <div class="info-card-modal" style="padding: 8px; margin-top: 8px;">
                    <small> Los costes de LC se calcularán como un porcentaje del importe del hito + gastos fijos, y se reflejarán como gasto en el mes del hito.</small>
                </div>
            </div>
            
            <!-- RETENCIÓN -->
            <hr class="u-hr">
            <h4 class="u-fs-13"> RETENCIÓN</h4>
            <div class="info-card-modal" style="padding:8px;margin-bottom:12px;">
                <small> Si el contrato estipula una retención, indica el porcentaje retenido y el mes en que se libera.</small>
            </div>
            <div class="form-row">
                <div class="form-group"><label>% Retención</label><input type="number" id="hfRetencionPorcentaje" value="${h.retencionPorcentaje || 0}" min="0" max="100" step="1" placeholder="0 = sin retención"></div>
                <div class="form-group"><label>Mes de liberación</label><input type="number" id="hfRetencionMes" value="${h.retencionMes || 1}" min="1" max="60" placeholder="Mes en que se cobra la retención"></div>
            </div>
            
            <div class="u-flex-gap-12 u-mt-20">
                <button class="btn btn-secondary u-flex-1" onclick="document.getElementById('editHitoModal')?.remove()">Cancelar</button>
                <button class="btn btn-primary u-flex-1" onclick="guardarHitoFinanciero()">Guardar Cambios</button>
            </div>
        </div>
    `;
    
    // Crear el modal
    const modalDiv = document.createElement('div');
    modalDiv.id = 'editHitoModal';
    modalDiv.className = 'modal';
    modalDiv.style.display = 'flex';
    modalDiv.innerHTML = modalHtml;
    document.body.appendChild(modalDiv);
    
    // Cerrar al hacer clic fuera del contenido
    modalDiv.onclick = (e) => {
        if (e.target === modalDiv) {
            modalDiv.remove();
        }
    };
}

function toggleCamposLCEdit() {
    const metodoSelect = document.getElementById('hfMetodoPago');
    if (!metodoSelect) return;
    
    const metodo = metodoSelect.value;
    const plazoGroup = document.getElementById('plazoLCGroupEdit');
    const costesGroup = document.getElementById('costesLCGroupEdit');
    
    if (metodo === 'lc') {
        if (plazoGroup) plazoGroup.style.display = 'block';
        if (costesGroup) costesGroup.style.display = 'block';
    } else {
        if (plazoGroup) plazoGroup.style.display = 'none';
        if (costesGroup) costesGroup.style.display = 'none';
    }
}
        
        function abrirModalHitoFinanciero2() { abrirModalHitoFinanciero(); }
        

// ============================================
// GUARDAR HITO FINANCIERO - FUNCIÓN FALTANTE
// ============================================

// Reemplaza la función guardarHitoFinanciero
function guardarHitoFinanciero() {
    let nombre = document.getElementById('hfNombre').value.trim();
    if (!nombre) { 
        mostrarToast(tApp('toast_nombre_obligatorio'), 'error'); 
        return; 
    }
    
    let id = document.getElementById('hfId')?.value;
    let mes = parseInt(document.getElementById('hfMes').value);
    let porcentaje = parseFloat(document.getElementById('hfPorcentaje').value);
    let metodoPago = document.getElementById('hfMetodoPago').value;
    
    if (isNaN(mes) || mes < 1) {
        mostrarToast(" El mes debe ser un número positivo (mínimo 1)", 'error');
        return;
    }
    
    if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
        mostrarToast(" El porcentaje debe estar entre 0 y 100", 'error');
        return;
    }
    
    let nuevoHito = { 
        id: id ? parseInt(id) : Date.now(), 
        nombre: nombre, 
        mes: mes, 
        porcentaje: porcentaje,
        moneda: document.getElementById('hfMoneda').value,
        importeFijo: parseFloat(document.getElementById('hfImporteFijo').value) || 0,
        condiciones: document.getElementById('hfCondiciones').value || '',
        metodoPago: metodoPago,
        plazoLC: metodoPago === 'lc' ? parseInt(document.getElementById('hfPlazoLC').value) : 0,
        comisionEmision: metodoPago === 'lc' ? parseFloat(document.getElementById('hfComisionEmision').value) : 0,
        comisionConfirmacion: metodoPago === 'lc' ? parseFloat(document.getElementById('hfComisionConfirmacion').value) : 0,
        gastosCourier: metodoPago === 'lc' ? parseFloat(document.getElementById('hfGastosCourier').value) : 0,
        retencionPorcentaje: parseFloat(document.getElementById('hfRetencionPorcentaje').value) || 0,
        retencionMes: parseInt(document.getElementById('hfRetencionMes').value) || 0
    };
    
    if (!proyecto.hitosFinancieros) proyecto.hitosFinancieros = [];
    
    if (id) { 
        let idx = proyecto.hitosFinancieros.findIndex(h => h.id === parseInt(id)); 
        if (idx >= 0) proyecto.hitosFinancieros[idx] = nuevoHito; 
    } else { 
        proyecto.hitosFinancieros.push(nuevoHito); 
    }
    
    guardarProyecto(); 
    renderizarHitosFinancieros(); 
    calcularCashflow(); 
    cerrarModalGeneric();
    const editModal = document.getElementById('editHitoModal');
    if (editModal) editModal.remove();
    mostrarToast(` Hito "${nombre}" guardado`, 'success');
}
        



        
function eliminarHitoFinanciero(id) {
            if (confirm(tApp('confirmar_eliminar'))) { proyecto.hitosFinancieros = proyecto.hitosFinancieros.filter(h => h.id !== id); guardarProyecto(); renderizarHitosFinancieros(); calcularCashflow(); renderizarActa(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
// ============================================
// FUNCIÓN CALCULAR CASHFLOW
// ============================================

// Reemplaza la función calcularCashflow completa
function calcularCashflow() {
    // ============================================
    // 1. CALCULAR DURACIÓN REAL DEL PROYECTO
    // ============================================
    let maxMes = 12;
    let meses = [];
    
    // Hitos financieros
    (proyecto.hitosFinancieros || []).forEach(h => {
        if (h.mes) meses.push(h.mes);
        if (h.metodoPago === 'lc' && h.plazoLC) {
            const mesCobroReal = h.mes + Math.ceil(h.plazoLC / 30);
            meses.push(mesCobroReal);
        }
    });
    
    // Materiales
    (proyecto.materiales || []).forEach(m => { 
        if (m.mes) meses.push(m.mes);
        // También considerar meses de pagos diferidos de materiales
        if (m.condicionesPago) {
            const cp = m.condicionesPago;
            if (cp.tipo === 'porcentajes' && cp.tramos) {
                cp.tramos.forEach(t => { if (t.mes) meses.push(t.mes); });
            } else if (cp.tipo === 'plazo' && m.mes) {
                const mesesPlazo = Math.ceil(cp.plazoDias / 30);
                meses.push(m.mes + mesesPlazo);
            } else if (cp.tipo === 'mixto' && m.mes) {
                const mesesPlazo = Math.ceil(cp.plazoResto / 30);
                meses.push(m.mes + mesesPlazo);
            }
        }
    });
    
    (proyecto.servicios || []).forEach(s => { if (s.mes) meses.push(s.mes); });
    (proyecto.viajes || []).forEach(v => { if (v.mes) meses.push(v.mes); });
    
    if (meses.length > 0) {
        const mesMaximo = Math.max(...meses);
        maxMes = Math.max(12, mesMaximo);
    }
    
    if (proyecto.garantia && proyecto.garantia.afectaHitoFinal && proyecto.garantia.hitoFinalId) {
        const hitoGarantia = (proyecto.hitosFinancieros || []).find(h => h.id === proyecto.garantia.hitoFinalId);
        if (hitoGarantia && hitoGarantia.mes && hitoGarantia.mes > maxMes) {
            maxMes = hitoGarantia.mes;
        }
    }
    
    maxMes = Math.min(maxMes, 60);
    
    let gastos = new Array(maxMes).fill(0);
    let ingresos = new Array(maxMes).fill(0);
    let gastosLC = new Array(maxMes).fill(0);
    
    // ============================================
    // GASTOS DE RECURSOS (desde tareas del Gantt)
    // Distribuye el coste entre los meses que abarca la tarea
    // ============================================
    function _monthIndex(date, refDate) {
        return (date.getFullYear() - refDate.getFullYear()) * 12 + date.getMonth() - refDate.getMonth();
    }
    // Referencia global: proyecto.fechaInicio o la fecha más temprana entre las tareas
    let _projRef = null;
    if (proyecto.fechaInicio) {
        _projRef = new Date(proyecto.fechaInicio);
    } else {
        (proyecto.elementosGantt || []).forEach(t => {
            if (t.inicio) {
                const d = new Date(t.inicio);
                if (!_projRef || d < _projRef) _projRef = d;
            }
        });
    }
    const _handled = new Set();
    (proyecto.elementosGantt || []).forEach(tarea => {
        if (tarea.inicio && tarea.duracion > 0 && tarea.tipo !== 'hito') {
            _handled.add(tarea);
            let costeTarea = tarea.costeReal > 0 ? tarea.costeReal : (tarea.costeEstimado || 0);
            if (costeTarea > 0) {
                const startDate = new Date(tarea.inicio);
                const endStr = typeof sumarDiasHabiles === 'function' ? sumarDiasHabiles(tarea.inicio, tarea.duracion) : tarea.inicio;
                const endDate = new Date(endStr);
                const moneda = tarea.recursoAsignado?.moneda || proyecto.monedaBase;
                const costeBase = convertirMoneda(costeTarea, moneda);
                if (!_projRef) _projRef = new Date(startDate);
                const mesInicio = _monthIndex(startDate, _projRef);
                const mesFin = _monthIndex(endDate, _projRef);
                const numMeses = Math.max(1, mesFin - mesInicio + 1);
                const costePorMes = costeBase / numMeses;
                for (let m = mesInicio; m <= mesFin; m++) {
                    const idx = Math.min(maxMes - 1, Math.max(0, m));
                    if (idx >= 0 && idx < maxMes) gastos[idx] += costePorMes;
                }
            }
        } else if (tarea.inicio && tarea.tipo === 'hito') {
            _handled.add(tarea);
            // Hitos: coste en el mes de su fecha
            let costeTarea = tarea.costeReal > 0 ? tarea.costeReal : (tarea.costeEstimado || 0);
            if (costeTarea > 0) {
                const moneda = tarea.recursoAsignado?.moneda || proyecto.monedaBase;
                const costeBase = convertirMoneda(costeTarea, moneda);
                const d = new Date(tarea.inicio);
                if (!_projRef) _projRef = new Date(d);
                const idx = _monthIndex(d, _projRef);
                if (idx >= 0 && idx < maxMes) gastos[idx] += costeBase;
            }
        }
    });
    // Incluir costes de elementos sin fecha ni recurso que no pasaron los filtros
    let costeNoDistribuido = (proyecto.elementosGantt || []).reduce((sum, e) => {
        if (_handled.has(e)) return sum;
        return sum + (e.costeEstimado || 0);
    }, 0);
    if (costeNoDistribuido > 0) gastos[0] = (gastos[0] || 0) + convertirMoneda(costeNoDistribuido, proyecto.monedaBase);
    
    // ============================================
    // GASTOS DE MATERIALES CON CONDICIONES DE PAGO
    // ============================================
    (proyecto.materiales || []).forEach(m => {
        const costeTotalMaterial = convertirMoneda(m.cantidad * m.costeUnitario + (m.costeEnvio || 0), m.moneda);
        const condiciones = m.condicionesPago;
        
        if (!condiciones || condiciones.tipo === 'contado') {
            // Pago de contado en el mes del material
            let mes = (m.mes || 1) - 1;
            if (mes >= 0 && mes < maxMes) gastos[mes] += costeTotalMaterial;
        } 
        else if (condiciones.tipo === 'porcentajes' && condiciones.tramos) {
            // Distribuir por porcentajes
            let sumaPorcentajes = 0;
            condiciones.tramos.forEach(tramo => {
                sumaPorcentajes += tramo.porcentaje;
                let importe = costeTotalMaterial * (tramo.porcentaje / 100);
                let mes = (tramo.mes || 1) - 1;
                if (mes >= 0 && mes < maxMes) {
                    gastos[mes] += importe;
                    console.log(` Material "${m.nombre}": ${tramo.porcentaje}% (${formatearMoneda(importe)}) en mes ${tramo.mes}`);
                }
            });
            if (Math.abs(sumaPorcentajes - 100) > 0.1) {
                console.warn(` Material "${m.nombre}": La suma de porcentajes es ${sumaPorcentajes}% (debe ser 100%)`);
            }
        }
        else if (condiciones.tipo === 'plazo') {
            // Pago a plazo después de la compra/recepción
            let mesBase = (m.mes || 1) - 1;
            let mesesPlazo = Math.ceil(condiciones.plazoDias / 30);
            let mesPago = mesBase + mesesPlazo;
            
            if (mesPago >= 0 && mesPago < maxMes) {
                gastos[mesPago] += costeTotalMaterial;
                console.log(` Material "${m.nombre}": Pago total ${formatearMoneda(costeTotalMaterial)} en mes ${mesPago + 1} (plazo ${condiciones.plazoDias} días)`);
            } else if (mesPago >= maxMes) {
                // Extender el array si es necesario
                for (let i = maxMes; i <= mesPago; i++) {
                    if (gastos[i] === undefined) gastos[i] = 0;
                }
                maxMes = mesPago + 1;
                gastos[mesPago] = (gastos[mesPago] || 0) + costeTotalMaterial;
            }
        }
        else if (condiciones.tipo === 'mixto') {
            // Porcentaje inicial ahora, resto a plazo
            let importeInicial = costeTotalMaterial * (condiciones.porcentajeInicial / 100);
            let importeResto = costeTotalMaterial - importeInicial;
            let mesBase = (m.mes || 1) - 1;
            let mesesPlazo = Math.ceil(condiciones.plazoResto / 30);
            
            // Pago inicial
            if (mesBase >= 0 && mesBase < maxMes) {
                gastos[mesBase] += importeInicial;
                console.log(` Material "${m.nombre}": ${condiciones.porcentajeInicial}% inicial (${formatearMoneda(importeInicial)}) en mes ${m.mes}`);
            }
            
            // Pago del resto
            let mesResto = mesBase + mesesPlazo;
            if (mesResto >= 0 && mesResto < maxMes) {
                gastos[mesResto] += importeResto;
                console.log(` Material "${m.nombre}": Resto ${100 - condiciones.porcentajeInicial}% (${formatearMoneda(importeResto)}) en mes ${mesResto + 1}`);
            } else if (mesResto >= maxMes) {
                for (let i = maxMes; i <= mesResto; i++) {
                    if (gastos[i] === undefined) gastos[i] = 0;
                }
                maxMes = mesResto + 1;
                gastos[mesResto] = (gastos[mesResto] || 0) + importeResto;
            }
        }
    });
    
    // ============================================
    // GASTOS DE SERVICIOS
    // ============================================
    (proyecto.servicios || []).forEach(s => {
        let total = s.cantidad * s.costeUnitario * (1 + (s.impuesto || 0) / 100);
        total = convertirMoneda(total, s.moneda);
        let mes = (s.mes || 1) - 1;
        if (mes >= 0 && mes < maxMes) gastos[mes] += total;
    });

    // ============================================
    // GASTOS DE VIAJES
    // ============================================
    (proyecto.viajes || []).forEach(v => {
        let totalViaje = convertirMoneda((v.costeVuelos || 0) + (v.costeHotel || 0) + (v.costeComidas || 0) + (v.costeTraslados || 0), v.moneda);
        let mes = (v.mes || 1) - 1;
        if (mes >= 0 && mes < maxMes) gastos[mes] += totalViaje;
    });

    // ============================================
    // GASTOS DE SPRINTS (MODO ÁGIL)
    // ============================================
    const metodologia = proyecto?.metodologia?.tipo || 'cascada';
    const esAgile = (metodologia === 'agile' || metodologia === 'mixto');
    
    if (esAgile && proyecto.scrum && proyecto.scrum.sprints) {
        console.log(" Procesando costes de sprints para Cashflow...");
        
        let fechaInicioProyecto = proyecto.fechaInicio ? new Date(proyecto.fechaInicio) : new Date();
        
        proyecto.scrum.sprints.forEach(sprint => {
            let mesSprint = 1;
            if (sprint.fechaInicio) {
                const fechaInicioSprint = new Date(sprint.fechaInicio);
                const diffMeses = (fechaInicioSprint.getFullYear() - fechaInicioProyecto.getFullYear()) * 12 + 
                                  (fechaInicioSprint.getMonth() - fechaInicioProyecto.getMonth());
                mesSprint = Math.max(1, diffMeses + 1);
            }
            
            const idx = mesSprint - 1;
            
            let costeSprint = 0;
            // Solo contar coste de equipo desde historias (materiales y servicios ya se 
            // contabilizan en sus secciones individuales para evitar doble conteo)
            const historiasSprint = (proyecto.scrum.historias || []).filter(h => h.sprintId === sprint.id);
            historiasSprint.forEach(historia => {
                if (historia.estado === 'done' && historia.recursoAsignado) {
                    const dias = historia.diasReales || historia.diasEstimados || 5;
                    const horasPorDia = historia.horasPorDia || 8;
                    const horasTotales = dias * horasPorDia;
                    costeSprint += horasTotales * historia.recursoAsignado.costeHora;
                }
            });
            costeSprint = convertirMoneda(costeSprint, proyecto.monedaBase);
            
            if (idx >= 0 && idx < maxMes && costeSprint > 0) {
                gastos[idx] += costeSprint;
            }
        });
    }
    
    // ============================================
    // GASTOS DE AVALES Y GARANTÍAS
    // ============================================
    (proyecto.avales || []).forEach((aval) => {
        const estadoIgnorar = ['Cancelado', 'Vencido'];
        if (estadoIgnorar.includes(aval.estado)) return;
        
        let costes = aval.costesCalculados || { apertura: 0, riesgoTotal: 0, notaria: 0, otros: 0 };
        
        let mesEmision = 1;
        if (aval.fechaEmision && proyecto.fechaInicio) {
            try {
                const fechaInicioProyecto = new Date(proyecto.fechaInicio);
                const fechaEmision = new Date(aval.fechaEmision);
                if (!isNaN(fechaInicioProyecto.getTime()) && !isNaN(fechaEmision.getTime())) {
                    const diffMeses = (fechaEmision.getFullYear() - fechaInicioProyecto.getFullYear()) * 12 + 
                                      (fechaEmision.getMonth() - fechaInicioProyecto.getMonth());
                    mesEmision = Math.max(1, diffMeses + 1);
                }
            } catch(e) {}
        }
        
        const idxEmision = mesEmision - 1;
        const costesUnicos = (costes.apertura || 0) + (costes.notaria || 0) + (costes.otros || 0);
        
        if (idxEmision >= 0 && idxEmision < maxMes && costesUnicos > 0) {
            gastos[idxEmision] += costesUnicos;
        }
        
        if (costes.riesgoTotal > 0) {
            let mesesVigencia = aval.mesesVigencia || 12;
            if (aval.fechaEmision && aval.fechaVencimiento) {
                try {
                    const fechaEmision = new Date(aval.fechaEmision);
                    const fechaVencimiento = new Date(aval.fechaVencimiento);
                    if (!isNaN(fechaEmision.getTime()) && !isNaN(fechaVencimiento.getTime())) {
                        const diffDias = (fechaVencimiento - fechaEmision) / (1000 * 60 * 60 * 24);
                        mesesVigencia = Math.max(1, Math.ceil(diffDias / 30.44));
                    }
                } catch(e) {}
            }
            
            const trimestres = Math.ceil(mesesVigencia / 3);
            const costePorTrimestre = costes.riesgoTotal / trimestres;
            
            for (let t = 0; t < trimestres; t++) {
                const mesTrimestre = mesEmision + (t * 3);
                const idxTrimestre = mesTrimestre - 1;
                if (idxTrimestre >= 0 && idxTrimestre < maxMes) {
                    gastos[idxTrimestre] += costePorTrimestre;
                }
            }
        }
    });
    
    // ============================================
    // GASTOS DE SEGUROS
    // ============================================
    (proyecto.seguros || []).forEach((seguro) => {
        const mesSeguro = seguro.mes || 1;
        const idxSeguro = mesSeguro - 1;
        let coste = seguro.coste || 0;
        if (seguro.moneda && seguro.moneda !== proyecto.monedaBase) {
            coste = convertirMoneda(coste, seguro.moneda);
        }
        if (idxSeguro >= 0 && idxSeguro < maxMes) {
            gastos[idxSeguro] += coste;
        }
    });
    
    // ============================================
    // PROCESAR INGRESOS Y GASTOS DE CARTA DE CRÉDITO
    // ============================================
    (proyecto.hitosFinancieros || []).forEach(h => {
        let importeBruto = 0;
        if (h.importeFijo && h.importeFijo > 0) {
            importeBruto = h.importeFijo;
        } else {
            importeBruto = (proyecto.precioVenta * (h.porcentaje || 0)) / 100;
        }
        let monedaHito = h.moneda || proyecto.monedaVenta || proyecto.monedaBase;
        let importeEnMonedaBase = convertirMoneda(importeBruto, monedaHito);
        
        if (proyecto.garantia && proyecto.garantia.afectaHitoFinal && proyecto.garantia.hitoFinalId === h.id) {
            let idx = maxMes - 1;
            ingresos[idx] += importeEnMonedaBase;
            return;
        }
        
        let mesHito = (h.mes || 1) - 1;
        let mesCobro = mesHito;
        
        if (h.metodoPago === 'lc') {
            const comisionEmision = importeEnMonedaBase * ((h.comisionEmision || 0) / 100);
            const comisionConfirmacion = importeEnMonedaBase * ((h.comisionConfirmacion || 0) / 100);
            const gastosCourierConv = convertirMoneda(h.gastosCourier || 0, proyecto.monedaBase);
            const costesLCTotal = comisionEmision + comisionConfirmacion + gastosCourierConv;
            
            if (mesHito >= 0 && mesHito < maxMes && costesLCTotal > 0) {
                gastos[mesHito] += costesLCTotal;
                gastosLC[mesHito] = costesLCTotal;
            }
            
            if (h.plazoLC && h.plazoLC > 0) {
                const mesesPlazo = Math.ceil(h.plazoLC / 30);
                mesCobro = mesHito + mesesPlazo;
                
                if (mesCobro >= maxMes) {
                    maxMes = mesCobro + 1;
                    gastos.length = maxMes;
                    ingresos.length = maxMes;
                    gastosLC.length = maxMes;
                    for (let i = 0; i < maxMes; i++) {
                        if (gastos[i] === undefined) gastos[i] = 0;
                        if (ingresos[i] === undefined) ingresos[i] = 0;
                        if (gastosLC[i] === undefined) gastosLC[i] = 0;
                    }
                }
            }
        }
        
        if (h.retencionPorcentaje && h.retencionPorcentaje > 0 && h.retencionMes && h.retencionMes > 0) {
            const importeNeto = importeEnMonedaBase * (1 - h.retencionPorcentaje / 100);
            const importeRetenido = importeEnMonedaBase * (h.retencionPorcentaje / 100);
            const mesRetencion = h.retencionMes - 1;

            if (mesCobro >= 0 && mesCobro < maxMes) {
                ingresos[mesCobro] += importeNeto;
            }

            if (mesRetencion >= maxMes) {
                maxMes = mesRetencion + 1;
                gastos.length = maxMes;
                ingresos.length = maxMes;
                gastosLC.length = maxMes;
                for (let i = 0; i < maxMes; i++) {
                    if (gastos[i] === undefined) gastos[i] = 0;
                    if (ingresos[i] === undefined) ingresos[i] = 0;
                    if (gastosLC[i] === undefined) gastosLC[i] = 0;
                }
            }
            if (mesRetencion >= 0 && mesRetencion < maxMes) {
                ingresos[mesRetencion] += importeRetenido;
            }
        } else {
            if (mesCobro >= 0 && mesCobro < maxMes) {
                ingresos[mesCobro] += importeEnMonedaBase;
            }
        }
    });
    
    // Si no hay hitos financieros, usar precioVenta como ingreso en el mes 0
    const tieneHitos = (proyecto.hitosFinancieros || []).length > 0;
    if (!tieneHitos && (proyecto.precioVenta || 0) > 0) {
        const ingTotal = convertirMoneda(proyecto.precioVenta, proyecto.monedaBase);
        let mesesConGasto = gastos.filter(g => g > 0).length;
        if (mesesConGasto > 0) {
            const ingPorMes = ingTotal / mesesConGasto;
            for (let i = 0; i < maxMes; i++) {
                if ((gastos[i] || 0) > 0) ingresos[i] = (ingresos[i] || 0) + ingPorMes;
            }
        } else {
            ingresos[0] = (ingresos[0] || 0) + ingTotal;
        }
    }
    
    // ============================================
    // 3. GENERAR HTML DEL CASHFLOW Y GRÁFICOS
    // ============================================
    let html = '', totalIng = 0, totalGas = 0, saldo = 0, minSaldo = 0;
    let labels = [], ingData = [], gasData = [], salData = [];
    
    for (let i = 0; i < maxMes; i++) {
        let ing = ingresos[i] || 0, gas = gastos[i] || 0, neto = ing - gas;
        saldo += neto; 
        totalIng += ing; 
        totalGas += gas;
        if (saldo < minSaldo) minSaldo = saldo;
        
        let year = Math.floor(i / 12);
        let month = (i % 12) + 1;
        let label = year === 0 ? `Mes ${month}` : `Año ${year+1} - Mes ${month}`;
        
        let tooltipLC = '';
        if (gastosLC[i] > 0) {
            tooltipLC = `<span style="font-size:10px; color:#FF8C00;"> (incluye ${formatearMoneda(gastosLC[i])} de costes LC)</span>`;
        }
        
        html += `<tr>
            <td class="bold">${label}${tooltipLC}</td>
            <td>${formatearMoneda(ing)}</td>
            <td>${formatearMoneda(gas)}</td>
            <td class="${neto >= 0 ? 'cashflow-positive' : 'cashflow-negative'}">${formatearMoneda(neto)}</td>
            <td class="${saldo >= 0 ? 'cashflow-positive' : 'cashflow-negative'}">${formatearMoneda(saldo)}</td>
        </tr>`;
        
        labels.push(label); 
        ingData.push(ing); 
        gasData.push(gas); 
        salData.push(saldo);
    }
    
    document.getElementById('cashflowBody').innerHTML = html;
    document.getElementById('totalIngresosFoot').innerHTML = formatearMoneda(totalIng);
    document.getElementById('totalGastosFoot').innerHTML = formatearMoneda(totalGas);
    document.getElementById('totalNetoFoot').innerHTML = formatearMoneda(totalIng - totalGas);
    const cTotal = document.getElementById('totalCoste');
    if (cTotal) cTotal.innerHTML = formatearMoneda(totalGas);
    const cIngreso = document.getElementById('totalIngreso');
    if (cIngreso) cIngreso.innerHTML = formatearMoneda(totalIng);
    const cBeneficio = document.getElementById('totalBeneficio');
    if (cBeneficio) cBeneficio.innerHTML = formatearMoneda(totalIng - totalGas);
    const cFinan = document.getElementById('necesidadFinanciacion');
    if (cFinan) cFinan.innerHTML = formatearMoneda(minSaldo < 0 ? Math.abs(minSaldo) : 0);
    const cFinanSalud = document.getElementById('saludFinanciacion');
    if (cFinanSalud) cFinanSalud.innerHTML = formatearMoneda(minSaldo < 0 ? Math.abs(minSaldo) : 0);
    
    const duracionSpan = document.getElementById('duracionProyectoMeses');
    if (duracionSpan) duracionSpan.value = maxMes;
    
    // GRÁFICOS - CON DETECCIÓN DE TEMA CLARO/OSCURO
    const ctx = document.getElementById('cashflowChart')?.getContext('2d');
    if (ctx) { 
        if(cashflowChart) cashflowChart.destroy(); 
        
        // Detectar tema actual
        const isDarkTheme = document.documentElement.getAttribute('data-theme') !== 'light';
        const textColor = isDarkTheme ? 'white' : '#1a1a2e';
        const gridColor = isDarkTheme ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
        
        const c = ctx;
        const gradIng = c.createLinearGradient(0, 0, 0, ctx.canvas ? ctx.canvas.height : 400);
        gradIng.addColorStop(0, 'rgba(0,168,89,0.35)');
        gradIng.addColorStop(1, 'rgba(0,168,89,0.01)');
        const gradGas = c.createLinearGradient(0, 0, 0, ctx.canvas ? ctx.canvas.height : 400);
        gradGas.addColorStop(0, 'rgba(255,95,87,0.35)');
        gradGas.addColorStop(1, 'rgba(255,95,87,0.01)');
        
        cashflowChart = new Chart(ctx, { 
            type: 'line', 
            data: { 
                labels, 
                datasets: [
                    { label: tApp('chart_ingresos'), data: ingData, borderColor: '#00A859', backgroundColor: gradIng, fill: true, tension: 0.4, borderWidth: 3, pointBackgroundColor: '#00A859', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 7 },
                    { label: tApp('chart_gastos'), data: gasData, borderColor: '#FF5F57', backgroundColor: gradGas, fill: true, tension: 0.4, borderWidth: 3, pointBackgroundColor: '#FF5F57', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 7 },
                    { label: tApp('chart_saldo_acumulado'), data: salData, borderColor: '#007AFF', borderDash: [6,4], tension: 0.4, yAxisID: 'y', fill: false, borderWidth: 2, pointBackgroundColor: '#007AFF', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 3, pointHoverRadius: 6 }
                ] 
            }, 
            options: { 
                responsive: true, 
                maintainAspectRatio: true,
                plugins: {
                    tooltip: { 
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        cornerRadius: 8,
                        padding: 10,
                        callbacks: { 
                            label: (context) => `${context.dataset.label}: ${formatearMoneda(context.raw)}` 
                        } 
                    },
                    legend: { 
                        labels: { color: textColor, usePointStyle: true, padding: 12, font: { size: 12, family: 'system-ui', weight: '500' } }
                    }
                },
                scales: { 
                    y: { 
                        ticks: { color: textColor, font: { size: 11 }, callback: (v) => formatearMoneda(v) },
                        title: { display: true, text: tApp('chart_importe'), color: textColor, font: { size: 12, weight: '500' } },
                        grid: { color: gridColor }
                    }, 
                    x: { 
                        ticks: { color: textColor, maxRotation: 45, minRotation: 45, font: { size: 11, weight: '500' } },
                        title: { display: true, text: tApp('chart_periodo'), color: textColor, font: { size: 12, weight: '500' } },
                        grid: { color: gridColor }
                    } 
                } 
            } 
        }); 
    }
    
    const dashCtx = document.getElementById('dashboardChart')?.getContext('2d');
    if (dashCtx) { 
        if(dashboardChart) dashboardChart.destroy(); 
        
        // Detectar tema actual
        const isDarkTheme = document.documentElement.getAttribute('data-theme') !== 'light';
        const textColor = isDarkTheme ? 'white' : '#1a1a2e';
        const gridColor = isDarkTheme ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
        
        const c2 = dashCtx;
        const gradIng2 = c2.createLinearGradient(0, 0, 0, dashCtx.canvas ? dashCtx.canvas.height : 300);
        gradIng2.addColorStop(0, 'rgba(0,168,89,0.85)');
        gradIng2.addColorStop(1, 'rgba(0,168,89,0.2)');
        const gradGas2 = c2.createLinearGradient(0, 0, 0, dashCtx.canvas ? dashCtx.canvas.height : 300);
        gradGas2.addColorStop(0, 'rgba(255,95,87,0.85)');
        gradGas2.addColorStop(1, 'rgba(255,95,87,0.2)');
        
        dashboardChart = new Chart(dashCtx, { 
            type: 'bar', 
            data: { 
                labels, 
                datasets: [
                    { label: tApp('chart_ingresos'), data: ingData, backgroundColor: gradIng2, borderRadius: 6, borderSkipped: false },
                    { label: tApp('chart_gastos'), data: gasData, backgroundColor: gradGas2, borderRadius: 6, borderSkipped: false }
                ] 
            }, 
            options: { 
                responsive: true, 
                maintainAspectRatio: true,
                plugins: {
                    tooltip: { 
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        cornerRadius: 8,
                        padding: 10,
                        callbacks: { 
                            label: (context) => `${context.dataset.label}: ${formatearMoneda(context.raw)}` 
                        } 
                    },
                    legend: { 
                        labels: { color: textColor, usePointStyle: true, pointStyle: 'rectRounded', padding: 12, font: { size: 12, family: 'system-ui', weight: '500' } }
                    }
                },
                scales: { 
                    y: { 
                        ticks: { color: textColor, font: { size: 11 }, callback: (v) => formatearMoneda(v) },
                        title: { display: true, text: tApp('chart_importe'), color: textColor, font: { size: 12, weight: '500' } },
                        grid: { color: gridColor }
                    }, 
                    x: { 
                        ticks: { color: textColor, maxRotation: 45, minRotation: 45, font: { size: 11, weight: '500' } },
                        title: { display: true, text: tApp('chart_periodo'), color: textColor, font: { size: 12, weight: '500' } },
                        grid: { display: false }
                    } 
                } 
            } 
        }); 
    }
    
    const _dashStats = document.getElementById('dashboardStats');
    if (_dashStats) _dashStats.innerHTML = `
        <tr><th>Stakeholders</th><td>${proyecto.stakeholders?.length || 0}</td></tr>
        <tr><th>Procesos</th><td>${proyecto.procesos?.filter(p => p.completado).length || 0}/49</td></tr>
        <tr><th>Equipo</th><td>${proyecto.equipo?.length || 0}</td></tr>
        <tr><th>Materiales</th><td>${proyecto.materiales?.length || 0}</td></tr>
        <tr><th>Riesgos</th><td>${proyecto.riesgos?.length || 0}</td></tr>
        <tr><th>Hitos Financieros</th><td>${proyecto.hitosFinancieros?.length || 0}</td></tr>
        <tr><th>Duración (meses)</th><td>${maxMes}</td></tr>
    `;
    // Guardar costes totales para que el dashboard los use
proyecto.costeTotalCashflow = totalGas;
proyecto.ingresoTotalCashflow = totalIng;
proyecto.beneficioTotalCashflow = totalIng - totalGas;

// También guardar en resumenFinanciero
if (!proyecto.resumenFinanciero) proyecto.resumenFinanciero = {};
proyecto.resumenFinanciero.costeTotal = totalGas;
proyecto.resumenFinanciero.ingresoTotal = totalIng;
proyecto.resumenFinanciero.beneficioTotal = totalIng - totalGas;
proyecto.resumenFinanciero.fechaActualizacion = new Date().toISOString();

guardarProyecto(); // Asegurar que se guarda
}



// ============================================
// SEGUROS Y RC
// ============================================
function renderizarSeguros() {
    const container = document.getElementById('segurosContent');
    if (!container) return;
    const seguros = proyecto.seguros || [];
    if (seguros.length === 0) {
        container.innerHTML = '<div class="info-card"><small>No hay seguros registrados. Añade el primero.</small></div>';
        return;
    }
    container.innerHTML = seguros.map((s, i) => {
        const tipo = s.tipo || 'Seguro';
        const coste = s.coste || 0;
        const moneda = s.moneda || proyecto.monedaBase || 'EUR';
        const proveedor = s.proveedor || '—';
        const mes = s.mes || 1;
        const descripcion = s.descripcion || '';
        const icono = tipo === 'RC' ? '' : tipo === 'Transporte' ? '' : tipo === 'Obra' ? '' : '';
        return `<div class="info-card" style="margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
                <div style="flex:1">
                    <strong>${icono} ${s.nombre || 'Seguro'}</strong>
                    <small style="opacity:0.7"> — ${tipo}</small>
                    <div style="font-size:12px;opacity:0.8;margin-top:2px">
                         ${formatearMoneda(coste)} ${moneda} ·  Mes ${mes} ·  ${proveedor}${descripcion ? ' · ' + descripcion : ''}
                    </div>
                </div>
                <div style="display:flex;gap:4px;flex-shrink:0">
                    <button class="btn btn-secondary btn-small" onclick="editarSeguro(${i})"></button>
                    <button class="btn btn-danger btn-small" onclick="eliminarSeguro(${i})"></button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function abrirModalSeguro(editIndex) {
    const seguro = (editIndex !== undefined && proyecto.seguros && proyecto.seguros[editIndex]) ? proyecto.seguros[editIndex] : null;
    const title = seguro ? 'Editar Seguro' : ' Nuevo Seguro';
    const showCoste = seguro ? seguro.coste || 0 : 0;
    const showNombre = seguro ? seguro.nombre || '' : '';
    const showTipo = seguro ? seguro.tipo || 'Seguro' : 'Seguro';
    const showMoneda = seguro ? seguro.moneda || proyecto.monedaBase || 'EUR' : proyecto.monedaBase || 'EUR';
    const showMes = seguro ? seguro.mes || 1 : 1;
    const showProveedor = seguro ? seguro.proveedor || '' : '';
    const showDescripcion = seguro ? seguro.descripcion || '' : '';

    const ctx = document.getElementById('modalContainer');
    if (!ctx) return;
    ctx.innerHTML = `<div class="modal u-flex" id="genericModal" style="display:flex">
        <div class="modal-content" style="max-width:500px">
            <div class="modal-header"><span>${title}</span><span class="close-modal" onclick="cerrarModalSeguro()"></span></div>
                <label>Nombre *</label>
                <input class="input-seguro input-field" id="seguroNombre" value="${showNombre}" placeholder="Ej: Seguro de Transporte Marítimo">
                <label>Tipo</label>
                <select class="input-seguro input-field" id="seguroTipo">
                    <option value="Seguro" ${showTipo === 'Seguro' ? 'selected' : ''}> Seguro</option>
                    <option value="RC" ${showTipo === 'RC' ? 'selected' : ''}> Responsabilidad Civil</option>
                    <option value="Transporte" ${showTipo === 'Transporte' ? 'selected' : ''}> Transporte</option>
                    <option value="Obra" ${showTipo === 'Obra' ? 'selected' : ''}> Obra / Construcción</option>
                    <option value="Vida" ${showTipo === 'Vida' ? 'selected' : ''}> Vida / Accidentes</option>
                    <option value="Otro" ${showTipo === 'Otro' ? 'selected' : ''}> Otro</option>
                </select>
                <label>Coste *</label>
                <input class="input-seguro input-field" id="seguroCoste" type="number" step="0.01" min="0" value="${showCoste}">
                <label>Moneda</label>
                <select class="input-seguro input-field" id="seguroMoneda">
                    ${(proyecto.monedasPersonalizadas || []).map(m => `<option value="${m.codigo}" ${showMoneda === m.codigo ? 'selected' : ''}>${m.codigo} ${m.simbolo || ''}</option>`).join('')}
                    <option value="EUR" ${showMoneda === 'EUR' ? 'selected' : ''}>EUR €</option>
                    <option value="USD" ${showMoneda === 'USD' ? 'selected' : ''}>USD $</option>
                </select>
                <label>Mes de pago</label>
                <input class="input-seguro input-field" id="seguroMes" type="number" min="1" value="${showMes}">
                <label>Proveedor / Aseguradora</label>
                <input class="input-seguro input-field" id="seguroProveedor" value="${showProveedor}" placeholder="Ej: Mapfre, AXA, Allianz">
                <label>Descripción / Notas</label>
                <textarea class="input-seguro input-field" id="seguroDescripcion" rows="2" placeholder="Detalles adicionales...">${showDescripcion}</textarea>
                <div style="display:flex;gap:8px;margin-top:12px">
                    <button class="btn btn-primary" onclick="guardarSeguro(${editIndex !== undefined ? editIndex : ''})"> Guardar</button>
                    <button class="btn btn-secondary" onclick="cerrarModalSeguro()">Cancelar</button>
                </div>
        </div>
    </div>`;
}

function cerrarModalSeguro() {
    document.getElementById('modalContainer').innerHTML = '';
}

function guardarSeguro(editIndex) {
    const nombre = document.getElementById('seguroNombre')?.value?.trim();
    if (!nombre) { alert('El nombre es obligatorio'); return; }
    const tipo = document.getElementById('seguroTipo')?.value || 'Seguro';
    const coste = parseFloat(document.getElementById('seguroCoste')?.value) || 0;
    const moneda = document.getElementById('seguroMoneda')?.value || proyecto.monedaBase || 'EUR';
    const mes = parseInt(document.getElementById('seguroMes')?.value) || 1;
    const proveedor = document.getElementById('seguroProveedor')?.value?.trim() || '';
    const descripcion = document.getElementById('seguroDescripcion')?.value?.trim() || '';

    if (!proyecto.seguros) proyecto.seguros = [];

    const data = { nombre, tipo, coste, moneda, mes, proveedor, descripcion };

    if (editIndex !== undefined && editIndex !== '') {
        proyecto.seguros[editIndex] = data;
    } else {
        proyecto.seguros.push(data);
    }

    cerrarModalSeguro();
    renderizarSeguros();
    guardarProyecto();
    calcularCashflow();
}

function editarSeguro(index) {
    abrirModalSeguro(index);
}

function eliminarSeguro(index) {
    if (!confirm('¿Eliminar este seguro?')) return;
    proyecto.seguros.splice(index, 1);
    renderizarSeguros();
    guardarProyecto();
    calcularCashflow();
}

        // ============================================
        // STAKEHOLDERS
        // ============================================