"use client";

import React, { useState, useEffect } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageUpload from "@/components/elements/ImageUpload";

interface TagItProps {
  question?: string;
  instructions?: string;
  content?: string[];
  answer?: string[];
  imageUrl?: string;
  points?: number;
  timeMinutes?: number;
  timeSeconds?: number;
  maxAttempts?: number;
  onQuestionChange?: (question: string) => void;
  onInstructionsChange?: (instructions: string) => void;
  onContentChange?: (content: string[]) => void;
  onAnswerChange?: (answer: string[]) => void;
  onImageChange?: (imageUrl: string | null) => void;
  onPointsChange?: (points: number) => void;
  onTimeMinutesChange?: (minutes: number) => void;
  onTimeSecondsChange?: (seconds: number) => void;
  onMaxAttemptsChange?: (attempts: number) => void;
}

export default function TagIt({
  question = "",
  instructions = "",
  content = [],
  answer = [],
  imageUrl: initialImageUrl,
  points: initialPoints = 0,
  timeMinutes: initialTimeMinutes = 0,
  timeSeconds: initialTimeSeconds = 0,
  maxAttempts: initialMaxAttempts = 1,
  onQuestionChange,
  onInstructionsChange,
  onContentChange,
  onAnswerChange,
  onImageChange,
  onPointsChange,
  onTimeMinutesChange,
  onTimeSecondsChange,
  onMaxAttemptsChange,
}: TagItProps) {
  const [questionText, setQuestionText] = useState(question);
  const [instructionsText, setInstructionsText] = useState(instructions);
  const [sentenceInput, setSentenceInput] = useState("");
  const [answerList, setAnswerList] = useState<string[]>(answer.length > 0 ? answer : [""]);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [pointsValue, setPointsValue] = useState(initialPoints);
  const [timeMinutesValue, setTimeMinutesValue] = useState(initialTimeMinutes);
  const [timeSecondsValue, setTimeSecondsValue] = useState(initialTimeSeconds);
  const [maxAttemptsValue, setMaxAttemptsValue] = useState(initialMaxAttempts);

  // Initialize sentence input from content array
  useEffect(() => {
    if (content && content.length > 0 && !sentenceInput) {
      // Join with " ___ " placeholder
      setSentenceInput(content.join(" ___ "));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleInstructionsChange = (value: string) => {
    setInstructionsText(value);
    onInstructionsChange?.(value);
  };

  const handleSentenceInputChange = (value: string) => {
    setSentenceInput(value);
    // Split by "___" to create content array
    const parts = value.split("___").map((s) => s.trim()).filter((s) => s !== "");
    onContentChange?.(parts);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answerList];
    newAnswers[index] = value;
    setAnswerList(newAnswers);
    onAnswerChange?.(newAnswers);
  };

  const handleAddAnswer = () => {
    const newAnswers = [...answerList, ""];
    setAnswerList(newAnswers);
    onAnswerChange?.(newAnswers);
  };

  const handleRemoveAnswer = (index: number) => {
    if (answerList.length > 1) {
      const newAnswers = answerList.filter((_, i) => i !== index);
      setAnswerList(newAnswers);
      onAnswerChange?.(newAnswers);
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
      <div className="grid grid-cols-12 gap-6">
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

      {/* Row 2: Content/Answers and Image */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Sentence Content and Valid Answers */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sentence Content *
            </label>
            <input
              type="text"
              value={sentenceInput}
              onChange={(e) => handleSentenceInputChange(e.target.value)}
              placeholder="e.g. He is responsible for the project, ___ ?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use <strong>___</strong> (three underscores) to mark the gap position. This will split the content for the student.
            </p>
            {sentenceInput.includes("___") && (
              <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200 text-sm">
                <span className="font-semibold text-gray-600">Preview: </span>
                {sentenceInput.split("___").map((part, i, arr) => (
                  <React.Fragment key={i}>
                    <span>{part}</span>
                    {i < arr.length - 1 && (
                      <span className="mx-1 px-2 py-0.5 bg-[#44b07f]/10 text-[#44b07f] rounded border border-[#44b07f]/30 text-xs font-bold">
                        [GAP]
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Valid Answers (Dynamic) *
              </label>
              <button
                onClick={handleAddAnswer}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#44b07f] hover:bg-[#44b07f]/10 rounded-lg transition-colors"
              >
                <AddCircleIcon fontSize="small" />
                Add Answer
              </button>
            </div>
            <div className="space-y-2">
              {answerList.map((ans, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ans}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder={`Correct Answer Variation ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
                  />
                  {answerList.length > 1 && (
                    <button
                      onClick={() => handleRemoveAnswer(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove answer"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Add all acceptable variations (e.g., "isn't he", "is not he").
            </p>
          </div>
        </div>

        {/* Right Column: Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image (Optional)
          </label>
          <ImageUpload
            imageUrl={imageUrl}
            onImageChange={(url) => {
              setImageUrl(url);
              onImageChange?.(url);
            }}
            height="h-64"
          />
        </div>
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
