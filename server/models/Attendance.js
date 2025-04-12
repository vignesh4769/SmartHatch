import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  hatchery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hatchery',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    time: {
      type: Date,
      required: true
    },
    location: {
      latitude: Number,
      longitude: Number
    },
    photo: String,
    notes: String
  },
  checkOut: {
    time: Date,
    location: {
      latitude: Number,
      longitude: Number
    },
    photo: String,
    notes: String
  },
  shift: {
    type: String,
    enum: ['morning', 'afternoon', 'night'],
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'late', 'leave'],
    default: 'present'
  },
  overtime: {
    hours: {
      type: Number,
      default: 0
    },
    approved: {
      type: Boolean,
      default: false
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvalDate: Date
  },
  run: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Run'
  },
  breaks: [{
    startTime: Date,
    endTime: Date,
    duration: Number,
    type: {
      type: String,
      enum: ['lunch', 'tea', 'other']
    }
  }],
  totalWorkingHours: {
    type: Number,
    default: 0
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Calculate total working hours
attendanceSchema.methods.calculateWorkingHours = function() {
  if (!this.checkOut || !this.checkOut.time) return 0;
  
  const checkInTime = new Date(this.checkIn.time);
  const checkOutTime = new Date(this.checkOut.time);
  
  // Calculate total break duration in milliseconds
  const totalBreakDuration = this.breaks.reduce((total, break_) => {
    if (break_.startTime && break_.endTime) {
      return total + (new Date(break_.endTime) - new Date(break_.startTime));
    }
    return total;
  }, 0);
  
  // Calculate total working hours excluding breaks
  const totalWorkingTime = checkOutTime - checkInTime - totalBreakDuration;
  return Math.round((totalWorkingTime / (1000 * 60 * 60)) * 100) / 100;
};

// Update total working hours before saving
attendanceSchema.pre('save', function(next) {
  this.totalWorkingHours = this.calculateWorkingHours();
  next();
});

// Update status based on check-in time
attendanceSchema.pre('save', function(next) {
  if (!this.checkIn || !this.checkIn.time) {
    this.status = 'absent';
  } else {
    const checkInTime = new Date(this.checkIn.time);
    const scheduleTime = new Date(this.date);
    
    // Set schedule time based on shift
    switch(this.shift) {
      case 'morning':
        scheduleTime.setHours(9, 0);
        break;
      case 'afternoon':
        scheduleTime.setHours(14, 0);
        break;
      case 'night':
        scheduleTime.setHours(22, 0);
        break;
    }
    
    // If check-in is more than 30 minutes late
    if (checkInTime > new Date(scheduleTime.getTime() + 30 * 60000)) {
      this.status = 'late';
    }
  }
  next();
});

// Index for unique attendance per employee per hatchery per date
attendanceSchema.index({ employee: 1, hatchery: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;