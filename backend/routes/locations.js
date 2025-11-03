const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

router.get('/', async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, address, coordinates, accessibility, addedBy } = req.body;

    if (!name || !address || !coordinates || !accessibility || !addedBy) {
      return res.status(400).json({ message: 'Please fill all fields.' });
    }

    const newLocation = new Location({
      name,
      address,
      coordinates,
      accessibility,
      addedBy,
    });

    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;