import React, { useState } from 'react';
import { FaTimes, FaStar } from 'react-icons/fa';
import axios from 'axios';

const StarRating = ({ rating, onRate }) => {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={30}
          className={`cursor-pointer transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-gray-400'}`}
          onClick={() => onRate(star)}
        />
      ))}
    </div>
  );
};

const LocationReviewModal = ({ isOpen, onClose, user, location, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [verification, setVerification] = useState({
    hasRamp: false,
    accessibleWashroom: false,
    hasTactilePath: false,
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !location || !user) return null;

  const handleVerificationChange = (e) => {
    setVerification({
      ...verification,
      [e.target.id]: e.target.checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    const reviewData = {
      userId: user.id,
      userName: user.fullName,
      rating: rating,
      verification: verification,
      comment: comment,
    };

    try {
      const res = await axios.post(
        `http://localhost:3000/api/locations/${location._id}/review`, 
        reviewData
      );

      alert(res.data.message); 
      onReviewSubmitted(res.data.status === 'removed');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. You may have reviewed already.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background-primary rounded-lg shadow-xl w-full max-w-lg m-4 relative"
      >
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-display font-bold text-text-primary">Reviewing: {location.name}</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Your Rating</h3>
            <StarRating rating={rating} onRate={setRating} />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Accessibility Verification (Mark if Confirmed)
            </label>
            <div className="flex flex-col gap-2 p-3 bg-background-secondary rounded-lg border border-border">
              <label className="flex items-center gap-3 text-text-primary">
                <input
                  type="checkbox"
                  id="hasRamp"
                  checked={verification.hasRamp}
                  onChange={handleVerificationChange}
                  className="h-4 w-4 text-accent border-border rounded focus:ring-accent"
                />
                Has Ramp
              </label>
              <label className="flex items-center gap-3 text-text-primary">
                <input
                  type="checkbox"
                  id="accessibleWashroom"
                  checked={verification.accessibleWashroom}
                  onChange={handleVerificationChange}
                  className="h-4 w-4 text-accent border-border rounded focus:ring-accent"
                />
                Accessible Washroom
              </label>
              <label className="flex items-center gap-3 text-text-primary">
                <input
                  type="checkbox"
                  id="hasTactilePath"
                  checked={verification.hasTactilePath}
                  onChange={handleVerificationChange}
                  className="h-4 w-4 text-accent border-border rounded focus:ring-accent"
                />
                Has Tactile Path
              </label>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-medium text-text-secondary mb-1">
              Comment (Optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              maxLength="250"
              placeholder="What was your experience?"
              className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className={`w-full py-2 font-bold rounded-lg flex items-center justify-center gap-2 ${
              rating === 0 || isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white'
            }`}
          >
            {isSubmitting ? <FaSpinner className="animate-spin" /> : 'Submit Review & Verify'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LocationReviewModal;