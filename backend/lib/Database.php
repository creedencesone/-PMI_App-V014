<?php

require_once __DIR__ . '/../config.php';

class Database {
    private static ?PDO $instance = null;

    public static function getInstance(): PDO {
        if (self::$instance === null) {
            $exists = file_exists(DB_PATH);
            self::$instance = new PDO('sqlite:' . DB_PATH, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
            self::$instance->exec('PRAGMA journal_mode=WAL');
            self::$instance->exec('PRAGMA foreign_keys=ON');
            if (!$exists) {
                self::initSchema();
            }
            self::runMigrations();
        }
        return self::$instance;
    }

    private static function runMigrations(): void {
        $db = self::$instance;
        $version = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name='notifications'")->fetch();
        if (!$version) {
            $db->exec('CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                type TEXT NOT NULL,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                data TEXT DEFAULT \'{}\',
                is_read INTEGER DEFAULT 0,
                created_at TEXT DEFAULT (datetime(\'now\')),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )');
            $db->exec('CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read)');
        }

        $catalogMaterials = $db->query(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='catalog_materials'"
        )->fetch();
        if (!$catalogMaterials) {
            $db->exec('CREATE TABLE IF NOT EXISTS catalog_materials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                nombre TEXT NOT NULL,
                proveedor TEXT DEFAULT \'\',
                partNumber TEXT DEFAULT \'\',
                hsCode TEXT DEFAULT \'\',
                pesoUnitario REAL DEFAULT 0,
                costeUnitario REAL DEFAULT 0,
                moneda TEXT DEFAULT \'EUR\',
                paisOrigen TEXT DEFAULT \'\',
                incoterm TEXT DEFAULT \'CIF\',
                notas TEXT DEFAULT \'\',
                created_at TEXT DEFAULT (datetime(\'now\')),
                updated_at TEXT DEFAULT (datetime(\'now\')),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )');
            $db->exec('CREATE INDEX IF NOT EXISTS idx_catalog_materials_user ON catalog_materials(user_id)');
        }

        $catalogTeam = $db->query(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='catalog_team_members'"
        )->fetch();
        if (!$catalogTeam) {
            $db->exec('CREATE TABLE IF NOT EXISTS catalog_team_members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                nombre TEXT NOT NULL,
                rol TEXT DEFAULT \'\',
                email TEXT DEFAULT \'\',
                telefono TEXT DEFAULT \'\',
                foto TEXT DEFAULT \'\',
                costeHora REAL DEFAULT 0,
                moneda TEXT DEFAULT \'EUR\',
                horasMes INTEGER DEFAULT 160,
                created_at TEXT DEFAULT (datetime(\'now\')),
                updated_at TEXT DEFAULT (datetime(\'now\')),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )');
            $db->exec('CREATE INDEX IF NOT EXISTS idx_catalog_team_user ON catalog_team_members(user_id)');
        }

        // Agenda table migration
        $agenda = $db->query(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='agenda'"
        )->fetch();
        if (!$agenda) {
            $db->exec('CREATE TABLE IF NOT EXISTS agenda (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                proyecto_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                fecha_inicio TEXT NOT NULL,
                fecha_fin TEXT NOT NULL,
                hora_inicio TEXT DEFAULT \'09:00\',
                hora_fin TEXT DEFAULT \'10:00\',
                titulo TEXT NOT NULL,
                descripcion TEXT DEFAULT \'\',
                categoria TEXT DEFAULT \'otro\',
                es_alarma INTEGER DEFAULT 0,
                hito_id INTEGER,
                created_at TEXT DEFAULT (datetime(\'now\')),
                updated_at TEXT DEFAULT (datetime(\'now\')),
                FOREIGN KEY (proyecto_id) REFERENCES projects(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )');
            $db->exec('CREATE INDEX IF NOT EXISTS idx_agenda_proyecto_fecha ON agenda(proyecto_id, fecha_inicio)');
            $db->exec('CREATE INDEX IF NOT EXISTS idx_agenda_user ON agenda(user_id)');
        } else {
            // Migration: add new columns if they don't exist
            $cols = $db->query("PRAGMA table_info(agenda)")->fetchAll(PDO::FETCH_COLUMN, 1);
            if (!in_array('fecha_inicio', $cols)) {
                $db->exec('ALTER TABLE agenda ADD COLUMN fecha_inicio TEXT');
                $db->exec('ALTER TABLE agenda ADD COLUMN fecha_fin TEXT');
                $db->exec('ALTER TABLE agenda ADD COLUMN hora_inicio TEXT');
                $db->exec('ALTER TABLE agenda ADD COLUMN hora_fin TEXT');
                // Copy old fecha to fecha_inicio/fecha_fin for existing records
                $db->exec('UPDATE agenda SET fecha_inicio = fecha, fecha_fin = fecha WHERE fecha_inicio IS NULL OR fecha_fin IS NULL');
            }
            // Make old fecha column nullable (optional, for backward compat)
            if (!in_array('fecha_old_backup', $cols)) {
                $db->exec('ALTER TABLE agenda ADD COLUMN fecha_old_backup TEXT');
                $db->exec('UPDATE agenda SET fecha_old_backup = fecha WHERE fecha_old_backup IS NULL');
            }
            // Note: SQLite doesn't support DROP COLUMN directly in older versions
            // We'll just leave the old column as nullable for backward compat
            $fechaCol = $db->query("SELECT * FROM pragma_table_info('agenda') WHERE name='fecha'")->fetch(PDO::FETCH_ASSOC);
            if ($fechaCol && $fechaCol['notnull']) {
                // Need to recreate table to make fecha nullable
                $db->exec('BEGIN TRANSACTION');
                $db->exec('CREATE TABLE agenda_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    proyecto_id INTEGER NOT NULL,
                    user_id INTEGER NOT NULL,
                    fecha TEXT,
                    fecha_inicio TEXT,
                    fecha_fin TEXT,
                    hora_inicio TEXT,
                    hora_fin TEXT,
                    titulo TEXT NOT NULL,
                    descripcion TEXT DEFAULT \'\',
                    categoria TEXT DEFAULT \'otro\',
                    es_alarma INTEGER DEFAULT 0,
                    hito_id INTEGER,
                    created_at TEXT DEFAULT (datetime(\'now\')),
                    updated_at TEXT DEFAULT (datetime(\'now\')),
                    FOREIGN KEY (proyecto_id) REFERENCES projects(id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )');
                $db->exec('INSERT INTO agenda_new (id, proyecto_id, user_id, fecha, fecha_inicio, fecha_fin, hora_inicio, hora_fin, titulo, descripcion, categoria, es_alarma, hito_id, created_at, updated_at)
                           SELECT id, proyecto_id, user_id, fecha, fecha_inicio, fecha_fin, hora_inicio, hora_fin, titulo, descripcion, categoria, es_alarma, hito_id, created_at, updated_at FROM agenda');
                $db->exec('DROP TABLE agenda');
                $db->exec('ALTER TABLE agenda_new RENAME TO agenda');
                $db->exec('CREATE INDEX IF NOT EXISTS idx_agenda_proyecto_fecha ON agenda(proyecto_id, fecha_inicio)');
                $db->exec('CREATE INDEX IF NOT EXISTS idx_agenda_user ON agenda(user_id)');
                $db->exec('COMMIT');
            }
        }
    }

    private static function initSchema(): void {
        $db = self::$instance;
        $sql = <<<'SQL'
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor',
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    data TEXT NOT NULL DEFAULT '{}',
    owner_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS project_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor',
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(project_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_project_users_project ON project_users(project_id);
CREATE INDEX IF NOT EXISTS idx_project_users_user ON project_users(user_id);

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data TEXT DEFAULT '{}',
    is_read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
SQL;
        $db->exec($sql);
    }
}
