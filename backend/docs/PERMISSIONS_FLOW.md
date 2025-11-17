# Flujo de Permisos - Diagrama Visual

## 🏗️ Jerarquía de Roles

```
┌─────────────────────────────────────────────────────────┐
│                        ADMIN                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │ • Acceso completo a TODAS las escuelas            │  │
│  │ • Puede crear/editar/eliminar cualquier recurso   │  │
│  │ • No pertenece a ninguna escuela (global)         │  │
│  │ • Único rol que puede crear otros admins          │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↓ puede gestionar todo
┌─────────────────────────────────────────────────────────┐
│                     COORDINATOR                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ • Pertenece a UNA escuela específica              │  │
│  │ • Puede agregar students/teachers/coordinators    │  │
│  │   SOLO a su propia escuela                        │  │
│  │ • No puede modificar otras escuelas               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↓ gestiona su escuela
┌─────────────────────────────────────────────────────────┐
│               TEACHER & STUDENT                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ • Pertenecen a UNA escuela específica             │  │
│  │ • Acceso de solo lectura                          │  │
│  │ • No pueden crear/editar/eliminar                 │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Flujo de Creación de Entidades

### Escenario 1: Admin configura el sistema

```
ADMIN
  │
  ├─► Crea School A
  │     │
  │     └─► Crea Coordinator para School A
  │           │
  │           └─► Coordinator ahora puede gestionar School A
  │
  ├─► Crea School B
  │     │
  │     └─► Crea Coordinator para School B
  │           │
  │           └─► Coordinator ahora puede gestionar School B
  │
  └─► Puede agregar Students/Teachers a cualquier escuela
```

---

### Escenario 2: Coordinator gestiona su escuela

```
COORDINATOR (School A)
  │
  ├─► Agrega Teacher a School A ✅
  │
  ├─► Agrega Student a School A ✅
  │
  ├─► Agrega otro Coordinator a School A ✅
  │
  ├─► Intenta agregar Student a School B ❌
  │     └─► ERROR: "Coordinators can only add members to their own school"
  │
  └─► Intenta crear una School ❌
        └─► ERROR: "User needs admin role"
```

---

## 🛡️ Validaciones en @SchoolAuth

```
┌──────────────────────────────────────────────────────────┐
│          Request: POST /students                          │
│          Body: { schoolId: "school-123", ... }           │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│                   AuthGuard()                             │
│              ¿JWT token válido?                          │
└──────────────────────────────────────────────────────────┘
                         ↓ SÍ
┌──────────────────────────────────────────────────────────┐
│                  UserRoleGuard                            │
│   ¿Usuario tiene rol ADMIN o COORDINATOR?               │
└──────────────────────────────────────────────────────────┘
                         ↓ SÍ
┌──────────────────────────────────────────────────────────┐
│              SchoolOwnershipGuard                         │
│                                                           │
│   ┌─────────────────────────────────────────┐           │
│   │ if (user.role === 'admin')              │           │
│   │   → PERMITIR (puede todo)        ✅     │           │
│   └─────────────────────────────────────────┘           │
│                                                           │
│   ┌─────────────────────────────────────────┐           │
│   │ if (user.role === 'coordinator')        │           │
│   │   → Obtener coordinator.schoolId        │           │
│   │   → if (coordinator.schoolId ===        │           │
│   │        body.schoolId)                   │           │
│   │      → PERMITIR ✅                      │           │
│   │   → else                                │           │
│   │      → DENEGAR ❌                       │           │
│   └─────────────────────────────────────────┘           │
└──────────────────────────────────────────────────────────┘
                         ↓ PERMITIDO
