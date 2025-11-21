import getSchoolById from "@/src/repositories/schools/getSchoolById";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useQuery } from "@tanstack/react-query";

export const useGetSchoolById = (schoolId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SCHOOLS, schoolId],
    queryFn: () => getSchoolById(schoolId),
    enabled: !!schoolId,
  });
};
