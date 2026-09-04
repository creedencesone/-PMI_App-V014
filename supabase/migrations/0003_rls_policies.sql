-- ============================================================
-- PMI Mind — Row Level Security (RLS)
-- Migración 0003: políticas RLS por organización
-- ============================================================
-- Contenido:
--   1. organizations / organization_members / profiles
--   2. projects / project_members
--   3. Tablas de dominio del blob projects.data (14 tablas)
--   4. Tablas migradas de SQLite (notifications, catalog_materials,
--      catalog_team_members, agenda_eventos)
--
-- Convenciones:
--   - Toda política va precedida de DROP POLICY IF EXISTS
--     (idempotencia).
--   - Nombres consistentes: p_<tabla>_<operación>.
--   - Rol objetivo: `authenticated` (los usuarios de la app).
--     `anon` y `service_role` quedan fuera: anon no tiene políticas
--     (denegado por defecto) y service_role tiene BYPASSRLS.
--   - Base de acceso: public.is_org_member(organization_id).
--   - projects y project_members respetan además la membresía de
--     proyecto (is_project_member / is_project_admin).
--   - Las funciones helper son SECURITY DEFINER (migración 0002),
--     por lo que no hay recursión de RLS al evaluarlas.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Núcleo multi-tenant
-- ------------------------------------------------------------

-- organizations: SELECT si eres miembro; INSERT solo si aún no
-- perteneces a ninguna org (bootstrap de la primera); UPDATE/DELETE
-- solo el owner.
DROP POLICY IF EXISTS p_organizations_select ON public.organizations;
CREATE POLICY p_organizations_select ON public.organizations
    FOR SELECT TO authenticated
    USING (public.is_org_member(id));

DROP POLICY IF EXISTS p_organizations_insert ON public.organizations;
CREATE POLICY p_organizations_insert ON public.organizations
    FOR INSERT TO authenticated
    WITH CHECK (
        NOT EXISTS (
            SELECT 1 FROM public.organization_members om
            WHERE om.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS p_organizations_update ON public.organizations;
CREATE POLICY p_organizations_update ON public.organizations
    FOR UPDATE TO authenticated
    USING (public.is_org_owner(id))
    WITH CHECK (public.is_org_owner(id));

DROP POLICY IF EXISTS p_organizations_delete ON public.organizations;
CREATE POLICY p_organizations_delete ON public.organizations
    FOR DELETE TO authenticated
    USING (public.is_org_owner(id));

-- organization_members: SELECT si eres tú o miembro de la org;
-- INSERT si te auto-alta como owner de una org nueva (bootstrap) o
-- eres admin/owner de la org; UPDATE/DELETE solo admin/owner.
DROP POLICY IF EXISTS p_organization_members_select ON public.organization_members;
CREATE POLICY p_organization_members_select ON public.organization_members
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_organization_members_insert ON public.organization_members;
CREATE POLICY p_organization_members_insert ON public.organization_members
    FOR INSERT TO authenticated
    WITH CHECK (
        (user_id = auth.uid() AND role = 'owner' AND NOT EXISTS (
            SELECT 1 FROM public.organization_members om
            WHERE om.user_id = auth.uid()
        ))
        OR public.is_org_admin(organization_id)
    );

DROP POLICY IF EXISTS p_organization_members_update ON public.organization_members;
CREATE POLICY p_organization_members_update ON public.organization_members
    FOR UPDATE TO authenticated
    USING (public.is_org_admin(organization_id))
    WITH CHECK (public.is_org_admin(organization_id));

DROP POLICY IF EXISTS p_organization_members_delete ON public.organization_members;
CREATE POLICY p_organization_members_delete ON public.organization_members
    FOR DELETE TO authenticated
    USING (public.is_org_admin(organization_id));

-- profiles: SELECT si eres tú o miembro de la misma org;
-- INSERT/UPDATE/DELETE solo sobre tu propio perfil (id = auth.uid()).
DROP POLICY IF EXISTS p_profiles_select ON public.profiles;
CREATE POLICY p_profiles_select ON public.profiles
    FOR SELECT TO authenticated
    USING (id = auth.uid() OR public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_profiles_insert ON public.profiles;
CREATE POLICY p_profiles_insert ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS p_profiles_update ON public.profiles;
CREATE POLICY p_profiles_update ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS p_profiles_delete ON public.profiles;
CREATE POLICY p_profiles_delete ON public.profiles
    FOR DELETE TO authenticated
    USING (id = auth.uid());

-- ------------------------------------------------------------
-- 2. Proyectos
-- ------------------------------------------------------------

-- projects: SELECT si eres miembro de la org o del proyecto;
-- INSERT si eres miembro de la org; UPDATE/DELETE si eres miembro
-- de la org o admin del proyecto.
DROP POLICY IF EXISTS p_projects_select ON public.projects;
CREATE POLICY p_projects_select ON public.projects
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id) OR public.is_project_member(id));

DROP POLICY IF EXISTS p_projects_insert ON public.projects;
CREATE POLICY p_projects_insert ON public.projects
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_projects_update ON public.projects;
CREATE POLICY p_projects_update ON public.projects
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id) OR public.is_project_admin(id))
    WITH CHECK (public.is_org_member(organization_id) OR public.is_project_admin(id));

