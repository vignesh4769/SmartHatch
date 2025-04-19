import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a first name']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  position: {
    type: String,
    required: [true, 'Please add a position']
  },
  department: {
    type: String,
    required: [true, 'Please add a department']
  },
  salary: {
    type: Number,
    required: [true, 'Please add a salary']
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'employee'],
    default: 'employee'
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Please add emergency contact name']
    },
    relation: {
      type: String,
      required: [true, 'Please add emergency contact relation']
    },
    phone: {
      type: String,
      required: [true, 'Please add emergency contact phone']
    }
  },
  employeeId: {
    type: String,
    unique: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
employeeSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
employeeSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Soft delete method
employeeSchema.methods.remove = async function() {
  this.deletedAt = new Date();
  await this.save();
};

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;