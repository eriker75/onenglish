"use client";

import { useState, useEffect } from "react";
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
import { ReadItQuestion, ReadItSubQuestion } from "./types";
import type { Question } from "../types";
import { isAxiosError } from "axios";

interface Statement {
  id: string;
  text: string;
  correct: boolean;
}

interface PassageDto {
  text: string;
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
  const { data: freshQuestionData, refetch: refetchQuestion } = useQuestion(existingQuestion?.id);

  // Cast existingQuestion to ReadItQuestion for type safety
  const readItQuestion = (freshQuestionData || existingQuestion) as
    | ReadItQuestion
    | undefined;

  const [questionText, setQuestionText] = useState(
    readItQuestion?.text || ""
  );
  const [instructions, setInstructions] = useState(
    readItQuestion?.instructions || ""
  );

  // Parse content (PassageDto[] or string) to get paragraph
  const getInitialParagraph = (question: ReadItQuestion | undefined): string => {
    if (!question) return "";
    if (typeof question.content === "string") {
      return question.content;
    }
    if (Array.isArray(question.content) && question.content.length > 0) {
      return question.content[0]?.text || "";
    }
    return "";
  };

  const [paragraph, setParagraph] = useState<string>(getInitialParagraph(readItQuestion));

  // Parse subQuestions to get statements
  // We need to map subQuestions back to Statement[] format
  const getInitialStatements = (question: ReadItQuestion | undefined): Statement[] => {
    if (!question?.subQuestions || question.subQuestions.length === 0) {
      return [{ id: "1", text: "", correct: true }];
    }
    return question.subQuestions.map((sq: ReadItSubQuestion, index: number) => {
      // Handle answer field - it might be boolean, string, or undefined
      let correctValue = false;
      if ('answer' in sq && sq.answer !== undefined) {
        if (typeof sq.answer === 'boolean') {
          correctValue = sq.answer;
        } else if (typeof sq.answer === 'string') {
          correctValue = sq.answer === 'true';
        }
      } else if ('correct' in sq && sq.correct !== undefined) {
        correctValue = sq.correct;
      }
      
      return {
        id: sq.id || String(index),
        text: sq.content || sq.text || "",
        correct: correctValue,
      };
    });
  };

  const [statements, setStatements] = useState<Statement[]>(getInitialStatements(readItQuestion));

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

  // Update state when freshQuestionData arrives
  useEffect(() => {
    if (freshQuestionData) {
      const question = freshQuestionData as ReadItQuestion;
      console.log('[ReadItWrapper] Updating from freshQuestionData:', {
        content: question.content,
        subQuestions: question.subQuestions,
        contentType: typeof question.content,
        subQuestionsLength: question.subQuestions?.length,
      });
      
      setQuestionText(question.text || "");
      setInstructions(question.instructions || "");
      setParagraph(getInitialParagraph(question));
      setStatements(getInitialStatements(question));
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

    // content: string (reading passage text)
    formData.append("content", paragraph);

    // subQuestions: SubQuestionDto[]
    // Calculate points per subquestion (divide total points equally, or use a default)
    const pointsPerSubquestion = validStatements.length > 0 
      ? Math.max(1, Math.floor(points / validStatements.length))
      : points;
    
    const subQuestionsPayload = validStatements.map((stmt) => ({
      content: stmt.text,
      options: [true, false],
      answer: stmt.correct,
      points: pointsPerSubquestion,
    }));
    formData.append("subQuestions", JSON.stringify(subQuestionsPayload));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const totalSeconds = timeMinutes * 60 + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }

    // Points is required by the DTO base class, but for read_it it's auto-calculated from subquestions
    // We'll send the total points (sum of all subquestion points)
    const totalPoints = pointsPerSubquestion * validStatements.length;
    formData.append("points", totalPoints.toString());

    formData.append("maxAttempts", maxAttempts.toString());
    // read_it is always GRAMMAR stage (not READING)
    formData.append("stage", "GRAMMAR");

    if (existingQuestion) {
      updateMutation.mutate({
        endpoint: "/questions/read_it",
        questionId: existingQuestion.id,
        data: formData,
        challengeId,
      },
        {
          onSuccess: async (data) => {
            // Update state from response
            if (data) {
              const question = data as ReadItQuestion;
              setQuestionText(question.text || "");
              setInstructions(question.instructions || "");
              setParagraph(getInitialParagraph(question));
              setStatements(getInitialStatements(question));
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
