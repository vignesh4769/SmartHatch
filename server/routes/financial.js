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

// Placeholder routes for financial management
router.get('/', protect, (req, res) => {
  res.json({ message: 'Financial routes will be implemented soon' });
});

export default router;