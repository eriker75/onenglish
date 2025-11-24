"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import WordMatch from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/WordMatch";
import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { WordMatchQuestion } from "./types";
import type { Question } from "../types";
import { isAxiosError } from "axios";

interface WordMatchWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function WordMatchWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: WordMatchWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData, refetch: refetchQuestion } = useQuestion(existingQuestion?.id);

  const wordMatchQuestion = (freshQuestionData || existingQuestion) as
    | WordMatchQuestion
    | undefined;

  const [questionText, setQuestionText] = useState(
    wordMatchQuestion?.text || wordMatchQuestion?.question || ""
  );
  const [instructions, setInstructions] = useState(
    wordMatchQuestion?.instructions || ""
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(
    wordMatchQuestion?.audio || wordMatchQuestion?.mediaUrl || null
  );
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [options, setOptions] = useState<string[]>(
    wordMatchQuestion?.options || [""]
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    wordMatchQuestion?.answer || ""
  );
  const [points, setPoints] = useState(wordMatchQuestion?.points || 10);

  const initialTime = wordMatchQuestion?.timeLimit || 60;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    wordMatchQuestion?.maxAttempts || 1
  );

  // Update state when freshQuestionData arrives
  useEffect(() => {
    if (freshQuestionData) {
      const question = freshQuestionData as WordMatchQuestion;
      setQuestionText(question.text || question.question || "");
      setInstructions(question.instructions || "");
      setAudioUrl(question.audio || question.mediaUrl || null);
      setOptions(question.options || [""]);
      setCorrectAnswer(question.answer || "");
      setPoints(question.points || 10);
      const time = question.timeLimit || 60;
      setTimeMinutes(Math.floor(time / 60));
      setTimeSeconds(time % 60);
      setMaxAttempts(question.maxAttempts || 1);
    }
  }, [freshQuestionData]);

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

    if (!existingQuestion && !audioFile) {
      toast({
        title: "Error",
        description: "Please upload an audio file",
        variant: "destructive",
      });
      return;
    }

    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) {
      toast({
        title: "Error",
        description: "Please provide at least 2 options",
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
    formData.append("text", questionText);
    formData.append("instructions", instructions);
    if (audioFile) {
      formData.append("media", audioFile);
    }

    // Check if backend expects comma-separated or array for options
    // Assuming array for now as standard
    validOptions.forEach((opt) => formData.append("options[]", opt));

    formData.append("answer", correctAnswer);

    const totalSeconds = timeMinutes * 60 + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }

    formData.append("points", points.toString());
    formData.append("maxAttempts", maxAttempts.toString());
    formData.append("stage", "LISTENING");

    if (existingQuestion) {
      updateMutation.mutate(
        {
          endpoint: "/questions/word_match",
          questionId: existingQuestion.id,
          data: formData,
          challengeId,
        },
        {
          onSuccess: async (data) => {
            // Update state immediately from response
            if (data) {
              const question = data as WordMatchQuestion;
              setQuestionText(question.text || question.question || "");
              setInstructions(question.instructions || "");
              setAudioUrl(question.audio || question.mediaUrl || null);
              setOptions(question.options || [""]);
              setCorrectAnswer(question.answer || "");
              setPoints(question.points || 10);
              const time = question.timeLimit || 60;
              setTimeMinutes(Math.floor(time / 60));
              setTimeSeconds(time % 60);
              setMaxAttempts(question.maxAttempts || 1);
              // Clear the audio file since it's now saved
              setAudioFile(null);
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
          endpoint: "/questions/create/word_match",
          data: formData,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "WordMatch question created successfully",
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
            ? "Edit Word Match Question"
            : "Create Word Match Question"}
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

      <WordMatch
        question={questionText}
        instructions={instructions}
        audioUrl={audioUrl || undefined}
        options={options}
        correctAnswer={correctAnswer}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onAudioChange={setAudioUrl}
        onAudioFileChange={setAudioFile}
        onOptionsChange={setOptions}
        onCorrectAnswerChange={setCorrectAnswer}
        onPointsChange={setPoints}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
      />
    </div>
  );
}
