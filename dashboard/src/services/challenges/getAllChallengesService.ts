import getAllChallenges from "@/src/requests/challenges/getAllChallenges";
import { GetAllChallengesQueryParamsDto } from "@/src/definitions/dtos/requests/challenges";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useQuery } from "@tanstack/react-query";

export const useGetAllChallenges = (
  queryParams: GetAllChallengesQueryParamsDto = {}
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHALLENGES, queryParams],
    queryFn: () => getAllChallenges(queryParams),
  });
};
