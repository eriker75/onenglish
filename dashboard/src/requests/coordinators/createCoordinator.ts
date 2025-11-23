import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { CreateCoordinatorDto } from "@/src/definitions/dtos/requests/coordinators";
import { CoordinatorResponse } from "@/src/definitions/dtos/responses";

export default async function createCoordinator(
  coordinatorData: CreateCoordinatorDto
): Promise<CoordinatorResponse> {
  try {
    const response = await api.post<CoordinatorResponse>("/coordinators", coordinatorData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error creating coordinator:", error.message);
    } else {
      console.error("Unexpected error creating coordinator:", error);
    }
    throw new Error("Error creating coordinator");
  }
}
