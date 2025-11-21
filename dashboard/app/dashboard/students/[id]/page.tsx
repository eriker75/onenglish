"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";
import DashboardContent from "../../../../components/DashboardContent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cn } from "@/lib/utils";

// Mock data - En producción esto vendría de una API
const mockStudents = [
  {
    id: 1,
    fullName: "Maria Lopez",
    age: 17,
    birthDate: "2007-05-15",
    school: "School Bolivariano Andrés Bello",
    liceoType: "Bilingüe",
    grade: "5to año",
    email: "maria.lopez@student.edu.ve",
    phone: "+58 412-1234567",
  },
  {
    id: 2,
    fullName: "Carlos Rodriguez",
    age: 16,
    birthDate: "2008-03-22",
    school: "U.E. Juan XXIII",
    liceoType: "Regular",
    grade: "4to año",
    email: "carlos.rodriguez@student.edu.ve",
    phone: "+58 414-2345678",
  },
  // Add more students as needed
];

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  // En producción, esto sería una llamada a la API
  const student = mockStudents.find((s) => s.id === Number(studentId));

  if (!student) {
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
              Student Not Found
            </h1>
            <p className="text-gray-600 mt-1">
              The student you are looking for does not exist.
            </p>
          </div>
        </DashboardContent>
      </div>
    );
  }

  const initials = student.fullName
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
            Back to Students
          </button>
          <h1 className="font-heading text-3xl font-bold text-gray-900">
            Student Details
          </h1>
          <p className="text-gray-600 mt-1">View complete student information</p>
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
                  {student.fullName}
                </h2>
                <p className="text-gray-600">{student.email || "No email provided"}</p>
                <div className="mt-2">
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                      student.liceoType === "Bilingüe"
                        ? "bg-[#33CC00]/10 text-[#33CC00]"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {student.liceoType}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Full Name
                </label>
                <p className="text-gray-900 font-medium">{student.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Age
                </label>
                <p className="text-gray-900 font-medium">{student.age} years old</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Birth Date
                </label>
                <p className="text-gray-900 font-medium">
                  {new Date(student.birthDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Grade
                </label>
                <p className="text-gray-900 font-medium">{student.grade}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  School
                </label>
                <p className="text-gray-900 font-medium">{student.school}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  School Type
                </label>
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                    student.liceoType === "Bilingüe"
                      ? "bg-[#33CC00]/10 text-[#33CC00]"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  {student.liceoType}
                </span>
              </div>
              {student.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900 font-medium">{student.email}</p>
                </div>
              )}
              {student.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Phone
                  </label>
                  <p className="text-gray-900 font-medium">{student.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">
              Student ID
            </h3>
            <p className="text-gray-900 font-mono text-sm">#{student.id}</p>
          </div>
        </div>
      </DashboardContent>
    </div>
  );
}
