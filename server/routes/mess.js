import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createMessSchedule,
  getMessSchedules,
  updateMessSchedule,
  deleteMessSchedule,
  getMessStats
} from '../controllers/messController.js';

const router = express.Router();

router.use(protect);

// Mess schedule routes
router.route('/schedule')
  .post(admin, createMessSchedule)
  .get(getMessSchedules);

router.route('/schedule/:id')
  .put(admin, updateMessSchedule)
  .delete(admin, deleteMessSchedule);

// Mess statistics
router.get('/stats', admin, getMessStats);

export default router;