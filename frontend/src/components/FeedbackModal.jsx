import React, { useState } from 'react';
import { FaTimes, FaStar, FaCheckCircle } from 'react-icons/fa';
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

const FeedbackModal = ({ isOpen, onClose, userData, volunteerData }) => {
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !volunteerData || !userData) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    setError(null);

    try {
      // API call to save feedback
      await axios.post('http://localhost:3000/api/feedback', {
        userId: userData.id,
        volunteerId: volunteerData.id,
        volunteerName: volunteerData.fullName,
        rating: rating,
      });

      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
      }, 2000);
      
    } catch (err) {
      setError('Submission failed. Please try again.');
      console.error(err);
    }
  };
  
  const handleClose = () => {
      setIsSubmitted(false);
      setRating(0);
      onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background-primary rounded-lg shadow-xl w-full max-w-sm m-4 relative"
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
          <FaTimes size={20} />
        </button>

        <div className="p-6 text-center">
          {isSubmitted ? (
            <div>
              <FaCheckCircle className="text-green-600 text-5xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-text-primary">Thank You!</h3>
              <p className="text-text-secondary mt-2">Your feedback has been recorded.</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold font-display text-text-primary mb-2">Rate Your Volunteer</h2>
              <p className="text-text-secondary mb-6">
                How was your experience with **{volunteerData.fullName}**?
              </p>
              
              <StarRating rating={rating} onRate={setRating} />
              
              {error && <p className="text-red-500 mt-3">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={rating === 0}
                className={`w-full text-center mt-6 py-3 font-bold rounded-lg ${
                  rating === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white'
                }`}
              >
                Submit Feedback
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;