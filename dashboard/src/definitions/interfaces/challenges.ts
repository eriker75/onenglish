import { ChallengeStatus } from "../types/ChallengeStatus";
import { ChallengeType } from "../types/ChallengeType";

export interface Challenge {
  id: number;
  name: string;
  grade: string;
  type: ChallengeType;
  status: ChallengeStatus;
  areas: {
    Vocabulary: number;
    Grammar: number;
    Listening: number;
    Writing: number;
    Speaking: number;
  };
  totalQuestions: number;
  totalTime: number; // in minutes
  completedAreas: number; // optional, only for completed challenges
}
