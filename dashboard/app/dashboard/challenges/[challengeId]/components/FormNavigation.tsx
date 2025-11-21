"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";

interface FormNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
  currentStepColor: string;
  previousStepColor: string | null;
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function FormNavigation({
  isFirstStep,
  isLastStep,
  canProceed,
  currentStepColor,
  previousStepColor,
  onBack,
  onPrevious,
  onNext,
  onSubmit,
}: FormNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      <button
        onClick={isFirstStep ? onBack : onPrevious}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
          isFirstStep
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
            : "text-white hover:opacity-90"
        }`}
        style={!isFirstStep && previousStepColor ? {
          backgroundColor: previousStepColor,
        } : undefined}
      >
        <ArrowBackIcon /> {isFirstStep ? "Back to Challenges" : "Previous"}
      </button>

      {!isLastStep ? (
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: currentStepColor,
          }}
        >
          Next <ArrowForwardIcon />
        </button>
      ) : (
        <button
          onClick={onBack}
          disabled={!canProceed}
          className="flex items-center gap-2 px-6 py-3 bg-[#9000d9] text-white rounded-lg font-medium hover:bg-[#9000d9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckIcon /> Create Challenge
        </button>
      )}
    </div>
  );
}
