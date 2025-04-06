import React from 'react';

const EmployeeTable = ({ employees = [], onEdit, onDelete }) => {
  // Ensure we always work with an array
  const safeEmployees = Array.isArray(employees) ? employees : [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Role</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {safeEmployees.length > 0 ? (
            safeEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{employee.id}</td>
                <td className="py-2 px-4 border">{employee.name}</td>
                <td className="py-2 px-4 border">{employee.email}</td>
                <td className="py-2 px-4 border">{employee.role}</td>
                <td className="py-2 px-4 border">{employee.status}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => onEdit(employee)}
                    className="mr-2 text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(employee.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-4 text-center text-gray-500">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;