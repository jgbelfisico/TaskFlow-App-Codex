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

✅ Base funcional con autenticación y CRUD de tareas conectados entre frontend y backend.

---

## Requisitos

- Node.js 20+
- npm 10+
- Docker + Docker Compose

## Variables de entorno

1. Backend:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Frontend:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

---

## Pasos exactos para correr la app (local)

### 1) Instalar dependencias
```bash
npm install
```

### 2) Levantar PostgreSQL
```bash
docker compose up -d
```

### 3) Generar cliente Prisma
```bash
npm run prisma:generate --workspace backend
```

### 4) Crear/aplicar migración
```bash
npm run prisma:migrate --workspace backend -- --name init
```

### 5) (Opcional) Seed demo
```bash
npm run prisma:seed --workspace backend
```

### 6) Ejecutar backend + frontend
```bash
npm run dev
```

URLs esperadas:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api/v1

---


## Endurecimiento aplicado

- Validaciones estrictas en auth y tareas (longitud, formato, contraseñas robustas, UUID en rutas).
- Sanitización básica de texto (`trim` + remoción de caracteres de control).
- Manejo de errores uniforme con `AppError` y middleware central.
- Protección adicional: rate limit básico en API y `x-powered-by` deshabilitado.
- Mejora de rendimiento inicial en listados de tareas con paginación (`limit`, `offset`) y `select` de campos.

---

## Verificación end-to-end (manual)

> Puedes validar desde UI o por `curl` para aislar backend.

### 1) Registro
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@taskflow.dev","password":"Password123"}'
```

### 2) Login
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@taskflow.dev","password":"Password123"}'
```
Guarda el `token` de la respuesta.

### 3) Crear tarea
```bash
curl -X POST http://localhost:4000/api/v1/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Primera tarea","description":"Prueba E2E"}'
```

### 4) Listar tareas
```bash
curl http://localhost:4000/api/v1/tasks \
  -H "Authorization: Bearer <TOKEN>"
```

### 5) Editar tarea
```bash
curl -X PATCH http://localhost:4000/api/v1/tasks/<TASK_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Tarea editada"}'
```

### 6) Completar tarea
```bash
curl -X PATCH http://localhost:4000/api/v1/tasks/<TASK_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

### 7) Borrar tarea
```bash
curl -X DELETE http://localhost:4000/api/v1/tasks/<TASK_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

---

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

---

## Pendientes y mejoras futuras

1. **Auth y seguridad**
   - Refresh tokens + rotación.
   - Logout server-side.
   - Rate limiting y protección anti brute-force.

2. **UX/UI**
   - Filtros por estado (todas/pendientes/completadas).
   - Búsqueda por texto.
   - Confirmación modal al eliminar.

3. **Calidad y observabilidad**
   - Cobertura de tests E2E reales (Playwright/Cypress).
   - CI/CD con lint + test + build.
   - Logging estructurado y métricas.

4. **Producto**
   - Fechas límite y prioridades.
   - Etiquetas/categorías.
   - Colaboración multiusuario.
