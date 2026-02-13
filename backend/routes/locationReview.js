const express = require('express');
const router = express.Router();
const LocationReview = require('../models/LocationReview');
const Location = require('../models/Location'); // Import Location model

// Helper function to check vote count and delete location
async function checkAndDeleteLocation(locationId) {
  // 1. Count negative reviews (rating <= 2)
  const negativeReviews = await LocationReview.countDocuments({
    locationId: locationId,
    rating: { $lte: 2 } // Finds documents with rating 1 or 2
  });

  // 2. Check for automatic deletion threshold
  if (negativeReviews >= 3) {
    // Location fails verification, delete it
    await Location.findByIdAndDelete(locationId);
    
    // Optional: Delete all associated reviews
    await LocationReview.deleteMany({ locationId: locationId });
    
    return true; // Location deleted
  }
  return false; // Location safe
}

// Route to submit a review for a location
router.post('/:locationId/review', async (req, res) => {
  try {
    const { locationId } = req.params;
    const { userId, userName, rating, verification, comment } = req.body;

    if (!userId || rating === undefined || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Missing user ID or invalid rating.' });
    }

    // 1. Check if the user has already reviewed this location (optional, but good UX)
    const existingReview = await LocationReview.findOne({ locationId, userId });
    if (existingReview) {
      return res.status(409).json({ message: 'You have already reviewed this location.' });
    }

    // 2. Save the new review
    const newReview = new LocationReview({
      locationId,
      userId,
      userName,
      rating,
      verification,
      comment
    });
    await newReview.save();

    // 3. Check for the 3-Vote deletion rule
    const isDeleted = await checkAndDeleteLocation(locationId);

    if (isDeleted) {
      return res.status(200).json({ 
        message: 'Location failed community verification and has been removed.',
        status: 'removed'
      });
    }

    res.status(201).json({ message: 'Review submitted successfully.', status: 'reviewed' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;