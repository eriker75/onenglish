"use client";

import React, { useState, useRef } from "react";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import MicIcon from "@mui/icons-material/Mic";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

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
            <MicIcon
              className={`text-4xl ${isDragging ? "text-[#44b07f]" : "text-gray-400"}`}
            />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Drag and drop an audio file
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
