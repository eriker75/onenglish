"use client";

import React, { useState, useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AudioUpload from "@/components/elements/AudioUpload";

interface LyricsLine {
  id: string;
  text: string;
  options: string[];
  correctWord: string;
}

interface LyricsTrainingProps {
  question?: string;
  instructions?: string;
  audioUrl?: string;
  lyrics?: LyricsLine[];
  points?: number;
  timeMinutes?: number;
  timeSeconds?: number;
  maxAttempts?: number;
  onQuestionChange?: (question: string) => void;
  onInstructionsChange?: (instructions: string) => void;
  onAudioChange?: (audioUrl: string | null) => void;
  onLyricsChange?: (lyrics: LyricsLine[]) => void;
  onPointsChange?: (points: number) => void;
  onTimeMinutesChange?: (minutes: number) => void;
  onTimeSecondsChange?: (seconds: number) => void;
  onMaxAttemptsChange?: (attempts: number) => void;
}

export default function LyricsTraining({
  question = "",
  instructions = "",
  audioUrl: initialAudioUrl,
  lyrics = [],
  points: initialPoints = 0,
  timeMinutes: initialTimeMinutes = 0,
  timeSeconds: initialTimeSeconds = 0,
  maxAttempts: initialMaxAttempts = 1,
  onQuestionChange,
  onInstructionsChange,
  onAudioChange,
  onLyricsChange,
  onPointsChange,
  onTimeMinutesChange,
  onTimeSecondsChange,
  onMaxAttemptsChange,
}: LyricsTrainingProps) {
  const [questionText, setQuestionText] = useState(question);
  const [instructionsText, setInstructionsText] = useState(instructions);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
  const [lyricsList, setLyricsList] = useState<LyricsLine[]>(
    lyrics.length > 0
      ? lyrics
      : [
          {
            id: `line-${Date.now()}`,
            text: "",
            options: ["", "", ""],
            correctWord: "",
          },
        ]
  );
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

  const handleLyricTextChange = (id: string, text: string) => {
    const newLyrics = lyricsList.map((l) => (l.id === id ? { ...l, text } : l));
    setLyricsList(newLyrics);
    onLyricsChange?.(newLyrics);
  };

  const handleOptionChange = (id: string, optionIndex: number, value: string) => {
    const newLyrics = lyricsList.map((l) => {
      if (l.id === id) {
        const newOptions = [...l.options];
        newOptions[optionIndex] = value;
        return { ...l, options: newOptions };
      }
      return l;
    });
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
      options: ["", "", ""],
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
      {/* Row 1: Question Text and Instructions */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
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
        <div className="col-span-6">
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
      </div>

      {/* Row 2: Audio File */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Song Audio File *
        </label>
        <AudioUpload
          audioUrl={audioUrl}
          onAudioChange={(url) => {
            setAudioUrl(url);
            onAudioChange?.(url);
          }}
        />
      </div>

      {/* Row 3: Lyrics Lines (Dynamic) */}
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
          {lyricsList.map((lyric, index) => (
            <div key={lyric.id} className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
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
                  placeholder="Enter the question/lyric line..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
                />

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-500">Option 1</label>
                    <input
                      type="text"
                      value={lyric.options[0] || ""}
                      onChange={(e) => handleOptionChange(lyric.id, 0, e.target.value)}
                      placeholder="Option 1"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-500">Option 2</label>
                    <input
                      type="text"
                      value={lyric.options[1] || ""}
                      onChange={(e) => handleOptionChange(lyric.id, 1, e.target.value)}
                      placeholder="Option 2"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-500">Option 3</label>
                    <input
                      type="text"
                      value={lyric.options[2] || ""}
                      onChange={(e) => handleOptionChange(lyric.id, 2, e.target.value)}
                      placeholder="Option 3"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Correct Word/Option *</label>
                  <select
                    value={lyric.correctWord}
                    onChange={(e) => handleCorrectWordChange(lyric.id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
                  >
                    <option value="">Select correct answer</option>
                    {lyric.options.filter(opt => opt).map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Points, Time, and Max Attempts */}
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
