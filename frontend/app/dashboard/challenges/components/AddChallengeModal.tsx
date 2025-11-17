"use client";

import { useState } from "react";
import { useGenericModal } from "@/src/contexts/GenericModalContext";
import { cn } from "@/lib/utils";

interface ChallengeFormData {
  grade: string;
  type: 'regular' | 'bilingual';
  isDemo: boolean;
  exactDate: string;
  stage: string;
}

interface AddChallengeModalProps {
  onSubmit: (data: ChallengeFormData) => void;
}

const AddChallengeModal = ({ onSubmit }: AddChallengeModalProps) => {
  const { closeModal } = useGenericModal();
  const [formData, setFormData] = useState<ChallengeFormData>({
    grade: "",
    type: "regular",
    isDemo: false,
    exactDate: "",
    stage: ""
  });

  const grades = ["5th grade", "6th grade", "1st year", "2nd year", "3rd year", "4th year", "5th year"];
  const stages = ["Regional", "State", "National"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.grade || !formData.exactDate || !formData.stage) {
      return;
    }
    onSubmit(formData);
    closeModal();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTypeChange = (type: 'regular' | 'bilingual') => {
    setFormData((prev) => ({
      ...prev,
      type,
    }));
  };

  const handleDemoChange = (isDemo: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isDemo,
    }));
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Grade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade *
          </label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent text-gray-700"
            required
          >
            <option value="">Select grade</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>

        {/* Stage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stage *
          </label>
          <select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent text-gray-700"
            required
          >
            <option value="">Select stage</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Type *
          </label>
          <div className="rounded-lg border border-gray-300 overflow-hidden flex">
            <button
              type="button"
              onClick={() => handleTypeChange("regular")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                formData.type === "regular"
                  ? "bg-[#FF0098]/10 text-[#FF0098]"
                  : "bg-white text-gray-700 hover:bg-[#FF0098]/5"
              )}
            >
              Regular
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("bilingual")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                formData.type === "bilingual"
                  ? "bg-[#33CC00]/10 text-[#33CC00]"
                  : "bg-white text-gray-700 hover:bg-[#33CC00]/5"
              )}
            >
              Bilingual
            </button>
          </div>
        </div>

        {/* Demo/Live */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Challenge Type *
          </label>
          <div className="rounded-lg border border-gray-300 overflow-hidden flex">
            <button
              type="button"
              onClick={() => handleDemoChange(false)}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                !formData.isDemo
                  ? "bg-gray-400/10 text-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              Live
            </button>
            <button
              type="button"
              onClick={() => handleDemoChange(true)}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                formData.isDemo
                  ? "bg-[#f2bf3c]/10 text-[#f2bf3c]"
                  : "bg-white text-gray-700 hover:bg-[#f2bf3c]/5"
              )}
            >
              Demo
            </button>
          </div>
        </div>

        {/* Exact Date */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exact Date *
          </label>
          <input
            type="date"
            name="exactDate"
            value={formData.exactDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent text-gray-700"
            required
          />
          {formData.exactDate && (
            <p className="mt-2 text-xs text-gray-500">
              Year will be automatically set to: {new Date(formData.exactDate).getFullYear()}
            </p>
          )}
        </div>
      </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={closeModal}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#33CC00] hover:bg-[#33CC00]/90 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Create Challenge
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddChallengeModal;

