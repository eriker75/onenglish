import deleteStudent from "@/src/repositories/students/deleteStudent";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId: string) => deleteStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
    },
  });
};
