import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AttendancePage from "./pages/AttendancePage";
import EmployeeManagement from "./pages/EmployeeManagement";
import Layout from "./components/Layout"; 

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem("userRole", userRole);
    } else {
      localStorage.removeItem("userRole");
    }
  }, [userRole]);

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem("userRole");
  };

  return (
    <Router>
      <Routes>
        {/* Auth Pages */}
        <Route path="/" element={<Login setUserRole={setUserRole} />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Pages (Admin) */}
        {userRole === "admin" && (
          <Route element={<Layout userRole={userRole} handleLogout={handleLogout} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/employees" element={<EmployeeManagement />} />
            <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
          </Route>
        )}

        {/* Protected Pages (Employee) */}
        {userRole === "employee" && (
          <Route element={<Layout userRole={userRole} handleLogout={handleLogout} />}>
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="*" element={<Navigate to="/employee-dashboard" replace />} />
          </Route>
        )}

        {/* Redirect to login if no user role */}
        {!userRole && <Route path="*" element={<Navigate to="/" replace />} />}
      </Routes>
    </Router>
  );
}

export default App;
