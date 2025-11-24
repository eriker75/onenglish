"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GossipQuestion } from "./types";
import type { Question } from "../types";
import Gossip from "../question-blocks/Gossip";
import { isAxiosError } from "axios";

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
  const { toast } = useToast();
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData, refetch: refetchQuestion } = useQuestion(existingQuestion?.id);

  // Cast existingQuestion to GossipQuestion for type safety
  const gossipQuestion = (freshQuestionData || existingQuestion) as
    | GossipQuestion
    | undefined;

  const [questionText, setQuestionText] = useState(
    gossipQuestion?.text || ""
  );
  const [instructions, setInstructions] = useState(
    gossipQuestion?.instructions || ""
  );
  const [correctTranscription, setCorrectTranscription] = useState(
    gossipQuestion?.answer || ""
  );
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(
    gossipQuestion?.audio || gossipQuestion?.mediaUrl || null
  );

  // Update state when freshQuestionData arrives
  useEffect(() => {
    if (freshQuestionData) {
      const question = freshQuestionData as GossipQuestion;
      setQuestionText(question.text || "");
      setInstructions(question.instructions || "");
      setCorrectTranscription(question.answer || "");
      setAudioUrl(question.audio || question.mediaUrl || null);
      setPoints(question.points || 0);
      const time = question.timeLimit || 0;
      setTimeMinutes(Math.floor(time / 60));
      setTimeSeconds(time % 60);
      setMaxAttempts(question.maxAttempts || 1);
    }
  }, [freshQuestionData]);

  const [points, setPoints] = useState(gossipQuestion?.points || 0);

  const initialTime = gossipQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    gossipQuestion?.maxAttempts || 1
  );

  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const absoluteUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    try {
      const response = await fetch(absoluteUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText} for URL: ${absoluteUrl}`);
      }
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type || 'audio/mpeg' });
    } catch (error) {
      console.error(`Error converting URL to File for ${absoluteUrl}:`, error);
      throw error;
    }
  };

  const handleSave = async () => {
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
    
    // Handle audio file - for updates, preserve existing if no new file is provided
    if (existingQuestion) {
      if (audioFile) {
        formData.append("audio", audioFile);
      } else if (audioUrl && audioUrl.trim() !== "") {
        try {
          const urlParts = audioUrl.split('/');
          const filename = urlParts[urlParts.length - 1] || 'audio.mp3';
          const file = await urlToFile(audioUrl, filename);
          formData.append("audio", file);
        } catch (error) {
          console.error('Failed to convert audio URL to file:', error);
          toast({
            title: "Warning",
            description: "Failed to preserve existing audio. Please re-upload it if needed.",
            variant: "destructive",
          });
        }
      }
    } else {
      if (audioFile) {
        formData.append("audio", audioFile);
      }
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
      updateMutation.mutate({
        endpoint: "/questions/gossip",
        questionId: existingQuestion.id,
        data: formData,
        challengeId,
      },
        {
          onSuccess: async (data) => {
            // Update state from response
            if (data) {
              const question = data as GossipQuestion;
              setQuestionText(question.text || "");
              setInstructions(question.instructions || "");
              setCorrectTranscription(question.answer || "");
              setAudioUrl(question.audio || question.mediaUrl || null);
              setPoints(question.points || 0);
              const time = question.timeLimit || 0;
              setTimeMinutes(Math.floor(time / 60));
              setTimeSeconds(time % 60);
              setMaxAttempts(question.maxAttempts || 1);
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
          endpoint: "/questions/create/gossip",
          data: formData,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Gossip question created successfully",
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
        audioUrl={audioUrl || undefined}
        correctTranscription={correctTranscription}
        points={points}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onAudioChange={setAudioUrl}
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
