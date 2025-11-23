"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import LyricsTraining from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/LyricsTraining";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection";
import { LyricsTrainingQuestion } from "./types";

interface LyricsTrainingWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function LyricsTrainingWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: LyricsTrainingWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  // Cast existingQuestion to LyricsTrainingQuestion for type safety
  const lyricsTrainingQuestion = existingQuestion as
    | LyricsTrainingQuestion
    | undefined;

  // Extract hint from instructions if present
  const extractHintFromInstructions = (instr: string) => {
    const hintMatch = instr.match(/\(Hint: (.*)\)$/);
    if (hintMatch) {
      return {
        hint: hintMatch[1],
        cleanInstructions: instr.replace(/\s*\(Hint: .*\)$/, ""),
      };
    }
    return { hint: "", cleanInstructions: instr };
  };

  const initialInstructions = extractHintFromInstructions(
    lyricsTrainingQuestion?.instructions || ""
  );

  const [questionText, setQuestionText] = useState(
    lyricsTrainingQuestion?.question || ""
  );
  const [instructions, setInstructions] = useState(
    initialInstructions.cleanInstructions
  );
  const [hint, setHint] = useState(initialInstructions.hint);
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // Used for preview
  const [videoFile, setVideoFile] = useState<File | null>(null); // Used for upload
  const [options, setOptions] = useState<string[]>(
    lyricsTrainingQuestion?.options || ["", "", ""]
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    lyricsTrainingQuestion?.answer || ""
  );
  const [points, setPoints] = useState(lyricsTrainingQuestion?.points || 0);

  const initialTime = lyricsTrainingQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    lyricsTrainingQuestion?.maxAttempts || 1
  );

  const [prevQuestionId, setPrevQuestionId] = useState(existingQuestion?.id);

  // Reset state during render when question changes
  if (existingQuestion?.id !== prevQuestionId) {
    setPrevQuestionId(existingQuestion?.id);
    if (lyricsTrainingQuestion) {
      setQuestionText(lyricsTrainingQuestion.question || "");
      const extracted = extractHintFromInstructions(
        lyricsTrainingQuestion.instructions || ""
      );
      setInstructions(extracted.cleanInstructions);
      setHint(extracted.hint);

      setOptions(lyricsTrainingQuestion.options || ["", "", ""]);
      setCorrectAnswer(lyricsTrainingQuestion.answer || "");
      setPoints(lyricsTrainingQuestion.points || 0);
      const time = lyricsTrainingQuestion.timeLimit || 0;
      setTimeMinutes(Math.floor(time / 60));
      setTimeSeconds(time % 60);
      setMaxAttempts(lyricsTrainingQuestion.maxAttempts || 1);
    }
  }

  const createQuestionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post(
        "/questions/create/lyrics_training",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lyrics training question created successfully",
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
      const response = await api.patch(
        `/questions/lyrics_training/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lyrics training question updated successfully",
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

    if (!existingQuestion && !videoFile && !videoUrl) {
      if (!videoFile) {
        toast({
          title: "Error",
          description: "Please upload a video/audio file",
          variant: "destructive",
        });
        return;
      }
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
    if (videoFile) {
      formData.append("media", videoFile);
    }
    formData.append("text", questionText);
    // Append hint to instructions if exists, as backend might not have hint field
    formData.append(
      "instructions",
      hint ? `${instructions} (Hint: ${hint})` : instructions
    );

    // Strategy: Send repeated fields for array.
    validOptions.forEach((opt) => formData.append("options[]", opt));

    formData.append("answer", correctAnswer);
    formData.append("points", points.toString());

    const totalSeconds = timeMinutes * 60 + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }

    formData.append("maxAttempts", maxAttempts.toString());
    formData.append("stage", "LISTENING");

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
            ? "Edit Lyrics Training Question"
            : "Create Lyrics Training Question"}
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

      <LyricsTraining
        question={questionText}
        instructions={instructions}
        hint={hint}
        audioUrl={videoUrl ?? undefined} // Preview
        options={options}
        correctAnswer={correctAnswer}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onHintChange={setHint}
        onAudioChange={setVideoUrl} // Updates preview URL
        onFileChange={setVideoFile} // Capture the file
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
