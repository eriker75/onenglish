"use client";

import React, { useState, useEffect } from "react";
import { useChallengeFormUIStore } from "@/src/stores/challenge-form-ui.store";
import QuestionCard from "./QuestionCard";
import QuestionTypeGrid from "./QuestionTypeGrid";
import { QuestionType, questionTypesByArea } from "./questionTypes";
import {
  ImageToMultipleChoiceText,
  WordBox,
  Spelling,
  WordAssociationsWithText,
  Unscramble,
  Tenses,
  TagIt,
  ReportIt,
  ReadIt,
  WordMatch,
  GossipEN,
  TopicBasedAudio,
  LyricsTraining,
  SentenceMaker,
  FastTest,
  Tales,
  SuperBrain,
  TellMeAboutIt,
  Debate,
} from "./question-blocks";

export interface Question {
  id: string;
  question: string;
  type: string;
  questionTypeName?: string;
  options?: string[];
  correctAnswer?: string;
  stage?: string; // Stage name
}

type QuestionFieldValue = string | string[] | undefined;

interface QuestionsSectionProps {
  area: string;
  questions: Question[];
  onAddQuestion: (area: string, questionType?: QuestionType) => void;
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
}

// Component map for question types
const componentMap: { [key: string]: React.ComponentType<any> } = {
  image_to_multiple_choice_text: ImageToMultipleChoiceText,
  wordbox: WordBox,
  spelling: Spelling,
  word_associations_with_text: WordAssociationsWithText,
  unscramble: Unscramble,
  tenses: Tenses,
  tag_it: TagIt,
  report_it: ReportIt,
  read_it: ReadIt,
  word_match: WordMatch,
  gossip: GossipEN,
  topic_based_audio: TopicBasedAudio,
  lyrics_training: LyricsTraining,
  sentence_maker: SentenceMaker,
  fast_test: FastTest,
  tales: Tales,
  superbrain: SuperBrain,
  tell_me_about_it: TellMeAboutIt,
  debate: Debate,
};

