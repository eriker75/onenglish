"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import Tales from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/Tales";
import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Question } from "../types";
import { TalesQuestion } from "./types";
import { isAxiosError } from "axios";

interface TalesWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function TalesWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: TalesWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData } = useQuestion(existingQuestion?.id);

  // Cast existingQuestion to TalesQuestion for type safety
  const talesQuestion = (freshQuestionData || existingQuestion) as
    | TalesQuestion
    | undefined;

  // Extract example story from instructions if possible
  // This assumes a specific format: "instructions\n\nExample Story:\nexampleStory"
  const fullInstructions = talesQuestion?.instructions || "";
  const parts = fullInstructions.split("\n\nExample Story:\n");
  const initialInstructions = parts.length > 1 ? parts[0] : fullInstructions;
  const initialExampleStory = parts.length > 1 ? parts[1] : "";

  const [questionText, setQuestionText] = useState(
    existingQuestion?.text || Question?.question || ""
  );
  const [instructions, setInstructions] = useState(initialInstructions);
  const [exampleStory, setExampleStory] = useState(initialExampleStory);
  const [imageUrl, setImageUrl] = useState<string | null>(
    talesQuestion?.image || talesQuestion?.mediaUrl || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState(talesQuestion?.points || 0);

  const initialTime = talesQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    talesQuestion?.maxAttempts || 1
  );

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

    if (!imageFile && !imageUrl && !existingQuestion) {
      toast({
        title: "Error",
        description: "Please upload an image",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("challengeId", challengeId);
    formData.append("text", questionText);

    // Append example story to instructions if present
    let finalInstructions = instructions;
    if (exampleStory) {
      finalInstructions += `\n\nExample Story:\n${exampleStory}`;
    }
    formData.append("instructions", finalInstructions);

    if (imageFile) {
      // Tales DTO expects 'media' as array of files, but controller might handle single file too
      // Checking previous implementation, it used media[]
      formData.append("media[]", imageFile);
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
        endpoint: "/questions/tales",
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
          endpoint: "/questions/create/tales",
          data: formData,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Tales question created successfully",
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
          {existingQuestion ? "Edit Tales Question" : "Create Tales Question"}
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

      <Tales
        question={questionText}
        instructions={instructions}
        imageUrl={imageUrl || undefined}
        exampleStory={exampleStory}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onImageChange={setImageUrl}
        onFileChange={setImageFile}
        onExampleStoryChange={setExampleStory}
        onPointsChange={setPoints}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
      />
    </div>
  );
}
