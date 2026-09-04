-- ============================================================
-- PMI Mind — Esquema multi-tenant Supabase
-- Migración 0001: esquema inicial
-- ============================================================
-- Contenido:
--   1. Extensiones y helpers (pgcrypto, trigger updated_at)
--   2. Núcleo multi-tenant: organizations, organization_members, profiles
--   3. Proyectos: projects, project_members
--   4. Tablas de dominio del blob projects.data (14 tablas)
--   5. Tablas migradas de SQLite: notifications, catalog_materials,
--      catalog_team_members, agenda_eventos
--   6. Índices
--   7. Triggers updated_at
--
-- Convenciones:
--   - Toda tabla de negocio lleva organization_id (multi-tenant).
--   - Las tablas de dominio guardan los campos específicos del
--     frontend en `data jsonb` para no perder ninguna función.
--   - RLS se añadirá en migraciones posteriores (tareas 5-6);
--     este esquema ya está preparado (organization_id + FKs a auth.users).
--   - Migración idempotente: CREATE ... IF NOT EXISTS.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Extensiones y helpers
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Trigger que mantiene updated_at automáticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- 2. Núcleo multi-tenant
-- ------------------------------------------------------------

-- Organizaciones (tenant raíz)
CREATE TABLE IF NOT EXISTS public.organizations (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name        text NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.organizations IS 'Organizaciones (tenants). Cada fila de negocio pertenece a una organización.';

-- Miembros de una organización (vinculados a auth.users)
CREATE TABLE IF NOT EXISTS public.organization_members (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role            text NOT NULL DEFAULT 'editor'
                    CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (organization_id, user_id)
);

COMMENT ON TABLE public.organization_members IS 'Miembros de cada organización con su rol (owner/admin/editor/viewer).';

-- Perfiles de usuario (1:1 con auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    email           text,
    name            text,
    role            text NOT NULL DEFAULT 'editor'
                    CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Perfil público de cada usuario, vinculado a auth.users y a su organización.';

-- ------------------------------------------------------------
-- 3. Proyectos
-- ------------------------------------------------------------

-- Proyectos: columnas genéricas + data jsonb con el resto del blob
CREATE TABLE IF NOT EXISTS public.projects (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id  uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name             text NOT NULL,
    description      text NOT NULL DEFAULT '',
    moneda_base      text NOT NULL DEFAULT 'EUR',
    moneda_venta     text NOT NULL DEFAULT 'EUR',
    precio_venta     numeric(14,2) NOT NULL DEFAULT 0,
    condiciones_pago text NOT NULL DEFAULT '',
    fecha_inicio     date,
    data             jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.projects IS 'Proyectos. Las columnas tipadas cubren los campos principales del blob projects.data; el resto vive en data jsonb.';

-- Miembros de un proyecto (compartir)
CREATE TABLE IF NOT EXISTS public.project_members (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role            text NOT NULL DEFAULT 'editor'
                    CHECK (role IN ('admin', 'editor', 'viewer')),
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (project_id, user_id)
);

COMMENT ON TABLE public.project_members IS 'Usuarios con acceso a cada proyecto y su rol (admin/editor/viewer).';

-- ------------------------------------------------------------
-- 4. Tablas de dominio del blob projects.data
-- ------------------------------------------------------------
-- Cada dominio del blob se normaliza en una tabla con
-- (id, organization_id, project_id, data jsonb, created_at, updated_at).
-- `data` preserva TODOS los campos que usa el frontend
-- (stakeholders, equipo, materiales, servicios, procesos,
--  hitosFinancieros, elementosGantt, riesgos, comunicaciones,
--  reuniones, viajes, avales, seguros, garantia).

CREATE TABLE IF NOT EXISTS public.project_stakeholders (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    data            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_equipo (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    data            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_materiales (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    data            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_servicios (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    data            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_procesos (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    data            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_hitos_financieros (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    data            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_elementos_gantt (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    data            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_riesgos (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    data            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_comunicaciones (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    data            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_reuniones (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    data            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_viajes (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    data            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_avales (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    data            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_seguros (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    data            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

-- garantia es un OBJETO (no array): una fila por proyecto
CREATE TABLE IF NOT EXISTS public.project_garantia (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    data            jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 5. Tablas migradas de SQLite
-- ------------------------------------------------------------

-- Notificaciones
CREATE TABLE IF NOT EXISTS public.notifications (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    type            text NOT NULL,
    title           text NOT NULL,
    message         text NOT NULL DEFAULT '',
    data            jsonb NOT NULL DEFAULT '{}'::jsonb,
    is_read         boolean NOT NULL DEFAULT false,
    created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.notifications IS 'Notificaciones por usuario (migrada de la tabla SQLite notifications).';

-- Catálogo de materiales
CREATE TABLE IF NOT EXISTS public.catalog_materials (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre          text NOT NULL,
    proveedor       text NOT NULL DEFAULT '',
    part_number     text NOT NULL DEFAULT '',
    hs_code         text NOT NULL DEFAULT '',
    peso_unitario   numeric(12,3) NOT NULL DEFAULT 0,
    coste_unitario  numeric(14,2) NOT NULL DEFAULT 0,
    moneda          text NOT NULL DEFAULT 'EUR',
    pais_origen     text NOT NULL DEFAULT '',
    incoterm        text NOT NULL DEFAULT 'CIF',
    notas           text NOT NULL DEFAULT '',
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.catalog_materials IS 'Catálogo de materiales (migrada de la tabla SQLite catalog_materials).';

-- Catálogo de miembros de equipo
CREATE TABLE IF NOT EXISTS public.catalog_team_members (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre          text NOT NULL,
    rol             text NOT NULL DEFAULT '',
    email           text NOT NULL DEFAULT '',
    telefono        text NOT NULL DEFAULT '',
    foto            text NOT NULL DEFAULT '',
    coste_hora      numeric(12,2) NOT NULL DEFAULT 0,
    moneda          text NOT NULL DEFAULT 'EUR',
    horas_mes       integer NOT NULL DEFAULT 160,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.catalog_team_members IS 'Catálogo de miembros de equipo (migrada de la tabla SQLite catalog_team_members).';

-- Agenda de eventos
CREATE TABLE IF NOT EXISTS public.agenda_eventos (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id      uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    fecha_inicio    date NOT NULL,
    fecha_fin       date NOT NULL,
    hora_inicio     text NOT NULL DEFAULT '09:00',
    hora_fin        text NOT NULL DEFAULT '10:00',
    titulo          text NOT NULL,
    descripcion     text NOT NULL DEFAULT '',
    categoria       text NOT NULL DEFAULT 'otro',
    es_alarma       boolean NOT NULL DEFAULT false,
    hito_id         uuid,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.agenda_eventos IS 'Eventos de agenda (migrada de la tabla SQLite agenda). hito_id referencia un hito del blob hitosFinancieros (sin FK: vive en jsonb).';

-- ------------------------------------------------------------
-- 6. Índices
-- ------------------------------------------------------------

-- organizations / organization_members
CREATE INDEX IF NOT EXISTS idx_organization_members_organization_id
    ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id
    ON public.organization_members(user_id);

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id
    ON public.profiles(organization_id);

-- projects
CREATE INDEX IF NOT EXISTS idx_projects_organization_id
    ON public.projects(organization_id);

-- project_members
CREATE INDEX IF NOT EXISTS idx_project_members_organization_id
    ON public.project_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id
    ON public.project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id
    ON public.project_members(user_id);

-- Tablas de dominio: índice en organization_id y project_id
CREATE INDEX IF NOT EXISTS idx_project_stakeholders_organization_id
    ON public.project_stakeholders(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_stakeholders_project_id
    ON public.project_stakeholders(project_id);

CREATE INDEX IF NOT EXISTS idx_project_equipo_organization_id
    ON public.project_equipo(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_equipo_project_id
    ON public.project_equipo(project_id);

CREATE INDEX IF NOT EXISTS idx_project_materiales_organization_id
    ON public.project_materiales(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_materiales_project_id
    ON public.project_materiales(project_id);

CREATE INDEX IF NOT EXISTS idx_project_servicios_organization_id
    ON public.project_servicios(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_servicios_project_id
    ON public.project_servicios(project_id);

CREATE INDEX IF NOT EXISTS idx_project_procesos_organization_id
    ON public.project_procesos(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_procesos_project_id
    ON public.project_procesos(project_id);

CREATE INDEX IF NOT EXISTS idx_project_hitos_financieros_organization_id
    ON public.project_hitos_financieros(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_hitos_financieros_project_id
    ON public.project_hitos_financieros(project_id);

CREATE INDEX IF NOT EXISTS idx_project_elementos_gantt_organization_id
    ON public.project_elementos_gantt(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_elementos_gantt_project_id
    ON public.project_elementos_gantt(project_id);

CREATE INDEX IF NOT EXISTS idx_project_riesgos_organization_id
    ON public.project_riesgos(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_riesgos_project_id
    ON public.project_riesgos(project_id);

CREATE INDEX IF NOT EXISTS idx_project_comunicaciones_organization_id
    ON public.project_comunicaciones(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_comunicaciones_project_id
    ON public.project_comunicaciones(project_id);

CREATE INDEX IF NOT EXISTS idx_project_reuniones_organization_id
    ON public.project_reuniones(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_reuniones_project_id
    ON public.project_reuniones(project_id);

CREATE INDEX IF NOT EXISTS idx_project_viajes_organization_id
    ON public.project_viajes(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_viajes_project_id
    ON public.project_viajes(project_id);

CREATE INDEX IF NOT EXISTS idx_project_avales_organization_id
    ON public.project_avales(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_avales_project_id
    ON public.project_avales(project_id);

CREATE INDEX IF NOT EXISTS idx_project_seguros_organization_id
    ON public.project_seguros(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_seguros_project_id
    ON public.project_seguros(project_id);

CREATE INDEX IF NOT EXISTS idx_project_garantia_organization_id
    ON public.project_garantia(organization_id);
CREATE INDEX IF NOT EXISTS idx_project_garantia_project_id
    ON public.project_garantia(project_id);

-- notifications
CREATE INDEX IF NOT EXISTS idx_notifications_organization_id
    ON public.notifications(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id
    ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read
    ON public.notifications(user_id, is_read);

-- catalog_materials
CREATE INDEX IF NOT EXISTS idx_catalog_materials_organization_id
    ON public.catalog_materials(organization_id);
CREATE INDEX IF NOT EXISTS idx_catalog_materials_user_id
    ON public.catalog_materials(user_id);

-- catalog_team_members
CREATE INDEX IF NOT EXISTS idx_catalog_team_members_organization_id
    ON public.catalog_team_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_catalog_team_members_user_id
    ON public.catalog_team_members(user_id);

-- agenda_eventos
CREATE INDEX IF NOT EXISTS idx_agenda_eventos_organization_id
    ON public.agenda_eventos(organization_id);
CREATE INDEX IF NOT EXISTS idx_agenda_eventos_project_id
    ON public.agenda_eventos(project_id);
CREATE INDEX IF NOT EXISTS idx_agenda_eventos_project_fecha
    ON public.agenda_eventos(project_id, fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_agenda_eventos_user_id
    ON public.agenda_eventos(user_id);

-- ------------------------------------------------------------
-- 7. Triggers updated_at
-- ------------------------------------------------------------
-- PostgreSQL no soporta CREATE TRIGGER IF NOT EXISTS; se usa el
-- patrón idempotente DROP TRIGGER IF EXISTS + CREATE TRIGGER.

DROP TRIGGER IF EXISTS set_updated_at_organizations ON public.organizations;
CREATE TRIGGER set_updated_at_organizations
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_projects ON public.projects;
CREATE TRIGGER set_updated_at_projects
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_project_stakeholders ON public.project_stakeholders;
CREATE TRIGGER set_updated_at_project_stakeholders
    BEFORE UPDATE ON public.project_stakeholders
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_project_equipo ON public.project_equipo;
CREATE TRIGGER set_updated_at_project_equipo
    BEFORE UPDATE ON public.project_equipo
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_project_materiales ON public.project_materiales;
CREATE TRIGGER set_updated_at_project_materiales
    BEFORE UPDATE ON public.project_materiales
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_project_servicios ON public.project_servicios;
CREATE TRIGGER set_updated_at_project_servicios
    BEFORE UPDATE ON public.project_servicios
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_project_procesos ON public.project_procesos;
CREATE TRIGGER set_updated_at_project_procesos
    BEFORE UPDATE ON public.project_procesos
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_project_hitos_financieros ON public.project_hitos_financieros;
CREATE TRIGGER set_updated_at_project_hitos_financieros
    BEFORE UPDATE ON public.project_hitos_financieros
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_project_elementos_gantt ON public.project_elementos_gantt;
CREATE TRIGGER set_updated_at_project_elementos_gantt
    BEFORE UPDATE ON public.project_elementos_gantt
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_project_riesgos ON public.project_riesgos;
CREATE TRIGGER set_updated_at_project_riesgos
    BEFORE UPDATE ON public.project_riesgos
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_project_comunicaciones ON public.project_comunicaciones;
CREATE TRIGGER set_updated_at_project_comunicaciones
    BEFORE UPDATE ON public.project_comunicaciones
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_project_reuniones ON public.project_reuniones;
CREATE TRIGGER set_updated_at_project_reuniones
    BEFORE UPDATE ON public.project_reuniones
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_project_viajes ON public.project_viajes;
CREATE TRIGGER set_updated_at_project_viajes
    BEFORE UPDATE ON public.project_viajes
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_project_avales ON public.project_avales;
CREATE TRIGGER set_updated_at_project_avales
    BEFORE UPDATE ON public.project_avales
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_project_seguros ON public.project_seguros;
CREATE TRIGGER set_updated_at_project_seguros
    BEFORE UPDATE ON public.project_seguros
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_project_garantia ON public.project_garantia;
CREATE TRIGGER set_updated_at_project_garantia
    BEFORE UPDATE ON public.project_garantia
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_catalog_materials ON public.catalog_materials;
CREATE TRIGGER set_updated_at_catalog_materials
    BEFORE UPDATE ON public.catalog_materials
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_catalog_team_members ON public.catalog_team_members;
CREATE TRIGGER set_updated_at_catalog_team_members
    BEFORE UPDATE ON public.catalog_team_members
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_agenda_eventos ON public.agenda_eventos;
CREATE TRIGGER set_updated_at_agenda_eventos
    BEFORE UPDATE ON public.agenda_eventos
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Fin de la migración 0001
-- ============================================================