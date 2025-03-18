import React, { useState } from "react";

const EmployeeAttendanceTable = () => {
  // Dummy Employee List (Replace with backend data)
  const employees = [
    { id: 1, name: "John Doe", country: "USA", role: "Technician", avatar: "https://img.daisyui.com/images/profile/demo/2@94.webp" },
    { id: 2, name: "Alice Smith", country: "China", role: "Supervisor", avatar: "https://img.daisyui.com/images/profile/demo/3@94.webp" },
    { id: 3, name: "Mark Johnson", country: "Russia", role: "Worker", avatar: "https://img.daisyui.com/images/profile/demo/4@94.webp" },
    { id: 4, name: "Emily Davis", country: "Brazil", role: "Manager", avatar: "https://img.daisyui.com/images/profile/demo/5@94.webp" },
  ];

  // State to track attendance and timestamp
  const [attendance, setAttendance] = useState({});

  // Function to mark attendance
  const markAttendance = (employeeId, status) => {
    const timestamp = new Date().toLocaleString(); // Capture current time
    setAttendance({
      ...attendance,
      [employeeId]: { status, timestamp },
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        {/* Table Header */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Attendance</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        
        {/* Table Body */}
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img src={emp.avatar} alt="Employee Avatar" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{emp.name}</div>
                    <div className="text-sm opacity-50">{emp.country}</div>
                  </div>
                </div>
              </td>
              <td>
                {emp.role}
                <br />
                <span className="badge badge-ghost badge-sm">{emp.role}</span>
              </td>
              <td>
                {/* Attendance Buttons */}
                <button
                  className={`btn btn-sm ${attendance[emp.id]?.status === "Present" ? "btn-success" : "btn-outline"}`}
                  onClick={() => markAttendance(emp.id, "Present")}
                >
                  Present
                </button>
                <button
                  className={`btn btn-sm ml-2 ${attendance[emp.id]?.status === "Absent" ? "btn-error" : "btn-outline"}`}
                  onClick={() => markAttendance(emp.id, "Absent")}
                >
                  Absent
                </button>
              </td>
              <td>
                {attendance[emp.id]?.timestamp ? (
                  <span className="text-gray-600">{attendance[emp.id]?.timestamp}</span>
                ) : (
                  "Not Marked"
                )}
              </td>
              <td>
                <button className="btn btn-ghost btn-xs">Details</button>
              </td>
            </tr>
          ))}
        </tbody>

        {/* Table Footer */}
        <tfoot>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Attendance</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default EmployeeAttendanceTable;
