"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import WordBox from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/WordBox";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WordBoxWrapperProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function WordBoxWrapper({ onCancel, onSuccess }: WordBoxWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  // State
  const [questionText, setQuestionText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [maxWords, setMaxWords] = useState(5);
  const [gridWidth, setGridWidth] = useState(3);
  const [gridHeight, setGridHeight] = useState(3);
  const [grid, setGrid] = useState<string[][]>(
    Array(3).fill(null).map(() => Array(3).fill(""))
  );
  const [points, setPoints] = useState(0);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(1);

  // Mutation
  const createQuestionMutation = useMutation({
    mutationFn: async (data: any) => {
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
        description: error.response?.data?.message || "Failed to create question",
        variant: "destructive",
      });
    },
  });

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
    const hasContent = grid.some(row => row.some(cell => cell.trim() !== ""));
    if (!hasContent) {
      toast({
        title: "Error",
        description: "Grid cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const totalSeconds = (timeMinutes * 60) + timeSeconds;
    
    const data = {
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

    createQuestionMutation.mutate(data);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Create WordBox Question
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
            disabled={createQuestionMutation.isPending}
            className="bg-[#44b07f] hover:bg-[#3a966b] text-white"
          >
            {createQuestionMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Question
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
