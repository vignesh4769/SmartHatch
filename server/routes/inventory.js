import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  addInventoryItem,
  getInventoryItems,
  updateInventoryItem,
  deleteInventoryItem,
  createStockRequest,
  getStockRequests,
  updateStockRequest
} from '../controllers/inventoryController.js';

const router = express.Router();

// Placeholder routes for inventory management
router.get('/', protect, (req, res) => {
  res.json({ message: 'Inventory routes will be implemented soon' });
});

router.use(protect);

// Inventory management routes
router.route('/')
  .post(admin, addInventoryItem)
  .get(getInventoryItems);

router.route('/:id')
  .put(admin, updateInventoryItem)
  .delete(admin, deleteInventoryItem);

// Stock request routes
router.route('/stock-requests')
  .post(createStockRequest)
  .get(admin, getStockRequests);

router.put('/stock-requests/:id', admin, updateStockRequest);

export default router;