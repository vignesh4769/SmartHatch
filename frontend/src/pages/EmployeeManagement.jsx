import { useState } from "react";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeForm from "../components/EmployeeForm";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", job: "Developer", jobTitle: "Software Engineer", country: "USA" },
    { id: 2, name: "Jane Smith", job: "Manager", jobTitle: "Project Manager", country: "UK" },
  ]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const addEmployee = (newEmp) => {
    setEmployees([...employees, { id: Date.now(), ...newEmp }]); // Unique ID
  };

  const updateEmployee = (updatedEmp) => {
    setEmployees(employees.map((emp) => (emp.id === updatedEmp.id ? updatedEmp : emp)));
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    if (selectedEmployee?.id === id) {
      setSelectedEmployee(null);
      setIsFormOpen(false); // Close form if employee is deleted
    }
  };

  const handleFormSubmit = (formData) => {
    if (selectedEmployee) {
      updateEmployee({ ...selectedEmployee, ...formData });
    } else {
      addEmployee(formData);
    }
    setIsFormOpen(false); // Close form after submission
    setSelectedEmployee(null); // Reset selection after submission
  };

  return (
    <div className="flex min-h-screen bg-gray-100 ml-48 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              setSelectedEmployee(null);
              setIsFormOpen(true);
            }}
          >
            Add Employee
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex gap-5">
          {/* Employee Table Section */}
          <div className="w-2/3">
            <EmployeeTable
              employees={employees}
              selectEmployee={(emp) => {
                setSelectedEmployee(emp);
                setIsFormOpen(true); // Open form when selecting an employee
              }}
              deleteEmployee={deleteEmployee}
            />
          </div>

          {/* Employee Card Section */}
          <div className="w-1/3">
            <EmployeeCard employee={selectedEmployee} />
          </div>
        </div>

        {/* Employee Form */}
        {isFormOpen && (
          <div className="mt-6">
            <EmployeeForm
              employee={selectedEmployee}
              onSubmit={handleFormSubmit}
              onClose={() => {
                setIsFormOpen(false);
                setSelectedEmployee(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
