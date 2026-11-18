-- 0007 — Cierre de la gobernanza: bootstrap de perfil y superficie de funciones.
-- Append-only: no reescribe migraciones previas.

-- La función de mapeo proyecto → organización no debe ser legible por anónimos.
REVOKE ALL ON FUNCTION public.proyecto_org_original(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.proyecto_org_original(uuid) TO authenticated;

-- Un owner por organización: evita la condición de carrera del bootstrap
-- (0006 comprobaba "sin miembros" fuera de la inserción).
CREATE UNIQUE INDEX IF NOT EXISTS ux_organization_members_owner
    ON public.organization_members (organization_id)
    WHERE role = 'owner';

-- Bootstrap atómico de organización + membresía + perfil. La política de
-- 0006 exige is_org_member() antes de insertar en profiles; este helpers lo
-- garantiza en una sola transacción y con SECURITY DEFINER.
CREATE OR REPLACE FUNCTION public.bootstrap_organizacion_usuario(
    p_nombre text,
    p_email text
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_org_id uuid;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Se requiere sesión autenticada';
    END IF;

    INSERT INTO public.organizations (name)
    VALUES (coalesce(nullif(p_nombre, ''), p_email, 'Mi organización') || ' — Org')
    RETURNING id INTO v_org_id;

    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (v_org_id, auth.uid(), 'owner');

    INSERT INTO public.profiles (id, organization_id, email, name, role)
    VALUES (auth.uid(), v_org_id, p_email, coalesce(p_nombre, ''), 'editor');

    RETURN v_org_id;
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_organizacion_usuario(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bootstrap_organizacion_usuario(text, text) TO authenticated;
