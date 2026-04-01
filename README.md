# TaskFlow

Aplicación web full-stack para gestión de tareas con autenticación de usuarios.

## Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **DB:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **Testing:** Jest/Supertest (backend) + Vitest/Testing Library (frontend)

## Estado actual

✅ **Fase 1 implementada**: base funcional con autenticación, API versionada (`/api/v1`), modelo de datos inicial, shell frontend y tests básicos.

Para el detalle completo de arquitectura y roadmap por fases revisa `docs/ARCHITECTURE.md`.

## Estructura del proyecto

```bash
.
├── backend
│   ├── prisma
│   ├── src
│   └── tests
├── frontend
│   ├── src
│   └── tests
├── docs
│   └── ARCHITECTURE.md
├── docker-compose.yml
└── package.json
```

## Requisitos

- Node.js 20+
- npm 10+
- Docker (opcional, recomendado para PostgreSQL)

## Primeros pasos

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Levantar PostgreSQL:
   ```bash
   docker compose up -d
   ```

3. Configurar variables de entorno:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

4. Generar cliente Prisma y aplicar migración:
   ```bash
   npm run prisma:generate --workspace backend
   npm run prisma:migrate --workspace backend -- --name init
   ```

5. (Opcional) Cargar datos demo:
   ```bash
   npm run prisma:seed --workspace backend
   ```

6. Ejecutar entorno local completo:
   ```bash
   npm run dev
   ```

- Frontend: http://localhost:5173
- API: http://localhost:4000/api/v1

## Endpoints principales

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Tasks (requieren bearer token)
- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`

### Infra
- `GET /api/v1/health`

## Scripts útiles

### Root
- `npm run dev`
- `npm run test`
- `npm run build`

### Backend
- `npm run dev --workspace backend`
- `npm run prisma:migrate --workspace backend`
- `npm run test --workspace backend`

### Frontend
- `npm run dev --workspace frontend`
- `npm run test --workspace frontend`
