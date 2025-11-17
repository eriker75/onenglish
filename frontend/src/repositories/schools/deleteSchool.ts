import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";

export default async function deleteSchool(schoolId: string): Promise<void> {
  try {
    await api.delete(`/schools/${schoolId}`);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error deleting school:", error.message);
    } else {
      console.error("Unexpected error deleting school:", error);
    }
    throw new Error("Error deleting school");
  }
}
