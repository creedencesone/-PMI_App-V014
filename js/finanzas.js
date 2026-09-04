// ============================================
// MÓDULO: FINANZAS (Monedas, Venta, Cashflow)
// ============================================

let cashflowChart = null;

// Renderizar panel de monedas
function renderizarMonedas() {
    const container = document.getElementById('panelMonedas');
    if (!container) return;
    
    container.innerHTML = `
        <div class="panel-title"><span> Configuración de Monedas</span></div>
        <div class="form-row">
            <div class="form-group">
                <label>Moneda Base del Proyecto</label>
                <select id="monedaBase" onchange="cambiarMonedaBase()">
                    ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${proyecto.monedaBase === m ? 'selected' : ''}>${m} - ${MONEDAS[m].nombre} (${MONEDAS[m].simbolo})</option>`).join('')}
                </select>
            </div>
        </div>
        <div id="tiposCambioContainer"></div>
        <button class="btn btn-secondary btn-small" onclick="actualizarTiposCambio()">⟳ Actualizar Tipos de Cambio</button>
        <hr style="margin: 20px 0">
        <div class="form-row">
            <div class="form-group"><label>Precio de Venta</label><input type="number" id="precioVenta" value="${proyecto.precioVenta}" onchange="actualizarVenta()"></div>
            <div class="form-group"><label>Moneda de Venta</label><select id="monedaVenta" onchange="actualizarVenta()">${Object.keys(MONEDAS).map(m => `<option value="${m}" ${(proyecto.monedaVenta || proyecto.monedaBase) === m ? 'selected' : ''}>${m} - ${MONEDAS[m].nombre}</option>`).join('')}</select></div>
        </div>
        <div class="form-group"><label>Condiciones de Pago</label><textarea rows="2" id="condicionesPago">${escapeHtml(proyecto.condicionesPago || '')}</textarea></div>
        <h4> Hitos de Cobro</h4>
        <div id="hitosList"></div>
        <button class="btn btn-primary btn-small" onclick="abrirModalHitoFinanciero()"> Añadir Hito de Cobro</button>
    `;
    
    actualizarTiposCambioUI();
    renderizarHitosFinancieros();
}

// Renderizar hitos financieros
function renderizarHitosFinancieros() {
    const container = document.getElementById('hitosList');
    if (!container) return;
    
    if (!proyecto.hitosFinancieros || proyecto.hitosFinancieros.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:20px;">No hay hitos de cobro definidos</div>';
        return;
    }
    
    container.innerHTML = proyecto.hitosFinancieros.map(h => {
        let imp = (proyecto.precioVenta * h.porcentaje) / 100;
        let impConvertido = convertirMoneda(imp, proyecto.monedaVenta || proyecto.monedaBase);
        return `<div class="item-card">
            <div><strong>${escapeHtml(h.nombre)}</strong><br>Mes ${h.mes} · ${h.porcentaje}% · ${formatearMoneda(impConvertido, proyecto.monedaBase)}</div>
            <div><span class="edit-btn" onclick="editarHitoFinanciero(${h.id})"></span><span class="delete-btn" onclick="eliminarHitoFinanciero(${h.id})"></span></div>
        </div>`;
    }).join('');
}

// Abrir modal hito financiero
function abrirModalHitoFinanciero() {
    const modalHtml = `
        <div class="modal-content">
            <div class="modal-header"><h3> Hito de Cobro</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
            <input type="hidden" id="hfId">
            <div class="form-group"><label>Nombre del hito</label><input type="text" id="hfNombre"></div>
            <div class="form-row"><div class="form-group"><label>Mes de cobro</label><input type="number" id="hfMes" value="1"></div>
            <div class="form-group"><label>Porcentaje (%)</label><input type="number" id="hfPorcentaje" value="30"></div></div>
            <button class="btn btn-primary" onclick="guardarHitoFinanciero()">Guardar</button>
        </div>
    `;
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `<div id="genericModal" class="modal" style="display:flex">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}

// Guardar hito financiero
function guardarHitoFinanciero() {
    let nombre = document.getElementById('hfNombre').value.trim();
    if (!nombre) { mostrarToast(" Nombre obligatorio"); return; }
    
    let id = document.getElementById('hfId').value;
    let hito = {
        id: id ? parseInt(id) : Date.now(),
        nombre: nombre,
        mes: parseInt(document.getElementById('hfMes').value),
        porcentaje: parseFloat(document.getElementById('hfPorcentaje').value)
    };
    
    if (id) {
        let idx = proyecto.hitosFinancieros.findIndex(h => h.id === parseInt(id));
        if (idx >= 0) proyecto.hitosFinancieros[idx] = hito;
    } else {
        if (!proyecto.hitosFinancieros) proyecto.hitosFinancieros = [];
        proyecto.hitosFinancieros.push(hito);
    }
    
    guardarProyecto();
    renderizarHitosFinancieros();
    calcularCashflow();
    cerrarModalGeneric();
    mostrarToast(" Hito financiero guardado");
}

// Eliminar hito financiero
function eliminarHitoFinanciero(id) {
    if (confirm("¿Eliminar este hito?")) {
        proyecto.hitosFinancieros = proyecto.hitosFinancieros.filter(h => h.id !== id);
        guardarProyecto();
        renderizarHitosFinancieros();
        calcularCashflow();
        mostrarToast(" Hito eliminado");
    }
}

