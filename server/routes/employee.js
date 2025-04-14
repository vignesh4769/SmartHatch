import express from 'express';
import { 
  protect, 
  admin 
} from '../middleware/authMiddleware.js';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';

const router = express.Router();

router.use(protect, admin);

router.route('/register')
  .post(protect, admin, createEmployee);

router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.route('/:id')
  .get(getEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;