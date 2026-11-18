// ============================================================
// SISTEMA DE AUTENTICACIÓN Y PERMISOS - PMI Mind
// ============================================================

class AuthSystem {
    // ============================================================
    // CONSTANTES
    // ============================================================

    static STORAGE_KEY = 'pmi_usuarios_v3';
    static SESSION_KEY = 'pmi_sesion_v3';
    static SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 horas
    static PBKDF2_ITERATIONS = 100000;

    // Hashes de las cuentas de demostración. Las contraseñas se muestran en la
    // pantalla de acceso, por lo que sus salts se publican sin comprometer nada;
    // las cuentas creadas por el usuario usan siempre sales aleatorias.
    static SEED_HASHES = {
        'admin@pmi.app': 'pbkdf2$100000$a1b2c3d4e5f60718293a4b5c6d7e8f90$a4dae039e7b33674370afadb7b953cbc1c2388c2cae22e9fb21debf0046afea2',
        'admin@pmi.com': 'pbkdf2$100000$b2c3d4e5f60718293a4b5c6d7e8f90a1$07da831e1bdc93f93d81fbb4d93ad2c2954720f49a0d9143564c329428ecdf9f',
        'juan@proyecto.com': 'pbkdf2$100000$c3d4e5f60718293a4b5c6d7e8f90a1b2$3eea08b81d00ccc5a015d53e5d9258503deb5abc575689e2f85153b5fe2ac65c',
        'maria@sponsor.com': 'pbkdf2$100000$d4e5f60718293a4b5c6d7e8f90a1b2c3$40f2545b94a6c8b79aabc996c5e94bdee0c6c563d875e10358ed688a4f8a1898',
        'carlos@equipo.com': 'pbkdf2$100000$e5f60718293a4b5c6d7e8f90a1b2c3d4$89a86c4a305e53b1ef9b86fde5dd3579e6a77aa5a257f161e494145296daa54b',
        'cliente@empresa.com': 'pbkdf2$100000$f60718293a4b5c6d7e8f90a1b2c3d4e5$c42b03e206c60ec850d31e7b22b2fb6b3258fc3e9ef22ca6396c621cc5f29004'
    };


    // ============================================================
    // ROLES DISPONIBLES
    // ============================================================

    static ROLES = {
        admin: {
            nombre: 'Administrador',
            nivel: 100,
            descripcion: 'Acceso total a todo el sistema',
            color: '#FFD700',
            permisos: {
                ver: true,
                editar: true,
                eliminar: true,
                gestionarUsuarios: true,
                gestionarProyectos: true,
                exportarDatos: true,
                configurarSistema: true,
                acciones: {
                    crear: true,
                    editar: true,
                    eliminar: true,
                    aprobar: true,
                    exportar: true,
                    importar: true,
                    gestionarRoles: true
                }
            }
        },
        project_manager: {
            nombre: 'Project Manager',
            nivel: 80,
            descripcion: 'Gestión completa de proyectos asignados',
            color: '#007AFF',
            permisos: {
                ver: true,
                editar: true,
                eliminar: true,
                gestionarUsuarios: false,
                gestionarProyectos: false,
                exportarDatos: true,
                configurarSistema: false,
                acciones: {
                    crear: true,
                    editar: true,
                    eliminar: true,
                    aprobar: true,
                    exportar: true,
                    importar: false,
                    gestionarRoles: false
                }
            }
        },
        team_member: {
            nombre: 'Team Member',
            nivel: 50,
            descripcion: 'Edición limitada en proyectos asignados',
            color: '#00A859',
            permisos: {
                ver: true,
                editar: true,
                eliminar: false,
                gestionarUsuarios: false,
                gestionarProyectos: false,
                exportarDatos: false,
                configurarSistema: false,
                acciones: {
                    crear: true,
                    editar: true,
                    eliminar: false,
                    aprobar: false,
                    exportar: false,
                    importar: false,
                    gestionarRoles: false
                }
            }
        },
        viewer: {
            nombre: 'Visualizador',
            nivel: 20,
            descripcion: 'Solo lectura en proyectos asignados',
            color: '#8E8E93',
            permisos: {
                ver: true,
                editar: false,
                eliminar: false,
                gestionarUsuarios: false,
                gestionarProyectos: false,
                exportarDatos: false,
                configurarSistema: false,
                acciones: {
                    crear: false,
                    editar: false,
                    eliminar: false,
                    aprobar: false,
                    exportar: false,
                    importar: false,
                    gestionarRoles: false
                }
            }
        }
    };

