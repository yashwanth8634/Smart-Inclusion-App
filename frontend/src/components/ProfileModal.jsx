import React, { useState, useContext, useEffect } from 'react';
import { FaTimes, FaUser, FaUserShield, FaEdit, FaSave } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const ProfileModal = ({ isOpen, onClose, user }) => {
  const { auth, login } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    phone: user.phone || '',
    disabilityType: user.disabilityType || 'none',
    disabilityOther: user.disabilityOther || '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsEditing(false);
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        disabilityType: user.disabilityType || 'none',
        disabilityOther: user.disabilityOther || '',
      });
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    const isVolunteer = user.role === 'volunteer';
    const url = isVolunteer 
      ? `http://localhost:3000/api/auth/volunteer/${user.id}` 
      : `http://localhost:3000/api/auth/user/${user.id}`;

    try {
      const res = await axios.put(url, formData);
      login(auth.token, res.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  const isVolunteer = user.role === 'volunteer';
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background-primary rounded-lg shadow-xl w-full max-w-md m-4 relative"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary z-10"
        >
          <FaTimes size={20} />
        </button>

        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-2xl font-display font-bold text-text-primary">Your Profile</h2>
        </div>
        
        <form onSubmit={handleSave} className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-full ${isVolunteer ? 'bg-blue-100 text-blue-600' : 'bg-accent/10 text-accent'}`}>
              {isVolunteer ? <FaUserShield size={24} /> : <FaUser size={24} />}
            </div>
            <div>
              {!isEditing ? (
                <h3 className="text-xl font-bold text-text-primary">{formData.fullName}</h3>
              ) : (
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
                />
              )}
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isVolunteer ? 'bg-blue-100 text-blue-600' : 'bg-accent/10 text-accent'}`}>
                {isVolunteer ? 'Volunteer' : 'User'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-text-secondary">
              <span className="font-semibold text-text-primary">Email:</span> {user.email || 'Not provided'}
            </p>
            
            <div>
              <label htmlFor="phone" className="font-semibold text-text-primary">Phone:</label>
              {!isEditing ? (
                <p className="text-text-secondary">{formData.phone}</p>
              ) : (
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
                />
              )}
            </div>
            
            {!isVolunteer && (
              <>
                <div>
                  <label htmlFor="disabilityType" className="font-semibold text-text-primary">Disability Type:</label>
                  {!isEditing ? (
                    <p className="text-text-secondary">{formData.disabilityType}</p>
                  ) : (
                    <select
                      id="disabilityType"
                      value={formData.disabilityType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
                    >
                      <option value="none">None</option>
                      <option value="mobility">Mobility Impairment</option>
                      <option value="visual">Visual Impairment</option>
                      <option value="hearing">Hearing Impairment</option>
                      <option value="other">Other</option>
                    </select>
                  )}
                </div>

                {formData.disabilityType === 'other' && isEditing && (
                  <div>
                    <label htmlFor="disabilityOther" className="font-semibold text-text-primary">Please Specify:</label>
                    <input
                      type="text"
                      id="disabilityOther"
                      value={formData.disabilityOther}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                )}
                
                {formData.disabilityType === 'other' && !isEditing && formData.disabilityOther && (
                   <p className="text-text-secondary">
                    <span className="font-semibold text-text-primary">Specification:</span> {formData.disabilityOther}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full py-2 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg flex items-center justify-center gap-2"
              >
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-1/2 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg flex items-center justify-center gap-2"
                >
                  <FaSave /> Save
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;