DROP POLICY IF EXISTS p_projects_delete ON public.projects;
CREATE POLICY p_projects_delete ON public.projects
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id) OR public.is_project_admin(id));

-- project_members: SELECT si eres miembro de la org o eres tú la
-- fila (para ver tu propia membresía); INSERT/UPDATE/DELETE solo
-- admin/owner de la org o admin del proyecto.
DROP POLICY IF EXISTS p_project_members_select ON public.project_members;
CREATE POLICY p_project_members_select ON public.project_members
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id) OR user_id = auth.uid());

DROP POLICY IF EXISTS p_project_members_insert ON public.project_members;
CREATE POLICY p_project_members_insert ON public.project_members
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_admin(organization_id) OR public.is_project_admin(project_id));

DROP POLICY IF EXISTS p_project_members_update ON public.project_members;
CREATE POLICY p_project_members_update ON public.project_members
    FOR UPDATE TO authenticated
    USING (public.is_org_admin(organization_id) OR public.is_project_admin(project_id))
    WITH CHECK (public.is_org_admin(organization_id) OR public.is_project_admin(project_id));

DROP POLICY IF EXISTS p_project_members_delete ON public.project_members;
CREATE POLICY p_project_members_delete ON public.project_members
    FOR DELETE TO authenticated
    USING (public.is_org_admin(organization_id) OR public.is_project_admin(project_id));

-- ------------------------------------------------------------
-- 3. Tablas de dominio del blob projects.data (14 tablas)
-- ------------------------------------------------------------
-- Patrón idéntico: acceso por membresía de organización.
-- (La granularidad por proyecto está disponible vía
-- is_project_member si se quisiera restringir más adelante.)

