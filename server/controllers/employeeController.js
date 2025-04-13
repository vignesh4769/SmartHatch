import Employee from '../models/Employee.js';
import User from '../models/User.js';
import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';
import StockRequest from '../models/StockRequest.js';
import MessSchedule from '../models/Mess.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { generateEmployeeId } from '../utils/idGenerator.js';

// @desc    Get all employees
// @route   GET /api/admin/employees
// @access  Private/Admin
export const getEmployees = asyncHandler(async (req, res) => {
  try {
    // Validate and parse pagination parameters
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);

    // Destructure query parameters with defaults
    const {
      search = '',
      department,
      status
    } = req.query;

    // Build safe search query
    const searchQuery = search.trim();
    const searchConditions = searchQuery ? [
      { employeeId: { $regex: searchQuery, $options: 'i' } },
      { 'user.name': { $regex: searchQuery, $options: 'i' } },
      { 'user.email': { $regex: searchQuery, $options: 'i' } },
      { 'user.phone': { $regex: searchQuery, $options: 'i' } }
    ] : [];

    const query = {
      deletedAt: null,
      ...(searchQuery && { $or: searchConditions }),
      ...(department && { department: department.trim() }),
      ...(status && { status: status.trim() })
    };

    const [employees, count] = await Promise.all([
      Employee.find(query)
        .populate({
          path: 'user',
          select: 'name email phone',
          options: { allowNotFound: true }
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Employee.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: employees,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRecords: count
    });
  } catch (error) {
    console.error('Error in getEmployees:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employees',
      details: error.message
    });
  }
});

// @desc    Register a new employee (aligned with registration form)
// @route   POST /api/admin/employees/register
// @access  Private/Admin
export const registerEmployee = asyncHandler(async (req, res) => {
  // Required fields from registration form
  const requiredFields = [
    'firstName', 'lastName', 'email', 'phoneNumber', 'password',
    'age', 'gender', 'address',
    'department', 'position', 'shift',
    'emergencyContact.name', 'emergencyContact.phone',
    'employeeId', 'joinDate'
  ];

  const missingFields = requiredFields.filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    res.status(400);
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    age,
    gender,
    address,
    department,
    position,
    shift,
    emergencyContact,
    employeeId,
    joinDate
  } = req.body;

  // Validate email format
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Please provide a valid email address');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Employee with this email already exists');
  }

  // Validate gender
  if (!['Male', 'Female', 'Other'].includes(gender)) {
    res.status(400);
    throw new Error('Invalid gender value');
  }

  // Start transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create user
    const [user] = await User.create([{
      name,
      email,
      phone: phoneNumber,
      password,
      role: 'employee',
      caaNumber,
      hatcheryName,
      isVerified: false
    }], { session });

    // Create employee with fields from registration form
    const [employee] = await Employee.create([{
      user: user._id,
      employeeId: generateEmployeeId(),
      department,
      position,
      salary: Number(salary),
      joiningDate: new Date(),
      emergencyContact: {
        name: emergencyContactName,
        relation: emergencyContactRelation,
        phone: emergencyContactPhone
      },
      address,
      age: Number(age),
      gender,
      shiftTimings,
      status: 'active'
    }], { session });

    await session.commitTransaction();
    session.endSession();

    const createdEmployee = await Employee.findById(employee._id)
      .populate('user', 'name email phone')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Employee registered successfully',
      data: createdEmployee
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({
      success: false,
      error: error.message || 'Employee registration failed',
      details: error.keyValue ? `Duplicate value for ${Object.keys(error.keyValue).join(', ')}` : null
    });
  }
});

// @desc    Update employee (only fields from registration form)
// @route   PUT /api/admin/employees/:id
// @access  Private/Admin
export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id)
    .populate('user')
    .exec();

  if (!employee || employee.deletedAt) {
    res.status(404);
    throw new Error('Employee not found');
  }

  const {
    name,
    email,
    phoneNumber,
    age,
    gender,
    address,
    salary,
    department,
    position,
    shiftTimings,
    emergencyContactName,
    emergencyContactPhone,
    emergencyContactRelation,
    status
  } = req.body;

  // Update user details if provided
  if (name) employee.user.name = name;
  if (email) employee.user.email = email;
  if (phoneNumber) employee.user.phone = phoneNumber;
  await employee.user.save();

  // Update employee details
  if (department) employee.department = department;
  if (position) employee.position = position;
  if (salary) employee.salary = Number(salary);
  if (status) employee.status = status;
  if (address) employee.address = address;
  if (age) employee.age = Number(age);
  if (gender) employee.gender = gender;
  if (shiftTimings) employee.shiftTimings = shiftTimings;

  // Update emergency contact details
  if (emergencyContactName) employee.emergencyContact.name = emergencyContactName;
  if (emergencyContactPhone) employee.emergencyContact.phone = emergencyContactPhone;
  if (emergencyContactRelation) employee.emergencyContact.relation = emergencyContactRelation;

  const updatedEmployee = await employee.save();

  res.json({
    success: true,
    data: updatedEmployee
  });
});

