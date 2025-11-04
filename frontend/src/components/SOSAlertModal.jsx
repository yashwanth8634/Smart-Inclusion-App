import React from 'react';
import { FaTimes, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const SOSAlertModal = ({ isOpen, onClose, sosData }) => {
  if (!isOpen || !sosData) return null;

  const { user, position } = sosData;

  const handleAccept = () => {
    // In a real app, this would notify the user that help is coming
    alert("You have accepted the alert. Please proceed to the user's location.");
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

          <a
            href={`http://googleusercontent.com/maps?q=${position[0]},${position[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center mt-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg"
          >
            Navigate to User
          </a>
          
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