import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { GetAllStudentsQueryParamsDto } from "@/src/definitions/dtos/requests/students";
import { PaginatedStudentsResponse } from "@/src/definitions/dtos/responses";

export default async function getAllStudents(
  queryParams: GetAllStudentsQueryParamsDto
): Promise<PaginatedStudentsResponse> {
  try {
    const response = await api.get<PaginatedStudentsResponse>("/students", {
      params: queryParams
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Axios error fetching students:", error.message);
    } else {
      console.error("Unexpected error fetching students:", error);
    }
    throw new Error("Error fetching students");
  }
}
