import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { CreateTeacherDto } from "@/src/definitions/dtos/requests/teachers";
import { TeacherResponse } from "@/src/definitions/dtos/responses";

export default async function createTeacher(
  teacherData: CreateTeacherDto
): Promise<TeacherResponse> {
  try {
    const response = await api.post<TeacherResponse>("/teachers", teacherData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error creating teacher:", error.message);
    } else {
      console.error("Unexpected error creating teacher:", error);
    }
    throw new Error("Error creating teacher");
  }
}
