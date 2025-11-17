"use client";

import React, { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface TensesProps {
  question?: string;
  sentence?: string;
  correctAnswer?: string;
  points?: number;
  timeMinutes?: number;
  timeSeconds?: number;
  maxAttempts?: number;
  onQuestionChange?: (question: string) => void;
  onSentenceChange?: (sentence: string) => void;
  onCorrectAnswerChange?: (answer: string) => void;
  onPointsChange?: (points: number) => void;
  onTimeMinutesChange?: (minutes: number) => void;
  onTimeSecondsChange?: (seconds: number) => void;
  onMaxAttemptsChange?: (attempts: number) => void;
}

const verbTenses = [
  "Present Simple",
  "Present Continuous",
  "Present Perfect",
  "Past Simple",
  "Past Continuous",
  "Past Perfect",
  "Future Simple",
  "Future Continuous",
  "Future Perfect",
];

export default function Tenses({
  question = "",
  sentence = "",
  correctAnswer = "",
  points: initialPoints = 0,
  timeMinutes: initialTimeMinutes = 0,
  timeSeconds: initialTimeSeconds = 0,
  maxAttempts: initialMaxAttempts = 1,
  onQuestionChange,
  onSentenceChange,
  onCorrectAnswerChange,
  onPointsChange,
  onTimeMinutesChange,
  onTimeSecondsChange,
  onMaxAttemptsChange,
}: TensesProps) {
  const [questionText, setQuestionText] = useState(question);
  const [sentenceText, setSentenceText] = useState(sentence);
  const [selectedAnswer, setSelectedAnswer] = useState(correctAnswer);
  const [pointsValue, setPointsValue] = useState(initialPoints);
  const [timeMinutesValue, setTimeMinutesValue] = useState(initialTimeMinutes);
  const [timeSecondsValue, setTimeSecondsValue] = useState(initialTimeSeconds);
  const [maxAttemptsValue, setMaxAttemptsValue] = useState(initialMaxAttempts);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleSentenceChange = (value: string) => {
    setSentenceText(value);
    onSentenceChange?.(value);
  };

  const handleTenseClick = (tense: string) => {
    setSelectedAnswer(tense);
    onCorrectAnswerChange?.(tense);
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
      <div>
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sentence *
        </label>
        <input
          type="text"
          value={sentenceText}
          onChange={(e) => handleSentenceChange(e.target.value)}
          placeholder="Enter the sentence (e.g., I go to school every day)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Correct Tense (Click to Select) *
        </label>
        <div className="grid grid-cols-3 gap-4">
          {verbTenses.map((tense, index) => (
            <button
              key={index}
              onClick={() => handleTenseClick(tense)}
              className={`
                relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200
                ${selectedAnswer === tense
                  ? "border-[#33CC00] bg-[#33CC00]/10 shadow-lg transform scale-105"
                  : "border-gray-300 hover:border-[#33CC00]/50 hover:shadow-md bg-white"
                }
              `}
            >
              <div className="text-center">
                <p className={`text-sm font-medium ${
                  selectedAnswer === tense ? "text-[#33CC00]" : "text-gray-700"
                }`}>
                  {tense}
                </p>
              </div>
              {selectedAnswer === tense && (
                <div className="absolute top-2 right-2">
                  <CheckCircleIcon className="text-[#33CC00]" fontSize="small" />
                </div>
              )}
            </button>
          ))}
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
