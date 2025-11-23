import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";

export default async function deleteCoordinator(coordinatorId: string): Promise<void> {
  try {
    await api.delete(`/coordinators/${coordinatorId}`);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error deleting coordinator:", error.message);
    } else {
      console.error("Unexpected error deleting coordinator:", error);
    }
    throw new Error("Error deleting coordinator");
  }
}
