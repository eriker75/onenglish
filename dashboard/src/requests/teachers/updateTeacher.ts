import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { UpdateTeacherDto } from "@/src/definitions/dtos/requests/teachers";
import { TeacherResponse } from "@/src/definitions/dtos/responses";

export default async function updateTeacher(
  teacherId: string,
  teacherData: UpdateTeacherDto
): Promise<TeacherResponse> {
  try {
    const response = await api.put<TeacherResponse>(
      `/teachers/${teacherId}`,
      teacherData
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error updating teacher:", error.message);
    } else {
      console.error("Unexpected error updating teacher:", error);
    }
    throw new Error("Error updating teacher");
  }
}
