import React, { useState } from "react";
import "../../styles/auth.css";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

function SignUp({ onBack }) {
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvv, setCvv] = useState("");
  const [hatcheryEmail, setHatcheryEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin Sign-Up submitted:", {
      profileImage,
      username,
      email,
      phone,
      cvv,
      hatcheryEmail,
      password,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center px-4"
    style={{ backgroundImage: "url('/images/background.jpg')" }}>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-700">Admin Sign Up</h2>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Profile Image Upload */}
          <img src="/images/logo.jpg" alt="SmartHatch Logo" className="mx-auto h-16 w-16 rounded-full" />

          {/* Username */}
          <InputField label="Username" type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

          {/* Email */}
          <InputField label="Admin Email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          {/* Phone Number */}
          <InputField label="Phone Number" type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

          {/* CVV Number */}
          <InputField label="CVV Number (Hatchery)" type="text" id="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} />

          {/* Hatchery Email */}
          <InputField label="Hatchery Email" type="email" id="hatcheryEmail" value={hatcheryEmail} onChange={(e) => setHatcheryEmail(e.target.value)} />

          {/* Password */}
          <InputField label="Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-600">Profile Image</label>
            <input 
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* Sign Up Button */}
          <Button text="Sign Up as Admin" className="w-full btn btn-success rounded-md" />
        </form>

        {/* Back Button */}
        <div className="mt-4 text-center">
          <Button text="Back to Login" className="btn btn-link text-blue-500" onClick={onBack} />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
