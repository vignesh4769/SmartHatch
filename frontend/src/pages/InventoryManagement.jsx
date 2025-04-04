import React, { useState } from "react";

function InventoryManagement() {
  const [stock, setStock] = useState([
    { id: 1, name: "Feed", quantity: 20, threshold: 10 },
    { id: 2, name: "Medicine", quantity: 5, threshold: 10 },
    { id: 3, name: "Equipment", quantity: 15, threshold: 5 },
  ]);

  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [restockRequests, setRestockRequests] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  // Add new stock item
  const addStock = () => {
    if (newItem.name && newItem.quantity) {
      setStock([...stock, { ...newItem, id: stock.length + 1, threshold: 5 }]);
      setNewItem({ name: "", quantity: "" });
    }
  };

  // Delete stock item
  const deleteStock = (id) => {
    setStock(stock.filter((item) => item.id !== id));
  };

  // Increment quantity
  const incrementQuantity = (id) => {
    setStock(stock.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  // Decrement quantity
  const decrementQuantity = (id) => {
    setStock(stock.map(item => item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item));
  };

  // Request restock
  const requestRestock = (item) => {
    setRestockRequests([...restockRequests, item]);
  };

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
              <th>Quantity</th>
              <th>Actions</th>
              <th>Restock</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((item) => (
              <tr key={item.id} className={item.quantity <= item.threshold ? "bg-red-100" : ""}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => decrementQuantity(item.id)}>-</button>
                  <button className="btn btn-sm btn-secondary ml-2" onClick={() => incrementQuantity(item.id)}>+</button>
                </td>
                <td>
                  {item.quantity <= item.threshold ? (
                    <button className="btn btn-warning btn-sm" onClick={() => requestRestock(item)}>
                      Request Restock
                    </button>
                  ) : (
                    "Sufficient"
                  )}
                </td>
                <td>
                  <button className="btn btn-error btn-sm" onClick={() => deleteStock(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Stock Form */}
      <div className="bg-base-100 p-4 rounded-lg shadow space-y-3">
        <h3 className="text-lg font-semibold">Add New Stock</h3>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          className="input input-bordered w-full"
          value={newItem.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          className="input input-bordered w-full"
          value={newItem.quantity}
          onChange={handleChange}
        />
        <button className="btn btn-primary w-full" onClick={addStock}>
          Add Stock
        </button>
      </div>

      {/* Restock Requests */}
      {restockRequests.length > 0 && (
        <div className="bg-base-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Inventory Restock Requests</h3>
          <ul className="list-disc pl-5">
            {restockRequests.map((item, index) => (
              <li key={index} className="text-red-600">{item.name} - Requested</li>
            ))}
          </ul>
        </div>
      )}

      {/* Low Inventory Alerts */}
      {stock.some((item) => item.quantity <= item.threshold) && (
        <div className="alert alert-error">
          <span>⚠ Low Inventory Alert! Some items need restocking.</span>
        </div>
      )}
    </div>
  );
}

export default InventoryManagement;