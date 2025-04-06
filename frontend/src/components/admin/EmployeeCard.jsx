import React from 'react';

const EmployeeCard = ({ employee }) => {
  if (!employee) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Employee Details</h2>
      
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-700">Basic Information</h3>
          <div className="pl-2 mt-1">
            <p><span className="font-medium">Name:</span> {employee.name}</p>
            <p><span className="font-medium">ID:</span> {employee.id}</p>
            <p><span className="font-medium">Email:</span> {employee.email || 'N/A'}</p>
            <p><span className="font-medium">Phone:</span> {employee.phone || 'N/A'}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Job Information</h3>
          <div className="pl-2 mt-1">
            <p><span className="font-medium">Position:</span> {employee.jobTitle || employee.position || 'N/A'}</p>
            <p><span className="font-medium">Department:</span> {employee.department || 'N/A'}</p>
            <p><span className="font-medium">Shift:</span> {employee.shift || 'N/A'}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Contact Information</h3>
          <div className="pl-2 mt-1">
            <p><span className="font-medium">Address:</span> {employee.address || 'N/A'}</p>
            <p><span className="font-medium">Country:</span> {employee.country || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;