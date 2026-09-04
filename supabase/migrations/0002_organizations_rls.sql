-- ============================================================
-- PMI Mind — Row Level Security (RLS)
-- Migración 0002: habilitar RLS + funciones helper de membresía
-- ============================================================
-- Contenido:
--   1. Funciones helper de membresía (SECURITY DEFINER)
--   2. ALTER TABLE ... ENABLE ROW LEVEL SECURITY en las 23 tablas
--   3. GRANT EXECUTE de las funciones helper a authenticated
--
-- Convenciones:
--   - Las funciones helper son SECURITY DEFINER (owner = postgres,
--     que es quien ejecuta las migraciones en Supabase) para poder
--     leer organization_members / project_members desde las políticas
--     sin recursión de RLS.
--   - search_path fijado a public; todas las referencias a tablas
--     van cualificadas (public.*).
--   - Los parámetros usan prefijo p_ para evitar colisión con los
--     nombres de columna (p.ej. project_id en project_members).
--   - Las políticas se crean en la migración 0003.
--   - Migración idempotente: CREATE OR REPLACE FUNCTION y
--     ENABLE ROW LEVEL SECURITY son no-op si ya existen.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Funciones helper de membresía
-- ------------------------------------------------------------

-- ¿Es el usuario actual miembro de la organización?
CREATE OR REPLACE FUNCTION public.is_org_member(p_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.organization_members
        WHERE organization_id = p_org_id
          AND user_id = auth.uid()
    );
$$;

-- ¿Es el usuario actual admin u owner de la organización?
CREATE OR REPLACE FUNCTION public.is_org_admin(p_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.organization_members
        WHERE organization_id = p_org_id
          AND user_id = auth.uid()
          AND role IN ('owner', 'admin')
    );
$$;

-- ¿Es el usuario actual owner de la organización?
CREATE OR REPLACE FUNCTION public.is_org_owner(p_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.organization_members
        WHERE organization_id = p_org_id
          AND user_id = auth.uid()
          AND role = 'owner'
    );
$$;

-- ¿Es el usuario actual miembro del proyecto?
CREATE OR REPLACE FUNCTION public.is_project_member(p_project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.project_members
        WHERE project_id = p_project_id
          AND user_id = auth.uid()
    );
$$;

-- ¿Es el usuario actual admin del proyecto?
CREATE OR REPLACE FUNCTION public.is_project_admin(p_project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.project_members
        WHERE project_id = p_project_id
          AND user_id = auth.uid()
          AND role = 'admin'
    );
$$;

-- Organización actual del usuario (de profiles, con fallback a
-- organization_members por si el perfil aún no existe).
CREATE OR REPLACE FUNCTION public.current_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(
        (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid()),
        (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id = auth.uid() LIMIT 1)
    );
$$;

-- ------------------------------------------------------------
-- 2. Habilitar RLS en todas las tablas públicas (23 tablas)
-- ------------------------------------------------------------

-- Núcleo multi-tenant
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Tablas de dominio del blob projects.data (14 tablas)
ALTER TABLE public.project_stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_equipo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_materiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_procesos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_hitos_financieros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_elementos_gantt ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_riesgos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comunicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_reuniones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_viajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_avales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_seguros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_garantia ENABLE ROW LEVEL SECURITY;

-- Tablas migradas de SQLite
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_eventos ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 3. GRANT EXECUTE de las funciones helper
-- ------------------------------------------------------------
-- Las políticas se evalúan con el rol `authenticated`; el EXECUTE
-- por defecto ya lo permite (PUBLIC), pero se explicita para que
-- quede documentado y a prueba de cambios de defaults.

GRANT EXECUTE ON FUNCTION public.is_org_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_owner(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_project_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_project_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_org_id() TO authenticated;

-- ============================================================
-- Fin de la migración 0002
-- ============================================================