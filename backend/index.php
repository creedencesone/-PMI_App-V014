<?php

require_once __DIR__ . '/config.php';

// CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/api/auth.php';
require_once __DIR__ . '/api/projects.php';
require_once __DIR__ . '/api/notifications.php';
require_once __DIR__ . '/api/catalog.php';
require_once __DIR__ . '/api/agenda.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = rtrim($uri, '/');
$method = $_SERVER['REQUEST_METHOD'];

function matchRoute(string $pattern, string $uri): ?array {
    $regex = preg_replace('/\{(\w+)\}/', '(?P<$1>[^/]+)', $pattern);
    $regex = '#^' . $regex . '$#';
    if (preg_match($regex, $uri, $m)) {
        return array_filter($m, 'is_string', ARRAY_FILTER_USE_KEY);
    }
    return null;
}

try {
    // Root — página de bienvenida
    if ($uri === '' || $uri === '/') {
        header('Content-Type: text/html; charset=utf-8');
        echo '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>PMI App — Backend</title>';
        echo '<style>body{font-family:system-ui,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#0a0a1a;color:#fff;margin:0}.card{background:rgba(20,20,40,0.9);border-radius:24px;padding:40px;max-width:500px;border:1px solid rgba(255,255,255,0.1);text-align:center}h1{font-size:24px;margin:0 0 8px}.ok{color:#00A859;font-size:40px}.info{color:rgba(255,255,255,0.5);font-size:13px;margin:16px 0}.url{background:rgba(0,122,255,0.1);padding:8px 16px;border-radius:8px;font-family:monospace;font-size:13px;color:#007AFF;word-break:break-all}code{font-size:12px;background:rgba(255,255,255,0.05);padding:2px 6px;border-radius:4px}</style></head>';
        echo '<body><div class="card"><div class="ok">✅</div><h1>Servidor funcionando</h1>';
        echo '<div class="info">La API de PMI App está operativa</div>';
        echo '<div class="url">http://localhost:8000</div>';
        echo '<div style="margin-top:20px;font-size:12px;color:rgba(255,255,255,0.3);text-align:left">';
        echo '📌 <strong>Endpoints:</strong><br>';
        echo '<code>POST /api/auth/login</code> — Iniciar sesión<br>';
        echo '<code>GET  /api/projects</code> — Listar proyectos<br>';
        echo '<code>POST /api/projects</code> — Crear proyecto<br><br>';
        echo '💡 <strong>Usuario por defecto:</strong><br>';
        echo 'Email: <code>admin@pmi.app</code><br>';
        echo 'Pass:  <code>admin123</code><br><br>';
        echo '🔌 <strong>Usar la app:</strong> abre <code>index.html</code> en el Finder<br>';
        echo '</div></div></body></html>';
        exit;
    }
    
    // Auth routes
    if ($uri === '/api/auth/register' && $method === 'POST') { handleRegister(); }
    elseif ($uri === '/api/auth/login' && $method === 'POST') { handleLogin(); }

    // Admin: list all users
    elseif ($uri === '/api/users' && $method === 'GET') { handleListUsers(); }

    // Profile
    elseif ($uri === '/api/auth/profile' && $method === 'PUT') { handleUpdateProfile(); }
    elseif ($uri === '/api/auth/password' && $method === 'PUT') { handleChangePassword(); }

    // Notifications
    elseif ($uri === '/api/notifications' && $method === 'GET') { handleListNotifications(); }
    elseif ($uri === '/api/notifications/unread-count' && $method === 'GET') { handleUnreadCount(); }
    elseif ($uri === '/api/notifications/read-all' && $method === 'POST') { handleMarkAllRead(); }
    elseif ($params = matchRoute('/api/notifications/{id}/read', $uri)) {
        $id = (int)$params['id'];
        if ($method === 'POST') { handleMarkRead($id); }
        else { jsonError('Method not allowed', 405); }
    }

    // Catalog routes
    elseif ($uri === '/api/catalog/materials' && $method === 'GET') { handleListCatalogMaterials(); }
    elseif ($uri === '/api/catalog/materials' && $method === 'POST') { handleCreateCatalogMaterial(); }
    elseif ($params = matchRoute('/api/catalog/materials/{id}', $uri)) {
        $id = (int)$params['id'];
        if ($method === 'PUT') { handleUpdateCatalogMaterial($id); }
        elseif ($method === 'DELETE') { handleDeleteCatalogMaterial($id); }
        else { jsonError('Method not allowed', 405); }
    }
    elseif ($uri === '/api/catalog/team-members' && $method === 'GET') { handleListCatalogTeamMembers(); }
    elseif ($uri === '/api/catalog/team-members' && $method === 'POST') { handleCreateCatalogTeamMember(); }
    elseif ($params = matchRoute('/api/catalog/team-members/{id}', $uri)) {
        $id = (int)$params['id'];
        if ($method === 'PUT') { handleUpdateCatalogTeamMember($id); }
        elseif ($method === 'DELETE') { handleDeleteCatalogTeamMember($id); }
        else { jsonError('Method not allowed', 405); }
    }

    // Agenda routes
    elseif ($uri === '/api/agenda' && $method === 'GET') { handleAgendaList(); }
    elseif ($uri === '/api/agenda/alertas' && $method === 'GET') { handleAgendaAlertas(); }
    elseif ($uri === '/api/agenda/hitos' && $method === 'GET') { handleAgendaHitos(); }
    elseif ($uri === '/api/agenda' && $method === 'POST') { handleAgendaCreate(); }
    elseif ($params = matchRoute('/api/agenda/{id}', $uri)) {
        $id = (int)$params['id'];
        if ($method === 'PUT') { handleAgendaUpdate($id); }
        elseif ($method === 'DELETE') { handleAgendaDelete($id); }
        else { jsonError('Method not allowed', 405); }
    }

    // Mostrar ayuda si alguien visita /api/auth/login en el navegador (GET)
    elseif ($uri === '/api/auth/login' && $method === 'GET') {
        jsonError('Usa POST con email y password en el body. Ej: curl -X POST ... -d \'{"email":"admin@pmi.app","password":"admin123"}\'', 405);
    }
    elseif ($uri === '/api/auth/me' && $method === 'GET') { handleMe(); }

    // Project routes
    elseif ($uri === '/api/projects' && $method === 'GET') { handleListProjects(); }
    elseif ($uri === '/api/projects' && $method === 'POST') { handleCreateProject(); }
    elseif ($params = matchRoute('/api/projects/{id}', $uri)) {
        $id = (int)$params['id'];
        if ($method === 'GET') { handleGetProject($id); }
        elseif ($method === 'PUT') { handleUpdateProject($id); }
        elseif ($method === 'DELETE') { handleDeleteProject($id); }
        else { jsonError('Method not allowed', 405); }
    }

    // Project user management routes
    elseif ($params = matchRoute('/api/projects/{id}/users', $uri)) {
        $id = (int)$params['id'];
        if ($method === 'GET') { handleListProjectUsers($id); }
        elseif ($method === 'POST') { handleAddProjectUser($id); }
        else { jsonError('Method not allowed', 405); }
    }
    elseif ($params = matchRoute('/api/projects/{projectId}/users/{userId}', $uri)) {
        $projectId = (int)$params['projectId'];
        $userId = (int)$params['userId'];
        if ($method === 'DELETE') { handleRemoveProjectUser($projectId, $userId); }
        else { jsonError('Method not allowed', 405); }
    }

    else {
        // Servir archivos estáticos (frontend) para acceso desde móvil
        $staticPath = dirname(__DIR__) . $uri;
        if ($uri === '/' || $uri === '') $staticPath = dirname(__DIR__) . '/index.html';
        if (is_file($staticPath)) {
            $ext = pathinfo($staticPath, PATHINFO_EXTENSION);
            $mime = ['html' => 'text/html', 'css' => 'text/css', 'js' => 'application/javascript', 'json' => 'application/json', 'png' => 'image/png', 'jpg' => 'image/jpeg', 'svg' => 'image/svg+xml', 'ico' => 'image/x-icon', 'woff2' => 'font/woff2', 'map' => 'application/json'];
            header('Content-Type: ' . ($mime[$ext] ?? 'text/plain'));
            readfile($staticPath);
            return;
        }
        jsonError('Not found', 404);
    }
} catch (PDOException $e) {
    jsonError('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    jsonError('Server error: ' . $e->getMessage(), 500);
}
