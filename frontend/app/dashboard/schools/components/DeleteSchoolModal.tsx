"use client";

import React, { useState } from "react";
import { useGenericModal } from "@/src/contexts/GenericModalContext";

interface DeleteSchoolModalProps {
  school: any;
}

const DeleteSchoolModal: React.FC<DeleteSchoolModalProps> = ({ school }) => {
  const { closeModal } = useGenericModal();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log("School deleted (demo):", school);
    setIsLoading(false);
    closeModal();
  };

  return (
    <div className="p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-red-600 text-2xl">⚠️</span>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Delete School?
          </h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete the school{" "}
            <span className="font-semibold text-gray-900">{school.name}</span>?
          </p>
          <p className="text-sm text-red-600">
            This action cannot be undone. All data associated with this school
            will be permanently removed.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 w-full">
          <div className="text-sm text-left space-y-1">
            <p>
              <span className="font-medium text-gray-700">Location:</span>{" "}
              <span className="text-gray-600">
                {school.city}, {school.state}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Type:</span>{" "}
              <span className="text-gray-600">{school.type}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4 w-full">
          <button
            type="button"
            onClick={closeModal}
            disabled={isLoading}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete School"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSchoolModal;
