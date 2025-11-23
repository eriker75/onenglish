"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DashboardContent from "@/components/DashboardContent";
import OlympicStepper from "@/components/OlympicStepper";
import ChallengeForm, {
  Question,
  QuestionFieldValue,
} from "@/app/dashboard/challenges/[challengeId]/components/ChallengeForm";
import QuestionTypeNavigation from "./components/QuestionTypeNavigation";
import { getDemoChallenges } from "@/src/data/demo-data";
import { useChallengeFormUIStore } from "@/src/stores/challenge-form-ui.store";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
import api from "@/src/config/axiosInstance"; // Import axios instance

export default function ChallengeEditPage() {
  const router = useRouter();
  const params = useParams();
  const challengeId = params.challengeId as string;
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentChallengeId, addStage, stages } = useChallengeFormUIStore();
  const { updateChallengeField } = useChallengeFormStore();
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

  const loadChallenge = useCallback(async () => {
    try {
      setIsLoading(true);
      // Set challenge ID in UI store
      setCurrentChallengeId(challengeId);
      // Set challenge ID in data store (needed for wrappers)
      updateChallengeField("id", challengeId);

      // Fetch challenge details from API
      try {
        const response = await api.get(`/challenges/${challengeId}`);
        const challenge = response.data;

        if (challenge) {
           setGrade(challenge.grade);
           setChallengeType(challenge.type);
           setIsDemo(challenge.isDemo || false);
           setChallengeName(challenge.title); // Assuming 'title' is the property name from API

           // Map questions from API response to questionsByArea structure
           // We need to implement mapping logic based on API response structure
           // For now, let's assume the API returns questions in a format we can map
           // Or we fetch questions separately if needed. 
           // If the challenge object contains questions, map them:
           
           if (challenge.questions && Array.isArray(challenge.questions)) {
             const mappedQuestionsByArea: { [key: string]: Question[] } = {
                Vocabulary: [],
                Grammar: [],
                Listening: [],
                Writing: [],
                Speaking: [],
             };

             challenge.questions.forEach((q: any) => {
               // Determine area based on q.stage or q.type
               // Ensure q.stage matches our keys "Vocabulary", "Grammar", etc.
               // If stage is uppercase "VOCABULARY", convert to Title Case if needed, 
               // but our keys are Title Case.
               
               // Helper to format stage name
               const formatStage = (stage: string) => {
                 if (!stage) return "Vocabulary"; // Default fallback
                 return stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase();
               };

               const area = formatStage(q.stage);
               if (mappedQuestionsByArea[area]) {
                 mappedQuestionsByArea[area].push({
                   id: q.id,
                   question: q.text || q.question || "", // Handle various potential field names
                   type: q.type,
                   questionTypeName: q.type, // Or map to readable name
                   options: q.options,
                   correctAnswer: q.answer,
                   stage: q.stage
                   // Add other fields as needed
                 });
               }
             });
             setQuestionsByArea(mappedQuestionsByArea);
           }
        }
      } catch (apiError) {
         console.error("Error fetching challenge from API, falling back to demo/local", apiError);
         // Fallback logic (keep existing demo/local storage logic as fallback)
          const savedChallenge = localStorage.getItem(`challenge-${challengeId}`);
          if (savedChallenge) {
            const challenge = JSON.parse(savedChallenge);
            setGrade(challenge.grade);
            setChallengeType(challenge.type);
            setIsDemo(challenge.isDemo || false);
            setChallengeName(challenge.name);
            // Load questions if stored locally?
          } else {
             const challenges = await getDemoChallenges();
             const challenge = challenges.find((c) => c.id === challengeId);
             if (challenge) {
                setGrade(challenge.grade);
                setChallengeType(challenge.type);
                setIsDemo(challenge.isDemo || false);
                setChallengeName(challenge.name);
             }
          }
      }

    } catch (error) {
      console.error("Error loading challenge:", error);
    } finally {
      setIsLoading(false);
    }
  }, [challengeId, setCurrentChallengeId, updateChallengeField]);

  useEffect(() => {
    if (challengeId) {
      loadChallenge();
    }
  }, [challengeId, loadChallenge]);

  // Initialize with first stage if no stage is set
  useEffect(() => {
    if (!isLoading && stages.length === 0) {
      // Add the first stage (Vocabulary) by default
      addStage("vocabulary");
    }
  }, [isLoading, stages.length, addStage]);

  const handleRemoveQuestion = async (area: string, questionId: string) => {
     // Call API to remove question
     try {
        // Assuming endpoint like DELETE /questions/:id
        // We need to know which endpoint to hit. Since we have questionId, maybe generic?
        // Or we rely on wrapper or specific logic.
        // But here we just update local state or refetch?
        // If we want to delete from DB, we should call API.
        
        // Assuming we have a delete endpoint, let's try generic
        // await api.delete(`/questions/${questionId}`); // Uncomment when ready
        
        // Then update local state
        setQuestionsByArea((prev) => ({
          ...prev,
          [area]: prev[area].filter((q) => q.id !== questionId),
        }));
        
        // Optionally refetch to be sure
        // loadChallenge(); 
     } catch (error) {
       console.error("Failed to delete question", error);
       // Show toast error?
     }
  };

  const handleQuestionChange = (
    area: string,
    questionId: string,
    field: string,
    value: QuestionFieldValue
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
  
  // Callback to refresh data when a question is created/updated via wrapper
  const handleDataRefresh = () => {
      loadChallenge();
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
