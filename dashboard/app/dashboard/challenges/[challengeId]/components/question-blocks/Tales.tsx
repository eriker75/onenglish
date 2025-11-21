"use client";

import React, { useState, useRef } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [isDragging, setIsDragging] = useState(false);
  const [pointsValue, setPointsValue] = useState(initialPoints);
  const [timeMinutesValue, setTimeMinutesValue] = useState(initialTimeMinutes);
  const [timeSecondsValue, setTimeSecondsValue] = useState(initialTimeSeconds);
  const [maxAttemptsValue, setMaxAttemptsValue] = useState(initialMaxAttempts);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleExampleStoryChange = (value: string) => {
    setExampleStoryText(value);
    onExampleStoryChange?.(value);
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageUrl(result);
        onImageChange?.(result);
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
      handleImageUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    onImageChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
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
        {!imageUrl ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleDropZoneClick}
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
            <CloudUploadIcon
              className={`text-4xl ${isDragging ? "text-[#44b07f]" : "text-gray-400"}`}
            />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Drag and drop an image here
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or click to browse
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative w-full">
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt="Question"
                className="w-full h-auto max-h-48 object-contain bg-gray-50"
              />
            </div>
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              title="Remove image"
            >
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        )}
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

      {/* AI Validation Info */}
      <div className="bg-[#33CC00]/10 border border-[#33CC00] rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-[#33CC00]">AI-Powered Validation:</strong> Students will write a story in English about the provided image. The story will be automatically validated using AI to assess grammar, coherence, creativity, and relevance to the image. No manual answer checking required.
        </p>
      </div>
    </div>
  );
}
