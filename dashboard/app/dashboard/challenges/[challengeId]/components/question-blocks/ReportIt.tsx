"use client";

import React, { useState } from "react";

interface ReportItProps {
  question?: string;
  originalSentence?: string;
  exampleReport?: string;
  onQuestionChange?: (question: string) => void;
  onOriginalSentenceChange?: (sentence: string) => void;
  onExampleReportChange?: (report: string) => void;
}

export default function ReportIt({
  question = "",
  originalSentence = "",
  exampleReport = "",
  onQuestionChange,
  onOriginalSentenceChange,
  onExampleReportChange,
}: ReportItProps) {
  const [questionText, setQuestionText] = useState(question);
  const [originalSentenceText, setOriginalSentenceText] = useState(originalSentence);
  const [exampleReportText, setExampleReportText] = useState(exampleReport);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleOriginalSentenceChange = (value: string) => {
    setOriginalSentenceText(value);
    onOriginalSentenceChange?.(value);
  };

  const handleExampleReportChange = (value: string) => {
    setExampleReportText(value);
    onExampleReportChange?.(value);
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
          Original Sentence *
        </label>
        <textarea
          value={originalSentenceText}
          onChange={(e) => handleOriginalSentenceChange(e.target.value)}
          placeholder="Enter the original sentence to rewrite (e.g., Direct speech: 'I am happy' he said)"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          The sentence that students need to rewrite in report format
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Example Report Format (Optional)
        </label>
        <textarea
          value={exampleReportText}
          onChange={(e) => handleExampleReportChange(e.target.value)}
          placeholder="Enter example of correct report format (e.g., Reported speech: He said he was happy)"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          This serves as a reference for grading. Students will rewrite in this format.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>AI Validation:</strong> This question will be automatically validated using AI to check if the rewritten sentence follows the proper report format.
        </p>
      </div>
    </div>
  );
}
