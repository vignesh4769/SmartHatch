const Employee = require('../models/Employee');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create new employee (admin only)
exports.createEmployee = async (req, res) => {
  try {
    const { username, email, password, ...employeeData } = req.body;
    
    // First create user
    const user = new User({
      username,
      email,
      password,
      role: 'employee'
    });
    
    await user.save();
    
    // Then create employee
    const employee = new Employee({
      userId: user._id,
      ...employeeData
    });
    
    await employee.save();
    
    res.status(201).json({
      success: true,
      data: { user, employee }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// Get all employees (admin only)
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('userId', 'username email');
    res.status(200).json({
      success: true,
      data: employees
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Get single employee (admin or employee themselves)
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.params.id })
      .populate('userId', 'username email');
      
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    // Check if user is authorized to view this employee
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this employee'
      });
    }
    
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Update employee (admin or employee themselves for some fields)
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.params.id });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this employee'
      });
    }
    
    // Employees can only update certain fields
    if (req.user.role !== 'admin') {
      const allowedFields = ['phone', 'address', 'emergencyContact'];
      for (const field in req.body) {
        if (!allowedFields.includes(field)) {
          delete req.body[field];
        }
      }
    }
    
    const updatedEmployee = await Employee.findOneAndUpdate(
      { userId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'username email');
    
    res.status(200).json({
      success: true,
      data: updatedEmployee
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// Delete employee (admin only)
exports.deleteEmployee = async (req, res) => {
  try {
    if (!req.body.reason) {
      return res.status(400).json({
        success: false,
        error: 'Reason for deletion is required'
      });
    }
    
    const employee = await Employee.findOne({ userId: req.params.id });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    // Soft delete - mark as inactive
    employee.isActive = false;
    await employee.save();
    
    // Create notification for admin
    const notification = new Notification({
      userId: req.user._id,
      title: 'Employee Deactivated',
      message: `Employee ${employee.firstName} ${employee.lastName} has been deactivated. Reason: ${req.body.reason}`,
      type: 'general'
    });
    await notification.save();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Get employee dashboard data
exports.getEmployeeDashboard = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    // Get attendance stats (you'll need to implement this)
    const attendanceStats = await getAttendanceStats(req.user._id);
    
    // Get recent leave requests
    const leaveRequests = await LeaveRequest.find({ employeeId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get recent salary payments
    const salaries = await Salary.find({ employeeId: req.user._id })
      .sort({ paymentDate: -1 })
      .limit(3);
    
    // Get unread notifications
    const notifications = await Notification.find({ 
      userId: req.user._id,
      isRead: false 
    }).sort({ createdAt: -1 }).limit(5);
    
    res.status(200).json({
      success: true,
      data: {
        employee,
        attendanceStats,
        leaveRequests,
        salaries,
        notifications
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

async function getAttendanceStats(employeeId) {
  // Implement your attendance calculation logic here
  // This is just a placeholder
  return {
    present: 20,
    absent: 2,
    leave: 3,
    percentage: 80
  };
}