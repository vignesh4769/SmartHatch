import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMess } from '../controllers/messController.js';

const router = express.Router();

router.use(protect);

// Employee mess routes
router.get('/mess', getMess);

export default router;