    // ============================================================
    // MÓDULOS DISPONIBLES POR PROYECTO
    // ============================================================

    static MODULOS = {
        acta: { nombre: ' Acta de Inicio', icono: '' },
        dashboard: { nombre: ' Dashboard', icono: '' },
        salud: { nombre: ' Salud del Proyecto', icono: '' },
        finanzas: { nombre: ' Finanzas', icono: '' },
        cronograma: { nombre: ' Cronograma Gantt', icono: '' },
        riesgos: { nombre: ' Gestión de Riesgos', icono: '' },
        stakeholders: { nombre: ' Stakeholders', icono: '' },
        procesos: { nombre: ' Procesos', icono: '' },
        recursos: { nombre: ' Recursos', icono: '' },
        comunicaciones: { nombre: ' Comunicaciones', icono: '' },
        beneficios: { nombre: ' Beneficios', icono: '' },
        cambios: { nombre: ' Cambios', icono: '' },
        lecciones: { nombre: ' Lecciones', icono: '' },
        scrum: { nombre: ' Scrum Ágil', icono: '' },
        logistica: { nombre: ' Logística', icono: '' },
        viajes: { nombre: ' Viajes', icono: '' },
        avales: { nombre: ' Avales', icono: '' },
        garantia: { nombre: ' Garantía', icono: '' },
        informe: { nombre: ' Informes', icono: '' }
    };

    // ============================================================
    // HASH DE CONTRASEÑA
    // ============================================================

    static hashPassword(password) {
        if (typeof PMICrypto === 'undefined' || !PMICrypto.pbkdf2Hex) {
            throw new Error('No se pudo cargar el módulo criptográfico PBKDF2');
        }
        const salt = PMICrypto.randomSaltHex(16);
        const hash = PMICrypto.pbkdf2Hex(
            password,
            PMICrypto.hexToBytes(salt),
            this.PBKDF2_ITERATIONS,
            32
        );
        return `pbkdf2$${this.PBKDF2_ITERATIONS}$${salt}$${hash}`;
    }

    static parseHash(stored) {
        if (typeof stored !== 'string') return null;
        if (stored.startsWith('pbkdf2$')) {
            const partes = stored.split('$');
            if (partes.length !== 4) return null;
            const iteraciones = parseInt(partes[1], 10);
            if (!Number.isFinite(iteraciones) || iteraciones < 10000) return null;
            if (!/^[0-9a-f]{32}$/i.test(partes[2]) || !/^[0-9a-f]{64}$/i.test(partes[3])) return null;
            return { tipo: 'pbkdf2', iteraciones, salt: partes[2], hash: partes[3] };
        }
        if (stored.startsWith('hash_')) return { tipo: 'legacy' };
        return null;
    }

    // Solo para migrar cuentas antiguas almacenadas en localStorage.
    static hashLegacy(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hash_' + hash + '_' + btoa(password).slice(0, 10);
    }

    static verifyPassword(password, stored) {
        const parsed = this.parseHash(stored);
        if (!parsed) return false;
        if (parsed.tipo === 'legacy') return this.hashLegacy(password) === stored;
        if (typeof PMICrypto === 'undefined') return false;
        const candidato = PMICrypto.pbkdf2Hex(
            password,
            PMICrypto.hexToBytes(parsed.salt),
            parsed.iteraciones,
            32
        );
        return PMICrypto.timingSafeEqualHex(candidato, parsed.hash);
    }

    // ============================================================
    // INICIALIZACIÓN
    // ============================================================

