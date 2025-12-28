const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register (admin only)
router.post('/register', authController.register);
// Login (email/password or PIN)
router.post('/login', authController.login);

module.exports = router;
