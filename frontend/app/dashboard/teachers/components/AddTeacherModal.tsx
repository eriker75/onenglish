"use client";

import React, { useState, useEffect, useRef } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { Teacher } from "@/src/definitions/interfaces/teachers";
import { School } from "@/src/data/schools";
import { useGenericModal } from "@/src/contexts/GenericModalContext";

type TeacherFormData = Omit<Teacher, "id">;

interface AddTeacherFormProps {
  onSubmit: (data: TeacherFormData) => void;
  schools: School[];
}

export const AddTeacherForm: React.FC<AddTeacherFormProps> = ({
  onSubmit,
  schools,
}) => {
  const { closeModal } = useGenericModal();
  const [schoolsearch, setSchoolsearch] = useState("");
  const [showLiceoDropdown, setShowLiceoDropdown] = useState(false);
  const liceoDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<TeacherFormData>({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    school: "",
    schoolType: "bilingual",
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        liceoDropdownRef.current &&
        !liceoDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLiceoDropdown(false);
      }
    };

    if (showLiceoDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLiceoDropdown]);

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      birthDate: "",
      school: "",
      schoolType: "bilingual",
    });
    setSchoolsearch("");
    setShowLiceoDropdown(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    resetForm();
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <div className="relative" ref={liceoDropdownRef}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School *
        </label>
        <input
          type="text"
          value={schoolsearch || formData.school}
          onChange={(e) => {
            setSchoolsearch(e.target.value);
            setShowLiceoDropdown(true);
          }}
          onFocus={() => setShowLiceoDropdown(true)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#33CC00] focus:border-transparent"
          placeholder="Search school..."
        />
        {showLiceoDropdown && schoolsearch && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {schools
              .filter((school) =>
                school.name.toLowerCase().includes(schoolsearch.toLowerCase())
              )
              .map((school) => (
                <div
                  key={school.id}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      school: school.name,
                      schoolType:
                        school.type === "Bilingüe" ? "bilingual" : "regular",
                    });
                    setSchoolsearch("");
                    setShowLiceoDropdown(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {school.name}
                </div>
              ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Birth Date *
        </label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#33CC00] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#33CC00] focus:border-transparent"
          placeholder="e.g., Prof. Carmen Rodriguez"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#33CC00] focus:border-transparent"
          placeholder="e.g., carmen.rodriguez@school.edu.ve"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#33CC00] focus:border-transparent"
          placeholder="e.g., +58 412-1234567"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => {
            resetForm();
            closeModal();
          }}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 bg-[#33CC00] hover:bg-[#33CC00]/90 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <PersonIcon fontSize="small" />
          Add Teacher
        </button>
      </div>
    </form>
  );
};
