import StockRequest from '../models/StockRequest.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new stock request (employee)
// @route   POST /api/employee/inventory/stock-requests
// @access  Private/Employee
export const createEmployeeStockRequest = asyncHandler(async (req, res) => {
  const { items, urgency, notes } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Please provide at least one item');
  }
  const stockRequest = await StockRequest.create({
    employee: req.user._id,
    items,
    urgency,
    notes,
  });
  res.status(201).json({ success: true, data: stockRequest });
});

// @desc    Get all stock requests for the logged-in employee
// @route   GET /api/employee/inventory/stock-requests
// @access  Private/Employee
export const getEmployeeStockRequests = asyncHandler(async (req, res) => {
  const stockRequests = await StockRequest.find({ employee: req.user._id })
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: stockRequests.length, data: stockRequests });
});
