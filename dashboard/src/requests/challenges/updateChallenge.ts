import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";
import { UpdateChallengeDto } from "@/src/definitions/dtos/requests/challenges";
import { ChallengeResponse } from "@/src/definitions/dtos/responses";

export default async function updateChallenge(
  challengeId: string,
  challengeData: UpdateChallengeDto
): Promise<ChallengeResponse> {
  try {
    const response = await api.put<ChallengeResponse>(
      `/challenges/${challengeId}`,
      challengeData
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error updating challenge:", error.message);
    } else {
      console.error("Unexpected error updating challenge:", error);
    }
    throw new Error("Error updating challenge");
  }
}
