import React, { useState, useEffect } from "react";
import inventoryApi from "../api/inventoryApi";
import { useAuth } from "../context/AuthContext";

function InventoryManagement() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [stockRequests, setStockRequests] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "other",
    quantity: 0,
    unit: "units",
    unitPrice: 0,
    reorderPoint: 5,
    location: "Main Storage"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch inventory items
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await inventoryApi.getInventoryItems();
        setInventory(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchStockRequests = async () => {
      try {
        const data = await inventoryApi.getStockRequests();
        setStockRequests(data.data);
      } catch (err) {
        console.error("Failed to fetch stock requests:", err);
      }
    };

    fetchInventory();
    fetchStockRequests();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  // Add new inventory item
  const addInventoryItem = async () => {
    try {
      const addedItem = await inventoryApi.addInventoryItem(newItem);
      setInventory([...inventory, addedItem.data]);
      setNewItem({
        name: "",
        category: "other",
        quantity: 0,
        unit: "units",
        unitPrice: 0,
        reorderPoint: 5,
        location: "Main Storage"
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Update inventory item quantity
  const updateQuantity = async (id, newQuantity) => {
    try {
      const updatedItem = await inventoryApi.updateInventoryItem(id, { quantity: newQuantity });
      setInventory(inventory.map(item => 
        item._id === id ? updatedItem.data : item
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete inventory item
  const deleteInventoryItem = async (id) => {
    try {
      await inventoryApi.deleteInventoryItem(id);
      setInventory(inventory.filter(item => item._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Request restock
  const requestRestock = async (itemId, quantity) => {
    try {
      const request = await inventoryApi.createStockRequest(
        itemId,
        quantity,
        'normal',
        'Automatic restock request'
      );
      setStockRequests([...stockRequests, request.data]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update stock request status
  const updateRequestStatus = async (requestId, status) => {
    try {
      const updatedRequest = await inventoryApi.updateStockRequest(requestId, status);
      setStockRequests(stockRequests.map(req => 
        req._id === requestId ? updatedRequest.data : req
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-6">Loading inventory...</div>;
  if (error) return <div className="p-6 text-error">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6 ml-48">
      {/* Inventory Dashboard */}
      <div className="bg-base-200 p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold">Inventory Dashboard</h2>
        <p>Monitor stock levels and manage restocks.</p>
      </div>

      {/* Stock List Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Restock</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item._id} className={item.status === 'low-stock' ? 'bg-yellow-100' : item.status === 'out-of-stock' ? 'bg-red-100' : ''}>
                <td>{item.itemName}</td>
                <td>{item.category}</td>
                <td>{item.quantity} {item.unit}</td>
                <td>{item.unit}</td>
                <td>
                  <span className={`badge ${
                    item.status === 'in-stock' ? 'badge-success' : 
                    item.status === 'low-stock' ? 'badge-warning' : 'badge-error'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-secondary" 
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 0}
                  >
                    -
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary ml-2" 
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </td>
                <td>
                  {item.quantity <= item.reorderPoint ? (
                    <button 
                      className="btn btn-warning btn-sm" 
                      onClick={() => requestRestock(item._id, item.reorderPoint * 2)}
                    >
                      Request Restock
                    </button>
                  ) : (
                    "Sufficient"
                  )}
                </td>
                <td>
                  <button 
                    className="btn btn-error btn-sm" 
                    onClick={() => deleteInventoryItem(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Inventory Item Form */}
      <div className="bg-base-100 p-4 rounded-lg shadow space-y-3">
        <h3 className="text-lg font-semibold">Add New Inventory Item</h3>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          className="input input-bordered w-full"
          value={newItem.name}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          className="select select-bordered w-full"
          value={newItem.category}
          onChange={handleChange}
        >
          <option value="feed">Feed</option>
          <option value="equipment">Equipment</option>
          <option value="medicine">Medicine</option>
          <option value="chemicals">Chemicals</option>
          <option value="other">Other</option>
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            className="input input-bordered"
            value={newItem.quantity}
            onChange={handleChange}
            min="0"
            required
          />
          <input
            type="text"
            name="unit"
            placeholder="Unit (kg, pieces, etc.)"
            className="input input-bordered"
            value={newItem.unit}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="unitPrice"
            placeholder="Unit Price"
            className="input input-bordered"
            value={newItem.unitPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
          <input
            type="number"
            name="reorderPoint"
            placeholder="Reorder Point"
            className="input input-bordered"
            value={newItem.reorderPoint}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        <input
          type="text"
          name="location"
          placeholder="Location"
          className="input input-bordered w-full"
          value={newItem.location}
          onChange={handleChange}
        />
        <button 
          className="btn btn-primary w-full" 
          onClick={addInventoryItem}
          disabled={!newItem.name || newItem.quantity === ''}
        >
          Add Inventory Item
        </button>
      </div>

      {/* Stock Requests Section */}
      {user?.role === 'admin' && (
        <div className="bg-base-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Stock Requests</h3>
          {stockRequests.length > 0 ? (
            <div className="overflow-x-auto mt-4">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Requested By</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stockRequests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.itemName}</td>
                      <td>{request.quantity}</td>
                      <td>{request.requestedBy?.name || 'System'}</td>
                      <td>
                        <span className={`badge ${
                          request.status === 'pending' ? 'badge-warning' : 
                          request.status === 'approved' ? 'badge-success' : 'badge-error'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td>
                        {request.status === 'pending' && (
                          <div className="space-x-2">
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => updateRequestStatus(request._id, 'approved')}
                            >
                              Approve
                            </button>
                            <button 
                              className="btn btn-error btn-sm"
                              onClick={() => updateRequestStatus(request._id, 'rejected')}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No stock requests at this time.</p>
          )}
        </div>
      )}

      {/* Low Inventory Alerts */}
      {inventory.some(item => item.status === 'low-stock' || item.status === 'out-of-stock') && (
        <div className={`alert ${
          inventory.some(item => item.status === 'out-of-stock') ? 'alert-error' : 'alert-warning'
        }`}>
          <span>
            ⚠ Inventory Alert! {inventory.filter(item => item.status === 'out-of-stock').length} items out of stock and 
            {inventory.filter(item => item.status === 'low-stock').length} items low on stock.
          </span>
        </div>
      )}
    </div>
  );
}

export default InventoryManagement;