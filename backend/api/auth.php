<?php

require_once __DIR__ . '/../lib/Database.php';
require_once __DIR__ . '/../lib/JWT.php';

function handleRegister(): void {
    $body = getJsonBody();
    $email = trim($body['email'] ?? '');
    $name = trim($body['name'] ?? '');
    $password = $body['password'] ?? '';

    if (!$email || !$name || !$password) {
        jsonError('email, name and password are required');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonError('Invalid email format');
    }
    if (strlen($password) < 6) {
        jsonError('Password must be at least 6 characters');
    }

    $db = Database::getInstance();

    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        jsonError('Email already registered', 409);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $db->prepare('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)');
    $stmt->execute([$email, $name, $hash]);
    $userId = (int)$db->lastInsertId();

    $token = JWT::encode(['user_id' => $userId, 'email' => $email, 'name' => $name, 'role' => 'editor']);

    jsonResponse(['token' => $token, 'user' => [
        'id' => $userId,
        'email' => $email,
        'name' => $name,
        'role' => 'editor',
    ]], 201);
}

function handleLogin(): void {
    $body = getJsonBody();
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';

    if (!$email || !$password) {
        jsonError('email and password are required');
    }

    $db = Database::getInstance();
    $stmt = $db->prepare('SELECT id, email, name, password_hash, role FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonError('Invalid email or password', 401);
    }

    $token = JWT::encode([
        'user_id' => (int)$user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'role' => $user['role'],
    ]);

    jsonResponse(['token' => $token, 'user' => [
        'id' => (int)$user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'role' => $user['role'],
    ]]);
}

function handleMe(): void {
    $auth = authenticateRequest();
    jsonResponse(['user' => $auth]);
}

function authenticateRequest(): array {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/i', $header, $m)) {
        jsonError('Authorization header required', 401);
    }
    $payload = JWT::decode($m[1]);
    if (!$payload) {
        jsonError('Invalid or expired token', 401);
    }

    // Verify user still exists in database
    $db = Database::getInstance();
    $stmt = $db->prepare('SELECT id FROM users WHERE id = ?');
    $stmt->execute([$payload['user_id']]);
    if (!$stmt->fetch()) {
        jsonError('User not found', 401);
    }

    return $payload;
}

function handleListUsers(): void {
    $auth = authenticateRequest();
    if ($auth['role'] !== 'admin') {
        jsonError('Admin access required', 403);
    }
    $db = Database::getInstance();
    $stmt = $db->query('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC');
    jsonResponse(['users' => $stmt->fetchAll()]);
}

function handleUpdateProfile(): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();
    $body = getJsonBody();

    $name = trim($body['name'] ?? '');
    $email = trim($body['email'] ?? '');
    $currentPassword = $body['current_password'] ?? '';

    if (!$name && !$email) {
        jsonError('name or email is required');
    }

    // Get current user from DB
    $stmt = $db->prepare('SELECT id, email, name, password_hash FROM users WHERE id = ?');
    $stmt->execute([$auth['user_id']]);
    $user = $stmt->fetch();
    if (!$user) {
        jsonError('User not found', 404);
    }

    $updates = [];
    $params = [];
    $newEmail = null;

    if ($name && $name !== $user['name']) {
        $updates[] = 'name = ?';
        $params[] = $name;
    }

    if ($email && $email !== $user['email']) {
        // Verify current password for email change
        if (!$currentPassword || !password_verify($currentPassword, $user['password_hash'])) {
            jsonError('Current password is required to change email', 403);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonError('Invalid email format');
        }
        // Check email not taken
        $stmt2 = $db->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
        $stmt2->execute([$email, $auth['user_id']]);
        if ($stmt2->fetch()) {
            jsonError('Email already in use', 409);
        }
        $updates[] = 'email = ?';
        $params[] = $email;
        $newEmail = $email;
    }

    if (empty($updates)) {
        jsonResponse(['message' => 'No changes', 'user' => [
            'id' => $auth['user_id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'role' => $auth['role'],
        ]]);
        return;
    }

    $params[] = $auth['user_id'];
    $db->prepare('UPDATE users SET ' . implode(', ', $updates) . ' WHERE id = ?')->execute($params);

    $finalEmail = $newEmail ?? $user['email'];
    $finalName = $name ?: $user['name'];

    // Issue new token with updated info
    $newToken = JWT::encode([
        'user_id' => (int)$auth['user_id'],
        'email' => $finalEmail,
        'name' => $finalName,
        'role' => $auth['role'],
    ]);

    jsonResponse(['message' => 'Profile updated', 'token' => $newToken, 'user' => [
        'id' => (int)$auth['user_id'],
        'email' => $finalEmail,
        'name' => $finalName,
        'role' => $auth['role'],
    ]]);
}

function handleChangePassword(): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();
    $body = getJsonBody();

    $currentPassword = $body['current_password'] ?? '';
    $newPassword = $body['new_password'] ?? '';

    if (!$currentPassword || !$newPassword) {
        jsonError('current_password and new_password are required');
    }
    if (strlen($newPassword) < 6) {
        jsonError('New password must be at least 6 characters');
    }

    $stmt = $db->prepare('SELECT password_hash FROM users WHERE id = ?');
    $stmt->execute([$auth['user_id']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($currentPassword, $user['password_hash'])) {
        jsonError('Current password is incorrect', 403);
    }

    $hash = password_hash($newPassword, PASSWORD_BCRYPT);
    $db->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([$hash, $auth['user_id']]);

    jsonResponse(['message' => 'Password changed']);
}
