# Ejemplos de Uso de la API

Este documento proporciona ejemplos prácticos de cómo usar los endpoints de la API con diferentes roles.

---

## 🔑 Autenticación

Todos los endpoints protegidos requieren un token JWT en el header:

```http
Authorization: Bearer {your_jwt_token}
```

### 📝 Registro de Estudiante (Público)

Los estudiantes pueden registrarse por sí mismos sin autenticación previa:

```bash
curl -X POST http://localhost:3000/auth/register/student \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "phone": "+1234567890",
    "bio": "I love learning English!",
    "acceptTerms": true
  }'
```

**Respuesta exitosa (201 Created):**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "bio": "I love learning English!",
    "isOnline": false,
    "isActive": true,
    "isVerified": false,
    "roles": "student",
    "student": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "student@example.com",
      "phone": "+1234567890",
      "bio": "I love learning English!",
      "isActive": true,
      "schoolId": null
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "refreshExpiresIn": 604800
}
```

**Notas importantes:**
- El endpoint es **público** (no requiere autenticación)
- Automáticamente asigna el rol `STUDENT`
- Crea el perfil de estudiante automáticamente
- El estudiante puede registrarse sin estar asociado a ninguna escuela (`schoolId: null`)
- Retorna tokens JWT para iniciar sesión inmediatamente
- `acceptTerms` debe ser `true` para completar el registro
- `username` es opcional pero debe ser único si se proporciona

### 🔐 Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "SecurePass123"
  }'
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "isOnline": true,
    "isActive": true,
    "isVerified": true,
    "roles": "student"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "refreshExpiresIn": 604800
}
```

### 🔄 Refresh Token

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "refreshExpiresIn": 604800
}
```

### 👤 Obtener Perfil

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer {your_jwt_token}"
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "isVerified": true
  }
}
```

### 🚪 Logout

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer {your_jwt_token}"
```

**Respuesta exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 🔧 Registro de Administrador (SOLO DESARROLLO)

⚠️ **ADVERTENCIA**: Este endpoint **solo está disponible en desarrollo** (NODE_ENV !== 'production').  
En producción retorna 404 Not Found.

```bash
curl -X POST http://localhost:3000/auth/register/admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPass123",
    "firstName": "Admin",
    "lastName": "User",
    "username": "admin_user",
    "phone": "+1234567890",
    "bio": "System administrator",
    "acceptTerms": true
  }'
```

**Respuesta exitosa (201 Created) - Solo en desarrollo:**
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "username": "admin_user",
    "firstName": "Admin",
    "lastName": "User",
    "phone": "+1234567890",
    "bio": "System administrator",
    "isOnline": false,
    "isActive": true,
    "isVerified": true,
    "roles": "admin",
    "admin": {
      "id": "uuid",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@example.com",
      "phone": "+1234567890",
      "bio": "System administrator",
      "isActive": true
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "refreshExpiresIn": 604800
}
```

**Respuesta en producción (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Not Found"
}
```

**Características:**
- ⚠️ **Solo disponible en desarrollo** (NODE_ENV !== 'production')
- ✅ Crea usuario con rol ADMIN automáticamente
- ✅ Administrador queda verificado por defecto (isVerified: true)
- ✅ Retorna tokens JWT para login inmediato
- ❌ **Retorna 404 en producción** para seguridad

**Variables de entorno:**
```bash
# Desarrollo (endpoint disponible)
NODE_ENV=development

# Producción (endpoint retorna 404)
NODE_ENV=production
```

---

## 1. SCHOOLS (Escuelas)

### ✅ Crear Escuela (Solo ADMIN)

```bash
curl -X POST http://localhost:3000/schools \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lincoln High School",
    "code": "LHS001",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "country": "United States",
    "postalCode": "10001",
    "phone": "+1234567890",
    "email": "contact@lincolnhs.edu",
    "website": "https://www.lincolnhs.edu",
    "description": "A prestigious educational institution",
    "isActive": true
  }'
```

### ✅ Listar Escuelas (Público)

```bash
curl -X GET http://localhost:3000/schools
```

### ✅ Obtener Escuela por ID (Público)

```bash
curl -X GET http://localhost:3000/schools/{school-uuid}
```

### ✅ Actualizar Escuela (Solo ADMIN)

```bash
curl -X PATCH http://localhost:3000/schools/{school-uuid} \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lincoln Academy",
    "isActive": true
  }'
