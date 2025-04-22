import React, { useState, useEffect } from 'react';
import { FaDownload, FaFileInvoiceDollar, FaSync } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/config';

const MySalary = () => {
  const { user } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSalaryData();
  }, []);

  const fetchSalaryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/employees/${user._id}/salary-history`);
      setPaymentHistory(response.data.data);
    } catch (error) {
      console.error('Error fetching salary data:', error);
      setError('Failed to load salary data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPayslip = async (paymentId) => {
    try {
      const response = await api.get(`/api/employees/${user._id}/payslip/${paymentId}`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payslip-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading payslip:', error);
      setError('Failed to download payslip. Please try again.');
    }
  };

  return (
    <div className="flex">
      {/* Main Content - Added margin-left for dashboard sidebar and proper padding */}
      <div className="flex-1 ml-64 p-8 bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Salary Details</h1>
            <p className="text-gray-600 mt-1">View and manage your salary information</p>
          </div>

          {/* Payment History Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">Payment History</h2>
                <button
                  onClick={fetchSalaryData}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  disabled={loading}
                  aria-label="Refresh salary data"
                >
                  <FaSync className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
              <FaFileInvoiceDollar className="text-3xl text-blue-600" />
            </div>

            <div className="p-4">
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : paymentHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No payment history available
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">{payment.id}</td>
                          <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-900">{payment.month}</td>
                          <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">
                            ₹{payment.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap">
                            <span className={`px-4 py-1.5 text-xs rounded-full font-medium ${
                              payment.status === 'Paid' 
                                ? 'bg-green-100 text-green-800' 
                                : payment.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                          <td className="px-8 py-5 whitespace-nowrap">
                            <button
                              onClick={() => downloadPayslip(payment.id)}
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
                              disabled={loading}
                            >
                              <FaDownload className="text-sm" />
                              <span>Download</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySalary;