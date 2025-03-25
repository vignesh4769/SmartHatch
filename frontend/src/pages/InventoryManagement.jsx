import React, { useState } from "react";

function InventoryManagement() {
  const [inventory, setInventory] = useState([
    { id: 1, name: "Chicken Feed", category: "Feed", quantity: 100, unit: "kg" },
    { id: 2, name: "Antibiotics", category: "Medicine", quantity: 50, unit: "bottles" },
    { id: 3, name: "Water Drinker", category: "Equipment", quantity: 20, unit: "pieces" },
  ]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
      <div className="mb-4 flex gap-2">
        <button className="btn btn-primary">Add Inventory</button>
        <button className="btn btn-secondary">Update Inventory</button>
        <button className="btn btn-error">Delete Inventory</button>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-xs w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default InventoryManagement;
