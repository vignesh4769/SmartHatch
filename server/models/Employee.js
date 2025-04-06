import mongoose from 'mongoose';
const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  joiningDate: {
    type: Date,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  }
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