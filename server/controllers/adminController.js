import User from '../models/User.js';
import Attendance from '../models/Attendance.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const hatcheryId = req.user.hatcheryId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get total employees
    const totalEmployees = await User.countDocuments({ 
      hatcheryId,
      role: 'employee' 
    });

    // Get active employees (verified)
    const activeEmployees = await User.countDocuments({ 
      hatcheryId,
      role: 'employee',
      isVerified: true 
    });

    // Get today's attendance
    const todayAttendance = await Attendance.aggregate([
      {
        $match: {
          date: today,
          employeeId: { 
            $in: await User.find({ hatcheryId, role: 'employee' }).distinct('_id') 
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