const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.use(authMiddleware.authenticateUser);

// Class routes
router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClass);
router.post('/', authMiddleware.authorizeAdmin, classController.createClass);
router.put('/:id', authMiddleware.authorizeAdmin, classController.updateClass);
router.delete('/:id', authMiddleware.authorizeAdmin, classController.deleteClass);

module.exports = router;