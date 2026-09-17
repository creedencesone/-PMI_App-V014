        
        function abrirModalGarantia() {
            const g = proyecto.garantia || {};
            
            document.getElementById('garantiaEquipo').value = g.equipo || '';
            document.getElementById('garantiaDuracionAnios').value = g.duracionAnios || 1;
            document.getElementById('garantiaFechaInicio').value = g.fechaInicio || '';
            document.getElementById('garantiaCobertura').value = g.cobertura || '';
            document.getElementById('garantiaExclusiones').value = g.exclusiones || '';
            document.getElementById('garantiaAfectaHitoFinal').checked = g.afectaHitoFinal || false;
            
            // Cargar hitos en el select
            const hitoSelect = document.getElementById('garantiaHitoFinalId');
            if (hitoSelect) {
                hitoSelect.innerHTML = '<option value="">-- Seleccionar hito --</option>';
                (proyecto.hitosFinancieros || []).forEach(h => {
                    hitoSelect.innerHTML += `<option value="${h.id}" ${g.hitoFinalId === h.id ? 'selected' : ''}>${escapeHtml(h.nombre)} (Mes ${h.mes})</option>`;
                });
            }
            
            // Mostrar/ocultar select según checkbox
            document.getElementById('garantiaHitoFinalSelect').style.display = g.afectaHitoFinal ? 'block' : 'none';
            
            document.getElementById('modalGarantia').style.display = 'flex';
        }
        
        function guardarGarantia() {
            let equipo = document.getElementById('garantiaEquipo').value.trim();
            if (!equipo) {
                mostrarToast(" El equipo/producto en garantía es obligatorio", 'error');
                return;
            }
            
            let afectaHitoFinal = document.getElementById('garantiaAfectaHitoFinal').checked;
            let hitoFinalId = afectaHitoFinal ? parseInt(document.getElementById('garantiaHitoFinalId').value) : null;
            
            if (afectaHitoFinal && !hitoFinalId) {
                mostrarToast(" Debes seleccionar el hito final que se pagará al término de la garantía", 'error');
                return;
            }
            
            let garantia = {
                equipo: equipo,
                duracionAnios: parseInt(document.getElementById('garantiaDuracionAnios').value) || 1,
                fechaInicio: document.getElementById('garantiaFechaInicio').value,
                cobertura: document.getElementById('garantiaCobertura').value,
                exclusiones: document.getElementById('garantiaExclusiones').value,
                afectaHitoFinal: afectaHitoFinal,
                hitoFinalId: hitoFinalId
            };
            
            proyecto.garantia = garantia;
            guardarProyecto();
            
            // Si afecta al hito final, actualizar el Cashflow
            if (afectaHitoFinal && hitoFinalId) {
                actualizarHitoPorGarantia(hitoFinalId, garantia);
            }
            
            renderizarGarantia();
            calcularCashflow();
            cerrarModalGarantia();
            mostrarToast(` Garantía de "${equipo}" configurada correctamente`, 'success');
        }
        
        function actualizarHitoPorGarantia(hitoId, garantia) {
            // Calcular fecha de fin de garantía
            let fechaFinGarantia = null;
            if (garantia.fechaInicio && garantia.duracionAnios) {
                let fecha = new Date(garantia.fechaInicio);
                fecha.setFullYear(fecha.getFullYear() + garantia.duracionAnios);
                fechaFinGarantia = fecha;
            }
            
            // Buscar el hito
            const hito = (proyecto.hitosFinancieros || []).find(h => h.id === hitoId);
            if (hito && fechaFinGarantia) {
                // Guardar el mes original si no existe
                if (!hito.mesOriginal) {
                    hito.mesOriginal = hito.mes;
                }
                // El mes ahora es el mes de fin de garantía (aproximado)
                // Calculamos cuántos meses desde el inicio del proyecto
                if (proyecto.fechaInicio) {
                    const inicioProyecto = new Date(proyecto.fechaInicio);
                    const diffMeses = (fechaFinGarantia.getFullYear() - inicioProyecto.getFullYear()) * 12 + (fechaFinGarantia.getMonth() - inicioProyecto.getMonth());
                    hito.mes = Math.max(1, diffMeses + 1);
                }
                mostrarToast(` El hito "${hito.nombre}" se ha movido al mes ${hito.mes} (fin de garantía)`, 'warning');
            }
        }
        
        function cerrarModalGarantia() {
            document.getElementById('modalGarantia').style.display = 'none';
        }
        
        function exportarGarantia() {
            if (!proyecto.garantia || !proyecto.garantia.equipo) {
                mostrarToast("No hay garantía configurada para exportar", 'warning');
                return;
            }
            
            const g = proyecto.garantia;
            let fechaFin = '';
            if (g.fechaInicio && g.duracionAnios) {
                let fecha = new Date(g.fechaInicio);
                fecha.setFullYear(fecha.getFullYear() + g.duracionAnios);
                fechaFin = fecha.toISOString().split('T')[0];
            }
            
            let csv = "Campo,Valor\n";
            csv += `Equipo,"${g.equipo}"\n`;
            csv += `Duración,${g.duracionAnios} años\n`;
            csv += `Fecha Inicio,${g.fechaInicio || '-'}\n`;
            csv += `Fecha Fin,${fechaFin || '-'}\n`;
            csv += `Cobertura,"${g.cobertura || '-'}"\n`;
            csv += `Exclusiones,"${g.exclusiones || '-'}"\n`;
            csv += `Afecta Hito Final,${g.afectaHitoFinal ? 'Sí' : 'No'}\n`;
            
            if (g.afectaHitoFinal && g.hitoFinalId) {
                const hito = (proyecto.hitosFinancieros || []).find(h => h.id === g.hitoFinalId);
                csv += `Hito Final,"${hito ? hito.nombre : 'No encontrado'}"\n`;
            }
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', `garantia_${proyecto.nombre}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            mostrarToast(" Garantía exportada a CSV", 'success');
        }
        
        // Agregar evento para mostrar/ocultar el select de hitos
        document.addEventListener('change', function(e) {
            if (e.target.id === 'garantiaAfectaHitoFinal') {
                const selectDiv = document.getElementById('garantiaHitoFinalSelect');
                if (selectDiv) {
                    selectDiv.style.display = e.target.checked ? 'block' : 'none';
                }
            }
        });    
                // ============================================
        // MÓDULO DE VIAJES
        // ============================================
        
        // Archivos pendientes (aún no leídos a base64)
        let _viajePendingFiles = [];
        let _viajeExistingRemove = [];
        
        function viajeRenderFilesList() {
            const container = document.getElementById('viajeFilesList');
            if (!container) return;
            const items = [];
            _viajePendingFiles.forEach((f, i) => {
                items.push(`<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:rgba(0,122,255,0.08);border-radius:6px;font-size:12px">
                    <span> ${escapeHtml(f.name)}</span>
                    <span class="delete-btn" onclick="viajeEliminarArchivo(${i})" style="cursor:pointer;padding:2px 6px"></span>
                </div>`);
            });
            container.innerHTML = items.join('');
        }
        
        function viajeAgregarArchivos(event) {
            const files = event.target.files;
            if (!files) return;
            for (const file of files) {
                if (file.size > 5 * 1024 * 1024) {
                    mostrarToast(` "${file.name}" supera 5MB`, 'error');
                    continue;
                }
                _viajePendingFiles.push({ file, name: file.name, type: file.type });
            }
            viajeRenderFilesList();
            event.target.value = '';
        }
        
        function viajeEliminarArchivo(index) {
            _viajePendingFiles.splice(index, 1);
            viajeRenderFilesList();
        }
        
        function viajeEliminarArchivoExistente(index) {
            if (!_viajeExistingRemove) _viajeExistingRemove = [];
            _viajeExistingRemove.push(index);
            const container = document.getElementById('viajeFilesList');
            const el = container?.querySelector(`[data-idx="${index}"]`);
            if (el) el.style.display = 'none';
        }
        
        function viajeLeerArchivosPendientes(callback) {
            if (_viajePendingFiles.length === 0) { callback([]); return; }
            let results = [];
            let pendientes = _viajePendingFiles.length;
            _viajePendingFiles.forEach((pf, i) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    results[i] = { name: pf.name, type: pf.type, data: e.target.result };
                    pendientes--;
                    if (pendientes === 0) callback(results);
                };
                reader.onerror = () => {
                    results[i] = null;
                    pendientes--;
                    if (pendientes === 0) callback(results.filter(Boolean));
                };
                reader.readAsDataURL(pf.file);
            });
        }
        
        function renderizarViajes() {
            if (!proyecto.viajes) proyecto.viajes = [];
            
            let totalVuelos = 0, totalHoteles = 0, totalComidas = 0, totalTraslados = 0, totalGeneral = 0;
            
            proyecto.viajes.forEach(v => {
                let vuelosConv = convertirMoneda(v.costeVuelos || 0, v.moneda);
                let hotelConv = convertirMoneda(v.costeHotel || 0, v.moneda);
                let comidasConv = convertirMoneda(v.costeComidas || 0, v.moneda);
                let trasladosConv = convertirMoneda(v.costeTraslados || 0, v.moneda);
                
                totalVuelos += vuelosConv;
                totalHoteles += hotelConv;
                totalComidas += comidasConv;
                totalTraslados += trasladosConv;
                totalGeneral += vuelosConv + hotelConv + comidasConv + trasladosConv;
            });
            
            document.getElementById('totalVuelos').innerHTML = formatearMoneda(totalVuelos);
            document.getElementById('totalHoteles').innerHTML = formatearMoneda(totalHoteles);
            document.getElementById('totalComidas').innerHTML = formatearMoneda(totalComidas);
            document.getElementById('totalTraslados').innerHTML = formatearMoneda(totalTraslados);
            document.getElementById('totalViajes').innerHTML = formatearMoneda(totalGeneral);
            
            const container = document.getElementById('listaViajes');
            if (!container) return;
            
            if (proyecto.viajes.length === 0) {
                container.innerHTML = '<div class="info-card u-text-center">No hay viajes registrados. Haz clic en " Nuevo Viaje" para comenzar.</div>';
                return;
            }
            
            container.innerHTML = proyecto.viajes.map(v => {
                let documentos = [];
                if (v.docPasaporte) documentos.push(' Pasaporte');
                if (v.docVisa) documentos.push(' Visa');
                if (v.docVacunas) documentos.push(' Vacunas');
                if (v.docSeguro) documentos.push(' Seguro');
                if (v.docCarnet) documentos.push(' Carnet');
                if (v.docCartas) documentos.push(' Cartas invitación');
                if (v.docOtrosTexto) documentos.push(` ${v.docOtrosTexto}`);
                
                let totalViaje = convertirMoneda((v.costeVuelos || 0) + (v.costeHotel || 0) + (v.costeComidas || 0) + (v.costeTraslados || 0), v.moneda);
                
                return `
                    <div class="info-card u-mb-16">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <h4> ${escapeHtml(v.nombre)} ${v.rol ? `(${escapeHtml(v.rol)})` : ''}</h4>
                                <div class="details u-mt-8">
                                    <div> ${escapeHtml(v.origen || '-')} → ${escapeHtml(v.destino || '-')}</div>
                                    <div> ${v.fechaSalida ? formatearFechaEspa(v.fechaSalida) : '-'} → ${v.fechaRegreso ? formatearFechaEspa(v.fechaRegreso) : '-'}</div>
                                    <div> ${escapeHtml(v.motivo || '-')}</div>
                                </div>
                            </div>
                            <div>
                                <span class="edit-btn" onclick="editarViaje(${v.id})"></span>
                                <span class="delete-btn" onclick="eliminarViaje(${v.id})"></span>
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 12px 0;">
                            <div style="background: rgba(0,122,255,0.1); padding: 8px; border-radius: 8px; text-align: center;">
                                <div class="u-fs-11"> Vuelos</div>
                                <div class="u-bold">${formatearMoneda(convertirMoneda(v.costeVuelos || 0, v.moneda))}</div>
                            </div>
                            <div style="background: rgba(52,199,89,0.1); padding: 8px; border-radius: 8px; text-align: center;">
                                <div class="u-fs-11"> Hotel</div>
                                <div class="u-bold">${formatearMoneda(convertirMoneda(v.costeHotel || 0, v.moneda))}</div>
                            </div>
                            <div style="background: rgba(255,140,0,0.1); padding: 8px; border-radius: 8px; text-align: center;">
                                <div class="u-fs-11"> Comidas</div>
                                <div class="u-bold">${formatearMoneda(convertirMoneda(v.costeComidas || 0, v.moneda))}</div>
                            </div>
                            <div style="background: rgba(255,59,48,0.1); padding: 8px; border-radius: 8px; text-align: center;">
                                <div class="u-fs-11"> Traslados</div>
                                <div class="u-bold">${formatearMoneda(convertirMoneda(v.costeTraslados || 0, v.moneda))}</div>
                            </div>
                        </div>
                        
                        ${documentos.length > 0 ? `
                        <div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 8px; margin-top: 8px;">
                            <strong> Documentación:</strong><br>
                            ${documentos.map(d => `<span style="display: inline-block; background: rgba(0,122,255,0.2); padding: 2px 8px; border-radius: 12px; margin: 2px; font-size: 11px;">${d}</span>`).join('')}
                        </div>
                        ` : '<div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 8px; margin-top: 8px; font-size: 11px;"> Sin documentación registrada</div>'}
                        
                        ${v.archivos && v.archivos.length > 0 ? `
                        <div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 8px; margin-top: 8px;">
                            <strong> Archivos adjuntos:</strong><br>
                            ${v.archivos.map(a => {
                                const icono = a.type?.startsWith('image/') ? '' : '';
                                return `<a href="${a.data}" target="_blank" download="${a.name}" style="display:inline-flex;align-items:center;gap:4px;background:rgba(0,200,83,0.15);padding:3px 10px;border-radius:12px;margin:2px;font-size:11px;color:var(--accent);text-decoration:none">${icono} ${escapeHtml(a.name)}</a>`;
                            }).join('')}
                        </div>
                        ` : ''}
                        
                        <div class="u-mt-8 u-fs-11 u-color-muted">
                             Moneda: ${v.moneda} |  Mes: ${v.mes || 1} |  Total: ${formatearMoneda(totalViaje)}
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        function abrirModalViaje() {
            document.getElementById('modalViajeTitulo').innerHTML = ' Nuevo Viaje';
            document.getElementById('viajeId').value = '';
            document.getElementById('viajeNombre').value = '';
            document.getElementById('viajeRol').value = '';
            document.getElementById('viajeOrigen').value = '';
            document.getElementById('viajeDestino').value = '';
            document.getElementById('viajeFechaSalida').value = '';
            document.getElementById('viajeFechaRegreso').value = '';
            document.getElementById('viajeMotivo').value = '';
            document.getElementById('viajeCosteVuelos').value = '0';
            document.getElementById('viajeCosteHotel').value = '0';
            document.getElementById('viajeCosteComidas').value = '0';
            document.getElementById('viajeCosteTraslados').value = '0';
            document.getElementById('viajeMoneda').value = proyecto.monedaBase || 'EUR';
            document.getElementById('viajeMes').value = '1';
            
            document.getElementById('viajeDocPasaporte').checked = false;
            document.getElementById('viajeDocVisa').checked = false;
            document.getElementById('viajeDocVacunas').checked = false;
            document.getElementById('viajeDocSeguro').checked = false;
            document.getElementById('viajeDocCarnet').checked = false;
            document.getElementById('viajeDocCartas').checked = false;
            document.getElementById('viajeDocOtros').checked = false;
            document.getElementById('viajeDocOtrosTexto').value = '';
            
            _viajePendingFiles = [];
            _viajeExistingRemove = [];
            viajeRenderFilesList();
            
            document.getElementById('modalViaje').style.display = 'flex';
        }
        
        function editarViaje(id) {
            let v = proyecto.viajes.find(v => v.id === id);
            if (!v) return;
            
            document.getElementById('modalViajeTitulo').innerHTML = ' Editar Viaje';
            document.getElementById('viajeId').value = v.id;
            document.getElementById('viajeNombre').value = v.nombre || '';
            document.getElementById('viajeRol').value = v.rol || '';
            document.getElementById('viajeOrigen').value = v.origen || '';
            document.getElementById('viajeDestino').value = v.destino || '';
            document.getElementById('viajeFechaSalida').value = v.fechaSalida || '';
            document.getElementById('viajeFechaRegreso').value = v.fechaRegreso || '';
            document.getElementById('viajeMotivo').value = v.motivo || '';
            document.getElementById('viajeCosteVuelos').value = v.costeVuelos || 0;
            document.getElementById('viajeCosteHotel').value = v.costeHotel || 0;
            document.getElementById('viajeCosteComidas').value = v.costeComidas || 0;
            document.getElementById('viajeCosteTraslados').value = v.costeTraslados || 0;
            document.getElementById('viajeMoneda').value = v.moneda || proyecto.monedaBase;
            document.getElementById('viajeMes').value = v.mes || 1;
            
            document.getElementById('viajeDocPasaporte').checked = v.docPasaporte || false;
            document.getElementById('viajeDocVisa').checked = v.docVisa || false;
            document.getElementById('viajeDocVacunas').checked = v.docVacunas || false;
            document.getElementById('viajeDocSeguro').checked = v.docSeguro || false;
            document.getElementById('viajeDocCarnet').checked = v.docCarnet || false;
            document.getElementById('viajeDocCartas').checked = v.docCartas || false;
            document.getElementById('viajeDocOtros').checked = v.docOtros || false;
            document.getElementById('viajeDocOtrosTexto').value = v.docOtrosTexto || '';
            
            _viajePendingFiles = [];
            _viajeExistingRemove = [];
            const container = document.getElementById('viajeFilesList');
            if (container && v.archivos && v.archivos.length > 0) {
                container.innerHTML = v.archivos.map((a, i) => {
                    const icono = a.type?.startsWith('image/') ? '' : '';
                    return `<div data-idx="${i}" style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:rgba(0,200,83,0.08);border-radius:6px;font-size:12px">
                        <span>${icono} <a href="${a.data}" target="_blank" download="${a.name}" style="color:var(--accent);text-decoration:underline">${escapeHtml(a.name)}</a></span>
                        <span class="delete-btn" onclick="viajeEliminarArchivoExistente(${i})" style="cursor:pointer;padding:2px 6px"></span>
                    </div>`;
                }).join('');
            } else if (container) {
                container.innerHTML = '';
            }
            
            document.getElementById('modalViaje').style.display = 'flex';
        }
        
        function guardarViaje() {
            let nombre = document.getElementById('viajeNombre').value.trim();
            if (!nombre) { mostrarToast(" El nombre del viajero es obligatorio", 'error'); return; }
            
            let id = document.getElementById('viajeId').value;
            
            function doSave(archivos) {
                let archivosExistentes = [];
                if (id) {
                    let existing = proyecto.viajes.find(v => v.id === parseInt(id));
                    if (existing && existing.archivos) {
                        archivosExistentes = existing.archivos.filter((_, i) => !(_viajeExistingRemove || []).includes(i));
                    }
                }
                let todosArchivos = [...archivosExistentes, ...(archivos || [])];
                
                let viaje = {
                    id: id ? parseInt(id) : Date.now(),
                    nombre: nombre,
                    rol: document.getElementById('viajeRol').value,
                    origen: document.getElementById('viajeOrigen').value,
                    destino: document.getElementById('viajeDestino').value,
                    fechaSalida: document.getElementById('viajeFechaSalida').value,
                    fechaRegreso: document.getElementById('viajeFechaRegreso').value,
                    motivo: document.getElementById('viajeMotivo').value,
                    costeVuelos: parseFloat(document.getElementById('viajeCosteVuelos').value) || 0,
                    costeHotel: parseFloat(document.getElementById('viajeCosteHotel').value) || 0,
                    costeComidas: parseFloat(document.getElementById('viajeCosteComidas').value) || 0,
                    costeTraslados: parseFloat(document.getElementById('viajeCosteTraslados').value) || 0,
                    moneda: document.getElementById('viajeMoneda').value,
                    mes: parseInt(document.getElementById('viajeMes').value) || 1,
                    docPasaporte: document.getElementById('viajeDocPasaporte').checked,
                    docVisa: document.getElementById('viajeDocVisa').checked,
                    docVacunas: document.getElementById('viajeDocVacunas').checked,
                    docSeguro: document.getElementById('viajeDocSeguro').checked,
                    docCarnet: document.getElementById('viajeDocCarnet').checked,
                    docCartas: document.getElementById('viajeDocCartas').checked,
                    docOtros: document.getElementById('viajeDocOtros').checked,
                    docOtrosTexto: document.getElementById('viajeDocOtrosTexto').value,
                    archivos: todosArchivos
                };
                
                if (!proyecto.viajes) proyecto.viajes = [];
                
                if (id) {
                    let idx = proyecto.viajes.findIndex(v => v.id === parseInt(id));
                    if (idx >= 0) proyecto.viajes[idx] = viaje;
                } else {
                    proyecto.viajes.push(viaje);
                }
                
                _viajePendingFiles = [];
                _viajeExistingRemove = [];
                guardarProyecto();
                renderizarViajes();
                calcularCashflow();
                cerrarModalViaje();
                mostrarToast(` Viaje de ${nombre} guardado correctamente`, 'success');
            }
            
            if (_viajePendingFiles.length > 0) {
                viajeLeerArchivosPendientes((archivos) => {
                    doSave(archivos);
                });
            } else {
                doSave([]);
            }
        }
        
        function eliminarViaje(id) {
            if (confirm(tApp('confirmar_eliminar_viaje'))) {
                proyecto.viajes = proyecto.viajes.filter(v => v.id !== id);
                guardarProyecto();
                renderizarViajes();
                calcularCashflow();
                mostrarToast(tApp('toast_eliminado'), 'success');
            }
        }
        
        function cerrarModalViaje() {
            document.getElementById('modalViaje').style.display = 'none';
            _viajePendingFiles = [];
            _viajeExistingRemove = [];
        }
        
        function exportarViajes() {
            if (!proyecto.viajes || proyecto.viajes.length === 0) {
                mostrarToast("No hay viajes para exportar", 'warning');
                return;
            }
            
            let csv = "Nombre,Rol,Origen,Destino,Fecha Salida,Fecha Regreso,Motivo,Vuelos,Hotel,Comidas,Traslados,Moneda,Mes,Documentación\n";
            proyecto.viajes.forEach(v => {
                let docs = [];
                if (v.docPasaporte) docs.push("Pasaporte");
                if (v.docVisa) docs.push("Visa");
                if (v.docVacunas) docs.push("Vacunas");
                if (v.docSeguro) docs.push("Seguro");
                if (v.docCarnet) docs.push("Carnet");
                if (v.docCartas) docs.push("Cartas invitación");
                if (v.docOtrosTexto) docs.push(v.docOtrosTexto);
                
                csv += `"${v.nombre}","${v.rol || ''}","${v.origen || ''}","${v.destino || ''}","${v.fechaSalida || ''}","${v.fechaRegreso || ''}","${v.motivo || ''}",${v.costeVuelos || 0},${v.costeHotel || 0},${v.costeComidas || 0},${v.costeTraslados || 0},"${v.moneda}",${v.mes || 1},"${docs.join(', ')}"\n`;
            });
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', `viajes_${proyecto.nombre}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            mostrarToast(" Viajes exportados a CSV", 'success');
        }   


        
        // ============================================
        // MÓDULO DE AVALES (GARANTÍAS)
        // ============================================
        
        function renderizarAvales() {
    const container = document.getElementById('avalesContent');
    if (!container) return;
    
    if (!proyecto.avales || proyecto.avales.length === 0) {
        container.innerHTML = `
            <div class="info-card u-text-center">
                <p> No hay avales registrados</p>
            </div>
        `;
        return;
    }
    
    let totalCostesAvales = 0;
    proyecto.avales.forEach(a => {
        totalCostesAvales += a.costesCalculados?.total || 0;
    });
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div class="info-card" style="display: inline-block; padding: 8px 16px;">
                <strong> Costes totales de avales:</strong> ${formatearMoneda(totalCostesAvales)}
            </div>
        </div>
        <div class="cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));">
            ${proyecto.avales.map(a => {
                const costes = a.costesCalculados || {};
                return `
                    <div class="info-card" style="border-left-color: ${a.estado === 'Vigente' ? '#00A859' : (a.estado === 'Próximo a vencer' ? '#FF8C00' : '#FF3B30')}">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <h4> ${escapeHtml(a.tipo)}</h4>
                            <div>
                                <span class="edit-btn" onclick="editarAval(${a.id})"></span>
                                <span class="delete-btn" onclick="eliminarAval(${a.id})"></span>
                            </div>
                        </div>
                        <div class="name">${escapeHtml(a.entidad || 'Entidad no especificada')}</div>
                        <div class="details u-mt-8">
                            <div> Importe: ${formatearMoneda(convertirMoneda(a.importe, a.moneda))}</div>
                            <div> Emisión: ${a.fechaEmision || '-'} |  Vence: ${a.fechaVencimiento || '-'}</div>
                            <div> Estado: <span class="${a.estado === 'Vigente' ? 'badge-completado' : (a.estado === 'Próximo a vencer' ? 'badge-progreso' : 'badge-pendiente')}">${a.estado || 'Pendiente'}</span></div>
                            <div> Nº Referencia: ${escapeHtml(a.referencia || '-')}</div>
                        </div>
                        <div style="margin-top: 12px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 8px;">
                            <strong> Costes del aval:</strong><br>
                            • Apertura: ${formatearMoneda(costes.apertura || 0)}<br>
                            • Riesgo (total): ${formatearMoneda(costes.riesgoTotal || 0)}<br>
                            • Notaría: ${formatearMoneda(costes.notaria || 0)}<br>
                            • Otros: ${formatearMoneda(costes.otros || 0)}<br>
                            <strong>TOTAL: ${formatearMoneda(costes.total || 0)}</strong>
                        </div>
                        ${a.notas ? `<div style="margin-top: 8px; font-size: 11px;"> ${escapeHtml(a.notas)}</div>` : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}
// ============================================
// FUNCIÓN RENDERIZAR GARANTÍA
// ============================================

function renderizarGarantia() {
    const container = document.getElementById('garantiaContent');
    if (!container) return;
    
    const g = proyecto.garantia;
    
    // Actualizar tarjetas de resumen
    const estadoSpan = document.getElementById('garantiaEstado');
    const duracionSpan = document.getElementById('garantiaDuracion');
    const inicioSpan = document.getElementById('garantiaInicio');
    const finSpan = document.getElementById('garantiaFin');
    
    if (!g || !g.equipo) {
        if (container) container.innerHTML = '<p class="u-text-center u-color-muted">No hay garantía configurada. Haz clic en "Configurar Garantía" para comenzar.</p>';
        if (estadoSpan) estadoSpan.innerHTML = 'No configurada';
        if (duracionSpan) duracionSpan.innerHTML = '0 años';
        if (inicioSpan) inicioSpan.innerHTML = '-';
        if (finSpan) finSpan.innerHTML = '-';
        return;
    }
    
    // Calcular fecha de fin
    let fechaFin = '';
    if (g.fechaInicio && g.duracionAnios) {
        let fecha = new Date(g.fechaInicio);
        fecha.setFullYear(fecha.getFullYear() + g.duracionAnios);
        fechaFin = fecha.toISOString().split('T')[0];
    }
    
    // Mostrar contenido detallado
    if (container) {
        container.innerHTML = `
            <div class="info-card">
                <h4> ${escapeHtml(g.equipo)}</h4>
                <div class="details u-mt-8">
                    <div> Duración: ${g.duracionAnios} años</div>
                    <div> Inicio: ${g.fechaInicio || '-'}</div>
                    <div> Fin: ${fechaFin || '-'}</div>
                    <div> Cobertura: ${escapeHtml(g.cobertura || '-')}</div>
                    <div> Exclusiones: ${escapeHtml(g.exclusiones || '-')}</div>
                    <div> Afecta hito final: ${g.afectaHitoFinal ? 'Sí' : 'No'}</div>
                </div>
                <button class="btn btn-danger btn-small u-mt-12" onclick="eliminarGarantia()"> Eliminar Garantía</button>
            </div>
        `;
    }
    
    // Actualizar tarjetas superiores
    if (estadoSpan) estadoSpan.innerHTML = g.afectaHitoFinal ? ' Configurada (con hito)' : ' Configurada';
    if (duracionSpan) duracionSpan.innerHTML = `${g.duracionAnios} años`;
    if (inicioSpan) inicioSpan.innerHTML = g.fechaInicio || '-';
    if (finSpan) finSpan.innerHTML = fechaFin || '-';
    
    // Información del hito afectado
    const hitoInfoDiv = document.getElementById('garantiaHitoInfo');
    if (hitoInfoDiv && g.afectaHitoFinal && g.hitoFinalId) {
        const hito = (proyecto.hitosFinancieros || []).find(h => h.id === g.hitoFinalId);
        if (hito) {
            hitoInfoDiv.innerHTML = `
                <p class="u-p-sm">
                     El hito <strong>"${escapeHtml(hito.nombre)}"</strong> se pagará al final del período de garantía (mes ${hito.mes}).
                    ${hito.mesOriginal ? '<br> Originalmente estaba programado para el mes ' + hito.mesOriginal + '.' : ''}
                </p>
            `;
        } else {
            hitoInfoDiv.innerHTML = '<p class="u-p-sm"> El hito seleccionado ya no existe. Reconfigura la garantía.</p>';
        }
    } else if (hitoInfoDiv) {
        hitoInfoDiv.innerHTML = '<p class="u-p-sm">La garantía no afecta a ningún hito de pago.</p>';
    }
}

// ============================================
// FUNCIÓN ELIMINAR GARANTÍA (si no existe)
// ============================================

function eliminarGarantia() {
    if (confirm(tApp('confirmar_eliminar_garantia'))) {
        // Restaurar hitos a sus meses originales
        if (proyecto.garantia && proyecto.garantia.hitoFinalId) {
            const hito = (proyecto.hitosFinancieros || []).find(h => h.id === proyecto.garantia.hitoFinalId);
            if (hito && hito.mesOriginal) {
                hito.mes = hito.mesOriginal;
                delete hito.mesOriginal;
                mostrarToast(` El hito "${hito.nombre}" ha vuelto a su mes original (${hito.mes})`, 'info');
            }
        }
        proyecto.garantia = null;
        guardarProyecto();
        renderizarGarantia();
        calcularCashflow();
        mostrarToast(tApp('toast_eliminado'), 'success');
    }
}
        
        function abrirModalAval() {
    const hoy = new Date().toISOString().split('T')[0];
    const modalHtml = `
        <div class="modal-content modal-600">
            <div class="modal-header">
                <h3> Nuevo Aval / Garantía</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="avalId">
            
            <div class="form-group">
                <label>Tipo de aval *</label>
                <select id="avalTipo">
                    <option value="Aval bancario">Aval bancario</option>
                    <option value="Carta de crédito standby">Carta de crédito standby</option>
                    <option value="Garantía de cumplimiento">Garantía de cumplimiento</option>
                    <option value="Garantía de anticipo">Garantía de anticipo</option>
                    <option value="Garantía de retención">Garantía de retención</option>
                    <option value="Seguro de crédito">Seguro de crédito</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Entidad emisora</label>
                <input type="text" id="avalEntidad" placeholder="Ej: Banco Santander">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Importe avalado</label>
                    <input type="number" id="avalImporte" value="100000">
                </div>
                <div class="form-group">
                    <label>Moneda</label>
                    <select id="avalMoneda">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}">${m} - ${MONEDAS[m]}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Fecha de emisión</label>
                    <input type="date" id="avalFechaEmision" value="${hoy}">
                </div>
                <div class="form-group">
                    <label> Fecha de vencimiento</label>
                    <input type="date" id="avalFechaVencimiento">
                </div>
            </div>
            
            <div class="form-group">
                <label>Nº de referencia / póliza</label>
                <input type="text" id="avalReferencia" placeholder="Ej: AV-2024-001">
            </div>
            
            <div class="form-group">
                <label>Estado</label>
                <select id="avalEstado">
                    <option value="Vigente"> Vigente</option>
                    <option value="Próximo a vencer"> Próximo a vencer</option>
                    <option value="Vencido"> Vencido</option>
                    <option value="Cancelado"> Cancelado</option>
                </select>
            </div>
            
            <!-- ========== NUEVA SECCIÓN: COSTES DEL AVAL ========== -->
            <hr class="u-hr">
            <h4 class="u-fs-13"> COSTES Y COMISIONES DEL AVAL</h4>
            <p style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 12px;">Estos costes se reflejarán automáticamente en el cashflow del proyecto.</p>
            
            <!-- Comisión de Apertura -->
            <div class="form-row">
                <div class="form-group">
                    <label> Comisión de apertura/estudio (%)</label>
                    <input type="number" id="avalComisionAperturaPct" value="0.75" step="0.1" placeholder="%">
                    <small class="u-fs-10">Ej: 0.75% = 0.75</small>
                </div>
                <div class="form-group">
                    <label> O fijo (€)</label>
                    <input type="number" id="avalComisionAperturaFija" value="0" placeholder="Importe fijo">
                </div>
            </div>
            
            <!-- Comisión de Riesgo / Trimestral -->
            <div class="form-row">
                <div class="form-group">
                    <label> Comisión de riesgo trimestral (%)</label>
                    <input type="number" id="avalComisionRiesgoPct" value="0.5" step="0.1" placeholder="% por trimestre">
                    <small class="u-fs-10">Se aplica cada 3 meses sobre el importe</small>
                </div>
                <div class="form-group">
                    <label> O fijo por trimestre (€)</label>
                    <input type="number" id="avalComisionRiesgoFija" value="0" placeholder="Importe fijo/trimestre">
                </div>
            </div>
            
            <!-- Gastos de Notaría -->
            <div class="form-row">
                <div class="form-group">
                    <label> Gastos de Notaría (%)</label>
                    <input type="number" id="avalGastosNotariaPct" value="0.3" step="0.1" placeholder="% del importe">
                </div>
                <div class="form-group">
                    <label> O fijo (€)</label>
                    <input type="number" id="avalGastosNotariaFijos" value="0" placeholder="Importe fijo">
                </div>
            </div>
            
            <!-- Otros gastos -->
            <div class="form-group">
                <label> Otros gastos (gestoría, correo, etc.)</label>
                <input type="number" id="avalOtrosGastos" value="0" placeholder="Importe en €">
            </div>
            
            <div class="info-card-modal u-mt-12 u-p-10">
                <small> <strong>Ejemplo para 100.000€:</strong><br>
                • Apertura 0.75% = 750€ (pago único)<br>
                • Riesgo trimestral 0.5% = 500€/trimestre<br>
                • Notaría 0.3% = 300€ (pago único)<br>
                Estos costes se añadirán automáticamente a los gastos del proyecto.</small>
            </div>
            
            <div class="form-group u-mt-16">
                <label>Notas / condiciones adicionales</label>
                <textarea rows="2" id="avalNotas" placeholder="Condiciones particulares del aval..."></textarea>
            </div>
            
            <div class="u-flex-gap-12 u-mt-20">
                <button class="btn btn-secondary u-flex-1" onclick="cerrarModalGeneric()">Cancelar</button>
                <button class="btn btn-primary u-flex-1" onclick="guardarAval()">Guardar Aval</button>
            </div>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}
        
function guardarAval() {
    let id = document.getElementById('avalId').value;
    let tipo = document.getElementById('avalTipo').value;
    if (!tipo) { mostrarToast(" El tipo de aval es obligatorio", 'error'); return; }
    
    let importe = parseFloat(document.getElementById('avalImporte').value);
    let fechaEmision = document.getElementById('avalFechaEmision').value;
    let fechaVencimiento = document.getElementById('avalFechaVencimiento').value;
    
    // ============================================
    // CALCULAR MESES DE VIGENCIA (AUTOMÁTICAMENTE)
    // ============================================
    let mesesVigencia = 12; // valor por defecto
    if (fechaEmision && fechaVencimiento) {
        try {
            const inicio = new Date(fechaEmision);
            const fin = new Date(fechaVencimiento);
            if (!isNaN(inicio) && !isNaN(fin)) {
                mesesVigencia = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24 * 30.44));
                mesesVigencia = Math.max(1, mesesVigencia);
            }
        } catch(e) {
            console.warn("Error calculando vigencia:", e);
        }
    }
    
    // Obtener valores de comisiones
    let comisionAperturaPct = parseFloat(document.getElementById('avalComisionAperturaPct').value) || 0;
    let comisionAperturaFija = parseFloat(document.getElementById('avalComisionAperturaFija').value) || 0;
    let comisionRiesgoPct = parseFloat(document.getElementById('avalComisionRiesgoPct').value) || 0;
    let comisionRiesgoFija = parseFloat(document.getElementById('avalComisionRiesgoFija').value) || 0;
    let gastosNotariaPct = parseFloat(document.getElementById('avalGastosNotariaPct').value) || 0;
    let gastosNotariaFijos = parseFloat(document.getElementById('avalGastosNotariaFijos').value) || 0;
    let otrosGastos = parseFloat(document.getElementById('avalOtrosGastos').value) || 0;
    
    // Convertir importe a moneda base para cálculos consistentes
    const importeEnBase = convertirMoneda(importe, document.getElementById('avalMoneda').value);
    
    // Calcular comisión de apertura
    let apertura = comisionAperturaFija;
    if (comisionAperturaPct > 0) {
        apertura += importeEnBase * (comisionAperturaPct / 100);
    }
    
    // Calcular gastos de notaría
    let notaria = gastosNotariaFijos;
    if (gastosNotariaPct > 0) {
        notaria += importeEnBase * (gastosNotariaPct / 100);
    }
    
    // Calcular comisión de riesgo TOTAL (suma de todos los pagos trimestrales)
    let riesgoTotal = 0;
    const trimestres = Math.ceil(mesesVigencia / 3);
    if (comisionRiesgoFija > 0) {
        riesgoTotal = comisionRiesgoFija * trimestres;
    } else if (comisionRiesgoPct > 0) {
        riesgoTotal = (importeEnBase * (comisionRiesgoPct / 100)) * trimestres;
    }
    
    let aval = {
        id: id ? parseInt(id) : Date.now(),
        tipo: tipo,
        entidad: document.getElementById('avalEntidad').value,
        importe: importe,
        moneda: document.getElementById('avalMoneda').value,
        fechaEmision: fechaEmision,
        fechaVencimiento: fechaVencimiento,
        referencia: document.getElementById('avalReferencia').value,
        estado: document.getElementById('avalEstado').value,
        notas: document.getElementById('avalNotas').value,
        // Comisiones (guardamos los valores originales)
        comisionAperturaPct: comisionAperturaPct,
        comisionAperturaFija: comisionAperturaFija,
        comisionRiesgoPct: comisionRiesgoPct,
        comisionRiesgoFija: comisionRiesgoFija,
        gastosNotariaPct: gastosNotariaPct,
        gastosNotariaFijos: gastosNotariaFijos,
        otrosGastos: otrosGastos,
        mesesVigencia: mesesVigencia,
        // Costes calculados (para mostrar en la UI y usar en cashflow)
        costesCalculados: {
            apertura: apertura,
            riesgoTotal: riesgoTotal,
            notaria: notaria,
            otros: otrosGastos,
            total: apertura + riesgoTotal + notaria + otrosGastos
        }
    };
    
    if (!proyecto.avales) proyecto.avales = [];
    
    if (id) {
        let idx = proyecto.avales.findIndex(a => a.id === parseInt(id));
        if (idx >= 0) proyecto.avales[idx] = aval;
    } else {
        proyecto.avales.push(aval);
    }
    
    guardarProyecto();
    renderizarAvales();
    calcularCashflow(); // Recalcular cashflow para incluir los costes
    cerrarModalGeneric();
    mostrarToast(` ${aval.tipo} guardado. Costes totales: ${formatearMoneda(aval.costesCalculados.total)}`, 'success');
}
        
        function editarAval(id) {
    let a = proyecto.avales.find(a => a.id === id);
    if (!a) return;
    
    const modalHtml = `
        <div class="modal-content modal-600">
            <div class="modal-header">
                <h3> Editar Aval: ${escapeHtml(a.tipo)}</h3>
                <span class="close-modal" onclick="cerrarModalGeneric()">&times;</span>
            </div>
            <input type="hidden" id="avalId" value="${a.id}">
            
            <div class="form-group">
                <label>Tipo de aval</label>
                <select id="avalTipo">
                    <option value="Aval bancario" ${a.tipo === 'Aval bancario' ? 'selected' : ''}>Aval bancario</option>
                    <option value="Carta de crédito standby" ${a.tipo === 'Carta de crédito standby' ? 'selected' : ''}>Carta de crédito standby</option>
                    <option value="Garantía de cumplimiento" ${a.tipo === 'Garantía de cumplimiento' ? 'selected' : ''}>Garantía de cumplimiento</option>
                    <option value="Garantía de anticipo" ${a.tipo === 'Garantía de anticipo' ? 'selected' : ''}>Garantía de anticipo</option>
                    <option value="Garantía de retención" ${a.tipo === 'Garantía de retención' ? 'selected' : ''}>Garantía de retención</option>
                    <option value="Seguro de crédito" ${a.tipo === 'Seguro de crédito' ? 'selected' : ''}>Seguro de crédito</option>
                    <option value="Otro" ${a.tipo === 'Otro' ? 'selected' : ''}>Otro</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Entidad emisora</label>
                <input type="text" id="avalEntidad" value="${escapeHtml(a.entidad || '')}">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Importe avalado</label>
                    <input type="number" id="avalImporte" value="${a.importe}">
                </div>
                <div class="form-group">
                    <label>Moneda</label>
                    <select id="avalMoneda">
                        ${Object.keys(MONEDAS).map(m => `<option value="${m}" ${a.moneda === m ? 'selected' : ''}>${m} - ${MONEDAS[m]}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label> Fecha emisión</label>
                    <input type="date" id="avalFechaEmision" value="${a.fechaEmision || ''}">
                </div>
                <div class="form-group">
                    <label> Fecha vencimiento</label>
                    <input type="date" id="avalFechaVencimiento" value="${a.fechaVencimiento || ''}">
                </div>
            </div>
            
            <div class="form-group">
                <label>Nº de referencia</label>
                <input type="text" id="avalReferencia" value="${escapeHtml(a.referencia || '')}">
            </div>
            
            <div class="form-group">
                <label>Estado</label>
                <select id="avalEstado">
                    <option value="Vigente" ${a.estado === 'Vigente' ? 'selected' : ''}> Vigente</option>
                    <option value="Próximo a vencer" ${a.estado === 'Próximo a vencer' ? 'selected' : ''}> Próximo a vencer</option>
                    <option value="Vencido" ${a.estado === 'Vencido' ? 'selected' : ''}> Vencido</option>
                    <option value="Cancelado" ${a.estado === 'Cancelado' ? 'selected' : ''}> Cancelado</option>
                </select>
            </div>
            
            <hr class="u-hr">
            <h4 class="u-fs-13"> COSTES Y COMISIONES DEL AVAL</h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Comisión apertura (%)</label>
                    <input type="number" id="avalComisionAperturaPct" value="${a.comisionAperturaPct || 0.75}" step="0.1">
                </div>
                <div class="form-group">
                    <label>O fijo (€)</label>
                    <input type="number" id="avalComisionAperturaFija" value="${a.comisionAperturaFija || 0}">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Comisión riesgo trimestral (%)</label>
                    <input type="number" id="avalComisionRiesgoPct" value="${a.comisionRiesgoPct || 0.5}" step="0.1">
                </div>
                <div class="form-group">
                    <label>O fijo/trimestre (€)</label>
                    <input type="number" id="avalComisionRiesgoFija" value="${a.comisionRiesgoFija || 0}">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Gastos notaría (%)</label>
                    <input type="number" id="avalGastosNotariaPct" value="${a.gastosNotariaPct || 0.3}" step="0.1">
                </div>
                <div class="form-group">
                    <label>O fijos (€)</label>
                    <input type="number" id="avalGastosNotariaFijos" value="${a.gastosNotariaFijos || 0}">
                </div>
            </div>
            
            <div class="form-group">
                <label>Otros gastos (€)</label>
                <input type="number" id="avalOtrosGastos" value="${a.otrosGastos || 0}">
            </div>
            
            <div class="form-group">
                <label>Notas</label>
                <textarea rows="2" id="avalNotas">${escapeHtml(a.notas || '')}</textarea>
            </div>
            
            <div class="info-card-modal" style="margin-top: 12px; background: rgba(0,122,255,0.15);">
                <small> <strong>Costes actuales del aval:</strong><br>
                • Apertura: ${formatearMoneda(a.costesCalculados?.apertura || 0)}<br>
                • Riesgo (total): ${formatearMoneda(a.costesCalculados?.riesgoTotal || 0)}<br>
                • Notaría: ${formatearMoneda(a.costesCalculados?.notaria || 0)}<br>
                • Otros: ${formatearMoneda(a.costesCalculados?.otros || 0)}<br>
                <strong>TOTAL: ${formatearMoneda(a.costesCalculados?.total || 0)}</strong>
                </small>
            </div>
            
            <div class="u-flex-gap-12 u-mt-20">
                <button class="btn btn-secondary u-flex-1" onclick="cerrarModalGeneric()">Cancelar</button>
                <button class="btn btn-primary u-flex-1" onclick="guardarAval()">Actualizar Aval</button>
            </div>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = `<div class="modal u-flex" id="genericModal">${modalHtml}</div>`;
    document.getElementById('genericModal').onclick = (e) => { if (e.target === e.currentTarget) cerrarModalGeneric(); };
}
        
        function eliminarAval(id) {
            if (confirm(tApp('confirmar_eliminar_aval'))) {
                proyecto.avales = proyecto.avales.filter(a => a.id !== id);
                guardarProyecto();
                renderizarAvales();
                mostrarToast(tApp('toast_eliminado'), 'success');
            }
        }
        
        // ============================================
        // SISTEMA DE IA PREDICTIVA
        // ============================================
        
        let OPENAI_API_KEY = localStorage.getItem('openai_api_key') || '';
        let USAR_IA_REAL = false;
        
