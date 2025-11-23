"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import Debate from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/Debate";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DebateWrapperProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function DebateWrapper({ onCancel, onSuccess }: DebateWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  const [questionText, setQuestionText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stance, setStance] = useState<string>("random");
  const [points, setPoints] = useState(0);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(1);

  const createQuestionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/questions/create/debate", data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Debate question created successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create question",
        variant: "destructive",
      });
    },
  });

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
      "for": "support",
      "against": "oppose",
      "random": "random"
    };

    const payload = {
      challengeId,
      content,
      stance: stanceMap[stance] || stance,
      stage: "SPEAKING",
      text: questionText,
      instructions,
      points,
      timeLimit: (timeMinutes * 60) + timeSeconds,
      maxAttempts,
    };

    createQuestionMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Create Debate Question</h2>
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
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" />Save Question</>
            )}
          </Button>
        </div>
      </div>

      <Debate
        question={questionText}
        instructions={instructions}
        content={content}
        answer={stance === "for" || stance === "against" || stance === "random" ? stance : undefined}
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
