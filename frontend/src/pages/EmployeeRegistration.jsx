import React, { useState } from "react";

const EmployeeRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phoneNumber: "",
    additionalPhoneNumber: "",
    address: "",
    verification: false,
    image: "",
    salary: "",
    workingShift: "",
    role: "",
    shiftTimings: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Register New Employee</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" className="input input-bordered w-full mb-3" required onChange={handleChange} />
          <input type="number" name="age" placeholder="Age" className="input input-bordered w-full mb-3" required onChange={handleChange} />
          <select name="gender" className="select select-bordered w-full mb-3" required onChange={handleChange}>
            <option disabled selected>Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input type="email" name="email" placeholder="Email" className="input input-bordered w-full mb-3" required onChange={handleChange} />
          <input type="tel" name="phoneNumber" placeholder="Phone Number" className="input input-bordered w-full mb-3" required onChange={handleChange} />
          <input type="tel" name="additionalPhoneNumber" placeholder="Additional Phone Number (Optional)" className="input input-bordered w-full mb-3" onChange={handleChange} />
          <input type="text" name="address" placeholder="Address" className="input input-bordered w-full mb-3" required onChange={handleChange} />
          <input type="file" name="image" className="file-input file-input-bordered w-full mb-3" required onChange={handleFileChange} />
          <input type="text" name="salary" placeholder="Salary" className="input input-bordered w-full mb-3" required onChange={handleChange} />
          
          <select name="workingShift" className="select select-neutral w-full mb-3" required onChange={handleChange}>
            <option disabled selected>Working Shift</option>
            <option>Day Shift</option>
            <option>Night Shift</option>
            <option>Flexible</option>
          </select>

          <select name="role" className="select select-neutral w-full mb-3" required onChange={handleChange}>
            <option disabled selected>Role</option>
            <option>Manager</option>
            <option>Developer</option>
            <option>HR</option>
            <option>Accountant</option>
          </select>

          <input type="text" name="shiftTimings" placeholder="Shift Timings" className="input input-bordered w-full mb-3" required onChange={handleChange} />
          
          <button type="submit" className="btn btn-primary w-full">Register</button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeRegistration;
