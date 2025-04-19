import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import inventoryApi from '../../api/inventoryApi';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newItem, setNewItem] = useState({ 
    name: '', 
    quantity: '',
    category: 'other'
  });

  // Fetch inventory data on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await inventoryApi.getInventoryItems();
      console.log('Fetched inventory response:', response); // Debug log
      if (response && response.data) {
        setInventory(response.data);
      } else {
        console.error('Invalid inventory response format:', response);
        setInventory([]);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch inventory');
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (id, change) => {
    try {
      setSubmitting(true);
      const item = inventory.find(item => item._id === id);
      const newQuantity = Math.max(0, item.quantity + change);
      
      await inventoryApi.updateInventoryItem(id, {
        quantity: newQuantity
      });
      
      // Refresh the inventory list after update
      await fetchInventory();
      toast.success('Quantity updated successfully');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      setSubmitting(true);
      await inventoryApi.deleteInventoryItem(id);
      // Refresh the inventory list after deletion
      await fetchInventory();
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(error.response?.data?.message || 'Failed to delete item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      console.log('Adding new item:', newItem); // Debug log
      const response = await inventoryApi.addInventoryItem(newItem);
      console.log('Add item response:', response); // Debug log
      
      if (response && response.success) {
        // Refresh the inventory list after adding
        await fetchInventory();
        
        setNewItem({ 
          name: '', 
          quantity: '',
          category: 'other'
        });
        toast.success('Item added successfully');
      } else {
        console.error('Invalid response format:', response);
        toast.error('Failed to add item: Invalid response format');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error(error.response?.data?.message || 'Failed to add item');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="ml-64 p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No inventory items found
                </td>
              </tr>
            ) : (
              inventory.map(item => (
                <tr key={item._id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800">{item.itemName}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{item.quantity} {item.unit}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, -1)}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting}
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleQuantityChange(item._id, 1)}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.quantity <= item.reorderPoint ? (
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
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={submitting}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Stock Form */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Stock</h2>
        <form onSubmit={handleAddStock} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={submitting}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={submitting}
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
            >
              <option value="feed">Feed</option>
              <option value="equipment">Equipment</option>
              <option value="medicine">Medicine</option>
              <option value="chemicals">Chemicals</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
            ) : (
              'Add Stock'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Inventory;