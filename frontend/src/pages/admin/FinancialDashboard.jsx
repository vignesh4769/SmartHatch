import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

function Financial() {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    date: '',
    description: '',
    amount: '',
    type: 'income'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newRecord.date || !newRecord.description || !newRecord.amount) {
      alert('Please fill all fields');
      return;
    }
    
    if (isEditing) {
      setRecords(prev => prev.map(record => 
        record.id === editId ? { ...newRecord, id: editId } : record
      ));
      setIsEditing(false);
      setEditId(null);
    } else {
      setRecords(prev => [...prev, { ...newRecord, id: Date.now() }]);
    }
    
    setNewRecord({
      date: '',
      description: '',
      amount: '',
      type: 'income'
    });
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditId(record.id);
    setNewRecord(record);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setRecords(prev => prev.filter(record => record.id !== id));
    }
  };

  const totalIncome = records
    .filter(record => record.type === 'income')
    .reduce((sum, record) => sum + parseFloat(record.amount), 0);

  const totalExpense = records
    .filter(record => record.type === 'expense')
    .reduce((sum, record) => sum + parseFloat(record.amount), 0);

  return (
    <div className="ml-64 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Financial Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-lg text-gray-600 mb-2">Total Balance</h3>
            <p className="text-2xl font-bold">₹{(totalIncome - totalExpense).toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-lg text-gray-600 mb-2">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">₹{totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h3 className="text-lg text-gray-600 mb-2">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">₹{totalExpense.toFixed(2)}</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {isEditing ? 'Edit Record' : 'Add New Record'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="date"
                name="date"
                value={newRecord.date}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="description"
                value={newRecord.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="number"
                  name="amount"
                  value={newRecord.amount}
                  onChange={handleInputChange}
                  placeholder="Amount"
                  className="pl-7 border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                name="type"
                value={newRecord.type}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              {isEditing ? 'Update Record' : 'Add Record'}
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {records.map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{record.date}</td>
                  <td className="px-6 py-4 text-gray-700">{record.description}</td>
                  <td className="px-6 py-4 text-gray-700">₹{record.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      record.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Financial;