import { useContext } from "react";
import { StepperContext, StepperContextType } from "@/src/providers/StepperProvider";

export const useStepper = (): StepperContextType => {
  const context = useContext(StepperContext);

  if (!context) {
    throw new Error("useStepper must be used within a StepperProvider");
  }

  return context;
};
