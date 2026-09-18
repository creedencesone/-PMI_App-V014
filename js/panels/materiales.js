    function renderizarMateriales() {
    const tbody = document.getElementById('materialesBody');
    if (!proyecto.materiales) proyecto.materiales = [];
    if (proyecto.materiales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="15" class="u-text-center">No hay materiales registrados</td></tr>';
        return;
    }
    
    // Determinar si estamos en modo ágil o mixto
    const esAgile = (proyecto.metodologia?.tipo === 'agile' || proyecto.metodologia?.tipo === 'mixto');
    
    tbody.innerHTML = proyecto.materiales.map(m => {
        // Calcular costes adicionales
        let costeEnvioConv = convertirMoneda(m.costeEnvio || 0, m.monedaEnvio || m.moneda);
        let seguroCalc = (m.cantidad * convertirMoneda(m.costeUnitario, m.moneda)) * ((m.seguroPorcentaje || 0) / 100);
        let seguroFijoConv = convertirMoneda(m.seguroFijo || 0, m.moneda);
        let gastosAduanaConv = convertirMoneda(m.gastosAduana || 0, m.monedaAduana || m.moneda);
        let totalCostesAdicionales = costeEnvioConv + seguroCalc + seguroFijoConv + gastosAduanaConv;
        
        let incotermLabel = '';
        switch(m.incoterm) {
            case 'EXW': incotermLabel = ' EXW'; break;
            case 'FOB': incotermLabel = ' FOB'; break;
            case 'CIF': incotermLabel = ' CIF'; break;
            default: incotermLabel = m.incoterm || 'N/D';
        }
        
        let arancelInfo = '';
        if (m.arancelPersonalizado && m.arancelPersonalizado > 0) {
            arancelInfo = `${m.arancelPersonalizado}% (manual)`;
        } else {
            arancelInfo = 'Auto-calculado';
        }
        
        // Mostrar Sprint si es modo ágil, sino mostrar Mes
        let periodoMostrar = '';
        if (esAgile && m.sprint) {
            periodoMostrar = ` Sprint ${m.sprint}`;
            if (m.historiaAsociada) {
                periodoMostrar += `<br><small style="font-size: 9px; color: #FF8C00;"> ${escapeHtml(m.historiaAsociada.substring(0, 25))}${m.historiaAsociada.length > 25 ? '...' : ''}</small>`;
            }
        } else {
            periodoMostrar = `Mes ${m.mes || 1}`;
        }
        
        // Mostrar también el método de gestión si es mixto
        let gestionLabel = '';
        if (proyecto.metodologia?.tipo === 'mixto' && m.tipoGestion) {
            gestionLabel = m.tipoGestion === 'agile' ? ' Ágil' : ' Cascada';
        }
        
        // ============================================
        // PLAZO DE SUMINISTRO Y FECHA DE RECEPCIÓN
        // ============================================
        let plazoInfo = '';
        if (m.plazoSuministro && m.plazoSuministro > 0) {
            let recepcionInfo = '';
            if (m.fechaRecepcionEstimada) {
                recepcionInfo = `<br><small style="font-size: 9px; color: #00A859;"> Recibe: ${formatearFechaEspa(m.fechaRecepcionEstimada)}</small>`;
            } else if (m.mesRecepcion) {
                recepcionInfo = `<br><small style="font-size: 9px; color: #00A859;"> Recibe: Mes ${m.mesRecepcion}</small>`;
            }
            plazoInfo = `<div class="u-fs-10"> ${m.plazoSuministro} días${recepcionInfo}</div>`;
        } else {
            plazoInfo = '<div style="font-size: 10px; color: #888;">-</div>';
        }
        
        // ============================================
        // GENERAR TEXTO DE CONDICIONES DE PAGO
        // ============================================
        let condicionesPagoHtml = '';
        if (m.condicionesPago) {
            const cp = m.condicionesPago;
            if (cp.tipo === 'contado') {
                condicionesPagoHtml = '<span class="badge-completado" title="Pago de contado"> Contado</span>';
            } else if (cp.tipo === 'contra_recepcion') {
                condicionesPagoHtml = `<span class="badge-pais" style="background: rgba(0,168,89,0.2); color: #00A859;" title="Pago contra recepción"> Contra recepción</span>`;
            } else if (cp.tipo === 'porcentajes') {
                const tramos = cp.tramos.map(t => `${t.porcentaje}% (${t.momento === 'compra' ? 'compra' : 'recepción'})`).join(', ');
                condicionesPagoHtml = `<span class="badge-progreso" title="${tramos}"> ${cp.tramos.length} pagos</span>`;
            } else if (cp.tipo === 'plazo') {
                const refTexto = cp.plazoReferencia === 'compra' ? 'compra' : (cp.plazoReferencia === 'recepcion' ? 'recepción' : 'factura');
                condicionesPagoHtml = `<span class="badge-pais" title="Pago a ${cp.plazoDias} días después de la ${refTexto}"> ${cp.plazoDias} días</span>`;
            } else if (cp.tipo === 'mixto') {
                const refTexto = cp.plazoReferencia === 'compra' ? 'compra' : 'recepción';
                condicionesPagoHtml = `<span class="badge-warning" style="background: rgba(255,140,0,0.2); color: #FF8C00; padding: 2px 6px; border-radius: 12px;" title="${cp.porcentajeInicial}% al ${refTexto === 'compra' ? 'comprar' : 'recibir'}, ${100-cp.porcentajeInicial}% a ${cp.plazoResto} días"> ${cp.porcentajeInicial}% + ${cp.plazoResto}d</span>`;
            }
        } else {
            condicionesPagoHtml = '<span class="badge-pendiente">Sin condiciones</span>';
        }
        
        return `
            <tr>
                <td><strong>${escapeHtml(m.nombre)}</strong>${gestionLabel ? `<br><small style="font-size: 9px;">${gestionLabel}</small>` : ''}</td>
                <td>${escapeHtml(m.proveedor || '-')}</td>
                <td>${escapeHtml(m.partNumber || '-')}</td>
                <td>${m.cantidad}</td>
                <td>${formatearMoneda(convertirMoneda(m.costeUnitario, m.moneda))}</td>
                <td>${m.moneda}</td>
                <td class="badge-pais">${escapeHtml(m.paisOrigen || 'No especificado')}</td>
                <td style="background: ${esAgile && m.sprint ? 'rgba(255,140,0,0.15)' : 'rgba(0,122,255,0.1)'};">${periodoMostrar}</td>
                <td class="u-text-center">${plazoInfo}</td>
                <td><span class="badge-pais" style="background:rgba(255,140,0,0.2);">${incotermLabel}</span></td>
                <td>${formatearMoneda(costeEnvioConv)}</td>
                <td>${arancelInfo}</td>
                <td class="u-text-center">${condicionesPagoHtml}</td>
                <td>
                    <span class="edit-btn" onclick="editarMaterial(${m.id})"></span>
                    <span class="delete-btn" onclick="eliminarMaterial(${m.id})"></span>
                 </td>
            </tr>
        `;
    }).join('');
    
    calcularCashflow();
}
        
function abrirModalMaterial() {
    const esAgile = (proyecto.metodologia?.tipo === 'agile' || proyecto.metodologia?.tipo === 'mixto');
    
    // Obtener valores por defecto
    const hoy = new Date().toISOString().split('T')[0];
    const monedaPorDefecto = proyecto.monedaBase || 'EUR';
    
    let modalHtml = `
        <div class="modal-content modal-lg" style="max-width: 750px;">
            <div class="modal-header">
                <h3> Nuevo Material</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="matId">
            
            <!-- ============================================ -->
            <!-- DATOS BÁSICOS DEL MATERIAL -->
            <!-- ============================================ -->
            <div class="form-group">
                <label>Nombre del material *</label>
                <input type="text" id="matNombre" placeholder="Ej: Servidor Dell PowerEdge" class="u-select-glass">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Proveedor</label>
                    <input type="text" id="matProveedor" placeholder="Ej: Dell Technologies" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Part Number / SKU</label>
                    <input type="text" id="matPartNumber" placeholder="Ej: R750-XS" class="u-select-glass">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Cantidad</label>
                    <input type="number" id="matCantidad" value="1" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label>Coste unitario</label>
                    <input type="number" id="matCosteUnitario" value="1000" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label>Moneda</label>
                    <select id="matMoneda" class="u-select-glass">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${m === monedaPorDefecto ? 'selected' : ''}>${m} - ${MONEDAS[m]}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <!-- ============================================ -->
            <!--  NUEVO: HS CODE Y PESO UNITARIO -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> DATOS PARA COMERCIO EXTERIOR</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Peso unitario (kg)</label>
                    <input type="number" id="matPesoUnitario" value="1" step="0.1" min="0.1" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Peso por unidad del material</small>
                </div>
                <div class="form-group">
                    <label> HS Code (Código Arancelario)</label>
                    <input type="text" id="matHsCode" placeholder="Ej: 8471.30.00" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Código para comercio internacional</small>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> País de origen</label>
                    <input type="text" id="matPaisOrigen" placeholder="Ej: China, USA, España" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Para cálculo de aranceles</small>
                </div>
    `;
    
    if (esAgile) {
        modalHtml += `
                <div class="form-group">
                    <label> Sprint asociado</label>
                    <input type="number" id="matSprint" value="1" min="1" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Sprint donde se usará este material</small>
                </div>
            </div>
        `;
    } else {
        modalHtml += `
                <div class="form-group">
                    <label> Mes de compra</label>
                    <input type="number" id="matMes" value="1" min="1" max="36" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Mes planificado para la compra</small>
                </div>
            </div>
        `;
    }
    
    modalHtml += `
            <!-- ============================================ -->
            <!-- PLAZO DE SUMINISTRO -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> PLAZO DE SUMINISTRO</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Plazo de suministro (días)</label>
                    <input type="number" id="matPlazoSuministro" value="0" min="0" max="365" step="1" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Días desde la compra hasta la recepción</small>
                </div>
                <div class="form-group">
                    <label> Fecha de referencia</label>
                    <select id="matReferenciaPlazo" class="u-select-glass">
                        <option value="compra">Desde fecha de compra</option>
                        <option value="pedido">Desde fecha de pedido</option>
                        <option value="envio">Desde fecha de envío</option>
                    </select>
                </div>
            </div>
            
            <!-- ============================================ -->
            <!-- CONDICIONES DE PAGO -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> CONDICIONES DE PAGO</h4>
            
            <div class="form-group">
                <label>Tipo de pago</label>
                <select id="matTipoPago" class="u-select-glass" onchange="toggleCondicionesPagoMaterial()">
                    <option value="contado"> Pago de contado (100% ahora)</option>
                    <option value="porcentajes"> Pago por porcentajes</option>
                    <option value="plazo"> Pago a plazo</option>
                    <option value="mixto"> Mixto (porcentaje + plazo)</option>
                    <option value="contra_recepcion"> Pago contra recepción</option>
                </select>
            </div>
            
            <!-- Opción: Pago contra recepción -->
            <div id="pagoContraRecepcionGroup" class="u-hidden">
                <div class="info-card-modal" style="padding: 8px; background: rgba(0,168,89,0.15);">
                    <small> El pago se realizará <strong>contra recepción del material</strong>.</small>
                </div>
            </div>
            
            <!-- Opción: Porcentajes -->
            <div id="pagoPorcentajesGroup" class="u-hidden">
                <label style="font-size: 12px; margin-bottom: 8px; display: block;"> Distribución de pagos</label>
                <div id="listaPorcentajesMaterial">
                    <div class="form-row u-mb-8">
                        <div class="form-group u-flex-2">
                            <label>% inicial</label>
                            <input type="number" id="pagoPorcInicial" value="80" min="0" max="100" step="5" class="u-select-glass">
                        </div>
                        <div class="form-group u-flex-2">
                            <label>Momento del pago</label>
                            <select id="pagoPorcMomentoInicial" class="u-select-glass">
                                <option value="compra">En el momento de la compra</option>
                                <option value="recepcion">En el momento de la recepción</option>
                            </select>
                        </div>
                        <div class="form-group u-flex-1">
                            <label>&nbsp;</label>
                            <button class="btn btn-secondary btn-small u-w-full" onclick="agregarFilaPagoMaterial()">+ Añadir tramo</button>
                        </div>
                    </div>
                </div>
                <div id="listaTramosPagoMaterial" class="u-mt-8"></div>
                <small class="u-fs-11 u-color-muted"> La suma de los porcentajes debe ser 100%</small>
            </div>
            
            <!-- Opción: Plazo -->
            <div id="pagoPlazoGroup" class="u-hidden">
                <div class="form-row">
                    <div class="form-group">
                        <label> Días de plazo</label>
                        <input type="number" id="pagoPlazoDias" value="30" min="0" max="360" step="15" class="u-select-glass">
                    </div>
                    <div class="form-group">
                        <label> Fecha de referencia</label>
                        <select id="pagoPlazoReferencia" class="u-select-glass">
                            <option value="compra">Fecha de compra</option>
                            <option value="recepcion">Fecha de recepción</option>
                            <option value="factura">Fecha de factura</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Opción: Mixto -->
            <div id="pagoMixtoGroup" class="u-hidden">
                <div class="form-row">
                    <div class="form-group">
                        <label> Porcentaje inicial</label>
                        <input type="number" id="pagoMixtoPorcInicial" value="50" min="0" max="100" step="5" class="u-select-glass">
                    </div>
                    <div class="form-group">
                        <label> Plazo para el resto (días)</label>
                        <input type="number" id="pagoMixtoPlazo" value="30" min="0" max="360" step="15" class="u-select-glass">
                    </div>
                    <div class="form-group">
                        <label>Referencia del plazo</label>
                        <select id="pagoMixtoReferencia" class="u-select-glass">
                            <option value="compra">Desde compra</option>
                            <option value="recepcion">Desde recepción</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- ============================================ -->
            <!-- LOGÍSTICA Y TRANSPORTE -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> LOGÍSTICA Y TRANSPORTE</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label>INCOTERM</label>
                    <select id="matIncoterm" class="u-select-glass">
                        <option value="EXW">EXW - En fábrica</option>
                        <option value="FOB">FOB - Libre a bordo</option>
                        <option value="CIF" selected>CIF - Coste, seguro y flete</option>
                        <option value="DDP">DDP - Entregado con derechos pagados</option>
                    </select>
                </div>
                <div class="form-group">
                    <label> Coste de envío</label>
                    <input type="number" id="matCosteEnvio" value="0" step="100" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Moneda envío</label>
                    <select id="matMonedaEnvio" class="u-select-glass">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${m === monedaPorDefecto ? 'selected' : ''}>${m}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <!-- ============================================ -->
            <!-- ARANCELES Y ADUANAS -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> ARANCELES Y ADUANAS</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label> % Arancel personalizado</label>
                    <input type="number" id="matArancelPersonalizado" value="0" step="1" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Gastos de aduana</label>
                    <input type="number" id="matGastosAduana" value="0" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Moneda gastos aduana</label>
                    <select id="matMonedaAduana" class="u-select-glass">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${m === monedaPorDefecto ? 'selected' : ''}>${m}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label> Notas adicionales</label>
                <textarea rows="2" id="matNotas" placeholder="Condiciones particulares..." class="u-select-glass"></textarea>
            </div>
            
            <div class="info-card-modal u-mt-16" style="background: rgba(0,122,255,0.1);">
                <small> <strong>Resumen del material:</strong><br>
                • <strong>HS Code:</strong> Se usará para comercio exterior y packing list<br>
                • <strong>Peso unitario:</strong> Se usará para calcular el peso total en logística<br>
                • <strong>País de origen:</strong> Para cálculo de aranceles
                </small>
            </div>
            
            <button class="btn btn-secondary u-mt-16" id="btnImportarPDF" style="width:100%;margin-bottom:8px;"> Importar desde Orden de Compra (PDF)</button>
            <button class="btn btn-primary" onclick="guardarMaterial()" style="width:100%;"> Guardar Material</button>
        </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
    
    // Inicializar visibilidad de opciones de pago
    setTimeout(() => {
        toggleCondicionesPagoMaterial();
        const btnPDF = document.getElementById('btnImportarPDF');
        if (btnPDF) btnPDF.onclick = importarDesdePDF;
    }, 100);
}

// Función para mostrar/ocultar opciones de pago
function toggleCondicionesPagoMaterial() {
    const tipo = document.getElementById('matTipoPago').value;
    document.getElementById('pagoPorcentajesGroup').style.display = tipo === 'porcentajes' ? 'block' : 'none';
    document.getElementById('pagoPlazoGroup').style.display = tipo === 'plazo' ? 'block' : 'none';
    document.getElementById('pagoMixtoGroup').style.display = tipo === 'mixto' ? 'block' : 'none';
    document.getElementById('pagoContraRecepcionGroup').style.display = tipo === 'contra_recepcion' ? 'block' : 'none';
}

// Función para agregar fila de pago por porcentaje
function agregarFilaPagoMaterial() {
    const container = document.getElementById('listaTramosPagoMaterial');
    const index = container.children.length;
    
    const rowHtml = `
        <div class="form-row u-mb-8" data-tramo-index="${index}">
            <div class="form-group u-flex-2">
                <label>% tramo ${index + 2}</label>
                <input type="number" class="pagoPorcValor" value="20" min="0" max="100" step="5">
            </div>
            <div class="form-group u-flex-2">
                <label>Momento del pago</label>
                <select class="pagoPorcMomento">
                    <option value="compra">En el momento de la compra</option>
                    <option value="recepcion">En el momento de la recepción</option>
                </select>
            </div>
            <div class="form-group u-flex-1">
                <label>&nbsp;</label>
                <button class="btn btn-danger btn-small u-w-full" onclick="eliminarFilaPagoMaterial(this)"></button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', rowHtml);
}

