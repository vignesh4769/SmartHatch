import { useState } from "react";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", role: "Manager", email: "john@example.com" },
    { id: 2, name: "Jane Smith", role: "HR", email: "jane@example.com" },
  ]);

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">ID</th>
          <th className="border p-2">Name</th>
          <th className="border p-2">Role</th>
          <th className="border p-2">Email</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id}>
            <td className="border p-2">{employee.id}</td>
            <td className="border p-2">{employee.name}</td>
            <td className="border p-2">{employee.role}</td>
            <td className="border p-2">{employee.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeeTable;
