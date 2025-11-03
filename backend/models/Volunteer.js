const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;