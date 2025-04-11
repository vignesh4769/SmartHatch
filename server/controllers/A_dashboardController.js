import asyncHandler from 'express-async-handler';
import Employee from '../models/A_Employee.js';
import User from '../models/User.js';
import Run from '../models/Run.js';

export const getDashboardData = asyncHandler(async (req, res) => {
  try {
    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      suspendedEmployees,
      activeRuns,
      totalUsers,
      recentEmployees
    ] = await Promise.all([
      Employee.countDocuments({ deletedAt: null, admin: req.user._id }), // Filter by admin
      Employee.countDocuments({ status: 'active', deletedAt: null, admin: req.user._id }),
      Employee.countDocuments({ status: 'inactive', deletedAt: null, admin: req.user._id }),
      Employee.countDocuments({ status: 'suspended', deletedAt: null, admin: req.user._id }),
      Run.countDocuments({ status: 'active' }),
      User.countDocuments(),
      Employee.find({ deletedAt: null, admin: req.user._id }) // Filter by admin
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
    ]);

    res.json({
      success: true,
      data: {
        employeeCount: totalEmployees,
        activeEmployees,
        inactiveEmployees,
        suspendedEmployees,
        activeRuns,
        totalUsers,
        recentEmployees
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
});