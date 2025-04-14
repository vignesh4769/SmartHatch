import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";

function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Welcome, {user.name} ({user.hatcheryName})
        </h2>
        <Button
          text="Logout"
          className="btn btn-secondary"
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
        />
      </div>
      <p>Employee ID: {user.employeeId}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default EmployeeDashboard;