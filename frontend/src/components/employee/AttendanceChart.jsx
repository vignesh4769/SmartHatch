import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AttendanceChart = ({ data }) => {
  // Group data by month
  const monthlyData = data.reduce((acc, record) => {
    const month = new Date(record.date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { present: 0, absent: 0, halfDay: 0 };
    }
    if (record.status === 'present') acc[month].present++;
    else if (record.status === 'absent') acc[month].absent++;
    else if (record.status === 'half-day') acc[month].halfDay++;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Present',
        data: Object.values(monthlyData).map(m => m.present),
        backgroundColor: '#10B981',
      },
      {
        label: 'Half Day',
        data: Object.values(monthlyData).map(m => m.halfDay),
        backgroundColor: '#FBBF24',
      },
      {
        label: 'Absent',
        data: Object.values(monthlyData).map(m => m.absent),
        backgroundColor: '#EF4444',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Attendance Summary',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default AttendanceChart;