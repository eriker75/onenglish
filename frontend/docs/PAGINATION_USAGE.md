# Guía de Uso de Paginación y Response DTOs

## 📚 Índice
1. [Response DTOs](#response-dtos)
2. [Hook de Paginación](#hook-de-paginación)
3. [Componente de Paginación](#componente-de-paginación)
4. [Utilidades de Paginación](#utilidades-de-paginación)
5. [Ejemplos Completos](#ejemplos-completos)

---

## Response DTOs

Todos los endpoints de listado retornan un `PaginatedResponse<T>`:

\`\`\`typescript
interface PaginatedResponse<T> {
  data: T[];                    // Array de items
  total: number;                // Total de items
  limit: number;                // Límite de items por página
  offset: number;               // Offset actual
  totalPages: number;           // Total de páginas
  currentPage: number;          // Página actual
  hasNextPage: boolean;         // Tiene página siguiente
  hasPreviousPage: boolean;     // Tiene página anterior
}
\`\`\`

### Entidades Disponibles:
- `StudentResponse` & `PaginatedStudentsResponse`
- `TeacherResponse` & `PaginatedTeachersResponse`
- `CoordinatorResponse` & `PaginatedCoordinatorsResponse`
- `SchoolResponse` & `PaginatedSchoolsResponse`
- `AdminResponse` & `PaginatedAdminsResponse`
- `ChallengeResponse` & `PaginatedChallengesResponse`

---

## Hook de Paginación

### Uso Básico

\`\`\`typescript
import { usePagination } from '@/src/hooks/usePagination';
import { useGetAllStudents } from '@/src/services/students';

function StudentsPage() {
  const pagination = usePagination({ 
    initialPage: 1, 
    initialLimit: 20 
  });

  const { data, isLoading } = useGetAllStudents(pagination.getQueryParams());

  const paginationInfo = pagination.getPaginationInfo(data);

  return (
    <div>
      {/* Tu tabla aquí */}
      
      {paginationInfo && (
        <div>
          <p>Mostrando: {paginationInfo.showing}</p>
          <p>Página {paginationInfo.currentPage} de {paginationInfo.totalPages}</p>
          
          <button 
            onClick={pagination.prevPage}
            disabled={!paginationInfo.hasPreviousPage}
          >
            Anterior
          </button>
          
          <button 
            onClick={pagination.nextPage}
            disabled={!paginationInfo.hasNextPage}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
\`\`\`

### API del Hook

\`\`\`typescript
const {
  page,              // Página actual
  limit,             // Límite actual
  offset,            // Offset calculado
  setPage,           // Cambiar página
  setLimit,          // Cambiar límite
  nextPage,          // Ir a siguiente página
  prevPage,          // Ir a página anterior
  goToFirstPage,     // Ir a primera página
  goToLastPage,      // Ir a última página (requiere totalPages)
  canGoPrevious,     // Puede ir a anterior
  canGoNext,         // Puede ir a siguiente (requiere totalPages)
  getQueryParams,    // Obtener { limit, offset }
  getPaginationInfo, // Obtener info completa de paginación
} = usePagination();
\`\`\`

---

## Componente de Paginación

### Uso Básico

\`\`\`typescript
import { PaginationControls } from '@/src/components/PaginationControls';
import { useGetAllStudents } from '@/src/services/students';
import { usePagination } from '@/src/hooks/usePagination';

function StudentsTable() {
  const pagination = usePagination();
  const { data, isLoading } = useGetAllStudents(pagination.getQueryParams());

  return (
    <div>
      {/* Tu tabla */}
      <table>
        <tbody>
          {data?.data.map((student) => (
            <tr key={student.id}>
              <td>{student.fullName}</td>
              <td>{student.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Componente de paginación */}
      <PaginationControls
        data={data}
        onPageChange={pagination.setPage}
        isLoading={isLoading}
        maxPages={5}
      />
    </div>
  );
}
\`\`\`

---

## Utilidades de Paginación

### Funciones Disponibles

\`\`\`typescript
import {
  getOffsetFromPage,
  getPageFromOffset,
  isPaginationEmpty,
  getPaginationText,
  getPaginationRange,
  createPaginationParams,
} from '@/src/utils/pagination';

// Calcular offset desde página
const offset = getOffsetFromPage(2, 10); // page 2, limit 10 => offset 10

// Calcular página desde offset
const page = getPageFromOffset(20, 10); // offset 20, limit 10 => page 3

// Verificar si está vacío
const isEmpty = isPaginationEmpty(data); // true/false

// Obtener texto de paginación
const text = getPaginationText(data); // "Showing 1-10 of 50"

// Obtener rango de páginas para mostrar
const pages = getPaginationRange(5, 10, 5); // [3, 4, 5, 6, 7]

// Crear params de paginación
const params = createPaginationParams({ page: 2, limit: 20 });
// => { limit: 20, offset: 20 }
\`\`\`

---

## Ejemplos Completos

### Ejemplo 1: Tabla con Filtros y Paginación

\`\`\`typescript
'use client';

import { useState } from 'react';
import { usePagination } from '@/src/hooks/usePagination';
import { useGetAllStudents } from '@/src/services/students';
import { PaginationControls } from '@/src/components/PaginationControls';

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [schoolType, setSchoolType] = useState<'bilingual' | 'regular' | undefined>();
  
  const pagination = usePagination({ initialLimit: 20 });

  const { data, isLoading } = useGetAllStudents({
    ...pagination.getQueryParams(),
    schoolType,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const filteredData = data?.data.filter(student =>
    student.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Students</h1>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2"
        />
        
        <select
          value={schoolType || ''}
          onChange={(e) => setSchoolType(e.target.value as any)}
          className="border rounded px-4 py-2"
        >
          <option value="">All Types</option>
          <option value="bilingual">Bilingual</option>
          <option value="regular">Regular</option>
        </select>
      </div>

      {/* Tabla */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Grade</th>
                <th className="border p-2">School</th>
                <th className="border p-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((student) => (
                <tr key={student.id}>
                  <td className="border p-2">{student.fullName}</td>
                  <td className="border p-2">{student.grade}</td>
                  <td className="border p-2">{student.school}</td>
                  <td className="border p-2">{student.schoolType}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <PaginationControls
            data={data}
            onPageChange={pagination.setPage}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}
\`\`\`

### Ejemplo 2: Cambiar Límite de Items

\`\`\`typescript
function StudentsWithLimitSelector() {
  const [limit, setLimit] = useState(10);
  const pagination = usePagination({ initialLimit: limit });

  const { data, isLoading } = useGetAllStudents(pagination.getQueryParams());

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    pagination.setLimit(newLimit);
    pagination.goToFirstPage(); // Reset to first page
  };

  return (
    <div>
      {/* Selector de límite */}
      <select 
        value={limit} 
        onChange={(e) => handleLimitChange(Number(e.target.value))}
      >
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
        <option value={50}>50 per page</option>
        <option value={100}>100 per page</option>
      </select>

      {/* Tabla y paginación... */}
    </div>
  );
}
\`\`\`

### Ejemplo 3: Paginación Manual

\`\`\`typescript
function ManualPagination() {
  const pagination = usePagination();
  const { data } = useGetAllStudents(pagination.getQueryParams());
  const info = pagination.getPaginationInfo(data);

  if (!info) return null;

  return (
    <div className="flex items-center gap-2">
      <button onClick={pagination.goToFirstPage}>⏮ First</button>
      <button onClick={pagination.prevPage}>← Prev</button>
      
      <span>
        Page {info.currentPage} of {info.totalPages}
      </span>
      
      <button onClick={pagination.nextPage}>Next →</button>
      <button onClick={() => pagination.goToLastPage(info.totalPages)}>
        Last ⏭
      </button>
    </div>
  );
}
\`\`\`

---

## 🎯 Tips y Mejores Prácticas

1. **Siempre usa `usePagination`** para manejar el estado de paginación
2. **Usa `PaginationControls`** para UI consistente
3. **Combina filtros con paginación** usando `getQueryParams()`
4. **Reset página al cambiar filtros** con `goToFirstPage()`
5. **Muestra estados de carga** durante las transiciones
6. **Usa Response DTOs** para type safety completo

---

## 🚀 Resultado Final

Con estas herramientas tienes:
- ✅ Type safety completo
- ✅ Paginación automática
- ✅ Componentes reutilizables
- ✅ Utilidades helper
- ✅ Código limpio y mantenible

¡Disfruta desarrollando! 🎉
