import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { UpdateAdminDto } from "@/src/definitions/dtos/requests/admins";
import { AdminResponse } from "@/src/definitions/dtos/responses";

export default async function updateAdmin(
  adminId: string,
  adminData: UpdateAdminDto
): Promise<AdminResponse> {
  try {
    const response = await api.put<AdminResponse>(
      `/admins/${adminId}`,
      adminData
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error updating admin:", error.message);
    } else {
      console.error("Unexpected error updating admin:", error);
    }
    throw new Error("Error updating admin");
  }
}
