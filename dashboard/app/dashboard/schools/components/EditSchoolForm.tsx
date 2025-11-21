"use client";

import React, { useState } from "react";
import { useGenericModal } from "@/src/contexts/GenericModalContext";

interface EditSchoolFormProps {
  school: any;
}

const EditSchoolForm: React.FC<EditSchoolFormProps> = ({ school }) => {
  const { closeModal } = useGenericModal();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: school.name,
    type: school.type,
    state: school.state,
    city: school.city,
    email: school.email,
    phone: school.phone,
    address: school.address || "",
    postalCode: school.postalCode || "",
    website: school.website || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log("School updated (demo):", formData);
    setIsLoading(false);
    closeModal();
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
            placeholder="E.g: U.E. Colegio Los Arcos"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="bilingual">Bilingual</option>
              <option value="regular">Regular</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
              placeholder="E.g: 1010"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
            >
              <option value="">Select a state</option>
              <option value="Amazonas">Amazonas</option>
              <option value="Anzoátegui">Anzoátegui</option>
              <option value="Apure">Apure</option>
              <option value="Aragua">Aragua</option>
              <option value="Barinas">Barinas</option>
              <option value="Bolívar">Bolívar</option>
              <option value="Carabobo">Carabobo</option>
              <option value="Cojedes">Cojedes</option>
              <option value="Delta Amacuro">Delta Amacuro</option>
              <option value="Distrito Capital">Distrito Capital</option>
              <option value="Falcón">Falcón</option>
              <option value="Guárico">Guárico</option>
              <option value="Lara">Lara</option>
              <option value="Mérida">Mérida</option>
              <option value="Miranda">Miranda</option>
              <option value="Monagas">Monagas</option>
              <option value="Nueva Esparta">Nueva Esparta</option>
              <option value="Portuguesa">Portuguesa</option>
              <option value="Sucre">Sucre</option>
              <option value="Táchira">Táchira</option>
              <option value="Trujillo">Trujillo</option>
              <option value="Vargas">Vargas</option>
              <option value="Yaracuy">Yaracuy</option>
              <option value="Zulia">Zulia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
              placeholder="E.g: Caracas"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
              placeholder="E.g: contacto@colegiolosarcos.edu.ve"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
              placeholder="E.g: +58424-1234567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
            placeholder="E.g: Av. Principal, Edif. 1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
            placeholder="E.g: https://www.colegiolosarcos.edu.ve"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={closeModal}
            disabled={isLoading}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-[#FF0098] hover:bg-[#FF0098]/90 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? "Guardando..." : "Update School"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSchoolForm;
