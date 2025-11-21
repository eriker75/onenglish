"use client";

import { questionTypesByArea, QuestionType } from "./questionTypes";

interface QuestionTypeGridProps {
  area: string;
  onSelectType: (questionType: QuestionType) => void;
  onClose: () => void;
}

export default function QuestionTypeGrid({
  area,
  onSelectType,
  onClose,
}: QuestionTypeGridProps) {
  const questionTypes = questionTypesByArea[area] || [];

  return (
    <div className="w-full">
      {/* Grid 3 columns x 2 rows */}
      <div className="grid grid-cols-3 gap-4">
        {questionTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => onSelectType(type)}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#33CC00] hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-[#33CC00]/10 transition-colors">
                  <Icon className="text-gray-600 group-hover:text-[#33CC00]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {type.name}
                  </h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
