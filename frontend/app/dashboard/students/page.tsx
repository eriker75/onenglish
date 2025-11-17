"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import DashboardContent from "../../../components/DashboardContent";
import Pagination from "../../../components/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddButton from "../../../components/AddButton";
import PersonIcon from "@mui/icons-material/Person";
import { cn } from "@/lib/utils";
import AddStudentModal from "./components/AddStudentModal";
import EditStudentModal from "./components/EditStudentModal";

const StudentsPage = () => {
  const router = useRouter();
  const [searchStudentName, setSearchStudentName] = useState("");
  const [searchSchoolName, setSearchSchoolName] = useState("");
  const [filterLiceoType, setFilterLiceoType] = useState("all");
  const [filterGrade, setFilterGrade] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  type Student = {
    id: number;
    fullName: string;
    age: number;
    birthDate: string;
    school: string;
    liceoType: string;
    grade: string;
  };
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const itemsPerPage = 5;

  const liceos = [
    { id: 1, name: "School Bolivariano Andrés Bello", type: "Bilingüe" },
    { id: 2, name: "U.E. Juan XXIII", type: "Regular" },
    { id: 3, name: "Colegio Emmanuel", type: "Bilingüe" },
    { id: 4, name: "Colegio San Ignacio", type: "Bilingüe" },
  ];

  const students = [
    {
      id: 1,
      fullName: "Maria Lopez",
      age: 17,
      birthDate: "2007-05-15",
      school: "School Bolivariano Andrés Bello",
      liceoType: "Bilingüe",
      grade: "5to año",
    },
    {
      id: 2,
      fullName: "Carlos Rodriguez",
      age: 16,
      birthDate: "2008-03-22",
      school: "U.E. Juan XXIII",
      liceoType: "Regular",
      grade: "4to año",
    },
    {
      id: 3,
      fullName: "Ana Martinez",
      age: 15,
      birthDate: "2009-09-10",
      school: "Colegio Emmanuel",
      liceoType: "Bilingüe",
      grade: "3er año",
    },
    {
      id: 4,
      fullName: "Luis Garcia",
      age: 16,
      birthDate: "2008-11-28",
      school: "School Bolivariano Andrés Bello",
      liceoType: "Bilingüe",
      grade: "4to año",
    },
    {
      id: 5,
      fullName: "Sofia Hernandez",
      age: 14,
      birthDate: "2010-07-04",
      school: "Colegio Emmanuel",
      liceoType: "Bilingüe",
      grade: "2do año",
    },
    {
      id: 6,
      fullName: "Diego Torres",
      age: 17,
      birthDate: "2007-12-17",
      school: "U.E. Juan XXIII",
      liceoType: "Regular",
      grade: "5to año",
    },
    {
      id: 7,
      fullName: "Valentina Ramirez",
      age: 15,
      birthDate: "2009-02-08",
      school: "School Bolivariano Andrés Bello",
      liceoType: "Bilingüe",
      grade: "3er año",
    },
    {
      id: 8,
      fullName: "Javier Morales",
      age: 16,
      birthDate: "2008-08-20",
      school: "Colegio San Ignacio",
      liceoType: "Bilingüe",
      grade: "4to año",
    },
    {
      id: 9,
      fullName: "Isabella Castro",
      age: 14,
      birthDate: "2010-04-12",
      school: "U.E. Juan XXIII",
      liceoType: "Regular",
      grade: "2do año",
    },
    {
      id: 10,
      fullName: "Miguel Fernandez",
      age: 17,
      birthDate: "2007-10-30",
      school: "Colegio Emmanuel",
      liceoType: "Bilingüe",
      grade: "5to año",
    },
    {
      id: 11,
      fullName: "Lucia Vargas",
      age: 15,
      birthDate: "2009-01-18",
      school: "School Bolivariano Andrés Bello",
      liceoType: "Bilingüe",
      grade: "3er año",
    },
    {
      id: 12,
      fullName: "Andres Silva",
      age: 16,
      birthDate: "2008-06-25",
      school: "U.E. Juan XXIII",
      liceoType: "Regular",
      grade: "4to año",
    },
    {
      id: 13,
      fullName: "Camila Rojas",
      age: 17,
      birthDate: "2007-09-14",
      school: "Colegio Emmanuel",
      liceoType: "Bilingüe",
      grade: "5to año",
    },
    {
      id: 14,
      fullName: "Sebastian Ortiz",
      age: 15,
      birthDate: "2009-11-03",
      school: "Colegio San Ignacio",
      liceoType: "Bilingüe",
      grade: "3er año",
    },
    {
      id: 15,
      fullName: "Daniela Moreno",
      age: 16,
      birthDate: "2008-12-07",
      school: "School Bolivariano Andrés Bello",
      liceoType: "Bilingüe",
      grade: "4to año",
    },
  ];

  const venezuelanGrades = [
    "5th grade",
    "6th grade",
    "1st year",
    "2nd year",
    "3rd year",
    "4th year",
    "5th year",
  ];

  const handleAddSubmit = (data: Student) => {
    // Handle add student logic here
    console.log("Adding student:", data);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowEditModal(true);
  };

  const handleEditSubmit = (data: Student) => {
    // Handle edit student logic here
    console.log("Editing student:", data);
    setEditingStudent(null);
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesStudentName = student.fullName
      .toLowerCase()
      .includes(searchStudentName.toLowerCase());
    const matchesSchoolName = student.school
      .toLowerCase()
      .includes(searchSchoolName.toLowerCase());
    const matchesLiceoType =
      filterLiceoType === "all" || student.liceoType === filterLiceoType;
    const matchesGrade = filterGrade === "all" || student.grade === filterGrade;
    return (
      matchesStudentName &&
      matchesSchoolName &&
      matchesLiceoType &&
      matchesGrade
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <DashboardContent>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
              Students Management
            </h1>
            <p className="text-gray-600">Manage and oversee system students</p>
          </div>
          <AddButton
            label="Add Student"
            icon={PersonIcon}
            onClick={() => setShowAddModal(true)}
            bgColor="#33CC00"
          />
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchStudentName}
                onChange={(e) => setSearchStudentName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by school name..."
                value={searchSchoolName}
                onChange={(e) => setSearchSchoolName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] text-gray-700 h-[42px]"
              >
                <option value="all">All Grades</option>
                {venezuelanGrades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <div className="h-full rounded-lg border border-gray-300 overflow-hidden flex">
                <button
                  onClick={() => setFilterLiceoType("all")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                    filterLiceoType === "all"
                      ? "bg-[#FF0098] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterLiceoType("Bilingüe")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                    filterLiceoType === "Bilingüe"
                      ? "bg-[#FF0098] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  Bilingual
                </button>
                <button
                  onClick={() => setFilterLiceoType("Regular")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                    filterLiceoType === "Regular"
                      ? "bg-[#FF0098] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  Regular
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Age
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    School
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    School Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Grade
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FF0098] flex items-center justify-center text-white font-semibold text-sm">
                          {student.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <p className="font-medium text-gray-900">
                          {student.fullName}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{student.age}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {student.school}
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4 text-gray-600">{student.grade}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/students/${student.id}`)
                          }
                          className="text-[#FF0098] hover:text-[#FF0098]/80"
                          title="View details"
                        >
                          <VisibilityIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-gray-500 hover:text-gray-700"
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-600"
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredStudents.length}
            itemsPerPage={itemsPerPage}
          />
        </div>

        {/* Add Student Modal */}
        <AddStudentModal
          showModal={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSubmit}
          schools={liceos}
          grades={venezuelanGrades}
        />

        {/* Edit Student Modal */}
        <EditStudentModal
          showModal={showEditModal}
          student={editingStudent}
          onClose={() => {
            setShowEditModal(false);
            setEditingStudent(null);
          }}
          onSubmit={handleEditSubmit}
          schools={liceos}
          grades={venezuelanGrades}
        />
      </DashboardContent>
    </div>
  );
};

export default StudentsPage;
