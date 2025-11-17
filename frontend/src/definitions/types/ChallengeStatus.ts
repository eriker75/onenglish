import { VALID_CHALLENGE_STATUS } from '../constants/VALID_CHALLENGE_STATUS';

export type ChallengeStatus = (typeof VALID_CHALLENGE_STATUS)[number];
