const express = require('express');
const cors =require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const http = require('http');
const { Server } = require("socket.io");

const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/locations');
const schemeRoutes = require('./routes/schemes');

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
app.use('/api/locations', locationRoutes);
app.use('/api/schemes', schemeRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the Smart Inclusion Server!');
});

const PORT = 3000;

// --- Socket.io Setup ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('send_sos', (data) => {
    console.log('SOS Received:', data);
    io.emit('receive_sos', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
// -----------------------

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});