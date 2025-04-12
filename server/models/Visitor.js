import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  hatchery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hatchery',
    required: true
  },
  visitorName: {
    type: String,
    required: true
  },
  company: String,
  phone: {
    type: String,
    required: true
  },
  email: String,
  purpose: {
    type: String,
    required: true
  },
  checkIn: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkOut: {
    type: Date
  },
  hostEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  idProof: {
    type: String,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  vehicleNumber: String,
  notes: String,
  signature: String
}, { timestamps: true });

// Pre-save middleware to update status based on checkOut
visitorSchema.pre('save', function(next) {
  if (this.checkOut) {
    this.status = 'completed';
  }
  next();
});

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;