import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Map from '../components/Map';
import { dataService } from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';

export default function PassengerDashboard() {
    const { user } = useAuth();
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State variables for the "Find Your Bus" section
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [message, setMessage] = useState('');
    const [departureSuggestions, setDepartureSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    
    const [filteredBuses, setFilteredBuses] = useState([]);

    useEffect(() => {
        loadPassengerData();
    }, []);

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
    
    // Get all buses for tracking map
    const allBuses = buses.length > 0 ? buses : [
        { id: 'BUS-001', name: 'Bus 1', status: 'Active', routeName: 'Red Line', location: [30.8974, 75.8569] },
        { id: 'BUS-002', name: 'Bus 2', status: 'Active', routeName: 'Blue Line', location: [30.8872, 75.8458] },
    ];
    
    // Dummy data for the "on-board" tracking map.
    const myBus = buses.length > 0 ? [buses[0]] : [
        { id: 'BUS-001', name: 'My Bus', status: 'On-board', routeName: 'Red Line', location: [30.8992, 75.8488] }
    ];

    if (loading) {
        return (
            <div className="flex bg-gray-100 min-h-screen">
                <Sidebar active="Dashboard" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading passenger data...</p>
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
                        <h1 className="text-3xl font-bold text-gray-800">Passenger Dashboard</h1>
                        <p className="text-gray-500">Find and book your next journey</p>
                    </div>
                    <div className="flex space-x-2">
                        <button 
                            onClick={loadPassengerData}
                            className="px-4 py-2 rounded-md font-medium text-sm text-teal-600 bg-teal-50 hover:bg-teal-100 transition duration-200"
                        >
                            Refresh
                        </button>
                        <button className="px-6 py-2 rounded-md font-medium text-sm text-white bg-teal-600 hover:bg-teal-700 transition duration-200">
                            My Tickets
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* First map for all buses */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full h-[500px]">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Track All Buses</h3>
                        <div className="w-full h-[400px]">
                           <Map buses={allBuses} stops={allStops} redLine={routeLines.redLine} blueLine={routeLines.blueLine} />
                        </div>
                    </div>
                    {/* Second map for my bus */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full h-[500px]">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">My Bus</h3>
                        <div className="w-full h-[400px]">
                           <Map buses={myBus} stops={allStops} redLine={routeLines.redLine} blueLine={routeLines.blueLine} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Find Your Bus</h3>
                    <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Enter departure location" 
                                className="p-3 border rounded-md w-full focus:ring-2 focus:ring-teal-500 outline-none" 
                                value={departure}
                                onChange={handleDepartureChange}
                            />
                            {departureSuggestions.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
                                    {departureSuggestions.map((stop) => (
                                        <li 
                                            key={stop.id} 
                                            className="p-3 cursor-pointer hover:bg-gray-200"
                                            onClick={() => {
                                                setDeparture(stop.name);
                                                setDepartureSuggestions([]);
                                            }}
                                        >
                                            {stop.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Enter destination" 
                                className="p-3 border rounded-md w-full focus:ring-2 focus:ring-teal-500 outline-none" 
                                value={destination}
                                onChange={handleDestinationChange}
                            />
                            {destinationSuggestions.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
                                    {destinationSuggestions.map((stop) => (
                                        <li 
                                            key={stop.id} 
                                            className="p-3 cursor-pointer hover:bg-gray-200"
                                            onClick={() => {
                                                setDestination(stop.name);
                                                setDestinationSuggestions([]);
                                            }}
                                        >
                                            {stop.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <input 
                            type="text" 
                            placeholder="mm/dd/yyyy" 
                            className="p-3 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none" 
                        />
                        <button 
                            className="flex justify-center items-center py-2 px-4 rounded-md font-semibold text-white bg-teal-600 hover:bg-teal-700 transition duration-200"
                            onClick={handleSearch}
                        >
                            Search Buses
                        </button>
                    </div>
                    {message && (
                        <div className="mt-4 p-3 rounded-md bg-blue-100 text-blue-800 font-medium">
                            {message}
                        </div>
                    )}
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Buses</h3>
                    <div className="space-y-4">
                        {filteredBuses.length > 0 ? (
                            filteredBuses.map(bus => (
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
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                No buses found. Please try a different search.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}