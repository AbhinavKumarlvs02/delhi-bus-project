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
    <div className="flex items-center justify-center min-h-screen">
      <div className="glass-card p-8 md:p-10 w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-white mb-2">Forgot Password</h2>
        <p className="text-center text-gray-300 mb-6 text-sm">
          Enter your email to receive a password reset link
        </p>
        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-teal-500 sm:text-sm form-input"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:scale-105 transition duration-300"
            >
              Send Reset Link
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-300">
          <Link to="/login" className="font-medium text-teal-400 hover:text-teal-300 hover:underline transition duration-300">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}