import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const LocationMap = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Error getting location:", err);
      }
    );
  }, []);

  // 🚨 Wait for location before rendering anything that uses it
  if (!userLocation) {
    return <p className="text-center text-gray-500">Fetching location...</p>;
  }

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>You are here!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LocationMap;