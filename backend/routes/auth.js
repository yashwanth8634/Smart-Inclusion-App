const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Volunteer = require('../models/Volunteer');

router.post('/register/user', async (req, res) => {
  try {
    const { fullName, email, phone, password, disabilityType, disabilityOther } = req.body;

    if (!fullName || !email || !phone || !password || !disabilityType) {
      return res.status(400).json({ message: 'Please fill all required fields, including disability type.' });
    }

    if (disabilityType === 'other' && !disabilityOther) {
      return res.status(400).json({ message: 'Please specify your disability type.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already registered as a User.' });
    }

    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ message: 'This email is already registered as a Volunteer.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      disabilityType: disabilityType,
      disabilityOther: disabilityType === 'other' ? disabilityOther : '',
    });
    
    await newUser.save();
    res.status(201).json({ message: 'User registration successful!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/register/volunteer', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ message: 'This email is already registered as a Volunteer.' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already registered as a User.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newVolunteer = new Volunteer({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });
    await newVolunteer.save();
    
    res.status(201).json({ message: 'Volunteer registration successful!' });

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

    const userPayload = {
      id: user._id,
      role: loginAs,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      disabilityType: loginAs === 'user' ? user.disabilityType : null,
    };

    const token = jwt.sign(
      { id: user._id, role: loginAs, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: userPayload
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/user/:id', async (req, res) => {
  try {
    const { fullName, phone, disabilityType, disabilityOther } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        phone,
        disabilityType,
        disabilityOther: disabilityType === 'other' ? disabilityOther : '',
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userPayload = {
      id: updatedUser._id,
      role: 'user',
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      disabilityType: updatedUser.disabilityType,
      disabilityOther: updatedUser.disabilityOther,
    };
    
    res.status(200).json(userPayload);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- NEW ROUTE 2: UPDATE VOLUNTEER PROFILE ---
router.put('/volunteer/:id', async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        phone,
      },
      { new: true }
    );

    if (!updatedVolunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    const userPayload = {
      id: updatedVolunteer._id,
      role: 'volunteer',
      fullName: updatedVolunteer.fullName,
      email: updatedVolunteer.email,
      phone: updatedVolunteer.phone,
    };
    
    res.status(200).json(userPayload);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;