# 📮 Bodies para Postman - OneEnglish API

Todos los cuerpos de petición listos para copiar y pegar en Postman.

---

## 🔐 AUTENTICACIÓN

### POST /auth/login

**Como Admin:**
```json
{
  "email": "admin@onenglish.com",
  "password": "password123"
}
```

**Como Coordinator (Lincoln):**
```json
{
  "email": "maria.rodriguez@lincolnhs.edu",
  "password": "password123"
}
```

**Como Coordinator (Jefferson):**
```json
{
  "email": "john.wilson@jeffersonacademy.edu",
  "password": "password123"
}
```

**Como Teacher (Lincoln):**
```json
{
  "email": "jane.smith@lincolnhs.edu",
  "password": "password123"
}
```

**Como Student (Lincoln):**
```json
{
  "email": "john.doe@lincolnhs.edu",
  "password": "password123"
}
```

---

## 🏫 SCHOOLS (Escuelas)

### POST /schools - Crear Escuela
**Auth:** Bearer {{ADMIN_TOKEN}}

**Opción 1 - Completo:**
```json
{
  "name": "Roosevelt International School",
  "code": "RIS001",
  "address": "999 Academic Drive",
  "city": "Los Angeles",
  "state": "CA",
  "country": "United States",
  "postalCode": "90001",
  "phone": "+1-213-555-0100",
  "email": "info@rooseveltschool.edu",
  "website": "https://www.rooseveltschool.edu",
  "description": "International school focused on English language mastery",
  "isActive": true
}
```

**Opción 2 - Mínimo:**
```json
{
  "name": "Kennedy Language Center"
}
```

**Opción 3 - Con algunos campos:**
```json
{
  "name": "Madison English Institute",
  "code": "MEI001",
  "city": "Miami",
  "state": "FL",
  "email": "contact@madisoninstitute.edu"
}
```

### PATCH /schools/:id - Actualizar Escuela
**Auth:** Bearer {{ADMIN_TOKEN}}

```json
{
  "name": "Roosevelt International Academy (Updated)",
  "description": "Updated: Premier institution for English education",
  "phone": "+1-213-555-0199",
  "isActive": true
}
```

---

## 👤 ADMINS (Administradores)

### POST /admins - Crear Admin
**Auth:** Bearer {{ADMIN_TOKEN}}

**Nota:** Necesitas crear el User primero y obtener su UUID

**Opción 1 - Completo:**
```json
{
  "firstName": "Carlos",
  "lastName": "Martinez",
  "email": "carlos.martinez@onenglish.com",
  "userId": "PUT_USER_UUID_HERE",
  "username": "carlosmartinez",
  "password": "SecureAdmin123!",
  "phone": "+1-555-100-2000",
  "avatar": "https://example.com/avatars/carlos.jpg",
  "bio": "Senior system administrator with expertise in educational technology platforms",
  "isActive": true
}
```

**Opción 2 - Mínimo:**
```json
{
  "firstName": "Ana",
  "lastName": "Garcia",
  "email": "ana.garcia@onenglish.com",
  "userId": "PUT_USER_UUID_HERE"
}
```

### PATCH /admins/:id - Actualizar Admin
**Auth:** Bearer {{ADMIN_TOKEN}}

```json
{
  "firstName": "Carlos Alberto",
  "bio": "Updated: Lead system administrator",
  "phone": "+1-555-100-2999"
}
```

---

## 🎓 COORDINATORS (Coordinadores)

### POST /coordinators - Crear Coordinator (como Admin)
**Auth:** Bearer {{ADMIN_TOKEN}}

**Opción 1 - Completo (cualquier escuela):**
```json
{
  "firstName": "Patricia",
  "lastName": "Anderson",
  "email": "patricia.anderson@rooseveltschool.edu",
  "userId": "PUT_USER_UUID_HERE",
  "schoolId": "PUT_SCHOOL_UUID_HERE",
  "username": "patriciaanderson",
  "password": "CoordPass123!",
  "phone": "+1-213-555-1100",
  "avatar": "https://example.com/avatars/patricia.jpg",
  "bio": "Experienced academic coordinator with Master's in Education",
  "isActive": true
}
```

**Opción 2 - Mínimo:**
```json
{
  "firstName": "David",
  "lastName": "Lee",
  "email": "david.lee@rooseveltschool.edu",
  "userId": "PUT_USER_UUID_HERE",
  "schoolId": "PUT_SCHOOL_UUID_HERE"
}
```

