import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Map from '../components/Map';
import { dataService } from '../services/dataService';

export default function AdminDashboard() {
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Try to fetch real data from backend
            const [busesData, routesData] = await Promise.all([
                dataService.getBuses(),
                dataService.getRoutes()
            ]);

            const transformedBuses = dataService.transformBusData(busesData);
            const transformedRoutes = dataService.transformRouteData(routesData);

            setBuses(transformedBuses);
            setRoutes(transformedRoutes);
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Failed to load data from server. Using sample data.');
            
            // Fallback to sample data
            setBuses([
                { id: 'BUS-001', name: 'Bus 1', status: 'Active', routeName: 'Red Line', location: [30.8974, 75.8569] },
                { id: 'BUS-002', name: 'Bus 2', status: 'Active', routeName: 'Blue Line', location: [30.8872, 75.8458] },
                { id: 'BUS-003', name: 'Bus 3', status: 'Scheduled', routeName: 'Red Line', location: [30.8808, 75.8078] },
            ]);
            setRoutes([]);
        } finally {
            setLoading(false);
        }
    };
    
    // Create route lines from route data or use defaults
    const getRouteLines = () => {
        if (routes.length === 0) {
            // Default routes if no data from backend
            return {
                redLine: {
                    forward: [
                        defaultBusStops[0], // Ludhiana Junction
                        defaultBusStops[5], // Pavilion Mall
                        defaultBusStops[1], // Feroz Gandhi Market
                        defaultBusStops[9], // Model Town Market
                        defaultBusStops[2], // Sarabha Nagar Market
                        defaultBusStops[7], // Ghanta Ghar Stop
                    ],
                    reverse: [
                        defaultBusStops[7], // Ghanta Ghar Stop
                        defaultBusStops[2], // Sarabha Nagar Market
                        defaultBusStops[9], // Model Town Market
                        defaultBusStops[1], // Feroz Gandhi Market
                        defaultBusStops[5], // Pavilion Mall
                        defaultBusStops[0], // Ludhiana Junction
                    ]
                },
                blueLine: {
                    forward: [
                        defaultBusStops[7], // Ghanta Ghar Stop
                        defaultBusStops[8], // Mini Secretariat
                        defaultBusStops[6], // Guru Nanak Stadium
                        defaultBusStops[3], // Rose Garden
                        defaultBusStops[4], // Punjab Agricultural University
                    ],
                    reverse: [
                        defaultBusStops[4], // Punjab Agricultural University
                        defaultBusStops[3], // Rose Garden
                        defaultBusStops[6], // Guru Nanak Stadium
                        defaultBusStops[8], // Mini Secretariat
                        defaultBusStops[7], // Ghanta Ghar Stop
                    ]
                }
            };
        }

        // Create route lines from actual route data
        const routeLines = {};
        routes.forEach((route, index) => {
            const routeName = index === 0 ? 'redLine' : 'blueLine';
            routeLines[routeName] = {
                forward: route.stops,
                reverse: [...route.stops].reverse()
            };
        });

        return routeLines;
    };

    const routeLines = getRouteLines();
    const allStops = routes.length > 0 
        ? routes.flatMap(route => route.stops)
        : defaultBusStops;
    
    // Calculate dashboard stats from real data
    const stats = [
        { 
            title: "Total Buses", 
            value: buses.length.toString(), 
            change: `${buses.filter(b => b.status === 'Active').length} active`, 
            icon: "🚌" 
        },
        { 
            title: "Total Routes", 
            value: routes.length.toString(), 
            change: `${routes.length} configured`, 
            icon: "🗺️" 
        },
        { 
            title: "Total Capacity", 
            value: buses.reduce((sum, bus) => sum + (bus.capacity || 40), 0).toString(), 
            change: "Available seats", 
            icon: "👥" 
        },
        { 
            title: "Active Trips", 
            value: buses.filter(b => b.status === 'Active').length.toString(), 
            change: "Currently running", 
            icon: "📍" 
        }
    ];

    // Generate schedule from bus and route data
    const allSchedules = buses.map((bus, index) => ({
        trip: `${bus.routeName || 'Route'} Trip`,
        time: `${8 + index}:00 AM`,
        route: `${bus.routeName || 'Route'} - ${bus.status}`,
        status: bus.status,
        bus: bus.name
    }));

    if (loading) {
        return (
            <div className="flex bg-gray-100 min-h-screen">
                <Sidebar active="Dashboard" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading dashboard data...</p>
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
                        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                        <p className="text-gray-500">Monitor and manage your bus operations</p>
                        {error && (
                            <p className="text-sm text-orange-600 mt-1">{error}</p>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        <button 
                            onClick={loadData}
                            className="px-4 py-2 rounded-md font-medium text-sm text-teal-600 bg-teal-50 hover:bg-teal-100 transition duration-200"
                        >
                            Refresh Data
                        </button>
                        <button className="px-6 py-2 rounded-md font-medium text-sm text-white bg-teal-600 hover:bg-teal-700 transition duration-200">
                            Generate Report
                        </button>
                    </div>
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
                        stops={allStops} 
                        redLine={routeLines.redLine}
                        blueLine={routeLines.blueLine}
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