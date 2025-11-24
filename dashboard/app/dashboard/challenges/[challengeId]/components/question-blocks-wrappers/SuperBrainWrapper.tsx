"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import SuperBrain from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/SuperBrain";
import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuperBrainQuestion } from "./types";
import type { Question } from "../types";
import { isAxiosError } from "axios";

interface SuperBrainWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function SuperBrainWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: SuperBrainWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData, refetch: refetchQuestion } = useQuestion(existingQuestion?.id);

  // Cast existingQuestion to SuperBrainQuestion for type safety
  const superBrainQuestion = (freshQuestionData || existingQuestion) as
    | SuperBrainQuestion
    | undefined;

  const [questionText, setQuestionText] = useState(
    superBrainQuestion?.text || ""
  );
  const [instructions, setInstructions] = useState(
    superBrainQuestion?.instructions || ""
  );
  const [content, setContent] = useState(superBrainQuestion?.content || "");
  const [imageUrl, setImageUrl] = useState<string | null>(
    superBrainQuestion?.image || superBrainQuestion?.mediaUrl || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // Not used for upload currently
  const [points, setPoints] = useState(superBrainQuestion?.points || 0);

  const initialTime = superBrainQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    superBrainQuestion?.maxAttempts || 1
  );

  // Update state when freshQuestionData arrives
  useEffect(() => {
    if (freshQuestionData) {
      const question = freshQuestionData as SuperBrainQuestion;
      setQuestionText(question.text || "");
      setInstructions(question.instructions || "");
      setContent(question.content || "");
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

    // Handle image file - for updates, preserve existing if no new file is provided
    // Backend expects 'image' field, not 'media'
    if (existingQuestion) {
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imageUrl && imageUrl.trim() !== "") {
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
    } else {
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
    formData.append("stage", "SPEAKING");

    if (existingQuestion) {
      updateMutation.mutate({
        endpoint: "/questions/superbrain",
        questionId: existingQuestion.id,
        data: formData,
        challengeId,
      },
        {
          onSuccess: async (data) => {
            // Update state from response
            if (data) {
              const question = data as SuperBrainQuestion;
              setQuestionText(question.text || "");
              setInstructions(question.instructions || "");
              setContent(question.content || "");
              setImageUrl(question.image || question.mediaUrl || null);
              setPoints(question.points || 0);
              const time = question.timeLimit || 0;
              setTimeMinutes(Math.floor(time / 60));
              setTimeSeconds(time % 60);
              setMaxAttempts(question.maxAttempts || 1);
              setImageFile(null);
            }
            // Also refetch to ensure cache is updated
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
          endpoint: "/questions/create/superbrain",
          data: formData,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "SuperBrain question created successfully",
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
          {existingQuestion
            ? "Edit SuperBrain Question"
            : "Create SuperBrain Question"}
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

      <SuperBrain
        question={questionText}
        instructions={instructions}
        content={content}
        imageUrl={imageUrl || undefined}
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
