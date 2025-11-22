"use client";

import React, { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface TensesProps {
  question?: string;
  instructions?: string;
  sentence?: string;
  correctAnswer?: string;
  options?: string[];
  points?: number;
  timeMinutes?: number;
  timeSeconds?: number;
  maxAttempts?: number;
  onQuestionChange?: (question: string) => void;
  onInstructionsChange?: (instructions: string) => void;
  onSentenceChange?: (sentence: string) => void;
  onCorrectAnswerChange?: (answer: string) => void;
  onOptionsChange?: (options: string[]) => void;
  onPointsChange?: (points: number) => void;
  onTimeMinutesChange?: (minutes: number) => void;
  onTimeSecondsChange?: (seconds: number) => void;
  onMaxAttemptsChange?: (attempts: number) => void;
}

const verbTenses = [
  { label: "Present Simple", value: "present_simple" },
  { label: "Present Continuous", value: "present_continuous" },
  { label: "Present Perfect", value: "present_perfect" },
  { label: "Past Simple", value: "past_simple" },
  { label: "Past Continuous", value: "past_continuous" },
  { label: "Past Perfect", value: "past_perfect" },
  { label: "Future Simple", value: "future_simple" },
  { label: "Future Continuous", value: "future_continuous" },
  { label: "Future Perfect", value: "future_perfect" },
];

export default function Tenses({
  question = "",
  instructions = "",
  sentence = "",
  correctAnswer = "",
  options = [],
  points: initialPoints = 0,
  timeMinutes: initialTimeMinutes = 0,
  timeSeconds: initialTimeSeconds = 0,
  maxAttempts: initialMaxAttempts = 1,
  onQuestionChange,
  onInstructionsChange,
  onSentenceChange,
  onCorrectAnswerChange,
  onOptionsChange,
  onPointsChange,
  onTimeMinutesChange,
  onTimeSecondsChange,
  onMaxAttemptsChange,
}: TensesProps) {
  const [questionText, setQuestionText] = useState(question);
  const [instructionsText, setInstructionsText] = useState(instructions);
  const [sentenceText, setSentenceText] = useState(sentence);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(options);
  const [correctAnswerValue, setCorrectAnswerValue] = useState(correctAnswer);
  const [pointsValue, setPointsValue] = useState(initialPoints);
  const [timeMinutesValue, setTimeMinutesValue] = useState(initialTimeMinutes);
  const [timeSecondsValue, setTimeSecondsValue] = useState(initialTimeSeconds);
  const [maxAttemptsValue, setMaxAttemptsValue] = useState(initialMaxAttempts);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleInstructionsChange = (value: string) => {
    setInstructionsText(value);
    onInstructionsChange?.(value);
  };

  const handleSentenceChange = (value: string) => {
    setSentenceText(value);
    onSentenceChange?.(value);
  };

  const handleTenseToggle = (tenseValue: string) => {
    // Toggle selection for options array logic
    // We track selected options to be presented to the student.
    // If an option is deselected and it was the correct answer, we clear the correct answer.

    const newSelection = selectedAnswers.includes(tenseValue)
      ? selectedAnswers.filter((t) => t !== tenseValue)
      : [...selectedAnswers, tenseValue];
    
    setSelectedAnswers(newSelection);
    
    // If the currently selected correct answer is removed from selection, clear it
    if (correctAnswerValue === tenseValue && !newSelection.includes(tenseValue)) {
      setCorrectAnswerValue("");
      onCorrectAnswerChange?.("");
    }
    
    onOptionsChange?.(newSelection);
  };

  const handleSetCorrectAnswer = (tenseValue: string) => {
    if (selectedAnswers.includes(tenseValue)) {
        setCorrectAnswerValue(tenseValue);
        onCorrectAnswerChange?.(tenseValue);
    }
  };


  const handlePointsChange = (value: number) => {
    const points = Math.max(0, value);
    setPointsValue(points);
    onPointsChange?.(points);
  };

  const handleTimeMinutesChange = (value: number) => {
    const minutes = Math.max(0, Math.floor(value));
    setTimeMinutesValue(minutes);
    onTimeMinutesChange?.(minutes);
  };

  const handleTimeSecondsChange = (value: number) => {
    const seconds = Math.max(0, Math.min(59, Math.floor(value)));
    setTimeSecondsValue(seconds);
    onTimeSecondsChange?.(seconds);
  };

  const handleMaxAttemptsChange = (value: number) => {
    const attempts = Math.max(1, Math.floor(value));
    setMaxAttemptsValue(attempts);
    onMaxAttemptsChange?.(attempts);
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Text *
          </label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => handleQuestionChange(e.target.value)}
            placeholder="Enter the question text..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
        </div>
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Instructions
          </label>
          <input
            type="text"
            value={instructionsText}
            onChange={(e) => handleInstructionsChange(e.target.value)}
            placeholder="Enter instructions..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sentence *
          </label>
          <input
            type="text"
            value={sentenceText}
            onChange={(e) => handleSentenceChange(e.target.value)}
            placeholder="Enter the sentence..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
        </div>
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correct Answer *
          </label>
          <select
            value={correctAnswerValue}
            onChange={(e) => {
              setCorrectAnswerValue(e.target.value);
              onCorrectAnswerChange?.(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent bg-white"
          >
            <option value="">Select correct tense</option>
            {selectedAnswers.map((tenseValue) => {
              const tenseLabel = verbTenses.find((t) => t.value === tenseValue)?.label || tenseValue;
              return (
                <option key={tenseValue} value={tenseValue}>
                  {tenseLabel}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Valid Options (At least 2) *
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Click to select the verb tenses that will be presented as options to the student. Make sure to select the correct answer above from these options.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {verbTenses.map((tense) => {
            const isSelected = selectedAnswers.includes(tense.value);

            return (
              <div
                key={tense.value}
                onClick={() => handleTenseToggle(tense.value)}
                className={`
                  relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                  ${isSelected
                    ? "border-[#44b07f] bg-[#44b07f]/5 shadow-sm"
                    : "border-gray-300 hover:border-gray-400 bg-white"
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${isSelected ? "text-[#44b07f]" : "text-gray-700"}`}>
                    {tense.label}
                  </span>
                  {isSelected && (
                    <div className="text-[#44b07f]">
                      <CheckCircleIcon fontSize="small" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points, Time, and Max Attempts Row */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time (Minutes) *
          </label>
          <input
            type="number"
            min="0"
            max="60"
            value={timeMinutesValue}
            onChange={(e) =>
              handleTimeMinutesChange(parseInt(e.target.value) || 0)
            }
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Minutes to answer</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time (Seconds) *
          </label>
          <input
            type="number"
            min="0"
            max="59"
            value={timeSecondsValue}
            onChange={(e) =>
              handleTimeSecondsChange(parseInt(e.target.value) || 0)
            }
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Additional seconds (0-59)
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Points *
          </label>
          <input
            type="number"
            min="0"
            value={pointsValue}
            onChange={(e) => handlePointsChange(parseInt(e.target.value) || 0)}
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Points awarded for correct answer
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Attempts *
          </label>
          <input
            type="number"
            min="1"
            value={maxAttemptsValue}
            onChange={(e) =>
              handleMaxAttemptsChange(parseInt(e.target.value) || 1)
            }
            placeholder="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum number of attempts allowed
          </p>
        </div>
      </div>
    </div>
  );
}
