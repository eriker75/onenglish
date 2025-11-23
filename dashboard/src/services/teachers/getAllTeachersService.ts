import getAllTeachers from "@/src/requests/teachers/getAllTeachers";
import { GetAllTeachersQueryParamsDto } from "@/src/definitions/dtos/requests/teachers";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useQuery } from "@tanstack/react-query";

export const useGetAllTeachers = (
  queryParams: GetAllTeachersQueryParamsDto = {}
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TEACHERS, queryParams],
    queryFn: () => getAllTeachers(queryParams),
  });
};
