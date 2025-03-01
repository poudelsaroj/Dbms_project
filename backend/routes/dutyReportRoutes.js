const express = require('express');
const router = express.Router();
const dutyReportController = require('../controllers/dutyReportController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.use(authMiddleware.authenticateUser);

// Duty report routes
router.post('/', dutyReportController.createDutyReport);
router.get('/exam/:examId', dutyReportController.getExamDutyReports);
router.get('/invigilator/:invigilatorId', dutyReportController.getInvigilatorDutyReports);
router.put('/:id', dutyReportController.updateDutyReport);
router.delete('/:id', authMiddleware.authorizeAdmin, dutyReportController.deleteDutyReport);

module.exports = router; 