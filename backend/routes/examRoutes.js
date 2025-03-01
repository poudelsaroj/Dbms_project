const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Admin-only routes
router.post('/', authorizeAdmin, examController.createExam);
router.put('/:id', authorizeAdmin, examController.updateExam);
router.delete('/:id', authorizeAdmin, examController.deleteExam);

// Routes accessible by both admin and invigilators
router.get('/', examController.getAllExams);
router.get('/:id', examController.getExam);

// Additional exam-related routes
router.get('/department/:departmentId', examController.getExamsByDepartment);
router.get('/room/:roomId', examController.getExamsByRoom);
router.get('/date/:date', examController.getExamsByDate);

module.exports = router;