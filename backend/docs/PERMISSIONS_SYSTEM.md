# Sistema de Permisos y Roles

## Resumen del Sistema de Control de Acceso

Este documento describe el sistema de permisos implementado en el backend de OneEnglish.

---

## Roles Disponibles

| Rol | Descripción | Alcance |
|-----|-------------|---------|
| **ADMIN** | Administrador del sistema | Global - Acceso completo a todo |
| **COORDINATOR** | Coordinador académico | Escuela específica - Gestión de su escuela |
| **TEACHER** | Profesor | Escuela específica - Acceso limitado |
| **STUDENT** | Estudiante | Escuela específica - Acceso limitado |

---

## Matriz de Permisos por Módulo

### 1. Schools (Escuelas)

| Operación | Endpoint | Admin | Coordinator | Teacher | Student |
|-----------|----------|-------|-------------|---------|---------|
| **CREATE** | POST /schools | ✅ | ❌ | ❌ | ❌ |
| **READ ALL** | GET /schools | ✅ | ✅ | ✅ | ✅ |
| **READ ONE** | GET /schools/:id | ✅ | ✅ | ✅ | ✅ |
| **UPDATE** | PATCH /schools/:id | ✅ | ❌ | ❌ | ❌ |
| **DELETE** | DELETE /schools/:id | ✅ | ❌ | ❌ | ❌ |

**Reglas:**
- ✅ Solo ADMIN puede crear, actualizar y eliminar escuelas
- ✅ Todos pueden leer información de escuelas

---

### 2. Admins (Administradores)

| Operación | Endpoint | Admin | Coordinator | Teacher | Student |
|-----------|----------|-------|-------------|---------|---------|
| **CREATE** | POST /admins | ✅ | ❌ | ❌ | ❌ |
| **READ ALL** | GET /admins | ✅ | ❌ | ❌ | ❌ |
| **READ ONE** | GET /admins/:id | ✅ | ❌ | ❌ | ❌ |
| **UPDATE** | PATCH /admins/:id | ✅ | ❌ | ❌ | ❌ |
| **DELETE** | DELETE /admins/:id | ✅ | ❌ | ❌ | ❌ |

**Reglas:**
- ✅ Solo ADMIN puede gestionar otros admins
- ✅ TODOS los endpoints requieren autenticación como ADMIN
- ✅ Los admins NO pertenecen a escuelas (son globales)

---

### 3. Coordinators (Coordinadores)

| Operación | Endpoint | Admin | Coordinator | Teacher | Student |
|-----------|----------|-------|-------------|---------|---------|
| **CREATE** | POST /coordinators | ✅ (cualquier escuela) | ✅ (solo su escuela) | ❌ | ❌ |
| **READ ALL** | GET /coordinators | ✅ | ✅ | ✅ | ✅ |
| **READ ONE** | GET /coordinators/:id | ✅ (cualquier escuela) | ✅ (solo su escuela) | ✅ (solo su escuela) | ❌ |
| **UPDATE** | PATCH /coordinators/:id | ✅ | ❌ | ❌ | ❌ |
| **DELETE** | DELETE /coordinators/:id | ✅ | ❌ | ❌ | ❌ |

**Reglas:**
- ✅ ADMIN puede agregar coordinadores a cualquier escuela
- ✅ COORDINATOR puede agregar otros coordinadores SOLO a su propia escuela
- ✅ Solo ADMIN puede actualizar y eliminar coordinadores
- ✅ `schoolId` es REQUERIDO al crear un coordinador

---

### 4. Teachers (Profesores)

| Operación | Endpoint | Admin | Coordinator | Teacher | Student |
|-----------|----------|-------|-------------|---------|---------|
| **CREATE** | POST /teachers | ✅ (cualquier escuela) | ✅ (solo su escuela) | ❌ | ❌ |
| **READ ALL** | GET /teachers | ✅ | ✅ | ✅ | ✅ |
| **READ ONE** | GET /teachers/:id | ✅ (cualquier escuela) | ✅ (solo su escuela) | ✅ (solo su escuela) | ❌ |
| **UPDATE** | PATCH /teachers/:id | ✅ | ❌ | ❌ | ❌ |
| **DELETE** | DELETE /teachers/:id | ✅ | ❌ | ❌ | ❌ |

