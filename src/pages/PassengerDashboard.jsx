import React, { useState, useEffect , useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Map from '../components/Map';
import { getLiveBuses } from '../services/locationAPI';
import { dataService } from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';

export default function PassengerDashboard() {
    const { user } = useAuth();
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // State variables for the "Find Your Bus" section
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [message, setMessage] = useState('');
    const [departureSuggestions, setDepartureSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);

    const [filteredBuses, setFilteredBuses] = useState([]);

    const [allBuses, setAllBuses] = useState([]);   // for “Track All Buses” map
    const [myBus, setMyBus] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        loadPassengerData();
        loadLive();
        timerRef.current = setInterval(loadLive, 10000); // 10s polling
        return () => clearInterval(timerRef.current);
    }, []);

    const loadLive = async () => {
        try {
            // last 30 min freshness (you can tweak)
            const live = await getLiveBuses(30);  // returns normalized list if you used my locationApi.js
            // If your getLiveBuses already normalizes, you can skip .map(normalize)
            const list = live;

            setAllBuses(list);

            // pick a “my bus” if none selected yet
            if (!myBus && list.length > 0) {
            setMyBus(list[0]);
            }
        } catch (e) {
            console.error("live buses error", e);
        }
    };

    // useEffect(() => {
    //     loadLive();
    //     timerRef.current = setInterval(loadLive, 10000); // 10s polling
    //     return () => clearInterval(timerRef.current);
    // }, []);


    const normalize = (live) => ({
    id: live.busNumber,
    name: live.busNumber,
    status: live.status || "Active",
    routeName: live.routeName || "",
    location: [live.lat, live.lon],
    speed: live.speed ?? 0,
    lastSeenAt: live.lastSeenAt,
    });

    const loadPassengerData = async () => {
        try {
            setLoading(true);

            // Fetch buses and routes from backend
            const [busesData, routesData] = await Promise.all([
                dataService.getBuses(),
                dataService.getRoutes()
            ]);

            const transformedBuses = dataService.transformBusData(busesData);
            const transformedRoutes = dataService.transformRouteData(routesData);

            // Convert backend buses to available buses format
            const availableBuses = transformedBuses.map((bus, index) => ({
                id: bus.id,
                route: bus.routeName || "Route",
                rating: 4.5 + Math.random() * 0.5,
                time: `${8 + index}:00 AM - ${9 + index}:30 AM`,
                duration: "1h 30m",
                seats: Math.floor(Math.random() * 20) + 10,
                totalSeats: bus.capacity || 40,
                price: `₹${25 + Math.floor(Math.random() * 50)}`,
                amenities: ["WIFI", "AC", "USB Charging"],
                status: "available"
            }));

            setBuses(transformedBuses);
            setRoutes(transformedRoutes);
            setFilteredBuses(availableBuses);
        } catch (err) {
            console.error('Error loading passenger data:', err);
            // Fallback to sample data
            const availableBuses = [
                { id: 1, route: "Red Line", rating: 4.8, time: "7:30 AM - 9:00 AM", duration: "1h 30m", seats: 15, totalSeats: 40, price: "₹25", amenities: ["WIFI", "AC", "USB Charging"], status: "available" },
                { id: 2, route: "Red Line", rating: 4.7, time: "8:00 AM - 9:30 AM", duration: "1h 30m", seats: 25, totalSeats: 40, price: "₹25", amenities: ["WIFI", "AC"], status: "available" },
                { id: 3, route: "Blue Line", rating: 4.5, time: "8:45 AM - 10:15 AM", duration: "1h 30m", seats: 20, totalSeats: 40, price: "₹30", amenities: ["WIFI", "AC"], status: "available" },
                { id: 4, route: "Blue Line", rating: 4.6, time: "9:15 AM - 10:45 AM", duration: "1h 30m", seats: 30, totalSeats: 40, price: "₹30", amenities: ["WIFI", "AC", "Refreshments"], status: "available" },
            ];
            setFilteredBuses(availableBuses);
            setBuses([]);
            setRoutes([]);
        } finally {
            setLoading(false);
        }
    };

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

    const allStops = routes.length > 0
        ? routes.flatMap(route => route.stops)
        : defaultBusStops;

    // Create route lines from route data or use defaults
    const getRouteLines = () => {
        if (routes.length === 0) {
            // Default routes if no data from backend
            return {
                redLine: {
                    forward: [
                        { name: 'Ludhiana Junction Stop', location: [30.8974, 75.8569] },
                        { name: 'Pavilion Mall Stop', location: [30.8992, 75.8488] },
                        { name: 'Feroz Gandhi Market Stop', location: [30.8872, 75.8458] },
                        { name: 'Model Town Market Stop', location: [30.8711, 75.8236] },
                        { name: 'Sarabha Nagar Market Stop', location: [30.8808, 75.8078] },
                        { name: 'Ghanta Ghar Stop', location: [30.9038, 75.8443] }
                    ],
                    reverse: [
                        { name: 'Ghanta Ghar Stop', location: [30.9038, 75.8443] },
                        { name: 'Sarabha Nagar Market Stop', location: [30.8808, 75.8078] },
                        { name: 'Model Town Market Stop', location: [30.8711, 75.8236] },
                        { name: 'Feroz Gandhi Market Stop', location: [30.8872, 75.8458] },
                        { name: 'Pavilion Mall Stop', location: [30.8992, 75.8488] },
                        { name: 'Ludhiana Junction Stop', location: [30.8974, 75.8569] }
                    ]
                },
                blueLine: {
                    forward: [
                        { name: 'Ghanta Ghar Stop', location: [30.9038, 75.8443] },
                        { name: 'Mini Secretariat Stop', location: [30.9168, 75.8485] },
                        { name: 'Guru Nanak Stadium Stop', location: [30.9048, 75.8647] },
                        { name: 'Rose Garden Stop', location: [30.8937, 75.8294] },
                        { name: 'Punjab Agricultural University Stop', location: [30.8988, 75.8091] },
                    ],
                    reverse: [
                        { name: 'Punjab Agricultural University Stop', location: [30.8988, 75.8091] },
                        { name: 'Rose Garden Stop', location: [30.8937, 75.8294] },
                        { name: 'Guru Nanak Stadium Stop', location: [30.9048, 75.8647] },
                        { name: 'Mini Secretariat Stop', location: [30.9168, 75.8485] },
                        { name: 'Ghanta Ghar Stop', location: [30.9038, 75.8443] }
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

    // Updated search logic to filter buses
    const handleSearch = () => {
        // Find the lines that each stop is on
        const departureOnRed = routeLines.redLine?.forward?.some(stop => stop.name.toLowerCase().includes(departure.toLowerCase()));
        const departureOnBlue = routeLines.blueLine?.forward?.some(stop => stop.name.toLowerCase().includes(departure.toLowerCase()));
        const destinationOnRed = routeLines.redLine?.forward?.some(stop => stop.name.toLowerCase().includes(destination.toLowerCase()));
        const destinationOnBlue = routeLines.blueLine?.forward?.some(stop => stop.name.toLowerCase().includes(destination.toLowerCase()));

        if (!departure || !destination) {
            setMessage('Please enter both a departure and a destination.');
            setFilteredBuses([]); // Clear the list
            return;
        }

        // Check if both stops are on the same line
        if ((departureOnRed && destinationOnRed)) {
            setMessage('No bus change needed. The entire journey is on a single route.');
            setFilteredBuses(filteredBuses.filter(bus => bus.route === "Red Line"));
        } else if ((departureOnBlue && destinationOnBlue)) {
            setMessage('No bus change needed. The entire journey is on a single route.');
            setFilteredBuses(filteredBuses.filter(bus => bus.route === "Blue Line"));
        }
        // Check if a transfer is needed at Ghanta Ghar
        else if ((departureOnRed && destinationOnBlue) || (departureOnBlue && destinationOnRed)) {
            setMessage('Bus change required. Take the bus to Ghanta Ghar Stop, then transfer to the other line.');
            setFilteredBuses(filteredBuses); // Show all buses for the transfer
        }
        // If the stops are not on either defined route
        else {
            setMessage('One or both stops are not on a known route. Please check the location names.');
            setFilteredBuses([]); // Clear the list
        }
    };

    // Handlers for the search bar inputs to provide suggestions
    const handleDepartureChange = (e) => {
        const value = e.target.value;
        setDeparture(value);
        if (value) {
            const filteredStops = allStops.filter(stop =>
                stop.name.toLowerCase().includes(value.toLowerCase())
            );
            setDepartureSuggestions(filteredStops);
        } else {
            setDepartureSuggestions([]);
        }
    };

    const handleDestinationChange = (e) => {
        const value = e.target.value;
        setDestination(value);
        if (value) {
            const filteredStops = allStops.filter(stop =>
                stop.name.toLowerCase().includes(value.toLowerCase()) &&
                stop.name.toLowerCase() !== departure.toLowerCase()
            );
            setDestinationSuggestions(filteredStops);
        } else {
            setDestinationSuggestions([]);
        }
    };

    // // Get all buses for tracking map
    // const allBuses = buses.length > 0 ? buses : [
    //     { id: 'BUS-001', name: 'Bus 1', status: 'Active', routeName: 'Red Line', location: [30.8974, 75.8569] },
    //     { id: 'BUS-002', name: 'Bus 2', status: 'Active', routeName: 'Blue Line', location: [30.8872, 75.8458] },
    // ];

    // // Dummy data for the "on-board" tracking map.
    // const myBus = buses.length > 0 ? [buses[0]] : [
    //     { id: 'BUS-001', name: 'My Bus', status: 'On-board', routeName: 'Red Line', location: [30.8992, 75.8488] }
    // ];

    if (loading) {
        return (
            <div className="flex bg-gray-900 text-white min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
                    <p>Loading passenger data...</p>
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
                    <h1 className="text-xl font-bold">Passenger Dashboard</h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
                    <div className="hidden lg:flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">Passenger Dashboard</h1>
                            <p className="text-gray-400">Find and book your next journey</p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={loadPassengerData} className="btn btn-secondary">
                                Refresh
                            </button>
                            <button className="btn btn-teal">
                                My Tickets
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="glass-card w-full h-[500px]">
                            <h3 className="text-xl font-semibold mb-4">Track All Buses</h3>
                            <div className="w-full h-[400px] rounded-lg overflow-hidden">
                                <Map buses={allBuses} stops={allStops} redLine={routeLines.redLine} blueLine={routeLines.blueLine} />
                            </div>
                        </div>
                        <div className="glass-card w-full h-[500px]">
                            <h3 className="text-xl font-semibold mb-4">My Bus</h3>
                            <div className="w-full h-[400px] rounded-lg overflow-hidden">
                                <Map buses={myBus ? [myBus] : []} stops={allStops} redLine={routeLines.redLine} blueLine={routeLines.blueLine} />
                            </div>
                        </div>
                    </div>
                    <div className="glass-card mb-8">
                        <h3 className="text-xl font-semibold mb-4">Find Your Bus</h3>
                        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="relative md:col-span-2 lg:col-span-1">
                                <input
                                    type="text"
                                    placeholder="Enter departure location"
                                    className="form-input w-full"
                                    value={departure}
                                    onChange={handleDepartureChange}
                                />
                                {departureSuggestions.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
                                        {departureSuggestions.map((stop) => (
                                            <li key={stop.id} className="p-3 cursor-pointer hover:bg-gray-700" onClick={() => { setDeparture(stop.name); setDepartureSuggestions([]); }}>
                                                {stop.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="relative md:col-span-2 lg:col-span-1">
                                <input
                                    type="text"
                                    placeholder="Enter destination"
                                    className="form-input w-full"
                                    value={destination}
                                    onChange={handleDestinationChange}
                                />
                                {destinationSuggestions.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
                                        {destinationSuggestions.map((stop) => (
                                            <li key={stop.id} className="p-3 cursor-pointer hover:bg-gray-700" onClick={() => { setDestination(stop.name); setDestinationSuggestions([]); }}>
                                                {stop.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <input
                                type="date"
                                className="form-input w-full"
                            />
                            <button
                                className="btn btn-teal"
                                onClick={handleSearch}
                            >
                                Search Buses
                            </button>
                        </div>
                        {message && <div className="mt-4 p-3 rounded-md bg-blue-500/20 text-blue-300 font-medium">{message}</div>}
                    </div>
                    <div className="glass-card">
                        <h3 className="text-xl font-semibold mb-4">Available Buses</h3>
                        <div className="space-y-4">
                            {filteredBuses.length > 0 ? (
                                filteredBuses.map(bus => (
                                    <div key={bus.id} className="p-4 rounded-lg bg-gray-800/50 flex flex-col md:flex-row justify-between items-start md:items-center hover-lift">
                                        <div className="flex-1 mb-4 md:mb-0">
                                            <div className="flex items-center space-x-2">
                                                <div className="text-lg font-semibold">{bus.route}</div>
                                                <div className="flex items-center text-yellow-400 text-sm">⭐{bus.rating.toFixed(1)}</div>
                                            </div>
                                            <div className="text-sm text-gray-400">{bus.time}</div>
                                            <div className="text-xs text-gray-500">{bus.duration}</div>
                                            <div className="text-xs text-gray-400 mt-2">{bus.seats} seats available of {bus.totalSeats} total</div>
                                        </div>
                                        <div className="flex-shrink-0 w-full md:w-auto text-left md:text-right">
                                            <div className="font-bold text-lg">{bus.price}</div>
                                            <div className="text-xs text-gray-500">per person</div>
                                            <div className="flex mt-2 space-x-1">
                                                {bus.amenities.map(amenity => (
                                                    <span key={amenity} className="px-2 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">{amenity}</span>
                                                ))}
                                            </div>
                                            <button className="mt-2 w-full md:w-auto btn btn-teal">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    No buses found. Please try a different search.
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}