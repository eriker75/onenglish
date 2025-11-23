"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import Tenses from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/Tenses";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection";

interface TensesWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function TensesWrapper({ existingQuestion, onCancel, onSuccess }: TensesWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  const [questionText, setQuestionText] = useState(existingQuestion?.question || "");
  const [instructions, setInstructions] = useState((existingQuestion as any)?.instructions || "");
  const [sentence, setSentence] = useState((existingQuestion as any)?.content || "");
  const [options, setOptions] = useState<string[]>((existingQuestion as any)?.options || []);
  const [correctAnswer, setCorrectAnswer] = useState((existingQuestion as any)?.answer || "");
  const [points, setPoints] = useState((existingQuestion as any)?.points || 0);
  
  const initialTime = (existingQuestion as any)?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState((existingQuestion as any)?.maxAttempts || 1);

  useEffect(() => {
    if (existingQuestion) {
      setQuestionText(existingQuestion.question || "");
      setInstructions((existingQuestion as any)?.instructions || "");
      setSentence((existingQuestion as any)?.content || "");
      setOptions((existingQuestion as any)?.options || []);
      setCorrectAnswer((existingQuestion as any)?.answer || "");
      setPoints((existingQuestion as any)?.points || 0);
      
      const time = (existingQuestion as any)?.timeLimit || 0;
      setTimeMinutes(Math.floor(time / 60));
      setTimeSeconds(time % 60);
      setMaxAttempts((existingQuestion as any)?.maxAttempts || 1);
    }
  }, [existingQuestion]);

  const createQuestionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/questions/create/tenses", data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tenses question created successfully",
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
      const response = await api.patch(`/questions/tenses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tenses question updated successfully",
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
      timeLimit: (timeMinutes * 60) + timeSeconds,
      maxAttempts,
      stage: "GRAMMAR"
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
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" />{existingQuestion ? "Update Question" : "Save Question"}</>
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
