import Employee from '../models/Employee.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { generateEmployeeId } from '../utils/idGenerator.js';

// @desc    Get all employees for a hatchery
// @route   GET /api/employees
// @access  Private/Admin
export const getEmployees = asyncHandler(async (req, res) => {
  const { hatchery } = req.query;
  
  if (!hatchery) {
    return res.status(400).json({ 
      success: false,
      message: 'Hatchery name is required'
    });
  }

  // Verify the requested hatchery matches the admin's hatchery
  if (hatchery !== req.user.hatcheryName) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access employees from this hatchery'
    });
  }

  try {
    const employees = await Employee.find({ hatchery, deletedAt: null })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: employees
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message
    });
  }
});

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private/Admin
export const registerEmployee = asyncHandler(async (req, res) => {
  // Alias for createEmployee to maintain backward compatibility
  return createEmployee(req, res);
});

export const createEmployee = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    position,
    department,
    joiningDate,
    salary,
    emergencyContact
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !phone || !address || 
      !position || !department || !joiningDate || !salary || 
      !emergencyContact?.name || !emergencyContact?.relation || !emergencyContact?.phone) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  // Check if employee with this email already exists
  const existingEmployee = await Employee.findOne({ email });
  if (existingEmployee) {
    return res.status(400).json({
      success: false,
      message: 'Employee with this email already exists'
    });
  }

  try {
    // Create employee
    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      position,
      department,
      joiningDate,
      salary,
      emergencyContact,
      employeeId: generateEmployeeId(),
      hatchery: req.user.hatcheryName // Set hatchery from admin user
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: error.message
    });
  }
});

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private/Admin
export const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ 
    _id: req.params.id,
    deletedAt: null 
  });

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  // Verify the employee belongs to the admin's hatchery
  if (employee.hatchery !== req.user.hatcheryName) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this employee'
    });
  }

  res.json({
    success: true,
    data: employee
  });
});

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ 
    _id: req.params.id,
    deletedAt: null 
  });

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  // Verify the employee belongs to the admin's hatchery
  if (employee.hatchery !== req.user.hatcheryName) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this employee'
    });
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    position,
    department,
    joiningDate,
    salary,
    emergencyContact
  } = req.body;

  // Update employee fields
  employee.firstName = firstName || employee.firstName;
  employee.lastName = lastName || employee.lastName;
  employee.email = email || employee.email;
  employee.phone = phone || employee.phone;
  employee.address = address || employee.address;
  employee.position = position || employee.position;
  employee.department = department || employee.department;
  employee.joiningDate = joiningDate || employee.joiningDate;
  employee.salary = salary || employee.salary;
  
  if (emergencyContact) {
    employee.emergencyContact = {
      name: emergencyContact.name || employee.emergencyContact.name,
      relation: emergencyContact.relation || employee.emergencyContact.relation,
      phone: emergencyContact.phone || employee.emergencyContact.phone
    };
  }

  try {
    const updatedEmployee = await employee.save();
    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error.message
    });
  }
});

// @desc    Delete employee (soft delete)
// @route   DELETE /api/employees/:id
// @access  Private/Admin
export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ 
    _id: req.params.id,
    deletedAt: null 
  });

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  // Verify the employee belongs to the admin's hatchery
  if (employee.hatchery !== req.user.hatcheryName) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this employee'
    });
  }

  try {
    employee.deletedAt = new Date();
    await employee.save();
    
    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error.message
    });
  }
});