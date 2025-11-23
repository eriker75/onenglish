"use client";
import getAllSchools from "@/src/requests/schools/getAllSchools";
import { GetAllSchoolsQueryParamsDto } from "@/src/definitions/dtos/requests/schools";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useQuery } from "@tanstack/react-query";

export const useGetAllSchools = (
  queryParams: GetAllSchoolsQueryParamsDto = {}
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SCHOOLS, queryParams],
    queryFn: () => getAllSchools(queryParams),
  });
};
