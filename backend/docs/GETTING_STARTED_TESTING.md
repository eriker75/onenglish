# 🚀 Guía Rápida de Testing - OneEnglish API

Guía paso a paso para poblar la base de datos y probar todos los endpoints.

---

## 📋 Requisitos Previos

- ✅ Docker y Docker Compose instalados
- ✅ Node.js 18+ instalado
- ✅ Postman o Insomnia instalado
- ✅ Archivo `.env` configurado

---

## 🎯 Paso 1: Levantar los Servicios

```bash
# Levantar todos los servicios (PostgreSQL, MongoDB, Redis)
make up-dev

# O alternativamente
docker-compose -f docker-compose.dev.yml up -d
```

Espera hasta que veas:
```
✅ NestJS application started
✅ PostgreSQL ready
✅ MongoDB ready
```

---

## 🌱 Paso 2: Poblar la Base de Datos

### Opción A: Usar el Makefile (Recomendado)
```bash
make seed
```

### Opción B: Usar npm
```bash
npm run prisma:seed
```

### Opción C: Directamente con ts-node
```bash
npx ts-node prisma/seed.ts
```

**Salida esperada:**
```
🌱 Starting seed...
🧹 Cleaning existing data...
✅ Database cleaned
📊 Seeding PostgreSQL...
✅ Created 5 permissions
✅ Created 4 roles (admin, coordinator, teacher, student)
✅ Assigned permissions to roles
✅ Created 3 schools (Lincoln, Jefferson, Washington)
✅ Created 11 users (2 admins, 3 coordinators, 3 teachers, 4 students)
✅ Assigned roles to users
✅ Created user settings for all users
✅ Created 2 admin profiles
✅ Created 3 coordinator profiles (one per school)
✅ Created 3 teacher profiles (2 Lincoln, 1 Jefferson)
✅ Created 4 student profiles (2 Lincoln, 1 Jefferson, 1 Washington)
✅ Created 3 challenges (Beginner, Intermediate, Advanced)
✅ Created school challenges
✅ Created student challenges (progress tracking)
✅ Created user activities

📊 Seed Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Schools:       3 (Lincoln, Jefferson, Washington)
Admins:        2
Coordinators:  3 (one per school)
Teachers:      3 (2 Lincoln, 1 Jefferson)
Students:      4 (2 Lincoln, 1 Jefferson, 1 Washington)
Challenges:    3 (Beginner, Intermediate, Advanced)
Users Total:   11
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 Test Credentials (all use password: password123):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN:
  - admin@onenglish.com / admin
  - admin2@onenglish.com / admin2

COORDINATORS:
  - maria.rodriguez@lincolnhs.edu / mariarodriguez (Lincoln)
  - john.wilson@jeffersonacademy.edu / johnwilson (Jefferson)
  - susan.chen@washingtoninstitute.edu / susanchen (Washington)

TEACHERS:
  - jane.smith@lincolnhs.edu / janesmith (Lincoln)
  - robert.brown@lincolnhs.edu / robertbrown (Lincoln)
  - emily.davis@jeffersonacademy.edu / emilydavis (Jefferson)

STUDENTS:
  - john.doe@lincolnhs.edu / johndoe (Lincoln)
  - sarah.williams@lincolnhs.edu / sarahwilliams (Lincoln)
  - michael.johnson@jeffersonacademy.edu / michaeljohnson (Jefferson)
  - lisa.garcia@washingtoninstitute.edu / lisagarcia (Washington)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Seed completed successfully!
```

---

## 🔑 Paso 3: Obtener Tokens de Autenticación

### 3.1 - Login como Admin

**Endpoint:** `POST http://localhost:3000/auth/login`

**Body:**
```json
{
  "email": "admin@onenglish.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "admin@onenglish.com",
    ...
  }
}
```

**→ Copiar `access_token` y guardarlo como variable `ADMIN_TOKEN` en Postman**

---

### 3.2 - Login como Coordinator (Lincoln)

**Body:**
```json
{
  "email": "maria.rodriguez@lincolnhs.edu",
  "password": "password123"
}
```

**→ Guardar token como `COORDINATOR_LINCOLN_TOKEN`**

