import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    default: null
  },
  company: String,
  phone: String,
  email: String,
  purpose: String,
  hostEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  idProof: String,
  temperature: Number,
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