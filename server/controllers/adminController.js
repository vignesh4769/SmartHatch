import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import LeaveRequest from '../models/LeaveRequest.js';
import Employee from '../models/Employee.js';

// Get dashboard statistics
// Get pending leave requests

export const getPendingLeaves = async (req, res) => {
  try {
    const hatcheryId = req.user.hatchery;
    const pendingLeaves = await LeaveRequest.find({ 
      hatcheryId,
      status: 'pending' 
    }).populate('employeeId', 'name employeeId');
    
    res.status(200).json(pendingLeaves);
  } catch (error) {
    console.error('Error fetching pending leaves:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching pending leaves' 
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        error: "Authentication required"
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get total employees
    const totalEmployees = await Employee.countDocuments({
      deletedAt: null
    });

    // Get recent activities (last 5)
    const recentActivities = await Employee.find({
      deletedAt: null
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('firstName lastName email createdAt')
    .lean();

    // Format recent activities
    const formattedActivities = recentActivities.map(activity => ({
      ...activity,
      name: `${activity.firstName} ${activity.lastName}`,
      type: 'employee_added',
      date: activity.createdAt
    }));

    // Initialize attendance stats
    const attendanceStats = {
      present: 0,
      absent: totalEmployees,
      late: 0,
      'half-day': 0,
      'on-leave': 0
    };

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        pendingLeaves: 0,
        attendanceStats,
        recentActivities: formattedActivities
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching dashboard stats',
      details: error.message
    });
  }
};

export const getEmployeeDetails = async (req, res) => {
  try {
    if (!req.user?._id) {
      console.error("No user ID in request");
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const admin = await User.findById(req.user._id);
    if (!admin) {
      console.error("Admin not found for ID:", req.user._id);
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    if (admin.role !== "admin") {
      console.error("User is not an admin:", req.user);
      return res.status(403).json({
        success: false,
        error: "Not authorized as an admin",
      });
    }

    const employee = await Employee.findOne({
      _id: req.params.id,
      hatchery: admin.hatcheryName,
      deletedAt: null,
    }).select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Get employee details error:", {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      error: "Server error while fetching employee details",
    });
  }
};