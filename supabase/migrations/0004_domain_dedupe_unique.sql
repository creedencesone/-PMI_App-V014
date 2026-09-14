-- ============================================================
-- PMI Mind — Deduplicación de dominios + índices únicos
-- Migración 0004: limpieza de duplicados + prevención
-- ============================================================
-- Contenido:
--   1. Borrado de duplicados en las 13 tablas ARRAY de dominio
--      (project_stakeholders … project_seguros), conservando la
--      fila MÁS ANTIGUA por (project_id, data->>'id').
--   2. Borrado de duplicados en project_garantia (OBJETO: máx. 1
--      fila por project_id), conservando la más antigua.
--   3. Creación de índices ÚNICOS PARCIALES en las 13 tablas
--      ARRAY: (project_id, (data->>'id'))
--      WHERE (data->>'id') IS NOT NULL.
--   4. Creación de índice ÚNICO en project_garantia (project_id).
--
-- Convenciones:
--   - Migración idempotente: re-ejecutable sin efectos
--     secundarios (el DELETE es naturalmente idempotente;
--     CREATE INDEX IF NOT EXISTS ignora si ya existe).
--   - Se usa un bloque DO con EXECUTE format para las 13
--     tablas ARRAY en vez de 13 bloques copiados — misma lista
--     que DOMAIN_TABLES en DataService.js, reflejada aquí en
--     un solo ARRAY para mantenimiento centralizado.
--   - No toca el blob projects.data: la app lo auto-curó en la
--     fase anterior (_hydrateProject dedupe on read) y el
--     siguiente sync reescribe el blob limpio.
-- ============================================================
-- Cómo aplicar
-- ------------------------------------------------------------
-- Opción A — Supabase SQL Editor:
--   1. Abrir Supabase Dashboard → SQL Editor.
--   2. Pegar TODO este archivo.
--   3. Pulsar "Run".
--
-- Opción B — Supabase CLI:
--   supabase db push
--   (aplicará esta migración junto con cualquier otra pendiente)
-- ============================================================


-- ============================================================
-- 1. Borrado de duplicados en tablas ARRAY (13 tablas)
-- ============================================================
-- Regla: para cada (project_id, data->>'id'), conservamos solo
-- la fila con el (created_at, id) MÁS ANTIGUO (tie-break
-- determinista). Se eliminan todas las demás.
--
-- Solo actúa sobre filas donde data->>'id' IS NOT NULL;
-- las filas sin data.id quedan intocadas (legítimas).

DO $$
DECLARE
    _tbl text;
    _array_tables text[] := ARRAY[
        'project_stakeholders',
        'project_equipo',
        'project_materiales',
        'project_servicios',
        'project_procesos',
        'project_hitos_financieros',
        'project_elementos_gantt',
        'project_riesgos',
        'project_comunicaciones',
        'project_reuniones',
        'project_viajes',
        'project_avales',
        'project_seguros'
    ];
BEGIN
    FOREACH _tbl IN ARRAY _array_tables LOOP
        EXECUTE format(
            'DELETE FROM public.%I a
              USING public.%I b
             WHERE a.project_id = b.project_id
               AND (a.data->>''id'') IS NOT NULL
               AND (a.data->>''id'') = (b.data->>''id'')
               AND (a.created_at, a.id) > (b.created_at, b.id)',
            _tbl, _tbl
        );
    END LOOP;
END $$;


-- ============================================================
-- 2. Borrado de duplicados en project_garantia (OBJETO)
-- ============================================================
-- project_garantia almacena un objeto (no un array): se espera
-- a lo sumo 1 fila por project_id. Si hay varias, conservamos
-- la más antigua.

DELETE FROM public.project_garantia a
      USING public.project_garantia b
 WHERE a.project_id = b.project_id
   AND (a.created_at, a.id) > (b.created_at, b.id);


-- ============================================================
-- 3. Índices ÚNICOS PARCIALES — tablas ARRAY (13 tablas)
-- ============================================================
-- Expresión: (project_id, (data->>'id')) WHERE (data->>'id') IS NOT NULL
-- Solo restringe filas con data.id; las filas sin id quedan
-- fuera del índice (legítimas, sin violación posible).
--
-- Nombre del índice: ux_<tabla>_project_data_id
-- CREATE UNIQUE INDEX IF NOT EXISTS → idempotente.

DO $$
DECLARE
    _tbl text;
    _idx text;
    _array_tables text[] := ARRAY[
        'project_stakeholders',
        'project_equipo',
        'project_materiales',
        'project_servicios',
        'project_procesos',
        'project_hitos_financieros',
        'project_elementos_gantt',
        'project_riesgos',
        'project_comunicaciones',
        'project_reuniones',
        'project_viajes',
        'project_avales',
        'project_seguros'
    ];
