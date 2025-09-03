import React from 'react';
import Sidebar from '../components/Sidebar';
import Map from '../components/Map';

export default function DriverDashboard() {
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
    
    const currentTrip = { route: "Downtown - Airport", time: "08:00 AM - 06:00 PM", current: "Central Station", next: "Business District", passengers: 15, totalPassengers: 40 };
    const schedule = [
        { time: "08:00 AM", status: "active", route: "Downtown - Airport", stops: 12 },
        { time: "11:00 AM", status: "upcoming", route: "Airport - Mall", stops: 8 },
        { time: "02:00 PM", status: "upcoming", route: "Mall - University", stops: 15 },
        { time: "06:00 PM", status: "upcoming", route: "University - Downtown", stops: 10 }
    ];
    const notifications = [
        { type: "alert", text: "Route Change Alert: Construction on Main St. Use alternate route via Oak Avenue.", time: "10 minutes ago" },
        { type: "update", text: "Passenger Update: High passenger volume expected at University stop today.", time: "1 hour ago" },
        { type: "completed", text: "Trip Completed: Morning route completed successfully. Great job!", time: "2 hours ago" }
    ];
    const vehicleStatus = { fuel: 75, mileage: "45,230 km", lastMaintenance: "Dec 15, 2024", nextMaintenance: "Jan 15, 2025" };

    // This is the specific route for the driver to display on the map.
    const driverRoute = [
        [28.7041, 77.1025],
        [28.65, 77.2],
        [28.6129, 77.2295],
        [28.6322, 77.2196],
        [28.5933, 77.2507]
    ];
    // Dummy bus data for the map with location coordinates.
    const driverBus = [
        { id: 'BUS-001', name: 'Bus 001', status: 'Active', route: 'Downtown - Airport', location: [28.6129, 77.2295] }
    ];

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar active="Dashboard" />
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Driver Dashboard</h1>
                        <p className="text-gray-500">Welcome back, John Smith</p>
                    </div>
                    <button className="px-6 py-2 rounded-md font-medium text-sm text-white bg-teal-600 hover:bg-teal-700 transition duration-200">
                        Start Trip
                    </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Map section for the driver */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full h-[500px]">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Assigned Route</h3>
                        <div className="w-full h-[400px]">
                           <Map buses={driverBus} route={driverRoute} stops={busStops} />
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Trip</h3>
                        <div className="space-y-4 text-gray-600">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-medium">Route</div>
                                    <div className="font-semibold text-gray-800">{currentTrip.route}</div>
                                    <div className="text-xs text-gray-500">{currentTrip.time}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium">Passengers</div>
                                    <div className="font-semibold text-gray-800">{currentTrip.passengers}/{currentTrip.totalPassengers}</div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-medium">Current Location</div>
                                    <div className="font-semibold text-gray-800">{currentTrip.current}</div>
                                    <div className="text-xs text-gray-500">Next: {currentTrip.next}</div>
                                </div>
                                <div className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-semibold">In Progress</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Today's Schedule</h3>
                        <div className="space-y-4">
                            {schedule.map(trip => (
                                <div key={trip.time} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="flex space-x-4 items-center">
                                        <div className="text-xl">{trip.time}</div>
                                        <div className="flex flex-col">
                                            <div className="font-semibold text-gray-800">{trip.route}</div>
                                            <div className="text-xs text-gray-500">{trip.stops} stops</div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${trip.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{trip.status}</div>
                                        <button className="text-sm text-teal-600 hover:underline">View Route</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h3>
                        <div className="space-y-4">
                            {notifications.map((notif, index) => (
                                <div key={index} className="p-4 rounded-lg bg-gray-50">
                                    <div className="flex space-x-2 items-center">
                                        <div className="text-lg">{notif.type === 'alert' ? '🔔' : notif.type === 'update' ? '📣' : '✅'}</div>
                                        <div className="text-sm font-medium text-gray-800">{notif.text}</div>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">{notif.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
