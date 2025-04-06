import express from 'express';
import { 
  createRun,
  getRuns,
  updateRunStatus,
  getRunDetails
} from '../controllers/runController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, createRun);
router.get('/', protect, admin, getRuns);
router.put('/:id/status', protect, admin, updateRunStatus);
router.get('/:id', protect, admin, getRunDetails);

export default router;