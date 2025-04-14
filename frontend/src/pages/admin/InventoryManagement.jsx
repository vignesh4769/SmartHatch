import { useState } from 'react';

function Inventory() {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Feed', quantity: 20, status: 'Sufficient' },
    { id: 2, name: 'Medicine', quantity: 5, status: 'Low' },
    { id: 3, name: 'Equipment', quantity: 15, status: 'Sufficient' },
  ]);

  const [newItem, setNewItem] = useState({ name: '', quantity: '' });

  const handleQuantityChange = (id, change) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
    ));
  };

  const handleDelete = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const handleAddStock = (e) => {
    e.preventDefault();
    if (newItem.name && newItem.quantity) {
      setInventory([...inventory, {
        id: inventory.length + 1,
        name: newItem.name,
        quantity: parseInt(newItem.quantity),
        status: parseInt(newItem.quantity) > 10 ? 'Sufficient' : 'Low'
      }]);
      setNewItem({ name: '', quantity: '' });
    }
  };

  return (
    <div className="ml-64 p-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Dashboard</h1>
        <p className="text-gray-600">Monitor stock levels and manage restocks.</p>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800">{item.name}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{item.quantity}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {item.quantity <= 5 ? (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Request Restock
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Sufficient
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Stock Form */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Stock</h2>
        <form onSubmit={handleAddStock} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Stock
          </button>
        </form>
      </div>
    </div>
  );
}

export default Inventory;