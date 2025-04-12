import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
    required: true
  },
  description: String,
  cost: {
    type: Number,
    required: true,
    min: 0
  }
});

const messScheduleSchema = new mongoose.Schema({
  hatchery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hatchery',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  meal: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
    required: true
  },
  menu: [menuItemSchema],
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  attendees: [{
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    attended: {
      type: Boolean,
      default: false
    },
    checkinTime: Date
  }],
  specialNotes: String,
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, { timestamps: true });

// Pre-save middleware to update status based on current time
messScheduleSchema.pre('save', function(next) {
  const now = new Date();
  const scheduleDate = new Date(this.date);
  const [startHour, startMinute] = this.startTime.split(':');
  const [endHour, endMinute] = this.endTime.split(':');
  
  const startDateTime = new Date(scheduleDate.setHours(startHour, startMinute));
  const endDateTime = new Date(scheduleDate.setHours(endHour, endMinute));

  if (now < startDateTime) {
    this.status = 'scheduled';
  } else if (now >= startDateTime && now <= endDateTime) {
    this.status = 'in-progress';
  } else {
    this.status = 'completed';
  }
  
  next();
});

const MessSchedule = mongoose.model('MessSchedule', messScheduleSchema);
export default MessSchedule;