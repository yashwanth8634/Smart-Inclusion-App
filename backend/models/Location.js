const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  accessibility: {
    hasRamp: { type: Boolean, default: false },
    hasTactilePath: { type: Boolean, default: false },
    accessibleWashroom: { type: Boolean, default: false },
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Or 'Volunteer', depending on who can add places
    required: true,
  },
}, { timestamps: true });

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;