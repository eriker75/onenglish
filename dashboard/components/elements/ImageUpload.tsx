"use client";

import React, { useState, useRef } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

interface ImageUploadProps {
  imageUrl?: string | null;
  onImageChange?: (imageUrl: string | null) => void;
  height?: "h-48" | "h-64" | "h-32";
}

export default function ImageUpload({
  imageUrl,
  onImageChange,
  height = "h-48",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
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
    onImageChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {!imageUrl ? (
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
              alt="Uploaded"
              className={`w-full h-auto ${height === "h-32" ? "max-h-32" : height === "h-64" ? "max-h-64" : "max-h-48"} object-contain bg-gray-50`}
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
  );
}