    static init() {
        // No se crea ningún administrador implícito: en producción el alta
        // inicial llega del proveedor de identidad; en local la hacen
        // exclusivamente las credenciales demo bajo PMI_SHOW_DEMO_CREDENTIALS.
        this.migrarCuentasDemo();

        // Verificar sesión
        const sesion = this.getSession();
        if (sesion) {
            const tiempoTranscurrido = Date.now() - sesion.timestamp;
            if (tiempoTranscurrido > this.SESSION_TIMEOUT) {
                this.logout();
                return null;
            }

            sesion.timestamp = Date.now();
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(sesion));

            const usuario = this.findUserById(sesion.userId);
            if (usuario && usuario.active) {
                this._currentUser = usuario;
                return usuario;
            }
        }

        return null;
    }

    static migrarCuentasDemo() {
        const usuarios = this.getUsers();
        let cambiado = false;
        usuarios.forEach(u => {
            const semilla = this.SEED_HASHES[u.email.toLowerCase()];
            if (!semilla) return;
            const parsed = this.parseHash(u.password);
            if (!parsed || parsed.tipo === 'legacy' || parsed.iteraciones < this.PBKDF2_ITERATIONS) {
                u.password = semilla;
                cambiado = true;
            }
        });
        if (cambiado) this.saveUsers(usuarios);
    }

    /** Alta de una cuenta demo con credenciales públicas y hash verificado. */
    static registrarCuentaDemo(email, password, nombre, role) {
        const hash = this.SEED_HASHES[email.toLowerCase()];
        if (!hash) return { success: false, error: 'Cuenta demo no reconocida' };
        if (this.findUser(email)) return { success: true };
        const config = this.ROLES[role] || this.ROLES.team_member;
        const usuario = {
            id: 'demo_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            email: email.toLowerCase(), password: hash, nombre, apellidos: '', telefono: '',
            role, nivel: config.nivel, createdAt: new Date().toISOString(), lastLogin: null,
            active: true, permisos: JSON.parse(JSON.stringify(config.permisos)),
            proyectosAsignados: [], permisosProyectos: {}
        };
        const usuarios = this.getUsers();
        usuarios.push(usuario);
        this.saveUsers(usuarios);
        return { success: true };
    }

    /** Verifica la contraseña demo sin iniciar sesión (usado por el flag de demo). */
    static verificarCredencialDemo(email, password) {
        const hash = this.SEED_HASHES[String(email || '').toLowerCase()];
        return !!(hash && this.verifyPassword(password, hash));
    }

    // ============================================================
    // GESTIÓN DE USUARIOS
    // ============================================================

    static getUsers() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    static saveUsers(usuarios) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuarios));
    }

    static findUser(email) {
        const usuarios = this.getUsers();
        return usuarios.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }

    static findUserById(id) {
        const usuarios = this.getUsers();
        return usuarios.find(u => u.id === id) || null;
    }

    // ============================================================
    // REGISTRO
    // ============================================================

    static register(email, password, nombre, apellidos = '', telefono = '', role = 'team_member', passwordHash = null) {
        // El registro público nunca puede crear privilegios ni aceptar un hash externo.
        const ROLES_PUBLICOS = ['team_member', 'viewer'];
        role = ROLES_PUBLICOS.includes(role) ? role : 'team_member';
        passwordHash = null;
        if (!email || !password || !nombre) {
            return { success: false, error: 'Todos los campos obligatorios deben estar completos' };
        }

        if (password.length < 6) {
            return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
        }

        if (!this.isValidEmail(email)) {
            return { success: false, error: 'El email no es válido' };
        }

        if (this.findUser(email)) {
            return { success: false, error: 'El email ya está registrado' };
        }

        const roleConfig = this.ROLES[role] || this.ROLES.team_member;

        const nuevoUsuario = {
            id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            email: email.toLowerCase(),
            password: passwordHash || this.hashPassword(password),
            nombre: nombre.trim(),
            apellidos: apellidos.trim(),
            telefono: telefono.trim(),
            role: role,
            nivel: roleConfig.nivel,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: null,
            active: true,
            permisos: JSON.parse(JSON.stringify(roleConfig.permisos)),
            proyectosAsignados: [],
            permisosProyectos: {}
        };

        const usuarios = this.getUsers();
        usuarios.push(nuevoUsuario);
        this.saveUsers(usuarios);

        return { success: true, usuario: nuevoUsuario };
    }

    // ============================================================
    // LOGIN
    // ============================================================

    static login(email, password) {
        const usuario = this.findUser(email);

        if (!usuario) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        if (!usuario.active) {
            return { success: false, error: 'La cuenta está desactivada. Contacta con el administrador.' };
        }

        if (!this.verifyPassword(password, usuario.password)) {
            return { success: false, error: 'Contraseña incorrecta' };
        }

        // Migración transparente: rehash con PBKDF2 tras un login válido.
        const parsed = this.parseHash(usuario.password);
        if (!parsed || parsed.tipo === 'legacy' || parsed.iteraciones < this.PBKDF2_ITERATIONS) {
            usuario.password = this.hashPassword(password);
        }

        usuario.lastLogin = new Date().toISOString();
        usuario.updatedAt = new Date().toISOString();
        this.updateUser(usuario);

        this._currentUser = usuario;
        const sesion = {
            userId: usuario.id,
            email: usuario.email,
            role: usuario.role,
            nivel: usuario.nivel,
            timestamp: Date.now()
        };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sesion));

        return { success: true, usuario };
    }

    static async signOut() {
        try {
            if (typeof DataService !== 'undefined' && typeof DataService.signOut === 'function') {
                await DataService.signOut();
            }
        } catch (error) {
            console.warn('[Auth] signOut remoto falló; se cierra la sesión local', error);
        } finally {
            this.logout();
        }
    }

    static logout() {
        this._currentUser = null;
        localStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem('pmi_api_token');
        try { sessionStorage.removeItem('pmi_perfil_verificado_v1'); } catch { /* sesión no disponible */ }
    }

    // ============================================================
    // SESIÓN
    // ============================================================

    static getSession() {
        try {
            const data = localStorage.getItem(this.SESSION_KEY);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    }

    static getCurrentUser() {
        if (this._currentUser) return this._currentUser;

        const sesion = this.getSession();
        if (sesion) {
            const usuario = this.findUserById(sesion.userId);
            if (usuario && usuario.active) {
                this._currentUser = usuario;
                return usuario;
            }
        }
        return null;
    }

    static isAuthenticated() {
        return !!this.getCurrentUser();
    }

    // ============================================================
    // UTILIDADES
    // ============================================================

    static isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static updateUser(usuario) {
        const usuarios = this.getUsers();
        const index = usuarios.findIndex(u => u.id === usuario.id);
        if (index === -1) return false;

        usuario.updatedAt = new Date().toISOString();
        usuarios[index] = usuario;
        this.saveUsers(usuarios);

        if (this._currentUser && this._currentUser.id === usuario.id) {
            this._currentUser = usuario;
        }

        return true;
    }

    // ============================================================
    // ROLES Y PERMISOS
    // ============================================================

    static getRoles() {
        return this.ROLES;
    }

    static getRoleInfo(role) {
        return this.ROLES[role] || null;
    }

    /** Perfil validado por el proveedor de identidad (RLS), nunca por el JSON local. */
    static perfilRemotoVerificado() {
        try {
            const raw = sessionStorage.getItem('pmi_perfil_verificado_v1');
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }

    static cuentaSemillaConfiable(usuario) {
        return !!(usuario && this.SEED_HASHES[String(usuario.email || '').toLowerCase()] === usuario.password);
    }

    /**
     * Promueve a administrador local SOLO si el proveedor de identidad ya
     * validó ese mismo email como admin. Nunca acepta un rol arbitrario del
     * cliente: sin perfil verificado no hace nada.
     */
    static sincronizarAdminRemotoVerificado(email) {
        const remoto = this.perfilRemotoVerificado();
        if (!remoto || remoto.role !== 'admin') return false;
        const emailRemoto = String(remoto.email || '').toLowerCase();
        const emailLocal = String(email || '').toLowerCase();
        if (!emailRemoto || emailRemoto !== emailLocal) return false;
        const usuarios = this.getUsers();
        const idx = usuarios.findIndex(u => String(u.email || '').toLowerCase() === emailLocal);
        if (idx < 0) return false;
        const config = this.ROLES.admin;
        if (usuarios[idx].role === 'admin') return true;
        usuarios[idx].role = 'admin';
        usuarios[idx].nivel = config ? config.nivel : 100;
        usuarios[idx].permisos = JSON.parse(JSON.stringify(config ? config.permisos : {}));
        this.saveUsers(usuarios);
        if (this._currentUser && this._currentUser.id === usuarios[idx].id) {
            this._currentUser = usuarios[idx];
        }
        return true;
    }

    static esAdmin() {
        const usuario = this.getCurrentUser();
        if (!usuario || !usuario.active || usuario.role !== 'admin') return false;
        const remoto = this.perfilRemotoVerificado();
        if (remoto) {
            const emailRemoto = String(remoto.email || '').toLowerCase();
            const emailLocal = String(usuario.email || '').toLowerCase();
            const mismoUsuario = remoto.id === usuario.id || remoto.id === usuario.idRemoto
                || (emailRemoto && emailRemoto === emailLocal);
            return mismoUsuario && remoto.role === 'admin';
        }
        // Sin proveedor remoto, sólo las credenciales demo semilla pueden ser admin local.
        return this.cuentaSemillaConfiable(usuario);
    }

    static esProjectManager() {
        const usuario = this.getCurrentUser();
        return !!usuario && usuario.active && (this.esAdmin() || usuario.role === 'project_manager');
    }

    static tienePermiso(permiso) {
        const usuario = this.getCurrentUser();
        if (!usuario || !usuario.active) return false;
        if (this.esAdmin()) return true;

        return usuario.permisos && usuario.permisos[permiso] === true;
    }

    static tieneAccion(accion) {
        const usuario = this.getCurrentUser();
        if (!usuario || !usuario.active) return false;
        if (this.esAdmin()) return true;

        return usuario.permisos &&
               usuario.permisos.acciones &&
               usuario.permisos.acciones[accion] === true;
    }

    // ============================================================
    // PERMISOS POR PROYECTO
    // ============================================================

    static tieneAccesoProyecto(proyectoId) {
        const usuario = this.getCurrentUser();
        if (!usuario || !usuario.active) return false;
        if (this.esAdmin()) return true;

        const proyectosAsignados = Array.isArray(usuario.proyectosAsignados) ? usuario.proyectosAsignados : [];
        return proyectosAsignados.map(p => String(p)).includes(String(proyectoId));
    }

    static getNivelAccesoModulo(proyectoId, moduloId) {
        const usuario = this.getCurrentUser();
        if (!usuario || !usuario.active) return 'none';
        if (this.esAdmin()) return 'edit';

        if (!this.tieneAccesoProyecto(proyectoId)) return 'none';

        const permisosProyectos = usuario.permisosProyectos || {};
        const permisosProyecto = permisosProyectos[proyectoId] || {};

        // Fail-closed: sin permisos explícitos no se concede acceso por defecto.
        if (Object.keys(permisosProyecto).length === 0) {
            return 'none';
        }

        return permisosProyecto[moduloId] || 'none';
    }

    static tieneAccesoModulo(proyectoId, moduloId) {
        return this.getNivelAccesoModulo(proyectoId, moduloId) !== 'none';
    }

    static puedeEditarModulo(proyectoId, moduloId) {
        return this.getNivelAccesoModulo(proyectoId, moduloId) === 'edit';
    }

    static getProyectosAsignados() {
        const usuario = this.getCurrentUser();
        if (!usuario) return [];
        if (this.esAdmin()) return null; // null = todos los proyectos

        return Array.isArray(usuario.proyectosAsignados) ? usuario.proyectosAsignados : [];
    }

    // ============================================================
    // GESTIÓN DE PERMISOS (SOLO ADMIN)
    // ============================================================

    static asignarProyectosAUsuario(userId, proyectosIds) {
        if (!this.esAdmin()) {
            return { success: false, error: 'Solo el administrador puede asignar proyectos' };
        }

        const usuario = this.findUserById(userId);
        if (!usuario) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        if (usuario.role === 'admin') {
            return { success: false, error: 'No se pueden modificar permisos del administrador' };
        }

        usuario.proyectosAsignados = proyectosIds.map(id => parseInt(id));
        usuario.updatedAt = new Date().toISOString();
        this.updateUser(usuario);

        return { success: true };
    }

    static configurarPermisosProyecto(userId, proyectoId, permisosModulos) {
        if (!this.esAdmin()) {
            return { success: false, error: 'Solo el administrador puede configurar permisos' };
        }

        const usuario = this.findUserById(userId);
        if (!usuario) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        if (usuario.role === 'admin') {
            return { success: false, error: 'No se pueden modificar permisos del administrador' };
        }

        if (!usuario.proyectosAsignados.includes(parseInt(proyectoId))) {
            return { success: false, error: 'El usuario no tiene acceso a este proyecto' };
        }

        // Validar valores permitidos
        const valoresValidos = ['none', 'view', 'edit'];
        for (const key in permisosModulos) {
            if (!valoresValidos.includes(permisosModulos[key])) {
                return { success: false, error: `Valor inválido para módulo ${key}: ${permisosModulos[key]}` };
            }
        }

        if (!usuario.permisosProyectos) {
            usuario.permisosProyectos = {};
        }

        usuario.permisosProyectos[proyectoId] = permisosModulos;
        usuario.updatedAt = new Date().toISOString();
        this.updateUser(usuario);

        return { success: true };
    }

    static cambiarRolUsuario(userId, nuevoRol) {
        if (!this.esAdmin()) {
            return { success: false, error: 'Solo el administrador puede cambiar roles' };
        }

        const usuario = this.findUserById(userId);
        if (!usuario) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        if (usuario.role === 'admin') {
            return { success: false, error: 'No se puede cambiar el rol del administrador' };
        }

        if (!this.ROLES[nuevoRol]) {
            return { success: false, error: 'Rol no válido' };
        }

        const roleConfig = this.ROLES[nuevoRol];
        usuario.role = nuevoRol;
        usuario.nivel = roleConfig.nivel;
        usuario.permisos = JSON.parse(JSON.stringify(roleConfig.permisos));
        usuario.updatedAt = new Date().toISOString();
        this.updateUser(usuario);

        return { success: true };
    }

    static desactivarUsuario(userId) {
        if (!this.esAdmin()) {
            return { success: false, error: 'Solo el administrador puede desactivar usuarios' };
        }

        const usuario = this.findUserById(userId);
        if (!usuario) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        if (usuario.role === 'admin') {
            const admins = this.getUsers().filter(u => u.role === 'admin' && u.active);
            if (admins.length <= 1) {
                return { success: false, error: 'No se puede desactivar al único administrador' };
            }
        }

        usuario.active = !usuario.active;
        usuario.updatedAt = new Date().toISOString();
        this.updateUser(usuario);

        return { success: true };
    }

    static eliminarUsuario(userId) {
        if (!this.esAdmin()) {
            return { success: false, error: 'Solo el administrador puede eliminar usuarios' };
        }

        const usuario = this.findUserById(userId);
        if (!usuario) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        if (usuario.role === 'admin') {
            const admins = this.getUsers().filter(u => u.role === 'admin' && u.active);
            if (admins.length <= 1) {
                return { success: false, error: 'No se puede eliminar al único administrador' };
            }
        }

        const usuarios = this.getUsers();
        const filtered = usuarios.filter(u => u.id !== userId);
        this.saveUsers(filtered);

        return { success: true };
    }

    // ============================================================
    // EXPORTAR DATOS
    // ============================================================

    static exportarDatos() {
        if (!this.esAdmin()) {
            return { success: false, error: 'Solo el administrador puede exportar datos' };
        }

        return {
            success: true,
            data: {
                usuarios: this.getUsers(),
                roles: this.ROLES,
                modulos: this.MODULOS,
                fechaExportacion: new Date().toISOString()
            }
        };
    }

    static getModulos() {
        return this.MODULOS;
    }
}

// ============================================================
// INICIALIZAR
// ============================================================

AuthSystem.init();

// Exponer globalmente
window.AuthSystem = AuthSystem;

console.log(' Sistema de autenticación v3.0 cargado');
console.log(' Usuario actual:', AuthSystem.getCurrentUser()?.nombre || 'Ninguno');
console.log(' Roles disponibles:', Object.keys(AuthSystem.ROLES));
console.log(' Módulos disponibles:', Object.keys(AuthSystem.MODULOS).length);