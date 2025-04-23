import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { protect } from './middleware/authMiddleware.js';
// Route imports
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/admin.js';
import VistorRouter from './routes/VisitorRoutes.js';
import financialRoutes from './routes/financialRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/visitor', VistorRouter);
app.use('/api/financials', financialRoutes);
app.use('/api/employees/mess', employeeRoutes);
app.get('/', protect, (req, res) => {
  res.json({ status: 'OK' , message: 'Server is running' });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});