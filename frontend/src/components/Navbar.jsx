import React from "react";
import { Link } from "react-router-dom";

function Navbar({ userRole, handleLogout }) {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">SmartHatch</Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {userRole === "admin" ? (
            <>
              <li><Link to="/admin-dashboard">Dashboard</Link></li>
              <li><Link to="/employees">Employees</Link></li>
              <li><Link to="/visitors">Visitors</Link></li>
              <li><Link to="/mess">Mess</Link></li>
              <li><Link to="/inventory">Inventory</Link></li>
              <li><Link to="/financial">Financial</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/employee-dashboard">Dashboard</Link></li>
              <li><Link to="/attendance">Attendance</Link></li>
              <li><Link to="/leave-request">Leave</Link></li>
              <li><Link to="/mess">Mess</Link></li>
            </>
          )}
        </ul>
      </div>

      {/* ✅ Logout Button */}
      <div className="navbar-end">
        <button onClick={handleLogout} className="btn btn-error">Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
