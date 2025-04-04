import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import Button from "../../components/Button";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({
    hatcheryName: "",
    caaNumber: "",
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [step, setStep] = useState(1); // 1: Signup, 2: Verify OTP
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        hatcheryName: formData.hatcheryName,
        caaNumber: formData.caaNumber,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        setSuccess(true);
        setStep(2);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-email", {
        email: formData.email,
        otp
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cover bg-center px-4"
        style={{ backgroundImage: "url('/images/background.jpg')" }}>
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
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hatchery Name
                </label>
                <input
                  type="text"
                  name="hatcheryName"
                  className="input input-bordered w-full p-2"
                  value={formData.hatcheryName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CAA Number
                </label>
                <input
                  type="text"
                  name="caaNumber"
                  className="input input-bordered w-full p-2"
                  value={formData.caaNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered w-full p-2"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="input input-bordered w-full p-2"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full p-2"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="input input-bordered w-full p-2"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
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
                text={loading ? "Registering..." : "Register"} 
                className="w-full btn btn-primary rounded-md py-2 text-lg" 
                type="submit"
                disabled={loading}
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/images/background.jpg')" }}>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-3xl text-grey font-bold text-center font-sans">SmartHatch</h2>
        <div className="text-center">
          <h2 className="mb-6 text-xl font-semibold text-gray-700">Verify Your Email</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">OTP sent to {formData.email}</p>}
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter 4-digit OTP sent to {formData.email}
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input input-bordered w-full p-2"
              maxLength="4"
              pattern="\d{4}"
              required
            />
          </div>
          <Button 
            text={loading ? "Verifying..." : "Verify OTP"} 
            className="w-full btn btn-primary rounded-md py-2 text-lg" 
            type="submit"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}

export default Signup;