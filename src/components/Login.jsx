// import React, { useState } from 'react';
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from '../contexts/AuthContext';
// import { useNotification } from '../contexts/NotificationContext';
// import backgroundImageVideo from '../assets/videos/final animation.mp4';

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const { login } = useAuth();
//   const { showSuccess, showError } = useNotification();
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const result = await login(email, password);
//       if (result.success) {
//         showSuccess('Login successful!');
//         // Redirect based on user role
//         const user = JSON.parse(localStorage.getItem('user'));
//         const roleRoutes = {
//           admin: '/admin',
//           driver: '/driver',
//           passenger: '/passenger'
//         };
//         navigate(roleRoutes[user.role] || '/admin');
//       } else {
//         setError(result.error);
//         showError(result.error);
//       }
//     } catch (err) {
//       const errorMessage = 'An unexpected error occurred';
//       setError(errorMessage);
//       showError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 md:grid md:grid-cols-2 lg:grid-cols-[1.5fr_1fr] md:p-0">

//       {/* This section is the animated background for larger screens. It is hidden on mobile. */}
//       <div className="relative hidden md:flex items-center justify-center p-8 overflow-hidden">
//         <video
//           autoPlay
//           loop
//           muted
//           className="absolute inset-0 w-full h-full object-cover"
//         >
//           {/* The video will play once because the 'loop' attribute is removed */}
//           <source src={backgroundImageVideo} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//         <div className="relative text-white p-6 bg-black/50 rounded-xl text-center z-10">
//             <h1 className="text-5xl font-bold mb-4">Dellhi humsafar</h1>
//             <p className="max-w-md text-lg">
//                Make me your humraahi
//             </p>
//         </div>
//       </div>

//       {/* This section contains the actual login form. */}
//       <div className="flex items-center justify-center w-full p-4 md:p-8">
//         <div className="bg-white dark:bg-gray-700 p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-sm">
//           <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">Welcome Back</h2>
//           <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
//             Sign in to your Bus Management account
//           </p>

//           <form onSubmit={handleLogin} className="space-y-6">
//             {error && (
//               <div className="p-3 rounded-md bg-red-100 text-red-800 text-sm">
//                 {error}
//               </div>
//             )}
            
//             <div>
//               <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
//               />
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <div className="flex items-center">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     Signing In...
//                   </div>
//                 ) : (
//                   'Sign In'
//                 )}
//               </button>
//             </div>
//           </form>

//           <div className="flex justify-between mt-6 text-sm text-gray-600 dark:text-gray-400">
//             <Link to="/forgot-password" className="font-medium text-teal-600 hover:text-teal-500 hover:underline">
//               Forgot your password?
//             </Link>
//             <Link to="/register" className="font-medium text-teal-600 hover:text-teal-500 hover:underline">
//               Sign up
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






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
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
        setError(result.error);
        showError(result.error);
      }
    } catch (err)
 {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
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
          <h1 className="text-5xl font-bold mb-4">Delhi Humsafar</h1>
          <p className="max-w-md text-lg">Make me your humraahi</p>
        </div>
      </div>

  
      <div className="flex items-center justify-center w-full p-4 md:p-8">
        <div className="glass-card p-8 md:p-10 w-full max-w-sm">
          <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
          <p className="text-center text-gray-300 mb-6 text-sm">
            Sign in to your Bus Management account
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 rounded-md bg-red-500/30 border border-red-500 text-red-200 text-sm">{error}</div>
            )}

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

            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-teal-500 sm:text-sm form-input"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <GoogleLoginButton />
          </div>

          <div className="flex justify-between mt-6 text-sm text-gray-300">
            <Link to="/forgot-password" className="font-medium text-teal-400 hover:text-teal-300 hover:underline transition duration-300">
              Forgot your password?
            </Link>
            <Link to="/register" className="font-medium text-teal-400 hover:text-teal-300 hover:underline transition duration-300">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}