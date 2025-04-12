import MessSchedule from '../models/Mess.js';
import Employee from '../models/Employee.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new mess schedule
// @route   POST /api/mess/schedule
// @access  Private/Admin
export const createMessSchedule = asyncHandler(async (req, res) => {
  const {
    date,
    meal,
    menu,
    startTime,
    endTime,
    capacity,
    specialNotes
  } = req.body;

  if (!date || !meal || !menu || !startTime || !endTime || !capacity) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const schedule = await MessSchedule.create({
    hatchery: req.user.hatcheryId,
    date,
    meal,
    menu,
    startTime,
    endTime,
    capacity,
    specialNotes
  });

  res.status(201).json({
    success: true,
    data: schedule
  });
});

// @desc    Get mess schedules for a date range
// @route   GET /api/mess/schedule
// @access  Private
export const getMessSchedules = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const query = {
    hatchery: req.user.hatcheryId,
    date: {}
  };

  if (startDate) query.date.$gte = new Date(startDate);
  if (endDate) query.date.$lte = new Date(endDate);

  const schedules = await MessSchedule.find(query)
    .populate('attendees.employee', 'name employeeId')
    .sort({ date: 1, startTime: 1 });

  res.json({
    success: true,
    data: schedules
  });
});

// @desc    Update a mess schedule
// @route   PUT /api/mess/schedule/:id
// @access  Private/Admin
export const updateMessSchedule = asyncHandler(async (req, res) => {
  const {
    date,
    meal,
    menu,
    startTime,
    endTime,
    capacity,
    specialNotes,
    status
  } = req.body;

  const schedule = await MessSchedule.findById(req.params.id);

  if (!schedule) {
    res.status(404);
    throw new Error('Mess schedule not found');
  }

  if (schedule.hatchery.toString() !== req.user.hatcheryId.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this schedule');
  }

  schedule.date = date || schedule.date;
  schedule.meal = meal || schedule.meal;
  schedule.menu = menu || schedule.menu;
  schedule.startTime = startTime || schedule.startTime;
  schedule.endTime = endTime || schedule.endTime;
  schedule.capacity = capacity || schedule.capacity;
  schedule.specialNotes = specialNotes || schedule.specialNotes;
  schedule.status = status || schedule.status;

  const updatedSchedule = await schedule.save();

  res.json({
    success: true,
    data: updatedSchedule
  });
});

// @desc    Delete mess schedule
// @route   DELETE /api/mess/schedule/:id
// @access  Private/Admin
export const deleteMessSchedule = asyncHandler(async (req, res) => {
  const schedule = await MessSchedule.findById(req.params.id);

  if (!schedule) {
    res.status(404);
    throw new Error('Mess schedule not found');
  }

  if (schedule.hatchery.toString() !== req.user.hatcheryId.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this schedule');
  }

  await schedule.remove();

  res.json({
    success: true,
    message: 'Mess schedule deleted successfully'
  });
});

// @desc    Get mess statistics
// @route   GET /api/mess/stats
// @access  Private/Admin
export const getMessStats = asyncHandler(async (req, res) => {
  const totalSchedules = await MessSchedule.countDocuments({
    hatchery: req.user.hatcheryId
  });

  const totalEmployees = await Employee.countDocuments({
    hatchery: req.user.hatcheryId
  });

  res.json({
    success: true,
    data: {
      totalSchedules,
      totalEmployees
    }
  });
});

// @desc    Mark attendance for mess
// @route   POST /api/mess/attendance/:scheduleId
// @access  Private
export const markMessAttendance = asyncHandler(async (req, res) => {
  const schedule = await MessSchedule.findById(req.params.scheduleId);

  if (!schedule) {
    res.status(404);
    throw new Error('Mess schedule not found');
  }

  if (schedule.hatchery.toString() !== req.user.hatcheryId.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (schedule.status !== 'scheduled' && schedule.status !== 'in-progress') {
    res.status(400);
    throw new Error('Mess schedule is not active');
  }

  const currentAttendees = schedule.attendees.length;
  if (currentAttendees >= schedule.capacity) {
    res.status(400);
    throw new Error('Mess capacity full');
  }

  const existingAttendance = schedule.attendees.find(
    a => a.employee.toString() === req.user._id.toString()
  );

  if (existingAttendance) {
    res.status(400);
    throw new Error('Attendance already marked');
  }

  schedule.attendees.push({
    employee: req.user._id,
    attended: true,
    checkinTime: new Date()
  });

  await schedule.save();

  res.json({
    success: true,
    message: 'Attendance marked successfully'
  });
});

// @desc    Get mess attendance report
// @route   GET /api/mess/report
// @access  Private/Admin
export const getMessReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400);
    throw new Error('Please provide start and end dates');
  }

  const schedules = await MessSchedule.find({
    hatchery: req.user.hatcheryId,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).populate('attendees.employee', 'name employeeId');

  const report = {
    totalMeals: schedules.length,
    totalAttendees: schedules.reduce((sum, schedule) => 
      sum + schedule.attendees.length, 0
    ),
    mealsByType: schedules.reduce((acc, schedule) => {
      acc[schedule.meal] = (acc[schedule.meal] || 0) + 1;
      return acc;
    }, {}),
    averageAttendance: schedules.length > 0 ?
      Math.round(schedules.reduce((sum, schedule) => 
        sum + schedule.attendees.length, 0
      ) / schedules.length) : 0
  };

  res.json({
    success: true,
    data: report
  });
});
