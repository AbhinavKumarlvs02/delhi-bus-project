import React from 'react';
import Sidebar from '../components/Sidebar';
import Map from '../components/Map'; // Import the new Map component

export default function AdminDashboard() {
    // Fixed bus stops with names and coordinates
    const busStops = [
        { id: 'stop-1', name: 'India Gate Stop', location: [28.6129, 77.2295] },
        { id: 'stop-2', name: 'Connaught Place Stop', location: [28.6322, 77.2196] },
        { id: 'stop-3', name: 'Qutub Minar Stop', location: [28.5244, 77.1855] },
        { id: 'stop-4', name: 'Akshardham Temple Stop', location: [28.6127, 77.2773] },
        { id: 'stop-5', name: 'Red Fort Stop', location: [28.6562, 77.2410] },
        { id: 'stop-6', name: 'Humayun\'s Tomb Stop', location: [28.5933, 77.2507] },
        { id: 'stop-7', name: 'Lotus Temple Stop', location: [28.5535, 77.2588] },
        { id: 'stop-8', name: 'Chandni Chowk Stop', location: [28.6588, 77.2291] },
        { id: 'stop-9', name: 'Delhi Airport Stop', location: [28.5562, 77.1009] },
        { id: 'stop-10', name: 'Hauz Khas Village Stop', location: [28.5534, 77.1932] },
    ];
    
    // Dummy data for the dashboard cards
    const stats = [
        { title: "Total Buses", value: "24", change: "+2 this month", icon: "🚌" },
        { title: "Active Drivers", value: "18", change: "+1 this week", icon: "🧑‍✈️" },
        { title: "Registered Passengers", value: "1,247", change: "+89 this month", icon: "👥" },
        { title: "Active Trips", value: "12", change: "Currently running", icon: "📍" }
    ];
    
    // Dummy bus data for the map with location coordinates
    const buses = [
      { id: 'BUS-001', name: 'Bus 001', status: 'Active', route: 'Downtown - Airport', location: [28.7041, 77.1025] },
      { id: 'BUS-002', name: 'Bus 002', status: 'Active', route: 'Mall - University', location: [28.65, 77.2] },
      { id: 'BUS-003', name: 'Bus 003', status: 'Scheduled', route: 'Station - Hospital', location: [28.55, 77.15] },
    ];
    
    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar active="Dashboard" />
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                        <p className="text-gray-500">Monitor and manage your bus operations</p>
                    </div>
                    <button className="px-6 py-2 rounded-md font-medium text-sm text-white bg-teal-600 hover:bg-teal-700 transition duration-200">
                        Generate Report
                    </button>
                </div>
                
                {/* Dashboard stats section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map(stat => (
                        <div key={stat.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                                <span className="text-xl">{stat.icon}</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                            <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                        </div>
                    ))}
                </div>
                
                {/* Main map section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Live Bus Locations</h3>
                    <div className="w-full h-[500px]">
                      <Map buses={buses} stops={busStops} />
                    </div>
                </div>
            </div>
        </div>
    );
}