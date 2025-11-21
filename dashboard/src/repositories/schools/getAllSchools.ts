import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { GetAllSchoolsQueryParamsDto } from "@/src/definitions/dtos/requests/schools";
import { PaginatedSchoolsResponse } from "@/src/definitions/dtos/responses";

export default async function getAllSchools(
  queryParams: GetAllSchoolsQueryParamsDto
): Promise<PaginatedSchoolsResponse> {
  try {
    const response = await api.get<PaginatedSchoolsResponse>("/schools", {
      params: queryParams
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error fetching schools:", error.message);
    } else {
      console.error("Unexpected error fetching schools:", error);
    }
    throw new Error("Error fetching schools");
  }
}