### POST /coordinators - Crear Coordinator (como Coordinator)
**Auth:** Bearer {{COORDINATOR_TOKEN}}

**⚠️ IMPORTANTE:** schoolId DEBE ser TU escuela

```json
{
  "firstName": "Laura",
  "lastName": "Martinez",
  "email": "laura.martinez@lincolnhs.edu",
  "userId": "PUT_USER_UUID_HERE",
  "schoolId": "LINCOLN_SCHOOL_ID",
  "username": "lauramartinez",
  "password": "CoordPass123!"
}
```

### PATCH /coordinators/:id - Actualizar Coordinator
**Auth:** Bearer {{ADMIN_TOKEN}}

```json
{
  "firstName": "Patricia Ann",
  "bio": "Updated: Senior academic coordinator",
  "phone": "+1-213-555-1199"
}
```

---

## 👨‍🏫 TEACHERS (Profesores)

### POST /teachers - Crear Teacher (como Admin)
**Auth:** Bearer {{ADMIN_TOKEN}}

**Opción 1 - Completo (cualquier escuela):**
```json
{
  "firstName": "Michael",
  "lastName": "Thompson",
  "email": "michael.thompson@rooseveltschool.edu",
  "userId": "PUT_USER_UUID_HERE",
  "schoolId": "PUT_SCHOOL_UUID_HERE",
  "username": "michaelthompson",
  "password": "TeacherPass123!",
  "phone": "+1-213-555-2100",
  "avatar": "https://example.com/avatars/michael.jpg",
  "bio": "Certified ESL teacher with 8 years of experience. TOEFL and IELTS preparation specialist",
  "isActive": true
}
```

**Opción 2 - Mínimo:**
```json
{
  "firstName": "Jessica",
  "lastName": "White",
  "email": "jessica.white@rooseveltschool.edu",
  "userId": "PUT_USER_UUID_HERE",
  "schoolId": "PUT_SCHOOL_UUID_HERE"
}
```

### POST /teachers - Crear Teacher (como Coordinator)
**Auth:** Bearer {{COORDINATOR_TOKEN}}

**⚠️ IMPORTANTE:** schoolId DEBE ser TU escuela

```json
{
  "firstName": "Thomas",
  "lastName": "Garcia",
  "email": "thomas.garcia@lincolnhs.edu",
  "userId": "PUT_USER_UUID_HERE",
  "schoolId": "LINCOLN_SCHOOL_ID",
  "username": "thomasgarcia",
  "password": "TeacherPass123!",
  "bio": "English literature and grammar specialist"
}
```

### PATCH /teachers/:id - Actualizar Teacher
**Auth:** Bearer {{ADMIN_TOKEN}}

```json
{
  "firstName": "Michael James",
  "bio": "Updated: Lead ESL instructor, Cambridge CELTA certified",
  "phone": "+1-213-555-2199",
  "isActive": true
}
```

---

## 🎓 STUDENTS (Estudiantes)

### POST /students - Crear Student (como Admin)
**Auth:** Bearer {{ADMIN_TOKEN}}

**Opción 1 - Completo (cualquier escuela):**
```json
{
  "firstName": "Emma",
  "lastName": "Rodriguez",
  "email": "emma.rodriguez@rooseveltschool.edu",
  "userId": "PUT_USER_UUID_HERE",
  "schoolId": "PUT_SCHOOL_UUID_HERE",
  "username": "emmarodriguez",
  "password": "StudentPass123!",
  "phone": "+1-213-555-3100",
  "avatar": "https://example.com/avatars/emma.jpg",
  "bio": "Beginner English learner, currently at A1 level. Goal: Reach B2 for university",
  "isActive": true
}
```

**Opción 2 - Mínimo:**
```json
{
  "firstName": "Daniel",
  "lastName": "Kim",
  "email": "daniel.kim@rooseveltschool.edu",
  "userId": "PUT_USER_UUID_HERE",
  "schoolId": "PUT_SCHOOL_UUID_HERE"
}
```

**Opción 3 - Con algunos campos:**
```json
{
  "firstName": "Sophie",
  "lastName": "Chen",
  "email": "sophie.chen@rooseveltschool.edu",
  "userId": "PUT_USER_UUID_HERE",
  "schoolId": "PUT_SCHOOL_UUID_HERE",
  "username": "sophiechen",
  "password": "StudentPass123!",
  "bio": "Intermediate learner, B1 level"
}
```

