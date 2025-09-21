import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import busStopIconPng from '../assets/icon/bus-station.png';

// Standard fix for Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons
const busIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448378.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const stopIcon = new L.Icon({
    iconUrl: busStopIconPng,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

// Component to handle map clicks for route planning
const LocationMarker = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

export default function Map({ buses = [], stops = [], redLine, blueLine, route, onMapClick, plannedRoute }) {
    const position = [30.9009, 75.8573]; // Ludhiana center
    
    const ludhianaBounds = [
        [30.7, 75.6],
        [31.1, 76.1],
    ];
    
    const redLineForwardCoords = redLine?.forward?.map(stop => stop.location);
    const blueLineForwardCoords = blueLine?.forward?.map(stop => stop.location);

    return (
        <MapContainer
            center={position}
            zoom={12}
            // minZoom={11}
            maxZoom={16}
            // maxBounds={ludhianaBounds}
            maxBoundsViscosity={1.0}
            className="w-full h-full rounded-xl"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {onMapClick && <LocationMarker onMapClick={onMapClick} />}

            {redLineForwardCoords && <Polyline positions={redLineForwardCoords} pathOptions={{ color: 'red', weight: 5, opacity: 0.8 }} />}
            {blueLineForwardCoords && <Polyline positions={blueLineForwardCoords} pathOptions={{ color: 'blue', weight: 5, opacity: 0.8 }} />}
            {route && <Polyline positions={route} pathOptions={{ color: 'green', weight: 6, opacity: 0.9 }} />}

            {/* Draw the planned route */}
            {plannedRoute && plannedRoute.path && <Polyline positions={plannedRoute.path} pathOptions={{ color: '#00A99D', weight: 8, opacity: 1 }} />}
            {plannedRoute && plannedRoute.origin && <Marker position={plannedRoute.origin} />}
            {plannedRoute && plannedRoute.destination && <Marker position={plannedRoute.destination} />}

            {stops.map(stop => (
                <Marker key={stop.id} position={stop.location} icon={stopIcon}>
                    <Popup>{stop.name}</Popup>
                </Marker>
            ))}

            {buses
            .filter(bus => Array.isArray(bus.location) && bus.location.length === 2)
            .map(bus => (
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