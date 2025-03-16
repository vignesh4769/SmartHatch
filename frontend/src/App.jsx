import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Navbar from "./components/Navbar";

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
      {/* ✅ Ensure Navbar is always displayed after login */}
      {userRole && <Navbar userRole={userRole} handleLogout={handleLogout} />}
      
      <Routes>
        <Route path="/" element={<Login setUserRole={setUserRole} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ✅ Role-based navigation */}
        {userRole === "admin" ? (
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        ) : userRole === "employee" ? (
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
