import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { FaCrosshairs, FaExclamationTriangle, FaPlus, FaUser, FaFileAlt, FaTrash, FaMicrophone, FaSpinner, FaEdit, FaStar, FaHistory } from 'react-icons/fa';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { socket } from '../socket';
import SOSModal from '../components/SOSModal';
import AddLocationModal from '../components/AddLocationModal';
import MapClickHandler from '../components/MapClickHandler';
import ProfileModal from '../components/ProfileModal';
import SchemesModal from '../components/SchemesModal';
import InfoBox from '../components/InfoBox';
import SOSAlertModal from '../components/SOSAlertModal';
import SOSAcceptedModal from '../components/SOSAcceptedModal';
import FeedbackModal from '../components/FeedbackModal';
import LocationReviewModal from '../components/LocationReviewModal';
import VolunteerReviewModal from '../components/VolunteerReviewModal'; 
import { speak } from '../utils/speech';

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

// LocationPopup component now renders the InfoBox content for map popups
const LocationPopup = ({ loc, auth, handleDeleteLocation, onEditClick, onReviewClick }) => {
  const isVolunteer = auth.user.role === 'volunteer';
  const isOwner = loc.addedBy.toString() === auth.user.id;
  const canModify = isVolunteer && isOwner;
  const canReview = auth.user.role === 'user' && !isOwner;

  return (
    <Popup>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'Alan Sans', minWidth: '200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{loc.name}</span>
          {canModify && (
            <div className="flex gap-2">
              <div 
                onClick={() => onEditClick(loc)}
                style={{
                  cursor: 'pointer',
                  color: '#7c3aed',
                  padding: '5px'
                }}
              >
                <FaEdit />
              </div>
              <div 
                onClick={() => handleDeleteLocation(loc._id)}
                style={{
                  cursor: 'pointer',
                  color: '#dc2626',
                  padding: '5px'
                }}
              >
                <FaTrash />
              </div>
            </div>
          )}
        </div>
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
          href={`https://www.google.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}`}
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
        {canReview && (
           <button
            onClick={() => onReviewClick(loc)}
            className="block w-full mt-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-center rounded-lg flex items-center justify-center gap-2"
            style={{ border: 'none', cursor: 'pointer', width: '100%' }}
          >
            <FaStar /> Leave Review
          </button>
        )}
      </div>
    </Popup>
  );
};

const MapInteractionController = ({ setSelectedLocation, onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
      setSelectedLocation(null);
    },
  });
  return null;
};

