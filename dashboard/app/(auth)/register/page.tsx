'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'teacher',
    school: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle register logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-lg border-t border-t-gray-200 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/OnEnglishLogo.png"
              alt="OnEnglish Logo"
              width={200}
              height={200}
              className="w-48 h-auto object-contain mx-auto"
            />
          </div>

          <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-6 text-center">
            Sign Up
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent transition"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                User Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent transition"
              >
                <option value="teacher">Teacher/Coordinator</option>
                <option value="admin">Administrator</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                School
              </label>
              <input
                id="school"
                name="school"
                type="text"
                value={formData.school}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent transition"
                placeholder="School name"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

                  <button
                    type="submit"
                    className="w-full bg-[#FF0098] text-white py-3 rounded-lg font-semibold hover:bg-[#FF0098]/90 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Create Account
                  </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-[#FF0098] font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
