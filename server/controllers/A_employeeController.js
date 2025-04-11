import asyncHandler from 'express-async-handler';
import Employee from '../models/A_Employee.js';

// @desc    Get all employees for current admin
// @route   GET /api/admin/employees
// @access  Private/Admin
export const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({ 
    deletedAt: null, 
    admin: req.user._id 
  }).populate('user', 'name email phone');

  res.json(employees);
});

// @desc    Register a new employee
// @route   POST /api/admin/employees/register
// @access  Private/Admin
import User from '../models/User.js';

export const registerEmployee = asyncHandler(async (req, res) => {
  const { name, email, password, employeeId, department, position, salary, emergencyContact } = req.body;

  // Check if user with email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Create a user account for employee
  const newUser = await User.create({
    name,
    email,
    password,
    role: 'employee'
  });

  // Check for duplicate employeeId
  const employeeExists = await Employee.findOne({ employeeId, admin: req.user._id });
  if (employeeExists) {
    res.status(400);
    throw new Error('Employee ID already exists');
  }

  // Create the employee entry
  const employee = await Employee.create({
    employeeId,
    department,
    position,
    salary,
    emergencyContact,
    user: newUser._id,
    admin: req.user._id
  });

  res.status(201).json(employee);
});


// @desc    Update employee
// @route   PUT /api/admin/employees/:id
// @access  Private/Admin
export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({
    _id: req.params.id,
    admin: req.user._id
  });

  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  Object.assign(employee, req.body);
  const updatedEmployee = await employee.save();
  
  res.json(updatedEmployee);
});

// @desc    Delete employee (soft delete)
// @route   DELETE /api/admin/employees/:id
// @access  Private/Admin
export const deleteEmployee = asyncHandler(async (req, res) => {
  const { deletionReason } = req.body;

  const employee = await Employee.findOne({
    _id: req.params.id,
    admin: req.user._id
  });

  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  await employee.softDelete(deletionReason);
  res.json({ message: 'Employee removed' });
});