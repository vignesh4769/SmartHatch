import mongoose from 'mongoose';
import Visitor from '../models/Visitor.js';
import Employee from '../models/Employee.js';
import asyncHandler from 'express-async-handler';

// @desc    Register a new visitor
// @route   POST /api/visitors
// @access  Private
export const registerVisitor = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    email,
    company,
    purpose,
    hostEmployeeId,
    expectedDuration,
    idType,
    idNumber
  } = req.body;

  if (!name || !phone || !purpose || !hostEmployeeId) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  if (!mongoose.Types.ObjectId.isValid(hostEmployeeId)) {
    res.status(400);
    throw new Error('Invalid host employee ID');
  }

  const hostEmployee = await Employee.findOne({
    _id: hostEmployeeId,
    hatcheryId: req.user.hatcheryId
  });

  if (!hostEmployee) {
    res.status(404);
    throw new Error('Host employee not found');
  }

  const visitor = await Visitor.create({
    hatchery: req.user.hatcheryId,
    name,
    phone,
    email,
    company,
    purpose,
    hostEmployee: hostEmployeeId,
    expectedDuration,
    idType,
    idNumber,
    checkIn: {
      time: Date.now(),
      by: req.user._id
    }
  });

  res.status(201).json({
    success: true,
    data: visitor
  });
});

// @desc    Check out visitor
// @route   PUT /api/visitors/:id/checkout
// @access  Private
export const checkoutVisitor = asyncHandler(async (req, res) => {
  const visitorId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(visitorId)) {
    res.status(400);
    throw new Error('Invalid visitor ID');
  }

  const visitor = await Visitor.findById(visitorId);

  if (!visitor) {
    res.status(404);
    throw new Error('Visitor not found');
  }

  if (visitor.hatchery.toString() !== req.user.hatcheryId.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (visitor.checkOut) {
    res.status(400);
    throw new Error('Visitor already checked out');
  }

  visitor.checkOut = {
    time: Date.now(),
    by: req.user._id
  };

  const updatedVisitor = await visitor.save();

  res.json({
    success: true,
    data: updatedVisitor
  });
});

// @desc    Get all visitors for a date range
// @route   GET /api/visitors
// @access  Private
export const getVisitors = asyncHandler(async (req, res) => {
  const { startDate, endDate, status } = req.query;

  const query = {
    hatchery: req.user.hatcheryId
  };

  if (startDate || endDate) {
    query['checkIn.time'] = {};
    if (startDate) query['checkIn.time'].$gte = new Date(startDate);
    if (endDate) query['checkIn.time'].$lte = new Date(endDate);
  }

  if (status === 'active') {
    query.checkOut = null;
  } else if (status === 'completed') {
    query.checkOut = { $ne: null };
  }

  const visitors = await Visitor.find(query)
    .populate('hostEmployee', 'name employeeId')
    .populate('checkIn.by', 'name')
    .populate('checkOut.by', 'name')
    .sort({ 'checkIn.time': -1 })
    .lean();

  res.json({
    success: true,
    count: visitors.length,
    data: visitors
  });
});

// @desc    Get visitor statistics
// @route   GET /api/visitors/stats
// @access  Private/Admin
export const getVisitorStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400);
    throw new Error('Please provide start and end dates');
  }

  const stats = await Visitor.aggregate([
    {
      $match: {
        hatchery: req.user.hatcheryId,
        'checkIn.time': {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: null,
        totalVisitors: { $sum: 1 },
        avgDuration: {
          $avg: {
            $cond: [
              { $ne: ['$checkOut', null] },
              { $subtract: ['$checkOut.time', '$checkIn.time'] },
              0
            ]
          }
        },
        purposes: { $push: '$purpose' }
      }
    },
    {
      $project: {
        _id: 0,
        totalVisitors: 1,
        avgDurationMinutes: { $divide: ['$avgDuration', 60000] },
        purposeBreakdown: '$purposes'
      }
    }
  ]);

  res.json({
    success: true,
    data: stats[0] || {
      totalVisitors: 0,
      avgDurationMinutes: 0,
      purposeBreakdown: []
    }
  });
});