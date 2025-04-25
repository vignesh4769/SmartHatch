import LeaveRequest from '../models/LeaveRequest.js';
import Employee from '../models/Employee.js';

export const createLeaveRequest = async (req, res) => {
  try {
    const { startDate, endDate, reason, type } = req.body;
    
    const leave = await LeaveRequest.create({
      employee: req.user.id,
      startDate,
      endDate,
      reason,
      type: type || 'casual',
      status: 'pending'
    });
    
    res.status(201).json({
      success: true,
      data: leave
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getEmployeeLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employee: req.user.id, deletedAt: null })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: leaves
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leave requests'
    });
  }
};

export const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ status: 'pending', deletedAt: null })
      .populate('employee', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: leaves
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending leaves'
    });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ deletedAt: null })
      .populate('employee', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch all leave requests'
    });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes,
        processedBy: req.user._id,
        processedAt: new Date()
      },
      { new: true }
    ).populate('employee', 'firstName lastName');
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        error: 'Leave request not found'
      });
    }
    
    res.json({
      success: true,
      data: leave
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
