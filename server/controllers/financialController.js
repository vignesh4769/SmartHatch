
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


export const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const transaction = await Transaction.findByIdAndUpdate(id, updateData, { new: true });
  
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  res.json({
    success: true,
    data: transaction
  });
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const transaction = await Transaction.findByIdAndDelete(id);
  
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  res.json({
    success: true,
    data: { id }
  });
});