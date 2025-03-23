import React, { useState } from "react";
import EmployeeAttendanceTable from "../components/EmployeeAttendanceTable";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";

function EmployeeManagement() {
  const [employees, setEmployees] = useState([
    { id: "EMP001", name: "John Doe", role: "Manager", email: "john@example.com", phone: "1234567890", address: "123 Main St" },
  ]);
  const [newEmployee, setNewEmployee] = useState({ id: "", name: "", role: "", email: "", phone: "", address: "" });
  const [showForm, setShowForm] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");

  const addEmployee = () => {
    if (!newEmployee.name || !newEmployee.role || !newEmployee.email || !newEmployee.phone || !newEmployee.address) {
      alert("All fields are required!");
      return;
    }
    setEmployees([...employees, { id: `EMP${employees.length + 1}`, ...newEmployee }]);
    setNewEmployee({ id: "", name: "", role: "", email: "", phone: "", address: "" });
    setShowForm(false);
  };

  const deleteEmployee = () => {
    setEmployees(employees.filter((emp) => emp.id !== deleteId));
    setShowDeletePrompt(false);
    setDeleteReason("");
  };

  const editEmployee = (id) => {
    const emp = employees.find((emp) => emp.id === id);
    if (emp) {
      setNewEmployee(emp);
      setShowForm(true);
    }
  };

  return (
    <div className="container p-4">
      {/* Action Buttons */}
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white p-2 rounded flex items-center">
          <FaUserPlus className="mr-2" /> Add Employee
        </button>
      </div>

      {/* Employee Registration Form */}
      {showForm && (
        <div className="bg-white p-4 border rounded mb-4">
          <h3 className="text-lg font-bold mb-2">{newEmployee.id ? "Edit Employee" : "Add Employee"}</h3>
          <input type="text" placeholder="Name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} className="border p-2 w-full mb-2" />
          <input type="text" placeholder="Role" value={newEmployee.role} onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })} className="border p-2 w-full mb-2" />
          <input type="email" placeholder="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} className="border p-2 w-full mb-2" />
          <input type="text" placeholder="Phone" value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} className="border p-2 w-full mb-2" />
          <input type="text" placeholder="Address" value={newEmployee.address} onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })} className="border p-2 w-full mb-2" />
          <button onClick={addEmployee} className="bg-green-500 text-white p-2 rounded w-full">Save</button>
        </div>
      )}

      {/* Employee Table */}
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border">
              <td className="border p-2">{emp.id}</td>
              <td className="border p-2">{emp.name}</td>
              <td className="border p-2">{emp.role}</td>
              <td className="border p-2">{emp.email}</td>
              <td className="border p-2">{emp.phone}</td>
              <td className="border p-2">{emp.address}</td>
              <td className="border p-2">
                <button onClick={() => editEmployee(emp.id)} className="text-yellow-500 mr-2">
                  <FaEdit />
                </button>
                <button onClick={() => { setDeleteId(emp.id); setShowDeletePrompt(true); }} className="text-red-500">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation */}
      {showDeletePrompt && (
        <div className="bg-white p-4 border rounded mt-4">
          <h3 className="text-lg font-bold">Delete Employee</h3>
          <p>Enter reason for deletion:</p>
          <input type="text" placeholder="Reason" value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} className="border p-2 w-full mb-2" />
          <button onClick={deleteEmployee} className="bg-red-500 text-white p-2 rounded w-full">Confirm Delete</button>
        </div>
      )}
    </div>
  );
}

export default EmployeeManagement;
