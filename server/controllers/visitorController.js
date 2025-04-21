import Visitor from '../models/Visitor.js';

export const registerVisitor = async (req, res) => {
  try {
    const { name, reason, date } = req.body;

    if (!name || !reason) {
      return res.status(400).json({ message: 'Name and reason are required' });
    }

    // Preserve the current time when creating a new visitor
    const now = new Date();
    const checkInTime = date ? new Date(date) : now;
    if (date) {
      // If a date was provided, combine it with current time
      checkInTime.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    }

    const visitor = await Visitor.create({
      name,
      reason,
      checkIn: checkInTime,
    });

    res.status(201).json({
      message: 'Visitor registered successfully',
      data: visitor,
    });
  } catch (error) {
    console.error('Error registering visitor:', error);
    res.status(500).json({ message: 'Server error while registering visitor' });
  }
};

export const getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ checkIn: -1 }); // newest first
    res.status(200).json({ data: visitors });
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ message: 'Server error while fetching visitors' });
  }
};

export const checkOutVisitor = async (req, res) => {
  try {
    const visitorId = req.params.id;

    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    if (visitor.checkOut) {
      return res.status(400).json({ message: 'Visitor already checked out' });
    }

    visitor.checkOut = new Date();
    visitor.status = 'completed';

    await visitor.save();

    res.status(200).json({
      message: 'Visitor checked out successfully',
      data: visitor,
    });
  } catch (error) {
    console.error('Error checking out visitor:', error);
    res.status(500).json({ message: 'Server error while checking out visitor' });
  }
};
