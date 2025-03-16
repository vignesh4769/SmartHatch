import React, { useState } from "react";

function EmployeeManagement() {
  const [employees, setEmployees] = useState([
    { id: "EMP001", name: "John Doe", email: "john@example.com" },
  ]);

  return (
    <div className="container">
      <h2>Employee Management</h2>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeManagement;
