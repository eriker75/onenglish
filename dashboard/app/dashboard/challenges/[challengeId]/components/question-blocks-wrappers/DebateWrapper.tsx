"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DebateQuestion, DebatePayload } from "./types";
import type { Question } from "../types";
import Debate from "../question-blocks/Debate";
import { isAxiosError } from "axios";

interface DebateWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function DebateWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: DebateWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData, refetch: refetchQuestion } = useQuestion(existingQuestion?.id);

  // Cast existingQuestion to DebateQuestion for type safety
  const debateQuestion = (freshQuestionData || existingQuestion) as
    | DebateQuestion
    | undefined;
  const [questionText, setQuestionText] = useState(
    debateQuestion?.text || debateQuestion?.question || ""
  );
  const [instructions, setInstructions] = useState(
    debateQuestion?.instructions || ""
  );
  const [content, setContent] = useState(debateQuestion?.content || "");
  const [stance, setStance] = useState<string>(() => {
    const s = debateQuestion?.stance || "random";
    if (s === "support") return "for";
    if (s === "oppose") return "against";
    return s;
  });
  const [imageUrl, setImageUrl] = useState<string | null>(
    debateQuestion?.image || debateQuestion?.mediaUrl || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState(debateQuestion?.points || 0);
  const initialTime = debateQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    debateQuestion?.maxAttempts || 1
  );

  // Update state when freshQuestionData arrives
  useEffect(() => {
    if (freshQuestionData) {
      const question = freshQuestionData as DebateQuestion;
      setQuestionText(question.text || question.question || "");
      setInstructions(question.instructions || "");
      setContent(question.content || "");
      const s = question.stance || "random";
      if (s === "support") setStance("for");
      else if (s === "oppose") setStance("against");
      else setStance(s);
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
    if (!challengeId || !content) {
      toast({
        title: "Error",
        description: "Please fill in the debate content",
        variant: "destructive",
      });
      return;
    }

    // Map UI values to backend enum
    const stanceMap: Record<string, string> = {
      for: "support",
      against: "oppose",
      random: "random",
    };

    // Use FormData if there's an image, otherwise use JSON payload
    const hasImage = imageFile || (imageUrl && imageUrl.trim() !== "");

    if (hasImage) {
      const formData = new FormData();
      formData.append("challengeId", challengeId);
      formData.append("content", content);
      formData.append("stance", stanceMap[stance] || stance);
      formData.append("stage", "SPEAKING");
      formData.append("text", questionText);
      formData.append("instructions", instructions);
      formData.append("points", points.toString());
      formData.append("timeLimit", (timeMinutes * 60 + timeSeconds).toString());
      formData.append("maxAttempts", maxAttempts.toString());

      // Handle image file - for updates, preserve existing if no new file is provided
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

      if (existingQuestion) {
        updateMutation.mutate(
          {
            endpoint: "/questions/debate",
            questionId: existingQuestion.id,
            data: formData,
            challengeId,
          },
          {
            onSuccess: async (data) => {
              // Update state from response
              if (data) {
                const question = data as DebateQuestion;
                setQuestionText(question.text || question.question || "");
                setInstructions(question.instructions || "");
                setContent(question.content || "");
                const s = question.stance || "random";
                if (s === "support") setStance("for");
                else if (s === "oppose") setStance("against");
                else setStance(s);
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
                description: "Debate question updated successfully",
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
            endpoint: "/questions/create/debate",
            data: formData,
            challengeId,
          },
          {
            onSuccess: () => {
              toast({
                title: "Success",
                description: "Debate question created successfully",
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
    } else {
      // No image, use JSON payload
      const payload: DebatePayload = {
        challengeId,
        content,
        stance: stanceMap[stance] || stance,
        stage: "SPEAKING",
        text: questionText,
        instructions,
        points,
        timeLimit: timeMinutes * 60 + timeSeconds,
        maxAttempts,
      };

      if (existingQuestion) {
        updateMutation.mutate(
          {
            endpoint: "/questions/debate",
            questionId: existingQuestion.id,
            data: payload,
            challengeId,
          },
          {
            onSuccess: async (data) => {
              // Update state from response
              if (data) {
                const question = data as DebateQuestion;
                setQuestionText(question.text || question.question || "");
                setInstructions(question.instructions || "");
                setContent(question.content || "");
                const s = question.stance || "random";
                if (s === "support") setStance("for");
                else if (s === "oppose") setStance("against");
                else setStance(s);
                setImageUrl(question.image || question.mediaUrl || null);
                setPoints(question.points || 0);
                const time = question.timeLimit || 0;
                setTimeMinutes(Math.floor(time / 60));
                setTimeSeconds(time % 60);
                setMaxAttempts(question.maxAttempts || 1);
              }
              // Also refetch to ensure cache is updated
              if (existingQuestion?.id) {
                await refetchQuestion();
              }
              toast({
                title: "Success",
                description: "Debate question updated successfully",
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
            endpoint: "/questions/create/debate",
            data: payload,
            challengeId,
          },
          {
            onSuccess: () => {
              toast({
                title: "Success",
                description: "Debate question created successfully",
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
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {existingQuestion ? "Edit Debate Question" : "Create Debate Question"}
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

      <Debate
        question={questionText}
        instructions={instructions}
        content={content}
        imageUrl={imageUrl || undefined}
        answer={(stance as "for") || "against" || "random" || undefined}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onContentChange={setContent}
        onImageChange={setImageUrl}
        onFileChange={setImageFile}
        onAnswerChange={setStance}
        onPointsChange={setPoints}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
      />
    </div>
  );
}
