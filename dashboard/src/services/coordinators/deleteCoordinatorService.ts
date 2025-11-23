import deleteCoordinator from "@/src/requests/coordinators/deleteCoordinator";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCoordinator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coordinatorId: string) => deleteCoordinator(coordinatorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COORDINATORS] });
    },
  });
};
