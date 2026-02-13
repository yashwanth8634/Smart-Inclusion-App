import React, { useContext } from 'react';
import { FaTimes, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { socket } from '../socket';
import { AuthContext } from '../context/AuthContext';

const SOSAlertModal = ({ isOpen, onClose, sosData }) => {
  const { auth } = useContext(AuthContext); // Get the volunteer's info

  if (!isOpen || !sosData) return null;

  const { user, position } = sosData;

  const handleAccept = () => {
    // Send the volunteer's info back to the server
    socket.emit('volunteer_accept_sos', {
      volunteerInfo: auth.user, // The volunteer's details
      userId: user.id, // The ID of the user in distress
    });

    // Open Google Maps in a new tab
    window.open(`https://www.google.com/maps?q=${position[0]},${position[1]}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background-primary rounded-lg shadow-xl w-full max-w-md m-4"
      >
        <div className="p-4 border-b border-border bg-red-600 rounded-t-lg">
          <h2 className="text-2xl font-display font-bold text-white">INCOMING SOS ALERT</h2>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-full bg-accent/10 text-accent">
              <FaUser size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary">{user.fullName}</h3>
              <p className="text-text-secondary">Needs help immediately!</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-lg text-text-primary">
              <FaPhone className="inline mr-2 text-accent" />
              <strong>Phone:</strong> {user.phone}
            </p>
            <p className="text-lg text-text-primary">
              <FaUser className="inline mr-2 text-accent" />
              <strong>Disability:</strong> {user.disabilityType}
            </p>
            <p className="text-lg text-text-primary">
              <FaMapMarkerAlt className="inline mr-2 text-accent" />
              <strong>Location:</strong> {position[0].toFixed(4)}, {position[1].toFixed(4)}
            </p>
          </div>

          <button
            onClick={handleAccept}
            className="w-full text-center mt-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg"
          >
            Accept & Navigate to User
          </button>
          
          <button
            onClick={onClose}
            className="w-full mt-2 py-2 text-text-secondary hover:bg-background-secondary font-bold rounded-lg"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default SOSAlertModal;