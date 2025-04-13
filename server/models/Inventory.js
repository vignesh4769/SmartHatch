import mongoose from 'mongoose';

const stockRequestSchema = new mongoose.Schema({
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  urgency: {
    type: String,
    enum: ['low', 'normal', 'high', 'critical'],
    default: 'normal'
  },
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'fulfilled'],
    default: 'pending'
  }
}, { timestamps: true });

const inventorySchema = new mongoose.Schema({
  hatchery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hatchery',
    required: true
  },
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['feed', 'equipment', 'medicine', 'chemicals', 'other'],
    default: 'other'
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    trim: true,
    default: 'units'
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  reorderPoint: {
    type: Number,
    required: true,
    min: 0,
    default: 5
  },
  supplier: {
    name: String,
    contact: String,
    email: String,
    phone: String
  },
  location: {
    type: String,
    required: true,
    trim: true,
    default: 'Main Storage'
  },
  description: {
    type: String,
    trim: true
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['in-stock', 'low-stock', 'out-of-stock'],
    default: 'in-stock'
  },
  stockRequests: [stockRequestSchema]
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
  
  // Update lastRestocked if quantity increased
  if (this.isModified('quantity') && this.quantity > this._originalQuantity) {
    this.lastRestocked = Date.now();
  }
  
  next();
});

// Store original quantity for comparison
inventorySchema.pre('save', function(next) {
  if (this.isNew) {
    this._originalQuantity = this.quantity;
  } else {
    this._originalQuantity = this._originalQuantity || this.quantity;
  }
  next();
});

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;