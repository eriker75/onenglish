"use client";
import createSchool from "@/src/repositories/schools/createSchool";
import { CreateSchoolDto } from "@/src/definitions/dtos/requests/schools";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/src/providers/QueryProvider";

export const useCreateSchool = () => {
  return useMutation({
    mutationFn: (schoolData: CreateSchoolDto) => createSchool(schoolData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SCHOOLS] });
    },
  });
};
