import Inventory from "../models/Inventory.js";
import asyncHandler from "express-async-handler";

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
export const getInventoryItems = asyncHandler(async (req, res) => {
  const { category, status } = req.query;
  if (category) query.category = category;
  if (status) query.status = status;

  const inventoryItems = await Inventory.find().sort({ itemName: 1 });

  res.json({
    success: true,
    count: inventoryItems.length,
    data: inventoryItems,
  });
});

// @desc    Add new inventory item
// @route   POST /api/inventory
// @access  Private/Admin
export const addInventoryItem = asyncHandler(async (req, res) => {
  const { itemName, quantity, category } = req.body;
  // Only require name, category, and quantity
  if (!itemName || !category || !quantity) {
    res.status(400);
    throw new Error("Please provide item name, category, and quantity");
  }

  const inventoryItem = await Inventory.create({
    itemName,
    category,
    quantity: Number(quantity),
  });

  res.status(201).json({
    success: true,
    data: inventoryItem,
  });
});

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private/Admin
export const updateInventoryItem = asyncHandler(async (req, res) => {
  const inventoryItem = await Inventory.findOne({
    _id: req.params.id,
    hatchery: req.user.hatcheryId,
  });

  if (!inventoryItem) {
    res.status(404);
    throw new Error("Inventory item not found");
  }

  // Update only provided fields
  const updates = {};
  if (req.body.itemName) updates.itemName = req.body.itemName;
  if (req.body.category) updates.category = req.body.category;
  if (req.body.quantity !== undefined)
    updates.quantity = Number(req.body.quantity);
  if (req.body.unit) updates.unit = req.body.unit;
  if (req.body.unitPrice !== undefined)
    updates.unitPrice = Number(req.body.unitPrice);
  if (req.body.reorderPoint !== undefined)
    updates.reorderPoint = Number(req.body.reorderPoint);
  if (req.body.supplier) updates.supplier = req.body.supplier;
  if (req.body.location) updates.location = req.body.location;
  if (req.body.description !== undefined)
    updates.description = req.body.description;

  const updatedItem = await Inventory.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: updatedItem,
  });
});

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private/Admin
export const deleteInventoryItem = asyncHandler(async (req, res) => {
  const inventoryItem = await Inventory.findOne({
    _id: req.params.id,
    hatchery: req.user.hatcheryId,
  });

  if (!inventoryItem) {
    res.status(404);
    throw new Error("Inventory item not found");
  }

  await inventoryItem.deleteOne();

  res.json({
    success: true,
    data: {},
  });
});

// @desc    Create stock request
// @route   POST /api/inventory/stock-requests
// @access  Private
export const createStockRequest = asyncHandler(async (req, res) => {
  const { itemId, quantity, urgency, notes } = req.body;

  if (!itemId || !quantity) {
    res.status(400);
    throw new Error("Please provide item ID and quantity");
  }

  const inventoryItem = await Inventory.findOne({
    _id: itemId,
    hatchery: req.user.hatcheryId,
  });

  if (!inventoryItem) {
    res.status(404);
    throw new Error("Inventory item not found");
  }

  inventoryItem.stockRequests = inventoryItem.stockRequests || [];
  inventoryItem.stockRequests.push({
    requestedBy: req.user._id,
    quantity: Number(quantity),
    urgency: urgency || "normal",
    notes: notes || "",
    status: "pending",
  });

  await inventoryItem.save();

  const newRequest =
    inventoryItem.stockRequests[inventoryItem.stockRequests.length - 1];

  // Populate requestedBy field for response
  const populatedRequest = await Inventory.populate(newRequest, {
    path: "requestedBy",
    select: "name email",
  });

  res.status(201).json({
    success: true,
    data: {
      ...populatedRequest.toObject(),
      itemName: inventoryItem.itemName,
      itemId: inventoryItem._id,
    },
  });
});

// @desc    Get all stock requests
// @route   GET /api/inventory/stock-requests
// @access  Private/Admin
export const getStockRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const query = { hatchery: req.user.hatcheryId };
  if (status) {
    query["stockRequests.status"] = status;
  }

  const inventoryItems = await Inventory.find(query)
    .populate("stockRequests.requestedBy", "name email")
    .select("itemName stockRequests");

  const stockRequests = inventoryItems.reduce((acc, item) => {
    if (item.stockRequests && item.stockRequests.length > 0) {
      const requests = item.stockRequests.map((request) => ({
        ...request.toObject(),
        itemName: item.itemName,
        itemId: item._id,
      }));
      acc.push(...requests);
    }
    return acc;
  }, []);

  res.json({
    success: true,
    count: stockRequests.length,
    data: stockRequests,
  });
});

// @desc    Update stock request status
// @route   PUT /api/inventory/stock-requests/:id
// @access  Private/Admin
export const updateStockRequest = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const { id: requestId } = req.params;

  if (!status) {
    res.status(400);
    throw new Error("Please provide status");
  }

  const inventoryItem = await Inventory.findOne({
    hatchery: req.user.hatcheryId,
    "stockRequests._id": requestId,
  });

  if (!inventoryItem) {
    res.status(404);
    throw new Error("Stock request not found");
  }

  const stockRequest = inventoryItem.stockRequests.id(requestId);
  stockRequest.status = status;
  if (notes) stockRequest.notes = notes;
  stockRequest.updatedAt = Date.now();

  await inventoryItem.save();

  // Populate requestedBy field for response
  const populatedRequest = await Inventory.populate(stockRequest, {
    path: "requestedBy",
    select: "name email",
  });

  res.json({
    success: true,
    data: {
      ...populatedRequest.toObject(),
      itemName: inventoryItem.itemName,
      itemId: inventoryItem._id,
    },
  });
});
