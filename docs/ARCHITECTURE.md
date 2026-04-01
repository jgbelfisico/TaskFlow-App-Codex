# TaskFlow - Arquitectura Propuesta

## 1) Estructura de carpetas

```bash
.
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/           # env y cliente prisma
│   │   ├── controllers/      # capa HTTP
│   │   ├── middleware/       # auth, errores, etc.
│   │   ├── routes/           # definición de endpoints
│   │   ├── services/         # lógica de negocio
│   │   ├── utils/            # helpers transversales
│   │   ├── app.js            # bootstrap de express
│   │   └── server.js         # arranque del servidor
│   └── tests/                # tests de integración de API
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # componentes reutilizables
│   │   ├── pages/            # vistas por módulo
│   │   ├── services/         # cliente HTTP
│   │   ├── styles/           # estilos globales
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── tests/                # tests UI
├── docs/
│   └── ARCHITECTURE.md
├── docker-compose.yml
└── package.json
```

## 2) Modelos de datos

### `User`
- `id` (uuid, PK)
- `email` (unique)
- `password` (hash bcrypt)
- `createdAt`, `updatedAt`
- relación: 1:N con `Task`

### `Task`
- `id` (uuid, PK)
- `title` (required)
- `description` (optional)
- `completed` (boolean, default `false`)
- `userId` (FK a `User`)
- `createdAt`, `updatedAt`

## 3) Rutas API (REST, versionadas)

Base: `/api/v1`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (requiere token)

### Tasks
- `GET /tasks` (token)
- `POST /tasks` (token)
- `PATCH /tasks/:id` (token)
- `DELETE /tasks/:id` (token)

### Infra
- `GET /health`

## 4) Flujo de autenticación

1. Usuario envía credenciales a `/auth/register` o `/auth/login`.
2. Backend valida payload (Zod).
3. Se crea/verifica usuario en DB con Prisma.
4. Password se hashea/valida con bcrypt.
5. Backend responde JWT con `userId`.
6. Frontend guarda token en `localStorage`.
7. En requests privadas, frontend envía `Authorization: Bearer <token>`.
8. Middleware `requireAuth` valida token y añade `req.userId`.

## 5) Plan de implementación por fases

### Fase 1 — Base funcional (implementada en este commit)
- Monorepo y tooling local.
- API Express con versión `/api/v1` y healthcheck.
- Prisma schema + configuración PostgreSQL local (docker-compose).
- Autenticación base (`register`, `login`, `me`).
- Shell de frontend React con login/logout.
- Tests básicos de backend/frontend.

### Fase 2 — Gestión de tareas completa
- CRUD de tareas con validaciones adicionales.
- Estados de carga/error en UI.
- Filtros de tareas (pendientes/completadas).
- Tests de integración sobre flujo auth + tasks.

### Fase 3 — Calidad y hardening
- Refresh tokens + logout server-side.
- Rate limiting, logger estructurado y trazabilidad.
- CI pipeline (lint + test + build).
- Dockerfile de frontend/backend y entorno staging.
