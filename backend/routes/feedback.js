const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');

// Route to submit (POST) feedback from a PwD user
router.post('/', async (req, res) => {
  try {
    const { userId, volunteerId, volunteerName, rating } = req.body;

    if (!userId || !volunteerId || !volunteerName || rating === undefined) {
      return res.status(400).json({ message: 'Missing required fields for feedback.' });
    }

    const newFeedback = new Feedback({
      userId,
      volunteerId,
      volunteerName,
      rating,
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully.' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to get a volunteer's average rating (for their profile)
router.get('/volunteer/:id/reviews', async (req, res) => {
  try {
    const volunteerId = new mongoose.Types.ObjectId(req.params.id);

    const result = await Feedback.aggregate([
      { $match: { volunteerId: volunteerId } },
      { $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({ averageRating: 0, totalReviews: 0 });
    }

    res.status(200).json(result[0]);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to get a volunteer's full review history and statistics
router.get('/volunteer/:id/history', async (req, res) => {
  try {
    const volunteerId = new mongoose.Types.ObjectId(req.params.id);

    // 1. Get all reviews
    const reviews = await Feedback.find({ volunteerId: volunteerId }).sort({ timestamp: -1 });

    // 2. Get aggregate statistics
    const stats = await Feedback.aggregate([
      { $match: { volunteerId: volunteerId } },
      { $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const resultStats = stats[0] || { averageRating: 0, totalReviews: 0 };

    res.status(200).json({
        reviews: reviews,
        stats: resultStats
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;