// Editar hito financiero
function editarHitoFinanciero(id) {
    let hito = proyecto.hitosFinancieros.find(h => h.id === id);
    if (!hito) return;
    
    const modalHtml = `
        <div class="modal-content">
            <div class="modal-header"><h3> Editar Hito</h3><span class="close-modal" onclick="cerrarModalGeneric()">&times;</span></div>
            <input type="hidden" id="hfId" value="${hito.id}">
            <div class="form-group"><label>Nombre</label><input type="text" id="hfNombre" value="${escapeHtml(hito.nombre)}"></div>
            <div class="form-row"><div class="form-group"><label>Mes</label><input type="number" id="hfMes" value="${hito.mes}"></div>
            <div class="form-group"><label>Porcentaje</label><input type="number" id="hfPorcentaje" value="${hito.porcentaje}"></div></div>
            <button class="btn btn-primary" onclick="guardarHitoFinanciero()">Guardar</button>
        </div>
    `;
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `<div id="genericModal" class="modal" style="display:flex">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}

// Calcular cashflow
function calcularCashflow() {
    let maxMes = 12;
    let gastos = new Array(maxMes).fill(0);
    let ingresos = new Array(maxMes).fill(0);
    
    // Gastos de equipo
    (proyecto.equipo || []).forEach(r => {
        let costeMes = convertirMoneda(r.costeHora * r.horasMes, r.moneda);
        for (let i = 0; i < maxMes; i++) gastos[i] += costeMes / maxMes;
    });
    
    // Gastos de materiales
    (proyecto.materiales || []).forEach(m => {
        let total = convertirMoneda(m.cantidad * m.costeUnitario + (m.costeEnvio || 0), m.moneda);
        let mes = (m.mes || 1) - 1;
        if (mes >= 0 && mes < maxMes) gastos[mes] += total;
    });
    
    // Gastos de servicios
    (proyecto.servicios || []).forEach(s => {
        let total = s.cantidad * s.costeUnitario * (1 + (s.impuesto || 0) / 100);
        total = convertirMoneda(total, s.moneda);
        let mes = (s.mes || 1) - 1;
        if (mes >= 0 && mes < maxMes) gastos[mes] += total;
    });
    
    // Ingresos por hitos
    (proyecto.hitosFinancieros || []).forEach(h => {
        let idx = (h.mes || 1) - 1;
        if (idx >= 0 && idx < maxMes) {
            let ingreso = (proyecto.precioVenta * (h.porcentaje || 0)) / 100;
            ingresos[idx] += convertirMoneda(ingreso, proyecto.monedaVenta || proyecto.monedaBase);
        }
    });
    
    // Renderizar tabla
    let html = '', totalIng = 0, totalGas = 0, saldo = 0;
    let labels = [], ingData = [], gasData = [], salData = [];
    
    for (let i = 0; i < maxMes; i++) {
        let ing = ingresos[i], gas = gastos[i], neto = ing - gas;
        saldo += neto;
        totalIng += ing;
        totalGas += gas;
        
        html += `<tr>
            <td><strong>Mes ${i+1}</strong></td>
            <td>${formatearMoneda(ing, proyecto.monedaBase)}</td>
            <td>${formatearMoneda(gas, proyecto.monedaBase)}</td>
            <td class="${neto >= 0 ? 'cashflow-positive' : 'cashflow-negative'}">${formatearMoneda(neto, proyecto.monedaBase)}</td>
            <td class="${saldo >= 0 ? 'cashflow-positive' : 'cashflow-negative'}">${formatearMoneda(saldo, proyecto.monedaBase)}</td>
        </tr>`;
        
        labels.push(`Mes ${i+1}`);
        ingData.push(ing);
        gasData.push(gas);
        salData.push(saldo);
    }
    
    const tbody = document.getElementById('cashflowBody');
    if (tbody) tbody.innerHTML = html;
    
    document.getElementById('totalIngresosFoot').innerHTML = formatearMoneda(totalIng, proyecto.monedaBase);
    document.getElementById('totalGastosFoot').innerHTML = formatearMoneda(totalGas, proyecto.monedaBase);
    document.getElementById('totalNetoFoot').innerHTML = formatearMoneda(totalIng - totalGas, proyecto.monedaBase);
    
    // Gráfica
    if (cashflowChart) cashflowChart.destroy();
    const ctx = document.getElementById('cashflowChart')?.getContext('2d');
    if (ctx) {
        cashflowChart = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets: [
                { label: tApp('chart_ingresos'), data: ingData, borderColor: '#00A859', fill: true },
                { label: tApp('chart_gastos'), data: gasData, borderColor: '#E03C31', fill: true },
                { label: tApp('chart_saldo'), data: salData, borderColor: '#0070C0', borderDash: [5, 5], fill: true }
            ] },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }
    
    renderizarKPIs();
}

// Actualizar venta
function actualizarVenta() {
    proyecto.precioVenta = parseFloat(document.getElementById('precioVenta').value);
    proyecto.monedaVenta = document.getElementById('monedaVenta').value;
    proyecto.condicionesPago = document.getElementById('condicionesPago').value;
    guardarProyecto();
    calcularCashflow();
    renderizarHitosFinancieros();
}

// Función de conversión de moneda (delegada a core/finance.js)
function convertirMoneda(valor, monedaOrigen) {
    return window.convertirMoneda(valor, monedaOrigen);
}