import Employee from '../models/Employee.js';
import User from '../models/User.js';
import Leave from '../models/Leave.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all employees
// @route   GET /api/admin/employees
// @access  Private/Admin
export const getEmployees = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  
  const query = {
    deletedAt: null,
    $or: [
      { employeeId: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
      { position: { $regex: search, $options: 'i' } }
    ]
  };

  const employees = await Employee.find(query)
    .populate('user', 'name email phone')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Employee.countDocuments(query);

  res.json({
    employees,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page)
  });
});

// @desc    Register a new employee
// @route   POST /api/admin/employees/register
// @access  Private/Admin
export const registerEmployee = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    employeeId,
    department,
    position,
    salary,
    joiningDate,
    emergencyContact,
    bankDetails
  } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Check if employee ID exists
  const employeeIdExists = await Employee.findOne({ employeeId });
  if (employeeIdExists) {
    res.status(400);
    throw new Error('Employee ID already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'employee'
  });

  // Create employee
  const employee = await Employee.create({
    user: user._id,
    employeeId,
    department,
    position,
    salary,
    joiningDate,
    emergencyContact,
    bankDetails
  });

  const createdEmployee = await Employee.findById(employee._id).populate('user', 'name email phone');

  res.status(201).json(createdEmployee);
});

// @desc    Update employee
// @route   PUT /api/admin/employees/:id
// @access  Private/Admin
export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate('user');
  
  if (!employee || employee.deletedAt) {
    res.status(404);
    throw new Error('Employee not found');
  }

  const {
    name,
    email,
    phone,
    department,
    position,
    salary,
    status,
    emergencyContact,
    bankDetails
  } = req.body;

  // Update user details
  employee.user.name = name || employee.user.name;
  employee.user.email = email || employee.user.email;
  employee.user.phone = phone || employee.user.phone;
  await employee.user.save();

  // Update employee details
  employee.department = department || employee.department;
  employee.position = position || employee.position;
  employee.salary = salary || employee.salary;
  employee.status = status || employee.status;
  employee.emergencyContact = emergencyContact || employee.emergencyContact;
  employee.bankDetails = bankDetails || employee.bankDetails;

  const updatedEmployee = await employee.save();

  res.json(updatedEmployee);
});

// @desc    Delete employee
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

  await employee.softDelete(reason);

  res.json({ message: 'Employee deactivated successfully' });
});

// @desc    Get employee profile
// @route   GET /api/employee/profile
// @access  Private/Employee
export const getEmployeeProfile = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ user: req.user._id })
    .populate('user', 'name email phone')
    .select('-deletedAt -deletionReason');

  if (!employee) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  res.json(employee);
});

// @desc    Get dashboard stats for employee
// @route   GET /api/employee/dashboard
// @access  Private/Employee
export const getDashboardStats = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ user: req.user._id });
  
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  // Get leave stats
  const leaves = await Leave.find({ employee: employee._id });
  const approvedLeaves = leaves.filter(leave => leave.status === 'approved').length;
  
  // Get attendance stats (you'll need to implement your attendance logic)
  const totalWorkingDays = 22; // Example value
  const presentDays = 18; // Example value
  const attendancePercentage = Math.round((presentDays / totalWorkingDays) * 100);

  res.json({
    employee: {
      name: employee.user.name,
      position: employee.position,
      department: employee.department
    },
    stats: {
      leaves: {
        total: leaves.length,
        approved: approvedLeaves,
        pending: leaves.filter(leave => leave.status === 'pending').length,
        rejected: leaves.filter(leave => leave.status === 'rejected').length
      },
      attendance: {
        percentage: attendancePercentage,
        present: presentDays,
        absent: totalWorkingDays - presentDays
      },
      upcomingSchedule: [] // Add upcoming schedule logic
    }
  });
});

// @desc    Get employee attendance
// @route   GET /api/employee/attendance
// @access  Private/Employee
export const getMyAttendance = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ user: req.user._id });
  
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  // Implement your attendance fetching logic here
  // This is just example data
  const attendance = [
    { date: '2023-06-01', status: 'present', checkIn: '09:00', checkOut: '17:00' },
    { date: '2023-06-02', status: 'present', checkIn: '08:45', checkOut: '17:15' },
    // Add more attendance records
  ];

  res.json(attendance);
});

// @desc    Apply for leave
// @route   POST /api/employee/leaves
// @access  Private/Employee
export const applyForLeave = asyncHandler(async (req, res) => {
  const { startDate, endDate, reason, leaveType } = req.body;
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
    leaveType,
    status: 'pending'
  });

  res.status(201).json(leave);
});

// @desc    Get employee leaves
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

  res.json(leaves);
});

// @desc    Get salary details
// @route   GET /api/employee/salary
// @access  Private/Employee
export const getSalaryDetails = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ user: req.user._id });
  
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  // Implement your salary details logic here
  // This is just example data
  const salaryDetails = {
    basicSalary: employee.salary * 0.6,
    hra: employee.salary * 0.3,
    specialAllowance: employee.salary * 0.1,
    deductions: {
      tax: employee.salary * 0.1,
      pf: employee.salary * 0.12
    },
    netSalary: employee.salary * 0.78, // After deductions
    bankDetails: employee.bankDetails,
    paymentHistory: [] // Add payment history logic
  };

  res.json(salaryDetails);
});

// @desc    Create stock request
// @route   POST /api/employee/stock-requests
// @access  Private/Employee
export const createStockRequest = asyncHandler(async (req, res) => {
  const { itemName, quantity, urgency, notes } = req.body;
  const employee = await Employee.findOne({ user: req.user._id });

  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  // Implement your stock request logic here
  // This is just example response
  const stockRequest = {
    id: 'SR-' + Math.floor(Math.random() * 10000),
    itemName,
    quantity,
    urgency,
    notes,
    status: 'pending',
    requestedBy: employee.user.name,
    requestedAt: new Date()
  };

  res.status(201).json(stockRequest);
});

// @desc    Get mess schedule
// @route   GET /api/employee/mess-schedule
// @access  Private/Employee
export const getMessSchedule = asyncHandler(async (req, res) => {
  // Implement your mess schedule logic here
  // This is just example data
  const messSchedule = {
    currentWeek: [
      { day: 'Monday', menu: 'Rice, Dal, Vegetable Curry, Salad' },
      { day: 'Tuesday', menu: 'Roti, Paneer Curry, Rice, Salad' },
      // Add more days
    ],
    specialDays: [] // Add special days logic
  };

  res.json(messSchedule);
});