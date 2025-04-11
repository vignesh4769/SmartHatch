import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EmployeeVerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });

      toast.success("Email verified successfully!");
      navigate("/admin/dashboard"); // Redirect to employee dashboard
    } catch (error) {
      console.error("OTP Verification Error:", error);
      toast.error(error?.response?.data?.error || "OTP verification failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="w-full max-w-md p-8 shadow-xl bg-base-100 rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Verify Employee Email</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input input-bordered"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeVerifyOTP;
