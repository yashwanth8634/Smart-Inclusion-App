import React, { useState, useEffect } from 'react';
import { FaTimes, FaStar, FaHourglassHalf, FaCheckCircle, FaPhone } from 'react-icons/fa';
import axios from 'axios';

const ReviewItem = ({ review }) => {
  const date = new Date(review.timestamp).toLocaleDateString();
  const time = new Date(review.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-4 bg-background-secondary rounded-lg border border-border mb-3">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1 text-lg">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar key={star} className={`${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`} size={16} />
          ))}
        </div>
        <span className="text-sm text-text-secondary">{date} at {time}</span>
      </div>
      <p className="text-sm text-text-primary">
        "Thank you for your help! Rating: {review.rating} / 5"
      </p>
    </div>
  );
};

const VolunteerReviewModal = ({ isOpen, onClose, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (isOpen && userId) {
      axios.get(`http://localhost:3000/api/feedback/volunteer/${userId}/history`)
        .then(res => {
          setReviews(res.data.reviews);
          setStats(res.data.stats);
        })
        .catch(err => console.error("Failed to fetch volunteer history:", err));
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background-primary rounded-lg shadow-xl w-full max-w-lg m-4 relative"
      >
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-2xl font-display font-bold text-text-primary">Service Reviews</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '80vh' }}>
          {stats && (
            <div className="bg-blue-50 border border-blue-400 text-blue-800 p-4 rounded-lg mb-6 flex justify-between items-center">
              <h3 className="font-bold text-xl">Overall Rating</h3>
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-500" size={24} />
                <span className="text-2xl font-bold">
                  {stats.averageRating.toFixed(1)}
                </span>
                <span className="text-sm">({stats.totalReviews} services)</span>
              </div>
            </div>
          )}

          <h4 className="text-lg font-semibold text-text-primary mb-3 border-b border-border pb-2">Review History</h4>

          {reviews.length > 0 ? (
            reviews.map(review => <ReviewItem key={review._id} review={review} />)
          ) : (
            <p className="text-text-secondary">No service reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerReviewModal;