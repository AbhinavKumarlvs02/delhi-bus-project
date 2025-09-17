import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBE6eEetL1zO64mYNJQhMqtIOLWFJod7Uk",
  authDomain: "bustracking-a2534.firebaseapp.com",
  projectId: "bustracking-a2534",
  storageBucket: "bustracking-a2534.firebasestorage.app",
  messagingSenderId: "207381470425",
  appId: "1:207381470425:web:b76177c06b368f3e35f2c8",
  measurementId: "G-TW4E974TDG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
