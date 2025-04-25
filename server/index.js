import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { protect } from './middleware/authMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/admin.js';
import VistorRouter from './routes/VisitorRoutes.js';
import financialRoutes from './routes/financialRoutes.js';
import employeeRoutes from './routes/employee.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', VistorRouter);
app.use('/api/financials', financialRoutes);
app.use('/api/employee', employeeRoutes);

app.get('/', protect, (req, res) => {
  res.json({ status: 'OK' , message: 'Server is running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});