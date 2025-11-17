import createChallenge from "@/src/repositories/challenges/createChallenge";
import { CreateChallengeDto } from "@/src/definitions/dtos/requests/challenges";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (challengeData: CreateChallengeDto) =>
      createChallenge(challengeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHALLENGES] });
    },
  });
};
