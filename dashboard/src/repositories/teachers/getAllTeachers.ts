import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { GetAllTeachersQueryParamsDto } from "@/src/definitions/dtos/requests/teachers";
import { PaginatedTeachersResponse } from "@/src/definitions/dtos/responses";

export default async function getAllTeachers(
  queryParams: GetAllTeachersQueryParamsDto
): Promise<PaginatedTeachersResponse> {
  try {
    const response = await api.get<PaginatedTeachersResponse>("/teachers", {
      params: queryParams
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error fetching teachers:", error.message);
    } else {
      console.error("Unexpected error fetching teachers:", error);
    }
    throw new Error("Error fetching teachers");
  }
}
