# PMI App - Backend API

## Requisitos

- PHP 8.1+ con extensiones: `pdo_sqlite`, `json`, `openssl`
- macOS: `brew install php`
- Linux: `apt install php-cli php-sqlite3` (o equivalente)

## Instalación

```bash
# 1. Ir al directorio backend
cd backend

# 2. Inicializar la base de datos y crear usuario admin
php setup.php

# 3. Iniciar servidor de desarrollo
php -S localhost:8000 index.php
```

## API Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión (devuelve JWT) |
| GET | `/api/auth/me` | Obtener datos del usuario actual |

### Projects
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/projects` | Listar proyectos del usuario |
| POST | `/api/projects` | Crear nuevo proyecto |
| GET | `/api/projects/{id}` | Obtener proyecto completo |
| PUT | `/api/projects/{id}` | Actualizar proyecto (parcial o completo) |
| DELETE | `/api/projects/{id}` | Eliminar proyecto (solo admin) |

### Project Users (compartir)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/projects/{id}/users` | Listar usuarios del proyecto |
| POST | `/api/projects/{id}/users` | Añadir usuario por email |
| DELETE | `/api/projects/{id}/users/{userId}` | Eliminar usuario del proyecto |

## Ejemplos de uso

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pmi.app","password":"admin123"}'
```

### Crear proyecto (con token)
```bash
TOKEN="eyJ..."

curl -X POST http://localhost:8000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Mi Proyecto"}'
```

### Actualizar datos del proyecto
```bash
curl -X PUT http://localhost:8000/api/projects/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"data": {"nombre":"Proyecto X", "precioVenta": 50000}}'
```
