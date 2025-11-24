"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection";
import { ImageToMultipleChoiceQuestion } from "./types";
import ImageToMultipleChoiceText from "../question-blocks/ImageToMultipleChoiceText";
import { isAxiosError } from "axios";

interface ImageToMultipleChoiceWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function ImageToMultipleChoiceWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: ImageToMultipleChoiceWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData } = useQuestion(existingQuestion?.id);

  // Cast existingQuestion to ImageToMultipleChoiceQuestion for type safety
  const imageQuestion = existingQuestion as
    | ImageToMultipleChoiceQuestion
    | undefined;

  // State
  const [questionText, setQuestionText] = useState(
    imageQuestion?.question || ""
  );
  const [options, setOptions] = useState<string[]>(
    imageQuestion?.options || ["", "", "", ""]
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    imageQuestion?.correctAnswer || ""
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState(imageQuestion?.points || 0);

  const initialTime = imageQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    imageQuestion?.maxAttempts || 1
  );

  // Mutation

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

    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) {
      toast({
        title: "Error",
        description: "Please provide at least 2 valid options",
        variant: "destructive",
      });
      return;
    }

    if (!correctAnswer) {
      toast({
        title: "Error",
        description: "Please select a correct answer",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("challengeId", challengeId);
    if (imageFile) {
      formData.append("media", imageFile);
    }
    formData.append("text", questionText);
    formData.append("options", validOptions.join(","));
    formData.append("answer", correctAnswer);
    formData.append("points", points.toString());

    const totalSeconds = timeMinutes * 60 + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }

    formData.append("maxAttempts", maxAttempts.toString());

    if (existingQuestion) {
      updateMutation.mutate({
        endpoint: "/questions/image_to_multiple_choices",
        questionId: existingQuestion.id,
        data: formData,
        challengeId,
      });
    } else {
      createMutation.mutate(
        {
          endpoint: "/questions/create/image_to_multiple_choices",
          data: formData,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description:
                "ImageToMultipleChoice question created successfully",
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
            ? "Edit Vocabulary Question"
            : "Create Vocabulary Question"}{" "}
          (Image to Multiple Choice)
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

      <ImageToMultipleChoiceText
        question={questionText}
        options={options}
        correctAnswer={correctAnswer}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onOptionsChange={setOptions}
        onCorrectAnswerChange={setCorrectAnswer}
        onFileChange={setImageFile}
        onPointsChange={setPoints}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
      />
    </div>
  );
}
