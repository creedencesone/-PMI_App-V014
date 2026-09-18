// ============================================================
// COMPARTIR - Vista pública de proyecto (sin autenticación)
// ============================================================

function generarVistaPublica() {
    if (!proyecto) {
        mostrarToast(' No hay proyecto activo', 'warning');
        return;
    }

    const p = proyecto;
    const elementos = p.elementosGantt || [];
    const materiales = p.materiales || [];
    const servicios = p.servicios || [];

    // Coste total (convertir monedas)
    let costeTotal = elementos.reduce((s, e) => {
        const moneda = e.recursoAsignado?.moneda || proyecto.monedaBase;
        return s + convertirMoneda(e.costeEstimado || 0, moneda);
    }, 0);
    materiales.forEach(m => {
        const raw = m.cantidad * m.costeUnitario + (m.costeEnvio || 0);
        costeTotal += convertirMoneda(raw, m.moneda);
    });
    servicios.forEach(s => {
        const raw = s.cantidad * s.costeUnitario * (1 + (s.impuesto || 0) / 100);
        costeTotal += convertirMoneda(raw, s.moneda);
    });

    const progresoTotal = elementos.filter(e => e.tipo !== 'edt').reduce((s, e) => s + (e.progreso || 0), 0);
    const totalTareas = elementos.filter(e => e.tipo !== 'edt').length || 1;
    const progresoPromedio = (progresoTotal / totalTareas).toFixed(1);

    // Fechas
    const fechas = elementos.reduce((acc, t) => {
        if (t.inicio) {
            const dt = new Date(t.inicio);
            if (!acc.min || dt < acc.min) acc.min = dt;
            if (t.duracion > 0) {
                const fin = typeof sumarDiasHabiles === 'function' ? sumarDiasHabiles(t.inicio, t.duracion) : t.inicio;
                const fd = new Date(fin);
                if (!acc.max || fd > acc.max) acc.max = fd;
            }
        }
        return acc;
    }, { min: null, max: null });

    // Riesgos
    const riesgosCriticos = (p.riesgos || []).filter(r => r.nivel === 'crítico' || r.nivel === 'alto').length;

    // Obtener colores del tema actual
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const bg = isDark ? '#0a0a1a' : '#f5f5f7';
    const cardBg = isDark ? 'rgba(30,30,40,0.9)' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#1a1a2e';
    const textSec = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(p.nombre || 'Proyecto')} - Dashboard Público</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        body { background: ${bg}; color: ${textColor}; padding: 24px; }
        .header { text-align: center; padding: 32px 16px; }
        .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
        .header p { color: ${textSec}; font-size: 14px; }
        .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; margin-top:8px; }
        .badge-verde { background:rgba(0,168,89,0.15); color:#00A859; }
        .badge-rojo { background:rgba(255,59,48,0.15); color:#FF3B30; }
        .cards { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px,1fr)); gap:12px; max-width:900px; margin:0 auto 24px; }
        .card { background:${cardBg}; border-radius:16px; padding:20px; border:1px solid ${borderColor}; }
        .card .label { font-size:12px; color:${textSec}; margin-bottom:6px; }
        .card .value { font-size:24px; font-weight:700; }
        .card .sub { font-size:11px; color:${textSec}; margin-top:4px; }
        .section { max-width:900px; margin:0 auto 24px; }
        .section h2 { font-size:18px; margin-bottom:12px; }
        table { width:100%; border-collapse:collapse; font-size:13px; }
        th, td { padding:10px 12px; text-align:left; border-bottom:1px solid ${borderColor}; }
        th { color:${textSec}; font-weight:500; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; }
        .chart-container { background:${cardBg}; border-radius:16px; padding:20px; border:1px solid ${borderColor}; margin-bottom:16px; }
        .footer { text-align:center; padding:24px; color:${textSec}; font-size:12px; }
        .watermark { position:fixed; bottom:12px; right:16px; font-size:11px; color:${textSec}; opacity:0.5; }
    </style>
