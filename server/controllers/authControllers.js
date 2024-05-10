// authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model defined
// Import the JWT token blacklist model
const BlacklistedToken = require('../models/BlacklistedToken');
// Function to handle user login
exports.login = async (req, res) => {
    const { f_userName, f_Pwd } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ f_userName });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'Invalid login credentials' });
    }

    // Validate password
    const passwordMatch = await bcrypt.compare(f_Pwd, user.f_Pwd);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ AdminName: user.f_userName, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.createUser = async (req, res) => {
  const { f_userName, f_Pwd } = req.body;

  try {
    // Check if username and password are provided
    if (!f_userName || !f_Pwd) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ f_userName });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const saltRounds = 10;
    // Hash the password
    const hashedPassword = await bcrypt.hash(f_Pwd, saltRounds);

    // Create new user
    const newUser = new User({
      f_userName,
      f_Pwd: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// authController.js


exports.logout = async (req, res) => {
    try {
      // Check if authorization header is present
      if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Authorization header is missing' });
      }
  
      // Get the token from the request headers
      const token = req.headers.authorization.split(' ')[1];
  
      // Add the token to the blacklist
      const blacklistedToken = new BlacklistedToken({
        token
      });
      await blacklistedToken.save();
  
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  