**Reglas:**
- ✅ ADMIN puede agregar profesores a cualquier escuela
- ✅ COORDINATOR puede agregar profesores SOLO a su propia escuela
- ✅ Solo ADMIN puede actualizar y eliminar profesores
- ✅ `schoolId` es REQUERIDO al crear un profesor

---

### 5. Students (Estudiantes)

| Operación | Endpoint | Admin | Coordinator | Teacher | Student |
|-----------|----------|-------|-------------|---------|---------|
| **CREATE** | POST /students | ✅ (cualquier escuela) | ✅ (solo su escuela) | ❌ | ❌ |
| **READ ALL** | GET /students | ✅ | ✅ | ✅ | ✅ |
| **READ ONE** | GET /students/:id | ✅ (cualquier escuela) | ✅ (solo su escuela) | ✅ (solo su escuela) | ✅ |
| **UPDATE** | PATCH /students/:id | ✅ | ❌ | ❌ | ❌ |
| **DELETE** | DELETE /students/:id | ✅ | ❌ | ❌ | ❌ |

**Reglas:**
- ✅ ADMIN puede agregar estudiantes a cualquier escuela
- ✅ COORDINATOR puede agregar estudiantes SOLO a su propia escuela
- ✅ Solo ADMIN puede actualizar y eliminar estudiantes
- ✅ `schoolId` es REQUERIDO al crear un estudiante

---

## 🔍 Sistema de Permisos de Lectura

### Restricciones por Escuela

Los endpoints de lectura individual (GET /:id) para Students, Teachers y Coordinators tienen restricciones basadas en la escuela:

**ADMIN:**
- ✅ Puede leer cualquier recurso de cualquier escuela

**COORDINATOR:**
- ✅ Puede leer recursos de SU escuela
- ❌ No puede leer recursos de otras escuelas

**TEACHER:**
- ✅ Puede leer recursos (students, teachers, coordinators) de SU escuela
- ❌ No puede leer recursos de otras escuelas

**STUDENT:**
- ✅ Puede leer cualquier student (sin restricción de escuela)
- ❌ No puede leer teachers ni coordinators individualmente

### Endpoints Públicos (sin restricción de escuela)

Los siguientes endpoints NO tienen restricción de escuela:
- `GET /students` - Lista todos los students
- `GET /teachers` - Lista todos los teachers
- `GET /coordinators` - Lista todos los coordinators
- `GET /schools` - Lista todas las escuelas
- `GET /*/active` - Lista recursos activos
- `GET /*/school/:schoolId` - Lista por escuela específica

---

## Decorators de Autenticación

### @Auth(...roles)
Decorador básico para proteger endpoints con roles específicos.

**Uso:**
```typescript
@Post()
@Auth(ValidRole.ADMIN)
create(@Body() dto: CreateSchoolDto) {
  return this.service.create(dto);
}
```

**Comportamiento:**
- Verifica que el usuario esté autenticado
- Verifica que el usuario tenga al menos uno de los roles especificados

---

### @SchoolAuth(...roles)
Decorador avanzado para endpoints de **CREACIÓN** que requieren validación de pertenencia a la escuela.

**Uso:**
```typescript
@Post()
@SchoolAuth(ValidRole.ADMIN, ValidRole.COORDINATOR)
create(@Body() dto: CreateStudentDto) {
  return this.service.create(dto);
}
```

**Comportamiento:**
1. Verifica que el usuario esté autenticado
2. Verifica que el usuario tenga uno de los roles especificados
3. **Si es ADMIN**: Permite acceso sin restricciones
4. **Si es COORDINATOR**:
   - Verifica que el coordinator tenga una escuela asignada
   - Verifica que el `schoolId` del body coincida con la escuela del coordinator
   - Rechaza si intenta agregar a una escuela diferente

