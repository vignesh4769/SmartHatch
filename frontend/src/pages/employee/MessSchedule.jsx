import React, { useState } from "react";
import { FaUtensils, FaStar } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import messApi from '../../api/messApi';
import { format, startOfWeek, addDays, parseISO, isSameDay } from 'date-fns';
import { toast } from 'react-toastify';
import { FiClock, FiCalendar, FiCoffee, FiSun, FiMoon, FiAlertCircle } from 'react-icons/fi';

const MessSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate week's dates starting from Monday
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Format dates for API query
  const startDate = format(weekStart, 'yyyy-MM-dd');
  const endDate = format(addDays(weekStart, 6), 'yyyy-MM-dd');

  const { data: response = { data: [] }, isLoading, error } = useQuery({
    queryKey: ['messSchedules', startDate, endDate],
    queryFn: () => messApi.getMessSchedules(startDate, endDate),
    retry: false // Don't retry on error
  });

  const schedules = response.data || [];

  // Group schedules by date and meal type
  const schedulesByDate = schedules.reduce((acc, schedule) => {
    const dateStr = format(parseISO(schedule.date), 'yyyy-MM-dd');
    if (!acc[dateStr]) {
      acc[dateStr] = {
        breakfast: null,
        lunch: null,
        dinner: null
      };
    }
    acc[dateStr][schedule.meal.toLowerCase()] = schedule;
    return acc;
  }, {});

  // Get schedules for selected date
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const todaySchedules = schedulesByDate[selectedDateStr] || {
    breakfast: null,
    lunch: null,
    dinner: null
  };

  // Get special items for today
  const specialItems = schedules
    .filter(schedule => isSameDay(parseISO(schedule.date), selectedDate))
    .flatMap(schedule => schedule.menu || [])
    .filter(item => item.category === 'special');

  // Helper function to format time
  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'hh:mm a');
  };

  // Helper function to format date
  const formatDate = (date) => {
    return format(date, 'MMM dd, yyyy');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    // Check for specific error message
    const errorMessage = error?.response?.data?.error || error.message;
    const isHatcheryError = errorMessage.includes('no hatchery assigned');

    return (
      <div className="flex-1 ml-64 p-8 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <FiAlertCircle className="text-6xl text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {isHatcheryError ? 'Hatchery Not Assigned' : 'Unable to Load Mess Schedule'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isHatcheryError 
                ? 'You have not been assigned to a hatchery yet. Please contact your administrator to get assigned to a hatchery.'
                : 'There was an error loading the mess schedule. Please try again later.'}
            </p>
            {!isHatcheryError && (
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const renderMealCard = (meal, icon, schedule) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-lg font-semibold ml-2">{meal}</h3>
      </div>
      {schedule ? (
        <div>
          <div className="mb-2 text-gray-600">
            <FiClock className="inline mr-1" />
            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
          </div>
          <div className="space-y-2">
            {schedule.menu?.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className={item.category === 'special' ? 'text-blue-600 font-medium' : ''}>
                  {item.name}
                </span>
                <span className="text-gray-500">₹{item.cost}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No schedule available</p>
      )}
    </div>
  );

  return (
    <div className="flex">
      <div className="flex-1 ml-64 p-8 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mess Schedule</h1>
              <p className="text-gray-600 mt-1">Daily meal schedule and timings</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="input input-bordered"
              />
              <div className="flex items-center gap-2">
                <FiCalendar className="text-blue-600" />
                <span className="text-gray-600 font-medium">{formatDate(selectedDate)}</span>
              </div>
            </div>
          </div>

          {/* Today's Special */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center gap-3 mb-3">
              <FaStar className="text-yellow-300" />
              <h2 className="text-xl font-semibold">Today's Special</h2>
            </div>
            {specialItems.length > 0 ? (
              <div className="space-y-2">
                {specialItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-blue-100">₹{item.cost}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-blue-100">No special items for today</p>
            )}
          </div>

          {/* Weekly Schedule */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Weekly Schedule</h2>
              <FaUtensils className="text-2xl text-blue-600" />
            </div>
            <div className="overflow-x-auto">
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
                  {weekDates.map((date) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const daySchedules = schedulesByDate[dateStr] || {
                      breakfast: null,
                      lunch: null,
                      dinner: null
                    };
                    const isSelected = dateStr === selectedDateStr;

                    return (
                      <tr 
                        key={dateStr}
                        className={`hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatDate(date)}</div>
                        </td>
                        {['breakfast', 'lunch', 'dinner'].map((meal) => (
                          <td key={meal} className="px-6 py-4">
                            {daySchedules[meal] ? (
                              <>
                                <div className="text-sm text-gray-900">
                                  <ul className="list-disc list-inside">
                                    {daySchedules[meal].menu?.map((item, i) => (
                                      <li key={i} className={item.category === 'special' ? 'text-blue-600' : ''}>
                                        {item.name}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {formatTime(daySchedules[meal].startTime)} - {formatTime(daySchedules[meal].endTime)}
                                </div>
                              </>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Today's Schedule Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderMealCard('Breakfast', <FiCoffee className="text-orange-500" />, todaySchedules.breakfast)}
            {renderMealCard('Lunch', <FiSun className="text-yellow-500" />, todaySchedules.lunch)}
            {renderMealCard('Dinner', <FiMoon className="text-indigo-500" />, todaySchedules.dinner)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessSchedule;