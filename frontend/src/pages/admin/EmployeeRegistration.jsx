import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerEmployee } from "../../api/authApi";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext"; // Add this import

function EmployeeRegistration() {
  const { user } = useAuth(); // Add this line to get the user context
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    position: "",
    department: "",
    joiningDate: new Date().toISOString().split("T")[0],
    salary: "",
    hatchery: "",
    emergencyContact: {
      name: "",
      relation: "",
      phone: "",
    },
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerEmployee({
        ...formData,
        hatchery: user?.hatcheryName || "", // Use optional chaining
        joiningDate: new Date(formData.joiningDate),
      });
      navigate("/admin/dashboard", { state: { success: "Employee registered successfully" } });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to register employee");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 ml-56">
      <div className="max-w-3xl w-full bg-base-100 shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">
          Register New Employee
        </h2>
        {error && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">First Name</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Last Name</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
              minLength="8"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Phone</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Address</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Position</span>
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Position</option>
              <option value="Manager">Manager</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Worker">Worker</option>
              <option value="Technician">Technician</option>
              <option value="Accountant">Accountant</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Department</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Department</option>
              <option value="Production">Production</option>
              <option value="Quality Control">Quality Control</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Administration">Administration</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Salary</span>
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
              min="0"
            />
          </div>

          <div className="card bg-base-200 shadow-md p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Name</span>
                </label>
                <input
                  type="text"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Relation</span>
                </label>
                <input
                  type="text"
                  name="emergencyContact.relation"
                  value={formData.emergencyContact.relation}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Phone</span>
                </label>
                <input
                  type="tel"
                  name="emergencyContact.phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              type="submit"
              text="Register Employee"
              className="btn btn-primary btn-block sm:btn-wide"
            />
            <Button
              text="Cancel"
              className="btn btn-outline btn-block sm:btn-wide"
              onClick={() => navigate("/admin/dashboard")}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeRegistration;