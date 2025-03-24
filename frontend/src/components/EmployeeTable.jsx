import { FaEdit, FaTrash } from "react-icons/fa";

const EmployeeTable = ({ employees, selectEmployee, deleteEmployee }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* Table Head */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Job</th>
            <th>Actions</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>
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
                    <div className="font-bold">{employee.name}</div>
                    <div className="text-sm opacity-50">{employee.country}</div>
                  </div>
                </div>
              </td>
              <td>
                {employee.job}
                {employee.jobTitle && (
                  <br />
                )}
                {employee.jobTitle && <span className="badge badge-ghost badge-sm">{employee.jobTitle}</span>}
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => selectEmployee(employee)}
                  >
                    <FaEdit className="text-blue-500" />
                  </button>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => deleteEmployee(employee.id)}
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        {/* Table Foot */}
        <tfoot>
          <tr>
            <th>Name</th>
            <th>Job</th>
            <th>Actions</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default EmployeeTable;
