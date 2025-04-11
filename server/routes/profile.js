import express from 'express';
import { 
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/profileController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getProfile);
router.put('/', upload.single('profileImage'), updateProfile);
router.put('/change-password', changePassword);

export default router;