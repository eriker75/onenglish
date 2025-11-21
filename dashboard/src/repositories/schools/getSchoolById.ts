import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { SchoolResponse } from "@/src/definitions/dtos/responses";

export default async function getSchoolById(
  schoolId: string
): Promise<SchoolResponse> {
  try {
    const response = await api.get<SchoolResponse>(`/schools/${schoolId}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error fetching school by id:", error.message);
    } else {
      console.error("Unexpected error fetching school by id:", error);
    }
    throw new Error("Error fetching school by id");
  }
}
