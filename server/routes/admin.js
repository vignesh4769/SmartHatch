import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getDashboardStats } from '../controllers/adminController.js';
import {
  getEmployees,
  registerEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';
import {
  getAttendanceByDate,
  recordAttendance,
  submitAttendanceRecords
} from '../controllers/attendanceController.js';
import {
  getPendingLeaves
} from '../controllers/adminController.js';
import {
  addInventoryItem,
  getInventoryItems,
  updateInventoryItem,
  deleteInventoryItem,
  createStockRequest,
  getStockRequests,
  updateStockRequest
} from '../controllers/inventoryController.js';
import {
  createMessSchedule,
  getMessSchedules,
  updateMessSchedule,
  deleteMessSchedule,
  getMess
} from '../controllers/messController.js';

const router = express.Router();

router.use(protect, admin);

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// Employee management
router.route('/employees')
  .get(getEmployees)
  .post(registerEmployee);

router.route('/employees/:id')
  .get(getEmployee)  
  .put(updateEmployee)
  .delete(deleteEmployee);

router.get('/pending-leaves', getPendingLeaves);

// Attendance routes
router.get('/attendance', getAttendanceByDate);
router.post('/attendance', recordAttendance);
router.post('/attendance/bulk', submitAttendanceRecords);

// Inventory management
router.route('/inventory')
  .post(addInventoryItem)
  .get(getInventoryItems);

router.route('/inventory/:id')
  .put(updateInventoryItem)
  .delete(deleteInventoryItem);

router.route('/inventory/stock-requests')
  .post(createStockRequest)
  .get(getStockRequests);

router.put('/inventory/stock-requests/:id', updateStockRequest);

// Mess management
router.route('/mess')
  .post(createMessSchedule)
  .get(getMessSchedules);
  
router.route('/mess/employees').get(getMess);

router.route('/mess/:id')
  .put(updateMessSchedule)
  .delete(deleteMessSchedule);

export default router;