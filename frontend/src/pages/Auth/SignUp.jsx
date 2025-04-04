import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import Button from "../../components/Button";
import axios from "axios";
import { useAuth } from "../../context/authContext";

function Signup() {
  const [formData, setFormData] = useState({
    hatcheryName: "",
    caaNumber: "",
    adminName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        hatcheryName: formData.hatcheryName,
        caaNumber: formData.caaNumber,
        name: formData.adminName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        role: "admin"
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred during registration");
      }
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-3xl text-grey font-bold text-center font-sans">SmartHatch</h2>

        <div className="text-center">
          <img
            src="/images/logo.jpg"
            alt="SmartHatch Logo"
            className="mx-auto h-16 w-16 rounded-full"
          />
          <h2 className="mb-6 text-xl font-semibold text-gray-700">Admin Registration</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">Registration successful! Redirecting to login...</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hatchery Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="hatcheryName" className="block text-sm font-medium text-gray-700 mb-1">
                Hatchery Name
              </label>
              <input
                type="text"
                id="hatcheryName"
                name="hatcheryName"
                className="input input-bordered w-full p-2"
                value={formData.hatcheryName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="caaNumber" className="block text-sm font-medium text-gray-700 mb-1">
                CAA Number
              </label>
              <input
                type="text"
                id="caaNumber"
                name="caaNumber"
                className="input input-bordered w-full p-2"
                value={formData.caaNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Admin Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Name
              </label>
              <input
                type="text"
                id="adminName"
                name="adminName"
                className="input input-bordered w-full p-2"
                value={formData.adminName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="input input-bordered w-full p-2"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email Field (Full Width) */}
          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input input-bordered w-full p-2"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="input input-bordered w-full p-2"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="input input-bordered w-full p-2"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <Button 
              text="Register" 
              className="btn btn-primary rounded-md py-2 text-lg block text-center w-48 mx-auto" 
              type="submit"
            />
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button 
              onClick={() => navigate("/login")} 
              className="text-blue-500 hover:underline font-medium"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;