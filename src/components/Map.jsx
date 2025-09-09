import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import busStopIconPng from '../assets/icon/bus-station.png';

// This is the standard fix for Leaflet's default icon issue with modern bundlers.
// It sets a correct URL for the icon assets, which the compatibility plugin does automatically.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom bus icon
const busIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448378.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

// Custom bus stop icon using your local asset
const stopIcon = new L.Icon({
    iconUrl: busStopIconPng,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export default function Map({ buses = [], stops = [], redLine, blueLine }) {
    const position = [30.9009, 75.8573];
    
    const ludhianaBounds = [
        [30.7, 75.6],
        [31.1, 76.1],
    ];
    
    // Check if the routes are defined to prevent errors
    if (!redLine || !blueLine) {
        return (
            <div className="w-full h-full flex items-center justify-center rounded-xl bg-gray-200 text-gray-600">
                Loading map data...
            </div>
        );
    }
    
    // Extract coordinates for each route from the props
    const redLineForwardCoords = redLine.forward.map(stop => stop.location);
    const redLineReverseCoords = redLine.reverse.map(stop => stop.location);
    const blueLineForwardCoords = blueLine.forward.map(stop => stop.location);
    const blueLineReverseCoords = blueLine.reverse.map(stop => stop.location);

    return (
        <MapContainer
            center={position}
            zoom={12}
            minZoom={11}
            maxZoom={16}
            maxBounds={ludhianaBounds}
            maxBoundsViscosity={1.0}
            className="w-full h-full rounded-xl"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Draw the Red Line routes */}
            <Polyline
                positions={redLineForwardCoords}
                pathOptions={{ color: 'red', weight: 5, opacity: 0.8 }}
            />
            <Polyline
                positions={redLineReverseCoords}
                pathOptions={{ color: 'red', weight: 5, opacity: 0.5, dashArray: '10, 10' }}
            />

            {/* Draw the Blue Line routes */}
            <Polyline
                positions={blueLineForwardCoords}
                pathOptions={{ color: 'blue', weight: 5, opacity: 0.8 }}
            />
            <Polyline
                positions={blueLineReverseCoords}
                pathOptions={{ color: 'blue', weight: 5, opacity: 0.5, dashArray: '10, 10' }}
            />

            {/* Render all bus stops as markers */}
            {stops.map(stop => (
                <Marker key={stop.id} position={stop.location} icon={stopIcon}>
                    <Popup>{stop.name}</Popup>
                </Marker>
            ))}

            {/* Render all buses as markers */}
            {buses.map(bus => (
                <Marker key={bus.id} position={bus.location} icon={busIcon}>
                    <Popup>
                        <div className="font-bold">{bus.name}</div>
                        <div>Status: {bus.status}</div>
                        <div>Route: {bus.routeName}</div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}