import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Map from '../components/Map';
import { dataService } from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';

export default function DriverDashboard() {
    const { user } = useAuth();
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Default bus stops for Ludhiana (fallback data)
    const defaultBusStops = [
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

    useEffect(() => {
        loadDriverData();
    }, []);

    const loadDriverData = async () => {
        try {
            setLoading(true);
            
            // Fetch buses and routes from backend
            const [busesData, routesData] = await Promise.all([
                dataService.getBuses(),
                dataService.getRoutes()
            ]);

            const transformedBuses = dataService.transformBusData(busesData);
            const transformedRoutes = dataService.transformRouteData(routesData);

            // Filter buses for this driver (in real app, this would be based on driver assignment)
            const driverBus = transformedBuses.length > 0 ? [transformedBuses[0]] : [];

            setBuses(driverBus);
            setRoutes(transformedRoutes);
        } catch (err) {
            console.error('Error loading driver data:', err);
            // Fallback to sample data
            setBuses([{ id: 'BUS-001', name: 'Bus 001', status: 'Active', route: 'Junction to Rose Garden', location: [30.8974, 75.8569] }]);
            setRoutes([]);
        } finally {
            setLoading(false);
        }
    };

    // Get current trip data from backend or use defaults
    const currentTrip = buses.length > 0 ? {
        route: buses[0].routeName || "Junction to Rose Garden",
        time: "08:00 AM - 06:00 PM",
        current: "Ludhiana Junction",
        next: "Feroz Gandhi Market",
        passengers: 15,
        totalPassengers: buses[0].capacity || 40
    } : {
        route: "No Route Assigned",
        time: "08:00 AM - 06:00 PM",
        current: "Depot",
        next: "Waiting for assignment",
        passengers: 0,
        totalPassengers: 40
    };

    // Generate schedule from backend data
    const schedule = buses.map((bus, index) => ({
        time: `${8 + index * 3}:00 AM`,
        status: index === 0 ? "active" : "upcoming",
        route: bus.routeName || "Route Assignment",
        stops: routes.length > 0 ? routes[0]?.stops?.length || 12 : 12
    }));

    const notifications = [
        { type: "alert", text: "Route Change Alert: Construction near Rose Garden. Use an alternate route.", time: "10 minutes ago" },
        { type: "update", text: "Passenger Update: High passenger volume expected at Feroz Gandhi Market.", time: "1 hour ago" },
        { type: "completed", text: "Trip Completed: Morning route completed successfully. Great job!", time: "2 hours ago" }
    ];

    const vehicleStatus = { fuel: 75, mileage: "45,230 km", lastMaintenance: "Dec 15, 2024", nextMaintenance: "Jan 15, 2025" };

    // Get driver route from backend data or use defaults
    const driverRoute = routes.length > 0 && routes[0]?.stops 
        ? routes[0].stops.map(stop => stop.location)
        : [
            [30.8974, 75.8569],
            [30.8992, 75.8488],
            [30.8937, 75.8294],
            [30.8808, 75.8078],
        ];

    const allStops = routes.length > 0 
        ? routes.flatMap(route => route.stops)
        : defaultBusStops;

    if (loading) {
        return (
            <div className="flex bg-gray-100 min-h-screen">
                <Sidebar active="Dashboard" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading driver data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar active="Dashboard" />
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Driver Dashboard</h1>
                        <p className="text-gray-500">Welcome back, {user?.role || 'Driver'}</p>
                    </div>
                    <div className="flex space-x-2">
                        <button 
                            onClick={loadDriverData}
                            className="px-4 py-2 rounded-md font-medium text-sm text-teal-600 bg-teal-50 hover:bg-teal-100 transition duration-200"
                        >
                            Refresh
                        </button>
                        <button className="px-6 py-2 rounded-md font-medium text-sm text-white bg-teal-600 hover:bg-teal-700 transition duration-200">
                            Start Trip
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full h-[500px]">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Assigned Route</h3>
                        <div className="w-full h-[400px]">
                           <Map buses={buses} route={driverRoute} stops={allStops} />
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
