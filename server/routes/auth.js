import express from 'express';
import { 
  login, 
  signup, 
  verifyEmail,
  forgotPassword, 
  verifyOTP, 
  resetPassword,
  logout 
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);  
router.post('/reset-password', resetPassword);
router.post('/logout', logout);
export default router;