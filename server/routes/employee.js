import express from 'express';
import { 
  protect, 
  employee 
} from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getMyAttendance,
  applyForLeave,
  getMyLeaves,
  getSalaryDetails,
  createStockRequest,
  getMessSchedule,
  getEmployeeProfile
} from '../controllers/employeeController.js';

const router = express.Router();

router.use(protect, employee);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Profile
router.get('/profile', getEmployeeProfile);

// Attendance
router.get('/attendance', getMyAttendance);

// Leaves
router.get('/leaves', getMyLeaves);
router.post('/leaves', applyForLeave);

// Salary
router.get('/salary', getSalaryDetails);

// Stock Requests
router.post('/stock-requests', createStockRequest);

// Mess
router.get('/mess-schedule', getMessSchedule);

export default router;