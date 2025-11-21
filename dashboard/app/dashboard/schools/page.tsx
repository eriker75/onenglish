"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DashboardContent from "@/components/DashboardContent";
import Pagination from "@/components/Pagination";
import AddButton from "@/components/AddButton";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SchoolIcon from "@mui/icons-material/School";
import { getDemoSchools } from "@/src/data/demo-data";
import { cn } from "@/lib/utils";
import { useGenericModal } from "@/src/contexts/GenericModalContext";
import AddSchoolModal from "./components/AddSchoolModal";
import EditSchoolForm from "./components/EditSchoolForm";
import DeleteSchoolModal from "./components/DeleteSchoolModal";

const SchoolsPage = () => {
  const router = useRouter();
  const { openModal } = useGenericModal();
  const [schools, setSchools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchSchoolName, setSearchSchoolName] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchState, setSearchState] = useState("");
  const [filterLiceoType, setFilterLiceoType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadSchools = async () => {
      try {
        setIsLoading(true);
        const data = await getDemoSchools();
        setSchools(data);
      } catch (error) {
        console.error("Error loading schools:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchools();
  }, []);

  // Filter schools
  const filteredSchools = schools.filter((school) => {
    const matchesSchoolName = school.name
      .toLowerCase()
      .includes(searchSchoolName.toLowerCase());
    const matchesCity = school.city
      .toLowerCase()
      .includes(searchCity.toLowerCase());
    const matchesState = school.state
      .toLowerCase()
      .includes(searchState.toLowerCase());
    const matchesLiceoType =
      filterLiceoType === "all" || school.type === filterLiceoType;
    return matchesSchoolName && matchesCity && matchesState && matchesLiceoType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Check if there are no schools and no filters are active
  const hasNoSchools = schools.length === 0;
  const noFiltersActive = !searchSchoolName && !searchCity && !searchState && filterLiceoType === "all";
  const showEmptyState = hasNoSchools && noFiltersActive;

  const handleOpenAddSchoolModal = () => {
    openModal({
      title: "Add New School",
      size: "2xl",
      content: <AddSchoolModal />,
    });
  };

  const handleOpenEditSchoolModal = (school: any) => {
    openModal({
      title: "Edit School",
      size: "2xl",
      content: <EditSchoolForm school={school} />,
    });
  };

  const handleOpenDeleteSchoolModal = (school: any) => {
    openModal({
      title: "Delete School",
      size: "md",
      content: <DeleteSchoolModal school={school} />,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <DashboardContent>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
              Schools Management
            </h1>
            <p className="text-gray-600">Manage and oversee registered schools</p>
          </div>
          <AddButton
            label="Add School"
            icon={SchoolIcon}
            onClick={handleOpenAddSchoolModal}
            bgColor="#33CC00"
          />
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by state..."
                value={searchState}
                onChange={(e) => setSearchState(e.target.value)}
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
                      ? "bg-gray-200 text-gray-700"
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
                      ? "bg-[#33CC00]/10 text-[#33CC00]"
                      : "bg-white text-gray-700 hover:bg-[#33CC00]/5"
                  )}
                >
                  Bilingual
                </button>
                <button
                  onClick={() => setFilterLiceoType("regular")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                    filterLiceoType === "regular"
                      ? "bg-[#FF0098]/10 text-[#FF0098]"
                      : "bg-white text-gray-700 hover:bg-[#FF0098]/5"
                  )}
                >
                  Regular
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Schools Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    School
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Students
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Participation
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF0098] mb-4"></div>
                        <p className="text-gray-600">Loading schools...</p>
                      </div>
                    </td>
                  </tr>
                ) : showEmptyState ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-[#33CC00]/10 flex items-center justify-center mb-6">
                          <SchoolIcon className="w-10 h-10 text-[#33CC00]" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                          No Schools Registered
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md" style={{ fontFamily: 'var(--font-poppins)' }}>
                          Start by adding your first school to participate in the Bilingual Olympics {new Date().getFullYear()}
                        </p>
                        <AddButton
                          label="Add School"
                          icon={SchoolIcon}
                          onClick={handleOpenAddSchoolModal}
                          bgColor="#33CC00"
                        />
                      </div>
                    </td>
                  </tr>
                ) : paginatedSchools.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <SchoolIcon className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Schools Found
                        </h3>
                        <p className="text-gray-600">
                          Try adjusting your search filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedSchools.map((school) => (
                    <tr key={school.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {school.name}
                          </p>
                          <p className="text-xs text-gray-500">{school.code}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {school.city}, {school.state}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{school.email}</td>
                      <td className="px-6 py-4 text-gray-600">{school.phone}</td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                            school.type === "bilingual"
                              ? "bg-[#33CC00]/10 text-[#33CC00]"
                              : school.type === "regular"
                              ? "bg-[#FF0098]/10 text-[#FF0098]"
                              : "bg-gray-100 text-gray-700"
                          )}
                        >
                          {school.type === "bilingual" ? "Bilingual" : school.type === "regular" ? "Regular" : "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {school.registeredStudents}/{school.totalStudents}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-green-600"
                              style={{ width: `${school.participationRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {school.participationRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/schools/${school.id}`)}
                            className="text-[#FF0098] hover:text-[#FF0098]/80 transition-colors"
                            title="View details"
                          >
                            <VisibilityIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleOpenEditSchoolModal(school)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteSchoolModal(school)}
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
          {!isLoading && paginatedSchools.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredSchools.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      </DashboardContent>
    </div>
  );
};


export default SchoolsPage;
