import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Financial() {
  const [stats, setStats] = useState({
    earnings: 350.40,
    spending: 642.39,
    sales: 574.34,
    newTasks: 154,
    totalProjects: 2935
  });

  const lineChartData = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
      {
        label: 'Revenue',
        data: [30000, 35000, 25000, 40000, 28000, 37500],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: [25000, 32000, 21000, 35000, 22000, 32500],
        borderColor: '#60A5FA',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const barChartData = {
    labels: ['17', '18', '19', '20', '21', '22', '23', '24', '25'],
    datasets: [
      {
        label: 'Weekly Revenue',
        data: [4500, 5000, 4000, 4800, 4200, 4600, 4300, 4100, 4700],
        backgroundColor: '#4F46E5',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="ml-64 p-8"> {/* Added margin-left to account for sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">Earnings</div>
          <div className="text-2xl font-bold text-indigo-600">${stats.earnings}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">Spend this month</div>
          <div className="text-2xl font-bold text-pink-500">${stats.spending}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">Sales</div>
          <div className="text-2xl font-bold text-gray-600">${stats.sales}</div>
          <div className="text-sm text-green-500">↗ 23% since last month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">New Tasks</div>
          <div className="text-2xl font-bold">{stats.newTasks}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">Total Projects</div>
          <div className="text-2xl font-bold">{stats.totalProjects}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Overview</h2>
          <div className="h-[400px]"> {/* Fixed height container for chart */}
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Revenue</h2>
          <div className="h-[400px]"> {/* Fixed height container for chart */}
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Financial;