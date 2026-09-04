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
    
    // ============================================================
    // USUARIO ADMIN POR DEFECTO
    // ============================================================
    
    static DEFAULT_ADMIN = {
        id: 'admin_001',
        email: 'admin@pmi.app',
        password: this.hashPassword('admin123'),
        nombre: 'Administrador',
        apellidos: '',
        telefono: '',
        role: 'admin',  // admin, project_manager, team_member, viewer
        nivel: 100,      // 100 = admin, 80 = PM, 50 = team, 20 = viewer
        createdAt: new Date().toISOString(),
        lastLogin: null,
        active: true,
        // Permisos base
        permisos: {
            // Generales
            ver: true,
            editar: true,
            eliminar: true,
            gestionarUsuarios: true,
            gestionarProyectos: true,
            exportarDatos: true,
            configurarSistema: true,
            // Acciones
            acciones: {
                crear: true,
                editar: true,
                eliminar: true,
                aprobar: true,
                exportar: true,
                importar: true,
                gestionarRoles: true
            }
        },
        // Proyectos asignados (solo para roles no-admin)
        proyectosAsignados: [],
        // Permisos por proyecto y módulo
        permisosProyectos: {}
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
        procesos: { nombre: ' Procesos PMBOK', icono: '' },
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
        informe: { nombre: ' Informes PMBOK', icono: '' }
    };

    // ============================================================
    // HASH DE CONTRASEÑA
    // ============================================================
    
    static hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hash_' + hash + '_' + btoa(password).slice(0, 10);
    }

    static verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    // ============================================================
    // INICIALIZACIÓN
    // ============================================================
    
    static init() {
        // Crear admin por defecto si no hay usuarios
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.saveUsers([this.DEFAULT_ADMIN]);
        }
        
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
    
    static register(email, password, nombre, apellidos = '', telefono = '', role = 'team_member') {
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
            password: this.hashPassword(password),
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

    static logout() {
        this._currentUser = null;
        localStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem('pmi_api_token');
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

    static esAdmin() {
        const usuario = this.getCurrentUser();
        return usuario && usuario.role === 'admin' && usuario.active;
    }

    static esProjectManager() {
        const usuario = this.getCurrentUser();
        return usuario && (usuario.role === 'admin' || usuario.role === 'project_manager') && usuario.active;
    }

    static tienePermiso(permiso) {
        const usuario = this.getCurrentUser();
        if (!usuario || !usuario.active) return false;
        if (usuario.role === 'admin') return true;
        
        return usuario.permisos && usuario.permisos[permiso] === true;
    }

    static tieneAccion(accion) {
        const usuario = this.getCurrentUser();
        if (!usuario || !usuario.active) return false;
        if (usuario.role === 'admin') return true;
        
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
        if (usuario.role === 'admin') return true;
        
        const proyectosAsignados = Array.isArray(usuario.proyectosAsignados) ? usuario.proyectosAsignados : [];
        return proyectosAsignados.map(p => String(p)).includes(String(proyectoId));
    }

    static getNivelAccesoModulo(proyectoId, moduloId) {
        const usuario = this.getCurrentUser();
        if (!usuario || !usuario.active) return 'none';
        if (usuario.role === 'admin') return 'edit';
        
        if (!this.tieneAccesoProyecto(proyectoId)) return 'none';
        
        const permisosProyectos = usuario.permisosProyectos || {};
        const permisosProyecto = permisosProyectos[proyectoId] || {};
        
        if (Object.keys(permisosProyecto).length === 0) {
            return 'edit';
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
        if (usuario.role === 'admin') return null; // null = todos los proyectos
        
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