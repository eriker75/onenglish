"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import Gossip from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/Gossip";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection";
import { GossipQuestion } from "./types";

interface GossipWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function GossipWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: GossipWrapperProps) {
  const toast = (opts: {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => {
    if (opts.variant === "destructive") {
      console.error(`[Toast error]: ${opts.title} - ${opts.description ?? ""}`);
    } else {
      console.log(`[Toast]: ${opts.title} - ${opts.description ?? ""}`);
    }
  };
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  // Cast existingQuestion to GossipQuestion for type safety
  const gossipQuestion = existingQuestion as GossipQuestion | undefined;

  const [questionText, setQuestionText] = useState(
    gossipQuestion?.question || ""
  );
  const [instructions, setInstructions] = useState(
    gossipQuestion?.instructions || ""
  );
  const [correctTranscription, setCorrectTranscription] = useState(
    gossipQuestion?.answer || ""
  );
  const [audioFile, setAudioFile] = useState<File | null>(null);
  // Note: We might need to handle existing media URL if we want to show it,
  // but `Gossip` component might need an update to accept `audioUrl` if it doesn't already.
  // Looking at previous usage: `Gossip` does NOT seem to take `audioUrl`. It takes `onAudioFileChange`.
  // If editing, we might want to show the existing audio.

  const [points, setPoints] = useState(gossipQuestion?.points || 0);

  const initialTime = gossipQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    gossipQuestion?.maxAttempts || 1
  );

  useEffect(() => {
    if (gossipQuestion) {
      setQuestionText(gossipQuestion.question || "");
      setInstructions(gossipQuestion.instructions || "");
      setCorrectTranscription(gossipQuestion.answer || "");
      setPoints(gossipQuestion.points || 0);
      const time = gossipQuestion.timeLimit || 0;
      setTimeMinutes(Math.floor(time / 60));
      setTimeSeconds(time % 60);
      setMaxAttempts(gossipQuestion.maxAttempts || 1);
    }
  }, [gossipQuestion]);

  const createQuestionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/questions/create/gossip", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Gossip question created successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error creating question:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to create question",
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
      const response = await api.patch(`/questions/gossip/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Gossip question updated successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error updating question:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update question",
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

    if (!existingQuestion && !audioFile) {
      toast({
        title: "Error",
        description: "Please upload an audio file",
        variant: "destructive",
      });
      return;
    }

    if (!correctTranscription.trim()) {
      toast({
        title: "Error",
        description: "Please enter the correct transcription",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("challengeId", challengeId);
    if (audioFile) {
      formData.append("media", audioFile);
    }
    formData.append("answer", correctTranscription.trim());

    if (questionText.trim()) {
      formData.append("text", questionText.trim());
    }
    if (instructions.trim()) {
      formData.append("instructions", instructions.trim());
    }

    formData.append("points", String(Math.max(0, points)));

    const totalSeconds = timeMinutes * 60 + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }

    formData.append("maxAttempts", String(Math.max(1, maxAttempts)));

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
          {existingQuestion ? "Edit Gossip Question" : "Create Gossip Question"}
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

      <Gossip
        question={questionText}
        instructions={instructions}
        correctTranscription={correctTranscription}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onCorrectTranscriptionChange={setCorrectTranscription}
        onPointsChange={setPoints}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
        onAudioFileChange={setAudioFile}
      />
    </div>
  );
}
