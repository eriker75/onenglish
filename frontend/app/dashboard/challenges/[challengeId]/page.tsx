"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DashboardContent from "@/components/DashboardContent";
import OlympicStepper from "@/components/OlympicStepper";
import ChallengeForm, {
  Question,
} from "@/app/dashboard/challenges/[challengeId]/components/ChallengeForm";
import StagePhaseNavigation from "@/app/dashboard/challenges/[challengeId]/components/StagePhaseNavigation";
import { QuestionType } from "./components/questionTypes";
import { getDemoChallenges } from "@/src/data/demo-data";
import { useChallengeFormUIStore } from "@/src/stores/challenge-form-ui.store";

export default function ChallengeEditPage() {
  const router = useRouter();
  const params = useParams();
  const challengeId = params.challengeId as string;
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentChallengeId, addStage, stages } = useChallengeFormUIStore();
  const [grade, setGrade] = useState("");
  const [challengeType, setChallengeType] = useState<"regular" | "bilingual">(
    "regular"
  );
  const [isDemo, setIsDemo] = useState(false);
  const [challengeName, setChallengeName] = useState("");
  const [questionsByArea, setQuestionsByArea] = useState<{
    [key: string]: Question[];
  }>({
    Vocabulary: [],
    Grammar: [],
    Listening: [],
    Writing: [],
    Speaking: [],
  });

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        setIsLoading(true);
        // Set challenge ID in UI store
        setCurrentChallengeId(challengeId);

        // First, try to load from localStorage (for newly created challenges)
        const savedChallenge = localStorage.getItem(`challenge-${challengeId}`);

        if (savedChallenge) {
          const challenge = JSON.parse(savedChallenge);
          setGrade(challenge.grade);
          setChallengeType(challenge.type);
          setIsDemo(challenge.isDemo || false);
          setChallengeName(challenge.name);
          setIsLoading(false);
          return;
        }

        // If not in localStorage, try to load from demo data
        const challenges = await getDemoChallenges();
        const challenge = challenges.find((c) => c.id === challengeId);

        if (challenge) {
          setGrade(challenge.grade);
          setChallengeType(challenge.type);
          setIsDemo(challenge.isDemo || false);
          setChallengeName(challenge.name);
          // If challenge has questions, load them here
          // For now, start with empty questions
        } else {
          // Challenge doesn't exist, but allow editing anyway (for new challenges)
          // The data will be loaded from the redirect state or localStorage
          console.warn("Challenge not found, but continuing with edit mode");
        }
      } catch (error) {
        console.error("Error loading challenge:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (challengeId) {
      loadChallenge();
    }
  }, [challengeId, setCurrentChallengeId]);

  // Initialize with first stage if no stage is set
  useEffect(() => {
    if (!isLoading && stages.length === 0) {
      // Add the first stage (Vocabulary) by default
      addStage("vocabulary");
    }
  }, [isLoading, stages.length, addStage]);

  const handleAddQuestion = (area: string, questionType?: QuestionType) => {
    const { currentStage, currentPhase } = useChallengeFormUIStore.getState();
    
    // Default question text based on question type
    let defaultQuestionText = "";
    if (questionType?.id === "image_to_multiple_choice_text") {
      defaultQuestionText = "Select the correct word for the image";
    }
    
    const newQuestion: Question = {
      id: `q-${Date.now()}-${Math.random()}`,
      question: defaultQuestionText,
      type: questionType?.id || "multiple_choice",
      questionTypeName: questionType?.name || "Multiple Choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      phase: currentPhase || undefined,
      stage: currentStage || undefined,
    };

    setQuestionsByArea((prev) => ({
      ...prev,
      [area]: [...prev[area], newQuestion],
    }));
  };

  const handleRemoveQuestion = (area: string, questionId: string) => {
    setQuestionsByArea((prev) => ({
      ...prev,
      [area]: prev[area].filter((q) => q.id !== questionId),
    }));
  };

  const handleQuestionChange = (
    area: string,
    questionId: string,
    field: string,
    value: string | string[] | undefined
  ) => {
    setQuestionsByArea((prev) => ({
      ...prev,
      [area]: prev[area].map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      ),
    }));
  };

  const handleOptionChange = (
    area: string,
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestionsByArea((prev) => {
      const updatedQuestions = prev[area].map((q) => {
        if (q.id === questionId) {
          const newOptions = [...(q.options || [])];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      });
      return { ...prev, [area]: updatedQuestions };
    });
  };

  const handleSubmit = () => {
    // Calculate totals
    const totalQuestions = Object.values(questionsByArea).reduce(
      (sum, questions) => sum + questions.length,
      0
    );

    const challenge = {
      name: challengeName,
      grade,
      type: challengeType,
      isDemo,
      areas: {
        Vocabulary: questionsByArea.Vocabulary.length,
        Grammar: questionsByArea.Grammar.length,
        Listening: questionsByArea.Listening.length,
        Writing: questionsByArea.Writing.length,
        Speaking: questionsByArea.Speaking.length,
      },
      totalQuestions,
      totalTime: Math.ceil(totalQuestions * 4), // Approximate 4 minutes per question
      questionsByArea,
      status: "pending" as const,
    };

    console.log("Creating challenge:", challenge);
    // TODO: Save to backend
    router.push("/dashboard/challenges");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <DashboardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0098] mb-4"></div>
            <p className="text-gray-600">Loading challenge...</p>
          </div>
        </DashboardContent>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <DashboardContent>
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-1">
            {challengeName
              ? `${challengeName} (${isDemo ? "Demo" : "Live"})`
              : "Edit Challenge"}
          </h1>
        </div>

        {/* Olympic Stepper */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
          <OlympicStepper />
        </div>

        {/* Stage and Phase Navigation */}
        <StagePhaseNavigation />

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <ChallengeForm
            questionsByArea={questionsByArea}
            onAddQuestion={handleAddQuestion}
            onRemoveQuestion={handleRemoveQuestion}
            onQuestionChange={handleQuestionChange}
            onOptionChange={handleOptionChange}
            onSubmit={handleSubmit}
            onBack={() => router.push("/dashboard/challenges")}
          />
        </div>
      </DashboardContent>
    </div>
  );
}
