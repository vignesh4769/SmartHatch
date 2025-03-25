import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/SignUp";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import AdminDashboard from "../pages/AdminDashboard";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import AttendancePage from "../pages/AttendancePage";
import EmployeeManagement from "../pages/EmployeeManagement";
import Layout from "../components/Layout";
import VisitorLog from "../pages/VisitorLog";
import RunManagement from "../pages/RunManagement"; 
import InventoryManagement from "../pages/InventoryManagement";
const AppRoutes = ({ userRole, setUserRole, handleLogout }) => {
  return (
    <Routes>
      {/* Auth Pages */}
      <Route path="/" element={<Login setUserRole={setUserRole} />} />
      <Route path="/login" element={<Login setUserRole={setUserRole} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Pages with Layout */}
      {userRole && (
        <Route element={<Layout userRole={userRole} handleLogout={handleLogout} />}>
          {userRole === "admin" ? (
            <>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/employees" element={<EmployeeManagement />} />
              <Route path="/run-management" element={<RunManagement />} /> 
              <Route path="/visitor-log" element={<VisitorLog />} /> 
              <Route path="/inventory" element={<InventoryManagement />} />
              <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
            </>
          ) : userRole === "employee" ? (
            <>
              <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
              <Route path="*" element={<Navigate to="/employee-dashboard" replace />} />
            </>
          ) : null}
        </Route>
      )}

      {/* Redirect to login if no user role */}
      {!userRole && <Route path="*" element={<Navigate to="/login" replace />} />}
    </Routes>
  );
};

export default AppRoutes;
