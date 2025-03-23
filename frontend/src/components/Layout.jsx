import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SidebarEmployee from "./SidebarEmployee";

const Layout = ({ userRole, handleLogout }) => {
  const location = useLocation();
  const authPages = ["/", "/login", "/signup", "/forgot-password"];
  const hideSidebarNavbar = authPages.includes(location.pathname);

  return (
    <div className="flex">
      {/* Show sidebar only for logged-in users */}
      {!hideSidebarNavbar && userRole === "admin" && <Sidebar />}
      {!hideSidebarNavbar && userRole === "employee" && <SidebarEmployee />}

      <div className="flex-1">
        {/* Show navbar only for logged-in users */}
        {!hideSidebarNavbar && <Navbar userRole={userRole} handleLogout={handleLogout} />}

        {/* Main Content with padding to prevent navbar overlap */}
        <main className="p-6 bg-gray-100 w-full pt-14">
          <Outlet /> {/* This will render the child components */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
