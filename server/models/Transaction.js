import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
