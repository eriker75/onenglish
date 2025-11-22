"use client";

import React, { useState, useEffect } from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageUpload from "@/components/elements/ImageUpload";

interface UnscrambleProps {
  question?: string;
  instructions?: string;
  words?: string[];
  correctSentence?: string;
  imageUrl?: string;
  points?: number;
  timeMinutes?: number;
  timeSeconds?: number;
  maxAttempts?: number;
  onQuestionChange?: (question: string) => void;
  onInstructionsChange?: (instructions: string) => void;
  onWordsChange?: (words: string[]) => void;
  onCorrectSentenceChange?: (sentence: string) => void;
  onImageChange?: (imageUrl: string | null) => void;
  onPointsChange?: (points: number) => void;
  onTimeMinutesChange?: (minutes: number) => void;
  onTimeSecondsChange?: (seconds: number) => void;
  onMaxAttemptsChange?: (attempts: number) => void;
}

export default function Unscramble({
  question = "",
  instructions = "",
  words = [],
  correctSentence = "",
  imageUrl: initialImageUrl,
  points: initialPoints = 0,
  timeMinutes: initialTimeMinutes = 0,
  timeSeconds: initialTimeSeconds = 0,
  maxAttempts: initialMaxAttempts = 1,
  onQuestionChange,
  onInstructionsChange,
  onWordsChange,
  onCorrectSentenceChange,
  onImageChange,
  onPointsChange,
  onTimeMinutesChange,
  onTimeSecondsChange,
  onMaxAttemptsChange,
}: UnscrambleProps) {
  const [questionText, setQuestionText] = useState(question);
  const [instructionsText, setInstructionsText] = useState(instructions);
  const [scrambledWords, setScrambledWords] = useState<string[]>(
    words.length > 0 ? words : []
  );
  const [correctSentenceText, setCorrectSentenceText] = useState(correctSentence);
  const [correctWords, setCorrectWords] = useState<string[]>(
    correctSentence
      ? correctSentence.split(/\s+/).filter((w) => w.trim() !== "")
      : []
  );
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedCorrectIndex, setDraggedCorrectIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pointsValue, setPointsValue] = useState(initialPoints);
  const [timeMinutesValue, setTimeMinutesValue] = useState(initialTimeMinutes);
  const [timeSecondsValue, setTimeSecondsValue] = useState(initialTimeSeconds);
  const [maxAttemptsValue, setMaxAttemptsValue] = useState(initialMaxAttempts);

  // Shuffle array function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleInstructionsChange = (value: string) => {
    setInstructionsText(value);
    onInstructionsChange?.(value);
  };


  // Initialize from correct sentence if provided and scrambled words are empty (only on mount)
  useEffect(() => {
    if (correctSentence && correctSentence.trim() !== "" && scrambledWords.length === 0 && words.length === 0) {
      const wordsArray = correctSentence.split(/\s+/).filter((w) => w.trim() !== "");
      setCorrectWords(wordsArray);
      const shuffled = shuffleArray(wordsArray);
      setScrambledWords(shuffled);
      onWordsChange?.(shuffled);
      const sentence = shuffled.filter((w) => w.trim() !== "").join(" ");
      setCorrectSentenceText(sentence);
      onCorrectSentenceChange?.(sentence);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update sentence whenever correct words change
  useEffect(() => {
    if (correctWords.length > 0) {
      const sentence = correctWords.filter((w) => w.trim() !== "").join(" ");
      if (sentence !== correctSentenceText) {
        setCorrectSentenceText(sentence);
        onCorrectSentenceChange?.(sentence);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctWords]);

  const handleScrambleWords = () => {
    // Shuffle current scrambled words
    if (scrambledWords.length > 0) {
      const nonEmptyWords = scrambledWords.filter((w) => w.trim() !== "");
      if (nonEmptyWords.length > 0) {
        const shuffled = shuffleArray(nonEmptyWords);
        setScrambledWords(shuffled);
        onWordsChange?.(shuffled);
      }
    } else if (correctWords.length > 0) {
      // Fallback: shuffle correct words if scrambled words are empty
      const shuffled = shuffleArray(correctWords);
      setScrambledWords(shuffled);
      onWordsChange?.(shuffled);
    }
  };

  const handleAddWord = () => {
    const newWords = [...scrambledWords, ""];
    setScrambledWords(newWords);
    onWordsChange?.(newWords);
    // Don't update sentence until word is filled
  };

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...scrambledWords];
    newWords[index] = value;
    setScrambledWords(newWords);
    onWordsChange?.(newWords);
  };

  const handleRemoveWord = (index: number) => {
    if (scrambledWords.length > 1) {
      const newWords = scrambledWords.filter((_, i) => i !== index);
      setScrambledWords(newWords);
      onWordsChange?.(newWords);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newWords = [...scrambledWords];
    const draggedWord = newWords[draggedIndex];
    newWords.splice(draggedIndex, 1);
    newWords.splice(index, 0, draggedWord);

    setScrambledWords(newWords);
    setDraggedIndex(index);
    onWordsChange?.(newWords);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setIsDragging(false);
  };

  // Correct Order drag and drop handlers
  const handleCorrectDragStart = (index: number) => {
    setDraggedCorrectIndex(index);
    setIsDragging(true);
  };

  const handleCorrectDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedCorrectIndex === null || draggedCorrectIndex === index) return;

    const newWords = [...correctWords];
    const draggedWord = newWords[draggedCorrectIndex];
    newWords.splice(draggedCorrectIndex, 1);
    newWords.splice(index, 0, draggedWord);

    setCorrectWords(newWords);
    setDraggedCorrectIndex(index);
  };

  const handleCorrectDragEnd = () => {
    setDraggedCorrectIndex(null);
    setIsDragging(false);
  };

  const handleCorrectWordChange = (index: number, value: string) => {
    const newWords = [...correctWords];
    newWords[index] = value;
    setCorrectWords(newWords);
  };

  const handleAddCorrectWord = () => {
    const newWords = [...correctWords, ""];
    setCorrectWords(newWords);
  };

  const handleRemoveCorrectWord = (index: number) => {
    if (correctWords.length > 1) {
      const newWords = correctWords.filter((_, i) => i !== index);
      setCorrectWords(newWords);
    }
  };

  const handleSyncFromScrambled = () => {
    // Copy scrambled words to correct words
    const nonEmptyWords = scrambledWords.filter((w) => w.trim() !== "");
    if (nonEmptyWords.length > 0) {
      setCorrectWords([...nonEmptyWords]);
    }
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

  const handleDragOverImage = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeaveImage = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDropImage = (e: React.DragEvent) => {
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
    <div className={`w-full space-y-6 ${isDragging ? 'cursor-grabbing' : ''}`}>
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image (Optional)
        </label>
        {!imageUrl ? (
          <div
            onDragOver={handleDragOverImage}
            onDragLeave={handleDragLeaveImage}
            onDrop={handleDropImage}
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

      {/* Visual Word Editor Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Scrambled Words (Drag to Reorder) *
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleScrambleWords}
              className="px-4 py-2 text-sm font-medium text-white bg-[#FF0098] hover:bg-[#FF0098]/90 rounded-lg transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={scrambledWords.filter((w) => w.trim() !== "").length === 0}
            >
              Shuffle
            </button>
            <button
              onClick={handleAddWord}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#33CC00] bg-white border-2 border-[#33CC00] hover:bg-[#33CC00] hover:text-white rounded-lg transition-colors shadow-sm"
            >
              <AddCircleIcon fontSize="small" />
              Add Word
            </button>
          </div>
        </div>

        <div className="min-h-[120px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex flex-wrap gap-2">
            {scrambledWords.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                Enter a sentence above or add words manually
              </p>
            ) : (
              scrambledWords.map((word, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`
                    group flex items-center gap-2 px-4 py-2 bg-white border-2 rounded-lg cursor-move
                    transition-all duration-200
                    ${draggedIndex === index
                      ? "border-[#44b07f] bg-[#44b07f]/10 shadow-lg scale-105"
                      : "border-gray-300 hover:border-gray-400 hover:shadow-md"
                    }
                  `}
                >
                  <DragIndicatorIcon
                    className="text-gray-400 group-hover:text-gray-600"
                    fontSize="small"
                  />
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => handleWordChange(index, e.target.value)}
                    placeholder={`Word ${index + 1}`}
                    className="flex-1 min-w-[80px] px-2 py-1 border-0 bg-transparent focus:outline-none focus:ring-0 text-gray-700 font-medium"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {scrambledWords.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveWord(index);
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove word"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Drag words to reorder them. Students will see them in this scrambled order.
        </p>
      </div>

      {/* Correct Order Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Correct Order (Drag to Reorder) *
          </label>
          <button
            onClick={handleSyncFromScrambled}
            className="px-4 py-2 text-sm font-medium text-white bg-[#FF0098] hover:bg-[#FF0098]/90 rounded-lg transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={scrambledWords.filter((w) => w.trim() !== "").length === 0}
          >
            Sync from Scrambled
          </button>
        </div>

        <div className="min-h-[120px] p-4 bg-green-50 rounded-lg border-2 border-dashed border-green-300">
          <div className="flex flex-wrap gap-2">
            {correctWords.length === 0 ? (
              <p className="text-sm text-green-400 italic">
                Reorder words here to set the correct answer. Click "Sync from Scrambled" to copy words from above.
              </p>
            ) : (
              correctWords.map((word, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleCorrectDragStart(index)}
                  onDragOver={(e) => handleCorrectDragOver(e, index)}
                  onDragEnd={handleCorrectDragEnd}
                  className={`
                    group flex items-center gap-2 px-4 py-2 bg-white border-2 rounded-lg cursor-move
                    transition-all duration-200
                    ${draggedCorrectIndex === index
                      ? "border-green-500 bg-green-100 shadow-lg scale-105"
                      : "border-green-300 hover:border-green-400 hover:shadow-md"
                    }
                  `}
                >
                  <DragIndicatorIcon
                    className="text-green-400 group-hover:text-green-600"
                    fontSize="small"
                  />
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => handleCorrectWordChange(index, e.target.value)}
                    placeholder={`Word ${index + 1}`}
                    className="flex-1 min-w-[80px] px-2 py-1 border-0 bg-transparent focus:outline-none focus:ring-0 text-green-700 font-medium"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {correctWords.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCorrectWord(index);
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove word"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Drag words to reorder them. This order will be the correct answer for students.
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
