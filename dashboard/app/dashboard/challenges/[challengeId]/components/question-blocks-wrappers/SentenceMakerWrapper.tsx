"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import SentenceMaker from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/SentenceMaker";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection";
import { SentenceMakerQuestion } from "./types";

interface SentenceMakerWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function SentenceMakerWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: SentenceMakerWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  // Cast existingQuestion to SentenceMakerQuestion for type safety
  const sentenceMakerQuestion = existingQuestion as
    | SentenceMakerQuestion
    | undefined;

  const [questionText, setQuestionText] = useState(
    existingQuestion?.question || ""
  );
  const [instructions, setInstructions] = useState(
    sentenceMakerQuestion?.instructions || ""
  );

  const [images, setImages] = useState<string[]>(["", ""]);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null]);
  const [points, setPoints] = useState(sentenceMakerQuestion?.points || 0);

  const initialTime = sentenceMakerQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    sentenceMakerQuestion?.maxAttempts || 1
  );

  const createQuestionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post(
        "/questions/create/sentence_maker",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Sentence maker question created successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create question",
        variant: "destructive",
      });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const response = await api.patch(
        `/questions/sentence_maker/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Sentence maker question updated successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update question",
        variant: "destructive",
      });
    },
  });

  const isPending =
    createQuestionMutation.isPending || updateQuestionMutation.isPending;

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
    // If editing, we might not upload new images, so check if we have files OR existing images (if we handled them).
    // For simplicity, if creating, require files. If updating, only send if files exist.
    const validFiles = imageFiles.filter((f) => f !== null);

    if (!existingQuestion && validFiles.length === 0) {
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

    validFiles.forEach((file) => {
      if (file) formData.append("media[]", file); // Use media[] for array
    });

    const totalSeconds = timeMinutes * 60 + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }

    formData.append("points", points.toString());
    formData.append("maxAttempts", maxAttempts.toString());
    formData.append("stage", "WRITING");

    if (sentenceMakerQuestion) {
      updateQuestionMutation.mutate({ id: existingQuestion.id, formData });
    } else {
      createQuestionMutation.mutate(formData);
    }
  };

  const handleImageFilesChange = (index: number, file: File | null) => {
    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {existingQuestion
            ? "Edit Sentence Maker Question"
            : "Create Sentence Maker Question"}
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
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {existingQuestion ? "Update Question" : "Save Question"}
              </>
            )}
          </Button>
        </div>
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