BEGIN
    FOREACH _tbl IN ARRAY _array_tables LOOP
        _idx := 'ux_' || _tbl || '_project_data_id';
        EXECUTE format(
            'CREATE UNIQUE INDEX IF NOT EXISTS %I
                ON public.%I (project_id, (data->>''id''))
              WHERE (data->>''id'') IS NOT NULL',
            _idx, _tbl
        );
    END LOOP;
END $$;


-- ============================================================
-- 4. Índice ÚNICO — project_garantia (OBJETO)
-- ============================================================
-- A lo sumo 1 fila por project_id; unique en project_id.
-- CREATE UNIQUE INDEX IF NOT EXISTS → idempotente.

CREATE UNIQUE INDEX IF NOT EXISTS ux_project_garantia_project_id
    ON public.project_garantia (project_id);


-- ============================================================
-- Notas
-- ============================================================
-- • Este script NO modifica el blob projects.data JSONB.
--   La app se auto-cura en la siguiente sincronización:
--   _hydrateProject (DataService.js) ya aplica dedupeDomainRows
--   en lectura (fase A, comité previo), y el siguiente
--   _writeDomains reescribe el blob limpio.
-- • La limpieza es segura bajo concurrencia: dos ejecuciones
--   simultáneas del DELETE producen el mismo resultado (la
--   query identifica duplicados exactos y borra los "mayores").
-- • Los índices parciales son ligeros: solo indexan filas con
--   data.id definido, y PostgreSQL solo los actualiza en
--   INSERT/UPDATE, no en SELECT normales.


-- ============================================================
-- PRE-CHECK (diagnóstico — comentado, no ejecutar en migración)
-- ============================================================
-- Descomentar ANTES de aplicar para ver cuántos duplicados hay.
--
-- -- 1. Conteo de duplicados por tabla (solo data.id not null):
-- DO $$
-- DECLARE _tbl text;
-- BEGIN
--     FOR _tbl IN
--         SELECT unnest(ARRAY[
--             'project_stakeholders','project_equipo','project_materiales',
--             'project_servicios','project_procesos','project_hitos_financieros',
--             'project_elementos_gantt','project_riesgos','project_comunicaciones',
--             'project_reuniones','project_viajes','project_avales','project_seguros'
--         ])
--     LOOP
--         EXECUTE format(
--             'SELECT ''%I'' AS tabla,
--                     count(*) FILTER (WHERE cnt > 1) AS grupos_duplicados,
--                     sum(cnt - 1) AS filas_a_borrar
--               FROM (SELECT project_id, data->>''id'' AS did, count(*) AS cnt
--                       FROM public.%I
--                      WHERE data->>''id'' IS NOT NULL
--                      GROUP BY project_id, data->>''id''
--                      HAVING count(*) > 1) sub',
--             _tbl, _tbl
--         );
--     END LOOP;
-- END $$;
--
-- -- 2. project_garantia: filas duplicadas por project_id:
-- SELECT project_id, count(*) AS cnt
--   FROM public.project_garantia
--  GROUP BY project_id
--  HAVING count(*) > 1;


-- ============================================================
-- POST-CHECK (verificación — comentado, no ejecutar en migración)
-- ============================================================
-- Descomentar DESPUÉS de aplicar para confirmar 0 duplicados
-- y que los índices existen.
--
-- -- 1. Verificar 0 duplicados en tablas ARRAY:
-- DO $$
-- DECLARE _tbl text;
-- BEGIN
--     FOR _tbl IN
--         SELECT unnest(ARRAY[
--             'project_stakeholders','project_equipo','project_materiales',
--             'project_servicios','project_procesos','project_hitos_financieros',
--             'project_elementos_gantt','project_riesgos','project_comunicaciones',
--             'project_reuniones','project_viajes','project_avales','project_seguros'
--         ])
--     LOOP
--         EXECUTE format(
--             'SELECT ''%I'' AS tabla,
--                     count(*) AS filas_con_data_id,
--                     count(DISTINCT (project_id, data->>''id'')) AS claves_unicas
--               FROM public.%I
--              WHERE data->>''id'' IS NOT NULL',
--             _tbl, _tbl
--         );
--         -- filas_con_data_id DEBE ser igual a claves_unicas
--     END LOOP;
-- END $$;
--
-- -- 2. Verificar 0 duplicados en project_garantia:
-- SELECT count(*) AS filas, count(DISTINCT project_id) AS projects_unicos
--   FROM public.project_garantia;
-- -- filas DEBE ser igual a projects_unicos
--
-- -- 3. Listar índices únicos creados:
-- SELECT indexname, tablename
--   FROM pg_indexes
--  WHERE schemaname = 'public'
--    AND (indexname LIKE 'ux_project_%_project_data_id'
--         OR indexname = 'ux_project_garantia_project_id')
--  ORDER BY tablename;

-- ============================================================
-- Fin de la migración 0004
-- ============================================================
