import express from 'express';
import { 
  protect, 
  admin 
} from '../middleware/authMiddleware.js';
import {
  getEmployees,
  registerEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';

const router = express.Router();

// Get all employees for a hatchery
router.get('/', protect, admin, getEmployees);

// Register a new employee
router.post('/', registerEmployee);

// Update employee
router.put('/:employeeId', protect, admin, updateEmployee);

// Delete employee
router.delete('/:employeeId', protect, admin, deleteEmployee);

export default router;