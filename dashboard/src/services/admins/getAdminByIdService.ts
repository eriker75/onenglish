import getAdminById from "@/src/requests/admins/getAdminById";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useQuery } from "@tanstack/react-query";

export const useGetAdminById = (adminId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMINS, adminId],
    queryFn: () => getAdminById(adminId),
    enabled: !!adminId,
  });
};
