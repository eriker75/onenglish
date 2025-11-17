"use client";

import React, { useState, useRef } from "react";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

interface LyricsLine {
  id: string;
  text: string;
  blankPosition: number;
  correctWord: string;
}

interface LyricsTrainingProps {
  question?: string;
  audioUrl?: string;
  lyrics?: LyricsLine[];
  onQuestionChange?: (question: string) => void;
  onAudioChange?: (audioUrl: string | null) => void;
  onLyricsChange?: (lyrics: LyricsLine[]) => void;
}

export default function LyricsTraining({
  question = "",
  audioUrl: initialAudioUrl,
  lyrics = [],
  onQuestionChange,
  onAudioChange,
  onLyricsChange,
}: LyricsTrainingProps) {
  const [questionText, setQuestionText] = useState(question);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
  const [lyricsList, setLyricsList] = useState<LyricsLine[]>(
    lyrics.length > 0
      ? lyrics
      : [
          {
            id: `line-${Date.now()}`,
            text: "",
            blankPosition: 0,
            correctWord: "",
          },
        ]
  );
  const [isDragging, setIsDragging] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
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

  const handleLyricTextChange = (id: string, text: string) => {
    const newLyrics = lyricsList.map((l) => (l.id === id ? { ...l, text } : l));
    setLyricsList(newLyrics);
    onLyricsChange?.(newLyrics);
  };

  const handleBlankPositionChange = (id: string, position: number) => {
    const newLyrics = lyricsList.map((l) => (l.id === id ? { ...l, blankPosition: position } : l));
    setLyricsList(newLyrics);
    onLyricsChange?.(newLyrics);
  };

  const handleCorrectWordChange = (id: string, word: string) => {
    const newLyrics = lyricsList.map((l) => (l.id === id ? { ...l, correctWord: word } : l));
    setLyricsList(newLyrics);
    onLyricsChange?.(newLyrics);
  };

  const handleAddLyric = () => {
    const newLyric: LyricsLine = {
      id: `line-${Date.now()}-${Math.random()}`,
      text: "",
      blankPosition: 0,
      correctWord: "",
    };
    const newLyrics = [...lyricsList, newLyric];
    setLyricsList(newLyrics);
    onLyricsChange?.(newLyrics);
  };

  const handleRemoveLyric = (id: string) => {
    if (lyricsList.length > 1) {
      const newLyrics = lyricsList.filter((l) => l.id !== id);
      setLyricsList(newLyrics);
      onLyricsChange?.(newLyrics);
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
          Song Audio File *
        </label>
        {!audioUrl ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleAudioUpload(file);
            }}
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
            <MusicNoteIcon
              className={`text-4xl ${isDragging ? "text-[#44b07f]" : "text-gray-400"}`}
            />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Drag and drop song audio file
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or click to browse
              </p>
            </div>
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAudioUpload(file);
              }}
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
              onClick={() => {
                setAudioUrl(null);
                onAudioChange?.(null);
                if (audioInputRef.current) audioInputRef.current.value = "";
              }}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              title="Remove audio"
            >
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Lyrics Lines *
          </label>
          <button
            onClick={handleAddLyric}
            className="flex items-center gap-1 px-3 py-1 text-sm text-[#44b07f] hover:bg-[#44b07f]/10 rounded-lg transition-colors"
          >
            <AddCircleIcon fontSize="small" />
            Add Line
          </button>
        </div>
        <div className="space-y-4">
          {lyricsList.map((lyric, index) => {
            const words = lyric.text.split(/\s+/).filter((w) => w.trim() !== "");
            return (
              <div key={lyric.id} className="p-4 border-2 border-gray-200 rounded-lg bg-white">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Line {index + 1}
                  </span>
                  {lyricsList.length > 1 && (
                    <button
                      onClick={() => handleRemoveLyric(lyric.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={lyric.text}
                  onChange={(e) => handleLyricTextChange(lyric.id, e.target.value)}
                  placeholder="Enter lyric line (use ___ for blank)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent mb-3"
                />
                {words.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Select blank position:</p>
                    <div className="flex flex-wrap gap-2">
                      {words.map((word, wordIndex) => (
                        <button
                          key={wordIndex}
                          onClick={() => handleBlankPositionChange(lyric.id, wordIndex)}
                          className={`px-3 py-1 rounded-lg text-sm border-2 transition-colors ${
                            lyric.blankPosition === wordIndex
                              ? "border-[#44b07f] bg-[#44b07f]/10 text-[#44b07f] font-medium"
                              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {wordIndex + 1}. {word === "___" || word.trim() === "" ? "[BLANK]" : word}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <input
                  type="text"
                  value={lyric.correctWord}
                  onChange={(e) => handleCorrectWordChange(lyric.id, e.target.value)}
                  placeholder="Enter the correct word for the blank"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
