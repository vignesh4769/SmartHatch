import express from 'express';
import { recordTransaction, getTransactions } from '../controllers/financialController.js';

const financialRoutes = express.Router();

financialRoutes.post('/transactions', recordTransaction);
financialRoutes.get('/transactions', getTransactions);

export default financialRoutes;
