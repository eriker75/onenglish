"use client";

import React, { useState } from "react";
import ImageUpload from "@/components/elements/ImageUpload";

interface TalesProps {
  question?: string;
  imageUrl?: string;
  exampleStory?: string;
  points?: number;
  timeMinutes?: number;
  timeSeconds?: number;
  maxAttempts?: number;
  onQuestionChange?: (question: string) => void;
  onImageChange?: (imageUrl: string | null) => void;
  onExampleStoryChange?: (story: string) => void;
  onPointsChange?: (points: number) => void;
  onTimeMinutesChange?: (minutes: number) => void;
  onTimeSecondsChange?: (seconds: number) => void;
  onMaxAttemptsChange?: (attempts: number) => void;
}

export default function Tales({
  question = "",
  imageUrl: initialImageUrl,
  exampleStory = "",
  points: initialPoints = 0,
  timeMinutes: initialTimeMinutes = 0,
  timeSeconds: initialTimeSeconds = 0,
  maxAttempts: initialMaxAttempts = 1,
  onQuestionChange,
  onImageChange,
  onExampleStoryChange,
  onPointsChange,
  onTimeMinutesChange,
  onTimeSecondsChange,
  onMaxAttemptsChange,
}: TalesProps) {
  const [questionText, setQuestionText] = useState(
    question || "Write a story in English about this image"
  );
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [exampleStoryText, setExampleStoryText] = useState(exampleStory);
  const [pointsValue, setPointsValue] = useState(initialPoints);
  const [timeMinutesValue, setTimeMinutesValue] = useState(initialTimeMinutes);
  const [timeSecondsValue, setTimeSecondsValue] = useState(initialTimeSeconds);
  const [maxAttemptsValue, setMaxAttemptsValue] = useState(initialMaxAttempts);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleExampleStoryChange = (value: string) => {
    setExampleStoryText(value);
    onExampleStoryChange?.(value);
  };

  const handleImageChange = (url: string | null) => {
    setImageUrl(url);
    onImageChange?.(url);
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instruction Text *
        </label>
        <input
          type="text"
          value={questionText}
          onChange={(e) => handleQuestionChange(e.target.value)}
          placeholder="Enter the instruction text..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image *
        </label>
        <ImageUpload
          imageUrl={imageUrl}
          onImageChange={handleImageChange}
          height="h-48"
        />
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
