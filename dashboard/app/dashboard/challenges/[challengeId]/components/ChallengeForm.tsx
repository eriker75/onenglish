"use client";

import { useStepper } from "@/hooks/useStepper";
import { useChallengeFormUIStore } from "@/src/stores/challenge-form-ui.store";
import { useEffect } from "react";
import QuestionsSection, { Question, QuestionFieldValue } from "./QuestionsSection";
import FormNavigation from "./FormNavigation";
import { QuestionType } from "./questionTypes";

interface ChallengeFormProps {
  questionsByArea: { [key: string]: Question[] };
  onAddQuestion: (area: string, questionType?: QuestionType) => void;
  onRemoveQuestion: (area: string, questionId: string) => void;
  onQuestionChange: (
    area: string,
    questionId: string,
    field: string,
    value: QuestionFieldValue
  ) => void;
  onOptionChange: (
    area: string,
    questionId: string,
    optionIndex: number,
    value: string
  ) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function ChallengeForm({
  questionsByArea,
  onAddQuestion,
  onRemoveQuestion,
  onQuestionChange,
  onOptionChange,
  onSubmit,
  onBack,
}: ChallengeFormProps) {
  const { currentStep, nextStep, prevStep, steps, goToStep } = useStepper();
  const {
    currentStage,
    setCurrentStage,
    addStage,
    setCurrentQuestionType,
  } = useChallengeFormUIStore();

  // Set stage from stepper when it changes (single source of truth: stepper)
  useEffect(() => {
    const currentArea = steps[currentStep - 1]?.name;
    if (currentArea) {
      const stageName = currentArea.toLowerCase();
      const state = useChallengeFormUIStore.getState();
      
      // Only update if different to avoid loops
      if (stageName !== state.currentStage) {
        // Reset question type filter when stage changes
        setCurrentQuestionType(null);
        
        // Add stage if it doesn't exist
        if (!state.stages.includes(stageName as any)) {
          addStage(stageName as any);
        } else {
          // Only set if it's actually different
          setCurrentStage(stageName as any);
        }
      }
    }
    // Only depend on currentStep - the stepper is the source of truth
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, steps]);

  const currentArea = steps[currentStep - 1]?.name || "";
  const currentQuestions = questionsByArea[currentArea] || [];

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;
  const currentStepColor = steps[currentStep - 1]?.color || "#666666";
  // Get the previous step color (or null if first step)
  const previousStepColor = !isFirstStep ? steps[currentStep - 2]?.color : null;

  const canProceed = () => {
    return currentQuestions.length > 0;
  };

  return (
    <div className="space-y-6">
      {/* All Steps: Question Forms by Area */}
      <QuestionsSection
        area={currentArea}
        questions={currentQuestions}
        onAddQuestion={onAddQuestion}
        onRemoveQuestion={onRemoveQuestion}
        onQuestionChange={onQuestionChange}
        onOptionChange={onOptionChange}
      />
      {/* Navigation Buttons */}
      <FormNavigation
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        canProceed={canProceed()}
        currentStepColor={currentStepColor}
        previousStepColor={previousStepColor}
        onBack={onBack}
        onPrevious={prevStep}
        onNext={nextStep}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export type { Question, QuestionFieldValue };
