import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import PrivateRoute from "./PrivateRoute";

// Lazy-loaded components for better performance
const Login = React.lazy(() => import("../pages/Auth/Login"));
const Signup = React.lazy(() => import("../pages/Auth/SignUp"));
const ForgotPassword = React.lazy(() => import("../pages/Auth/ForgotPassword"));

// Admin Pages
const AdminDashboard = React.lazy(() => import("../pages/admin/AdminDashboard"));
const EmployeeManagement = React.lazy(() => import("../pages/admin/EmployeeManagement"));
const AttendanceManagement = React.lazy(() => import("../pages/admin/AttendanceManagement"));
const EmployeeAttendance = React.lazy(() => import("../pages/admin/EmployeeAttendance"));
const LeaveApproval = React.lazy(() => import("../pages/admin/LeaveApproval"));
const InventoryManagement = React.lazy(() => import("../pages/admin/InventoryManagement"));
const FinancialDashboard = React.lazy(() => import("../pages/admin/FinancialDashboard"));
const MessManagement = React.lazy(() => import("../pages/admin/MessManagement"));
const EmployeeRegistration = React.lazy(() => import("../pages/admin/EmployeeRegistration"));
const EditEmployee = React.lazy(() => import("../pages/admin/EditEmployee"));
const VisitorLog = React.lazy(() => import("../pages/admin/VisitorLog"));

// Employee Pages
const EmployeeDashboard = React.lazy(() => import("../pages/employee/EmployeeDashboard"));
const MyAttendance = React.lazy(() => import("../pages/employee/MyAttendance"));
const MyLeaves = React.lazy(() => import("../pages/employee/MyLeaves"));
const MySalary = React.lazy(() => import("../pages/employee/MySalary"));
const StockRequests = React.lazy(() => import("../pages/employee/StockRequests"));
const MessSchedule = React.lazy(() => import("../pages/employee/MessSchedule"));
const LeaveApplication = React.lazy(() => import("../pages/employee/LeaveApplication"));

// Shared Pages
const Profile = React.lazy(() => import("../pages/shared/Profile"));
const Settings = React.lazy(() => import("../pages/shared/Settings"));
const NotFound = React.lazy(() => import("../pages/shared/NotFound"));

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const renderProtectedRoutes = () => (
    <Route element={<Layout userRole={user.role} />}>
      {/* Admin Routes */}
      {user.role === "admin" && (
        <>
          <Route
            path="/admin/dashboard"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <EmployeeManagement />
              </Suspense>
            }
          />
          <Route
            path="/admin/employees/new"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <EmployeeRegistration />
              </Suspense>
            }
          />
          <Route
            path="/admin/employees/:id/edit"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <EditEmployee />
              </Suspense>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AttendanceManagement />
              </Suspense>
            }
          />
          <Route
            path="/admin/EmployeeAttendance"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <EmployeeAttendance />
              </Suspense>
            }
          />
          <Route
            path="/admin/employees/register"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <EmployeeRegistration />
              </Suspense>
            }
          />
          <Route
            path="/admin/leaves"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <LeaveApproval />
              </Suspense>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <InventoryManagement />
              </Suspense>
            }
          />
          <Route
            path="/admin/financial"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <FinancialDashboard />
              </Suspense>
            }
          />
          <Route
            path="/admin/mess"
            element={
              <PrivateRoute requiredRole="admin">
                <Suspense fallback={<LoadingSpinner />}>
                  <MessManagement />
                </Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/visitors"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <VisitorLog />
              </Suspense>
            }
          />
        </>
      )}

      {/* Employee Routes */}
      {user.role === "employee" && (
        <>
          <Route
            path="/employee/dashboard"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <EmployeeDashboard />
              </Suspense>
            }
          />
          <Route
            path="/employee/attendance"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <MyAttendance />
              </Suspense>
            }
          />
          <Route
            path="/employee/leaves"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <MyLeaves />
              </Suspense>
            }
          />
          <Route
            path="/employee/leave-application"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <LeaveApplication />
              </Suspense>
            }
          />
          <Route
            path="/employee/salary"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <MySalary />
              </Suspense>
            }
          />
          <Route
            path="/employee/stock-requests"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <StockRequests />
              </Suspense>
            }
          />
          <Route
            path="/employee/mess-schedule"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <MessSchedule />
              </Suspense>
            }
          />
        </>
      )}

      {/* Shared Routes */}
      <Route
        path="/attendance"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            {user.role === "admin" ? (
              <Navigate to="/admin/attendance" replace />
            ) : (
              <MyAttendance />
            )}
          </Suspense>
        }
      />
      <Route
        path="/profile"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Profile />
          </Suspense>
        }
      />
      <Route
        path="/settings"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Settings />
          </Suspense>
        }
      />
    </Route>
  );

  return (
    <Routes>
      {/* Default Route */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate
              to={
                user.role === "admin"
                  ? "/admin/dashboard"
                  : "/employee/dashboard"
              }
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/signup"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Signup />
          </Suspense>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <ForgotPassword />
          </Suspense>
        }
      />

      {/* Protected Routes */}
      {user ? (
        renderProtectedRoutes()
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}

      {/* Not Found Route */}
      <Route
        path="*"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default AppRoutes;