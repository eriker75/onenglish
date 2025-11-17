import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { TeacherResponse } from "@/src/definitions/dtos/responses";

export default async function getTeacherById(
  teacherId: string
): Promise<TeacherResponse> {
  try {
    const response = await api.get<TeacherResponse>(`/teachers/${teacherId}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error fetching teacher by id:", error.message);
    } else {
      console.error("Unexpected error fetching teacher by id:", error);
    }
    throw new Error("Error fetching teacher by id");
  }
}
