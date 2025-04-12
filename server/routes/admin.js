import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getDashboardStats } from '../controllers/adminController.js';
import {
  getEmployees,
  registerEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';

const router = express.Router();

router.use(protect, admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Employee Management
router.get('/employees', getEmployees);
router.post('/employees/register', registerEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

export default router;