import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['employee'],
    default: 'employee',
    required: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required'],
    default: Date.now
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [0, 'Salary must be positive']
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true
    },
    relation: {
      type: String,
      required: [true, 'Emergency contact relation is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      trim: true
    }
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  hatchery: {
    type: String,
    required: [true, 'Hatchery name is required'],
    trim: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;