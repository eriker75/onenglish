"use client";

import React, { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";

interface WordAssociationsWithTextProps {
  question?: string;
  referenceWord?: string;
  associations?: string[];
  onQuestionChange?: (question: string) => void;
  onReferenceWordChange?: (word: string) => void;
  onAssociationsChange?: (associations: string[]) => void;
}

export default function WordAssociationsWithText({
  question = "",
  referenceWord = "",
  associations = [],
  onQuestionChange,
  onReferenceWordChange,
  onAssociationsChange,
}: WordAssociationsWithTextProps) {
  const [questionText, setQuestionText] = useState(question);
  const [referenceWordText, setReferenceWordText] = useState(referenceWord);
  const [associationsList, setAssociationsList] = useState<string[]>(
    associations.length > 0 ? associations : [""]
  );

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleReferenceWordChange = (value: string) => {
    setReferenceWordText(value);
    onReferenceWordChange?.(value);
  };

  const handleAssociationChange = (index: number, value: string) => {
    const newAssociations = [...associationsList];
    newAssociations[index] = value;
    setAssociationsList(newAssociations);
    onAssociationsChange?.(newAssociations);
  };

  const handleAddAssociation = () => {
    const newAssociations = [...associationsList, ""];
    setAssociationsList(newAssociations);
    onAssociationsChange?.(newAssociations);
  };

  const handleRemoveAssociation = (index: number) => {
    if (associationsList.length > 1) {
      const newAssociations = associationsList.filter((_, i) => i !== index);
      setAssociationsList(newAssociations);
      onAssociationsChange?.(newAssociations);
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
          Reference Word *
        </label>
        <input
          type="text"
          value={referenceWordText}
          onChange={(e) => handleReferenceWordChange(e.target.value)}
          placeholder="Enter the reference word"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          The word that students will associate with the questions below
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Word Associations (up to 20) *
          </label>
          <button
            onClick={handleAddAssociation}
            disabled={associationsList.length >= 20}
            className="flex items-center gap-1 px-3 py-1 text-sm text-[#44b07f] hover:bg-[#44b07f]/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AddCircleIcon fontSize="small" />
            Add Association
          </button>
        </div>
        <div className="space-y-2">
          {associationsList.map((association, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
              <input
                type="text"
                value={association}
                onChange={(e) => handleAssociationChange(index, e.target.value)}
                placeholder={`Association ${index + 1}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
              />
              {associationsList.length > 1 && (
                <button
                  onClick={() => handleRemoveAssociation(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove association"
                >
                  <DeleteIcon fontSize="small" />
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {associationsList.length} / 20 associations added
        </p>
      </div>
    </div>
  );
}
