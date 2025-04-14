import express from 'express';
import { 
  createRun,
  getRuns,
  updateRunStatus,
  getRunDetails,
  deleteRun,
  addEmployeeToRun,
  removeEmployeeFromRun,
  getRunStatistics
} from '../controllers/runController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new run
router.post('/', protect, admin, createRun);

// Get all runs
router.get('/', protect, admin, getRuns);

// Get single run details
router.get('/:id', protect, admin, getRunDetails);

// Update run status
router.put('/:id/status', protect, admin, updateRunStatus);

// Delete (soft delete) a run
router.delete('/:id', protect, admin, deleteRun);

// Add employee to run
router.post('/:id/employees', protect, admin, addEmployeeToRun);

// Remove employee from run
router.delete('/:id/employees/:employeeId', protect, admin, removeEmployeeFromRun);

// Get run statistics
router.get('/:id/statistics', protect, admin, getRunStatistics);

export default router;