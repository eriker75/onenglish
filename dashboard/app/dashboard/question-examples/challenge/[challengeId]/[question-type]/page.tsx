"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DashboardContent from "@/components/DashboardContent";
import { questionTypesByArea, QuestionType } from "@/app/dashboard/challenges/[challengeId]/components/questionTypes";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import * as QuestionBlocks from "@/app/dashboard/challenges/[challengeId]/components/question-blocks";
import TopicBasedAudioWrapper from "@/app/dashboard/challenges/[challengeId]/components/question-blocks-wrappers/TopicBasedAudioWrapper";
import ImageToMultipleChoiceWrapper from "@/app/dashboard/challenges/[challengeId]/components/question-blocks-wrappers/ImageToMultipleChoiceWrapper";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";

export default function QuestionTypeExampleWithChallengePage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.challengeId as string;
  const urlQuestionTypeId = params["question-type"] as string;
  
  const setChallengeData = useChallengeFormStore((state) => state.setChallengeData);
  const challenge = useChallengeFormStore((state) => state.challenge);

  // Initialize store with challengeId
  useEffect(() => {
    if (challengeId) {
      setChallengeData({ id: challengeId });
    }
  }, [challengeId, setChallengeData]);
  
  // Convertir guiones medios de la URL de vuelta a guiones bajos para buscar en questionTypes
  const questionTypeId = urlQuestionTypeId.replace(/-/g, '_');

  // Buscar el tipo de pregunta en todas las áreas
  let questionType: QuestionType | undefined;
  for (const types of Object.values(questionTypesByArea)) {
    questionType = types.find((t) => t.id === questionTypeId);
    if (questionType) break;
  }

  if (!questionType) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <DashboardContent>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Question Type Not Found</h1>
            <p className="text-gray-600 mb-6">
              The question type &quot;{questionTypeId}&quot; does not exist.
            </p>
            <button
              onClick={() => router.push("/dashboard/question-examples")}
              className="px-4 py-2 bg-[#44b07f] text-white rounded-lg hover:bg-[#44b07f]/90 transition-colors"
            >
              Back to Examples
            </button>
          </div>
        </DashboardContent>
      </div>
    );
  }

  // Mapeo de IDs de tipos de pregunta a componentes
  const componentMap: { [key: string]: React.ComponentType<any> } = {
    // Vocabulary
    image_to_multiple_choices: ImageToMultipleChoiceWrapper,
    wordbox: QuestionBlocks.WordBox,
    spelling: QuestionBlocks.Spelling,
    word_associations: QuestionBlocks.WordAssociationsWithText,
    // Grammar
    unscramble: QuestionBlocks.Unscramble,
    tenses: QuestionBlocks.Tenses,
    tag_it: QuestionBlocks.TagIt,
    report_it: QuestionBlocks.ReportIt,
    read_it: QuestionBlocks.ReadIt,
    // Listening
    word_match: QuestionBlocks.WordMatch,
    gossip: QuestionBlocks.Gossip,
    topic_based_audio: TopicBasedAudioWrapper,
    lyrics_training: QuestionBlocks.LyricsTraining,
    // Writing
    sentence_maker: QuestionBlocks.SentenceMaker,
    fast_test: QuestionBlocks.FastTest,
    tales: QuestionBlocks.Tales,
    // Speaking
    superbrain: QuestionBlocks.SuperBrain,
    tell_me_about_it: QuestionBlocks.TellMeAboutIt,
    debate: QuestionBlocks.Debate,
  };

  // Renderizar el componente según el tipo de pregunta
  const renderQuestionComponent = () => {
    if (!questionType) return null;

    const Component = componentMap[questionTypeId];

    if (!Component) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">
            Component for &quot;{questionType.name}&quot; is not yet implemented.
          </p>
          <p className="text-yellow-600 text-sm mt-2">
            This question type component will be available soon.
          </p>
        </div>
      );
    }

    return <Component />;
  };

  const Icon = questionType.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <DashboardContent>
        <div className="space-y-6">
          {/* Header con botón de regreso */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard/question-examples")}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to examples"
            >
              <ArrowBackIcon />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Icon className="text-gray-600" />
              </div>
              <div>
                <h1 className="font-heading text-3xl font-bold text-gray-900">
                  {questionType.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                   <span>{questionType.description}</span>
                   <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Challenge ID: {challengeId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Componente de ejemplo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {renderQuestionComponent()}
          </div>
          
          <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
             <h3 className="font-bold text-gray-700 mb-2">Debug Info</h3>
             <p className="text-sm text-gray-600">Current Store Challenge ID: {challenge.id || "Not set"}</p>
          </div>
        </div>
      </DashboardContent>
    </div>
  );
}

