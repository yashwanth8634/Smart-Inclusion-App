const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Volunteer = require('../models/Volunteer');

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password, disabilityType, isVolunteer } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      disabilityType: disabilityType || 'none',
    });
    
    await newUser.save();

    if (isVolunteer) {
      const existingVolunteer = await Volunteer.findOne({ email });
      if (!existingVolunteer) {
        const newVolunteer = new Volunteer({
          fullName,
          email,
          phone,
          password: hashedPassword,
        });
        await newVolunteer.save();
      }
    }

    res.status(201).json({ message: 'Registration successful!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, loginAs } = req.body;

    if (!email || !password || !loginAs) {
      return res.status(400).json({ message: 'Please provide email, password, and role.' });
    }

    let user;
    if (loginAs === 'user') {
      user = await User.findOne({ email });
    } else if (loginAs === 'volunteer') {
      user = await Volunteer.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const payload = {
      id: user._id,
      role: loginAs,
      fullName: user.fullName,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    res.status(200).json({
      token,
      user: payload
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;