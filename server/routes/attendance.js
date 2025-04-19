import express from 'express';
import { 
  recordAttendance,
  getAttendanceByDate,
  updateAttendance,
  getEmployeesByHatchery,
  submitAttendanceRecords
} from '../controllers/attendanceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all employees for a hatchery
router.get('/employees', protect, admin, getEmployeesByHatchery);

// Record attendance for a single employee
router.post('/', protect, admin, recordAttendance);

// Submit multiple attendance records
router.post('/submit', protect, admin, submitAttendanceRecords);

// Get attendance by date
router.get('/', protect, admin, getAttendanceByDate);

// Update attendance record
router.put('/:id', protect, admin, updateAttendance);

export default router;