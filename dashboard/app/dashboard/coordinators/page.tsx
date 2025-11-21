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
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { coordinators } from "@/src/data/coordinators";
import { cn } from "@/lib/utils";
import calculateAge from "@/lib/calculateAge";
import { AddCoordinatorForm } from "./components/AddCoordinatorModal";
import { EditCoordinatorForm } from "./components/EditCoordinatorModal";
import { schools } from "@/src/data/schools";
import { Coordinator } from "@/src/definitions/interfaces/coordinators";
import { useGenericModal } from "@/src/contexts/GenericModalContext";

type CoordinatorFormData = Omit<Coordinator, "id">;

const CoordinatorsPage = () => {
  const router = useRouter();
  const { openModal } = useGenericModal();
  const [searchCoordinatorName, setSearchCoordinatorName] = useState("");
  const [searchLiceoName, setSearchLiceoName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [filterLiceoType, setFilterLiceoType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleAddSubmit = (data: CoordinatorFormData) => {
    // Handle add coordinator logic here
    console.log("Adding coordinator:", data);
  };

  const handleEdit = (coordinator: Coordinator) => {
    openModal({
      title: `Edit Coordinator: ${coordinator.fullName}`,
      size: "2xl",
      content: (
        <EditCoordinatorForm
          coordinator={coordinator}
          onSubmit={handleEditSubmit}
          schools={schools}
        />
      ),
    });
  };

  const handleEditSubmit = (data: CoordinatorFormData) => {
    // Handle edit coordinator logic here
    console.log("Editing coordinator:", data);
  };

  // Filter coordinators
  const filteredCoordinators = coordinators.filter((coordinator) => {
    const matchesCoordinatorName = coordinator.fullName
      .toLowerCase()
      .includes(searchCoordinatorName.toLowerCase());
    const matchesLiceoName = coordinator.school
      .toLowerCase()
      .includes(searchLiceoName.toLowerCase());
    const matchesPhone = coordinator.phone.includes(searchPhone);
    const matchesLiceoType =
      filterLiceoType === "all" || coordinator.schoolType === filterLiceoType;
    return (
      matchesCoordinatorName && matchesLiceoName && matchesPhone && matchesLiceoType
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredCoordinators.length / itemsPerPage);
  const paginatedCoordinators = filteredCoordinators.slice(
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
              Coordinators Management
            </h1>
            <p className="text-gray-600">Manage and oversee system coordinators</p>
          </div>
          <AddButton
            label="Add Coordinator"
            icon={SupervisorAccountIcon}
            onClick={() =>
              openModal({
                title: "Add New Coordinator",
                size: "2xl",
                content: (
                  <AddCoordinatorForm
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
                placeholder="Search by coordinator name..."
                value={searchCoordinatorName}
                onChange={(e) => setSearchCoordinatorName(e.target.value)}
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

        {/* Coordinators Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Coordinator
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
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedCoordinators.map((coordinator) => (
                  <tr key={coordinator.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {coordinator.fullName}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{coordinator.email}</td>
                    <td className="px-6 py-4 text-gray-600">{coordinator.phone}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {calculateAge(coordinator.birthDate)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {coordinator.school}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                          coordinator.schoolType === "bilingual"
                            ? "bg-[#33CC00]/10 text-[#33CC00]"
                            : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {coordinator.schoolType === "bilingual"
                          ? "Bilingüe"
                          : "Regular"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/coordinators/${coordinator.id}`)}
                          className="text-[#FF0098] hover:text-[#FF0098]/80"
                          title="View details"
                        >
                          <VisibilityIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleEdit(coordinator)}
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
            totalItems={filteredCoordinators.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </DashboardContent>
    </div>
  );
};

export default CoordinatorsPage;
