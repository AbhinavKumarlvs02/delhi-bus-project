// frontend/src/components/GoogleLoginButton.js
// frontend/src/components/GoogleLoginButton.jsx
// src/components/GoogleLoginButton.jsx
// import React from "react";
// import { auth, provider, signInWithPopup } from "../firebase";

// const GoogleLoginButton = () => {
//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       console.log("Google user:", user);
//       // You can send user data or token to your backend
//     } catch (error) {
//       console.error("Google login error:", error);
//     }
//   };

//   return (
//     <button
//       onClick={handleGoogleLogin}
//       className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
//     >
//       Continue with Google
//     </button>
//   );
// };

// export default GoogleLoginButton;

// src/components/GoogleLoginButton.jsx
import React from "react";
import { auth, provider, signInWithPopup } from "../firebase";
import { useNotification } from "../contexts/NotificationContext";

const GoogleLoginButton = () => {
  const { showSuccess, showError } = useNotification();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Example: store user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ email: user.email, role: "passenger" }) // default role
      );

      showSuccess(`Logged in as ${user.displayName}`);
      window.location.href = "/passenger"; // redirect based on role
    } catch (error) {
      console.error("Google login error:", error);
      showError("Google login failed");
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 mt-4"
    >
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
