"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import TagIt from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/TagIt";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection";
import { TagItQuestion } from "./types";

interface TagItWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function TagItWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: TagItWrapperProps) {
  const { toast } = useToast();
  // Cast existingQuestion to TagItQuestion for type safety
  const tagItQuestion = existingQuestion as TagItQuestion | undefined;
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  const [questionText, setQuestionText] = useState(
    existingQuestion?.question || ""
  );
  const [instructions, setInstructions] = useState(
    tagItQuestion?.instructions || ""
  );
  const [content, setContent] = useState<string[]>(
    tagItQuestion?.content || []
  );
  const [answer, setAnswer] = useState<string[]>(tagItQuestion?.answer || [""]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState(tagItQuestion?.points || 0);

  const initialTime = tagItQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    tagItQuestion?.maxAttempts || 1
  );

  const createQuestionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/questions/create/tag_it", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tag question created successfully",
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
      const response = await api.patch(`/questions/tag_it/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tag question updated successfully",
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

    if (content.length < 2) {
      toast({
        title: "Error",
        description: "Please provide a sentence with a tag gap (___)",
        variant: "destructive",
      });
      return;
    }

    const validAnswers = answer.filter((a) => a.trim() !== "");
    if (validAnswers.length === 0) {
      toast({
        title: "Error",
        description: "Please provide at least one valid answer",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("challengeId", challengeId);
    formData.append("text", questionText);
    formData.append("instructions", instructions);

    content.forEach((part) => formData.append("content[]", part));
    validAnswers.forEach((ans) => formData.append("answer[]", ans));

    if (imageFile) {
      formData.append("media", imageFile);
    }

    const totalSeconds = timeMinutes * 60 + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }

    formData.append("points", points.toString());
    formData.append("maxAttempts", maxAttempts.toString());
    formData.append("stage", "GRAMMAR");

    if (tagItQuestion) {
      updateQuestionMutation.mutate({ id: existingQuestion.id, formData });
    } else {
      createQuestionMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {existingQuestion ? "Edit Tag It Question" : "Create Tag It Question"}
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

      <TagIt
        question={questionText}
        instructions={instructions}
        content={content}
        answer={answer}
        imageUrl={imageUrl ?? undefined}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onContentChange={setContent}
        onAnswerChange={setAnswer}
        onImageChange={setImageUrl}
        onFileChange={setImageFile}
        onPointsChange={setPoints}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
      />
    </div>
  );
}
