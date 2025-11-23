"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import TopicBasedAudio from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/TopicBasedAudio";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  points?: number;
}

interface TopicBasedAudioWrapperProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function TopicBasedAudioWrapper({ onCancel, onSuccess }: TopicBasedAudioWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  // State
  const [questionText, setQuestionText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [subQuestions, setSubQuestions] = useState<SubQuestion[]>([]);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(1);

  // Mutation
  const createQuestionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/questions/create/topic_based_audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Topic Based Audio question created successfully",
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

    if (!audioFile) {
      toast({
        title: "Error",
        description: "Please upload an audio file",
        variant: "destructive",
      });
      return;
    }

    if (subQuestions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one sub-question",
        variant: "destructive",
      });
      return;
    }

    // Validate sub-questions
    for (const q of subQuestions) {
      if (!q.text || !q.correctAnswer || q.options.some((opt) => !opt)) {
        toast({
          title: "Error",
          description: "Please fill in all fields for sub-questions",
          variant: "destructive",
        });
        return;
      }
    }

    const formData = new FormData();
    formData.append("challengeId", challengeId);
    formData.append("media", audioFile);
    
    // Format sub-questions for backend
    const formattedSubQuestions = subQuestions.map((q) => ({
      text: q.text,
      points: q.points || 0,
      options: q.options,
      answer: q.correctAnswer,
    }));

    formData.append("subQuestions", JSON.stringify(formattedSubQuestions));
    
    formData.append("content", questionText); 
    if (instructions) {
       formData.append("instructions", instructions);
    }
    
    // Time calculation
    const totalSeconds = (timeMinutes * 60) + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }
    
    formData.append("maxAttempts", maxAttempts.toString());

    createQuestionMutation.mutate(formData);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Create Topic Based Audio Question
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
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" />Save Question</>
            )}
          </Button>
        </div>
      </div>

      <TopicBasedAudio
        question={questionText}
        instructions={instructions}
        questions={subQuestions}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onAudioFileChange={setAudioFile}
        onQuestionsChange={setSubQuestions}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
      />
    </div>
  );
}
