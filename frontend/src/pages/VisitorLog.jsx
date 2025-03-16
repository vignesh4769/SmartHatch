import React, { useState } from "react";

function VisitorLog() {
  const [visitors, setVisitors] = useState([
    { id: 1, name: "Alice", checkIn: "10:00 AM", checkOut: "12:00 PM" },
  ]);

  return (
    <div className="container">
      <h2>Visitor Log</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Check-in</th>
            <th>Check-out</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((visitor) => (
            <tr key={visitor.id}>
              <td>{visitor.name}</td>
              <td>{visitor.checkIn}</td>
              <td>{visitor.checkOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VisitorLog;
