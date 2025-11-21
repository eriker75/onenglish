"use client";

import React, { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

interface DebateProps {
  question?: string;
  phrase?: string;
  imageUrl?: string;
  position?: "for" | "against" | "random";
  onQuestionChange?: (question: string) => void;
  onPhraseChange?: (phrase: string) => void;
  onImageChange?: (imageUrl: string | null) => void;
  onPositionChange?: (position: "for" | "against" | "random") => void;
}

export default function Debate({
  question = "",
  phrase = "",
  imageUrl: initialImageUrl,
  position = "random",
  onQuestionChange,
  onPhraseChange,
  onImageChange,
  onPositionChange,
}: DebateProps) {
  const [questionText, setQuestionText] = useState(question);
  const [phraseText, setPhraseText] = useState(phrase);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [selectedPosition, setSelectedPosition] = useState<"for" | "against" | "random">(position);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handlePhraseChange = (value: string) => {
    setPhraseText(value);
    onPhraseChange?.(value);
  };

  const handlePositionChange = (value: "for" | "against" | "random") => {
    setSelectedPosition(value);
    onPositionChange?.(value);
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

  return (
    <div className="w-full space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Text *
        </label>
        <textarea
          value={questionText}
          onChange={(e) => handleQuestionChange(e.target.value)}
          placeholder="Enter the question text..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phrase *
        </label>
        <textarea
          value={phraseText}
          onChange={(e) => handlePhraseChange(e.target.value)}
          placeholder="Enter the phrase to defend or argue against..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          The phrase that students will either defend or argue against
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image (Optional)
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Position Assignment *
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handlePositionChange("for")}
            className={`p-4 border-2 rounded-lg transition-all duration-200 ${
              selectedPosition === "for"
                ? "border-[#44b07f] bg-[#44b07f]/10 text-[#44b07f] font-medium"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            For (Defend)
          </button>
          <button
            onClick={() => handlePositionChange("against")}
            className={`p-4 border-2 rounded-lg transition-all duration-200 ${
              selectedPosition === "against"
                ? "border-[#44b07f] bg-[#44b07f]/10 text-[#44b07f] font-medium"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            Against (Argue)
          </button>
          <button
            onClick={() => handlePositionChange("random")}
            className={`p-4 border-2 rounded-lg transition-all duration-200 ${
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
  );
}
