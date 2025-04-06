import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import Button from "../../components/common/Button";
import axios from "axios";

function ForgotPassword({ onBack }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      if (response.data.success) {
        setSuccess("OTP sent to your email");
        setError("");
        setStep(2);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to send OTP");
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      if (response.data.success) {
        setSuccess("OTP verified");
        setError("");
        setStep(3);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Invalid OTP");
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );
      if (response.data.success) {
        setSuccess("Password reset successfully");
        setError("");
        setTimeout(() => {
          onBack();
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to reset password");
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-700">
          Forgot Password
        </h2>

        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {success && (
          <div className="mb-4 text-green-500 text-center">{success}</div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="form-group">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter Your Email
              </label>
              <input
                type="email"
                id="email"
                className="input input-bordered w-full p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              text={isLoading ? "Sending..." : "Send OTP"}
              className="w-full btn btn-info rounded-md"
              disabled={isLoading}
            />
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="form-group">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter 4-digit OTP
              </label>
              <input
                type="text"
                id="otp"
                className="input input-bordered w-full p-2"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="4"
                pattern="\d{4}"
                required
              />
            </div>
            <Button
              text={isLoading ? "Verifying..." : "Verify OTP"}
              className="w-full btn btn-success rounded-md"
              disabled={isLoading}
            />
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="form-group">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="input input-bordered w-full p-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="input input-bordered w-full p-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              text={isLoading ? "Resetting..." : "Reset Password"}
              className="w-full btn btn-primary rounded-md"
              disabled={isLoading}
            />
          </form>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={onBack}
            className="text-blue-500 hover:underline hover:underline-offset-4 font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
