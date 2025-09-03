import React from 'react';
import Sidebar from '../components/Sidebar';
import Map from '../components/Map';

export default function PassengerDashboard() {
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
    
    const availableBuses = [
        { id: 1, route: "Downtown - Airport", rating: 4.8, time: "08:30 AM - 10:00 AM", duration: "1h 30m", seats: 15, totalSeats: 40, price: "$12.50", amenities: ["WIFI", "AC", "USB Charging"], status: "available" },
        { id: 2, route: "Downtown - Mall", rating: 4.5, time: "09:00 AM - 10:30 AM", duration: "1h 30m", seats: 20, totalSeats: 40, price: "$9.25", amenities: ["WIFI", "AC"], status: "available" }
    ];

    // Dummy bus data for the map with location coordinates.
    const allBuses = [
        { id: 'BUS-001', name: 'Bus 001', status: 'Active', route: 'Downtown - Airport', location: [28.7041, 77.1025] },
        { id: 'BUS-002', name: 'Bus 002', status: 'Active', route: 'Mall - University', location: [28.65, 77.2] },
        { id: 'BUS-003', name: 'Bus 003', status: 'Scheduled', route: 'Station - Hospital', location: [28.55, 77.15] },
    ];
    
    // Dummy data for the "on-board" tracking map.
    const myBus = [
        { id: 'BUS-001', name: 'My Bus', status: 'On-board', route: 'Downtown - Airport', location: [28.7041, 77.1025] }
    ];

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar active="Dashboard" />
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Passenger Dashboard</h1>
                        <p className="text-gray-500">Find and book your next journey</p>
                    </div>
                    <button className="px-6 py-2 rounded-md font-medium text-sm text-white bg-teal-600 hover:bg-teal-700 transition duration-200">
                        My Tickets
                    </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* First map for all buses */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full h-[500px]">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Track All Buses</h3>
                        <div className="w-full h-[400px]">
                           <Map buses={allBuses} stops={busStops} />
                        </div>
                    </div>
                    {/* Second map for my bus */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full h-[500px]">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">My Bus</h3>
                        <div className="w-full h-[400px]">
                           <Map buses={myBus} stops={busStops} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Find Your Bus</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input type="text" placeholder="Enter departure location" className="p-3 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none" />
                        <input type="text" placeholder="Enter destination" className="p-3 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none" />
                        <input type="text" placeholder="mm/dd/yyyy" className="p-3 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none" />
                        <button className="flex justify-center items-center py-2 px-4 rounded-md font-semibold text-white bg-teal-600 hover:bg-teal-700 transition duration-200">
                            Search Buses
                        </button>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Buses</h3>
                    <div className="space-y-4">
                        {availableBuses.map(bus => (
                            <div key={bus.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200 flex justify-between items-center">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <div className="text-lg font-semibold">{bus.route}</div>
                                        <div className="flex items-center text-yellow-500 text-sm">⭐{bus.rating}</div>
                                    </div>
                                    <div className="text-sm text-gray-600">{bus.time}</div>
                                    <div className="text-xs text-gray-400">{bus.duration}</div>
                                    <div className="text-xs text-gray-500 mt-2">{bus.seats} seats available of {bus.totalSeats} total</div>
                                </div>
                                <div className="flex-shrink-0 text-right">
                                    <div className="font-bold text-lg text-gray-800">{bus.price}</div>
                                    <div className="text-xs text-gray-500">per person</div>
                                    <div className="flex mt-2 space-x-1">
                                        {bus.amenities.map(amenity => (
                                            <span key={amenity} className="px-2 py-1 rounded-full bg-teal-600 text-white text-xs font-semibold">{amenity}</span>
                                        ))}
                                    </div>
                                    <button className="mt-2 px-4 py-2 rounded-md font-semibold text-sm text-white bg-teal-600 hover:bg-teal-700 transition duration-200">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
