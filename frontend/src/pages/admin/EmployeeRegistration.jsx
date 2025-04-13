import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import employeeApi from "../../api/employeeAPI";
import { useAuth } from "../../context/AuthContext";

const departments = ["Hatchery Operations", "Maintenance", "Quality Control", "Logistics", "HR"];
const positions = ["Manager", "Supervisor", "Technician", "Operator", "Clerk"];
const genders = ["Male", "Female", "Other"];

const EmployeeRegistration = ({ onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    age: "",
    gender: "",
    address: "",
    salary: "",
    department: "",
    position: "",
    shiftTimings: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setError("Please log in to continue");
      return;
    }
    if (!user?.caaNumber?.trim() || !user?.hatcheryName?.trim()) {
      setError("Missing required admin information (CAA Number or Hatchery Name)");
      return;
    }
    setError(null);
  }, [user]);

  const validateForm = () => {
    const requiredFields = [
      'name', 'email', 'phoneNumber', 'password', 'age', 'gender',
      'address', 'salary', 'department', 'position', 'shiftTimings',
      'emergencyContactName', 'emergencyContactRelation', 'emergencyContactPhone'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (!/^\d{10,15}$/.test(formData.phoneNumber)) {
      setError("Phone number must be 10-15 digits");
      return false;
    }

    if (!/^\d{10,15}$/.test(formData.emergencyContactPhone)) {
      setError("Emergency contact phone must be 10-15 digits");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

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
    setLoading(true);

    if (!validateForm() || !formData.emergencyContact?.name) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        phone: formData.phoneNumber.trim(),
        age: parseInt(formData.age, 10),
        salary: parseFloat(formData.salary),
        emergencyContact: formData.emergencyContact?.name ? {
          name: formData.emergencyContact.name.trim(),
          phone: formData.emergencyContact.phone?.trim() || '',
          relation: formData.emergencyContact.relation?.trim() || ''
        } : null,
        caaNumber: user.caaNumber.trim(),
        hatcheryName: user.hatcheryName.trim()
      };

      await employeeApi.createEmployee(payload);
      setSubmitted(true);
      alert("Employee registered successfully!");
      if (typeof onClose === "function") {
        onClose();
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data || err);
      const errorData = err.response?.data;
      setError(
        errorData?.details || 
        errorData?.error || 
        "Registration failed: " + (err.message || 'Unknown error')
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Register New Employee</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-lg"
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="border p-2 rounded" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
          <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="border p-2 rounded" />
          <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="border p-2 rounded" />
          <input name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="border p-2 rounded" />

          <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Gender</option>
            {genders.map(g => <option key={g} value={g}>{g}</option>)}
          </select>

          <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="border p-2 rounded" />
          <input name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary" className="border p-2 rounded" />

          <select name="department" value={formData.department} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Department</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select name="position" value={formData.position} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Position</option>
            {positions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <input name="shiftTimings" value={formData.shiftTimings} onChange={handleChange} placeholder="Shift Timings (e.g. 9AM - 5PM)" className="border p-2 rounded" />

          <input name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} placeholder="Emergency Contact Name" className="border p-2 rounded" />
          <input name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleChange} placeholder="Emergency Contact Relation" className="border p-2 rounded" />
          <input name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} placeholder="Emergency Contact Phone" className="border p-2 rounded" />

          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>
              {loading ? "Registering..." : "Register Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EmployeeRegistration.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default EmployeeRegistration;