import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { forgotPassword, resetPassword } from "../../api/authApi";
import "../../styles/auth.css";

function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP & Password
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setStep(2);
      setError(null);
    } catch (error) {
      setError(error.message || "Failed to send OTP");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email, otp, newPassword);
      navigate("/login");
    } catch (error) {
      setError(error.message || "Failed to reset password");
    }
  };

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
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h2>
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="space-y-2">
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

            <Button
              type="submit"
              text="Send OTP"
              className="w-full btn btn-primary rounded-md"
            />
            <Button
              text="Back to Login"
              className="w-full btn btn-link text-blue-500"
              onClick={onBack}
            />
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-2">
            <div className="form-group">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP
              </label>
              <input
                type="text"
                id="otp"
                className="input input-bordered w-full mt-1 p-2"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="input input-bordered w-full mt-1 p-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="8"
              />
            </div>

            <Button
              type="submit"
              text="Reset Password"
              className="w-full btn btn-primary rounded-md"
            />
            <Button
              text="Back"
              className="w-full btn btn-link text-blue-500"
              onClick={() => setStep(1)}
            />
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;