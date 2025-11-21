"use client";

import { useState } from "react";
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
import { teachers } from "@/src/data/teachers";
import { cn } from "@/lib/utils";
import calculateAge from "@/lib/calculateAge";
import { AddTeacherForm } from "./components/AddTeacherModal";
import { EditTeacherForm } from "./components/EditTeacherModal";
import { schools } from "@/src/data/schools";
import { Teacher } from "@/src/definitions/interfaces/teachers";
import { useGenericModal } from "@/src/contexts/GenericModalContext";

type TeacherFormData = Omit<Teacher, "id">;

const TeachersPage = () => {
  const router = useRouter();
  const { openModal } = useGenericModal();
  const [searchTeacherName, setSearchTeacherName] = useState("");
  const [searchLiceoName, setSearchLiceoName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [filterLiceoType, setFilterLiceoType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleAddSubmit = (data: TeacherFormData) => {
    // Handle add teacher logic here
    console.log("Adding teacher:", data);
  };

  const handleEdit = (teacher: Teacher) => {
    openModal({
      title: `Edit Teacher: ${teacher.fullName}`,
      size: "2xl",
      content: (
        <EditTeacherForm
          teacher={teacher}
          onSubmit={handleEditSubmit}
          schools={schools}
        />
      ),
    });
  };

  const handleEditSubmit = (data: TeacherFormData) => {
    // Handle edit teacher logic here
    console.log("Editing teacher:", data);
  };

  // Filter teachers
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesTeacherName = teacher.fullName
      .toLowerCase()
      .includes(searchTeacherName.toLowerCase());
    const matchesLiceoName = teacher.school
      .toLowerCase()
      .includes(searchLiceoName.toLowerCase());
    const matchesPhone = teacher.phone.includes(searchPhone);
    const matchesLiceoType =
      filterLiceoType === "all" || teacher.schoolType === filterLiceoType;
    return (
      matchesTeacherName && matchesLiceoName && matchesPhone && matchesLiceoType
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
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
              Teachers Management
            </h1>
            <p className="text-gray-600">Manage and oversee system teachers</p>
          </div>
          <AddButton
            label="Add Teacher"
            icon={PersonIcon}
            onClick={() =>
              openModal({
                title: "Add New Teacher",
                size: "2xl",
                content: (
                  <AddTeacherForm
                    onSubmit={handleAddSubmit}
                    schools={schools}
                  />
                ),
              })
            }
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
                placeholder="Search by teacher name..."
                value={searchTeacherName}
                onChange={(e) => setSearchTeacherName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by school name..."
                value={searchLiceoName}
                onChange={(e) => setSearchLiceoName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by phone..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
              />
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
                  onClick={() => setFilterLiceoType("bilingual")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                    filterLiceoType === "bilingual"
                      ? "bg-[#FF0098] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  Bilingual
                </button>
                <button
                  onClick={() => setFilterLiceoType("regular")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                    filterLiceoType === "regular"
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

        {/* Teachers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Teacher
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Phone
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {teacher.fullName}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{teacher.email}</td>
                    <td className="px-6 py-4 text-gray-600">{teacher.phone}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {calculateAge(teacher.birthDate)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {teacher.school}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                          teacher.schoolType === "bilingual"
                            ? "bg-[#33CC00]/10 text-[#33CC00]"
                            : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {teacher.schoolType === "bilingual"
                          ? "Bilingüe"
                          : "Regular"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/teachers/${teacher.id}`)}
                          className="text-[#FF0098] hover:text-[#FF0098]/80"
                          title="View details"
                        >
                          <VisibilityIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleEdit(teacher)}
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
            totalItems={filteredTeachers.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </DashboardContent>
    </div>
  );
};

export default TeachersPage;
