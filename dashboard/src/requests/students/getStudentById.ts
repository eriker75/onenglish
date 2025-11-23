import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { StudentResponse } from "@/src/definitions/dtos/responses";

export default async function getStudentById(
  studentId: string
): Promise<StudentResponse> {
  try {
    const response = await api.get<StudentResponse>(`/students/${studentId}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error fetching student by id:", error.message);
    } else {
      console.error("Unexpected error fetching student by id:", error);
    }
    throw new Error("Error fetching student by id");
  }
}
