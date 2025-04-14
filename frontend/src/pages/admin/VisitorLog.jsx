import { useState } from 'react';
import { FiUserPlus, FiClock, FiLogOut } from 'react-icons/fi';

function Visitors() {
  const [visitors, setVisitors] = useState([
    { id: 1, name: 'Alice', reason: 'Delivery', checkIn: '10:00 AM', checkOut: 'N/A' },
    { id: 2, name: 'Bob', reason: 'Meeting', checkIn: '09:30 AM', checkOut: '11:00 AM' },
    { id: 3, name: 'Charlie', reason: 'Inspection', checkIn: '11:15 AM', checkOut: 'N/A' },
  ]);

  const [newVisitor, setNewVisitor] = useState({
    name: '',
    reason: '',
    checkIn: '',
  });

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleCheckOut = (id) => {
    const checkOutTime = formatTime(new Date());
    
    setVisitors(visitors.map(visitor =>
      visitor.id === id ? { ...visitor, checkOut: checkOutTime } : visitor
    ));
  };

  const handleAddVisitor = (e) => {
    e.preventDefault();
    if (newVisitor.name && newVisitor.reason) {
      const checkInTime = formatTime(new Date());
      const newId = visitors.length > 0 ? Math.max(...visitors.map(v => v.id)) + 1 : 1;
      
      setVisitors([...visitors, {
        id: newId,
        name: newVisitor.name,
        reason: newVisitor.reason,
        checkIn: checkInTime,
        checkOut: 'N/A'
      }]);
      setNewVisitor({ name: '', reason: '', checkIn: '' });
    }
  };

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Visitor Log</h1>
        <p className="text-gray-600 mt-2">Track and manage visitor entries</p>
      </div>

      {/* New Visitor Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <FiUserPlus className="text-blue-600 text-xl mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">New Visitor</h2>
        </div>
        <form onSubmit={handleAddVisitor} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Visitor Name"
            value={newVisitor.name}
            onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Reason for Visit"
            value={newVisitor.reason}
            onChange={(e) => setNewVisitor({ ...newVisitor, reason: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <FiUserPlus className="mr-2" /> Add Visitor
          </button>
        </form>
      </div>

      {/* Visitors Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">#</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Reason for Visit</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                <div className="flex items-center">
                  <FiClock className="mr-2" />
                  Check-in
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                <div className="flex items-center">
                  <FiClock className="mr-2" />
                  Check-out
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {visitors.map((visitor) => (
              <tr key={visitor.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800">{visitor.id}</td>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">{visitor.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{visitor.reason}</td>
                <td className="px-6 py-4 text-sm text-green-600">{visitor.checkIn}</td>
                <td className="px-6 py-4 text-sm text-blue-600">{visitor.checkOut}</td>
                <td className="px-6 py-4">
                  {visitor.checkOut === 'N/A' && (
                    <button
                      onClick={() => handleCheckOut(visitor.id)}
                      className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <FiLogOut className="mr-1" /> Check-out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Visitors;