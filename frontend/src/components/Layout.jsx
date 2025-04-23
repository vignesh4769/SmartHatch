import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ userRole = "employee", handleLogout }) => {
  const { pathname } = useLocation();
  const isAuthPage = ["/", "/login", "/forgot-password"].includes(pathname);

  return (
    <div className="flex h-screen">
      {!isAuthPage && (
        <>
          <Sidebar userRole={userRole} />
          <div className="flex-1">
            <Navbar userRole={userRole} handleLogout={handleLogout} />
            <main className="p-6 bg-gray-100 w-full pt-14">
              <Outlet />
            </main>
          </div>
        </>
      )}
      
      {isAuthPage && <Outlet />}
    </div>
  );
};

export default Layout;