```

### ✅ Eliminar Escuela (Solo ADMIN)

```bash
curl -X DELETE http://localhost:3000/schools/{school-uuid} \
  -H "Authorization: Bearer {admin_token}"
```

---

## 2. ADMINS (Administradores)

### ✅ Crear Admin (Solo ADMIN)

```bash
curl -X POST http://localhost:3000/admins \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Carlos",
    "lastName": "Martinez",
    "email": "carlos.martinez@onenglish.com",
    "userId": "{user-uuid}",
    "username": "carlosmartinez",
    "password": "SecurePass123",
    "phone": "+1234567890",
    "isActive": true
  }'
```

### ✅ Listar Admins (Solo ADMIN)

```bash
curl -X GET http://localhost:3000/admins \
  -H "Authorization: Bearer {admin_token}"
```

---

## 3. COORDINATORS (Coordinadores)

### ✅ Crear Coordinator (ADMIN para cualquier escuela)

```bash
curl -X POST http://localhost:3000/coordinators \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Maria",
    "lastName": "Rodriguez",
    "email": "maria.rodriguez@lhs.edu",
    "userId": "{user-uuid}",
    "schoolId": "{school-uuid}",
    "username": "mariarodriguez",
    "password": "SecurePass123",
    "phone": "+1234567890",
    "isActive": true
  }'
```

### ✅ Crear Coordinator (COORDINATOR solo para su escuela)

```bash
curl -X POST http://localhost:3000/coordinators \
  -H "Authorization: Bearer {coordinator_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Perez",
    "email": "juan.perez@lhs.edu",
    "userId": "{user-uuid}",
    "schoolId": "{MY_SCHOOL_UUID}",
    "username": "juanperez",
    "password": "SecurePass123"
  }'
```

❌ **ERROR si schoolId no coincide:**
```json
{
  "statusCode": 403,
  "message": "Coordinators can only add members to their own school",
  "error": "Forbidden"
}
```

### ✅ Listar Coordinators (Público)

```bash
curl -X GET http://localhost:3000/coordinators
```

### ✅ Listar Coordinators por Escuela (Público)

```bash
curl -X GET http://localhost:3000/coordinators/school/{school-uuid}
```

---

## 4. TEACHERS (Profesores)

### ✅ Crear Teacher (ADMIN para cualquier escuela)

```bash
curl -X POST http://localhost:3000/teachers \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@lhs.edu",
    "userId": "{user-uuid}",
    "schoolId": "{school-uuid}",
    "username": "janesmith",
    "password": "SecurePass123",
    "phone": "+1234567890",
    "bio": "English teacher with 10 years of experience"
  }'
```

### ✅ Crear Teacher (COORDINATOR solo para su escuela)

```bash
curl -X POST http://localhost:3000/teachers \
  -H "Authorization: Bearer {coordinator_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@lhs.edu",
    "userId": "{user-uuid}",
    "schoolId": "{MY_SCHOOL_UUID}",
    "username": "janesmith",
    "password": "SecurePass123"
  }'
```

### ✅ Listar Teachers (Público)

```bash
curl -X GET http://localhost:3000/teachers
```

### ✅ Listar Teachers por Escuela (Público)

```bash
curl -X GET http://localhost:3000/teachers/school/{school-uuid}
```

### ✅ Actualizar Teacher (Solo ADMIN)

```bash
curl -X PATCH http://localhost:3000/teachers/{teacher-uuid} \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated biography",
    "isActive": true
  }'
```

---

## 5. STUDENTS (Estudiantes)

### ✅ Crear Student (ADMIN para cualquier escuela)

```bash
curl -X POST http://localhost:3000/students \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@lhs.edu",
    "userId": "{user-uuid}",
    "schoolId": "{school-uuid}",
    "username": "johndoe",
    "password": "SecurePass123",
    "phone": "+1234567890",
    "bio": "Passionate about learning English"
  }'
```

### ✅ Crear Student (COORDINATOR solo para su escuela)

```bash
curl -X POST http://localhost:3000/students \
  -H "Authorization: Bearer {coordinator_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@lhs.edu",
    "userId": "{user-uuid}",
    "schoolId": "{MY_SCHOOL_UUID}",
    "username": "johndoe",
    "password": "SecurePass123"
  }'
```

### ✅ Listar Students (Público)

```bash
curl -X GET http://localhost:3000/students
```

### ✅ Obtener Student por ID (Admin: cualquier escuela)

```bash
curl -X GET http://localhost:3000/students/{student-uuid} \
  -H "Authorization: Bearer {admin_token}"
