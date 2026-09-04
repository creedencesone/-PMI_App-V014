<?php
/**
 * API endpoints for Agenda module
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../lib/Database.php';
require_once __DIR__ . '/auth.php';

function handleAgendaList(): void {
    $auth = authenticateRequest();
    $proyectoId = isset($_GET['proyecto_id']) ? (int)$_GET['proyecto_id'] : 0;
    if ($proyectoId <= 0) jsonError('proyecto_id requerido', 400);

    // Verificar acceso al proyecto
    $db = Database::getInstance();
    $stmt = $db->prepare('SELECT 1 FROM project_users WHERE project_id = ? AND user_id = ?');
    $stmt->execute([$proyectoId, $auth['user_id']]);
    if (!$stmt->fetch()) {
        // Also allow owner
        $stmt = $db->prepare('SELECT 1 FROM projects WHERE id = ? AND owner_id = ?');
        $stmt->execute([$proyectoId, $auth['user_id']]);
        if (!$stmt->fetch()) jsonError('Sin acceso al proyecto', 403);
    }

    $stmt = $db->prepare('SELECT * FROM agenda WHERE proyecto_id = ? ORDER BY fecha_inicio ASC, created_at ASC');
    $stmt->execute([$proyectoId]);
    $eventos = $stmt->fetchAll();
    jsonResponse(['eventos' => $eventos]);
}

function handleAgendaAlertas(): void {
    $auth = authenticateRequest();
    $proyectoId = isset($_GET['proyecto_id']) ? (int)$_GET['proyecto_id'] : 0;
    if ($proyectoId <= 0) jsonError('proyecto_id requerido', 400);

    // Verificar acceso
    $db = Database::getInstance();
    $stmt = $db->prepare('SELECT 1 FROM project_users WHERE project_id = ? AND user_id = ?');
    $stmt->execute([$proyectoId, $auth['user_id']]);
    if (!$stmt->fetch()) {
        $stmt = $db->prepare('SELECT 1 FROM projects WHERE id = ? AND owner_id = ?');
        $stmt->execute([$proyectoId, $auth['user_id']]);
        if (!$stmt->fetch()) jsonError('Sin acceso al proyecto', 403);
    }

    // Eventos con alarma para hoy y mañana
    $hoy = date('Y-m-d');
    $manana = date('Y-m-d', strtotime('+1 day'));
    $stmt = $db->prepare('SELECT * FROM agenda WHERE proyecto_id = ? AND es_alarma = 1 AND fecha_inicio IN (?, ?) ORDER BY fecha_inicio ASC');
    $stmt->execute([$proyectoId, $hoy, $manana]);
    $alertas = $stmt->fetchAll();
    jsonResponse(['alertas' => $alertas]);
}

function handleAgendaHitos(): void {
    $auth = authenticateRequest();
    $proyectoId = isset($_GET['proyecto_id']) ? (int)$_GET['proyecto_id'] : 0;
    if ($proyectoId <= 0) jsonError('proyecto_id requerido', 400);

    // Verificar acceso
    $db = Database::getInstance();
    $stmt = $db->prepare('SELECT 1 FROM project_users WHERE project_id = ? AND user_id = ?');
    $stmt->execute([$proyectoId, $auth['user_id']]);
    if (!$stmt->fetch()) {
        $stmt = $db->prepare('SELECT 1 FROM projects WHERE id = ? AND owner_id = ?');
        $stmt->execute([$proyectoId, $auth['user_id']]);
        if (!$stmt->fetch()) jsonError('Sin acceso al proyecto', 403);
    }

    // Obtener hitos y entregables del proyecto (desde tabla projects.data JSON)
    $stmt = $db->prepare('SELECT data FROM projects WHERE id = ?');
    $stmt->execute([$proyectoId]);
    $project = $stmt->fetch();
    if (!$project) jsonError('Proyecto no encontrado', 404);

    $data = json_decode($project['data'], true);
    $elementos = [];
    if (!empty($data['elementosGantt'])) {
        foreach ($data['elementosGantt'] as $e) {
            if (in_array($e['tipo'], ['hito', 'entregable'])) {
$elementos[] = [
    'id' => $e['id'],
    'nombre' => $e['nombre'],
    'fecha_inicio' => $e['inicio'] ?? null,
    'fecha_fin' => $e['fin'] ?? $e['inicio'] ?? null,
    'codigo' => $e['codigo'] ?? null,
    'tipo' => $e['tipo']
];
            }
        }
    }
    jsonResponse(['elementos' => $elementos]);
}

function handleAgendaCreate(): void {
    $auth = authenticateRequest();
    $data = getJsonBody();
    
    $proyectoId = (int)($data['proyecto_id'] ?? 0);
    if ($proyectoId <= 0) jsonError('proyecto_id requerido', 400);
    if (empty($data['titulo'])) jsonError('titulo requerido', 400);
    if (empty($data['fecha_inicio'])) jsonError('fecha_inicio requerida', 400);
    if (empty($data['fecha_fin'])) jsonError('fecha_fin requerida', 400);

    // Verificar acceso
    $db = Database::getInstance();
    $stmt = $db->prepare('SELECT 1 FROM project_users WHERE project_id = ? AND user_id = ?');
    $stmt->execute([$proyectoId, $auth['user_id']]);
    if (!$stmt->fetch()) {
        $stmt = $db->prepare('SELECT 1 FROM projects WHERE id = ? AND owner_id = ?');
        $stmt->execute([$proyectoId, $auth['user_id']]);
        if (!$stmt->fetch()) jsonError('Sin acceso al proyecto', 403);
    }

    $fechaInicio = $data['fecha_inicio'];
    $fechaFin = $data['fecha_fin'];
    $horaInicio = $data['hora_inicio'] ?? '09:00';
    $horaFin = $data['hora_fin'] ?? '10:00';
    $titulo = $data['titulo'];
    $descripcion = $data['descripcion'] ?? '';
    $categoria = $data['categoria'] ?? 'otro';
    $esAlarma = isset($data['es_alarma']) && $data['es_alarma'] ? 1 : 0;
    $hitoId = isset($data['hito_id']) && $data['hito_id'] !== '' ? (int)$data['hito_id'] : null;

    $stmt = $db->prepare('INSERT INTO agenda (proyecto_id, user_id, fecha_inicio, fecha_fin, hora_inicio, hora_fin, titulo, descripcion, categoria, es_alarma, hito_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$proyectoId, $auth['user_id'], $fechaInicio, $fechaFin, $horaInicio, $horaFin, $titulo, $descripcion, $categoria, $esAlarma, $hitoId]);
    $id = $db->lastInsertId();

    jsonResponse(['id' => $id, 'message' => 'Evento creado'], 201);
}

function handleAgendaUpdate(int $eventoId): void {
    $auth = authenticateRequest();
    if ($eventoId <= 0) jsonError('id requerido', 400);

    $data = getJsonBody();

    $db = Database::getInstance();
    // Verificar que el evento pertenece a un proyecto al que el usuario tiene acceso
    $stmt = $db->prepare('SELECT proyecto_id FROM agenda WHERE id = ?');
    $stmt->execute([$eventoId]);
    $evento = $stmt->fetch();
    if (!$evento) jsonError('Evento no encontrado', 404);

    $proyectoId = $evento['proyecto_id'];
    $stmt = $db->prepare('SELECT 1 FROM project_users WHERE project_id = ? AND user_id = ?');
    $stmt->execute([$proyectoId, $auth['user_id']]);
    if (!$stmt->fetch()) {
        $stmt = $db->prepare('SELECT 1 FROM projects WHERE id = ? AND owner_id = ?');
        $stmt->execute([$proyectoId, $auth['user_id']]);
        if (!$stmt->fetch()) jsonError('Sin acceso al proyecto', 403);
    }

    $updates = [];
    $params = [];
    $allowed = ['fecha_inicio', 'fecha_fin', 'hora_inicio', 'hora_fin', 'titulo', 'descripcion', 'categoria', 'es_alarma', 'hito_id'];
    foreach ($allowed as $field) {
        if (array_key_exists($field, $data)) {
            $updates[] = "$field = ?";
            if ($field === 'es_alarma') $params[] = $data[$field] ? 1 : 0;
            elseif ($field === 'hito_id') $params[] = $data[$field] !== '' && $data[$field] !== null ? (int)$data[$field] : null;
            else $params[] = $data[$field];
        }
    }
    if (empty($updates)) jsonError('Nada que actualizar', 400);

    $params[] = $eventoId;
    $sql = 'UPDATE agenda SET ' . implode(', ', $updates) . ', updated_at = datetime(\'now\') WHERE id = ?';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    jsonResponse(['message' => 'Evento actualizado']);
}

function handleAgendaDelete(int $eventoId): void {
    $auth = authenticateRequest();
    if ($eventoId <= 0) jsonError('id requerido', 400);

    $db = Database::getInstance();
    $stmt = $db->prepare('SELECT proyecto_id FROM agenda WHERE id = ?');
    $stmt->execute([$eventoId]);
    $evento = $stmt->fetch();
    if (!$evento) jsonError('Evento no encontrado', 404);

    $proyectoId = $evento['proyecto_id'];
    $stmt = $db->prepare('SELECT 1 FROM project_users WHERE project_id = ? AND user_id = ?');
    $stmt->execute([$proyectoId, $auth['user_id']]);
    if (!$stmt->fetch()) {
        $stmt = $db->prepare('SELECT 1 FROM projects WHERE id = ? AND owner_id = ?');
        $stmt->execute([$proyectoId, $auth['user_id']]);
        if (!$stmt->fetch()) jsonError('Sin acceso al proyecto', 403);
    }

    $stmt = $db->prepare('DELETE FROM agenda WHERE id = ?');
    $stmt->execute([$eventoId]);

    jsonResponse(['message' => 'Evento eliminado']);
}