"use client";

import React from "react";
import { Question } from "@/definitions/types/Question";
import { useDeleteQuestion } from "@/src/services/questions";

interface DeleteQuestionModalProps {
  question: Question;
  onClose: () => void;
  onDeleted?: () => void;
}

const DeleteQuestionModal: React.FC<DeleteQuestionModalProps> = ({
  question,
  onClose,
  onDeleted,
}) => {
  const { mutate: deleteQuestion, isPending } = useDeleteQuestion();

  const handleDelete = () => {
    deleteQuestion(question.id, {
      onSuccess: () => {
        onDeleted?.();
        onClose();
      },
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Warning Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-red-600 text-2xl">⚠️</span>
        </div>

        {/* Title and Description */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Delete Question?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Are you sure you want to delete this question?
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
            This action cannot be undone. The question will be permanently
            removed.
          </p>
        </div>

        {/* Question Preview */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 w-full border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-left space-y-2">
            <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
              {question.text}
            </p>
            <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
              <span>
                <span className="font-medium">Type:</span>{" "}
                {question.type.replace(/_/g, " ")}
              </span>
              <span>
                <span className="font-medium">Points:</span> {question.points}
              </span>
              <span>
                <span className="font-medium">Stage:</span> {question.stage}
              </span>
            </div>
          </div>
        </div>

        {/* Sub-questions Warning */}
        {question.subQuestions && question.subQuestions.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 w-full">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              ⚠️ This question has{" "}
              <span className="font-semibold">
                {question.subQuestions.length} sub-question
                {question.subQuestions.length > 1 ? "s" : ""}
              </span>{" "}
              that will also be deleted.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              "Delete Question"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteQuestionModal;
