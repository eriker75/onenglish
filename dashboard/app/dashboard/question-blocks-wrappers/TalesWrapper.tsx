"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import Tales from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/Tales";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TalesWrapper() {
  const { toast } = useToast();
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  const [questionText, setQuestionText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [exampleStory, setExampleStory] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Preview
  const [imageFile, setImageFile] = useState<File | null>(null); // File
  const [points, setPoints] = useState(0);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(1);

  const createQuestionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/questions/create/tales", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tales question created successfully",
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

    if (!imageFile) {
      toast({
        title: "Error",
        description: "Please upload an image",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("challengeId", challengeId);
    formData.append("text", questionText);
    
    // Append example story to instructions if present
    let finalInstructions = instructions;
    if (exampleStory) {
      finalInstructions += `\n\nExample Story:\n${exampleStory}`;
    }
    formData.append("instructions", finalInstructions);
    
    // Tales DTO expects 'media' as array of files.
    formData.append("media[]", imageFile);

    const totalSeconds = (timeMinutes * 60) + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }
    
    formData.append("points", points.toString());
    formData.append("maxAttempts", maxAttempts.toString());
    formData.append("stage", "WRITING");

    createQuestionMutation.mutate(formData);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Create Tales Question</h2>
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

      <Tales
        question={questionText}
        instructions={instructions}
        imageUrl={imageUrl === null ? undefined : imageUrl}
        exampleStory={exampleStory}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onImageChange={setImageUrl}
        onFileChange={setImageFile}
        onExampleStoryChange={setExampleStory}
        onPointsChange={setPoints}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
      />
    </div>
  );
}