### POST /students - Crear Student (como Coordinator)
**Auth:** Bearer {{COORDINATOR_TOKEN}}

**⚠️ IMPORTANTE:** schoolId DEBE ser TU escuela

```json
{
  "firstName": "Alex",
  "lastName": "Taylor",
  "email": "alex.taylor@lincolnhs.edu",
  "userId": "PUT_USER_UUID_HERE",
  "schoolId": "LINCOLN_SCHOOL_ID",
  "username": "alextaylor",
  "password": "StudentPass123!",
  "bio": "New student starting from scratch"
}
```

### PATCH /students/:id - Actualizar Student
**Auth:** Bearer {{ADMIN_TOKEN}}

```json
{
  "firstName": "Emma Rose",
  "bio": "Updated: Progressing well, now at A2 level",
  "phone": "+1-213-555-3199",
  "isActive": true
}
```

---

## 🧪 CASOS DE PRUEBA ESPECÍFICOS

### ✅ Test 1: Admin Crea en Múltiples Escuelas

**1.1 - Crear en Lincoln:**
```json
{
  "firstName": "Test",
  "lastName": "Student1",
  "email": "test1@lincolnhs.edu",
  "userId": "NEW_USER_UUID_1",
  "schoolId": "LINCOLN_SCHOOL_UUID"
}
```

**1.2 - Crear en Jefferson:**
```json
{
  "firstName": "Test",
  "lastName": "Student2",
  "email": "test2@jeffersonacademy.edu",
  "userId": "NEW_USER_UUID_2",
  "schoolId": "JEFFERSON_SCHOOL_UUID"
}
```

---

### ✅ Test 2: Coordinator Crea en Su Escuela

**2.1 - Como Coord Lincoln, crear en Lincoln ✅:**
```json
{
  "firstName": "ValidLincoln",
  "lastName": "Student",
  "email": "valid@lincolnhs.edu",
  "userId": "NEW_USER_UUID_3",
  "schoolId": "LINCOLN_SCHOOL_UUID"
}
```

**2.2 - Como Coord Lincoln, intentar crear en Jefferson ❌:**
```json
{
  "firstName": "WrongSchool",
  "lastName": "Student",
  "email": "wrong@jeffersonacademy.edu",
  "userId": "NEW_USER_UUID_4",
  "schoolId": "JEFFERSON_SCHOOL_UUID"
}
```
**Resultado esperado:** 403 Forbidden

---

### ✅ Test 3: Actualizar Solo Como Admin

**3.1 - Actualizar student (como Admin) ✅:**
```json
{
  "firstName": "Updated",
  "bio": "Bio updated by admin"
}
```

**3.2 - Intentar actualizar (como Coordinator) ❌:**
```json
{
  "firstName": "TryUpdate",
  "bio": "Trying to update"
}
```
**Resultado esperado:** 403 Forbidden

---

## 🎯 EJEMPLOS POR ESCUELA

### Para Lincoln High School

**Crear Coordinator:**
```json
{
  "firstName": "CoordLincoln",
  "lastName": "New",
  "email": "coord.new@lincolnhs.edu",
  "userId": "UUID_HERE",
  "schoolId": "LINCOLN_SCHOOL_UUID"
}
```

**Crear Teacher:**
```json
{
  "firstName": "TeacherLincoln",
  "lastName": "New",
  "email": "teacher.new@lincolnhs.edu",
  "userId": "UUID_HERE",
  "schoolId": "LINCOLN_SCHOOL_UUID",
  "bio": "New teacher at Lincoln"
}
```

**Crear Student:**
```json
{
  "firstName": "StudentLincoln",
  "lastName": "New",
  "email": "student.new@lincolnhs.edu",
  "userId": "UUID_HERE",
  "schoolId": "LINCOLN_SCHOOL_UUID",
  "bio": "New student at Lincoln"
}
```

---

### Para Jefferson Academy

**Crear Coordinator:**
```json
{
  "firstName": "CoordJefferson",
  "lastName": "New",
  "email": "coord.new@jeffersonacademy.edu",
  "userId": "UUID_HERE",
  "schoolId": "JEFFERSON_SCHOOL_UUID"
}
```

