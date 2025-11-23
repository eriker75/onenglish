import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { GetAllCoordinatorsQueryParamsDto } from "@/src/definitions/dtos/requests/coordinators";
import { PaginatedCoordinatorsResponse } from "@/src/definitions/dtos/responses";

export default async function getAllCoordinators(
  queryParams: GetAllCoordinatorsQueryParamsDto
): Promise<PaginatedCoordinatorsResponse> {
  try {
    const response = await api.get<PaginatedCoordinatorsResponse>("/coordinators", {
      params: queryParams
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error fetching coordinators:", error.message);
    } else {
      console.error("Unexpected error fetching coordinators:", error);
    }
    throw new Error("Error fetching coordinators");
  }
}