---

### @SchoolRead(...roles)
Decorador para endpoints de **LECTURA** que requieren validación de pertenencia a la escuela.

**Uso:**
```typescript
@Get(':id')
@SchoolRead(ValidRole.ADMIN, ValidRole.COORDINATOR, ValidRole.TEACHER)
findOne(@Param('id') id: string) {
  return this.service.findOne(id);
}
```

**Comportamiento:**
1. Verifica que el usuario esté autenticado
2. Verifica que el usuario tenga uno de los roles especificados
3. **Si es ADMIN**: Puede leer cualquier recurso
4. **Si es COORDINATOR o TEACHER**:
   - Obtiene la escuela del usuario
   - Verifica que el recurso solicitado pertenezca a la misma escuela
   - Rechaza si el recurso es de otra escuela
5. **Si es STUDENT**: Permite lectura sin restricciones

---

### @SkipSchoolReadCheck()
Decorador para **omitir** la validación de escuela en endpoints de lectura.

**Uso:**
```typescript
@Get()
@SkipSchoolReadCheck()
findAll() {
  return this.service.findAll();
}
```

**Cuándo usar:**
- Endpoints de lista (GET /) que deben ser públicos
- Endpoints que no necesitan restricción por escuela
- Endpoints que ya filtran por escuela de otra manera

---

## Guards Implementados

### 1. UserRoleGuard
Valida que el usuario tenga los roles requeridos.

**Ubicación:** `src/auth/guards/role.guard.ts`

**Uso:** Automático con `@Auth()`, `@SchoolAuth()`, `@SchoolRead()`

### 2. SchoolOwnershipGuard
Valida que el coordinator solo pueda agregar miembros a su propia escuela (para endpoints de CREACIÓN).

**Ubicación:** `src/auth/guards/school-ownership.guard.ts`

**Uso:** Automático con `@SchoolAuth()`

**Lógica:**
```typescript
if (user is ADMIN) {
  return true; // Admin can create in any school
}

if (user is COORDINATOR) {
  if (coordinator.schoolId === body.schoolId) {
    return true; // Same school, allowed
  } else {
    throw ForbiddenException; // Different school, denied
  }
}

throw ForbiddenException; // Other roles denied
```

### 3. SchoolReadGuard
Valida que coordinators y teachers solo puedan leer recursos de su propia escuela (para endpoints de LECTURA).

**Ubicación:** `src/auth/guards/school-read.guard.ts`

**Uso:** Automático con `@SchoolRead()`

**Lógica:**
```typescript
// Check if endpoint has @SkipSchoolReadCheck()
if (skipCheck) {
  return true; // Skip validation
}

if (user is ADMIN) {
  return true; // Admin can read from any school
}

if (user is STUDENT) {
  return true; // Students can read anything
}

if (user is COORDINATOR or TEACHER) {
  // Get user's school
  userSchool = getUserSchool(user.id);
  
  // For single resource (GET /:id)
  if (resourceId exists) {
    resourceSchool = getResourceSchool(resourceId);
    if (userSchool === resourceSchool) {
      return true; // Same school, allowed
    } else {
      throw ForbiddenException; // Different school, denied
    }
  }
  
  // For list endpoints
  // Store userSchoolId in request for filtering
  request.userSchoolId = userSchool;
  return true;
}
```

---

## Flujos de Creación

### Crear Student

#### Como ADMIN:
```http
POST /students
Authorization: Bearer {admin_token}

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "userId": "user-uuid",
  "schoolId": "any-school-uuid"  // ✅ Puede ser cualquier escuela
}
```

#### Como COORDINATOR:
```http
POST /students
Authorization: Bearer {coordinator_token}

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "userId": "user-uuid",
  "schoolId": "my-school-uuid"  // ✅ DEBE ser la escuela del coordinator
}
```

