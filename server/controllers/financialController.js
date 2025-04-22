import Financial from '../models/Financial.js';
import Expense from '../models/Expense.js';
import asyncHandler from 'express-async-handler';
import Transaction from '../models/Transaction.js';

export const recordTransaction = async (req, res) => {
  try {
    const { date, description, amount, type } = req.body;
    const transaction = new Transaction({ date, description, amount, type });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Failed to record transaction', error });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error });
  }
};


export const getFinancialStats = asyncHandler(async (req, res) => {
  const financial = await Financial.findOne({
    hatchery: req.user.hatcheryId,
    fiscalYear: new Date().getFullYear().toString()
  });

  if (!financial) {
    res.status(404);
    throw new Error('Financial record not found for current fiscal year');
  }

  const stats = {
    totalBudget: financial.budget.total,
    remainingBudget: financial.remainingBudget,
    totalIncome: financial.calculateTotalIncome(),
    totalExpenses: financial.calculateTotalExpenses(),
    balance: financial.calculateBalance(),
    transactionCount: financial.transactions.length
  };

  res.json({
    success: true,
    data: stats
  });
});


// @desc    Create or update financial record for fiscal year
// @route   POST /api/financials
// @access  Private/Admin
export const createFinancialRecord = asyncHandler(async (req, res) => {
  const {
    fiscalYear,
    budget,
    taxInfo
  } = req.body;

  if (!fiscalYear || !budget || !budget.total) {
    res.status(400);
    throw new Error('Please provide fiscal year and total budget');
  }

  let financial = await Financial.findOne({
    hatchery: req.user.hatcheryId,
    fiscalYear
  });

  if (financial) {
    financial.budget = budget;
    if (taxInfo) financial.taxInfo = taxInfo;
  } else {
    financial = await Financial.create({
      hatchery: req.user.hatcheryId,
      fiscalYear,
      budget,
      taxInfo
    });
  }

  await financial.save();

  res.status(201).json({
    success: true,
    data: financial
  });
});

// @desc    Record a financial transaction
// @route   POST /api/financials/transactions
// @access  Private/Admin


// @desc    Get financial summary
// @route   GET /api/financials/summary
// @access  Private/Admin
export const getFinancialSummary = asyncHandler(async (req, res) => {
  const { fiscalYear } = req.query;

  const financial = await Financial.findOne({
    hatchery: req.user.hatcheryId,
    fiscalYear: fiscalYear || new Date().getFullYear().toString()
  });

  if (!financial) {
    res.status(404);
    throw new Error('Financial record not found');
  }

  const summary = {
    budget: financial.budget,
    totalIncome: financial.calculateTotalIncome(),
    totalExpenses: financial.calculateTotalExpenses(),
    currentBalance: financial.calculateBalance(),
    transactionsByCategory: financial.transactions.reduce((acc, trans) => {
      const key = `${trans.type}_${trans.category}`;
      acc[key] = (acc[key] || 0) + trans.amount;
      return acc;
    }, {})
  };

  res.json({
    success: true,
    data: summary
  });
});

// @desc    Generate monthly financial report
// @route   GET /api/financials/monthly-report
// @access  Private/Admin
export const generateMonthlyReport = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    res.status(400);
    throw new Error('Please provide month and year');
  }

  const financial = await Financial.findOne({
    hatchery: req.user.hatcheryId,
    fiscalYear: year.toString()
  });

  if (!financial) {
    res.status(404);
    throw new Error('Financial record not found');
  }

  const report = await financial.generateMonthlyReport(parseInt(month), parseInt(year));

  // Get detailed expense breakdown
  const expenses = await Expense.getMonthlyExpenses(
    req.user.hatcheryId,
    parseInt(year),
    parseInt(month)
  );

  res.json({
    success: true,
    data: {
      ...report,
      expenseBreakdown: expenses
    }
  });
});

// @desc    Get budget allocation and utilization
// @route   GET /api/financials/budget-utilization
// @access  Private/Admin
export const getBudgetUtilization = asyncHandler(async (req, res) => {
  const { fiscalYear } = req.query;

  const financial = await Financial.findOne({
    hatchery: req.user.hatcheryId,
    fiscalYear: fiscalYear || new Date().getFullYear().toString()
  });

  if (!financial) {
    res.status(404);
    throw new Error('Financial record not found');
  }

  const expenses = await Expense.aggregate([
    {
      $match: {
        hatchery: req.user.hatcheryId,
        status: 'paid',
        date: {
          $gte: new Date(fiscalYear, 0, 1),
          $lte: new Date(fiscalYear, 11, 31)
        }
      }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      budget: financial.budget,
      expensesByCategory: expenses
    }
  });
});

// @desc    Update a transaction
// @route   PUT /api/financials/transactions/:id
// @access  Private/Admin
export const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const financial = await Financial.findOne({
    hatchery: req.user.hatcheryId,
    'transactions._id': id
  });

  if (!financial) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  const transactionIndex = financial.transactions.findIndex(
    t => t._id.toString() === id
  );

  if (transactionIndex === -1) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  financial.transactions[transactionIndex] = {
    ...financial.transactions[transactionIndex].toObject(),
    ...updateData
  };

  await financial.save();
  await financial.updateRemainingBudget();

  res.json({
    success: true,
    data: financial.transactions[transactionIndex]
  });
});

// @desc    Delete a transaction
// @route   DELETE /api/financials/transactions/:id
// @access  Private/Admin
export const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const financial = await Financial.findOne({
    hatchery: req.user.hatcheryId,
    'transactions._id': id
  });

  if (!financial) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  financial.transactions = financial.transactions.filter(
    t => t._id.toString() !== id
  );

  await financial.save();
  await financial.updateRemainingBudget();

  res.json({
    success: true,
    data: { id }
  });
});