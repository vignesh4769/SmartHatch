import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminRegister = () => {
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hatcheryName: "",
    caaNumber: "",
    hatcheryAddress: "",
    hatcheryPhone: "",
    hatcheryEmail: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const response = await registerAdmin({
      hatcheryName: formData.hatcheryName,
      caaNumber: formData.caaNumber,
      hatcheryAddress: formData.hatcheryAddress,
      hatcheryPhone: formData.hatcheryPhone,
      hatcheryEmail: formData.hatcheryEmail,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    if (response.success) {
      navigate("/verify-email", { state: { email: formData.email } });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Admin Registration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hatchery Information */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Hatchery Name</label>
          <input
            type="text"
            name="hatcheryName"
            value={formData.hatcheryName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Other fields similarly */}

        <div className="space-y-2">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Register Admin
        </button>
      </form>
    </div>
  );
};

export default AdminRegister;
