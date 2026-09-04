<?php

require_once __DIR__ . '/../lib/Database.php';
require_once __DIR__ . '/auth.php';

function handleListCatalogMaterials(): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();
    $stmt = $db->prepare('SELECT * FROM catalog_materials WHERE user_id = ? ORDER BY nombre ASC');
    $stmt->execute([$auth['user_id']]);
    jsonResponse(['materials' => $stmt->fetchAll()]);
}

function handleCreateCatalogMaterial(): void {
    $auth = authenticateRequest();
    $body = getJsonBody();
    $nombre = trim($body['nombre'] ?? '');
    if (!$nombre) {
        jsonError('Material name is required');
    }
    $db = Database::getInstance();
    $stmt = $db->prepare('INSERT INTO catalog_materials (user_id, nombre, proveedor, partNumber, hsCode, pesoUnitario, costeUnitario, moneda, paisOrigen, incoterm, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $auth['user_id'],
        $nombre,
        $body['proveedor'] ?? '',
        $body['partNumber'] ?? '',
        $body['hsCode'] ?? '',
        (float)($body['pesoUnitario'] ?? 0),
        (float)($body['costeUnitario'] ?? 0),
        $body['moneda'] ?? 'EUR',
        $body['paisOrigen'] ?? '',
        $body['incoterm'] ?? 'CIF',
        $body['notas'] ?? ''
    ]);
    $id = $db->lastInsertId();
    $stmt = $db->prepare('SELECT * FROM catalog_materials WHERE id = ?');
    $stmt->execute([$id]);
    jsonResponse(['material' => $stmt->fetch()], 201);
}

function handleUpdateCatalogMaterial(int $id): void {
    $auth = authenticateRequest();
    $body = getJsonBody();
    $db = Database::getInstance();
    $stmt = $db->prepare('SELECT * FROM catalog_materials WHERE id = ? AND user_id = ?');
    $stmt->execute([$id, $auth['user_id']]);
    if (!$stmt->fetch()) {
        jsonError('Material not found', 404);
    }
    $stmt = $db->prepare('UPDATE catalog_materials SET nombre = ?, proveedor = ?, partNumber = ?, hsCode = ?, pesoUnitario = ?, costeUnitario = ?, moneda = ?, paisOrigen = ?, incoterm = ?, notas = ?, updated_at = datetime(\'now\') WHERE id = ? AND user_id = ?');
    $stmt->execute([
        $body['nombre'] ?? '',
        $body['proveedor'] ?? '',
        $body['partNumber'] ?? '',
        $body['hsCode'] ?? '',
        (float)($body['pesoUnitario'] ?? 0),
        (float)($body['costeUnitario'] ?? 0),
        $body['moneda'] ?? 'EUR',
        $body['paisOrigen'] ?? '',
        $body['incoterm'] ?? 'CIF',
        $body['notas'] ?? '',
        $id,
        $auth['user_id']
    ]);
    $stmt = $db->prepare('SELECT * FROM catalog_materials WHERE id = ?');
    $stmt->execute([$id]);
    jsonResponse(['material' => $stmt->fetch()]);
}

function handleDeleteCatalogMaterial(int $id): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();
    $stmt = $db->prepare('DELETE FROM catalog_materials WHERE id = ? AND user_id = ?');
    $stmt->execute([$id, $auth['user_id']]);
    if ($stmt->rowCount() === 0) {
        jsonError('Material not found', 404);
    }
    jsonResponse(['deleted' => true]);
}

function handleListCatalogTeamMembers(): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();
    $stmt = $db->prepare('SELECT * FROM catalog_team_members WHERE user_id = ? ORDER BY nombre ASC');
    $stmt->execute([$auth['user_id']]);
    jsonResponse(['members' => $stmt->fetchAll()]);
}

function handleCreateCatalogTeamMember(): void {
    $auth = authenticateRequest();
    $body = getJsonBody();
    $nombre = trim($body['nombre'] ?? '');
    if (!$nombre) {
        jsonError('Member name is required');
    }
    $db = Database::getInstance();
    $stmt = $db->prepare('INSERT INTO catalog_team_members (user_id, nombre, rol, email, telefono, foto, costeHora, moneda, horasMes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $auth['user_id'],
        $nombre,
        $body['rol'] ?? '',
        $body['email'] ?? '',
        $body['telefono'] ?? '',
        $body['foto'] ?? '',
        (float)($body['costeHora'] ?? 0),
        $body['moneda'] ?? 'EUR',
        (int)($body['horasMes'] ?? 160)
    ]);
    $id = $db->lastInsertId();
    $stmt = $db->prepare('SELECT * FROM catalog_team_members WHERE id = ?');
    $stmt->execute([$id]);
    jsonResponse(['member' => $stmt->fetch()], 201);
}

function handleUpdateCatalogTeamMember(int $id): void {
    $auth = authenticateRequest();
    $body = getJsonBody();
    $db = Database::getInstance();
    $stmt = $db->prepare('SELECT * FROM catalog_team_members WHERE id = ? AND user_id = ?');
    $stmt->execute([$id, $auth['user_id']]);
    if (!$stmt->fetch()) {
        jsonError('Member not found', 404);
    }
    $stmt = $db->prepare('UPDATE catalog_team_members SET nombre = ?, rol = ?, email = ?, telefono = ?, foto = ?, costeHora = ?, moneda = ?, horasMes = ?, updated_at = datetime(\'now\') WHERE id = ? AND user_id = ?');
    $stmt->execute([
        $body['nombre'] ?? '',
        $body['rol'] ?? '',
        $body['email'] ?? '',
        $body['telefono'] ?? '',
        $body['foto'] ?? '',
        (float)($body['costeHora'] ?? 0),
        $body['moneda'] ?? 'EUR',
        (int)($body['horasMes'] ?? 160),
        $id,
        $auth['user_id']
    ]);
    $stmt = $db->prepare('SELECT * FROM catalog_team_members WHERE id = ?');
    $stmt->execute([$id]);
    jsonResponse(['member' => $stmt->fetch()]);
}

function handleDeleteCatalogTeamMember(int $id): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();
    $stmt = $db->prepare('DELETE FROM catalog_team_members WHERE id = ? AND user_id = ?');
    $stmt->execute([$id, $auth['user_id']]);
    if ($stmt->rowCount() === 0) {
        jsonError('Member not found', 404);
    }
    jsonResponse(['deleted' => true]);
}