const MainApp = () => {
  const { auth, logout } = useContext(AuthContext);
  const [locations, setLocations] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [map, setMap] = useState(null);
  
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSchemesModalOpen, setIsSchemesModalOpen] = useState(false);
  const [newLocationCoords, setNewLocationCoords] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationToEdit, setLocationToEdit] = useState(null);
  const [isPlacingLocation, setIsPlacingLocation] = useState(false);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [sosData, setSosData] = useState(null);
  const [isSOSAcceptedModalOpen, setIsSOSAcceptedModalOpen] = useState(false);
  const [volunteerInfo, setVolunteerInfo] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false); 
  const [pendingReviewData, setPendingReviewData] = useState(null); 
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); 
  const [locationToReview, setLocationToReview] = useState(null); 
  const [isVolunteerReviewModalOpen, setIsVolunteerReviewModalOpen] = useState(false); 
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  const defaultPosition = [17.5348, 78.3843];
  const isVolunteer = auth.user.role === 'volunteer';

  const fetchLocations = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/locations');
      setLocations(res.data);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);
  
  // --- REAL-TIME LISTENERS ---
  useEffect(() => {
    if (auth.user.id) {
      socket.emit('register_user', auth.user.id);
    }

    function onReceiveSOS(data) {
      if (isVolunteer && data.user.id !== auth.user.id) {
        speak(`Emergency SOS received from ${data.user.fullName}`);
        setSosData(data);
        setIsAlertModalOpen(true);
      }
    }
    
    function onSOSAccepted(volunteerData) {
      if (!isVolunteer && volunteerData) {
        speak(`Help is on the way. ${volunteerData.fullName} has accepted your request.`);
        setVolunteerInfo(volunteerData);
        setIsSOSModalOpen(false); 
        setIsSOSAcceptedModalOpen(true);
      }
    }

    socket.on('receive_sos', onReceiveSOS);
    socket.on('sos_accepted', onSOSAccepted);
    
    return () => {
      socket.off('receive_sos', onReceiveSOS);
      socket.off('sos_accepted', onSOSAccepted);
    };
  }, [isVolunteer, auth.user.id]);
  // ---------------------------
  
  const findLocationByName = useCallback((place) => {
    SpeechRecognition.stopListening();
    speak(`Searching for ${place}`);
    const found = locations.find(loc => loc.name.toLowerCase().includes(place.toLowerCase()));
    
    if (found && found.coordinates && found.coordinates.lat != null && found.coordinates.lng != null && map) {
      setSelectedLocation(null); 
      map.flyTo([found.coordinates.lat, found.coordinates.lng], 18);
      setTimeout(() => {
        setSelectedLocation(found);
      }, 100);
    } else {
      speak(`Sorry, I could not find ${place}`);
    }
    setIsProcessing(false);
  }, [locations, map]);

  const handleFindMe = useCallback(() => {
    SpeechRecognition.stopListening();
    speak("Finding your location");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = [latitude, longitude];
        setUserPosition(newPos);
        if (map) {
          map.flyTo(newPos, 16);
        }
      },
      () => {
        speak("I could not get your location. Please check browser permissions.");
      }
    );
    setIsProcessing(false);
  }, [map]);
  
  const handleSOS = useCallback(() => {
    SpeechRecognition.stopListening();
    if (!userPosition) {
      speak("I don't know your location. Please center the map first.");
      alert("Please click 'Center on Me' first so I can get your location.");
      return;
    }
    
    if (isVolunteer) {
      speak("SOS is only for users.");
      return;
    }
    
    speak("Emergency SOS triggered. Alerting nearby volunteers.");
    socket.emit('send_sos', { user: auth.user, position: userPosition });
    setIsSOSModalOpen(true);
    setIsProcessing(false);
  }, [userPosition, auth.user, isVolunteer]);
  
  const openSchemes = useCallback(() => {
    SpeechRecognition.stopListening();
    speak("Showing your personalized schemes");
    setIsSchemesModalOpen(true);
    setIsProcessing(false);
  }, []);
  
  const openProfile = useCallback(() => {
    SpeechRecognition.stopListening();
    speak("Opening your profile");
    setIsProfileModalOpen(true);
    setIsProcessing(false);
  }, []);

  const handleUnknownCommand = useCallback(() => {
    SpeechRecognition.stopListening();
    speak("Sorry, I didn't understand that.");
    setIsProcessing(false);
  }, []);
  
  const handleSOSComplete = (data) => {
      setIsSOSAcceptedModalOpen(false); 
      setPendingReviewData({
          userId: auth.user.id,
          volunteerInfo: data,
      });
  };
  
  const handleFeedbackSubmitted = () => {
      setPendingReviewData(null); 
      setIsFeedbackModalOpen(false); 
  };
  
  const handleOpenFeedbackFromHistory = (volunteerInfo) => {
      setVolunteerInfo(volunteerInfo);
      setIsFeedbackModalOpen(true);
      setIsHistoryModalOpen(false);
  }
  
  const openLocationReviewModal = useCallback((loc) => {
      setLocationToReview(loc);
      setIsReviewModalOpen(true);
      setSelectedLocation(null);
  }, []);
  
  const handleReviewSubmitted = useCallback((isDeleted) => {
      // If the location failed community verification and was deleted by the backend
      if (isDeleted) {
          fetchLocations(); // Re-fetch data to remove the marker from the map
          alert("Location failed community verification and was removed from the map.");
      }
      setLocationToReview(null);
      setIsReviewModalOpen(false);
  }, [fetchLocations]);


  const commands = useMemo(() => [
    {
      command: 'go to *',
      callback: (place) => findLocationByName(place)
    },
    {
      command: ['center on me', 'find me', 'where am I'],
      callback: () => handleFindMe()
    },
    {
      command: ['help', 'SOS', 'emergency'],
      callback: () => {
        if (!isVolunteer) handleSOS();
      }
    },
    {
      command: ['show schemes', 'view schemes'],
      callback: openSchemes
    },
    {
      command: ['show profile', 'view profile'],
      callback: openProfile
    },
    {
      command: '*',
      callback: handleUnknownCommand
    }
  ], [findLocationByName, handleFindMe, handleSOS, openSchemes, openProfile, isVolunteer, handleUnknownCommand]);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({ commands });
  
  useEffect(() => {
    if (!listening && transcript && !isProcessing) {
      setIsProcessing(true);
      const timer = setTimeout(() => {
        setIsProcessing(false);
        resetTranscript();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [listening, transcript, isProcessing, resetTranscript]);

  
  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      setIsProcessing(false);
      if (browserSupportsSpeechRecognition) {
        SpeechRecognition.startListening({ continuous: true });
      }
    }
  };

  if (!auth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-display text-text-secondary">Loading...</p>
      </div>
    );
  }
  
  if (!browserSupportsSpeechRecognition) {
    console.error("Browser does not support speech recognition.");
  }

  const userDisabilityType = auth.user.disabilityType;

  const filteredLocations = useMemo(() => locations.filter(loc => {
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
  }), [locations, userDisabilityType]);

  const startAddLocation = () => {
    setLocationToEdit(null);
    setNewLocationCoords(null);
    setIsPlacingLocation(true);
    setSelectedLocation(null);
  };
  
  const openEditLocationModal = (loc) => {
    setLocationToEdit(loc);
    setNewLocationCoords(null);
    setIsAddModalOpen(true);
    setSelectedLocation(null);
  };

  const handleMapClick = (latlng) => {
    if (isPlacingLocation) {
      setNewLocationCoords({ lat: latlng.lat, lng: latlng.lng });
      setIsAddModalOpen(true);
      setIsPlacingLocation(false);
    } else {
      setSelectedLocation(null);
    }
  };

  const handleAddLocationSubmit = useCallback(async (locationData, locationId, coords) => {
    const dataToSubmit = {
      ...locationData,
      addedBy: auth.user.id,
    };

    try {
      if (locationId) {
        // This is an UPDATE (PUT)
        const res = await axios.put(`http://localhost:3000/api/locations/${locationId}`, dataToSubmit, {
          headers: { 'Content-Type': 'application/json' }
        });
        setLocations(locations.map(loc => loc._id === locationId ? res.data : loc));
      } else {
        // This is a CREATE (POST)
        const newLocation = {
          ...dataToSubmit,
          coordinates: coords,
        };
        const res = await axios.post('http://localhost:3000/api/locations', newLocation, {
          headers: { 'Content-Type': 'application/json' }
        });
        setLocations([...locations, res.data]);
      }
      
      setIsAddModalOpen(false);
      setLocationToEdit(null);
      setNewLocationCoords(null);

    } catch (error) {
      console.error('Failed to submit location:', error);
      alert('Failed to submit location. Check console for details.');
    }
  }, [auth.user.id, locations]);
  
  const handleDeleteLocation = useCallback(async (locationId) => {
    if (!window.confirm("Are you sure you want to delete this location?")) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:3000/api/locations/${locationId}`);
      
      setLocations(prevLocations => prevLocations.filter(loc => loc._id !== locationId));
      setSelectedLocation(null);

    } catch (error) {
      console.error('Failed to delete location:', error);
      alert('Failed to delete location.');
    }
  }, []);

  const getVoiceStatus = () => {
    if (listening) {
      return { icon: <FaMicrophone className="text-accent animate-pulse" />, text: 'Listening...' };
    }
    if (isProcessing) {
      return { icon: <FaSpinner className="animate-spin" />, text: 'Processing...' };
    }
    return { icon: <FaMicrophone />, text: 'Tap to Command' };
  };
  const voiceStatus = getVoiceStatus();

  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="flex justify-between items-center p-4 border-b border-border shadow-sm">
          <h1 className="text-xl font-display font-bold text-text-primary">
            Smart Inclusion Map
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 text-text-secondary"
            >
              <FaUser />
              <span className="font-bold text-text-primary hidden md:block">{auth.user.fullName}</span>
            </button>
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
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2"
              onClick={handleFindMe}
            >
              <FaCrosshairs /> Center on Me
            </button>

            {isVolunteer && (
              <>
                <button
                  className={`w-full py-3 text-white font-bold rounded-lg flex items-center justify-center gap-2 ${isPlacingLocation ? 'bg-yellow-500' : 'bg-accent hover:bg-accent-hover'}`}
                  onClick={startAddLocation}
                >
                  <FaPlus /> {isPlacingLocation ? 'Click map...' : 'Add New Location'}
                </button>
                <button
                    onClick={() => setIsVolunteerReviewModalOpen(true)}
                    className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                >
                    <FaStar /> Service Reviews
                </button>
              </>
            )}

            {!isVolunteer && (
              <>
                <button
                    onClick={() => setIsHistoryModalOpen(true)} // PwD Service History button
                    className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                >
                    <FaHistory /> Service History
                </button>
                <button
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg flex items-center justify-center gap-2"
                  onClick={handleSOS}
                >
                  <FaExclamationTriangle /> EMERGENCY SOS
                </button>
              </>
            )}

            <button
              className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg flex items-center justify-center gap-2"
              onClick={() => setIsSchemesModalOpen(true)}
            >
              <FaFileAlt /> View Schemes
            </button>
            
            {pendingReviewData && (
                 <button
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 animate-pulse"
                 >
                    <FaStar /> Pending Review!
                 </button>
            )}
            
            <div className="mt-auto p-2 border border-border rounded-lg">
              <button
                onClick={toggleListening}
                disabled={!browserSupportsSpeechRecognition}
                className="w-full flex items-center justify-center gap-2 text-text-secondary rounded-lg p-2 hover:bg-background-secondary disabled:opacity-50"
              >
                {voiceStatus.icon}
                <span>{voiceStatus.text}</span>
              </button>
              <p className="text-sm text-text-secondary h-10 overflow-y-auto mt-2 italic">
                {transcript || "Say 'Help' or 'Go to... '"}
              </p>
            </div>
          </aside>

          <main className="flex-1 w-full h-full">
            <MapContainer 
              center={defaultPosition}
              zoom={16} 
              scrollWheelZoom={true} 
              style={{ height: '100%', width: '100%' }}
              ref={setMap}
            >
              <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapInteractionController onMapClick={handleMapClick} setSelectedLocation={setSelectedLocation} />

              {userPosition && (
                <CircleMarker 
                  center={userPosition} 
                  radius={10} 
                  pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.5 }}
                >
                  <Popup>Your current location</Popup>
                </CircleMarker>
              )}
              
              {newLocationCoords && isPlacingLocation && (
                <Marker 
                  position={[newLocationCoords.lat, newLocationCoords.lng]}
                  icon={DefaultIcon}
                >
                  <Popup>New location coordinates</Popup>
                </Marker>
              )}

              {filteredLocations
                .filter(loc => loc.coordinates && loc.coordinates.lat != null && loc.coordinates.lng != null) 
                .map(loc => (
                  <Marker 
                    key={loc._id} 
                    position={[loc.coordinates.lat, loc.coordinates.lng]}
                    icon={DefaultIcon}
                    eventHandlers={{
                      click: (e) => {
                        L.DomEvent.stopPropagation(e);
                        setSelectedLocation(loc);
                      },
                    }}
                  />
              ))}
              
              {selectedLocation && selectedLocation.coordinates && selectedLocation.coordinates.lat != null && (
                <InfoBox 
                  loc={selectedLocation} 
                  auth={auth}
                  onClose={() => setSelectedLocation(null)}
                  onDelete={handleDeleteLocation}
                  onEdit={openEditLocationModal}
                  onReviewClick={openLocationReviewModal} // Passing the handler
                />
              )}
            </MapContainer>
          </main>
        </div>
      </div>

      <SOSModal 
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        userPosition={userPosition}
      />

      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalModalOpen(false);
          setLocationToEdit(null);
        }}
        onSubmit={handleAddLocationSubmit}
        newLocationCoords={newLocationCoords}
        locationToEdit={locationToEdit}
      />
      
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={auth.user}
      />

      <SchemesModal
        isOpen={isSchemesModalOpen}
        onClose={() => setIsSchemesModalOpen(false)}
        user={auth.user}
      />

      <SOSAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        sosData={sosData}
      />

      <SOSAcceptedModal
        isOpen={isSOSAcceptedModalOpen}
        onClose={() => setIsSOSAcceptedModalOpen(false)}
        onComplete={() => handleSOSComplete(volunteerInfo)}
        volunteerData={volunteerInfo}
      />
      
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleFeedbackSubmitted}
        userData={auth.user}
        volunteerData={pendingReviewData?.volunteerInfo}
      />
      
      <LocationReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        location={locationToReview}
        user={auth.user}
        onReviewSubmitted={handleReviewSubmitted}
      />
      
      <VolunteerReviewModal 
          isOpen={isVolunteerReviewModalOpen}
          onClose={() => setIsVolunteerReviewModalOpen(false)}
          userId={auth.user.id} 
      />
    </>
  );
};

export default MainApp;