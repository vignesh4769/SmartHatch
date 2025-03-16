import React from "react";

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-3 gap-6 mt-6">
      <div className="bg-white p-5 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Attendance</h3>
        <p className="text-2xl font-bold text-green-500">85%</p>
      </div>
      <div className="bg-white p-5 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Monthly Expenses</h3>
        <p className="text-2xl font-bold text-red-500">₹12,000</p>
      </div>
      <div className="bg-white p-5 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Hatchery Performance</h3>
        <p className="text-2xl font-bold text-blue-500">90% Success</p>
      </div>
    </div>
  );
};

export default DashboardStats;
