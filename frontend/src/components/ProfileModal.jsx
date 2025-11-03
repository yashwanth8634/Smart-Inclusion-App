import React from 'react';
import { FaTimes, FaUser, FaUserShield } from 'react-icons/fa';

const ProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const isVolunteer = user.role === 'volunteer';

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background-primary rounded-lg shadow-xl w-full max-w-md m-4"
      >
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-2xl font-display font-bold text-text-primary">Your Profile</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-full ${isVolunteer ? 'bg-blue-100 text-blue-600' : 'bg-accent/10 text-accent'}`}>
              {isVolunteer ? <FaUserShield size={24} /> : <FaUser size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary">{user.fullName}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isVolunteer ? 'bg-blue-100 text-blue-600' : 'bg-accent/10 text-accent'}`}>
                {isVolunteer ? 'Volunteer' : 'User'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-text-secondary">
              <span className="font-semibold text-text-primary">Email:</span> {user.email || 'Not provided'}
            </p>
            <p className="text-text-secondary">
              <span className="font-semibold text-text-primary">Phone:</span> {user.phone || 'Not provided'}
            </p>
            
            {!isVolunteer && (
              <p className="text-text-secondary">
                <span className="font-semibold text-text-primary">Disability Type:</span> {user.disabilityType || 'none'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;