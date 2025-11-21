import { VALID_CHALLENGE_TYPES } from "../constants/VALID_CHALLENGE_TYPES";

export type ChallengeType = (typeof VALID_CHALLENGE_TYPES)[number];
