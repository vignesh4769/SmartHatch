import express from 'express';
import { 
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/profileController.js';


const router = express.Router();

router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/change-password', changePassword);

export default router;