import createAdmin from "@/src/requests/admins/createAdmin";
import { CreateAdminDto } from "@/src/definitions/dtos/requests/admins";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminData: CreateAdminDto) => createAdmin(adminData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
    },
  });
};
