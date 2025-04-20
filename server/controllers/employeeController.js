import Employee from "../models/Employee.js";
import asyncHandler from "express-async-handler";
import { generateEmployeeId } from "../utils/idGenerator.js";

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
export const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().select("-password");
  res.json({
    success: true,
    data: employees,
  });
});

// @desc    Register a new employee
// @route   POST /api/employees
// @access  Public
export const registerEmployee = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
    position,
    department,
    salary,
    role,
    emergencyContact,
  } = req.body;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !address ||
    !position ||
    !department ||
    !salary ||
    !emergencyContact
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Validate emergency contact fields
  if (
    !emergencyContact.name ||
    !emergencyContact.relation ||
    !emergencyContact.phone
  ) {
    res.status(400);
    throw new Error("All emergency contact fields are required");
  }

  // Check if employee exists
  const employeeExists = await Employee.findOne({ email });
  if (employeeExists) {
    res.status(400);
    throw new Error("Employee already exists");
  }

  // Generate employee ID
  const employeeId = await generateEmployeeId();

  // Create employee
  const employee = await Employee.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
    position,
    department,
    salary,
    role,
    emergencyContact,
    employeeId,
  });

  if (employee) {
    res.status(201).json({
      success: true,
      data: {
        _id: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        position: employee.position,
        department: employee.department,
        salary: employee.salary,
        role: employee.role,
        employeeId: employee.employeeId,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid employee data");
  }
});

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private/Admin
export const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({
    _id: req.params.id,
    deletedAt: null,
  });

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found",
    });
  }

  res.json({
    success: true,
    data: employee,
  });
});

// @desc    Update employee
// @route   PUT /api/employees/:employeeId
// @access  Private/Admin
export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.employeeId);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  employee.name = req.body.name || employee.name;
  employee.email = req.body.email || employee.email;
  employee.phone = req.body.phone || employee.phone;
  employee.role = req.body.role || employee.role;

  if (req.body.password) {
    employee.password = req.body.password;
  }

  const updatedEmployee = await employee.save();

  res.json({
    _id: updatedEmployee._id,
    name: updatedEmployee.name,
    email: updatedEmployee.email,
    phone: updatedEmployee.phone,
    role: updatedEmployee.role,
  });
});


export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  // Perform soft delete by setting deletedAt
  employee.deletedAt = new Date();
  await employee.save();

  res.json({ 
    success: true,
    message: "Employee deactivated successfully",
    data: {
      _id: employee._id,
      deletedAt: employee.deletedAt
    }
  });
});
