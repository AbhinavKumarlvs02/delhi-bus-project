import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ active }) {
    const { user, logout } = useAuth();
    
    // Define sidebar items based on user role
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
        <div className="w-64 bg-teal-700 text-white flex flex-col h-screen">
            <div className="p-4 text-2xl font-bold border-b border-teal-500/20">Delhi Humsafar</div>
            <nav className="flex-1 p-4">
                {sidebarItems.map(item => (
                    <Link key={item.name} to={item.path} className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors duration-200 ${item.name === active ? 'bg-teal-600' : 'hover:bg-teal-600'}`}>
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-teal-500/20">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-semibold text-sm">
                            {user?.role?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="text-sm">
                        <div className="font-semibold capitalize">{user?.role || 'User'}</div>
                        <div className="text-xs text-gray-300">ID: {user?.id?.slice(-4) || 'N/A'}</div>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-sm text-gray-200 hover:text-white transition-colors duration-200 w-full"
                >
                    <span className="text-xl">➡️</span>
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}
