const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  disabilityType: {
    type: [String],
    required: true,
    enum: ['mobility', 'visual', 'hearing', 'other', 'general'],
  }
}, { timestamps: true });

const Scheme = mongoose.model('Scheme', schemeSchema);

module.exports = Scheme;