// @desc    Delete employee (soft delete)
// @route   DELETE /api/admin/employees/:id
// @access  Private/Admin
export const deleteEmployee = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const employee = await Employee.findById(req.params.id);

  if (!employee || employee.deletedAt) {
    res.status(404);
    throw new Error('Employee not found');
  }

  if (!reason) {
    res.status(400);
    throw new Error('Please provide a reason for deletion');
  }

  // Soft delete employee
  employee.deletedAt = new Date();
  employee.status = 'inactive';
  employee.deletionReason = reason;
  await employee.save();

  // Also deactivate the associated user account
  await User.findByIdAndUpdate(employee.user, { isActive: false });

  res.json({
    success: true,
    message: 'Employee deactivated successfully'
  });
});

// @desc    Get employee profile
// @route   GET /api/employee/profile
// @access  Private/Employee
export const getEmployeeProfile = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ user: req.user._id })
    .populate('user', 'name email phone')
    .select('-deletedAt -deletionReason')
    .lean();

  if (!employee) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  res.json({
    success: true,
    data: employee
  });
});

// @desc    Apply for leave
// @route   POST /api/employee/leaves
// @access  Private/Employee
export const applyForLeave = asyncHandler(async (req, res) => {
  const { startDate, endDate, reason, type } = req.body;

  if (!startDate || !endDate || !reason || !type) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const employee = await Employee.findOne({ user: req.user._id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  const leave = await Leave.create({
    employee: employee._id,
    startDate,
    endDate,
    reason,
    type,
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    message: 'Leave application submitted successfully',
    data: leave
  });
});

// @desc    Get employee's leaves
// @route   GET /api/employee/leaves
// @access  Private/Employee
export const getMyLeaves = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ user: req.user._id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  const leaves = await Leave.find({ employee: employee._id })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: leaves
  });
});

// @desc    Get employee's attendance
// @route   GET /api/employee/attendance
// @access  Private/Employee
export const getMyAttendance = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ user: req.user._id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  const attendance = await Attendance.find({ employee: employee._id })
    .sort({ date: -1 });

  res.json({
    success: true,
    data: attendance
  });
});

// @desc    Get employee's salary details
// @route   GET /api/employee/salary
// @access  Private/Employee
export const getSalaryDetails = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ user: req.user._id })
    .populate('salary');

  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  res.json({
    success: true,
    data: employee.salary
  });
});

// @desc    Create stock request
// @route   POST /api/employee/stock-requests
// @access  Private/Employee
export const createStockRequest = asyncHandler(async (req, res) => {
  const { items, urgency, notes } = req.body;

  if (!items || !items.length) {
    res.status(400);
    throw new Error('Please provide items for the stock request');
  }

  const employee = await Employee.findOne({ user: req.user._id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  const stockRequest = await StockRequest.create({
    employee: employee._id,
    items,
    urgency,
    notes,
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    message: 'Stock request created successfully',
    data: stockRequest
  });
});

// @desc    Get mess schedule
// @route   GET /api/employee/mess-schedule
// @access  Private/Employee
export const getMessSchedule = asyncHandler(async (req, res) => {
  const schedule = await MessSchedule.find()
    .sort({ date: 1 })
    .limit(7);

  res.json({
    success: true,
    data: schedule
  });
});

// @desc    Get employee dashboard stats
// @route   GET /api/employee/dashboard
// @access  Private/Employee
export const getDashboardStats = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ user: req.user._id });
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  // Get recent attendance records
  const recentAttendance = await Attendance.find({ employee: employee._id })
    .sort({ date: -1 })
    .limit(7);

  // Get leave statistics
  const leaves = await Leave.find({ employee: employee._id });
  const leaveStats = {
    approved: leaves.filter(l => l.status === 'approved').length,
    pending: leaves.filter(l => l.status === 'pending').length,
    rejected: leaves.filter(l => l.status === 'rejected').length
  };

  res.json({
    success: true,
    data: {
      recentAttendance,
      leaveStats
    }
  });
});
