import React from 'react';
import { FaTimes, FaStar, FaCheckCircle, FaHourglassHalf, FaPhone } from 'react-icons/fa';

const ServiceHistoryItem = ({ reviewData, onRate, isPending }) => {
  const volunteer = reviewData.volunteerInfo;
  const isReviewed = reviewData.rating !== undefined;

  return (
    <div className={`p-4 rounded-lg border shadow-sm mb-4 ${isPending ? 'bg-yellow-50 border-yellow-400' : 'bg-background-secondary border-border'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-bold text-text-primary">Service Completed</h4>
          <p className="text-sm text-text-secondary">Volunteer: {volunteer.fullName}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${isPending ? 'bg-yellow-500 text-white animate-pulse' : 'bg-green-100 text-green-600'}`}>
          {isPending ? <FaHourglassHalf /> : <FaCheckCircle />}
          {isPending ? 'PENDING REVIEW' : 'COMPLETED'}
        </div>
      </div>
      
      <hr className="my-3 border-border" />
      
      {isReviewed ? (
        <div className="flex items-center gap-2">
          <FaStar className="text-yellow-400" />
          <span className="font-bold">{reviewData.rating.toFixed(1)} out of 5 Stars</span>
        </div>
      ) : (
        <div className="mt-2">
          <button
            onClick={() => onRate(reviewData)}
            className="text-white bg-accent hover:bg-accent-hover px-3 py-1 rounded-lg text-sm flex items-center gap-2"
          >
            <FaStar /> Leave Review
          </button>
        </div>
      )}
    </div>
  );
};

const ReviewHistoryModal = ({ isOpen, onClose, historyData, onOpenFeedback }) => {
  if (!isOpen) return null;
  
  // Create mock history data for the demo, since we only have the 'pending' state
  const mockHistory = [
    { 
      volunteerInfo: { fullName: "Jane Doe", phone: "9876543210" }, 
      rating: 4.5, // Completed and rated
    }
  ];
  
  // Combine mock history with pending review data for display
  const finalHistory = [
      ...(historyData ? [{...historyData, rating: 0, isPending: true}] : []),
      ...mockHistory
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background-primary rounded-lg shadow-xl w-full max-w-lg m-4 relative"
      >
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-2xl font-display font-bold text-text-primary">Service History</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {finalHistory.length === 0 ? (
            <p className="text-text-secondary text-center">No service history found.</p>
          ) : (
            finalHistory.map((item, index) => (
              <ServiceHistoryItem 
                key={index}
                reviewData={item}
                isPending={item.isPending}
                onRate={() => onOpenFeedback(item.volunteerInfo)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewHistoryModal;