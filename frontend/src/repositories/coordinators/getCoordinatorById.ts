import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { CoordinatorResponse } from "@/src/definitions/dtos/responses";

export default async function getCoordinatorById(
  coordinatorId: string
): Promise<CoordinatorResponse> {
  try {
    const response = await api.get<CoordinatorResponse>(`/coordinators/${coordinatorId}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error fetching coordinator by id:", error.message);
    } else {
      console.error("Unexpected error fetching coordinator by id:", error);
    }
    throw new Error("Error fetching coordinator by id");
  }
}
