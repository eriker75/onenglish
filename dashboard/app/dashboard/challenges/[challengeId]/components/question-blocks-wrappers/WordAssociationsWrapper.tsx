"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import WordAssociationsWithText from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/WordAssociationsWithText";
import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WordAssociationsQuestion } from "./types";
import type { Question } from "../types";
import { isAxiosError } from "axios";

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
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData, refetch: refetchQuestion } = useQuestion(existingQuestion?.id);

  // Use fresh data if available, otherwise use existing
  const wordAssociationsQuestion = (freshQuestionData || existingQuestion) as
    | WordAssociationsQuestion
    | undefined;

  // State
  const [questionText, setQuestionText] = useState(
    wordAssociationsQuestion?.text || ""
  );
  const [instructions, setInstructions] = useState(
    wordAssociationsQuestion?.instructions || ""
  );
  const [referenceWord, setReferenceWord] = useState(
    wordAssociationsQuestion?.centralWord || wordAssociationsQuestion?.content || ""
  );
  const [maxAssociations, setMaxAssociations] = useState(
    wordAssociationsQuestion?.maxAssociations || 3
  );
  const [imageUrl, setImageUrl] = useState<string | null>(
    wordAssociationsQuestion?.image || wordAssociationsQuestion?.mediaUrl || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState(wordAssociationsQuestion?.points || 0);

  const initialTime = wordAssociationsQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    wordAssociationsQuestion?.maxAttempts || 1
  );

  // Update state when freshQuestionData arrives
  useEffect(() => {
    if (freshQuestionData) {
      const question = freshQuestionData as WordAssociationsQuestion;
      setQuestionText(question.text || "");
      setInstructions(question.instructions || "");
      setReferenceWord(question.centralWord || question.content || "");
      setMaxAssociations(question.maxAssociations || 3);
      setImageUrl(question.image || question.mediaUrl || null);
      setPoints(question.points || 0);
      const time = question.timeLimit || 0;
      setTimeMinutes(Math.floor(time / 60));
      setTimeSeconds(time % 60);
      setMaxAttempts(question.maxAttempts || 1);
    }
  }, [freshQuestionData]);

  // Mutation

  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Helper function to convert image URL to File
  const urlToFile = async (url: string, filename: string): Promise<File> => {
    // Ensure URL is absolute
    const absoluteUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    const response = await fetch(absoluteUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type || 'image/png' });
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

    // Handle image: if updating, preserve existing image if no new file is uploaded
    if (existingQuestion) {
      // When updating, send new file if available, otherwise preserve existing image
      if (imageFile) {
        // New file uploaded
        console.log('[WordAssociations] Sending new image file:', imageFile.name, imageFile.size, imageFile.type);
        formData.append("image", imageFile);
      } else if (imageUrl && imageUrl.trim() !== "") {
        // Existing image that wasn't changed - convert URL to File to preserve it
        console.log('[WordAssociations] Converting existing image URL to File:', imageUrl);
        try {
          const urlParts = imageUrl.split('/');
          const filename = urlParts[urlParts.length - 1] || 'image.png';
          const file = await urlToFile(imageUrl, filename);
          console.log('[WordAssociations] Converted URL to File:', file.name, file.size, file.type);
          formData.append("image", file);
        } catch (error) {
          console.error('[WordAssociations] Failed to convert image URL to file:', error);
          toast({
            title: "Warning",
            description: "Failed to preserve existing image. Please re-upload it if needed.",
            variant: "destructive",
          });
        }
      } else {
        console.log('[WordAssociations] No image file or URL - image will be removed');
      }
      // If neither file nor URL, don't send image (image will be removed)
    } else {
      // For creating, only send if there's a file
      if (imageFile) {
        console.log('[WordAssociations] Creating with image file:', imageFile.name, imageFile.size, imageFile.type);
        formData.append("image", imageFile);
      }
    }

    // Debug: Log all FormData entries
    console.log('[WordAssociations] FormData entries:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    if (questionText) formData.append("text", questionText);
    if (instructions) formData.append("instructions", instructions);

    const totalSeconds = timeMinutes * 60 + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }

    formData.append("maxAttempts", maxAttempts.toString());

    if (existingQuestion) {
      updateMutation.mutate({
        endpoint: "/questions/word_associations",
        questionId: existingQuestion.id,
        data: formData,
        challengeId,
      },
        {
          onSuccess: async (data) => {
            // Use the response data directly to update local state immediately
            if (data) {
              const question = data as WordAssociationsQuestion;
              setQuestionText(question.text || "");
              setInstructions(question.instructions || "");
              setReferenceWord(question.centralWord || question.content || "");
              setMaxAssociations(question.maxAssociations || 3);
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
          endpoint: "/questions/create/word_associations",
          data: formData,
          challengeId,
        },
        {
          onSuccess: async (data) => {
            // If we get the created question back, update local state
            if (data?.id && existingQuestion) {
              // If editing a new question that was just created, refetch it
              await refetchQuestion();
            }
            toast({
              title: "Success",
              description: "WordAssociations question created successfully",
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
