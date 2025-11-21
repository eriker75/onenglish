"use client";

import React, { useState, useRef } from "react";
import MicIcon from "@mui/icons-material/Mic";
import DeleteIcon from "@mui/icons-material/Delete";

interface GossipESProps {
  question?: string;
  audioUrl?: string;
  correctTranscription?: string;
  onQuestionChange?: (question: string) => void;
  onAudioChange?: (audioUrl: string | null) => void;
  onCorrectTranscriptionChange?: (transcription: string) => void;
}

export default function GossipES({
  question = "",
  audioUrl: initialAudioUrl,
  correctTranscription = "",
  onQuestionChange,
  onAudioChange,
  onCorrectTranscriptionChange,
}: GossipESProps) {
  const [questionText, setQuestionText] = useState(question);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
  const [correctTranscriptionText, setCorrectTranscriptionText] = useState(correctTranscription);
  const [isDragging, setIsDragging] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleCorrectTranscriptionChange = (value: string) => {
    setCorrectTranscriptionText(value);
    onCorrectTranscriptionChange?.(value);
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
          Audio File (English) *
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
          <div className="relative w-full">
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center">
              <audio controls className="w-full">
                <source src={audioUrl} />
                Your browser does not support the audio element.
              </audio>
            </div>
            <button
              onClick={handleRemoveAudio}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              title="Remove audio"
            >
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correct Transcription (Spanish) *
        </label>
        <textarea
          value={correctTranscriptionText}
          onChange={(e) => handleCorrectTranscriptionChange(e.target.value)}
          placeholder="Enter the correct Spanish transcription..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        />
        <p className="text-xs text-blue-600 mt-1">
          ℹ️ This transcription will be reviewed by AI to validate student responses.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>AI Review:</strong> Student responses will be automatically reviewed using AI to check if the Spanish transcription is correct.
        </p>
      </div>
    </div>
  );
}
