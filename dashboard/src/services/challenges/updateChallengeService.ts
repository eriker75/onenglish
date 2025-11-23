import updateChallenge from "@/src/requests/challenges/updateChallenge";
import { UpdateChallengeDto } from "@/src/definitions/dtos/requests/challenges";
import { QUERY_KEYS } from "@/src/definitions/constants/QUERY_KEYS";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateChallengeParams {
  challengeId: string;
  challengeData: UpdateChallengeDto;
}

export const useUpdateChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ challengeId, challengeData }: UpdateChallengeParams) =>
      updateChallenge(challengeId, challengeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHALLENGES] });
    },
  });
};
