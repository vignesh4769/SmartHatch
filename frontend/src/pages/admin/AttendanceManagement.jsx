import { useState, useEffect } from "react";
import {
  FiUserCheck,
  FiUserX,
  FiClock,
  FiCalendar,
  FiFilter,
  FiSave,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import {
  getAttendanceByDate,
  submitAttendanceRecords,
  getEmployeesByHatchery,
} from "../../api/attendanceAPI";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import api from "../../api/config";

function AttendanceManagement() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
  });

  // Fetch employees and attendance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch employees
        const employeesResponse = await api.get("/api/admin/employees");
        if (employeesResponse) {
          const activeEmployees = (employeesResponse.data.data || []).filter(
            (emp) => emp.deletedAt === null
          );
          setEmployees(activeEmployees);
        }
        

        // // Fetch attendance records for the selected date
        // const attendanceResponse = await getAttendanceByDate(filterDate);
        // if (attendanceResponse.success) {
        //   const records = attendanceResponse.data.map((item) => ({
        //     employee: item.employee._id,
        //     status: item.attendance?.status || null,
        //     date: filterDate,
        //   }));
        //   setAttendanceRecords(records);
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch attendance data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, filterDate]);

  // Calculate statistics
  useEffect(() => {
    const present = attendanceRecords.filter(
      (record) => record.status === "present"
    ).length;
    const absent = attendanceRecords.filter(
      (record) => record.status === "absent"
    ).length;
    const late = attendanceRecords.filter(
      (record) => record.status === "late"
    ).length;

    setStats({
      present,
      absent,
      late,
      total: employees.length,
    });
  }, [attendanceRecords, employees.length]);

  // Handle attendance status change
  const handleStatusChange = (employeeId, newStatus) => {
    setAttendanceRecords((prev) => {
      const existingRecord = prev.find(
        (record) => record.employee === employeeId
      );

      if (existingRecord) {
        // Update existing record
        return prev.map((record) =>
          record.employee === employeeId
            ? { ...record, status: newStatus }
            : record
        );
      } else {
        // Add new record
        return [
          ...prev,
          {
            employee: employeeId,
            date: filterDate,
            status: newStatus,
          },
        ];
      }
    });
  };

  // Submit attendance records
  const handleSubmit = async () => {
    try {
      setSaving(true);

      // Filter out records with no status
      const records = attendanceRecords
        .filter((record) => record.status)
        .map((record) => ({
          employeeId: record.employee,
          date: filterDate,
          status: record.status,
        }));

      if (records.length === 0) {
        toast.warning("No attendance records to save");
        setSaving(false);
        return;
      }

      // Submit to API
      const response = await submitAttendanceRecords(records);

      if (response.success) {
        // Show success message with number of records saved
        toast.success(
          `Successfully saved ${response.data.saved} attendance records`
        );

        // If there were any errors, show them
        if (response.data.errors && response.data.errors.length > 0) {
          toast.error(
            `Some records had errors: ${response.data.errors.join(", ")}`
          );
        }

        // Refresh the data
        const attendanceResponse = await getAttendanceByDate(filterDate);
        if (attendanceResponse.success) {
          const updatedRecords = attendanceResponse.data.map((item) => ({
            employee: item.employee._id,
            status: item.attendance?.status || null,
            date: filterDate,
          }));
          setAttendanceRecords(updatedRecords);
        }
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error(error.response?.data?.error || "Failed to submit attendance");
    } finally {
      setSaving(false);
    }
  };

  // Get employee name by ID
  const getEmployeeName = (employeeId) => {
    const employee = employees.find((emp) => emp._id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Unknown";
  };

  // Get employee department by ID
  const getEmployeeDepartment = (employeeId) => {
    const employee = employees.find((emp) => emp._id === employeeId);
    return employee ? employee.department : "Unknown";
  };

  // Get attendance status for an employee
  const getAttendanceStatus = (employeeId) => {
    const record = attendanceRecords.find(
      (record) => record.employee === employeeId
    );
    return record ? record.status : null;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Attendance Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor employee attendance and statistics
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.total}
              </h3>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <FiUserCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Present Today</p>
              <h3 className="text-2xl font-bold text-green-600">
                {stats.present}
              </h3>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <FiUserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Absent Today</p>
              <h3 className="text-2xl font-bold text-red-600">
                {stats.absent}
              </h3>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <FiUserX className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Late Arrivals</p>
              <h3 className="text-2xl font-bold text-yellow-600">
                {stats.late}
              </h3>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FiFilter className="text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold">Attendance Records</h2>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FiSave className="mr-2" />
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => {
                const status = getAttendanceStatus(employee._id);
                return (
                  <tr key={employee._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {`${employee.firstName[0]}${employee.lastName[0]}`}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {`${employee.firstName} ${employee.lastName}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          status === "present"
                            ? "bg-green-100 text-green-800"
                            : status === "absent"
                            ? "bg-red-100 text-red-800"
                            : status === "late"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {status
                          ? status.charAt(0).toUpperCase() + status.slice(1)
                          : "Not Marked"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleStatusChange(employee._id, "present")
                          }
                          className={`px-3 py-1 rounded-lg flex items-center ${
                            status === "present"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <FiUserCheck className="mr-1" /> Present
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(employee._id, "absent")
                          }
                          className={`px-3 py-1 rounded-lg flex items-center ${
                            status === "absent"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <FiUserX className="mr-1" /> Absent
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(employee._id, "late")
                          }
                          className={`px-3 py-1 rounded-lg flex items-center ${
                            status === "late"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <FiClock className="mr-1" /> Late
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendanceManagement;
