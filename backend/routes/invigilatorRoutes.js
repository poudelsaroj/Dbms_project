const express = require('express');
const router = express.Router();
const invigilatorController = require('../controllers/invigilatorController');

// GET all invigilators
router.get('/', invigilatorController.getAllInvigilators);

// POST create new invigilator
router.post('/', invigilatorController.createInvigilator);

// GET single invigilator
router.get('/:id', invigilatorController.getInvigilator);

// PUT update invigilator
router.put('/:id', invigilatorController.updateInvigilator);

// DELETE invigilator
router.delete('/:id', invigilatorController.deleteInvigilator);

module.exports = router;
