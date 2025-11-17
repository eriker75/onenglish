import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { ChallengeResponse } from "@/src/definitions/dtos/responses";

export default async function getChallengeById(
  challengeId: string
): Promise<ChallengeResponse> {
  try {
    const response = await api.get<ChallengeResponse>(`/challenges/${challengeId}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error fetching challenge by id:", error.message);
    } else {
      console.error("Unexpected error fetching challenge by id:", error);
    }
    throw new Error("Error fetching challenge by id");
  }
}
