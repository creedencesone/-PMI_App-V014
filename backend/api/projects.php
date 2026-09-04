<?php

require_once __DIR__ . '/../lib/Database.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/notifications.php';

function handleListProjects(): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();

    $stmt = $db->prepare('
        SELECT p.id, p.name, p.description, p.created_at, p.updated_at,
               pu.role AS user_role, u.name AS owner_name
        FROM projects p
        JOIN project_users pu ON pu.project_id = p.id
        JOIN users u ON u.id = p.owner_id
        WHERE pu.user_id = ?
        ORDER BY p.updated_at DESC
    ');
    $stmt->execute([$auth['user_id']]);
    $projects = $stmt->fetchAll();

    jsonResponse(['projects' => $projects]);
}

function handleCreateProject(): void {
    $auth = authenticateRequest();
    $body = getJsonBody();
    $name = trim($body['name'] ?? '');
    if (!$name) {
        jsonError('Project name is required');
    }

    $db = Database::getInstance();
    $db->beginTransaction();

    try {
        $defaultData = [
            'nombre' => $name,
            'descripcion' => $body['description'] ?? '',
            'monedaBase' => 'EUR',
            'monedaVenta' => 'EUR',
            'precioVenta' => 0,
            'condicionesPago' => '',
            'fechaInicio' => date('Y-m-d'),
            'stakeholders' => [],
            'equipo' => [],
            'materiales' => [],
            'servicios' => [],
            'procesos' => [],
            'hitosFinancieros' => [],
            'elementosGantt' => [],
            'riesgos' => [],
            'comunicaciones' => [],
            'reuniones' => [],
            'viajes' => [],
            'avales' => [],
            'seguros' => [],
            'garantia' => null,
        ];

        if (!empty($body['data'])) {
            $defaultData = array_merge($defaultData, $body['data']);
        }

        $stmt = $db->prepare('INSERT INTO projects (name, description, data, owner_id) VALUES (?, ?, ?, ?)');
        $stmt->execute([$name, $body['description'] ?? '', json_encode($defaultData), $auth['user_id']]);
        $projectId = (int)$db->lastInsertId();

        $stmt = $db->prepare('INSERT INTO project_users (project_id, user_id, role) VALUES (?, ?, ?)');
        $stmt->execute([$projectId, $auth['user_id'], 'admin']);

        $db->commit();

        $stmt = $db->prepare('SELECT id, name, description, data, created_at, updated_at FROM projects WHERE id = ?');
        $stmt->execute([$projectId]);
        $project = $stmt->fetch();
        $project['data'] = json_decode($project['data'], true);

        jsonResponse(['project' => $project], 201);
    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }
}

function handleGetProject(int $id): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();

    $stmt = $db->prepare('
        SELECT p.id, p.name, p.description, p.data, p.owner_id, p.created_at, p.updated_at,
               pu.role AS user_role
        FROM projects p
        JOIN project_users pu ON pu.project_id = p.id
        WHERE p.id = ? AND pu.user_id = ?
    ');
    $stmt->execute([$id, $auth['user_id']]);
    $project = $stmt->fetch();

    if (!$project) {
        jsonError('Project not found or access denied', 404);
    }

    $project['data'] = json_decode($project['data'], true);

    jsonResponse(['project' => $project]);
}

function handleUpdateProject(int $id): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();

    $stmt = $db->prepare('
        SELECT pu.role FROM projects p
        JOIN project_users pu ON pu.project_id = p.id
        WHERE p.id = ? AND pu.user_id = ?
    ');
    $stmt->execute([$id, $auth['user_id']]);
    $perm = $stmt->fetch();

    if (!$perm) {
        jsonError('Project not found or access denied', 404);
    }
    if ($perm['role'] === 'viewer') {
        jsonError('Read-only access', 403);
    }

    $body = getJsonBody();
    $updates = [];
    $params = [];

    if (isset($body['name'])) {
        $updates[] = 'name = ?';
        $params[] = $body['name'];
    }
    if (isset($body['description'])) {
        $updates[] = 'description = ?';
        $params[] = $body['description'];
    }
    if (isset($body['data'])) {
        $updates[] = 'data = ?';
        $params[] = json_encode($body['data']);
    }

    if (empty($updates)) {
        jsonError('No fields to update');
    }

    $updates[] = 'updated_at = datetime("now")';
    $params[] = $id;

    $stmt = $db->prepare('UPDATE projects SET ' . implode(', ', $updates) . ' WHERE id = ?');
    $stmt->execute($params);

    $stmt = $db->prepare('SELECT id, name, description, data, owner_id, created_at, updated_at FROM projects WHERE id = ?');
    $stmt->execute([$id]);
    $project = $stmt->fetch();
    $project['data'] = json_decode($project['data'], true);

    jsonResponse(['project' => $project]);
}

