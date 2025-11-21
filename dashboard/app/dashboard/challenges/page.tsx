"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import DashboardContent from "@/components/DashboardContent";
import Pagination from "@/components/Pagination";
import AddButton from "@/components/AddButton";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CopyIcon from "@mui/icons-material/ContentCopy";
import TrophyIcon from "@mui/icons-material/EmojiEvents";
import { getDemoChallenges } from "@/src/data/demo-data";
import { cn } from "@/lib/utils";
import { useGenericModal } from "@/src/contexts/GenericModalContext";
import AddChallengeModal from "./components/AddChallengeModal";
import { formatGrade } from "@/src/utils/formatters";

const ChallengesPage = () => {
  const router = useRouter();
  const { openModal } = useGenericModal();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [filterDemo, setFilterDemo] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [filterExactDate, setFilterExactDate] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterQuestions, setFilterQuestions] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const grades = ["5th_grade", "6th_grade", "1st_year", "2nd_year", "3rd_year", "4th_year", "5th_year"];
  const stages = ["Regional", "State", "National"];

  const handleOpenAddChallengeModal = () => {
    openModal({
      title: "Create New Challenge",
      size: "2xl",
      content: (
        <AddChallengeModal
          onSuccess={(challengeId) => {
            // Navigate to the challenge detail page after creation
            router.push(`/dashboard/challenges/${challengeId}`);
          }}
        />
      ),
    });
  };

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setIsLoading(true);
        const data = await getDemoChallenges();
        setChallenges(data);
      } catch (error) {
        console.error("Error loading challenges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenges();
  }, []);

  // Get unique years and questions for filters
  const availableYears = Array.from(new Set(challenges.map(c => c.year).filter(Boolean))).sort((a, b) => b - a);
  const questionRanges = [
    { label: "0-30", min: 0, max: 30 },
    { label: "31-45", min: 31, max: 45 },
    { label: "46-60", min: 46, max: 60 },
    { label: "61+", min: 61, max: Infinity }
  ];

  // Filter challenges
  const filteredChallenges = challenges.filter((challenge) => {
    const matchesName = challenge.name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesDemo = filterDemo === "all" || 
      (filterDemo === "demo" && challenge.isDemo === true) ||
      (filterDemo === "live" && (challenge.isDemo === false || challenge.isDemo === undefined));
    const matchesYear = filterYear === "all" || challenge.year?.toString() === filterYear;
    const matchesExactDate = !filterExactDate || challenge.exactDate === filterExactDate;
    const matchesStage = filterStage === "all" || challenge.stage === filterStage;
    const matchesGrade = filterGrade === "all" || challenge.grade === filterGrade;
    const matchesType = filterType === "all" || challenge.type === filterType;
    
    let matchesQuestions = true;
    if (filterQuestions !== "all") {
      const range = questionRanges.find(r => r.label === filterQuestions);
      if (range) {
        matchesQuestions = challenge.totalQuestions >= range.min && challenge.totalQuestions <= range.max;
      }
    }
    
    return matchesName && matchesDemo && matchesYear && matchesExactDate && matchesStage && matchesGrade && matchesType && matchesQuestions;
  });

  // Pagination
  const totalPages = Math.ceil(filteredChallenges.length / itemsPerPage);
  const paginatedChallenges = filteredChallenges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <DashboardContent>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900 mb-1">
              Challenges Management
            </h1>
            <p className="text-sm text-gray-600">Create and manage challenges for the Bilingual Olympics</p>
          </div>
          <AddButton
            label="New Challenge"
            icon={TrophyIcon}
            onClick={handleOpenAddChallengeModal}
            bgColor="#33CC00"
          />
        </div>

        {/* Search and Filters */}
        <div className="mb-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <div className="h-full rounded-lg border border-gray-300 overflow-hidden flex">
                <button
                  onClick={() => setFilterDemo("all")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                    filterDemo === "all"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterDemo("demo")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                    filterDemo === "demo"
                      ? "bg-[#f2bf3c]/10 text-[#f2bf3c]"
                      : "bg-white text-gray-700 hover:bg-[#f2bf3c]/5"
                  )}
                >
                  Demo
                </button>
                <button
                  onClick={() => setFilterDemo("live")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                    filterDemo === "live"
                      ? "bg-gray-400/10 text-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  Live
                </button>
              </div>
            </div>
            <div className="relative">
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent text-gray-700"
              >
                <option value="all">All Years</option>
                {availableYears.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent text-gray-700"
              >
                <option value="all">All Stages</option>
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent text-gray-700"
              >
                <option value="all">All Grades</option>
                  {grades.map((grade) => (
                  <option key={grade} value={grade}>
                      {formatGrade(grade)}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <div className="h-full rounded-lg border border-gray-300 overflow-hidden flex">
                <button
                  onClick={() => setFilterType("all")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                    filterType === "all"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("bilingual")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                    filterType === "bilingual"
                      ? "bg-[#33CC00]/10 text-[#33CC00]"
                      : "bg-white text-gray-700 hover:bg-[#33CC00]/5"
                  )}
                >
                  Bilingual
                </button>
                <button
                  onClick={() => setFilterType("regular")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                    filterType === "regular"
                      ? "bg-[#FF0098]/10 text-[#FF0098]"
                      : "bg-white text-gray-700 hover:bg-[#FF0098]/5"
                  )}
                >
                  Regular
                </button>
              </div>
            </div>
            <div className="relative">
              <select
                value={filterQuestions}
                onChange={(e) => setFilterQuestions(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent text-gray-700"
              >
                <option value="all">All Questions</option>
                {questionRanges.map((range) => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <input
                type="date"
                value={filterExactDate}
                onChange={(e) => setFilterExactDate(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent text-gray-700"
                placeholder="Select date"
              />
            </div>
          </div>
        </div>

        {/* Challenges Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Demo
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Year
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Exact Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Stage
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Grade
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Questions
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Total Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                    <td colSpan={10} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF0098] mb-4"></div>
                        <p className="text-gray-600">Loading challenges...</p>
                    </div>
                  </td>
                </tr>
                ) : paginatedChallenges.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <TrophyIcon className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Challenges Found
                    </h3>
                        <p className="text-gray-600">
                          {searchName || filterDemo !== "all" || filterYear !== "all" || filterExactDate !== "" || filterStage !== "all" || filterGrade !== "all" || filterType !== "all" || filterQuestions !== "all"
                            ? "Try adjusting your search filters"
                            : "Start by creating your first challenge"}
                        </p>
                      </div>
                  </td>
                </tr>
              ) : (
                  paginatedChallenges.map((challenge) => (
                    <tr key={challenge.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 text-sm">
                          {challenge.name}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                            challenge.isDemo
                              ? "bg-[#f2bf3c]/10 text-[#f2bf3c]"
                              : "bg-gray-100 text-gray-700"
                          )}
                        >
                          {challenge.isDemo ? "Demo" : "Live"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {challenge.year || new Date().getFullYear()}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {formatDate(challenge.exactDate)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {challenge.stage || "N/A"}
                    </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {formatGrade(challenge.grade)}
                    </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                            challenge.type === "bilingual"
                              ? "bg-[#33CC00]/10 text-[#33CC00]"
                              : "bg-[#FF0098]/10 text-[#FF0098]"
                          )}
                        >
                          {challenge.type === "bilingual" ? "Bilingual" : "Regular"}
                        </span>
                    </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {challenge.totalQuestions}
                    </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {formatTime(challenge.totalTime)}
                    </td>
                      <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/challenges/${challenge.id}`)}
                            className="text-[#FF0098] hover:text-[#FF0098]/80 transition-colors"
                            title="View details"
                          >
                            <VisibilityIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => {
                              // TODO: Implement duplicate challenge
                              console.log("Duplicate challenge:", challenge.id);
                            }}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            title="Duplicate"
                          >
                            <CopyIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => {
                              // TODO: Implement edit challenge
                              console.log("Edit challenge:", challenge.id);
                            }}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => {
                              // TODO: Implement delete challenge
                              console.log("Delete challenge:", challenge.id);
                            }}
                            className="text-gray-500 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

          {/* Pagination */}
          {!isLoading && paginatedChallenges.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredChallenges.length}
              itemsPerPage={itemsPerPage}
            />
          )}
            </div>
      </DashboardContent>
    </div>
  );
};

export default ChallengesPage;
