// app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const adminAuthRoute = require('./routes/adminAuthRoute')
const authMiddleware = require('./middleware/authMiddleware');
const employeeRoutes = require('./routes/employeeRoute');
const path = require('path');
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Connect to MongoDB
try {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected');
} catch (error) {
  console.error('MongoDB connection error:', error);
}

app.use(cors());
// Routes
app.use('/adminauth', adminAuthRoute);
app.use('/employees', employeeRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 3000;
try {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (error) {
  console.error('Server startup error:', error);
}
