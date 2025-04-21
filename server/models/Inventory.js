import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["feed", "medicine", "equipment", "supplies", "chemicals", "other"],
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["in-stock", "low-stock", "out-of-stock"],
      default: "in-stock",
    },
    lastRestocked: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    supplier: {
      name: String,
      contact: String,
      email: String,
    },
    notes: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Index for efficient querying
InventorySchema.index({ category: 1, status: 1 });
InventorySchema.index({ item: 1 });

// Calculate total inventory value
InventorySchema.statics.getTotalValue = async function () {
  const result = await this.aggregate([
    { $group: { _id: null, total: { $sum: "$totalValue" } } },
  ]);
  return result.length > 0 ? result[0].total : 0;
};

// Get low stock items
InventorySchema.statics.getLowStockItems = async function () {
  return await this.find({
    $expr: {
      $lte: ["$quantity", "$minimumStock"],
    },
  });
};

const Inventory = mongoose.model("Inventory", InventorySchema);
export default Inventory;