┌──────────────────────────────────────────────────────────┐
│                   Controller                              │
│              Ejecuta la lógica del endpoint              │
└──────────────────────────────────────────────────────────┘
```

---

## 📊 Tabla de Decisión - ¿Quién puede hacer qué?

### CREAR Recursos

| Acción | Admin | Coord (misma escuela) | Coord (otra escuela) | Teacher | Student |
|--------|-------|-----------------------|----------------------|---------|---------|
| Crear School | ✅ | ❌ | ❌ | ❌ | ❌ |
| Crear Admin | ✅ | ❌ | ❌ | ❌ | ❌ |
| Crear Coordinator | ✅ | ✅ | ❌ | ❌ | ❌ |
| Crear Teacher | ✅ | ✅ | ❌ | ❌ | ❌ |
| Crear Student | ✅ | ✅ | ❌ | ❌ | ❌ |

### ACTUALIZAR/ELIMINAR Recursos

| Acción | Admin | Coordinator | Teacher | Student |
|--------|-------|-------------|---------|---------|
| Actualizar School | ✅ | ❌ | ❌ | ❌ |
| Actualizar Admin | ✅ | ❌ | ❌ | ❌ |
| Actualizar Coordinator | ✅ | ❌ | ❌ | ❌ |
| Actualizar Teacher | ✅ | ❌ | ❌ | ❌ |
| Actualizar Student | ✅ | ❌ | ❌ | ❌ |
| Eliminar cualquier recurso | ✅ | ❌ | ❌ | ❌ |

### LEER Recursos

| Acción | Admin | Coordinator | Teacher | Student |
|--------|-------|-------------|---------|---------|
| Leer Schools | ✅ | ✅ | ✅ | ✅ |
| Leer Admins | ✅ | ❌ | ❌ | ❌ |
| Leer Coordinators | ✅ | ✅ | ✅ | ✅ |
| Leer Teachers | ✅ | ✅ | ✅ | ✅ |
| Leer Students | ✅ | ✅ | ✅ | ✅ |

---

## 🎯 Casos de Uso Reales

### Setup Inicial del Sistema

```
1. Super Admin crea la primera escuela
   POST /schools
   {
     "name": "Lincoln High School",
     "code": "LHS001",
     ...
   }

2. Admin crea el primer Coordinator para esa escuela
   POST /coordinators
   {
     "firstName": "Maria",
     "lastName": "Rodriguez",
     "email": "maria@lhs.edu",
     "userId": "user-uuid",
     "schoolId": "lhs-school-uuid"
   }

3. Coordinator ahora puede gestionar su escuela
   - Puede agregar teachers
   - Puede agregar students
   - Puede agregar más coordinators
   - SOLO a su escuela (LHS)
```

---

### Operación Día a Día

```
COORDINATOR de School A:
  
  ✅ Agregar nuevo profesor
     POST /teachers
     { "schoolId": "school-a-uuid", ... }
  
  ✅ Agregar nuevo estudiante
     POST /students
     { "schoolId": "school-a-uuid", ... }
  
  ❌ Agregar profesor a School B
     POST /teachers
     { "schoolId": "school-b-uuid", ... }
     → 403 Forbidden
  
  ❌ Editar datos de un estudiante
     PATCH /students/:id
     → 403 Forbidden (solo ADMIN puede actualizar)
```

---

## 🔍 Logs y Debugging

El `SchoolOwnershipGuard` genera logs útiles:

```typescript
// Admin bypassing check
[SchoolOwnershipGuard] Admin admin-uuid bypassing school ownership check

// Coordinator authorized
[SchoolOwnershipGuard] Coordinator coord-uuid authorized for school school-uuid

// Failed attempt
[SchoolOwnershipGuard] ForbiddenException: Coordinators can only add members to their own school
```

---

## 🧪 Testing del Guard

Para testear endpoints con `@SchoolAuth`:

```typescript
beforeEach(async () => {
  const module = await Test.createTestingModule({
    controllers: [StudentsController],
    providers: [StudentsService],
  })
    .overrideGuard(AuthGuard())
    .useValue({ canActivate: () => true })
    .overrideGuard(UserRoleGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(SchoolOwnershipGuard)
    .useValue({ canActivate: () => true })
    .compile();
});
```

---

## 📝 Checklist de Implementación

- ✅ SchoolOwnershipGuard creado
- ✅ @SchoolAuth decorator creado
- ✅ Students controller actualizado
- ✅ Teachers controller actualizado
- ✅ Coordinators controller actualizado
- ✅ DTOs actualizados (schoolId requerido)
- ✅ Services actualizados
- ✅ Tests actualizados (97 tests pasando)
- ✅ Documentación creada
- ✅ Sin errores de linter

