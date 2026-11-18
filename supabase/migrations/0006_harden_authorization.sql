-- 0006 — Cierre de escaladas de autorización detectadas en la auditoría Ciclo 2.
-- Append-only: no reescribe migraciones previas.

CREATE OR REPLACE FUNCTION public.org_tiene_miembros(p_org_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.organization_members WHERE organization_id = p_org_id); $$;

REVOKE ALL ON FUNCTION public.org_tiene_miembros(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.org_tiene_miembros(uuid) TO authenticated;

-- Alta de owner: solo en una organización todavía sin miembros, o por un admin.
DROP POLICY IF EXISTS p_organization_members_insert ON public.organization_members;
CREATE POLICY p_organization_members_insert ON public.organization_members
    FOR INSERT TO authenticated
    WITH CHECK (
        (user_id = auth.uid() AND role = 'owner' AND NOT public.org_tiene_miembros(organization_id))
        OR public.is_org_admin(organization_id)
    );

-- Perfil: nunca puede auto-asignarse owner/admin ni cambiar de organización.
DROP POLICY IF EXISTS p_profiles_insert ON public.profiles;
CREATE POLICY p_profiles_insert ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (
        id = auth.uid()
        AND (role IN ('editor', 'viewer') OR public.is_org_admin(organization_id))
        AND public.is_org_member(organization_id)
    );

DROP POLICY IF EXISTS p_profiles_update ON public.profiles;
CREATE POLICY p_profiles_update ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid()
        AND (role IN ('editor', 'viewer') OR public.is_org_admin(organization_id))
        AND public.is_org_member(organization_id)
    );

CREATE OR REPLACE FUNCTION public.profiles_no_escalada()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND NOT public.is_org_admin(OLD.organization_id) THEN
        IF NEW.role IS DISTINCT FROM OLD.role OR NEW.organization_id IS DISTINCT FROM OLD.organization_id THEN
            RAISE EXCEPTION 'El perfil no puede cambiar rol u organización sin permisos de administrador';
        END IF;
    END IF;
    RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_profiles_no_escalada ON public.profiles;
CREATE TRIGGER trg_profiles_no_escalada
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.profiles_no_escalada();

-- Un project admin no puede reasignar el proyecto a otra organización.
CREATE OR REPLACE FUNCTION public.proyecto_org_original(p_project_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT organization_id FROM public.projects WHERE id = p_project_id; $$;

DROP POLICY IF EXISTS p_projects_update ON public.projects;
CREATE POLICY p_projects_update ON public.projects
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id) OR public.is_project_admin(id))
    WITH CHECK (
        (public.is_org_member(organization_id) OR public.is_project_admin(id))
        AND organization_id = public.proyecto_org_original(id)
    );
