import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SidebarEmployee from "./SidebarEmployee";

const Layout = ({ userRole, handleLogout }) => {
  const location = useLocation();
  const authPages = ["/", "/login", "/signup", "/forgot-password"];
  const hideSidebarNavbar = authPages.includes(location.pathname);

  console.log("Current Path:", location.pathname); // Debugging

  return (
    <div className="flex h-screen">
      {!hideSidebarNavbar && userRole === "admin" && <Sidebar />}
      {!hideSidebarNavbar && userRole === "employee" && <SidebarEmployee />}
      <div className="flex-1">
        {!hideSidebarNavbar && <Navbar userRole={userRole} handleLogout={handleLogout} />}
        <main className="p-6 bg-gray-100 w-full pt-14">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
