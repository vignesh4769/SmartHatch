import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import inventoryApi from "../../api/inventoryApi";
import { useTheme } from "../../context/ThemeContext";   // ← NEW

function Inventory() {
  /* ───────────────────────────── state ───────────────────────────── */
  const [inventory, setInventory]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newItem, setNewItem]       = useState({
    name: "",
    quantity: "",
    category: "other",
  });

  const { darkMode } = useTheme();                     // ← NEW

  /* ─────────────────────────── fetch on mount ───────────────────── */
  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getInventoryItems();
      setInventory(res?.data ?? []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch inventory");
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  /* ───────────────────── helpers: update / delete ───────────────── */
  const handleQuantityChange = async (id, diff) => {
    try {
      setSubmitting(true);
      const item         = inventory.find(i => i._id === id);
      const newQuantity  = Math.max(0, item.quantity + diff);
      await inventoryApi.updateInventoryItem(id, { quantity: newQuantity });
      await fetchInventory();
      toast.success("Quantity updated");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update quantity");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      setSubmitting(true);
      await inventoryApi.deleteInventoryItem(id);
      await fetchInventory();
      toast.success("Item deleted");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete item");
    } finally { setSubmitting(false); }
  };

  /* ───────────────────────── add new stock ──────────────────────── */
  const handleAddStock = async e => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      setSubmitting(true);
      const res = await inventoryApi.addInventoryItem(newItem);
      if (res?.success) {
        await fetchInventory();
        setNewItem({ name: "", quantity: "", category: "other" });
        toast.success("Item added");
      } else {
        toast.error("Failed to add item: Invalid response");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add item");
    } finally { setSubmitting(false); }
  };

  /* ─────────────────────────── render ───────────────────────────── */
  if (loading) {
    return (
      <div className="ml-64 p-8 flex justify-center items-center">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div
      className={`ml-64 p-8 transition-colors ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* ───── header ───── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Monitor stock levels and manage restocks.
        </p>
      </div>

      {/* ───── table ───── */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-blue-600">
            <tr>
              {["Name", "Quantity", "Actions", "Status", "Delete"].map(col => (
                <th
                  key={col}
                  className="px-6 py-4 text-left text-sm font-semibold text-white"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {inventory.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No inventory items found
                </td>
              </tr>
            ) : (
              inventory.map(item => (
                <tr key={item._id} className="hover:bg-blue-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm">{item.itemName}</td>
                  <td className="px-6 py-4 text-sm">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {[-1, 1].map(diff => (
                        <button
                          key={diff}
                          onClick={() => handleQuantityChange(item._id, diff)}
                          disabled={submitting}
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 disabled:opacity-50"
                        >
                          {diff > 0 ? "+" : "–"}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.quantity <= 5 ? (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm dark:bg-yellow-900 dark:text-yellow-300">
                        Request Restock
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm dark:bg-green-900 dark:text-green-300">
                        Sufficient
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={submitting}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 disabled:opacity-50"
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

      {/* ───── add new stock ───── */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Stock</h2>
        <form onSubmit={handleAddStock} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              required
              disabled={submitting}
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={e => setNewItem({ ...newItem, quantity: e.target.value })}
              required
              disabled={submitting}
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <select
              value={newItem.category}
              onChange={e => setNewItem({ ...newItem, category: e.target.value })}
              disabled={submitting}
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
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
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <div className="animate-spin h-5 w-5 mx-auto rounded-full border-b-2 border-white" />
            ) : (
              "Add Stock"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Inventory;
