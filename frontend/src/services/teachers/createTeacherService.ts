import createTeacher from "@/src/repositories/teachers/createTeacher";
import { CreateTeacherDto } from "@/src/definitions/dtos/requests/teachers";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teacherData: CreateTeacherDto) => createTeacher(teacherData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEACHERS] });
    },
  });
};
