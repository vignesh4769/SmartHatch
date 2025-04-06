import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../../api/adminApi';
import EmployeeTable from '../../components/admin/EmployeeTable';
import EmployeeCard from '../../components/admin/EmployeeCard';
import EmployeeFormModal from '../../components/admin/EmployeeFormModal';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const data = await getEmployees();
        setEmployees(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err);
        toast.error(err.message);
        setEmployees([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    const reason = prompt('Please enter reason for deactivation:');
    if (!reason) return;

    try {
      await deleteEmployee({ id, reason });
      const updatedEmployees = await getEmployees();
      setEmployees(Array.isArray(updatedEmployees) ? updatedEmployees : []);
      toast.success('Employee deactivated successfully');
      
      if (selectedEmployee?.id === id) {
        setSelectedEmployee(null);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEmployeeUpdate = (updatedEmployee) => {
    if (selectedEmployee) {
      setEmployees(employees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      ));
      setSelectedEmployee(updatedEmployee); // Update the displayed employee
    } else {
      const newEmployee = { ...updatedEmployee, id: Date.now() };
      setEmployees([...employees, newEmployee]);
      setSelectedEmployee(newEmployee); // Show the newly added employee
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 ml-48 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <button
            onClick={() => {
              setSelectedEmployee(null);
              setIsFormOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Employee
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex gap-5">
          {/* Employee Table Section - Wider to accommodate more columns */}
          <div className="w-3/4">
            <EmployeeTable
              employees={employees}
              onEdit={(employee) => {
                setSelectedEmployee(employee);
                setIsFormOpen(true);
              }}
              onDelete={handleDelete}
              onSelect={(employee) => {
                setSelectedEmployee(employee);
              }}
            />
          </div>

          {/* Employee Card Section */}
          <div className="w-1/4">
            {selectedEmployee ? (
              <EmployeeCard employee={selectedEmployee} />
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-full flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Select an employee from the table to view details
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Employee Form Modal */}
        <EmployeeFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
          }}
          employee={selectedEmployee}
          onSuccess={handleEmployeeUpdate}
        />
      </div>
    </div>
  );
};

export default EmployeeManagement;