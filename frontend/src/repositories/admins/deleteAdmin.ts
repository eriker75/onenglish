import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";

export default async function deleteAdmin(adminId: string): Promise<void> {
  try {
    await api.delete(`/admins/${adminId}`);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error deleting admin:", error.message);
    } else {
      console.error("Unexpected error deleting admin:", error);
    }
    throw new Error("Error deleting admin");
  }
}
