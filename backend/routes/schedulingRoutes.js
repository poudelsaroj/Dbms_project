const express = require('express');
const router = express.Router();
const schedulingController = require('../controllers/schedulingController');
const { authenticateUser } = require('../middleware/authMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const schedulingValidation = require('../middleware/schedulingValidation');

// Routes with proper controllers
router.get('/', authenticateUser, schedulingController.getSchedules);
router.post('/', authMiddleware.authenticateUser, authMiddleware.authorizeAdmin, schedulingValidation.validateExamSchedule, schedulingController.createSchedule);
router.put('/:id', authMiddleware.authenticateUser, authMiddleware.authorizeAdmin, schedulingController.updateSchedule);
router.delete('/:id', authMiddleware.authenticateUser, authMiddleware.authorizeAdmin, schedulingController.deleteSchedule);

module.exports = router;