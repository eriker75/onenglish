"use client";

interface BasicInfoFormProps {
  challengeName: string;
  setChallengeName: (value: string) => void;
  grade: string;
  setGrade: (value: string) => void;
  challengeType: "regular" | "bilingual";
  setChallengeType: (value: "regular" | "bilingual") => void;
}

const venezuelanGrades = [
  "5th grade",
  "6th grade",
  "1st year",
  "2nd year",
  "3rd year",
  "4th year",
  "5th year",
];

export default function BasicInfoForm({
  challengeName,
  setChallengeName,
  grade,
  setGrade,
  challengeType,
  setChallengeType,
}: BasicInfoFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Challenge Name *
        </label>
        <input
          type="text"
          value={challengeName}
          onChange={(e) => setChallengeName(e.target.value)}
          placeholder="e.g., Challenge 5th Grade - Regular"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2bf3c] focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade *
          </label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2bf3c] focus:border-transparent"
          >
            <option value="">Select a grade</option>
            {venezuelanGrades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type *
          </label>
          <select
            value={challengeType}
            onChange={(e) =>
              setChallengeType(e.target.value as "regular" | "bilingual")
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2bf3c] focus:border-transparent"
          >
            <option value="regular">Regular</option>
            <option value="bilingual">Bilingual</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> You&apos;ll add questions for each Olympic area
          in the next steps. Click &quot;Next&quot; to continue.
        </p>
      </div>
    </div>
  );
}
