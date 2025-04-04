import { FaEdit, FaTrash } from "react-icons/fa";

const EmployeeTable = ({ employees, selectEmployee, deleteEmployee }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full border-collapse border border-gray-200 shadow-lg">
        {/* Table Head */}
        <thead className="bg-gray-200">
          <tr className="text-left">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Shift</th>
            <th className="px-4 py-2 border">Phone Number</th>
            <th className="px-4 py-2 border">Address</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-100">
              {/* Name with clickable event */}
              <td className="px-4 py-2 border">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src={employee.avatar || "https://img.daisyui.com/images/profile/demo/2@94.webp"}
                        alt="Employee Avatar"
                      />
                    </div>
                  </div>
                  <div>
                    <div
                      className="font-bold text-blue-600 hover:underline cursor-pointer"
                      onClick={() => selectEmployee(employee)}
                    >
                      {employee.name}
                    </div>
                    <div className="text-sm opacity-50">{employee.country}</div>
                  </div>
                </div>
              </td>

              {/* Role */}
              <td className="px-4 py-2 border">{employee.jobTitle || employee.job}</td>

              {/* Shift */}
              <td className="px-4 py-2 border">{employee.shift || "Not Assigned"}</td>

              {/* Phone Number */}
              <td className="px-4 py-2 border">{employee.phone || "N/A"}</td>

              {/* Address */}
              <td className="px-4 py-2 border">{employee.address || "N/A"}</td>

              {/* Action Buttons */}
              <td className="px-4 py-2 border">
                <div className="flex gap-2">
                  {/* Edit Button */}
                  <button
                    className="btn btn-sm btn-outline btn-primary"
                    onClick={() => selectEmployee(employee)}
                  >
                    <FaEdit />
                  </button>

                  {/* Delete Button */}
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => deleteEmployee(employee.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>

        {/* Table Foot */}
        <tfoot className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Shift</th>
            <th className="px-4 py-2 border">Phone Number</th>
            <th className="px-4 py-2 border">Address</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default EmployeeTable;
