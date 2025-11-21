import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { CreateAdminDto } from "@/src/definitions/dtos/requests/admins";
import { AdminResponse } from "@/src/definitions/dtos/responses";

export default async function createAdmin(
  adminData: CreateAdminDto
): Promise<AdminResponse> {
  try {
    const response = await api.post<AdminResponse>("/admins", adminData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error creating admin:", error.message);
    } else {
      console.error("Unexpected error creating admin:", error);
    }
    throw new Error("Error creating admin");
  }
}
