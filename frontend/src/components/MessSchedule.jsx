import React from "react";

const MessSchedule = () => {
  const schedule = [
    { day: "Monday", menu: "Rice, Fish Curry" },
    { day: "Tuesday", menu: "Chapati, Chicken" },
    { day: "Wednesday", menu: "Dal, Rice, Veg" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Mess Schedule</h3>
      <ul className="list-disc pl-5">
        {schedule.map((item, index) => (
          <li key={index}>
            <strong>{item.day}:</strong> {item.menu}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessSchedule;
