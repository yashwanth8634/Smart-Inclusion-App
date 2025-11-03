import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { FaCrosshairs, FaExclamationTriangle, FaPlus } from 'react-icons/fa';

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

const MainApp = () => {
  const { auth, logout } = useContext(AuthContext);
  const [locations, setLocations] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  
  const defaultPosition = [17.5348, 78.3843]; // VNRVJIET Fallback

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition([latitude, longitude]);
      },
      () => {
        console.error("Error getting user location. Defaulting to VNRVJIET.");
        setUserPosition(defaultPosition);
      }
    );
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/locations');
        setLocations(res.data);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };
    fetchLocations();
  }, []);

  if (!auth || !userPosition) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-display text-text-secondary">Loading your map...</p>
      </div>
    );
  }

  const userDisabilityType = auth.user.disabilityType;

  const filteredLocations = locations.filter(loc => {
    if (!userDisabilityType || userDisabilityType === 'none') {
      return true;
    }
    if (userDisabilityType === 'mobility' && (loc.accessibility.hasRamp || loc.accessibility.accessibleWashroom)) {
      return true;
    }
    if (userDisabilityType === 'visual' && loc.accessibility.hasTactilePath) {
      return true;
    }
    return false;
  });
  
  const handleSOS = () => {
    alert(`SOS! Alerting nearby volunteers to your location: ${userPosition}`);
    // In a real app, this would send userPosition and auth.user.id to your backend
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center p-4 border-b border-border shadow-sm">
        <h1 className="text-xl font-display font-bold text-text-primary">
          Smart Inclusion Map
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-text-secondary">
            Welcome, <span className="font-bold text-text-primary">{auth.user.fullName}</span>
          </span>
          <button 
            onClick={logout} 
            className="bg-accent/10 hover:bg-accent/20 text-accent font-bold py-2 px-3 rounded-lg transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="w-80 bg-background-primary p-4 border-r border-border flex flex-col gap-4">
          <h2 className="text-2xl font-display text-text-primary">Controls</h2>
          
          <button
            className="w-full py-3 bg-accent text-white font-bold rounded-lg flex items-center justify-center gap-2"
          >
            <FaPlus /> Add New Location
          </button>

          <button
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg flex items-center justify-center gap-2"
            onClick={handleSOS}
          >
            <FaExclamationTriangle /> EMERGENCY SOS
          </button>
        </aside>

        <main className="flex-1 w-full h-full">
          <MapContainer 
            center={userPosition}
            zoom={16} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <CircleMarker 
              center={userPosition} 
              radius={10} 
              pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.5 }}
            >
              <Popup>Your current location</Popup>
            </CircleMarker>
            
            {filteredLocations.map(loc => (
              <Marker 
                key={loc._id} 
                position={[loc.coordinates.lat, loc.coordinates.lng]}
                icon={DefaultIcon}
              >
                <Popup>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'Alan Sans' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{loc.name}</span>
                    <span>{loc.address}</span>
                    <hr style={{ margin: '4px 0' }} />
                    <span style={{ color: loc.accessibility.hasRamp ? 'green' : 'red' }}>
                      Ramp: {loc.accessibility.hasRamp ? 'Yes' : 'No'}
                    </span>
                    <span style={{ color: loc.accessibility.accessibleWashroom ? 'green' : 'red' }}>
                      Accessible Washroom: {loc.accessibility.accessibleWashroom ? 'Yes' : 'No'}
                    </span>
                    <span style={{ color: loc.accessibility.hasTactilePath ? 'green' : 'red' }}>
                      Tactile Path: {loc.accessibility.hasTactilePath ? 'Yes' : 'No'}
                    </span>
                    
                    <a
                      href={`http://googleusercontent.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginTop: '8px',
                        padding: '8px 12px',
                        backgroundColor: '#7c3aed',
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        borderRadius: '8px',
                        textDecoration: 'none'
                      }}
                    >
                      Get Directions
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </main>
      </div>
    </div>
  );
};

export default MainApp;