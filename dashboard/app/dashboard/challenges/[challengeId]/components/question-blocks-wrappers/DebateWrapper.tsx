"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import Debate from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/Debate";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection";

interface DebateWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function DebateWrapper({ existingQuestion, onCancel, onSuccess }: DebateWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  const [questionText, setQuestionText] = useState(existingQuestion?.question || "");
  const [instructions, setInstructions] = useState((existingQuestion as any)?.instructions || "");
  const [content, setContent] = useState((existingQuestion as any)?.content || "");
  const [stance, setStance] = useState<string>((existingQuestion as any)?.stance || "random");
  const [points, setPoints] = useState((existingQuestion as any)?.points || 0);
  
  const initialTime = (existingQuestion as any)?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState((existingQuestion as any)?.maxAttempts || 1);

  useEffect(() => {
    if (existingQuestion) {
      setQuestionText(existingQuestion.question || "");
      setInstructions((existingQuestion as any).instructions || "");
      setContent((existingQuestion as any).content || "");
      
      // Map backend stance to UI if needed, but it seems random/support/oppose maps directly or via UI logic
      let s = (existingQuestion as any).stance || "random";
      if (s === "support") s = "for";
      if (s === "oppose") s = "against";
      setStance(s);

      setPoints((existingQuestion as any).points || 0);
      const time = (existingQuestion as any).timeLimit || 0;
      setTimeMinutes(Math.floor(time / 60));
      setTimeSeconds(time % 60);
      setMaxAttempts((existingQuestion as any).maxAttempts || 1);
    }
  }, [existingQuestion]);

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

  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.patch(`/questions/debate/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Debate question updated successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update question",
        variant: "destructive",
      });
    },
  });

  const isPending = createQuestionMutation.isPending || updateQuestionMutation.isPending;

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
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" />{existingQuestion ? "Update Question" : "Save Question"}</>
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
