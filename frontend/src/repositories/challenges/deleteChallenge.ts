import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";

export default async function deleteChallenge(challengeId: string): Promise<void> {
  try {
    await api.delete(`/challenges/${challengeId}`);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error deleting challenge:", error.message);
    } else {
      console.error("Unexpected error deleting challenge:", error);
    }
    throw new Error("Error deleting challenge");
  }
}
