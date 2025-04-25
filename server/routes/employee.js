import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMess } from '../controllers/messController.js';
import {
  createLeaveRequest,
  getEmployeeLeaves
} from '../controllers/leaveController.js';
import { getEmployeeAttendanceByMonth } from '../controllers/attendanceController.js';
import { createStockRequest, getStockRequests } from '../controllers/inventoryController.js';
import { createEmployeeStockRequest, getEmployeeStockRequests } from '../controllers/employeeStockRequestController.js';

const router = express.Router();

router.use(protect);

// Employee mess routes
router.get('/mess', getMess);

// Employee leave management routes
router.post('/leaves', protect, createLeaveRequest);
router.get('/leaves', protect, getEmployeeLeaves);

// Employee attendance routes
router.get('/attendance', getEmployeeAttendanceByMonth);

// Inventory stock requests for employees
router.route('/inventory/stock-requests')
  .post(createEmployeeStockRequest)
  .get(getEmployeeStockRequests);

export default router;
