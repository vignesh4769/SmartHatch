import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  joiningDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  },
  assignedRuns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Run'
  }],
  deletedAt: {
    type: Date,
    default: null
  },
  deletionReason: String,
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.deletedAt;
      return ret;
    }
  }
});

// Soft delete implementation
employeeSchema.methods.softDelete = async function(reason) {
  this.deletedAt = new Date();
  this.deletionReason = reason;
  this.status = 'inactive';
  await this.save();
};

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;