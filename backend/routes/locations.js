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

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // We will add logic here later to check *who* is deleting.
    // For now, let's just make it work.

    const deletedLocation = await Location.findByIdAndDelete(id);

    if (!deletedLocation) {
      return res.status(404).json({ message: 'Location not found.' });
    }

    res.status(200).json({ message: 'Location deleted successfully.' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, accessibility, addedBy } = req.body;

    if (!name || !address || !accessibility || !addedBy) {
      return res.status(400).json({ message: 'Please fill all fields.' });
    }

    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json({ message: 'Location not found.' });
    }

    if (location.addedBy.toString() !== addedBy) {
      return res.status(403).json({ message: 'User not authorized to edit this location.' });
    }

    location.name = name;
    location.address = address;
    location.accessibility = accessibility;

    const updatedLocation = await location.save();
    res.status(200).json(updatedLocation);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;