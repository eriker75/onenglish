"use client";

import React, { useState, useRef, useCallback } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

interface ImageToMultipleChoiceTextProps {
  question?: string;
  options?: string[];
  correctAnswer?: string;
  imageUrl?: string;
  onQuestionChange?: (question: string) => void;
  onOptionsChange?: (options: string[]) => void;
  onCorrectAnswerChange?: (answer: string) => void;
  onImageChange?: (imageUrl: string | null) => void;
}

export default function ImageToMultipleChoiceText({
  question = "",
  options = ["", "", "", ""],
  correctAnswer = "",
  imageUrl: initialImageUrl,
  onQuestionChange,
  onOptionsChange,
  onCorrectAnswerChange,
  onImageChange,
}: ImageToMultipleChoiceTextProps) {
  const [questionText, setQuestionText] = useState(question);
  const [questionOptions, setQuestionOptions] = useState<string[]>(
    options.length > 0 ? options : ["", "", "", ""]
  );
  const [selectedAnswer, setSelectedAnswer] = useState(correctAnswer);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionOptions];
    newOptions[index] = value;
    setQuestionOptions(newOptions);
    onOptionsChange?.(newOptions);
  };

  const handleCorrectAnswerChange = (value: string) => {
    setSelectedAnswer(value);
    onCorrectAnswerChange?.(value);
  };

  const handleImageUpload = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageUrl(result);
        onImageChange?.(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

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
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda: Imagen y Question Text */}
        <div className="space-y-6">
          {/* Drag and Drop Area */}
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
                  relative w-full h-64 border-2 border-dashed rounded-lg cursor-pointer
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
                    className="w-full h-auto max-h-64 object-contain bg-gray-50"
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

          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text
            </label>
            <textarea
              value={questionText}
              onChange={(e) => handleQuestionChange(e.target.value)}
              placeholder="Enter the question text..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
            />
          </div>
        </div>

        {/* Columna derecha: Options */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer Options *
            </label>
            <div className="space-y-3">
              {questionOptions.map((option, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer
                    transition-all duration-200
                    ${selectedAnswer === option
                      ? "border-[#44b07f] bg-[#44b07f]/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                    }
                  `}
                >
                  <RadioButtonUncheckedIcon
                    className={selectedAnswer === option ? "text-[#44b07f]" : "text-gray-400"}
                    fontSize="small"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className={`flex-1 px-3 py-2 border-0 bg-transparent focus:outline-none focus:ring-0 ${
                      selectedAnswer === option ? "text-[#44b07f] font-medium" : "text-gray-700"
                    }`}
                    onClick={() => handleCorrectAnswerChange(option)}
                  />
                  {selectedAnswer === option && (
                    <span className="text-[#44b07f] font-medium">✓</span>
                  )}
                </div>
              ))}
            </div>
            {selectedAnswer && (
              <div className="mt-4 p-3 bg-[#44b07f]/10 border border-[#44b07f] rounded-lg">
                <p className="text-sm text-[#44b07f] font-medium">
                  ✓ Correct answer: {selectedAnswer}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
