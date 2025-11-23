import getAllAdmins from "@/src/requests/admins/getAllAdmins";
import { GetAllAdminsQueryParamsDto } from "@/src/definitions/dtos/requests/admins";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useQuery } from "@tanstack/react-query";

export const useGetAllAdmins = (
  queryParams: GetAllAdminsQueryParamsDto = {}
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMINS, queryParams],
    queryFn: () => getAllAdmins(queryParams),
  });
};
