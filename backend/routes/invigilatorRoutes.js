const express = require('express');
const router = express.Router();
const invigilatorController = require('../controllers/invigilatorController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.use(authMiddleware.authenticateUser);

// Admin only routes
router.post('/', authMiddleware.authorizeAdmin, invigilatorController.createInvigilator);
router.get('/', authMiddleware.authorizeAdmin, invigilatorController.getAllInvigilators);
router.get('/:id', authMiddleware.authorizeAdmin, invigilatorController.getInvigilator);
router.put('/:id', authMiddleware.authorizeAdmin, invigilatorController.updateInvigilator);
router.delete('/:id', authMiddleware.authorizeAdmin, invigilatorController.deleteInvigilator);

module.exports = router;
