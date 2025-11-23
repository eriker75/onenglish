import getTeacherById from "@/src/requests/teachers/getTeacherById";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useQuery } from "@tanstack/react-query";

export const useGetTeacherById = (teacherId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TEACHERS, teacherId],
    queryFn: () => getTeacherById(teacherId),
    enabled: !!teacherId,
  });
};
