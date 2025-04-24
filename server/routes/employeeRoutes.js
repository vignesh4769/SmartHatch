import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMess } from '../controllers/messController.js';
import { getMyAttendance, getMonthlyReport } from '../controllers/attendanceController.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

// Attendance routes
router.get('/attendance', getMyAttendance);
router.get('/attendance/report', getMonthlyReport);

// Mess routes
router.get('/mess', async (req, res) => {
  try {
    console.log('Accessing employee mess route');
    await getMess(req, res);
  } catch (error) {
    console.error('Error in employee mess route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch mess data' 
    });
  }
});

export default router;
