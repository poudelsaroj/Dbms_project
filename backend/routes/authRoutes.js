const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Authentication routes
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/verify', auth.verifyToken, authController.verifyToken);
router.post('/logout', auth.verifyToken, authController.logout);

module.exports = router;