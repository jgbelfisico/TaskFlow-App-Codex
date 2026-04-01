# TaskFlow

Aplicación web full-stack para gestión de tareas con autenticación de usuarios.

## Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **DB:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **Testing:** Jest/Supertest (backend) + Vitest/Testing Library (frontend)

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
- API: http://localhost:4000/api

## Endpoints principales

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Tasks (requieren bearer token)
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

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

## Tests básicos incluidos

- Healthcheck y validación de payload en API.
- Render básico del frontend.

## Próximos pasos recomendados

- Añadir refresh tokens y recuperación de contraseña.
- Agregar validación de ownership más granular en logs y auditoría.
- Integrar CI (lint + tests + build).
