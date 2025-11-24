"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import SentenceMaker from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/SentenceMaker";
import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SentenceMakerQuestion } from "./types";
import type { Question } from "../types";
import { isAxiosError } from "axios";

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
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData } = useQuestion(existingQuestion?.id);

  // Use fresh data if available, otherwise use existing
  const sentenceMakerQuestion = (freshQuestionData || existingQuestion) as
    | SentenceMakerQuestion
    | undefined;

  const [questionText, setQuestionText] = useState(
    sentenceMakerQuestion?.text || ""
  );
  const [instructions, setInstructions] = useState(
    sentenceMakerQuestion?.instructions || ""
  );

  // Helper function to extract image URLs from question data
  const extractImageUrls = (question: SentenceMakerQuestion | undefined): string[] => {
    if (!question) return ["", ""];
    
    // Check if images is an array of strings (direct URLs)
    if (Array.isArray(question.images)) {
      const urls = question.images.map((img: any) => {
        // If it's a string, use it directly
        if (typeof img === 'string') return img;
        // If it's an object with url property, use that
        if (img && typeof img === 'object' && 'url' in img) return img.url;
        return "";
      }).filter((url: string) => url !== "");
      
      // Ensure we always have 2 slots
      if (urls.length >= 2) return urls.slice(0, 2);
      if (urls.length === 1) return [urls[0], ""];
      return ["", ""];
    }
    
    return ["", ""];
  };

  const [images, setImages] = useState<string[]>(() => 
    extractImageUrls(sentenceMakerQuestion)
  );
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null]);
  const [points, setPoints] = useState(sentenceMakerQuestion?.points || 0);

  const initialTime = sentenceMakerQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    sentenceMakerQuestion?.maxAttempts || 1
  );

  // Update images when question data changes
  useEffect(() => {
    if (sentenceMakerQuestion) {
      const extractedImages = extractImageUrls(sentenceMakerQuestion);
      setImages(extractedImages);
      
      // Also update other fields when data changes
      setQuestionText(sentenceMakerQuestion.text || "");
      setInstructions(sentenceMakerQuestion.instructions || "");
      setPoints(sentenceMakerQuestion.points || 0);
      const time = sentenceMakerQuestion.timeLimit || 0;
      setTimeMinutes(Math.floor(time / 60));
      setTimeSeconds(time % 60);
      setMaxAttempts(sentenceMakerQuestion.maxAttempts || 1);
    }
  }, [sentenceMakerQuestion]);

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

    // For creating, require at least one file
    if (!existingQuestion) {
      const validFiles = imageFiles.filter((f) => f !== null);
      if (validFiles.length === 0) {
        toast({
          title: "Error",
          description: "Please upload at least one image",
          variant: "destructive",
        });
        return;
      }
    }

    const formData = new FormData();
    formData.append("challengeId", challengeId);
    formData.append("text", questionText);
    formData.append("instructions", instructions);

    // When updating, we need to send ALL images we want to keep
    // For each slot (0 and 1):
    // - If there's a new file, use that
    // - If no new file but there's an existing image URL, convert URL to File
    // - If neither, skip (empty slot)
    if (existingQuestion) {
      const imagesToSend: File[] = [];
      
      for (let i = 0; i < 2; i++) {
        // Priority: new file > existing image URL
        if (imageFiles[i]) {
          // New file uploaded
          imagesToSend.push(imageFiles[i]!);
        } else if (images[i] && images[i].trim() !== "") {
          // Existing image that wasn't changed - convert URL to File
          try {
            // Extract filename from URL or use a default
            const urlParts = images[i].split('/');
            const filename = urlParts[urlParts.length - 1] || `image-${i}.png`;
            const file = await urlToFile(images[i], filename);
            imagesToSend.push(file);
          } catch (error) {
            console.error(`Failed to convert image URL to file for slot ${i}:`, error);
            toast({
              title: "Warning",
              description: `Failed to preserve image ${i + 1}. Please re-upload it.`,
              variant: "destructive",
            });
          }
        }
        // If neither file nor URL, skip (empty slot)
      }

      // Only send images if we have at least one
      if (imagesToSend.length > 0) {
        imagesToSend.forEach((file) => {
          formData.append("images", file);
        });
      }
    } else {
      // For creating, just send the new files
      const validFiles = imageFiles.filter((f) => f !== null);
      validFiles.forEach((file) => {
        if (file) formData.append("images", file);
      });
    }

    const totalSeconds = timeMinutes * 60 + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }

    formData.append("points", points.toString());
    formData.append("maxAttempts", maxAttempts.toString());
    formData.append("stage", "WRITING");

    if (existingQuestion) {
      updateMutation.mutate({
        endpoint: "/questions/sentence_maker",
        questionId: existingQuestion.id,
        data: formData,
        challengeId,
      },
        {
          onSuccess: () => {
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
          endpoint: "/questions/create/sentence_maker",
          data: formData,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "SentenceMaker question created successfully",
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
