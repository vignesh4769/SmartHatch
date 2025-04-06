import React from 'react';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { useState, useEffect } from 'react';

const MySalary = () => {
  const { user } = useAuth();
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await axios.get(`/api/employee/salary/${user._id}`);
        setSalaryData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch salary data');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, [user._id]);

  if (loading) return <div className="p-4">Loading salary information...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Salary Details</h1>
      
      {salaryData && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-500">Basic Salary</h3>
              <p className="text-lg">${salaryData.basicSalary.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Allowances</h3>
              <p className="text-lg">${salaryData.allowances.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Deductions</h3>
              <p className="text-lg">${salaryData.deductions.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Net Salary</h3>
              <p className="text-lg font-bold">
                ${(salaryData.basicSalary + salaryData.allowances - salaryData.deductions).toFixed(2)}
              </p>
            </div>
          </div>
          
          {/* Add more salary details as needed */}
        </div>
      )}
    </div>
  );
};

export default MySalary; // This is the crucial default export