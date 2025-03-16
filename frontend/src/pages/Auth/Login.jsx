import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css"; 
import InputField from "../../components/InputField"; 
import Button from "../../components/Button"; 
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";

function Login({ setUserRole }) {
  const [role, setRole] = useState("admin");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserRole(role);
    localStorage.setItem("userRole", role);
    console.log(`${role} logged in:`, identifier);

    if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/employee-dashboard");
    }
  };

  if (showSignUp) {
    return <SignUp onBack={() => setShowSignUp(false)} />;
  }

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-4" 
      style={{ backgroundImage: "url('/images/background.jpg')" }} // ✅ FIXED: Correct background path
    >  
      <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-lg"> {/* Reduced padding */}
      {/* ✅ Form is smaller */}
        {/* Logo */}
        <div className="text-center">
        <img src="/images/logo.jpg" alt="SmartHatch Logo" className="mx-auto h-16 w-16 rounded-full" />
        {/* ✅ FIXED: Correct logo path */}
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Role Selection */}
          <label className="block text-sm font-medium text-gray-600">Select Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>

          {/* Identifier Input */}
          <InputField
            label={role === "admin" ? "Email or Username" : "Email or Employee ID"}
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          {/* Password Input */}
          <InputField
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login Button */}
          <Button text="Login" className="w-full btn btn-primary rounded-md" />
        </form>

        {/* Forgot Password & Sign Up */}
        <div className="mt-3 text-center">
          <Button text="Forgot Password?" className="btn btn-link text-blue-500" onClick={() => setShowForgotPassword(true)} />
          <p className="mt-2 text-sm text-gray-600">
            Are you an Admin?{" "}
            <Button text="Sign Up" className="btn btn-link text-blue-500" onClick={() => setShowSignUp(true)} />
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