DROP POLICY IF EXISTS p_project_stakeholders_select ON public.project_stakeholders;
CREATE POLICY p_project_stakeholders_select ON public.project_stakeholders
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_stakeholders_insert ON public.project_stakeholders;
CREATE POLICY p_project_stakeholders_insert ON public.project_stakeholders
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_stakeholders_update ON public.project_stakeholders;
CREATE POLICY p_project_stakeholders_update ON public.project_stakeholders
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_stakeholders_delete ON public.project_stakeholders;
CREATE POLICY p_project_stakeholders_delete ON public.project_stakeholders
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_equipo_select ON public.project_equipo;
CREATE POLICY p_project_equipo_select ON public.project_equipo
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_equipo_insert ON public.project_equipo;
CREATE POLICY p_project_equipo_insert ON public.project_equipo
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_equipo_update ON public.project_equipo;
CREATE POLICY p_project_equipo_update ON public.project_equipo
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_equipo_delete ON public.project_equipo;
CREATE POLICY p_project_equipo_delete ON public.project_equipo
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_materiales_select ON public.project_materiales;
CREATE POLICY p_project_materiales_select ON public.project_materiales
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_materiales_insert ON public.project_materiales;
CREATE POLICY p_project_materiales_insert ON public.project_materiales
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_materiales_update ON public.project_materiales;
CREATE POLICY p_project_materiales_update ON public.project_materiales
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_materiales_delete ON public.project_materiales;
CREATE POLICY p_project_materiales_delete ON public.project_materiales
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_servicios_select ON public.project_servicios;
CREATE POLICY p_project_servicios_select ON public.project_servicios
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_servicios_insert ON public.project_servicios;
CREATE POLICY p_project_servicios_insert ON public.project_servicios
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_servicios_update ON public.project_servicios;
CREATE POLICY p_project_servicios_update ON public.project_servicios
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_servicios_delete ON public.project_servicios;
CREATE POLICY p_project_servicios_delete ON public.project_servicios
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_procesos_select ON public.project_procesos;
CREATE POLICY p_project_procesos_select ON public.project_procesos
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_procesos_insert ON public.project_procesos;
CREATE POLICY p_project_procesos_insert ON public.project_procesos
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_procesos_update ON public.project_procesos;
CREATE POLICY p_project_procesos_update ON public.project_procesos
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_procesos_delete ON public.project_procesos;
CREATE POLICY p_project_procesos_delete ON public.project_procesos
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_hitos_financieros_select ON public.project_hitos_financieros;
CREATE POLICY p_project_hitos_financieros_select ON public.project_hitos_financieros
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_hitos_financieros_insert ON public.project_hitos_financieros;
CREATE POLICY p_project_hitos_financieros_insert ON public.project_hitos_financieros
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_hitos_financieros_update ON public.project_hitos_financieros;
CREATE POLICY p_project_hitos_financieros_update ON public.project_hitos_financieros
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_hitos_financieros_delete ON public.project_hitos_financieros;
CREATE POLICY p_project_hitos_financieros_delete ON public.project_hitos_financieros
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_elementos_gantt_select ON public.project_elementos_gantt;
CREATE POLICY p_project_elementos_gantt_select ON public.project_elementos_gantt
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_elementos_gantt_insert ON public.project_elementos_gantt;
CREATE POLICY p_project_elementos_gantt_insert ON public.project_elementos_gantt
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_elementos_gantt_update ON public.project_elementos_gantt;
CREATE POLICY p_project_elementos_gantt_update ON public.project_elementos_gantt
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_elementos_gantt_delete ON public.project_elementos_gantt;
CREATE POLICY p_project_elementos_gantt_delete ON public.project_elementos_gantt
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_riesgos_select ON public.project_riesgos;
CREATE POLICY p_project_riesgos_select ON public.project_riesgos
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_riesgos_insert ON public.project_riesgos;
CREATE POLICY p_project_riesgos_insert ON public.project_riesgos
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_riesgos_update ON public.project_riesgos;
CREATE POLICY p_project_riesgos_update ON public.project_riesgos
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_riesgos_delete ON public.project_riesgos;
CREATE POLICY p_project_riesgos_delete ON public.project_riesgos
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_comunicaciones_select ON public.project_comunicaciones;
CREATE POLICY p_project_comunicaciones_select ON public.project_comunicaciones
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_comunicaciones_insert ON public.project_comunicaciones;
CREATE POLICY p_project_comunicaciones_insert ON public.project_comunicaciones
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_comunicaciones_update ON public.project_comunicaciones;
CREATE POLICY p_project_comunicaciones_update ON public.project_comunicaciones
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_comunicaciones_delete ON public.project_comunicaciones;
CREATE POLICY p_project_comunicaciones_delete ON public.project_comunicaciones
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_reuniones_select ON public.project_reuniones;
CREATE POLICY p_project_reuniones_select ON public.project_reuniones
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_reuniones_insert ON public.project_reuniones;
CREATE POLICY p_project_reuniones_insert ON public.project_reuniones
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_reuniones_update ON public.project_reuniones;
CREATE POLICY p_project_reuniones_update ON public.project_reuniones
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_reuniones_delete ON public.project_reuniones;
CREATE POLICY p_project_reuniones_delete ON public.project_reuniones
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_viajes_select ON public.project_viajes;
CREATE POLICY p_project_viajes_select ON public.project_viajes
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_viajes_insert ON public.project_viajes;
CREATE POLICY p_project_viajes_insert ON public.project_viajes
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_viajes_update ON public.project_viajes;
CREATE POLICY p_project_viajes_update ON public.project_viajes
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_viajes_delete ON public.project_viajes;
CREATE POLICY p_project_viajes_delete ON public.project_viajes
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_avales_select ON public.project_avales;
CREATE POLICY p_project_avales_select ON public.project_avales
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_avales_insert ON public.project_avales;
CREATE POLICY p_project_avales_insert ON public.project_avales
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_avales_update ON public.project_avales;
CREATE POLICY p_project_avales_update ON public.project_avales
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_avales_delete ON public.project_avales;
CREATE POLICY p_project_avales_delete ON public.project_avales
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_seguros_select ON public.project_seguros;
CREATE POLICY p_project_seguros_select ON public.project_seguros
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_seguros_insert ON public.project_seguros;
CREATE POLICY p_project_seguros_insert ON public.project_seguros
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_seguros_update ON public.project_seguros;
CREATE POLICY p_project_seguros_update ON public.project_seguros
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_seguros_delete ON public.project_seguros;
CREATE POLICY p_project_seguros_delete ON public.project_seguros
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_garantia_select ON public.project_garantia;
CREATE POLICY p_project_garantia_select ON public.project_garantia
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_garantia_insert ON public.project_garantia;
CREATE POLICY p_project_garantia_insert ON public.project_garantia
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_garantia_update ON public.project_garantia;
CREATE POLICY p_project_garantia_update ON public.project_garantia
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_project_garantia_delete ON public.project_garantia;
CREATE POLICY p_project_garantia_delete ON public.project_garantia
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

