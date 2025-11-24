"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import WordBox from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/WordBox";
import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Question } from "../types";
import { WordBoxQuestion, WordBoxPayload } from "./types";
import { isAxiosError } from "axios";

interface WordBoxWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function WordBoxWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: WordBoxWrapperProps) {
  const { toast } = useToast();

  // Get challengeId from UI store (source of truth for UI state)
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // 🆕 Fetch fresh data when editing (optional - use if you want latest data)
  const { data: freshQuestionData } = useQuestion(
    existingQuestion?.id // Only fetch if editing
  );

  // Use fresh data if available, otherwise use prop data
  const wordBoxQuestion = (freshQuestionData || existingQuestion) as
    | WordBoxQuestion
    | undefined;

  // Initialize State with question data or defaults
  const [questionText, setQuestionText] = useState(
    wordBoxQuestion?.text || Question?.question || ""
  );
  const [instructions, setInstructions] = useState(
    wordBoxQuestion?.instructions || ""
  );
  const [maxWords, setMaxWords] = useState(wordBoxQuestion?.maxWords || 5);
  const [gridWidth, setGridWidth] = useState(wordBoxQuestion?.gridWidth || 3);
  const [gridHeight, setGridHeight] = useState(
    wordBoxQuestion?.gridHeight || 3
  );
  const [grid, setGrid] = useState<string[][]>(
    wordBoxQuestion?.content ||
      Array(3)
        .fill(null)
        .map(() => Array(3).fill(""))
  );
  const [points, setPoints] = useState(wordBoxQuestion?.points || 0);

  // Calculate initial time values
  const initialTime = wordBoxQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    wordBoxQuestion?.maxAttempts || 1
  );

  // 🆕 Use generic mutations with auto cache invalidation
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

    // Validate grid content
    const hasContent = grid.some((row) =>
      row.some((cell) => cell.trim() !== "")
    );
    if (!hasContent) {
      toast({
        title: "Error",
        description: "Grid cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const totalSeconds = timeMinutes * 60 + timeSeconds;

    const payload: WordBoxPayload = {
      challengeId,
      gridWidth,
      gridHeight,
      maxWords,
      content: grid,
      points,
      timeLimit: totalSeconds > 0 ? totalSeconds : undefined,
      maxAttempts,
      text: questionText || undefined,
      instructions: instructions || undefined,
    };

    if (existingQuestion) {
      // 🆕 Update with generic mutation
      updateMutation.mutate(
        {
          endpoint: "/questions/wordbox",
          questionId: existingQuestion.id,
          data: payload,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "WordBox question updated successfully",
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
      // 🆕 Create with generic mutation
      createMutation.mutate(
        {
          endpoint: "/questions/create/wordbox",
          data: payload,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "WordBox question created successfully",
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
          {existingQuestion
            ? "Edit WordBox Question"
            : "Create WordBox Question"}
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

      <WordBox
        question={questionText}
        instructions={instructions}
        maxWords={maxWords}
        width={gridWidth}
        height={gridHeight}
        grid={grid}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onMaxWordsChange={setMaxWords}
        onWidthChange={setGridWidth}
        onHeightChange={setGridHeight}
        onGridChange={setGrid}
        onPointsChange={setPoints}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
      />
    </div>
  );
}
