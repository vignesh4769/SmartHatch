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

router.route('/employees').get(protect, admin, getEmployeesByHatchery);
router.post('/', protect, admin, recordAttendance);
router.post('/submit', protect, admin, submitAttendanceRecords);
router.get('/', protect, admin, getAttendanceByDate);
router.put('/:id', protect, admin, updateAttendance);

export default router;