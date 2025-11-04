import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const FormInput = ({ id, label, value, onChange, required = true }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
    <input
      type="text"
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
    />
  </div>
);

const Checkbox = ({ id, label, checked, onChange }) => (
  <label className="flex items-center gap-2 text-text-primary">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-accent border-border rounded focus:ring-accent"
    />
    {label}
  </label>
);

const AddLocationModal = ({ isOpen, onClose, onSubmit, newLocationCoords, locationToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    hasRamp: false,
    accessibleWashroom: false,
    hasTactilePath: false,
  });

  const isEditMode = !!locationToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          name: locationToEdit.name,
          address: locationToEdit.address,
          hasRamp: locationToEdit.accessibility.hasRamp,
          accessibleWashroom: locationToEdit.accessibility.accessibleWashroom,
          hasTactilePath: locationToEdit.accessibility.hasTactilePath,
        });
      } else {
        setFormData({
          name: '',
          address: '',
          hasRamp: false,
          accessibleWashroom: false,
          hasTactilePath: false,
        });
      }
    }
  }, [isOpen, isEditMode, locationToEdit]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const locationData = {
      name: formData.name,
      address: formData.address,
      accessibility: {
        hasRamp: formData.hasRamp,
        accessibleWashroom: formData.accessibleWashroom,
        hasTactilePath: formData.hasTactilePath,
      },
    };
    
    if (isEditMode) {
      onSubmit(locationData, locationToEdit._id);
    } else {
      onSubmit(locationData, null, newLocationCoords);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background-primary rounded-lg shadow-xl w-full max-w-md m-4"
      >
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-2xl font-display font-bold text-text-primary">
            {isEditMode ? 'Edit Location' : 'Add New Location'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">

          {isEditMode ? (
            <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg mb-4">
              Editing: {locationToEdit.name}
            </div>
          ) : (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
              Coordinates set! Lat: {newLocationCoords.lat.toFixed(4)}, Lng: {newLocationCoords.lng.toFixed(4)}
            </div>
          )}

          <FormInput id="name" label="Location Name" value={formData.name} onChange={handleChange} />
          <FormInput id="address" label="Address" value={formData.address} onChange={handleChange} />

          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-2">Accessibility Features</label>
            <div className="flex flex-col gap-2">
              <Checkbox id="hasRamp" label="Has Ramp" checked={formData.hasRamp} onChange={handleChange} />
              <Checkbox id="accessibleWashroom" label="Accessible Washroom" checked={formData.accessibleWashroom} onChange={handleChange} />
              <Checkbox id="hasTactilePath" label="Has Tactile Path" checked={formData.hasTactilePath} onChange={handleChange} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg"
          >
            {isEditMode ? 'Save Changes' : 'Submit Location'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLocationModal;