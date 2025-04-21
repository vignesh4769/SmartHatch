import Employee from "../models/Employee.js";
import asyncHandler from "express-async-handler";
import { generateEmployeeId } from "../utils/idGenerator.js";

export const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().select("-password");
  res.json({
    success: true,
    data: employees,
  });
});

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

  if (
    !emergencyContact.name ||
    !emergencyContact.relation ||
    !emergencyContact.phone
  ) {
    res.status(400);
    throw new Error("All emergency contact fields are required");
  }

  const employeeExists = await Employee.findOne({ email });
  if (employeeExists) {
    res.status(400);
    throw new Error("Employee already exists");
  }


  const employeeId = await generateEmployeeId();

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


export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  employee.firstName = req.body.firstName || employee.firstName;
  employee.lastName = req.body.lastName || employee.lastName;
  employee.email = req.body.email || employee.email;
  employee.phone = req.body.phone || employee.phone;
  employee.address = req.body.address || employee.address;
  employee.position = req.body.position || employee.position;
  employee.department = req.body.department || employee.department;
  employee.salary = req.body.salary || employee.salary;
  employee.role = req.body.role || employee.role;
  
  // Update emergency contact if provided
  if (req.body.emergencyContact) {
    employee.emergencyContact = {
      ...employee.emergencyContact,
      ...req.body.emergencyContact
    };
  }

  if (req.body.password) {
    employee.password = req.body.password;
  }

  const updatedEmployee = await employee.save();

  res.json({
    success: true,
    data: {
      _id: updatedEmployee._id,
      firstName: updatedEmployee.firstName,
      lastName: updatedEmployee.lastName,
      email: updatedEmployee.email,
      phone: updatedEmployee.phone,
      address: updatedEmployee.address,
      position: updatedEmployee.position,
      department: updatedEmployee.department,
      salary: updatedEmployee.salary,
      role: updatedEmployee.role,
      employeeId: updatedEmployee.employeeId,
    }
  });
});


export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }


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
