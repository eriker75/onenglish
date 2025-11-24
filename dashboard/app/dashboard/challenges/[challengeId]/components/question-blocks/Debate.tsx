"use client";

import React, { useState, useEffect } from "react";
import ImageUpload from "@/components/elements/ImageUpload";

interface DebateProps {
  question?: string;
  instructions?: string;
  content?: string;
  imageUrl?: string;
  answer?: "for" | "against" | "random";
  points?: number;
  timeMinutes?: number;
  timeSeconds?: number;
  maxAttempts?: number;
  onQuestionChange?: (question: string) => void;
  onInstructionsChange?: (instructions: string) => void;
  onContentChange?: (content: string) => void;
  onImageChange?: (imageUrl: string | null) => void;
  onFileChange?: (file: File | null) => void;
  onAnswerChange?: (answer: string) => void;
  onPointsChange?: (points: number) => void;
  onTimeMinutesChange?: (minutes: number) => void;
  onTimeSecondsChange?: (seconds: number) => void;
  onMaxAttemptsChange?: (attempts: number) => void;
}

export default function Debate({
  question = "",
  instructions = "",
  content = "",
  imageUrl: initialImageUrl,
  answer: initialAnswer,
  points: initialPoints = 0,
  timeMinutes: initialTimeMinutes = 0,
  timeSeconds: initialTimeSeconds = 0,
  maxAttempts: initialMaxAttempts = 1,
  onQuestionChange,
  onInstructionsChange,
  onContentChange,
  onImageChange,
  onFileChange,
  onAnswerChange,
  onPointsChange,
  onTimeMinutesChange,
  onTimeSecondsChange,
  onMaxAttemptsChange,
}: DebateProps) {
  const [questionText, setQuestionText] = useState(question);
  const [instructionsText, setInstructionsText] = useState(instructions);
  const [contentText, setContentText] = useState(content);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [selectedPosition, setSelectedPosition] = useState<"for" | "against" | "random">(
    (initialAnswer as "for" | "against" | "random") || "random"
  );
  const [pointsValue, setPointsValue] = useState(initialPoints);
  const [timeMinutesValue, setTimeMinutesValue] = useState(initialTimeMinutes);
  const [timeSecondsValue, setTimeSecondsValue] = useState(initialTimeSeconds);
  const [maxAttemptsValue, setMaxAttemptsValue] = useState(initialMaxAttempts);

  // Sync state with props when they change
  useEffect(() => {
    setQuestionText(question);
  }, [question]);

  useEffect(() => {
    setInstructionsText(instructions);
  }, [instructions]);

  useEffect(() => {
    setContentText(content);
  }, [content]);

  useEffect(() => {
    setImageUrl(initialImageUrl || null);
  }, [initialImageUrl]);

  useEffect(() => {
    const ans = initialAnswer as "for" | "against" | "random";
    setSelectedPosition(ans || "random");
  }, [initialAnswer]);

  useEffect(() => {
    setPointsValue(initialPoints);
  }, [initialPoints]);

  useEffect(() => {
    setTimeMinutesValue(initialTimeMinutes);
  }, [initialTimeMinutes]);

  useEffect(() => {
    setTimeSecondsValue(initialTimeSeconds);
  }, [initialTimeSeconds]);

  useEffect(() => {
    setMaxAttemptsValue(initialMaxAttempts);
  }, [initialMaxAttempts]);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleInstructionsChange = (value: string) => {
    setInstructionsText(value);
    onInstructionsChange?.(value);
  };

  const handleContentChange = (value: string) => {
    setContentText(value);
    onContentChange?.(value);
  };

  const handlePositionChange = (value: "for" | "against" | "random") => {
    setSelectedPosition(value);
    onAnswerChange?.(value);
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
    <div className="w-full space-y-6">
      {/* Top Section: Question Text, Instructions, Content (Phrase) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Text Inputs */}
        <div className="col-span-6 space-y-4">
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
              Instructions
            </label>
            <input
              type="text"
              value={instructionsText}
              onChange={(e) => handleInstructionsChange(e.target.value)}
              placeholder="Enter instructions..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phrase (Content) *
            </label>
            <textarea
              value={contentText}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Enter the phrase to defend or argue against..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              The phrase that students will either defend or argue against
            </p>
          </div>
        </div>

        {/* Right Column: Image and Position Assignment */}
        <div className="col-span-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image (Optional)
            </label>
            <ImageUpload
              imageUrl={imageUrl}
              onImageChange={(url) => {
                setImageUrl(url);
                onImageChange?.(url);
              }}
              onFileChange={onFileChange}
              height="h-48"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position Assignment *
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handlePositionChange("for")}
                className={`p-3 border-2 rounded-lg transition-all duration-200 text-sm ${
                  selectedPosition === "for"
                    ? "border-[#44b07f] bg-[#44b07f]/10 text-[#44b07f] font-medium"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                For (Defend)
              </button>
              <button
                onClick={() => handlePositionChange("against")}
                className={`p-3 border-2 rounded-lg transition-all duration-200 text-sm ${
                  selectedPosition === "against"
                    ? "border-[#44b07f] bg-[#44b07f]/10 text-[#44b07f] font-medium"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                Against (Argue)
              </button>
              <button
                onClick={() => handlePositionChange("random")}
                className={`p-3 border-2 rounded-lg transition-all duration-200 text-sm ${
                  selectedPosition === "random"
                    ? "border-[#44b07f] bg-[#44b07f]/10 text-[#44b07f] font-medium"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                Random
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {selectedPosition === "random"
                ? "Position will be randomly assigned to students"
                : selectedPosition === "for"
                ? "Students must defend this phrase"
                : "Students must argue against this phrase"}
            </p>
          </div>
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
