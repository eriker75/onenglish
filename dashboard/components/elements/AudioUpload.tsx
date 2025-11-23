"use client";

import React, { useState, useRef } from "react";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import DeleteIcon from "@mui/icons-material/Delete";

interface AudioUploadProps {
  audioUrl?: string | null;
  onAudioChange?: (audioUrl: string | null) => void;
  onFileChange?: (file: File | null) => void;
  height?: "h-48" | "h-32" | "h-24" | "h-20";
}

export default function AudioUpload({
  audioUrl,
  onAudioChange,
  onFileChange,
  height = "h-32",
}: AudioUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAudioUpload = (file: File) => {
    if (file && file.type.startsWith("audio/")) {
      onFileChange?.(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
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
    onAudioChange?.(null);
    onFileChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {!audioUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleDropZoneClick}
          className={`
            relative w-full ${height} border-2 border-dashed rounded-lg cursor-pointer
            transition-all duration-200
            ${isDragging
              ? "border-[#44b07f] bg-[#44b07f]/5"
              : "border-gray-300 hover:border-gray-400 bg-gray-50"
            }
            flex flex-col items-center justify-center gap-2
          `}
        >
          <div className="p-3 bg-gray-100 rounded-full">
            <AudioFileIcon
              className={`text-2xl ${isDragging ? "text-[#44b07f]" : "text-gray-500"}`}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              Click to upload audio
            </p>
            <p className="text-xs text-gray-500">
              or drag and drop
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative w-full">
          <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-between gap-4">
            <audio controls className="flex-1">
              <source src={audioUrl} />
              Your browser does not support the audio element.
            </audio>
            <button
              onClick={handleRemoveAudio}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg flex-shrink-0"
              title="Remove audio"
            >
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
