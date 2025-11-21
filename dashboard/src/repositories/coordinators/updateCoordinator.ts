import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { UpdateCoordinatorDto } from "@/src/definitions/dtos/requests/coordinators";
import { CoordinatorResponse } from "@/src/definitions/dtos/responses";

export default async function updateCoordinator(
  coordinatorId: string,
  coordinatorData: UpdateCoordinatorDto
): Promise<CoordinatorResponse> {
  try {
    const response = await api.put<CoordinatorResponse>(
      `/coordinators/${coordinatorId}`,
      coordinatorData
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error updating coordinator:", error.message);
    } else {
      console.error("Unexpected error updating coordinator:", error);
    }
    throw new Error("Error updating coordinator");
  }
}
