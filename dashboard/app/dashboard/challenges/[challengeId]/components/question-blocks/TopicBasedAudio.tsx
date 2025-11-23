"use client";

import React, { useState, useRef } from "react";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import AudioUpload from "@/components/elements/AudioUpload";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface TopicBasedAudioProps {
  question?: string;
  audioUrl?: string;
  questions?: Question[];
  onQuestionChange?: (question: string) => void;
  onAudioChange?: (audioUrl: string | null) => void;
  onQuestionsChange?: (questions: Question[]) => void;
}

export default function TopicBasedAudio({
  question = "",
  audioUrl: initialAudioUrl,
  questions = [],
  onQuestionChange,
  onAudioChange,
  onQuestionsChange,
}: TopicBasedAudioProps) {
  const [questionText, setQuestionText] = useState(question);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
  const [questionsList, setQuestionsList] = useState<Question[]>(
    questions.length > 0
      ? questions
      : [
          {
            id: `q-${Date.now()}`,
            text: "",
            options: ["", "", "", ""],
            correctAnswer: "",
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

  const handleOptionChange = (questionId: string, optionIndex: number, value: string) => {
    const newQuestions = questionsList.map((q) => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    });
    setQuestionsList(newQuestions);
    onQuestionsChange?.(newQuestions);
  };

  const handleCorrectAnswerChange = (questionId: string, answer: string) => {
    const newQuestions = questionsList.map((q) =>
      q.id === questionId ? { ...q, correctAnswer: answer } : q
    );
    setQuestionsList(newQuestions);
    onQuestionsChange?.(newQuestions);
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}-${Math.random()}`,
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    };
    const newQuestions = [...questionsList, newQuestion];
    setQuestionsList(newQuestions);
    onQuestionsChange?.(newQuestions);
  };

  const handleRemoveQuestion = (id: string) => {
    if (questionsList.length > 1) {
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Audio File *
        </label>
        <AudioUpload
          audioUrl={audioUrl}
          onAudioChange={(url) => {
            setAudioUrl(url);
            onAudioChange?.(url);
          }}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Multiple Choice Questions *
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
          {questionsList.map((q, qIndex) => (
            <div key={q.id} className="p-4 border-2 border-gray-200 rounded-lg bg-white">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Question {qIndex + 1}
                </span>
                {questionsList.length > 1 && (
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
              <div className="space-y-2">
                {q.options.map((option, oIndex) => (
                  <div
                    key={oIndex}
                    className={`
                      flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer
                      transition-all duration-200
                      ${q.correctAnswer === option
                        ? "border-[#44b07f] bg-[#44b07f]/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                      }
                    `}
                  >
                    <RadioButtonUncheckedIcon
                      className={q.correctAnswer === option ? "text-[#44b07f]" : "text-gray-400"}
                      fontSize="small"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(q.id, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      className={`flex-1 px-2 py-1 border-0 bg-transparent focus:outline-none focus:ring-0 ${
                        q.correctAnswer === option ? "text-[#44b07f] font-medium" : "text-gray-700"
                      }`}
                      onClick={() => handleCorrectAnswerChange(q.id, option)}
                    />
                    {q.correctAnswer === option && (
                      <span className="text-[#44b07f] font-medium">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
