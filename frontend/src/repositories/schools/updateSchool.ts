import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { UpdateSchoolDto } from "@/src/definitions/dtos/requests/schools";
import { SchoolResponse } from "@/src/definitions/dtos/responses";

export default async function updateSchool(
  schoolId: string,
  schoolData: UpdateSchoolDto
): Promise<SchoolResponse> {
  try {
    const response = await api.patch<SchoolResponse>(
      `/schools/${schoolId}`,
      schoolData
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error updating school:", error.message);
    } else {
      console.error("Unexpected error updating school:", error);
    }
    throw new Error("Error updating school");
  }
}
