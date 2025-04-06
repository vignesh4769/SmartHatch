import mongoose from 'mongoose';

const runSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['planned', 'ongoing', 'completed', 'cancelled'],
    default: 'planned'
  },
  employees: [{
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    role: String,
    assignedDate: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletionReason: String
}, {
  timestamps: true
});

// Soft delete method
runSchema.methods.softDelete = async function(reason) {
  this.deletedAt = new Date();
  this.deletionReason = reason;
  this.status = 'cancelled';
  await this.save();
};

const Run = mongoose.model('Run', runSchema);

export default Run;