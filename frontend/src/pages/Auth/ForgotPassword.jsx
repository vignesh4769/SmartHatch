import React, { useState } from "react";
import "../../styles/auth.css";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

function ForgotPassword({ onBack }) {
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP, Step 3: Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Function to generate OTP (Simulating Backend)
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const otpCode = generateOtp();
    setGeneratedOtp(otpCode);
    console.log(`OTP sent to ${email}:`, otpCode); // Simulating email sending
    setStep(2); // Move to OTP verification step
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (parseInt(otp) === generatedOtp) {
      console.log("OTP Verified!");
      setStep(3); // Move to Reset Password step
    } else {
      alert("Invalid OTP! Please try again.");
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password reset successful for:", email);
    alert("Password has been reset successfully. Please login with your new password.");
    setStep(1); // Reset to login step
    setEmail("");
    setNewPassword("");
    setConfirmPassword("");
    onBack(); // Redirect back to login
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center px-4"
    style={{ backgroundImage: "url('/images/pexels-jplenio-1103970.jpg')" }}>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-700">Forgot Password</h2>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <InputField label="Enter Your Email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button text="Send OTP" className="w-full btn btn-info rounded-md" />
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-3">
            <InputField label="Enter OTP" type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <Button text="Verify OTP" className="w-full btn btn-success rounded-md" />
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordReset} className="space-y-3">
            <InputField label="New Password" type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <InputField label="Confirm Password" type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <Button text="Reset Password" className="w-full btn btn-primary rounded-md" />
          </form>
        )}

        <div className="mt-4 text-center">
          <Button text="Back to Login" className="btn btn-link text-blue-500" onClick={onBack} />
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
