import getStudentById from "@/src/repositories/students/getStudentById";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useQuery } from "@tanstack/react-query";

export const useGetStudentById = (studentId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.STUDENTS, studentId],
    queryFn: () => getStudentById(studentId),
    enabled: !!studentId,
  });
};
