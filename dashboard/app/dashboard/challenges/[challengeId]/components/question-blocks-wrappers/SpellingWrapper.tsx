"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import Spelling from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/Spelling";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SpellingWrapper() {
  const { toast } = useToast();
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  // State
  const [questionText, setQuestionText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [correctWord, setCorrectWord] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState(0);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(1);

  // Mutation
  const createQuestionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/questions/create/spelling", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Spelling question created successfully",
        variant: "default",
      });
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

    if (!imageFile) {
      toast({
        title: "Error",
        description: "Please upload an image",
        variant: "destructive",
      });
      return;
    }

    if (!correctWord) {
      toast({
        title: "Error",
        description: "Please enter the correct word",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("challengeId", challengeId);
    formData.append("media", imageFile);
    formData.append("answer", correctWord);
    
    if (questionText) formData.append("text", questionText);
    if (instructions) formData.append("instructions", instructions);
    
    const totalSeconds = (timeMinutes * 60) + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }
    
    formData.append("points", points.toString());
    formData.append("maxAttempts", maxAttempts.toString());

    createQuestionMutation.mutate(formData);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Create Spelling Question
        </h2>
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

      <Spelling
        question={questionText}
        instructions={instructions}
        correctWord={correctWord}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onCorrectWordChange={setCorrectWord}
        onFileChange={setImageFile}
        onPointsChange={setPoints}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
      />
    </div>
  );
}

