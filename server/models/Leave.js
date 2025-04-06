import mongoose from 'mongoose';

const LeaveSchema = new mongoose.Schema({
  employee: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminComments: String,
  run: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Run'
  }
}, { timestamps: true });

export default mongoose.model('Leave', LeaveSchema);