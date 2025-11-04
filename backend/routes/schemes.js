const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');

router.get('/', async (req, res) => {
  try {
    const { disabilityType } = req.query;

    let query = {};
    if (disabilityType && disabilityType !== 'none') {
      query = {
        disabilityType: { $in: [disabilityType, 'general'] }
      };
    } else {
      query = {
        disabilityType: 'general'
      };
    }

    const schemes = await Scheme.find(query);
    res.status(200).json(schemes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;