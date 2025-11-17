import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { GetAllChallengesQueryParamsDto } from "@/src/definitions/dtos/requests/challenges";
import { PaginatedChallengesResponse } from "@/src/definitions/dtos/responses";

export default async function getAllChallenges(
  queryParams: GetAllChallengesQueryParamsDto
): Promise<PaginatedChallengesResponse> {
  try {
    const response = await api.get<PaginatedChallengesResponse>("/challenges", {
      params: queryParams
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error fetching challenges:", error.message);
    } else {
      console.error("Unexpected error fetching challenges:", error);
    }
    throw new Error("Error fetching challenges");
  }
}
