import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { UpdateStudentDto } from "@/src/definitions/dtos/requests/students";
import { StudentResponse } from "@/src/definitions/dtos/responses";

export default async function updateStudent(
  studentId: number,
  studentData: UpdateStudentDto
): Promise<StudentResponse> {
  try {
    const response = await api.patch<StudentResponse>(
      `/students/${studentId}`,
      studentData
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error updating student:", error.message);
    } else {
      console.error("Unexpected error updating student:", error);
    }
    throw new Error("Error updating student");
  }
}
