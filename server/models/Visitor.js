import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Visitor name is required']
  },
  reason: {
    type: String,
    required: [true, 'Reason for visit is required']
  },
  checkIn: {
    type: Date,
    default: Date.now
  },
  checkOut: {
    type: Date
  },
  user: {  // Reference to the user who created the visitor
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Update status before saving
visitorSchema.pre('save', function(next) {
  if (this.checkOut) {
    this.status = 'completed';
  }
  next();
});

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;