</head>
<body>
    <div class="header">
        <h1> ${escapeHtml(p.nombre || 'Proyecto sin nombre')}</h1>
        <p>${escapeHtml(p.descripcion || '')}</p>
        <div class="badge ${progresoPromedio >= 50 ? 'badge-verde' : 'badge-rojo'}">
            ${progresoPromedio}% completado
        </div>
    </div>

    <div class="cards">
        <div class="card">
            <div class="label"> Presupuesto</div>
            <div class="value">${formatearMoneda(costeTotal)}</div>
            <div class="sub">Coste total estimado</div>
        </div>
        <div class="card">
            <div class="label"> Ingreso previsto</div>
            <div class="value">${formatearMoneda(p.precioVenta || 0)}</div>
            <div class="sub">${p.precioVenta ? ((p.precioVenta - costeTotal) >= 0 ? ' Beneficio: ' + formatearMoneda(p.precioVenta - costeTotal) : ' Pérdida: ' + formatearMoneda(p.precioVenta - costeTotal)) : 'Sin definir'}</div>
        </div>
        <div class="card">
            <div class="label"> Duración</div>
            <div class="value">${fechas.min && fechas.max ? Math.round((fechas.max - fechas.min) / (86400000 * 30)) + ' meses' : '-'}</div>
            <div class="sub">${fechas.min ? fechas.min.toLocaleDateString('es-ES') : '-'} → ${fechas.max ? fechas.max.toLocaleDateString('es-ES') : '-'}</div>
        </div>
        <div class="card">
            <div class="label"> Riesgos</div>
            <div class="value">${p.riesgos?.length || 0}</div>
            <div class="sub">${riesgosCriticos > 0 ? riesgosCriticos + ' críticos/altos' : 'Sin críticos'}</div>
        </div>
        <div class="card">
            <div class="label"> Equipo</div>
            <div class="value">${p.equipo?.length || 0}</div>
            <div class="sub">Recursos asignados</div>
        </div>
        <div class="card">
            <div class="label"> Tareas</div>
            <div class="value">${totalTareas}</div>
            <div class="sub">${elementos.filter(e => e.tipo === 'hito').length} hitos</div>
        </div>
    </div>

    <div class="section">
        <h2> Tareas del proyecto</h2>
        <table>
            <thead><tr><th>Nombre</th><th>Tipo</th><th>Duración</th><th>Inicio</th><th>Progreso</th><th>Coste est.</th></tr></thead>
            <tbody>
                ${elementos.filter(e => e.tipo !== 'edt').slice(0, 30).map(function(e) { return '<tr><td><strong>' + escapeHtml(e.nombre || '') + '</strong></td><td>' + (e.tipo || '-') + '</td><td>' + (e.duracion || 0) + ' ' + (e.tipoDuracion === 'horas' ? 'h' : 'd') + '</td><td>' + formatearFechaEspa(e.inicio) + '</td><td>' + (e.progreso || 0) + '%</td><td>' + formatearMoneda(e.costeEstimado || 0) + '</td></tr>'; }).join('')}
            </tbody>
        </table>
    </div>

    <div class="footer">
         Generado por PMI Mind — Datos del proyecto al ${new Date().toLocaleString('es-ES')}
    </div>
    <div class="watermark">PMI Mind</div>

    ${'<scr' + 'ipt>'}
        document.addEventListener('DOMContentLoaded', () => {
            const ctx = document.createElement('canvas');
            ctx.id = 'progChart';
            ctx.style.maxWidth = '300px';
            ctx.style.margin = '0 auto';
            document.querySelector('.section')?.prepend(ctx);
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: [tApp('informe_completado'), tApp('informe_pendiente')],
                    datasets: [{ data: [${progresoPromedio}, ${(100 - progresoPromedio).toFixed(1)}], backgroundColor: ['#00A859', 'rgba(255,255,255,0.1)'], borderWidth: 0 }]
                },
                options: { cutout: '70%', responsive: true, plugins: { legend: { display: false } } }
            });
        });
    ${'</scr' + 'ipt>'}
</body>
</html>`;

    // Descargar como HTML
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(p.nombre || 'proyecto').replace(/[^a-zA-Z0-9]/g, '_')}_dashboard.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    mostrarToast(' Dashboard público descargado como HTML', 'success');
}
