"use client";
import { useEffect } from "react";
import { useStepper } from "@/hooks/useStepper";
import { useChallengeFormUIStore } from "@/src/stores/challenge-form-ui.store";
import { questionTypesByArea, QuestionType } from "./questionTypes";
import { Question } from "./ChallengeForm";

interface QuestionTypeNavigationProps {
  questionsByArea: {
    [key: string]: Question[];
  };
}

export default function QuestionTypeNavigation({
  questionsByArea,
}: QuestionTypeNavigationProps) {
  const { currentStep, steps } = useStepper();
  const { currentQuestionType, setCurrentQuestionType } =
    useChallengeFormUIStore();

  // Get current stage directly from stepper (single source of truth)
  const currentArea = steps[currentStep - 1]?.name || "";
  const currentStage = currentArea.toLowerCase();

  // Reset currentQuestionType when stage changes - ensure it exists in the new stage's question types
  // This must be called before any early returns to follow Rules of Hooks
  useEffect(() => {
    if (!currentArea) return;

    const normalized = currentArea.charAt(0).toUpperCase() + currentArea.slice(1).toLowerCase();
    const types = questionTypesByArea[normalized] || [];

    if (types.length === 0) {
      // If no question types available for this stage, reset the filter
      if (currentQuestionType) {
        setCurrentQuestionType(null);
      }
      return;
    }

    // If there's a current question type, check if it exists in the new stage
    if (currentQuestionType) {
      const typeExists = types.some((type) => type.id === currentQuestionType);
      if (!typeExists) {
        setCurrentQuestionType(null);
      }
    }
  }, [currentArea, currentQuestionType, setCurrentQuestionType]);

  if (!currentArea) return null;

  // Normalize stage name to match questionTypesByArea keys (capitalize first letter)
  const normalizedStage = currentArea.charAt(0).toUpperCase() + currentArea.slice(1).toLowerCase();

  // Get question types for current stage
  const questionTypes = questionTypesByArea[normalizedStage] || [];

  // Get questions for current stage (map stage name to area name)
  // Try both normalized and original stage name
  const stageQuestions = questionsByArea[normalizedStage] || questionsByArea[currentArea] || [];

  // Count questions by type
  const getQuestionCount = (typeId: string): number => {
    return stageQuestions.filter((q) => q.type === typeId).length;
  };

  // Colors by stage - cada stage tiene su color distintivo con RGB personalizados
  const stageColors: { [key: string]: { main: string; hover: string; ring: string } } = {
    Vocabulary: {
      main: "rgb(242, 191, 60)", // Amarillo
      hover: "rgb(232, 181, 50)",
      ring: "rgba(242, 191, 60, 0.5)"
    },
    Grammar: {
      main: "rgb(230, 57, 70)", // Rojo
      hover: "rgb(220, 47, 60)",
      ring: "rgba(230, 57, 70, 0.5)"
    },
    Listening: {
      main: "rgb(68, 176, 127)", // Verde
      hover: "rgb(58, 166, 117)",
      ring: "rgba(68, 176, 127, 0.5)"
    },
    Writing: {
      main: "rgb(0, 106, 167)", // Azul
      hover: "rgb(0, 96, 157)",
      ring: "rgba(0, 106, 167, 0.5)"
    },
    Speaking: {
      main: "rgb(144, 0, 217)", // Morado
      hover: "rgb(134, 0, 207)",
      ring: "rgba(144, 0, 217, 0.5)"
    },
  };

  const stageColor = stageColors[normalizedStage] || {
    main: "rgb(107, 114, 128)",
    hover: "rgb(97, 104, 118)",
    ring: "rgba(107, 114, 128, 0.5)"
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Filter by Question Type
      </h3>
      <div className="flex flex-wrap gap-3">
        {/* Individual question type buttons - Show ALL types for current stage, even with 0 count */}
        {questionTypes.map((type: QuestionType) => {
          const count = getQuestionCount(type.id);
          const isActive = currentQuestionType === type.id;
          const IconComponent = type.icon;

          return (
            <button
              key={type.id}
              onClick={() => setCurrentQuestionType(type.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all text-white
                ${
                  isActive
                    ? "shadow-lg ring-2 scale-105"
                    : "opacity-80"
                }
              `}
              style={{
                backgroundColor: stageColor.main,
                ...(isActive && {
                  boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 2px ${stageColor.ring}`
                })
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = stageColor.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = stageColor.main}
            >
              {IconComponent && (
                <IconComponent
                  style={{ fontSize: 20 }}
                  className="text-white"
                />
              )}
              <span className="text-sm">{type.name}</span>
              <span className="text-sm font-normal opacity-90">({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
