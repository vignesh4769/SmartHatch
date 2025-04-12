import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  hatchery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hatchery',
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['feed', 'equipment', 'medicine', 'chemicals', 'other']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  reorderPoint: {
    type: Number,
    required: true,
    min: 0
  },
  supplier: {
    name: String,
    contact: String,
    email: String,
    phone: String
  },
  location: {
    type: String,
    required: true
  },
  description: String,
  lastRestocked: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['in-stock', 'low-stock', 'out-of-stock'],
    default: 'in-stock'
  }
}, { timestamps: true });

// Pre-save middleware to update status based on quantity and reorderPoint
inventorySchema.pre('save', function(next) {
  if (this.quantity <= 0) {
    this.status = 'out-of-stock';
  } else if (this.quantity <= this.reorderPoint) {
    this.status = 'low-stock';
  } else {
    this.status = 'in-stock';
  }
  next();
});

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;