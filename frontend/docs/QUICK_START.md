# 🚀 Quick Start - Paginación y DTOs

## Ejemplo Completo en 3 Pasos

### 1️⃣ Importa los hooks y componentes

\`\`\`typescript
import { usePagination } from '@/src/hooks/usePagination';
import { useGetAllStudents } from '@/src/services/students';
import { PaginationControls } from '@/src/components/PaginationControls';
\`\`\`

### 2️⃣ Usa el hook de paginación

\`\`\`typescript
function StudentsPage() {
  const pagination = usePagination({ initialLimit: 20 });
  
  const { data, isLoading } = useGetAllStudents(pagination.getQueryParams());
  
  return (
    // ... tu UI aquí
  );
}
\`\`\`

### 3️⃣ Renderiza con paginación

\`\`\`typescript
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

    {/* Controles de paginación */}
    <PaginationControls
      data={data}
      onPageChange={pagination.setPage}
      isLoading={isLoading}
    />
  </div>
);
\`\`\`

## ✨ ¡Eso es todo!

Con solo 3 pasos tienes:
- ✅ Paginación funcionando
- ✅ Type safety completa
- ✅ UI profesional
- ✅ Manejo automático de estados

---

## 🎯 Servicios Disponibles

\`\`\`typescript
// Students
import { 
  useGetAllStudents,
  useGetStudentById,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent 
} from '@/src/services/students';

// Teachers
import { 
  useGetAllTeachers,
  useGetTeacherById,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher 
} from '@/src/services/teachers';

// Coordinators
import { 
  useGetAllCoordinators,
  useGetCoordinatorById,
  useCreateCoordinator,
  useUpdateCoordinator,
  useDeleteCoordinator 
} from '@/src/services/coordinators';

// Schools
import { 
  useGetAllSchools,
  useGetSchoolById,
  useCreateSchool,
  useUpdateSchool,
  useDeleteSchool 
} from '@/src/services/schools';

// Admins
import { 
  useGetAllAdmins,
  useGetAdminById,
  useCreateAdmin,
  useUpdateAdmin,
  useDeleteAdmin 
} from '@/src/services/admins';

// Challenges
import { 
  useGetAllChallenges,
  useGetChallengeById,
  useCreateChallenge,
  useUpdateChallenge,
  useDeleteChallenge 
} from '@/src/services/challenges';
\`\`\`

---

## 📚 Más Información

Ver `PAGINATION_USAGE.md` para ejemplos detallados y casos de uso avanzados.