**Crear Teacher:**
```json
{
  "firstName": "TeacherJefferson",
  "lastName": "New",
  "email": "teacher.new@jeffersonacademy.edu",
  "userId": "UUID_HERE",
  "schoolId": "JEFFERSON_SCHOOL_UUID"
}
```

**Crear Student:**
```json
{
  "firstName": "StudentJefferson",
  "lastName": "New",
  "email": "student.new@jeffersonacademy.edu",
  "userId": "UUID_HERE",
  "schoolId": "JEFFERSON_SCHOOL_UUID"
}
```

---

## 📝 TEMPLATES REUTILIZABLES

### Template: Nuevo Student (cambiar valores)
```json
{
  "firstName": "CHANGE_ME",
  "lastName": "CHANGE_ME",
  "email": "CHANGE_ME@school.edu",
  "userId": "CHANGE_ME_UUID",
  "schoolId": "CHANGE_ME_SCHOOL_UUID",
  "username": "CHANGE_ME_USERNAME",
  "password": "SecurePass123!",
  "phone": "+1-555-XXX-XXXX",
  "bio": "CHANGE_ME_BIO"
}
```

### Template: Nuevo Teacher
```json
{
  "firstName": "CHANGE_ME",
  "lastName": "CHANGE_ME",
  "email": "CHANGE_ME@school.edu",
  "userId": "CHANGE_ME_UUID",
  "schoolId": "CHANGE_ME_SCHOOL_UUID",
  "username": "CHANGE_ME_USERNAME",
  "password": "SecurePass123!",
  "bio": "CHANGE_ME - Teacher specialization"
}
```

### Template: Nuevo Coordinator
```json
{
  "firstName": "CHANGE_ME",
  "lastName": "CHANGE_ME",
  "email": "CHANGE_ME@school.edu",
  "userId": "CHANGE_ME_UUID",
  "schoolId": "CHANGE_ME_SCHOOL_UUID",
  "username": "CHANGE_ME_USERNAME",
  "password": "SecurePass123!"
}
```

### Template: Nueva School
```json
{
  "name": "CHANGE_ME School Name",
  "code": "CHANGE_ME_CODE",
  "city": "CHANGE_ME_CITY",
  "email": "contact@CHANGE_ME.edu"
}
```

### Template: Nuevo Admin
```json
{
  "firstName": "CHANGE_ME",
  "lastName": "CHANGE_ME",
  "email": "CHANGE_ME@onenglish.com",
  "userId": "CHANGE_ME_UUID",
  "username": "CHANGE_ME_USERNAME",
  "password": "SecurePass123!"
}
```

---

## 🔄 ACTUALIZACIÓN (PATCH) - Solo Campos que Cambias

### Actualizar Solo Nombre:
```json
{
  "firstName": "NewFirstName"
}
```

### Actualizar Solo Email:
```json
{
  "email": "newemail@example.com"
}
```

### Actualizar Varios Campos:
```json
{
  "firstName": "NewFirst",
  "lastName": "NewLast",
  "phone": "+1-999-888-7777",
  "bio": "Completely updated bio"
}
```

### Desactivar un Recurso:
```json
{
  "isActive": false
}
```

### Cambiar de Escuela:
```json
{
  "schoolId": "new-school-uuid"
}
```

---

## 🚀 FLUJO COMPLETO DE ONBOARDING

### Paso 1: Login como Admin
```http
POST /auth/login
```
```json
{
  "email": "admin@onenglish.com",
  "password": "password123"
}
```
**→ Guardar access_token como ADMIN_TOKEN**

---

### Paso 2: Crear Nueva Escuela
```http
POST /schools
Authorization: Bearer {{ADMIN_TOKEN}}
```
```json
{
  "name": "My New School",
  "code": "MNS001",
  "city": "Miami",
  "email": "info@mynewschool.edu"
}
```
**→ Guardar id como NEW_SCHOOL_ID**

---

### Paso 3: Crear User para Coordinator
```http
POST /users (si tienes este endpoint)
O crear directamente en DB
```
**→ Guardar id como NEW_USER_ID**

---

### Paso 4: Crear Coordinator
```http
POST /coordinators
Authorization: Bearer {{ADMIN_TOKEN}}
```
```json
{
  "firstName": "First",
  "lastName": "Coordinator",
  "email": "firstcoord@mynewschool.edu",
  "userId": "{{NEW_USER_ID}}",
  "schoolId": "{{NEW_SCHOOL_ID}}",
  "username": "firstcoord",
  "password": "Coord123!"
}
```

