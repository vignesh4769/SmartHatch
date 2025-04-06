const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), employeeController.createEmployee);
router.get('/', protect, authorize('admin'), employeeController.getAllEmployees);
router.get('/:id', protect, employeeController.getEmployee);
router.put('/:id', protect, employeeController.updateEmployee);
router.delete('/:id', protect, authorize('admin'), employeeController.deleteEmployee);
router.get('/dashboard/my', protect, employeeController.getEmployeeDashboard);

module.exports = router;