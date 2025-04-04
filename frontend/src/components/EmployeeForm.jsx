import React, { useState } from "react";

const EmployeeForm = ({ employee, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    employee || { name: "", job: "", jobTitle: "", country: "" }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">{employee ? "Edit Employee" : "Add Employee"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Employee Name"
          className="input input-bordered w-full mb-3"
          required
        />
        <input
          type="text"
          name="job"
          value={formData.job}
          onChange={handleChange}
          placeholder="Job Role"
          className="input input-bordered w-full mb-3"
          required
        />
        <input
          type="text"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          placeholder="Job Title"
          className="input input-bordered w-full mb-3"
          required
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          className="input input-bordered w-full mb-3"
          required
        />
        <div className="flex justify-between">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
