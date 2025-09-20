import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import backgroundImageVideo from '../assets/videos/final animation.mp4';

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("passenger");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!fullName || fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters long.";
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        newErrors.password = "Password must include at least one uppercase letter, one number, and one special character.";
      }
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setLoading(true);

    try {
      const result = await register(fullName, email, password, role);
      if (result.success) {
        const user = JSON.parse(localStorage.getItem('user'));
        const roleRoutes = {
          admin: '/admin',
          driver: '/driver',
          passenger: '/passenger'
        };
        navigate(roleRoutes[user.role] || '/passenger');
      } else {
        setErrors({ form: result.error });
      }
    } catch (err) {
      setErrors({ form: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen md:grid md:grid-cols-2 lg:grid-cols-[1.5fr_1fr]">

      <div className="relative hidden md:flex items-center justify-center p-8 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundImageVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative text-white p-6 bg-black/50 rounded-xl text-center z-10">
            <h1 className="text-5xl font-bold mb-4">Join The Journey</h1>
            <p className="max-w-md text-lg">
                Your next destination is just a few clicks away.
            </p>
        </div>
      </div>

      <div className="flex items-center justify-center w-full p-4 md:p-8">
        <div className="glass-card p-8 md:p-10 w-full max-w-sm">
          <h2 className="text-3xl font-bold text-center text-white mb-2">Create Account</h2>
          <p className="text-center text-gray-300 mb-6 text-sm">
            Join our Bus Management platform
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {errors.form && (
              <div className="p-3 rounded-md bg-red-500/30 border border-red-500 text-red-200 text-sm">
                {errors.form}
              </div>
            )}
            
            <div>
              <label htmlFor="fullName" className="text-sm font-medium text-gray-300">Full Name</label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-teal-500 sm:text-sm form-input"
              />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>
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
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" aclassName="text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Create a password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="mt-1 block w-full px-3 py-2 rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-teal-500 sm:text-sm form-input"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" aclassName="text-sm font-medium text-gray-300">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-teal-500 sm:text-sm form-input"
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            <div>
              <label htmlFor="role" aclassName="text-sm font-medium text-gray-300">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full px-3 py-2 rounded-lg shadow-sm text-white focus:outline-none focus:ring-teal-500 sm:text-sm form-input appearance-none"
              >
                <option aclassName="bg-gray-700" value="passenger">Passenger</option>
                <option aclassName="bg-gray-700" value="driver">Driver</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-teal-400 hover:text-teal-300 hover:underline transition duration-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}