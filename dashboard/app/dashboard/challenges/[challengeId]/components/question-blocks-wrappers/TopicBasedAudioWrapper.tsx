"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import TopicBasedAudio from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/TopicBasedAudio";
import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "@/src/hooks/useQuestionMutations";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "../QuestionsSection";
import { TopicBasedAudioQuestion } from "./types";
import { isAxiosError } from "axios";

interface SubQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  points?: number;
}

interface TopicBasedAudioWrapperProps {
  existingQuestion?: Question;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function TopicBasedAudioWrapper({
  existingQuestion,
  onCancel,
  onSuccess,
}: TopicBasedAudioWrapperProps) {
  const { toast } = useToast();
  const challengeId = useChallengeUIStore((state) => state.currentChallengeId);

  // Fetch fresh data when editing
  const { data: freshQuestionData } = useQuestion(existingQuestion?.id);

  // Use fresh data if available, otherwise use existing
  const topicBasedAudioQuestion = (freshQuestionData || existingQuestion) as
    | TopicBasedAudioQuestion
    | undefined;

  // State
  const [questionText, setQuestionText] = useState(
    topicBasedAudioQuestion?.content || ""
  );
  const [instructions, setInstructions] = useState(
    topicBasedAudioQuestion?.instructions || ""
  );
  const [audioUrl] = useState<string | null>(
    topicBasedAudioQuestion?.mediaUrl || null
  );
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [subQuestions, setSubQuestions] = useState<SubQuestion[]>(
    topicBasedAudioQuestion?.subQuestions?.map((q) => ({
      id: q.id || "",
      text: q.text ?? "",
      options: q.options ?? [],
      correctAnswer: q.answer ?? q.correctAnswer ?? "",
      points: q.points,
    })) || []
  );

  const initialTime = topicBasedAudioQuestion?.timeLimit || 0;
  const [timeMinutes, setTimeMinutes] = useState(Math.floor(initialTime / 60));
  const [timeSeconds, setTimeSeconds] = useState(initialTime % 60);
  const [maxAttempts, setMaxAttempts] = useState(
    topicBasedAudioQuestion?.maxAttempts || 1
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

    if (!audioFile && !audioUrl && !existingQuestion) {
      toast({
        title: "Error",
        description: "Please upload an audio file",
        variant: "destructive",
      });
      return;
    }

    if (subQuestions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one sub-question",
        variant: "destructive",
      });
      return;
    }

    // Validate sub-questions
    for (const q of subQuestions) {
      if (!q.text || !q.correctAnswer || q.options.some((opt) => !opt)) {
        toast({
          title: "Error",
          description: "Please fill in all fields for sub-questions",
          variant: "destructive",
        });
        return;
      }
    }

    const formData = new FormData();
    formData.append("challengeId", challengeId);

    if (audioFile) {
      formData.append("media", audioFile);
    }

    // Format sub-questions for backend
    const formattedSubQuestions = subQuestions.map((q) => ({
      id: q.id, // Include ID for updates if it exists
      text: q.text,
      points: q.points || 0,
      options: q.options,
      answer: q.correctAnswer,
    }));

    formData.append("subQuestions", JSON.stringify(formattedSubQuestions));

    formData.append("content", questionText);
    if (instructions) {
      formData.append("instructions", instructions);
    }

    // Time calculation
    const totalSeconds = timeMinutes * 60 + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }

    formData.append("maxAttempts", maxAttempts.toString());

    if (topicBasedAudioQuestion && existingQuestion) {
      updateMutation.mutate({
        endpoint: "/questions/topic_based_audio",
        questionId: existingQuestion.id,
        data: formData,
        challengeId,
      });
    } else {
      createMutation.mutate(
        {
          endpoint: "/questions/create/topic_based_audio",
          data: formData,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "TopicBasedAudio question created successfully",
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
            ? "Edit Topic Based Audio Question"
            : "Create Topic Based Audio Question"}
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

      <TopicBasedAudio
        question={questionText}
        instructions={instructions}
        questions={subQuestions}
        audioUrl={audioUrl || undefined}
        timeMinutes={timeMinutes}
        timeSeconds={timeSeconds}
        maxAttempts={maxAttempts}
        onQuestionChange={setQuestionText}
        onInstructionsChange={setInstructions}
        onAudioFileChange={setAudioFile}
        onQuestionsChange={setSubQuestions}
        onTimeMinutesChange={setTimeMinutes}
        onTimeSecondsChange={setTimeSeconds}
        onMaxAttemptsChange={setMaxAttempts}
      />
    </div>
  );
}
