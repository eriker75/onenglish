import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { CreateSchoolDto } from "@/src/definitions/dtos/requests/schools";
import { SchoolResponse } from "@/src/definitions/dtos/responses";

export default async function createSchool(
  schoolData: CreateSchoolDto
): Promise<SchoolResponse> {
  try {
    const response = await api.post<SchoolResponse>("/schools", schoolData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error creating school:", error.message);
    } else {
      console.error("Unexpected error creating school:", error);
    }
    throw new Error("Error creating school");
  }
}
