"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import Tenses from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/Tenses";
import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection";
import { TensesQuestion, TensesPayload } from "./types";
import { isAxiosError } from "axios";

interface TensesWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function TensesWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: TensesWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData } = useQuestion(existingQuestion?.id);

  // Cast existingQuestion to TensesQuestion for type safety
  const tensesQuestion = (freshQuestionData || existingQuestion) as
    | TensesQuestion
    | undefined;

  const [questionText, setQuestionText] = useState(
    tensesQuestion?.question || ""
  );
  const [instructions, setInstructions] = useState(
    tensesQuestion?.instructions || ""
  );
  const [sentence, setSentence] = useState(tensesQuestion?.content || "");
  const [options, setOptions] = useState<string[]>(
    tensesQuestion?.options || []
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    tensesQuestion?.answer || ""
  );
  const [points, setPoints] = useState(tensesQuestion?.points || 0);

  const initialTime = tensesQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    tensesQuestion?.maxAttempts || 1
  );

  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSave = () => {
    if (!challengeId) {
      toast({
        title: "Error",
        description: "Challenge ID is missing",
        variant: "destructive",
      });
      return;
    }

    if (!sentence) {
      toast({
        title: "Error",
        description: "Please provide a sentence",
        variant: "destructive",
      });
      return;
    }

    if (options.length < 2) {
      toast({
        title: "Error",
        description: "Please select at least 2 options",
        variant: "destructive",
      });
      return;
    }

    if (!correctAnswer) {
      toast({
        title: "Error",
        description: "Please select a correct answer",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      challengeId,
      text: questionText,
      instructions,
      content: sentence,
      options: options,
      answer: correctAnswer,
      points,
      timeLimit: timeMinutes * 60 + timeSeconds,
      maxAttempts,
      stage: "GRAMMAR",
    };

    if (existingQuestion) {
      updateMutation.mutate(
        {
          endpoint: "/questions/tenses",
          questionId: existingQuestion.id,
          data: payload,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Tenses question updated successfully",
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
          endpoint: "/questions/create/tenses",
          data: payload,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Tenses question created successfully",
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
          {existingQuestion ? "Edit Tenses Question" : "Create Tenses Question"}
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

      <Tenses
        question={questionText}
        instructions={instructions}
        sentence={sentence}
        correctAnswer={correctAnswer}
        options={options}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onSentenceChange={setSentence}
        onCorrectAnswerChange={setCorrectAnswer}
        onOptionsChange={setOptions}
        onPointsChange={setPoints}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
      />
    </div>
  );
}