---

### Paso 5: Login como Coordinator
```http
POST /auth/login
```
```json
{
  "email": "firstcoord@mynewschool.edu",
  "password": "Coord123!"
}
```
**→ Guardar access_token como COORDINATOR_TOKEN**

---

### Paso 6: Coordinator Agrega Teacher
```http
POST /teachers
Authorization: Bearer {{COORDINATOR_TOKEN}}
```
```json
{
  "firstName": "First",
  "lastName": "Teacher",
  "email": "firstteacher@mynewschool.edu",
  "userId": "ANOTHER_NEW_USER_ID",
  "schoolId": "{{NEW_SCHOOL_ID}}",
  "username": "firstteacher",
  "password": "Teacher123!"
}
```

---

### Paso 7: Coordinator Agrega Student
```http
POST /students
Authorization: Bearer {{COORDINATOR_TOKEN}}
```
```json
{
  "firstName": "First",
  "lastName": "Student",
  "email": "firststudent@mynewschool.edu",
  "userId": "YET_ANOTHER_USER_ID",
  "schoolId": "{{NEW_SCHOOL_ID}}",
  "username": "firststudent",
  "password": "Student123!"
}
```

---

## 💾 JSON para Importar Variables en Postman

Crea un archivo `environment.json`:

```json
{
  "name": "OneEnglish Development",
  "values": [
    { "key": "BASE_URL", "value": "http://localhost:3000", "enabled": true },
    { "key": "ADMIN_TOKEN", "value": "", "enabled": true },
    { "key": "COORDINATOR_TOKEN", "value": "", "enabled": true },
    { "key": "TEACHER_TOKEN", "value": "", "enabled": true },
    { "key": "STUDENT_TOKEN", "value": "", "enabled": true },
    { "key": "LINCOLN_SCHOOL_ID", "value": "", "enabled": true },
    { "key": "JEFFERSON_SCHOOL_ID", "value": "", "enabled": true },
    { "key": "WASHINGTON_SCHOOL_ID", "value": "", "enabled": true },
    { "key": "LAST_CREATED_ID", "value": "", "enabled": true }
  ]
}
```

Importar en Postman: Settings → Environments → Import

---

## 🎨 Generador de Datos Random (JavaScript en Postman)

Agregar en Pre-request Script:

```javascript
// Generar datos random
const faker = require('faker'); // Si usas faker

pm.environment.set("RANDOM_FIRST", faker.name.firstName());
pm.environment.set("RANDOM_LAST", faker.name.lastName());
pm.environment.set("RANDOM_EMAIL", faker.internet.email().toLowerCase());
pm.environment.set("RANDOM_USERNAME", faker.internet.userName().toLowerCase());

// O sin faker:
const randomNum = Math.floor(Math.random() * 10000);
pm.environment.set("RANDOM_NUM", randomNum);
pm.environment.set("RANDOM_EMAIL", `user${randomNum}@test.edu`);
pm.environment.set("RANDOM_USERNAME", `user${randomNum}`);
```

Luego en el body:
```json
{
  "firstName": "{{RANDOM_FIRST}}",
  "lastName": "{{RANDOM_LAST}}",
  "email": "{{RANDOM_EMAIL}}",
  "username": "{{RANDOM_USERNAME}}"
}
```

---

## ✅ Checklist de Pruebas

### Tests Básicos
- [ ] Login con cada rol
- [ ] Crear escuela (admin)
- [ ] Crear admin (admin)
- [ ] Crear coordinator (admin)
- [ ] Crear teacher (admin)
- [ ] Crear student (admin)

### Tests de Restricciones
- [ ] Coordinator crea en su escuela ✅
- [ ] Coordinator intenta crear en otra escuela ❌
- [ ] Coordinator lee de su escuela ✅
- [ ] Coordinator intenta leer de otra escuela ❌
- [ ] Teacher lee de su escuela ✅
- [ ] Teacher intenta leer de otra escuela ❌

### Tests de Actualización
- [ ] Admin actualiza cualquier recurso ✅
- [ ] Coordinator intenta actualizar ❌
- [ ] Teacher intenta actualizar ❌

### Tests de Eliminación
- [ ] Admin elimina recurso ✅
- [ ] Coordinator intenta eliminar ❌

---

**💡 Tip:** Guarda esta colección y compártela con tu equipo para testing consistente!