-- ------------------------------------------------------------
-- 4. Tablas migradas de SQLite
-- ------------------------------------------------------------

-- notifications: SELECT/UPDATE/DELETE si eres miembro de la org o
-- la notificación es tuya (user_id); INSERT si eres miembro de la org.
DROP POLICY IF EXISTS p_notifications_select ON public.notifications;
CREATE POLICY p_notifications_select ON public.notifications
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id) OR user_id = auth.uid());

DROP POLICY IF EXISTS p_notifications_insert ON public.notifications;
CREATE POLICY p_notifications_insert ON public.notifications
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_notifications_update ON public.notifications;
CREATE POLICY p_notifications_update ON public.notifications
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id) OR user_id = auth.uid())
    WITH CHECK (public.is_org_member(organization_id) OR user_id = auth.uid());

DROP POLICY IF EXISTS p_notifications_delete ON public.notifications;
CREATE POLICY p_notifications_delete ON public.notifications
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id) OR user_id = auth.uid());

-- catalog_materials: catálogo compartido de la org.
DROP POLICY IF EXISTS p_catalog_materials_select ON public.catalog_materials;
CREATE POLICY p_catalog_materials_select ON public.catalog_materials
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_catalog_materials_insert ON public.catalog_materials;
CREATE POLICY p_catalog_materials_insert ON public.catalog_materials
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_catalog_materials_update ON public.catalog_materials;
CREATE POLICY p_catalog_materials_update ON public.catalog_materials
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_catalog_materials_delete ON public.catalog_materials;
CREATE POLICY p_catalog_materials_delete ON public.catalog_materials
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

-- catalog_team_members: catálogo compartido de la org.
DROP POLICY IF EXISTS p_catalog_team_members_select ON public.catalog_team_members;
CREATE POLICY p_catalog_team_members_select ON public.catalog_team_members
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_catalog_team_members_insert ON public.catalog_team_members;
CREATE POLICY p_catalog_team_members_insert ON public.catalog_team_members
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_catalog_team_members_update ON public.catalog_team_members;
CREATE POLICY p_catalog_team_members_update ON public.catalog_team_members
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_catalog_team_members_delete ON public.catalog_team_members;
CREATE POLICY p_catalog_team_members_delete ON public.catalog_team_members
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id));

-- agenda_eventos: SELECT/UPDATE/DELETE si eres miembro de la org o
-- el evento es tuyo (user_id); INSERT si eres miembro de la org.
DROP POLICY IF EXISTS p_agenda_eventos_select ON public.agenda_eventos;
CREATE POLICY p_agenda_eventos_select ON public.agenda_eventos
    FOR SELECT TO authenticated
    USING (public.is_org_member(organization_id) OR user_id = auth.uid());

DROP POLICY IF EXISTS p_agenda_eventos_insert ON public.agenda_eventos;
CREATE POLICY p_agenda_eventos_insert ON public.agenda_eventos
    FOR INSERT TO authenticated
    WITH CHECK (public.is_org_member(organization_id));

DROP POLICY IF EXISTS p_agenda_eventos_update ON public.agenda_eventos;
CREATE POLICY p_agenda_eventos_update ON public.agenda_eventos
    FOR UPDATE TO authenticated
    USING (public.is_org_member(organization_id) OR user_id = auth.uid())
    WITH CHECK (public.is_org_member(organization_id) OR user_id = auth.uid());

DROP POLICY IF EXISTS p_agenda_eventos_delete ON public.agenda_eventos;
CREATE POLICY p_agenda_eventos_delete ON public.agenda_eventos
    FOR DELETE TO authenticated
    USING (public.is_org_member(organization_id) OR user_id = auth.uid());

-- ============================================================
-- Fin de la migración 0003
-- ============================================================