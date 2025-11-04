import React from 'react';
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

const InfoBox = ({ loc, auth, onClose, onEdit, onDelete }) => {
  if (!loc) return null;

  const isVolunteer = auth.user.role === 'volunteer';
  const canModify = isVolunteer && loc.addedBy.toString() === auth.user.id;

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
          href={`http://googleusercontent.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full mt-4 py-2 bg-accent hover:bg-accent-hover text-white font-bold text-center rounded-lg"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
};

export default InfoBox;     