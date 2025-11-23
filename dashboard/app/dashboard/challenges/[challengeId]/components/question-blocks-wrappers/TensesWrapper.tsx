"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import Tenses from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/Tenses";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TensesWrapper() {
  const { toast } = useToast();
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  const [questionText, setQuestionText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [sentence, setSentence] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [points, setPoints] = useState(0);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(1);

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

    createQuestionMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Create Tenses Question</h2>
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

