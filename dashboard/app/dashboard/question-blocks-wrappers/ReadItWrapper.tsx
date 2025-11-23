"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import ReadIt from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/ReadIt";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Statement {
  id: string;
  text: string;
  correct: boolean;
}

export default function ReadItWrapper() {
  const { toast } = useToast();
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  const [questionText, setQuestionText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [statements, setStatements] = useState<Statement[]>([
    { id: "1", text: "", correct: true }
  ]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState(0);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(1);

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
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create question",
        variant: "destructive",
      });
    },
  });

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

    const validStatements = statements.filter(s => s.text.trim() !== "");
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
    // The DTO expects an array of passages. We have one paragraph.
    // PassageDto has { text: string, image?: string }
    const contentPayload = [
      {
        text: paragraph,
        // image: undefined // We upload image via media field separately if supported, or here if it's an ID.
        // The DTO has `media` field for file.
      }
    ];
    formData.append("content", JSON.stringify(contentPayload));

    // subQuestions: SubQuestionDto[]
    const subQuestionsPayload = validStatements.map(stmt => ({
      content: stmt.text,
      options: [true, false],
      answer: stmt.correct,
      points: points // Assigning global points per question
    }));
    formData.append("subQuestions", JSON.stringify(subQuestionsPayload));

    if (imageFile) {
      formData.append("media", imageFile);
    }

    const totalSeconds = (timeMinutes * 60) + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }
    
    formData.append("maxAttempts", maxAttempts.toString());
    // stage is READING for ReadIt (likely)
    formData.append("stage", "READING");

    createQuestionMutation.mutate(formData);
  };

  // Need to capture file from ImageUpload. 
  // ReadIt component uses ImageUpload but doesn't expose onFileChange explicitly in props interface?
  // Let's check ReadIt.tsx again. It exposes onImageChange (string). 
  // It does NOT expose onFileChange. I need to update ReadIt.tsx too.

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Create Reading Question (ReadIt)</h2>
        <Button
          onClick={handleSave}
          disabled={createQuestionMutation.isPending}
          className="bg-[#44b07f] hover:bg-[#3a966b] text-white"
        >
          {createQuestionMutation.isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
          ) : (
            <><Save className="mr-2 h-4 w-4" />Save Question</>
          )}
        </Button>
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

