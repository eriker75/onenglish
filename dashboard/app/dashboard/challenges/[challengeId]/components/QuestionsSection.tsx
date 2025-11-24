"use client";

import React, { useState } from "react";
import { useChallengeFormUIStore } from "@/src/stores/challenge-form-ui.store";
import QuestionCard from "./QuestionCard";
import QuestionTypeGrid from "./QuestionTypeGrid";
import { QuestionType, questionTypesByArea } from "./questionTypes";
import {
  DebateWrapper,
  FastTestWrapper,
  GossipWrapper,
  ImageToMultipleChoiceWrapper,
  LyricsTrainingWrapper,
  ReadItWrapper,
  ReportItWrapper,
  SentenceMakerWrapper,
  SpellingWrapper,
  SuperBrainWrapper,
  TagItWrapper,
  TalesWrapper,
  TellMeAboutItWrapper,
  TensesWrapper,
  TopicBasedAudioWrapper,
  UnscrambleWrapper,
  WordAssociationsWrapper,
  WordBoxWrapper,
  WordMatchWrapper,
} from "./question-blocks-wrappers";
import { cn } from "@/lib/utils";

export interface Question {
  id: string;
  question?: string;  // Made optional to match backend type
  type: string;
  questionTypeName?: string;
  options?: string[];
  correctAnswer?: string;
  stage?: string; // Stage name
}

export type QuestionFieldValue = string | string[] | Statement[] | undefined;

export interface Statement {
  id: string;
  text: string;
  correct: boolean;
}

interface QuestionsSectionProps {
  area: string;
  questions: Question[];
  onRemoveQuestion: (area: string, questionId: string) => void;
  onQuestionChange: (
    area: string,
    questionId: string,
    field: string,
    value: QuestionFieldValue
  ) => void;
  onOptionChange: (
    area: string,
    questionId: string,
    optionIndex: number,
    value: string
  ) => void;
  onSuccess?: () => void; // Add onSuccess prop for refetching
}

interface WrapperProps {
  existingQuestion?: Question;
  onCancel: () => void;
  onSuccess: () => void;
}

// Component map for mapping question types to their wrapper components
const wrapperMap: Record<string, React.ComponentType<WrapperProps>> = {
  image_to_multiple_choice_text: ImageToMultipleChoiceWrapper,
  wordbox: WordBoxWrapper,
  spelling: SpellingWrapper,
  word_associations_with_text: WordAssociationsWrapper,
  unscramble: UnscrambleWrapper,
  tenses: TensesWrapper,
  tag_it: TagItWrapper,
  report_it: ReportItWrapper,
  read_it: ReadItWrapper,
  word_match: WordMatchWrapper,
  gossip: GossipWrapper,
  topic_based_audio: TopicBasedAudioWrapper,
  lyrics_training: LyricsTrainingWrapper,
  sentence_maker: SentenceMakerWrapper,
  fast_test: FastTestWrapper,
  tales: TalesWrapper,
  superbrain: SuperBrainWrapper,
  tell_me_about_it: TellMeAboutItWrapper,
  debate: DebateWrapper,
};

