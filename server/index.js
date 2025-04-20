import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { protect } from './middleware/authMiddleware.js';

// Route imports
import attendanceRoutes from './routes/attendance.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/admin.js';
import employeeRoutes from './routes/employee.js';
import visitorRoutes from './routes/visitor.js';
import financialRoutes from './routes/financial.js';
import messRoutes from './routes/mess.js';
import inventoryRoutes from './routes/inventory.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/financials', financialRoutes);
app.use('/api/mess', messRoutes);
app.use('/api/inventory', inventoryRoutes);

// Health check endpoint
app.get('/api/health', protect, (req, res) => {
  res.json({ status: 'OK' });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});