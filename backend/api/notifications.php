<?php

require_once __DIR__ . '/../lib/Database.php';
require_once __DIR__ . '/auth.php';

function handleListNotifications(): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();
    $stmt = $db->prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50');
    $stmt->execute([$auth['user_id']]);
    jsonResponse(['notifications' => $stmt->fetchAll()]);
}

function handleMarkRead(int $id): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();
    $stmt = $db->prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?');
    $stmt->execute([$id, $auth['user_id']]);
    jsonResponse(['message' => 'Marked as read']);
}

function handleMarkAllRead(): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();
    $db->prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?')->execute([$auth['user_id']]);
    jsonResponse(['message' => 'All marked as read']);
}

function handleUnreadCount(): void {
    $auth = authenticateRequest();
    $db = Database::getInstance();
    $stmt = $db->prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0');
    $stmt->execute([$auth['user_id']]);
    jsonResponse($stmt->fetch());
}

function createNotification(int $userId, string $type, string $title, string $message, array $data = []): void {
    $db = Database::getInstance();
    $stmt = $db->prepare('INSERT INTO notifications (user_id, type, title, message, data) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$userId, $type, $title, $message, json_encode($data)]);
}
