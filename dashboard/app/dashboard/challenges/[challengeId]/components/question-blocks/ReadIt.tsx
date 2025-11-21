"use client";

import React, { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";

interface Statement {
  id: string;
  text: string;
  correct: boolean;
}

interface ReadItProps {
  question?: string;
  paragraph?: string;
  statements?: Statement[];
  onQuestionChange?: (question: string) => void;
  onParagraphChange?: (paragraph: string) => void;
  onStatementsChange?: (statements: Statement[]) => void;
}

export default function ReadIt({
  question = "",
  paragraph = "",
  statements = [],
  onQuestionChange,
  onParagraphChange,
  onStatementsChange,
}: ReadItProps) {
  const [questionText, setQuestionText] = useState(question);
  const [paragraphText, setParagraphText] = useState(paragraph);
  const [statementsList, setStatementsList] = useState<Statement[]>(
    statements.length > 0
      ? statements
      : [{ id: `stmt-${Date.now()}`, text: "", correct: true }]
  );

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleParagraphChange = (value: string) => {
    setParagraphText(value);
    onParagraphChange?.(value);
  };

  const handleStatementChange = (id: string, field: "text" | "correct", value: string | boolean) => {
    const newStatements = statementsList.map((stmt) =>
      stmt.id === id ? { ...stmt, [field]: value } : stmt
    );
    setStatementsList(newStatements);
    onStatementsChange?.(newStatements);
  };

  const handleAddStatement = () => {
    const newStatement: Statement = {
      id: `stmt-${Date.now()}-${Math.random()}`,
      text: "",
      correct: true,
    };
    const newStatements = [...statementsList, newStatement];
    setStatementsList(newStatements);
    onStatementsChange?.(newStatements);
  };

  const handleRemoveStatement = (id: string) => {
    if (statementsList.length > 1) {
      const newStatements = statementsList.filter((stmt) => stmt.id !== id);
      setStatementsList(newStatements);
      onStatementsChange?.(newStatements);
    }
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
          Paragraph *
        </label>
        <textarea
          value={paragraphText}
          onChange={(e) => handleParagraphChange(e.target.value)}
          placeholder="Enter the paragraph that students need to read..."
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          The paragraph students will read and then answer true/false questions about
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            True/False Statements *
          </label>
          <button
            onClick={handleAddStatement}
            className="flex items-center gap-1 px-3 py-1 text-sm text-[#44b07f] hover:bg-[#44b07f]/10 rounded-lg transition-colors"
          >
            <AddCircleIcon fontSize="small" />
            Add Statement
          </button>
        </div>
        <div className="space-y-3">
          {statementsList.map((statement, index) => (
            <div
              key={statement.id}
              className="p-4 border-2 border-gray-200 rounded-lg bg-white"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
                    <textarea
                      value={statement.text}
                      onChange={(e) =>
                        handleStatementChange(statement.id, "text", e.target.value)
                      }
                      placeholder="Enter statement..."
                      rows={2}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        handleStatementChange(statement.id, "correct", true)
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                        statement.correct
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <CheckCircleIcon fontSize="small" />
                      True
                    </button>
                    <button
                      onClick={() =>
                        handleStatementChange(statement.id, "correct", false)
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                        !statement.correct
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <CancelIcon fontSize="small" />
                      False
                    </button>
                  </div>
                </div>
                {statementsList.length > 1 && (
                  <button
                    onClick={() => handleRemoveStatement(statement.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove statement"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
