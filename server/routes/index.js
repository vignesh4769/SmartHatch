import express from 'express';
import authRoutes from './authRoutes.js';
import employeeRoutes from './admin/employeeRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('api/admin/employees', employeeRoutes);

export default router;