"use client";
import { useStepper } from "@/hooks/useStepper";
import { cn } from "@/lib/utils";

const OlympicStepper: React.FC = () => {
  const { steps, currentStep, goToStep } = useStepper();

  return (
    <div className="w-full mx-auto px-2 py-2">
      <div
        className="relative flex items-start"
        style={{ justifyContent: "space-between" }}
      >
        {steps.map((step, i) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const ringSize = "w-14 h-14";
          const isLastStep = i === steps.length - 1;

          return (
            <div
              key={step.id + "-ring-" + i}
              className="relative flex flex-col items-center gap-2"
              style={{
                zIndex: 50,
                flex: "1 1 0",
              }}
            >
              {/* Progress line - from center of this circle to center of next */}
              {!isLastStep && (
                <div
                  className="absolute top-7 h-1.5 z-10 rounded-full"
                  style={{
                    left: "calc(50% + 7px)",
                    right: "calc(-50% + 7px)",
                    background:
                      currentStep > step.id
                        ? `linear-gradient(to right, ${step.color} 0%, ${
                            step.color
                          } 35%, ${steps[i + 1]?.color || step.color} 65%, ${
                            steps[i + 1]?.color || step.color
                          } 100%)`
                        : "#E5E7EB",
                    transition: "background 0.3s ease",
                  }}
                />
              )}

              {/* Olympic Ring Circle - Clickable Button */}
              <button
                type="button"
                onClick={() => goToStep(step.id)}
                className={cn(
                  "rounded-full border-4 flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105",
                  ringSize,
                  isActive
                    ? "transform shadow-lg"
                    : ""
                )}
                style={{
                  borderColor: step.color,
                  borderWidth: isActive ? "4px" : "3px",
                  backgroundColor: isActive ? step.color : "white",
                  zIndex: 100,
                }}
              >
                <span
                  className={cn(
                    "text-lg font-bold",
                    isActive ? "text-white" : ""
                  )}
                  style={{ color: isActive ? "white" : step.color }}
                >
                  {step.id}
                </span>
              </button>

              {/* Label - Clickable Button */}
              <button
                type="button"
                onClick={() => goToStep(step.id)}
                className={cn(
                  "text-center max-w-[120px] px-2 py-1 rounded-md transition-all duration-300 cursor-pointer hover:bg-gray-100",
                  isActive || isCompleted ? "text-gray-900 font-semibold" : "text-gray-400 font-medium"
                )}
              >
                <p className="text-sm">
                  {step.name}
                </p>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OlympicStepper;
