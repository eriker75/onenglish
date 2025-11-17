import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { GetAllAdminsQueryParamsDto } from "@/src/definitions/dtos/requests/admins";
import { PaginatedAdminsResponse } from "@/src/definitions/dtos/responses";

export default async function getAllAdmins(
  queryParams: GetAllAdminsQueryParamsDto
): Promise<PaginatedAdminsResponse> {
  try {
    const response = await api.get<PaginatedAdminsResponse>("/admins", {
      params: queryParams
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error fetching admins:", error.message);
    } else {
      console.error("Unexpected error fetching admins:", error);
    }
    throw new Error("Error fetching admins");
  }
}
