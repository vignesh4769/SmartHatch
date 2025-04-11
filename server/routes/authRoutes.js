import express from 'express';
import {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  uploadDocument
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/employees')
  .get(protect, admin, getEmployees);

router.route('/employees/:id')
  .get(protect, admin, getEmployeeById)
  .put(protect, admin, updateEmployee)
  .delete(protect, admin, deleteEmployee);

router.post('/employees/:id/documents', 
  protect, 
  admin, 
  upload.single('document'), 
  uploadDocument
);

export default router;