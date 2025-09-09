import React from 'react';
import Sidebar from '../components/Sidebar';
import Map from '../components/Map';

export default function AdminDashboard() {
    // Fixed bus stops with names and coordinates for Ludhiana
    const busStops = [
        { id: 'stop-1', name: 'Ludhiana Junction Stop', location: [30.8974, 75.8569] },
        { id: 'stop-2', name: 'Feroz Gandhi Market Stop', location: [30.8872, 75.8458] },
        { id: 'stop-3', name: 'Sarabha Nagar Market Stop', location: [30.8808, 75.8078] },
        { id: 'stop-4', name: 'Rose Garden Stop', location: [30.8937, 75.8294] },
        { id: 'stop-5', name: 'Punjab Agricultural University Stop', location: [30.8988, 75.8091] },
        { id: 'stop-6', name: 'Pavilion Mall Stop', location: [30.8992, 75.8488] },
        { id: 'stop-7', name: 'Guru Nanak Stadium Stop', location: [30.9048, 75.8647] },
        { id: 'stop-8', name: 'Ghanta Ghar Stop', location: [30.9038, 75.8443] },
        { id: 'stop-9', name: 'Mini Secretariat Stop', location: [30.9168, 75.8485] },
        { id: 'stop-10', name: 'Model Town Market Stop', location: [30.8711, 75.8236] },
    ];
    
    // Define the Red Line routes with a common transfer point
    const redLine = {
        forward: [
            busStops[0].location, // Ludhiana Junction
            busStops[5].location, // Pavilion Mall
            busStops[1].location, // Feroz Gandhi Market
            busStops[9].location, // Model Town Market
            busStops[2].location, // Sarabha Nagar Market
            busStops[7].location, // Ghanta Ghar Stop (Common transfer point)
        ],
        reverse: [
            busStops[7].location, // Ghanta Ghar Stop
            busStops[2].location, // Sarabha Nagar Market
            busStops[9].location, // Model Town Market
            busStops[1].location, // Feroz Gandhi Market
            busStops[5].location, // Pavilion Mall
            busStops[0].location, // Ludhiana Junction
        ]
    };

    // Define the Blue Line routes with a common transfer point
    const blueLine = {
        forward: [
            busStops[7].location, // Ghanta Ghar Stop (Common transfer point)
            busStops[8].location, // Mini Secretariat
            busStops[6].location, // Guru Nanak Stadium
            busStops[3].location, // Rose Garden
            busStops[4].location, // Punjab Agricultural University
        ],
        reverse: [
            busStops[4].location, // Punjab Agricultural University
            busStops[3].location, // Rose Garden
            busStops[6].location, // Guru Nanak Stadium
            busStops[8].location, // Mini Secretariat
            busStops[7].location, // Ghanta Ghar Stop
        ]
    };

    // Define bus data and assign them to specific routes
    const buses = [
        { id: 'BUS-001', name: 'Bus 1', status: 'Active', routeName: 'Red Line', location: redLine.forward[0] },
        { id: 'BUS-002', name: 'Bus 2', status: 'Active', routeName: 'Blue Line', location: blueLine.forward[0] },
        { id: 'BUS-003', name: 'Bus 3', status: 'Scheduled', routeName: 'Red Line', location: redLine.forward[0] },
    ];
    
    // Dashboard stats
    const stats = [
        { title: "Total Buses", value: "3", change: "+2 this month", icon: "🚌" },
        { title: "Active Drivers", value: "3", change: "+1 this week", icon: "🧑‍✈️" },
        { title: "Registered Passengers", value: "1,247", change: "+89 this month", icon: "👥" },
        { title: "Active Trips", value: "2", change: "Currently running", icon: "📍" }
    ];

    const allSchedules = [
        { trip: 'Red Line (Forward)', time: '7:30 AM', route: 'Ludhiana Junction → Ghanta Ghar', status: 'Active', bus: 'Bus 1' },
        { trip: 'Blue Line (Forward)', time: '8:45 AM', route: 'Ghanta Ghar → Punjab Agri Uni', status: 'Active', bus: 'Bus 2' },
        { trip: 'Red Line (Reverse)', time: '10:00 AM', route: 'Ghanta Ghar → Ludhiana Junction', status: 'Scheduled', bus: 'Bus 3' },
        { trip: 'Blue Line (Reverse)', time: '12:00 PM', route: 'Punjab Agri Uni → Ghanta Ghar', status: 'Scheduled', bus: 'Bus 1' },
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
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Live Bus Locations</h3>
                    <div className="w-full h-[500px]">
                      <Map 
                        buses={buses} 
                        stops={busStops} 
                        redLine={redLine}
                        blueLine={blueLine}
                      />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Bus Schedule</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allSchedules.map((schedule, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.trip}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.route}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.bus}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${schedule.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {schedule.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}