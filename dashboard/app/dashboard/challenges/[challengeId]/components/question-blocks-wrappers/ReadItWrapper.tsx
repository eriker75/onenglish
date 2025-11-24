"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import ReadIt from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/ReadIt";
import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Question } from "../types";
import { ReadItQuestion, ReadItSubQuestion } from "./types";
import { isAxiosError } from "axios";

interface Statement {
  id: string;
  text: string;
  correct: boolean;
}

interface ReadItWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function ReadItWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: ReadItWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData } = useQuestion(existingQuestion?.id);

  // Cast existingQuestion to ReadItQuestion for type safety
  const readItQuestion = (freshQuestionData || existingQuestion) as
    | ReadItQuestion
    | undefined;

  const [questionText, setQuestionText] = useState(
    existingQuestion?.text || Question?.question || ""
  );
  const [instructions, setInstructions] = useState(
    readItQuestion?.instructions || ""
  );

  // Parse content (PassageDto[]) to get paragraph
  const initialParagraph =
    readItQuestion?.content &&
    Array.isArray(readItQuestion.content) &&
    readItQuestion.content.length > 0
      ? readItQuestion.content[0]?.text || ""
      : typeof readItQuestion?.content === "string"
        ? readItQuestion.content
        : "";
  const [paragraph, setParagraph] = useState<string>(initialParagraph);

  // Parse subQuestions to get statements
  // We need to map subQuestions back to Statement[] format
  const initialStatements: Statement[] = readItQuestion?.subQuestions?.map(
    (sq: ReadItSubQuestion, index: number) => ({
      id: sq.id || String(index),
      text: sq.content || "", // subQuestion content is the statement text
      correct: sq.correct || false, // Assuming answer is boolean or string boolean
    })
  ) || [{ id: "1", text: "", correct: true }];

  const [statements, setStatements] = useState<Statement[]>(initialStatements);

  const [imageUrl, setImageUrl] = useState<string | null>(
    readItQuestion?.image || readItQuestion?.mediaUrl || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState(readItQuestion?.points || 0);

  const initialTime = readItQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    readItQuestion?.maxAttempts || 1
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

    if (!paragraph) {
      toast({
        title: "Error",
        description: "Please enter a paragraph",
        variant: "destructive",
      });
      return;
    }

    const validStatements = statements.filter((s) => s.text.trim() !== "");
    if (validStatements.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one statement",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("challengeId", challengeId);
    formData.append("text", questionText);
    formData.append("instructions", instructions);

    // content: PassageDto[]
    const contentPayload = [
      {
        text: paragraph,
      },
    ];
    formData.append("content", JSON.stringify(contentPayload));

    // subQuestions: SubQuestionDto[]
    const subQuestionsPayload = validStatements.map((stmt) => ({
      content: stmt.text,
      options: [true, false],
      answer: stmt.correct,
      points: points, // Assigning global points per question
    }));
    formData.append("subQuestions", JSON.stringify(subQuestionsPayload));

    if (imageFile) {
      formData.append("media", imageFile);
    }

    const totalSeconds = timeMinutes * 60 + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }

    formData.append("maxAttempts", maxAttempts.toString());
    // stage is READING for ReadIt (likely)
    formData.append("stage", "READING");

    if (existingQuestion) {
      updateMutation.mutate({
        endpoint: "/questions/read_it",
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
          endpoint: "/questions/create/read_it",
          data: formData,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "ReadIt question created successfully",
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
            ? "Edit Reading Question"
            : "Create Reading Question"}{" "}
          (ReadIt)
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

      <ReadIt
        question={questionText}
        instructions={instructions}
        paragraph={paragraph}
        statements={statements}
        imageUrl={imageUrl || undefined}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onParagraphChange={setParagraph}
        onStatementsChange={setStatements}
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
