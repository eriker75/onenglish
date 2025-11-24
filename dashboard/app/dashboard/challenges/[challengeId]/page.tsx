"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DashboardContent from "@/components/DashboardContent";
import OlympicStepper from "@/components/OlympicStepper";
import ChallengeForm from "@/app/dashboard/challenges/[challengeId]/components/ChallengeForm";
import QuestionTypeNavigation from "./components/QuestionTypeNavigation";
import { useChallengeFormUIStore } from "@/src/stores/challenge-form-ui.store";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import { useChallenge, useDeleteQuestion, Question } from "@/src/hooks/useChallenge";
import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";

// Helper function to group questions by stage (flat structure)
function flatGroupQuestionsByStage(questions: Question[]): { [key: string]: Question[] } {
  const grouped: { [key: string]: Question[] } = {
    Vocabulary: [],
    Grammar: [],
    Listening: [],
    Writing: [],
    Speaking: [],
  };

  questions.forEach((q) => {
    const formatStage = (stage: string) => {
      if (!stage) return "Vocabulary"; // Default fallback
      return stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase();
    };

    const stageName = formatStage(q.stage || "");
    if (grouped[stageName]) {
      grouped[stageName].push(q);
    }
  });

  return grouped;
}

export default function ChallengeEditPage() {
  const router = useRouter();
  const params = useParams();
  const challengeId = params.challengeId as string;

  // UI Stores (navigation state only)
  const { setCurrentChallengeId, addStage, stages } = useChallengeFormUIStore();
  const { setCurrentChallengeId: setUIChallengeId } = useChallengeUIStore();
  const { updateChallengeField } = useChallengeFormStore();

  // React Query - Source of truth for data
  const {
    data: challenge,
    isLoading,
    error,
    refetch,
  } = useChallenge(challengeId);

  // Delete mutation
  const deleteQuestionMutation = useDeleteQuestion();

  // Set challenge ID in stores when component mounts
  useEffect(() => {
    if (challengeId) {
      setCurrentChallengeId(challengeId);
      setUIChallengeId(challengeId);
      updateChallengeField("id", challengeId);
    }
  }, [challengeId, setCurrentChallengeId, setUIChallengeId, updateChallengeField]);

  // Log when challenge data changes
  useEffect(() => {
    if (challenge) {
      console.log("📊 [PAGE] Challenge data updated:", {
        id: challenge.id,
        questionsCount: challenge.questions?.length || 0,
        questions: challenge.questions,
      });
    }
  }, [challenge]);

  // Initialize with first stage if no stage is set
  useEffect(() => {
    if (!isLoading && stages.length === 0) {
      addStage("vocabulary");
    }
  }, [isLoading, stages.length, addStage]);

  // Derive questionsByArea from React Query data
  const questionsByArea = challenge?.questions
    ? flatGroupQuestionsByStage(challenge.questions)
    : {
        Vocabulary: [],
        Grammar: [],
        Listening: [],
        Writing: [],
        Speaking: [],
      };

  // Handlers
  const handleRemoveQuestion = async (area: string, questionId: string) => {
    try {
      // Find question type from questions
      const question = challenge?.questions.find((q) => q.id === questionId);
      if (!question) return;

      await deleteQuestionMutation.mutateAsync({
        questionId,
        challengeId, // Pass challengeId for specific cache update
        questionType: question.type,
      });
    } catch (error) {
      console.error("Failed to delete question", error);
    }
  };

  const handleQuestionChange = (
    area: string,
    questionId: string,
    field: string,
    value: any
  ) => {
    // With React Query, we don't need optimistic updates here
    // The mutations in the wrappers handle this
    console.log("Question changed:", { area, questionId, field, value });
  };

  const handleOptionChange = (
    area: string,
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    // With React Query, we don't need optimistic updates here
    console.log("Option changed:", { area, questionId, optionIndex, value });
  };

  const handleSubmit = () => {
    console.log("Submitting challenge:", challenge);
    router.push("/dashboard/challenges");
  };

  const handleDataRefresh = () => {
    console.log("🔄 [PAGE] handleDataRefresh called - manually refetching challenge data");
    // Refetch is handled automatically by React Query mutations
    // But we can manually refetch if needed
    refetch().then(() => {
      console.log("✅ [PAGE] Refetch completed, new data:", challenge);
    });
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <DashboardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 mb-4">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Error loading challenge</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-[#FF0098] text-white rounded-lg hover:bg-[#e0008a]"
            >
              Try Again
            </button>
          </div>
        </DashboardContent>
      </div>
    );
  }

  // No challenge found
  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <DashboardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600 mb-4">Challenge not found</p>
            <button
              onClick={() => router.push("/dashboard/challenges")}
              className="px-4 py-2 bg-[#FF0098] text-white rounded-lg hover:bg-[#e0008a]"
            >
              Back to Challenges
            </button>
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
            {challenge.title
              ? `${challenge.title} (${challenge.isDemo ? "Demo" : "Live"})`
              : "Edit Challenge"}
          </h1>
        </div>

        {/* Olympic Stepper */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
          <OlympicStepper />
        </div>

        {/* Question Type Navigation */}
        <QuestionTypeNavigation questionsByArea={questionsByArea} />

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <ChallengeForm
            questionsByArea={questionsByArea}
            onRemoveQuestion={handleRemoveQuestion}
            onQuestionChange={handleQuestionChange}
            onOptionChange={handleOptionChange}
            onSubmit={handleSubmit}
            onBack={() => router.push("/dashboard/challenges")}
            onSuccess={handleDataRefresh}
          />
        </div>
      </DashboardContent>
    </div>
  );
}
