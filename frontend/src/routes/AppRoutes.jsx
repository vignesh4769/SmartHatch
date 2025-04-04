import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import AdminDashboard from "../pages/AdminDashboard";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import AttendancePage from "../pages/AttendancePage";
import EmployeeManagement from "../pages/EmployeeManagement";
import Layout from "../components/Layout";
import VisitorLog from "../pages/VisitorLog";
import RunManagement from "../pages/RunManagement";
import InventoryManagement from "../pages/InventoryManagement";
import EmployeeRegistration from "../pages/EmployeeRegistration";
import LoadingSpinner from "../components/LoadingSpinner";
import MessManagement from "../pages/MessManagement";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            user.role === "admin" ? (
              <Navigate to="/admin-dashboard" replace />
            ) : (
              <Navigate to="/employee-dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {user ? (
        <Route element={<Layout userRole={user?.role} />}>
          {user.role === "admin" && (
            <>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/employees" element={<EmployeeManagement />} />
              <Route path="/run-management" element={<RunManagement />} />
              <Route path="/visitor" element={<VisitorLog />} />
              <Route path="/inventory-management" element={<InventoryManagement />} />
              <Route path="/register" element={<EmployeeRegistration />} />
              <Route path="/mess-management" element={<MessManagement />} />
            </>
          )}

          {user.role === "employee" && (
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          )}

          <Route
            path="*"
            element={
              user.role === "admin" ? (
                <Navigate to="/admin-dashboard" replace />
              ) : (
                <Navigate to="/employee-dashboard" replace />
              )
            }
          />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};

export default AppRoutes;