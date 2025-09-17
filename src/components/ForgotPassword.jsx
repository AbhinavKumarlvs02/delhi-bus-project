import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    alert("Password reset link sent to your email!");
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50 text-gray-800">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Forgot Password</h2>
        <p className="text-center text-gray-600 mb-6 text-sm">Enter your email to receive a password reset link</p>
        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              Send Reset Link
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
