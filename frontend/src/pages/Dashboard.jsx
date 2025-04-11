import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/authhContext";

function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

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
              to="/profile"
              className="bg-blue-100 hover:bg-blue-200 rounded-lg p-6 transition duration-300"
            >
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                My Profile
              </h2>
              <p className="text-gray-600">View and update your profile</p>
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/employees/add"
                className="bg-green-100 hover:bg-green-200 rounded-lg p-6 transition duration-300"
              >
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  Add New Employee
                </h2>
                <p className="text-gray-600">Register a new employee</p>
              </Link>
            )}
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Welcome, {user?.firstName}!
            </h2>
            <p className="text-gray-600">
              {user?.role === "admin"
                ? "You have admin privileges to manage the hatchery system."
                : "You can view your profile and update your information."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
