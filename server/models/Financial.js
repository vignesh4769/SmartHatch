import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank-transfer', 'check', 'credit-card', 'other'],
    required: true
  },
  reference: String,
  attachments: [String],
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  }
});

const financialSchema = new mongoose.Schema({
  hatchery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hatchery',
    required: true
  },
  fiscalYear: {
    type: String,
    required: true
  },
  budget: {
    total: {
      type: Number,
      required: true
    },
    allocated: {
      operations: Number,
      maintenance: Number,
      salaries: Number,
      inventory: Number,
      utilities: Number,
      marketing: Number,
      other: Number
    },
    remaining: {
      type: Number,
      default: function() {
        return this.budget.total;
      }
    }
  },
  transactions: [transactionSchema],
  monthlyReports: [{
    month: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    totalIncome: Number,
    totalExpenses: Number,
    profit: Number,
    generatedDate: {
      type: Date,
      default: Date.now
    }
  }],
  taxInfo: {
    taxId: String,
    taxRate: Number,
    lastFiled: Date
  }
}, { timestamps: true });

// Calculate total income
financialSchema.methods.calculateTotalIncome = function() {
  return this.transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((total, t) => total + t.amount, 0);
};

// Calculate total expenses
financialSchema.methods.calculateTotalExpenses = function() {
  return this.transactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((total, t) => total + t.amount, 0);
};

// Calculate current balance
financialSchema.methods.calculateBalance = function() {
  return this.calculateTotalIncome() - this.calculateTotalExpenses();
};

// Update remaining budget
financialSchema.methods.updateRemainingBudget = function() {
  const totalExpenses = this.calculateTotalExpenses();
  this.budget.remaining = this.budget.total - totalExpenses;
  return this.save();
};

// Generate monthly report
financialSchema.methods.generateMonthlyReport = async function(month, year) {
  const monthTransactions = this.transactions.filter(t => {
    const transDate = new Date(t.date);
    return transDate.getMonth() === month - 1 && transDate.getFullYear() === year;
  });

  const totalIncome = monthTransactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((total, t) => total + t.amount, 0);

  const totalExpenses = monthTransactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((total, t) => total + t.amount, 0);

  const report = {
    month: month.toString().padStart(2, '0'),
    year,
    totalIncome,
    totalExpenses,
    profit: totalIncome - totalExpenses,
    generatedDate: new Date()
  };

  this.monthlyReports.push(report);
  await this.save();
  return report;
};

const Financial = mongoose.model('Financial', financialSchema);
export default Financial;