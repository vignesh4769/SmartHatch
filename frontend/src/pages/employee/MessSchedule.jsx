import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';

const MessSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchMessSchedule = async () => {
      try {
        const response = await axios.get('/api/employee/mess-schedule');
        setSchedule(response.data);
      } catch (err) {
        setError('Failed to fetch mess schedule');
        console.error('Error fetching mess schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessSchedule();
  }, []);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div>Loading mess schedule...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mess Schedule</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breakfast</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lunch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dinner</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedule.map((day) => (
              <tr key={day._id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {formatDate(day.date)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{day.breakfast}</div>
                  {day.breakfastNotes && (
                    <div className="text-xs text-gray-500">{day.breakfastNotes}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{day.lunch}</div>
                  {day.lunchNotes && (
                    <div className="text-xs text-gray-500">{day.lunchNotes}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{day.dinner}</div>
                  {day.dinnerNotes && (
                    <div className="text-xs text-gray-500">{day.dinnerNotes}</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-medium text-blue-800">Current Week Special</h2>
        <p className="text-sm text-blue-600 mt-1">
          {schedule[0]?.weeklySpecial || 'No special meals scheduled for this week'}
        </p>
      </div>
    </div>
  );
};

export default MessSchedule; // This is the crucial default export