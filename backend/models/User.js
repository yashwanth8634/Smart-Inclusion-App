const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  disabilityType: {
    type: String,
    enum: ['mobility', 'visual', 'hearing', 'other', 'none'],
    default: 'none',
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;