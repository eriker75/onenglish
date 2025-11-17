# 🔑 Credenciales de Prueba

Este documento contiene todas las credenciales generadas por el seeder para testing.

---

## 🚀 Ejecutar el Seeder

```bash
# Opción 1: Usando npm
npm run prisma:seed

# Opción 2: Usando make
make seed

# Opción 3: Usando ts-node directamente
npx ts-node prisma/seed.ts
```

---

## 👥 Usuarios y Credenciales

**Todos los usuarios usan la contraseña:** `password123`

### 🔴 ADMINS (Acceso Global)

| Nombre | Email | Username | Rol | Escuela |
|--------|-------|----------|-----|---------|
| Super Admin | admin@onenglish.com | admin | ADMIN | N/A (Global) |
| Secondary Admin | admin2@onenglish.com | admin2 | ADMIN | N/A (Global) |

**Capacidades:**
- ✅ Crear/editar/eliminar cualquier recurso
- ✅ Acceso a todas las escuelas
- ✅ Crear otros admins
- ✅ Bypass de todas las restricciones

---

### 🟡 COORDINATORS (Gestión de Escuela)

| Nombre | Email | Username | Rol | Escuela |
|--------|-------|----------|-----|---------|
| Maria Rodriguez | maria.rodriguez@lincolnhs.edu | mariarodriguez | COORDINATOR | Lincoln High School |
| John Wilson | john.wilson@jeffersonacademy.edu | johnwilson | COORDINATOR | Jefferson Academy |
| Susan Chen | susan.chen@washingtoninstitute.edu | susanchen | COORDINATOR | Washington Institute |

**Capacidades:**
- ✅ Agregar students/teachers/coordinators a SU escuela
- ✅ Leer recursos de SU escuela
- ❌ No puede agregar a otras escuelas
- ❌ No puede actualizar/eliminar recursos

---

### 🟢 TEACHERS (Escuela Específica)

| Nombre | Email | Username | Rol | Escuela |
|--------|-------|----------|-----|---------|
| Jane Smith | jane.smith@lincolnhs.edu | janesmith | TEACHER | Lincoln High School |
| Robert Brown | robert.brown@lincolnhs.edu | robertbrown | TEACHER | Lincoln High School |
| Emily Davis | emily.davis@jeffersonacademy.edu | emilydavis | TEACHER | Jefferson Academy |

**Capacidades:**
- ✅ Leer recursos de SU escuela
- ❌ No puede crear recursos
- ❌ No puede actualizar/eliminar recursos

---

### 🔵 STUDENTS (Escuela Específica)

| Nombre | Email | Username | Rol | Escuela | Nivel |
|--------|-------|----------|-----|---------|-------|
| John Doe | john.doe@lincolnhs.edu | johndoe | STUDENT | Lincoln High School | A1 |
| Sarah Williams | sarah.williams@lincolnhs.edu | sarahwilliams | STUDENT | Lincoln High School | B1 |
| Michael Johnson | michael.johnson@jeffersonacademy.edu | michaeljohnson | STUDENT | Jefferson Academy | B2 |
| Lisa Garcia | lisa.garcia@washingtoninstitute.edu | lisagarcia | STUDENT | Washington Institute | A1 |

**Capacidades:**
- ✅ Leer todos los estudiantes
- ❌ No puede crear/actualizar/eliminar recursos

---

## 🏫 Escuelas Creadas

### Escuelas Principales (Datos Fijos)

#### Lincoln High School
- **Code:** LHS001
- **Ciudad:** New York, NY
- **Email:** (generado con Faker)
- **Coordinators:** Maria Rodriguez
- **Teachers:** Jane Smith, Robert Brown
- **Students:** John Doe, Sarah Williams

#### Jefferson Academy
- **Code:** JA001
- **Ciudad:** Boston, MA
- **Email:** (generado con Faker)
- **Coordinators:** John Wilson
- **Teachers:** Emily Davis
- **Students:** Michael Johnson

#### Washington Institute
- **Code:** WI001
- **Ciudad:** Chicago, IL
- **Email:** (generado con Faker)
- **Coordinators:** Susan Chen
- **Teachers:** (ninguno)
- **Students:** Lisa Garcia

### Escuelas Adicionales (Generadas con Faker)

El seeder también crea **2 escuelas adicionales** con datos completamente aleatorios usando Faker.js:
- ✅ Nombres únicos (ej: "Acme Language Academy", "Portland English Institute")
- ✅ Códigos alfanuméricos únicos
- ✅ Direcciones realistas
- ✅ Teléfonos, emails, websites
- ✅ Descripciones generadas automáticamente

**Total: 5 escuelas**

---

## 🧪 Casos de Prueba con las Credenciales

### Test 1: Admin crea recursos en cualquier escuela ✅

