"use client";

import React, { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageUpload from "@/components/elements/ImageUpload";

interface Statement {
  id: string;
  text: string;
  correct: boolean;
}

interface ReadItProps {
  question?: string;
  instructions?: string;
  paragraph?: string;
  statements?: Statement[];
  imageUrl?: string;
  points?: number;
  timeMinutes?: number;
  timeSeconds?: number;
  maxAttempts?: number;
  onQuestionChange?: (question: string) => void;
  onInstructionsChange?: (instructions: string) => void;
  onParagraphChange?: (paragraph: string) => void;
  onStatementsChange?: (statements: Statement[]) => void;
  onImageChange?: (imageUrl: string | null) => void;
  onFileChange?: (file: File | null) => void;
  onPointsChange?: (points: number) => void;
  onTimeMinutesChange?: (minutes: number) => void;
  onTimeSecondsChange?: (seconds: number) => void;
  onMaxAttemptsChange?: (attempts: number) => void;
}

export default function ReadIt({
  question = "",
  instructions = "",
  paragraph = "",
  statements = [],
  imageUrl: initialImageUrl,
  points: initialPoints = 0,
  timeMinutes: initialTimeMinutes = 0,
  timeSeconds: initialTimeSeconds = 0,
  maxAttempts: initialMaxAttempts = 1,
  onQuestionChange,
  onInstructionsChange,
  onParagraphChange,
  onStatementsChange,
  onImageChange,
  onFileChange,
  onPointsChange,
  onTimeMinutesChange,
  onTimeSecondsChange,
  onMaxAttemptsChange,
}: ReadItProps) {
  const [questionText, setQuestionText] = useState(question);
  const [instructionsText, setInstructionsText] = useState(instructions);
  const [paragraphText, setParagraphText] = useState(paragraph);
  const [statementsList, setStatementsList] = useState<Statement[]>(
    statements.length > 0
      ? statements
      : [{ id: `stmt-${Date.now()}`, text: "", correct: true }]
  );
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
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

  const handleParagraphChange = (value: string) => {
    setParagraphText(value);
    onParagraphChange?.(value);
  };

  const handleStatementChange = (id: string, field: "text" | "correct", value: string | boolean) => {
    const newStatements = statementsList.map((stmt) =>
      stmt.id === id ? { ...stmt, [field]: value } : stmt
    );
    setStatementsList(newStatements);
    onStatementsChange?.(newStatements);
  };

  const handleAddStatement = () => {
    const newStatement: Statement = {
      id: `stmt-${Date.now()}-${Math.random()}`,
      text: "",
      correct: true,
    };
    const newStatements = [...statementsList, newStatement];
    setStatementsList(newStatements);
    onStatementsChange?.(newStatements);
  };

  const handleRemoveStatement = (id: string) => {
    if (statementsList.length > 1) {
      const newStatements = statementsList.filter((stmt) => stmt.id !== id);
      setStatementsList(newStatements);
      onStatementsChange?.(newStatements);
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

      {/* Row 2: Paragraph and Image */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paragraph *
          </label>
          <textarea
            value={paragraphText}
            onChange={(e) => handleParagraphChange(e.target.value)}
            placeholder="Enter the paragraph that students need to read..."
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent resize-none"
          />
        </div>
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image (Optional)
          </label>
          <ImageUpload
            imageUrl={imageUrl}
            onImageChange={(url) => {
              setImageUrl(url);
              onImageChange?.(url);
            }}
            onFileChange={onFileChange}
            height="h-64"
          />
        </div>
      </div>

      {/* Row 3: True/False Statements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            True/False Statements *
          </label>
          <button
            onClick={handleAddStatement}
            className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-[#44b07f] hover:bg-[#44b07f]/10 rounded-lg transition-colors"
          >
            <AddCircleIcon fontSize="small" />
            Add Statement
          </button>
        </div>
        <div className="space-y-3">
          {statementsList.map((statement, index) => (
            <div
              key={statement.id}
              className="p-4 border border-gray-200 rounded-lg bg-white"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                
                {/* Statement Input - Text Type */}
                <input
                  type="text"
                  value={statement.text}
                  onChange={(e) =>
                    handleStatementChange(statement.id, "text", e.target.value)
                  }
                  placeholder="Enter statement..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
                />

                {/* True/False Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleStatementChange(statement.id, "correct", true)
                    }
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors text-sm font-medium ${
                      statement.correct
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <CheckCircleIcon fontSize="small" className={statement.correct ? "text-green-600" : "text-gray-400"} />
                    True
                  </button>
                  <button
                    onClick={() =>
                      handleStatementChange(statement.id, "correct", false)
                    }
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors text-sm font-medium ${
                      !statement.correct
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <CancelIcon fontSize="small" className={!statement.correct ? "text-red-600" : "text-gray-400"} />
                    False
                  </button>
                </div>

                {statementsList.length > 1 && (
                  <button
                    onClick={() => handleRemoveStatement(statement.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                    title="Remove statement"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                )}
              </div>
            </div>
          ))}
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
