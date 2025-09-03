import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import backgroundImageVideo from '../assets/videos/final animation.mp4'; // Import your video file here

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === "admin") {
      navigate('/admin');
    } else if (role === "driver") {
      navigate('/driver');
    } else {
      navigate('/passenger');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 md:grid md:grid-cols-2 lg:grid-cols-[1.5fr_1fr] md:p-0">

      {/* This section is the animated background for larger screens. It is hidden on mobile. */}
      <div className="relative hidden md:flex items-center justify-center p-8 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* The video will play once because the 'loop' attribute is removed */}
          <source src={backgroundImageVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative text-white p-6 bg-black/50 rounded-xl text-center z-10">
            <h1 className="text-5xl font-bold mb-4">Dellhi humsafar</h1>
            <p className="max-w-md text-lg">
               Make me your humraahi
            </p>
        </div>
      </div>

      {/* This section contains the actual login form. */}
      <div className="flex items-center justify-center w-full p-4 md:p-8">
        <div className="bg-white dark:bg-gray-700 p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-sm">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">Welcome Back</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
            Sign in to your Bus Management account
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              >
                <option value="admin">Admin</option>
                <option value="driver">Driver</option>
                <option value="passenger">Passenger</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-200"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="flex justify-between mt-6 text-sm text-gray-600 dark:text-gray-400">
            <Link to="/forgot-password" className="font-medium text-teal-600 hover:text-teal-500 hover:underline">
              Forgot your password?
            </Link>
            <Link to="/register" className="font-medium text-teal-600 hover:text-teal-500 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
