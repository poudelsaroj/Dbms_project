const express = require('express');
const router = express.Router();
const schedulingController = require('../controllers/schedulingController');

// GET all schedules
router.get('/', schedulingController.getAllSchedules);

// POST create new schedule
router.post('/', schedulingController.createSchedule);

// GET single schedule
router.get('/:id', schedulingController.getSchedule);

// PUT update schedule
router.put('/:id', schedulingController.updateSchedule);

// DELETE schedule
router.delete('/:id', schedulingController.deleteSchedule);

module.exports = router; 