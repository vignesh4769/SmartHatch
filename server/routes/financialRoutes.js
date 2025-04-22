import express from 'express';
import { recordTransaction, getTransactions,updateTransaction,deleteTransaction} from '../controllers/financialController.js';

const financialRoutes = express.Router();

financialRoutes.post('/transactions', recordTransaction);
financialRoutes.get('/transactions', getTransactions);
financialRoutes.put('/transactions/:id', updateTransaction);
financialRoutes.delete('/transactions/:id', deleteTransaction);
export default financialRoutes;
