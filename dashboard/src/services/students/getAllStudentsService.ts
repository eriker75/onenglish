import getAllStudents from "@/src/requests/students/getAllStudents";
import { GetAllStudentsQueryParamsDto } from "@/src/definitions/dtos/requests/students";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useQuery } from "@tanstack/react-query";

export const useGetAllStudents = (queryParams: GetAllStudentsQueryParamsDto = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.STUDENTS, queryParams],
    queryFn: () => getAllStudents(queryParams),
  });
};
