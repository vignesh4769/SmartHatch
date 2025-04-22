import MessSchedule from '../models/Mess.js';
import asyncHandler from 'express-async-handler';

export const createMessSchedule = asyncHandler(async (req, res) => {
  const { date, mealType, menu, startTime, endTime, specialNotes } = req.body;

  if (!date || !mealType || !menu || !startTime || !endTime) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const existingSchedule = await MessSchedule.findOne({
    date: new Date(date),
    mealType
  });

  if (existingSchedule) {
    res.status(400);
    throw new Error('Schedule already exists for this date and meal');
  }

  const schedule = await MessSchedule.create({
    date,
    mealType,
    menu,
    startTime,
    endTime,
    specialNotes
  });

  res.status(201).json(schedule);
});

export const getMessSchedules = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const query = {};
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const schedules = await MessSchedule.find(query)
    .sort({ date: 1, startTime: 1 });

  res.json(schedules);
});

export const updateMessSchedule = asyncHandler(async (req, res) => {
  const schedule = await MessSchedule.findById(req.params.id);

  if (!schedule) {
    res.status(404);
    throw new Error('Schedule not found');
  }

  const { date, mealType } = req.body;
  if (date || mealType) {
    const existing = await MessSchedule.findOne({
      _id: { $ne: req.params.id },
      date: date || schedule.date,
      mealType: mealType || schedule.mealType
    });

    if (existing) {
      res.status(400);
      throw new Error('Another schedule already exists for this date and meal');
    }
  }

  Object.assign(schedule, req.body);
  await schedule.save();

  res.json(schedule);
});

export const deleteMessSchedule = asyncHandler(async (req, res) => {
  const schedule = await MessSchedule.findByIdAndDelete(req.params.id);

  if (!schedule) {
    res.status(404);
    throw new Error('Schedule not found');
  }

  res.json({ message: 'Schedule removed' });
});