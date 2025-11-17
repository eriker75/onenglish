import getChallengeById from "@/src/repositories/challenges/getChallengeById";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useQuery } from "@tanstack/react-query";

export const useGetChallengeById = (challengeId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHALLENGES, challengeId],
    queryFn: () => getChallengeById(challengeId),
    enabled: !!challengeId,
  });
};
