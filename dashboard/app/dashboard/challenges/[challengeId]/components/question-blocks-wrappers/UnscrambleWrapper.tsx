"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import Unscramble from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/Unscramble";
import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Question } from "../types";
import { UnscrambleQuestion } from "./types";
import { isAxiosError } from "axios";

interface UnscrambleWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function UnscrambleWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: UnscrambleWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData, refetch: refetchQuestion } = useQuestion(existingQuestion?.id);

  // Cast existingQuestion to UnscrambleQuestion for type safety
  const unscrambleQuestion = (freshQuestionData || existingQuestion) as
    | UnscrambleQuestion
    | undefined;

  const [questionText, setQuestionText] = useState(
    unscrambleQuestion?.text || ""
  );
  const [instructions, setInstructions] = useState(
    unscrambleQuestion?.instructions || ""
  );
  const [scrambledWords, setScrambledWords] = useState<string[]>(() => {
    // Backend returns 'scrambledWords' (array) or 'content' (array)
    const content = unscrambleQuestion?.scrambledWords || unscrambleQuestion?.content;
    if (Array.isArray(content)) {
      return content;
    }
    return [];
  });

  // Backend returns 'correctSentence' (string or array) or 'answer' (array or string)
  // The formatter might return answer as array, so handle both cases
  let initialCorrectSentence = "";
  if (unscrambleQuestion) {
    if (unscrambleQuestion.correctSentence) {
      const cs: unknown = unscrambleQuestion.correctSentence;
      if (typeof cs === 'string') {
        initialCorrectSentence = cs;
      } else if (Array.isArray(cs)) {
        initialCorrectSentence = (cs as string[]).join(" ");
      } else {
        initialCorrectSentence = String(cs);
      }
    } else if (unscrambleQuestion.answer) {
      if (Array.isArray(unscrambleQuestion.answer)) {
        initialCorrectSentence = unscrambleQuestion.answer.join(" ") || "";
      } else {
        initialCorrectSentence = String(unscrambleQuestion.answer);
      }
    }
  }

  const [correctSentence, setCorrectSentence] = useState(
    initialCorrectSentence
  );
  const [imageUrl, setImageUrl] = useState<string | null>(
    unscrambleQuestion?.image || unscrambleQuestion?.mediaUrl || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState(unscrambleQuestion?.points || 0);

  const initialTime = unscrambleQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    unscrambleQuestion?.maxAttempts || 1
  );

  // Update state when freshQuestionData arrives
  useEffect(() => {
    if (freshQuestionData) {
      const question = freshQuestionData as UnscrambleQuestion;
      console.log('[UnscrambleWrapper] Updating from freshQuestionData:', {
        content: question.content,
        scrambledWords: question.scrambledWords,
        answer: question.answer,
        correctSentence: question.correctSentence,
        contentType: Array.isArray(question.content) ? 'array' : typeof question.content,
        scrambledWordsType: Array.isArray(question.scrambledWords) ? 'array' : typeof question.scrambledWords,
        answerType: Array.isArray(question.answer) ? 'array' : typeof question.answer,
        correctSentenceType: typeof question.correctSentence,
      });
      
      setQuestionText(question.text || "");
      setInstructions(question.instructions || "");
      
      // Backend returns 'scrambledWords' (array) or 'content' (array)
      // Prefer scrambledWords as that's what the backend formatter returns
      const contentArray = Array.isArray(question.scrambledWords)
        ? question.scrambledWords
        : Array.isArray(question.content)
        ? question.content
        : question.content
        ? [question.content]
        : [];
      setScrambledWords(contentArray);
      console.log('[UnscrambleWrapper] Set scrambledWords:', contentArray);
      
      // Backend returns 'correctSentence' (string or array) or 'answer' (array or string)
      // The formatter might return answer as array, so handle both cases
      let correctSentenceStr = "";
      if (question.correctSentence) {
        const cs: unknown = question.correctSentence;
        if (typeof cs === 'string') {
          correctSentenceStr = cs;
        } else if (Array.isArray(cs)) {
          correctSentenceStr = (cs as string[]).join(" ");
        } else {
          correctSentenceStr = String(cs);
        }
      } else if (Array.isArray(question.answer)) {
        correctSentenceStr = question.answer.join(" ");
      } else if (question.answer) {
        correctSentenceStr = String(question.answer);
      }
      setCorrectSentence(correctSentenceStr);
      console.log('[UnscrambleWrapper] Set correctSentence:', correctSentenceStr, 'from:', { correctSentence: question.correctSentence, answer: question.answer });
      
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

    const validWords = scrambledWords.filter((w) => w.trim() !== "");
    if (validWords.length < 2) {
      toast({
        title: "Error",
        description: "Please provide at least 2 words",
        variant: "destructive",
      });
      return;
    }

    if (!correctSentence) {
      toast({
        title: "Error",
        description: "Please provide the correct sentence",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("challengeId", challengeId);
    formData.append("text", questionText);
    formData.append("instructions", instructions);

    // content: scrambled words array
    validWords.forEach((word) => formData.append("content[]", word));

    // answer: correct words array (split from correctSentence)
    const correctWords = correctSentence
      .split(/\s+/)
      .filter((w: string) => w.trim() !== "");
    correctWords.forEach((word: string | Blob) =>
      formData.append("answer[]", word)
    );

    // Handle image: preserve existing image if no new file is uploaded
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
        endpoint: "/questions/unscramble",
        questionId: existingQuestion.id,
        data: formData,
        challengeId,
      },
        {
          onSuccess: async (data) => {
            // Update state immediately from response
            if (data) {
              const question = data as UnscrambleQuestion;
              setQuestionText(question.text || "");
              setInstructions(question.instructions || "");
              
              // Backend returns 'scrambledWords' (array) or 'content' (array)
              const contentArray = Array.isArray(question.scrambledWords)
                ? question.scrambledWords
                : Array.isArray(question.content)
                ? question.content
                : [];
              setScrambledWords(contentArray);
              
              // Backend returns 'correctSentence' (string or array) or 'answer' (array or string)
              // The formatter might return answer as array, so handle both cases
              let correctSentenceStr = "";
              if (question.correctSentence) {
                const cs: unknown = question.correctSentence;
                if (typeof cs === 'string') {
                  correctSentenceStr = cs;
                } else if (Array.isArray(cs)) {
                  correctSentenceStr = (cs as string[]).join(" ");
                } else {
                  correctSentenceStr = String(cs);
                }
              } else if (Array.isArray(question.answer)) {
                correctSentenceStr = question.answer.join(" ");
              } else if (question.answer) {
                correctSentenceStr = String(question.answer);
              }
              setCorrectSentence(correctSentenceStr);
              
              setImageUrl(question.image || question.mediaUrl || null);
              setPoints(question.points || 0);
              const time = question.timeLimit || 0;
              setTimeMinutes(Math.floor(time / 60));
              setTimeSeconds(time % 60);
              setMaxAttempts(question.maxAttempts || 1);
              // Clear the image file since it's now saved
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
          endpoint: "/questions/create/unscramble",
          data: formData,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Unscramble question created successfully",
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
            ? "Edit Unscramble Question"
            : "Create Unscramble Question"}
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

      <Unscramble
        question={questionText}
        instructions={instructions}
        words={scrambledWords}
        correctSentence={correctSentence}
        imageUrl={imageUrl || undefined}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onWordsChange={setScrambledWords}
        onCorrectSentenceChange={setCorrectSentence}
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
