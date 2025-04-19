import mongoose from 'mongoose';

const messSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
    required: true
  },
  menu: {
    type: String,
    required: true
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    }
  }],
  totalCost: {
    type: Number,
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true
  },
  costPerPerson: {
    type: Number,
    required: true
  },
  preparedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  notes: String
}, { timestamps: true });

// Pre-save middleware to calculate cost per person
messSchema.pre('save', function(next) {
  if (this.totalCost && this.numberOfPeople) {
    this.costPerPerson = Math.round((this.totalCost / this.numberOfPeople) * 100) / 100;
  }
  next();
});

// Index for unique mess entry per date and meal type
messSchema.index({ date: 1, mealType: 1 }, { unique: true });

const Mess = mongoose.model('Mess', messSchema);
export default Mess;