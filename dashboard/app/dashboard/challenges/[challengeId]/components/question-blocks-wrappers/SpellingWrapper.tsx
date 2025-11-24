"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import Spelling from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/Spelling";
import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import { useCreateQuestion, useUpdateQuestion } from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection";
import { SpellingQuestion } from "./types";

interface SpellingWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function SpellingWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: SpellingWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData } = useQuestion(existingQuestion?.id);
  

  // Cast existingQuestion to SpellingQuestion for type safety
  const spellingQuestion = (freshQuestionData || existingQuestion) as SpellingQuestion | undefined;

  // State
  const [questionText, setQuestionText] = useState(
    spellingQuestion?.question || ""
  );
  const [instructions, setInstructions] = useState(
    spellingQuestion?.instructions || ""
  );
  const [correctWord, setCorrectWord] = useState(
    spellingQuestion?.correctAnswer || ""
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState(spellingQuestion?.points || 0);

  const initialTime = spellingQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    spellingQuestion?.maxAttempts || 1
  );

  // Mutation
  
      return response.data;

    onSuccess: () => {
      toast({
        title: "Success",
        description: "Spelling question created successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();

    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error creating question:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create question",
        variant: "destructive",
      });

  });

  
      return response.data;

    onSuccess: () => {
      toast({
        title: "Success",
        description: "Spelling question updated successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();

    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error updating question:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update question",
        variant: "destructive",
      });

  });

  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSave = () => {
    if (!challengeId) {
      toast({
        title: "Error",
        description: "Challenge ID is missing",
        variant: "destructive",
      });
      return;
    }

    if (!existingQuestion && !imageFile) {
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
    if (imageFile) {
      formData.append("media", imageFile);
    }
    formData.append("answer", correctWord);

    if (questionText) formData.append("text", questionText);
    if (instructions) formData.append("instructions", instructions);

    const totalSeconds = timeMinutes * 60 + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }

    formData.append("points", points.toString());
    formData.append("maxAttempts", maxAttempts.toString());

    if (existingQuestion) {
      updateQuestionMutation.mutate({ id: existingQuestion.id, formData });
    } else {
      createMutation.mutate(
        {
          endpoint: "/questions/create/spelling",
          data: formData,
          challengeId,

        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Spelling question created successfully",
              variant: "default",
            });
            if (onSuccess) onSuccess();

          onError: (error: any) => {
            toast({
              title: "Error",
              description:
                error.response?.data?.message || "Failed to create question",
              variant: "destructive",
            });

        }
      );
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {existingQuestion
            ? "Edit Spelling Question"
            : "Create Spelling Question"}
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
