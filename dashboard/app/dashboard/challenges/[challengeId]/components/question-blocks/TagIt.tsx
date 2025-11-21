"use client";

import React, { useState } from "react";

interface TagItProps {
  question?: string;
  sentence?: string;
  blankPosition?: number;
  correctWord?: string;
  hints?: string[];
  onQuestionChange?: (question: string) => void;
  onSentenceChange?: (sentence: string) => void;
  onBlankPositionChange?: (position: number) => void;
  onCorrectWordChange?: (word: string) => void;
  onHintsChange?: (hints: string[]) => void;
}

export default function TagIt({
  question = "",
  sentence = "",
  blankPosition = 0,
  correctWord = "",
  hints = [],
  onQuestionChange,
  onSentenceChange,
  onBlankPositionChange,
  onCorrectWordChange,
  onHintsChange,
}: TagItProps) {
  const [questionText, setQuestionText] = useState(question);
  const [sentenceText, setSentenceText] = useState(sentence);
  const [blankPos, setBlankPos] = useState(blankPosition);
  const [correctWordText, setCorrectWordText] = useState(correctWord);
  const [hintsList, setHintsList] = useState<string[]>(hints.length > 0 ? hints : [""]);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleSentenceChange = (value: string) => {
    setSentenceText(value);
    onSentenceChange?.(value);
  };

  const handleBlankPositionChange = (value: number) => {
    setBlankPos(value);
    onBlankPositionChange?.(value);
  };

  const handleCorrectWordChange = (value: string) => {
    setCorrectWordText(value);
    onCorrectWordChange?.(value);
  };

  const handleHintChange = (index: number, value: string) => {
    const newHints = [...hintsList];
    newHints[index] = value;
    setHintsList(newHints);
    onHintsChange?.(newHints);
  };

  const handleAddHint = () => {
    const newHints = [...hintsList, ""];
    setHintsList(newHints);
    onHintsChange?.(newHints);
  };

  const handleRemoveHint = (index: number) => {
    if (hintsList.length > 1) {
      const newHints = hintsList.filter((_, i) => i !== index);
      setHintsList(newHints);
      onHintsChange?.(newHints);
    }
  };

  const words = sentenceText.split(/\s+/).filter((w) => w.trim() !== "");

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
          Use "___" or leave a blank space to indicate where the word should be filled
        </p>
        {words.length > 0 && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">Select blank position (word number):</p>
            <div className="flex flex-wrap gap-2">
              {words.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleBlankPositionChange(index)}
                  className={`px-3 py-1 rounded-lg text-sm border-2 transition-colors ${
                    blankPos === index
                      ? "border-[#44b07f] bg-[#44b07f]/10 text-[#44b07f] font-medium"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {index + 1}. {word === "___" || word.trim() === "" ? "[BLANK]" : word}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correct Word *
        </label>
        <input
          type="text"
          value={correctWordText}
          onChange={(e) => handleCorrectWordChange(e.target.value)}
          placeholder="Enter the correct word to fill the blank"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        />
        <p className="text-xs text-yellow-600 mt-1">
          ⚠️ This question requires manual validation by teachers
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Hints (Optional)
          </label>
          <button
            onClick={handleAddHint}
            className="px-3 py-1 text-sm text-[#44b07f] hover:bg-[#44b07f]/10 rounded-lg transition-colors"
          >
            + Add Hint
          </button>
        </div>
        <div className="space-y-2">
          {hintsList.map((hint, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={hint}
                onChange={(e) => handleHintChange(index, e.target.value)}
                placeholder={`Hint ${index + 1}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
              />
              {hintsList.length > 1 && (
                <button
                  onClick={() => handleRemoveHint(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