function handleDeleteProject(int $id): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();

    $stmt = $db->prepare('
        SELECT pu.role FROM projects p
        JOIN project_users pu ON pu.project_id = p.id
        WHERE p.id = ? AND pu.user_id = ?
    ');
    $stmt->execute([$id, $auth['user_id']]);
    $perm = $stmt->fetch();

    if (!$perm) {
        jsonError('Project not found or access denied', 404);
    }
    if ($perm['role'] !== 'admin') {
        jsonError('Only the project admin can delete', 403);
    }

    $db->prepare('DELETE FROM projects WHERE id = ?')->execute([$id]);

    jsonResponse(['message' => 'Project deleted']);
}

function handleListProjectUsers(int $projectId): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();

    $stmt = $db->prepare('SELECT 1 FROM project_users WHERE project_id = ? AND user_id = ?');
    $stmt->execute([$projectId, $auth['user_id']]);
    if (!$stmt->fetch()) {
        jsonError('Access denied', 403);
    }

    $stmt = $db->prepare('
        SELECT pu.role, u.id, u.email, u.name
        FROM project_users pu
        JOIN users u ON u.id = pu.user_id
        WHERE pu.project_id = ?
    ');
    $stmt->execute([$projectId]);
    jsonResponse(['users' => $stmt->fetchAll()]);
}

function handleAddProjectUser(int $projectId): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();

    $stmt = $db->prepare('SELECT role FROM project_users WHERE project_id = ? AND user_id = ?');
    $stmt->execute([$projectId, $auth['user_id']]);
    $perm = $stmt->fetch();
    if (!$perm || $perm['role'] === 'viewer') {
        jsonError('Insufficient permissions', 403);
    }

    $body = getJsonBody();
    $email = trim($body['email'] ?? '');
    $role = $body['role'] ?? 'editor';

    if (!in_array($role, ['admin', 'editor', 'viewer'], true)) {
        jsonError('Invalid role');
    }

    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if (!$user) {
        jsonError('User not found with that email', 404);
    }

    try {
        $stmt = $db->prepare('INSERT INTO project_users (project_id, user_id, role) VALUES (?, ?, ?)');
        $stmt->execute([$projectId, $user['id'], $role]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            jsonError('User already has access to this project', 409);
        }
        throw $e;
    }

    // Get project name for notification
    $stmt = $db->prepare('SELECT name FROM projects WHERE id = ?');
    $stmt->execute([$projectId]);
    $project = $stmt->fetch();
    $projectName = $project ? $project['name'] : 'Unknown';

    // Get inviting user's name
    $inviterName = $auth['name'] ?? 'Un usuario';

    createNotification(
        (int)$user['id'],
        'project_shared',
        'Te han compartido un proyecto',
        "$inviterName te ha añadido al proyecto \"$projectName\" como " . ($role === 'editor' ? 'editor' : 'visor'),
        ['project_id' => $projectId, 'project_name' => $projectName, 'role' => $role, 'invited_by' => $auth['name'] ?? '']
    );

    jsonResponse(['message' => 'User added'], 201);
}

function handleRemoveProjectUser(int $projectId, int $userId): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();

    $stmt = $db->prepare('SELECT role FROM project_users WHERE project_id = ? AND user_id = ?');
    $stmt->execute([$projectId, $auth['user_id']]);
    $perm = $stmt->fetch();
    if (!$perm || $perm['role'] !== 'admin') {
        jsonError('Only project admin can remove users', 403);
    }

    if ($userId === $auth['user_id']) {
        jsonError('Cannot remove yourself');
    }

    $db->prepare('DELETE FROM project_users WHERE project_id = ? AND user_id = ?')
        ->execute([$projectId, $userId]);

    jsonResponse(['message' => 'User removed']);
}