❌ **Rechazado si:**
```http
{
  "schoolId": "different-school-uuid"  // ❌ Coordinator intenta agregar a otra escuela
}
// Response: 403 Forbidden - "Coordinators can only add members to their own school"
```

---

### Crear Teacher

Misma lógica que Students:
- ADMIN → Cualquier escuela
- COORDINATOR → Solo su escuela

---

### Crear Coordinator

Misma lógica que Students y Teachers:
- ADMIN → Puede crear coordinators en cualquier escuela
- COORDINATOR → Puede crear coordinators solo en su propia escuela

---

## Validaciones de Seguridad

### 1. Validación de Email Único
- ✅ No se pueden crear dos profiles con el mismo email
- ✅ Aplica a: Students, Teachers, Coordinators, Admins

### 2. Validación de User Existente
- ✅ El userId debe existir antes de crear un profile
- ✅ Un user solo puede tener un profile de cada tipo

### 3. Validación de School Existente
- ✅ El schoolId debe existir en la base de datos
- ✅ Aplica a: Students, Teachers, Coordinators

### 4. Validación de Pertenencia a la Escuela
- ✅ Coordinators solo pueden agregar miembros a su propia escuela
- ✅ Admins pueden agregar miembros a cualquier escuela

### 5. Prevención de Eliminación
- ✅ No se puede eliminar una School con miembros asignados
- ✅ No se puede eliminar un Student con challenges activos

---

## Casos de Uso

### Caso 1: Admin crea una escuela
```typescript
// 1. Admin crea la escuela
POST /schools
@Auth(ValidRole.ADMIN)

// 2. Admin crea un coordinator para esa escuela
POST /coordinators
@SchoolAuth(ValidRole.ADMIN, ValidRole.COORDINATOR)
// Admin puede crear en cualquier escuela
```

### Caso 2: Coordinator gestiona su escuela
```typescript
// 1. Coordinator agrega un teacher a SU escuela
POST /teachers
@SchoolAuth(ValidRole.ADMIN, ValidRole.COORDINATOR)
// schoolId DEBE coincidir con la escuela del coordinator

// 2. Coordinator agrega un student a SU escuela
POST /students
@SchoolAuth(ValidRole.ADMIN, ValidRole.COORDINATOR)
// schoolId DEBE coincidir con la escuela del coordinator

// 3. Coordinator agrega otro coordinator a SU escuela
POST /coordinators
@SchoolAuth(ValidRole.ADMIN, ValidRole.COORDINATOR)
// schoolId DEBE coincidir con la escuela del coordinator
```

### Caso 3: Intentos rechazados
```typescript
// ❌ Coordinator intenta agregar a otra escuela
POST /students
{
  "schoolId": "different-school"
}
// Response: 403 Forbidden

// ❌ Teacher intenta crear un student
POST /students
// Response: 403 Forbidden - Need coordinator or admin role

// ❌ Student intenta crear otro student
POST /students
// Response: 403 Forbidden - Need coordinator or admin role
```

---

## Códigos de Error HTTP

| Código | Descripción | Cuándo ocurre |
|--------|-------------|---------------|
| **400** | Bad Request | Datos inválidos, schoolId faltante |
| **401** | Unauthorized | Token faltante o inválido |
| **403** | Forbidden | Usuario autenticado pero sin permisos |
| **404** | Not Found | Recurso no existe (User, School, etc.) |
| **409** | Conflict | Email duplicado, perfil duplicado |

---

## Mensajes de Error Comunes

### Forbidden (403)
- "Only coordinators and admins can perform this action"
- "Coordinator must be assigned to a school"
- "Coordinators can only add members to their own school"
- "User {name} needs one of these roles: [admin, coordinator]"

### Not Found (404)
- "User with ID {id} not found"
- "School with ID {id} not found"
- "Student with ID {id} not found"

### Conflict (409)
- "Student with email {email} already exists"
- "User already has a student profile"
- "Username {username} is already taken"

---

