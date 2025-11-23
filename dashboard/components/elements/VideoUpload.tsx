"use client";

import React, { useState, useRef } from "react";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import DeleteIcon from "@mui/icons-material/Delete";

interface VideoUploadProps {
  videoUrl?: string | null;
  onVideoChange?: (videoUrl: string | null) => void;
  height?: "h-48" | "h-32" | "h-64";
}

export default function VideoUpload({
  videoUrl,
  onVideoChange,
  height = "h-48",
}: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (file: File) => {
    if (file && file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onVideoChange?.(result);
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
      handleVideoUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleVideoUpload(file);
    }
  };

  const handleRemoveVideo = () => {
    onVideoChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {!videoUrl ? (
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
            flex flex-col items-center justify-center gap-3
          `}
        >
          <VideoFileIcon
            className={`text-4xl ${isDragging ? "text-[#44b07f]" : "text-gray-400"}`}
          />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              Drag and drop a video file
            </p>
            <p className="text-xs text-gray-500 mt-1">
              or click to browse
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative w-full">
          <div className="border-2 border-gray-300 rounded-lg p-2 bg-gray-50">
            <video controls className={`w-full ${height} object-contain bg-black rounded`}>
              <source src={videoUrl} />
              Your browser does not support the video element.
            </video>
            <button
              onClick={handleRemoveVideo}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              title="Remove video"
            >
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