```

### ✅ Obtener Student por ID (Coordinator/Teacher: solo su escuela)

```bash
# Si el student pertenece a la misma escuela ✅
curl -X GET http://localhost:3000/students/{student-uuid} \
  -H "Authorization: Bearer {coordinator_token}"

# Si el student pertenece a otra escuela ❌
# Response: 403 Forbidden - "You can only access resources from your own school"
```

### ✅ Listar Students por Escuela (Público)

```bash
curl -X GET http://localhost:3000/students/school/{school-uuid}
```

---

## 🚫 Ejemplos de Errores Comunes

### 1. Coordinator intenta leer student de otra escuela

**Request:**
```bash
curl -X GET http://localhost:3000/students/{student-from-other-school-uuid} \
  -H "Authorization: Bearer {coordinator_token}"
```

**Response:**
```json
{
  "statusCode": 403,
  "message": "You can only access resources from your own school",
  "error": "Forbidden"
}
```

---

### 2. Teacher intenta leer teacher de otra escuela

**Request:**
```bash
curl -X GET http://localhost:3000/teachers/{teacher-from-other-school-uuid} \
  -H "Authorization: Bearer {teacher_token}"
```

**Response:**
```json
{
  "statusCode": 403,
  "message": "You can only access resources from your own school",
  "error": "Forbidden"
}
```

---

### 3. Coordinator intenta agregar a otra escuela

**Request:**
```bash
curl -X POST http://localhost:3000/students \
  -H "Authorization: Bearer {coordinator_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "schoolId": "different-school-uuid",
    ...
  }'
```

**Response:**
```json
{
  "statusCode": 403,
  "message": "Coordinators can only add members to their own school",
  "error": "Forbidden"
}
```

---

### 2. Usuario sin rol apropiado

**Request:**
```bash
curl -X POST http://localhost:3000/students \
  -H "Authorization: Bearer {teacher_token}" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

**Response:**
```json
{
  "statusCode": 403,
  "message": "User John Smith needs one of these roles: [admin, coordinator]",
  "error": "Forbidden"
}
```

---

### 3. Email duplicado

**Request:**
```bash
curl -X POST http://localhost:3000/students \
  -H "Authorization: Bearer {coordinator_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "existing@email.com",
    ...
  }'
```

**Response:**
```json
{
  "statusCode": 409,
  "message": "Student with email existing@email.com already exists",
  "error": "Conflict"
}
```

---

### 4. School no existe

**Request:**
```bash
curl -X POST http://localhost:3000/students \
  -H "Authorization: Bearer {coordinator_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "schoolId": "non-existent-uuid",
    ...
  }'
```

**Response:**
```json
{
  "statusCode": 404,
  "message": "School with ID non-existent-uuid not found",
  "error": "Not Found"
}
```

---

### 5. Coordinator sin escuela asignada

