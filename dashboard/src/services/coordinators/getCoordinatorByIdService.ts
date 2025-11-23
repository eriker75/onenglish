import getCoordinatorById from "@/src/requests/coordinators/getCoordinatorById";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useQuery } from "@tanstack/react-query";

export const useGetCoordinatorById = (coordinatorId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COORDINATORS, coordinatorId],
    queryFn: () => getCoordinatorById(coordinatorId),
    enabled: !!coordinatorId,
  });
};
