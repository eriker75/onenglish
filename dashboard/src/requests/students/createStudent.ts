import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { CreateStudentDto } from "@/src/definitions/dtos/requests/students";
import { StudentResponse } from "@/src/definitions/dtos/responses";

export default async function createStudent(
  studentData: CreateStudentDto
): Promise<StudentResponse> {
  try {
    const response = await api.post<StudentResponse>("/students", studentData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error creating student:", error.message);
    } else {
      console.error("Unexpected error creating student:", error);
    }
    throw new Error("Error creating student");
  }
}
