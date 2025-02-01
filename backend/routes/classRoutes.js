const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

// Get all classes
router.get('/', classController.getAllClasses);

// Create new class
router.post('/', classController.createClass);

// Get available classes for a time slot
router.get('/available', classController.getAvailableClasses);

// Get single class
router.get('/:id', classController.getClass);

// Update class
router.put('/:id', classController.updateClass);

// Delete class
router.delete('/:id', classController.deleteClass);

module.exports = router; 