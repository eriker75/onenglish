"use client";

import { useEffect, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useChallengeFormUIStore } from "@/src/stores/challenge-form-ui.store";
import { useStepper } from "@/hooks/useStepper";

// Convert phase name from "phase_1" to "Phase 1" for display
const formatPhaseName = (phaseName: string): string => {
  if (phaseName.startsWith("phase_")) {
    const number = phaseName.replace("phase_", "");
    return `Phase ${number}`;
  }
  return phaseName;
};

// Get stage color from step
const getStageColor = (stageName: string, steps: any[]): string => {
  const step = steps.find((s) => s.name.toLowerCase() === stageName.toLowerCase());
  return step?.color || "#666666";
};

export default function StagePhaseNavigation() {
  const { steps, currentStep } = useStepper();
  const currentStepData = steps[currentStep - 1];
  const currentStageName = currentStepData?.name.toLowerCase() || "";
  
  const {
    currentStage,
    currentPhase,
    currentPhaseIndex,
    stagePhases,
    setCurrentStage,
    setCurrentPhase,
    addStage,
    addPhase,
    nextPhase,
    prevPhase,
    getCurrentStagePhases,
  } = useChallengeFormUIStore();

  // Sync currentStage with stepper (only when stepper changes, not when store changes)
  useEffect(() => {
    if (currentStageName) {
      const state = useChallengeFormUIStore.getState();
      // Only update if the stepper stage is different from store stage
      if (currentStageName !== state.currentStage) {
        // Add stage if it doesn't exist
        if (!state.stages.includes(currentStageName as any)) {
          addStage(currentStageName as any);
        } else {
          setCurrentStage(currentStageName as any);
        }
      }
    }
    // Only depend on currentStageName, not currentStage to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStageName]);

  const currentPhases = currentStage ? getCurrentStagePhases() : [];
  const currentStageColor = currentStage ? getStageColor(currentStage, steps) : "#666666";
  const currentStageDisplayName = currentStepData?.name || "";
  const phaseButtonsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when phase changes
  useEffect(() => {
    if (phaseButtonsContainerRef.current && currentPhaseIndex >= 0) {
      const container = phaseButtonsContainerRef.current;
      const buttons = container.querySelectorAll('button');
      const activeButton = buttons[currentPhaseIndex] as HTMLElement;
      
      if (activeButton) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        
        // Check if button is out of view
        const isOutOfViewLeft = buttonRect.left < containerRect.left;
        const isOutOfViewRight = buttonRect.right > containerRect.right;
        
        if (isOutOfViewLeft) {
          // Scroll to show button on the left
          activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        } else if (isOutOfViewRight) {
          // Scroll to show button on the right
          activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
        }
      }
    }
  }, [currentPhaseIndex, currentPhases.length]);

  const handleAddPhase = () => {
    if (currentStage) {
      const phases = stagePhases[currentStage] || [];
      const newPhaseNumber = phases.length + 1;
      addPhase(currentStage, `phase_${newPhaseNumber}`);
    }
  };

  const handlePhaseChange = (phaseIndex: number) => {
    if (currentStage && phaseIndex >= 0 && phaseIndex < currentPhases.length) {
      setCurrentPhase(currentPhases[phaseIndex]);
    }
  };

  if (!currentStage) {
    return null;
  }

  return (
    <div className="mb-6">
      {/* Phase Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentStageDisplayName} Phases
            </h3>
            <p className="text-sm text-gray-600">
              {currentPhases.length === 0
                ? "No phases added yet. Add your first phase to start adding questions."
                : `${formatPhaseName(currentPhase || currentPhases[0] || "")} of ${currentPhases.length}`
              }
            </p>
          </div>
          <button
            onClick={handleAddPhase}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF0098] text-white rounded-lg hover:bg-[#FF0098]/90 transition-colors font-medium"
          >
            <AddIcon /> Add Phase
          </button>
        </div>

        {currentPhases.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevPhase}
              disabled={currentPhaseIndex === 0}
              className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowBackIcon />
            </button>

            {/* Phase buttons with pagination */}
            <div 
              ref={phaseButtonsContainerRef}
              className="flex items-center gap-2 flex-1 overflow-x-auto scroll-smooth"
            >
              {currentPhases.map((phase, index) => {
                const isCurrent = index === currentPhaseIndex;
                const phaseDisplayName = formatPhaseName(phase);

                return (
                  <button
                    key={phase}
                    onClick={() => handlePhaseChange(index)}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap
                      ${isCurrent
                        ? "text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }
                    `}
                    style={isCurrent ? { backgroundColor: currentStageColor } : undefined}
                  >
                    {phaseDisplayName}
                  </button>
                );
              })}
            </div>

            <button
              onClick={nextPhase}
              disabled={currentPhaseIndex >= currentPhases.length - 1}
              className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowForwardIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

