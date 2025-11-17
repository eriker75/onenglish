"use client";

import React, { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";

interface Question {
  id: string;
  text: string;
  expectedAnswer?: string;
}

interface SuperBrainProps {
  question?: string;
  questions?: Question[];
  onQuestionChange?: (question: string) => void;
  onQuestionsChange?: (questions: Question[]) => void;
}

export default function SuperBrain({
  question = "",
  questions = [],
  onQuestionChange,
  onQuestionsChange,
}: SuperBrainProps) {
  const [questionText, setQuestionText] = useState(question);
  const [questionsList, setQuestionsList] = useState<Question[]>(
    questions.length > 0
      ? questions
      : [
          {
            id: `q-${Date.now()}`,
            text: "",
          },
        ]
  );

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleQuestionTextChange = (id: string, text: string) => {
    const newQuestions = questionsList.map((q) =>
      q.id === id ? { ...q, text } : q
    );
    setQuestionsList(newQuestions);
    onQuestionsChange?.(newQuestions);
  };

  const handleExpectedAnswerChange = (id: string, answer: string) => {
    const newQuestions = questionsList.map((q) =>
      q.id === id ? { ...q, expectedAnswer: answer } : q
    );
    setQuestionsList(newQuestions);
    onQuestionsChange?.(newQuestions);
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}-${Math.random()}`,
      text: "",
    };
    const newQuestions = [...questionsList, newQuestion];
    setQuestionsList(newQuestions);
    onQuestionsChange?.(newQuestions);
  };

  const handleRemoveQuestion = (id: string) => {
    if (questionsList.length >= 3) {
      const newQuestions = questionsList.filter((q) => q.id !== id);
      setQuestionsList(newQuestions);
      onQuestionsChange?.(newQuestions);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Topic Description *
        </label>
        <textarea
          value={questionText}
          onChange={(e) => handleQuestionChange(e.target.value)}
          placeholder="Enter the topic description..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Questions (3 or more) *
          </label>
          <button
            onClick={handleAddQuestion}
            className="flex items-center gap-1 px-3 py-1 text-sm text-[#44b07f] hover:bg-[#44b07f]/10 rounded-lg transition-colors"
          >
            <AddCircleIcon fontSize="small" />
            Add Question
          </button>
        </div>
        <div className="space-y-4">
          {questionsList.map((q, index) => (
            <div key={q.id} className="p-4 border-2 border-gray-200 rounded-lg bg-white">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Question {index + 1}
                </span>
                {questionsList.length >= 3 && (
                  <button
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                )}
              </div>
              <textarea
                value={q.text}
                onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
                placeholder="Enter question text..."
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent mb-3"
              />
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Expected Answer (Optional - for AI validation reference)
                </label>
                <textarea
                  value={q.expectedAnswer || ""}
                  onChange={(e) => handleExpectedAnswerChange(q.id, e.target.value)}
                  placeholder="Enter expected answer pattern or key points..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent text-sm"
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Students will answer each question with an audio response in English. Responses should be clear and answer the question directly.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>AI Validation:</strong> Student audio responses will be automatically validated using AI to check if they answer the questions appropriately and are in English. Responses should not be too short or too long.
        </p>
      </div>
    </div>
  );
}
