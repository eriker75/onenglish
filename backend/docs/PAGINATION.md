# Sistema de Paginación

Este documento describe el sistema de paginación implementado en el proyecto OneEnglish Backend.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Estructura](#estructura)
- [DTOs de Paginación](#dtos-de-paginación)
- [DTOs de Query](#dtos-de-query)
- [Implementación en Servicios](#implementación-en-servicios)
- [Endpoints Disponibles](#endpoints-disponibles)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Cambios Importantes](#cambios-importantes)

## Descripción General

El sistema de paginación está implementado en **TODOS** los endpoints principales de listado. Cada endpoint devuelve respuestas paginadas con metadata completa, incluyendo enlaces de navegación.

**Módulos con paginación:**
- **Coordinators** (Coordinadores)
- **Teachers** (Profesores)
- **Students** (Estudiantes)
- **Schools** (Liceos)

**Características principales:**
- ✅ Paginación por defecto en todos los endpoints GET principales
- ✅ Filtros específicos por módulo
- ✅ Búsqueda flexible (general y por campos específicos)
- ✅ Enlaces de navegación automáticos (`nextLink`, `previousLink`)
- ✅ Metadata completa de paginación

## Estructura

### DTOs de Paginación Base

#### `PaginationDto`

Ubicación: `src/common/dtos/pagination.dto.ts`

DTO base que proporciona los parámetros comunes de paginación:

```typescript
{
  limit?: number;      // Cantidad de registros por página (1-100, default: 10)
  offset?: number;     // Cantidad de registros a omitir (default: 0)
}
```

**Nota:** El parámetro `search` se removió del DTO base. Cada módulo define sus propios filtros de búsqueda en sus respectivos DTOs de query.

#### `PaginatedResponseDto<T>`

Clase genérica para respuestas paginadas que incluye:

```typescript
{
  data: T[];                // Array de items
  total: number;            // Total de registros
  limit: number;            // Límite aplicado
  offset: number;           // Offset aplicado
  totalPages: number;       // Total de páginas
  currentPage: number;      // Página actual
  hasNextPage: boolean;     // Si hay página siguiente
  hasPreviousPage: boolean; // Si hay página anterior
  nextLink: string | null;  // URL para la página siguiente
  previousLink: string | null; // URL para la página anterior
}
```

**Nuevas características:**
- **`nextLink`**: URL completa para obtener la siguiente página (null si es la última)
- **`previousLink`**: URL completa para obtener la página anterior (null si es la primera)

## DTOs de Query

Cada módulo tiene su propio DTO de query que extiende de `PaginationDto` y agrega filtros específicos.

### QueryCoordinatorDto

Ubicación: `src/coordinators/dto/query-coordinator.dto.ts`

Filtros disponibles:
- `schoolId?: string` - Filtrar por ID de liceo
- `isActive?: boolean` - Filtrar por estado activo/inactivo
- `search?: string` - Búsqueda general en firstName, lastName, email
- `firstName?: string` - Filtrar por nombre
- `lastName?: string` - Filtrar por apellido
- `email?: string` - Filtrar por email
- Hereda: `limit`, `offset`

### QueryTeacherDto

Ubicación: `src/teachers/dto/query-teacher.dto.ts`

Filtros disponibles:
- `schoolId?: string` - Filtrar por ID de liceo
- `isActive?: boolean` - Filtrar por estado activo/inactivo
- `search?: string` - Búsqueda general en firstName, lastName, email
- `firstName?: string` - Filtrar por nombre
- `lastName?: string` - Filtrar por apellido
- `email?: string` - Filtrar por email
- Hereda: `limit`, `offset`

### QueryStudentDto

Ubicación: `src/students/dto/query-student.dto.ts`

Filtros disponibles:
- `schoolId?: string` - Filtrar por ID de liceo
- `isActive?: boolean` - Filtrar por estado activo/inactivo
- `search?: string` - Búsqueda general en firstName, lastName, email
- `firstName?: string` - Filtrar por nombre
- `lastName?: string` - Filtrar por apellido
- `email?: string` - Filtrar por email
- Hereda: `limit`, `offset`

### QuerySchoolDto

Ubicación: `src/schools/dto/query-school.dto.ts`

Filtros disponibles:
- `isActive?: boolean` - Filtrar por estado activo/inactivo
- `search?: string` - Búsqueda general en name, code, address
- `name?: string` - Filtrar por nombre del liceo
- `code?: string` - Filtrar por código del liceo
- `city?: string` - Filtrar por ciudad
- `state?: string` - Filtrar por estado
- `country?: string` - Filtrar por país
- Hereda: `limit`, `offset`

## Implementación en Servicios

Cada servicio implementa el método `findAllPaginated()`:

### Coordinators Service

```typescript
async findAllPaginated(
  query: QueryCoordinatorDto,
): Promise<PaginatedResponseDto<Coordinator>>
```

**Búsqueda por campo `search`:**
- firstName (nombre)
- lastName (apellido)
- email (correo electrónico)

### Teachers Service

```typescript
async findAllPaginated(
  query: QueryTeacherDto,
): Promise<PaginatedResponseDto<Teacher>>
```

**Búsqueda por campo `search`:**
- firstName (nombre)
- lastName (apellido)
- email (correo electrónico)

### Students Service

```typescript
async findAllPaginated(
  query: QueryStudentDto,
  userSchoolId?: string,
): Promise<PaginatedResponseDto<Student>>
```

**Búsqueda por campo `search`:**
- firstName (nombre)
- lastName (apellido)
- email (correo electrónico)

**Nota:** Este servicio soporta restricción por `userSchoolId` para usuarios que solo pueden ver estudiantes de su liceo.

### Schools Service

```typescript
async findAllPaginated(
  query: QuerySchoolDto,
): Promise<PaginatedResponseDto<School>>
```

**Búsqueda por campo `search`:**
- name (nombre del liceo)
- code (código del liceo)
- address (dirección)

## Endpoints Disponibles

### Coordinators

```
GET /coordinators
```

**Query Parameters:**
- `limit` (opcional, default: 10, max: 100)
- `offset` (opcional, default: 0)
- `search` (opcional) - Busca en firstName, lastName, email
- `firstName` (opcional)
- `lastName` (opcional)
- `email` (opcional)
- `schoolId` (opcional, UUID)
- `isActive` (opcional, boolean)

**Permisos:** Público (SkipSchoolReadCheck)

### Teachers

```
GET /teachers
```

**Query Parameters:**
- `limit` (opcional, default: 10, max: 100)
- `offset` (opcional, default: 0)
- `search` (opcional) - Busca en firstName, lastName, email
- `firstName` (opcional)
- `lastName` (opcional)
- `email` (opcional)
- `schoolId` (opcional, UUID)
- `isActive` (opcional, boolean)

**Permisos:** Público (SkipSchoolReadCheck)

### Students

```
GET /students
```

**Query Parameters:**
- `limit` (opcional, default: 10, max: 100)
- `offset` (opcional, default: 0)
- `search` (opcional) - Busca en firstName, lastName, email
- `firstName` (opcional)
- `lastName` (opcional)
- `email` (opcional)
- `schoolId` (opcional, UUID)
- `isActive` (opcional, boolean)

**Permisos:** Público (SkipSchoolReadCheck)

### Schools

```
GET /schools
```

**Query Parameters:**
- `limit` (opcional, default: 10, max: 100)
- `offset` (opcional, default: 0)
- `search` (opcional) - Busca en name, code, address
- `name` (opcional)
- `code` (opcional)
- `city` (opcional)
- `state` (opcional)
- `country` (opcional)
- `isActive` (opcional, boolean)

**Permisos:** Público

## Ejemplos de Uso

### Ejemplo 1: Obtener la primera página de coordinadores

```bash
GET /coordinators?limit=10&offset=0
```

**Respuesta:**
```json
{
  "data": [
    {
      "id": "uuid",
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com",
      "school": { ... }
    }
  ],
  "total": 45,
  "limit": 10,
  "offset": 0,
  "totalPages": 5,
  "currentPage": 1,
  "hasNextPage": true,
  "hasPreviousPage": false,
  "nextLink": "http://localhost:3000/coordinators?limit=10&offset=10",
  "previousLink": null
}
```

### Ejemplo 2: Buscar profesores activos de un liceo específico

```bash
GET /teachers?limit=20&offset=0&schoolId=abc123&isActive=true
```

### Ejemplo 3: Buscar estudiantes por nombre

```bash
GET /students?limit=15&offset=0&search=Maria
```

La búsqueda buscará "Maria" en firstName, lastName y email.

### Ejemplo 4: Obtener liceos activos con búsqueda

```bash
GET /schools?limit=10&offset=0&isActive=true&search=Nacional
```

Buscará "Nacional" en name, code y address de los liceos activos.

### Ejemplo 5: Navegar a la segunda página

```bash
GET /coordinators?limit=10&offset=10
```

Para calcular el offset: `offset = (página - 1) * limit`
- Página 1: offset = 0
- Página 2: offset = 10
- Página 3: offset = 20

### Ejemplo 6: Usar desde el frontend (TypeScript/JavaScript)

```typescript
// Definir la interfaz de respuesta
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Función para obtener datos paginados
async function getCoordinators(page: number = 1, limit: number = 10, search?: string) {
  const offset = (page - 1) * limit;
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  
  if (search) {
    params.append('search', search);
  }
  
  const response = await fetch(`/coordinators?${params}`);
  const data: PaginatedResponse<Coordinator> = await response.json();
  
  return data;
}

// Uso
const result = await getCoordinators(1, 10, 'Juan');
console.log(`Mostrando ${result.data.length} de ${result.total} coordinadores`);
console.log(`Página ${result.currentPage} de ${result.totalPages}`);
```

## Notas Importantes

1. **Búsqueda Case-Insensitive**: Todas las búsquedas son case-insensitive (no distinguen mayúsculas/minúsculas).

2. **Límite Máximo**: El límite máximo permitido es 100 registros por página.

3. **Ordenamiento**: Por defecto, los resultados se ordenan por `createdAt` descendente (más recientes primero).

4. **Validación**: Todos los parámetros son validados automáticamente por los decoradores de class-validator.

5. **Navegación Simple**: Usa `nextLink` y `previousLink` para navegar entre páginas sin calcular offsets manualmente.

6. **Performance**: Las consultas están optimizadas para contar registros y obtener datos en consultas separadas para mejor rendimiento.

## Ventajas del Sistema

✅ **Reutilizable**: El DTO base se puede extender fácilmente para otros módulos

✅ **Type-Safe**: Totalmente tipado con TypeScript

✅ **Validación Automática**: Usa decoradores de class-validator

✅ **Documentación Swagger**: Todos los endpoints están documentados automáticamente

✅ **Flexible**: Soporta múltiples filtros y búsqueda simultánea

✅ **Información Completa**: La respuesta incluye toda la información necesaria para la paginación en el frontend

✅ **Estándar**: Sigue las mejores prácticas de diseño de APIs REST

✅ **Enlaces HATEOAS**: Incluye enlaces de navegación automáticos siguiendo principios REST

## Cambios Importantes

### ⚠️ Breaking Changes

1. **Endpoints principales ahora devuelven respuestas paginadas**
   - Antes: `GET /schools` devolvía `School[]`
   - Ahora: `GET /schools` devuelve `PaginatedResponseDto<School>`
   
2. **Estructura de respuesta modificada**
   ```typescript
   // Antes
   [{ id: "1", name: "School 1" }, ...]
   
   // Ahora
   {
     data: [{ id: "1", name: "School 1" }, ...],
     total: 100,
     limit: 10,
     offset: 0,
     totalPages: 10,
     currentPage: 1,
     hasNextPage: true,
     hasPreviousPage: false,
     nextLink: "http://...",
     previousLink: null
   }
   ```

3. **El parámetro `search` movido a DTOs específicos**
   - El DTO base `PaginationDto` ya no incluye `search`
   - Cada módulo define sus propios campos de búsqueda

### Migración desde versión anterior

**Frontend:**
```typescript
// Antes
const schools = await fetch('/schools').then(r => r.json());
schools.forEach(school => ...);

// Ahora
const response = await fetch('/schools').then(r => r.json());
response.data.forEach(school => ...);

// Acceso a metadata de paginación
console.log(`Mostrando ${response.data.length} de ${response.total}`);
if (response.hasNextPage) {
  const nextPage = await fetch(response.nextLink).then(r => r.json());
}
```

### Nuevas Características

1. **Enlaces de navegación automáticos**
   - `nextLink` y `previousLink` generados automáticamente
   - Incluyen todos los filtros aplicados
   - Siguen principios HATEOAS

2. **Filtros específicos por campo**
   - Además de búsqueda general, cada módulo tiene filtros específicos
   - Ejemplo: `firstName`, `lastName`, `email` para personas
   - Ejemplo: `name`, `code`, `city` para schools

3. **Búsqueda flexible**
   - `search`: Búsqueda general en múltiples campos
   - Filtros específicos: Búsqueda exacta en campos individuales
   - Se pueden combinar ambos tipos de búsqueda

