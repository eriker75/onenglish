"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";
import DashboardContent from "../../../../components/DashboardContent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { coordinators } from "@/src/data/coordinators";
import calculateAge from "@/lib/calculateAge";
import { cn } from "@/lib/utils";

export default function CoordinatorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const coordinatorId = params.id as string;

  const coordinator = coordinators.find((c) => c.id === Number(coordinatorId));

  if (!coordinator) {
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
              Coordinator Not Found
            </h1>
            <p className="text-gray-600 mt-1">
              The coordinator you are looking for does not exist.
            </p>
          </div>
        </DashboardContent>
      </div>
    );
  }

  const initials = coordinator.fullName
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
            Back to Coordinators
          </button>
          <h1 className="font-heading text-3xl font-bold text-gray-900">
            Coordinator Details
          </h1>
          <p className="text-gray-600 mt-1">View complete coordinator information</p>
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
                  {coordinator.fullName}
                </h2>
                <p className="text-gray-600">{coordinator.email}</p>
                <div className="mt-2 flex gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                      coordinator.schoolType === "bilingual"
                        ? "bg-[#33CC00]/10 text-[#33CC00]"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {coordinator.schoolType === "bilingual" ? "Bilingüe" : "Regular"}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                      coordinator.role === "coordinator"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    )}
                  >
                    {coordinator.role === "teacher"
                      ? "Teacher Coordinator"
                      : "Lead Coordinator"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Full Name
                </label>
                <p className="text-gray-900 font-medium">{coordinator.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Age
                </label>
                <p className="text-gray-900 font-medium">
                  {calculateAge(coordinator.birthDate)} years old
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Birth Date
                </label>
                <p className="text-gray-900 font-medium">
                  {new Date(coordinator.birthDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Email
                </label>
                <p className="text-gray-900 font-medium">{coordinator.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Phone
                </label>
                <p className="text-gray-900 font-medium">{coordinator.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  School
                </label>
                <p className="text-gray-900 font-medium">{coordinator.school}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  School Type
                </label>
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                    coordinator.schoolType === "bilingual"
                      ? "bg-[#33CC00]/10 text-[#33CC00]"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  {coordinator.schoolType === "bilingual" ? "Bilingüe" : "Regular"}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Role
                </label>
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                    coordinator.role === "coordinator"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  )}
                >
                  {coordinator.role === "teacher"
                    ? "Teacher Coordinator"
                    : "Lead Coordinator"}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">
              Coordinator ID
            </h3>
            <p className="text-gray-900 font-mono text-sm">#{coordinator.id}</p>
          </div>
        </div>
      </DashboardContent>
    </div>
  );
}
