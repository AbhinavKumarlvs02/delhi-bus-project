import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import backgroundImageVideo from '../assets/videos/final animation.mp4';
import GoogleLoginButton from './GoogleLoginButton';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setLoading(true);
    setErrors({});

    try {
      const result = await login(email, password);
      if (result.success) {
        showSuccess('Login successful!');
        const user = JSON.parse(localStorage.getItem('user'));
        const roleRoutes = {
          admin: '/admin',
          driver: '/driver',
          passenger: '/passenger'
        };
        navigate(roleRoutes[user.role] || '/admin');
      } else {
        setErrors({ form: result.error });
        showError(result.error);
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setErrors({ form: errorMessage });
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen md:grid md:grid-cols-2 lg:grid-cols-[1.5fr_1fr]">
      
      <div className="relative hidden md:flex items-center justify-center p-8 overflow-hidden">
        <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
          <source src={backgroundImageVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative text-white p-6 bg-black/50 rounded-xl text-center z-10">
          <h1 className="text-5xl font-bold mb-4">Ludhiyana Humsafar</h1>
          <p className="max-w-md text-lg">Make me your humraahi</p>
        </div>
      </div>

      <div className="flex items-center justify-center w-full p-4 md:p-8">
        <div className="glass-card p-8 md:p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {errors.form && (
              <div className="p-3 rounded-md bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-medium">{errors.form}</div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-slate-300 block mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input w-full"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" aclassName="text-sm font-medium text-slate-300 block mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input w-full"
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-teal w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-slate-800 px-2 text-slate-400">OR</span>
            </div>
          </div>

          <div>
            <GoogleLoginButton />
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-teal-400 hover:text-teal-300 hover:underline">
                    Sign up
                </Link>
            </p>
            <p className="mt-2 text-slate-400">
                <Link to="/forgot-password" className="text-xs hover:underline">
                    Forgot your password?
                </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}