import mongoose from 'mongoose';

const messSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
    required: true
  },
  menu: [{
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
    },
    cost: {
      type: Number,
    }
  }],
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'cancelled'],
    default: 'scheduled'
  },
  capacity: {
    type: Number,
    default: 30
  },
  specialNotes: String
}, { timestamps: true });

const MessSchedule = mongoose.model('MessSchedule', messSchema);
export default MessSchedule;