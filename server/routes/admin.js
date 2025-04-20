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
import {
  registerVisitor,
  checkoutVisitor,
  getVisitors,
  getVisitorStats
} from '../controllers/visitorController.js';
import {
  recordAttendance,
  getAttendanceByDate,
  updateAttendance,
  submitAttendanceRecords,
} from '../controllers/attendanceController.js';
import {
  createFinancialRecord,
  recordTransaction,
  getFinancialStats,
  getTransactions,
  updateTransaction,
  deleteTransaction
} from '../controllers/financialController.js';
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
  getMessStats
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
  .put(updateEmployee)
  .delete(deleteEmployee);

// Visitor management
router.route('/visitors')
  .post(registerVisitor)
  .get(getVisitors);

router.put('/visitors/:id/checkout', checkoutVisitor);
router.get('/visitors/stats', getVisitorStats);

// Leave management
router.get('/pending-leaves', getPendingLeaves);

// Attendance management
router.route('/attendance')
  .post(recordAttendance)
  .get(getAttendanceByDate);

router.post('/attendance/submit', submitAttendanceRecords);
router.put('/attendance/:id', updateAttendance);

// Financial management
router.route('/financials')
  .post(createFinancialRecord)
  .get(getFinancialStats);

router.route('/financials/transactions')
  .post(recordTransaction)
  .get(getTransactions);

router.route('/financials/transactions/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

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
router.route('/mess/schedule')
  .post(createMessSchedule)
  .get(getMessSchedules);

router.route('/mess/schedule/:id')
  .put(updateMessSchedule)
  .delete(deleteMessSchedule);

router.get('/mess/stats', getMessStats);

export default router;