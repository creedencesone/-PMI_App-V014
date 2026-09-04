// ============================================================
// core/ui.js — Utilidades de interfaz
// ============================================================

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function mostrarToast(mensaje, tipo = 'info') {
    const contenedor = document.getElementById('toastContainer');
    if (contenedor) {
        const colores = { info: '#007AFF', success: '#00A859', warning: '#FF9500', error: '#FF3B30' };
        const toast = document.createElement('div');
        toast.style.cssText = `background:${colores[tipo]||colores.info};color:#fff;padding:12px 20px;border-radius:12px;margin-bottom:8px;font-size:13px;font-weight:500;box-shadow:0 4px 16px rgba(0,0,0,0.3);animation:fadeInOut 3s ease;max-width:400px;word-wrap:break-word;`;
        toast.textContent = mensaje;
        contenedor.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
        return;
    }
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = mensaje;
    toast.className = 'toast ' + (tipo || 'info');
    toast.style.display = 'block';
    clearTimeout(toast._toastTimer);
    toast._toastTimer = setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

function isDarkTheme() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
}

function themeText() {
    const dark = isDarkTheme();
    return {
        text: dark ? '#e0e0e0' : '#1a1a2e',
        grid: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
        card: dark ? '#1c1c1e' : '#ffffff'
    };
}

// Asignar al window para compatibilidad legacy
window.escapeHtml = escapeHtml;
window.mostrarToast = mostrarToast;
window.isDarkTheme = isDarkTheme;
window.themeText = themeText;
