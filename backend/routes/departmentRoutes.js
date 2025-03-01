const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.use(authMiddleware.authenticateUser);

// Department routes
router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartment);
router.post('/', authMiddleware.authorizeAdmin, departmentController.createDepartment);
router.put('/:id', authMiddleware.authorizeAdmin, departmentController.updateDepartment);
router.delete('/:id', authMiddleware.authorizeAdmin, departmentController.deleteDepartment);

module.exports = router; 