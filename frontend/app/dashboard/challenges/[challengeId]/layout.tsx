import { Step, StepperProvider } from "@/src/providers/StepperProvider";
import { PropsWithChildren } from "react";

const olympicSteps: Step[] = [
  {
    id: 1,
    name: "Vocabulary",
    color: "#f2bf3c", // Yellow
  },
  {
    id: 2,
    name: "Grammar",
    color: "#E63946", // Red
  },
  {
    id: 3,
    name: "Listening",
    color: "#44b07f", // Green
  },
  {
    id: 4,
    name: "Writing",
    color: "#006AA7", // Blue
  },
  {
    id: 5,
    name: "Speaking",
    color: "#9000d9", // Purple
  },
];

const ChallengesLayout = ({ children }: PropsWithChildren) => {
  return <StepperProvider steps={olympicSteps}>{children}</StepperProvider>;
};

export default ChallengesLayout;
