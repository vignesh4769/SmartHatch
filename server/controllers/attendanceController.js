import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

// Record attendance
export const recordAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, notes } = req.body;
    const recordedBy = req.user._id;
    const hatcheryId = req.user.hatcheryId;

    if (!employeeId || !date || !status) {
      return res.status(400).json({ 
        success: false, 
        error: 'Employee ID, date and status are required' 
      });
    }

    // Check if employee exists and belongs to the same hatchery
    const employee = await User.findOne({ 
      _id: employeeId, 
      hatcheryId,
      role: 'employee' 
    });

    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        error: 'Employee not found in your hatchery' 
      });
    }

    // Check if attendance already recorded for this date
    const existingAttendance = await Attendance.findOne({ 
      employeeId,
      date: new Date(date)
    });

    if (existingAttendance) {
      return res.status(400).json({ 
        success: false, 
        error: 'Attendance already recorded for this employee on the selected date' 
      });
    }

    // Create new attendance record
    const attendance = new Attendance({
      employeeId,
      date: new Date(date),
      status,
      notes,
      recordedBy
    });

    await attendance.save();

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: attendance
    });

  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while recording attendance' 
    });
  }
};

// Get attendance by date
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const hatcheryId = req.user.hatcheryId;

    if (!date) {
      return res.status(400).json({ 
        success: false, 
        error: 'Date is required' 
      });
    }

    // Get all employees for the hatchery
    const employees = await User.find({ 
      hatcheryId,
      role: 'employee' 
    }).select('_id firstName lastName profileImage');

    // Get attendance records for the date
    const attendanceRecords = await Attendance.find({ 
      date: new Date(date),
      employeeId: { $in: employees.map(e => e._id) }
    });

    // Combine employee data with attendance records
    const result = employees.map(employee => {
      const record = attendanceRecords.find(r => 
        r.employeeId.toString() === employee._id.toString()
      );
      
      return {
        employee: {
          _id: employee._id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          profileImage: employee.profileImage
        },
        attendance: record ? {
          status: record.status,
          notes: record.notes,
          recordedAt: record.createdAt
        } : null
      };
    });

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching attendance' 
    });
  }
};

// Update attendance
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ 
        success: false, 
        error: 'Status is required' 
      });
    }

    const attendance = await Attendance.findById(id);
    
    if (!attendance) {
      return res.status(404).json({ 
        success: false, 
        error: 'Attendance record not found' 
      });
    }

    // Check if the employee belongs to the same hatchery
    const employee = await User.findById(attendance.employeeId);
    if (!employee || employee.hatcheryId.toString() !== req.user.hatcheryId.toString()) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to update this attendance record' 
      });
    }

    attendance.status = status;
    if (notes !== undefined) attendance.notes = notes;
    await attendance.save();

    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });

  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while updating attendance' 
    });
  }
};