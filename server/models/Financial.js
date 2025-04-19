import mongoose from 'mongoose';

const FinancialSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['feed', 'medicine', 'equipment', 'labor', 'utilities', 'other']
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'bank_transfer', 'check', 'other']
  },
  reference: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Index for efficient querying
FinancialSchema.index({ type: 1, date: 1 });
FinancialSchema.index({ category: 1 });

// Calculate total income
FinancialSchema.statics.getTotalIncome = async function(startDate, endDate) {
  const match = {
    type: 'income',
    status: 'completed'
  };
  
  if (startDate && endDate) {
    match.date = {
      $gte: startDate,
      $lte: endDate
    };
  }
  
  const result = await this.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  
  return result.length > 0 ? result[0].total : 0;
};

// Calculate total expenses
FinancialSchema.statics.getTotalExpenses = async function(startDate, endDate) {
  const match = {
    type: 'expense',
    status: 'completed'
  };
  
  if (startDate && endDate) {
    match.date = {
      $gte: startDate,
      $lte: endDate
    };
  }
  
  const result = await this.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  
  return result.length > 0 ? result[0].total : 0;
};

// Get financial summary
FinancialSchema.statics.getFinancialSummary = async function(startDate, endDate) {
  const [income, expenses] = await Promise.all([
    this.getTotalIncome(startDate, endDate),
    this.getTotalExpenses(startDate, endDate)
  ]);
  
  return {
    totalIncome: income,
    totalExpenses: expenses,
    netIncome: income - expenses
  };
};

const Financial = mongoose.model('Financial', FinancialSchema);
export default Financial;