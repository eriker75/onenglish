import getAllCoordinators from "@/src/requests/coordinators/getAllCoordinators";
import { GetAllCoordinatorsQueryParamsDto } from "@/src/definitions/dtos/requests/coordinators";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useQuery } from "@tanstack/react-query";

export const useGetAllCoordinators = (
  queryParams: GetAllCoordinatorsQueryParamsDto = {}
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COORDINATORS, queryParams],
    queryFn: () => getAllCoordinators(queryParams),
  });
};
