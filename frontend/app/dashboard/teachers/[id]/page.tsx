"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";
import DashboardContent from "../../../../components/DashboardContent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { teachers } from "@/src/data/teachers";
import calculateAge from "@/lib/calculateAge";
import { cn } from "@/lib/utils";

export default function TeacherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.id as string;

  const teacher = teachers.find((t) => t.id === Number(teacherId));

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <DashboardContent>
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowBackIcon fontSize="small" />
              Back
            </button>
            <h1 className="font-heading text-3xl font-bold text-gray-900">
              Teacher Not Found
            </h1>
            <p className="text-gray-600 mt-1">
              The teacher you are looking for does not exist.
            </p>
          </div>
        </DashboardContent>
      </div>
    );
  }

  const initials = teacher.fullName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <DashboardContent>
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowBackIcon fontSize="small" />
            Back to Teachers
          </button>
          <h1 className="font-heading text-3xl font-bold text-gray-900">
            Teacher Details
          </h1>
          <p className="text-gray-600 mt-1">View complete teacher information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-[#FF0098] flex items-center justify-center text-white font-semibold text-2xl">
                {initials}
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-1">
                  {teacher.fullName}
                </h2>
                <p className="text-gray-600">{teacher.email}</p>
                <div className="mt-2">
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                      teacher.schoolType === "bilingual"
                        ? "bg-[#33CC00]/10 text-[#33CC00]"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {teacher.schoolType === "bilingual" ? "Bilingüe" : "Regular"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Full Name
                </label>
                <p className="text-gray-900 font-medium">{teacher.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Age
                </label>
                <p className="text-gray-900 font-medium">
                  {calculateAge(teacher.birthDate)} years old
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Birth Date
                </label>
                <p className="text-gray-900 font-medium">
                  {new Date(teacher.birthDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Email
                </label>
                <p className="text-gray-900 font-medium">{teacher.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Phone
                </label>
                <p className="text-gray-900 font-medium">{teacher.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  School
                </label>
                <p className="text-gray-900 font-medium">{teacher.school}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  School Type
                </label>
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                    teacher.schoolType === "bilingual"
                      ? "bg-[#33CC00]/10 text-[#33CC00]"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  {teacher.schoolType === "bilingual" ? "Bilingüe" : "Regular"}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">
              Teacher ID
            </h3>
            <p className="text-gray-900 font-mono text-sm">#{teacher.id}</p>
          </div>
        </div>
      </DashboardContent>
    </div>
  );
}
