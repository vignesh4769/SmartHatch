import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Charts = () => {
  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Expenses",
        data: [3000, 4000, 2500, 3200],
        backgroundColor: "#FF6384",
      },
      {
        label: "Revenue",
        data: [5000, 5500, 4800, 6000],
        backgroundColor: "#36A2EB",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Expense vs Revenue</h3>
      <Bar data={data} />
    </div>
  );
};

export default Charts;
