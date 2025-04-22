import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getDashboardStats } from '../controllers/adminController.js';
import {
  getEmployees,
  registerEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
  
} from '../controllers/employeeController.js';

import { getPendingLeaves } from '../controllers/adminController.js';

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
  deleteMessSchedule
} from '../controllers/messController.js';

const router = express.Router();

router.use(protect, admin);

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// Employee management
router.route('/employees')
  .get(getEmployees)
  .post(registerEmployee);

// Change this route
// Change this to be consistent
router.route('/employees/:id')
  .get(getEmployee)  // Add this if you want to fetch single employee
  .put(updateEmployee)
  .delete(deleteEmployee);

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
router.route('/mess')
  .post(createMessSchedule)
  .get(getMessSchedules);

router.route('/mess/:id')
  .put(updateMessSchedule)
  .delete(deleteMessSchedule);
export default router;