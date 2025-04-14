import mongoose from 'mongoose';

const tankSchema = new mongoose.Schema({
  tankNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentOccupancy: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['empty', 'in-use', 'maintenance'],
    default: 'empty'
  },
  lastCleaned: Date,
  maintenanceHistory: [{
    date: Date,
    description: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    }
  }]
});

const runSchema = new mongoose.Schema({
  hatchery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hatchery',
    required: true
  },
  runNumber: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  expectedEndDate: { type: Date, required: true },
  actualEndDate: Date,
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed', 'cancelled'],
    default: 'planned'
  },
  assignedEmployees: [{
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    role: { type: String, required: true },
    shift: {
      type: String,
      enum: ['morning', 'afternoon', 'night'],
      required: true
    }
  }],
  tanks: [tankSchema],
  inventory: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
      required: true
    },
    quantityUsed: { type: Number, required: true },
    dateUsed: { type: Date, default: () => Date.now() }
  }],
  financials: {
    budget: { type: Number, required: true },
    expenses: [{
      category: { type: String, required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: () => Date.now() },
      description: String
    }],
    revenue: { type: Number, default: 0 }
  },
  dailyReports: [{
    date: { type: Date, default: () => Date.now(), required: true },
    temperature: Number,
    pH: Number,
    oxygen: Number,
    mortality: Number,
    feedingDetails: [{
      time: String,
      quantity: Number,
      type: String
    }],
    notes: String,
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deletedAt: { type: Date, default: null },
  deletionReason: String
}, {
  timestamps: true
});

// Calculate total expenses
runSchema.methods.calculateTotalExpenses = function() {
  return this.financials.expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Calculate profit/loss
runSchema.methods.calculateProfitLoss = function() {
  const totalExpenses = this.calculateTotalExpenses();
  return this.financials.revenue - totalExpenses;
};

// Update status based on dates
runSchema.pre('save', function(next) {
  const now = new Date();
  if (this.status !== 'cancelled') {
    if (now < this.startDate) {
      this.status = 'planned';
    } else if (now >= this.startDate && !this.actualEndDate) {
      this.status = 'in-progress';
    } else if (this.actualEndDate) {
      this.status = 'completed';
    }
  }
  next();
});

// Soft delete method
runSchema.methods.softDelete = async function(reason) {
  if (this.deletedAt) return;
  this.deletedAt = new Date();
  this.deletionReason = reason;
  this.status = 'cancelled';
  await this.save();
};

const Run = mongoose.model('Run', runSchema);
export default Run;