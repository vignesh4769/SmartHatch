import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import EmployeeTable from "../components/EmployeeTable";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeForm from "../components/EmployeeForm";

const EmployeeManagement = () => {
  const navigate = useNavigate(); // Navigation hook
  const [employees, setEmployees] = useState([
    { 
      id: 1, name: "John Doe", job: "Developer", jobTitle: "Software Engineer", 
      shift: "Morning", phone: "123-456-7890", address: "123 Main St, NY", country: "USA"
    },
    { 
      id: 2, name: "Jane Smith", job: "Manager", jobTitle: "Project Manager", 
      shift: "Evening", phone: "987-654-3210", address: "456 Elm St, London", country: "UK"
    },
  ]);
  
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const addEmployee = (newEmp) => {
    setEmployees([...employees, { id: Date.now(), ...newEmp }]);
  };

  const updateEmployee = (updatedEmp) => {
    setEmployees(employees.map((emp) => (emp.id === updatedEmp.id ? updatedEmp : emp)));
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    if (selectedEmployee?.id === id) {
      setSelectedEmployee(null);
      setIsFormOpen(false);
    }
  };

  const handleFormSubmit = (formData) => {
    if (selectedEmployee) {
      updateEmployee({ ...selectedEmployee, ...formData });
    } else {
      addEmployee(formData);
    }
    setIsFormOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 ml-48 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate("/register")} // Redirect to EmployeeRegistration page
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
                setIsFormOpen(false); // Just display details, don't open form
              }}
              editEmployee={(emp) => {
                setSelectedEmployee(emp);
                setIsFormOpen(true); // Open form when updating
              }}
              deleteEmployee={deleteEmployee}
            />
          </div>

          {/* Employee Card Section (Shows Employee Details) */}
          <div className="w-1/3">
            {selectedEmployee ? (
              <EmployeeCard employee={selectedEmployee} />
            ) : (
              <p className="text-gray-500">Select an employee to view details.</p>
            )}
          </div>
        </div>

        {/* Employee Form (Only for Update) */}
        {isFormOpen && selectedEmployee && (
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
