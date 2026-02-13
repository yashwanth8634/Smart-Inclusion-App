import React from 'react';
import { FaTimes, FaEdit, FaTrash, FaStar } from 'react-icons/fa';

const InfoBox = ({ loc, auth, onClose, onDelete, onEdit, onReviewClick }) => {
  if (!loc) return null;

  const isVolunteer = auth.user.role === 'volunteer';
  const isOwner = loc.addedBy.toString() === auth.user.id;
  const canModify = isVolunteer && isOwner;
  const canReview = auth.user.role === 'user' && !isOwner; // Only PwD users who aren't the owner can review

  return (
    <div 
      className="absolute top-4 right-4 z-[1000] w-80 bg-background-primary shadow-lg rounded-lg border border-border"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold font-display text-text-primary">{loc.name}</h3>
          <div className="flex items-center gap-2">
            
            {canModify && (
              <>
                <button onClick={() => onEdit(loc)} className="text-accent hover:text-accent-hover">
                  <FaEdit />
                </button>
                <button onClick={() => onDelete(loc._id)} className="text-red-600 hover:text-red-500">
                  <FaTrash />
                </button>
              </>
            )}
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
              <FaTimes />
            </button>
          </div>
        </div>

        <p className="text-sm text-text-secondary mb-3">{loc.address}</p>
        
        <hr className="my-3 border-border" />
        
        <div className="flex flex-col gap-1 text-sm">
          <span className={loc.accessibility.hasRamp ? 'text-green-600' : 'text-red-600'}>
            Ramp: {loc.accessibility.hasRamp ? 'Yes' : 'No'}
          </span>
          <span className={loc.accessibility.accessibleWashroom ? 'text-green-600' : 'text-red-600'}>
            Accessible Washroom: {loc.accessibility.accessibleWashroom ? 'Yes' : 'No'}
          </span>
          <span className={loc.accessibility.hasTactilePath ? 'text-green-600' : 'text-red-600'}>
            Tactile Path: {loc.accessibility.hasTactilePath ? 'Yes' : 'No'}
          </span>
        </div>

        <a
          href={`https://www.google.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full mt-4 py-2 bg-accent hover:bg-accent-hover text-white font-bold text-center rounded-lg"
        >
          Get Directions
        </a>
        
        {canReview && (
          <button
            onClick={() => onReviewClick(loc)}
            className="block w-full mt-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-center rounded-lg flex items-center justify-center gap-2"
          >
            <FaStar /> Leave a Review
          </button>
        )}
      </div>
    </div>
  );
};

export default InfoBox;