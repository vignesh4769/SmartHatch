import Notification from '../models/Notification.js';
import asyncHandler from 'express-async-handler';

// @desc    Get notifications for the current admin
// @route   GET /api/admin/notifications
// @access  Private/Admin
export const getAdminNotifications = asyncHandler(async (req, res) => {
  const { type } = req.query; // Optional type filter (e.g., 'inventory')
  const adminId = req.user._id;

  const query = { user: adminId };
  if (type) {
    query.type = type;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});
