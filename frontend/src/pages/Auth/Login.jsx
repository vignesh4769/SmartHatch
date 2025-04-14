import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/auth.css";
import Button from "../../components/common/Button";
import ForgotPassword from "./ForgotPassword";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState("employee");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const data = await login({ email, password, role: selectedRole });

      const from =
        location.state?.from?.pathname ||
        (data.role === "admin" ? "/admin/dashboard" : "/employee/dashboard");

      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    if (message) {
      setError(decodeURIComponent(message));
    }
  }, [location.search]);

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-lg">
        <h2 className="text-3xl text-grey font-bold text-center font-sans">
          SmartHatch
        </h2>

        <div className="text-center">
          <img
            src="/images/logo.jpg"
            alt="SmartHatch Logo"
            className="mx-auto h-16 w-16 rounded-full"
          />
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Login</h2>
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex justify-center space-x-4 mb-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                selectedRole === "employee"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedRole("employee")}
            >
              Employee
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                selectedRole === "admin"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedRole("admin")}
            >
              Admin
            </button>
          </div>
          <div className="form-group">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input input-bordered w-full mt-1 p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input input-bordered w-full mt-1 p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-600">
              Remember Me
            </label>
          </div>

          <Button
            type="submit"
            text="Login"
            className="w-full btn btn-primary rounded-md"
          />
          {selectedRole === "admin" && (
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Sign up here
                </button>
              </p>
            </div>
          )}
        </form>

        <div className="mt-3 text-center">
          <Button
            text="Forgot Password?"
            className="btn btn-link text-blue-500"
            onClick={() => setShowForgotPassword(true)}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;