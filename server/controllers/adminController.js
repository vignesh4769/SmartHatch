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
    const hatcheryName = req.user.hatcheryName;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get total employees for this hatchery
    const totalEmployees = await Employee.countDocuments({
      hatchery: hatcheryName,
      deletedAt: null
    });

    // Get active employees (verified)
    const activeEmployees = await User.countDocuments({
      hatcheryName,
      role: 'employee',
      isVerified: true
    });

    // Get today's attendance
    const todayAttendance = await Attendance.aggregate([
      {
        $match: {
          date: today,
          employeeId: { 
            $in: await User.find({ hatcheryName, role: 'employee' }).distinct('_id')
          }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to more usable format
    const attendanceStats = {
      present: 0,
      absent: activeEmployees, // Default to all active employees (will be reduced by present count)
      late: 0,
      'half-day': 0,
      'on-leave': 0
    };

    todayAttendance.forEach(stat => {
      attendanceStats[stat._id] = stat.count;
      if (stat._id === 'present') {
        attendanceStats.absent = activeEmployees - stat.count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        presentToday: attendanceStats.present,
        onLeaveToday: attendanceStats['on-leave']
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching dashboard stats' 
    });
  }
};