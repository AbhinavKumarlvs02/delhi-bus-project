import React from 'react';
import Sidebar from '../components/Sidebar';
import Map from '../components/Map';

export default function PassengerDashboard() {
    // State variables for the "Find Your Bus" section
    const [departure, setDeparture] = React.useState('');
    const [destination, setDestination] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [departureSuggestions, setDepartureSuggestions] = React.useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = React.useState([]);
    
    // New state to hold the buses that match the search criteria
    const availableBuses = [
        { id: 1, route: "Red Line", rating: 4.8, time: "7:30 AM - 9:00 AM", duration: "1h 30m", seats: 15, totalSeats: 40, price: "$12.50", amenities: ["WIFI", "AC", "USB Charging"], status: "available" },
        { id: 2, route: "Red Line", rating: 4.7, time: "8:00 AM - 9:30 AM", duration: "1h 30m", seats: 25, totalSeats: 40, price: "$12.50", amenities: ["WIFI", "AC"], status: "available" },
        { id: 3, route: "Blue Line", rating: 4.5, time: "8:45 AM - 10:15 AM", duration: "1h 30m", seats: 20, totalSeats: 40, price: "$9.25", amenities: ["WIFI", "AC"], status: "available" },
        { id: 4, route: "Blue Line", rating: 4.6, time: "9:15 AM - 10:45 AM", duration: "1h 30m", seats: 30, totalSeats: 40, price: "$9.25", amenities: ["WIFI", "AC", "Refreshments"], status: "available" },
    ];
    
    const [filteredBuses, setFilteredBuses] = React.useState(availableBuses);

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
            { name: 'Ludhiana Junction Stop', location: [30.8974, 75.8569] },
            { name: 'Pavilion Mall Stop', location: [30.8992, 75.8488] },
            { name: 'Feroz Gandhi Market Stop', location: [30.8872, 75.8458] },
            { name: 'Model Town Market Stop', location: [30.8711, 75.8236] },
            { name: 'Sarabha Nagar Market Stop', location: [30.8808, 75.8078] },
            { name: 'Ghanta Ghar Stop', location: [30.9038, 75.8443] } // Common transfer point
        ],
        reverse: [
            { name: 'Ghanta Ghar Stop', location: [30.9038, 75.8443] },
            { name: 'Sarabha Nagar Market Stop', location: [30.8808, 75.8078] },
            { name: 'Model Town Market Stop', location: [30.8711, 75.8236] },
            { name: 'Feroz Gandhi Market Stop', location: [30.8872, 75.8458] },
            { name: 'Pavilion Mall Stop', location: [30.8992, 75.8488] },
            { name: 'Ludhiana Junction Stop', location: [30.8974, 75.8569] }
        ]
    };

    // Define the Blue Line routes with a common transfer point
    const blueLine = {
        forward: [
            { name: 'Ghanta Ghar Stop', location: [30.9038, 75.8443] }, // Common transfer point
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
    };
    
    // Updated search logic to filter buses
    const handleSearch = () => {
        // Find the lines that each stop is on
        const departureOnRed = redLine.forward.some(stop => stop.name.toLowerCase().includes(departure.toLowerCase()));
        const departureOnBlue = blueLine.forward.some(stop => stop.name.toLowerCase().includes(departure.toLowerCase()));
        const destinationOnRed = redLine.forward.some(stop => stop.name.toLowerCase().includes(destination.toLowerCase()));
        const destinationOnBlue = blueLine.forward.some(stop => stop.name.toLowerCase().includes(destination.toLowerCase()));
    
        if (!departure || !destination) {
            setMessage('Please enter both a departure and a destination.');
            setFilteredBuses([]); // Clear the list
            return;
        }
    
        // Check if both stops are on the same line
        if ((departureOnRed && destinationOnRed)) {
            setMessage('No bus change needed. The entire journey is on a single route.');
            setFilteredBuses(availableBuses.filter(bus => bus.route === "Red Line"));
        } else if ((departureOnBlue && destinationOnBlue)) {
             setMessage('No bus change needed. The entire journey is on a single route.');
            setFilteredBuses(availableBuses.filter(bus => bus.route === "Blue Line"));
        }
        // Check if a transfer is needed at Ghanta Ghar
        else if ((departureOnRed && destinationOnBlue) || (departureOnBlue && destinationOnRed)) {
            setMessage('Bus change required. Take the bus to Ghanta Ghar Stop, then transfer to the other line.');
            setFilteredBuses(availableBuses); // Show all buses for the transfer
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
            const filteredStops = busStops.filter(stop => 
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
            const filteredStops = busStops.filter(stop => 
                stop.name.toLowerCase().includes(value.toLowerCase()) && 
                stop.name.toLowerCase() !== departure.toLowerCase()
            );
            setDestinationSuggestions(filteredStops);
        } else {
            setDestinationSuggestions([]);
        }
    };
    
    // Updated available buses array to reflect the new routes and bus count
    const allBuses = [
        { id: 'BUS-001', name: 'Bus 1', status: 'Active', routeName: 'Red Line', location: redLine.forward[0].location },
        { id: 'BUS-002', name: 'Bus 2', status: 'Active', routeName: 'Blue Line', location: blueLine.forward[0].location },
        { id: 'BUS-003', name: 'Bus 3', status: 'Active', routeName: 'Red Line', location: redLine.forward[2].location },
        { id: 'BUS-004', name: 'Bus 4', status: 'Active', routeName: 'Blue Line', location: blueLine.forward[2].location },
    ];
    
    // Dummy data for the "on-board" tracking map.
    const myBus = [
        { id: 'BUS-001', name: 'My Bus', status: 'On-board', routeName: 'Red Line', location: redLine.forward[1].location }
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
                           <Map buses={allBuses} stops={busStops} redLine={redLine} blueLine={blueLine} />
                        </div>
                    </div>
                    {/* Second map for my bus */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full h-[500px]">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">My Bus</h3>
                        <div className="w-full h-[400px]">
                           <Map buses={myBus} stops={busStops} redLine={redLine} blueLine={blueLine} />
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