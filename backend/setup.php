<?php
/**
 * One-time setup: creates the database and an admin user.
 * Run: php setup.php
 */

require_once __DIR__ . '/lib/Database.php';
require_once __DIR__ . '/config.php';

echo "Initializing database at: " . DB_PATH . "\n";

try {
    $db = Database::getInstance();
    echo "✅ Database ready\n";

    // Check if admin exists
    $stmt = $db->prepare('SELECT COUNT(*) as cnt FROM users');
    $stmt->execute();
    $count = $stmt->fetch()['cnt'];

    if ($count === 0) {
        $hash = password_hash('admin123', PASSWORD_BCRYPT);
        $stmt = $db->prepare('INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)');
        $stmt->execute(['admin@pmi.app', 'Admin', $hash, 'admin']);
        echo "✅ Default admin user created:\n";
        echo "   Email: admin@pmi.app\n";
        echo "   Password: admin123\n";
    } else {
        echo "ℹ️  Users already exist ($count found), skipping default user\n";
    }

    echo "\nSetup complete!\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
