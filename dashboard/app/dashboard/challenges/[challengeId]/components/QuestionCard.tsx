"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import { Question } from "./QuestionsSection";

type QuestionFieldValue = string | string[] | undefined;

interface QuestionCardProps {
  question: Question;
  index: number;
  area: string;
  onRemove: () => void;
  onQuestionChange: (field: string, value: QuestionFieldValue) => void;
  onOptionChange: (optionIndex: number, value: string) => void;
}

export default function QuestionCard({
  question,
  index,
  area,
  onRemove,
  onQuestionChange,
  onOptionChange,
}: QuestionCardProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Question {index + 1}
        </h3>
        <button
          onClick={onRemove}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <DeleteIcon fontSize="small" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Text *
        </label>
        <textarea
          value={question.question}
          onChange={(e) => onQuestionChange("question", e.target.value)}
          placeholder="Enter the question..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Type *
        </label>
        <select
          value={question.type}
          onChange={(e) => onQuestionChange("type", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        >
          <option value="multiple_choice">Multiple Choice</option>
          <option value="open_ended">Open Ended</option>
          <option value="true_false">True/False</option>
        </select>
      </div>

      {question.type === "multiple_choice" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Answer Options *
          </label>
          <div className="space-y-2">
            {question.options?.map((option, optionIndex) => (
              <input
                key={optionIndex}
                type="text"
                value={option}
                onChange={(e) => onOptionChange(optionIndex, e.target.value)}
                placeholder={`Option ${optionIndex + 1}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
              />
            ))}
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer *
            </label>
            <input
              type="text"
              value={question.correctAnswer || ""}
              onChange={(e) => onQuestionChange("correctAnswer", e.target.value)}
              placeholder="Enter the correct answer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
            />
          </div>
        </div>
      )}

      {question.type === "true_false" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correct Answer *
          </label>
          <select
            value={question.correctAnswer || ""}
            onChange={(e) => onQuestionChange("correctAnswer", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          >
            <option value="">Select answer</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      )}

      {question.type === "open_ended" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            Open-ended questions will be reviewed manually by teachers.
          </p>
        </div>
      )}
    </div>
  );
}
