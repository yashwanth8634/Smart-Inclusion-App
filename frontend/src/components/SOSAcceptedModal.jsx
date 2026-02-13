import React from 'react';
import { FaTimes, FaUserShield, FaPhone, FaCarSide, FaCheckCircle, FaStar } from 'react-icons/fa';

const StatusItem = ({ icon, text, isCurrent }) => (
  <div className="flex items-center gap-3">
    <div className={`p-1 rounded-full ${isCurrent ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500'}`}>
      {icon}
    </div>
    <span className={`font-semibold ${isCurrent ? 'text-text-primary' : 'text-text-secondary'}`}>
      {text}
    </span>
  </div>
);

const SOSAcceptedModal = ({ isOpen, onClose, volunteerData, onComplete }) => {
  if (!isOpen || !volunteerData) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background-primary rounded-lg shadow-xl w-full max-w-md m-4"
      >
        <>
          <div className="p-4 border-b border-border bg-green-600 rounded-t-lg">
            <h2 className="text-2xl font-display font-bold text-white">Help is on the way!</h2>
          </div>
          <div className="p-6">
            
            <h3 className="text-xl font-bold font-display text-text-primary mb-3">
              {volunteerData.fullName} has accepted your request.
            </h3>

            {/* Status Tracker */}
            <div className="flex flex-col gap-3 p-4 bg-background-secondary rounded-lg border border-border mb-6">
              <StatusItem icon={<FaCheckCircle size={14} />} text="1. Request Sent" isCurrent={false} />
              <StatusItem icon={<FaCheckCircle size={14} />} text="2. Volunteer Accepted" isCurrent={true} />
              <StatusItem icon={<FaCarSide size={14} />} text="3. Volunteer En Route" isCurrent={false} />
            </div>
            {/* End Status Tracker */}
            
            <div className="space-y-3 mb-6">
              <p className="text-lg text-text-primary">
                <FaPhone className="inline mr-2 text-accent" />
                <strong>Phone:</strong> {volunteerData.phone}
              </p>
            </div>

            <button
              onClick={onComplete}
              className="w-full text-center py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg"
            >
              Mark as Complete & Close
            </button>
          </div>
        </>
      </div>
    </div>
  );
};

export default SOSAcceptedModal;