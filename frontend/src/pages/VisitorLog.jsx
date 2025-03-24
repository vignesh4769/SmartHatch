import React, { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa"; // Import the Check-out icon from react-icons

const VisitorLog = () => {
  // State to store the visitors' data
  const [visitors, setVisitors] = useState([
    { id: 1, name: "Alice", reason: "Delivery", checkIn: "10:00 AM", checkOut: "" },
  ]);

  // State to track form visibility and input data
  const [newVisitor, setNewVisitor] = useState({
    name: "",
    reason: "",
    checkIn: "",
    checkOut: "",
  });

  const [isFormVisible, setIsFormVisible] = useState(false);

  // Handle form submission for new visitors
  const handleSubmit = (e) => {
    e.preventDefault();
    const currentTimestamp = new Date().toLocaleTimeString();
    setVisitors([
      ...visitors,
      {
        id: Date.now(), // Unique ID for each visitor
        name: newVisitor.name,
        reason: newVisitor.reason,
        checkIn: currentTimestamp,
        checkOut: "", // To be updated later
      },
    ]);
    setIsFormVisible(false); // Hide form after submission
    setNewVisitor({ name: "", reason: "", checkIn: "", checkOut: "" }); // Reset the form fields
  };

  // Handle check-out for a visitor
  const handleCheckout = (visitorId) => {
    const updatedVisitors = visitors.map((visitor) =>
      visitor.id === visitorId
        ? { ...visitor, checkOut: new Date().toLocaleTimeString() }
        : visitor
    );
    setVisitors(updatedVisitors);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 ml-32">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-center mb-4">Visitor Log</h2>

        {/* New Visitor Button */}
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-md mb-4"
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          New Visitor
        </button>

        {/* Form for New Visitor */}
        {isFormVisible && (
          <div className="mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="font-semibold">Name</label>
                <input
                  type="text"
                  placeholder="Enter visitor name"
                  className="input input-bordered w-full"
                  value={newVisitor.name}
                  onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Reason for Visit</label>
                <input
                  type="text"
                  placeholder="Enter reason"
                  className="input input-bordered w-full"
                  value={newVisitor.reason}
                  onChange={(e) => setNewVisitor({ ...newVisitor, reason: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Visitor Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Reason for Visit</th>
                <th className="border border-gray-300 px-4 py-2">Check-in</th>
                <th className="border border-gray-300 px-4 py-2">Check-out</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{visitor.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{visitor.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{visitor.reason}</td>
                  <td className="border border-gray-300 px-4 py-2">{visitor.checkIn}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {visitor.checkOut || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {visitor.checkOut === "" && (
                      <button
                        className=""
                        onClick={() => handleCheckout(visitor.id)}
                      >
                        <FaSignOutAlt className="inline mr-2" /> {/* Icon for Check-out */}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitorLog;
