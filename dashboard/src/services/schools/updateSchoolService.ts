import updateSchool from "@/src/requests/schools/updateSchool";
import { UpdateSchoolDto } from "@/src/definitions/dtos/requests/schools";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateSchoolParams {
  schoolId: string;
  schoolData: UpdateSchoolDto;
}

export const useUpdateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, schoolData }: UpdateSchoolParams) =>
      updateSchool(schoolId, schoolData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SCHOOLS] });
    },
  });
};
