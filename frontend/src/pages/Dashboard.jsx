import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import DashboardStats from "../components/shared/DashboardStats";
import dashboardService from "../api/dashboardService";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data =
          user?.role === "admin"
            ? await dashboardService.getAdminDashboard()
            : await dashboardService.getUserDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.role]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStats
                  title="Total Attendance"
                  value={dashboardData?.stats?.attendance || 0}
                  icon="attendance"
                  link="/attendance"
                />
                <DashboardStats
                  title="Leave Balance"
                  value={dashboardData?.stats?.leaveBalance || 0}
                  icon="leave"
                  link="/leaves"
                />
                <DashboardStats
                  title="Mess Schedule"
                  value={dashboardData?.stats?.messSchedule || "View"}
                  icon="calendar"
                  link="/mess"
                />
                <DashboardStats
                  title="Inventory Items"
                  value={dashboardData?.stats?.inventoryCount || 0}
                  icon="inventory"
                  link="/inventory"
                />
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user?.role === "admin" && (
                <Link
                  to="/employees"
                  className="bg-indigo-100 hover:bg-indigo-200 rounded-lg p-6 transition duration-300"
                >
                  <h2 className="text-xl font-semibold text-indigo-800 mb-2">
                    Employee Management
                  </h2>
                  <p className="text-gray-600">View and manage all employees</p>
                </Link>
              )}

              <Link
                to="/attendance"
                className="bg-red-100 hover:bg-red-200 rounded-lg p-6 transition duration-300"
              >
                <h2 className="text-xl font-semibold text-red-800 mb-2">
                  Mark Your Attendance
                </h2>
                <p className="text-gray-600">Record your attendance for today</p>
              </Link>

              <Link
                to="/mess"
                className="bg-blue-100 hover:bg-blue-200 rounded-lg p-6 transition duration-300"
              >
                <h2 className="text-xl font-semibold text-blue-800 mb-2">
                  Mess Management
                </h2>
                <p className="text-gray-600">View and manage mess schedules</p>
              </Link>

              <Link
                to="/visitors"
                className="bg-green-100 hover:bg-green-200 rounded-lg p-6 transition duration-300"
              >
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  Visitor Log
                </h2>
                <p className="text-gray-600">Track visitor entries and exits</p>
              </Link>

              <Link
                to="/inventory"
                className="bg-yellow-100 hover:bg-yellow-200 rounded-lg p-6 transition duration-300"
              >
                <h2 className="text-xl font-semibold text-yellow-800 mb-2">
                  Inventory
                </h2>
                <p className="text-gray-600">Manage stock and supplies</p>
              </Link>

              <Link
                to="/profile"
                className="bg-purple-100 hover:bg-purple-200 rounded-lg p-6 transition duration-300"
              >
                <h2 className="text-xl font-semibold text-purple-800 mb-2">
                  My Profile
                </h2>
                <p className="text-gray-600">View and update your profile</p>
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/employees/add"
                  className="bg-pink-100 hover:bg-pink-200 rounded-lg p-6 transition duration-300"
                >
                  <h2 className="text-xl font-semibold text-pink-800 mb-2">
                    Add New Employee
                  </h2>
                  <p className="text-gray-600">Register a new employee</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
