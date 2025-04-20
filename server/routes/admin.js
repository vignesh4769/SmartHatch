import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getDashboardStats } from '../controllers/adminController.js';
import {
  getEmployees,
  registerEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';
import { getPendingLeaves } from '../controllers/adminController.js';
import { getVisitors } from '../controllers/visitorController.js';

const router = express.Router();

router.use(protect, admin);

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// Employee management
router.get('/employees', getEmployees);
router.get('/visitors', getVisitors);
router.post('/employees', registerEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

// Leave management
router.get('/pending-leaves', getPendingLeaves);

export default router;