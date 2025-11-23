"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import SuperBrain from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/SuperBrain";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection";
import { SuperBrainQuestion } from "./types";

interface SuperBrainWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function SuperBrainWrapper({ existingQuestion, onCancel, onSuccess }: SuperBrainWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  // Cast existingQuestion to SuperBrainQuestion for type safety
  const superBrainQuestion = existingQuestion as SuperBrainQuestion | undefined;

  const [questionText, setQuestionText] = useState(existingQuestion?.question || "");
  const [instructions, setInstructions] = useState(superBrainQuestion?.instructions || "");
  const [content, setContent] = useState(superBrainQuestion?.content || "");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // Not used for upload currently
  const [points, setPoints] = useState(superBrainQuestion?.points || 0);
  
  const initialTime = superBrainQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(superBrainQuestion?.maxAttempts || 1);

  const createQuestionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/questions/create/superbrain", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "SuperBrain question created successfully",
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
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await api.patch(`/questions/superbrain/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "SuperBrain question updated successfully",
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

    if (!content) {
      toast({
        title: "Error",
        description: "Please provide a sentence/prompt",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("challengeId", challengeId);
    formData.append("text", questionText);
    formData.append("instructions", instructions);
    formData.append("content", content);
    
    if (imageFile) {
      formData.append("media", imageFile);
    }

    const totalSeconds = (timeMinutes * 60) + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }
    
    formData.append("points", points.toString());
    formData.append("maxAttempts", maxAttempts.toString());
    formData.append("stage", "SPEAKING");

    if (superBrainQuestion) {
      updateQuestionMutation.mutate({ id: existingQuestion.id, formData });
    } else {
      createQuestionMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {existingQuestion ? "Edit SuperBrain Question" : "Create SuperBrain Question"}
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

      <SuperBrain
        question={questionText}
        instructions={instructions}
        content={content}
        imageUrl={imageUrl ?? undefined}
        audioUrl={audioUrl ?? undefined}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onContentChange={setContent}
        onImageChange={setImageUrl}
        onFileChange={setImageFile}
        onAudioChange={setAudioUrl}
        onPointsChange={setPoints}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
      />
    </div>
  );
}
