import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ active }) {
    const sidebarItems = [
        { name: "Dashboard", icon: "📊", path: "/admin" },
        { name: "Buses", icon: "🚌", path: "/buses" },
        { name: "Drivers", icon: "🧑‍✈️", path: "/drivers" },
        { name: "Routes", icon: "🗺️", path: "/routes" },
        { name: "Trips", icon: "📍", path: "/trips" },
        { name: "Schedule", icon: "🗓️", path: "/schedule" },
        { name: "Analytics", icon: "📈", path: "/analytics" },
        { name: "Settings", icon: "⚙️", path: "/settings" },
    ];
    return (
        <div className="w-64 bg-teal-700 text-white flex flex-col h-screen">
            <div className="p-4 text-2xl font-bold border-b border-teal-500/20">BusManager</div>
            <nav className="flex-1 p-4">
                {sidebarItems.map(item => (
                    <Link key={item.name} to={item.path} className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors duration-200 ${item.name === active ? 'bg-teal-600' : 'hover:bg-teal-600'}`}>
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-teal-500/20">
                <div className="flex items-center space-x-3 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                    <div className="text-sm">
                        <div className="font-semibold">Admin User</div>
                        <div className="text-xs text-gray-300">admin@busmanager.com</div>
                    </div>
                </div>
                <Link to="/" className="flex items-center space-x-2 mt-4 text-sm text-gray-200 hover:text-white transition-colors duration-200">
                    <span className="text-xl">➡️</span>
                    <span>Sign Out</span>
                </Link>
            </div>
        </div>
    );
}
