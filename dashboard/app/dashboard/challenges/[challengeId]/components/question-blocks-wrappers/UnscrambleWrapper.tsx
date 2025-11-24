"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import Unscramble from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/Unscramble";
import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import { useCreateQuestion, useUpdateQuestion } from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection";
import { UnscrambleQuestion } from "./types";

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
  const { data: freshQuestionData } = useQuestion(existingQuestion?.id);
  

  // Cast existingQuestion to UnscrambleQuestion for type safety
  const unscrambleQuestion = (freshQuestionData || existingQuestion) as UnscrambleQuestion | undefined;

  const [questionText, setQuestionText] = useState(
    unscrambleQuestion?.question || ""
  );
  const [instructions, setInstructions] = useState(
    unscrambleQuestion?.instructions || ""
  );
  const [scrambledWords, setScrambledWords] = useState<string[]>(
    unscrambleQuestion?.content || []
  );

  // Answer is stored as array of strings in `answer` field in DTO, but Unscramble component might expect a sentence.
  // Actually Unscramble component has `correctSentence` prop.
  // The backend might store it as `answer[]`.
  // If `existingQuestion` has `answer` as array, join it.
  const initialCorrectSentence = Array.isArray(unscrambleQuestion?.answer)
    ? unscrambleQuestion.answer.join(" ")
    : unscrambleQuestion?.answer || "";

  const [correctSentence, setCorrectSentence] = useState(
    initialCorrectSentence
  );
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState(unscrambleQuestion?.points || 0);

  const initialTime = unscrambleQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    unscrambleQuestion?.maxAttempts || 1
  );

  
      if (onSuccess) onSuccess();

    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create question",
        variant: "destructive",
      });

  });

  
      if (onSuccess) onSuccess();

    onError: (error: AxiosError<{ message: string }>) => {
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

    if (existingQuestion) {
      updateQuestionMutation.mutate({ id: existingQuestion.id, formData });
    } else {
      createMutation.mutate(
        {
          endpoint: "/questions/create/unscramble",
          data: formData,
          challengeId,

        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Unscramble question created successfully",
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
        imageUrl={imageUrl ?? undefined}
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
