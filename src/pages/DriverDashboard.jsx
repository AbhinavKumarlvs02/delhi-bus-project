import React, { useState, useEffect , useRef} from 'react';
import { sendLocation } from '../services/locationAPI';
import Sidebar from '../components/Sidebar';
import Map from '../components/Map';
import { dataService } from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';

export default function DriverDashboard() {
    const { user } = useAuth();
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [running, setRunning] = useState(false);
    const watchIdRef = useRef(null);
    const lastSentRef = useRef(0);

    const driverBus = buses?.[0] ?? null;
    const busNumber =
    driverBus?.busNumber || driverBus?.name || "BUS12";

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

    const pushLocation = async ({ lat, lon, speed }) => {
        try {
        await sendLocation({ busNumber, lat, lon, speed: Math.max(0, Math.round((speed || 0) * 3.6)) });
        } catch (e) {
        console.error("sendLocation error:", e);
        }
    };

    const startTrip = () => {
        if (running) return;
        setRunning(true);
        watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
            const now = Date.now();
            if (now - lastSentRef.current < 15000) return; // throttle 15s
            lastSentRef.current = now;
            const { latitude, longitude, speed } = pos.coords;
            pushLocation({ lat: latitude, lon: longitude, speed });
        },
        (err) => console.error("geo error", err),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );
    };

    const stopTrip = () => {
        setRunning(false);
        if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };


    useEffect(() => {
        loadDriverData();
    }, []);

    const loadDriverData = async () => {
        try {
            setLoading(true);
            const [busesData, routesData] = await Promise.all([
                dataService.getBuses(),
                dataService.getRoutes()
            ]);
            const transformedBuses = dataService.transformBusData(busesData);
            const transformedRoutes = dataService.transformRouteData(routesData);
            const driverBus = transformedBuses.length > 0 ? [transformedBuses[0]] : [];
            setBuses(driverBus);
            setRoutes(transformedRoutes);
        } catch (err) {
            console.error('Error loading driver data:', err);
            setBuses([{ id: 'BUS-001', name: 'Bus 001', status: 'Active', route: 'Junction to Rose Garden', location: [30.8974, 75.8569] }]);
            setRoutes([]);
        } finally {
            setLoading(false);
        }
    };

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

    const driverRoute = routes.length > 0 && routes[0]?.stops 
        ? routes[0].stops.map(stop => stop.location)
        : [[30.8974, 75.8569], [30.8992, 75.8488], [30.8937, 75.8294], [30.8808, 75.8078]];

    const allStops = routes.length > 0 ? routes.flatMap(route => route.stops) : defaultBusStops;

    if (loading) {
        return (
            <div className="flex bg-gray-900 text-white min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
                    <p>Loading driver data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            <Sidebar active="Dashboard" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="lg:hidden p-4 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 flex items-center space-x-4">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <h1 className="text-xl font-bold">Driver Dashboard</h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
                    <div className="hidden lg:flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">Driver Dashboard</h1>
                            <p className="text-gray-400">Welcome back, {user?.role || 'Driver'}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={loadDriverData} className="btn btn-secondary">
                                Refresh
                            </button>
                            <button onClick={startTrip} className="btn btn-teal">
                                Start Trip
                            </button>
                            <button onClick={stopTrip} className="btn btn-secondary" disabled={!running}>
                                Stop
                            </button>
                        </div>
                         <div className="glass-card mt-6">
                            <h3 className="text-xl font-semibold mb-2">Your Assigned Route</h3>
                            <Map buses={buses} stops={allStops} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="glass-card w-full h-[500px]">
                            <h3 className="text-xl font-semibold mb-4">Your Assigned Route</h3>
                            <div className="w-full h-[400px] rounded-lg overflow-hidden">
                               <Map buses={buses} route={driverRoute} stops={allStops} />
                            </div>
                        </div>
                        <div className="glass-card">
                            <h3 className="text-xl font-semibold mb-4">Current Trip</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-sm text-gray-400">Route</div>
                                        <div className="font-semibold">{currentTrip.route}</div>
                                        <div className="text-xs text-gray-500">{currentTrip.time}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Passengers</div>
                                        <div className="font-semibold">{currentTrip.passengers}/{currentTrip.totalPassengers}</div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-sm text-gray-400">Current Location</div>
                                        <div className="font-semibold">{currentTrip.current}</div>
                                        <div className="text-xs text-gray-500">Next: {currentTrip.next}</div>
                                    </div>
                                    <div className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold">In Progress</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="glass-card">
                            <h3 className="text-xl font-semibold mb-4">Today's Schedule</h3>
                            <div className="space-y-4">
                                {schedule.map(trip => (
                                    <div key={trip.time} className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg hover-lift">
                                        <div className="flex space-x-4 items-center">
                                            <div className="text-xl">{trip.time}</div>
                                            <div className="flex flex-col">
                                                <div className="font-semibold">{trip.route}</div>
                                                <div className="text-xs text-gray-400">{trip.stops} stops</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${trip.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}`}>{trip.status}</div>
                                            <button className="text-sm text-teal-400 hover:underline">View Route</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-card">
                            <h3 className="text-xl font-semibold mb-4">Notifications</h3>
                            <div className="space-y-4">
                                {notifications.map((notif, index) => (
                                    <div key={index} className="p-4 rounded-lg bg-gray-800/50 hover-lift">
                                        <div className="flex space-x-2 items-center">
                                            <div className="text-lg">{notif.type === 'alert' ? '🔔' : notif.type === 'update' ? '📣' : '✅'}</div>
                                            <div className="text-sm font-medium">{notif.text}</div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{notif.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}