```bash
# Login
POST /auth/login
{
  "email": "admin@onenglish.com",
  "password": "password123"
}

# Crear student en Lincoln
POST /students
Authorization: Bearer {admin_token}
{
  "firstName": "New",
  "lastName": "Student",
  "email": "new@lincolnhs.edu",
  "userId": "{new-user-uuid}",
  "schoolId": "{lincoln-school-id}"
}

# Crear teacher en Jefferson
POST /teachers
Authorization: Bearer {admin_token}
{
  "firstName": "New",
  "lastName": "Teacher",
  "email": "new@jeffersonacademy.edu",
  "userId": "{new-user-uuid}",
  "schoolId": "{jefferson-school-id}"
}
```

---

### Test 2: Coordinator gestiona su escuela ✅

```bash
# Login como coordinator de Lincoln
POST /auth/login
{
  "email": "maria.rodriguez@lincolnhs.edu",
  "password": "password123"
}

# Crear student en Lincoln ✅
POST /students
Authorization: Bearer {coordinator_token}
{
  "firstName": "New",
  "lastName": "Student",
  "email": "new.student@lincolnhs.edu",
  "userId": "{new-user-uuid}",
  "schoolId": "{lincoln-school-id}"  # SU escuela
}

# Intentar crear student en Jefferson ❌
POST /students
Authorization: Bearer {coordinator_token}
{
  "firstName": "Wrong",
  "lastName": "School",
  "email": "wrong@jeffersonacademy.edu",
  "userId": "{new-user-uuid}",
  "schoolId": "{jefferson-school-id}"  # OTRA escuela
}
# Response: 403 Forbidden
```

---

### Test 3: Teacher lee solo de su escuela ✅

```bash
# Login como teacher de Lincoln
POST /auth/login
{
  "email": "jane.smith@lincolnhs.edu",
  "password": "password123"
}

# Leer student de Lincoln ✅
GET /students/{john-doe-id}
Authorization: Bearer {teacher_token}
# Response: 200 OK

# Intentar leer student de Jefferson ❌
GET /students/{michael-johnson-id}
Authorization: Bearer {teacher_token}
# Response: 403 Forbidden - "You can only access resources from your own school"
```

---

### Test 4: Coordinator lee solo de su escuela ✅

```bash
# Login como coordinator de Jefferson
POST /auth/login
{
  "email": "john.wilson@jeffersonacademy.edu",
  "password": "password123"
}

# Leer teacher de Jefferson ✅
GET /teachers/{emily-davis-id}
Authorization: Bearer {coordinator_token}
# Response: 200 OK

# Intentar leer teacher de Lincoln ❌
GET /teachers/{jane-smith-id}
Authorization: Bearer {coordinator_token}
# Response: 403 Forbidden
```

---

## 📊 Distribución de Datos

### Por Escuela

**Lincoln High School:**
- 1 Coordinator
- 2 Teachers
- 2 Students
- 2 Challenges asignados

**Jefferson Academy:**
- 1 Coordinator
- 1 Teacher
- 1 Student
- 2 Challenges asignados

**Washington Institute:**
- 1 Coordinator
- 0 Teachers
- 1 Student
- 1 Challenge asignado

### Por Rol

- **Admins:** 2 (globales)
- **Coordinators:** 3 (1 por escuela)
- **Teachers:** 3 (2 Lincoln, 1 Jefferson)
- **Students:** 4 (2 Lincoln, 1 Jefferson, 1 Washington)

**Total Usuarios:** 12 (incluyendo admins)

---

## 🎯 IDs de Ejemplo para Postman

Después de ejecutar el seed, puedes obtener los IDs ejecutando:

```bash
# Ver todas las escuelas
GET /schools

# Ver todos los coordinators
GET /coordinators

# Ver todos los teachers
GET /teachers

# Ver todos los students
GET /students
```

Luego guarda los IDs en variables de Postman:
- `LINCOLN_SCHOOL_ID`
- `JEFFERSON_SCHOOL_ID`
- `WASHINGTON_SCHOOL_ID`
- `COORD_LINCOLN_ID`
- `COORD_JEFFERSON_ID`
- `TEACHER_LINCOLN_1_ID`
- `STUDENT_LINCOLN_1_ID`
- etc.

---

## 🔄 Resetear la Base de Datos

Si necesitas volver a ejecutar el seed desde cero:

```bash
# Opción 1: Usando Makefile
make reset-db

# Opción 2: Usando npm
npm run prisma:reset

# Opción 3: Manual
npx prisma migrate reset
```

⚠️ **Advertencia:** Esto eliminará TODOS los datos de la base de datos.

---

## 💡 Tips para Testing

### 1. Crear colección en Postman con variables

```
ADMIN_EMAIL = admin@onenglish.com
ADMIN_PASSWORD = password123

COORD_LINCOLN_EMAIL = maria.rodriguez@lincolnhs.edu
COORD_LINCOLN_PASSWORD = password123

TEACHER_LINCOLN_EMAIL = jane.smith@lincolnhs.edu
TEACHER_LINCOLN_PASSWORD = password123

STUDENT_LINCOLN_EMAIL = john.doe@lincolnhs.edu
STUDENT_LINCOLN_PASSWORD = password123
```

