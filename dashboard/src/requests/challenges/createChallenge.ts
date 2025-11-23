import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { CreateChallengeDto } from "@/src/definitions/dtos/requests/challenges";
import { ChallengeResponse } from "@/src/definitions/dtos/responses";

export default async function createChallenge(
  challengeData: CreateChallengeDto
): Promise<ChallengeResponse> {
  try {
    const response = await api.post<ChallengeResponse>("/challenges", challengeData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error creating challenge:", error.message);
    } else {
      console.error("Unexpected error creating challenge:", error);
    }
    throw new Error("Error creating challenge");
  }
}
