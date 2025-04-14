import React, { useState } from 'react';
import { FaDownload, FaFileInvoiceDollar } from 'react-icons/fa';

const MySalary = () => {
  const [paymentHistory] = useState([
    {
      id: 'PAY123456',
      month: 'March 2025',
      amount: 35000,
      status: 'Paid',
      date: 'April 1, 2025'
    },
    {
      id: 'PAY123457',
      month: 'February 2025',
      amount: 35000,
      status: 'Paid',
      date: 'March 1, 2025'
    }
  ]);

  const downloadPayslip = (paymentId) => {
    console.log(`Downloading payslip: ${paymentId}`);
    // Actual logic to download PDF can be added here
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
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Payment History</h2>
                <p className="text-sm text-gray-500 mt-2">View and download your salary statements</p>
              </div>
              <FaFileInvoiceDollar className="text-3xl text-blue-600" />
            </div>
            
            <div className="overflow-x-auto p-4">
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
                        <span className="px-4 py-1.5 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <button
                          onClick={() => downloadPayslip(payment.id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySalary;
