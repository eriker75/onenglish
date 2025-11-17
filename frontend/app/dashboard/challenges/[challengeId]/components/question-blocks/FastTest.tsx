"use client";

import React, { useState } from "react";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

interface FastTestProps {
  question?: string;
  sentence?: string;
  options?: string[];
  correctAnswer?: string;
  onQuestionChange?: (question: string) => void;
  onSentenceChange?: (sentence: string) => void;
  onOptionsChange?: (options: string[]) => void;
  onCorrectAnswerChange?: (answer: string) => void;
}

export default function FastTest({
  question = "",
  sentence = "",
  options = ["", "", "", ""],
  correctAnswer = "",
  onQuestionChange,
  onSentenceChange,
  onOptionsChange,
  onCorrectAnswerChange,
}: FastTestProps) {
  const [questionText, setQuestionText] = useState(question);
  const [sentenceText, setSentenceText] = useState(sentence);
  const [questionOptions, setQuestionOptions] = useState<string[]>(
    options.length > 0 ? options : ["", "", "", ""]
  );
  const [selectedAnswer, setSelectedAnswer] = useState(correctAnswer);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleSentenceChange = (value: string) => {
    setSentenceText(value);
    onSentenceChange?.(value);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionOptions];
    newOptions[index] = value;
    setQuestionOptions(newOptions);
    onOptionsChange?.(newOptions);
  };

  const handleCorrectAnswerChange = (value: string) => {
    setSelectedAnswer(value);
    onCorrectAnswerChange?.(value);
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
          Sentence with Blank *
        </label>
        <input
          type="text"
          value={sentenceText}
          onChange={(e) => handleSentenceChange(e.target.value)}
          placeholder="Enter the sentence with a blank (use ___ or blank space)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Use "___" or leave a blank space to indicate where the word should be selected
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selection Options *
        </label>
        <div className="space-y-3">
          {questionOptions.map((option, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer
                transition-all duration-200
                ${selectedAnswer === option
                  ? "border-[#44b07f] bg-[#44b07f]/5"
                  : "border-gray-200 hover:border-gray-300 bg-white"
                }
              `}
            >
              <RadioButtonUncheckedIcon
                className={selectedAnswer === option ? "text-[#44b07f]" : "text-gray-400"}
                fontSize="small"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className={`flex-1 px-3 py-2 border-0 bg-transparent focus:outline-none focus:ring-0 ${
                  selectedAnswer === option ? "text-[#44b07f] font-medium" : "text-gray-700"
                }`}
                onClick={() => handleCorrectAnswerChange(option)}
              />
              {selectedAnswer === option && (
                <span className="text-[#44b07f] font-medium">✓</span>
              )}
            </div>
          ))}
        </div>
        {selectedAnswer && (
          <div className="mt-4 p-3 bg-[#44b07f]/10 border border-[#44b07f] rounded-lg">
            <p className="text-sm text-[#44b07f] font-medium">
              ✓ Correct answer: {selectedAnswer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
