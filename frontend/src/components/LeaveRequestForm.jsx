import React, { useState } from "react";

const LeaveRequestForm = () => {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Leave Request Submitted:", { reason, date });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Request Leave</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input 
          type="date" 
          className="input input-bordered w-full"
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
        <textarea 
          className="textarea textarea-bordered w-full" 
          placeholder="Reason for Leave" 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
          required 
        />
        <button type="submit" className="btn btn-success w-full">Submit Request</button>
      </form>
    </div>
  );
};

export default LeaveRequestForm;