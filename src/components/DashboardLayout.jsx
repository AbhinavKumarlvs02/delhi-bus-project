import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children, activePage }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="relative min-h-screen md:flex bg-gray-100">
            {/* Overlay for mobile view, appears when sidebar is open to cover the map */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Container */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-teal-700 text-white flex flex-col z-50 transition-transform duration-300 ease-in-out 
                           ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                           md:relative md:translate-x-0 md:flex-shrink-0`}
            >
                <Sidebar active={activePage} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col w-full overflow-x-hidden">
                {/* Mobile Header with Menu Button and Title */}
                <header className="md:hidden bg-white shadow-sm p-4 flex items-center sticky top-0 z-30">
                    <button
                        className="p-1.5 rounded-md bg-teal-600 text-white"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    <h1 className="ml-4 text-xl font-bold text-gray-800">Ludhiyana Humsafar</h1>
                </header>

                {/* Page Content passed via children prop */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
