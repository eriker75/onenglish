'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password recovery logic here
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Password Recovery Form */}
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

          <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-2 text-center">
            Forgot Password
          </h2>

          <p className="text-gray-600 text-sm text-center mb-6">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent transition"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF0098] text-white py-3 rounded-lg font-semibold hover:bg-[#FF0098]/90 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-[#FF0098] font-semibold hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          © 2025 OnEnglish. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
