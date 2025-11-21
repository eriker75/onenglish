import createCoordinator from "@/src/repositories/coordinators/createCoordinator";
import { CreateCoordinatorDto } from "@/src/definitions/dtos/requests/coordinators";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCoordinator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coordinatorData: CreateCoordinatorDto) =>
      createCoordinator(coordinatorData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COORDINATORS] });
    },
  });
};
