-- ============================================================
-- PMI Mind — Dominio de requisitos del proyecto
-- Migración 0008: tabla project_requisitos
-- ============================================================
-- Append-only: no reescribe migraciones previas.
-- Mismo contrato que el resto de tablas de dominio:
--   id uuid, organization_id, project_id, data jsonb, timestamps.
-- RLS por organización (authenticated; anon denegado por defecto).
-- Índice único parcial (project_id, data->>'id') anti-duplicados,
-- necesario porque _writeDomains hace DELETE + INSERT en cada sync.
--
-- Idempotente: CREATE TABLE IF NOT EXISTS, DROP/CREATE POLICY y
-- CREATE INDEX IF NOT EXISTS.
-- ============================================================

DO $$
DECLARE
    _tbl text := 'project_requisitos';
BEGIN
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

    EXECUTE format(
        'CREATE UNIQUE INDEX IF NOT EXISTS ux_%I_project_data_id
             ON public.%I (project_id, (data->>''id''))
          WHERE (data->>''id'') IS NOT NULL', _tbl, _tbl);
END $$;
