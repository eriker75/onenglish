"use client";

import React, { useState, useEffect, useRef } from "react";
import PersonIcon from "@mui/icons-material/Person";

interface AddStudentModalProps {
  showModal: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  schools: Array<{ id: number; name: string; type: string }>;
  grades: string[];
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  showModal,
  onClose,
  onSubmit,
  schools,
  grades,
}) => {
  const [schoolsearch, setSchoolsearch] = useState("");
  const [showLiceoDropdown, setShowLiceoDropdown] = useState(false);
  const liceoDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    birthDate: "",
    grade: "",
    school: "",
    liceoType: "Bilingüe",
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

  // Reset form when modal closes
  useEffect(() => {
    if (!showModal) {
      setFormData({
        fullName: "",
        age: "",
        birthDate: "",
        grade: "",
        school: "",
        liceoType: "Bilingüe",
      });
      setSchoolsearch("");
      setShowLiceoDropdown(false);
    }
  }, [showModal]);

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
    onClose();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-semibold text-gray-900">
            Add New Student
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                          liceoType: school.type,
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
              placeholder="e.g., Maria Lopez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade *
            </label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#33CC00] focus:border-transparent"
            >
              <option value="">Select a grade</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#33CC00] hover:bg-[#33CC00]/90 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <PersonIcon fontSize="small" />
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
