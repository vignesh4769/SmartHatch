import express from 'express';
import { 
  login, 
  signup, 
  verifyEmail,
  forgotPassword, 
  verifyOTP,  // Make sure this is imported
  resetPassword 
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);  // This was likely missing
router.post('/reset-password', resetPassword);

export default router;