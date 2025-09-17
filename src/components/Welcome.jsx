import React from 'react';
import { Link } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 text-gray-800">
            <div className="text-center p-8">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">Bus Management System</h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto">
                    Streamline your transportation operations with our comprehensive management platform
                </p>
                <div className="mt-12 space-y-4 md:space-y-0 md:space-x-4">
                    <Link to="/login" className="w-64 py-3 px-6 rounded-md font-semibold text-lg text-white bg-teal-600 hover:bg-teal-700 transition duration-200 shadow-md inline-block text-center">
                        Get Started
                    </Link>
                </div>
                <div className="flex justify-center mt-6 space-x-4">
                    <Link to="/register" className="w-32 py-2 px-4 rounded-md font-semibold text-md border border-teal-600 text-teal-600 hover:bg-teal-50 transition duration-200 inline-block text-center">
                        Sign Up
                    </Link>
                    <Link to="/login" className="w-32 py-2 px-4 rounded-md font-semibold text-md text-white bg-teal-600 hover:bg-teal-700 transition duration-200 inline-block text-center">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
