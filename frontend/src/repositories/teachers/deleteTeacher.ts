import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";

export default async function deleteTeacher(teacherId: string): Promise<void> {
  try {
    await api.delete(`/teachers/${teacherId}`);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error deleting teacher:", error.message);
    } else {
      console.error("Unexpected error deleting teacher:", error);
    }
    throw new Error("Error deleting teacher");
  }
}
