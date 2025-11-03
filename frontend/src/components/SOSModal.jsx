import React, { useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';

const SOSModal = ({ isOpen, onClose, userPosition }) => {
  useEffect(() => {
    if (isOpen) {
      // In a real app, you would send the SOS alert to the backend here.
      console.log('SOS Alert Sent:', userPosition);
    }
  }, [isOpen, userPosition]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background-primary rounded-lg shadow-xl w-full max-w-md m-4 p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-display font-bold text-red-600">EMERGENCY SOS</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="text-center">
          <FaSpinner className="text-accent text-5xl animate-spin mx-auto mb-4" />
          <p className="text-lg text-text-primary font-semibold">Connecting to nearest volunteers...</p>
          <p className="text-text-secondary mt-2">
            Your location has been shared. Help is on the way. Please stay calm and in a safe place.
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full py-2 bg-accent/10 text-accent font-bold rounded-lg hover:bg-accent/20"
          >
            Cancel Alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default SOSModal;