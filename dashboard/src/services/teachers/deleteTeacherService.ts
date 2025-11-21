import deleteTeacher from "@/src/repositories/teachers/deleteTeacher";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teacherId: string) => deleteTeacher(teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEACHERS] });
    },
  });
};