function eliminarFilaPagoMaterial(btn) {
    btn.closest('.form-row').remove();
}
        
function guardarMaterial() {
    let nombre = document.getElementById('matNombre').value.trim();
    if (!nombre) {
        mostrarToast(tApp('toast_nombre_obligatorio'), "error");
        return;
    }
    
    let id = document.getElementById('matId').value;
    const esAgile = (proyecto.metodologia?.tipo === 'agile' || proyecto.metodologia?.tipo === 'mixto');
    
    // ============================================
    //  RECOGER HS CODE Y PESO UNITARIO
    // ============================================
    const hsCode = document.getElementById('matHsCode').value.trim() || '';
    const pesoUnitario = parseFloat(document.getElementById('matPesoUnitario').value) || 1;
    const paisOrigen = document.getElementById('matPaisOrigen').value.trim() || '';
    
    // ============================================
    // RECOGER PLAZO DE SUMINISTRO
    // ============================================
    const plazoSuministro = parseInt(document.getElementById('matPlazoSuministro').value) || 0;
    const referenciaPlazo = document.getElementById('matReferenciaPlazo').value;
    
    // ============================================
    // RECOGER CONDICIONES DE PAGO
    // ============================================
    const tipoPago = document.getElementById('matTipoPago').value;
    let condicionesPago = {
        tipo: tipoPago,
        tramos: [],
        plazoDias: 0,
        plazoReferencia: 'compra',
        porcentajeInicial: 0,
        plazoResto: 0,
        contraRecepcion: tipoPago === 'contra_recepcion'
    };
    
    if (tipoPago === 'porcentajes') {
        const porcInicial = parseFloat(document.getElementById('pagoPorcInicial').value) || 0;
        const momentoInicial = document.getElementById('pagoPorcMomentoInicial').value;
        condicionesPago.tramos.push({ porcentaje: porcInicial, momento: momentoInicial });
        
        const tramos = document.querySelectorAll('#listaTramosPagoMaterial .form-row');
        tramos.forEach(tramo => {
            const porc = parseFloat(tramo.querySelector('.pagoPorcValor')?.value) || 0;
            const momento = tramo.querySelector('.pagoPorcMomento')?.value || 'compra';
            condicionesPago.tramos.push({ porcentaje: porc, momento: momento });
        });
        
    } else if (tipoPago === 'plazo') {
        condicionesPago.plazoDias = parseInt(document.getElementById('pagoPlazoDias').value) || 0;
        condicionesPago.plazoReferencia = document.getElementById('pagoPlazoReferencia').value;
        
    } else if (tipoPago === 'mixto') {
        condicionesPago.porcentajeInicial = parseFloat(document.getElementById('pagoMixtoPorcInicial').value) || 0;
        condicionesPago.plazoResto = parseInt(document.getElementById('pagoMixtoPlazo').value) || 0;
        condicionesPago.plazoReferencia = document.getElementById('pagoMixtoReferencia').value;
    }
    
    // Construir objeto base del material
    let nuevoMaterial = {
        id: id ? parseInt(id) : Date.now(),
        nombre: nombre,
        proveedor: document.getElementById('matProveedor').value.trim(),
        partNumber: document.getElementById('matPartNumber').value.trim(),
        cantidad: parseFloat(document.getElementById('matCantidad').value),
        costeUnitario: parseFloat(document.getElementById('matCosteUnitario').value),
        moneda: document.getElementById('matMoneda').value,
        paisOrigen: paisOrigen,
        
        //  NUEVOS CAMPOS
        hsCode: hsCode,
        pesoUnitario: pesoUnitario,
        
        // Plazo de suministro
        plazoSuministro: plazoSuministro,
        referenciaPlazo: referenciaPlazo,
        fechaRecepcionEstimada: null,
        
        // Logística
        incoterm: document.getElementById('matIncoterm').value,
        costeEnvio: parseFloat(document.getElementById('matCosteEnvio').value),
        monedaEnvio: document.getElementById('matMonedaEnvio').value,
        
        // Aranceles
        arancelPersonalizado: parseFloat(document.getElementById('matArancelPersonalizado').value),
        gastosAduana: parseFloat(document.getElementById('matGastosAduana').value),
        monedaAduana: document.getElementById('matMonedaAduana').value,
        notas: document.getElementById('matNotas').value,
        
        // Condiciones de pago
        condicionesPago: condicionesPago,
        
        // Seguimiento de pagos reales
        pagosRealizados: []
    };
    
    // Calcular fecha de recepción estimada
    if (proyecto.fechaInicio) {
        const fechaBase = new Date(proyecto.fechaInicio);
        const mesCompra = nuevoMaterial.mes || 1;
        fechaBase.setMonth(fechaBase.getMonth() + (mesCompra - 1));
        
        if (plazoSuministro > 0) {
            const fechaRecepcion = new Date(fechaBase);
            fechaRecepcion.setDate(fechaRecepcion.getDate() + plazoSuministro);
            nuevoMaterial.fechaRecepcionEstimada = fechaRecepcion.toISOString().split('T')[0];
            
            const diffMeses = (fechaRecepcion.getFullYear() - new Date(proyecto.fechaInicio).getFullYear()) * 12 +
                              (fechaRecepcion.getMonth() - new Date(proyecto.fechaInicio).getMonth());
            nuevoMaterial.mesRecepcion = Math.max(1, diffMeses + 1);
        } else {
            nuevoMaterial.mesRecepcion = nuevoMaterial.mes || 1;
        }
    }
    
    // Período según metodología
    if (esAgile) {
        nuevoMaterial.sprint = parseInt(document.getElementById('matSprint')?.value) || 1;
        nuevoMaterial.historiaAsociada = document.getElementById('matHistoriaAsociada')?.value || '';
        nuevoMaterial.mes = null;
        nuevoMaterial.tipoGestion = 'agile';
    } else {
        nuevoMaterial.mes = parseInt(document.getElementById('matMes').value);
        nuevoMaterial.sprint = null;
        nuevoMaterial.historiaAsociada = null;
        nuevoMaterial.tipoGestion = 'cascada';
    }
    
    // Guardar o actualizar
    if (id) {
        let index = proyecto.materiales.findIndex(m => m.id === parseInt(id));
        if (index !== -1) proyecto.materiales[index] = nuevoMaterial;
    } else {
        if (!proyecto.materiales) proyecto.materiales = [];
        proyecto.materiales.push(nuevoMaterial);
    }
    
    guardarProyecto();
    renderizarMateriales();
    
    if (esAgile && typeof calcularCostesPorSprint === 'function') {
        setTimeout(() => calcularCostesPorSprint(), 500);
    }
    
    cerrarModalGeneric();
    
    // Mensaje con resumen
    let msgPago = '';
    if (tipoPago === 'contado') msgPago = ' (Pago de contado)';
    else if (tipoPago === 'contra_recepcion') msgPago = ` (Pago contra recepción en ${plazoSuministro} días)`;
    else if (tipoPago === 'porcentajes') msgPago = ` (${condicionesPago.tramos.length} pagos)`;
    else if (tipoPago === 'plazo') msgPago = ` (Pago a ${condicionesPago.plazoDias} días)`;
    else if (tipoPago === 'mixto') msgPago = ` (${condicionesPago.porcentajeInicial}% ahora, resto a ${condicionesPago.plazoResto} días)`;
    
    let hsCodeMsg = hsCode ? ` | HS Code: ${hsCode}` : '';
    let pesoMsg = ` | Peso: ${pesoUnitario} kg/unidad`;
    
    if (plazoSuministro > 0) {
        msgPago += `  Plazo suministro: ${plazoSuministro} días → Recepción: ${nuevoMaterial.fechaRecepcionEstimada ? formatearFechaEspa(nuevoMaterial.fechaRecepcionEstimada) : 'calculada'}`;
    }
    
    mostrarToast(` Material "${nombre}" guardado${msgPago}${hsCodeMsg}${pesoMsg}`, "success");
}
        
    function editarMaterial(id) {
    let material = proyecto.materiales.find(m => m.id === id);
    if (!material) return;
    
    const esAgile = (proyecto.metodologia?.tipo === 'agile' || proyecto.metodologia?.tipo === 'mixto');
    const condiciones = material.condicionesPago || { tipo: 'contado' };
    
    // Preparar valores para los campos de condiciones de pago
    let tipoPago = condiciones.tipo || 'contado';
    let porcentajeInicial = condiciones.porcentajeInicial || 50;
    let plazoResto = condiciones.plazoResto || 30;
    let plazoDias = condiciones.plazoDias || 60;
    let plazoReferencia = condiciones.plazoReferencia || 'compra';
    
    // Preparar tramos de porcentajes
    let tramosHtml = '';
    if (condiciones.tramos && condiciones.tramos.length > 0) {
        for (let i = 1; i < condiciones.tramos.length; i++) {
            const t = condiciones.tramos[i];
            tramosHtml += `
                <div class="form-row u-mb-8" data-tramo-index="${i}">
                    <div class="form-group u-flex-2">
                        <label>% tramo ${i + 1}</label>
                        <input type="number" class="pagoPorcValor" value="${t.porcentaje}" min="0" max="100" step="5">
                    </div>
                    <div class="form-group u-flex-2">
                        <label>Momento del pago</label>
                        <select class="pagoPorcMomento">
                            <option value="compra" ${t.momento === 'compra' ? 'selected' : ''}>En el momento de la compra</option>
                            <option value="recepcion" ${t.momento === 'recepcion' ? 'selected' : ''}>En el momento de la recepción</option>
                        </select>
                    </div>
                    <div class="form-group u-flex-1">
                        <label>&nbsp;</label>
                        <button class="btn btn-danger btn-small u-w-full" onclick="eliminarFilaPagoMaterial(this)"></button>
                    </div>
                </div>
            `;
        }
    }
    
    // Valores de plazo de suministro
    let plazoSuministro = material.plazoSuministro || 0;
    let referenciaPlazo = material.referenciaPlazo || 'compra';
    
    //  Obtener HS Code y peso unitario del material
    let hsCode = material.hsCode || material.partNumber || '';
    let pesoUnitario = material.pesoUnitario || 1;
    
    let modalHtml = `
        <div class="modal-content modal-lg" style="max-width: 750px;">
            <div class="modal-header">
                <h3> Editar Material: ${escapeHtml(material.nombre)}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="matId" value="${material.id}">
            
            <!-- ============================================ -->
            <!-- DATOS BÁSICOS -->
            <!-- ============================================ -->
            <div class="form-group">
                <label>Nombre del material *</label>
                <input type="text" id="matNombre" value="${escapeHtml(material.nombre)}" class="u-select-glass">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Proveedor</label>
                    <input type="text" id="matProveedor" value="${escapeHtml(material.proveedor || '')}" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Part Number / SKU</label>
                    <input type="text" id="matPartNumber" value="${escapeHtml(material.partNumber || '')}" class="u-select-glass">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Cantidad</label>
                    <input type="number" id="matCantidad" value="${material.cantidad}" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label>Coste unitario</label>
                    <input type="number" id="matCosteUnitario" value="${material.costeUnitario}" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label>Moneda</label>
                    <select id="matMoneda" class="u-select-glass">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${material.moneda === m ? 'selected' : ''}>${m} - ${MONEDAS[m]}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <!-- ============================================ -->
            <!--  NUEVO: HS CODE Y PESO UNITARIO -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> DATOS PARA COMERCIO EXTERIOR</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Peso unitario (kg)</label>
                    <input type="number" id="matPesoUnitario" value="${pesoUnitario}" step="0.1" min="0.1" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Peso por unidad del material</small>
                </div>
                <div class="form-group">
                    <label> HS Code (Código Arancelario)</label>
                    <input type="text" id="matHsCode" value="${escapeHtml(hsCode)}" placeholder="Ej: 8471.30.00" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Código para comercio internacional</small>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> País de origen</label>
                    <input type="text" id="matPaisOrigen" value="${escapeHtml(material.paisOrigen || '')}" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Para cálculo de aranceles</small>
                </div>
    `;
    
    if (esAgile) {
        modalHtml += `
                <div class="form-group">
                    <label> Sprint asociado</label>
                    <input type="number" id="matSprint" value="${material.sprint || 1}" min="1" class="u-select-glass">
                </div>
            </div>
        `;
        if (material.historiaAsociada) {
            modalHtml += `
                <div class="form-row">
                    <div class="form-group u-flex-1">
                        <label> Historia asociada</label>
                        <input type="text" id="matHistoriaAsociada" value="${escapeHtml(material.historiaAsociada || '')}" class="u-select-glass">
                    </div>
                </div>
            `;
        }
    } else {
        modalHtml += `
                <div class="form-group">
                    <label> Mes de compra</label>
                    <input type="number" id="matMes" value="${material.mes || 1}" min="1" max="36" class="u-select-glass">
                </div>
            </div>
        `;
    }
    
    modalHtml += `
            <!-- ============================================ -->
            <!-- PLAZO DE SUMINISTRO -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> PLAZO DE SUMINISTRO</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Plazo de suministro (días)</label>
                    <input type="number" id="matPlazoSuministro" value="${plazoSuministro}" min="0" max="365" step="1" class="u-select-glass">
                    <small class="u-fs-10 u-color-muted">Días desde la compra hasta la recepción</small>
                </div>
                <div class="form-group">
                    <label> Fecha de referencia</label>
                    <select id="matReferenciaPlazo" class="u-select-glass">
                        <option value="compra" ${referenciaPlazo === 'compra' ? 'selected' : ''}>Desde fecha de compra</option>
                        <option value="pedido" ${referenciaPlazo === 'pedido' ? 'selected' : ''}>Desde fecha de pedido</option>
                        <option value="envio" ${referenciaPlazo === 'envio' ? 'selected' : ''}>Desde fecha de envío</option>
                    </select>
                </div>
            </div>
            
            ${material.fechaRecepcionEstimada ? `
            <div class="info-card-modal" style="margin-bottom: 12px; padding: 8px; background: rgba(0,122,255,0.1);">
                <small> <strong>Fecha de recepción estimada actual:</strong> ${formatearFechaEspa(material.fechaRecepcionEstimada)}</small>
            </div>
            ` : ''}
            
            <!-- ============================================ -->
            <!-- CONDICIONES DE PAGO -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> CONDICIONES DE PAGO</h4>
            
            <div class="form-group">
                <label>Tipo de pago</label>
                <select id="matTipoPago" class="u-select-glass" onchange="toggleCondicionesPagoMaterial()">
                    <option value="contado" ${tipoPago === 'contado' ? 'selected' : ''}> Pago de contado (100% ahora)</option>
                    <option value="porcentajes" ${tipoPago === 'porcentajes' ? 'selected' : ''}> Pago por porcentajes</option>
                    <option value="plazo" ${tipoPago === 'plazo' ? 'selected' : ''}> Pago a plazo</option>
                    <option value="mixto" ${tipoPago === 'mixto' ? 'selected' : ''}> Mixto (porcentaje + plazo)</option>
                    <option value="contra_recepcion" ${tipoPago === 'contra_recepcion' ? 'selected' : ''}> Pago contra recepción</option>
                </select>
            </div>
            
            <!-- Opción: Pago contra recepción -->
            <div id="pagoContraRecepcionGroup" style="display: ${tipoPago === 'contra_recepcion' ? 'block' : 'none'};">
                <div class="info-card-modal" style="padding: 8px; background: rgba(0,168,89,0.15);">
                    <small> El pago se realizará <strong>contra recepción del material</strong>.</small>
                </div>
            </div>
            
            <!-- Opción: Porcentajes -->
            <div id="pagoPorcentajesGroup" style="display: ${tipoPago === 'porcentajes' ? 'block' : 'none'};">
                <label style="font-size: 12px; margin-bottom: 8px; display: block;"> Distribución de pagos</label>
                <div id="listaPorcentajesMaterial">
                    <div class="form-row u-mb-8">
                        <div class="form-group u-flex-2">
                            <label>% inicial</label>
                            <input type="number" id="pagoPorcInicial" value="${condiciones.tramos && condiciones.tramos[0] ? condiciones.tramos[0].porcentaje : 80}" min="0" max="100" step="5" class="u-select-glass">
                        </div>
                        <div class="form-group u-flex-2">
                            <label>Momento del pago</label>
                            <select id="pagoPorcMomentoInicial" class="u-select-glass">
                                <option value="compra" ${condiciones.tramos && condiciones.tramos[0] && condiciones.tramos[0].momento === 'compra' ? 'selected' : ''}>En el momento de la compra</option>
                                <option value="recepcion" ${condiciones.tramos && condiciones.tramos[0] && condiciones.tramos[0].momento === 'recepcion' ? 'selected' : ''}>En el momento de la recepción</option>
                            </select>
                        </div>
                        <div class="form-group u-flex-1">
                            <label>&nbsp;</label>
                            <button class="btn btn-secondary btn-small u-w-full" onclick="agregarFilaPagoMaterial()">+ Añadir tramo</button>
                        </div>
                    </div>
                </div>
                <div id="listaTramosPagoMaterial">
                    ${tramosHtml}
                </div>
                <small class="u-fs-11 u-color-muted"> La suma de los porcentajes debe ser 100%</small>
            </div>
            
            <!-- Opción: Plazo -->
            <div id="pagoPlazoGroup" style="display: ${tipoPago === 'plazo' ? 'block' : 'none'};">
                <div class="form-row">
                    <div class="form-group">
                        <label> Días de plazo</label>
                        <input type="number" id="pagoPlazoDias" value="${plazoDias}" min="0" max="360" step="15" class="u-select-glass">
                    </div>
                    <div class="form-group">
                        <label> Fecha de referencia</label>
                        <select id="pagoPlazoReferencia" class="u-select-glass">
                            <option value="compra" ${plazoReferencia === 'compra' ? 'selected' : ''}>Fecha de compra</option>
                            <option value="recepcion" ${plazoReferencia === 'recepcion' ? 'selected' : ''}>Fecha de recepción</option>
                            <option value="factura" ${plazoReferencia === 'factura' ? 'selected' : ''}>Fecha de factura</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Opción: Mixto -->
            <div id="pagoMixtoGroup" style="display: ${tipoPago === 'mixto' ? 'block' : 'none'};">
                <div class="form-row">
                    <div class="form-group">
                        <label> Porcentaje inicial</label>
                        <input type="number" id="pagoMixtoPorcInicial" value="${porcentajeInicial}" min="0" max="100" step="5" class="u-select-glass">
                    </div>
                    <div class="form-group">
                        <label> Plazo para el resto (días)</label>
                        <input type="number" id="pagoMixtoPlazo" value="${plazoResto}" min="0" max="360" step="15" class="u-select-glass">
                    </div>
                    <div class="form-group">
                        <label>Referencia del plazo</label>
                        <select id="pagoMixtoReferencia" class="u-select-glass">
                            <option value="compra" ${condiciones.plazoReferencia === 'compra' ? 'selected' : ''}>Desde compra</option>
                            <option value="recepcion" ${condiciones.plazoReferencia === 'recepcion' ? 'selected' : ''}>Desde recepción</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- ============================================ -->
            <!-- LOGÍSTICA Y TRANSPORTE -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> LOGÍSTICA Y TRANSPORTE</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label>INCOTERM</label>
                    <select id="matIncoterm" class="u-select-glass">
                        <option value="EXW" ${material.incoterm === 'EXW' ? 'selected' : ''}>EXW - En fábrica</option>
                        <option value="FOB" ${material.incoterm === 'FOB' ? 'selected' : ''}>FOB - Libre a bordo</option>
                        <option value="CIF" ${material.incoterm === 'CIF' ? 'selected' : ''}>CIF - Coste, seguro y flete</option>
                        <option value="DDP" ${material.incoterm === 'DDP' ? 'selected' : ''}>DDP - Entregado con derechos pagados</option>
                    </select>
                </div>
                <div class="form-group">
                    <label> Coste de envío</label>
                    <input type="number" id="matCosteEnvio" value="${material.costeEnvio || 0}" step="100" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Moneda envío</label>
                    <select id="matMonedaEnvio" class="u-select-glass">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${(material.monedaEnvio || material.moneda) === m ? 'selected' : ''}>${m}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Seguro de transporte (%)</label>
                    <input type="number" id="matSeguro" value="${material.seguroPorcentaje || 0}" step="0.5" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Seguro de transporte (fijo)</label>
                    <input type="number" id="matSeguroFijo" value="${material.seguroFijo || 0}" class="u-select-glass">
                </div>
            </div>
            
            <!-- ============================================ -->
            <!-- ARANCELES Y ADUANAS -->
            <!-- ============================================ -->
            <hr class="u-hr">
            <h4 class="u-section-title"> ARANCELES Y ADUANAS</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label> % Arancel personalizado</label>
                    <input type="number" id="matArancelPersonalizado" value="${material.arancelPersonalizado || 0}" step="1" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Gastos de aduana</label>
                    <input type="number" id="matGastosAduana" value="${material.gastosAduana || 0}" class="u-select-glass">
                </div>
                <div class="form-group">
                    <label> Moneda gastos aduana</label>
                    <select id="matMonedaAduana" class="u-select-glass">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${(material.monedaAduana || material.moneda) === m ? 'selected' : ''}>${m}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label> Notas adicionales</label>
                <textarea rows="2" id="matNotas" class="u-select-glass">${escapeHtml(material.notas || '')}</textarea>
            </div>
            
            <div class="info-card-modal u-mt-16" style="background: rgba(0,122,255,0.1);">
                <small> <strong>Resumen del material:</strong><br>
                • <strong>HS Code:</strong> ${hsCode || 'No definido'} - Se usará en el packing list<br>
                • <strong>Peso unitario:</strong> ${pesoUnitario} kg - Se usará para calcular el peso total<br>
                • <strong>País de origen:</strong> ${material.paisOrigen || 'No definido'} - Para cálculo de aranceles
                </small>
            </div>
            
            <button class="btn btn-primary u-mt-16" onclick="guardarMaterial()" style="width:100%;"> Actualizar Material</button>
        </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
    
    // Inicializar la visibilidad de las opciones de pago
    setTimeout(() => {
        toggleCondicionesPagoMaterial();
    }, 100);
}

        function eliminarMaterial(id) {
            if (confirm(tApp('confirmar_eliminar_material'))) { proyecto.materiales = proyecto.materiales.filter(m => m.id !== id); guardarProyecto(); renderizarMateriales(); mostrarToast(tApp('toast_eliminado'), 'success'); }
        }
        
        function actualizarArancelesMateriales() { if (typeof calcularAnalisisMateriales === 'function') calcularAnalisisMateriales(); mostrarToast(" Aranceles actualizados", 'info'); }
        
        // ============================================
        // IMPORTAR DESDE PDF (ORDEN DE COMPRA)
        // ============================================
        let pdfItemsDetectados = [];
        let pdfProveedorGlobal = '';

        function importarDesdePDF() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf';
            input.style.display = 'none';
            document.body.appendChild(input);
            input.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                input.remove();
                if (!file) return;
                mostrarToast(' Procesando PDF...', 'info');
                try {
                    if (typeof pdfjsLib === 'undefined') {
                        mostrarToast(' PDF.js no está cargado. Recarga la página.', 'error');
                        return;
                    }
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                    let textoCompleto = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        
                        // Agrupar items por posición Y para preservar filas de la tabla
                        const filas = {};
                        for (const item of content.items) {
                            const y = Math.round(item.transform[5]);
                            if (!filas[y]) filas[y] = [];
                            filas[y].push(item);
                        }
                        
                        // Ordenar filas de arriba a abajo (Y descendente en PDF)
                        const sortedYs = Object.keys(filas).map(Number).sort((a, b) => b - a);
                        let texto = '';
                        for (const y of sortedYs) {
                            const linea = filas[y]
                                .sort((a, b) => a.transform[4] - b.transform[4])
                                .map(item => item.str)
                                .join(' ');
                            texto += linea + '\n';
                        }
                        textoCompleto += texto;
                    }
                    
                    pdfProveedorGlobal = extraerProveedor(textoCompleto);
                    pdfItemsDetectados = parsearItemsPDF(textoCompleto);
                    
                    if (pdfItemsDetectados.length === 0) {
                        mostrarToast(' No se detectaron items. Revisa el formato del PDF.', 'error');
                        mostrarTextoCrudo(textoCompleto);
                        return;
                    }
                    mostrarPreviewPDF(pdfItemsDetectados);
                } catch (err) {
                    console.error('PDF error:', err);
                    mostrarToast(' Error al leer el PDF: ' + err.message, 'error');
                }
            });
            input.click();
        }

        function extraerProveedor(texto) {
            const patronesProveedor = [
                /proveedor\s*[:;]\s*(.+)/i,
                /supplier\s*[:;]\s*(.+)/i,
                /vendor\s*[:;]\s*(.+)/i,
                /empresa\s*[:;]\s*(.+)/i,
                /company\s*[:;]\s*(.+)/i,
                /proveïdor\s*[:;]\s*(.+)/i,
                /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:Corporation|Corp\.?|Inc\.?|Incorporated|Ltd\.?|Limited|GmbH|SA|SL|S\.L\.|S\.A\.)\b/i,
            ];
            for (const p of patronesProveedor) {
                const match = texto.match(p);
                if (match) return match[1].trim().split('\n')[0].trim();
            }
            // Fallback: buscar una línea que parezca nombre de empresa al final del documento
            const lineas = texto.split('\n').map(l => l.trim()).filter(Boolean);
            for (let i = lineas.length - 1; i >= 0; i--) {
                const l = lineas[i];
                if (/^[A-Z][a-z]/.test(l) && l.length > 5 && l.length < 60 && !/^(item|total|time|term|last|note|remarks?|hiroshi|deputy|general|electric)/i.test(l)) {
                    return l;
                }
            }
            return '';
        }

        function parsearItemsPDF(texto) {
            const items = [];
            
            const hsGlobalMatch = texto.match(/(?:HS|HS Code|HSCODE|Código|Codigo|Part Number|PN|TARIC)\s*[:;]\s*([\d]{4,}\.?[\d]{0,}\.?[\d]{0,})/i);
            const hsCodeGlobal = hsGlobalMatch ? hsGlobalMatch[1] : '';
            
            function limpiarNumero(str) {
                if (!str) return NaN;
                let s = str.trim().replace(/^[$]/g, '');
                if (s.includes(',') && !s.includes('.')) {
                    s = s.replace(',', '.');
                } else {
                    s = s.replace(/,/g, '');
                }
                return parseFloat(s);
            }
            
            function agregarItem(nombre, cantidad, precioUnitario) {
                if (!nombre || cantidad <= 0 || precioUnitario <= 0 || nombre.length >= 150) return;
                const headerWords = ['item', 'description', "q'ty", 'unit price', 'amount', 'price in', 'yen', 'total',
                    'system pricing', 'warranty', 'technical support', 'terms', 'conditions', 'proprietary',
                    'non export', 'page', 'shipping', 'spares quotation', 'extended warranty', 'config manual',
                    'fat document', 'installation manual', 'maintenance manual', 'technical manual',
                    'sub-total', 'subtotal'];
                const lower = nombre.toLowerCase();
                if (headerWords.some(w => lower.includes(w))) return;
                if (lower.startsWith('item') || /^\d+\.\d/.test(nombre.trim())) return;
                const limpio = nombre.replace(/\s+/g, ' ').trim();
                const existe = items.find(i => i.nombre.toLowerCase() === limpio.toLowerCase());
                if (existe) return;
                items.push({
                    nombre: limpio,
                    cantidad,
                    precioUnitario,
                    hsCode: hsCodeGlobal,
                    proveedor: pdfProveedorGlobal,
                    seleccionado: true
                });
            }
            
            // Dividir el texto en partes por el límite PRECIO + Nº SIGUIENTE ITEM
            const separador = /(\$?[\d,]+\.\d{2})\s+(?=\d+\s+\S)/g;
            const partes = [];
            let ultimoIndex = 0;
            let sep;
            while ((sep = separador.exec(texto)) !== null) {
                partes.push(texto.substring(ultimoIndex, sep.index + sep[1].length));
                ultimoIndex = sep.index + sep[0].length;
            }
            partes.push(texto.substring(ultimoIndex));
            
            // Patrones en orden de especificidad
            const patronesConUnidad = [
                // 1. Toshiba: ITEM# + DESCRIPCION + CANT + UNIT + PRECIO1 + PRECIO2
                /(\d+)\s+([A-Za-z][A-Za-z\s,.\/-]*?)\s+(\d+[.,]?\d*)\s+(set|unit|pcs|each|ud|unidad|pza|pieza|kg|m|lt|l|un)\s+\$?([\d,]+\.\d+)\s+\$?([\d,]+\.\d+)\s*$/i,
                /(\d+)\s+([A-Za-z][A-Za-z\s,.\/-]*?)\s+(\d+[.,]?\d*)\s+(set|unit|pcs|each|ud|unidad|pza|pieza|kg|m|lt|l|un)\s+\$?([\d,]+\.\d+)\s+\$?([\d,]+\.\d+)/i,
            ];
            const patronesSinUnidad = [
                // 2. ITEM# + DESCRIPCION + PRECIO1 + PRECIO2 (ambos con decimales)
                /(\d+)\s+([A-Za-z][A-Za-z\s,.\/-]*?)\s+\$?([\d,]+\.\d+)\s+\$?([\d,]+\.\d+)\s+\$?([\d,]+\.\d+)\s*$/i,
                /(\d+)\s+([A-Za-z][A-Za-z\s,.\/-]*?)\s+\$?([\d,]+\.\d+)\s+\$?([\d,]+\.\d+)\s+\$?([\d,]+\.\d+)/i,
                // 3. Spares: ITEM# + PART# (alfanumérico con +, x, .) + PRECIO1 + PRECIO2
                /(\d+)\s+([A-Za-z0-9][A-Za-z0-9\s\-+x.,\/#]*?)\s+\$?([\d,]+\.\d+)\s+\$?([\d,]+\.\d+)/i,
            ];
            
            for (const parte of partes) {
                let match = null;
                for (const p of patronesConUnidad) {
                    match = parte.match(p);
                    if (match) break;
                }
                    if (match) {
                        const idxGlobal = texto.indexOf(parte) + match.index;
                        if (idxGlobal > 0 && /[\d]/.test(texto[idxGlobal - 1])) continue;
                        const desc = match[2].trim();
                        if (/^\d/.test(desc)) continue;
                        agregarItem(match[2], limpiarNumero(match[3]), limpiarNumero(match[5]));
                    } else {
                        for (const p of patronesSinUnidad) {
                            match = parte.match(p);
                            if (match) break;
                        }
                        if (match) {
                            const idxGlobal = texto.indexOf(parte) + match.index;
                            if (idxGlobal > 0 && /[\d]/.test(texto[idxGlobal - 1])) continue;
                            const desc = match[2].trim();
                            if (/^\d/.test(desc)) continue;
                            // Sin unidad: el primer precio después de la descripción es el unitario
                            agregarItem(match[2], 1, limpiarNumero(match[3]));
                        }
                    }
            }
            
            return items;
        }

        function mostrarPreviewPDF(items) {
            const monedaPorDefecto = proyecto.monedaBase || 'EUR';
            let html = `
                <div class="modal-content" style="max-width: 900px; max-height: 85vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h3> Items detectados en la Orden de Compra</h3>
                        <span class="close-modal" onclick="cerrarPDFPreview()">&times;</span>
                    </div>
                    <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
                        Se encontraron <strong>${items.length}</strong> items. El primero rellenará el formulario, los demás se añadirán directamente.
                        ${pdfProveedorGlobal ? `Proveedor detectado: <strong>${escapeHtml(pdfProveedorGlobal)}</strong>` : ''}
                    </p>
                    <table class="data-table" style="width:100%;margin-bottom:16px;">
                        <thead>
                            <tr>
                                <th style="width:32px;"><input type="checkbox" id="pdfSelTodos" checked onchange="toggleTodosPDF()"></td>
                                <th>Descripción</th>
                                <th style="width:70px;">Cantidad</td>
                                <th style="width:90px;">Precio Ud.</td>
                                <th style="width:90px;">Moneda</td>
                                <th style="width:110px;">HS Code</td>
                                <th style="width:130px;">Proveedor</td>
                            </tr>
                        </thead>
                        <tbody id="pdfItemsTableBody">
            `;
            items.forEach((item, i) => {
                html += `
                    <tr>
                        <td><input type="checkbox" class="pdf-item-cb" data-index="${i}" checked onchange="actualizarSeleccionPDF(${i})"></td>
                        <td><input type="text" class="pdf-item-nombre" data-index="${i}" value="${escapeHtml(item.nombre)}" style="width:100%;padding:4px 8px;border-radius:6px;border:1px solid var(--border-color);background:var(--input-bg);color:var(--text-primary);font-size:12px;"></td>
                        <td><input type="number" class="pdf-item-cant" data-index="${i}" value="${item.cantidad}" step="0.01" min="0.01" style="width:60px;padding:4px 8px;border-radius:6px;border:1px solid var(--border-color);background:var(--input-bg);color:var(--text-primary);font-size:12px;"></td>
                        <td><input type="number" class="pdf-item-precio" data-index="${i}" value="${item.precioUnitario}" step="0.01" min="0" style="width:80px;padding:4px 8px;border-radius:6px;border:1px solid var(--border-color);background:var(--input-bg);color:var(--text-primary);font-size:12px;"></td>
                        <td>
                            <select class="pdf-item-moneda" data-index="${i}" style="padding:4px 8px;border-radius:6px;border:1px solid var(--border-color);background:var(--input-bg);color:var(--text-primary);font-size:12px;">
                                ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${m === monedaPorDefecto ? 'selected' : ''}>${m}</option>`).join('')}
                            </select>
                        </td>
                        <td><input type="text" class="pdf-item-hs" data-index="${i}" value="${escapeHtml(item.hsCode || '')}" placeholder="8471.30.00" style="width:100px;padding:4px 8px;border-radius:6px;border:1px solid var(--border-color);background:var(--input-bg);color:var(--text-primary);font-size:12px;"></td>
                        <td><input type="text" class="pdf-item-prov" data-index="${i}" value="${escapeHtml(item.proveedor || pdfProveedorGlobal || '')}" placeholder="Proveedor" style="width:120px;padding:4px 8px;border-radius:6px;border:1px solid var(--border-color);background:var(--input-bg);color:var(--text-primary);font-size:12px;"></td>
                    </tr>
                `;
            });
            html += `
                        </tbody>
                    </table>
                    <div style="display:flex;gap:8px;justify-content:flex-end;">
                        <button class="btn btn-secondary" onclick="cerrarPDFPreview()">Cancelar</button>
                        <button class="btn btn-primary" onclick="confirmarImportacionPDF()"> Importar ${items.length} items</button>
                    </div>
                </div>
            `;
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = 'modalPDFPreview';
            modal.style.cssText = 'display:flex;z-index:1100;';
            modal.innerHTML = html;
            modal.onclick = (e) => { if (e.target === modal) cerrarPDFPreview(); };
            document.body.appendChild(modal);
        }

        function cerrarPDFPreview() {
            const modal = document.getElementById('modalPDFPreview');
            if (modal) modal.remove();
        }

        function toggleTodosPDF() {
            const checked = document.getElementById('pdfSelTodos').checked;
            document.querySelectorAll('.pdf-item-cb').forEach(cb => cb.checked = checked);
        }

        function actualizarSeleccionPDF(index) {}

        function mostrarTextoCrudo(texto) {
            const lineas = texto.split('\n').filter(l => l.trim());
            let html = `
                <div class="modal-content" style="max-width:700px;max-height:80vh;overflow-y:auto;">
                    <div class="modal-header">
                        <h3> Texto extraído del PDF</h3>
                        <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
                    </div>
                    <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">
                        No se pudieron detectar items automáticamente. Copia los datos manualmente:
                    </p>
                    <pre style="background:var(--bg-secondary);padding:16px;border-radius:8px;font-size:12px;line-height:1.6;white-space:pre-wrap;word-break:break-word;max-height:50vh;overflow-y:auto;color:var(--text-primary);">${escapeHtml(lineas.join('\n'))}</pre>
                    <div style="margin-top:16px;display:flex;gap:8px;justify-content:flex-end;">
                        <button class="btn btn-secondary" onclick="cerrarModalGeneric()">Cerrar</button>
                    </div>
                </div>
            `;
            const modal = document.createElement('div');
            modal.className = 'modal u-flex';
            modal.id = 'genericModal';
            modal.innerHTML = html;
            modal.onclick = (e) => { if (e.target === modal) cerrarModalGeneric(); };
            document.getElementById('modalContainer').innerHTML = '';
            document.getElementById('modalContainer').appendChild(modal);
        }

        function confirmarImportacionPDF() {
            const seleccionados = [];
            document.querySelectorAll('.pdf-item-cb:checked').forEach(cb => {
                const i = parseInt(cb.dataset.index);
                const nombre = document.querySelector(`.pdf-item-nombre[data-index="${i}"]`).value.trim();
                const cantidad = parseFloat(document.querySelector(`.pdf-item-cant[data-index="${i}"]`).value) || 1;
                const precioUnitario = parseFloat(document.querySelector(`.pdf-item-precio[data-index="${i}"]`).value) || 0;
                const moneda = document.querySelector(`.pdf-item-moneda[data-index="${i}"]`).value;
                const hsCode = document.querySelector(`.pdf-item-hs[data-index="${i}"]`).value.trim();
                const proveedor = document.querySelector(`.pdf-item-prov[data-index="${i}"]`).value.trim();
                
                if (nombre && precioUnitario > 0) {
                    seleccionados.push({ nombre, cantidad, precioUnitario, moneda, hsCode, proveedor });
                }
            });
            
            if (seleccionados.length === 0) {
                mostrarToast(' Selecciona al menos un item válido', 'error');
                return;
            }
            
            // Rellenar formulario con el primer item
            document.getElementById('matNombre').value = seleccionados[0].nombre;
            document.getElementById('matCantidad').value = seleccionados[0].cantidad;
            document.getElementById('matCosteUnitario').value = seleccionados[0].precioUnitario;
            document.getElementById('matMoneda').value = seleccionados[0].moneda;
            document.getElementById('matProveedor').value = seleccionados[0].proveedor;
            if (seleccionados[0].hsCode) {
                const hsInput = document.getElementById('matHsCode');
                if (hsInput) hsInput.value = seleccionados[0].hsCode;
            }
            
            // Crear los demás items directamente
            for (let i = 1; i < seleccionados.length; i++) {
                const item = seleccionados[i];
                const nuevoMaterial = {
                    id: Date.now() + i,
                    nombre: item.nombre,
                    cantidad: item.cantidad,
                    costeUnitario: item.precioUnitario,
                    moneda: item.moneda,
                    proveedor: item.proveedor,
                    partNumber: '',
                    paisOrigen: '',
                    hsCode: item.hsCode || '',
                    pesoUnitario: 1,
                    plazoSuministro: 0,
                    referenciaPlazo: 'compra',
                    fechaRecepcionEstimada: null,
                    mesRecepcion: null,
                    incoterm: '',
                    costeEnvio: 0,
                    monedaEnvio: proyecto.monedaBase || 'EUR',
                    seguroPorcentaje: 0,
                    seguroFijo: 0,
                    gastosAduana: 0,
                    monedaAduana: proyecto.monedaBase || 'EUR',
                    arancelPersonalizado: 0,
                    condicionesPago: { tipo: 'contado', tramos: [], plazoDias: 0, plazoReferencia: 'compra', porcentajeInicial: 0, plazoResto: 0, contraRecepcion: false },
                    pagosRealizados: [],
                    mes: (proyecto.metodologia?.tipo === 'agile' || proyecto.metodologia?.tipo === 'mixto') ? null : 1,
                    sprint: (proyecto.metodologia?.tipo === 'agile' || proyecto.metodologia?.tipo === 'mixto') ? 1 : null,
                    historiaAsociada: null,
                    tipoGestion: (proyecto.metodologia?.tipo === 'agile' || proyecto.metodologia?.tipo === 'mixto') ? 'agile' : 'cascada',
                    notas: 'Importado de orden de compra'
                };
                if (!proyecto.materiales) proyecto.materiales = [];
                proyecto.materiales.push(nuevoMaterial);
            }
            
            cerrarPDFPreview();
            mostrarToast(` Importados ${seleccionados.length} items desde PDF`, 'success');
            
            if (seleccionados.length > 1) {
                guardarProyecto();
                renderizarMateriales();
            }
        }
        
        // Exponer al ámbito global
        window.importarDesdePDF = importarDesdePDF;
