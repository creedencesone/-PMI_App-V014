// ============================================================
// PMI Mind — Pure collection helpers (no dependencies)
// ============================================================

/* eslint-disable no-unused-vars */

/**
 * Deduplicate domain-table rows by the inner `row.data.id`.
 * Keeps the FIRST occurrence (stable order).
 * Rows whose data.id is undefined/null or whose data is not an object
 * are preserved as-is. Non-array input returned unchanged.
 *
 * @param {Array} rows – array of { id, organization_id, project_id, data: {id,...} }
 * @returns {Array} deduplicated copy
 */
function dedupeDomainRows(rows) {
    if (!Array.isArray(rows)) return rows;
    const seen = new Set();
    const out = [];
    for (const row of rows) {
        const innerId = row && row.data && typeof row.data === 'object' && row.data.id;
        if (innerId !== undefined && innerId !== null) {
            const key = String(innerId);
            if (seen.has(key)) continue;
            seen.add(key);
        }
        out.push(row);
    }
    return out;
}

/**
 * Deduplicate plain objects by top-level `.id`.
 * Keeps the FIRST occurrence. Items without id are preserved.
 * Non-array input returned unchanged.
 *
 * @param {Array} items – array of plain objects with optional .id
 * @returns {Array} deduplicated copy
 */
function dedupeById(items) {
    if (!Array.isArray(items)) return items;
    const seen = new Set();
    const out = [];
    for (const item of items) {
        const id = item && item.id;
        if (id !== undefined && id !== null) {
            const key = String(id);
            if (seen.has(key)) continue;
            seen.add(key);
        }
        out.push(item);
    }
    return out;
}

/**
 * Select projects to keep in the localStorage cache when quota is exceeded.
 * Returns a NEW array with at most 1 + max entries.
 * ALWAYS keeps the project whose String(p.id) === String(keepId) (if present).
 * Among the rest, keeps the max MOST RECENT, ordered by
 * _serverUpdatedAt || updated_at || 0 descending (string/number compare
 * that tolerates both ISO strings and timestamps). Ties broken by
 * original array order (stable).
 * Non-array input → returned unchanged. max default = 5 if not a positive finite number.
 *
 * @param {Array} projects – array of project objects
 * @param {*} keepId – project id to always keep
 * @param {number} [max=5] – max additional projects to keep
 * @returns {Array} trimmed copy
 */
function seleccionarProyectosACachear(projects, keepId, max) {
    if (!Array.isArray(projects)) return projects;
    if (typeof max !== 'number' || !isFinite(max) || max <= 0) max = 5;

    // Find the project to always keep
    const keepIdx = projects.findIndex(p => String(p.id) === String(keepId));
    const keepProject = keepIdx >= 0 ? projects[keepIdx] : null;

    // The rest: exclude the kept project
    const candidates = keepProject
        ? projects.filter((_, i) => i !== keepIdx)
        : [...projects];

    // Sort by most recent first (stable sort via index tracking)
    const indexed = candidates.map((p, i) => ({ p, i }));
    indexed.sort((a, b) => {
        const aVal = a.p._serverUpdatedAt || a.p.updated_at || 0;
        const bVal = b.p._serverUpdatedAt || b.p.updated_at || 0;
        // Compare: string vs string, or number vs number
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return bVal.localeCompare(aVal);
        }
        if (aVal > bVal) return -1;
        if (aVal < bVal) return 1;
        // Tie: original order (lower index = earlier)
        return a.i - b.i;
    });

    const trimmed = indexed.slice(0, max).map(x => x.p);

    // Prepend keepProject if present
    if (keepProject) {
        return [keepProject, ...trimmed];
    }
    return trimmed;
}

// Expose as globals for browser + vm.runInThisContext harness
if (typeof window !== 'undefined') {
    window.dedupeDomainRows = dedupeDomainRows;
    window.dedupeById = dedupeById;
    window.seleccionarProyectosACachear = seleccionarProyectosACachear;
}