---

### 3.3 - Login como Coordinator (Jefferson)

**Body:**
```json
{
  "email": "john.wilson@jeffersonacademy.edu",
  "password": "password123"
}
```

**→ Guardar token como `COORDINATOR_JEFFERSON_TOKEN`**

---

### 3.4 - Login como Teacher

**Body:**
```json
{
  "email": "jane.smith@lincolnhs.edu",
  "password": "password123"
}
```

**→ Guardar token como `TEACHER_TOKEN`**

---

### 3.5 - Login como Student

**Body:**
```json
{
  "email": "john.doe@lincolnhs.edu",
  "password": "password123"
}
```

**→ Guardar token como `STUDENT_TOKEN`**

---

## 📊 Paso 4: Obtener IDs de las Escuelas

### 4.1 - Listar Todas las Escuelas

**Endpoint:** `GET http://localhost:3000/schools`

**Response:**
```json
[
  {
    "id": "uuid-lincoln",
    "name": "Lincoln High School",
    "code": "LHS001",
    ...
  },
  {
    "id": "uuid-jefferson",
    "name": "Jefferson Academy",
    "code": "JA001",
    ...
  },
  {
    "id": "uuid-washington",
    "name": "Washington Institute",
    "code": "WI001",
    ...
  }
]
```

**→ Guardar los IDs como:**
- `LINCOLN_SCHOOL_ID`
- `JEFFERSON_SCHOOL_ID`
- `WASHINGTON_SCHOOL_ID`

---

## 🧪 Paso 5: Probar los Endpoints

### Test 1: Admin Crea Escuela ✅

```http
POST /schools
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json
```
```json
{
  "name": "Test School",
  "code": "TEST001",
  "city": "Test City"
}
```

**Resultado esperado:** 201 Created

---

### Test 2: Coordinator Crea Student en Su Escuela ✅

```http
POST /students
Authorization: Bearer {{COORDINATOR_LINCOLN_TOKEN}}
Content-Type: application/json
```
```json
{
  "firstName": "NewStudent",
  "lastName": "ForLincoln",
  "email": "newstudent@lincolnhs.edu",
  "userId": "CREATE_USER_FIRST",
  "schoolId": "{{LINCOLN_SCHOOL_ID}}"
}
```

**Resultado esperado:** 201 Created

---

### Test 3: Coordinator Intenta Crear en Otra Escuela ❌

```http
POST /students
Authorization: Bearer {{COORDINATOR_LINCOLN_TOKEN}}
Content-Type: application/json
```
```json
{
  "firstName": "WrongSchool",
  "lastName": "Student",
  "email": "wrong@jeffersonacademy.edu",
  "userId": "CREATE_USER_FIRST",
  "schoolId": "{{JEFFERSON_SCHOOL_ID}}"
}
```

**Resultado esperado:** 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Coordinators can only add members to their own school",
  "error": "Forbidden"
}
```

---

### Test 4: Coordinator Lee Student de Su Escuela ✅

```http
GET /students/{student-lincoln-id}
Authorization: Bearer {{COORDINATOR_LINCOLN_TOKEN}}
```

**Resultado esperado:** 200 OK con datos del estudiante

---

### Test 5: Coordinator Intenta Leer Student de Otra Escuela ❌

```http
GET /students/{student-jefferson-id}
Authorization: Bearer {{COORDINATOR_LINCOLN_TOKEN}}
```

**Resultado esperado:** 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only access resources from your own school",
  "error": "Forbidden"
}
```

---

### Test 6: Teacher Lee Student de Su Escuela ✅

```http
GET /students/{student-lincoln-id}
Authorization: Bearer {{TEACHER_TOKEN}}
```

**Resultado esperado:** 200 OK

---

### Test 7: Teacher Intenta Crear Student ❌

```http
POST /students
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: application/json
```
```json
{
  "firstName": "Test",
  "lastName": "Student",
  "email": "test@lincolnhs.edu",
  "userId": "uuid",
  "schoolId": "{{LINCOLN_SCHOOL_ID}}"
}
```

**Resultado esperado:** 403 Forbidden

---

