"use client";

import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import VideoUpload from "@/components/elements/VideoUpload";

interface LyricsTrainingProps {
  question?: string;
  instructions?: string;
  hint?: string;
  audioUrl?: string; // Using audioUrl field for Video URL to match backend
  options?: string[];
  correctAnswer?: string;
  points?: number;
  timeMinutes?: number;
  timeSeconds?: number;
  maxAttempts?: number;
  onQuestionChange?: (question: string) => void;
  onInstructionsChange?: (instructions: string) => void;
  onHintChange?: (hint: string) => void;
  onAudioChange?: (audioUrl: string | null) => void;
  onOptionsChange?: (options: string[]) => void;
  onCorrectAnswerChange?: (answer: string) => void;
  onPointsChange?: (points: number) => void;
  onTimeMinutesChange?: (minutes: number) => void;
  onTimeSecondsChange?: (seconds: number) => void;
  onMaxAttemptsChange?: (attempts: number) => void;
}

export default function LyricsTraining({
  question = "",
  instructions = "",
  hint = "",
  audioUrl: initialVideoUrl,
  options = ["", "", ""],
  correctAnswer = "",
  points: initialPoints = 0,
  timeMinutes: initialTimeMinutes = 0,
  timeSeconds: initialTimeSeconds = 0,
  maxAttempts: initialMaxAttempts = 1,
  onQuestionChange,
  onInstructionsChange,
  onHintChange,
  onAudioChange,
  onOptionsChange,
  onCorrectAnswerChange,
  onPointsChange,
  onTimeMinutesChange,
  onTimeSecondsChange,
  onMaxAttemptsChange,
}: LyricsTrainingProps) {
  const [questionText, setQuestionText] = useState(question);
  const [instructionsText, setInstructionsText] = useState(instructions);
  const [hintText, setHintText] = useState(hint);
  const [videoUrl, setVideoUrl] = useState<string | null>(initialVideoUrl || null);
  const [questionOptions, setQuestionOptions] = useState<string[]>(
    options.length > 0 ? options : ["", "", ""]
  );
  const [selectedAnswer, setSelectedAnswer] = useState(correctAnswer);
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

  const handleHintChange = (value: string) => {
    setHintText(value);
    onHintChange?.(value);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionOptions];
    newOptions[index] = value;
    setQuestionOptions(newOptions);
    onOptionsChange?.(newOptions);
    
    // If the deleted option was the correct answer, clear it
    if (value === "" && selectedAnswer === questionOptions[index]) {
      setSelectedAnswer("");
      onCorrectAnswerChange?.("");
    }
  };

  const handleAddOption = () => {
    const newOptions = [...questionOptions, ""];
    setQuestionOptions(newOptions);
    onOptionsChange?.(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (questionOptions.length > 1) {
      const removedOption = questionOptions[index];
      const newOptions = questionOptions.filter((_, i) => i !== index);
      setQuestionOptions(newOptions);
      onOptionsChange?.(newOptions);
      
      // If the removed option was the correct answer, clear it
      if (selectedAnswer === removedOption) {
        setSelectedAnswer("");
        onCorrectAnswerChange?.("");
      }
    }
  };

  const handleCorrectAnswerChange = (value: string) => {
    setSelectedAnswer(value);
    onCorrectAnswerChange?.(value);
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
      {/* Row 1: Question Text, Instructions, and Hint */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
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
        <div className="col-span-4">
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
        <div className="col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hint *
          </label>
          <input
            type="text"
            value={hintText}
            onChange={(e) => handleHintChange(e.target.value)}
            placeholder="Everything you want's a dream ______"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
        </div>
      </div>

      {/* Row 2: Video File and Options (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Video File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video File *
          </label>
          <VideoUpload
            videoUrl={videoUrl}
            onVideoChange={(url) => {
              setVideoUrl(url);
              onAudioChange?.(url); // Using onAudioChange to save to backend audioUrl field
            }}
            height="h-64"
          />
        </div>

        {/* Right Column: Options */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Answer Options *
              </label>
              <button
                onClick={handleAddOption}
                className="flex items-center gap-1 px-3 py-1 text-sm text-[#44b07f] hover:bg-[#44b07f]/10 rounded-lg transition-colors"
              >
                <AddCircleIcon fontSize="small" />
                Add Option
              </button>
            </div>
            <div className="space-y-2">
              {questionOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent text-gray-700"
                  />
                  {questionOptions.length > 1 && (
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove option"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Correct Answer Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer *
            </label>
            <select
              value={selectedAnswer}
              onChange={(e) => handleCorrectAnswerChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
            >
              <option value="">Select correct answer</option>
              {questionOptions
                .filter((opt) => opt.trim() !== "")
                .map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select the correct answer from the options above
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Points, Time, and Max Attempts */}
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
