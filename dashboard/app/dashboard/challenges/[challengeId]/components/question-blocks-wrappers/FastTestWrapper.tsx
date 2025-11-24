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
import { FastTestQuestion, FastTestPayload } from "./types";
import FastTest from "../question-blocks/FastTest";
import { isAxiosError } from "axios";

interface FastTestWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function FastTestWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: FastTestWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData } = useQuestion(existingQuestion?.id);

  // Cast existingQuestion to FastTestQuestion for type safety
  const fastTestQuestion = (freshQuestionData || existingQuestion) as
    | FastTestQuestion
    | undefined;

  const [questionText, setQuestionText] = useState(
    existingQuestion?.question || ""
  );
  const [instructions, setInstructions] = useState(
    fastTestQuestion?.instructions || ""
  );
  const [content, setContent] = useState<string[]>(
    fastTestQuestion?.content || []
  );
  const [options, setOptions] = useState<string[]>(
    fastTestQuestion?.options || ["", "", ""]
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    fastTestQuestion?.answer || ""
  ); // Note: existingQuestion.correctAnswer vs .answer field
  const [points, setPoints] = useState(fastTestQuestion?.points || 0);

  const initialTime = fastTestQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    fastTestQuestion?.maxAttempts || 1
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

    if (content.length < 2) {
      toast({
        title: "Error",
        description: "Please provide a sentence with a blank (___)",
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

    const payload: FastTestPayload = {
      challengeId,
      text: questionText,
      instructions,
      content: content, // Array of strings
      options: options.filter((opt) => opt.trim() !== ""),
      answer: correctAnswer,
      points,
      timeLimit: timeMinutes * 60 + timeSeconds,
      maxAttempts,
      stage: "WRITING", // Inferred from controller group or generic stage
    };

    if (existingQuestion) {
      updateMutation.mutate(
        {
          endpoint: "/questions/fast_test",
          questionId: existingQuestion.id,
          data: payload,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "FastTest question updated successfully",
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
          endpoint: "/questions/create/fast_test",
          data: payload,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "FastTest question created successfully",
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
            ? "Edit Fast Test Question"
            : "Create Fast Test Question"}
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

      <FastTest
        question={questionText}
        instructions={instructions}
        content={content}
        options={options}
        correctAnswer={correctAnswer}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onContentChange={setContent}
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