### Test 8: Admin Lee/Actualiza Cualquier Recurso ✅

```http
GET /students/{any-student-id}
Authorization: Bearer {{ADMIN_TOKEN}}
```

```http
PATCH /students/{any-student-id}
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json
```
```json
{
  "firstName": "Updated",
  "bio": "Admin updated this"
}
```

**Resultado esperado:** 200 OK en ambos casos

---

## 📚 Paso 6: Verificar Datos en Prisma Studio

```bash
npm run prisma:studio
```

Abre http://localhost:5555 y verifica:
- ✅ 3 Schools
- ✅ 11 Users
- ✅ 2 Admins
- ✅ 3 Coordinators
- ✅ 3 Teachers
- ✅ 4 Students
- ✅ 4 Roles
- ✅ 12 UserRoles
- ✅ 3 Challenges

---

## 🎯 Flujo Completo de Onboarding Real

### Escenario: Configurar Nueva Escuela

**1. Admin crea la escuela:**
```bash
POST /schools (como Admin)
{
  "name": "Nueva Escuela",
  "code": "NE001"
}
```

**2. Admin crea User base para coordinator:**
```bash
# En la DB directamente o a través de endpoint de registro
INSERT INTO users (email, firstName, lastName, ...)
```

**3. Admin crea Coordinator:**
```bash
POST /coordinators (como Admin)
{
  "firstName": "Nuevo",
  "lastName": "Coordinador",
  "email": "coord@nuevaescuela.edu",
  "userId": "{user-id}",
  "schoolId": "{nueva-escuela-id}",
  "username": "nuevocoord",
  "password": "Pass123!"
}
```

**4. Coordinator hace login:**
```bash
POST /auth/login
{
  "email": "coord@nuevaescuela.edu",
  "password": "Pass123!"
}
```

**5. Coordinator agrega Teachers:**
```bash
POST /teachers (como Coordinator)
{
  "schoolId": "{nueva-escuela-id}",  # Su escuela
  ...
}
```

**6. Coordinator agrega Students:**
```bash
POST /students (como Coordinator)
{
  "schoolId": "{nueva-escuela-id}",  # Su escuela
  ...
}
```

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"
```bash
# Verificar que los servicios estén corriendo
docker ps

# Si no están corriendo
make up-dev
```

### Error: "Unique constraint failed"
```bash
# Resetear la base de datos
npm run prisma:reset

# Ejecutar seed nuevamente
npm run prisma:seed
```

### Error: "User with email already exists"
```bash
# Cambiar el email en el body
# O limpiar la base de datos primero
npm run prisma:reset
```

### Error: 401 Unauthorized
```bash
# Tu token expiró, hacer login nuevamente
POST /auth/login
```

### Error: 403 Forbidden
```bash
# Verificar que estés usando el rol correcto
# Verificar que el schoolId sea el correcto (para coordinators)
```

---

## 📖 Documentos de Referencia

1. **[POSTMAN_BODIES.md](./POSTMAN_BODIES.md)** - Todos los bodies de ejemplo
2. **[TEST_CREDENTIALS.md](./TEST_CREDENTIALS.md)** - Credenciales del seed
3. **[PERMISSIONS_SYSTEM.md](./PERMISSIONS_SYSTEM.md)** - Sistema de permisos
4. **[API_EXAMPLES.md](./API_EXAMPLES.md)** - Ejemplos con cURL

---

## 🎓 Siguiente Paso

Una vez que hayas poblado la DB y obtenido los tokens, dirígete a:
- **[POSTMAN_BODIES.md](./POSTMAN_BODIES.md)** para ver todos los bodies listos para copiar
- **[PERMISSIONS_FLOW.md](./PERMISSIONS_FLOW.md)** para entender los flujos de autorización

---

## ✅ Checklist de Inicio

- [ ] Servicios corriendo (`make up-dev`)
- [ ] Base de datos poblada (`make seed`)
- [ ] Prisma Studio abierto (`npm run prisma:studio`)
- [ ] Tokens obtenidos para cada rol
- [ ] Variables configuradas en Postman
- [ ] IDs de escuelas guardados

---

¡Listo para probar! 🚀

