import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";

export default async function deleteStudent(studentId: string): Promise<void> {
  try {
    await api.delete(`/students/${studentId}`);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error deleting student:", error.message);
    } else {
      console.error("Unexpected error deleting student:", error);
    }
    throw new Error("Error deleting student");
  }
}
