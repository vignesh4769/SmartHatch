import mongoose from 'mongoose';
const employeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
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
    required: true
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
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletionReason: String
}, { timestamps: true });

// Soft delete method
employeeSchema.methods.softDelete = async function(reason) {
  this.deletedAt = new Date();
  this.deletionReason = reason;
  this.status = 'inactive';
  await this.save();
};

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;