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

// Expose as globals for browser + vm.runInThisContext harness
if (typeof window !== 'undefined') {
    window.dedupeDomainRows = dedupeDomainRows;
    window.dedupeById = dedupeById;
}
