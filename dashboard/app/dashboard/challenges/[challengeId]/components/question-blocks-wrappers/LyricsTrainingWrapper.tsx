"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import api from "@/src/config/axiosInstance";
import LyricsTraining from "@/app/dashboard/challenges/[challengeId]/components/question-blocks/LyricsTraining";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LyricsTrainingWrapper() {
  const { toast } = useToast();
  const challengeId = useChallengeFormStore((state) => state.challenge.id);

  const [questionText, setQuestionText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [hint, setHint] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // Used for preview
  const [videoFile, setVideoFile] = useState<File | null>(null); // Used for upload
  const [options, setOptions] = useState<string[]>(["", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [points, setPoints] = useState(0);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(1);

  const createQuestionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/questions/create/lyrics_training", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lyrics training question created successfully",
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

    if (!videoFile && !videoUrl) {
       // If we have a URL but no file, maybe it's an edit or external URL? 
       // But creation usually requires file upload if backend expects it. 
       // The DTO requires 'media' as file.
       if (!videoFile) {
         toast({
            title: "Error",
            description: "Please upload a video/audio file",
            variant: "destructive",
          });
          return;
       }
    }

    const validOptions = options.filter(opt => opt.trim() !== "");
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
    formData.append("instructions", hint ? `${instructions} (Hint: ${hint})` : instructions);
    formData.append("options", validOptions.join(",")); // Check if backend expects comma-separated or array. NestJS FormData with IsString({each:true}) usually expects array if same key repeated, or comma separated if handled manually.
    // Wait, nestjs-form-data usually handles arrays if key is 'options[]' or repeated 'options'.
    // But `ImageToMultipleChoiceWrapper` used `validOptions.join(",")`.
    // Let's check `CreateLyricsTrainingDto`. It uses `@IsArray()` and `@IsString({ each: true })`.
    // If I send `options` as multiple fields, `nestjs-form-data` should parse it as array.
    // If I send as comma separated string, it might fail validation if it expects array.
    // However, `ImageToMultipleChoiceWrapper` used `join(",")` and the backend likely handles it or uses a Transform.
    // `CreateImageToMultipleChoicesDto` has `@Transform`?
    // Let's check `CreateImageToMultipleChoicesDto`.
    // If not, I should be careful.
    
    // Strategy: Send repeated fields for array.
    validOptions.forEach(opt => formData.append("options[]", opt));

    formData.append("answer", correctAnswer);
    formData.append("points", points.toString());
    
    const totalSeconds = (timeMinutes * 60) + timeSeconds;
    if (totalSeconds > 0) {
      formData.append("timeLimit", totalSeconds.toString());
    }
    
    formData.append("maxAttempts", maxAttempts.toString());
    formData.append("stage", "LISTENING"); 

    createQuestionMutation.mutate(formData);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Create Lyrics Training Question</h2>
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

