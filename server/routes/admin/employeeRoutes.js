import express from 'express';
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee
} from '../../controllers/admin/employeeController.js';
import { protect, admin } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createEmployee)
  .get(protect, admin, getEmployees);

router.route('/:id')
  .put(protect, admin, updateEmployee)
  .delete(protect, admin, deleteEmployee);

export default router;