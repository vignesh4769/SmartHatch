import MessSchedule from '../models/Mess.js';
import Employee from '../models/Employee.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new mess schedule
// @route   POST /api/mess/schedule
// @access  Private/Admin
export const createMessSchedule = asyncHandler(async (req, res) => {
  const { date, mealType, menu, startTime, endTime } = req.body;
  
  console.log('Received mess schedule request:', req.body);

  // Basic validation
  if (!date || !mealType || !menu || !startTime || !endTime) {
    console.log('Missing required fields:', { date, mealType, menu, startTime, endTime });
    res.status(400);
    throw new Error('Missing required fields');
  }

  // Menu validation
  if (!Array.isArray(menu)) {
    console.log('Menu is not an array:', menu);
    res.status(400);
    throw new Error('Menu must be an array');
  }

  // Validate each menu item
  const invalidMenuItems = menu.filter(item => !item.name || !item.category || typeof item.cost !== 'number');
  if (invalidMenuItems.length > 0) {
    console.log('Invalid menu items:', invalidMenuItems);
    res.status(400);
    throw new Error('Invalid menu items: each item must have name, category, and cost');
  }

  // Time validation
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startDateTime = new Date(date);
  startDateTime.setHours(startHour, startMinute);
  
  const endDateTime = new Date(date);
  endDateTime.setHours(endHour, endMinute);

  if (endDateTime <= startDateTime) {
    console.log('Invalid time range:', { startTime, endTime });
    res.status(400);
    throw new Error('End time must be after start time');
  }

  const schedule = await MessSchedule.create({
    hatchery: req.user._id,
    date: new Date(date),
    meal: mealType,
    menu: menu,
    startTime: startTime,
    endTime: endTime,
    capacity: 100
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

  console.log('Fetching mess schedules with params:', { startDate, endDate });

  try {
    // Get the user's hatchery ID
    const hatcheryId = req.user.hatcheryId || req.user.hatchery;
    
    if (!hatcheryId) {
      console.log('No hatchery ID found for user:', req.user._id);
      return res.json({
        success: true,
        data: []
      });
    }

    console.log('Using hatchery ID:', hatcheryId);

    const query = {
      hatchery: hatcheryId
    };

    if (startDate && endDate) {
      // Parse dates and set time to start/end of day
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      console.log('Date range:', {
        start: start.toISOString(),
        end: end.toISOString()
      });

      query.date = {
        $gte: start,
        $lte: end
      };
    }

    console.log('Query:', JSON.stringify(query, null, 2));

    const schedules = await MessSchedule.find(query)
      .populate('attendees.employee', 'name employeeId')
      .sort({ date: 1, startTime: 1 });

    console.log('Found schedules:', schedules.length);
    if (schedules.length > 0) {
      console.log('Sample schedule:', {
        date: schedules[0].date,
        meal: schedules[0].meal,
        menu: schedules[0].menu.length ? schedules[0].menu[0] : 'No menu items'
      });
    }

    res.json({
      success: true,
      data: schedules
    });
  } catch (error) {
    console.error('Error in getMessSchedules:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mess schedules'
    });
  }
});

// @desc    Update a mess schedule
// @route   PUT /api/mess/schedule/:id
// @access  Private/Admin
export const updateMessSchedule = asyncHandler(async (req, res) => {
  const { date, mealType, menu, startTime, endTime, status, capacity, specialNotes } = req.body;

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
  schedule.mealType = mealType || schedule.mealType;
  schedule.menu = Array.isArray(menu) ? menu : [menu];
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
  const totalMeals = await MessSchedule.countDocuments({
    hatchery: req.user.hatcheryId
  });

  const today = new Date().toISOString().split('T')[0];

  const todayAttendance = await MessSchedule.aggregate([
    {
      $match: {
        hatchery: req.user.hatcheryId,
        date: new Date(today)
      }
    },
    {
      $project: {
        attendees: { $size: '$attendees' }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$attendees' }
      }
    }
  ]);

  const specialRequests = await MessSchedule.countDocuments({
    hatchery: req.user.hatcheryId,
    specialNotes: { $ne: null }
  });

  res.json({
    success: true,
    data: {
      totalMeals,
      todayAttendance: todayAttendance[0]?.total || 0,
      specialRequests
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

  const isAlreadyMarked = schedule.attendees.find(
    a => a.employee.toString() === req.user._id.toString()
  );

  if (isAlreadyMarked) {
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
    totalAttendees: schedules.reduce((sum, s) => sum + s.attendees.length, 0),
    mealsByType: schedules.reduce((acc, s) => {
      acc[s.meal] = (acc[s.meal] || 0) + 1;
      return acc;
    }, {}),
    averageAttendance:
      schedules.length > 0
        ? Math.round(schedules.reduce((sum, s) => sum + s.attendees.length, 0) / schedules.length)
        : 0
  };

  res.json({
    success: true,
    data: report
  });
});
