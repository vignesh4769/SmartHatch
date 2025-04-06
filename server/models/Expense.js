import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  run: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Run',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['feed', 'medicine', 'equipment', 'salaries', 'utilities', 'other']
  },
  amount: {
    type: Number,
    required: true
  },
  description: String,
  date: {
    type: Date,
    default: Date.now
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Expense', ExpenseSchema);