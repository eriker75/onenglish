"use client";

import { useState, useEffect } from "react";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import AudioUpload from "@/components/elements/AudioUpload";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  points?: number;
}

interface TopicBasedAudioProps {
  question?: string;
  instructions?: string;
  audioUrl?: string;
  questions?: Question[];
  points?: number;
  timeMinutes?: number;
  timeSeconds?: number;
  maxAttempts?: number;
  onQuestionChange?: (question: string) => void;
  onInstructionsChange?: (instructions: string) => void;
  onAudioChange?: (audioUrl: string | null) => void;
  onAudioFileChange?: (file: File | null) => void;
  onQuestionsChange?: (questions: Question[]) => void;
  onPointsChange?: (points: number) => void;
  onTimeMinutesChange?: (minutes: number) => void;
  onTimeSecondsChange?: (seconds: number) => void;
  onMaxAttemptsChange?: (attempts: number) => void;
}

export default function TopicBasedAudio({
  question = "",
  instructions = "",
  audioUrl: initialAudioUrl,
  questions = [],
  points: initialPoints = 0,
  timeMinutes: initialTimeMinutes = 0,
  timeSeconds: initialTimeSeconds = 0,
  maxAttempts: initialMaxAttempts = 1,
  onQuestionChange,
  onInstructionsChange,
  onAudioChange,
  onAudioFileChange,
  onQuestionsChange,
  onPointsChange,
  onTimeMinutesChange,
  onTimeSecondsChange,
  onMaxAttemptsChange,
}: TopicBasedAudioProps) {
  const [questionText, setQuestionText] = useState(question);
  const [instructionsText, setInstructionsText] = useState(instructions);
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
            points: 0,
          },
        ]
  );
  const [pointsValue, setPointsValue] = useState(initialPoints);
  const [timeMinutesValue, setTimeMinutesValue] = useState(initialTimeMinutes);
  const [timeSecondsValue, setTimeSecondsValue] = useState(initialTimeSeconds);
  const [maxAttemptsValue, setMaxAttemptsValue] = useState(initialMaxAttempts);

  // Sync state with props when they change
  useEffect(() => {
    setQuestionText(question);
  }, [question]);

  useEffect(() => {
    setInstructionsText(instructions);
  }, [instructions]);

  useEffect(() => {
    setAudioUrl(initialAudioUrl || null);
  }, [initialAudioUrl]);

  useEffect(() => {
    if (questions && questions.length > 0) {
      setQuestionsList(questions);
    }
  }, [questions]);

  useEffect(() => {
    setPointsValue(initialPoints);
  }, [initialPoints]);

  useEffect(() => {
    setTimeMinutesValue(initialTimeMinutes);
  }, [initialTimeMinutes]);

  useEffect(() => {
    setTimeSecondsValue(initialTimeSeconds);
  }, [initialTimeSeconds]);

  useEffect(() => {
    setMaxAttemptsValue(initialMaxAttempts);
  }, [initialMaxAttempts]);

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleInstructionsChange = (value: string) => {
    setInstructionsText(value);
    onInstructionsChange?.(value);
  };

  const handleQuestionTextChange = (id: string, text: string) => {
    const newQuestions = questionsList.map((q) =>
      q.id === id ? { ...q, text } : q
    );
    setQuestionsList(newQuestions);
    onQuestionsChange?.(newQuestions);
  };

  const handleQuestionPointsChange = (id: string, points: number) => {
    const newQuestions = questionsList.map((q) =>
      q.id === id ? { ...q, points } : q
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
      points: 0,
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

  const handlePointsChange = (value: number) => {
    const points = Math.max(0, value);
    setPointsValue(points);
    onPointsChange?.(points);
  };

  const handleTimeMinutesChange = (value: number) => {
    const minutes = Math.max(0, Math.floor(value));
    setTimeMinutesValue(minutes);
    onTimeMinutesChange?.(minutes);
  };

  const handleTimeSecondsChange = (value: number) => {
    const seconds = Math.max(0, Math.min(59, Math.floor(value)));
    setTimeSecondsValue(seconds);
    onTimeSecondsChange?.(seconds);
  };

  const handleMaxAttemptsChange = (value: number) => {
    const attempts = Math.max(1, Math.floor(value));
    setMaxAttemptsValue(attempts);
    onMaxAttemptsChange?.(attempts);
  };

  return (
    <div className="w-full space-y-6">
      {/* First Row: Question Text and Instructions */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Text *
          </label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => handleQuestionChange(e.target.value)}
            placeholder="Enter the question text..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
        </div>
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Instructions
          </label>
          <input
            type="text"
            value={instructionsText}
            onChange={(e) => handleInstructionsChange(e.target.value)}
            placeholder="Enter instructions..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
        </div>
      </div>

      {/* Second Row: Audio File */}
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
          onFileChange={(file) => {
            onAudioFileChange?.(file);
          }}
        />
      </div>

      {/* Third Row: Multiple Choice Questions */}
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
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-9">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Question Text</label>
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
                      placeholder="Enter question text..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Points</label>
                    <input
                      type="number"
                      min="0"
                      value={q.points}
                      onChange={(e) => handleQuestionPointsChange(q.id, parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Options</label>
                  <div className="space-y-2">
                    {q.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(q.id, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Correct Answer</label>
                  <select
                    value={q.correctAnswer}
                    onChange={(e) => handleCorrectAnswerChange(q.id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
                  >
                    <option value="">Select correct answer</option>
                    {q.options.filter(opt => opt).map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fourth Row: Time and Max Attempts */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time (Minutes) *
          </label>
          <input
            type="number"
            min="0"
            max="60"
            value={timeMinutesValue}
            onChange={(e) =>
              handleTimeMinutesChange(parseInt(e.target.value) || 0)
            }
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Minutes to answer</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time (Seconds) *
          </label>
          <input
            type="number"
            min="0"
            max="59"
            value={timeSecondsValue}
            onChange={(e) =>
              handleTimeSecondsChange(parseInt(e.target.value) || 0)
            }
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Additional seconds (0-59)
          </p>
        </div>
        {/* Points removed from here as it's per question now, but we might want to show total? 
            The DTO suggests we can omit points if subquestions have them. 
            However, the frontend usually has a "Points" field for the total score of the question block if it's treated as one unit.
            But TopicBasedAudio has sub-questions with individual points.
            I'll remove the global points input to avoid confusion, or make it read-only sum.
            For now, I'll remove it from the UI as requested implied structure "similar to read it" 
            (ReadIt usually sums up points or has per-question points).
            Actually, I'll remove the Points input from the bottom row.
        */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Attempts *
          </label>
          <input
            type="number"
            min="1"
            value={maxAttemptsValue}
            onChange={(e) =>
              handleMaxAttemptsChange(parseInt(e.target.value) || 1)
            }
            placeholder="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum number of attempts allowed
          </p>
        </div>
      </div>
    </div>
  );
}
