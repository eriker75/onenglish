"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import TagIt from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/TagIt";
import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagItQuestion } from "./types";
import type { Question } from "../types";
import { isAxiosError } from "axios";

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
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData, refetch: refetchQuestion } = useQuestion(existingQuestion?.id);

  // Cast existingQuestion to TagItQuestion for type safety
  const tagItQuestion = (freshQuestionData || existingQuestion) as
    | TagItQuestion
    | undefined;

  const [questionText, setQuestionText] = useState(
    existingQuestion?.text || tagItQuestion?.question || ""
  );
  const [instructions, setInstructions] = useState(
    tagItQuestion?.instructions || ""
  );
  const [content, setContent] = useState<string[]>(
    tagItQuestion?.content || []
  );
  const [answer, setAnswer] = useState<string[]>(tagItQuestion?.answer || [""]);
  const [imageUrl, setImageUrl] = useState<string | null>(
    tagItQuestion?.image || tagItQuestion?.mediaUrl || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState(tagItQuestion?.points || 0);

  const initialTime = tagItQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    tagItQuestion?.maxAttempts || 1
  );

  // Sync state with fresh question data
  useEffect(() => {
    if (freshQuestionData) {
      const question = freshQuestionData as TagItQuestion;
      setQuestionText(question.text || question.question || "");
      setInstructions(question.instructions || "");
      setContent(question.content || []);
      setAnswer(question.answer || [""]);
      setImageUrl(question.image || question.mediaUrl || null);
      setPoints(question.points || 0);
      const time = question.timeLimit || 0;
      setTimeMinutes(Math.floor(time / 60));
      setTimeSeconds(time % 60);
      setMaxAttempts(question.maxAttempts || 1);
    }
  }, [freshQuestionData]);

  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Helper function to convert image URL to File
  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const absoluteUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    try {
      const response = await fetch(absoluteUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText} for URL: ${absoluteUrl}`);
      }
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type || 'image/png' });
    } catch (error) {
      console.error(`Error converting URL to File for ${absoluteUrl}:`, error);
      throw error;
    }
  };

  const handleSave = async () => {
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

    // Handle image: use "image" field name (not "media") to match backend DTO
    if (existingQuestion) {
      // When updating, send new file if available, otherwise preserve existing image
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imageUrl && imageUrl.trim() !== "") {
        // Existing image that wasn't changed - convert URL to File to preserve it
        try {
          const urlParts = imageUrl.split('/');
          const filename = urlParts[urlParts.length - 1] || 'image.png';
          const file = await urlToFile(imageUrl, filename);
          formData.append("image", file);
        } catch (error) {
          console.error('Failed to convert image URL to file:', error);
          toast({
            title: "Warning",
            description: "Failed to preserve existing image. Please re-upload it if needed.",
            variant: "destructive",
          });
        }
      }
      // If neither file nor URL, don't send image (image will be removed)
    } else {
      // For creating, only send if there's a file
      if (imageFile) {
        formData.append("image", imageFile);
      }
    }

    const totalSeconds = timeMinutes * 60 + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }

    formData.append("points", points.toString());
    formData.append("maxAttempts", maxAttempts.toString());
    formData.append("stage", "GRAMMAR");

    if (existingQuestion) {
      updateMutation.mutate({
        endpoint: "/questions/tag_it",
        questionId: existingQuestion.id,
        data: formData,
        challengeId,
      },
        {
          onSuccess: async (data) => {
            if (data) {
              const question = data as TagItQuestion;
              setQuestionText(question.text || question.question || "");
              setInstructions(question.instructions || "");
              setContent(question.content || []);
              setAnswer(question.answer || [""]);
              setImageUrl(question.image || question.mediaUrl || null);
              setPoints(question.points || 0);
              const time = question.timeLimit || 0;
              setTimeMinutes(Math.floor(time / 60));
              setTimeSeconds(time % 60);
              setMaxAttempts(question.maxAttempts || 1);
              setImageFile(null);
            }
            if (existingQuestion?.id) {
              await refetchQuestion();
            }
            toast({
              title: "Success",
              description: "Question updated successfully",
              variant: "default",
            });
            if (onSuccess) onSuccess();
          },
          onError: (error) => {
            if (isAxiosError(error)) {
              toast({
                title: "Error",
                description:
                  error.response?.data?.message || "Failed to update question",
                variant: "destructive",
              });
            }
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          endpoint: "/questions/create/tag_it",
          data: formData,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "TagIt question created successfully",
              variant: "default",
            });
            if (onSuccess) onSuccess();
          },
          onError: (error) => {
            if (isAxiosError(error)) {
              toast({
                title: "Error",
                description:
                  error.response?.data?.message || "Failed to create question",
                variant: "destructive",
              });
            }
          },
        }
      );
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
        imageUrl={imageUrl || undefined}
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
