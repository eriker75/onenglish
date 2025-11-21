"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import DashboardContent from "../../../components/DashboardContent";

const AnswersPage = () => {
  const pathname = usePathname();
  const [selectedFilter, setSelectedFilter] = useState("pending");

  const answers = [
    {
      id: 1,
      student: "Maria Lopez",
      question: 'What is the past tense of "go"?',
      answer: "Went",
      submitted: "2 hours ago",
      status: "pending",
      grade: null,
      feedback: null,
    },
    {
      id: 2,
      student: "Carlos Rodriguez",
      question: 'Translate: "El gato está en la mesa"',
      answer: "The cat is on the table",
      submitted: "3 hours ago",
      status: "reviewed",
      grade: 95,
      feedback: "Excellent translation! Well done.",
    },
    {
      id: 3,
      student: "Ana Martinez",
      question: "Complete: I ___ to the store yesterday",
      answer: "went",
      submitted: "5 hours ago",
      status: "pending",
      grade: null,
      feedback: null,
    },
    {
      id: 4,
      student: "Jose Garcia",
      question: "What is the correct article? ___ apple",
      answer: "An",
      submitted: "6 hours ago",
      status: "reviewed",
      grade: 100,
      feedback: "Perfect!",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <DashboardContent>
        {/* Top Bar */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-900">
              Review Answers
            </h1>
            <p className="text-gray-600 mt-1">
              Review and grade student submissions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#FF0098] text-white px-4 py-2 rounded-lg font-medium">
              {answers.filter((a) => a.status === "pending").length} Pending
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedFilter === "all"
                ? "bg-[#FF0098] text-white"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
          >
            All Answers
          </button>
          <button
            onClick={() => setSelectedFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedFilter === "pending"
                ? "bg-[#f2bf3c] text-white"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setSelectedFilter("reviewed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedFilter === "reviewed"
                ? "bg-[#33CC00] text-white"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
          >
            Reviewed
          </button>
        </div>

        {/* Answers List */}
        <div className="space-y-4">
          {answers
            .filter(
              (a) => selectedFilter === "all" || a.status === selectedFilter
            )
            .map((answer) => (
              <div
                key={answer.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#FF0098] to-[#33CC00] flex items-center justify-center text-white font-semibold">
                      {answer.student
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-gray-900">
                        {answer.student}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {answer.submitted}
                      </p>
                    </div>
                  </div>
                  {answer.status === "reviewed" && (
                    <div className="bg-[#33CC00]/10 text-[#33CC00] px-3 py-1 rounded-lg font-medium">
                      {answer.grade}%
                    </div>
                  )}
                  {answer.status === "pending" && (
                    <div className="bg-[#f2bf3c]/10 text-[#f2bf3c] px-3 py-1 rounded-lg font-medium">
                      Pending
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Question:</p>
                  <p className="font-medium text-gray-900">{answer.question}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Answer:</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-900">{answer.answer}</p>
                  </div>
                </div>

                {answer.feedback && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Feedback:</p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-900">{answer.feedback}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {answer.status === "pending" && (
                    <>
                      <button className="flex-1 bg-[#FF0098] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#FF0098]/90 transition-colors">
                        ✓ Approve
                      </button>
                      <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                        Add Feedback
                      </button>
                      <button className="px-4 py-2 text-gray-500 hover:text-red-600">
                        ✗ Reject
                      </button>
                    </>
                  )}
                  {answer.status === "reviewed" && (
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      Edit Feedback
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Empty State */}
        {answers.filter(
          (a) => selectedFilter === "all" || a.status === selectedFilter
        ).length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="font-heading text-xl font-semibold mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-600">No answers to review at this time.</p>
          </div>
        )}
      </DashboardContent>
    </div>
  );
};

export default AnswersPage;
