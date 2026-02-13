const mongoose = require('mongoose');

const locationReviewSchema = new mongoose.Schema({
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  // Optional verification flags added by the user
  verification: {
    hasRamp: { type: Boolean, default: false },
    accessibleWashroom: { type: Boolean, default: false },
    hasTactilePath: { type: Boolean, default: false },
  },
  comment: {
    type: String,
    trim: true,
  }
}, { timestamps: true });

const LocationReview = mongoose.model('LocationReview', locationReviewSchema);

module.exports = LocationReview;