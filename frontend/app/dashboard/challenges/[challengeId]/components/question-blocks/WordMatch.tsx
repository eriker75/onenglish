"use client";

import React, { useState, useRef } from "react";
import MicIcon from "@mui/icons-material/Mic";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

interface WordMatchProps {
  question?: string;
  audioUrl?: string;
  options?: string[];
  correctAnswer?: string;
  points?: number;
  timeMinutes?: number;
  timeSeconds?: number;
  maxAttempts?: number;
  onQuestionChange?: (question: string) => void;
  onAudioChange?: (audioUrl: string | null) => void;
  onOptionsChange?: (options: string[]) => void;
  onCorrectAnswerChange?: (answer: string) => void;
  onPointsChange?: (points: number) => void;
  onTimeMinutesChange?: (minutes: number) => void;
  onTimeSecondsChange?: (seconds: number) => void;
  onMaxAttemptsChange?: (attempts: number) => void;
}

export default function WordMatch({
  question = "",
  audioUrl: initialAudioUrl,
  options = [""],
  correctAnswer = "",
  points: initialPoints = 0,
  timeMinutes: initialTimeMinutes = 0,
  timeSeconds: initialTimeSeconds = 0,
  maxAttempts: initialMaxAttempts = 1,
  onQuestionChange,
  onAudioChange,
  onOptionsChange,
  onCorrectAnswerChange,
  onPointsChange,
  onTimeMinutesChange,
  onTimeSecondsChange,
  onMaxAttemptsChange,
}: WordMatchProps) {
  const [questionText, setQuestionText] = useState(
    question || "Listen to the audio and select the correct word"
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
  const [questionOptions, setQuestionOptions] = useState<string[]>(
    options.length > 0 ? options : [""]
  );
  const [selectedAnswer, setSelectedAnswer] = useState(correctAnswer);
  const [isDragging, setIsDragging] = useState(false);
  const [pointsValue, setPointsValue] = useState(initialPoints);
  const [timeMinutesValue, setTimeMinutesValue] = useState(initialTimeMinutes);
  const [timeSecondsValue, setTimeSecondsValue] = useState(initialTimeSeconds);
  const [maxAttemptsValue, setMaxAttemptsValue] = useState(initialMaxAttempts);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
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

  const handleAudioUpload = (file: File) => {
    if (file && file.type.startsWith("audio/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAudioUrl(result);
        onAudioChange?.(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleAudioUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAudioUpload(file);
    }
  };

  const handleRemoveAudio = () => {
    setAudioUrl(null);
    onAudioChange?.(null);
    if (audioInputRef.current) {
      audioInputRef.current.value = "";
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
          Audio File *
        </label>
        {!audioUrl ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => audioInputRef.current?.click()}
            className={`
              relative w-full h-48 border-2 border-dashed rounded-lg cursor-pointer
              transition-all duration-200
              ${isDragging
                ? "border-[#44b07f] bg-[#44b07f]/5"
                : "border-gray-300 hover:border-gray-400 bg-gray-50"
              }
              flex flex-col items-center justify-center gap-3
            `}
          >
            <MicIcon
              className={`text-4xl ${isDragging ? "text-[#44b07f]" : "text-gray-400"}`}
            />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Drag and drop an audio file
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or click to browse
              </p>
            </div>
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="w-full">
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-between gap-4">
              <audio controls className="flex-1">
                <source src={audioUrl} />
                Your browser does not support the audio element.
              </audio>
              <button
                onClick={handleRemoveAudio}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg flex-shrink-0"
                title="Remove audio"
              >
                <DeleteIcon fontSize="small" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Word Options *
          </label>
          <button
            onClick={handleAddOption}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#33CC00] bg-white border-2 border-[#33CC00] hover:bg-[#33CC00] hover:text-white rounded-lg transition-colors shadow-sm"
          >
            <AddCircleIcon fontSize="small" />
            Add Option
          </button>
        </div>
        <div className="space-y-2">
          {questionOptions.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
            >
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
