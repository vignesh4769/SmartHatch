import { useState, useEffect } from "react";
import {
  FiUserCheck,
  FiUserX,
  FiClock,
  FiCalendar,
  FiFilter,
  FiSave,
  FiBriefcase,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import attendanceApi from "../../api/attendanceApi";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import api from "../../api/config";

function AttendanceManagement() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filterDate, setFilterDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
  });
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const employeesResponse = await api.get("/api/admin/employees");
        
        if (employeesResponse?.data?.data) {
          const activeEmployees = employeesResponse.data.data.filter(
            (emp) => emp.deletedAt === null
          );
          setEmployees(activeEmployees);

          // Initialize attendance records for all active employees
          const initialRecords = activeEmployees.map(employee => ({
            employeeId: employee._id,
            name: `${employee.firstName} ${employee.lastName}`,
            email: employee.email,
            department: employee.department,
            status: "not-marked",
            checkIn: null,
            _id: null
          }));

          // Fetch attendance data for the selected date
          const attendanceResponse = await attendanceApi.getAttendanceByDate(filterDate);
          if (attendanceResponse.success) {
            // Merge existing attendance records with initial records
            const existingRecords = attendanceResponse.data.map((item) => ({
              employeeId: item.employeeId._id,
              name: `${item.employeeId.firstName} ${item.employeeId.lastName}`,
              email: item.employeeId.email,
              department: item.employeeId.department,
              status: item.status,
              checkIn: item.checkIn,
              _id: item._id,
            }));

            // Update initial records with existing attendance data
            const mergedRecords = initialRecords.map(record => {
              const existingRecord = existingRecords.find(
                existing => existing.employeeId === record.employeeId
              );
              return existingRecord || record;
            });

            setAttendanceRecords(mergedRecords);
            updateStats(mergedRecords);
          } else {
            setAttendanceRecords(initialRecords);
            updateStats(initialRecords);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterDate]);

  const updateStats = (records) => {
    const stats = records.reduce(
      (acc, curr) => {
        acc.total++;
        acc[curr.status]++;
        return acc;
      },
      {
        present: 0,
        absent: 0,
        late: 0,
        "half-day": 0,
        "on-leave": 0,
        total: 0,
      }
    );
    setStats(stats);
  };

  const handleStatusChange = (employeeId, status) => {
    // Get the exact current time
    const now = new Date();
    const checkInTime = new Date(filterDate);
    checkInTime.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), 0);

    // Only set check-in time for present, late, and half-day status
    const shouldSetCheckIn = ["present", "late", "half-day"].includes(status);

    setAttendanceRecords((prev) => {
      const existingRecord = prev.find((record) => record.employeeId === employeeId);
      if (existingRecord) {
        // Update existing record
        return prev.map((record) =>
          record.employeeId === employeeId
            ? { ...record, status, checkIn: shouldSetCheckIn ? checkInTime : null }
            : record
        );
      } else {
        // Create new record
        const employee = employees.find((emp) => emp._id === employeeId);
        return [
          ...prev,
          {
            employeeId,
            name: `${employee.firstName} ${employee.lastName}`,
            email: employee.email,
            department: employee.department,
            status,
            checkIn: shouldSetCheckIn ? checkInTime : null,
            _id: null,
          },
        ];
      }
    });
  };

  const handleCheckInChange = (employeeId, checkIn) => {
    setAttendanceRecords((prev) => {
      const existingRecord = prev.find((record) => record.employeeId === employeeId);
      if (existingRecord) {
        // Update existing record
        return prev.map((record) =>
          record.employeeId === employeeId ? { ...record, checkIn } : record
        );
      } else {
        // Create new record
        const employee = employees.find((emp) => emp._id === employeeId);
        return [
          ...prev,
          {
            employeeId,
            name: `${employee.firstName} ${employee.lastName}`,
            email: employee.email,
            department: employee.department,
            status: "present", // Default to present when setting check-in time
            checkIn,
            _id: null,
          },
        ];
      }
    });
  };

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setFilterDate(newDate);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      // Get all records that have been marked
      const markedRecords = attendanceRecords.filter(record => 
        record.status && record.status !== "not-marked"
      );

      if (markedRecords.length === 0) {
        toast.warning("Please mark attendance for at least one employee");
        return;
      }

      // Format records for submission
      const records = markedRecords.map(record => ({
        employeeId: record.employeeId,
        date: filterDate,
        status: record.status,
        checkIn: record.checkIn
      }));

      const response = await attendanceApi.submitAttendanceRecords({ records });

      if (response.success) {
        toast.success("Attendance records saved successfully");
        // Refresh the data
        const attendanceResponse = await attendanceApi.getAttendanceByDate(filterDate);
        if (attendanceResponse.success) {
          const newRecords = attendanceResponse.data.map((item) => ({
            employeeId: item.employeeId._id,
            name: `${item.employeeId.firstName} ${item.employeeId.lastName}`,
            email: item.employeeId.email,
            department: item.employeeId.department,
            status: item.status,
            checkIn: item.checkIn,
            _id: item._id,
          }));
          setAttendanceRecords(newRecords);
          updateStats(newRecords);
        }
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      const errorMessage = error.response?.data?.error || "Failed to save attendance records";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Get unique departments
  const departments = [
    ...new Set(employees.map((emp) => emp.department)),
  ].filter(Boolean);

  const filteredEmployees = employees.filter((employee) => {
    if (selectedFilter === "all" && selectedDepartment === "all") return true;
    if (selectedDepartment !== "all" && employee.department !== selectedDepartment)
      return false;
    if (selectedFilter === "all") return true;
    const record = attendanceRecords.find(
      (record) => record.employeeId === employee._id
    );
    return record?.status === selectedFilter;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 ml-64">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Attendance Management
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3">
                <FiCalendar className="text-blue-500 text-xl" />
                <input
                  type="date"
                  value={filterDate.toISOString().split('T')[0]}
                  onChange={handleDateChange}
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3">
                <FiFilter className="text-blue-500 text-xl" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="half-day">Half Day</option>
                  <option value="on-leave">On Leave</option>
                  <option value="not-marked">Not Marked</option>
                </select>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3">
                <FiBriefcase className="text-blue-500 text-xl" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Present</p>
                  <p className="text-2xl font-bold text-green-500">
                    {stats.present}
                  </p>
                </div>
                <FiUserCheck className="text-green-500 text-2xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Absent</p>
                  <p className="text-2xl font-bold text-red-500">
                    {stats.absent}
                  </p>
                </div>
                <FiUserX className="text-red-500 text-2xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Late</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {stats.late}
                  </p>
                </div>
                <FiClock className="text-yellow-500 text-2xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {stats.total}
                  </p>
                </div>
                <FiUserCheck className="text-blue-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => {
                  const record = attendanceRecords.find(
                    (record) => record.employeeId === employee._id
                  );
                  return (
                    <tr key={employee._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {employee.department || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={record?.status || "not-marked"}
                          onChange={(e) =>
                            handleStatusChange(employee._id, e.target.value)
                          }
                          className="text-sm border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="not-marked">Not Marked</option>
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                          <option value="half-day">Half Day</option>
                          <option value="on-leave">On Leave</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {["present", "late", "half-day"].includes(
                          record?.status || "not-marked"
                        ) && (
                          <div className="text-sm text-gray-900">
                            {record?.checkIn
                              ? new Date(record.checkIn).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                  hour12: true
                                })
                              : "Not set"}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            {saving ? (
              <LoadingSpinner small />
            ) : (
              <>
                <FiSave />
                Save Attendance
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttendanceManagement;
