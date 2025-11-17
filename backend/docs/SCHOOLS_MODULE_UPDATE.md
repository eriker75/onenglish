# Actualización del Módulo de Schools

## Resumen de Cambios

Este documento describe los cambios realizados en el módulo de Schools para mejorar la gestión y auto-generación de códigos de escuelas.

## Cambios en el Schema de Prisma

### Modelo School Actualizado

```prisma
model School {
  id             String            @id @default(uuid())
  schoolId       Int               @unique @default(autoincrement()) // ID secuencial amigable
  name           String
  code           String            @unique // Código auto-generado (SCH0001, SCH0002, ..., SCH9999, SCH00001)
  type           String            // Tipo de escuela (public, private, charter, etc.)
  email          String
  phone          String
  city           String
  state          String
  country        String            @default("Venezuela")
  address        String?
  postalCode     String?
  website        String?
  description    String?
  isActive       Boolean           @default(true)
  // ... relaciones
}
```

### Campos Nuevos

1. **schoolId** (Int): ID secuencial auto-incremental para búsquedas amigables y visualización en tablas
2. **type** (String): Tipo de escuela (obligatorio)

### Campos Modificados

- **code**: Ahora es auto-generado por el sistema (no se envía en el request)
- **email, phone, city, state**: Ahora son campos obligatorios
- **country**: Por defecto es "Venezuela"
- **website**: Ahora es opcional

## Cambios en DTOs

### CreateSchoolDto

**Campos Requeridos:**
- `name`: Nombre de la escuela
- `email`: Correo electrónico
- `phone`: Número de teléfono
- `city`: Ciudad
- `state`: Estado/Provincia
- `type`: Tipo de escuela

**Campos Opcionales:**
- `website`: Sitio web
- `address`: Dirección
- `postalCode`: Código postal
- `description`: Descripción
- `isActive`: Estado activo (default: true)

**Eliminados:**
- `code`: Ya no se envía, se genera automáticamente
- `country`: Se establece por defecto a "Venezuela"

### QuerySchoolDto

**Nuevo campo:**
- `schoolId`: Filtro por ID secuencial de la escuela

## Cambios en el Service

### Método de Auto-generación de Código

Se implementó un método privado `generateSchoolCode()` que:

1. Busca la última escuela creada
2. Extrae el número del código (ej: SCH0001 → 0001)
3. Incrementa el número
4. Si llega a SCH9999, el siguiente será SCH00001 (5 dígitos)
5. Formatea el nuevo código con padding de ceros

**Ejemplos de secuencia:**
- SCH0001, SCH0002, ..., SCH9999, SCH00001, SCH00002, ...

### Nuevos Métodos

1. **findBySchoolId(schoolId: number)**: Busca una escuela por su ID secuencial
2. **generateSchoolCode()**: Genera automáticamente el siguiente código en la secuencia

### Métodos Modificados

1. **create()**: Ahora genera automáticamente el código de la escuela
2. **update()**: Se eliminó la validación de código duplicado (ya que no se puede modificar)
3. **findByCode()**: Ahora lanza NotFoundException si no encuentra la escuela
4. **findAllPaginated()**: Ahora soporta filtrado por schoolId

## Cambios en el Controller

### Nuevos Endpoints

```
GET /schools/school-id/:schoolId
```
Busca una escuela por su ID secuencial (schoolId).

**Ejemplo:** `GET /schools/school-id/1`

### Endpoints Existentes Modificados

```
POST /schools
```
- Ya no requiere el campo `code` en el body
- El código se genera automáticamente
- Requiere: name, email, phone, city, state, type

```
GET /schools/code/:code
```
- Ahora lanza 404 si no encuentra la escuela

```
PATCH /schools/:id
```
- Ya no se puede modificar el código de la escuela

### Rutas Disponibles

1. `POST /schools` - Crear escuela (Admin)
2. `GET /schools` - Listar escuelas paginadas
3. `GET /schools/active` - Listar escuelas activas
4. `GET /schools/code/:code` - Buscar por código (ej: SCH0001)
5. `GET /schools/school-id/:schoolId` - Buscar por ID secuencial (ej: 1, 2, 3)
6. `GET /schools/:id` - Buscar por UUID
7. `PATCH /schools/:id` - Actualizar escuela (Admin)
8. `DELETE /schools/:id` - Eliminar escuela (Admin)

## Cambios en la Entity

Se actualizó `School.entity.ts` para reflejar:
- El nuevo campo `schoolId`
- El nuevo campo `type`
- Tipos correctos para todos los campos
- Documentación actualizada en español

## Ejemplos de Uso

### Crear una Escuela

```json
POST /schools
{
  "name": "U.E. Colegio Los Arcos",
  "email": "contacto@colegiolosarcos.edu.ve",
  "phone": "+58424-1234567",
  "city": "Caracas",
  "state": "Distrito Capital",
  "type": "public",
  "website": "https://www.colegiolosarcos.edu.ve",
  "address": "Av. Principal de Los Ruices"
}
```

**Respuesta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "schoolId": 1,
  "name": "U.E. Colegio Los Arcos",
  "code": "SCH0001",
  "type": "public",
  "email": "contacto@colegiolosarcos.edu.ve",
  "phone": "+58424-1234567",
  "city": "Caracas",
  "state": "Distrito Capital",
  "country": "Venezuela",
  "website": "https://www.colegiolosarcos.edu.ve",
  "address": "Av. Principal de Los Ruices",
  ...
}
```

### Buscar una Escuela

```
GET /schools/school-id/1        → Busca por ID secuencial
GET /schools/code/SCH0001       → Busca por código
GET /schools/123e4567-...       → Busca por UUID
```

### Búsqueda Paginada con Filtros

```
GET /schools?schoolId=1&limit=10&offset=0
GET /schools?code=SCH0001&isActive=true
GET /schools?city=Caracas&state=Distrito Capital
GET /schools?search=Arcos
```

## Migración de Base de Datos

Se creó una migración para agregar el campo `type`:

```sql
ALTER TABLE "schools" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'public';
ALTER TABLE "schools" ALTER COLUMN "type" DROP DEFAULT;
```

## Actualización del Seed

Se actualizó `seed.ts` para incluir el campo `type` en todas las escuelas generadas.

## Ventajas de estos Cambios

1. **Código Auto-generado**: No hay riesgo de códigos duplicados o inválidos
2. **ID Amigable**: `schoolId` es más fácil de recordar y usar que UUIDs
3. **Búsqueda Flexible**: Se puede buscar por UUID, código o schoolId
4. **Datos Obligatorios**: Garantiza que todas las escuelas tengan información completa
5. **País por Defecto**: Simplifica la creación para Venezuela
6. **Tipo de Escuela**: Permite categorizar las escuelas (pública, privada, etc.)

## Notas Importantes

- El campo `code` es **solo de lectura** y no se puede modificar después de la creación
- El `schoolId` es **auto-incremental** y único
- El `country` siempre será "Venezuela" por defecto
- El campo `type` es **obligatorio** en la creación

