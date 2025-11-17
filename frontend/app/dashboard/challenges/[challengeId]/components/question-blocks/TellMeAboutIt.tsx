"use client";

import React, { useState } from "react";

interface TellMeAboutItProps {
  question?: string;
  sentence?: string;
  exampleStory?: string;
  onQuestionChange?: (question: string) => void;
  onSentenceChange?: (sentence: string) => void;
  onExampleStoryChange?: (story: string) => void;
}

export default function TellMeAboutIt({
  question = "",
  sentence = "",
  exampleStory = "",
  onQuestionChange,
  onSentenceChange,
  onExampleStoryChange,
}: TellMeAboutItProps) {
  const [questionText, setQuestionText] = useState(question);
  const [sentenceText, setSentenceText] = useState(sentence);
  const [exampleStoryText, setExampleStoryText] = useState(exampleStory);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleSentenceChange = (value: string) => {
    setSentenceText(value);
    onSentenceChange?.(value);
  };

  const handleExampleStoryChange = (value: string) => {
    setExampleStoryText(value);
    onExampleStoryChange?.(value);
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
          Input Sentence *
        </label>
        <textarea
          value={sentenceText}
          onChange={(e) => handleSentenceChange(e.target.value)}
          placeholder="Enter the sentence that students will use to create a story..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          The sentence that students will use as a base to create their story in English
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Example Story (Optional)
        </label>
        <textarea
          value={exampleStoryText}
          onChange={(e) => handleExampleStoryChange(e.target.value)}
          placeholder="Enter an example story that can be created from the sentence..."
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          This serves as a reference for AI validation
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>AI Validation:</strong> Students will create a story in English about the provided sentence. The story will be automatically validated using AI to check grammar, coherence, and relevance to the input sentence.
        </p>
      </div>
    </div>
  );
}
