const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/locations'); // 1. Import

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB connection established successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes); // 2. Use

app.get('/', (req, res) => {
  res.send('Hello from the Smart Inclusion Server!');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});