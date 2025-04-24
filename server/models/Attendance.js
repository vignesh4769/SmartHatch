import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day', 'on-leave', 'not-marked'],
    required: true
  },
  checkIn: {
    type: Date,
    validate: {
      validator: function(v) {
        return !this.status || ['present', 'late', 'half-day'].includes(this.status) ? true : !v;
      },
      message: 'Check-in time should only be set for present, late, or half-day status'
    }
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  }
}, {
  timestamps: true
});

// Add index for efficient querying
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', AttendanceSchema);
export default Attendance;