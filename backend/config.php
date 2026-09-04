<?php

define('DB_PATH', __DIR__ . '/database.sqlite');
define('JWT_SECRET', getenv('PMI_JWT_SECRET') ?: 'pmi-app-secret-key-change-in-production-' . __FILE__);
define('JWT_EXPIRY', 60 * 60 * 24 * 30); // 30 days

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError($message, $status = 400) {
    jsonResponse(['error' => $message], $status);
}

function getJsonBody() {
    $body = file_get_contents('php://input');
    $data = json_decode($body, true);
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        jsonError('Invalid JSON body', 400);
    }
    return $data ?: [];
}
