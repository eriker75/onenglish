import updateCoordinator from "@/src/requests/coordinators/updateCoordinator";
import { UpdateCoordinatorDto } from "@/src/definitions/dtos/requests/coordinators";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateCoordinatorParams {
  coordinatorId: string;
  coordinatorData: UpdateCoordinatorDto;
}

export const useUpdateCoordinator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ coordinatorId, coordinatorData }: UpdateCoordinatorParams) =>
      updateCoordinator(coordinatorId, coordinatorData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COORDINATORS] });
    },
  });
};
