import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getDashboardStats } from '../controllers/adminController.js';
import * as runController from '../controllers/runController.js';
import {
  getEmployees,
  registerEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';
import { getPendingLeaves } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, admin);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);
router.get('/runs', runController.getRuns);

// Employee Management
router.get('/employees', getEmployees);


router.post('/employees/register', registerEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

// Leave Management
router.get('/leaves/pending', getPendingLeaves);

export default router;