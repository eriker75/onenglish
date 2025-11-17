"use client";
import React, { createContext, useState, ReactNode } from "react";

export type Step = {
  id: number;
  name: string;
  color: string;
};

export type StepperContextType = {
  steps: Step[];
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setSteps: (steps: Step[]) => void;
};

export const StepperContext = createContext<StepperContextType | undefined>(
  undefined
);

export type StepperProviderProps = {
  children: ReactNode;
  steps: Step[];
};

export const StepperProvider: React.FC<StepperProviderProps> = ({
  children,
  steps: providedSteps,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [steps, setSteps] = useState(providedSteps);

  const nextStep = () => {
    setCurrentStep((prev) => (prev < steps.length ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step);
    }
  };

  return (
    <StepperContext.Provider
      value={{ currentStep, nextStep, prevStep, goToStep, steps, setSteps }}
    >
      {children}
    </StepperContext.Provider>
  );
};
