"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DashboardContent from "@/components/DashboardContent";
import SchoolIcon from "@mui/icons-material/School";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";
import { getDemoSchools } from "@/src/data/demo-data";
import { cn } from "@/lib/utils";

const SchoolDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [school, setSchool] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    registeredStudents: 0,
    participationRate: 0,
    completedChallenges: 0,
    totalChallenges: 0,
    averageScore: 0,
    totalRevenue: 0,
    paidStudents: 0,
    activeStudents: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    const loadSchool = async () => {
      try {
        setIsLoading(true);
        const schools = await getDemoSchools();
        const foundSchool = schools.find((s) => s.id === params.id);
        
        if (foundSchool) {
          setSchool(foundSchool);
          // Simulate stats loading
          setStats({
            totalStudents: foundSchool.totalStudents || 125,
            registeredStudents: foundSchool.registeredStudents || 118,
            participationRate: foundSchool.participationRate || 94,
            completedChallenges: 45,
            totalChallenges: 50,
            averageScore: 87.5,
            totalRevenue: 11800,
            paidStudents: 110,
            activeStudents: 95,
            pendingPayments: 8,
          });
        }
      } catch (error) {
        console.error("Error loading school:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchool();
  }, [params.id]);

  const handleGenerateReport = () => {
    // TODO: Implement report generation
    console.log("Generating report for school:", school?.id);
    // This would typically open a PDF or download a report
    alert("Report generation feature coming soon!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <DashboardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF0098] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading school details...</p>
            </div>
          </div>
        </DashboardContent>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <DashboardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <SchoolIcon className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">School Not Found</h2>
            <p className="text-gray-600 mb-6">The school you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push("/dashboard/schools")}
              className="px-6 py-3 bg-[#33CC00] text-white rounded-lg font-semibold hover:bg-[#33CC00]/90 transition-colors"
            >
              Back to Schools
            </button>
          </div>
        </DashboardContent>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <DashboardContent>
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard/schools")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowBackIcon fontSize="small" />
            <span className="text-sm font-medium">Back to Schools</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
                {school.name}
              </h1>
              <p className="text-gray-600">
                {school.city}, {school.state} • {school.code}
              </p>
            </div>
            <button
              onClick={handleGenerateReport}
              className="flex items-center gap-2 px-6 py-3 bg-[#FF0098] text-white rounded-lg font-semibold hover:bg-[#FF0098]/90 transition-colors"
            >
              <PictureAsPdfIcon fontSize="small" />
              Generate Report
            </button>
          </div>
        </div>

        {/* School Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">School Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Type</p>
              <p className="font-medium text-gray-900">
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                    school.type === "bilingual"
                      ? "bg-[#33CC00]/10 text-[#33CC00]"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  {school.type === "bilingual" ? "Bilingual" : "Regular"}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium text-gray-900">{school.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="font-medium text-gray-900">{school.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">City</p>
              <p className="font-medium text-gray-900">{school.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">State</p>
              <p className="font-medium text-gray-900">{school.state}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Code</p>
              <p className="font-medium text-gray-900">{school.code}</p>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#FF0098]/10 flex items-center justify-center">
                <SchoolIcon className="w-6 h-6 text-[#FF0098]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.registeredStudents} registered</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#33CC00]/10 flex items-center justify-center">
                <SchoolIcon className="w-6 h-6 text-[#33CC00]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Participation Rate</p>
            <p className="text-2xl font-bold text-gray-900">{stats.participationRate}%</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-600"
                style={{ width: `${stats.participationRate}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#f2bf3c]/10 flex items-center justify-center">
                <SchoolIcon className="w-6 h-6 text-[#f2bf3c]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Challenges Completed</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.completedChallenges}/{stats.totalChallenges}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((stats.completedChallenges / stats.totalChallenges) * 100)}% completion
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#9000d9]/10 flex items-center justify-center">
                <SchoolIcon className="w-6 h-6 text-[#9000d9]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Average Score</p>
            <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
            <p className="text-xs text-gray-500 mt-1">Across all challenges</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#33CC00]/10 flex items-center justify-center">
                <SchoolIcon className="w-6 h-6 text-[#33CC00]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Paid Students</p>
            <p className="text-2xl font-bold text-gray-900">{stats.paidStudents}</p>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((stats.paidStudents / stats.totalStudents) * 100)}% payment rate
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#44b07f]/10 flex items-center justify-center">
                <SchoolIcon className="w-6 h-6 text-[#44b07f]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ${stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">From {stats.paidStudents} students</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
                <PersonIcon className="w-6 h-6 text-[#2563eb]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Students</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((stats.activeStudents / stats.totalStudents) * 100)}% of total
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#f2bf3c]/10 flex items-center justify-center">
                <PaymentIcon className="w-6 h-6 text-[#f2bf3c]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalStudents - stats.paidStudents} students remaining
            </p>
          </div>
        </div>
      </DashboardContent>
    </div>
  );
};

export default SchoolDetailPage;

