import express from 'express';
import { 
  recordAttendance,
  getAttendanceByDate,
  updateAttendance
} from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/', recordAttendance);
router.get('/', getAttendanceByDate);
router.put('/:id', updateAttendance);

export default router;