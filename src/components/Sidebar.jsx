import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ active, isOpen, setIsOpen }) {
    const { user, logout } = useAuth();
    
    const getSidebarItems = (role) => {
        const commonItems = [
            { name: "Dashboard", icon: "📊", path: `/${role}` },
        ];

        if (role === 'admin') {
            return [
                ...commonItems,
                { name: "Buses", icon: "🚌", path: "/buses" },
                { name: "Drivers", icon: "🧑‍✈️", path: "/drivers" },
                { name: "Routes", icon: "🗺️", path: "/routes" },
                { name: "Trips", icon: "📍", path: "/trips" },
                { name: "Schedule", icon: "🗓️", path: "/schedule" },
                { name: "Analytics", icon: "📈", path: "/analytics" },
                { name: "Settings", icon: "⚙️", path: "/settings" },
            ];
        } else if (role === 'driver') {
            return [
                ...commonItems,
                { name: "My Route", icon: "🗺️", path: "/my-route" },
                { name: "Schedule", icon: "🗓️", path: "/schedule" },
                { name: "Vehicle Status", icon: "🚌", path: "/vehicle" },
                { name: "Notifications", icon: "🔔", path: "/notifications" },
            ];
        } else {
            return [
                ...commonItems,
                { name: "Find Bus", icon: "🔍", path: "/find-bus" },
                { name: "My Tickets", icon: "🎫", path: "/tickets" },
                { name: "Route Planner", icon: "🗺️", path: "/planner" },
                { name: "Notifications", icon: "🔔", path: "/notifications" },
            ];
        }
    };

    const sidebarItems = getSidebarItems(user?.role || 'passenger');

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-800/80 backdrop-blur-xl text-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 text-2xl font-bold border-b border-gray-700/50">Delhi Humsafar</div>
                <nav className="flex-1 p-4">
                    {sidebarItems.map(item => (
                        <Link key={item.name} to={item.path} className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-all duration-200 ${item.name === active ? 'bg-teal-500/30 text-teal-300' : 'hover:bg-gray-700/50'}`}>
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-700/50">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                            <span className="font-semibold text-sm">
                                {user?.role?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="text-sm">
                            <div className="font-semibold capitalize">{user?.role || 'User'}</div>
                            <div className="text-xs text-gray-400">ID: {user?.id?.slice(-4) || 'N/A'}</div>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 w-full"
                    >
                        <span className="text-xl">➡️</span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}