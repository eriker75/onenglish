import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { AdminResponse } from "@/src/definitions/dtos/responses";

export default async function getAdminById(
  adminId: string
): Promise<AdminResponse> {
  try {
    const response = await api.get<AdminResponse>(`/admins/${adminId}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error fetching admin by id:", error.message);
    } else {
      console.error("Unexpected error fetching admin by id:", error);
    }
    throw new Error("Error fetching admin by id");
  }
}
