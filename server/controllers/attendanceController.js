import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import mongoose from 'mongoose';

// Get attendance by date
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({ date: queryDate })
      .populate('employeeId', 'firstName lastName email department')
      .populate('recordedBy', 'firstName lastName');

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch attendance records'
    });
  }
};

// Submit multiple attendance records
export const submitAttendanceRecords = async (req, res) => {
  try {
    const { records } = req.body;
    const recordedBy = req.user._id;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No attendance records provided'
      });
    }

    const date = new Date(records[0].date);
    date.setHours(0, 0, 0, 0);

    // Get all active employees
    const employees = await Employee.find({ deletedAt: null });
    const employeeIds = employees.map(emp => emp._id.toString());

    // Validate all records
    for (const record of records) {
      try {
        // Convert the record's employeeId to string for comparison
        const recordEmployeeId = record.employeeId.toString();
        
        // Check if employee exists and is active
        const employee = await Employee.findById(recordEmployeeId);
        if (!employee) {
          return res.status(400).json({
            success: false,
            error: `Invalid employee ID: ${recordEmployeeId}`
          });
        }
        
        if (employee.deletedAt !== null) {
          return res.status(400).json({
            success: false,
            error: `Employee ${employee.firstName} ${employee.lastName} is no longer active`
          });
        }

        // Validate check-in time if provided
        if (record.checkIn && ['present', 'late', 'half-day'].includes(record.status)) {
          const checkInTime = new Date(record.checkIn);
          if (isNaN(checkInTime.getTime())) {
            return res.status(400).json({
              success: false,
              error: `Invalid check-in time for employee: ${employee.firstName} ${employee.lastName}`
            });
          }
        }
      } catch (err) {
        console.error('Error validating record:', err);
        return res.status(400).json({
          success: false,
          error: `Invalid record data for employee ID: ${record.employeeId}`
        });
      }
    }

    // Check for existing records
    const existingRecords = await Attendance.find({
      employeeId: { $in: records.map(r => mongoose.Types.ObjectId(r.employeeId)) },
      date
    });

    if (existingRecords.length > 0) {
      const existingEmployees = await Employee.find({
        _id: { $in: existingRecords.map(r => r.employeeId) }
      });
      
      const employeeNames = existingEmployees
        .map(emp => `${emp.firstName} ${emp.lastName}`)
        .join(', ');

      return res.status(400).json({
        success: false,
        error: `Attendance already recorded for: ${employeeNames}`
      });
    }

    // Create attendance records
    const attendanceRecords = records.map(record => ({
      employeeId: mongoose.Types.ObjectId(record.employeeId),
      date,
      status: record.status,
      checkIn: record.checkIn ? new Date(record.checkIn) : null,
      recordedBy: mongoose.Types.ObjectId(recordedBy)
    }));

    try {
      await Attendance.insertMany(attendanceRecords);

      res.status(201).json({
        success: true,
        message: 'Attendance records submitted successfully'
      });
    } catch (err) {
      console.error('Error inserting records:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to save attendance records'
      });
    }

  } catch (error) {
    console.error('Error submitting attendance records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit attendance records'
    });
  }
};

// Record single attendance
export const recordAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, checkIn } = req.body;
    const recordedBy = req.user._id;

    if (!employeeId || !date || !status) {
      return res.status(400).json({
        success: false,
        error: 'Employee ID, date and status are required'
      });
    }

    // Check if employee exists and is active
    const employee = await Employee.findOne({
      _id: employeeId,
      deletedAt: null
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found or is no longer active'
      });
    }

    // Parse dates
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already recorded for this date
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: attendanceDate
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        error: `Attendance already recorded for ${employee.firstName} ${employee.lastName} on the selected date`
      });
    }

    // Create and save the attendance record
    const attendance = new Attendance({
      employeeId: mongoose.Types.ObjectId(employeeId),
      date: attendanceDate,
      status,
      checkIn: checkIn ? new Date(checkIn) : null,
      recordedBy: mongoose.Types.ObjectId(recordedBy)
    });

    await attendance.save();

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully'
    });

  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record attendance'
    });
  }
};

// Get my attendance (for employees)
export const getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({
        success: false,
        error: 'Month parameter is required (YYYY-MM format)'
      });
    }

    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    const attendanceRecords = await Attendance.find({
      employeeId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });

    res.json({
      success: true,
      data: attendanceRecords
    });

  } catch (error) {
    console.error('Error fetching employee attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch attendance records'
    });
  }
};

// Get monthly report (for employees)
export const getMonthlyReport = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        error: 'Month and year are required'
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceRecords = await Attendance.find({
      employeeId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    // Calculate statistics
    const stats = {
      total: attendanceRecords.length,
      present: attendanceRecords.filter(r => r.status === 'present').length,
      absent: attendanceRecords.filter(r => r.status === 'absent').length,
      late: attendanceRecords.filter(r => r.status === 'late').length,
      halfDay: attendanceRecords.filter(r => r.status === 'half-day').length,
      onLeave: attendanceRecords.filter(r => r.status === 'on-leave').length,
      notMarked: attendanceRecords.filter(r => r.status === 'not-marked').length
    };

    res.json({
      success: true,
      data: {
        records: attendanceRecords,
        statistics: stats
      }
    });

  } catch (error) {
    console.error('Error generating monthly report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate monthly report'
    });
  }
};