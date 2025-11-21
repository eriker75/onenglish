import updateStudent from "@/src/repositories/students/updateStudent";
import { UpdateStudentDto } from "@/src/definitions/dtos/requests/students";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateStudentParams {
  studentId: number;
  studentData: UpdateStudentDto;
}

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, studentData }: UpdateStudentParams) =>
      updateStudent(studentId, studentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
    },
  });
};
