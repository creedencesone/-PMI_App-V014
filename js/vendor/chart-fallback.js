// ============================================
// chart-fallback.js — Stub mínimo de Chart.js
// Se carga solo si Chart.js no está disponible (CDN/local bloqueado).
// Evita que un gráfico que no puede dibujarse tumbe toda la app.
// ============================================
(function () {
    if (typeof window.Chart !== 'undefined') return;

    console.warn('[PMI] Chart.js no está disponible: los gráficos no se dibujarán.');

    function ChartStub(ctx, config) {
        this.ctx = ctx || null;
        this.canvas = ctx && ctx.canvas ? ctx.canvas : null;
        this.config = config || {};
        this.data = (config && config.data) || { labels: [], datasets: [] };
        this.options = (config && config.options) || {};
    }

    ChartStub.prototype.update = function () {};
    ChartStub.prototype.destroy = function () {};
    ChartStub.prototype.resize = function () {};
    ChartStub.prototype.toBase64Image = function () { return ''; };
    ChartStub.prototype.getDatasetMeta = function () { return { data: [] }; };

    ChartStub.defaults = { font: {}, color: '', plugins: {}, scales: {}, elements: {} };
    ChartStub.register = function () {};
    ChartStub.unregister = function () {};
    ChartStub.getChart = function () { return null; };

    window.Chart = ChartStub;
})();
