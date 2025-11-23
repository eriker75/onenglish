import updateAdmin from "@/src/requests/admins/updateAdmin";
import { UpdateAdminDto } from "@/src/definitions/dtos/requests/admins";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateAdminParams {
  adminId: string;
  adminData: UpdateAdminDto;
}

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ adminId, adminData }: UpdateAdminParams) =>
      updateAdmin(adminId, adminData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
    },
  });
};