**Request:**
```bash
curl -X POST http://localhost:3000/students \
  -H "Authorization: Bearer {coordinator_token}" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

**Response:**
```json
{
  "statusCode": 403,
  "message": "Coordinator must be assigned to a school",
  "error": "Forbidden"
}
```

---

## 🧪 Testing con Postman/Insomnia

### Colección de Variables

```
BASE_URL = http://localhost:3000
ADMIN_TOKEN = {tu_admin_jwt_token}
COORDINATOR_TOKEN = {tu_coordinator_jwt_token}
SCHOOL_A_UUID = {uuid_de_escuela_a}
SCHOOL_B_UUID = {uuid_de_escuela_b}
USER_UUID = {uuid_de_usuario}
```

### Flujo de Prueba Completo

1. **Login como Admin** → Obtener ADMIN_TOKEN
2. **Crear School A** → Obtener SCHOOL_A_UUID
3. **Crear User** → Obtener USER_UUID
4. **Crear Coordinator para School A** (como Admin)
5. **Login como Coordinator** → Obtener COORDINATOR_TOKEN
6. **Crear Student en School A** (como Coordinator) ✅
7. **Intentar crear Student en School B** (como Coordinator) ❌

---

## 📊 Responses de Éxito

### Crear Recurso (201 Created)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "schoolId": "456e4567-e89b-12d3-a456-426614174000",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### Listar Recursos (200 OK)
```json
[
  {
    "id": "...",
    "firstName": "John",
    ...
  },
  {
    "id": "...",
    "firstName": "Jane",
    ...
  }
]
```

---

## 🔧 Tips de Desarrollo

### 1. Verificar roles del usuario actual
```typescript
// En un guard o controller
const user = req.user;
const roles = await this.getUserRoles(user.id);
console.log('User roles:', roles);
```

### 2. Verificar escuela del coordinator
```typescript
const coordinator = await this.prisma.coordinator.findUnique({
  where: { id: user.id },
  select: { schoolId: true },
});
console.log('Coordinator school:', coordinator.schoolId);
```

### 3. Debug del SchoolOwnershipGuard
El guard ya incluye logs automáticos. Verifica la consola:
```
[SchoolOwnershipGuard] Coordinator {id} authorized for school {schoolId}
[SchoolOwnershipGuard] Admin {id} bypassing school ownership check
```

---

## 🎯 Casos de Prueba Recomendados

### Test 1: Admin crea en múltiples escuelas ✅
```
1. Admin crea School A
2. Admin crea Student en School A ✅
3. Admin crea School B
4. Admin crea Student en School B ✅
Resultado esperado: Ambos students creados exitosamente
```

### Test 2: Coordinator limitado a su escuela ✅
```
1. Admin crea School A y School B
2. Admin crea Coordinator para School A
3. Coordinator A crea Student en School A ✅
4. Coordinator A intenta crear Student en School B ❌
Resultado esperado: Primero éxito, segundo 403 Forbidden
```

### Test 3: Coordinator crea otro coordinator ✅
```
1. Admin crea School A
2. Admin crea Coordinator A para School A
3. Coordinator A crea Coordinator B para School A ✅
4. Coordinator A intenta crear Coordinator C para School B ❌
Resultado esperado: Primero éxito, segundo 403 Forbidden
```

### Test 4: Solo Admin puede actualizar/eliminar ✅
```
1. Coordinator crea Student en su escuela ✅
2. Coordinator intenta actualizar ese Student ❌
3. Admin actualiza el Student ✅
4. Admin elimina el Student ✅
Resultado esperado: Solo Admin puede modificar
```

---

## 📝 Notas Importantes

### schoolId es Requerido
Al crear Students, Teachers o Coordinators, el campo `schoolId` es **OBLIGATORIO**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "userId": "user-uuid",
  "schoolId": "school-uuid"  // ← REQUERIDO
}
```

### Coordinators deben tener School
Un Coordinator DEBE tener un `schoolId` asignado antes de poder crear otros recursos:

```sql
UPDATE coordinators 
SET school_id = 'school-uuid' 
WHERE id = 'coordinator-uuid';
```

### Password es Opcional
Al crear Students, Teachers o Coordinators, el password es opcional:
- Si se proporciona: Se hashea y se guarda en el User
- Si se omite: El User no tendrá password (puede usar OAuth u otros métodos)

---

## 🔄 Flujo Completo de Onboarding

### Paso 1: Setup Inicial (Admin)
```bash
# 1. Crear primera escuela
POST /schools
{ "name": "Lincoln HS", ... }

# 2. Crear primer coordinator
POST /coordinators
{ 
  "schoolId": "lincoln-uuid",
  "email": "coord@lhs.edu",
  ...
}
```

### Paso 2: Coordinator configura su escuela
```bash
# 1. Agregar teachers
POST /teachers
{ "schoolId": "lincoln-uuid", ... }

# 2. Agregar students
POST /students
{ "schoolId": "lincoln-uuid", ... }

# 3. Agregar más coordinators
POST /coordinators
{ "schoolId": "lincoln-uuid", ... }
```

### Paso 3: Operación diaria
```bash
# Coordinator agrega nuevo estudiante
POST /students
{ "schoolId": "lincoln-uuid", ... }

# Admin monitorea todas las escuelas
GET /schools
GET /students
GET /teachers
```

---

## 🐛 Troubleshooting

### Error: "schoolId is required in the request body"
**Solución:** Incluir schoolId en el body del request

### Error: "Coordinator must be assigned to a school"
**Solución:** Asignar un schoolId al coordinator en la base de datos

### Error: "Coordinators can only add members to their own school"
**Solución:** Usar el schoolId correcto (el de tu escuela)

### Error: "User needs one of these roles: [admin, coordinator]"
**Solución:** El usuario necesita tener el rol apropiado asignado

---

## 📚 Documentación Relacionada

- [Arquitectura del Sistema](./ARCHITECTURE.md)
- [Sistema de Permisos](./PERMISSIONS_SYSTEM.md)
- [Flujo de Permisos](./PERMISSIONS_FLOW.md)
- [Setup y Configuración](./SETUP.md)

