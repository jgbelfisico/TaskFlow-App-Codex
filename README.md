# TaskFlow

Aplicación web full-stack para gestión de tareas con autenticación de usuarios.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express + Prisma
- DB: PostgreSQL

## Scripts de build

### Root
```bash
npm run build
npm run build:backend
npm run build:frontend
npm run deploy:check
```

### Backend
```bash
npm run build --workspace backend
npm run start:prod --workspace backend
npm run prisma:migrate:deploy --workspace backend
```

### Frontend
```bash
npm run build --workspace frontend
npm run build:prod --workspace frontend
```

## Variables de entorno

### Backend (`backend/.env.example`)
- `NODE_ENV`: `development|test|production`
- `PORT`: puerto del API
- `DATABASE_URL`: conexión de PostgreSQL para Prisma
- `JWT_SECRET`: secreto JWT (mínimo 12 chars)
- `FRONTEND_URL`: URL pública del frontend
- `CORS_ORIGINS`: lista separada por comas de orígenes permitidos

Archivo de ejemplo producción: `backend/.env.production.example`.

### Frontend (`frontend/.env.example`)
- `VITE_API_URL`: URL base del API (ej: `https://api.taskflow.example.com/api/v1`)

Archivo de ejemplo producción: `frontend/.env.production.example`.

## Configuración para despliegue del frontend

Se incluye `frontend/Dockerfile` multi-stage y `frontend/nginx.conf`:
- build con Vite en stage Node
- serving estático con Nginx
- fallback SPA (`try_files ... /index.html`)

Build manual:
```bash
docker build -f frontend/Dockerfile -t taskflow-frontend .
```

## Configuración del backend para producción

Se incluye `backend/Dockerfile`:
- instalación de dependencias
- `prisma generate` durante build
- arranque con `npm run start:prod`

El backend ya incorpora:
- `helmet`
- rate limit básico
- `trust proxy`
- CORS configurable por `CORS_ORIGINS`
- validación de entorno y payloads

Build manual:
```bash
docker build -f backend/Dockerfile -t taskflow-backend .
```

## Instrucciones de base de datos (PostgreSQL + Prisma)

### Desarrollo
```bash
docker compose up -d
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend -- --name init
npm run prisma:seed --workspace backend
```

### Producción
1. Crear DB y credenciales seguras.
2. Configurar `DATABASE_URL` real en backend.
3. Ejecutar migraciones:
   ```bash
   npm run prisma:migrate:deploy --workspace backend
   ```
4. (Opcional) seed controlado solo si aplica.

## Despliegue con Docker Compose (producción)

Se incluye `docker-compose.prod.yml` con `frontend`, `backend` y `postgres`.

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## Checklist final de despliegue

- [ ] Variables de entorno reales (sin secretos de ejemplo).
- [ ] `JWT_SECRET` robusto y rotado.
- [ ] `CORS_ORIGINS` restringido a dominios reales.
- [ ] Migraciones Prisma aplicadas con `prisma migrate deploy`.
- [ ] Healthcheck API OK (`/api/v1/health`).
- [ ] Frontend sirviendo build estático y hablando con API correcta.
- [ ] Logs y monitoreo habilitados.
- [ ] Backups de PostgreSQL configurados.
- [ ] CI con `lint + test + build` antes de deploy.