export default function QuestionsSection({
  area,
  questions,
  onRemoveQuestion,
  onQuestionChange,
  onOptionChange,
  onSuccess,
}: QuestionsSectionProps) {
  const { currentQuestionType, setCurrentQuestionType } =
    useChallengeFormUIStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<QuestionType | null>(null);

  // Filter questions by selected type from store
  const filteredQuestions = React.useMemo(() => {
    if (!currentQuestionType) {
      return questions; // Show all questions if no type filter selected
    }
    return questions.filter((q) => q.type === currentQuestionType);
  }, [questions, currentQuestionType]);

  const [prevArea, setPrevArea] = useState(area);
  const [prevQuestionType, setPrevQuestionType] = useState(currentQuestionType);
  const [prevQuestionsLength, setPrevQuestionsLength] = useState(
    filteredQuestions.length
  );

  // Reset state when area changes (during render)
  if (area !== prevArea) {
    setPrevArea(area);
    setSelectedQuestionType(null);
    setCurrentPage((questions.length || 0) + 1);
  }

  // Reset to page 1 when question type filter changes (during render)
  if (currentQuestionType !== prevQuestionType) {
    setPrevQuestionType(currentQuestionType);
    if (currentQuestionType && currentPage !== 1) {
      setCurrentPage(1);
    }
  }

  // Adjust current page when questions change (during render)
  if (
    !selectedQuestionType &&
    filteredQuestions.length !== prevQuestionsLength
  ) {
    const questionsLengthDecreased =
      filteredQuestions.length < prevQuestionsLength;

    if (questionsLengthDecreased) {
      // After deletion, navigate to grid page
      const targetPage =
        filteredQuestions.length === 0 ? 1 : filteredQuestions.length + 1;
      if (currentPage !== targetPage) {
        setCurrentPage(targetPage);
      }
    }
    setPrevQuestionsLength(filteredQuestions.length);
  }

  const handleSelectQuestionType = (questionType: QuestionType) => {
    // Show the form for the selected question type
    setSelectedQuestionType(questionType);
  };

  const handleCancelQuestion = () => {
    // Cancel adding question, go back to grid
    setSelectedQuestionType(null);
    // Clear currentQuestionType in store if it's set, to avoid auto-reselection in grid
    if (currentQuestionType) {
      setCurrentQuestionType(null);
    }
    // Go to grid page (one page beyond questions)
    setCurrentPage(filteredQuestions.length + 1);
  };

  // Determine what to show on current page
  const isShowingQuestionForm = selectedQuestionType !== null;
  const isShowingGrid =
    !isShowingQuestionForm &&
    (filteredQuestions.length === 0 || currentPage > filteredQuestions.length);
  const currentQuestionIndex = currentPage - 1;
  const currentQuestion =
    currentPage <= filteredQuestions.length
      ? filteredQuestions[currentQuestionIndex]
      : null;

  // Get the component for editing the current question (WRAPPER COMPONENT with existingQuestion)
  const EditQuestionComponent = currentQuestion?.type
    ? wrapperMap[currentQuestion.type]
    : null;

  // Get the form component for the selected question type (WRAPPER COMPONENT)
  const FormComponent = selectedQuestionType
    ? wrapperMap[selectedQuestionType.id]
    : null;

  // When currentQuestionType changes and we're on the grid, auto-select that type to create (during render)
  if (currentQuestionType && isShowingGrid && !selectedQuestionType) {
    // Find the question type from questionTypesByArea
    const allTypes = Object.values(questionTypesByArea).flat();
    const typeToSelect = allTypes.find((t) => t.id === currentQuestionType);

    if (typeToSelect) {
      setSelectedQuestionType(typeToSelect);
    }
  }

  // Calculate pagination info - only show pages for existing questions
  const displayPages = Math.max(1, filteredQuestions.length);

  return (
    <div className="space-y-6">
      {/* Header with Title and Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {area} Questions
            </h2>

            {/* Close button (X) - show when viewing a specific question */}
            {!isShowingQuestionForm && !isShowingGrid && currentQuestion && (
              <button
                onClick={() => {
                  // Clear question type filter and navigate to grid
                  setCurrentQuestionType(null);
                  setCurrentPage(filteredQuestions.length + 1);
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                title="Close question view and return to grid"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Pagination with numbers - Always visible when there are questions or grid */}
        {(displayPages > 0 || filteredQuestions.length === 0) && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </button>

            {/* Page numbers - only show for existing questions */}
            {displayPages > 0 && (
              <div className="flex items-center gap-1">
                {Array.from({ length: displayPages }, (_, i) => i + 1).map(
                  (pageNum) => {
                    const isCurrentPage = pageNum === currentPage;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={isCurrentPage}
                        className={cn(
                          "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                          isCurrentPage
                            ? "bg-[#FF0098] text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#FF0098]",
                          "disabled:cursor-default"
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>
            )}

            <button
              onClick={() => {
                // Always allow going to grid page (filteredQuestions.length + 1)
                setCurrentPage(currentPage + 1);
              }}
              disabled={false}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Content: Either question form, question type selector, or existing question */}
      {isShowingQuestionForm && selectedQuestionType ? (
        FormComponent ? (
          // Show question form for selected type
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Use Wrapper component which handles its own state and saving */}
            <FormComponent
              onCancel={handleCancelQuestion}
              onSuccess={() => {
                // Refresh/navigate logic
                if (onSuccess) {
                  onSuccess();
                }
                handleCancelQuestion();
              }}
            />
          </div>
        ) : (
          // Show error if component not found
          <div className="bg-white rounded-lg border border-red-200 p-6">
            <div className="text-center">
              <p className="text-red-600 font-medium mb-2">
                Component not found for question type:{" "}
                {selectedQuestionType.name}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Type ID: {selectedQuestionType.id}
              </p>
              <button
                onClick={handleCancelQuestion}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        )
      ) : isShowingGrid ? (
        // Show QuestionTypeGrid when no questions or when currentPage > questions.length
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <QuestionTypeGrid
            area={area}
            onSelectType={handleSelectQuestionType}
            onClose={() => {}}
          />
        </div>
      ) : currentQuestion ? (
        // Show current question - Use the same form component if available, otherwise QuestionCard
        <div className="space-y-4">
          {EditQuestionComponent ? (
            // Use the Wrapper component for existing questions
            <div className="bg-white rounded-lg border border-gray-200">
              <EditQuestionComponent
                key={currentQuestion.id}
                existingQuestion={currentQuestion}
                onCancel={() => {
                  // For edit mode, cancel might mean just closing or doing nothing if we are in pagination mode.
                  // The current UI shows pagination. If we want to "close" edit view, we go to grid.
                  setCurrentQuestionType(null);
                  setCurrentPage(filteredQuestions.length + 1);
                }}
                onSuccess={() => {
                  // After update, maybe we want to stay on the same page or go to grid.
                  // Usually "save" implies done.
                  if (onSuccess) {
                    onSuccess();
                  }
                  setCurrentQuestionType(null);
                  setCurrentPage(filteredQuestions.length + 1);
                }}
              />
              <div className="px-4 pb-4">
                <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
                  <button
                    onClick={() => {
                      onRemoveQuestion(area, currentQuestion.id);
                      // The useEffect will handle navigating to grid page after deletion
                    }}
                    className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete Question
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Fallback to QuestionCard for old questions
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              index={currentQuestionIndex}
              area={area}
              onRemove={() => {
                onRemoveQuestion(area, currentQuestion.id);
                // The useEffect will handle navigating to grid page after deletion
              }}
              onQuestionChange={(field, value) =>
                onQuestionChange(area, currentQuestion.id, field, value)
              }
              onOptionChange={(optionIndex, value) =>
                onOptionChange(area, currentQuestion.id, optionIndex, value)
              }
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