export default function QuestionsSection({
  area,
  questions,
  onAddQuestion,
  onRemoveQuestion,
  onQuestionChange,
  onOptionChange,
}: QuestionsSectionProps) {
  const { currentStage, currentQuestionType, setCurrentQuestionType } = useChallengeFormUIStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType | null>(null);
  const [newQuestionData, setNewQuestionData] = useState<any>({});
  const [pendingQuestionData, setPendingQuestionData] = useState<{data: any, previousLength: number} | null>(null);

  // Filter questions by selected type from store
  const filteredQuestions = React.useMemo(() => {
    if (!currentQuestionType) {
      return questions; // Show all questions if no type filter selected
    }
    return questions.filter((q) => q.type === currentQuestionType);
  }, [questions, currentQuestionType]);
  
  const previousQuestionsLengthRef = React.useRef(filteredQuestions.length);

  const totalPages = filteredQuestions.length || 1;

  // Reset to page 1 when question type filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentQuestionType]);

  // When a new question is added and we have pending data, update it
  useEffect(() => {
    if (pendingQuestionData && filteredQuestions.length > pendingQuestionData.previousLength) {
      // A new question was added, find it and update it with pending data
      const newQuestion = filteredQuestions[filteredQuestions.length - 1];
      
      if (newQuestion) {
        Object.keys(pendingQuestionData.data).forEach((key) => {
          const value = pendingQuestionData.data[key];
          if (value !== undefined && value !== null && value !== "") {
            onQuestionChange(area, newQuestion.id, key, value);
          }
        });
      }
      
      // Clear pending data
      setPendingQuestionData(null);
      
      // Reset selected type and data
      setSelectedQuestionType(null);
      setNewQuestionData({});
      
      // Go to the grid page (one page beyond questions)
      setCurrentPage(filteredQuestions.length + 1);
    }
  }, [filteredQuestions.length, pendingQuestionData, area, onQuestionChange, filteredQuestions]);

  // Adjust current page when questions change (e.g., after deletion)
  useEffect(() => {
    // Skip if showing a form or if we just added a question (pendingQuestionData handles that)
    if (selectedQuestionType || pendingQuestionData) {
      previousQuestionsLengthRef.current = filteredQuestions.length;
      return;
    }
    
    // Detect if we deleted a question (length decreased)
    const questionsLengthDecreased = filteredQuestions.length < previousQuestionsLengthRef.current;
    
    if (questionsLengthDecreased) {
      // After deletion, navigate to grid page
      if (filteredQuestions.length === 0) {
        // No questions left, go to grid page (page 1)
        setCurrentPage(1);
      } else {
        // Go to grid page (one page beyond all questions)
        setCurrentPage(filteredQuestions.length + 1);
      }
    }
    
    // Update ref for next comparison
    previousQuestionsLengthRef.current = filteredQuestions.length;
  }, [filteredQuestions.length, selectedQuestionType, pendingQuestionData]);

  const handleSelectQuestionType = (questionType: QuestionType) => {
    // Show the form for the selected question type
    setSelectedQuestionType(questionType);
    
    // Set default question text based on question type
    let initialData: any = {};
    if (questionType.id === "image_to_multiple_choice_text") {
      initialData.question = "Select the correct word for the image";
    }
    
    setNewQuestionData(initialData);
  };

  const handleSaveQuestion = () => {
    // Add the question with the selected type and captured data
    if (selectedQuestionType) {
      // Store the data and previous length before adding
      const dataToSave = { ...newQuestionData };
      const currentQuestionsLength = filteredQuestions.length;

      // Set pending data to be applied when question is added
      setPendingQuestionData({
        data: dataToSave,
        previousLength: currentQuestionsLength
      });

      // Add question via the parent handler (this creates the question in state)
      onAddQuestion(area, selectedQuestionType);

      // The useEffect will handle updating the question data and navigating to grid
    }
  };

  const handleCancelQuestion = () => {
    // Cancel adding question, go back to grid
    setSelectedQuestionType(null);
    setNewQuestionData({});
    setPendingQuestionData(null);
    // Go to grid page (one page beyond questions)
    setCurrentPage(filteredQuestions.length + 1);
  };

  // Determine what to show on current page
  const isShowingQuestionForm = selectedQuestionType !== null;
  const isShowingGrid = !isShowingQuestionForm && (filteredQuestions.length === 0 || currentPage > filteredQuestions.length);
  const currentQuestionIndex = currentPage - 1;
  const currentQuestion = currentPage <= filteredQuestions.length ? filteredQuestions[currentQuestionIndex] : null;

  // Get the form component for the selected question type
  const FormComponent = selectedQuestionType ? componentMap[selectedQuestionType.id] : null;

  // When currentQuestionType changes and we're on the grid, auto-select that type to create
  useEffect(() => {
    if (currentQuestionType && isShowingGrid && !selectedQuestionType) {
      // Find the question type from questionTypesByArea
      const allTypes = Object.values(questionTypesByArea).flat();
      const typeToSelect = allTypes.find((t) => t.id === currentQuestionType);
      
      if (typeToSelect) {
        setSelectedQuestionType(typeToSelect);
        // Set default question text based on question type
        let initialData: any = {};
        if (typeToSelect.id === "image_to_multiple_choice_text") {
          initialData.question = "Select the correct word for the image";
        }
        setNewQuestionData(initialData);
      }
    }
  }, [currentQuestionType, isShowingGrid, selectedQuestionType]);

  // Calculate pagination info - only show pages for existing questions
  // The grid appears when currentPage > filteredQuestions.length, but it's not a numbered page
  const displayPages = Math.max(1, filteredQuestions.length);

  return (
    <div className="space-y-6">
      {/* Header with Title and Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{area} Questions</h2>
            
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
          <p className="text-gray-600 mt-1">
            {isShowingQuestionForm
              ? `Creating new ${selectedQuestionType?.name || "question"}`
              : isShowingGrid
              ? filteredQuestions.length === 0
                ? `Start building your question set by selecting a type`
                : `Select a question type to add another question`
              : `Manage and edit your ${filteredQuestions.length} ${filteredQuestions.length === 1 ? "question" : "questions"}`}
          </p>
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
                {Array.from({ length: displayPages }, (_, i) => i + 1).map((pageNum) => {
                  const isCurrentPage = pageNum === currentPage;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={isCurrentPage}
                      className={`
                        w-8 h-8 rounded-lg text-sm font-medium transition-colors
                        ${isCurrentPage
                          ? "bg-[#FF0098] text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#FF0098]"
                        }
                        disabled:cursor-default
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                })}
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
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-6">
              <FormComponent
                {...newQuestionData}
                onQuestionChange={(value: string) => setNewQuestionData({ ...newQuestionData, question: value })}
                onOptionsChange={(options: string[]) => setNewQuestionData({ ...newQuestionData, options })}
                onCorrectAnswerChange={(answer: string) => setNewQuestionData({ ...newQuestionData, correctAnswer: answer })}
                onImageChange={(imageUrl: string | null) => setNewQuestionData({ ...newQuestionData, imageUrl })}
                onAudioChange={(audioUrl: string | null) => setNewQuestionData({ ...newQuestionData, audioUrl })}
                onPointsChange={(points: number) => setNewQuestionData({ ...newQuestionData, points })}
                onTimeMinutesChange={(minutes: number) => setNewQuestionData({ ...newQuestionData, timeMinutes: minutes })}
                onTimeSecondsChange={(seconds: number) => setNewQuestionData({ ...newQuestionData, timeSeconds: seconds })}
                onMaxAttemptsChange={(attempts: number) => setNewQuestionData({ ...newQuestionData, maxAttempts: attempts })}
              />
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={handleCancelQuestion}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveQuestion}
                  className="px-6 py-2 bg-[#33CC00] text-white rounded-lg hover:bg-[#33CC00]/90 transition-colors font-medium"
                >
                  Save Question
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Show error if component not found
          <div className="bg-white rounded-lg border border-red-200 p-6">
            <div className="text-center">
              <p className="text-red-600 font-medium mb-2">
                Component not found for question type: {selectedQuestionType.name}
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
          {currentQuestion.type && componentMap[currentQuestion.type] ? (
            // Use the question block component for existing questions
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {React.createElement(componentMap[currentQuestion.type], {
                ...currentQuestion,
                onQuestionChange: (value: string) => onQuestionChange(area, currentQuestion.id, "question", value),
                onOptionsChange: (options: string[]) => onQuestionChange(area, currentQuestion.id, "options", options),
                onCorrectAnswerChange: (answer: string) => onQuestionChange(area, currentQuestion.id, "correctAnswer", answer),
                onImageChange: (imageUrl: string | null) => onQuestionChange(area, currentQuestion.id, "imageUrl", imageUrl || ""),
                onAudioChange: (audioUrl: string | null) => onQuestionChange(area, currentQuestion.id, "audioUrl", audioUrl || ""),
                onPointsChange: (points: number) => onQuestionChange(area, currentQuestion.id, "points", points.toString()),
                onTimeMinutesChange: (minutes: number) => onQuestionChange(area, currentQuestion.id, "timeMinutes", minutes.toString()),
                onTimeSecondsChange: (seconds: number) => onQuestionChange(area, currentQuestion.id, "timeSeconds", seconds.toString()),
                onMaxAttemptsChange: (attempts: number) => onQuestionChange(area, currentQuestion.id, "maxAttempts", attempts.toString()),
              })}
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
