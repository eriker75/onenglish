"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import SentenceMaker from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/SentenceMaker";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SentenceMakerWrapper() {
  const { toast } = useToast();
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  const [questionText, setQuestionText] = useState(""); // Question from SentenceMaker (actually "Question" label)
  const [instructions, setInstructions] = useState("");
  const [userQuestionText, setUserQuestionText] = useState(""); // "Question Text" or "Question" in component? Component has "question" prop and "questionText" prop.
  // "question" prop maps to "Question *" input (questionValue).
  // "questionText" prop maps to... wait, SentenceMaker has `questionText` prop but it's not used in the UI?
  // Let's re-check SentenceMaker.tsx.
  // It has `question` (state questionValue) -> "Question *"
  // It has `questionText` (state questionText) -> Not used in JSX? 
  // It defines `handleQuestionTextChange` but it's not attached to any input?
  // It seems `questionText` prop is unused in SentenceMaker.tsx.
  // I will rely on `question` (questionValue) as the main text.
  
  const [images, setImages] = useState<string[]>(["", ""]); // Preview URLs
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null]); // Files
  const [points, setPoints] = useState(0);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(1);

  const createQuestionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/questions/create/sentence_maker", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Sentence maker question created successfully",
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

    // Check if at least one image is uploaded (DTO says ArrayMinSize(1))
    const validFiles = imageFiles.filter(f => f !== null);
    if (validFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("challengeId", challengeId);
    formData.append("text", questionText);
    formData.append("instructions", instructions);
    
    validFiles.forEach(file => {
      if (file) formData.append("media[]", file); // Use media[] for array
    });

    const totalSeconds = (timeMinutes * 60) + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }
    
    formData.append("points", points.toString());
    formData.append("maxAttempts", maxAttempts.toString());
    formData.append("stage", "WRITING");

    createQuestionMutation.mutate(formData);
  };

  const handleImageFilesChange = (index: number, file: File | null) => {
    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Create Sentence Maker Question</h2>
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

      <SentenceMaker
        question={questionText}
        instructions={instructions}
        images={images}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onImagesChange={setImages}
        onImageFilesChange={handleImageFilesChange}
        onPointsChange={setPoints}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
      />
    </div>
  );
}

