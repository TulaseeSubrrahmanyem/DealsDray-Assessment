// routes/adminauth/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

const authMiddleware = require('../middleware/authMiddleware');

// Route to handle user login
router.post('/login', authController.login);

// Route to handle user creation
router.post('/create', authController.createUser);

router.post('/logout', authController.logout);
module.exports = router;
