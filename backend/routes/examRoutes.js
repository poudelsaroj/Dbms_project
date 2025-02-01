const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { validateExamSchedule } = require('../middleware/schedulingValidation');

router.post('/', validateExamSchedule, examController.createExam);
router.get('/', examController.getAllExams);
router.put('/:id', validateExamSchedule, examController.updateExam);
router.delete('/:id', examController.deleteExam);

module.exports = router; 