import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployees } from "../../api/authApi";
import Button from "../../components/common/Button";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getEmployees();
        setEmployees(response.employees);
      } catch (error) {
        setError(error.message || "Failed to fetch employees");
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Employees</h2>
        <Button
          text="Add New Employee"
          className="btn btn-primary"
          onClick={() => navigate("/admin/register-employee")}
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Employee ID</th>
                <th>Position</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{`${employee.firstName} ${employee.lastName}`}</td>
                  <td>{employee.email}</td>
                  <td>{employee.employeeId}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;