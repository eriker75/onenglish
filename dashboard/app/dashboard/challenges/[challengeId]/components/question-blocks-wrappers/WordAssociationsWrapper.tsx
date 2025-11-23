"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import WordAssociationsWithText from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/WordAssociationsWithText";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection";
import { WordAssociationsQuestion } from "./types";

interface WordAssociationsWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function WordAssociationsWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: WordAssociationsWrapperProps) {
  const { toast } = useToast();
  // Cast existingQuestion to WordAssociationsQuestion for type safety
  const wordAssociationsQuestion = existingQuestion as
    | WordAssociationsQuestion
    | undefined;
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  // State
  const [questionText, setQuestionText] = useState(
    existingQuestion?.question || ""
  );
  const [instructions, setInstructions] = useState(
    wordAssociationsQuestion?.instructions || ""
  );
  const [referenceWord, setReferenceWord] = useState(
    wordAssociationsQuestion?.content || ""
  );
  const [maxAssociations, setMaxAssociations] = useState(
    wordAssociationsQuestion?.maxAssociations || 3
  );
  const [imageUrl, setImageUrl] = useState<string | null>(
    wordAssociationsQuestion?.mediaUrl || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState(wordAssociationsQuestion?.points || 0);

  const initialTime = wordAssociationsQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    wordAssociationsQuestion?.maxAttempts || 1
  );

  // Mutation
  const createQuestionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post(
        "/questions/create/word_associations",
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
        description: "Word Associations question created successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error creating question:", error);
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
        `/questions/word_associations/${id}`,
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
        description: "Word Associations question updated successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error updating question:", error);
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

    if (!referenceWord) {
      toast({
        title: "Error",
        description: "Please enter a reference word",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("challengeId", challengeId);
    formData.append("content", referenceWord);
    formData.append("maxAssociations", maxAssociations.toString());
    formData.append("points", points.toString());

    if (imageFile) {
      formData.append("media", imageFile);
    }

    if (questionText) formData.append("text", questionText);
    if (instructions) formData.append("instructions", instructions);

    const totalSeconds = timeMinutes * 60 + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }

    formData.append("maxAttempts", maxAttempts.toString());

    if (wordAssociationsQuestion) {
      updateQuestionMutation.mutate({ id: existingQuestion.id, formData });
    } else {
      createQuestionMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {existingQuestion
            ? "Edit Word Associations Question"
            : "Create Word Associations Question"}
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

      <WordAssociationsWithText
        question={questionText}
        instructions={instructions}
        referenceWord={referenceWord}
        maxAssociations={maxAssociations}
        imageUrl={imageUrl || undefined}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onReferenceWordChange={setReferenceWord}
        onMaxAssociationsChange={setMaxAssociations}
        onFileChange={setImageFile}
        onPointsChange={setPoints}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
      />
    </div>
  );
}
