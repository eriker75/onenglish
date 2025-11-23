"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import WordBox from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/WordBox";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection"; // Import Question interface
import { WordBoxQuestion, WordBoxPayload } from "./types";

interface WordBoxWrapperProps {
  existingQuestion?: Question; // Add existingQuestion prop
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function WordBoxWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: WordBoxWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  // Cast existingQuestion to WordBoxQuestion for type safety
  const wordBoxQuestion = existingQuestion as WordBoxQuestion | undefined;

  // Initialize State with existingQuestion data or defaults
  const [questionText, setQuestionText] = useState(
    wordBoxQuestion?.question || ""
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

  // Effect to update state if existingQuestion changes (e.g., switching between questions)
  useEffect(() => {
    if (wordBoxQuestion) {
      setQuestionText(wordBoxQuestion.question || "");
      setInstructions(wordBoxQuestion.instructions || "");
      setMaxWords(wordBoxQuestion.maxWords || 5);
      setGridWidth(wordBoxQuestion.gridWidth || 3);
      setGridHeight(wordBoxQuestion.gridHeight || 3);
      setGrid(
        wordBoxQuestion.content ||
          Array(3)
            .fill(null)
            .map(() => Array(3).fill(""))
      );
      setPoints(wordBoxQuestion.points || 0);
      const time = wordBoxQuestion.timeLimit || 0;
      setTimeMinutes(Math.floor(time / 60));
      setTimeSeconds(time % 60);
      setMaxAttempts(wordBoxQuestion.maxAttempts || 1);
    }
  }, [wordBoxQuestion]);

  // Create Mutation
  const createQuestionMutation = useMutation({
    mutationFn: async (data: WordBoxPayload) => {
      const response = await api.post("/questions/create/wordbox", data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "WordBox question created successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error creating question:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create question",
        variant: "destructive",
      });
    },
  });

  // Update Mutation
  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: WordBoxPayload }) => {
      const response = await api.patch(`/questions/wordbox/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "WordBox question updated successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error updating question:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update question",
        variant: "destructive",
      });
    },
  });

  const isPending =
    createQuestionMutation.isPending || updateQuestionMutation.isPending;

  const handleSave = () => {
    if (!challengeId) {
      toast({
        title: "Error",
        description: "Challenge ID is missing",
        variant: "destructive",
      });
      return;
    }

    // Validate grid content (at least one letter?)
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

    const payload = {
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
      updateQuestionMutation.mutate({ id: existingQuestion.id, data: payload });
    } else {
      createQuestionMutation.mutate(payload);
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