### 2. Pre-request Script para Login Automático

```javascript
// En la carpeta raíz de tu colección
if (!pm.environment.get("ADMIN_TOKEN")) {
    pm.sendRequest({
        url: pm.environment.get("BASE_URL") + "/auth/login",
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                email: "admin@onenglish.com",
                password: "password123"
            })
        }
    }, function (err, res) {
        const token = res.json().access_token;
        pm.environment.set("ADMIN_TOKEN", token);
    });
}
```

### 3. Verificar Datos del Seed

```sql
-- Contar registros por tabla
SELECT 'schools' as table_name, COUNT(*) as count FROM schools
UNION ALL
SELECT 'admins', COUNT(*) FROM admins
UNION ALL
SELECT 'coordinators', COUNT(*) FROM coordinators
UNION ALL
SELECT 'teachers', COUNT(*) FROM teachers
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'users', COUNT(*) FROM users;
```

---

## 🎓 Escenarios de Prueba Recomendados

### Escenario 1: Multi-School Operations
1. Login como Admin
2. Crear student en Lincoln ✅
3. Crear student en Jefferson ✅
4. Crear student en Washington ✅

### Escenario 2: Coordinator Restrictions
1. Login como Coordinator de Lincoln
2. Crear teacher en Lincoln ✅
3. Intentar crear teacher en Jefferson ❌
4. Leer student de Lincoln ✅
5. Intentar leer student de Jefferson ❌

### Escenario 3: Teacher Read-Only
1. Login como Teacher de Lincoln
2. Leer students de Lincoln ✅
3. Intentar leer students de Jefferson ❌
4. Intentar crear student ❌
5. Intentar actualizar student ❌

### Escenario 4: Student Access
1. Login como Student
2. Leer información de otros students ✅
3. Intentar leer información de teachers ❌
4. Intentar crear recursos ❌

---

## 📝 Notas Importantes

1. **Passwords:** Todos los usuarios usan `password123` por defecto
2. **Emails:** Formato `role@school.edu` para identificación fácil
3. **Usernames:** Sin espacios, en minúsculas
4. **Escuelas:** 3 escuelas en diferentes ciudades (NY, Boston, Chicago)
5. **Challenges:** Cada estudiante tiene un challenge asignado con progreso

---

## 🔍 Verificar el Seed

Después de ejecutar el seed, verifica:

```bash
# Ver resumen en consola
npm run prisma:seed

# Verificar en Prisma Studio
npm run prisma:studio

# Query directo
psql -d onenglish_db -c "SELECT COUNT(*) FROM users;"
```

Deberías ver:
- ✅ 11 usuarios
- ✅ 3 escuelas
- ✅ 2 admins
- ✅ 3 coordinators
- ✅ 3 teachers
- ✅ 4 students
- ✅ 3 challenges
- ✅ 4 roles

---

## 🆘 Troubleshooting

### Error: "Unique constraint failed"
**Solución:** Resetear la base de datos antes del seed
```bash
npm run prisma:reset
```

### Error: "Foreign key constraint failed"
**Solución:** Verificar que las migraciones estén actualizadas
```bash
npm run prisma:migrate:deploy
```

### Error: "Cannot find module bcrypt"
**Solución:** Instalar dependencias
```bash
npm install
```

---

## 🎨 Mejoras con Faker.js

El seeder usa **Faker.js** para generar datos realistas y variados:

### 📍 Datos de Escuelas
- ✅ Direcciones: `faker.location.streetAddress()`
- ✅ Códigos postales: `faker.location.zipCode()`
- ✅ Teléfonos: `faker.phone.number()`
- ✅ Emails: `faker.internet.email()`
- ✅ Descripciones: `faker.company.catchPhrase()`

### 👤 Datos de Perfiles
- ✅ Avatares: `faker.image.avatar()`
- ✅ Biografías: `faker.person.bio()` + `faker.lorem.sentence()`
- ✅ Años de experiencia: `faker.number.int({ min: 3, max: 20 })`
- ✅ Especializaciones aleatorias

### 📊 Datos de Progreso
- ✅ Scores: Rangos realistas por nivel
- ✅ Tiempo: 30min - 4h según nivel
- ✅ Fechas: `faker.date.past()` / `faker.date.future()`
- ✅ Notas: `faker.lorem.sentence()`

### 📱 Actividades (24-60 total)
- ✅ IPs: `faker.internet.ipv4()`
- ✅ User agents: `faker.internet.userAgent()`
- ✅ Metadata: Dispositivos y navegadores
- ✅ 2-5 actividades por usuario

### 🔄 Seed Reproducible

```typescript
// Cambia el seed para datos diferentes
faker.seed(123); // Default
faker.seed(456); // Otros datos
```

---

**Última actualización:** 2025-11-03  
**Versión:** 2.0 (Enhanced with Faker.js)

