import updateTeacher from "@/src/repositories/teachers/updateTeacher";
import { UpdateTeacherDto } from "@/src/definitions/dtos/requests/teachers";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateTeacherParams {
  teacherId: string;
  teacherData: UpdateTeacherDto;
}

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teacherId, teacherData }: UpdateTeacherParams) =>
      updateTeacher(teacherId, teacherData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEACHERS] });
    },
  });
};
