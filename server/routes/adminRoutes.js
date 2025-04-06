import express from 'express';
import { 
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  createRun,
  manageLeaveRequests
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.route('/employees')
  .post(createEmployee)
  .get(getEmployees);

router.route('/employees/:id')
  .put(updateEmployee)
  .delete(deleteEmployee);

router.post('/runs', createRun);
router.put('/leaves/:id', manageLeaveRequests);

export default router;