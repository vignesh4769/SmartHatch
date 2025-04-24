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

    res.json({ success: true, data: attendance });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch attendance records',
    });
  }
};

// Submit multiple attendance records
export const submitAttendanceRecords = async (req, res) => {
  try {
    const { records } = req.body;
    const recordedBy = req.user._id;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, error: 'No attendance records provided' });
    }

    console.log('Attendance bulk submission request body:', JSON.stringify(records, null, 2));

    // Get all active employee IDs
    const employees = await Employee.find({ deletedAt: null });
    const activeEmployeeIds = employees.map(emp => emp._id.toString());

    let upsertedCount = 0;
    let modifiedCount = 0;
    let failedRecords = [];
    for (const record of records) {
      try {
        if (!record.employeeId || !record.status || !record.date) {
          console.log('Skipping record (missing fields):', record);
          failedRecords.push({ record, error: 'Missing fields' });
          continue;
        }
        const employeeId = record.employeeId.toString();
        const normalizedDate = new Date(record.date);
        normalizedDate.setHours(0, 0, 0, 0);
        if (!activeEmployeeIds.includes(employeeId)) {
          console.log('Skipping record (inactive/invalid employee):', record);
          failedRecords.push({ record, error: 'Inactive or invalid employee ID' });
          continue;
        }
        if (record.checkIn && ['present', 'late', 'half-day'].includes(record.status)) {
          const checkInDate = new Date(record.checkIn);
          if (isNaN(checkInDate.getTime())) {
            console.log('Skipping record (invalid check-in):', record);
            failedRecords.push({ record, error: 'Invalid check-in time' });
            continue;
          }
        }
        const filter = { employeeId: new mongoose.Types.ObjectId(employeeId), date: normalizedDate };
        const update = {
          $set: {
            status: record.status,
            checkIn: record.checkIn ? new Date(record.checkIn) : null,
            recordedBy: new mongoose.Types.ObjectId(recordedBy),
            date: normalizedDate
          }
        };
        const result = await Attendance.updateOne(filter, update, { upsert: true });
        console.log('Upsert result for', filter, ':', result);
        if (result.upsertedCount > 0) upsertedCount++;
        if (result.modifiedCount > 0) modifiedCount++;
      } catch (err) {
        console.error('Error upserting attendance record:', err, 'Record:', record);
        failedRecords.push({ record, error: err.message });
      }
    }

    console.log('Bulk attendance upsert summary:', { upsertedCount, modifiedCount, failedRecords });

    if (failedRecords.length === records.length) {
      // All failed
      return res.status(400).json({
        success: false,
        error: 'All attendance records failed to process',
        details: failedRecords
      });
    }

    res.status(201).json({
      success: true,
      message: `Attendance records processed. Inserted: ${upsertedCount}, Updated: ${modifiedCount}, Failed: ${failedRecords.length}`,
      failedRecords
    });
  } catch (error) {
    console.error('Error submitting attendance records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit attendance records',
      details: error.message
    });
  }
};

// Record single attendance
export const recordAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, checkIn } = req.body;
    const recordedBy = req.user._id;

    if (!employeeId || !date || !status) {
      return res.status(400).json({ success: false, error: 'Employee ID, date and status are required' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee || employee.deletedAt) {
      return res.status(404).json({ success: false, error: 'Employee not found or inactive' });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({ employeeId, date: attendanceDate });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: `Attendance already recorded for ${employee.firstName} ${employee.lastName}`
      });
    }

    const newAttendance = new Attendance({
      employeeId,
      date: attendanceDate,
      status,
      checkIn: checkIn ? new Date(checkIn) : null,
      recordedBy
    });

    await newAttendance.save();

    res.status(201).json({ success: true, message: 'Attendance recorded successfully' });
  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({ success: false, error: 'Failed to record attendance' });
  }
};

// Get my attendance (for employees)
export const getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ success: false, error: 'Month parameter required (YYYY-MM)' });
    }

    const [year, monthNum] = month.split('-');
    const start = new Date(year, monthNum - 1, 1);
    const end = new Date(year, monthNum, 0);

    const records = await Attendance.find({
      employeeId,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    res.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching my attendance:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch attendance records' });
  }
};

// Get monthly report (for employees)
export const getMonthlyReport = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ success: false, error: 'Month and year are required' });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const records = await Attendance.find({
      employeeId,
      date: { $gte: start, $lte: end }
    });

    const stats = {
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      halfDay: records.filter(r => r.status === 'half-day').length,
      onLeave: records.filter(r => r.status === 'on-leave').length,
      notMarked: records.filter(r => r.status === 'not-marked').length
    };

    res.json({ success: true, data: { records, statistics: stats } });
  } catch (error) {
    console.error('Error generating monthly report:', error);
    res.status(500).json({ success: false, error: 'Failed to generate report' });
  }
};
