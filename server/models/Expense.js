import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  hatchery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hatchery',
    required: true
  },
  run: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Run'
  },
  category: {
    type: String,
    required: true,
    enum: ['feed', 'medicine', 'equipment', 'salaries', 'utilities', 'maintenance', 'inventory', 'other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank-transfer', 'check', 'credit-card', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: Date,
  attachments: [String],
  invoice: {
    number: String,
    date: Date,
    vendor: {
      name: String,
      contact: String,
      address: String
    }
  },
  tags: [String],
  notes: String,
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Index for efficient querying
ExpenseSchema.index({ hatchery: 1, date: -1 });
ExpenseSchema.index({ run: 1, category: 1 });
ExpenseSchema.index({ status: 1 });

// Calculate total amount for a given run and category
ExpenseSchema.statics.getTotalByRunAndCategory = async function(runId, category) {
  const result = await this.aggregate([
    { $match: { run: runId, category: category } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  return result.length > 0 ? result[0].total : 0;
};

// Get monthly expenses summary
ExpenseSchema.statics.getMonthlyExpenses = async function(hatcheryId, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return await this.aggregate([
    {
      $match: {
        hatchery: hatcheryId,
        date: { $gte: startDate, $lte: endDate },
        status: 'paid'
      }
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    }
  ]);
};

const Expense = mongoose.model('Expense', ExpenseSchema);
export default Expense;