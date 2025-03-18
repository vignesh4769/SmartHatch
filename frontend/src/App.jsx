import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AttendancePage from "./pages/AttendancePage";
import EmployeeManagement from "./pages/EmployeeManagement";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import SidebarEmployee from "./components/SidebarEmployee";

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
      <AppContent userRole={userRole} setUserRole={setUserRole} handleLogout={handleLogout} />
    </Router>
  );
}

function AppContent({ userRole, setUserRole, handleLogout }) {
  const location = useLocation();
  
  // ✅ Hide Navbar on Login, Signup, Forgot Password Pages
  const hideNavbar = ["/", "/login", "/signup", "/forgot-password"].includes(location.pathname);

  return (
    <div className="flex">
      {/* ✅ Show Sidebar only for logged-in users */}
      {userRole === "admin" && <Sidebar />}
      {userRole === "employee" && <SidebarEmployee />}

      <div className="flex-1">
        {/* ✅ Only show Navbar when NOT on login/signup pages */}
        {!hideNavbar && <Navbar userRole={userRole} handleLogout={handleLogout} />}

        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/" element={<Login setUserRole={setUserRole} />} />
          <Route path="/login" element={<Login setUserRole={setUserRole} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ✅ Admin Routes */}
          {userRole === "admin" && (
            <>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/employees" element={<EmployeeManagement />} />
              <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
            </>
          )}

          {/* ✅ Employee Routes */}
          {userRole === "employee" && (
            <>
              <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
              <Route path="*" element={<Navigate to="/employee-dashboard" replace />} />
            </>
          )}

          {/* ✅ Redirect Unauthorized Users */}
          {!userRole && <Route path="*" element={<Navigate to="/" replace />} />}
        </Routes>
      </div>
    </div>
  );
}

export default App;
