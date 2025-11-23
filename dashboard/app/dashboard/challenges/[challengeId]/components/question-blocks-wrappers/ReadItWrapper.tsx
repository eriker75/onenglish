"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import ReadIt from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/ReadIt";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection";
import { ReadItQuestion, ReadItSubQuestion } from "./types";

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
  // Cast existingQuestion to ReadItQuestion for type safety
  const readItQuestion = existingQuestion as ReadItQuestion | undefined;
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  const [questionText, setQuestionText] = useState(
    existingQuestion?.question || ""
  );
  const [instructions, setInstructions] = useState(
    readItQuestion?.instructions || ""
  );

  // Parse content (PassageDto[]) to get paragraph
  // Parse content (PassageDto[]) to get paragraph
  const initialParagraph =
    readItQuestion?.content && readItQuestion.content
      ? readItQuestion.content
      : "";
  const [paragraph, setParagraph] = useState<string>(initialParagraph);

  // Parse subQuestions to get statements
  // We need to map subQuestions back to Statement[] format
  const initialStatements: Statement[] =
    readItQuestion?.subQuestions?.map(
      (sq: ReadItSubQuestion, index: number) => ({
        id: sq.id || String(index),
        text: sq.content || "", // subQuestion content is the statement text
        correct: sq.correct || false, // Assuming answer is boolean or string boolean
      })
    ) || [{ id: "1", text: "", correct: true }];

  const [statements, setStatements] = useState<Statement[]>(initialStatements);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState(readItQuestion?.points || 0);

  const initialTime = readItQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    readItQuestion?.maxAttempts || 1
  );

  const createQuestionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/questions/create/read_it", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Reading comprehension question created successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create question",
        variant: "destructive",
      });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const response = await api.patch(`/questions/read_it/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Reading comprehension question updated successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update question",
        variant: "destructive",
      });
    },
  });

  const isPending =
    createQuestionMutation.isPending || updateQuestionMutation.isPending;

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
      updateQuestionMutation.mutate({ id: existingQuestion.id, formData });
    } else {
      createQuestionMutation.mutate(formData);
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
        imageUrl={imageUrl ?? undefined}
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
