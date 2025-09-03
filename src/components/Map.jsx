import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import the local PNG file for the bus stop icon.
import busStopIconPng from '../assets/icon/bus-station.png'; 

// A custom bus icon for the map markers.
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448378.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// A custom stop icon for bus stops.
const stopIcon = new L.Icon({
  iconUrl: busStopIconPng,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// This reusable component displays a map with bus markers, stops, and a route line.
export default function Map({ buses = [], stops = [], route = [] }) {
  // Set the default position to the center of Delhi.
  const position = [28.7041, 77.1025];
  
  // Define a bounding box for the map to restrict its view to Delhi.
  const delhiBounds = [
    [28.4, 76.8], // Southwest corner of the bounding box
    [28.9, 77.5], // Northeast corner of the bounding box
  ];

  return (
    <MapContainer 
      center={position} 
      zoom={12} 
      minZoom={11} // Minimum zoom level to prevent zooming out too far.
      maxZoom={16} // Maximum zoom level to prevent zooming in too close.
      maxBounds={delhiBounds} // The map will be restricted to these coordinates.
      className="w-full h-full rounded-xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Display bus markers on the map */}
      {buses.map(bus => (
        <Marker key={bus.id} position={bus.location} icon={busIcon}>
          <Popup>
            <div className="font-bold">{bus.name}</div>
            <div>Status: {bus.status}</div>
            <div>Route: {bus.route}</div>
          </Popup>
        </Marker>
      ))}

      {/* Display bus stop markers on the map */}
      {stops.map(stop => (
        <Marker key={stop.id} position={stop.location} icon={stopIcon}>
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}

      {/* Display a polyline for the bus route */}
      {route.length > 0 && <Polyline pathOptions={{ color: 'teal', weight: 4 }} positions={route} />}
    </MapContainer>
  );
}