## Implementación Técnica

### Guards en Cadena

Los decoradores aplican guards en el siguiente orden:

1. **AuthGuard()** - Verifica JWT válido
2. **UserRoleGuard** - Verifica roles del usuario
3. **SchoolOwnershipGuard** - Verifica pertenencia a la escuela (solo en @SchoolAuth)

### Flujo de Validación

```
Request → AuthGuard → UserRoleGuard → SchoolOwnershipGuard → Controller
           ↓              ↓                    ↓
       JWT válido?   Rol válido?   Misma escuela? (si coordinator)
```

---

## Mejores Prácticas

### ✅ DO (Hacer):
- Usar `@Auth()` para endpoints que solo requieren validación de rol
- Usar `@SchoolAuth()` para endpoints que requieren validación de escuela
- Incluir `schoolId` en el body cuando uses `@SchoolAuth()`
- Proporcionar mensajes de error descriptivos

### ❌ DON'T (No hacer):
- No usar `@SchoolAuth()` en endpoints que no involucren escuelas
- No omitir `schoolId` en DTOs que usan `@SchoolAuth()`
- No hardcodear schoolIds en el código
- No saltarse la validación de pertenencia a la escuela

---

## Testing

Todos los guards incluyen tests comprehensivos:

```bash
✅ SchoolOwnershipGuard: 6 tests
✅ UserRoleGuard: Tests incluidos en cada módulo
✅ AuthGuard: Proporcionado por NestJS/Passport
```

---

## Ejemplos de Uso

### Endpoint Protegido Solo por Rol
```typescript
@Post()
@Auth(ValidRole.ADMIN)
create(@Body() dto: CreateSchoolDto) {
  return this.service.create(dto);
}
```

### Endpoint Protegido por Rol + Escuela
```typescript
@Post()
@SchoolAuth(ValidRole.ADMIN, ValidRole.COORDINATOR)
create(@Body() dto: CreateStudentDto) {
  // schoolId es validado automáticamente
  return this.service.create(dto);
}
```

### Endpoint Público
```typescript
@Get()
findAll() {
  return this.service.findAll();
}
```

---

## Configuración

### AuthModule
El `AuthModule` debe ser importado en todos los módulos que usen autenticación:

```typescript
@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
```

---

## Mantenimiento

### Agregar un Nuevo Rol

1. Agregar el rol en `src/common/definitions/enums.ts`:
```typescript
export enum ValidRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  COORDINATOR = 'coordinator',
  EMPLOYEE = 'employee',
  NEW_ROLE = 'new_role',  // ← Agregar aquí
}
```

2. Crear el rol en la base de datos (seed o migración)

3. Usar en decorators:
```typescript
@Auth(ValidRole.NEW_ROLE)
```

---

## Resumen de Cambios Implementados

### Nuevos Componentes
- ✅ `SchoolOwnershipGuard` - Guard personalizado
- ✅ `@SchoolAuth()` - Decorator personalizado
- ✅ Tests para el guard

### Módulos Actualizados
- ✅ Students Controller - Usa `@SchoolAuth()`
- ✅ Teachers Controller - Usa `@SchoolAuth()`
- ✅ Coordinators Controller - Usa `@SchoolAuth()`
- ✅ DTOs actualizados - `schoolId` ahora es requerido

### Tests
- ✅ 97+ tests pasando
- ✅ Todos los módulos actualizados con nuevos tests
- ✅ Guards mockeados apropiadamente

---

## Seguridad

### Principios Aplicados
1. **Least Privilege**: Usuarios solo tienen acceso a lo mínimo necesario
2. **Defense in Depth**: Múltiples capas de validación
3. **Fail Secure**: Por defecto se deniega el acceso
4. **Audit Trail**: Logs de intentos de acceso

### Protección contra:
- ✅ Escalación de privilegios
- ✅ Acceso no autorizado a escuelas
- ✅ Modificación de datos de otras escuelas
- ✅ Creación de perfiles duplicados

