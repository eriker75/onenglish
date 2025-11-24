"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection";
import { DebateQuestion, DebatePayload } from "./types";
import Debate from "../question-blocks/Debate";
import { isAxiosError } from "axios";

interface DebateWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function DebateWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: DebateWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData } = useQuestion(existingQuestion?.id);

  // Cast existingQuestion to DebateQuestion for type safety
  const debateQuestion = (freshQuestionData || existingQuestion) as
    | DebateQuestion
    | undefined;
  const [questionText, setQuestionText] = useState(
    existingQuestion?.question || ""
  );
  const [instructions, setInstructions] = useState(
    debateQuestion?.instructions || ""
  );
  const [content, setContent] = useState(debateQuestion?.content || "");
  const [stance, setStance] = useState<string>(() => {
    const s = debateQuestion?.stance || "random";
    if (s === "support") return "for";
    if (s === "oppose") return "against";
    return s;
  });
  const [points, setPoints] = useState(debateQuestion?.points || 0);
  const initialTime = debateQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    debateQuestion?.maxAttempts || 1
  );

  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSave = () => {
    if (!challengeId || !content) {
      toast({
        title: "Error",
        description: "Please fill in the debate content",
        variant: "destructive",
      });
      return;
    }

    // Map UI values to backend enum
    const stanceMap: Record<string, string> = {
      for: "support",
      against: "oppose",
      random: "random",
    };

    const payload: DebatePayload = {
      challengeId,
      content,
      stance: stanceMap[stance] || stance,
      stage: "SPEAKING",
      text: questionText,
      instructions,
      points,
      timeLimit: timeMinutes * 60 + timeSeconds,
      maxAttempts,
    };

    if (existingQuestion) {
      updateMutation.mutate(
        {
          endpoint: "/questions/debate",
          questionId: existingQuestion.id,
          data: payload,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Debate question updated successfully",
              variant: "default",
            });
            if (onSuccess) onSuccess();
          },
          onError: (error) => {
            if (isAxiosError(error)) {
              toast({
                title: "Error",
                description:
                  error.response?.data?.message || "Failed to update question",
                variant: "destructive",
              });
            }
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          endpoint: "/questions/create/debate",
          data: payload,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Debate question created successfully",
              variant: "default",
            });
            if (onSuccess) onSuccess();
          },
          onError: (error) => {
            if (isAxiosError(error)) {
              toast({
                title: "Error",
                description:
                  error.response?.data?.message || "Failed to create question",
                variant: "destructive",
              });
            }
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {existingQuestion ? "Edit Debate Question" : "Create Debate Question"}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="text-gray-600"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="bg-[#44b07f] hover:bg-[#3a966b] text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {existingQuestion ? "Update Question" : "Save Question"}
              </>
            )}
          </Button>
        </div>
      </div>

      <Debate
        question={questionText}
        instructions={instructions}
        content={content}
        answer={(stance as "for") || "against" || "random" || undefined}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onContentChange={setContent}
        onAnswerChange={setStance}
        onPointsChange={setPoints}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
      />
    </div>
  );
}
