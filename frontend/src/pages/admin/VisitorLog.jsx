import { useState, useEffect } from 'react';
import { FiUserPlus, FiClock, FiLogOut } from 'react-icons/fi';
import visitorApi from '../../api/visitorApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    reason: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Check authentication and fetch visitors on component mount
  useEffect(() => {
    if (!user) {
      toast.error('Please log in to access this page');
      navigate('/login');
      return;
    }
    fetchVisitors();
  }, [navigate, user]);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const data = await visitorApi.getVisitors();
      setVisitors(data.data);
      console.log(visitors);
    } catch (error) {
      console.error('Error fetching visitors:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch visitors');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleCheckOut = async (id) => {
    try {
      setSubmitting(true);
      await visitorApi.checkOutVisitor(id);
      toast.success('Visitor checked out successfully');
      fetchVisitors(); // Refresh the list
    } catch (error) {
      console.error('Error checking out visitor:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to check out visitor');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddVisitor = async (e) => {
    e.preventDefault();
    
    // Check for required fields
    if (!newVisitor.name || !newVisitor.reason) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      await visitorApi.addVisitor(newVisitor);
      toast.success('Visitor added successfully');
      setNewVisitor({
        name: '',
        reason: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchVisitors(); // Refresh the list
    } catch (error) {
      console.error('Error adding visitor:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add visitor');
      }
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
            disabled={submitting}
          />
          <input
            type="text"
            placeholder="Reason for Visit"
            value={newVisitor.reason}
            onChange={(e) => setNewVisitor({ ...newVisitor, reason: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={submitting}
          />
          <input
            type="date"
            value={newVisitor.date}
            onChange={(e) => setNewVisitor({ ...newVisitor, date: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={submitting}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <FiUserPlus className="mr-2" /> Add Visitor
              </>
            )}
          </button>
        </form>
      </div>

      {/* Visitors Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
            <tr>
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
            {visitors.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No visitors found
                </td>
              </tr>
            ) : (
              visitors.map((visitor) => (
                <tr key={visitor._id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{visitor.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{visitor.reason}</td>
                  <td className="px-6 py-4 text-sm text-green-600">{formatTime(visitor.checkIn)}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">
                    {visitor.checkOut ? formatTime(visitor.checkOut) : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {!visitor.checkOut && (
                      <button
                        onClick={() => handleCheckOut(visitor._id)}
                        className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        ) : (
                          <>
                            <FiLogOut className="mr-1" /> Check-out
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Visitors;