-- ============================================================
-- PMI Mind — Dominios de gobernanza y adquisiciones
-- Migración 0005: tablas ausentes declaradas en DOMAIN_TABLES
-- ============================================================
-- Contenido:
--   1. 7 tablas de dominio con el mismo contrato que las 14 anteriores
--      (id uuid, organization_id, project_id, data jsonb, timestamps).
--   2. RLS por organización (authenticated; anon denegado por defecto).
--   3. Índice único parcial (project_id, data->>'id') para evitar duplicados.
--
-- Idempotente: CREATE TABLE IF NOT EXISTS, DROP/CREATE POLICY y
-- CREATE INDEX IF NOT EXISTS. La bitácora es append-only en la capa de
-- aplicación (js/core/audit.js) y aquí sólo expone SELECT/INSERT.
-- ============================================================

DO $$
DECLARE
    _tbl text;
    _tablas text[] := ARRAY[
        'project_lineas_base',
        'project_cambios',
        'project_bitacora',
        'project_proveedores',
        'project_contratos',
        'project_ordenes_compra',
        'project_pagos_realizados'
    ];
BEGIN
    FOREACH _tbl IN ARRAY _tablas LOOP
        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS public.%I (
                 id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                 organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
                 project_id      uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
                 data            jsonb NOT NULL DEFAULT ''{}''::jsonb,
                 created_at      timestamptz NOT NULL DEFAULT now(),
                 updated_at      timestamptz NOT NULL DEFAULT now()
             )', _tbl);

        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', _tbl);

        EXECUTE format(
            'DROP POLICY IF EXISTS p_%I_select ON public.%I;
             CREATE POLICY p_%I_select ON public.%I
                 FOR SELECT TO authenticated
                 USING (public.is_org_member(organization_id))', _tbl, _tbl, _tbl, _tbl);

        EXECUTE format(
            'DROP POLICY IF EXISTS p_%I_insert ON public.%I;
             CREATE POLICY p_%I_insert ON public.%I
                 FOR INSERT TO authenticated
                 WITH CHECK (public.is_org_member(organization_id))', _tbl, _tbl, _tbl, _tbl);

        IF _tbl <> 'project_bitacora' THEN
            EXECUTE format(
                'DROP POLICY IF EXISTS p_%I_update ON public.%I;
                 CREATE POLICY p_%I_update ON public.%I
                     FOR UPDATE TO authenticated
                     USING (public.is_org_member(organization_id))
                     WITH CHECK (public.is_org_member(organization_id))', _tbl, _tbl, _tbl, _tbl);

            EXECUTE format(
                'DROP POLICY IF EXISTS p_%I_delete ON public.%I;
                 CREATE POLICY p_%I_delete ON public.%I
                     FOR DELETE TO authenticated
                     USING (public.is_org_member(organization_id))', _tbl, _tbl, _tbl, _tbl);
        END IF;

        EXECUTE format(
            'CREATE UNIQUE INDEX IF NOT EXISTS ux_%I_project_data_id
                 ON public.%I (project_id, (data->>''id''))
              WHERE (data->>''id'') IS NOT NULL', _tbl, _tbl);
    END LOOP;
END $$;
