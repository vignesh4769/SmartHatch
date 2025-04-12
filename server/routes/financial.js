import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createFinancialRecord,
  recordTransaction,
  getFinancialStats,
  getTransactions,
  updateTransaction,
  deleteTransaction
} from '../controllers/financialController.js';

const router = express.Router();

router.use(protect);

// Financial records routes
router.route('/')
  .post(admin, createFinancialRecord)
  .get(admin, getFinancialStats);

// Transaction routes
router.route('/transactions')
  .post(admin, recordTransaction)
  .get(admin, getTransactions);

router.route('/transactions/:id')
  .put(admin, updateTransaction)
  .delete(admin, deleteTransaction);

export default router;