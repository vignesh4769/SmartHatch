import express from 'express';
import {
  registerVisitor,
  checkoutVisitor,
  getVisitors,
  getVisitorStats
} from '../controllers/visitorController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Base routes with authentication
router.use(protect);

// Regular visitor management routes
router.post('/', registerVisitor);
router.put('/:id/checkout', checkoutVisitor);
router.get('/', getVisitors);

// Admin only routes
router.get('/stats', admin, getVisitorStats);

export default router;